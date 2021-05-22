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
var healthAndInventoryUtil = require('../../helpers/healthAndInventoryUtil.js');
var timeout = require('../../testData/timeout.json');
var appUrls = require('../../testData/appUrls.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json');
var path = require('path');


var defaultConfig = {
	pageUrl: url,
	dashboardHeaderTileTextCss: "#fullwrapperDiv h1.titleMainTop",
	dsrTileTitleTextCss: "div.sunriseMain h2",
	dsrFromTimestampCss: "div.sunRiseLastUpdated",
	alertHeader:"label.pagetitle",
	dsrToTimestampCss: "div.sunRiseLastUpdated span:nth-child(2)",
	lastUpdatedTimestampXpath: "//span[contains(text(),'Last updated')]",
	lastUpdatedTimestampHealthInventoryCss: "label.currenttimestamp",
	alertsCardTitleXpath: "//span[text()[contains(.,'Alerts')]]",
	alertsRowsCss: "div.rowAlertcard",
	criticalAlertsRowsCss: "div.rowAlertcard #critical-",
	warningAlertsRowsCss: "div.rowAlertcard #Warning",
	alertDateCss:"div.rowAlertcard p.txtGraySm.alertTitleSy",
	allAvailableParameterOverview:"label.overViewtitle",
	criticalCountCss: "p.txtCrtcl",
	warningCountCss: "p.txtWarning",
	healthyCountCss: "p.txtHealthy",
	alertRowsNameCss: "div.rowAlertcard p.txtBlueBold",
	criticalAlertsRowsNameXpath: "//*[@id='critical-']//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtBlueBold')]",
	criticalAlertRowCICountXpath: "//*[@id='critical-']//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtmiddle')]",
	warningAlertsRowsNameXpath: "//*[@id='Warning']//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtBlueBold')]",
	warningAlertRowCICountXpath: "//*[@id='Warning']//ancestor::div[@class='rowAlertcard']//p[contains(@class,'txtmiddle')]",
	allAvailableCardsNameCss: "#fullwrapperDiv  [class*='cardsubTitle'], #fullwrapperDiv h2",
	noDataAvailableXpath: "/ancestor::div[@class='cardPadding']//img[contains(@src, 'dataNotAvailable.svg')]/following-sibling::div/p",
	connectionFailureXpath: "/ancestor::div[@class='cardPadding']//img[contains(@src, 'connectionFailure.svg')]/following-sibling::div/p",
	largeViewCss: "#largeView",
	smallViewCss: "#smallView",
	selectedCategoryAttribute: "selectedcategoryIcon",
	classAttribute: "class",
	viewDetailsLinkXpath: "//span[@title='{0}']/ancestor::div[@class='cardPadding']//a[contains(@class, 'hand-cursor')]",
	toolTipTextCss: "div.nvtooltip strong",
	miniViewCardsTextXpath: "//span[@title='{0}']/ancestor::div[@class='cardPadding']//a[contains(@class, 'progressTxt')][contains(text(),'{1}')]/../preceding-sibling::p",
	dailySunRiseReportDataXpath: "//div[contains(@class, 'pticketslabel')][contains(text(), '{0}')]/following-sibling::div//*[@class='ticketPlabel'][contains(text(), '{1}')]/preceding-sibling::a",
	problemManagementGraphWrapperCss: ".problem",
	incidentManagementGraphWrapperCss: ".custIncident",
	changeManagementGraphWrapperCss: ".custChange",
	top5ServersPervasiveInsightsTxtCss: "#pervassiveInsights text.nv-legend-text",
	pervasiveInsightsGraphBarTxtCss: "#pervassiveInsights g > rect.nv-bar",
	cardTitleCss: "span[title='{0}']",
	cardTitleDataCenterCss: "span[title='{0}'] ~ .lastUpdatedDate",
	actionableInsightsRowXpath: "//span[contains(text(),'Actionable Insights')]/ancestor::div[@class='cardPadding']//p",
	cardDefinitionTxtXpath: "//span[contains(text(),'{0}')]/ancestor::div[@class='cardPadding']//p",
	barGraphKeyValueXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-series')]//*[name()='text']",
	barGraphXaxisTitleXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-x nv-axis nvd3-svg')]//*[name()='text' and @class]",
	barGraphXaxisLabelsXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-x nv-axis nvd3-svg')]//preceding-sibling::*//*[name()='text']",
	barGraphYaxisTitleXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-y nv-axis nvd3-svg')]//*[name()='text'  and @class]",
	barGraphYaxisLabelsXpath:"//span[contains(text(),'{0}')]/ancestor::div[@class='clientCardTitleDiv cardupTitle']/following-sibling::div//*[name()='g' and contains(@class,'nv-y nv-axis nvd3-svg')]//*[name()='text']",
	inventoryItemTextCss:".cloudInventoryInsights text[class='nv-pie-title nv-ticketNumber-text']",
	inventoryCardLegendsCss:".cloudInventoryInsights g.nv-series>text",
	accountNameTextXpath:"//h1[@class='titleMainTop']",
	customiseButtonXpath:"#customize",
	cancelButtonTextXpath: "//button[contains(text(),'Cancel')]",
	saveButtonTextXpath:"//button[contains(text(),'Save')]",
	visibilityIconButtonXpath: "//*[contains(@class,'clientcardTitle')]/span[1][contains(@title,'{0}')]//ancestor::*[@class='cardPadding']//preceding-sibling::div[@class='CustomTopIconPart']//*[name()='svg']",
	customisationSuccessMessageXpath: "//p[contains(text(),'Your customization saved successfully.')]",
	cardDisabledMessageXpath: "//div[@class='sunriseReportWrapper']//div[@title='Customization mode - You will not be able to interact with the cards']",
    clickChangeMgmtCreatedLnkXpath: "//div[@id='cardNo_16']//a[contains(text(),'Created')]",
	clickDashboardLinkCss: "div.dashboardLink",
	clickIncidentMgmtCreatedLnkXpath: "//div[@id='cardNo_15']//a[contains(text(),'Created')]",
	clickParvasiveLnkXpath: "(//div[@id='cardNo_17']//a)[1]",
	clickProblemCreatedLnkXpath: "//div[@id='cardNo_7']//a[contains(text(),'Created')]",
	sunriseReportCreatedXpath:"//div[contains(text(),'P1')]/following-sibling::div/div[1]//a",
	dashboardTitleTextXpath:"//h1[@class='titleMainTop']",
	deliveryInsightsRowCss: ".ActionableInsightsScrollbar a p",
	deliveryInsightsLinkXpath: "//span[@title='{0}']/ancestor::div[@class='cardPadding']//p[contains(text(),'{1}')]",
	deliveryInsightDashboardXpath: "//*[contains(text(), '{0}')]",
	dashboarAllCardHeaderCss:"span.clientcardTitle span[title]",
	selfServiceXpath:"//p[contains(text(),'{0}')]",
	auditLogCss:".bx--data-table-header__title",
	tableDataByIndex:"div table.bx--data-table tbody tr td:nth-child({0})",
	downloadXpath:"//*[@id='icon']",
	downloadTemplateCss:"label#label-radio-0 span",
	downloadTemplateXpath:"//button[contains(text(),'{0}')]",
	uploadFileCss:"button.bx--btn--primary",
	chooseFileCss:"button#dropdown-0",
	chooseRequestCss:"li div.bx--list-box__menu-item__option",
	addFileCss:"input[type=file]",
	resolverGroupTabXpath: "//button[@class='bx--tabs--scrollable__nav-link' and contains(text(), '{0}')]",
	applyResolverGroupSelectionButtonXpath : "//button[@class='resolver--group-apply bx--btn bx--btn--primary']",
	ticketsInScopeCheckboxCss : "label.bx--checkbox-label",
	totalAuditLogCountCss : "span.bx--pagination__text",
	resolverGroupSuccessNotificationCss : "p.bx--toast-notification__title",
	successNotificationCloseIconXpath : "//*[@class='bx--toast-notification__close-icon notification__close']",
	dahsboardCardsHeaderXpath : "//div[@class='clientCardTitleDiv cardupTitle']"
};

