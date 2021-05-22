/**
 * Created by : Pushpraj
 * created on : 11/06/2020
 */
"use strict";
var logGenerator = require("./logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var timeout = require('../testData/timeout.json');
var util = require('./util.js');
var path = require('path');
var providerXpath = "//*[@id='globalFilter']//span[@title='{0}']//ancestor::label[1]";
var providerCategoryCheckBoxXpath = "//*[@data-source='{0}']/following-sibling::li//span[contains(@class, 'check-icon')]";
var providerCategoryXpath = "//*[@data-source='{0}']/following-sibling::li";
var providerCategoryUnselectedCheckBoxXpath = "//*[@data-source='{0}']/following-sibling::li[not(contains(@class, 'node-checked'))]//span[contains(@class, 'check-icon')]";
var nodeLevel1 = "node-level-1";
var nodeLevel2 = "node-level-2";
var applyButtonXpath = "//*[@id='globalFilter']//button[contains(@class,'applyButton')]";
var exportCss = "button.bx--btn.bx--btn--primary";
var clearButtonXpath = "(//*[@id='globalFilter']//a[@class='bx--link'])[1]";
var searchInputBoxCss = "input#searchText";
var filteredCheckBoxXpath = "//span[contains(@class, 'fa-square-o')]";
var downloadAssociatedResourcesCss = "ibm-overflow-menu.exportMenu.enableButton";
var downloadAssociatedResourcesJSONXpath = "//ibm-radio-group//ibm-radio[2]";
var navigationButtonLinksCss = "nav.bx--breadcrumb .bx--link";
var alertsTableColumnNamesCss = "div table.bx--data-table thead";
var globalFilterSelectTag= "//*[@type='Warm-gray']";

/**
 * This function will click on provider check box based on input provided for provider name
 */
function clickOnProviderCheckBox(providerName) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var constructedXpath = providerXpath.format(providerName);
	browser.wait(EC.elementToBeClickable(element(by.xpath(constructedXpath))), timeout.timeoutInMilis);
	return element(by.xpath(constructedXpath)).click().then(function(){
		logger.info("Clicked on provider "+providerName+" check box");
	});
}
/**
 * This function will retrieve the column name present in the associated resource table
 */
function retrieveTableColumns(tableColumn) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(alertsTableColumnNamesCss))), timeout.timeoutInMilis);
	return element(by.css(alertsTableColumnNamesCss)).getText().then(function(columnNames){
		logger.info("column names are",columnNames);
		return columnNames;
	});
}
/*
 * This function will download the contents of Associated resources as CSV
 * The downloaded file will be in aiops_report directory
*/
async function downloadAssociatedResourcesCSV(){
	var EC = protractor.ExpectedConditions;
	await util.deleteAllReports();
	browser.wait(EC.visibilityOf(element(by.css(downloadAssociatedResourcesCss))), timeout.timeoutInMilis);
	await element(by.css(downloadAssociatedResourcesCss)).click();
	return element(by.css(exportCss)).click().then(function() {
	    logger.info("clicking on download associated resources icon");
		logger.info("Clicked on export button and download as CSV");
		return new Promise(function (resolve){
        setTimeout(() => resolve("done"), 5000);
    });

		return true;

	});
};
/*
 * This function will download the contents of Associated resources as JSON
 * The downloaded file will be in aiops_report directory
*/
async function downloadAssociatedResourcesJSON(){
    var EC = protractor.ExpectedConditions;
	util.deleteAllReports();
	browser.wait(EC.visibilityOf(element(by.css(downloadAssociatedResourcesCss))), timeout.timeoutInMilis);
	await element(by.css(downloadAssociatedResourcesCss)).click();
	browser.wait(EC.visibilityOf(element(by.xpath(downloadAssociatedResourcesJSONXpath))), timeout.timeoutInMilis);
	await element(by.xpath(downloadAssociatedResourcesJSONXpath)).click();
	return element(by.css(exportCss)).click().then(function() {
	    logger.info("clicking on download associated resources icon");
		logger.info("Clicked on export button and download as Json");
		return new Promise(function (resolve){
        setTimeout(() => resolve("done"), 5000);
    });

		return true;

	});
};
/**
 * This function will click on multiple provider check box based on input provided for provider category 
 */
