//models.js

//#region students and groups

function Student(name) {
    this.name = name;
}

function Group(name, students) {
    this.name = name;
    this.students = students;

    var counter = 1;

    for (var i = 0; i < students.length; i++) {
        students[i].group = name;
        students[i].num = counter++;
    }
}

//#end region

//#region subjects and labs

var subCounter = 1;

function Subject(name, labWorks) {
    this.id = subCounter++;
    this.name = name;
    this.labWorks = labWorks;
}

function LabWorkQuestion(text) {
    this.text = text;
}

function LabWorkStage(stage){
    this.stage = stage;
}

function LabWork(name,task,stages,questions) {
    this.name = name;
    this.task = task;
    this.stages = stages;
    this.questions = questions;
    this.limit = 2; //2 занятия
}

function LabWorkCompletion(labWork, startLesson,sheet) {
    this.labWork = labWork;
    this.startLesson = startLesson;
    this.studentLabWorkCompletions = [];
    this.note = "";
    var completions = this.studentLabWorkCompletions;

    sheet.groups.forEach(function(group){
      group.students.forEach(function(student){
            completions.push(new StudentLabWorkCompletion(student,labWork));
        });
    });
}

LabWorkCompletion.prototype.constructor = LabWorkCompletion;

LabWorkCompletion.prototype.getName = function(){
    return this.labWork.name;
};

function StudentLabWorkCompletion(student,labWork) {
    this.student = student;

    this.labCompletionLesson = null;

//    this.labQuestionsCompletions = [];

    this.labStageCompletions = [];

    for(var i = 0; i < labWork.stages.length; i++){
        this.labStageCompletions.push(new LabStageCompletion(labWork.stages[i]));
    }
}

StudentLabWorkCompletion.prototype.constructor = StudentLabWorkCompletion;

//StudentLabWorkCompletion.prototype.markQuestionAsAnswered = function (question,lesson) {
//    this.labQuestionsCompletions.push(new LabQuestionCompletion(question,lesson));
//};


StudentLabWorkCompletion.prototype.markLabAsCompleted = function (lesson) {
    this.labCompletionLesson = lesson;
};

StudentLabWorkCompletion.prototype.getPercentageString = function(){
    var completedStages = 0;

    this.labStageCompletions.forEach(function(stageCompletion){
        if(stageCompletion.done)
            completedStages++;
    });

    var percent = (completedStages * 100/this.labStageCompletions.length);
    percent = Math.round(percent);

    return percent + " %";

};

//function LabQuestionCompletion(labWorkQuestion,lesson) {
//    this.labWorkQuestion = labWorkQuestion;
//    this.lesson = lesson;
//}

function LabStageCompletion(labWorkStage){
    this.labWorkStage = labWorkStage;
    this.done = false;
}


//#end region

//#region sheet

var visitTypes = ["Н", "+", "+/Н", "Н/+"];

function Visit(student) {
    this.student = student;
    this.type = visitTypes[0];
}

function Lesson(date) {
    this.date = date;
    this.visits = [];
    this.note = "";
}

Lesson.prototype.constructor = Lesson;

Lesson.prototype.getName = function(){
    return this.date.getDate() + '.' + (this.date.getMonth() + 1) + '.' + this.date.getFullYear();
};

function Sheet(subject, groups, isLection) {

    this.id = counter++;
    console.log("Create sheet with id " + this.id);

    this.subject = subject;
    this.groups = groups;
    this.lessons = [];    
    this.labWorkCompletions = [];

    this.isLection = isLection;

    this.name = this.getTitle();
}

Sheet.prototype.constructor = Sheet;

Sheet.prototype.addLesson = function (date) {

    var newLesson = new Lesson(date);

    for (var i = 0; i < this.groups.length; i++) {
        var currentGroup = this.groups[i];
                
        for (var j = 0; j < currentGroup.students.length; j++) {
            newLesson.visits.push(new Visit(currentGroup.students[j]));
        }
    }

    this.lessons.push(newLesson);
};

Sheet.prototype.getTitle = function () {
    var title = this.subject.name + " " + (this.isLection ? "Лекция" : "Лабораторные работы") + " (";
    
    var groups = this.groups;
    var length = groups.length;

    for (var i = 0; i < length - 1; i++) {
        title += groups[i].name + " ";
    }

    title += groups[length - 1].name + ")";

    return title;
};