function dashboard(selectorConfig) {
	if (!(this instanceof dashboard)) {
		return new dashboard(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame
 */
dashboard.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	util.switchToFrame();
};

/**
 * Method to get dashboard header title text
 */
dashboard.prototype.getDashboardHeaderTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.dashboardHeaderTileTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.dashboardHeaderTileTextCss)).getText().then(function (text) {
		logger.info("Dashboard page header title text : " + text);
		var splitStr = text.split(" ")[0];
		logger.info("splitted string : " + splitStr);
		return splitStr.trim();
	});
};
/**
 * Method to check whether the Daily sunrise report card is available or not
 */
dashboard.prototype.isPresentDSRTile = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.dsrTileTitleTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.dsrTileTitleTextCss)).getText().then(function (text) {
		logger.info("DSR title text is : " + text);
		return text;
	});
};
/**
 * Method to get alerts timestamp
 */
dashboard.prototype.getAlertsTimestamp = function () {
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element.all(by.css(this.alertDateCss)).getText().then(function (datetime) {
	    logger.info("Time stamp of the alert is  : " + datetime);
	    return datetime;
	});
};

/**
 * Method to get all cards header on dashboard Page
 */
dashboard.prototype.getAllCardsNameFromDashboard = async function(adminCardName) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.dashboarAllCardHeaderCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.dashboarAllCardHeaderCss)).getText().then(function (dashboardCardText) {
		var dashboardCardNames = dashboardCardText.map((names)=>names.split('(')[0].trim())
		logger.info("Dashboard header card text is : " + dashboardCardNames);
		return dashboardCardNames
	});
}

/**
 * method to click on self service link
 */

dashboard.prototype.clickOnAdminConsoleCategories = async function(serviceName) {
	var self = this;
	util.waitForAngular();
	var selfService = self.selfServiceXpath.format(serviceName);
	browser.wait(EC.elementToBeClickable(element(by.xpath(selfService))), timeout.timeoutInMilis)
	return await element(by.xpath(selfService)).click().then(function(){
		logger.info(`self service is clicked`);
		logger.info('Clicked on ' , serviceName);
		return true
	})
}

/**
 * Method to get audit log header
 */
dashboard.prototype.getAuditLogHeaderText =async function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.auditLogCss))), timeout.timeoutInMilis);
	await element(by.css(this.auditLogCss)).getText().then(function(auditLogText){
		logger.info("header is " + auditLogText);	
	});
}


/**
 * Method to get all parameters from alerts overview section
 */
dashboard.prototype.getAllAvailableParameterNameFromAlert = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.allAvailableParameterOverview)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.allAvailableParameterOverview)).getText().then(function (alertOverviewParam) {
		var list = new Array();
		for (var i = 0; i < alertOverviewParam.length; i++) {
			var split = alertOverviewParam[i].toString().split("(")[0];
			list[i] = split.trim();
		}
		logger.info("list " + list);
		return list;
	});
};
/**
 * Method to get total alerts count value
 */
dashboard.prototype.getAlertsTotalCount = function () {
	var countVal;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.alertsCardTitleXpath)).getText().then(function (title) {
		var temp = title.trim().split("(")[1];
		countVal = parseInt(temp.split(")")[0]);
		logger.info("Total count : " + countVal);
		return countVal;
	});
};

/**
 * Method to get total alerts row count
 */
dashboard.prototype.getAlertsRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element.all(by.css(this.alertsRowsCss)).count().then(function (rowCount) {
		logger.info("Total alerts Row count : " + rowCount);
		return parseInt(rowCount);
	});
};

/**
 * Method to get critical alerts row count
 */
dashboard.prototype.getCriticalAlertsRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element.all(by.css(this.criticalAlertsRowsCss)).count().then(function (rowCount) {
		logger.info("Critical alerts Row count : " + rowCount);
		return parseInt(rowCount);
	});
};

/**
 * Method to get warning alerts row count
 */
dashboard.prototype.getWarningAlertsRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.alertsCardTitleXpath))), timeout.timeoutInMilis);
	return element.all(by.css(this.warningAlertsRowsCss)).count().then(function (rowCount) {
		logger.info("Warning alerts Row count : " + rowCount);
		return parseInt(rowCount);
	});
};
/**
 * Method to retrieve the alert header title
 */
dashboard.prototype.retrieveAlertHeader =  function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.alertHeader))), timeout.timeoutInMilis);
	return element(by.css(this.alertHeader)).getText().then(function (alertHeader) {
        logger.info("alert Header title is : " + alertHeader);
	    return alertHeader;
	});
};

/**
 * Method to click on first alert row on alerts card and return text on it
 */
dashboard.prototype.clickOnFirstAlertFromAlertsCard = async function () {
	var rowCnt = await this.getAlertsRowCount();
	if (rowCnt > 0) {
		var firstAlertRowCss = element.all(by.css(this.alertRowsNameCss)).get(0);
		browser.wait(EC.elementToBeClickable(firstAlertRowCss), timeout.timeoutInMilis);
		return firstAlertRowCss.getText().then(function (text) {
			return firstAlertRowCss.click().then(function () {
				var txt = text.split(" application")[0].trim();
				logger.info("Clicked on first alert from alerts card. Text on alert: " + txt);
				return true;
			})
		})
	}
	else {
		logger.info("There are no alerts present.");
		return false;
	}
};
/**
 * Method to retrieve the first alert name from dashboard
 */
