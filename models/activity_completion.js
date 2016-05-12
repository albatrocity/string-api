'use strict'

const keystone = require('keystone');
const Types = keystone.Field.Types;
const ActivityCompletion = new keystone.List('ActivityCompletion', {
  defaultColumns: 'user, activity, createdAt'
});

ActivityCompletion.add({
  activity:      {
    type: Types.Relationship, ref: 'Activity', required: true, initial: true
  },
  user:          {
    type: Types.Relationship, ref: 'User', required: true, initial: true
  },
  location:      { type: Types.Relationship, ref: 'Location'},
  createdAt:     { type: Date, required: true, default: Date.now, initial: true },
  description:   { type: String, initial: true }
})

ActivityCompletion.schema.pre("save", function(next) {
  ActivityCompletion.model.findOne({
    user : this.user, activity: this.activity
  }, 'activity', (err, results) => {
    if(err) {
      next(err);
    } else if(results) {
      this.invalidate("_activity", "You have already completed this activity");
      next(new Error("You have already completed this activity"));
    } else {
      keystone.list('Activity').model.findById(this.activity, (err, activity) => {
        if (err) {return next(new Error(err))}
        if (!activity) {
          this.invalidate("Activity does not exist")
          return next()
        }
        activity.changeCompletedCount(1)
      })
      next();
    }
  });
});

ActivityCompletion.schema.pre("remove", function(next) {
  keystone.list('Activity').model.findById(this.activity, (err, activity) => {
    activity.changeCompletedCount(-1)
  })
  next()
})

ActivityCompletion.schema.virtual('activity_list').get(function() {
  return this.activity.activity_list
});

// ActivityCompletion.schema.virtual('activity_list.name').get(function() {
//   return this.activity.activity_list
// });

ActivityCompletion.register()
module.exports = ActivityCompletion