Sheet.prototype.getStudentVisitsInfo = function (student) {
    var visitsInfo = [];

    var lessonCount = this.lessons.length;

    for (var i = 0; i < lessonCount; i++) {
        var curLesson = this.lessons[i];

        for (var j = 0; j < curLesson.visits.length; j++) {
            var curVisit = curLesson.visits[j];

            if (curVisit.student == student) {
                visitsInfo.push({
                    lesson:curLesson,
                    visit:curVisit
                });
            }
        }
    }

    return visitsInfo;
};

Sheet.prototype.getStudentLabsInfo = function(student){
    var labsInfo = [];

    var labsCount = this.labWorkCompletions.length;

    for (var i = 0; i < labsCount; i++) {
        var curLabWorkCompletion = this.labWorkCompletions[i];

        for (var j = 0; j < curLabWorkCompletion.studentLabWorkCompletions.length; j++) {
            var curStudentCompletion = curLabWorkCompletion.studentLabWorkCompletions[j];

            if (curStudentCompletion.student == student) {
                labsInfo.push({percentage : curStudentCompletion.getPercentageString()});
            }
        }
    }

    return labsInfo;
};

Sheet.prototype.getAvailableLabs = function () {

    var available = [];

    this.subject.labWorks.forEach(function(lab){
        available.push(lab);
    });

    this.labWorkCompletions.forEach(function(labCompletion){
        var index = available.indexOf(labCompletion.labWork);

        if (index != -1) {
            available.splice(index, 1);
        }
    });

    return available;
};

Sheet.prototype.releaseLab = function (lab,lesson) {
        this.labWorkCompletions.push(new LabWorkCompletion(lab,lesson,this));
};

//#end region


//#region demo

