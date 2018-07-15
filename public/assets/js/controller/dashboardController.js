var app = angular.module('dashboardApp',['ngRoute','firebase']);

app.config(['$qProvider','$routeProvider','$locationProvider',function($qProvider,$routeProvider,$locationProvider){
    $routeProvider.when('/',{
        url:'/myHistory',
        templateUrl:'/assets/views/dashboardViews/myHistory.html',
        controller:'myHistoryCtrl'
    }).when('/myAnalytics',{
        url:'/myAnalytics',
        templateUrl:'/assets/views/dashboardViews/myAnalytics.html',
        controller:'myAnalyticsCtrl'
    }).when('/myPredictor',{
        url:'/myPredictor',
        templateUrl:'/assets/views/dashboardViews/myPredictor.html',
        controller:'myPredictorCtrl'
    }).when('/settings',{
        url:'/settings',
        templateUrl:'/assets/views/dashboardViews/settings.html',
        controller:'settingsCtrl'
    }).otherwise({
        // url:'/error',
        // templateUrl:'assets/views/error.html',
        redirectTo:'/'
    });
    $locationProvider.html5Mode({
        enabled:true,
        requireBase:false
    });
    $qProvider.errorOnUnhandledRejections(false);
}]);


app.controller('myHistoryCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from myHistory controller');
});