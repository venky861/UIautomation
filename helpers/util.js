/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */
"use strict";
var logGenerator = require("./logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var xlsx = require('xlsx');
var fs = require('fs-extra');
var fsc= require('fs');
var timeout = require('../testData/timeout.json');
const path = require('path');
var now = new Date();
var loadingCss = ".loader";
var tagNameIframe = 'iframe';
var kibanaLoadCircleCss = "div.kibanaLoader";
var aiopsReportsDir = path.resolve("aiops_reports");//process.cwd() + path.sep +"aiops_reports";
var KibanaDataLoaderCss = "div.kbnLoadingIndicator";
var globalFilterLoaderCss = "div.global-filter-ctrl div.sk-circle";
var globalFilterFormCss = ".global-filter-form";
var dashboardHeaderLinkCss = "div.dashboardLink";
var valueTypeNumeric = "numeric";
var sortingTypeAscending ="Ascending";
var tabButtonsXpath = "//div[@class='tab__controls']//a[contains(text(),'{0}')]//parent::li[contains(@class,'bx--tabs__nav-item')]";
var filterRowCss = 'ul.list-row';
var resetFilterXpath = "//a[text()='Reset Filter']";
var headerTileTextCss = "div.inlineBlock";
var carbonLoaderCss = "ibm-loading div svg.bx--loading__svg";

/**
 * Function to get current URL
 */
function getCurrentURL() {
	return browser.getCurrentUrl().then(function (currentUrl) {
		logger.info("the current URL is = " + currentUrl)
		return currentUrl;
	})
}

/**
 * Method to wait for loading and kibanaloadcircle css to be invisible
 */
function waitForAngular() {
	var EC = protractor.ExpectedConditions;
	browser.waitForAngular();
	browser.sleep(1000);
	browser.wait(EC.invisibilityOf(element(by.css(loadingCss))), 3 * 60 * 1000);
	element.all(by.css(kibanaLoadCircleCss)).then(function (textArray) {
		for (var i = 0; i < textArray.length; i++) {
			browser.wait(EC.invisibilityOf(textArray[i]), 3 * 60 * 1000);
		}
	});
}

/**
 * This function is gives us page header text
 */
function getHeaderTitleText(){
	var EC = protractor.ExpectedConditions;
	waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(headerTileTextCss))), timeout.timeoutInMilis);
	return element(by.css(headerTileTextCss)).getText().then(function(headerTitleText){
		logger.info("Page header title text : "+headerTitleText);
		return headerTitleText;
	});
};

/**
 * This function is collect all the spec file path and will be picked up based on suites array
 */
function generateRuntimeSpecString(suitesList) {
	var specArray = [];
	var suitesArray = suitesList.split(",");
	var suitesLength = suitesArray.length;
	for (var i = 0; i < suitesLength; i++) {
		if (suitesArray[i] == "inventory")
			specArray.splice(i, 0, "e2e/specs/inventory.spec.js");
		if (suitesArray[i] == "dashboard")
			specArray.splice(i, 0, "e2e/specs/dashboard.spec.js");
		if (suitesArray[i] == "health")
			specArray.splice(i, 0, "e2e/specs/health.spec.js");
		if (suitesArray[i] == "actionable_insights")
			specArray.splice(i, 0, "e2e/specs/actionable_insights.spec.js");
		if (suitesArray[i] == "change_management")
			specArray.splice(i, 0, "e2e/specs/change_management.spec.js");
		if (suitesArray[i] == "incident_management")
			specArray.splice(i, 0, "e2e/specs/incident_management.spec.js");
		if (suitesArray[i] == "pervasive_insight")
			specArray.splice(i, 0, "e2e/specs/pervasive_insight.spec.js");
		if (suitesArray[i] == "problem_management")
			specArray.splice(i, 0, "e2e/specs/problem_management.spec.js");
		if (suitesArray[i] == "sunrise_report")
			specArray.splice(i, 0, "e2e/specs/sunrise_report.spec.js");
		if (suitesArray[i] == "launchpad")
			specArray.splice(i, 0, "e2e/specs/launchpad.spec.js");
		if (suitesArray[i] == "timestampValidations")
			specArray.splice(i, 0, "e2e/specs/timestampValidations.spec.js");
		if (suitesArray[i] == "monitoring")
			specArray.splice(i, 0, "e2e/specs/monitoring.spec.js");
		if (suitesArray[i] == "user_access")
			specArray.splice(i, 0, "e2e/specs/user_access.spec.js");
		if (suitesArray[i] == "delivery_insights")
			specArray.splice(i, 0, "e2e/specs/delivery_insights.spec.js");
	}
	return specArray;
}

