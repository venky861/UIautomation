/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("./helpers/logGenerator.js"), 
    logger = logGenerator.getApplicationLogger(), 
    jasmineReporters = require('jasmine-reporters'), 
    Jasmine2HtmlReporter = require('protractor-jasmine2-html-reporter'), 
    util = require("./helpers/util.js"), 
    browser = process.env.Browser, 
    environment = process.env.Environment,
    username = process.env.Email,
    password = process.env.Password,
    secretKey = process.env.secretKey,
    userId = process.env.userId,
    apiKey = process.env.apiKey,
    tenantId = process.env.tenantId,
    suitesList = process.env.Suites,
    buildURL = process.env.BUILD_URL,
    postSlack = process.env.POST_TO_SLACK,
    postSlackWebhookURL = process.env.POST_TO_SLACK_WEBHOOK_URL,
	dataValiadtion = process.env.DataValidation,
	esValidation = process.env.ESValidation,
    esEnvironment = process.env.ESEnvironment,
    esUsername = process.env.ESUsername,
    esPassword = process.env.ESPassword,
    currentDirectory = process.cwd();
    var path = require('path');

if (browser == null)
	browser = "chrome"
if (environment == null)
    environment = "wppgrp-dev2-fra"//"wppgrp-dev2-fra","na-acme","hapag-lloyd","mcmp-onprem-release-appsvt"
if (username == null)
	username = ""
if (password == null)
	password = ""
if (secretKey == null)
	secretKey = ""
if (userId == null)
	userId = ""
if (apiKey == null)
	apiKey = ""
if (tenantId == null)
	tenantId = ""
if (esEnvironment == null)
    esEnvironment = ""// stage-mcmp-elk-dal-elasticsearch-qa,test-mcmp-fra-elk
if (esUsername == null)
	esUsername = ""// mcmpadmin
if (esPassword == null)
	esPassword = ""
if (suitesList == null)
	suitesList = "inventory,dashboard,timestampValidations,health,actionable_insights,change_management,incident_management,pervasive_insight,problem_management,sunrise_report,launchpad,user_access,delivery_insights"
if (postSlack == null)
	postSlack = "false"
if (postSlackWebhookURL == null)
	postSlackWebhookURL = ""
if (dataValiadtion == null)
	dataValiadtion = false
if (esValidation == null)
	esValidation = false
	esValidation = (esValidation === "false") != Boolean(esValidation);

logger.info("******Printing Environment Variables*******")
logger.info("Test browser: " + browser)
logger.info("Test environment: " + environment)
logger.info("Elastic Search environment: " + esEnvironment)
logger.info("Username: " + username)
logger.info("Suites: " + suitesList)
logger.info("buildURL: " + buildURL)
logger.info("Post to Slack: " + postSlack)
logger.info("esValidation: " + esValidation)
logger.info('esHostname',"https://"+process.env.ESUsername+":xxxxx@"+process.env.ESEnvironment+".multicloud-ibm.com:9200")
logger.info("*******************************************")
var specArray = util.generateRuntimeSpecString(suitesList);
logger.info(specArray);	