dashboard.prototype.retrieveFirstAlert = async function () {
	var rowCnt = await this.getAlertsRowCount();
	if (rowCnt > 0) {
		var firstAlertRowCss = await element(by.css(this.alertRowsNameCss));
		browser.wait(EC.elementToBeClickable(firstAlertRowCss), timeout.timeoutInMilis);
		return firstAlertRowCss.getText().then(function (alertName) {
		    logger.info("alert present and the name is " + alertName);
		    return alertName;
		})
	}
};
/**
 * Method to get details of first Critical alert from Alert card and return App Name and Server count affected
 */
dashboard.prototype.getFirstCriticalAlertDetailsFromAlertsCard = async function () {
	var alertCount = await this.getCriticalAlertsRowCount();
	if (alertCount > 0) {
		var firstAlertRowNameCss = element.all(by.xpath(this.criticalAlertsRowsNameXpath)).get(0);
		var firstAlertRowCICountCss = element.all(by.xpath(this.criticalAlertRowCICountXpath)).get(0);
		browser.wait(EC.visibilityOf(firstAlertRowNameCss), timeout.timeoutInMilis);
		return firstAlertRowNameCss.getText().then(function (appName) {
			return firstAlertRowCICountCss.getText().then(function (CIcount) {
				var name = appName.split(" application")[0].trim();
				var count = parseInt(CIcount.split("/")[0]);
				logger.info("App name: " + name + ", CI impacted count: " + count);
				var details = [name, count];
				return details;
			});
		});
	}
	else {
		logger.info("There are no critical alerts present.");
		return false;
	}
};

/**
 * Method to get critical alerts count from health card
 */
dashboard.prototype.getCriticalAlertsCountFromHealthCard = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.criticalCountCss))), timeout.timeoutInMilis);
	return element(by.css(this.criticalCountCss)).getText().then(function (criticalCount) {
		logger.info("Health Card critical count : " + criticalCount);
		return parseInt(criticalCount);
	});
};

/**
 * Method to get details of first Warning alert from Alert card and return App Name and Server count affected
 */
dashboard.prototype.getFirstWarningAlertDetailsFromAlertsCard = async function () {
	var alertCount = await this.getWarningAlertsRowCount();
	if (alertCount > 0) {
		var firstAlertRowNameCss = element.all(by.xpath(this.warningAlertsRowsNameXpath)).get(0);
		var firstAlertRowCICountCss = element.all(by.xpath(this.warningAlertRowCICountXpath)).get(0);
		browser.wait(EC.visibilityOf(firstAlertRowNameCss), timeout.timeoutInMilis);
		return firstAlertRowNameCss.getText().then(function (appName) {
			return firstAlertRowCICountCss.getText().then(function (CIcount) {
				var name = appName.split(" application")[0];
				var count = parseInt(CIcount.split("/")[0]);
				logger.info("App name: " + name + ", CI impacted count: " + count);
				var details = [name, count];
				return details;
			});
		});
	}
	else {
		logger.info("There are no warning alerts present.");
		return false;
	}
};

/**
 * Method to get warning alerts count from health card
 */
dashboard.prototype.getWarningAlertsCountFromHealthCard = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.warningCountCss))), timeout.timeoutInMilis);
	return element(by.css(this.warningCountCss)).getText().then(function (warningCount) {
		logger.info("Health Card warning count : " + warningCount);
		return parseInt(warningCount);
	});
};

/**
 * Method to get total[critical+warning] alerts count from health card
 */
dashboard.prototype.getTotalAlertsCountFromHealthCard = async function () {
	var criticalAlerts = await this.getCriticalAlertsCountFromHealthCard();
	var warningAlerts = await this.getWarningAlertsCountFromHealthCard();
	return (criticalAlerts + warningAlerts);
};

/**
 * Method to get Healthy alerts count from health card
 */
dashboard.prototype.getHealthyAlertsCountFromHealthCard = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthyCountCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthyCountCss)).getText().then(function (healthyCount) {
		logger.info("Health Card Healthy count : " + healthyCount);
		return parseInt(healthyCount);
	});
};

/**
 * Method to verify last updated timestamp is updated within limit or not
 * time -- Numeric value in Hours or Minutes
 * timeUnit -- String value as "Hours" or "Minutes"
 */
dashboard.prototype.verifyLastUpdatedTimestampForITOps = function (time, timeUnit) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.lastUpdatedTimestampXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.lastUpdatedTimestampXpath)).getText().then(function (lu_time) {
		var temp = lu_time.split("updated:");
		var lastUpdatedTime = temp[1].trim();
		logger.info("Last Updated Time: " + lastUpdatedTime);
		// Get app time in Local timezone
		if (lastUpdatedTime.includes("IST")) {
			logger.info("Sliced time: " + lastUpdatedTime.split("IST")[0].trim());
			var d1 = new Date(lastUpdatedTime.split("IST")[0].trim());
		}
		else {
			var d1 = new Date(lastUpdatedTime);
		}
		// Get local time in Local timezone
		var curr_Time = util.getLocalTimeDate();
		var d2 = new Date(curr_Time);
		logger.info("App_time: " + d1 + " " + "Local_time: " + d2);
		if (timeUnit == "Hours") {
			// Find the difference between 2 dates and convert it in hours
			var diff = Math.abs(d2 - d1) / (60 * 60 * 1000);
		}
		else if (timeUnit == "Minutes") {
			// Find the difference between 2 dates and convert it in minutes
			var diff = Math.abs(d2 - d1) / (60 * 1000);
		}
		else {
			logger.info("Invalid time unit provided..");
			return false;
		}
		if (diff <= time) {
			logger.info("Difference is within limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return true;
		}
		else {
			logger.info("Difference is exceeded the limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return false;
		}
	});
};

/**
 * Method to verify last updated timestamp for Health & Inventory landing pages is updated within limit or not
 * time -- Numeric value in Hours or Minutes
 * timeUnit -- String value as "Hours" or "Minutes"
 */
dashboard.prototype.verifyLastUpdatedTimestampForHealthInventory = function (time, timeUnit) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.lastUpdatedTimestampHealthInventoryCss))), timeout.timeoutInMilis);
	browser.sleep(2000);
	return element(by.css(this.lastUpdatedTimestampHealthInventoryCss)).getText().then(function (lu_time) {
		var temp = lu_time.split("updated");
		var lastUpdatedTime = temp[1].trim();
		logger.info("Last Updated Time: " + lastUpdatedTime);
		// Get app time in Local timezone
		if (lastUpdatedTime.includes("IST")) {
			logger.info("Sliced time: " + lastUpdatedTime.split("IST")[0].trim());
			var d1 = new Date(lastUpdatedTime.split("IST")[0].trim());
		}
		else {
			var d1 = new Date(lastUpdatedTime);
		}
		// Get local time in Local timezone
		var curr_Time = util.getLocalTimeDate();
		var d2 = new Date(curr_Time);
		logger.info("App_time: " + d1 + " " + "Local_time: " + d2);
		if (timeUnit == "Hours") {
			// Find the difference between 2 dates and convert it in hours
			var diff = Math.abs(d2 - d1) / (60 * 60 * 1000);
		}
		else if (timeUnit == "Minutes") {
			// Find the difference between 2 dates and convert it in minutes
			var diff = Math.abs(d2 - d1) / (60 * 1000);
		}
		else {
			logger.info("Invalid time unit provided..");
			return false;
		}
		if (diff <= time) {
			logger.info("Difference is within limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return true;
		}
		else {
			logger.info("Difference is exceeded the limit[" + time + " " + timeUnit + "] and value is: " + diff);
			return false;
		}
	});
};