// Format string
String.prototype.format = function () {
	var args = arguments;
	return this.replace(/{(\d+)}/g, function (match, number) {
		return typeof args[number] != 'undefined' ? args[number] : match;
	});
}

/**
 * This function will scroll to View the webElement of page
 */
function scrollToWebElement(el) {
	return browser.executeScript('arguments[0].scrollIntoView(true)', el.getWebElement());
}

/**
 * This function will scroll to bottom of page
 */
function scrollToBottom() {
	return browser.executeScript('window.scrollTo(0,document.body.scrollHeight)');
}

/**
 * This function will scroll to Top of page
 */
function scrollToTop() {
	return browser.executeScript('window.scrollTo(0,0)');
}

/**
 * This function will switch inside frame by finding iframe tag
 */
function switchToFrame() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.tagName(tagNameIframe))), timeout.timeoutInMilis);
	browser.switchTo().frame(element(by.tagName(tagNameIframe)).getWebElement()).then(function () {
		logger.info("Switched to iframe by tagName");
	});
};

/**
 * This function will switch inside frame by finding frame ID
 */
function switchToFrameById(frameId) {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.id(frameId))), timeout.timeoutInMilis).then(function(){
		logger.info(frameId, "frame is visible");
		browser.switchTo().frame(element(by.id(frameId)).getWebElement()).then(function () {
			logger.info("Switched to iframe id :: " + frameId);
		});
	});
};

/**
 * This function will switch to default content
 */
function switchToDefault() {
	browser.switchTo().defaultContent().then(function () {
		logger.info("Switched to default content");
	});
};

/**
 * This function Generates a random string which will be used to make any name (policy,content,identity,response or any other input)
 * unique
 */
function getRandomString(charLength) {
	var randomText = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	for (var i = 0; i < charLength; i++)
		randomText += possible.charAt(Math.floor(Math.random() * possible.length));
	return randomText;
}

/**
 * Function to delete all cookies from the browser
 */
function deleteAllCookies(){
    return new Promise(function (resolve){
        browser.get("https://idaas.iam.ibm.com/pkmslogout");
        browser.executeScript('window.localStorage.clear();');
        browser.executeScript('window.sessionStorage.clear();');
        browser.driver.manage().deleteAllCookies();
        setTimeout(() => resolve("done"), 5000);
    });
}

/**
 * Function to get previous/current month and year date based on input provided
 * @month 0, 1, 2, 3, 4... here 0 is representing to current month and 1, 2 are representing for previous month
 * This function returns MMM YY date format
 */
function getPreviousMonthYearDate(month) {
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var today = new Date();
	today.setMonth(today.getMonth() - month);
	var monthAndYear = months[today.getMonth()] + " " + today.getFullYear().toString().substr(-2);
	logger.info("Month and year date : ", monthAndYear);
	return monthAndYear;
}

/**
 * This function returns local formatted date as "hh:mm AM, MMM DD YYYY"
 */
function getLocalTimeDate() {
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var today = new Date();
	var date = months[today.getMonth()] + " " + today.getDate() + " " + today.getFullYear();
	var hours = today.getHours();
	var mins = today.getMinutes();
	var ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12;
	hours = hours ? hours : 12;
	mins = mins < 10 ? "0" + mins : mins;
	var time = hours + ':' + mins + ' ' + ampm;
	var dateTime = time + ', ' + date;
	logger.info("Local Time-Date: " + dateTime);
	return dateTime;
}

/**
 * Covert ISO Format date to YYYY-MM-DD format
 * @param {Date in ISO Format; EX: "Thu Dec 24 2020 12:00:00 GMT+0530 (India Standard Time)"} ISOFormatDate 
 */
