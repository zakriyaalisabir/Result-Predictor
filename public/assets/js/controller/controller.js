var app = angular.module('myApp',['ngRoute','firebase']);

var statusLogin=false;//initial login token
var logoutStatus=true;//initial logout token
var myPath='/myProfile';//for passing value to $location.path(myPath)

app.config(['$qProvider','$routeProvider','$locationProvider',function($qProvider,$routeProvider,$locationProvider){
    $routeProvider.when('/',{
        url:'/login',
        templateUrl:'/assets/views/login.html',
        controller:'loginCtrl'
    }).when('/register',{
        url:'/register',
        templateUrl:'/assets/views/register.html',
        controller:'registerCtrl'
    }).when('/forgetPassword',{
        url:'/forgetPassword',
        templateUrl:'/assets/views/forgetPassword.html',
        controller:'forgetPasswordCtrl'
    }).when('/myHistory',{
        url:'/myHistory',
        templateUrl:'/assets/views/dashboardViews/myHistory.html',
        controller:'myHistoryCtrl'
    }).when('/myProfile',{
        url:'/myProfile',
        templateUrl:'/assets/views/dashboardViews/myProfile.html',
        controller:'myProfileCtrl'
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

app.controller('loginCtrl',function($scope,$location,$firebaseObject,$interval,$rootScope){
    console.log('hello from login controller');
   
    $scope.$apply;//for updating variable to initial values
    $rootScope.navVariable=true;
    $location.path();//make current url as path of browser window
    $location.replace();//prevent user from going back to app by setting the above path as previous

    $scope.login=function(){
        var e=$scope.email;
        var p=$scope.password;

        if(e =='' || e==='' || e==null || p =='' || p==='' || p==null){
            alert('invalid username or email or password');
        };

        console.log('login is clicked');

        firebase.auth().signInWithEmailAndPassword(e,p).then(function(user){
            if(user){
                // $location.path('/register');
                statusLogin=true;
                console.log('user successfully logged in');
            }
        }).catch(function(err){
            console.log(err);
            console.log(err.code);
            console.log(err.message);
            alert(err.message);
        });

        $interval(function(){
            if(statusLogin && logoutStatus){
                // $location.path('/myProfile');
                myPath='/myProfile';
                logoutStatus=false;
                $location.path(myPath);
                $rootScope.navVariable=false;
                $scope.$apply;
            }
        },1);
    }
});


app.controller('registerCtrl',function($scope,$location,$firebaseObject){
    console.log('hello from regCtrl controller');
   
    var ref=firebase.database().ref().child('users');
    var obj=$firebaseObject(ref);
    // ref.set({name:'zakii'});
    
    $scope.register=function(){
        console.log('reg is clicked');

        var uN=$scope.username;
        var uP=$scope.password;
        var uCP=$scope.confirmPassword;
        var uE=$scope.email;
        var uFN=$scope.name;
        var uG=$scope.gender;

        if(uN =='' ||uP =='' ||uCP =='' ||uE =='' ||uFN ==''  || uG=='' ||
        uN ==='' ||uP ==='' ||uCP ==='' ||uE ==='' ||uFN ==='' || uG==='' ||
        uN ==null ||uP ==null ||uCP ==null ||uE ==null ||uFN ==null || uG==null ){
            console.log('invalid or incomplete info');
            alert('invalid or incomplete info');
            return;
        }
        else{
            if(uP!==uCP){
                alert('password mismatched');
                return
            };
            if($scope.agree){
                console.log('gender = '+uG);
                
                var uEmail=uE.replace('.',',');

                // var userDetail={
                //     username:uN,
                //     fullName:uFN,
                //     email:uEmail,
                //     password:uP,
                //     gender:uG
                // };
                // console.log(userDetail);

                firebase.auth().createUserWithEmailAndPassword(uE,uP).then(function(user){
                    
                    var uid=firebase.auth().currentUser.uid;
                    ref.child(uid).set({
                        username:uN,
                        fullName:uFN,   
                        email:uEmail,
                        password:uP,
                        gender:uG
                    });
                    alert('user successfully registered !!!');
                    $location.path('/dashboard');
                }).catch(function(err){
                    console.log(err);
                    // alert(err.message);
                });
            }else{
                alert('please agree to our terms and conditions first in order to register to our app');
                return;
            }
        }
    };
});

app.controller('forgetPasswordCtrl',function($scope,$location,$firebaseObject){
    console.log('hello from fgCtrl controller');
    
    $scope.fpEmail=function(){
        console.log('fpEmail is clicked');
        var email=$scope.fp_email;
        console.log(email);
        if(email==='' || email=='' || email==null){
            alert('invalid email address');
            return;
        }else{
            firebase.auth().sendPasswordResetEmail(email).then(function(){
                console.log('email sent');
            }).then(function(){
                $scope.$apply;
            }).catch(function(err){
                console.log(err);
                alert(err.message)
            });
        }
    };
    
});

//initializing hidden navbar now
app.controller('navCtrl',function($rootScope,$scope,$location,$interval){
    console.log('nav controller loaded');
    
    $scope.navVariable=true;//thats mean nav bar is not displayed {ng-hide=true}
    
    $rootScope.logout=function(){
        console.log('logout is clicked');
        firebase.auth().signOut().then(function(){
            logoutStatus=true;
        }).catch(function(err){
            console.log(err);
            alert(err.message);
        });
    };

    $interval(function(){
        if(statusLogin ){
            $scope.navVariable=false;
        }

        if(logoutStatus){
            statusLogin=false;
            $scope.navVariable=true;
            myPath='/';
            // $location.path('/login');
            $location.path(myPath);
            $location.replace();//for setting the current url to stop user from going back to app after logout
        }
    },1);

    $scope.history=function(){
        // $location.path('/myHistory');
        myPath='/myHistory';
        $location.path(myPath);
    }
    
    $scope.analytics=function(){
        // $location.path('/myAnalytics');
        myPath='/myAnalytics';
        $location.path(myPath);
    }
    
    $scope.predictor=function(){
        // $location.path('/myPredictor');
        myPath='/myPredictor';
        $location.path(myPath);
    }
    
    $scope.settings=function(){
        // $location.path('/settings');
        myPath='/settings';
        $location.path(myPath);
    }
    
    $scope.myProfile=function(){
        // $location.path('/settings');
        myPath='/myProfile';
        $location.path(myPath);
    }
});

app.controller('myHistoryCtrl',function($scope,$location,$firebaseObject,$interval){

    console.log('hello from myHistory controller');
    $interval(function(){
        if(logoutStatus){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});

app.controller('myAnalyticsCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from myAnalyticsCtrl');
    $interval(function(){
        if(logoutStatus){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});

app.controller('myProfileCtrl',function($rootScope,$scope,$location,$firebaseObject,$interval){
    console.log('hello from myProfileCtrl');
    $rootScope.navVariable=false;//now {ng-hide=false}
    $scope.$apply;
    $interval(function(){
        if(logoutStatus){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});

app.controller('myPredictorCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from myPredictorCtrl');
    $interval(function(){
        if(logoutStatus){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});

app.controller('settingsCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from settingsCtrl ');
    $interval(function(){
        if(logoutStatus){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});