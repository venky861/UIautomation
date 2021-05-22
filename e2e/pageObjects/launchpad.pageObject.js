/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var extend = require('extend');
var url = browser.params.url;
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var EC = protractor.ExpectedConditions;
var util = require('../../helpers/util.js');
var timeout = require('../../testData/timeout.json');
var launchpadTestData = require('../../testData/cards/launchpadTestData.json');
var frames = require('../../testData/frames.json');


var defaultConfig = {
        topHeaderCss:                   		"a.bx--header__name",
        hamburgerLinkCss:               		"ibm-hamburger svg",
        leftNavBarCss:                  		'ibm-sidenav',
		textLeftNavCardCss:             		'a.bx--side-nav__link span',
		leftBtnSubmenuCss: 						'.bx--side-nav__submenu-title',
		leftBtnSubmenuParentXpath: 				'//*[@class="bx--side-nav__submenu-title"]/parent::button',
		userHeaderActionCss:					"[class='bx--header__action'][title='User']",
		logoutBtnCss:							"div.profile-main button[ibmbutton='primary']",
		logoutSuccessMsgCss:					".content h1",
		loginCss:								"button[ibmbutton='primary']",
		intelligentItOprLinkXpath:				"//a[contains(text(), 'AIOps - Intelligent IT Operations')]",
		commonTaskHeaderCss:					"div.launchpad-main h2",
		commonTaskTitleCss:						"ibm-tile.mcmp-tile h3",
		showAllTasksXpath:						"//a[@class='mcmp-link'][contains(text(), 'Show all tasks')]",
		areaExpandedAttribute:					"aria-expanded",
		classAttribute:							"class",
		welcomeMsgCss:							"div.launchpad-main h1",
		crossSymbolCss:							"ibm-hamburger svg[ibmIcon='close']",
		usernameCss:							"#username",
		continueButtonCss:						"#continue-button",
		dashboardTileXpath:						"//div[@class='tile-title' and contains(text(), '{0}')]",
		mcmpSectionHeadersCss:					".section-header h3",
		allSectionTilesFromSectionHeaderXpath:	"//*[contains(@class,'section-header')]//h3[contains(text(),'{0}')]//parent::div//following-sibling::div//div[@class='tile-title']",
		sectionTileFromSectionHeaderXpath:		"//*[contains(@class,'section-header')]//h3[contains(text(),'{0}')]//parent::div//following-sibling::div//div[@class='tile-title' and contains(text(),'{1}')]",
		tasksMenuXpath :                        "*//ibm-icon-task",
		operationsCommonTasksXpath :            "//div[@class='bx--panel--overlay bx--panel--expanded']//child::span[@class='bx--side-nav__submenu-title' and contains(text(), 'Operations')]",
		operationsButtonCommonTasksXpath :      "//div[@class='bx--panel--overlay bx--panel--expanded']//child::span[@class='bx--side-nav__submenu-title' and contains(text(), 'Operations')]//parent::button",
		commonTaskNavCardCss:    		        "a.bx--side-nav__link span",
		myTeamSectionXpath:						"//div[@class='profile-main']//p[2]",
		clickOnProfileCss:						"ibm-icon-user-avatar.ibm-icon"
};	