function getDateFromISOFormat(ISOFormatDate) {
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var splitedDate = ISOFormatDate.toString().split(" ");
	var month = months.indexOf(splitedDate[1]) + 1;
	month = month < 10 ? "0" + month : month;
	var date = splitedDate[2];
	var year = splitedDate[3];
	var formattedDate = year + "-" + month +"-"+ date;
	logger.info("Formatted date: "+ formattedDate);
	return formattedDate;
}

/**
 * startDate - Mar 17, 2020 19:47:33.925
 * endDate - Apr 16, 2020 19:47:33.925
 * timeUnit - Days, Hours, Minutes, Seconds, MilliSeconds
 */
function getDateDifference(startDate, endDate, timeUnit) {
	var s_date = new Date(startDate);
	var e_date = new Date(endDate);
	var diff;
	if(timeUnit == "Days"){
		diff = Math.abs(s_date - e_date) / (24 * 60 * 60 * 1000);
	}
	else if(timeUnit == "Hours"){
		diff = Math.abs(s_date - e_date) / (60 * 60 * 1000);
	}
	else if(timeUnit == "Minutes"){
		diff = Math.abs(s_date - e_date) / (60 * 1000);
	}
	else if(timeUnit == "Seconds"){
		diff = Math.abs(s_date - e_date) / 1000;
	}
	else if(timeUnit == "MilliSeconds"){
		diff = Math.abs(s_date - e_date);
	}
	else{
		logger.info("Invalid time unit");
	}
	logger.info("Difference between "+startDate+" and "+endDate+" in "+timeUnit+": "+Math.round(diff));
	return Math.round(diff);
};

/**
 * This function returns date range for custom date range filter. Format: MMM DD, YYYY hh:mm:ss.ms
 * 'days' - How many previous days from today's date
 */
function getTimeDateRangeForCustomeRangeFilter(days) {
	var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
	var today = new Date();
	var currentDate = months[today.getMonth()] + " " + today.getDate() + ", " + today.getFullYear();
	var priorDay = new Date(today.setDate(today.getDate() - days));
	var priorDate = months[priorDay.getMonth()] + " " + priorDay.getDate() + ", " + priorDay.getFullYear();
	var hours = today.getHours();
	var mins = today.getMinutes();
	var secs = today.getSeconds();
	var minisecs = today.getMilliseconds();
	mins = mins < 10 ? "0" + mins : mins;
	var time = hours + ':' + mins + ':' + secs + '.' + minisecs;
	var dateTimeToday = currentDate + ' ' + time;
	var dateTimePriorDay = priorDate + ' ' + time;
	logger.info("Today's Time-Date: " + dateTimeToday);
	logger.info(days + " days ago Time-Date: " + dateTimePriorDay);
	var range = [dateTimePriorDay, dateTimeToday];
	return range;
}

/**
 * This function verify ticket details file is existed or not
 */
function isTicketDetailsFileExists() {
	var files = fs.readdirSync(aiopsReportsDir);
	if(!files.length){
		logger.info("No file found in "+aiopsReportsDir);
		return false;
	}
	else{
		var filePath = aiopsReportsDir + path.sep + files[files.length - 1];
		logger.info("File found and file path is: "+filePath);
		return fs.existsSync(filePath);
	}
};

/**
 * This function will read the xlsx file from aiops_report directory
 * And returns xlsx data as JSON
 */
function getDataFromXlsxFile() {
	var files = fs.readdirSync(aiopsReportsDir);
	if(!files.length){
		logger.info("No file found in "+aiopsReportsDir);
		return false;
	}
	else{
		logger.info(files);
		logger.info("Reading file... " + files[files.length - 1]);
		var workbook = xlsx.readFile(aiopsReportsDir + path.sep + files[files.length - 1]);
		var sheet_name_list = workbook.SheetNames;
		var xlData = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);
		return xlData;
	}
};
/**
 * This function will read the csv file from aiops_report directory
 *
 */
function getCsvFileRowCount() {
	var files = fs.readdirSync(aiopsReportsDir);
	if(!files.length){
		logger.info("No file found in "+aiopsReportsDir);
		return false;
	}
	else{
		var filePath = aiopsReportsDir + path.sep + files[files.length-1];
		logger.info("File path... ",filePath);
		logger.info("Reading file... " + files[files.length-1]);
        var textByLine = fsc.readFileSync(filePath).toString().split("\r\n");
        logger.info(textByLine);
        //Return number of rows in csv file excluding the header
        return textByLine.length-1;
    }
};