/**
 * Method to get timestamp difference for Daily sunrise report card
 */
dashboard.prototype.getTimestampDiffForSunriseReport = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.dsrToTimestampCss))), timeout.timeoutInMilis);
	var self = this;
	var fTime, tTime;
	return element(by.css(this.dsrFromTimestampCss)).getText().then(function (fromTime) {
		var temp = fromTime.split("To:");
		fTime = temp[0].split("From:");
		//logger.info("From time: " + fTime[1].trim());
		return element(by.css(self.dsrToTimestampCss)).getText().then(function (toTime) {
			tTime = toTime.split("To:");
			var f_Time = fTime[1].trim();
			var t_Time = tTime[1].trim();
			if (f_Time.includes("IST") && t_Time.includes("IST")) {
				var fromTimestamp = new Date(f_Time.split("IST")[0].trim());
				var toTimestamp = new Date(t_Time.split("IST")[0].trim());
			}
			else {
				var fromTimestamp = new Date(f_Time);
				var toTimestamp = new Date(t_Time);
			}
			logger.info("From time after Local Timezone conversion: " + fromTimestamp);
			logger.info("To time after Local Timezone conversion: " + toTimestamp);
			// Get local time in IST
			var curr_Time = util.getLocalTimeDate();
			var curr_dateObj = new Date(curr_Time);
			logger.info("Current time after Local Timezone conversion: " + curr_dateObj);
			// Check whether the environment gets updated today or not
			var updateHoursDiff = Math.abs(curr_dateObj - toTimestamp) / (60 * 60 * 1000);
			logger.info("Hours difference between current time and updated time of env: " + updateHoursDiff);
			if (updateHoursDiff > 24) {
				logger.info(dashboardTestData.envNotUpdatedMsg);
				return dashboardTestData.envNotUpdatedMsg;
			}
			else {
				// Find the difference between 2 dates and convert it in hours
				var hours = Math.abs(toTimestamp - fromTimestamp) / (60 * 60 * 1000);
				logger.info("Hours Diiference of DSR: " + hours);
				return hours.toString();
			}
		});
	});
};

/**
 * Method to get all available cards name from dashboard page
 */
dashboard.prototype.getAllAvialableCardsNameFromDashboard = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.allAvailableCardsNameCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.allAvailableCardsNameCss)).getText().then(function (text) {
		logger.info("Available cards name from dashboard page : " + text);
		var list = new Array();
		for (var i = 0; i < text.length; i++) {
			var split = text[i].toString().split("(")[0];
			list[i] = split.trim();
		}
		logger.info("list " + list);
		return list;
	});
};
/**
 * Method to check no data available text is present or not based on card name
 */
dashboard.prototype.isNoDataAvailableTextPresent = function (cardName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css("span[title='" + cardName + "']"))), timeout.timeoutInMilis);
	var noDataAvailableElement = element(by.xpath("//span[@title='" + cardName + "']" + this.noDataAvailableXpath));
	return noDataAvailableElement.isPresent().then(function (bool) {
		if (bool) {
			logger.info("Is No data available text present for " + cardName + " : " + bool);
			return true;
		} else {
			logger.info("Is No data available text present for " + cardName + " : " + bool);
			return false;
		}
	});
};


/**
 * Method to check connection failure text is present or not based on card name
 */
dashboard.prototype.isConnectionFailureTextPresent = function (cardName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css("span[title='" + cardName + "']"))), timeout.timeoutInMilis);
	var connectionFailureElement = element(by.xpath("//span[@title='" + cardName + "']" + this.connectionFailureXpath));
	return connectionFailureElement.isPresent().then(function (bool) {
		if (bool) {
			logger.info("Is connection failure text present for " + cardName + " : " + bool);
			return true;
		} else {
			logger.info("Is connection failure text present for " + cardName + " : " + bool);
			return false;
		}
	});
};


/**
 * Method to click on large view ICON
 */
dashboard.prototype.clickOnLargeViewIcon = function () {
	var self = this;
	util.waitForAngular();
	var largeViewIcon = element(by.css(self.largeViewCss));
	browser.wait(EC.elementToBeClickable(largeViewIcon), timeout.timeoutInMilis);
	util.scrollToTop();
	element(by.css(self.largeViewCss)).getAttribute(self.classAttribute).then(function (res) {
		if (res.includes(self.selectedCategoryAttribute)) {
			logger.info("Large view is already selected");
		}
		else {
			largeViewIcon.click().then(function () {
				logger.info("Clicked on large view ICON");
				util.waitForAngular();
			});
		}
	});

};

/**
 * Get all legends from inventory pie chart
 */
dashboard.prototype.getAllLegendsFromInventoryCard = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.inventoryCardLegendsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.inventoryCardLegendsCss)).getText().then(function(legendList){
		logger.info("All legends from inventory card: ",legendList);
		return legendList;
	});
}

/**
 * Method to click on small/Mini view ICON
 */
dashboard.prototype.clickOnMiniViewIcon = function () {
	var self = this;
	util.waitForAngular();
	var miniViewIcon = element(by.css(self.smallViewCss));
	browser.wait(EC.elementToBeClickable(miniViewIcon), timeout.timeoutInMilis);
	util.scrollToTop();
	element(by.css(self.smallViewCss)).getAttribute(self.classAttribute).then(function (res) {
		if (res.includes(self.selectedCategoryAttribute)) {
			logger.info("Small view is already selected");
		}
		else {
			miniViewIcon.click().then(function () {
				logger.info("Clicked on small view ICON");
				browser.sleep(2000);
				util.waitForAngular();
			});
		}
	});

};


/**
 * Method to click on view details link based on card
 */
