var app = angular.module('myApp',['ngRoute','firebase','ng-fusioncharts']);

var statusLogin=false;//initial login token
var logoutStatus=false;//initial logout token
var myPath='/myProfile';//for passing initial value to $location.path(myPath)

app.config(['$qProvider','$routeProvider','$locationProvider',function($qProvider,$routeProvider,$locationProvider){
    $routeProvider.when('/',{
        url:'/login',
        templateUrl:'/assets/views/login.html',
        controller:'loginCtrl',
        reloadOnSearch:false
    }).when('/register',{
        url:'/register',
        templateUrl:'/assets/views/register.html',
        controller:'registerCtrl',
        reloadOnSearch:false
    }).when('/forgetPassword',{
        url:'/forgetPassword',
        templateUrl:'/assets/views/forgetPassword.html',
        controller:'forgetPasswordCtrl',
        reloadOnSearch:false
    }).when('/myHistory',{
        url:'/myHistory',
        templateUrl:'/assets/views/dashboardViews/myHistory.html',
        controller:'myHistoryCtrl',
        reloadOnSearch:false
    }).when('/myProfile',{
        url:'/myProfile',
        templateUrl:'/assets/views/dashboardViews/myProfile.html',
        controller:'myProfileCtrl',
        reloadOnSearch:false
    }).when('/myAnalytics',{
        url:'/myAnalytics',
        templateUrl:'/assets/views/dashboardViews/myAnalytics.html',
        controller:'myAnalyticsCtrl',
        reloadOnSearch:false
    }).when('/myPredictor',{
        url:'/myPredictor',
        templateUrl:'/assets/views/dashboardViews/myPredictor.html',
        controller:'myPredictorCtrl',
        reloadOnSearch:false
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
                
                statusLogin=true;
                logoutStatus=false;
                console.log('user successfully logged in');
            }
        }).catch(function(err){
            console.log(err);
            console.log(err.code);
            console.log(err.message);
            alert(err.message);
        });

        $interval(function(){//$interval(fn, delay, [count], [invokeApply], [Pass]);
            if(statusLogin){
                // $location.path('/myProfile');
                // myPath='/myProfile';
                $location.path(myPath);
                // myPath='';
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
                    $location.path('/myProfile');
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
            statusLogin=false;
            logoutStatus=true;
        }).catch(function(err){
            console.log(err);
            alert(err.message);
        });
    };

    $interval(function(){

        if(statusLogin){
            $scope.navVariable=false; //{{ng-hide=false}}
        }

        if(!statusLogin && logoutStatus){
            // logoutStatus=false;
            $scope.navVariable=true;
            myPath='/';
            logoutStatus=false;
            statusLogin=false;
            // $location.path('/login');
            $location.path(myPath);
            $location.replace();//for setting the current url to stop user from 
                                //going back to app after logout
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
    
    $scope.myProfile=function(){
        // $location.path('/settings');
        myPath='/myProfile';
        $location.path(myPath);
    }
});

app.controller('myHistoryCtrl',function($scope,$location,$firebaseObject,$interval){

    console.log('hello from myHistory controller');
    $location.replace();

    var uid=firebase.auth().currentUser.uid;

    $scope.class5MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class5');
        var obj=$firebaseObject(ref);

        // var marks={
        //     english:$scope.class5English,
        //     urdu:$scope.class5Urdu,
        //     maths:$scope.class5Maths,
        //     science:$scope.class5Science,
        //     islamiat:$scope.class5Islamiat,
        //     computer:$scope.class5Computer,
        //     pakistanStudies:$scope.class5Pkstd
        // };

        ref.set({
            english:$scope.class5English,
            urdu:$scope.class5Urdu,
            maths:$scope.class5Maths,
            science:$scope.class5Science,
            islamiat:$scope.class5Islamiat,
            computer:$scope.class5Computer,
            pakistanStudies:$scope.class5Pkstd
        });

        alert('marks of class 5 has been updated successfully');
    }
    
    $scope.class6MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class6');
        var obj=$firebaseObject(ref);

        ref.set({
            english:$scope.class6English,
            urdu:$scope.class6Urdu,
            maths:$scope.class6Maths,
            science:$scope.class6Science,
            islamiat:$scope.class6Islamiat,
            computer:$scope.class6Computer,
            pakistanStudies:$scope.class6Pkstd
        });

        alert('marks of class 6 has been updated successfully');
    }

    $scope.class7MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class7');
        var obj=$firebaseObject(ref);

        ref.set({
            english:$scope.class7English,
            urdu:$scope.class7Urdu,
            maths:$scope.class7Maths,
            science:$scope.class7Science,
            islamiat:$scope.class7Islamiat,
            computer:$scope.class7Computer,
            pakistanStudies:$scope.class7Pkstd
        });

        alert('marks of class 7 has been updated successfully');
    }

    $scope.class8MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class8');
        var obj=$firebaseObject(ref);

        if($scope.class8Biology==='' || $scope.class8Biology=='' || $scope.class8Biology==null){
            $scope.class8Biology='';
        }
        if($scope.class8Computer==='' || $scope.class8Computer=='' || $scope.class8Computer==null){
            $scope.class8Computer='';
        }

        ref.set({
            english:$scope.class8English,
            urdu:$scope.class8Urdu,
            maths:$scope.class8Maths,
            biology:$scope.class8Biology,
            physics:$scope.class8Physics,
            chemistry:$scope.class8Chemistry,
            islamiat:$scope.class8Islamiat,
            computer:$scope.class8Computer,
            pakistanStudies:$scope.class8Pkstd
        });

        alert('marks of class 8 has been updated successfully');
    }

    $scope.class9MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class9');
        var obj=$firebaseObject(ref);

        
        if($scope.class9Biology==='' || $scope.class9Biology=='' || $scope.class9Biology==null){
            $scope.class9Biology='';
        }
        if($scope.class9Computer==='' || $scope.class9Computer=='' || $scope.class9Computer==null){
            $scope.class9Computer='';
        }

        ref.set({
            english:$scope.class9English,
            urdu:$scope.class9Urdu,
            maths:$scope.class9Maths,
            biology:$scope.class9Biology,
            physics:$scope.class9Physics,
            chemistry:$scope.class9Chemistry,
            islamiat:$scope.class9Islamiat,
            computer:$scope.class9Computer,
            pakistanStudies:$scope.class9Pkstd
        });

        alert('marks of class 9 has been updated successfully');
    }

    $scope.class10MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class10');
        var obj=$firebaseObject(ref);

        
        if($scope.class10Biology==='' || $scope.class10Biology=='' || $scope.class10Biology==null){
            $scope.class10Biology='';
        }
        if($scope.class10Computer==='' || $scope.class10Computer=='' || $scope.class10Computer==null){
            $scope.class10Computer='';
        }

        ref.set({
            english:$scope.class10English,
            urdu:$scope.class10Urdu,
            maths:$scope.class10Maths,
            biology:$scope.class10Biology,
            physics:$scope.class10Physics,
            chemistry:$scope.class10Chemistry,
            islamiat:$scope.class10Islamiat,
            computer:$scope.class10Computer,
            pakistanStudies:$scope.class10Pkstd
        });

        alert('marks of class 10 has been updated successfully');
    }

    $scope.class11MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class11');
        var obj=$firebaseObject(ref);

        
        if($scope.class11Biology==='' || $scope.class11Biology=='' || $scope.class11Biology==null){
            $scope.class11Biology='';
        }
        if($scope.class11Chemistry==='' || $scope.class11Chemistry=='' || $scope.class11Chemistry==null){
            $scope.class11Chemistry='';
        }
        if($scope.class11Computer==='' || $scope.class11Computer=='' || $scope.class11Computer==null){
            $scope.class11Computer='';
        }

        ref.set({
            english:$scope.class11English,
            urdu:$scope.class11Urdu,
            maths:$scope.class11Maths,
            biology:$scope.class11Biology,
            physics:$scope.class11Physics,
            chemistry:$scope.class11Chemistry,
            islamiat:$scope.class11Islamiat,
            computer:$scope.class11Computer,
            pakistanStudies:$scope.class11Pkstd
        });

        alert('marks of class 11 has been updated successfully');
    }

    $scope.class12MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('class12');
        var obj=$firebaseObject(ref);

        
        if($scope.class12Biology==='' || $scope.class12Biology=='' || $scope.class12Biology==null){
            $scope.class12Biology='';
        }
        if($scope.class12Chemistry==='' || $scope.class12Chemistry=='' || $scope.class12Chemistry==null){
            $scope.class12Chemistry='';
        }
        if($scope.class12Computer==='' || $scope.class12Computer=='' || $scope.class12Computer==null){
            $scope.class12Computer='';
        }

        ref.set({
            english:$scope.class12English,
            urdu:$scope.class12Urdu,
            maths:$scope.class12Maths,
            biology:$scope.class12Biology,
            physics:$scope.class12Physics,
            chemistry:$scope.class12Chemistry,
            islamiat:$scope.class12Islamiat,
            computer:$scope.class12Computer,
            pakistanStudies:$scope.class12Pkstd
        });

        alert('marks of class 12 has been updated successfully');
    }
    
    $interval(function(){
        if(!statusLogin){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});

app.controller('myAnalyticsCtrl',function($scope,$location,$firebaseObject,$firebaseArray,$interval){
    console.log('hello from myAnalyticsCtrl');
    $location.replace();

    var uid=firebase.auth().currentUser.uid;//for getting uid
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class5');
    var obj5=$firebaseObject(ref);//for converting firebase object to json
    // console.log(obj5);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class6');
    var obj6=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class7');
    var obj7=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class8');
    var obj8=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class9');
    var obj9=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class10');
    var obj10=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class11');
    var obj11=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class12');
    var obj12=$firebaseObject(ref);

    $scope.myDataSource5={
        chart:{
            caption:"Class 5 Results",
            subCaption:"Total Subjects = 7",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:"english",
                value:""+obj5.english
            },
            {
                label:"urdu",
                value:""+obj5.urdu
            },
            {
                label:"maths",
                value:""+obj5.maths
            },
            {
                label:"pakistanStudies",
                value:""+obj5.pakistanStudies
            },
            {
                label:"science",
                value:""+obj5.science
            },
            {
                label:"islamiat",
                value:""+obj5.islamiat
            },
            {
                label:"computer",
                value:""+obj5.computer
            }
        ]
    };
    $scope.myDataSource6={
        chart:{
            caption:'Class 6 Results',
            subCaption:'Total Subjects = 7',
            xAxisName: "subject name",
            yAxisName: '% of marks',
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:String(obj6.english)
            },
            {
                label:'urdu',
                value:String(obj6.urdu)
            },
            {
                label:'maths',
                value:String(obj6.maths)
            },
            {
                label:'pakistanStudies',
                value:String(obj6.pakistanStudies)
            },
            {
                label:'science',
                value:String(obj6.science)
            },
            {
                label:'islamiat',
                value:String(obj6.islamiat)
            },
            {
                label:'computer',
                value:String(obj6.computer)
            }
        ]
    };

    // console.log($scope.myDataSource6);
    // console.log(obj6);

    $scope.myDataSource7={
        chart:{
            caption:'Class 7 Results',
            subCaption:'Total Subjects = 7',
            xAxisName: "subject name",
            yAxisName: '% of marks',
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:obj7.english
            },
            {
                label:'urdu',
                value:obj7.urdu
            },
            {
                label:'maths',
                value:obj7.maths
            },
            {
                label:'pakistanStudies',
                value:obj7.pakistanStudies
            },
            {
                label:'science',
                value:obj7.science
            },
            {
                label:'islamiat',
                value:obj7.islamiat
            },
            {
                label:'computer',
                value:obj7.computer
            }
        ]
    };
    $scope.myDataSource8={
        chart:{
            caption:'Class 8 Results',
            subCaption:'Total Subjects = 8',
            xAxisName: "subject name",
            yAxisName: '% of marks',
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:obj8.english
            },
            {
                label:'urdu',
                value:obj8.urdu
            },
            {
                label:'maths',
                value:obj8.maths
            },
            {
                label:'pakistanStudies',
                value:obj8.pakistanStudies
            },
            {
                label:'biology',
                value:obj8.biology
            },
            {
                label:'physics',
                value:obj8.physics
            },
            {
                label:'chemistry',
                value:obj8.chemistry
            },
            {
                label:'islamiat',
                value:obj8.islamiat
            },
            {
                label:'computer',
                value:obj8.computer
            }
        ]
    };
    $scope.myDataSource9={
        chart:{
            caption:'Class 9 Results',
            subCaption:'Total Subjects = 7',
            xAxisName: "subject name",
            yAxisName: '% of marks',
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:obj9.english
            },
            {
                label:'urdu',
                value:obj9.urdu
            },
            {
                label:'maths',
                value:obj9.maths
            },
            {
                label:'pakistanStudies',
                value:obj9.pakistanStudies
            },
            {
                label:'biology',
                value:obj9.biology
            },
            {
                label:'physics',
                value:obj9.physics
            },
            {
                label:'chemistry',
                value:obj9.chemistry
            },
            {
                label:'islamiat',
                value:obj9.islamiat
            },
            {
                label:'computer',
                value:obj9.computer
            }
        ]
    };
    $scope.myDataSource10={
        chart:{
            caption:'Class 10 Results',
            subCaption:'Total Subjects = 7',
            xAxisName: "subject name",
            yAxisName: '% of marks',
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:obj10.english
            },
            {
                label:'urdu',
                value:obj10.urdu
            },
            {
                label:'maths',
                value:obj10.maths
            },
            {
                label:'pakistanStudies',
                value:obj10.pakistanStudies
            },
            {
                label:'biology',
                value:obj10.biology
            },
            {
                label:'physics',
                value:obj10.physics
            },
            {
                label:'chemistry',
                value:obj10.chemistry
            },
            {
                label:'islamiat',
                value:obj10.islamiat
            },
            {
                label:'computer',
                value:obj10.computer
            }
        ]
    };
    $scope.myDataSource11={
        chart:{
            caption:'Class 11 Results',
            subCaption:'Total Subjects = 6',
            xAxisName: "subject name",
            yAxisName: '% of marks',
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:obj11.english
            },
            {
                label:'urdu',
                value:obj11.urdu
            },
            {
                label:'maths',
                value:obj11.maths
            },
            {
                label:'pakistanStudies',
                value:obj11.pakistanStudies
            },
            {
                label:'biology',
                value:obj11.biology
            },
            {
                label:'physics',
                value:obj11.physics
            },
            {
                label:'chemistry',
                value:obj11.chemistry
            },
            {
                label:'islamiat',
                value:obj11.islamiat
            },
            {
                label:'computer',
                value:obj11.computer
            }
        ]
    };
    $scope.myDataSource12={
        chart:{
            caption:"Class 12 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'english',
                value:obj12.english
            },
            {
                label:'urdu',
                value:obj12.urdu
            },
            {
                label:'maths',
                value:obj12.maths
            },
            {
                label:'pakistanStudies',
                value:obj12.pakistanStudies
            },
            {
                label:'biology',
                value:obj12.biology
            },
            {
                label:'physics',
                value:obj12.physics
            },
            {
                label:'chemistry',
                value:obj12.chemistry
            },
            {
                label:'islamiat',
                value:obj12.islamiat
            },
            {
                label:'computer',
                value:obj12.computer
            }
        ]
    };
    
    $interval(function(){
        $scope.myDataSource5={
            chart:{
                caption:"Class 5 Results",
                subCaption:"Total Subjects = 7",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:"english",
                    value:""+obj5.english
                },
                {
                    label:"urdu",
                    value:""+obj5.urdu
                },
                {
                    label:"maths",
                    value:""+obj5.maths
                },
                {
                    label:"pakistanStudies",
                    value:""+obj5.pakistanStudies
                },
                {
                    label:"science",
                    value:""+obj5.science
                },
                {
                    label:"islamiat",
                    value:""+obj5.islamiat
                },
                {
                    label:"computer",
                    value:""+obj5.computer
                }
            ]
        };
        $scope.myDataSource6={
            chart:{
                caption:'Class 6 Results',
                subCaption:'Total Subjects = 7',
                xAxisName: "subject name",
                yAxisName: '% of marks',
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:String(obj6.english)
                },
                {
                    label:'urdu',
                    value:String(obj6.urdu)
                },
                {
                    label:'maths',
                    value:String(obj6.maths)
                },
                {
                    label:'pakistanStudies',
                    value:String(obj6.pakistanStudies)
                },
                {
                    label:'science',
                    value:String(obj6.science)
                },
                {
                    label:'islamiat',
                    value:String(obj6.islamiat)
                },
                {
                    label:'computer',
                    value:String(obj6.computer)
                }
            ]
        };
    
        // console.log($scope.myDataSource6);
        // console.log(obj6);
    
        $scope.myDataSource7={
            chart:{
                caption:'Class 7 Results',
                subCaption:'Total Subjects = 7',
                xAxisName: "subject name",
                yAxisName: '% of marks',
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:obj7.english
                },
                {
                    label:'urdu',
                    value:obj7.urdu
                },
                {
                    label:'maths',
                    value:obj7.maths
                },
                {
                    label:'pakistanStudies',
                    value:obj7.pakistanStudies
                },
                {
                    label:'science',
                    value:obj7.science
                },
                {
                    label:'islamiat',
                    value:obj7.islamiat
                },
                {
                    label:'computer',
                    value:obj7.computer
                }
            ]
        };
        $scope.myDataSource8={
            chart:{
                caption:'Class 8 Results',
                subCaption:'Total Subjects = 8',
                xAxisName: "subject name",
                yAxisName: '% of marks',
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:obj8.english
                },
                {
                    label:'urdu',
                    value:obj8.urdu
                },
                {
                    label:'maths',
                    value:obj8.maths
                },
                {
                    label:'pakistanStudies',
                    value:obj8.pakistanStudies
                },
                {
                    label:'biology',
                    value:obj8.biology
                },
                {
                    label:'physics',
                    value:obj8.physics
                },
                {
                    label:'chemistry',
                    value:obj8.chemistry
                },
                {
                    label:'islamiat',
                    value:obj8.islamiat
                },
                {
                    label:'computer',
                    value:obj8.computer
                }
            ]
        };
        $scope.myDataSource9={
            chart:{
                caption:'Class 9 Results',
                subCaption:'Total Subjects = 7',
                xAxisName: "subject name",
                yAxisName: '% of marks',
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:obj9.english
                },
                {
                    label:'urdu',
                    value:obj9.urdu
                },
                {
                    label:'maths',
                    value:obj9.maths
                },
                {
                    label:'pakistanStudies',
                    value:obj9.pakistanStudies
                },
                {
                    label:'biology',
                    value:obj9.biology
                },
                {
                    label:'physics',
                    value:obj9.physics
                },
                {
                    label:'chemistry',
                    value:obj9.chemistry
                },
                {
                    label:'islamiat',
                    value:obj9.islamiat
                },
                {
                    label:'computer',
                    value:obj9.computer
                }
            ]
        };
        $scope.myDataSource10={
            chart:{
                caption:'Class 10 Results',
                subCaption:'Total Subjects = 7',
                xAxisName: "subject name",
                yAxisName: '% of marks',
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:obj10.english
                },
                {
                    label:'urdu',
                    value:obj10.urdu
                },
                {
                    label:'maths',
                    value:obj10.maths
                },
                {
                    label:'pakistanStudies',
                    value:obj10.pakistanStudies
                },
                {
                    label:'biology',
                    value:obj10.biology
                },
                {
                    label:'physics',
                    value:obj10.physics
                },
                {
                    label:'chemistry',
                    value:obj10.chemistry
                },
                {
                    label:'islamiat',
                    value:obj10.islamiat
                },
                {
                    label:'computer',
                    value:obj10.computer
                }
            ]
        };
        $scope.myDataSource11={
            chart:{
                caption:'Class 11 Results',
                subCaption:'Total Subjects = 6',
                xAxisName: "subject name",
                yAxisName: '% of marks',
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:obj11.english
                },
                {
                    label:'urdu',
                    value:obj11.urdu
                },
                {
                    label:'maths',
                    value:obj11.maths
                },
                {
                    label:'pakistanStudies',
                    value:obj11.pakistanStudies
                },
                {
                    label:'biology',
                    value:obj11.biology
                },
                {
                    label:'physics',
                    value:obj11.physics
                },
                {
                    label:'chemistry',
                    value:obj11.chemistry
                },
                {
                    label:'islamiat',
                    value:obj11.islamiat
                },
                {
                    label:'computer',
                    value:obj11.computer
                }
            ]
        };
        $scope.myDataSource12={
            chart:{
                caption:"Class 12 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'english',
                    value:obj12.english
                },
                {
                    label:'urdu',
                    value:obj12.urdu
                },
                {
                    label:'maths',
                    value:obj12.maths
                },
                {
                    label:'pakistanStudies',
                    value:obj12.pakistanStudies
                },
                {
                    label:'biology',
                    value:obj12.biology
                },
                {
                    label:'physics',
                    value:obj12.physics
                },
                {
                    label:'chemistry',
                    value:obj12.chemistry
                },
                {
                    label:'islamiat',
                    value:obj12.islamiat
                },
                {
                    label:'computer',
                    value:obj12.computer
                }
            ]
        };

    },1000);//1 second

    $interval(function(){
        if(!statusLogin ){
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
    $location.replace();
    $rootScope.navVariable=false;//now {ng-hide=false}
    
    var uid=firebase.auth().currentUser.uid;

    var ref=firebase.database().ref().child('users').child(uid);
    var obj=$firebaseObject(ref);

    $scope.user=obj;
    
    $interval(function(){
        if(!statusLogin){
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
    $location.replace();

    var uid=firebase.auth().currentUser.uid;//for getting uid
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class5');
    var obj5=$firebaseObject(ref);//for converting firebase object to json
    // console.log(obj5);

    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class6');
    var obj6=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class7');
    var obj7=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class8');
    var obj8=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class9');
    var obj9=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class10');
    var obj10=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class11');
    var obj11=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('class12');
    var obj12=$firebaseObject(ref);

    var english={
        e5:obj5.english,
        e5:obj6.english,
        e5:obj7.english,
        e5:obj8.english,
        e5:obj9.english,
        e5:obj10.english,
        e5:obj11.english,
        e5:obj12.english   
    };
    var urdu={
        e5:obj5.urdu,
        e5:obj6.urdu,
        e5:obj7.urdu,
        e5:obj8.urdu,
        e5:obj9.urdu,
        e5:obj10.urdu,
        e5:obj11.urdu,
        e5:obj12.urdu   
    };
    var maths={
        e5:obj5.maths,
        e5:obj6.maths,
        e5:obj7.maths,
        e5:obj8.maths,
        e5:obj9.maths,
        e5:obj10.maths,
        e5:obj11.maths,
        e5:obj12.maths   
    };
    var science={
        e5:obj5.science,
        e5:obj6.science,
        e5:obj7.science,
        e5:obj8.science,
        e5:obj9.science,
        e5:obj10.science,
        e5:obj11.science,
        e5:obj12.science   
    };
    var physics={
        e5:obj5.physics,
        e5:obj6.physics,
        e5:obj7.physics,
        e5:obj8.physics,
        e5:obj9.physics,
        e5:obj10.physics,
        e5:obj11.physics,
        e5:obj12.physics   
    };
    var biology={
        e5:obj5.biology,
        e5:obj6.biology,
        e5:obj7.biology,
        e5:obj8.biology,
        e5:obj9.biology,
        e5:obj10.biology,
        e5:obj11.biology,
        e5:obj12.biology   
    };
    var chemistry={
        e5:obj5.chemistry,
        e5:obj6.chemistry,
        e5:obj7.chemistry,
        e5:obj8.chemistry,
        e5:obj9.chemistry,
        e5:obj10.chemistry,
        e5:obj11.chemistry,
        e5:obj12.chemistry   
    };
    var islamiat={
        e5:obj5.islamiat,
        e5:obj6.islamiat,
        e5:obj7.islamiat,
        e5:obj8.islamiat,
        e5:obj9.islamiat,
        e5:obj10.islamiat,
        e5:obj11.islamiat,
        e5:obj12.islamiat   
    };
    var computer={
        e5:obj5.computer,
        e5:obj6.computer,
        e5:obj7.computer,
        e5:obj8.computer,
        e5:obj9.computer,
        e5:obj10.computer,
        e5:obj11.computer,
        e5:obj12.computer   
    };
    var pakistanStudies={
        e5:obj5.pakistanStudies,
        e5:obj6.pakistanStudies,
        e5:obj7.pakistanStudies,
        e5:obj8.pakistanStudies,
        e5:obj9.pakistanStudies,
        e5:obj10.pakistanStudies,
        e5:obj11.pakistanStudies,
        e5:obj12.pakistanStudies   
    };

    $scope.predictMyResult=function(){
        console.log('selected subject = ',$scope.selectedSubject);
    }
    
    $interval(function(){
        if(!statusLogin){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);
});

