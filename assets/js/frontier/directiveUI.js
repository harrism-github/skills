$(document).ready(function() {
	$("header a[href$='frontier/home']").parent().addClass('selected');
	$("article a[href$='frontier/directive']").parent().addClass('selected');
});

var myApp = angular.module("myApp",[]);

// add a controller
myApp.controller("myCtrl", function($scope) {
	$scope.serverData = {
		date: '',
		time: '',
		fortune: ''
	}
	
	if (FS.showEx('timeTag')) {

		$scope.getDateDeferred = null;
		$scope.getTimeDeferred = null;

		// make three asynchronous calls to the server for data
		$scope.getDateFromServer = function() {
		 	$scope.getDateDeferred = $.get("http://localhost:5000/frontier/getDate", function(data) {
		 		console.log(data);
		 		$scope.serverData.date = data;
		 		$scope.$digest();
		 	})
		 	//.done(function() { alert("second success"); })
			.fail(function() { alert("error"); })
			//.always(function() { alert("finished"); });
		}

		$scope.getTimeFromServer = function() {
		 	$scope.getTimeDeferred = $.get("http://localhost:5000/frontier/getTime", function(data) {
		 		console.log(data);
		 		$scope.serverData.time = data;
		 		$scope.$digest();

		 	})
			.fail(function() { alert("error"); })
		}

		$scope.getFortuneFromServer = function(second) {
		 	var jqxhr = $.get("http://localhost:5000/frontier/getFortune?second="+second, function(data) {
		 		$scope.serverData.fortune = data;
		 		$scope.$digest();
		 	})
			.fail(function() { alert("error"); })
		}

		$scope.getDateFromServer();
		$scope.getTimeFromServer();

		// sequence the calling for the date and time before calling for the fortune
		$.when($scope.getDateDeferred, $scope.getTimeDeferred)
		    .done(function () {
		    	// parse off the second from the time and pass it to the server to fetch a fortune
		    	var pattern = /:[0-9]*:(.*)[aApP][mM]/;
		    	var second = (($scope.serverData.time).match(pattern))[1];
		    	$scope.getFortuneFromServer(second);
			    })
		    .fail(function () { alert("error"); });
	}

});

// add a directive
myApp.directive("myHighlight", function(){
	return function(scope, element, attrs) {
		element.bind("mouseenter", function() {
			element.css("background", "yellow");
		});
		element.bind("mouseleave", function() {
			element.css("background", "none");
		});
	}

});

myApp.directive('theTime',function(){
	return{
		restrict: 'E',
		template: '<span>Date: {{serverData.date}}</span>&nbsp;&nbsp;Time: {{serverData.time}}&nbsp;&nbsp;Fortune: {{serverData.fortune}}',
	}

});

var experiment = require("experiment");
experiment.configureFromFile("config.json");


