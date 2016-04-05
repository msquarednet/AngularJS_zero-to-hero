var app = angular.module('codecraft', [
	'ngResource', 
	'infinite-scroll', 
	'angularSpinner', 
	'jcs-autoValidate',
	'angular-ladda',
	'mgcrea.ngStrap',
	'toaster',
	'ngAnimate'
]);



//just for this course (first 2 providers)
app.config(function($httpProvider, $resourceProvider, laddaProvider, $datepickerProvider) {
	$httpProvider.defaults.headers.common['Authorization'] = 'Token d0873f7773dfec34326dc0fe0d71cf80acfd12cf';
	$resourceProvider.defaults.stripTrailingSlashes = false;
	laddaProvider.setOption({style:'expand-right'});
	angular.extend($datepickerProvider.defaults, {dateFormat:'d/M/yyyy', autoclose:true});
});
//just for this course
app.factory('Contact', function($resource) {	//ALL CRUD!
//	return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/');	// reminder: ':id' is optional, so GET list or single contact
	return $resource('https://codecraftpro.com/api/samples/v1/contact/:id/', {id:'@id'}, {
		update: {method: 'PUT'}
	});	//$resource does not support 'update/PUT' by default, so we have to add it. 
});



app.controller('PersonDetailController', function ($scope, ContactService) {
	$scope.contacts = ContactService;
	$scope.save = function() {
		$scope.contacts.updateContact($scope.contacts.selectedPerson);
	}
	$scope.remove = function() {
		ContactService.removeContact(ContactService.selectedPerson);
	}
});

app.controller('PersonListController', function ($scope, $modal, ContactService) {

	$scope.search = "";
	$scope.order = "name";
	$scope.contacts = ContactService;
	
	$scope.loadMore = function() {
		console.log('load more...');
		ContactService.loadMore();
	}
	
	$scope.showCreateModal = function() {
		$scope.contacts.selectedPerson = {};
		$scope.createModal = $modal({
			scope: $scope,
			template: 'templates/modal.create.tpl.html',
			show: true
		});
	}
	
	$scope.createContact = function() {
		$scope.contacts.createContact($scope.contacts.selectedPerson)
			.then(function() {
				$scope.createModal.hide();
			});
	}
	
	$scope.$watch('search', function(newVal, oldVal) {
		if (angular.isDefined(newVal)) {
			$scope.contacts.doSearch(newVal);
		}
	});	
	$scope.$watch('order', function(newVal, oldVal) {
		if (angular.isDefined(newVal)) {
			$scope.contacts.doOrder(newVal);
		}
	});

/*	now done on server....	
//	$scope.sensitiveSearch = function (person) {
//		if ($scope.search) {
//			return person.name.indexOf($scope.search) == 0 ||
//				person.email.indexOf($scope.search) == 0;
//		}
//		return true;
//	};
*/
});



app.service('ContactService', function (Contact, $q, toaster) {	//$q included so we can return a promise from createContact function
	
	var self = {
		'addPerson': function (person) {
			this.persons.push(person);
		},
		page: 1,
		hasMore: true,
		isLoading: false,
		isSaving: false,
		isDeleting: false,
		selectedPerson: null,
		persons: [],
		search: null,
		ordering: null,
		doSearch: function(search) {
			self.hasMore = true;
			self.page = 1;
			self.persons = [];
			self.search = search;
			self.loadContacts();
		}, 
		doOrder: function(order) {
			self.hasMore = true;
			self.page = 1;
			self.persons = [];
			self.ordering = order;
			self.loadContacts();
		}, 
		loadContacts: function() {
			if (self.hasMore && !self.isLoading) {
				self.isLoading = true;
				var params = {
					'page': self.page, 
					'search': self.search,
					'ordering': self.ordering
				};
				Contact.get(params, function(data) {	//$resource class
					console.log(data);
					angular.forEach(data.results, function(person) {
						self.persons.push(new Contact(person));	// a new '$resource' of person :)
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
		},
		updateContact: function(person) {
			console.log('contacts.updateContact called... ');
			console.log(person);
			self.isSaving = true;
//		Contact.update(person).$promise.then(function() {
			person.$update().then(function() {			//$resource instance
				self.isSaving = false;
				toaster.pop('success', 'Updated ' + person.name);
			});
		},
		removeContact: function(person) {
			self.isDeleting = true;
			person.$remove().then(function() {			//$resource instance
				self.isDeleting = false;
				self.persons.splice( self.persons.indexOf(person), 1);
				self.selectedPerson = null;
				toaster.pop('success', 'Deleted ' + person.name);
			});
		},
		createContact: function(person) {
			console.log('contacts.createContact called... ');
			var d = $q.defer();
			self.isSaving = true;
			Contact.save(person).$promise.then(function(response) {	//$resource class
				self.isSaving = false;
				self.selectedPerson = null;
				self.hasMore = true;
				self.page=1;
				self.persons=[];
				self.loadContacts();
				toaster.pop('success', 'Created ' + person.name);
				d.resolve();
				//console.log(response);
//			}).catch(function(err) {
//				d.reject(err.data)				
			});		
			return d.promise;
/*//			self.isSaving = true;
//			Contact.save(person).$promise.then(function() {	//$resource class
//				self.isSaving = false;
//			});*/		
		}
	};
	
	self.loadContacts();
	
	return self;

});