function launchpad(selectorConfig) {
	if (!(this instanceof launchpad)) {
		return new launchpad(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

launchpad.prototype.open = function(){
	util.waitForAngular();
	util.switchToDefault();
	this.clickOnMCMPHeader();
};

/**
 * Method to click on left top MCMP header
 */
launchpad.prototype.clickOnMCMPHeader = function(){
    util.waitForAngular();
    util.switchToDefault();
    browser.wait(EC.elementToBeClickable(element(by.css(this.topHeaderCss))), timeout.timeoutInMilis);
	var ele = element(by.css(this.topHeaderCss));
	browser.executeScript("arguments[0].click();", ele.getWebElement()).then(function () {
		logger.info("Clicked on left top header text : IBM services for multicloud management");		
	});
};


/**
 * Method to check & click on hamburger link based on left navigation bar is open, pinned or hidden
 */
launchpad.prototype.clickOnHamburgerMenu = function(actionPerform){
	var self= this;
	util.waitForAngular();
	util.switchToDefault();
	self.getHamburgerNavigationStatus().then(function(status){
		logger.info("Action to be performed : "+actionPerform);
		logger.info("Navigation bar status : "+status);
		if(actionPerform == status){
			logger.info("Left navigation bar is "+ status);
		}else if(actionPerform != status){
			logger.info("Left navigation bar is "+ status);
			browser.wait(EC.visibilityOf(element(by.css(self.hamburgerLinkCss))), timeout.timeoutInMilis);
			element(by.css(self.hamburgerLinkCss)).click().then(function(){
				logger.info("Clicked on hamburger link at top");
			});
		}
	});
};


/**
 * Method to check the (cross) X symbol after clicking on the hamburger link
 */
launchpad.prototype.isHamburgerCrossSymbolDisplayed = function(){
	var self= this;
    util.waitForAngular();
    return element(by.css(self.crossSymbolCss)).isPresent().then(function(value){
    	logger.info("is cross symbol present "+ value);
    	if(value){
			return element(by.css(self.crossSymbolCss)).isDisplayed().then(function(bool){
	        	logger.info("is cross symbol displayed : "+ bool);
	        	return bool;
	        });
    	} else{
    		logger.info("is cross symbol displayed : "+ value);
    		return value;
    	}
    });
};

/**
 * method to check left navigation bar is open, pinned or hidden
 */
launchpad.prototype.getHamburgerNavigationStatus = function(){
	var self= this;
    util.waitForAngular();
    var status;
	return element(by.css(self.leftNavBarCss)).getAttribute(self.classAttribute).then(function(res){
		if(res.includes(launchpadTestData.leftNavigationExpanded)) {
			status = launchpadTestData.leftNavigationExpanded;
			logger.info("Left navigation bar is opened");
		}
		else if(res.includes(launchpadTestData.leftNavigationPinned)) {
			status = launchpadTestData.leftNavigationPinned;
			logger.info("Left navigation bar is pinned and opened");
		}
		else {
			status = launchpadTestData.leftNavigationHidden;
			logger.info("Left navigation bar is hidden");
		}			
	    return status;
	});
};

/**
 * Method to check the card link presence after clicking on the hamburger link based on input provided
 */
launchpad.prototype.isCardDisplayedOnLeftNavigation = function(cardName){
	var self= this;
    util.waitForAngular();
    var status = false;
    return element.all(by.css(self.textLeftNavCardCss)).getText().then(function(cards){
    	for(var i=0; i<cards.length; i++){
    		if(cards[i]==cardName){
    			return element.all(by.css(self.textLeftNavCardCss)).get(i).isDisplayed().then(function(bool){
    	        	logger.info("is card "+cardName+" link displayed : "+ bool);
    	        	status = bool;
    	        	return status;
    	        });
        	}
    	}
    	return status;
    });
};


/**
 * Method to click on left navigation card based on name
 */
launchpad.prototype.clickLeftNavCardBasedOnName = function(cardName){
    var self= this;
    util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.textLeftNavCardCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(self.textLeftNavCardCss)).getText().then(function(links){
		for(var i=0; i<links.length; i++) {			
			if(links[i]==cardName) {
				browser.wait(EC.visibilityOf(element.all(by.css(self.textLeftNavCardCss)).get(i)), timeout.timeoutInMilis);
				element.all(by.css(self.textLeftNavCardCss)).get(i).click().then(function() {
					logger.info("Clicked on " + cardName + " link on left navigation bar");
				});
			}			
		}		
	});
};


/**
 * Method to click on Left navigation button based on name
 */
launchpad.prototype.clickToExpandLeftNavButton = function(navBtn){
    var self= this;
    util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.leftBtnSubmenuCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(self.leftBtnSubmenuCss)).getText().then(function(btns){
		for(var i=0; i<btns.length; i++) {	
			if(btns[i]==navBtn) {
				browser.wait(EC.visibilityOf(element.all(by.css(self.leftBtnSubmenuCss)).get(i)), timeout.timeoutInMilis);			
				element.all(by.css(self.leftBtnSubmenuCss)).get(i).click().then(function() {
					logger.info("Clicked on " + navBtn + " button on left navigation bar");					
				});				
			}		
		}
	});
};


/**
 * Method to check and click on left navigation menu based on name
 */
launchpad.prototype.clickOnleftNavigationMenuBasedOnName = function(navBtn){
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.leftBtnSubmenuCss)).get(0)),timeout.timeoutInMilis);
	element.all(by.css(self.leftBtnSubmenuCss)).getText().then(function(text) {
		for(var i=0;i<text.length;i++) {
			if(text[i]==navBtn) {
				element.all(by.xpath(self.leftBtnSubmenuParentXpath)).get(i).getAttribute(self.areaExpandedAttribute).then(function(res){
					if(res=="false" || res=="null" || res==null){
						self.clickToExpandLeftNavButton(navBtn);
					}
					else{ 
						logger.info(navBtn+" is already expanded");
					}
				});
			}
		}
	});
};