function clickOnMultipleProviderCheckBox(providerCategory) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var xpathForProviderCategoryCheckBox = providerCategoryCheckBoxXpath.format(providerCategory);
	var xpathForProviderCategory = providerCategoryXpath.format(providerCategory);
	var xpathProviderCategoryUnselectedCheckBox = providerCategoryUnselectedCheckBoxXpath.format(providerCategory);
	browser.wait(EC.elementToBeClickable(element.all(by.xpath(xpathForProviderCategoryCheckBox)).get(0)), timeout.timeoutInMilis);
	element.all(by.xpath(xpathForProviderCategory)).getAttribute('class').then(function(className){
		for(var i = 0; i < className.length; i++){
			if(className[i].includes(nodeLevel2)){
				element.all(by.xpath(xpathProviderCategoryUnselectedCheckBox)).get(0).click();				
			}else if(className[i].includes(nodeLevel1)){
				return;
			}
		}
		
	});
}

/**
 * Click on navigation button links from top-left corner
 * Ex. btnName - Health, {Application Name}, {Resource Name}, etc
 */
function clickOnBreadcrumbLink(btnName){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element.all(by.css(navigationButtonLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(navigationButtonLinksCss)).getText().then(async function(linkTexts){
		for(i=0; i<linkTexts.length; i++){
			if(linkTexts[i].includes(btnName)){
				return await element.all(by.css(navigationButtonLinksCss)).get(i).click().then(function(){
					logger.info("Clicked on button link: "+btnName);
					return;
				})
			}
		}
	})
};

/**
 * Method to click on Apply filter button
 */
function clickOnApplyFilterButton(){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.xpath(applyButtonXpath))), timeout.timeoutInMilis);
	return browser.executeScript("arguments[0].click();", element(by.xpath(applyButtonXpath)).getWebElement()).then(async function () {
		var status = element(by.xpath(applyButtonXpath));
		await expect(status.isEnabled()).toBe(false);
		logger.info("Clicked on apply filter button");

	});
}

/**
 * Method to click on clear filter button
 */
function clickOnClearFilterButton(){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(globalFilterSelectTag))), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(clearButtonXpath))), timeout.timeoutInMilis);
	return browser.executeScript("arguments[0].click();", element(by.xpath(clearButtonXpath))).then(async function () {
		browser.wait(EC.invisibilityOf(element(by.xpath(globalFilterSelectTag))), timeout.timeoutInMilis);
		logger.info("Clicked on clear filter button");
	});
}

/**
 * Method to enter data based on search criteria
 */
function filterSearchBox(input){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(searchInputBoxCss))), timeout.timeoutInMilis);
	element(by.css(searchInputBoxCss)).sendKeys(input).then(function(){
		logger.info("Entered data in filter searchbox  : "+ input);
	});
}

/**
 * Method to click on filtered check box
 * After filtering data from search box, checkbox will be available
 */
function clickOnFilteredCheckBox() {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var self = this;
	browser.wait(EC.elementToBeClickable(element.all(by.xpath(self.filteredCheckBoxXpath)).get(0)), timeout.timeoutInMilis);
	element.all(by.xpath(self.filteredCheckBoxXpath)).count().then(function(length){
		logger.info("Visible element length", length);
		element.all(by.xpath(self.filteredCheckBoxXpath)).get(length - 1).click().then(function(){
			logger.info("Clicked on filtered checkbox");
		});
	});
}


module.exports = {
	clickOnProviderCheckBox : clickOnProviderCheckBox,
	clickOnMultipleProviderCheckBox : clickOnMultipleProviderCheckBox,
	downloadAssociatedResourcesJSON : downloadAssociatedResourcesJSON,
	downloadAssociatedResourcesCSV : downloadAssociatedResourcesCSV,
	clickOnBreadcrumbLink : clickOnBreadcrumbLink,
	clickOnApplyFilterButton : clickOnApplyFilterButton,
	clickOnClearFilterButton : clickOnClearFilterButton,
	filterSearchBox : filterSearchBox,
	clickOnFilteredCheckBox : clickOnFilteredCheckBox,
	retrieveTableColumns : retrieveTableColumns
};