/**
 * This function get ticket count from JSON data created from ticket details xlsx file
 * jsonData - Ticket details xlsx data converted to json object from getDataFromXlsxFile()
 */
function getTicketCountFromJsonData(jsonData) {
	var ticketCount = Object.keys(jsonData).length;
	// Removing last entry as it is empty when count < 10000
	if(ticketCount < 10000){
		var act_ticketCount = ticketCount - 1;
		logger.info("Ticket count from json data: "+act_ticketCount);
		return act_ticketCount;
	}
	else{
		logger.info("Ticket count from json data: "+ticketCount);
		return ticketCount;
	}
};

/**
 * This function will delete aiops_reports directory
 */
function deleteAllReports() {
	var files = fs.readdirSync(aiopsReportsDir);
	if(!files.length){
		logger.info(aiopsReportsDir+" directory is empty.");
	}
	else{
		for(var i=0; i<files.length; i++){
			logger.info("Deleting file: "+files[i]);
			fs.unlinkSync(aiopsReportsDir + path.sep + files[i]);
		}
		// Read directory again to check directory is empty
		files = fs.readdirSync(aiopsReportsDir);
		if(!files.length){
			logger.info("Deleted all files from directory "+aiopsReportsDir);
		}
		else{
			logger.info(aiopsReportsDir+" directory is not empty");
		}
	}
};

/**
 * this Function Returns Month and date in YYYY_MM format
 * @param 'months' - How many previous Months from today's date
 */
function getPerviousDateInMonthYearFormat(months) {
	var CurrentDate = new Date();
	CurrentDate.setMonth(CurrentDate.getMonth() - months);
	var date = new Date(CurrentDate),
		month = '' + (date.getMonth() + 1),
		year = date.getFullYear();
	if (month.length < 2)
		month = '0' + month;
	return [year, month].join("_");
}

/**
 * This function will wait for Kibana data loader to disappear and global filters to visible
 */
async function waitForInvisibilityOfKibanaDataLoader() {
	var EC = protractor.ExpectedConditions;
	await waitOnlyForInvisibilityOfKibanaDataLoader();
	await browser.wait(EC.invisibilityOf(element(by.css(globalFilterLoaderCss))), 90*1000);
	await browser.wait(EC.visibilityOf(element(by.css(globalFilterFormCss))), 90*1000).then(function(){
		logger.info("Global filters are visible");
		// Need static wait to load data on number cards after loading global filters
		browser.sleep(5000);
	}).catch(function(err){
		logger.info("Global filters are not visible after 90 seconds");
	});
}


/**
 * This function will wait for Kibana data loader to disappear
 */
async function waitOnlyForInvisibilityOfKibanaDataLoader() {
	var EC = protractor.ExpectedConditions;
	// Need static wait as it took 3-4 seconds to start loading data on new tab
	browser.sleep(5000);
	await browser.wait(EC.invisibilityOf(element(by.css(KibanaDataLoaderCss))), 90*1000).then(function(){
		logger.info("Kibana Dashboard Data is loaded");
	});
}

/**
 * This function will wait for Carbon loader to disappear
 */
async function waitOnlyForInvisibilityOfCarbonDataLoader() {
	var EC = protractor.ExpectedConditions;
	// Need static wait as it took 3-4 seconds to start loading data on new tab
	browser.sleep(5000);
	await browser.wait(EC.invisibilityOf(element(by.css(carbonLoaderCss))), 90*1000).then(function(){
		logger.info("Carbon Dashboard Data is loaded");
	});
}


/**
 *  This function switches to cssr iframe inside the mcmp iframe by finding iframe id
 */
function switchToCssrIFramebyID(mcmpIFrame, cssrIFrame) {
	switchToDefault();
	switchToFrameById(mcmpIFrame);
	waitForAngular();
	switchToFrameById(cssrIFrame);
	waitForAngular();
}

/**
 * @param ='num' is integer
 * this function reurns value greate than 999 in K format
 * eg: 1000 =1k
 */