/**
 * Method to click on user header action icon
 */
launchpad.prototype.clickOnUserHeaderActionIcon = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.userHeaderActionCss))), timeout.timeoutInMilis);
	//element(by.css(this.userHeaderActionCss)).click().then(function(){
	browser.executeScript("arguments[0].click();", element(by.css(this.userHeaderActionCss))).then(function () {
		logger.info("Clicked on user header action icon");
	});
};

/**
 * Method to get myTeams on user profile
 */
launchpad.prototype.getMyTeamsOnProfile = async function(adminRoleTeams){
	util.switchToDefault();
	util.waitForAngular();
	var myTeams=''
	var adminCardBool = false
	browser.wait(EC.visibilityOf(element(by.xpath(this.myTeamSectionXpath))), timeout.timeoutInMilis);
	 await element(by.xpath(this.myTeamSectionXpath)).getText().then(function(myTeam){
		 myTeams = myTeam
		 logger.info('My teams is '+ myTeams)
	 })
	 browser.wait(EC.elementToBeClickable(element(by.css(this.clickOnProfileCss))), timeout.timeoutInMilis);
	 await element(by.css(this.clickOnProfileCss)).click().then(function(){
		logger.info("Clicked on user header action icon");
	 })
	 var team =myTeams.split(',').map((team)=>team.trim())
	 for(var i = 0 ; i < team.length; i++){
		if( adminRoleTeams.includes(team[i])){
			adminCardBool = true
		}
	 }
	 return adminCardBool
}


/**
 * Method to click on logout button
 */
launchpad.prototype.clickOnLogoutButton = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.logoutBtnCss))), timeout.timeoutInMilis);
	//element(by.css(this.logoutBtnCss)).click().then(function(){
	browser.executeScript("arguments[0].click();", element(by.css(this.logoutBtnCss))).then(function () {
		logger.info("Clicked on logout button");
	});
};


/**
 * Method to get logout success/failure text message 
 */
launchpad.prototype.getTextLogoutMessage = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.logoutSuccessMsgCss))), timeout.timeoutInMilis);
	return element(by.css(this.logoutSuccessMsgCss)).getText().then(function(text){
		logger.info("Logout message : "+text);
		return text;
	});
};

/**
 * Method to click on logIn button
 */
launchpad.prototype.clickOnLogInButton = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.loginCss))), timeout.timeoutInMilis);
	//element(by.css(this.loginCss)).click().then(function(){
	browser.executeScript("arguments[0].click();", element(by.css(this.loginCss))).then(function () {
		logger.info("Clicked on logIn button");
	});
};

