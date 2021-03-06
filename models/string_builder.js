'use strict'

const keystone = require('keystone')
const Types    = keystone.Field.Types
const R        = require('ramda')

const StringBuilder = new keystone.List('StringBuilder', {
  searchFields: 'user last_location',
  defaultColumns: 'name, last_location, user, activity_type, createdAt',
  defaultSort: '-createdAt',
  track: true
})

StringBuilder.add({
  user: { type: Types.Relationship, ref: 'User', required: true, initial: true },
  rejected_locations: { type: Types.Relationship, ref: 'Location', many: true, initial: true },
  rejected_activities: { type: Types.Relationship, ref: 'Activity', many: true },
  party_type: {
    type: Types.Select, options: 'solo, date, friends, family', initial: true,
    label: 'Current Activity Category'
  },
  last_location: {
    type: Types.Relationship, ref: 'Location', initial: true,
    label: 'Last Suggested Location'
  },
  last_activity: {
    type: Types.Relationship, ref: 'Activity', initial: true,
    label: 'Last Suggested Activity', noedit: true
  },
  activity_type: {
    type: Types.Select, options: 'eat, drink, see, do', initial: true,
    label: 'Current Activity Category'
  },
  activity_list: { type: Types.Relationship, ref: 'ActivityList', initial: true },
  finishedAt: { type: Types.Datetime }
})

StringBuilder.schema.methods.rejectLocations = function(location_ids) {
  const isAvail = (val) => !R.isNil(val)
  this.rejected_locations = R.uniq(R.filter(isAvail, this.rejected_locations).concat(location_ids))
  return this.save().then(() => this)
}

StringBuilder.schema.methods.rejectActivity = function(activity_id) {
  return StringBuilder.model.findOneAndUpdate({_id: this.id}, {
    $addToSet: { rejected_activities: activity_id}
  }, {new: true})
}

StringBuilder.register()
module.exports = StringBuilder
