var app = angular.module('codecraft', ['ngResource', 'infinite-scroll']);

//just for this course
app.config(function($httpProvider, $resourceProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token d0873f7773dfec34326dc0fe0d71cf80acfd12cf';
	$resourceProvider.defaults.stripTrailingSlashes = false;
});

app.factory('Contact', function($resource) {
	return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/');	// reminder: ':id' is optional, so GET list or single contact
});


app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;
});

app.controller('PersonListController', function ($scope, ContactService) {

	$scope.search = "";
	$scope.order = "email";
	$scope.contacts = ContactService;
	
	$scope.loadMore = function() {
		console.log('load more...');
		ContactService.loadMore();
	}
	
	$scope.sensitiveSearch = function (person) {
		if ($scope.search) {
			return person.name.indexOf($scope.search) == 0 ||
				person.email.indexOf($scope.search) == 0;
		}
		return true;
	};

});

app.service('ContactService', function (Contact) {
	
	var self = {
		'addPerson': function (person) {
			this.persons.push(person);
		},
		page: 1,
		hasMore: true,
		isLoading: false,
		'selectedPerson': null,
		'persons': [], 
		loadContacts: function() {
			if (self.hasMore && !self.isLoading) {
				self.isLoading = true;
				var params = {
					'page': self.page
				};
				Contact.get(params, function(data) {
					console.log(data);
					angular.forEach(data.results, function(person) {
						self.persons.push(new Contact(person));
					});
					if (!data.next) {self.hasMore=false;}
					self.isLoading = false;
				});
			}
		},
		loadMore: function() {
			if (self.hasMore && !self.isLoading) {
				self.page++;
				self.loadContacts();
			}
		}
	};
	
	self.loadContacts();
	
	return self;

});