/**
 * Method to click on common task title based on name
 */
launchpad.prototype.clickOnCommonTaskTitleBasedOnName = function(titlename){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.commonTaskTitleCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(self.commonTaskTitleCss)).getText().then(function(text){
		for(var i = 0; i<text.length; i++){
			if(text[i]==titlename){
				element.all(by.css(self.commonTaskTitleCss)).get(i).click().then(function(){
					logger.info("Clicked on common task title");
				});
			}
		}
	});
};


/**
 * Method to get card names from common task
 */
launchpad.prototype.getCardNamesFromCommonTask = function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.commonTaskTitleCss)).get(0)), timeout.timeoutInMilis);
	this.clickOnShowAllTasksLink();
	return element.all(by.css(self.commonTaskTitleCss)).getText().then(function(text){
		logger.info("cards name from common task : "+ text);
		return text;
	});
};

/**
 * Method to get common task title
 */
launchpad.prototype.getCommonTaskHeaderText = function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.commonTaskHeaderCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(self.commonTaskHeaderCss)).get(0).getText().then(function(text){
		logger.info("common task title text : "+ text);
		return text;
	});
};

launchpad.prototype.clickOnTileBasedOnHeaderAndTileName = function(headerName, tileName){
	this.clickOnShowAllTasksLink();
	var sectionTileXpath = this.sectionTileFromSectionHeaderXpath.format(headerName, tileName);
	browser.wait(EC.visibilityOf(element(by.xpath(sectionTileXpath))), timeout.timeoutInMilis);
	element(by.xpath(sectionTileXpath)).click().then(function(){
		logger.info("Clicked on tile "+tileName+" from header section "+headerName);
	})
}

launchpad.prototype.getAllTilesFromSpecificHeaderSection = function(headerName){
	var allSectionTilesXpath = this.allSectionTilesFromSectionHeaderXpath.format(headerName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(allSectionTilesXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(allSectionTilesXpath)).getText().then(function(tilesList){
		logger.info("Tiles name from header "+headerName+": "+tilesList);
		return tilesList;
	})
}

launchpad.prototype.verifySectionHeaderIsPresentOrNot = function(headerText){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.mcmpSectionHeadersCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.mcmpSectionHeadersCss)).getText().then(function(headersList){
		var i=0;
		for(i=0; i<headersList.length; i++){
			if(headersList.includes(headerText)){
				logger.info(headerText+" is present");
				return true;
			}
		}
		if(i==headersList.length){
			logger.includes(headerText+" is not present");
			return false;
		}
	})
}

/**
 * Method to click on show all tasks link if present
 */
launchpad.prototype.clickOnShowAllTasksLink = function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.showAllTasksXpath))), timeout.timeoutInMilis).then(function(){
		element(by.xpath(self.showAllTasksXpath)).click().then(function(){
			logger.info("Clicked on Show all tasks link");
		});
	}).catch(function(){
		logger.info("Show all tasks link is not present");
	});
};



/**
 * Method to click on aiops intelligent it operation link
 */
launchpad.prototype.clickOnIntelligentItOprLink = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.xpath(this.intelligentItOprLinkXpath))), timeout.timeoutInMilis);
	//element(by.xpath(this.intelligentItOprLinkXpath)).click().then(function(){
	browser.executeScript("arguments[0].click();", element(by.xpath(this.intelligentItOprLinkXpath))).then(function () {
		logger.info("Clicked on AIOPS intelligent IT operation link");
	});
};


/**
 * Method to get welcome message
 */
