/**
 * Each section of the site has its own module. It probably also has
 * submodules, though this boilerplate is too simple to demonstrate it. Within
 * 'src/app/home', however, could exist several additional folders representing
 * additional modules that would then be listed as dependencies of this one.
 * For example, a 'note' section could have the submodules 'note.create',
 * 'note.delete', 'note.edit', etc.
 *
 * Regardless, so long as dependencies are managed correctly, the build process
 * will automatically take take of the rest.
 */
(function (module) {

    // As you add controllers to a module and they grow in size, feel free to place them in their own files.
    //  Let each module grow organically, adding appropriate organization and sub-folders as needed.
    module.controller('AutomataQuestionController', ['$timeout', '$scope', '$state', '$sce', '$interval', '$filter', '$rootScope', 'API_CONFIG', 'QuestionService', 'AuthService', 'TranslationService', 'questionData', 'ResumeService', 'alertPopUpServices', 'MiscService', 'LoggerService', function ($timeout, $scope, $state, $sce, $interval, $filter, $rootScope, API_CONFIG, QuestionService, AuthService, TranslationService, questionData, ResumeService, alertPopUpServices, MiscService, LoggerService) {
        // The top section of a controller should be lean and make it easy to see the "signature" of the controller
        //  at a glance.  All function definitions should be contained lower down.
        var model = this;
        model.aceReference = null;
        model.aceTestCaseReference = null;
        model.currentTab = 0;
        model.testCaseType = 'PredefinedCases';
        model.outputText = {};
        var timeleft;
        model.isNavigateQuestion = true;
        model.screenState = 'normal';
        AuthService.getCurrentModel(model);
        AuthService.demoQuestionData = questionData;
        var currentDeltaId=1;
        var fallBackDeltaData = {};
        var skipObservation = false;
        timeleft = ResumeService.getTimeLeft();
        model.QuestionService=QuestionService;
        QuestionService.initializeData(model, timeleft, $scope);
        model.questionsStatus = QuestionService.questionsStatus;
        model.isUserTestCase = 0;
        var quesDetails = questionData.questionDetails;
        if(!QuestionService.isPreviewMode && AuthService.getUserAuth().userDetails.customTestCases){
            if(quesDetails.runType === API_CONFIG.SYSTEM_MAIN_AUTOMATA && quesDetails.hasUserTCCode){
                model.isUserTestCase = API_CONFIG.USER_TC_CODE;
            }else if(quesDetails.runType === API_CONFIG.USER_MAIN_AUTOMATA){
                model.isUserTestCase = API_CONFIG.USER_TC_ONLY;
            }
        } 
     
        model.userTestCaseText = $sce.trustAsHtml(''+$rootScope.translate.USER_TEST_CASE_TEXT);
        model.useDebugCaseText = $rootScope.translate.USE_DEBUG_CASE;
        var userTestCasePlaceHolder = $rootScope.translate.ENTER_USER_TEST_CASE;
        if(quesDetails.userTCExample){
            userTestCasePlaceHolder = $sce.trustAsHtml(''+questionData.questionDetails.userTCExample);
        }
        model.languageMode = 'c_cpp';
        model.codeSaved=false;

        // Gets all the languages available with AMCAT
        var moduleId = AuthService.getCurrentModule();
        var sid = questionData.questionDetails.sid;
        if(typeof $rootScope.codePlayerSessions === 'undefined') {
            $rootScope.codePlayerSessions = {};
        }
        if(typeof $rootScope.codePlayerSessions[moduleId] === 'undefined') {
            $rootScope.codePlayerSessions[moduleId] = {};
        }
        if(typeof $rootScope.codePlayerSessions[moduleId][sid] === 'undefined') {
            $rootScope.codePlayerSessions[moduleId][sid] = null;
        }
        // Gets all the languages available for the question
        if (questionData.languageDetails.programmingLang == null) {
            model.availableLanguages = questionData.languageDetails.programmingLang;
        } else {
            model.availableLanguages = questionData.languageDetails.programmingLang.langChoice;
        }
        // Flag received from service determining whether or not display the dropdown for language
        model.showLanguageDropdown = questionData.languageDetails.programmingLang.langChoiceAvailable;

        $scope.$on('aceReference', function (event, aceReference) {
            model.aceEditor=aceReference;
            model.aceReference = aceReference.value;
            QuestionService.aceReference = model.aceReference;
            model.aceReference.mainObj={};
            if($rootScope.codePlayerSessions[moduleId][sid]) {
                var sessionInfo = $rootScope.codePlayerSessions[moduleId][sid];
                model.aceReference.mainObj.uniqueId = sessionInfo.uniqueId;
                currentDeltaId = sessionInfo.currentDeltaId;
                $rootScope.codePlayerSessions[moduleId][sid] = null;
                skipObservation = true;
            } else {
                model.aceReference.mainObj.uniqueId = getUniqueId();
            }
            model.aceReference.mainObj.data = {};
            model.aceReference.setValue(model.candidateSourceCode, 1);
            clearUndoManager(model.aceReference);

            var index = (currentDeltaId++).toString();
            model.aceReference.mainObj.data[index]=getInitialDeltaData();
            skipObservation = false;
            model.testCases = {};
            model.testCases.content = $sce.trustAsHtml(''+questionData.questionDetails.testCasesOutput);
            if(!questionData.questionDetails.isDemoQuestion){
            //compileOutPut('compileStart');
            } else {
                model.testCases = {};
                model.testCases.content = $sce.trustAsHtml(questionData.questionDetails.testCasesOutput);
            }
            model.aceReference.getSession().on('change', function (e) {
                editorMode = model.aceReference.session.getMode().$id;
                var d2 = new Date();
                var currTime = Math.round(d2.getTime());
                var tempObj1 = {
                    delta: e,
                    time: currTime,
                    mode: editorMode,
                    skipObservation: skipObservation
                };
                var index = (currentDeltaId++).toString();
                model.aceReference.mainObj.data[index]=tempObj1;
            });
            $scope.$emit("showLoader");
            QuestionService.allProgrammingLanguages(function(progLangList){
                $scope.$emit("hideLoader");
                model.allLanguages = progLangList;
                // If user has choosen a language on the module description page else choose the language provided by module.
                if (QuestionService.choosenLanguageId) {
                    setLanguageConfig(QuestionService.choosenLanguageId);
                } else {
                    setLanguageConfig(questionData.questionDetails.srcLanguageCode);
                }
            });
        });

        $scope.$on('aceTestCaseReference', function (event, aceReference) {
            model.aceEditor=aceReference;
            model.aceTestCaseReference = aceReference.value;
            model.aceTestCaseReference.setValue(model.candidateTestCaseCode, 1);
            clearUndoManager(model.aceTestCaseReference);
        });

        var getUniqueId = function () {
            function s4() {
                return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
            }

            uniqueId = s4() + s4() + s4() + s4() + s4() + s4() + s4() + s4();

            return uniqueId;
        };

        var getDummyDeltaData = function () {
            var d1 = new Date();
            var currentTime = Math.round(d1.getTime());
            var dummyDelta = {};
            dummyDelta.start = {'row': '0', 'column': '0'};
            dummyDelta.end = {'row': '0', 'column': '0'};
            dummyDelta.action = 'insert';
            dummyDelta.lines = [];
            var dummyObj = {};
            dummyObj.delta = dummyDelta;
            dummyObj.time = currentTime;
            dummyObj.mode = 'ace/mode/text';
            dummyObj.skipObservation = skipObservation;
            return dummyObj;
        };

        var getInitialDeltaData = function () {
            var d1 = new Date();  
            var initialTime = Math.round(d1.getTime());
            var initialDelta = {};
            initialObj = {};
            var editorSession = model.aceReference.session;
            var lastRow= editorSession.doc.getLength();
            var lastColumn = editorSession.getDocumentLastRowColumn(editorSession.doc.getLength(),editorSession.doc.getLength());
            initialDelta.start    = {'row' : '0', 'column' : '0'};
            initialDelta.end      = {'row' : lastRow, 'column' : lastColumn};
            initialDelta.action   = 'insert';
            initialDelta.lines    = editorSession.doc.getAllLines();
            editorMode = editorSession.getMode().$id;
            var initialObj = {};
            initialObj.delta = initialDelta;
            initialObj.time = initialTime;
            initialObj.mode = editorMode;
            initialObj.skipObservation = skipObservation;
            return initialObj;
        };

        var getRemoveAllCodeDeltaData = function () {
            var d1 = new Date();
            var lastTime = Math.round(d1.getTime());
            var lastDelta = {};
            initialObj = {};
            var editorSession = model.aceReference.session;
            var lastRow= editorSession.doc.getLength()-1;
            var lastColumn = editorSession.getDocumentLastRowColumn(editorSession.doc.getLength(),editorSession.doc.getLength());
            lastDelta.start    = {'row' : '0', 'column' : '0'};
            lastDelta.end      = {'row' : lastRow, 'column' : lastColumn};
            lastDelta.action   = 'remove';
            lastDelta.lines    = editorSession.doc.getAllLines();
            editorMode = editorSession.getMode().$id;
            var lastObj = {};
            lastObj.delta = lastDelta;
            lastObj.time = lastTime;
            lastObj.mode = editorMode;
            lastObj.skipObservation = skipObservation;
            return lastObj;
        };

        var getDeltaDataObjectForRequest = function () {
            var index = (currentDeltaId++).toString();
            model.aceReference.mainObj.data[index]=getDummyDeltaData();
            fallBackDeltaData = angular.copy(model.aceReference.mainObj);
            model.aceReference.mainObj.data = {};
            return fallBackDeltaData;
        };

        var refillDeltaDataObject = function () {
            for(var prop in fallBackDeltaData.data) {
                model.aceReference.mainObj.data[prop] = fallBackDeltaData[prop];
            }
        };

        var initCustomTestCaseModel = function() {
            model.isCustomTCBox = 0;
            model.userMainCustomTC = '';
            model.userMainCustomTestCases = [];
            model.userMainCustomTCCount = model.userMainCustomTestCases.length;
            model.editCustomTCIndex = null;
            model.showCustomTestCaseBox = function(){
                model.isCustomTCBox = 1;
            };
            model.hideCustomTestCaseBox = function(){
                model.isCustomTCBox = 0;
                model.userMainCustomTC = '';
                model.editCustomTCIndex = null;
            };
            model.deleteAllCustomTC = function(){
                model.userMainCustomTestCases = [];
                model.userMainCustomTC = '';
            };
            model.addUserMainCustomTC = function(){
                model.userMainCustomTestCases.push(model.userMainCustomTC);
                model.userMainCustomTC = '';
                model.isCustomTCBox = 0;
            };
            model.updateUserMainCustomTC = function(testCaseIndex){
                model.userMainCustomTestCases[testCaseIndex] = model.userMainCustomTC;
                model.userMainCustomTC = '';
                model.isCustomTCBox = 0;
                model.editCustomTCIndex = null;
            };
            model.editCustomTC = function(testCaseIndex){
                model.userMainCustomTC = model.userMainCustomTestCases[testCaseIndex];
                model.showCustomTestCaseBox();
                model.editCustomTCIndex = testCaseIndex;
                model.isCustomTCBox = 1;
            };
            model.deleteCustomTC = function(testCaseIndex){
                model.userMainCustomTestCases.splice(testCaseIndex,1);
                model.editCustomTCIndex = null;
                model.isCustomTCBox = 0;
            };
            model.getAddTCTitle = function(){
                var title = '';
                if(model.userMainCustomTestCases.length === API_CONFIG.MAX_USER_MAIN_TC_COUNT){
                    title = $rootScope.translate.MAX_CUSTOM_CASE_ALLOWED;
                }
                return title;
            };
        };
        $scope.$on('answer-changed', function () {
            //model.answerSaved = false;
             // model.isOptionConfirmed = true;
             QuestionService.optionConfirmed(model);
        });
         model.optionClicked = function () {
            QuestionService.optionClicked(model);
		};
        $scope.$on("reset-automata-confirmed", function () {
            LoggerService.logInfo('User clicked to reset the code in language ' + model.currentLanguageId + ' on module ' + moduleId + ' with sid ' + sid);
            model.aceReference.setValue(model.defaultSourceCode, 1);
            clearUndoManager(model.aceReference);
        });

        $scope.$on("reset-automata-test-case-confirmed", function () {
            LoggerService.logInfo('User clicked to reset the test case code in language ' + model.currentLanguageId + ' on module ' + moduleId + ' with sid ' + sid);
            model.aceTestCaseReference.setValue(model.defaultTestCaseCode, 1);
            clearUndoManager(model.aceTestCaseReference);
        });

        model.changeTab = function (iTabNo) {
            model.currentTab = iTabNo;
        };

        model.showUserTestCaseDesc = function() {
            var params = {
                headingPopUp: $rootScope.translate.USER_TEST_CASE_DESC,
                contentPopUp: questionData.questionDetails.userTCDesc
            }; 
            alertPopUpServices.showWarningPopupExtended(params);
        }; 
        var setLanguageConfig = function (langId) {
            var langObject = model.allLanguages[langId];
            model.languageMode = langObject.code;
            model.currentLanguageId = langId;
            model.autometaProgLang = langId.toString();
            QuestionService.downloadFiles($scope, langObject.code.toLowerCase(),function(){
                model.aceReference.getSession().setMode("ace/mode/" + model.languageMode.toLowerCase());
            });
        };
        model.changeThemeEditor = function () {
            var editor = ace.edit('codeEditorAutomata');
            var testCaseEditor = $('#codeEditorTestCaseAutomata').length?ace.edit('codeEditorTestCaseAutomata'):'';
            if (!$rootScope.isThemeToggle) {
                editor.setTheme();
                $rootScope.isThemeToggle = true;
                if(testCaseEditor){
                    testCaseEditor.setTheme();
                }
            } else {
                editor.setTheme('ace/theme/monokai');
                $rootScope.isThemeToggle = false;
                if(testCaseEditor){
                    testCaseEditor.setTheme('ace/theme/monokai');
                }
            }
        };
        model.screenSplit = function (val) {
            model.isScreenLeftSplit = false;
            switch (val) {
            case "left":
                model.leftStyle = {
                    "width": "99%",
                    "height": "100%",
                    "margin": "auto 10px"
                };
                model.rightStyle = {
                    "width": "0"
                };
                model.isScreenLeftSplit = true;
                break;
            case "normal":
                model.rightStyle = '';
                model.leftStyle = '';
                break;
            case "right":
                model.rightStyle = {
                    "width": "99%",
                    "height": "100%",
                    "margin": "auto 10px"
                };
                model.leftStyle = {
                    "width": "0",
                    "height": "0"
                };
                break;
            }
            return val;
        };

        model.setLanguage = function (languageId) {
            if(!languageId){
                return;
            }
            if (parseInt(model.currentLanguageId) !== parseInt(languageId)) {
            
                LoggerService.logInfo('User clicked change language from ' + model.currentLanguageId + ' to ' + languageId);
                model.autometaProgLang = (model.currentLanguageId).toString();

                // Callback is called if user selects Continue in the modal pop-up.
                alertPopUpServices.showAutomataLanguageChangeDialog(function(){
                    if(QuestionService.isPreviewMode){
                        //Refresh page with changed programmingLang in GET param.
                        MiscService.replaceUrlParam('programmingLang', languageId);
                        return;
                    }
                    LoggerService.logInfo('Change language done from ' + model.currentLanguageId + ' to ' + languageId);
                    model.automataQuestionMovingAway();
                    model.aceReference.setOptions({
                        enableBasicAutocompletion: true,
                        enableSnippets: true,
                        enableLiveAutocompletion: false
                    });
                    if(QuestionService.aceEditorModeFilePath){
                        var pathArr = QuestionService.aceEditorModeFilePath.split('/');
                        var path = pathArr[0]+'/'+pathArr[1]+'/'+pathArr[2]+'/'+pathArr[3];
                        ace.config.set("modePath",path);
                        ace.config.set("workerPath", path); 
                        ace.config.set("themePath", path);
                    }
                    var index = (currentDeltaId++).toString();
                    skipObservation = true;
                    model.aceReference.mainObj.data[index]=getRemoveAllCodeDeltaData();
                    var sessionInfo = {};
                    sessionInfo.uniqueId = model.aceReference.mainObj.uniqueId;
                    sessionInfo.currentDeltaId = currentDeltaId;
                    $rootScope.codePlayerSessions[moduleId][sid] = sessionInfo;
                    // Defining the answer object for sending to the user
                    var answerObject = {
                        prevLangId: model.currentLanguageId,
                        nextLangId: languageId,
                        answerResponse: model.aceReference.getValue(),
                        questionType: questionData.questionDetails.questionType,
                        deltaData: model.aceReference.mainObj
                    };
                    QuestionService.getCurrentQuestionState(model, true);
                    // Setting the question No required
                    model.answerData.nextQuestionNumber = AuthService.getCurrentQuestionCount();
                    QuestionService.isLastQuestion = false;
                    model.nextQuestionRequestType = 'automata-switch-lang';
                    QuestionService.loadNextQuestion(model, $scope, answerObject);
                    $scope.$on("language-change-confirmed", function () {
                        model.currentLanguageId = languageId;
                    });
                });
            }
        };

        model.confirmReset = function () {
            $scope.$emit("show-automata-reset-modal");
        };

        model.confirmTestCaseReset = function () {
            $scope.$emit("show-automata-test-case-reset-modal");
        };

        model.compileAndRun = function () {
            model.currentTab = model.optionValues.indexOf($rootScope.translate.OUTPUT);
            model.outputText.content = $sce.trustAsHtml('' + $rootScope.translate.EXECUTING + '.....');
            compileOutPut('compile');
            model.aceReference.session.getUndoManager().markClean();
            model.isCompile =model.aceReference.session.getUndoManager().isClean();
            var compileTimeOut = $timeout(function () {
                model.isCompile = false;
                model.options[1].btn_txt = $rootScope.translate.COMPILE_RUN_TEXT;
            }, 10000);
        };
        var compileOutPut = function (val) {
            //model.currentTab = 0;
            model.options[1].btn_txt = $rootScope.translate.COMPILING_TEXT;
            var compileObject = {
                sid: model.answerData.sid,
                sourceCode: window.btoa(encodeURIComponent(model.aceReference.getValue())),
                langId: model.currentLanguageId,
                compileType: (val == 'compile') ? API_CONFIG.COMPILE_TYPE_MANUAL : API_CONFIG.COMPILE_TYPE_SAMPLE,
                runType: questionData.questionDetails.runType,
                requestTimeStamp: new Date().getTime()
            };
            compileObject.isUserTestCase = 0;
            if(quesDetails.hasUserTCCode) {
                compileObject.userTestCase = window.btoa(encodeURIComponent(model.defaultTestCaseCode));
                if((model.isUserTestCase === API_CONFIG.USER_TC_CODE) && (model.testCaseType === 'CustomTestCase')) {
                    compileObject.isUserTestCase = 1;
                    compileObject.userTestCase = window.btoa(encodeURIComponent(model.aceTestCaseReference.getValue()));
                }
            }
            if((model.isUserTestCase === API_CONFIG.USER_TC_ONLY) && (model.testCaseType === 'CustomTestCase')) {
                    if(!model.userMainCustomTestCases.length) {
                        alertPopUpServices.showFailureDialog('COMPILE_WITHOUT_TESTCASE_MSG');
                        return false;
                    }
                    compileObject.isUserTestCase = 1;
                    compileObject.userTestCase = JSON.stringify(model.userMainCustomTestCases);
            }
            if (val == 'compile') {
                var deltaData = encodeURIComponent(JSON.stringify(getDeltaDataObjectForRequest()));
                compileObject.deltaData = deltaData;
            }
            if(questionData.questionDetails.isDemoQuestion) {
                compileObject.compileType = 6;
                compileObject.moduleId = questionData.questionDetails.moduleId;
            }
            QuestionService.autometaCompile(compileObject).then(function (response) {

				if (response.data) {
                    if(response.data.content ===  false){
                        refillDeltaDataObject();
                        $scope.$emit("show-connectivity-modal");
                    } else {
                        if (val == 'compile') {
                            model.currentTab = 2;
                            model.outputText.content = $sce.trustAsHtml(''+response.data.content);
                        } else {
                            model.testCases = {};
                            model.testCases.content = $sce.trustAsHtml(''+response.data.content);
                        }
                    }
                } else {
                    refillDeltaDataObject();
                }

            }, function (error) {
                $scope.$emit("hideLoader");
                refillDeltaDataObject();
            });
        };

        model.saveCode = function () {
            if(QuestionService.isPreviewMode){
                alertPopUpServices.showFailureDialog('NOT_AVAILABLE_IN_PREVIEW_MODE', false);
                return;
            }
            var answerObject = {
                prevLangId: model.currentLanguageId,
                nextLangId: model.currentLanguageId,
                answerResponse: model.aceReference.getValue(),
                questionType: questionData.questionDetails.questionType,
                deltaData: getDeltaDataObjectForRequest()
            };
            model.answerSaved = true;
            QuestionService.saveAutomataQuestion(model, $scope, answerObject).then(function (response) {
                if (response.responseSaved) {
                    model.codeSaved =true;
                    var saveCodeTimeOut = $timeout(function () {
                        model.answerSaved = false;
                        model.codeSaved=false;
                    }, 5000);
                } else {
                    refillDeltaDataObject();
                }
            }, function (error) {
                refillDeltaDataObject();
            });
        };
            model.loadNextQuestion = function () {
                if($rootScope.hasBidirectionFlow){
                    model.switchQuestion("exit");
                }else{
                    model.sendLoadNextReq();
                }
            };
            model.sendLoadNextReq = function () {
                LoggerService.logInfo('Submitting the question.');

            if(QuestionService.isPreviewMode){
                alertPopUpServices.showFailureDialog('NOT_AVAILABLE_IN_PREVIEW_MODE', false);
                return;
            }
            // Defining the answer object for sending to the user
            var answerObject = {
                nextLangId: model.currentLanguageId,
                prevLangId: model.currentLanguageId,
                answerResponse: model.aceReference.getValue(),
                questionType: questionData.questionDetails.questionType,
                deltaData: getDeltaDataObjectForRequest()
            };

            // Setting the question No required
            model.isAnswer = true;

            // In case of last question, we want the user to see the pop-up and choose to exit module from there.
            QuestionService.getCurrentQuestionState(model,model.isAnswer);
            if (QuestionService.isLastQuestion) {
                QuestionService.loadNextQuestion(model, $scope, answerObject, true);
            } else {
                QuestionService.loadNextQuestion(model, $scope, answerObject);
                model.automataQuestionMovingAway();
            }
        };

        model.setTimeOutState = function () {
            QuestionService.setTimeOutState($scope);
        };

        model.processQuestion = function (questionData) {
            var question = questionData.questionDetails;
            model.questionType = questionData.questionDetails.questionType;
            // Saving the current question count
            model.totalQuestionCount = model.currentModuleDetails.questionCount + model.currentModuleDetails.numberDataQues;
            model.questionCount = questionData.questionNumber || 1;
            AuthService.setCurrentQuestionCount(model.questionCount);
            $rootScope.moduleName=question.moduleName;
            model.autoSaved = false;
            model.question = question.questionStatement;
            model.hasInterpreter = false;
            if(question.questionType === API_CONFIG.AUTOMATA_INTERPRETER_PROGRAMMING_QUESTION ||
                question.questionType === API_CONFIG.AUTOMATA_AUTHOR_INTERPRETER_PROGRAMMING_QUESTION){
                model.hasInterpreter = true;
                model.iFrameInterpreterPath = $sce.trustAsResourceUrl(question.iFrameInterpreterPath);
            }

            model.directions = $sce.trustAsHtml(''+question.directions);
            model.testCases = question.testCases;
            model.defaultSourceCode = question.defaultSourceCode;
            model.candidateSourceCode = question.candidateSourceCode;
            model.defaultTestCaseCode = '';
            model.candidateTestCaseCode = '';
            if (question.hasUserTCCode) {
                model.defaultTestCaseCode = question.userTCDefaultCode;
                model.candidateTestCaseCode = question.userTCCandidateCode;
            }
            model.answerData.sid = question.sid;
            model.testCases = {};
            model.testCases.content = $sce.trustAsHtml(question.testCasesOutput+'');
            model.setLanguageSelection = QuestionService.languageSet(AuthService.getCurrentModule());
            model.optionValues = [$rootScope.translate.PROBLEM, $rootScope.translate.TEST_CASES, $rootScope.translate.OUTPUT];
            if(question.helperText){
                model.helperText = $sce.trustAsHtml('' + question.helperText);
                model.optionValues.push($rootScope.translate.HELPER_CODE);
            } else {
                model.optionValues.push('');
            }
           
            if(model.hasInterpreter){
                model.optionValues.push($rootScope.translate.INTERPRETER);
            }
            LoggerService.logInfo('Delivering Automata Question ' + model.questionCount);

            model.resetText = $rootScope.translate.RESET;
            //model.setLanguageSelection = QuestionService.languageSet(AuthService.getCurrentModule());
            // Check for last question 
            model.outputText.placeHolderText = $rootScope.translate.OUTPUT_COMPILE_CODE_DISPLAY;
            if (questionData.moduleStatus === API_CONFIG.MODULE_LAST_QUESTION) {
                QuestionService.isLastQuestion = true;
            }
            model.isLastQuestion = QuestionService.isLastQuestion;
            // Variable for setting the navigator visible
            model.navigateQuestion = true;
            
            model.externalUrl = '';
            if(question.hasExternalUrl){
               model.externalUrl = question.externalUrl;
            }
            // Options settings for the buttons 
            model.options = [{
                btn_class: 'btn-green',
                btn_txt: $rootScope.translate.SAVE
            }, {
                btn_class: 'btn-green',
                btn_txt: $rootScope.translate.COMPILE_RUN_TEXT
            }, {
                btn_class: (model.isLastQuestion ? 'btn-orange' : 'btn-blue'),
                    btn_txt: (model.isLastQuestion ? $rootScope.translate.SUBMIT_CODE_TEST : $rootScope.translate.NEXT_QUESTION)
            }];
            if(model.isUserTestCase === API_CONFIG.USER_TC_ONLY){
                    initCustomTestCaseModel();
            }
            if (!question.isDemoQuestion && question.isDemoQuestion !== 1 && !QuestionService.isPreviewMode) {
                model.autoSaveTimer = $interval(function () {
                    $timeout(function () {
                        model.autoSaved = false;
                        model.answerSaved = false;

                    }, 200);
                    if ($state.current.name !== 'root.question.automata') {
                        model.automataQuestionMovingAway();
                    } else {
                        model.saveCode();
                        model.autoSaved = true;
                    }
                }, 40000);
            }
            $rootScope.$emit("set-wide-page");

        };
        $scope.$on('setInitVar', function (event, data) {
            $timeout(function () {
                $rootScope.translate = data.data;
                model.aceReference.on("input", function () {
                    model.isCompile = model.aceReference.session.getUndoManager().isClean();
                });
                model.optionValues = [$rootScope.translate.PROBLEM, $rootScope.translate.TEST_CASES, $rootScope.translate.OUTPUT];
                if (model.helperText) {
                    model.optionValues.push($rootScope.translate.HELPER_CODE);
                } else {
                    model.optionValues.push('');
                }
                model.options[0].btn_txt = $rootScope.translate.SAVE;
                model.options[1].btn_txt = $rootScope.translate.COMPILE_RUN_TEXT;
                model.options[2].btn_txt = (model.isLastQuestion ? $rootScope.translate.SUBMIT_CODE_TEST : $rootScope.translate.NEXT_QUESTION);
                model.resetText = $rootScope.translate.RESET;
                model.outputText.placeHolderText = $rootScope.translate.OUTPUT_COMPILE_CODE_DISPLAY;
                if (model.hasInterpreter) {
                    model.optionValues.push($rootScope.translate.INTERPRETER);
                }
            });
		});
        // model.outputText = "Milto";
        model.processQuestion(questionData);
        model.setTimeOutState();
        AuthService.getCurrentModel(model,QuestionService,AuthService.getCurrentQuestionCount(),model.isAnswer);
        model.automataQuestionMovingAway = function(){
            $interval.cancel(model.autoSaveTimer);
            MiscService.onModuleExit = null;
            MiscService.onTestExit = null;
        };

        var clearUndoManager = function(aceRef){
            $timeout(function(){
                aceRef.getSession().setUndoManager(new ace.UndoManager());
            });
        };
  
        MiscService.onModuleExit = model.automataQuestionMovingAway;
        MiscService.onTestExit = model.automataQuestionMovingAway;

    }]);

    // The name of the module, followed by its dependencies (at the bottom to facilitate enclosure)
}(angular.module("amcatUI.question")));