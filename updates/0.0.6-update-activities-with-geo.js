
const keystone = require('keystone'),
  async = require('async')

function copyLocationData(activity, done) {
  console.log(`start copy on ${activity._id}`)
  return keystone.list('Location').model.findOne({_id: activity.location}).then((loc) => {
    console.log(loc)
    if (!loc || !loc.info.geo) { return Promise.resolve(activity) }
    activity.geo = loc.info.geo
    console.log('location geo:', loc.info.geo)
    return keystone.list('Activity').model.findOneAndUpdate(
      {_id: activity._id},
      {geo: loc.info.geo},
      {new: true}
    )
  }).then((activity) => {
    console.log(`saved activity ${activity._id} with geo ${JSON.stringify(activity.geo)}`)
    return done()
  }).catch((err) => {
    console.log('UPDATE FAILED')
    console.log(err)
    return done()
  })
}

exports = module.exports = function(done) {
  keystone.list('Activity').model.where({'geo': null}).exec((err, results) => {
    async.forEach(results, copyLocationData, done)
  })
}
