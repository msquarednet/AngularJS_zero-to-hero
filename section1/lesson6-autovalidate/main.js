var app = angular.module('minmax', ['jcs-autoValidate']);


app.run(function (defaultErrorMessageResolver) {
		defaultErrorMessageResolver.getErrorMessages().then(function (errorMessages) {
			errorMessages['tooYoung'] = 'You must be at least {0} years old to use this site';
			errorMessages['tooOld'] = 'You must be max {0} years old to use this site';
			errorMessages['badUsername'] = 'Username can only contain numbers and letters and _';
		});
	}
);

app.controller('MinMaxCtrl', function ($scope, $http) {
	$scope.formModel = {};

	$scope.onSubmit = function () {

		console.log("Hey i'm submitted!");
		console.log($scope.formModel);

		$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel).
			success(function (data) {
				console.log(":)")
			}).error(function(data) {
				console.log(":(")
			});

	};
		
		
/* note: with jcs-auto-validate, and invalide form will not even be submitted (no need for valid arg)*/
		
//	$scope.onSubmit = function (valid) {
//		
//		if (valid) {
//			console.log("Hey i'm submitted!");
//			console.log($scope.formModel);
//
//			//$http.post('https://minmax-server.herokuapp.com/register/', $scope.formModel).
//			//	success(function (data) {
//			//		console.log(":)")
//			//	}).error(function(data) {
//			//		console.log(":(")
//			//	});
//		} else {
//			console.log("Invalid Form!")
//		}
//
//	};
	
	
	
	
	
	
});