dashboard.prototype.clickOnViewDetailsLinkBasedOnCard = async function (cardName) {
	var self = this;
	util.waitForAngular();
	var xpathSelector = self.viewDetailsLinkXpath.format(cardName);
	await browser.wait(EC.elementToBeClickable(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	await util.scrollToWebElement(element(by.xpath(xpathSelector)));
	await element(by.xpath(xpathSelector)).click().then(function () {
		logger.info("Clicked on " + cardName + "'s view details link");
		util.waitForAngular();
	});
};


/**
 * Method to get text from tooltip
 */
dashboard.prototype.getToolTipText = function () {
	browser.wait(EC.visibilityOf(element(by.css(this.toolTipTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.toolTipTextCss)).getText().then(function (toolTipText) {
		logger.info("tool tip text is : " + toolTipText);
		return toolTipText;
	});
};


/**
 * Method to get text from miniView based on input
 * @cardName e.g. inventory, health
 * @identifier e.g. DC, MC, Created, implemented, resolved
 */
dashboard.prototype.getTextFromMiniViewCard = function (cardName, identifier) {
	util.waitForAngular();
	var xpathSelector = this.miniViewCardsTextXpath.format(cardName, identifier);
	browser.wait(EC.visibilityOf(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	return element(by.xpath(xpathSelector)).getText().then(function (identifierValue) {
		logger.info(cardName + " card title's " + identifier + " identifier's value is :  " + identifierValue);
		return Number(identifierValue);
	});
};


/**
 * Method to get text from daily sunrise report card based on input
 * @ticket e.g. P1 tickets, P2 tickets, P3 tickets
 * @identifier e.g. Created, resolved
 */
dashboard.prototype.getTextFromDailySunRiseReportCard = function (ticket, identifier) {
	util.waitForAngular();
	var xpathSelector = this.dailySunRiseReportDataXpath.format(ticket, identifier);
	browser.wait(EC.visibilityOf(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	return element(by.xpath(xpathSelector)).getText().then(function (ticketNumber) {
		logger.info(ticket + " tickets " + identifier + " value is :  " + ticketNumber);
		if (ticketNumber.includes("k")) {
			var ticketNum = parseFloat(ticketNumber);
			logger.info(ticket + " tickets " + identifier + " converted value is :  " + ticketNum);
			return ticketNum;
		} else {
			return Number(ticketNumber);
		}
	});
};


/**
 * Method to get text from daily sunrise report card based on input
 * @ticket e.g. P1 tickets, P2 tickets, P3 tickets
 * @identifier e.g. Created, resolved
 */
dashboard.prototype.clickOnDailySunRiseReportCard = function (ticket, identifier) {
	util.waitForAngular();
	var xpathSelector = this.dailySunRiseReportDataXpath.format(ticket, identifier);
	browser.wait(EC.elementToBeClickable(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	element(by.xpath(xpathSelector)).click().then(function () {
		logger.info("Clicked on " + ticket + " tickets " + identifier);
	});
};

/**
 * Function to get tooltip value hovering over the bar in 2D-matrix bar graph
 * @graphName eg: Problem Management ( Bar graph available on dashbord)
 * @barNo is the Number representing, bar from left to right for which value is getting fetched starting with 1
 * @rangeNo  The Position of Bar starts with 0 ,if there is range comparison between Bars
 * e.g Problem Management  Matrix Bar Graph
 * First range---(Ticket Created :RangeNo and barNo respectively)[0 1, 0 2, 0 3]
 * second range---(Ticket Resolved :RangeNo and barNo respectively)[1 1, 1 2, 1 3]
 *
  */
dashboard.prototype.getMatrixBarGraphTicketText = async function (graphName, barNo, RangeNo) {
	var self = this;
	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	util.waitForAngular();
	var barGraphElement;
	if (graphName == dashboardTestData.problemManagement) {
		barGraphElement = await element(by.css(this.problemManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + " rect:nth-child(" + barNo + ")"))
	}
	else if (graphName == dashboardTestData.changeManagement) {
		barGraphElement = await element(by.css(this.changeManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + "  rect:nth-child(" + barNo + ")"))
	}
	else if (graphName == dashboardTestData.incidentManagement) {
		barGraphElement = await element(by.css(this.incidentManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + "  rect:nth-child(" + barNo + ")"))
	}
	await browser.wait(EC.visibilityOf(barGraphElement), timeout.timeoutInMilis);
	return await browser.actions().mouseMove(barGraphElement).perform().then(function () {
		logger.info("Mouse over " + graphName + " Bar Graph");
		return self.getToolTipText();
	});
};

/**
 * Function to get tooltip value hovering over the bar in 2D-matrix bar graph
 * @graphName eg: Problem Management ( Bar graph available on dashbord)
 * @barNo is the Number representing, bar from left to right for which value is getting fetched starting with 1
 * @rangeNo  The Position of Bar starts with 0 ,if there is range comparison between Bars
 * e.g Problem Management  Matrix Bar Graph
 * First range---(Ticket Created :RangeNo and barNo respectively)[0 1, 0 2, 0 3]
 * second range---(Ticket Resolved :RangeNo and barNo respectively)[1 1, 1 2, 1 3]
 * Used only for Incident, Change and Problem Management
  */
 dashboard.prototype.getColorCodeForBarGraph = function(graphName, barNo, RangeNo){
	util.waitForAngular();
	var barGraphElement, barName;
	if (graphName == dashboardTestData.problemManagement) {
		barGraphElement = this.problemManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + " rect:nth-child(" + barNo + ")";
	}
	else if (graphName == dashboardTestData.changeManagement) {
		barGraphElement = this.changeManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + "  rect:nth-child(" + barNo + ")";
	}
	else if (graphName == dashboardTestData.incidentManagement) {
		barGraphElement = this.incidentManagementGraphWrapperCss + " g.nv-group.nv-series-" + RangeNo + "  rect:nth-child(" + barNo + ")";
	}
	if(RangeNo == 0){
		barName = dashboardTestData.ticketCreatedName;
	}
	else if(RangeNo == 1){
		barName = dashboardTestData.ticketResolvedName;
	}
	browser.wait(EC.visibilityOf(element(by.css(barGraphElement))), timeout.timeoutInMilis);
	return element(by.css(barGraphElement)).getCssValue('fill').then(function(colorCode){
		logger.info("Color code for "+barName+" is: "+colorCode.trim());
		return colorCode.trim();
	});
};

/**
 * Method to get top 5 affected server text for pervasive insights card
 */
dashboard.prototype.getPervasiveInsightsCardTop5ServersText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.top5ServersPervasiveInsightsTxtCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.top5ServersPervasiveInsightsTxtCss)).getText().then(function (serversName) {
		logger.info("top 5 pervasive insights server name :  " + serversName);
		return serversName;
	});
};

/**
 * Method to get tool tip text from pervasive insights bar graph based on index provided
 */
dashboard.prototype.getPervasiveInsightsGraphBarText = async function (index) {
	var self = this;
	util.waitForAngular();
	browser.sleep(2000);
	var barGraphElement = await element.all(by.css(this.pervasiveInsightsGraphBarTxtCss)).get(index);
	await browser.wait(EC.visibilityOf(barGraphElement), timeout.timeoutInMilis);
	return await browser.actions().mouseMove(barGraphElement).perform().then(async function () {
		var toolTipText = await self.getToolTipText();
		var count = await util.getNumberFromString(toolTipText);
		logger.info("Tool tip text number : ", count);
		return util.stringToFloat(count);
	});
};


/**
 * Method to get card title count
 */
dashboard.prototype.getCardTitleCount = function (cardTitle) {
	util.waitForAngular();
	var cssSelector = this.cardTitleCss.format(cardTitle);
	browser.wait(EC.visibilityOf(element(by.css(cssSelector))), timeout.timeoutInMilis);
	return element(by.css(cssSelector)).getText().then(async function(titleText){
		var count = titleText.replace(/\D/g, "");
		await logger.info(cardTitle+" card title count : ", count);
		return Number(count);
	});
};


/**
 * Method to get data center text from card title
 */
dashboard.prototype.getCardTitleDataCenterText = function (cardTitle) {
	util.waitForAngular();
	var dataCenterCssSelector = this.cardTitleDataCenterCss.format(cardTitle);
	browser.wait(EC.visibilityOf(element(by.css(dataCenterCssSelector))), timeout.timeoutInMilis);
	return element(by.css(dataCenterCssSelector)).getText().then(async function(dataCenterText){
		await logger.info(cardTitle+" data center text : ", dataCenterText);
		var dataCenterSplitStr = dataCenterText.split("(")[1];
		var dataCenterSplitedStr = dataCenterSplitStr.toString().split(")")[0];
		return dataCenterSplitedStr;
	});
};


/**
 * Method to get row count from actionable insights card
 */
dashboard.prototype.getActionableInsightsCardRowCount = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.actionableInsightsRowXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.actionableInsightsRowXpath)).count().then(async function(rowCount){
		await logger.info("Actionable insights card row count : ", rowCount);
		return Number(rowCount);
	});
};


/**
 * Method to get row text from actionable insights card based on index provided
 * @index parameter passed to get row text
 */
dashboard.prototype.getActionableInsightsCardRowText = function (index) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.actionableInsightsRowXpath)).get(index)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.actionableInsightsRowXpath)).get(index).getText().then(async function(rowText){
		await logger.info("Actionable insights card row Text : ", rowText);
		return rowText;
	});
};


