const Joi      = require('joi'),
      Boom     = require('boom'),
      Activity = require('../models/activity').Activity

exports.getAll = {
  handler: (request, reply) => {
    Activity.find({}, (err, activities) => {
      if (!err) {
        reply(activities);
      } else {
        reply(Boom.badImplementation(err));// 500 error
      }
    });
  }
};

exports.getOne = {
  handler: (request, reply) => {
    Activity.findOne({
      '_id': request.params.activityId
    }, (err, activity) => {
      if (!err) {
        reply(activity);
      } else {
        reply(Boom.notFound(err)); // 500 error
      }
    });
  }
};

exports.create = {
  validate: {
    payload: {
      description: Joi.string().required(),
      locationId: Joi.string().required(),
      listId: Joi.string().required()
    }
  },
  handler: function(request, reply) {
    var activity = new Activity(request.payload);
    activity.save(function(err, user) {
      if (!err) {
        reply(activity).created('/activity/' + activity._id); // HTTP 201
      } else {
        if (11000 === err.code || 11001 === err.code) {
          reply(Boom.forbidden("please provide another activity id, it already exist"));
        } else reply(Boom.forbidden(err)); // HTTP 403
      }
    });
  }
};

exports.update = {
  validate: {
    payload: {
      description: Joi.string().required()
    }
  },

  handler: function(request, reply) {
    Activity.findOne({
      '_id': request.params.activityId
    }, function(err, activity) {
      if (!err) {
        activity.description = request.payload.description;
        activity.save(function(err, activity) {
          if (!err) {
            reply(activity); // HTTP 201
          } else {
            if (11000 === err.code || 11001 === err.code) {
              reply(Boom.forbidden("please provide another user id, it already exist"));
            } else reply(Boom.forbidden(err)); // HTTP 403
          }
        });
      } else {
        reply(Boom.badImplementation(err)); // 500 error
      }
    });
  }
};

exports.remove = {
  handler: function(request, reply) {
    Activity.findOne({
      '_id': request.params.activityId
    }, function(err, activity) {
      if (!err && activity) {
        activity.remove();
        reply({
            message: "Activity deleted successfully"
        });
      } else if (!err) {
        // Couldn't find the object.
        reply(Boom.notFound());
      } else {
        reply(Boom.badRequest("Could not delete Activity"));
      }
    });
  }
};