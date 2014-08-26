//models.js

//#region students and groups

function Student(name) {
    this.name = name;
}

function Group(name, students) {
    this.name = name;
    this.students = students;

    for (var i = 0; i < students.length; i++) {
        students[i].group = name;
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

function LabWork(name,task,questions) {
    this.name = name;
    this.task = task;
    this.questions = questions;
    this.limit = null; //2 nedeli
}

function LabWorkCompletion(labWork, startLesson,sheet) {
    this.labWork = labWork;
    this.startLesson = startLesson;
    this.finishLesson = null;

    this.studentLabWorkCompletions = [];

    for (var group in sheet.groups) {
        for (var student in group.students) {
            this.studentLabWorkCompletions.push(new StudentLabWorkCompletion(student));
        }
    }
}

function StudentLabWorkCompletion(student) {
    this.student = student;
    this.taskCompletionLesson = null;
    this.labCompletionLesson = null;

    this.labQuestionsCompletions = [];
}

StudentLabWorkCompletion.prototype.constructor = StudentLabWorkCompletion;

StudentLabWorkCompletion.prototype.markQuestionAsAnswered = function (question,lesson) {
    this.labQuestionsCompletions.push(new LabQuestionCompletion(question,lesson));
}

StudentLabWorkCompletion.prototype.markTaskAsCompleted = function (lesson) {
    this.taskCompletionLesson = lesson
}

StudentLabWorkCompletion.prototype.markLabAsCompleted = function (lesson) {
    this.labCompletionLesson = lesson;
}

function LabQuestionCompletion(labWorkQuestion,lesson) {
    this.labWorkQuestion = labWorkQuestion;
    this.lesson = lesson;
}


//#end region

//#region sheet

var visits = ["-", "+", "+/-", "-/+"];

function Visit(student) {
    this.student = student;
    this.visit = visits[0];
}

function Lesson(date) {
    this.date = date;
    this.visits = [];
    this.note = "";
}

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
}

Sheet.prototype.getTitle = function () {
    var title = this.subject.name + " " + (this.isLection ? "Лекция" : "Практика") + " (";
    
    var groups = this.groups;
    var length = groups.length;

    for (var i = 0; i < length - 1; i++) {
        title += groups[i].name + " ";
    }

    title += groups[length - 1].name + ")";

    return title;
}

Sheet.prototype.getStudentVisits = function (student) {
    var visits = [];

    var lessonCount = this.lessons.length;

    for (var i = 0; i < lessonCount; i++) {
        var curLesson = this.lessons[i];

        for (var j = 0; j < curLesson.visits.length; j++) {
            var curVisit = curLesson.visits[j];

            if (curVisit.student == student) {
                visits.push(curVisit);
            }
        }
    }

    return visits;
}

Sheet.prototype.getAvailableLabs = function () {
    var available = [];


    for (var lab in this.subject.labWorks) {
        available.push(lab);
    }

    for (var labCompletion in this.labWorkCompletions) {
        var index = available.indexOf(labCompletion.labWork);

        if (index != -1) {
            available.slice(index, 1);
        }
    }


    return available;
}

Sheet.prototype.releaseLab = function (lab,lesson) {
    for (var group in this.groups) {
        this.labWorkCompletions.push(new LabWorkCompletion(lab,lesson,this));
    }
}

//#end region

//#region demo

function createDemo() {

    var subject1 = new Subject("ТРПО", [
        new LabWork("Лаб.№1 Иследование предметной области", "Исследовать заданную предметную область", [
            new LabWorkQuestion("Вопрос №1 на лаб №1"),
            new LabWorkQuestion("Вопрос №2 на лаб №1"),
            new LabWorkQuestion("Вопрос №3 на лаб №1"),
            new LabWorkQuestion("Вопрос №4 на лаб №1")
        ]),
        new LabWork("Лаб.№2 Сравнение программ-аналогов", "Сравнить 3 выбранных программы-аналога", [
            new LabWorkQuestion("Вопрос №1 на лаб №2"),
            new LabWorkQuestion("Вопрос №2 на лаб №2"),
            new LabWorkQuestion("Вопрос №3 на лаб №2"),
            new LabWorkQuestion("Вопрос №4 на лаб №2")
        ]),
        new LabWork("Лаб.№3 Разработка ТЗ", "Разработать техническое задание для проекта", [
            new LabWorkQuestion("Вопрос №1 на лаб №3"),
            new LabWorkQuestion("Вопрос №2 на лаб №3"),
            new LabWorkQuestion("Вопрос №3 на лаб №3"),
            new LabWorkQuestion("Вопрос №4 на лаб №3")
        ])]);


    var group10po2 = new Group("10ПО2", [
        new Student("Александров"),
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
        new Student("Ковалев")]);

    var sheet1 = new Sheet(subject1,[group10po1, group10po2],true);

    sheet1.addLesson(new Date("October 13, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 17, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 20, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 23, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 24, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 26, 2014 11:15:00"));
    sheet1.addLesson(new Date("October 28, 2014 11:15:00"));


    var sheet2 = new Sheet(subject1, [group10po1], false);

    sheet2.addLesson(new Date("October 13, 2014 13:15:00"));
    //sheet2.addLesson(new Date("October 17, 2014 13:15:00"));
    //sheet2.addLesson(new Date("October 20, 2014 13:15:00"));

    var sheet3 = new Sheet(subject1, [group10po2], false);

    sheet3.addLesson(new Date("October 13, 2014 15:15:00"));
    //sheet3.addLesson(new Date("October 17, 2014 15:15:00"));
    //sheet3.addLesson(new Date("October 20, 2014 15:15:00"));

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

function Row() {
    this.title = "";
    this.items = [];
}

function Section(title) {
    this.title = title;
    this.rows = [];
}

var counter = 1;

function SheetTableDataSource(sheet) {

    this.title = sheet.getTitle();
    this.headers = [];
    this.sections = [];
    this.sheet = sheet;

    var lessonsCount = sheet.lessons.length;

    for (var i = 0; i < lessonsCount; i++) {
        var date = sheet.lessons[i].date;
        var newdate = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
        this.headers.push(newdate);
    }

    var groupsCount = sheet.groups.length;

    for (var i = 0; i < groupsCount; i++) {

        var currentGroup = sheet.groups[i];
        var newSection = new Section(currentGroup.name);

        for (var j = 0; j < currentGroup.students.length; j++) {
            var curStudent = currentGroup.students[j];
            var newRow = new Row();
            newRow.title = curStudent.name;

            var visits = sheet.getStudentVisits(curStudent);
            newRow.items = visits;
            newSection.rows.push(newRow);
        }

        this.sections.push(newSection);
    }
}


//#end region