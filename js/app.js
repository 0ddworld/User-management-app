var app = angular.module('app',['ngResource']);

/**
* usersApi give a full access to trainee-api.
* Also add the method PUT called as update.
*/
app.service('usersApi', function($resource){
	return $resource('https://trainee-api.pleiads.fr/users/:id', null, {
		'update': {method:'PUT', params: {id: "@id"}}
	});
})

/**
* usersController controll every action with trainee-api.
* Allowed to display, delete, edit and add users in trainee-api.
*/
app.controller('usersController', function($scope, usersApi) {
	$scope.user = false; //Selectionned user, equals false if none.
	$scope.n = {}; //A new user.
	$scope.loading = true;
	
	//initialize users list.
	usersApi.query().$promise
		.then(response => {
			$scope.loading = false;
			$scope.users = response; //local list of users from trainee-api.
		})
		.catch(err =>{
			console.error(err);
		});

	//Select a copy of user in trainee-api.
	$scope.showEditUser = function(user) {
		$scope.user = usersApi.get({id: user.id});
	};

	//Delete user in trainee-api and local list.
	$scope.deleteUser = function(user) {
		usersApi.delete(user, function(){
			$scope.users.splice($scope.users.indexOf(user),1);
		});
	};

	//Edit user in trainee-api and local list.
	$scope.editUser = function(user) {
		$scope.user.$update(function(){
			$scope.user = false;
			$scope.users.splice($scope.users.indexOf(user),1, user);
		});
	};

	//Reset user selection.
	$scope.reset = function() {
		$scope.user = false;
	}

	//Add user in trainee-api and local list.
	$scope.addUser = function() {
		var user = usersApi.save($scope.n, function(){
			$scope.users.push(user);
			$scope.n = {};
		});
	};
})