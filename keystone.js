'use strict'

// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
const Path = require('path')
if (process.env.NODE_ENV != 'production') {
  require('dotenv').load({path: Path.join(__dirname, '.env')})
}

// Require keystone
const keystone = require('keystone')
const mongoose = require('mongoose')

// Initialise Keystone with your project's configuration.
// See http://keystonejs.com/guide/config for available options
// and documentation.

keystone.init({

  'name': 'String API',
  'brand': 'String API',

  'stylus': 'public',
  'static': 'public',
  'favicon': 'public/favicon.ico',
  'views': 'templates/views',
  'view engine': 'pug',

  'auto update': true,
  'session': true,
  'session store': 'mongo',
  'auth': true,
  'user model': 'User',
  'google server api key': process.env.GOOGLE_API_KEY,
  'google api key': process.env.GOOGLE_API_KEY,
  'mongoose': mongoose

})

// Set mongoose to use native promises
keystone.get('mongoose').Promise = global.Promise

keystone.set('cloudinary config', {
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
})

// Load your project's Models
keystone.import('models')

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js

keystone.set('locals', {
  _: require('underscore'),
  env: keystone.get('env'),
  utils: keystone.utils,
  editable: keystone.content.editable
})

// Load your project's Routes

keystone.set('routes', require('./routes'))

// Configure the navigation bar in Keystone's Admin UI

keystone.set('nav', {
  'users': 'User',
  'activities': 'Activity',
  'locations': 'Location',
  'Activity Lists': 'ActivityList',
  'Completions': 'ActivityCompletion',
  'String Builders': 'StringBuilder',
  'Taggers': 'Tagger'
})

module.exports = keystone
// Start Keystone to connect to your database and initialise the web server

// keystone.start();
