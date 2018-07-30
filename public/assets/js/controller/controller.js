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
            $scope.class8Biology='0';
        }
        if($scope.class8Computer==='' || $scope.class8Computer=='' || $scope.class8Computer==null){
            $scope.class8Computer='0';
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
            $scope.class9Biology='0';
        }
        if($scope.class9Computer==='' || $scope.class9Computer=='' || $scope.class9Computer==null){
            $scope.class9Computer='0';
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
            $scope.class10Biology='0';
        }
        if($scope.class10Computer==='' || $scope.class10Computer=='' || $scope.class10Computer==null){
            $scope.class10Computer='0';
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
            $scope.class11Biology='0';
        }
        if($scope.class11Chemistry==='' || $scope.class11Chemistry=='' || $scope.class11Chemistry==null){
            $scope.class11Chemistry='0';
        }
        if($scope.class11Computer==='' || $scope.class11Computer=='' || $scope.class11Computer==null){
            $scope.class11Computer='0';
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
            $scope.class12Biology='0';
        }
        if($scope.class12Chemistry==='' || $scope.class12Chemistry=='' || $scope.class12Chemistry==null){
            $scope.class12Chemistry='0';
        }
        if($scope.class12Computer==='' || $scope.class12Computer=='' || $scope.class12Computer==null){
            $scope.class12Computer='0';
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

    
    $scope.semester1MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester1');
        var obj=$firebaseObject(ref);

        if($scope.subject11==='' || $scope.subject11=='' || $scope.subject11==null){
            $scope.subject11='0';
        }
        if($scope.subject12==='' || $scope.subject12=='' || $scope.subject12==null){
            $scope.subject11='0';
        }
        if($scope.subject13==='' || $scope.subject13=='' || $scope.subject13==null){
            $scope.subject11='0';
        }
        if($scope.subject14==='' || $scope.subject14=='' || $scope.subject14==null){
            $scope.subject11='0';
        }
        if($scope.subject15==='' || $scope.subject15=='' || $scope.subject15==null){
            $scope.subject11='0';
        }
        if($scope.subject16==='' || $scope.subject16=='' || $scope.subject16==null){
            $scope.subject11='0';
        }

        ref.set({
            subjectA:$scope.subject11,
            subjectB:$scope.subject12,
            subjectC:$scope.subject13,
            subjectD:$scope.subject14,
            subjectE:$scope.subject15,
            subjectF:$scope.subject16
        });

        alert('marks of semester 1 has been updated successfully');
    }
    
    $scope.semester2MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester2');
        var obj=$firebaseObject(ref);
    
        if($scope.subject21==='' || $scope.subject21=='' || $scope.subject21==null){
            $scope.subject21='0';
        }
        if($scope.subject22==='' || $scope.subject22=='' || $scope.subject22==null){
            $scope.subject22='0';
        }
        if($scope.subject23==='' || $scope.subject23=='' || $scope.subject23==null){
            $scope.subject23='0';
        }
        if($scope.subject24==='' || $scope.subject24=='' || $scope.subject24==null){
            $scope.subject24='0';
        }
        if($scope.subject25==='' || $scope.subject25=='' || $scope.subject25==null){
            $scope.subject25='0';
        }
        if($scope.subject26==='' || $scope.subject26=='' || $scope.subject26==null){
            $scope.subject26='0';
        }

        ref.set({
            subjectA:$scope.subject21,
            subjectB:$scope.subject22,
            subjectC:$scope.subject23,
            subjectD:$scope.subject24,
            subjectE:$scope.subject25,
            subjectF:$scope.subject26
        });

        alert('marks of semester 2 has been updated successfully');
    }
    
    $scope.semester3MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester3');
        var obj=$firebaseObject(ref);
        
        if($scope.subject31==='' || $scope.subject31=='' || $scope.subject31==null){
            $scope.subject31='0';
        }
        if($scope.subject32==='' || $scope.subject32=='' || $scope.subject32==null){
            $scope.subject32='0';
        }
        if($scope.subject33==='' || $scope.subject33=='' || $scope.subject33==null){
            $scope.subject33='0';
        }
        if($scope.subject34==='' || $scope.subject34=='' || $scope.subject34==null){
            $scope.subject34='0';
        }
        if($scope.subject35==='' || $scope.subject35=='' || $scope.subject35==null){
            $scope.subject35='0';
        }
        if($scope.subject36==='' || $scope.subject36=='' || $scope.subject36==null){
            $scope.subject36='0';
        }

        ref.set({
            subjectA:$scope.subject31,
            subjectB:$scope.subject32,
            subjectC:$scope.subject33,
            subjectD:$scope.subject34,
            subjectE:$scope.subject35,
            subjectF:$scope.subject36
        });

        alert('marks of semester 3 has been updated successfully');
    }
    
    $scope.semester4MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester4');
        var obj=$firebaseObject(ref);
        
        if($scope.subject41==='' || $scope.subject41=='' || $scope.subject41==null){
            $scope.subject41='0';
        }
        if($scope.subject42==='' || $scope.subject42=='' || $scope.subject42==null){
            $scope.subject42='0';
        }
        if($scope.subject43==='' || $scope.subject43=='' || $scope.subject43==null){
            $scope.subject43='0';
        }
        if($scope.subject44==='' || $scope.subject44=='' || $scope.subject44==null){
            $scope.subject44='0';
        }
        if($scope.subject45==='' || $scope.subject45=='' || $scope.subject45==null){
            $scope.subject45='0';
        }
        if($scope.subject46==='' || $scope.subject46=='' || $scope.subject46==null){
            $scope.subject46='0';
        }

        ref.set({
            subjectA:$scope.subject41,
            subjectB:$scope.subject42,
            subjectC:$scope.subject43,
            subjectD:$scope.subject44,
            subjectE:$scope.subject45,
            subjectF:$scope.subject46
        });

        alert('marks of semester 4 has been updated successfully');
    }
    
    $scope.semester5MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester5');
        var obj=$firebaseObject(ref);
        
        if($scope.subject51==='' || $scope.subject51=='' || $scope.subject51==null){
            $scope.subject51='0';
        }
        if($scope.subject52==='' || $scope.subject52=='' || $scope.subject52==null){
            $scope.subject52='0';
        }
        if($scope.subject53==='' || $scope.subject53=='' || $scope.subject53==null){
            $scope.subject53='0';
        }
        if($scope.subject54==='' || $scope.subject54=='' || $scope.subject54==null){
            $scope.subject54='0';
        }
        if($scope.subject55==='' || $scope.subject55=='' || $scope.subject55==null){
            $scope.subject55='0';
        }
        if($scope.subject56==='' || $scope.subject56=='' || $scope.subject56==null){
            $scope.subject56='0';
        }

        ref.set({
            subjectA:$scope.subject51,
            subjectB:$scope.subject52,
            subjectC:$scope.subject53,
            subjectD:$scope.subject54,
            subjectE:$scope.subject55,
            subjectF:$scope.subject56
        });

        alert('marks of semester 5 has been updated successfully');
    }
    
    $scope.semester6MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester6');
        var obj=$firebaseObject(ref);
        
        if($scope.subject61==='' || $scope.subject61=='' || $scope.subject61==null){
            $scope.subject61='0';
        }
        if($scope.subject62==='' || $scope.subject62=='' || $scope.subject62==null){
            $scope.subject62='0';
        }
        if($scope.subject63==='' || $scope.subject63=='' || $scope.subject63==null){
            $scope.subject63='0';
        }
        if($scope.subject64==='' || $scope.subject64=='' || $scope.subject64==null){
            $scope.subject64='0';
        }
        if($scope.subject65==='' || $scope.subject65=='' || $scope.subject65==null){
            $scope.subject65='0';
        }
        if($scope.subject66==='' || $scope.subject66=='' || $scope.subject66==null){
            $scope.subject66='0';
        }

        ref.set({
            subjectA:$scope.subject61,
            subjectB:$scope.subject62,
            subjectC:$scope.subject63,
            subjectD:$scope.subject64,
            subjectE:$scope.subject65,
            subjectF:$scope.subject66
        });

        alert('marks of semester 6 has been updated successfully');
    }
    
    $scope.semester7MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester7');
        var obj=$firebaseObject(ref);
        
        if($scope.subject71==='' || $scope.subject71=='' || $scope.subject71==null){
            $scope.subject71='0';
        }
        if($scope.subject72==='' || $scope.subject72=='' || $scope.subject72==null){
            $scope.subject72='0';
        }
        if($scope.subject73==='' || $scope.subject73=='' || $scope.subject73==null){
            $scope.subject73='0';
        }
        if($scope.subject74==='' || $scope.subject74=='' || $scope.subject74==null){
            $scope.subject74='0';
        }
        if($scope.subject75==='' || $scope.subject75=='' || $scope.subject75==null){
            $scope.subject75='0';
        }
        if($scope.subject76==='' || $scope.subject76=='' || $scope.subject76==null){
            $scope.subject76='0';
        }

        ref.set({
            subjectA:$scope.subject71,
            subjectB:$scope.subject72,
            subjectC:$scope.subject73,
            subjectD:$scope.subject74,
            subjectE:$scope.subject75,
            subjectF:$scope.subject76
        });

        alert('marks of semester 7 has been updated successfully');
    }
    
    $scope.semester8MarksUpload=function(){

        var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester8');
        var obj=$firebaseObject(ref);
        
        if($scope.subject81==='' || $scope.subject81=='' || $scope.subject81==null){
            $scope.subject81='0';
        }
        if($scope.subject82==='' || $scope.subject82=='' || $scope.subject82==null){
            $scope.subject82='0';
        }
        if($scope.subject83==='' || $scope.subject83=='' || $scope.subject83==null){
            $scope.subject83='0';
        }
        if($scope.subject84==='' || $scope.subject84=='' || $scope.subject84==null){
            $scope.subject84='0';
        }
        if($scope.subject85==='' || $scope.subject85=='' || $scope.subject85==null){
            $scope.subject85='0';
        }
        if($scope.subject86==='' || $scope.subject86=='' || $scope.subject86==null){
            $scope.subject86='0';
        }

        ref.set({
            subjectA:$scope.subject81,
            subjectB:$scope.subject82,
            subjectC:$scope.subject83,
            subjectD:$scope.subject84,
            subjectE:$scope.subject85,
            subjectF:$scope.subject86
        });

        alert('marks of semester 8 has been updated successfully');
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
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester1');
    var sem1=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester2');
    var sem2=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester3');
    var sem3=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester4');
    var sem4=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester5');
    var sem5=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester6');
    var sem6=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester7');
    var sem7=$firebaseObject(ref);
    
    var ref=firebase.database().ref().child('marksHistory').child(uid).child('semester8');
    var sem8=$firebaseObject(ref);

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
    
    $scope.myDataSourceSem1={
        chart:{
            caption:"Semester 1 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem1.subjectA
            },
            {
                label:'subjectB',
                value:sem1.subjectB
            },
            {
                label:'subjectC',
                value:sem1.subjectC
            },
            {
                label:'subjectD',
                value:sem1.subjectD
            },
            {
                label:'subjectE',
                value:sem1.subjectE
            },
            {
                label:'subjectF',
                value:sem1.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem2={
        chart:{
            caption:"Semester 2 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem2.subjectA
            },
            {
                label:'subjectB',
                value:sem2.subjectB
            },
            {
                label:'subjectC',
                value:sem2.subjectC
            },
            {
                label:'subjectD',
                value:sem2.subjectD
            },
            {
                label:'subjectE',
                value:sem2.subjectE
            },
            {
                label:'subjectF',
                value:sem2.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem3={
        chart:{
            caption:"Semester 3 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem3.subjectA
            },
            {
                label:'subjectB',
                value:sem3.subjectB
            },
            {
                label:'subjectC',
                value:sem3.subjectC
            },
            {
                label:'subjectD',
                value:sem3.subjectD
            },
            {
                label:'subjectE',
                value:sem3.subjectE
            },
            {
                label:'subjectF',
                value:sem3.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem4={
        chart:{
            caption:"Semester 4 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem4.subjectA
            },
            {
                label:'subjectB',
                value:sem4.subjectB
            },
            {
                label:'subjectC',
                value:sem4.subjectC
            },
            {
                label:'subjectD',
                value:sem4.subjectD
            },
            {
                label:'subjectE',
                value:sem4.subjectE
            },
            {
                label:'subjectF',
                value:sem4.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem5={
        chart:{
            caption:"Semester 5 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem5.subjectA
            },
            {
                label:'subjectB',
                value:sem5.subjectB
            },
            {
                label:'subjectC',
                value:sem5.subjectC
            },
            {
                label:'subjectD',
                value:sem5.subjectD
            },
            {
                label:'subjectE',
                value:sem5.subjectE
            },
            {
                label:'subjectF',
                value:sem5.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem6={
        chart:{
            caption:"Semester 6 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem6.subjectA
            },
            {
                label:'subjectB',
                value:sem6.subjectB
            },
            {
                label:'subjectC',
                value:sem6.subjectC
            },
            {
                label:'subjectD',
                value:sem6.subjectD
            },
            {
                label:'subjectE',
                value:sem6.subjectE
            },
            {
                label:'subjectF',
                value:sem6.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem7={
        chart:{
            caption:"Semester 7 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem7.subjectA
            },
            {
                label:'subjectB',
                value:sem7.subjectB
            },
            {
                label:'subjectC',
                value:sem7.subjectC
            },
            {
                label:'subjectD',
                value:sem7.subjectD
            },
            {
                label:'subjectE',
                value:sem7.subjectE
            },
            {
                label:'subjectF',
                value:sem7.subjectF
            }
        ]
    };
    
    $scope.myDataSourceSem8={
        chart:{
            caption:"Semester 8 Results",
            subCaption:"Total Subjects = 6",
            xAxisName: "subject name",
            yAxisName: "% of marks",
            theme:"fint"
        },
        data:[
            {
                label:'subjectA',
                value:sem8.subjectA
            },
            {
                label:'subjectB',
                value:sem8.subjectB
            },
            {
                label:'subjectC',
                value:sem8.subjectC
            },
            {
                label:'subjectD',
                value:sem8.subjectD
            },
            {
                label:'subjectE',
                value:sem8.subjectE
            },
            {
                label:'subjectF',
                value:sem8.subjectF
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
        
        $scope.myDataSourceSem1={
            chart:{
                caption:"Semester 1 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem1.subjectA
                },
                {
                    label:'subjectB',
                    value:sem1.subjectB
                },
                {
                    label:'subjectC',
                    value:sem1.subjectC
                },
                {
                    label:'subjectD',
                    value:sem1.subjectD
                },
                {
                    label:'subjectE',
                    value:sem1.subjectE
                },
                {
                    label:'subjectF',
                    value:sem1.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem2={
            chart:{
                caption:"Semester 2 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem2.subjectA
                },
                {
                    label:'subjectB',
                    value:sem2.subjectB
                },
                {
                    label:'subjectC',
                    value:sem2.subjectC
                },
                {
                    label:'subjectD',
                    value:sem2.subjectD
                },
                {
                    label:'subjectE',
                    value:sem2.subjectE
                },
                {
                    label:'subjectF',
                    value:sem2.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem3={
            chart:{
                caption:"Semester 3 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem3.subjectA
                },
                {
                    label:'subjectB',
                    value:sem3.subjectB
                },
                {
                    label:'subjectC',
                    value:sem3.subjectC
                },
                {
                    label:'subjectD',
                    value:sem3.subjectD
                },
                {
                    label:'subjectE',
                    value:sem3.subjectE
                },
                {
                    label:'subjectF',
                    value:sem3.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem4={
            chart:{
                caption:"Semester 4 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem4.subjectA
                },
                {
                    label:'subjectB',
                    value:sem4.subjectB
                },
                {
                    label:'subjectC',
                    value:sem4.subjectC
                },
                {
                    label:'subjectD',
                    value:sem4.subjectD
                },
                {
                    label:'subjectE',
                    value:sem4.subjectE
                },
                {
                    label:'subjectF',
                    value:sem4.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem5={
            chart:{
                caption:"Semester 5 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem5.subjectA
                },
                {
                    label:'subjectB',
                    value:sem5.subjectB
                },
                {
                    label:'subjectC',
                    value:sem5.subjectC
                },
                {
                    label:'subjectD',
                    value:sem5.subjectD
                },
                {
                    label:'subjectE',
                    value:sem5.subjectE
                },
                {
                    label:'subjectF',
                    value:sem5.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem6={
            chart:{
                caption:"Semester 6 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem6.subjectA
                },
                {
                    label:'subjectB',
                    value:sem6.subjectB
                },
                {
                    label:'subjectC',
                    value:sem6.subjectC
                },
                {
                    label:'subjectD',
                    value:sem6.subjectD
                },
                {
                    label:'subjectE',
                    value:sem6.subjectE
                },
                {
                    label:'subjectF',
                    value:sem6.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem7={
            chart:{
                caption:"Semester 7 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem7.subjectA
                },
                {
                    label:'subjectB',
                    value:sem7.subjectB
                },
                {
                    label:'subjectC',
                    value:sem7.subjectC
                },
                {
                    label:'subjectD',
                    value:sem7.subjectD
                },
                {
                    label:'subjectE',
                    value:sem7.subjectE
                },
                {
                    label:'subjectF',
                    value:sem7.subjectF
                }
            ]
        };
        
        $scope.myDataSourceSem8={
            chart:{
                caption:"Semester 8 Results",
                subCaption:"Total Subjects = 6",
                xAxisName: "subject name",
                yAxisName: "% of marks",
                theme:"fint"
            },
            data:[
                {
                    label:'subjectA',
                    value:sem8.subjectA
                },
                {
                    label:'subjectB',
                    value:sem8.subjectB
                },
                {
                    label:'subjectC',
                    value:sem8.subjectC
                },
                {
                    label:'subjectD',
                    value:sem8.subjectD
                },
                {
                    label:'subjectE',
                    value:sem8.subjectE
                },
                {
                    label:'subjectF',
                    value:sem8.subjectF
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

app.controller('myPredictorCtrl',function($scope,$location,$firebaseObject,$interval,$http){
    console.log('hello from myPredictorCtrl');
    $location.replace();

    $scope.outcomeHider=true;

    $scope.schoolLevel=true;
    $scope.collegeLevel=true;
    $scope.universityLevel=true;

    //for getting average % of each class and semester
    var resultOf5,resultOf6,resultOf7,resultOf8,resultOf9,resultOf10,resultOf11,resultOf12,
    resultOfSem1,resultOfSem2,resultOfSem3,resultOfSem4,resultOfSem5,resultOfSem6,resultOfSem7,resultOfSem8;

    var myResultArr=[];//for storing all results in a single array for regression method

    var uid=firebase.auth().currentUser.uid;//for getting uid
    
    var ref5=firebase.database().ref().child('marksHistory').child(uid).child('class5');
    // var obj5=$firebaseObject(ref);//for converting firebase object to json
    // console.log(obj5);
    // $scope.obj5=obj5;
    // console.log($scope.obj5);
    var obj5=[];
    ref5.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj5.push(item);
        });
        // obj5=snapshot.val();
        // console.log('obj5[5] = ',obj5[5]);
        if(obj5===null){
            obj5=[0,0,0,0,0,0,0,0];
        }
        // console.log('obj5[5] = ',obj5[5]);
        resultOf5=(
            parseInt(obj5[0])+
            parseInt(obj5[1])+
            parseInt(obj5[2])+
            parseInt(obj5[3])+
            parseInt(obj5[4])+
            parseInt(obj5[5])+
            parseInt(obj5[6])
        )/7;
        console.log('resultOf5=',parseInt(resultOf5) );
        if(resultOf5!=null){
            myResultArr.push(parseInt(resultOf5));
        }
    });
    // console.log('obj5='+obj5);

    var ref6=firebase.database().ref().child('marksHistory').child(uid).child('class6');
    // var obj6=$firebaseObject(ref);
    var obj6=[];
    ref6.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj6.push(item);
        });
        // obj6=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(obj6===null){
            obj6=[0,0,0,0,0,0,0,0];
        }

        resultOf6=(
            parseInt(obj6[0])+
            parseInt(obj6[1])+
            parseInt(obj6[2])+
            parseInt(obj6[3])+
            parseInt(obj6[4])+
            parseInt(obj6[5])+
            parseInt(obj6[6])
        )/7;
        console.log('resultOf6=',parseInt(resultOf6) );
        if(resultOf6!=null){
            myResultArr.push(parseInt(resultOf6));
        }
    });
    
    var ref7=firebase.database().ref().child('marksHistory').child(uid).child('class7');
    // var obj7=$firebaseObject(ref);
    var obj7=[];
    ref7.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj7.push(item);
        });
        // obj7=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(obj7===null){
            obj7=[0,0,0,0,0,0,0,0];
        }

        resultOf7=(
            parseInt(obj7[0])+
            parseInt(obj7[1])+
            parseInt(obj7[2])+
            parseInt(obj7[3])+
            parseInt(obj7[4])+
            parseInt(obj7[5])+
            parseInt(obj7[6])
        )/7;
        if(resultOf7!=null){
            myResultArr.push(parseInt(resultOf7));
        }
    });
    
    var ref8=firebase.database().ref().child('marksHistory').child(uid).child('class8');
    // var obj8=$firebaseObject(ref);
    var obj8=[];
    ref8.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj8.push(item);
        });
        // obj8=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(obj8===null){
            obj8=[0,0,0,0,0,0,0,0];
        }

        resultOf8=(
            parseInt(obj8[0])+
            parseInt(obj8[1])+
            parseInt(obj8[2])+
            parseInt(obj8[3])+
            parseInt(obj8[4])+
            parseInt(obj8[5])+
            parseInt(obj8[6])+
            parseInt(obj8[7])+
            parseInt(obj8[8])
        )/9;
        if(resultOf8!=null){
            myResultArr.push(parseInt(resultOf8));
        }
    });
    
    var ref9=firebase.database().ref().child('marksHistory').child(uid).child('class9');
    // var obj9=$firebaseObject(ref);
    var obj9=[];
    ref9.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj9.push(item);
        });
        // obj9=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(obj9===null){
            obj9=[0,0,0,0,0,0,0,0];
        }

        resultOf9=(
            parseInt(obj9[0])+
            parseInt(obj9[1])+
            parseInt(obj9[2])+
            parseInt(obj9[3])+
            parseInt(obj9[4])+
            parseInt(obj9[5])+
            parseInt(obj9[6])+
            parseInt(obj9[7])
        )/7;
        if(resultOf9!=null){
            myResultArr.push(parseInt(resultOf9));
        }
    });

    var ref10=firebase.database().ref().child('marksHistory').child(uid).child('class10');
    // var obj10=$firebaseObject(ref);
    var obj10=[];
    ref10.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj10.push(item);
        });
        // obj10=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(obj10===null){
            obj10=[0,0,0,0,0,0,0,0];
        }
        resultOf10=(
            parseInt(obj10[0])+
            parseInt(obj10[1])+
            parseInt(obj10[2])+
            parseInt(obj10[3])+
            parseInt(obj10[4])+
            parseInt(obj10[5])+
            parseInt(obj10[6])+
            parseInt(obj10[7])
        )/7;
        if(resultOf10!=null){
            myResultArr.push(parseInt(resultOf10));
        }
    });
    
    var ref11=firebase.database().ref().child('marksHistory').child(uid).child('class11');
    // var obj11=$firebaseObject(ref);
    var obj11=[];
    ref11.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj11.push(item);
        });
        // obj11=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(obj11===null){
            obj11=[0,0,0,0,0,0,0];
        }

        resultOf11=(
            parseInt(obj11[0])+
            parseInt(obj11[1])+
            parseInt(obj11[2])+
            parseInt(obj11[3])+
            parseInt(obj11[4])+
            parseInt(obj11[5])+
            parseInt(obj11[6])
        )/6;
        if(resultOf11!=null){
            myResultArr.push(parseInt(resultOf11));
        }
    });
    
    var ref12=firebase.database().ref().child('marksHistory').child(uid).child('class12');
    // var obj12=$firebaseObject(ref);
    var obj12=[];
    ref12.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            obj12.push(item);
        });
        // obj12=snapshot.val();
        if(obj12===null){
            obj12=[0,0,0,0,0,0,0];
        }

        resultOf12=(
            parseInt(obj12[0])+
            parseInt(obj12[1])+
            parseInt(obj12[2])+
            parseInt(obj12[3])+
            parseInt(obj12[4])+
            parseInt(obj12[5])+
            parseInt(obj12[6])
        )/6;
        // console.log('obj5 = ',obj5);
        if(resultOf12!=null){
            myResultArr.push(parseInt(resultOf12));
        }
    });
    
    var refSem1=firebase.database().ref().child('marksHistory').child(uid).child('semester1');
    // var sem1=$firebaseObject(ref);
    var sem1=[];
    refSem1.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem1.push(item);
        });
        // sem1=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem1===null){
            sem1=[0,0,0,0,0,0];
        }
        
        resultOfSem1=(
            parseInt(sem1[0])+
            parseInt(sem1[1])+
            parseInt(sem1[2])+
            parseInt(sem1[3])+
            parseInt(sem1[4])+
            parseInt(sem1[5])
        )/counter(sem1);
        if(resultOfSem1!=null){
            myResultArr.push(parseInt(resultOfSem1));
        }
    });
    
    var refSem2=firebase.database().ref().child('marksHistory').child(uid).child('semester2');
    // var sem2=$firebaseObject(ref);
    var sem2=[];
    refSem2.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem2.push(item);
        });
        // sem2=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem2===null){
            sem2=[0,0,0,0,0,0];
        }
        
        resultOfSem2=(
            parseInt(sem2[0])+
            parseInt(sem2[1])+
            parseInt(sem2[2])+
            parseInt(sem2[3])+
            parseInt(sem2[4])+
            parseInt(sem2[5])
        )/counter(sem2);
        if(resultOfSem2!=null){
            myResultArr.push(parseInt(resultOfSem2));
        }
    });
    
    var refSem3=firebase.database().ref().child('marksHistory').child(uid).child('semester3');
    // var sem3=$firebaseObject(ref);
    var sem3=[];
    refSem3.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem3.push(item);
        });
        // sem3=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem3===null){
            sem3=[0,0,0,0,0,0];
        }
        
        resultOfSem3=(
            parseInt(sem3[0])+
            parseInt(sem3[1])+
            parseInt(sem3[2])+
            parseInt(sem3[3])+
            parseInt(sem3[4])+
            parseInt(sem3[5])
        )/counter(sem3);
        if(resultOfSem3!=null){
            myResultArr.push(parseInt(resultOfSem3));
        }
    });
    
    var refSem4=firebase.database().ref().child('marksHistory').child(uid).child('semester4');
    // var sem4=$firebaseObject(ref);
    var sem4=[];
    refSem4.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem4.push(item);
        });
        // sem4=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem4===null){
            sem4=[0,0,0,0,0,0];
        }
        
        resultOfSem4=(
            parseInt(sem4[0])+
            parseInt(sem4[1])+
            parseInt(sem4[2])+
            parseInt(sem4[3])+
            parseInt(sem4[4])+
            parseInt(sem4[5])
        )/counter(sem4);
        if(resultOfSem4!=null){
            myResultArr.push(parseInt(resultOfSem4));
        }
    });
    
    var refSem5=firebase.database().ref().child('marksHistory').child(uid).child('semester5');
    // var sem5=$firebaseObject(ref);
    var sem5=[];
    refSem5.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem5.push(item);
        });
        // sem5=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem5===null){
            sem5=[0,0,0,0,0,0];
        }
        
        resultOfSem5=(
            parseInt(sem5[0])+
            parseInt(sem5[1])+
            parseInt(sem5[2])+
            parseInt(sem5[3])+
            parseInt(sem5[4])+
            parseInt(sem5[5])
        )/counter(sem5);
        if(resultOfSem5!=null){
            myResultArr.push(parseInt(resultOfSem5));
        }
    });
    
    var refSem6=firebase.database().ref().child('marksHistory').child(uid).child('semester6');
    // var sem6=$firebaseObject(ref);
    var sem6=[];
    refSem6.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem6.push(item);
        });
        // sem6=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem6===null){
            sem6=[0,0,0,0,0,0];
        }
        
        resultOfSem6=(
            parseInt(sem6[0])+
            parseInt(sem6[1])+
            parseInt(sem6[2])+
            parseInt(sem6[3])+
            parseInt(sem6[4])+
            parseInt(sem6[5])
        )/counter(sem6);
        if(resultOfSem6!=null){
            myResultArr.push(parseInt(resultOfSem6));
        }
    });
    
    var refSem7=firebase.database().ref().child('marksHistory').child(uid).child('semester7');
    // var sem7=$firebaseObject(ref);
    var sem7=[];
    refSem7.once('value',function(snapshot){
        // console.log(snapshot.val());
        snapshot.forEach(function(element) {
            var item=element.val();
            sem7.push(item);
        });
        // sem7=snapshot.val();
        // console.log('obj5 = ',obj5);
        if(sem7===null){
            sem7=[0,0,0,0,0,0];
        }
        
        resultOfSem7=(
            parseInt(sem7[0])+
            parseInt(sem7[1])+
            parseInt(sem7[2])+
            parseInt(sem7[3])+
            parseInt(sem7[4])+
            parseInt(sem7[5])
        )/counter(sem7);
        if(resultOfSem7!=null){
            myResultArr.push(parseInt(resultOfSem7));
        }
    });

    // console.log(myResultArr);

    function counter(x){//for counting subjects of a semester which are non zero
        // console.log(x);
        var c=6;

        if(x[0]==="0"){
            c--;
        }
        if(x[1]==="0"){
            c--;
        }
        if(x[2]==="0"){
            c--;
        }
        if(x[3]==="0"){
            c--;
        }
        if(x[4]==="0"){
            c--;
        }
        if(x[5]==="0"){
            c--;
        }

        // console.log('c=');
        return c;
    }




    $scope.predictMyResult=function(){

        console.log('selected level = ',$scope.selectedLevel);
        console.log('selected class = ',$scope.selectedClass);
        // console.clear();

        var level=$scope.selectedLevel;
        var classNo=$scope.selectedClass;

        if(classNo>=9 && classNo<=12){
            var data={
                array:myResultArr,
                targetClass:classNo-5
            }
        }else{
            var data={
                array:myResultArr,
                targetClass:parseInt(classNo)+7
            }            
        }

        // console.log(myResultArr);
        
        if(level!=undefined || classNo!=undefined){
            $http.post('/brainsJsPredicterApi',data).then(function(response){
                console.log('posted successfully');
                console.log('response.data.avg = ',response.data.avg);
                
                $scope.outcomeHider=false;
                $scope.finalResult=response.data.avg;

                if (level==='university'){
                    $scope.finalResult='GPA : '+(response.data.avg)*(4)/100;
                }

    
            }).catch(function(response){
                console.log('error in posting');
            });
        }else{
            alert('choose level of education and class first to perform prediction');
        }

    }
    
    $interval(function(){
        

        if($scope.selectedLevel==="university"){
            $scope.universityLevel=false;
            $scope.schoolLevel=true;
            $scope.collegeLevel=true;
        }else if($scope.selectedLevel==="school"){
            $scope.schoolLevel=false;
            $scope.universityLevel=true;
            $scope.collegeLevel=true;
        }else if($scope.selectedLevel==="college"){
            $scope.collegeLevel=false;
            $scope.universityLevel=true;
            $scope.schoolLevel=true;
        }

        if(!statusLogin){
            // $location.path('/myProfile');
            myPath='/'
            $location.path(myPath);
            $location.replace();
            $scope.$apply;
        }
    },1);

});

