/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var extend = require('extend');
var url = browser.params.url;
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var launchpadPage = require('./launchpad.pageObject.js'),
	launchpadObj = new launchpadPage();
var launchpadTestData = require('../../testData/cards/launchpadTestData.json');
var pervasiveInsightsTestData = require('../../testData/cards/pervasiveInsightsTestData.json');
var EC = protractor.ExpectedConditions;
var util = require('../../helpers/util.js');
var frames = require('../../testData/frames.json');
var timeout = require('../../testData/timeout.json');
var serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js');


var defaultConfig = {
	pageUrl: url,
	globalDateRangeLabelCss: "div.glsc-date-range-label p",
	priorityViewFiltersXpath: "(//div[contains(@data-title,'Priority View')])[1]//*[contains(@class,'highcharts-series')]//*[name()='rect']",
	priorityViewFiltersTspanTitleXpath: "(//div[contains(@data-title,'Priority View')])[1]//*[contains(@class,'highcharts-data-labels')]//*[name()='tspan' and contains(text(),'{0}')][1] | //*[name()='title' and contains(text(),'{0}')]//preceding-sibling::*[name()='tspan'][1]",
	toolTipTextLabelCss: ".highcharts-tooltip tspan:nth-child(2)",
	toolTipTextCountCss: ".highcharts-tooltip tspan:nth-child(4)",
};	

function pervasive(selectorConfig) {
	if (!(this instanceof pervasive)) {
		return new pervasive(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
pervasive.prototype.open = function(){
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.pervasiveInsightsCard);
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
};


/**
 * Method to get global date-range label text
 */
pervasive.prototype.getGlobalDateRangeLabelText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalDateRangeLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.globalDateRangeLabelCss)).getText().then(function(labelText){
		logger.info("Global date-range label text : "+labelText.trim());
		return labelText.trim();
	});
};

/**
 * Method to click on specific Priority view filter based on priority type
 * priorityType -- P1 - Critical, P2 - Major, P3 - Minor, P4 - Low
 */
pervasive.prototype.clickOnPriorityViewFilter = async function(priorityType){
	var tspanTitleXpath = this.priorityViewFiltersTspanTitleXpath.format(priorityType);
	util.waitForAngular();
	await util.waitForInvisibilityOfKibanaDataLoader();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.priorityViewFiltersXpath)).get(0)), timeout.timeoutInMilis);
	element.all(by.xpath(tspanTitleXpath)).count().then(function(count){
		if(count != 0){
			browser.actions().mouseMove(element(by.xpath(tspanTitleXpath))).click().perform().then(function(){
				logger.info("Clicked on "+priorityType+" filter.");
			});
		}
		else{
			logger.info(priorityType+" is not found.");
		}
	});
}

/**
 * Method to get total ticket count from Priority View filter
 * legendsList - List of legend names in the Priority view filter
 */
pervasive.prototype.getTotalTicketCountFromPriorityViewFilter = async function(legendsList){
	var totalTicketCount = 0;
	for(var legendName of legendsList){
		// Trim priority type from legend
		var priorityType = legendName.split("-")[1].trim();
		var ticketCount = await serviceMgmtUtil.getCountFromBoxFilterSections(pervasiveInsightsTestData.priorityViewWidgetName, priorityType);
		totalTicketCount = totalTicketCount + ticketCount;
	}
	logger.info("Total ticket count from Priority View Filter: "+ totalTicketCount);
	return totalTicketCount;
}
/**
 * Method to compare  all elements present in from Top 50 servers widget
 * matches with ES
 * @param tagListUI which is retrieved from UI
 * @param cloudtagListFromES which is retrieved from ES
 * @returns boolean @var status
 */
pervasive.prototype.getCloudTagListStatus = function(tagListUI,cloudtagListFromES){
	let status = true;
	cloudtagListFromES.forEach(function (item){
		if(!tagListUI.includes(item))
			status = false;
	});
	logger.info(" Top 50 servers tag list status: "+ status);
	return status;
}

module.exports = pervasive;