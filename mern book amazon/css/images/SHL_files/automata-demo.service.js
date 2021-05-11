(function (module) {
    module.service('AutomataDemoService', ['API_CONFIG', 'AuthService', '$rootScope', function (API_CONFIG, AuthService, $rootScope) {
        var AutomataTransitionService = this;
        var mClass;
        this.getModuleClass = function () {
            var mid = AuthService.getCurrentModule();
            var classId = AuthService.getSelectedModulesDetails().chosenModules[mid].moduleClass;
            return classId;
        };
        var questionDetailsObj = AuthService.demoQuestionData.questionDetails;
        var isInterpreterQuestion = (questionDetailsObj.questionType === API_CONFIG.AUTOMATA_INTERPRETER_PROGRAMMING_QUESTION || questionDetailsObj.questionType === API_CONFIG.AUTOMATA_AUTHOR_INTERPRETER_PROGRAMMING_QUESTION);
        var normalQuestionText = '\nint a,b=0;\na=5;\nb+=a;\nreturn a+b;';
        var interpreterQuestionText = '\nfrom sklearn.linear_model import LinearRegression \nLR=LinearRegression() \nLR.fit(X,y) \nreturn LR.score(X,y)';
        var questionText = (isInterpreterQuestion)?interpreterQuestionText:normalQuestionText;
        var message = [$rootScope.translate.CLICK_HERE_TO_READ_THE_PROBLEM_STATEMENT, $rootScope.translate.CLICK_HERE_TO_VIEW_SOME_SAMPLE_TEST_CASES_FOR_THE_PROBLEM, $rootScope.translate.CLICK_HERE_TO_LOOK_AT_THE_OUTPUT_YOUR_CODE_GENERATES_ON_OUR_TEST_CASES, $rootScope.translate.WRITE_YOUR_SOURCE_CODE_HERE, $rootScope.translate.SAVE_YOUR_CODE, $rootScope.translate.CLICK_HERE_TO_VIEW_THE_COMPILE_AND_RUN_OUTPUT_OF_YOUR_CODE, $rootScope.translate.MOVE_TO_THE_NEXT_QUESTION, $rootScope.translate.RESET_YOUR_SOURCE_CODE_HERE, $rootScope.translate.NAVIGATE_TO_OTHER_PROBLEMS_IN_THE_PROBLEM_SET,$rootScope.translate.CLICK_HERE_TO_SELECT_PROGRAMMING_LANGUAGE,$rootScope.translate.CLICK_HERE_TO_SWITCH_T0_EDITOR_TAB];
        var writeCodeAction = (isInterpreterQuestion)?'add-interpreter-code':'add-code';
        var writeCodeDuration = (isInterpreterQuestion)?25000:10000;
        this.getAudioUrl = function(){
            return "/web/amcatModuleDemo/automata/";
        };
        var demoElemCall = [];
        //Check for newAutomata Demo
        if(questionDetailsObj.questionType === API_CONFIG.NEW_AUTOMATA_USER_MAIN_QUESTION || questionDetailsObj.questionType === API_CONFIG.NEW_AUTOMATA_DEBUGGING_QUESTION) {
        this.transitions = [
            {
                    selector: '.txtQuestion',
                    title: $rootScope.translate.PROBLEM,
                    message: message[0],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width()/2 - 100,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#testCaseTab',
                    title: $rootScope.translate.OUTPUT,
                    message: message[2],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width()/2 - 300,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                },{
                    selector: '#editorTab',
                    title: $rootScope.translate.EDITOR_TAB,
                    message: message[10],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2-350,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000
                },{
                    selector: '#codeEditorAutomata',
                    title: $rootScope.translate.EDITOR,
                    message: message[3],
                    relativeBox: false,
                    relativeBoxPoition_x: $(window).width() / 2,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    action: writeCodeAction,
                    code: questionText,
                    duration: writeCodeDuration
                }, {
                    selector: '#compileRunBtn',
                    title: $rootScope.translate.COMPILE_RUN_TEXT,
                    message: message[5],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2 - 300,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                },{
                    selector: '#editorTab',
                    title: $rootScope.translate.EDITOR_TAB,
                    message: message[10],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2-350,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000
                },{
                    selector: '.languageDropDownBtn',
                    title: $rootScope.translate.PROGRAMMING_LANGUAGES,
                    message: message[9],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2-300,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000
                }, {
                    selector: '#resetBtn',
                    title: $rootScope.translate.RESET,
                    message: message[7],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2-200,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 3000
                },{
                    selector: '.navigationDiv',
                    title: $rootScope.translate.NAVIGATE_QUESTION,
                    message: message[8],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2 - 500,
                    relativeBoxPoition_y: 0,
                    moveTo: true,
                    duration: 5000,
                },{
                    selector: '#resetBtn',
                    title: $rootScope.translate.RESET,
                    message: message[7],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2-500,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 3000
                }
            ];

            demoElemCall = [
                {
                    selector: '.txtQuestion',
                    title: $rootScope.translate.PROBLEM,
                    content: message[0],
                    shiftUp: -100,
                    shiftLeft: -40,
                    arrowClass: 'down'
                },
                {
                    selector: '#tc_and_output',
                    title: $rootScope.translate.OUTPUT,
                    content:  message[2],
                    shiftUp: -118,
                    shiftLeft: 305,
                    arrowClass: 'down'
                },
                {
                    selector: '#resetBtn',
                    title: $rootScope.translate.RESET,
                    content: message[7],
                    shiftUp: 10,
                    shiftLeft: -117,
                    arrowClass: 'up'
                },
                {
                    selector: '#saveBtn',
                    title: $rootScope.translate.SAVE,
                    content:  message[4],
                    shiftUp: -82,
                    shiftLeft: -65,
                    arrowClass: 'down'
                },
                {
                    selector: '#compileRunBtn',
                    title: $rootScope.translate.COMPILE_RUN_TEXT,
                    content:  message[5],
                    shiftUp: -105,
                    shiftLeft: -20,
                    arrowClass: 'down'
                },
                {
                    selector: '#submitBtn .row>div:first-child',
                    title: $rootScope.translate.SUBMIT_ANSWER,
                    content:  message[6],
                    shiftUp: -85,
                    shiftLeft: -100,
                    arrowClass: 'down'
                },
                {
                    selector: '#codeEditorAutomata',
                    title: $rootScope.translate.EDITOR,
                    content:  message[3],
                    shiftUp: 60,
                    shiftLeft: 0,
                    arrowClass: 'down'
                },
                {
                    selector: '.languageDropDownBtn',
                    title: $rootScope.translate.PROGRAMMING_LANGUAGES,
                    content:  message[9],
                    shiftUp: 11,
                    shiftLeft: -180,
                    arrowClass: 'up'
                },
                {
                    selector: '.navigationDiv',
                    title: $rootScope.translate.NAVIGATE_QUESTION,
                    content: message[8],
                    shiftUp: 10,
                    shiftLeft: -40,
                    arrowClass: 'up'
                }
            ];
        }
        else {
            this.transitions = [
                {
                    selector: '#tabBtn0',
                    title: $rootScope.translate.PROBLEM,
                    message: message[0],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width()/2 - 200,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#tabBtn1',
                    title: $rootScope.translate.TEST_CASES,
                    message: message[1],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width()/2 - 300,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#codeEditorAutomata',
                    title: $rootScope.translate.EDITOR,
                    message: message[3],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#codeEditorAutomata',
                    title: $rootScope.translate.EDITOR,
                    message: message[3],
                    relativeBox: false,
                    relativeBoxPoition_x: $(window).width() / 2,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    action: writeCodeAction,
                    code: questionText,
                    duration: writeCodeDuration
                }, {
                    selector: '#compileRunBtn',
                    title: $rootScope.translate.COMPILE_RUN_TEXT,
                    message: message[5],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#tabBtn2',
                    title: $rootScope.translate.OUTPUT,
                    message: message[2],
                    action: 'click',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width()/2 - 300,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#resetBtn',
                    title: $rootScope.translate.RESET,
                    message: message[7],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2-200,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 3000,
                }, {
                    selector: '#questionNavigationSelectBox',
                    title: $rootScope.translate.NAVIGATE_QUESTION,
                    message: message[8],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2 - 500,
                    relativeBoxPoition_y: 0,
                    moveTo: true,
                    duration: 5000,
                }, {
                    selector: '#questionNavigationSelectBox',
                    title: $rootScope.translate.NAVIGATE_QUESTION,
                    message: message[8],
                    action: '',
                    relativeBox: true,
                    relativeBoxPoition_x: $(window).width() / 2 - 300,
                    relativeBoxPoition_y: 100,
                    moveTo: true,
                    duration: 5000,
                }
            ];

            demoElemCall = [
                {
                    selector: '#tabBtn0',
                    title: $rootScope.translate.PROBLEM,
                    content: message[0],
                    shiftUp: -100,
                    shiftLeft: -40,
                    arrowClass: 'down'
                },
                {
                    selector: '#tabBtn1',
                    title: $rootScope.translate.TEST_CASES,
                    content: message[1],
                    shiftUp: 15,
                    shiftLeft: -70,
                    arrowClass: 'up'
                },
                {
                    selector: '#tabBtn2',
                    title: $rootScope.translate.OUTPUT,
                    content:  message[2],
                    shiftUp: -118,
                    shiftLeft: -90,
                    arrowClass: 'down'
                },
                {
                    selector: '#resetBtn',
                    title: $rootScope.translate.RESET,
                    content: message[7],
                    shiftUp: 10,
                    shiftLeft: -105,
                    arrowClass: 'up'
                },
                {
                    selector: '#saveBtn',
                    title: $rootScope.translate.SAVE,
                    content:  message[4],
                    shiftUp: -82,
                    shiftLeft: -65,
                    arrowClass: 'down'
                },
                {
                    selector: '#compileRunBtn',
                    title: $rootScope.translate.COMPILE_RUN_TEXT,
                    content:  message[5],
                    shiftUp: -100,
                    shiftLeft: -20,
                    arrowClass: 'down'
                },
                {
                    selector: '#submitBtn .row>div:first-child',
                    title: $rootScope.translate.SUBMIT_ANSWER,
                    content:  message[6],
                    shiftUp: -90,
                    shiftLeft: -100,
                    arrowClass: 'down'
                },
                {
                    selector: '#codeEditorAutomata',
                    title: $rootScope.translate.EDITOR,
                    content:  message[3],
                    shiftUp: 60,
                    shiftLeft: 0,
                    arrowClass: 'down'
                },
                {
                    selector: '#questionNavigationSelectBox',
                    title: $rootScope.translate.NAVIGATE_QUESTION,
                    content: message[8],
                    shiftUp: -150,
                    shiftLeft: -67,
                    arrowClass: 'down'
                }

            ];
        }
        

        var demoElems;
        this.getDemoElements = function () {
            demoElems = demoElemCall;
            return demoElems;
        };

    }]);
}(angular.module('amcatUI.question')));