launchpad.prototype.getWelcomeMessageTxt = function() {
	browser.wait(EC.visibilityOf(element.all(by.css(this.welcomeMsgCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.welcomeMsgCss)).get(0).getText().then(function(text){
		logger.info("Welcome Text message : "+text);
		return text;
	});
};

launchpad.prototype.clickOnDashboardTile =  async function(title){
	var dashboardTitle = this.dashboardTileXpath.format(title);
	browser.wait(EC.visibilityOf(element(by.xpath(dashboardTitle))), timeout.timeoutInMilis);
	await element(by.xpath(dashboardTitle)).click().then(async function(){
		logger.info("Clicked on "+title+" tile");
		// await util.switchToNewTabByClosingOldTab();
	});
}

/**
 * Method to enter username on input field
 */
launchpad.prototype.enterUserName = function(userName) {
	browser.wait(EC.visibilityOf(element(by.css(this.usernameCss))), timeout.timeoutInMilis);
	element(by.css(this.usernameCss)).sendKeys(userName).then(function(){
		logger.info("Enterred username  : "+ userName);
	});
};


/**
 * Method to click on continue button after entering username
 */
launchpad.prototype.clickOnContinueButton = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.continueButtonCss))), timeout.timeoutInMilis);
	browser.executeScript("arguments[0].click();", element(by.css(this.continueButtonCss))).then(function () {
		logger.info("Clicked on continue button");
	});
};

/**
 * Method to click on logout button and login again
 */
launchpad.prototype.clickOnLogoutAndLogin = function(username, password) {
	util.switchToDefault();
	this.clickOnUserHeaderActionIcon();
	this.clickOnLogoutButton();
	browser.restart().then(function(){
		logger.info("Restarting browser...");
		ensureAiopsHome(username, password);
	})
};

launchpad.prototype.clickOnTasksIcon = async function () {
	var self = this;
	util.waitForAngular();
	self.open();

	// Click on tasks menu (top right corner)
	await browser.wait(EC.elementToBeClickable(element(by.xpath(self.tasksMenuXpath))),timeout.timeoutInMilis).then(async function(){
		await element(by.xpath(self.tasksMenuXpath)).click().then(function () {
			logger.info('Clicked on tasks icon');
		});
	})
};

launchpad.prototype.clickAndExpandOperationsLink = async function () {
	util.waitForAngular();
	var self = this;
		// Expand operations menu only if its collapsed
		await browser.wait( EC.elementToBeClickable(element(by.xpath(self.operationsCommonTasksXpath))),timeout.timeoutInMilis).then(async function(){
			await element(by.xpath(self.operationsButtonCommonTasksXpath)).getAttribute('aria-expanded').then(async function (aria_expanded_value) {
				if (!aria_expanded_value) {
				  await element(by.xpath(self.operationsCommonTasksXpath)).click().then(function () {
						logger.info('Expand Operations menu under common task');
					});
				}else{
				  logger.info('Operations menu under common task is already expanded');
				}
			});
		})
};

launchpad.prototype.clickOnLinksUnderOperations = async function (linkName,switchTomcmpIframe) {
	var self = this;
	util.waitForAngular();

	// Navigate to respective card page by clicking on it
	await element.all(by.css(self.commonTaskNavCardCss)).getText().then(async function(links){
		for (var i = 0; i < links.length; i++) {
			if (links[i] == linkName) {
			    await browser.wait(EC.elementToBeClickable(element.all(by.css(self.commonTaskNavCardCss)).get(i)),timeout.timeoutInMilis).then(async function(){
					await element.all(by.css(self.commonTaskNavCardCss)).get(i).click().then(async function () {
						logger.info('Clicked on ' + linkName + ' link under common tasks menu');
						// Switch to the mcmp iframe
						if(switchTomcmpIframe){
							util.switchToFrameById(frames.mcmpIframe);
							util.waitForAngular();
						}
					});
				})
			}
		  }	  
	});
};
	
launchpad.prototype.clickOnCommonTasksMenuLink = async function (linkName,switchTomcmpIframe) { 
	await this.clickOnTasksIcon();
    await this.clickAndExpandOperationsLink();
	await this.clickOnLinksUnderOperations(linkName,switchTomcmpIframe);
};

module.exports = launchpad;