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
var frames = require('../../testData/frames.json');
var launchpadPage = require('./launchpad.pageObject.js'),
	launchpadObj = new launchpadPage();
var launchpadTestData = require('../../testData/cards/launchpadTestData.json');


var defaultConfig = {
	pageUrl: url,
	visualisationContainerSpanCss: "#embeddedPanel  div.mtrVis__value > span",
	widgetNameXpath: "//span[@class='embPanel__titleText'][contains(text(), '{0}')]",
	NoResultFoundTextXpath: "//*[contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//div[@class='visError']//p",
	firstMultiselectFilterValueXpath : "//span[normalize-space(text())='{0}']//parent::button/following-sibling::ul//label",
	TicketCountTableTotalCountXpath:"//*[contains(text(), 'Ticket Count')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//tfoot//th[2]"
};

function problemmgmt(selectorConfig) {
	if (!(this instanceof problemmgmt)) {
		return new problemmgmt(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
problemmgmt.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.problemManagementCard);
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
};


/**
 *  Method to check if  results are Found or Not on Widgets
 */
problemmgmt.prototype.isNoResultFoundTextPresentOnWidgets = function (widgetName) {
	util.waitForAngular();
	util.waitForInvisibilityOfKibanaDataLoader();
	var NoResultFoundText = this.NoResultFoundTextXpath.format(widgetName);
	return element.all(by.xpath(NoResultFoundText)).count().then(function(count){
		if(count != 0){
			return element(by.xpath(NoResultFoundText)).isDisplayed().then(function (bool) {
				if (bool) {
					logger.info("Is No data available text present for " + widgetName + " : " + bool);
					return true;
				}
			});
		}
		else {
			logger.info("Is No data available text present for " + widgetName + " : " + false);
			return false;
		}
	});
};
//get Last or only filter value present in the Global filter list 
problemmgmt.prototype.getFilterValueTextBasedOnName = function(filterName) {
    var filterValueCheckbox = this.firstMultiselectFilterValueXpath.format(filterName);
    if(element(by.xpath(filterValueCheckbox)).isDisplayed()){
            return element.all(by.xpath(filterValueCheckbox)).last().getText().then(function(filterValue){
                logger.info("Filter Value test is : " + filterValue.trim());
                return filterValue.trim();
            })
    }
}
// get total count for 'count' column of table 'Ticket Count'
problemmgmt.prototype.getTicketCountTableTotalCountText = function() {
	browser.wait(EC.visibilityOf(element(by.xpath(this.TicketCountTableTotalCountXpath))), timeout.timeoutInMilis);
            return element(by.xpath(this.TicketCountTableTotalCountXpath)).getText().then(function(totalCount){
                logger.info("Ticket Count Table's Total Count is : " + totalCount);
                return totalCount;
            })
}
module.exports = problemmgmt;