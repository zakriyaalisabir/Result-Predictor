var app = angular.module('myApp',['ngRoute']);

app.config(['$qProvider','$routeProvider','$locationProvider',function($qProvider,$routeProvider,$locationProvider){
    $routeProvider.when('/',{
        url:'/login',
        templateUrl:'/assets/views/login.html',
        controller:'loginCtrl'
    }).when('/register',{
        url:'/register',
        templateUrl:'/assets/views/register.html',
        controller:'RegisterCtrl'
    }).when('/forgetPassword',{
        url:'/forgetPassword',
        templateUrl:'/assets/views/forgetPassword.html',
        controller:'forgetPasswordCtrl'
    }).otherwise({
        url:'/error',
        // templateUrl:'assets/views/error.html',
        redirectTo:'/assets/views/error.html'
    });
    $locationProvider.html5Mode({
        enabled:true,
        requireBase:false
    });
    $qProvider.errorOnUnhandledRejections(false);
}]);

app.controller('loginCtrl',function($scope,$location){
    console.log('hello from login controller');
    
    $scope.login=function(){
        console.log('login is clicked');
    }
    // $scope.goto()=function(loc){
    //     $location.path('/'+loc)
    // }
});


app.controller('registerCtrl',function($scope,$location){
    console.log('hello from regCtrl controller');
    
    $scope.register=function(){
        console.log('reg is clicked');
    }
    // $scope.goto()=function(loc){
    //     $location.path('/'+loc)
    // }
});

app.controller('forgetPasswordCtrl',function($scope,$location){
    console.log('hello from fgCtrl controller');
    
    $scope.fg=function(){
        console.log('fg is clicked');
    }
    // $scope.goto()=function(loc){
    //     $location.path('/'+loc)
    // }
});