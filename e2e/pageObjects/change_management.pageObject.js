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


var defaultConfig = {
	pageUrl: url,
	chartSpecificDataLabelXpath: "//div[@data-title='{0}']//*[name()='path' and @data-label='{1}']",
	chartDataLabelXpath: "//div[@data-title='{0}']//*[name()='path' and @data-label]",
	toolTipTextCss: ".visTooltip tbody td:nth-child(3)",
	dataLabelAttr: "data-label",
	firstBarGraphXpath: "(//div[normalize-space(text())='{0}']/parent::div/following-sibling::div//div[@class='chart']//*[name()='rect' and @data-label='Count'])[1]",
	RowMatrixGraphXpath: "(//span[@class='embPanel__titleText'][contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//div[@class='chart']//*[name() ='g' and @class='series'])[{1}]//*[name()='text']"
};

function changemgmt(selectorConfig) {
	if (!(this instanceof changemgmt)) {
		return new changemgmt(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
changemgmt.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
};


/*
* click on pie chart section based on pie-chart Name(@chartName) and label Name of section needs to be clicked(@dataLabel)
*/
changemgmt.prototype.clickOnChartSectionBasedOnDataLabel = function (chartName, dataLabel) {
	// var chartDataLabel = this.chartDataLabelXpath.format(chartName);
	var chartSpecificDataLabel = this.chartSpecificDataLabelXpath.format(chartName, dataLabel);
	util.waitForAngular();
	util.waitForInvisibilityOfKibanaDataLoader();
	browser.wait(EC.elementToBeClickable(element(by.xpath(chartSpecificDataLabel))), timeout.timeoutInMilis);
	return element(by.xpath(chartSpecificDataLabel)).isDisplayed().then(function (displayed) {
		if (displayed) {
			// browser.wait(EC.elementToBeClickable(element(by.xpath(chartSpecificDataLabel))), timeout.timeoutInMilis);
			element(by.xpath(chartSpecificDataLabel)).click().then(function(){
				logger.info("Clicked on " + dataLabel + " filter for " + chartName + " chart");
			});
		}
		else {
			logger.info(dataLabel + " filter not found for " + chartName + " chart");
		}
	})
}
/*
*get tooltiptext on pie chart section based on pie-chart Name(@chartName) and label Name of section needs to be clicked(@dataLabel)
*/
changemgmt.prototype.getToolTipTextForChartSectionBasedOnDataLabel = function (chartName, dataLabel) {
	var chartDataLabel = this.chartDataLabelXpath.format(chartName);
	var chartSpecificDataLabel = this.chartSpecificDataLabelXpath.format(chartName, dataLabel);
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.xpath(chartDataLabel)).last()), timeout.timeoutInMilis);
	return element(by.xpath(chartSpecificDataLabel)).isDisplayed().then(function (displayed) {
		if (displayed) {
			return browser.actions().mouseMove(element(by.xpath(chartSpecificDataLabel))).perform().then(function () {
				browser.wait(EC.visibilityOf(element(by.css(self.toolTipTextCss))), timeout.timeoutInMilis);
				return element(by.css(self.toolTipTextCss)).getText().then(function (toolTipText) {
					var toolTip = toolTipText.split("(")[0].trim();
					logger.info(chartName + " Chart's Tooltip text for Filter " + dataLabel + ": " + toolTip);
					return toolTip;
				})
			})
		}
		else {
			logger.info(dataLabel + " filter not found for " + chartName + " chart")
		}
	})
}
/*
* verify pie chart is present
 @chartName = widgetName/chartName for  all/one pie-chart under which they exists eg:change Type
@dataLabel = labels representing pie-chart under that widget
*/
changemgmt.prototype.verifyChartFilterIsPresent = function (chartName, dataLabel) {
	util.waitForAngular();
	var chartDataLabel = this.chartDataLabelXpath.format(chartName);
	browser.wait(EC.visibilityOf(element.all(by.xpath(chartDataLabel)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(chartDataLabel)).getAttribute(this.dataLabelAttr).then(function (labels) {
		var i;
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(dataLabel)) {
				logger.info(chartName + " Chart with filter " + dataLabel + " is present.");
				return true;
			}
		}
		if (i == labels.length) {
			logger.info(chartName + " Chart with filter " + dataLabel + " is not present.");
			return false;
		}
	})
}

/*
*Get all the local Filters Label Values of Given Chart Name
*/

changemgmt.prototype.getAllChartLabels = function(chartName)
{
	util.waitForAngular();
	util.waitForInvisibilityOfKibanaDataLoader();
	var chartDataLabel = this.chartDataLabelXpath.format(chartName);
	browser.wait(EC.visibilityOf(element.all(by.xpath(chartDataLabel)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(chartDataLabel)).getAttribute(this.dataLabelAttr).then(function (labels) {
		logger.info("All  labels for filter "+chartName+" are: "+labels);
		return labels;
	});
}

//get all row values of given MatrixGraph Name and Row No start from 0
changemgmt.prototype.getAllValuesofSpecifRowFromMatrixGraph = function(chartName,rowNumber)
{
	util.waitForAngular();
	var rowSpecificData = this.RowMatrixGraphXpath.format(chartName,rowNumber+1);
	browser.wait(EC.visibilityOf(element.all(by.xpath(rowSpecificData)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(rowSpecificData)).getText().then(function (rowValues) {
		logger.info("All  Values for Row :" + rowNumber+ " of  "+chartName+" are: "+rowValues);
		return rowValues;
	});
}


/*
 getAllValuesofWordCloudGraph function helps you compare the results between 
 Data gathered from wordcloud widget on Dashboard vs Data gathered from Kibana Query
 
 Every single element from Wordcloud is compared and a Tag of "Matching" or "Not Matching"
 
 widget - Data Gathered from UI - Dashboard widget
 query - Data Extracted from Elastic Index
 */

changemgmt.prototype.getAllValuesofWordCloudGraph = function(widget,query){
	util.waitForAngular();
	let status = [];
	query.forEach(function (item){		
		if (!widget.includes(item)){
			status.push("Not-matching");
			logger.info("Mis-matched value in wordcloud widget is/are :"+item);
		}
		else{
			status.push("Matching");
		}
	});
	logger.info("Validation status: "+ status);
	return status;
};

/*
getAllValuesofPieChart function helps you compare the results between 
Data gathered from Pie Chart widget on Dashboard vs Data gathered from Kibana Query

Every single element from Wordcloud is compared and a Tag of "Matching" or "Not Matching"

widget - Data Gathered from UI - Dashboard widget
 query - Data Extracted from Elastic Index
*/

changemgmt.prototype.getAllValuesofPieChart = function(widget,query){
	util.waitForAngular();
	let status = [];
	var widgetresult=Object.entries(widget);
	logger.info("widgetresult: ", widgetresult);
	var queryresult=Object.entries(query);
	logger.info("queryresult: ", queryresult);
	for (var i = 0; i < queryresult.length; i++) {
		if(JSON.stringify(widgetresult).includes(JSON.stringify(queryresult[i]))){
			status.push('Matching');
			logger.info("Matched value in piechart widget is/are :"+queryresult[i]);
		}
		else {
			status.push('Not Matching');
			logger.info("Mis-matched value in piechart widget is/are :"+queryresult[i]);
		}
	};
	logger.info("Validation Status: "+ status);
	return status;
};
	
module.exports = changemgmt;