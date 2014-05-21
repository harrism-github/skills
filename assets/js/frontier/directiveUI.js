$(document).ready(function() {
	$("header a[href$='frontier/home']").parent().addClass('selected');
	$("article a[href$='frontier/directive']").parent().addClass('selected');
});

//create an angular app called "myApp"
var myApp = angular.module("myApp",[]);

// add a controller to the app
myApp.controller("myCtrl", function($scope) {
	$scope.serverData = {
		'date': '',
		'time': '',
		'zodiac': ''
	}

  console.log("timeEx=",FS.showEx('timeEx'));
	if (FS.showEx('timeEx')) {

    var tmpDateRes = '',
        tmpTime = '',
        tmpZodiac = '',
        getDatePromise,
        getTimePromise,
        getZodiacPromise;

		// define three asynchronous calls to the server to get date, time and zodiac
		$scope.getDate = function() {
		 	getDatePromise =
        $.get("http://localhost:5000/frontier/getDate")
          .done(function(dateRes) {
		 		    console.log("getDate = ",dateRes); //{"date": date, "dateStr":dateStr, "month": date.getMonth()+1, "date": date.getDate()}
            tmpDateRes = dateRes;
          })
          .fail(function() {
            tmpDateRes = {'date':'error'},
            console.log("error retrieving data");
            })
		}

		$scope.getTime = function() {
		 	getTimePromise =
        $.get("http://localhost:5000/frontier/getTime")
          .done(function(timeStr) {
		 		    console.log("getTime() = "+timeStr);
            tmpTime = timeStr;
          })
          .fail(function() {
              tmpTime = 'error';
              console.log("error retrieving time");
            })
		}

		$scope.getZodiac = function(month,date) {
		 	getZodiacPromise =
        $.get("http://localhost:5000/frontier/getZodiac?month="+month+"&date="+date)
          .done(function(sign) {
            console.log("getZodiac = "+sign);
            tmpZodiac = sign;
          })
          .fail( function() {
            tmpZodiac = 'error';
            console.log("error retrieving zodiac sign");
          })
		}


    //make 2 asynchronous calls server to get the date and time
		$scope.getDate();
		$scope.getTime();

		// when getDate() is done, use the month and day returned to get zodiac sign
    $.when(getDatePromise)
        .done(function (dateRes) {
          $scope.getZodiac(dateRes.month, dateRes.date);
        })
        .fail(function () {
          console.log("error getting Zodiac; getDate failed");
        })
        .always( function () {
          //when all three results are retrieved, update serverData to display results
          $.when(getDatePromise, getTimePromise, getZodiacPromise)
              .done(function () {
                $scope.serverData.date = tmpDateRes.dateStr;
                $scope.serverData.time = tmpTime;
                $scope.serverData.zodiac = tmpZodiac;
                $scope.$digest();
                console.log("synchronization of getDate, getTime and getZodiac succeeded.");
              })
              .fail(function () {
                console.log("synchronization of three async calls failed.");
              });
        });
  }
});

myApp.directive('theTime',function(){
	return{
		restrict: 'E',
		template: '<div data-test="date">Date: <span class="date">{{serverData.date}}</span>&nbsp;&nbsp;Time: <span class="time">{{serverData.time}}</span></div>' +
              '<div data-test="zodiac-sign">Zodiac Sign: <span class="zodiac">{{serverData.zodiac}}</span></div>'
	}

});