/**
 * Method to click on row text from actionable insights card based on index provided
 * @index parameter passed to click on row text
 */
dashboard.prototype.clickOnActionableInsightsCardRow = function (index) {
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.xpath(this.actionableInsightsRowXpath)).get(index)), timeout.timeoutInMilis);
	element.all(by.xpath(this.actionableInsightsRowXpath)).get(index).click().then(function(){
		logger.info(" Clicked on Actionable insights card row");
	});
};


/**
 * Method returns Card's Definition/Description Text based on Card Name
 * i.e: for Pervasive Insights  it is Top 5 Affected Servers
 */
dashboard.prototype.getCardsDefinitionTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardDefinitionTxt = this.cardDefinitionTxtXpath.format(cardName)
	browser.wait(EC.visibilityOf(element(by.xpath(cardDefinitionTxt))), timeout.timeoutInMilis);
	return element(by.xpath(cardDefinitionTxt)).getText().then(function (cardComponentTxt) {
		logger.info("Card definition for "+cardName +" is "+ cardComponentTxt);
		return cardComponentTxt;
	});
}
/**
 *  Method returns the name of keys.
 * keys: are the notations for ,what a particular bar is prepresenting in the Bar graph
 * eg: Ticket Created and Ticket resolved for incident mangement Graph
 */
dashboard.prototype.getCardKeyValuesTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardKeyValueTxt = this.barGraphKeyValueXpath.format(cardName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(cardKeyValueTxt)).last()), timeout.timeoutInMilis);
	return element.all(by.xpath(cardKeyValueTxt)).getText().then(function (cardValueTxt) {
		logger.info(cardName+" graph key represtentation values are : " + cardValueTxt);
		return cardValueTxt;
	});
}
/**
 * Method returns X-axis Title text of Bar Graph based on Graph Name
 * i.e for Incident Management it is TICKET COUNT
 */
dashboard.prototype.getCardXaxisTitleTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardTitleAxisTxt = this.barGraphXaxisTitleXpath.format(cardName)
	browser.wait(EC.visibilityOf(element(by.xpath(cardTitleAxisTxt))), timeout.timeoutInMilis);
	return element(by.xpath(cardTitleAxisTxt)).getText().then(function (cardTitleTxt) {
		logger.info("X-axis title of " +cardName +" is " + cardTitleTxt);
		return cardTitleTxt;
	});
}
/**
 * Method returns X-axis Title text of Bar Graph based on Graph Name
 * i.e for Incident Mangement it is INCIDENTS BY MONTH
 */
dashboard.prototype.getCardYaxisTitleTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardTitleAxisTxt = this.barGraphYaxisTitleXpath.format(cardName)
	browser.wait(EC.visibilityOf(element(by.xpath(cardTitleAxisTxt))), timeout.timeoutInMilis);
	return element(by.xpath(cardTitleAxisTxt)).getText().then(function (cardTitleTxt) {
		logger.info("Y-axis title of " +cardName +" is " + cardTitleTxt);
		return cardTitleTxt;
	});
}
/**
 * Method returns First y-axis label's Name of Bar Graph based on Graph Name
 */
dashboard.prototype.getCardYaxisFirstLabelTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardLabelAxisTxt = this.barGraphYaxisLabelsXpath.format(cardName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(cardLabelAxisTxt)).first()), timeout.timeoutInMilis);
	return element.all(by.xpath(cardLabelAxisTxt)).first().getText().then(function (cardLabelTxt) {
		logger.info("Y-axis first label of " +cardName +" is " + cardLabelTxt);
		return cardLabelTxt;
	});
}
/**
 * Method returns  all X-axis label's Test of Bar Graph based on Graph Name
 * i.e for Incident magment it will return all x axis label: Mmm YY ,Mmm YY, Mmm YY
 */
