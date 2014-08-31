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

.controller('SheetController', function($scope,AppData, $stateParams,
    $ionicNavBarDelegate, $ionicScrollDelegate,$ionicModal) {
    console.log("test SheetController");

    $scope.sheets = AppData.sheets;

    for(var i = 0; i < $scope.sheets.length; i++){
        var current = $scope.sheets[i];

        if(current.id == $stateParams.sheetId){
            $scope.dataSource = new SheetTableDataSource(current);
            break;
        }
    }

    $scope.selectSection = function(section){
        $scope.dataSource.activeSection = section;
    };

    $scope.selectLesson = function(lesson){

        if($scope.dataSource.activeLesson == lesson)
        {
            $scope.dataSource.activeLesson = null;
            console.log("activeLesson is null");
        }
        else
        {
            $scope.dataSource.activeLesson = lesson;
            console.log("activeLesson: " + lesson.getDateString());
        }
    };

    $scope.selectVisitType = function(visit,type){
        visit.type = type;
    };

    $scope.selectOptions = visitTypes;

    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };

    $scope.showSpinner = false;

    $scope.toggleSpinner = function(){
        $scope.showSpinner = !$scope.showSpinner;
    };

    var header = $ionicScrollDelegate.$getByHandle("header");
    var footer = $ionicScrollDelegate.$getByHandle("footer");
    var table = $ionicScrollDelegate.$getByHandle("table");

    $scope.onScrollTable = function(){
        var pos = table.getScrollPosition();
        header.scrollTo(pos.left,pos.top,false);
        footer.scrollTo(pos.left,pos.top,false);
    };

    $ionicModal.fromTemplateUrl('my-modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function() {
        // Execute action
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function() {
        // Execute action
    });


    $scope.addLesson = function(){
        $scope.dataSource.addLesson(new Date(Date.now()));
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