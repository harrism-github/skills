$(document).ready(function() {
	$("header a[href$='frontier/home']").parent().addClass('selected');
	$("article a[href$='frontier/angular']").parent().addClass('selected');
});

var ShoppingCtrl = ['$scope',function($scope) {
	$scope.products = [
		{name:'Tide',store:'Costco',purchased:false},
		{name:'Chicken',store:'Harmans',purchased:false},
		{name:'Jello',store:'Target',purchased:false},
		{name:'Bread',store:'Costco',purchased:false}];

	$scope.getTotalProducts = function() {
		return $scope.products.length;
	}

	$scope.addProduct = function() {
		$scope.products.push(
				{name:$scope.formProductText, store:$scope.formStoreText, purchased:false})
		$scope.formProductText = "";
		$scope.formStoreText = "";
	}

	$scope.clearPurchased = function() {
		var len = $scope.products.length;
		while(len--){
			if($scope.products[len].purchased==true) {
				$scope.products.splice(len,1);
			}
		}
	}
}];

/*
angular.module('controllers',[])
	.controller('ShoppingCtrl', function() {$scope.products = [
		{name:'Tide',store:'Costco',purchased:false},
		{name:'Chicken',store:'Harmans',purchased:false},
		{name:'Jello',store:'Target',purchased:false},
		{name:'Bread',store:'Costco',purchased:false}];

		$scope.getTotalProducts = function() {
			return $scope.products.length;
		}

		$scope.addProduct = function() {
			$scope.products.push(
					{name:$scope.formProductText, store:$scope.formStoreText, purchased:false})
			$scope.formProductText = "";
			$scope.formStoreText = "";
		}

		$scope.clearPurchased = function() {
			var len = $scope.products.length;
			while(len--){
				if($scope.products[len].purchased==true) {
					$scope.products.splice(len,1);
				}
			}
		}
	});
*/

angular.module('components',[])
	.directive('the-time', function() {
		return{
			restrict: 'E',
			link:function (scope,element,attrs){
				element.html('<div>Hello There </div>')
			}
		}
	});

angular.module('myApp',['components' /*,'controllers'*/])




/*
function ShoppingCtrl($scope) {
	$scope.products = [
		{name:'Tide',store:'Costco',purchased:false},
		{name:'Chicken',store:'Harmans',purchased:false},
		{name:'Jello',store:'Target',purchased:false},
		{name:'Bread',store:'Costco',purchased:false}];

	$scope.getTotalProducts = function() {
		return $scope.products.length;
	}

	$scope.addProduct = function() {
		$scope.products.push(
				{name:$scope.formProductText, store:$scope.formStoreText, purchased:false})
		$scope.formProductText = "";
		$scope.formStoreText = "";
	}

	$scope.clearPurchased = function() {
		var len = $scope.products.length;
		while(len--){
			if($scope.products[len].purchased==true) {
				$scope.products.splice(len,1);
			}
		}
	}
}
*/
