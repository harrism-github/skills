module.exports = function(app) {

 var skillsLayout = {
    layout: "layout/layout-skills"
  };

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
    if(req.feature('timeTag')){
      var today = new Date();
      var returnDate = (today.getMonth()+1) +"/"+ today.getDate() +"/"+ today.getFullYear();
      res.send(returnDate);
    } else {
      res.send("Not Supported!");
    }

  });
  app.get('/frontier/getTime', function(req, res){
    if(req.feature('timeTag')){
      var today = new Date();
      var hours = (today.getHours()+1)<=12?(today.getHours()+1):(today.getHours()-12);
      var minutes = today.getMinutes()+1;
      minutes = ""+minutes.length == 1?"0"+minutes:minutes;
      var seconds = today.getSeconds();
      var ampm = (today.getHours()+1)<=12?"am":"pm";
      var returnTime = hours +":"+ minutes +":"+ seconds +ampm;
      res.send(returnTime);
    } else {
      res.send("Not Supported!");
    }
  });
  app.get('/frontier/getFortune', function(req, res){
    if(req.feature('timeTag')){
      // we only have 10 fortunes so lets just grab the second digit
      var fortuneIndex = (req.query.second).length>1?(req.query.second)[1]:(req.query.second)[0];
      var fortuneArray= ["A dubious friend may be an enemy in camouflage.",
                          "Be careful or you could fall for some tricks today.",
                          "Carve your name on your heart and not on marble",
                          "Dedicate yourself with a calm mind to the task at hand.",
                          "Each day, compel yourself to do something you would rather not do.",
                          "Failure is the chance to do better next time.",
                          "Get your mind set — confidence will lead you on.",
                          "Happiness begins with facing life with a smile and a wink.",
                          "I learn by going where I have to go.",
                          "Keep your face to the sunshine and you will never see shadows"];
      //console.log("Returning fortune: "+fortuneArray[fortuneIndex]);

      // simulate a delay
      setTimeout(function() { res.send(fortuneArray[fortuneIndex]) }, 1000);
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
  app.get('/javascript/websockets', function(req, res){
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

  app.get('/frontier/getServerTime', function(req, res){
    var today = new Date();
    console.log(today);
    res.send({hours:today.getHours(),minutes:today.getMinutes(),seconds:today.getSeconds()});
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

