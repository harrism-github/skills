
/* Module Pattern
The module pattern is a common JavaScript coding pattern. 
The anonymous closure is the fundamental construct that makes it all possible, and really is the single 
best feature of JavaScript. We’ll simply create an anonymous function, and execute it immediately. 
All of the code that runs inside the function lives in a closure, which provides privacy and state 
throughout the lifetime of our application.
To create a public interface, you can export the objects you want to be public using the anonymous 
function’s return value. Doing so will complete the basic module pattern.
http://www.adequatelygood.com/JavaScript-Module-Pattern-In-Depth.html
*/

var MOVIE = (function() {
  var movieInterface = {};
  var movie = {
    movieTitle: "The Hunger Games: Catching Fire",
    releaseYear: "2013",
    rating: "8.0",
    genre: "Action, Adventure, Sci-Fi",
    description: "Katniss Everdeen and Peeta Mellark become targets of the Capitol after their victory in the 74th Hunger Games sparks a rebellion in the Districts of Panem.",
    director: "Francis Lawrence",
    stars: "Jennifer Lawrence, Josh Hutcherson, Liam Hemsworth",
    trailerUrl: "http://www.imdb.com/video/imdb/vi1541646617/"
  }

  //local function to set a property in the internal movie object
  var set = function (key, value) {
    try {
      if (!key) {
        throw new Error("bad key");
      }

      movie[key] = value;
      $("."+key).html = value;

    } catch (e) {
      if (e.message === "bad key") {
        alert("The movie object attribute was not provided to the set function.")
      }
      else {
        alert(e.message);
      }
    }
  }

    //Setup public interface
    //----------------------

    //set movie obj property
    movieInterface.set = set;
    
    //get movie obj property
    movieInterface.get = function(key) { movie[key]};
    
    //get movie form entry
    movieInterface.get = function(key) { $("."+key) };

    //save movie obj to server
    movieInterface.save = function () {
      // make an ajax call to the server passing the contact info.
      $.post("http://localhost:5000/frontier/savemovie?", movie,
        // callback: process the response and update the movie object
        function(data) {
          movie = data;
          MOVIE.setFormInfo();
          console.log("returned data: ",data);
      })
      .fail(function() { alert("server error"); });
    }

    //get form info from inputs and save in movie obj
    movieInterface.getFormInfo = function () {
      movie.movieTitle = $('.movieForm .movieTitle').val();
      movie.releaseYear = $('.movieForm .releaseYear').val();
      movie.rating = $('.movieForm .rating').val();
      movie.genre = $('.movieForm .genre').val();
      movie.description = $('.movieForm .description').val();
      movie.director = $('.movieForm .director').val();
      movie.stars = $('.movieForm .stars').val();
      movie.trailerUrl = $('.movieForm .trailerUrl').val();
    }

    //set form info from internal movie obj
    movieInterface.setFormInfo = function () {
      $('.movieForm .movieTitle').val(movie.movieTitle);
      $('.movieForm .releaseYear').val(movie.releaseYear);
      $('.movieForm .rating').val(movie.rating);
      $('.movieForm .genre').val(movie.genre);
      $('.movieForm .description').val(movie.description);
      $('.movieForm .director').val(movie.director);
      $('.movieForm .stars').val(movie.stars);
      $('.movieForm .trailerUrl').val(movie.trailerUrl);
    }

  // anonymous function returns the public interface.
  // The closure maintains state and privacy
  return movieInterface;
})();

//add Java hash code function to javascript strings
String.prototype.hash = function(){
  var hash = 0, ch;
  if (this.length == 0) return hash;
  for (var i = 0, l = this.length; i < l; i++) {
    ch  = this.charCodeAt(i);
    hash  = ((hash<<5)-hash)+ch;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

$(document).ready(function() {
	$("header a[href$='javascript/home']").parent().addClass('selected');
	$("article a[href$='javascript/basics']").parent().addClass('selected');

    // watch for any change in the form; they will bubble up from the input fields
    $('.movieForm').change(
      function(event) {
        var targetId = "" + event.target.id;
        MOVIE.set(event.target.id,event.target.value);
    });

    $('.movieForm .movieTitle').change(
        function() {
          var movieTitle = this.value;  //fetch the movie title by referencing the 'this' pointer for the movieTitle input element
          var output = "The hash of the movie title '"+movieTitle+"' is: "+movieTitle.hash();  //use the new string Prototype fcn
          alert(output);
        });

    $( ".movieForm" ).submit(
      function( event ) {
        MOVIE.getFormInfo();
        MOVIE.save();
        event.preventDefault();
      });

    // display the initial contents of MOVIE
    MOVIE.setFormInfo();

});
