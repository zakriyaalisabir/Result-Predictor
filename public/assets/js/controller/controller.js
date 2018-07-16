var app = angular.module('myApp',['ngRoute','firebase']);

var statusLogin=false;
var logoutStatus=false;

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
    }).when('/dashboard',{
        url:'/dashboard',
        templateUrl:'/assets/views/dashboard.html',
        controller:'dashboardCtrl'
    }).when('/myHistory',{
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

app.controller('loginCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from login controller');
   
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
            if(statusLogin){
                $location.path('/dashboard');
                $scope.navVariable=false;
            }
        },1);

        // firebase.auth().onAuthStateChanged(function(user){
        //     if(user){
        //         $location.path('/dashboard');
        //     }
        // });

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
app.controller('dashboardCtrl',function($scope,$location,$interval,$firebaseObject){
    console.log('hello from dashboardCtrl controller');

    $scope.logout=function(){
        console.log('logout is clicked');
        firebase.auth().signOut().then(function(){
            logoutStatus=true;
        }).catch(function(err){
            console.log(err);
            alert(err.message);
        });
    };
    $interval(function(){
        if(logoutStatus){
            logoutStatus=false;
            statusLogin=false;
            $location.path('/login');
        }
    },1);
});

app.controller('navCtrl',function($scope){
    console.log('nav controller loaded');
    $scope.navVariable=true;
    if(statusLogin){
        $scope.navVariable=false;
    }
});

app.controller('myHistoryCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from myHistory controller');
});

app.controller('myAnalyticsCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from myAnalyticsCtrl');
});

app.controller('myPredictorCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from myPredictorCtrl');
});

app.controller('settingsCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from settingsCtrl ');
});