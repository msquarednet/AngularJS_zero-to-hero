var app = angular.module('minmax', []);

// https://minmax-server.herokuapp.com/register/'



app.controller('MinMaxCtrl', function($scope, $http) {
	$scope.formModel = {};
	$scope.onSubmit = function() {
		console.log('Form Submitted!');
		console.log($scope.formModel);	
//		$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel)
//			.success(function(data) {
//				console.log(':)');	
//			}).error(function(err) {
//				console.log(':(');
//			});
		
		$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel)
			.then(function(response) {
				console.log(':)');	
			})
			.catch(function(err) {
				console.log(':(');
			});		
		
		
	}
	
});