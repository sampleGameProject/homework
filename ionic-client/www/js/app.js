// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

.service("AppData",function(){
    var demo = createDemo();

    this.sheets = demo.sheets;
    this.subjects = demo.subjects;
    this.profile = demo.profile;
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

    .state('app', {
      url: "/app",
      abstract: true,
      templateUrl: "templates/menu.html",
      controller: 'AppController'
    })

    .state('app.sheet', {
      url: "/sheet/:sheetId",
      views: {
        'menuContent' :{
            templateUrl: "templates/sheet.html",
            controller:"SheetController"
        }
      }
    })

    .state('app.subject', {
      url: "/subject/:subjectId",
      views: {
        'menuContent' :{
            templateUrl: "templates/subject.html",
            controller:"SubjectController"
        }
      }
    })
    
    .state('app.profile', {
      url: "/profile",
      views: {
        'menuContent' :{
            templateUrl: "templates/profile.html",
            controller:"ProfileController"
        }
      }
    });
    
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

