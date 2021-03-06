/**
 * Created by admin on 25.08.2014.
 */

angular.module('starter', ['ionic', 'starter.controllers'])

.service("AppData",function(){
    var demo = createDemo();

    this.sheets = demo.sheets;
    this.subjects = demo.subjects;
    this.profile = demo.profile;

    console.log("init AppData");

    this.getSheetById = function(id){
        for(var i = 0; i < this.sheets.length; i++){
            var current = this.sheets[i];

            if(current.id == id){
                return current;
            }
        }
        return null;
    };
})


.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('login',{
            url: "/login",
            templateUrl: "templates/login.html",
            controller: 'LoginController'
        })

        .state('loading', {
            url: "/loading",
            templateUrl: "templates/loading.html",
            controller: 'LoadingController'
        })

        .state('main', {
            url: "/main",
            templateUrl: "templates/android/app_main.html",
            controller: 'MainController'
        })

        .state('sheet', {
            url: "/sheet/:sheetId",
            templateUrl: "templates/sheet.html",
            controller: 'SheetController'
        });

//            .state('app.subject', {
//                url: "/subject/:subjectId",
//                views: {
//                    'menuContent' :{
//                        templateUrl: "templates/subject.html",
//                        controller:"SubjectController"
//                    }
//                }
//            })
//
//            .state('app.profile', {
//                url: "/profile",
//                views: {
//                    'menuContent' :{
//                        templateUrl: "templates/profile.html",
//                        controller:"ProfileController"
//                    }
//                }
//            });

    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/login');
})

.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
});
