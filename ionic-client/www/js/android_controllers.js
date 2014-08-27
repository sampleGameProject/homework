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

.controller('SheetController', function($scope,AppData, $stateParams,$ionicScrollDelegate,$ionicNavBarDelegate) {
    console.log("test SheetController");

    $scope.sheets = AppData.sheets;

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

    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };

    setTimeout(function(){
        $('#fixed_hdr1').fxdHdrCol({
            fixedCols: 1,
            width:     "100%",
            height:    400,
            colModal: [
                { width: 50, align: 'center' },
                { width: 110, align: 'center' },
                { width: 170, align: 'left' },
                { width: 250, align: 'left' },
                { width: 100, align: 'left' },
                { width: 70, align: 'left' },
                { width: 100, align: 'left' },
                { width: 100, align: 'center' },
                { width: 90, align: 'left' },
                { width: 400, align: 'left' }
            ]
        });
    },400);
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