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
var frames = require('../../testData/frames.json');
var timeout = require('../../testData/timeout.json');


var defaultConfig = {
	widgetsNumericValueXpath: "//span[contains(@class, 'embPanel__titleText')][text()='{0}']/ancestor::div[@data-test-subj='embeddablePanel']//div[@class='mtrVis__value']/span",
	ownerGroupHeaderXpath: "//kbn-enhanced-agg-table//th//span[text()='Owner Group']",
	ownerGroupRowTextXpath: "//kbn-enhanced-agg-table//th//span[text()='Owner Group']/ancestor::thead/following-sibling::tbody//div[@class='kbnTableCellFilter__hover']/span[@ng-non-bindable]",
	downloadSunriseReportCss: "div.downloadButton > a.iconLabel",
	downloadReportsTooltipCss: "div.downloadButton span.iconDownload > svg.blueIcon",
	downloadReportsTooltipMessageCss: " div.downloadButton span.iconDownload > div.fullBoxModelWrapper",
	toTimeFromLastUpdatedTimestampCss: "span.lastUpdatedFrom"
};

function sunrisereport(selectorConfig) {
	if (!(this instanceof sunrisereport)) {
		return new sunrisereport(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
sunrisereport.prototype.open = function () {
	util.switchToDefault();
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
	util.switchToFrameById(frames.cssrIFrame);
};


/**
 * Method to get numeric value from widgets
 */
sunrisereport.prototype.getWidgetsNumericValue = function (widgetName) {
	util.waitForAngular();
	var widgetValueXpath = this.widgetsNumericValueXpath.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.xpath(widgetValueXpath))), timeout.timeoutInMilis);
	return element(by.xpath(widgetValueXpath)).getText().then(async function (widgetValue) {
		logger.info(widgetName + " widget's value : " + widgetValue);
		var numbericValue = await util.stringToInteger(widgetValue);
		logger.info("String to Integer : " + numbericValue);
		if (isNaN(numbericValue)) {
			return widgetValue;
		} else {
			return numbericValue;
		}
	});
};

/**
 * Method to get numeric value or - string from widgets
 */
sunrisereport.prototype.checkWidgetsValueIsNumericOrString = function (widgetName) {
	return this.getWidgetsNumericValue(widgetName).then(function (widgetValue) {
		logger.info("widgetValue ----- " + widgetValue);
		if (!isNaN(widgetValue)) {
			return true;
		} else if (widgetValue.includes("-")) {
			return true;
		} else {
			return false;
		}
	});
};

/**
 * Method to get backlog ticket aging widgets table text for owner group applied filter
 */
sunrisereport.prototype.getOwnerGroupRowTextFromAginTable = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.ownerGroupHeaderXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.ownerGroupRowTextXpath)).getText().then(function (ownerGroupRowTxt) {
		logger.info("Owner group row text : " + ownerGroupRowTxt);
		return ownerGroupRowTxt;
	});
};

/*
get Widget Value in Floating Number
*/
sunrisereport.prototype.getWidgetsFloatValue = function (widgetName) {
	util.waitForAngular();
	var widgetValueXpath = this.widgetsNumericValueXpath.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.xpath(widgetValueXpath))), timeout.timeoutInMilis);
	return element(by.xpath(widgetValueXpath)).getText().then(async function (widgetValue) {
		logger.info(widgetName + " widget's value : " + widgetValue);
		var numbericValue = Number(await util.getNumberFromString(widgetValue));
		logger.info("String to Float : " + numbericValue);
		if (isNaN(numbericValue)) {
			return undefined;
		} else {
			return util.stringToFloat(numbericValue.toFixed(3));
		}
	});
};

/*
get Widget Value in Integer Number
*/
sunrisereport.prototype.getWidgetsIntegerValue = function (widgetName) {
	util.waitForAngular();
	var widgetValueXpath = this.widgetsNumericValueXpath.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.xpath(widgetValueXpath))), timeout.timeoutInMilis);
	return element(by.xpath(widgetValueXpath)).getText().then(async function (widgetValue) {
		logger.info(widgetName + " widget's value : " + widgetValue);
		var numbericValue = util.stringToInteger(widgetValue);
		logger.info("String to Integer : " + numbericValue);
		return numbericValue;
	});
};

/*
 * This function will open and close the Download Reports Tooltip clicking on 'i' icon
*/
sunrisereport.prototype.clickOnDownloadSunriseReportTooltip =  function() {
	browser.wait(EC.visibilityOf(element(by.css(this.downloadReportsTooltipCss))), timeout.timeoutInMilis);
	element(by.css(this.downloadReportsTooltipCss)).click().then(function() {
		logger.info("Clicked on Download Reports Tooltip icon.");
	});
};

/*
 * This function will get the Download Reports Tooltip message. 
*/
sunrisereport.prototype.getSunriseReportTooltipMessage = function() {
	browser.wait(EC.visibilityOf(element(by.css(this.downloadReportsTooltipMessageCss))), timeout.timeoutInMilis);
	return element(by.css(this.downloadReportsTooltipMessageCss)).getText().then(function(tooltipMessage) {
		logger.info("Tooltip Message:", tooltipMessage);
		return tooltipMessage;
	});
};

/*
 * This function will download the Sunrise Report clicking in Download Reports...
 * The downloaded file will be in aiops_report directory
*/
sunrisereport.prototype.downloadSunriseReportXlsx =  function() {
	util.deleteAllReports();
	browser.wait(EC.visibilityOf(element(by.css(this.downloadSunriseReportCss))), timeout.timeoutInMilis);
	return element(by.css(this.downloadSunriseReportCss)).click().then(function() {
		logger.info("Clicked on Download Reports xlsx Link");
		// Added static wait to download report xlsx
		browser.sleep(5000);
		return true;
	});
};

/**
 * Get To time from Last updated timestamp
 */
sunrisereport.prototype.getToTimeFromTimestamp = function(){
	var self = this;
	util.switchToDefault();
	util.switchToFrame(frames.mcmpIframe);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.toTimeFromLastUpdatedTimestampCss))), timeout.timeoutInMilis);
	return element(by.css(this.toTimeFromLastUpdatedTimestampCss)).getText().then(function (toTime) {
		var t_Time = toTime.split("To:")[1].trim();
		if (t_Time.includes("IST")) {
			var toTimestamp = new Date(t_Time.split("IST")[0].trim());
		}
		else {
			var toTimestamp = new Date(t_Time);
		}
		logger.info("To time after Local Timezone conversion: " + toTimestamp);
		self.open();
		return util.getDateFromISOFormat(toTimestamp);
	})
};

module.exports = sunrisereport;