function kFormatter(num) {
	return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) + 'k' : Math.sign(num) * Math.abs(num);
}

/**
 * @param ='num' is integer
 * this function reurns value greater than 999 in K format without k in string
 * eg: 1500 = 1.5
 */
function kFormatterWithoutK(num) {
	return Math.abs(num) > 999 ? Math.sign(num) * ((Math.abs(num) / 1000).toFixed(1)) : Math.sign(num) * Math.abs(num);
}

/**
 * this Function Returns Month name in 'Mon' format
 * @param 'mon' - How many previous Months from today's date
 */
function getPreviousMonthName(mon) {
	var CurrentDate = new Date();
	CurrentDate.setMonth(CurrentDate.getMonth() - mon);
	var M = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
	var d = new Date(CurrentDate);
	var month = '' + M[d.getMonth()];
	return month;
}

/**
 * Function to get previous/current month and year date based on input provided
 * @month 0, 1, 2, 3, 4... here 0 is representing to current month and 1, 2 are representing for previous month
 * This function returns Month YYYY date format e.g: April 2020, March 2020
 */
function getFullPreviousMonthYearDate(month) {
	var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
	var today = new Date();
	today.setMonth(today.getMonth() - month);
	var monthAndYear = months[today.getMonth()] + " " + today.getFullYear();
	logger.info("Month and year date : ", monthAndYear);
	return monthAndYear;
}

/**
 * This function click on header dashboard link
 */
function clickOnHeaderDashboardLink(){
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.elementToBeClickable(element(by.css(dashboardHeaderLinkCss))), timeout.timeoutInMilis);
	browser.executeScript("arguments[0].click();", element(by.css(dashboardHeaderLinkCss))).then(function () {
		logger.info("Clicked on Dashboard link from header..");
	});
}

/**
 * @param {list of values} arrayList 
 * @param {Ascending/Descending} sortingOrder 
 * @param {alphabetic/numeric} columnType 
 * sort the list of Array in ascending/decending order for type numeric/alphabetic
 */
function sortArrayList(arrayList,sortingOrder,columnType)
{
	var sortColumnValues = [];
		// sort order in Ascending order			
		if (sortingOrder == sortingTypeAscending) {
			//numeric numbers ascending order sorting functionality 
			if (columnType == valueTypeNumeric) {
				sortColumnValues = arrayList.sort(function (a, b) {
					a = a.replace(",", "")
					b = b.replace(",", "")
					return (b != " ") - (a != " ") || a - b;
				});
			}
			//alphatical ascending order functionality 	
			else {
				sortColumnValues = arrayList.sort(function (a, b) {
					if (a === b) { return 0; }
					else if (a == " ") { return 1; }
					else if (b == " ") { return -1; }
					else { return a < b ? -1 : 1; }
				});
			}
		}
		else {
			//numeric numbers descending order sorting functionality 
			if (columnType == valueTypeNumeric) {
				sortColumnValues = arrayList.sort(function (a, b) {
					a = a.replace(",", "")
					b = b.replace(",", "")
					return (b != " ") - (a != " ") || b - a || (b != "-") - (a != "-");
				});
			}
			//alphatical descending order functionality 	
			else {
				sortColumnValues = arrayList.sort(function (a, b) {
					if (a === b) { return 0; }
					else if (a == " ") { return 1; }
					else if (b == " ") { return -1; }
					else { return a < b ? 1 : -1; }
				});
			}
		}
		return sortColumnValues
}

/**
 * This function remove comma (,) from number string and returns integer
 * numString -- Ex. 32,457, 4,876, etc.
 */
function stringToInteger(numString){
	return parseInt(numString.replace(/\,/g,''));
}

/**
 * This function remove comma (,) from number string and returns float
 * numString -- Ex. 32,456.457, 4,876.87, etc.
 */
function stringToFloat(numString){
	return parseFloat(numString.replace(/\,/g,''));
}

/**
 * This function adds commas in number string
 * numString -- Ex. 32474 --> Returns 32,474 
 */