dashboard.prototype.getCardXaxisLabelsTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardLabelAxisTxt = this.barGraphXaxisLabelsXpath.format(cardName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(cardLabelAxisTxt)).last()), timeout.timeoutInMilis);
	return element.all(by.xpath(cardLabelAxisTxt)).getText().then(function (cardLabelTxt) {
		logger.info("x-axis  labels of " +cardName +" are " + cardLabelTxt);
		return cardLabelTxt;
	});
}
/**
 * Method returns X-axis label's count of Bar Graph based on Graph Name
 * for Incident magment it will return all x axis label: Mmm YY ,Mmm YY, Mmm YY it will return 3
 */
dashboard.prototype.getCardXaxisLabelsCountTextBasedOnCardName = function(cardName)
{
	util.waitForAngular();
	var cardLabelAxisTxt = this.barGraphXaxisLabelsXpath.format(cardName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(cardLabelAxisTxt)).last()), timeout.timeoutInMilis);
	return element.all(by.xpath(cardLabelAxisTxt)).getText().then(function (cardLabelTxt) {
	var cardLabelLength =cardLabelTxt.length;
		logger.info("x-axis labels Count of " +cardName +" is " + cardLabelLength);
		return cardLabelLength;
	});
}
/* get Inventory Items Count from Dashboard
*/
dashboard.prototype.getItemInventoryCount = function()
{
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.inventoryItemTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.inventoryItemTextCss)).getText().then(function (itemText) {
		logger.info("Inventory Item text is : " + itemText);
		return util.stringToInteger(itemText);
	});
}


/**
 * Method to verify card is disabled
 */

dashboard.prototype.getCardDisabled = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.cardDisabledMessageXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.cardDisabledMessageXpath)).getAttribute("title").then(function(cardDisableMsg){
		logger.info("Card Disabled message is  : "+ cardDisableMsg.trim());
		return cardDisableMsg;
	});
}

/**
 * Method to check Dashboard and account name
 */
dashboard.prototype.getAccountNameText = function() {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.accountNameTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.accountNameTextXpath)).getText().then(function (accountName) {
		logger.info("Account title text is : " + accountName);
		return accountName;
	});
}


/**
 * Method to click on customise button
 */

dashboard.prototype.customiseButtonClick = function() {

	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.customiseButtonXpath))), timeout.timeoutInMilis);
	element(by.css(this.customiseButtonXpath)).click().then(function () {
		browser.sleep(2000);
		logger.info("Customised button clicked");

		});

}

/**
 * Method to verify Cancel button for customisation
 */

dashboard.prototype.getSettingsCancelButtonText = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.cancelButtonTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.cancelButtonTextXpath)).getText().then(function(buttonText){
		logger.info("Cancel button text is  : "+ buttonText.trim());
		return buttonText;
	});
}

/**
 * Method to click on Cancel button for customisation
 */

dashboard.prototype.clickCancelButton = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.cancelButtonTextXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.cancelButtonTextXpath)).click().then(function(){
		logger.info("Cancel button clicked");
	});
}



/**
 * Method to verify Save button for customisation
 */
dashboard.prototype.getSettingsSaveButtonText = function() {

	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.saveButtonTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.saveButtonTextXpath)).getText().then(function(buttonText){
		logger.info("Save button text is  : "+ buttonText.trim());
		return buttonText;
	});
}

/**
 * Method to click save button
 */
dashboard.prototype.clickSaveButton = function() {

	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.saveButtonTextXpath))), timeout.timeoutInMilis);
 	element(by.xpath(this.saveButtonTextXpath)).click().then(function(){
		browser.sleep(2000);
		logger.info("Save button clicked");

	});
}


/**
 * Method to click on grey icon
 */
dashboard.prototype.clickOnVisibilityIcon = function(cardName) {
	var visibilityIconXpath = this.visibilityIconButtonXpath.format(cardName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(visibilityIconXpath))), timeout.timeoutInMilis);
	element(by.xpath(visibilityIconXpath)).click().then(function(){
		logger.info("Visibility Icon Button clicked for "+cardName);
	});
}

/**
 * Method to get customisation message
 */
dashboard.prototype.getCustomisationMessage = function() {
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(this.customisationSuccessMessageXpath))), timeout.timeoutInMilis);
	return  element(by.xpath(this.customisationSuccessMessageXpath)).getText().then(function(customiseMssg){
		logger.info("Customised Message is  : "+ customiseMssg.trim());
		return customiseMssg;

	});
}

/**
 * Method to click on change management created in mini card
 */
dashboard.prototype.clickCreatedChangeMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickChangeMgmtCreatedLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickChangeMgmtCreatedLnkXpath)).click().then(function(){
		logger.info("Created Link clicked from Change Management");
	});
}


/**
 * Method to click on incident management created in mini card
 */
dashboard.prototype.clickCreatedIncidentMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickIncidentMgmtCreatedLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickIncidentMgmtCreatedLnkXpath)).click().then(function(){
		logger.info("Created Link clicked from Incident Management");
	});
}

/**
 * Method to click on Parvasive management created in mini card
 */
dashboard.prototype.clickParvasiveMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickParvasiveLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickParvasiveLnkXpath)).click().then(function(){
		logger.info("Link clicked from Parvasive Management");
	});
}



/**
 * Method to click on Problem management created in mini card
 */
dashboard.prototype.clickProblemMgmt = function() {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.clickProblemCreatedLnkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.clickProblemCreatedLnkXpath)).click().then(function(){
		logger.info("Link clicked from Problem Management");
	});
}



/**
 * Method to click on Sunrise Report card created in mini card
 */
dashboard.prototype.clickSunriseReport = function() {
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(this.sunriseReportCreatedXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.sunriseReportCreatedXpath)).click().then(function(){
		logger.info("Link clicked from Sunrise Report card");
	});
}


/**
 * Method to get dashboard title
 */
dashboard.prototype.getDashboardTitleText = function() {
	var self = this;
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(this.dashboardTitleTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.dashboardTitleTextXpath)).getText().then(function (dashboardTitle) {
		logger.info("Dashboard title text is : " + dashboardTitle);
		return dashboardTitle;
	});
}

/**
 * Method to get Delivery Insight Card Row
 */
dashboard.prototype.getDeliveryInsightsCardRowText = function (index) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.deliveryInsightsRowCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.deliveryInsightsRowCss)).getText().then(async function(rowText){
		await logger.info("Delivery insights card row Text : ", rowText);
		return rowText;
	});
}

/*Delivery Insight Dashboard Title*/

dashboard.prototype.clickDeliveryInsightLink = function(dashboardName){
	util.waitForAngular();
	var xpathSelector = this.deliveryInsightDashboardXpath.format(dashboardName);
	browser.wait(EC.elementToBeClickable(element(by.xpath(xpathSelector))), timeout.timeoutInMilis);
	element(by.xpath(xpathSelector)).click().then(function(){
		logger.info("clicked on "+dashboardName+" link");
	});
}

