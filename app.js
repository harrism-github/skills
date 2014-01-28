/**
 * Module dependencies
 */
var woodruff = require("woodruff");
var themeEngage = require("theme-engage");

/**
 * Expose the app
 */
var app = module.exports = woodruff(__dirname, themeEngage, {proxyUser: true});
