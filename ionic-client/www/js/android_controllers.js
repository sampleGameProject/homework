/**
 * Created by admin on 25.08.2014.
 */

angular.module('starter.controllers', [])

.controller('LoginController',function($scope,$stateParams,$state){
    console.log("test LoginController");
    $scope.loginData = {};

    $scope.doLogin = function () {
        $state.go("loading");
    };
})

.controller('LoadingController',function($state){
    console.log("test LoadingController");

    setTimeout(function(){
        $state.go('main');
    }, 1000);
})

//.controller('AppController', function($scope, AppData) {
//
//
//    console.log("test AppController");
//})

.controller('MainController', function ($scope, AppData) {

    $scope.sheets = AppData.sheets;
    $scope.subjects = AppData.subjects;
    $scope.profile = AppData.profile;

    $scope.menuItems = [{
        name : "Ведомости",
        items : AppData.sheets,
        link: "#/app/sheet/"
    },  {
        name : "Предметы",
        items : AppData.subjects,
        link: "#/app/subject/"
    },  {
        name : "Профиль",
        items : [],
        link: "#/app/profile/"
    }];

    $scope.activeItem = $scope.menuItems[0];

    $scope.selectMenuItem = function(menuItem, index) {
        $scope.activeItem = menuItem;
    };

    console.log("test MainController");
})

.controller('SheetController', function($scope, AppData, $stateParams,$ionicScrollDelegate) {
    console.log("test SheetController");

    $scope.selectedItem = null;
    for(var i = 0; i < $scope.sheets.length; i++){
        var current = $scope.sheets[i];

        if(current.id == $stateParams.sheetId){
            $scope.selectedItem = current;
            $scope.activeDataSource = new SheetTableDataSource(current);
            break;
        }
    }

    $scope.gotScrolledHeader = function () {
        //var scrollPos = $ionicScrollDelegate.$getByHandle("header").getScrollPosition();
        //$ionicScrollDelegate.$getByHandle("content").scrollTo(scrollPos.left, 0, false);
    };


    $scope.gotScrolledContent = function () {

        var scrollPos = $ionicScrollDelegate.$getByHandle("content").getScrollPosition();
        $ionicScrollDelegate.$getByHandle("header").scrollTo(scrollPos.left, 0, false);
    };

    $scope.selectOptions = visits;
})

.controller('SubjectController',function($scope, AppData, $stateParams){

    $scope.selectedItem = null;

    for(var i = 0; i < $scope.subjects.length; i++){
        var current = $scope.subjects[i];

        if(current.id == $stateParams.subjectId){
            $scope.selectedItem = current;
            $scope.activeSubject = current;
            break;
        }
    }
})

.controller('ProfileController',function($scope,AppData){
    $scope.selectedItem = null;
    $scope.selectedItem = AppData.profile;
});