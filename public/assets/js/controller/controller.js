var app = angular.module('myApp',['ngRoute','firebase']);

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

app.controller('loginCtrl',function($scope,$location,$firebaseObject,$interval){
    console.log('hello from login controller');
   
    $scope.login=function(){
        var e=$scope.email;
        var p=$scope.password;

        if(e =='' || e==='' || e==null || p =='' || p==='' || p==null){
            alert('invalid username or email or password');
        };

        console.log('login is clicked');
        var statusLogin=false;
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
            }
        },1);

        // firebase.auth().onAuthStateChanged(function(user){
        //     if(user){
        //         $location.path('/dashboard');
        //     }
        // });

    }

    // $scope.goto()=function(loc){
    //     $location.path('/'+loc)
    // }
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
app.controller('dashboardCtrl',function($scope,$location){
    console.log('hello from dashboardCtrl controller');
    
    // $scope.fg=function(){
    //     console.log('fg is clicked');
    // }
    // $scope.goto()=function(loc){
    //     $location.path('/'+loc)
    // }
});