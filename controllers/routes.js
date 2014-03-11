module.exports = function(app) {

 var skillsLayout = {
    layout: "layout/layout-skills"
  };

  /**
   * Setup the HTTP server websockets definitions for Javascript Web Sockets page
   */
  app.on("ready", function(server) {
    var io = require('socket.io').listen(server);

    io.sockets.on('connection', function(socket) {
      console.log('server-side connection succeeded.');
      socket.emit('bcst-msg', { 'cmd': 'init', 'msg':'welcome to news service.' });
      socket.broadcast.emit('bcst-msg', { 'cmd': 'init', 'msg':'new reporter connected.' });
      socket.on('report', function (data) {
        console.log("Reporter news received:",data);
        io.sockets.emit('bcst-msg',{'cmd': 'news', 'msg': data});
      });

      socket.on('disconnect', function(socket) {
        io.sockets.emit('bcst-msg',{'cmd': 'quit', 'msg': "Reporter disconnected."});
        console.log('Disconnect message.');
      });
    });
  });

  app.get('/todo', function(req, res){
    res.render("todo", skillsLayout);
  });

  // Skills Overview
  app.get('/overview', function(req, res) {
    res.render("overview/home", skillsLayout);
  });
  app.get('/overview/home', function(req, res) {
    res.render("overview/home", skillsLayout);
  });
  app.get('/overview/progress', function(req, res) {
    res.render("overview/progress", skillsLayout);
  });

  // Frontier
  app.get('/frontier', function(req, res){
    res.render("frontier/home", skillsLayout);
  });
  app.get('/frontier/home', function(req, res){
    res.render("frontier/home", skillsLayout);
  });
  app.get('/frontier/angular', function(req, res){
    res.render("frontier/angular", skillsLayout);
  });
  app.get('/frontier/directive', function(req, res){
    res.render("frontier/directive", skillsLayout);
  });
  app.get('/frontier/async', function(req, res){
    res.render("frontier/async", skillsLayout);
  });
  app.get('/frontier/experiments', function(req, res){
    res.render("frontier/experiments", skillsLayout);
  });
  app.get('/frontier/getDate', function(req, res){
    if(req.feature('timeEx')){
      var date = new Date();
      var month = date.getMonth()+1;
      var monthDay = date.getDate();
      var dateStr = (date.getMonth()+1) +"/"+ date.getDate() +"/"+ date.getFullYear();
      res.send({"dateObj": date, "dateStr": dateStr, "month": month, "date": monthDay});
    } else {
      res.send({"dateObj": null, "dateStr":"Not Supported!"});
    }
  });
  app.get('/frontier/getTime', function(req, res){
    if(req.feature('timeEx')) {

      function padStr(num) {
        return (num<10)?"0"+num:""+num;
      };

      var now = new Date();
      var hours = now.getHours(); //0-23
      //convert 0,1,2...11,12,13...23 to 12,1,2...11,12,1,...11
      hours = (hours==0 ? 12 : ((hours<=12) ? hours : hours-12));
      var timeStr = padStr(hours) + ':' +
                    padStr(now.getMinutes()) + ':' +
                    padStr(now.getSeconds()) +  ' ' +
                    ((now.getHours())<12?"am":"pm");
      res.send(timeStr);
    } else {
      res.send("");
    }
  });

  function padStr(num) {
    return (num<10)?"0"+num:""+num;
  }

  app.get('/frontier/getZodiac', function(req, res){
    if (req.feature('timeEx')) {
      var month = req.query.month;
      var date = req.query.date;

      //given month and date, figure out index into zodiacArray
      var zIdx =
          ((month == 1) ? (date <= 20 ? 0 : 1) :
          ((month == 2) ? (date <= 19 ? 1 : 2) :
          ((month == 3) ? (date <= 20 ? 2 : 3) :
          ((month == 4) ? (date <= 20 ? 3 : 4) :
          ((month == 5) ? (date <= 21 ? 4 : 5) :
          ((month == 6) ? (date <= 21 ? 5 : 6) :
          ((month == 7) ? (date <= 23 ? 6 : 7) :
          ((month == 8) ? (date <= 23 ? 7 : 8) :
          ((month == 9) ? (date <= 23 ? 8 : 9) :
          ((month == 10) ? (date <= 23 ? 9 : 10) :
          ((month == 11) ? (date <= 22 ? 10 : 11) :
          ((month == 12) ? (date <= 22 ? 11 : 0) : -12))))))))))));

      var zodiacArray = [
        , "Capricorn"    //0  12/23 - 1/20
        , "Aquarius"     //1  1/21  - 2/19
        , "Pisces"       //2  2/20  - 3/20
        , "Aries",       //3  3/21  - 4/20
        , "Taurus"       //4  4/21  - 5/21
        , "Gemini"       //5  5/22  - 6/21
        , "Cancer"       //6  6/22  - 7/23
        , "Leo"          //7  7/24  - 8/23
        , "Virgo"        //8  8/24  - 9/23
        , "Libra"        //9  9/24  - 10/23
        , "Scorpio"      //0  10/24 - 11/22
        , "Sagittarius"  //11 11/23 - 12/22
        , "Unknown"
      ];
//      console.log("Returning zodiac sign: "+zodiacArray[zIdx]);

      // simulate a 0-4 second delay before returning
      setTimeout(function() { res.send(zodiacArray[zIdx]) }, (Math.floor((Math.random()*10))%5)*1000);
    }
  });


  // H5C3
  app.get('/h5c3', function(req, res){
    res.render("h5c3/home", skillsLayout);
  });
  app.get('/h5c3/home', function(req, res){
    res.render("h5c3/home", skillsLayout);
  });
  app.get('/h5c3/responsive', function(req, res){
    res.render("h5c3/responsive", skillsLayout);
  });
  app.get('/h5c3/form', function(req, res){
    res.render("h5c3/form", skillsLayout);
  });
  app.get('/h5c3/selectors', function(req, res){
    res.render("h5c3/selectors", skillsLayout);
  });
  app.get('/h5c3/styling', function(req, res){
    res.render("h5c3/styling", skillsLayout);
  });
  app.get('/h5c3/HTML5', function(req, res){
    res.render("h5c3/HTML5", skillsLayout);
  });


  // JavaScript
  app.get('/javascript', function(req, res){
    res.render("javascript/home", skillsLayout);
  });
  app.get('/javascript/home', function(req, res){
    res.render("javascript/home", skillsLayout);
  });
  app.get('/javascript/ajax', function(req, res){
    res.render("javascript/ajax", skillsLayout);
  });
  app.get('/javascript/basics', function(req, res){
    res.render("javascript/basics", skillsLayout);
  });
  app.get('/javascript/websockets', function(req, res) {


    res.render("javascript/websockets", skillsLayout);
  });
  app.get('/javascript/webworkers', function(req, res){
    res.render("javascript/webworkers", skillsLayout);
  });

  app.post('/frontier/savemovie', function(req, res){
    console.log("req.body: ",req.body);
    res.send({
      movieTitle: req.body.movieTitle,
      releaseYear: req.body.releaseYear,
      rating: req.body.rating,
      genre: req.body.genre,
      description: req.body.description,
      director: req.body.director,
      stars: req.body.stars,
      trailerUrl: req.body.trailerUrl
    });
  });

  // QA
  app.get('/qa', function(req, res){
    res.render("qa/home", skillsLayout);
  });
  app.get('/qa/home', function(req, res){
    res.render("qa/home", skillsLayout);
  });

  // Default routes
  app.get('/:page', function(req, res){
    console.log("/:page route - ",req.params.page);
    res.render(req.params.page, skillsLayout);
  });
  
  app.get('/', function(req, res){
    res.render("overview/home", skillsLayout);
  });
}

