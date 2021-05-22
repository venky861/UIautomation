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
var launchpadPage = require('./launchpad.pageObject.js'),
	launchpadObj = new launchpadPage();
var launchpadTestData = require('../../testData/cards/launchpadTestData.json');
var incidentManagementTestData = require('../../testData/cards/incidentManagementTestData.json');
var serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js');
var util = require('../../helpers/util.js');
var frames = require('../../testData/frames.json');
var timeout = require('../../testData/timeout.json');


var defaultConfig = {
		pageUrl:                      				url,
		originalActualPriorityxpath: "//div[contains(@data-title,'{0}')]//table/tfoot/tr/th"
};	

function incidentmgmt(selectorConfig) {
	if (!(this instanceof incidentmgmt)) {
		return new incidentmgmt(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
incidentmgmt.prototype.open = function(){
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.incidentManagementCard);
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
};


/**
 * Method to get sum of P1 - Severe, P2 - Major, P3 - Minor, P4 - Minimal in Original Vs Actual Priority widget
 * Widget name: Original Vs Actual Priority widget ( It can be used in all treemap widget)
 * Params: Original Vs Actual Priority widget title, priority widget title xpath and Original Vs Actual Priority child xpath
 */
incidentmgmt.prototype.getOriginalvsActualcountVal = async function(widgetTitle)
{	
	var originalActualXpath = this.originalActualPriorityxpath.format(widgetTitle)
	var totalChildCount= await serviceMgmtUtil.childElementCount(widgetTitle, this.originalActualPriorityxpath);
	var totalPriority = 0;
	var priorityCountValue;
	logger.info("P1 - Severe, P2 - Major, P3 - Minor, P4 - Minimal Total values");
	for (var i = 1; i < totalChildCount; i++) {
		browser.wait(EC.visibilityOf(element.all(by.xpath(originalActualXpath)).get(i)), timeout.timeoutInMilis);
		var priorityCount  = await element.all(by.xpath(originalActualXpath)).get(i).getText();
		priorityCountValue =  util.stringToInteger(priorityCount);
		logger.info("value from original vs actual view ",priorityCountValue);
		totalPriority = totalPriority + priorityCountValue;
	}
	logger.info("Original Vs Actual Priority Total " + ": " + totalPriority);
	return totalPriority;
}

module.exports = incidentmgmt;