function addCommasInNumber(numString){
	return numString.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/**
 * Remove extra spaces from string
 */
function removeBlankSpaces(str){
	return str.replace(/\s+/g, ' ');
}

/**
 * Check if string contains a number or not
 */
function hasNumber(numStr) {
	return /\d/.test(numStr);
}

/**
 * Get Number string [Integer/Float] extracted from string
 */
function getNumberFromString(numStr){
	return numStr.replace(/[^0-9\.\,]+/g, "");
}

/**
 * Method to click on Reset Filter link on Kibana report
 */
function clickOnResetFilterLink() {
	var EC = protractor.ExpectedConditions;
	waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(resetFilterXpath))), timeout.timeoutInMilis);
	return element(by.xpath(resetFilterXpath)).click().then(function () {
		logger.info("Clicked on reset filter link");
	});
}

/**
 * This function will click on Tab button on any page
 */
function clickOnTabButton(tabButtonName) {
	var EC = protractor.ExpectedConditions;
	waitForAngular();
	var tabButton = tabButtonsXpath.format(tabButtonName);
	browser.wait(EC.visibilityOf(element(by.xpath(tabButton))), timeout.timeoutInMilis);
	return element(by.xpath(tabButton)).click().then(function () {
		logger.info("Clicked on " + tabButtonName + " button...");
	});
}
/**
 * This function will return integer number for a given percentage value from total number
 */
function calcIntNumberFromPercentage(percentage, totalNum){
	var number = Math.round(totalNum * (percentage / 100));
	logger.info(percentage+"% of total value "+totalNum+": "+number);
	return number;
}

/**
 * This function verify if the tab button is selected or not
 * tabButtonName --> Applications, Resources
 */
async function isSelectedTabButton(tabButtonName) {
	var EC = protractor.ExpectedConditions;
	waitForAngular();
	var tabButton = tabButtonsXpath.format(tabButtonName);
	browser.wait(EC.visibilityOf(element(by.xpath(tabButton))), timeout.timeoutInMilis);
	var classAttr = await element(by.xpath(tabButton)).getAttribute("class");
	logger.info("Class name: "+classAttr);
	if (classAttr.includes("selected")) {
		logger.info("Is selected " + tabButtonName + ": True");
		return true;
	}
	else {
		logger.info("Is selected " + tabButtonName + ": False");
		return false;
	}
}

/*
 * Get data for specific filter from Elastic view JSON
 * sectionJsonObj --> Section from UI Ex. Application Breakdown, Resources Breakdown, Resources By Region, etc.
 * filterName --> Filter name from section EX. USA from Resources By Region, aws from Resources Breakdown by Provider
 */
function getDataFromElasticViewJSON(sectionJsonObj, filterName){
	var allFilters = Object.keys(sectionJsonObj);
	logger.info("ALL filters: "+ allFilters);
	for(var i=0; i<allFilters.length; i++){
		if(allFilters[i] == filterName){
			logger.info("Value/s for "+filterName+" : "+JSON.stringify(Object.values(sectionJsonObj)[i]));
			return Object.values(sectionJsonObj)[i];
		}
	}
}

/**
 * Verifying if the data from JSON or UI are mismatching in count
 * JSONKeysObject --> JSON object for specific key
 * eleListFromUI --> List of elements inside specific section
 */
function IsDataMissingInJSONOrUI(JSONKeysObject, eleListFromUI){
	// Filtering element list from UI which has no resources and displayed as "-"
	var filteredList = eleListFromUI.filter(function(num){
		return num != "-";
	});
	if(Object.keys(JSONKeysObject).length == filteredList.length){
		logger.info("No data is missing between JSON and UI");
		return true;
	}
	else{
		logger.info("Data is missing between JSON and UI");
		return false;
	}
}

/**
 * Remove double inverted commas ("") from string
 * str --> String from which remove inverted commas
 */