function createDemo() {

    var subject1 = new Subject("ТРПО", [
        new LabWork("Лаб.№1 Иследование предметной области", "Исследовать заданную предметную область", [
            new LabWorkStage("Ознакомиться с предметной областью"),
            new LabWorkStage("Выявить основные проблемы"),
            new LabWorkStage("Предложить способы решения")
        ],[
            new LabWorkQuestion("Вопрос №1 на лаб №1"),
            new LabWorkQuestion("Вопрос №2 на лаб №1"),
            new LabWorkQuestion("Вопрос №3 на лаб №1"),
            new LabWorkQuestion("Вопрос №4 на лаб №1")
        ]),
        new LabWork("Лаб.№2 Сравнение программ-аналогов", "Сравнить 3 выбранных программы-аналога", [
            new LabWorkStage("Найти 3 программы-аналога"),
            new LabWorkStage("Сравнить преимущества и недостатки"),
            new LabWorkStage("Сделать вывод - какие возможности этих программ можно использовать в проекте")
        ], [
            new LabWorkQuestion("Вопрос №1 на лаб №2"),
            new LabWorkQuestion("Вопрос №2 на лаб №2"),
            new LabWorkQuestion("Вопрос №3 на лаб №2"),
            new LabWorkQuestion("Вопрос №4 на лаб №2")
        ]),
        new LabWork("Лаб.№3 Техническое задание", "Разработать техническое задание для проекта", [
            new LabWorkStage("Составить техническое задание"),
            new LabWorkStage("Общий объем более 3-х страниц"),
            new LabWorkStage("Объем функциональных требований - не меньше 1 страницы")
        ], [
            new LabWorkQuestion("Вопрос №1 на лаб №3"),
            new LabWorkQuestion("Вопрос №2 на лаб №3"),
            new LabWorkQuestion("Вопрос №3 на лаб №3"),
            new LabWorkQuestion("Вопрос №4 на лаб №3")
        ]),
        new LabWork("Лаб.№4 Модель данных", "Разработать модель данных для проекта", [
            new LabWorkStage("Модель ERD"),
            new LabWorkStage("Сущностей более 6"),
            new LabWorkStage("Модель в 3 нормальной форме")
        ], [
            new LabWorkQuestion("Вопрос №1 на лаб №4"),
            new LabWorkQuestion("Вопрос №2 на лаб №4"),
            new LabWorkQuestion("Вопрос №3 на лаб №4"),
            new LabWorkQuestion("Вопрос №4 на лаб №4")
        ]),
        new LabWork("Лаб.№5 SADT-диаграмма", "Построить SADT-диаграмму для проекта", [
            new LabWorkStage("Уровней более 3"),
            new LabWorkStage("Имена в нормальной форме"),
            new LabWorkStage("Имена стрелок в нормальной форме")
        ], [
            new LabWorkQuestion("Вопрос №1 на лаб №5"),
            new LabWorkQuestion("Вопрос №2 на лаб №5"),
            new LabWorkQuestion("Вопрос №3 на лаб №5"),
            new LabWorkQuestion("Вопрос №4 на лаб №5")
        ]),
        new LabWork("Лаб.№6 DFD-диаграмма", "Построить DFD-диаграмму для проекта", [
            new LabWorkStage("Уровней более 3"),
            new LabWorkStage("Имена в нормальной форме"),
            new LabWorkStage("Имена стрелок в нормальной форме")
        ], [
            new LabWorkQuestion("Вопрос №1 на лаб №6"),
            new LabWorkQuestion("Вопрос №2 на лаб №6"),
            new LabWorkQuestion("Вопрос №3 на лаб №6"),
            new LabWorkQuestion("Вопрос №4 на лаб №6")
        ]),
        new LabWork("Лаб.№7 Архитектура системы", "Выбрать подходящую архитектуру для проекта и обосновать выбор", [
            new LabWorkStage("Ознакомится с популярными архитектурам ПО"),
            new LabWorkStage("Выбрать подходящую архитектуру для проекта"),
            new LabWorkStage("Обосновать выбор")
        ], [
            new LabWorkQuestion("Вопрос №1 на лаб №7"),
            new LabWorkQuestion("Вопрос №2 на лаб №7"),
            new LabWorkQuestion("Вопрос №3 на лаб №7"),
            new LabWorkQuestion("Вопрос №4 на лаб №7")
        ])]);


    var group10po2 = new Group("10ПО2", [
        new Student("Александров"),
        new Student("Баранов"),
        new Student("Герасин"),
        new Student("Дубинин"),
        new Student("Кочетков"),
        new Student("Осипов"),
        new Student("Баранов"),
        new Student("Герасин"),
        new Student("Дубинин"),
        new Student("Кочетков"),
        new Student("Осипов"),
        new Student("Баранов"),
        new Student("Герасин"),
        new Student("Дубинин"),
        new Student("Кочетков"),
        new Student("Осипов"),
        new Student("Собко")]);

    var group10po1 = new Group("10ПО1", [
        new Student("Акимушкин"),
        new Student("Казаков"),
        new Student("Евдокимов"),
        new Student("Ковалев"),
        new Student("Акимушкин"),
        new Student("Казаков"),
        new Student("Евдокимов"),
        new Student("Ковалев"),
        new Student("Акимушкин"),
        new Student("Казаков"),
        new Student("Евдокимов"),
        new Student("Ковалев"),
        new Student("Акимушкин"),
        new Student("Казаков"),
        new Student("Евдокимов"),
        new Student("Ковалев")]);

    var sheet1 = new Sheet(subject1,[group10po1, group10po2],true);

    sheet1.addLesson(new Date("October 13, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 17, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 20, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 23, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 24, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 26, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 28, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 29, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 30, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 31, 2014 11:15:00"));


    var sheet2 = new Sheet(subject1, [group10po1], false);


    sheet2.addLesson(new Date("October 13, 2014 13:15:00"));
    sheet2.addLesson(new Date("October 17, 2014 13:15:00"));
    sheet2.addLesson(new Date("October 20, 2014 13:15:00"));

    sheet2.releaseLab(subject1.labWorks[0],sheet2.lessons[1]);
    sheet2.releaseLab(subject1.labWorks[1],sheet2.lessons[1]);
    sheet2.releaseLab(subject1.labWorks[2],sheet2.lessons[1]);
//    sheet2.releaseLab(subject1.labWorks[3],sheet2.lessons[1]);
//    sheet2.releaseLab(subject1.labWorks[4],sheet2.lessons[1]);
//    sheet2.releaseLab(subject1.labWorks[5],sheet2.lessons[1]);
//    sheet2.releaseLab(subject1.labWorks[6],sheet2.lessons[1]);

    sheet2.labWorkCompletions[0].studentLabWorkCompletions[0].labStageCompletions[0].done = true;
    sheet2.labWorkCompletions[0].studentLabWorkCompletions[0].labStageCompletions[1].done = true;

    sheet2.labWorkCompletions[0].studentLabWorkCompletions[1].labStageCompletions[0].done = true;

    sheet2.labWorkCompletions[0].studentLabWorkCompletions[4].labStageCompletions[0].done = true;

    sheet2.labWorkCompletions[1].studentLabWorkCompletions[0].labStageCompletions[0].done = true;
    sheet2.labWorkCompletions[1].studentLabWorkCompletions[0].labStageCompletions[1].done = true;

    sheet2.labWorkCompletions[2].studentLabWorkCompletions[0].labStageCompletions[0].done = true;
    sheet2.labWorkCompletions[2].studentLabWorkCompletions[0].labStageCompletions[1].done = true;

    var sheet3 = new Sheet(subject1, [group10po2], false);

    sheet3.addLesson(new Date("October 13, 2014 15:15:00"));
    sheet3.addLesson(new Date("October 17, 2014 15:15:00"));
    sheet3.addLesson(new Date("October 20, 2014 15:15:00"));

    return {
        sheets : [sheet1, sheet2, sheet3],
        subjects : [subject1],
        profile: {
            name: "testProfile"
        }
    };
}