/**
 * Method to select tab based on name on resolver group page
 */
dashboard.prototype.selectResolverGroupTabBasedOnName = async function (tabName) {
	util.waitForAngular();
	var TabXpath = this.resolverGroupTabXpath.format(tabName);
	browser.wait(EC.visibilityOf(element(by.xpath(TabXpath))), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(TabXpath))), timeout.timeoutInMilis);
	return await element(by.xpath(TabXpath)).getText().then(async function (tabText) {
		await element(by.xpath(TabXpath)).click();
		logger.info("Clicked on tab : " + tabText);
		return tabText;
	});
}

/**
 * Method check if apply button is present on resolver group page
 */
dashboard.prototype.checkVisibilityOfApplyButton = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(self.applyResolverGroupSelectionButtonXpath))), timeout.timeoutInMilis);
	browser.wait(EC.elementToBeClickable(element(by.xpath(self.applyResolverGroupSelectionButtonXpath))), timeout.timeoutInMilis);
	return element(by.xpath(self.applyResolverGroupSelectionButtonXpath)).getText().then(async function (buttonText) {
		logger.info("Button text : ", buttonText);
		return true;
	});
}

/*
This method gives table data by index
e.g If you require first column data from any table , you can pass index parameter as 1, for 2nd column data as index paramter 2.
*/

dashboard.prototype.getTableColumnDataByIndex =async function(index){
	var self = this
	util.waitForAngular();
	var tableData = self.tableDataByIndex.format(index)
	browser.wait(EC.visibilityOf(element.all(by.css(tableData)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(tableData)).getText().then(function (labelText) {
		logger.info("Associated table label: " + labelText)
		return labelText
	});
}


/*
This method to download template from self service
*/

dashboard.prototype.downloadTemplate =async function(download){
	var self = this;
	util.waitForAngular();
	var downloadTemplate = this.downloadTemplateXpath.format(download);
	browser.wait(EC.elementToBeClickable(element(by.xpath(self.downloadXpath))),timeout.timeoutInMilis);
	return await element(by.xpath(self.downloadXpath)).click().then(async function(){
		logger.info('download icon button is clicked');
		browser.wait(EC.visibilityOf(element(by.css(self.downloadTemplateCss))), timeout.timeoutInMilis);
		await element(by.css(self.downloadTemplateCss)).getText().then(async function () {
			await element(by.css(self.downloadTemplateCss)).click().then(async function () {
				logger.info('Template radio button is clicked' )
			})
		})
		browser.wait(EC.visibilityOf(element(by.xpath(downloadTemplate))), timeout.timeoutInMilis);
		await element(by.xpath(downloadTemplate)).click().then(async function () {
			logger.info('Export download is clicked ')
		})
		return true
	})
}

/*
This method is used to upload template from self service
*/

dashboard.prototype.uploadTemplate =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.uploadFileCss))), timeout.timeoutInMilis);
	return await element(by.css(self.uploadFileCss)).click().then(async function() {
		browser.wait(EC.visibilityOf(element(by.css(self.chooseFileCss))), timeout.timeoutInMilis);
		await element(by.css(self.chooseFileCss)).click().then(async function() {
			logger.info('Choose file is clicked')
		})
		browser.wait(EC.visibilityOf(element.all(by.css(self.chooseRequestCss)).get(0)), timeout.timeoutInMilis);
		await element.all(by.css(self.chooseRequestCss)).get(1).click().then(async function() {
			logger.info('Inventory request is selected')
		})
		browser.wait(EC.visibilityOf(element(by.css(self.addFileCss))), timeout.timeoutInMilis);
		var pathFile = path.resolve('../' +'aiops2_ui_automation' +'/aiops_reports/' + dashboardTestData.selfServiceInventoryFileName)
		await element(by.css(self.addFileCss)).sendKeys(pathFile).then(async function(){
			logger.info('File has been inserted')
			browser.wait(EC.visibilityOf(element.all(by.css(self.uploadFileCss)).get(0)), timeout.timeoutInMilis);
			await element.all(by.css(self.uploadFileCss)).get(2).click().then(async function() {
				logger.info('file has been uploaded')
			})
		})
		return true
	})
}
	

dashboard.prototype.selectTicketsInScopeCheckbox =async function(row){
	var self = this
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.ticketsInScopeCheckboxCss)).get(row)), timeout.timeoutInMilis);
	return await element.all(by.css(self.ticketsInScopeCheckboxCss)).getText().then(async function () {
		logger.info("Select checkbox at row " + row)
		await element.all(by.css(self.ticketsInScopeCheckboxCss)).get(row).click();
		return true
	});
}


/**
 * Method to click on apply button on resolver group page
 */
 dashboard.prototype.clickonApplyButton = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(self.applyResolverGroupSelectionButtonXpath))), timeout.timeoutInMilis);
	element(by.xpath(self.applyResolverGroupSelectionButtonXpath)).getText().then(async function (buttonText) {
		await element(by.xpath(self.applyResolverGroupSelectionButtonXpath)).click();
		logger.info("Clicked on : ", buttonText);
	});
}

/**
 * Method to fetch total audit entry counts on resolver group page under Audit log tab
 */
 dashboard.prototype.getAuditLogCountDetails = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.totalAuditLogCountCss))), timeout.timeoutInMilis);
	return element(by.css(self.totalAuditLogCountCss)).getText().then(async function (logCountDetails) {
		logger.info("Audit log page details ", logCountDetails );
		return logCountDetails;
	});
}

/**
 * Method to get success message information on applying resolver group changes
 */
 dashboard.prototype.getResolverGroupChangeSuccessMessage = async function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.resolverGroupSuccessNotificationCss))), timeout.timeoutInMilis);
	return element(by.css(self.resolverGroupSuccessNotificationCss)).getText().then(function (message) {
		logger.info("Success message on submitting change ", message );
		element(by.xpath(self.successNotificationCloseIconXpath)).click();
		logger.info("Closed notification popup" );
		return message;
	});
}

/**
 * Method to get all cards header on dashboard Page
 */
 dashboard.prototype.getAllCardsHeadersFromDashboard = async function(adminCardName) {
	var self = this;
	util.waitForAngular();
	util.switchToFrame();
	browser.wait(EC.visibilityOf(element.all(by.xpath(self.dahsboardCardsHeaderXpath)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.xpath(self.dahsboardCardsHeaderXpath)).getText().then(function (dashboardCardText) {
		logger.info("Dashboard header card text is : " + dashboardCardText);
		return dashboardCardText.toString().includes(adminCardName)		
	});

}


module.exports = dashboard;