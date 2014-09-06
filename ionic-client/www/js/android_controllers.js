/**
 * Created by admin on 25.08.2014.
 */

angular.module('starter.controllers', ['pickadate'])

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
    $ionicNavBarDelegate, $ionicScrollDelegate,$ionicModal,pickadateUtils) {
    console.log("test SheetController");

    var sheet = AppData.getSheetById($stateParams.sheetId);

    if(sheet == null){
        console.log("Can't find sheet with id : " + $stateParams.sheetId);
        return;
    }

    $scope.dataSource = sheet.isLection ? new LectionSheetDataSource(sheet) : new LabSheetDataSource(sheet);
    $scope.spinner = $scope.dataSource.getSpinner();

    $scope.isVisitsView =  function(){
        return $scope.dataSource.isVisitsView();
    };

    $scope.selectVisitType = function(visit,type){
        visit.type = type;
    };

    $scope.selectOptions = visitTypes;

    $scope.goBack = function() {
        $ionicNavBarDelegate.back();
    };

    var header = $ionicScrollDelegate.$getByHandle("header");
    var footer = $ionicScrollDelegate.$getByHandle("footer");
    var table = $ionicScrollDelegate.$getByHandle("table");

    $scope.onScrollTable = function(){
        var pos = table.getScrollPosition();
        header.scrollTo(pos.left,pos.top,false);
        footer.scrollTo(pos.left,pos.top,false);
    };

    $scope.editNoteData = {
        item : null,
        note : null
    };

    $ionicModal.fromTemplateUrl('edit-lesson-note.html', function(modal) {
        $scope.taskModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $ionicModal.fromTemplateUrl('new-lesson.html', function(modal) {
        $scope.newLessonModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    $ionicModal.fromTemplateUrl('new-work.html', function(modal) {
        $scope.newWorkModal = modal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

    // Open
    $scope.editNote = function(item) {
        $scope.editNoteData.item = item;
        $scope.editNoteData.note = item.note.slice(0,item.note.length);

        $scope.taskModal.show();
    };

    // Close
    $scope.closeNote = function() {
        $scope.editNoteData.item = null;
        $scope.editNoteData.note = null;

        $scope.taskModal.hide();
    };

    // Called when the form is submitted
    $scope.saveNote = function() {
        $scope.editNoteData.item.note = $scope.editNoteData.note;
        $scope.editNoteData.item = null;
        $scope.editNoteData.note = null;

        $scope.taskModal.hide();
    };

    $scope.addPressed = function(){

        if($scope.isVisitsView())
        {
            $scope.opendateModal();
        }
        else
        {
            $scope.newWorkModal.show();
        }
    };


    $scope.releaseLab = function(lab){
        $scope.dataSource.sheet.releaseLab(lab);
        $scope.dataSource.init();
    };

    $ionicModal.fromTemplateUrl('datemodal.html',
        function(modal) {
            $scope.datemodal = modal;
        },
        {
            scope: $scope,
            animation: 'slide-in-up'
        }
    );

    $scope.opendateModal = function() {
        $scope.newLessonDate = new Date();
        $scope.datemodal.show();
    };
    $scope.closedateModal = function(model) {
        $scope.dataSource.addLesson(pickadateUtils.stringToDate(model));
        $scope.datemodal.hide();

        var position = table.getScrollPosition();
        table.scrollTo(position.left + 100, position.top, true);
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