//#end region

//#region data source

function Row(title) {
    this.title = title;
    this.items = [];
}

function Section(title) {
    this.title = title;
    this.rows = [];
}

var counter = 1;

function SheetTableDataSource(sheet) {

    this.sheet = sheet;
    this.title = sheet.getTitle();
    this.sections = [];
    this.activeLesson = null;

    this.init();
}

SheetTableDataSource.prototype.constructor = SheetTableDataSource;

SheetTableDataSource.prototype.init = function(){

    //init header & footer

    this.headerTitle = "Группа / Дата";
    this.footerTitle = "Заметки";
    this.lessons = this.sheet.lessons;

    //init sections

    var activeSectionIndex = this.sections.indexOf(this.activeSection);
    if(activeSectionIndex == -1)
        activeSectionIndex = 0;

    this.sections = [];

    var groupsCount = this.sheet.groups.length;

    for (var i = 0; i < groupsCount; i++) {

        var currentGroup = this.sheet.groups[i];
        var newSection = new Section(currentGroup.name);

        for (var j = 0; j < currentGroup.students.length; j++) {

            var curStudent = currentGroup.students[j];
            var title = curStudent.num + ". " + curStudent.name;
            var newRow = new Row(title);

            newRow.items = this.sheet.getStudentVisitsInfo(curStudent);
            newSection.rows.push(newRow);
        }

        this.sections.push(newSection);
    }

    this.activeSection = this.sections[activeSectionIndex];

    //init labs if it necessary

    if(this.sheet.isLection)
        return;

    //so it's practice

    this.headerLabTitle = "Группа / Лаб.работы";
    this.labs = this.sheet.labWorkCompletions;

    this.labsRows = [];

    for (i = 0; i < groupsCount; i++) {

        currentGroup = this.sheet.groups[i];

        for (j = 0; j < currentGroup.students.length; j++) {

            curStudent = currentGroup.students[j];
            newRow = new Row("");
            newRow.items = this.sheet.getStudentLabsInfo(curStudent);
            this.labsRows.push(newRow);
        }
    }
};

SheetTableDataSource.prototype.addLesson = function(date){
    this.sheet.addLesson(date);
    this.init();
};


function DataSource(sheet){
    this.sheet = sheet;
    this.title = sheet.getTitle();

    this.activeLesson = null;

    this.headerRow = null;
    this.footerRow = null;

    if(sheet.isLection)
    {
        this.sections = [];

    }
    else //it's labs
    {

    }

    this.update();
}

DataSource.prototype.constructor = DataSource;

DataSource.prototype.update = function(){

    //init header & footer

    this.headerTitle = "Группа / Дата";
    this.footerTitle = "Заметки";
    this.lessons = this.sheet.lessons;

    //init sections

    var activeSectionIndex = this.sections.indexOf(this.activeSection);
    if(activeSectionIndex == -1)
        activeSectionIndex = 0;

    this.sections = [];

    var groupsCount = this.sheet.groups.length;

    for (var i = 0; i < groupsCount; i++) {

        var currentGroup = this.sheet.groups[i];
        var newSection = new Section(currentGroup.name);

        for (var j = 0; j < currentGroup.students.length; j++) {

            var curStudent = currentGroup.students[j];
            var title = curStudent.num + ". " + curStudent.name;
            var newRow = new Row(title);

            newRow.items = this.sheet.getStudentVisitsInfo(curStudent);
            newSection.rows.push(newRow);
        }

        this.sections.push(newSection);
    }

    this.activeSection = this.sections[activeSectionIndex];

    //init labs if it necessary

    if(this.sheet.isLection)
        return;

    //so it's practice

    this.headerLabTitle = "Группа / Лаб.работы";
    this.labs = this.sheet.labWorkCompletions;

    this.labsRows = [];

    for (i = 0; i < groupsCount; i++) {

        currentGroup = this.sheet.groups[i];

        for (j = 0; j < currentGroup.students.length; j++) {

            curStudent = currentGroup.students[j];
            newRow = new Row("");
            newRow.items = this.sheet.getStudentLabsInfo(curStudent);
            this.labsRows.push(newRow);
        }
    }
};

//#end region