angular
	.module('minmax', [])
	.controller('MinMaxCtrl', function($scope) {
		$scope.formModel = {};
		$scope.onSubmit = function() {
			console.log('Form Submitted!');
			console.log($scope.formModel);				
		}
	});

//	.controller('MinMaxCtrl', MinMaxCtrl);
//
//	MinMaxCtrl.$inject = [];
//
//	function MinMaxCtrl($scope) {
//		console.log('MinMaxCtrl!');
//		console.log($scope);
//	}