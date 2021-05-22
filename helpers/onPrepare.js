/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

var logGenerator = require("./logGenerator.js");
var util = require('./util.js');
var apiUtil = require("./apiUtils.js");
var appUrls = require('../testData/appUrls.json');
var logger = logGenerator.getApplicationLogger();
var secretKey = browser.params.secretKey;
var username="#username";
var usernameLogin ="#user-name-input"
var password= "#password-input";
var signinbutton='#login-button';
var loginButtonCss="#signinbutton";
var noticeHeaderCss=".privacy-header";
var privacyPolicyAcceptBtnCss='.privacy-footer button:nth-child(2)';
var authenticatorAppOtp = "input#otp-input";
var submitBtn = "#submit_btn";
var continueBtnCss = "#continue-button";
var kibanaLandingTextCss = "#spaceSelectorRoot h1";
var w3idCredsLinkCss = "#credsDiv";
var incorrectPasswordMsgCss="p.login-error-text";
var loginCount=1;




global.isAngularApp = function (flag) {
    browser.ignoreSynchronization = !flag;
};

global.ensureAiopsHome = function (appUserName, appPassword) {
	var EC = protractor.ExpectedConditions;
	isAngularApp(false);
	browser.get(browser.params.url).then(function () {
		logger.info("Launched browser and navigated to URL: " + browser.params.url);
		browser.sleep(5000);
    // browser.wait(EC.visibilityOf(element(by.css(w3idCredsLinkCss))), 45000).then(function () {
	// 		element(by.css(w3idCredsLinkCss)).click().then(function(){
	// 			logger.info("Clicked on w3id Credentials link..");
	// 		})
	// 	}).catch(function(){
	// 		logger.info("w3id Credentials link is not present..");
	// 	})

		browser.wait(EC.visibilityOf(element(by.css(username))), 60000).then(function () {
			logger.info("Waited till Username text box is visible on the page");
			element(by.css(username)).clear().then(function () {
				logger.info("Cleared Username input box");
				element(by.css(username)).sendKeys(appUserName).then(async function () {
					logger.info("Entered " + appUserName + " in Username input box");
					var currentUrl = await util.getCurrentURL();
					if(!appUserName.includes(appUrls.ibmEmail)){
						browser.wait(EC.visibilityOf(element(by.css(continueBtnCss))), 30000);
						element(by.css(continueBtnCss)).click().then(function(){
							logger.info("clicked on continue button");
							util.waitForAngular();
							browser.wait(EC.visibilityOf(element(by.css(password))), 30000).then(function () {
								logger.info("Waited till Password input box is visible on login page");
								element(by.css(password)).sendKeys(appPassword).then(function () {
									element(by.css(loginButtonCss)).click().then(async function () {
										logger.info("Clicked on Sign In button");
										await element(by.css(incorrectPasswordMsgCss)).isPresent().then(function (result) {
											if(result){
												logger.info("Password is incorrect", result);
											}
										})
										browser.sleep(5000);
										util.waitForAngular();
									});
								});
							});
						});
					}
					else if(currentUrl.includes(appUrls.w3idSSOUrl)){
						browser.wait(EC.visibilityOf(element(by.css(password))), 30000).then(function () {
							logger.info("Waited till Password input box is visible on login page");
							element(by.css(password)).sendKeys(appPassword).then(function () {
								//logger.info("Entered " + appPassword + " in password input box");
								element(by.css(signinbutton)).click().then(async function () {
									logger.info("Clicked on Sign In button");
									browser.sleep(5000);
									await element(by.css(incorrectPasswordMsgCss)).isPresent().then(function (result) {
										if(result){
											logger.info("Password is incorrect", result);
										}
									})
									util.waitForAngular();
								});
							});
						});
					}else{
						browser.wait(EC.visibilityOf(element(by.css(continueBtnCss))), 30000);
						element(by.css(continueBtnCss)).click().then(function(){
							logger.info("clicked on continue button");
							util.waitForAngular();
							// Click on W3 Credentials option
							browser.wait(EC.visibilityOf(element(by.css(w3idCredsLinkCss))), 45000).then(function () {
                                element(by.css(w3idCredsLinkCss)).click().then(function(){
                            	    logger.info("Clicked on w3id Credentials link..");
                            	})
                            }).catch(function(){
									 logger.info("w3id Credentials link is not present..");
									 logger.info("Attempts tried to login: "+loginCount);
									 loginCount++
										if(loginCount < 4){
										ensureAiopsHome(appUserName,appPassword)
									}
                            })
							browser.wait(EC.visibilityOf(element(by.css(usernameLogin))), 60000).then(function(){
								logger.info("Waited till Username text box is visible on the sso page");
								element(by.css(usernameLogin)).clear().then(function(){
									logger.info("Cleared Username input box");
									element(by.css(usernameLogin)).sendKeys(appUserName).then(function(){
										logger.info("Entered " + appUserName + " in Username input box");						
										browser.wait(EC.visibilityOf(element(by.css(password))), 30000).then(function () {
											logger.info("Waited till Password input box is visible on login page");
											element(by.css(password)).sendKeys(appPassword).then(function () {
												element(by.css(signinbutton)).click().then(async function () {
													logger.info("Clicked on Sign In button");
													await element(by.css(incorrectPasswordMsgCss)).isPresent().then(function (result) {
														if(result){
															logger.info("Password is incorrect", result);
														}
													})
													browser.sleep(5000);
													util.waitForAngular();
												});
											});
										});
									});									
								});								
							});
						});
					}
				});
			});
		});
	});
	
	browser.wait(EC.visibilityOf(element(by.css(authenticatorAppOtp))), 20000).then(async function (){
		logger.info("Navigated to Authorize this device page");
			var passCode = await apiUtil.getGoogleAuthPassCode(secretKey);
			logger.info("Generated passcode : ", passCode);
			element(by.css(authenticatorAppOtp)).sendKeys(passCode).then(function(){
				logger.info("Entered passcode for verification : "+passCode);
				element(by.css(submitBtn)).click().then(function(){
					logger.info("Clicked on submit button");
				});
			});
	}).catch(function(){
		logger.info("Authorization page is not displayed");
	});
	 
	browser.wait(EC.urlContains(appUrls.privacy), 60000).then(function () {
		logger.info("Navigated to privacy page...");
		browser.wait(EC.visibilityOf(element(by.css(noticeHeaderCss))), 60000).then(function (){
			element(by.css(noticeHeaderCss)).isDisplayed().then(function (result) {
				if (result  == true) {
					logger.info("Privacy policies page displayed...");							
					element(by.css(privacyPolicyAcceptBtnCss)).click().then(function(){
						logger.info("Clicked on I accept button in the Privacy statement page...")
					});	
				}
			});
		});
	}).catch(function(){
		logger.info("Privacy page is not displayed..");
		logger.info("Attempts tried to login: "+loginCount);
		loginCount++
			if(loginCount < 4){
			ensureAiopsHome(appUserName,appPassword)
		}
	});

	browser.wait(EC.urlContains(appUrls.launchpad), 60000).then(function () {
		logger.info("Waited till browser url contains "+appUrls.launchpad);
		util.waitForAngular();
		browser.driver.manage().window().maximize();
	});
	
}