exports.config = {
	    seleniumAddress: 'http://localhost:4444/wd/hub',
	    allScriptsTimeout: 1740000,
	    useAllAngular2AppRoots: true,
	    specs: specArray,
	    directConnect: true,
	    
	     
	    framework: 'jasmine2',
	    jasmineNodeOpts: {
	        onComplete: null,
	        isVerbose: false,
	        showColors: true,
	        includeStackTrace: true,
	        defaultTimeoutInterval : 3000000,
	        allScriptsTimeout: 20000000,
	        useAllAngular2AppRoots: true
	    },
	    
	    params: {
	        url: "https://"+environment+".multicloud-ibm.com",//"mygravitant.com"
	        apiUrl: "https://"+environment+"-api.multicloud-ibm.com",
	        esHostName:"https://"+esUsername+":"+esPassword+"@"+esEnvironment+".multicloud-ibm.com:9200",
	        username: username,
	        password: password,
	        secretKey: secretKey,
	        userId: userId,
	        apiKey: apiKey,
	        tenantId: tenantId,
	        postSlack: postSlack,
	        postSlackWebhookURL : postSlackWebhookURL,
	        buildURL: buildURL,
			dataValiadtion: dataValiadtion,
			esValidation: esValidation
	    },
	    
	    plugins: [{
		    package: "jasmine2-protractor-utils",
		    disableHTMLReport: true,
		    disableScreenshot: false,
		    screenshotPath: "./reports/screenshots",
		    htmlReportDir: './reports/htmlReports',
		    screenshotOnExpectFailure:false,
		    screenshotOnSpecFailure:true,
		    clearFoldersBeforeTest: true
		  }],
	    
	    onPrepare: function () {
	        require('./helpers/onPrepare.js');        
	        ensureAiopsHome(username, password);
	        
			var myReporter = {				
					suiteStarted: function(result) {
						logger.info("Suite started: " + result.description);
			        },		        
			        specStarted: function(result) {
			        	logger.info("Test started: " + result.description);
			        },		        
			        specDone: function(result) {
			        	logger.info("Test "+result.status+": " + result.description);
			        	for(var i = 0; i < result.failedExpectations.length; i++)
			        		logger.info("Failure reason: " + result.failedExpectations[i].message);
			        	logger.info("-------------------------------------------------------------------------------------------");
			        },		        
					suiteDone: function(result) {
						logger.info("afterAll "+result.status+": " + result.description);
						for(var i = 0; i < result.failedExpectations.length; i++) {
							logger.info("Failure reason: " + result.failedExpectations[i].message);
							logger.info(result.failedExpectations[i].stack);
						}
						logger.info("-------------------------------------------------------------------------------------------");
						logger.info("Suite completed: " + result.description);
						logger.info("===========================================================================================");
			        }	        
				 };
			jasmine.getEnv().addReporter(myReporter);
	        jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
	            savePath: 'reports/htmlReports',
	            consolidate: true,
	            useDotNotation: true
	        }));
	        
	        jasmine.getEnv().addReporter(
	                new Jasmine2HtmlReporter({
	                  savePath: 'reports/htmlReports',
	                  takeScreenshots: true,
	                  takeScreenshotsOnlyOnFailures: true,
	                  fileNamePrefix: 'Regression_AiopsInventory',
	                  fixedScreenshotName: true
	                })
	        );        
	    },
	    onComplete: async function(){
	    	var reportGenerator =  require('./helpers/utilsAiopsTools.js');
			await postToSlack().then(function () {
	            reportGenerator.generateHTMLReport('Aiops Suite');
	        });
	    }
	};

	if(browser=="chrome"){
		exports.config["capabilities"] = {
	        browserName: browser,
			chromeOptions: {
				args: ["--headless","--disable-gpu","--window-size=2500,2500",'disable-extensions',"--test-type","--no-sandbox", "disable-infobars=true","--disable-gpu-sandbox", "--start-maximized", "--disable-dev-shm-usage"],
				//args: ["--test-type","--no-sandbox", "disable-infobars=true"],
				prefs: {
					'download':	{
						'prompt_for_download': false,
						'directory_upgrade': true,
						'default_directory': path.resolve('aiops_reports')
					},
					'browser': {
						'set_download_behavior': {
							'behavior': 'allow'
						}
					},
					'safebrowsing': {
						'enabled': true
					},
					'profile': {
						'default_content_setting_values': {'automatic_downloads' : 1},
						'content_settings': {
							'pattern_pairs':{
								'*': {
									"multiple-automatic-downloads" : 1
								}
							}
						} 
					}
				}
			}
	    }

	}else if(browser="firefox"){
		exports.config["capabilities"] = {
	        'browserName': browser,
	        'moz:firefoxOptions': {
	        //'args': ['--safe-mode']
	        'args': ['--headless']
	        }
	      }

	}