function removeInvertedCommasFromString(str){
	if(str.includes("\"")){
		logger.info("Removed (\") from the string");
		return str.replace(/"/g,"");
	}
	else{
		logger.info("(\") not found in the string");
		return str;
	}
}

/**
 * Allow alpha-numeric, hyphen(-), underscore(_), and space( ) characters in the string
 * @param {String to be filtered} str 
 */
function getAlphaNumericCharactersFromString(str){
	return str.replace(/[^a-z0-9-_ ]/gi,'');
}

/**
 * Verify if the two JSON Objects are equal or not
 * @param {First JSON object} jsonObj1 
 * @param {Second JSON Object} jsonObj2 
 */
function isJsonObjectsEqual(jsonObj1, jsonObj2){
	var bool = true;
	if(Object.keys(jsonObj1).length == Object.keys(jsonObj2).length){
		for(var key in jsonObj1){
			if(jsonObj1[key] == jsonObj2[key]){
				continue;
			}
			else{
				bool = false;
				logger.info("JSON objects are not equal.");
				return bool;
			}
		}
		logger.info("JSON objects are equal.");
		return bool;
	}
	else{
		logger.info("Keys in JSON objects are not equal.");
		bool = false;
		return bool;
	}
}

/**
 * Get keys from JSON Object
 * @param {Json Object} jsonObj 
 */
function getJSONObjectKeys(jsonObj){
	var keys = Object.keys(jsonObj);
	logger.info("JSON Keys: "+ keys);
	return keys;
}

/**
 * Get values from JSON Object
 * @param {Json Object} jsonObj 
 */
function getJSONObjectValues(jsonObj){
	var values = Object.values(jsonObj);
	logger.info("JSON Values: "+ values);
	return values;
}

/**
 * Verify to check list is empty or not
 * @param {Name of List whose size to be check} listName
 */
function isListEmpty(listName){
	if(listName.length == 0){
		logger.info("List is empty.");
		return true;
	}
	else{
		logger.info("List is NOT empty.");
		return false;
	}
}

/**
 * Compare two lists/arrays and return true if they are equal
 * @param {First list/array} list1 
 * @param {Second list/array} list2 
 */
function compareArrays(list1, list2){
	if(list1.length != list2.length){
		logger.info(list1,"and",list2,"Lists/Arrays are not equal. Length is different.");
		return false;
	}
	else{
		list1.sort();
		list2.sort();
		for(var i=0; i<list1.length; i++){
			if(list1[i] != list2[i]){
				logger.info(list1,"and",list2,"Lists/Arrays are not equal.");
				return false;
			}
		}
		logger.info(list1,"and",list2,"Lists/Arrays are equal.");
		return true;
	}
}

/**
 * Compare two nested lists/arrays and return true if they are equal
 * @param {First nested list/array} list1 
 * @param {Second nested list/array} list2 
 */
function compareNestedArrays(list1, list2){
	var bool = true;
	if(list1.length != list2.length){
		logger.info(list1,"and",list2,"Nested Lists/Arrays are not equal. Length is different.");
		bool = false
		return bool;
	}
	else{
		for(var i=0; i<list1.length; i++){
			let tempBool = compareArrays(list1[i], list2[i]);
			if(tempBool == false){
				bool = tempBool;
			}
		}
		if(bool == true){
			logger.info(list1,"and",list2,"Nested Lists/Arrays are equal.");
		}
		else{
			logger.info(list1,"and",list2,"Nested Lists/Arrays are not equal.");
		}
		return bool;
	}
}

function removeFirstLeadingZero(str){
	str = str.replace(/0(\d+)/, "$1");
	logger.info("String after removed leading first 0 :", str);
	return str;
}

async function removeEmptyNullValuesFromList(inputList){
	var filteredList = await inputList.filter(function (el) {
		return el != null;
	});
	return filteredList;
}

// Function for switching to New tab by closing Old[Parent] tab
async function switchToNewTabByClosingOldTab(){
	await browser.getAllWindowHandles().then(async function (handles) {
		await browser.switchTo().window(handles[0]).then(async function () {
		 	await browser.driver.close().then(async function(){
				 logger.info("Closed the Old[Parent] tab");
				 await browser.switchTo().window(handles[1]).then(function(){
					logger.info("Switch to the New tab");
				 })
			 })
		});
	});
}

/**
 * This function will scroll to View the webElement of page
 */
function scrollToWebElement(el) {
	return browser.executeScript('arguments[0].scrollIntoView(true)', el.getWebElement());
}

/*
 * Remove whitespaces from both sides of each value in array
 */
function removeBlankSpacesInArray(data) {
    data = data.map(function (tag) {
        if (typeof tag === 'string') {
            tag = tag.trim();
        } else if (typeof tag === 'object') {
            tag = tag.map(str => str.replace(/\s/g, ''));
        }
        return tag;
    });
    data = JSON.parse(JSON.stringify(data));
    return data;
}

/**
 * Method to get browser name
 */
function getBrowserName() {
    var capsPromise = browser.getCapabilities();
    return capsPromise.then(function (caps) {
        var browserName = caps.get('browserName');
		logger.info("Browser used is " + browserName)
		return browserName
    })
}



/**
 * Function to remove duplicates in an array
 */
function removeDuplicates(array) {  
	var s = new Set(array);
    var it = s.values();
    return Array.from(it);
}

module.exports = {
	stringToInteger:stringToInteger,
	stringToFloat:stringToFloat,
	sortArrayList:sortArrayList,
	clickOnHeaderDashboardLink:clickOnHeaderDashboardLink,
	getFullPreviousMonthYearDate:getFullPreviousMonthYearDate,
	getPreviousMonthName:getPreviousMonthName,
	kFormatter:kFormatter,
	kFormatterWithoutK:kFormatterWithoutK,
	switchToCssrIFramebyID:switchToCssrIFramebyID,
	waitForInvisibilityOfKibanaDataLoader:waitForInvisibilityOfKibanaDataLoader,
	waitOnlyForInvisibilityOfKibanaDataLoader:waitOnlyForInvisibilityOfKibanaDataLoader,
	getPerviousDateInMonthYearFormat:getPerviousDateInMonthYearFormat,
	deleteAllReports:deleteAllReports,
	getTicketCountFromJsonData:getTicketCountFromJsonData,
	getDataFromXlsxFile:getDataFromXlsxFile,
	getCsvFileRowCount:getCsvFileRowCount,
	isTicketDetailsFileExists:isTicketDetailsFileExists,
	getTimeDateRangeForCustomeRangeFilter:getTimeDateRangeForCustomeRangeFilter,
	getDateDifference:getDateDifference,
	getLocalTimeDate:getLocalTimeDate,
	getPreviousMonthYearDate:getPreviousMonthYearDate,
	deleteAllCookies:deleteAllCookies,
	getRandomString:getRandomString,
	switchToDefault:switchToDefault,
	switchToFrameById:switchToFrameById,
	switchToFrame:switchToFrame,
	scrollToTop:scrollToTop,
	scrollToBottom:scrollToBottom,
	scrollToWebElement:scrollToWebElement,
	generateRuntimeSpecString:generateRuntimeSpecString,
	waitForAngular:waitForAngular,
	getCurrentURL:getCurrentURL,
	clickOnResetFilterLink:clickOnResetFilterLink,
	clickOnTabButton:clickOnTabButton,
	isSelectedTabButton:isSelectedTabButton,
	getDataFromElasticViewJSON:getDataFromElasticViewJSON,
	removeBlankSpaces:removeBlankSpaces,
	IsDataMissingInJSONOrUI:IsDataMissingInJSONOrUI,
	removeInvertedCommasFromString:removeInvertedCommasFromString,
	isJsonObjectsEqual:isJsonObjectsEqual,
	compareArrays:compareArrays,
	getJSONObjectKeys:getJSONObjectKeys,
	getJSONObjectValues:getJSONObjectValues,
	isListEmpty:isListEmpty,
	compareNestedArrays:compareNestedArrays,
	getNumberFromString:getNumberFromString,
	hasNumber:hasNumber,
	addCommasInNumber:addCommasInNumber,
	removeFirstLeadingZero:removeFirstLeadingZero,
	removeEmptyNullValuesFromList:removeEmptyNullValuesFromList,
	switchToNewTabByClosingOldTab:switchToNewTabByClosingOldTab,
	getAlphaNumericCharactersFromString:getAlphaNumericCharactersFromString,
	calcIntNumberFromPercentage:calcIntNumberFromPercentage,
	getDateFromISOFormat:getDateFromISOFormat,
	scrollToWebElement:scrollToWebElement,
	getHeaderTitleText:getHeaderTitleText,
	removeBlankSpacesInArray:removeBlankSpacesInArray,
	removeDuplicates:removeDuplicates,
	getBrowserName:getBrowserName,
	waitOnlyForInvisibilityOfCarbonDataLoader:waitOnlyForInvisibilityOfCarbonDataLoader
};
