var should = require("should");
var request = require('supertest');

var app = require("../../app.js");

describe('GET /', function(){
  it('should respond with 200 OK', function (done) {
    request(app)
      .get('/')
      .expect(200, done);
  });
});
