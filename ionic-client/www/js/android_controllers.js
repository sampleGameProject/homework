/**
 * Created by admin on 25.08.2014.
 */

angular.module('starter.controllers', [])

.controller('LoginController',function($scope,$state){
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

.controller('AppController',function($state){
    console.log("test AppController");
})


.controller('MainController', function ($scope, AppData,$ionicViewService) {

    $ionicViewService.clearHistory();

    $scope.menuItems = [{
        name : "Ведомости",
        items : AppData.sheets,
        link: "#/sheet/"
    },  {
        name : "Предметы",
        items : AppData.subjects,
        link: "#/subject/"
    },  {
        name : "Профиль",
        items : [],
        link: "#/profile/"
    }];

    $scope.activeItem = $scope.menuItems[0];

    $scope.selectMenuItem = function(menuItem, index) {
        $scope.activeItem = menuItem;
    };

    console.log("test MainController");
})

.controller('SheetController', function($scope,AppData, $stateParams,$ionicNavBarDelegate) {
    console.log("test SheetController");

    $scope.sheets = AppData.sheets;

    for(var i = 0; i < $scope.sheets.length; i++){
        var current = $scope.sheets[i];

        if(current.id == $stateParams.sheetId){
            $scope.groups = current.groups;
            $scope.dataSource = new SheetTableDataSource(current);
            $scope.activeSection = $scope.dataSource.getGroupTableSection($scope.groups[0]);
            break;
        }
    }

//    $scope.activeGroupChange = function(group) {
//
//    };
//
//    $scope.selectGroupSection = function(group){
//        $scope.activeGroup = group;
//        $scope.activeSection = $scope.dataSource.getGroupTableSection($scope.activeGroup);
//        $scope.toggleSpinner();
//        $scope.updateTable();
//    };
//
//    $scope.selectGroupSection($scope.groups[0]);

    $scope.selectOptions = visits;

    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };

    $scope.showSpinner = false;

    $scope.toggleSpinner = function(){
        $scope.showSpinner = !$scope.showSpinner;
    };

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