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

    for(var i = 0; i < AppData.sheets.length; i++){
        var current = AppData.sheets[i];

        if(current.id == $stateParams.sheetId){
            $scope.dataSource = new SheetTableDataSource(current);
            break;
        }
    }

    $scope.selectSection = function(section){
        $scope.dataSource.activeSection = section;
    };

    $scope.selectLesson = function(lesson) {
        if($scope.dataSource.activeLesson == lesson)
            $scope.dataSource.activeLesson = null;
        else
            $scope.dataSource.activeLesson = lesson;
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

    $scope.editLessonData = {
        lesson : null,
        note : null
    };

    $ionicModal.fromTemplateUrl('edit-lesson-note.html', function(modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Open
    $scope.editLessonNote = function(lesson) {
        $scope.editLessonData.lesson = lesson;
        $scope.editLessonData.note = lesson.note.slice(0,lesson.note.length);

        $scope.taskModal.show();
    };

    // Close
    $scope.closeEditLessonNote = function() {
        $scope.editLessonData.lesson = null;
        $scope.editLessonData.note = null;

        $scope.taskModal.hide();
    };

    // Called when the form is submitted
    $scope.saveLessonNote = function() {
        $scope.editLessonData.lesson.note = $scope.editLessonData.note;
        $scope.editLessonData.lesson = null;
        $scope.editLessonData.note = null;

        $scope.taskModal.hide();
    };

    $scope.addLesson = function(){
//        $scope.dataSource.addLesson(new Date(Date.now()));
//        var active = $scope.dataSource.activeSection;
//        $scope.dataSource.activeSection = null;
//        $scope.dataSource.activeSection = active;
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