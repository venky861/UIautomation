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
var healthTestData = require('../../testData/cards/healthTestData.json');
var dashboardTestData = require('../../testData/cards/dashboardTestData.json');
var healthAndInventoryUtil = require('../../helpers/healthAndInventoryUtil.js');


var defaultConfig = {
	pageUrl: url,
	/**
	 * Health page Locators
	 */
	healthHeaderTileTextCss: "label.pagetitle",
	healthDashboardViewCss: ".dshDashboardViewport",
	alertsCountFromDonutChartCss: "text.highcharts-title tspan",
	alertTypeDropdownCss: "select.aipos-health-breakdown__dropdown--options",
	alertTypeDropdownValuesCss: "select.aipos-health-breakdown__dropdown--options option",
	mainSectionsXpath: "//h4[contains(text(),'')]",
	topInsightsLabelCss: "div.kbnMarkdown__body p",
	healthApplicationViewXpath : "//span[@class='bx--link']",
	topInsightsSubSectionLabelsCss: "h6.topInsightsTitle",
	resourceSummaryLabelCss :"label.resourceSummarytitleText",	
	healthStatusSectionLabelCss: "label.donutChart",
	donutChartLabelsCss: "div.chartPro g.labels text",
	donutChartCountsCss: "div.chartPro g.count text",
	appResourceHealthBreakdownSectionLabelCss: "label.stackBarChart",
	appResHealthBreakdownSectionsXpath: "//*[@class='aipos-health-breakdown__chart']//*[name()='rect' and contains(@class,'highcharts-point')]",
	appResHealthBreakdownSectionTooltipXpath: "//*[@class='aipos-health-breakdown__chart']//*[name()='g' and contains(@class,'highcharts-tooltip')]//*[name()='tspan']",
	applicationsSectionLabelCss: "#n-tab-0 .tableheader h4",
	resourceListSectionLabelCss: "#n-tab-1 .tableheader h4",
	appResourceListTableBodyCss: "ibm-table table.bx--data-table tbody",
	resourcesSectionLabelXpath: "//*[@class='resourcedefult']//a[contains(@title,'Resources')]",
	applicationTableNameColumnCss: "div table.bx--data-table tbody tr td:nth-child({0})>span",
	applicationTableOptionButtonCss: "div table.bx--data-table tbody tr div.bx--overflow-menu",
	applicationViewDetailsButtonCss: "div table.bx--data-table tbody tr button",
	resourceViewTableBusinessUnitColumnCss:"div table.bx--data-table tbody tr td:nth-child(17)>span",
	navigationButtonLinksCss: "button.color__blue",
	providersListCss: "#tree-provider li.node-tree-provider",
	criticalSliceFromDonutChartXpath: "//div[contains(@class,'chartPro')]//*[name()='svg']//*[name()='path'][@fill='#d91e27']",
	warningSliceFromDonutChartXpath: "//div[contains(@class,'chartPro')]//*[name()='svg']//*[name()='path'][@fill='#fcd13a']",
	healthySliceFromDonutChartXpath: "//div[contains(@class,'chartPro')]//*[name()='svg']//*[name()='path'][@fill='#23a247']",
	tabSectionLabelCss: "ibm-tab-header-group ibm-tab-header",
	checkboxGlobalFilterXpath:"//span[@class='filterTextOverflow' and contains(text(),'{0}')]//ancestor::label",
	applyFilterButtonCss: "button.applyButton",
	clickMoreButtonXpath:"//a[contains(text(),'{0}')]",
	searchBoxCss:"div input.bx--search-input",
	headerTabsCss:"li a.bx--tabs__nav-link",
	listViewHeaderCss:"div.bx--table-header-label",
	listViewItemsCss:"td.undefined a",
	headerMainframeResourceCss:"div.fvt-breadcrumb span.bx--link",


	listViewStoreXpath:"//tr[@ibmtablerow='']//span[contains(text(),'store')]",
	stackBarGraphxpath:"//*[@class='graph-svg-component']//*[@class='layer']",
	stackBarToolTipcss:"div.chart-tooltip",
	tableOverflowMenuCss: ".bx--data-table-container .bx--data-table tbody td ibm-overflow-menu",
	viewDetailsCss:".bx--overflow-menu-options__option-content",
	/**
	 * Application Details page locators
	 */
	appDetailsPageHeaderNameCss: "label.pagetitle",
	associatedResourcesTableRowsCss: "div table.bx--data-table tbody tr",
	associatedResourcesTableLabelCss: ".bx--data-table-header h4",
	resourceHealthValueXpath: "//td[contains(text(),'{0}')]",
	associatedResourcesLinkButtonXpath: "//td[contains(text(),'{0}')]//preceding-sibling::td//a",
	associatedResourcesNameColumnValueXpath: "//td[contains(text(),'{0}')]//preceding-sibling::td[1]/span",
	nextPageButtonCss: "div.bx--pagination__right button[aria-label='Forward']",
	paginationItemsPerPageCss: "div.health-custom-table__pagination-wrapper--select option[selected='selected']",
	paginationDetailsTextCss: "div.bx--pagination__left span.bx--pagination__text",
	associatedResourcesTableFirstPageXpath: "//pagination/li[@class='pagination-prev']//following-sibling::li[1]/a",
	searchIconButtonCss : "button span.euiFilterButton__textShift",
	searchInputCss : "input.euiFieldSearch",
	noDataTextCss : "table.health-custom-table__table-container tbody td.body__no-wrap",
	/**
	 * Resource Details page locators
	 */
	alertsTableColumnNamesCss: "div table.bx--data-table th div.bx--table-header-label",
	alertsTableRowsCountCss: "table.dataTable tbody tr",
	alertsTableNoDataTextCss: "table.dataTable tbody td.dataTables_empty",
	alertsTableColumnDataXpath: "//table[contains(@class,'bx--data-table')]//tbody//tr[{0}]/td[{1}]",
	alertsTableNextButtonCss: "div.dataTables_paginate a.next",
	alertsTablePageSizeCss: "div.dataTables_length option[value='10']",
	alertsTablePaginationDetailsTextCss: "div.dataTables_info",
	tableSectionsLinksCss: "div.tableView a.bx--tabs__nav-link",
	summaryOpenTicketsSectionLinksCss: "div.switcher-vis button",
	summaryWidgetHeaderCss: "span.spanFont",
	associatedApplicationsTableLabelCss: "div.health-custom-table div.list-container h5",
	resourceDetailsOverviewLabelValuesCss: "label.pagetitle",
	associatedApplicationsTableAppNameCss: "div.health-custom-table table tbody td:nth-child(1)",
	overviewLabelCss: "label.overViewtitle",
	/**
	 * Command center view locators
	 */
	expandButtonCss: ".commandCenterElm #Button",
	compressButtonCss: "a .fa-compress",
	currentPageBreadcrumbName: "div.fvt-breadcrumb:last-child span",
	healthStatusSectionLabelCommandCenterCss: "div.status-bar-vis h1",
	applicationsResourcesLabelCommandCenterCss: "div.health-status-list-ctrl h2",
	commandCenterBarChartXaxisLabelsCss: ".highcharts-xaxis-labels tspan",
	commandCenterAppResTableSubHeaderAlertNamesXpath: "//div[@class='header-list-item']/span[contains(text(),'{0}')]",
	commandCenterAppResTableSubHeaderNamesCss : ".sublist-header-name>span",
	viewByDropdownCss : ".health-status-dropdown select",
	viewByDropdownValuesCss : ".health-status-dropdown select option",
	healthStatusProgressBarsCss : ".highchart-bar g.highcharts-tracker rect",
	healthStatusProgressBarsTooltipCss : ".highchart-bar g.highcharts-tooltip tspan",
	appResAlertCardsXpath : "//div[@class='sublist-header-name']/span[normalize-space(text())='{0}']//ancestor::div[contains(@class,'heatlh-status-item')]//div/span[contains(@class,'{1}')]",
	sectionShowMoreLinkXpath : "//div[@class='sublist-header-name']/span[normalize-space(text())='{0}']//ancestor::div[@class='heatlh-status-item']//div[@class='load-more-list']//a[text()='Show More']",
	appResCardNamesCss : ".content-item .content-item-value",
	commandCenterCss:"tspan",


	/**
	 * Global filters
	 */
	globalFilterProviderCss: "div.filter-section fieldset ibm-checkbox span.filterTextOverflow",
	globalFilterResetButtonCss: "app-global-filter div.pd-1 a",
	globalFilterApplyButtonCss: "button.applyButton",
	/**
	 * Resource Availablity
	 */
	kpiValuesTitleCss : "ibm-tile.kpi-title span",
	resourceAvailabilityDateTitleCss : "ibm-tile.date-title",
	resourceAvailabilityContainerCss : "div.status-container span.caption",
	resourceAvailabilityFooterCss: "div.indicaterstatus span.indicaterstatus-title",

	/**
	 * Resource performance graph
	 */

	performanceTabNameCss: "ul.performance-tab li a span",
	resourceCategoryCss:"//span[contains(text(),'Resource category')]",
	utilizationTabCss:"span#performance-util",
	processGroupsCss:"#performance-processGroups",
	computeTabNameCss:"ibm-tab-header#performancecompute-tab-header a.bx--tabs__nav-link",
	networkTabCss:"ibm-tab-header#performancenetwork-tab-header a.bx--tabs__nav-link",
	diskTabCss:"ibm-tab-header#performanceutilizationDiskpe-tab-header a.bx--tabs__nav-link",
	memoryTabCss:"ibm-tab-header#performanceutilizationmemory-tab-header a.bx--tabs__nav-link",
	heapSizeTabCss:"ibm-tab-header#performanceheapSize-tab-header a.bx--tabs__nav-link",
	garbageCollectionTabCss:"ibm-tab-header#performancegarbageCollection-tab-header a.bx--tabs__nav-link",
	appResBreakdownRectsCss:"rect#stackBar_rect_provider_Azure",
	resBreakdownRectsCss : "rect#stackBar_rect_environment_PRODUCTION",


	
	/**
	 * Promethus filter by date
	 */

	filterByDaysCss:"button.bx--list-box__field",
	numbeOfDaysXpath:"//*[@class='bx--list-box__menu-item__selected-icon']//parent::div"

};

function health(selectorConfig) {
	if (!(this instanceof health)) {
		return new health(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
health.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	util.switchToFrameById(frames.mcmpIframe);
	browser.sleep(5000);
	util.waitForAngular();
	util.switchToFrameById(frames.cssrIFrame);
	browser.sleep(5000);
};

/**
 * Method to get health header title text
 */
health.prototype.getHealthHeaderTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthHeaderTileTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthHeaderTileTextCss)).getText().then(function (text) {
		logger.info("Health page header title text : " + text);
		return text;
	});
};

/**
 * Method to click on view details in application/resource tab
 */
 health.prototype.clickOnViewDetails = async function () {
	var self = this;
	util.waitForAngular();
	await util.scrollToWebElement(element(by.css(self.viewDetailsCss)));
	return element.all(by.css(self.viewDetailsCss)).get(0).click().then(function() {
			logger.info("Clicked on View details");	
	});	

}
/**
 * Method to get alert header title text on health page
 */
health.prototype.getAlertHeaderTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthHeaderTileTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthHeaderTileTextCss)).getText().then(function (text) {
		logger.info("Alert header title text : " + text.trim());
		return text.trim();
	});
};

health.prototype.clickOnCriticalSliceFromDonutChart = function(){
	var self = this;
	util.waitForAngular();
	return browser.wait(EC.visibilityOf(element(by.xpath(this.criticalSliceFromDonutChartXpath))), timeout.timeoutInMilis).then(function(){
		element(by.xpath(self.criticalSliceFromDonutChartXpath)).click().then(function(){
			logger.info("Clicked on Critical slice from donut chart..");
		});
	});
}

health.prototype.clickOnWarningSliceFromDonutChart = function(){
	var self = this;
	util.waitForAngular();
	return browser.wait(EC.visibilityOf(element(by.xpath(this.warningSliceFromDonutChartXpath))), timeout.timeoutInMilis).then(function(){
		element(by.xpath(self.warningSliceFromDonutChartXpath)).click().then(function(){
			logger.info("Clicked on Warning slice from donut chart..");
		});
	});
}

/**
 * Method to select type of alerts in dropdown from Application Breakdown section
 * Ex. alertType - Critical, Warning
 */
health.prototype.selectAlertTypeFromDropdown = function (alertType) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.alertTypeDropdownValuesCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(this.alertTypeDropdownCss)).click().then(function () {
		logger.info("Clicked on Dropdown..");
		return element.all(by.css(self.alertTypeDropdownValuesCss)).getText().then(function (values) {
			for (var i = 0; i < values.length; i++) {
				logger.info("Comparing '"+ values[i] +"' with '"+ alertType +"'");
				if (values[i].includes(alertType)) {
					return element.all(by.css(self.alertTypeDropdownValuesCss)).get(i).click().then(function () {
						logger.info("Clicked on dropdown value: " + alertType);
						return;
					});
				}
			}
			if(i == values.length){
				logger.info("'"+alertType+ "' is not found");
				return 0;
			}
		});
	});
};

/**
 * Method to get Alerts [Critical/Warning/Healthy] count inside pie chart
 */
// health.prototype.getCountFromDonutChart = function () {
// 	util.waitForAngular();
// 	util.waitOnlyForInvisibilityOfKibanaDataLoader();
// 	browser.wait(EC.presenceOf(element(by.css(this.alertsCountFromDonutChartCss))), timeout.timeoutInMilis);
// 	return element(by.css(this.alertsCountFromDonutChartCss)).getText().then(function (alertsCount) {
// 		logger.info("App/Resources alerts count in Donut chart : " + alertsCount);
// 		return parseInt(alertsCount);
// 	});
// }

health.prototype.getSelectedTypeCountFromDonutChart = async function(){
	util.waitForAngular();
	var zeroCount = 0
	await browser.wait(EC.visibilityOf(element.all(by.css(this.donutChartLabelsCss)).get(0)), timeout.timeoutInMilis);
	var count = await element.all(by.css(this.donutChartLabelsCss)).count();
	for(var i=0; i<count; i++){
		var fontWeightVal = await element.all(by.css(this.donutChartLabelsCss)).get(i).getAttribute('style');
		logger.info("Comparing "+fontWeightVal+" with 'bold'");
		if(fontWeightVal.includes('bold')){
			var donutChartCount = await element.all(by.css(this.donutChartLabelsCss)).get(i).getText();
			logger.info("Donut chart count for selected alert type: "+ donutChartCount);
			var validRegexCount = /[^0-9]/g
			var count = donutChartCount.replace(validRegexCount,'')
			return parseInt(count);
		}
	}
	return 	zeroCount
}

/**
 * Validate if the title text for main section is present or not
 * @param {Title text for main sections; EX: Top insights, Applications, Resource List, etc.} TitleText 
 */
health.prototype.isTitleTextFromSectionPresent = function(TitleText){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.mainSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.mainSectionsXpath)).getText().then(function(titleTextList){
		for(var i=0; i<titleTextList.length; i++){
			logger.info("Comparing "+titleTextList[i]+" with "+TitleText);
			if(titleTextList[i].includes(TitleText)){
				logger.info(TitleText+" is present");
				return true;
			}
		}
		if(i == titleTextList.length){
			logger.info(TitleText+" is not present");
				return false;
		}
	})
}

/**
 * Method to get Top Insights label text 
 */
// health.prototype.getTopInsightsLabelText = function () {
// 	util.waitForAngular();
// 	browser.wait(EC.visibilityOf(element(by.css(this.topInsightsLabelCss))), timeout.timeoutInMilis);
// 	return element(by.css(this.topInsightsLabelCss)).getText().then(function (topInsightsLabel) {
// 		logger.info("Top Insights Label: " + topInsightsLabel);
// 		return topInsightsLabel.replace(/\s+/g, ' ').trim();
// 	});
// }

/**
 * Method to verify Top Insights sub-section label text is present or not
 */
health.prototype.verifyTopInsightsSubSectionLabelText = function (subLabelText) {
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element.all(by.css(this.topInsightsSubSectionLabelsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.topInsightsSubSectionLabelsCss)).getText().then(function (labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i] == subLabelText) {
				logger.info("Found and Sub Label Section Label text: "+subLabelText);
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Not found and Sub Label Section Label text: "+subLabelText);
			return false;
		}
	});
}

/**
 * Method to verify Top resource summary label text is present or not
 */
 health.prototype.verifyResourceSummarySectionLabelText = function (subLabelText) {
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element.all(by.css(this.resourceSummaryLabelCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.resourceSummaryLabelCss)).getText().then(function (labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i] == subLabelText) {
				logger.info("Found and Sub Label Section Label text: "+subLabelText);
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Not found and Sub Label Section Label text: "+subLabelText);
			return false;
		}
	});
}

/**
 * Method to get Health Status label text 
 */
health.prototype.getHealthStatusSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthStatusSectionLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthStatusSectionLabelCss)).getText().then(function (healthStatusLabel) {
		logger.info("Health Status Section Label: " + healthStatusLabel);
		return healthStatusLabel;
	});
}

/**
* Method to get Applications/Resources table label text 
 */
health.prototype.getAppsResTableSectionLabelText = function () {
	 util.waitForAngular();
 	browser.wait(EC.visibilityOf(element(by.css(this.applicationResourceTableHeaderCss))), timeout.timeoutInMilis);
 	return element(by.css(this.applicationResourceTableHeaderCss)).getText().then(function (applicationsLabel) {
		 var section_label = util.removeBlankSpaces(applicationsLabel).split("(")[0].trim()
		     section_label = section_label.replace(/:/g, "")
 	logger.info("Section Label: " +section_label);
 	return section_label
 	});
 } 

/**
 * Method to get Application/Resources Health Breakdown label text 
 */
health.prototype.getHealthBreakdownSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.appResourceHealthBreakdownSectionLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.appResourceHealthBreakdownSectionLabelCss)).getText().then(function (appResHealthBreakdownLabel) {
		logger.info("Health Breakdown Section Label: " + appResHealthBreakdownLabel);
		return appResHealthBreakdownLabel;
	});
}

/**
 * Click on app/resource breakdown widget filter
 */
 health.prototype.clickOnFirstAppResBreakdownFilter = function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResBreakdownRectsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.appResBreakdownRectsCss)).get(0).click().then(function(){
		logger.info("Clicked on first filter from app/resource breakdown widget..");
	})
}

/**
 * Click on app/resource breakdown widget filter
 */
 health.prototype.clickOnFirstResBreakdownFilter = function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.resBreakdownRectsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.resBreakdownRectsCss)).get(0).click().then(function(){
		logger.info("Clicked on first filter from app/resource breakdown widget..");
	})
}

/**
 * Method to get Applications label text 
 */
// health.prototype.getApplicationsSectionLabelText = function () {
// 	util.waitForAngular();
// 	browser.wait(EC.visibilityOf(element(by.css(this.applicationsSectionLabelCss))), timeout.timeoutInMilis);
// 	return element(by.css(this.applicationsSectionLabelCss)).getText().then(function (applicationsLabel) {
// 		logger.info("Applications Section Label: " + applicationsLabel.replace(/\s+/g, ' ').split("(")[0].trim());
// 		return applicationsLabel.replace(/\s+/g, ' ').split("(")[0].trim();
// 	});
// }

/**
 * Method to get Applications count from section label 
 */
health.prototype.getApplicationsCountFromLabel = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.applicationsSectionLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.applicationsSectionLabelCss)).getText().then(function (applicationsLabel) {
		var header = applicationsLabel.replace(/\s+/g, ' ').trim();
		var appCount = header.split("(")[1].split(")")[0];
		logger.info("Applications count from label: " + appCount);
		return parseInt(appCount);
	});
}

/**
 * Method to get Resources count from section label 
 */
health.prototype.getResourcesCountFromLabel = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.resourcesSectionLabelXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.resourcesSectionLabelXpath)).getText().then(function (resourcesLabel) {
		var header = resourcesLabel.replace(/\s+/g, ' ').trim();
		var resCount = header.split("(")[1].split(")")[0];
		logger.info("Resources count from label: " + resCount);
		return parseInt(resCount);
	});
}

/**
 * Method to get Resource List label text 
 */
// health.prototype.getResourceListSectionLabelText = function () {
// 	util.waitForAngular();
// 	browser.wait(EC.visibilityOf(element(by.css(this.resourceListSectionLabelCss))), timeout.timeoutInMilis);
// 	return element(by.css(this.resourceListSectionLabelCss)).getText().then(function (resourceListLabel) {
// 		logger.info("Resource List Section Label: " + resourceListLabel.replace(/\s+/g, ' ').split("(")[0].trim());
// 		return resourceListLabel.replace(/\s+/g, ' ').split("(")[0].trim();
// 	});
// }



/**
 * Get App name from app details page header
 */
health.prototype.getAppNameFromAppDetailsPageHeaderText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.associatedResourcesTableLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.appDetailsPageHeaderNameCss)).getText().then(function (appName) {
		logger.info("App name text from App details page header: " + appName);
		return appName.trim();
	});
}

/**
 * Click on navigation button links from top-left corner
 * Ex. btnName - Health, {Application Name}, {Resource Name}, etc
 */
health.prototype.clickOnNavigationButtonLinks = function(btnName){
	util.waitForAngular();
	var i;
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(this.navigationButtonLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.navigationButtonLinksCss)).getText().then(async function(linkTexts){
		for(i=0; i<linkTexts.length; i++){
			if(linkTexts[i] == btnName){
				return await element.all(by.css(self.navigationButtonLinksCss)).get(i).click().then(function(){
					logger.info("Clicked on button link: "+linkTexts[i]);
					return;
				})
			}
		}
	})
}
/**
 * Method to get Application/Resources Breakdown section label text 
 */
 health.prototype.getAppResBreakdownSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.appResourceHealthBreakdownSectionLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.appResourceHealthBreakdownSectionLabelCss)).getText().then(function (appBreakdownSectionLabel) {
		logger.info("Section Label: " + appResourceHealthBreakdownSectionLabelCss);
		return appBreakdownSectionLabel;
	});
};

/**
 * Get Associated applications table label from resource details page
 */
health.prototype.getAssociatedAppsTableLabelText =async function(index){
	util.waitForAngular();
	var applicationTableNameColumn = this.applicationTableNameColumnCss.format(index)
	browser.wait(EC.visibilityOf(element.all(by.css(applicationTableNameColumn)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(applicationTableNameColumn)).getText().then(function (labelText) {
		logger.info("Associated table label: " + labelText)
		return labelText
	});
}

/**
 * Get Apps count from Associated applications table label
 */
// health.prototype.getAppsCountFromAssociatedAppsTableLabel = function(){
// 	util.waitForAngular();
// 	browser.wait(EC.visibilityOf(element(by.css(this.associatedApplicationsTableLabelCss))), timeout.timeoutInMilis);
// 	return element(by.css(this.associatedApplicationsTableLabelCss)).getText().then(function (labelText) {
// 		var resCount = labelText.trim().split("(")[1].split(")")[0];
// 		logger.info("Application count from Associated Applications table label: " + resCount);
// 		return parseInt(resCount);
// 	});
// }

/**
 * Method to verify specific application in associated applications table
 * @param {Application name to be verify in associated applications table} appName 
 */
health.prototype.isAppPresentInAssociatedApplicationsTable = async function(appName){
	util.waitForAngular();
	var self = this;
	var loopCount = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.associatedApplicationsTableAppNameCss)).get(0)), timeout.timeoutInMilis);
	var loopCount = await this.getPageCountForAppsResourcesTable();
	var i = 0;
	for (i = 0; i < loopCount; i++) {
		var cellValueList = await element.all(by.css(this.associatedApplicationsTableAppNameCss)).getText();
		for(var j=0; j<cellValueList.length; j++){
			var cellValue = await element.all(by.css(this.associatedApplicationsTableAppNameCss)).get(j).getAttribute("data-tablecellvalue");
			logger.info("Cell value: "+cellValue);
			if(cellValue.trim() == appName){
				logger.info(appName+ " found in associated applications table.");
				return true;
			}
			else{
				// Check for last page in pagination
				if ((j == cellValueList.length - 1) && (i != loopCount - 1)) {
					await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
					await element(by.css(self.nextPageButtonCss)).click().then(function () {
						logger.info("Clicked on Next button..");
					});
				}
			}
		}	
	}
	if(i == loopCount){
		logger.info(appName+" not found in associated applications table.");
		return false;
	}
}

/**
 * Get Associated resources table label from app details page
 */
health.prototype.getAssociatedResourcesTableLabelText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(this.associatedResourcesTableLabelCss)).getText().then(function (labelText) {
		logger.info("Associated Resources table label from App details page: " + labelText.split("(")[0].trim());
		return labelText.split("(")[0].trim();
	});
}

/**
 * Get Resource count from Associated resources table label
 */
health.prototype.getResourceCountFromAssociatedResourcesTableLabel = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(this.associatedResourcesTableLabelCss)).getText().then(function (labelText) {
		var resCount = labelText.trim().split("(")[1].split(")")[0];
		logger.info("Resource count from Associated Resources table label: " + resCount);
		return parseInt(resCount);
	});
}
/**
 * Method to click on first page from pagination section for associated resources table
 */
health.prototype.clickOnFirstPageForAssociatedResourcesTable = async function(){
	util.waitForAngular();
	var loopCount = await this.getPageCountForAppsResourcesTable();
	if(loopCount == 1){
		logger.info("Only one page is present, no need to click on first page.");
	}
	else{
		browser.wait(EC.visibilityOf(element(by.xpath(this.associatedResourcesTableFirstPageXpath))), timeout.timeoutInMilis);
		element(by.xpath(this.associatedResourcesTableFirstPageXpath)).click().then(function(){
			logger.info("Clicked on first page of associated resources table.");
		});
	}
}

/**
 * Get page count for the tables [Associated Applications/Resources, Applications table]
 */
health.prototype.getPageCountForAppsResourcesTable = function(){
	var self = this;
	var loopCount = 0;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.paginationDetailsTextCss))), timeout.timeoutInMilis);
	return element(by.css(self.paginationDetailsTextCss)).getText().then(function(paginationInfo){
		var sepInfo = paginationInfo.trim().split(" ");
		var pageSize = 10;
		var totalEntries = parseInt(sepInfo[2]);
		logger.info("Page Size: "+pageSize+", Total Entries: "+totalEntries);
		if(totalEntries % pageSize == 0){
			loopCount = (totalEntries / pageSize);
		}
		else{
			loopCount = Math.ceil(totalEntries / pageSize);
		}
		logger.info("Total number of pages to travese: "+loopCount);
		return loopCount;
	});
}
/**
 * Get Associated resources column presence
 */
health.prototype.getAssociatedColumnPresence = async function() {
	util.waitForAngular();
	var ascColumns=[];
	var tableColumns=await healthAndInventoryUtil.retrieveTableColumns();
	var tColumns=tableColumns.split("\n");
	for(var i=0;i<tColumns.length;i++)
    {
        tColumns[i] = tColumns[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
    var associatedColumns=dashboardTestData.associatedTableColumns;
    logger.info("Associated table columns",tColumns);
    logger.info("associatedColumns from test data:",associatedColumns);
    if(JSON.stringify(associatedColumns)==JSON.stringify(tColumns))
    {
        return true;
    }
    else
    {
      return false;
    }
}
/**
 * Get Row count from Associated resources/applications table
 */
health.prototype.getRowCountFromAssociatedResourcesAppsTable = async function(){
	var rowCount = 0;
	var self = this;
	util.waitForAngular();
	return element.all(by.css(this.noDataTextCss)).count().then(async function(count){
		if(count != 0){
			return element(by.css(self.noDataTextCss)).getText().then(function(noDataText){
				logger.info("No data is available in associated resources/applications table, Text is : "+noDataText);
				return 0;
			});
		}
		else{
			var loopCount = await self.getPageCountForAppsResourcesTable();
			for (var i = 0; i < loopCount; i++) {
				await browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
				browser.sleep(2000);
				rowCount = rowCount + await element.all(by.css(self.associatedResourcesTableRowsCss)).count();
				if (i != loopCount - 1) {
					await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
					await element(by.css(self.nextPageButtonCss)).click().then(function(){
						logger.info("Clicked on Next button..");
					});
					await browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
				}
				else {
					logger.info("Reached on last page..");
					logger.info("Total row count from Associated resources/applications table: " + rowCount);
					return rowCount;
				}
			}
		}
	});
}

/**
 * Get Resource name from resource details page
 * Ex. labelName - HostName from overview panel
 */
health.prototype.getResourceNameFromResourceDetailsPageText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.resourceDetailsOverviewLabelValuesCss))), timeout.timeoutInMilis);
	return element(by.css(this.resourceDetailsOverviewLabelValuesCss)).getText().then(function (resName) {
		logger.info("Resource name text from Resource details page: " + resName.trim().toLowerCase());
		return resName.trim().toLowerCase();
	});
}

/** 
  * Get Resource name from resource details page
  * Ex. labelName - HostName from overview panel
  */
 health.prototype.getOverviewLabelFromResourceDetailsPage = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.overviewLabelCss))), timeout.timeoutInMilis);
	return element(by.css(this.overviewLabelCss)).getText().then(function (resName) {
		logger.info("Resource name text from Resource details page: " + resName.trim().toLowerCase());
		return resName.trim().toLowerCase();
	});
}

/**
 * Method to click on Application view details button
 * Ex. appName - Application name get from dashboard alert card
 */
health.prototype.clickOnApplicationViewDetailsButton = async function(appName){
	var loopCount = 0;
	var isPresent = false;
	var donutChartCount = await this.getSelectedTypeCountFromDonutChart();
	if(donutChartCount > 0){
		util.waitForAngular();
		var self = this;
		var loopCount = await this.getPageCountForAppsResourcesTable();
		for(var i=0; i<loopCount; i++){
			await browser.wait(EC.visibilityOf(element.all(by.css(self.applicationTableNameColumnCss)).get(0)), timeout.timeoutInMilis);
			var appNames = await element.all(by.css(self.applicationTableNameColumnCss)).getAttribute("title");
			for(var j=0; j<appNames.length; j++){
				if(appNames[j].includes(appName)){
					await browser.wait(EC.visibilityOf(element.all(by.css(self.applicationTableOptionButtonCss)).get(j)), timeout.timeoutInMilis);
					await util.scrollToWebElement(element.all(by.css(self.applicationTableOptionButtonCss)).get(j));
					await element.all(by.css(self.applicationTableOptionButtonCss)).get(j).click();
					await browser.wait(EC.visibilityOf(element(by.css(self.applicationViewDetailsButtonCss))), timeout.timeoutInMilis);
					await element(by.css(self.applicationViewDetailsButtonCss)).click().then(function(){
						logger.info("Clicked on View details button for "+appNames[j]);
						isPresent = true;
					})
					return isPresent;
				}
			}
			if(isPresent == false){
				if(i != loopCount-1){
					await element(by.css(self.nextPageButtonCss)).click().then(function(){
						logger.info("Clicked on Next button..");
					})
				}
				else{
					logger.info(appName+" is not present in table..");
					return isPresent;
				}
			}
		}
	}
	else{
		logger.info("There are no applications available..");
		return isPresent;
	}
}

/**
 * Method to click on First affected Resource view details button and returns Resource name
 * Ex. alertType - Critical, Warning
 */
health.prototype.clickOnFirstAffectedResourceViewDetailsButton = async function (alertType) {
	util.waitForAngular();
	var self = this;
	var loopCount = 0;
	var resHealthValueXpath = this.resourceHealthValueXpath.format(alertType);
	var loopCount = await this.getPageCountForAppsResourcesTable();
	for (var i = 0; i < loopCount; i++) {
		util.waitForAngular();
		await browser.wait(EC.visibilityOf(element.all(by.css(this.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
		var count = await element.all(by.xpath(resHealthValueXpath)).count();
		logger.info("Count for affected resource: "+count);
		if (count > 0) {
			var optionBtnXpath = this.associatedResourcesLinkButtonXpath.format(alertType);
			var nameColValue = this.associatedResourcesNameColumnValueXpath.format(alertType);
			var resourceName = await element.all(by.xpath(nameColValue)).get(0).getText();
			logger.info("Resource Name: "+resourceName.toLowerCase());
			return await element.all(by.xpath(optionBtnXpath)).get(0).click().then(async function () {
				logger.info("Clicked on button for first " + alertType + " resource and resource name is "+resourceName.toLowerCase());
				return resourceName.toLowerCase();
			})
		}
		else {
			// Check for last page in pagination
			if (i != loopCount - 1) {
				await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
				await element(by.css(self.nextPageButtonCss)).click().then(function () {
					logger.info("Clicked on Next button..");
				})
			}
			else {
				logger.info("No resources found for "+alertType+" health..");
				return false;
			}
		}
	}
}

/**
 * Method to verify Tickets/Performance/Tags Links are displayed or not
 * Ex. sectionLabelText - Tickets, Performance, Tags, etc.
 */
health.prototype.isDisplayedResourceDetailsTableSectionLinks = function(sectionLabelText){
	util.waitForAngular();
	var i = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.tableSectionsLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.tableSectionsLinksCss)).getText().then(function(labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(sectionLabelText)) {
				logger.info("Resource details table Section Label " + labels[i] + " is displayed.");
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Resource details table Label " + sectionLabelText + " not found.");
			return false;
		}
	});
}

health.prototype.clickOnResourceDetailsTableSectionLink = function(sectionName){
	util.waitForAngular();
	var self = this;
	var i = 0;
	browser.wait(EC.visibilityOf(element.all(by.css(this.tableSectionsLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.tableSectionsLinksCss)).getText().then(async function(labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(sectionName)) {
				await element.all(by.css(self.tableSectionsLinksCss)).get(i).click();
				logger.info("Resource details table Label " + labels[i] + " is clicked.");
				return;
			}
		}
		if (i == labels.length) {
			logger.info("Resource details table Label " + sectionName + " not found.");
		}
	});
}

/**
 * Method to verify Summary/Open Tickets Links are displayed or not
 * Ex. sectionLabelText - Summary, Open Tickets
 */
health.prototype.isDisplayedSummaryAndOpenTicketsSectionLinks = function(sectionLabelText){
	util.waitForAngular();
	var i;
	browser.wait(EC.visibilityOf(element(by.css(this.summaryWidgetHeaderCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.summaryOpenTicketsSectionLinksCss)).getText().then(function(labels) {
		for (i = 0; i < labels.length; i++) {
			if (labels[i].includes(sectionLabelText)) {
				logger.info("Section Label " + labels[i] + " is displayed.");
				return true;
			}
		}
		if (i == labels.length) {
			logger.info("Section Label " + sectionLabelText + " not found.");
			return false;
		}
	});
}

/**
 * Method to get affected server count from Application resources table
 * Ex. alertType - Critical, Warning
 */
health.prototype.getAffectedServerCountFromAssociatedResourcesTable = async function(alertType){
	util.waitForAngular();
	var self = this;
	var serverCount = 0;
	var loopCount = 0;
	var resHealthValueXpath = this.resourceHealthValueXpath.format(alertType);
	var loopCount = await this.getPageCountForAppsResourcesTable();
	for(var i=0; i<loopCount; i++){
		await browser.wait(EC.visibilityOf(element(by.css(self.paginationDetailsTextCss))), timeout.timeoutInMilis);
		serverCount = serverCount + await element.all(by.xpath(resHealthValueXpath)).count();
		if(i != loopCount-1){
			await browser.wait(EC.visibilityOf(element(by.css(self.nextPageButtonCss))), timeout.timeoutInMilis);
			await element(by.css(self.nextPageButtonCss)).click().then(function(){
				logger.info("Clicked on Next button..");
			});
			await browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
		}
		else{
			logger.info("Reached on last page..");
			logger.info("Total affected server count: "+serverCount);
			return serverCount;
		}
	}
}

/**
 * Get page count for the tables [Alerts Events/Tickets table]
 */
health.prototype.getPageCountForEventsTicketsTable = function(){
	var self = this;
	var loopCount = 0;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.alertsTablePaginationDetailsTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.alertsTablePageSizeCss)).getText().then(function(itemsPerPage){
		return element(by.css(self.alertsTablePaginationDetailsTextCss)).getText().then(function(paginationInfo){
			var sepInfo = paginationInfo.trim().split(" ");
			var pageSize = parseInt(itemsPerPage);
			var totalEntries = parseInt(sepInfo[4]);
			logger.info("Page Size: "+pageSize+", Total Entries: "+totalEntries);
			if(totalEntries % pageSize == 0){
				loopCount = (totalEntries / pageSize);
			}
			else{
				loopCount = Math.ceil(totalEntries / pageSize);
			}
			logger.info("Total number of pages to travese: "+loopCount);
			return loopCount;
		});
	});
}

/**
 * Method to verify Cell value from Resource details Table[Tickets]
 * Ex. columnName - Event health
 * Ex. cellValue - Critical, Warning, etc
 */
health.prototype.verifyCellValueFromTicketsTable = function(columnName, cellValue){
	util.waitForAngular();
	var self = this;
	var columnIndex, cellValueXpath;
	return element.all(by.css(this.alertsTableNoDataTextCss)).count().then(async function(count){
		if(count > 0){
			return element(by.css(self.alertsTableNoDataTextCss)).getText().then(function(noDataText){
				logger.info("No data is available in alerts table, Text is : "+noDataText);
				return false;
			});
		}
		var loopCount = await self.getPageCountForAppsResourcesTable();
		var totalRowCount = 0;
		for(var k=0; k<loopCount; k++){
			browser.wait(EC.visibilityOf(element.all(by.css(self.associatedResourcesTableRowsCss)).get(0)), timeout.timeoutInMilis);
			var rowCount = await element.all(by.css(self.associatedResourcesTableRowsCss)).count();
			totalRowCount = totalRowCount + rowCount;
			for(var i=1; i<=rowCount; i++){
				var columnNames = await element.all(by.css(self.alertsTableColumnNamesCss)).getText();
				for(var j=0; j<columnNames.length; j++){
					if(columnNames[j].includes(columnName)){
						columnIndex = j+1;
						cellValueXpath = self.alertsTableColumnDataXpath.format(i,columnIndex);
						var columnValue = await element(by.xpath(cellValueXpath)).getText();
						if(columnValue.includes(cellValue)){
							logger.info("Row number: "+i+", Cell value: "+columnValue);
							return true;
						}
					}
				}
			}
			// Check for last page in pagination
			if(k != loopCount-1){
				await element(by.css(self.nextPageButtonCss)).click().then(function(){
					logger.info("Clicked on Next button..");
				})
			}
			else{
				logger.info("On Last page, no need to click on Next button..");
				if(totalRowCount == 50){
					logger.info("There can be maximum 50 entries. Not found "+cellValue);
					return true;
				}
				else{
					return false;
				}
			}
		}
	});
}

/**
 * Method to click on Command center 
 */
 health.prototype.clickonCommandCenter =async function () {
    var self = this;
    util.waitForAngular();
    browser.wait(EC.visibilityOf(element.all(by.css(self.commandCenterCss)).get(0)), timeout.timeoutInMilis);
    await element.all(by.css(self.commandCenterCss)).get(0).click().then(async function () {
        logger.info('Command center is clicked')
    })
}

/**
 * Method to click on expand button to go Command center view
 */
health.prototype.clickOnCommandCenterExpandButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.expandButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.expandButtonCss)).click().then(function(){
		logger.info("Clicked on command center view expand button");
	});
}

/**
 * Method to click on compress button to go Command center view
 */
health.prototype.clickOnCommandCenterCompressButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.compressButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.compressButtonCss)).click().then(function(){
		logger.info("Clicked on command center view compress button");
	});
}

/**
 * Method to get Breadcrumb text for current page name
 */
health.prototype.getCurrentPageBreadcrumbNameText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.currentPageBreadcrumbName))), timeout.timeoutInMilis);
	return element(by.css(this.currentPageBreadcrumbName)).getText(function(label){
		logger.info("Current page breadcrumb name text is : "+label.trim());
		return label.trim();
	});
}

/**
 * Method to get Health Status label text from Command center view
 */
health.prototype.getCommandCenterHealthStatusSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.healthStatusSectionLabelCommandCenterCss))), timeout.timeoutInMilis);
	return element(by.css(this.healthStatusSectionLabelCommandCenterCss)).getText().then(function (healthStatusLabel) {
		logger.info("Health Status Section Label text from Command Center view: " + healthStatusLabel);
		return healthStatusLabel;
	});
}

/**
 * Method to get Applications/Resources label text from Command center view
 */
health.prototype.getCommandCenterAppsResSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.applicationsResourcesLabelCommandCenterCss))), timeout.timeoutInMilis);
	return element(by.css(this.applicationsResourcesLabelCommandCenterCss)).getText().then(function (label) {
		var appsResLabel = label.split("(")[0].trim();
		logger.info("Command Center Applications/Resources Section Label Text: " + appsResLabel);
		return appsResLabel;
	});
}

/**
 * Method to get Applications/Resources count from label text in Command center view
 */
health.prototype.getCountFromCommandCenterAppsResSectionLabelText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.applicationsResourcesLabelCommandCenterCss))), timeout.timeoutInMilis);
	return element(by.css(this.applicationsResourcesLabelCommandCenterCss)).getText().then(function (label) {
		var appsResCount = label.split("(")[1].split(")")[0].trim();
		logger.info("Command Center Applications/Resources count from Label Text: " + util.stringToInteger(appsResCount));
		return util.stringToInteger(appsResCount);
	});
}

/**
 * Method to get count from command center view progress bar x-axis labels
 * alertType --> Critical, Warning, Healthy, etc.
 */
health.prototype.getCountFromCommandCenterBarChartXaxisLabels = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).count().then(async function(labelCount){
		for(var i=0; i<labelCount; i++){
			var label = await element.all(by.css(self.commandCenterBarChartXaxisLabelsCss)).get(i).getText();
			if(label.includes(alertType)){
				var appResCount = label.split("(")[1].split(")")[0].trim();
				logger.info("Count for alert type "+alertType+" from X-axis labels is: "+appResCount);
				return util.stringToInteger(appResCount);
			}
		}
	});
}

/**
 * Method to get applications/resources count from Breakdown section using filter
 * filtername --> IBM DC, Aws, Prod, Dev, etc.
 */
health.prototype.getAppResCountFromBreakdownSection = function(filterName){
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).count().then(async function(sectionsList){
		var i = 0;
		filterName = await util.removeInvertedCommasFromString(filterName);
		for(i=0; i<sectionsList; i++){
			await browser.actions().mouseMove(element.all(by.xpath(self.appResHealthBreakdownSectionsXpath)).get(i)).perform();
			var infoList = await element.all(by.xpath(self.appResHealthBreakdownSectionTooltipXpath)).getText();
			if(infoList[0].trim() == filterName){
				logger.info("App/Res count for "+infoList[0]+" is: "+infoList[2]);
				return util.stringToInteger(infoList[2]);
			}
		}
		if(i == sectionsList){
			logger.info("Section with filter name "+filterName+" not found");
			return 0;
		}
	})
}

/**
 * Method to get the DC and Cloud provider lists from filters panel
 */
health.prototype.getDCAndCloudProvidersListFromFilters = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.providersListCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.providersListCss)).getText().then(function(providersList){
		var filteredList = providersList.filter(function(ele){
			return (ele != "DataCenter" & ele != "Cloud");
		});
		logger.info("Providers list: "+ filteredList);
		return filteredList;
	})
}

/**
 * Method to get list for all Apps/Resources count with respect to Breakdown Filters
 */
health.prototype.getListOfBreakdownSectionWithCount = function(){
	util.waitForAngular();
	var self = this;
	var listOfSection = [];
	browser.wait(EC.visibilityOf(element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(this.appResHealthBreakdownSectionsXpath)).count().then(async function(sectionsList){
		for(var i=0; i<sectionsList; i++){
			var item = "";
			await browser.actions().mouseMove(element.all(by.xpath(self.appResHealthBreakdownSectionsXpath)).get(i)).perform();
			var infoList = await element.all(by.xpath(self.appResHealthBreakdownSectionTooltipXpath)).getText();
			item = infoList[0].trim() + " ("+ util.addCommasInNumber(infoList[2]) + ")";
			logger.info(item);
			listOfSection.push(item);
		}
		var filteredList = [...new Set(listOfSection)];
		logger.info("List of Sections: ", filteredList);
		return filteredList;
	});
}

/**
 * Method to click on VIEW BY dropdown in command center view
 */
health.prototype.clickOnViewByDropdown = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.viewByDropdownCss))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(this.viewByDropdownCss)));
	element(by.css(this.viewByDropdownCss)).click().then(function(){
		logger.info("Clicked on View By dropdown.");
	});
}

/**
 * Method to select dropdown value from VIEW BY droopdown in command center view
 * optVal --> Provider, Environment, Business Unit, etc.
 */
health.prototype.selectOptionFromViewByDropdown = function(optVal){
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(this.viewByDropdownValuesCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(this.viewByDropdownValuesCss)).getText().then(async function(values){
		for(var i=0; i<values.length; i++){
			if(optVal == values[i].trim()){
				await element.all(by.css(self.viewByDropdownValuesCss)).get(i).click().then(function(){
					logger.info("Select "+values[i].trim()+" from View By dropdown.");
				});
			}
		}
	});
}

/**
 * Method to get list of options from VIEW BY dropdown in command center view
 */
health.prototype.getListOfOptionsFromViewByDropdown = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.viewByDropdownValuesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.viewByDropdownValuesCss)).getText().then(function(optionList){
		logger.info("List of options from View By dropdown is: "+ optionList);
		return optionList;
	});
}

/**
 * Method to get Section wise applications/resources count from applications/resources table sub-headers [Section Name adn Alert Type] from command center view
 * sectionName --> Prod, Dev, Aws, IBM DC, etc.
 * alertType --> Critical, Warning, Healthy
 * Returns list of count from both subheaders [Section Name and Alert Type] in apps/resources table
 */
health.prototype.getAppResCountFromCommandCenterTableSubHeaderLabel = async function(sectionName, alertType){
	util.waitForAngular();
	var self = this;
	var alertLabelXpath = self.commandCenterAppResTableSubHeaderAlertNamesXpath.format(alertType);
	var options = [healthTestData.environmentDropdownValue, healthTestData.providerDropdownValue, healthTestData.businessUnitDropdownValue];
	var j=0;
	for(j=0; j<options.length; j++){
		this.clickOnViewByDropdown();
		this.selectOptionFromViewByDropdown(options[j]);
		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		browser.wait(EC.visibilityOf(element.all(by.css(this.commandCenterAppResTableSubHeaderNamesCss)).get(0)), timeout.timeoutInMilis);
		var labelCount = await element.all(by.css(this.commandCenterAppResTableSubHeaderNamesCss)).count();
		var i=0;
		for(i=0; i<labelCount; i++){
			var label = await element.all(by.css(self.commandCenterAppResTableSubHeaderNamesCss)).get(i).getText();
			var alertLabel = await element.all(by.xpath(alertLabelXpath)).get(i).getText();
			logger.info("Comparing "+label+" with "+sectionName);
			if(label.trim() == sectionName){
				var appResCountFromLabel = label.split("(")[1].split(")")[0].trim();
				var appResCountFromAlertLabel = alertLabel.split("(")[1].split(")")[0].trim();
				logger.info("Count for section name "+sectionName+" from table sub-header label is: "+appResCountFromLabel);
				logger.info("Count for section name "+sectionName+" from table sub-header alert label is: "+appResCountFromAlertLabel);
				return [util.stringToInteger(appResCountFromLabel), util.stringToInteger(appResCountFromAlertLabel)];
			}
		}
		if(i == labelCount){
			logger.info("Section name "+sectionName+" not found in "+options[j]+" category");
		}
	}
	if(j == options.length){
		logger.info("Section name "+sectionName+" not found in all categories. Count : 0");
		return [0, 0];
	}
}

/**
 * Method to get count from Tooltip on hovering specific Progress bar
 * alertType --> Critical, Warning, Healthy
 * Return array of strings has Alert type on index '1' and Count of apps/resources on index '3'
 */
health.prototype.getTooltipCountForProgressBarFromCommandCenterView = function(alertType){
	util.waitForAngular();
	var self = this;
	var tooltipInfoList = [];
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.healthStatusProgressBarsCss)).count().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList; i++){
			await browser.actions().mouseMove(element.all(by.css(self.healthStatusProgressBarsCss)).get(i)).perform();
			tooltipInfoList = await element.all(by.css(self.healthStatusProgressBarsTooltipCss)).getText();
			if(tooltipInfoList[1].includes(alertType)){
				logger.info("Count from progress bar tooltip for "+alertType+": "+tooltipInfoList[3]);
				return util.stringToInteger(tooltipInfoList[3]);
			}
		}
		if(i == alertsList){
			logger.info(alertType+" not found in progress bar.");
			return 0;
		}
	});	
}

health.prototype.selectSpecificProgressBar = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				var opacity = await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).getCssValue("opacity");
				if(opacity == "1"){
					logger.info(alertType+" is already selected in progress bar.");
					return;
				}
				else{
					logger.info(alertType+" is not selected in progress bar.");
					await self.clickOnAlertProgressBar(alertType);
					return;
				}
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

health.prototype.deselectSpecificProgressBar = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				var opacity = await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).getCssValue("opacity");
				if(opacity == "1"){
					logger.info(alertType+" is selected in progress bar.");
					await self.clickOnAlertProgressBar(alertType);
					return;
				}
				else{
					logger.info(alertType+" is not already selected in progress bar.");
					return;
				}
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

/**
 * Method to verify if progress bar for specific alert is selected or not
 * alertType --> Critical, Warning, Healthy
 */
health.prototype.checkSelectionOfAlertsProgressBar = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				var opacity = await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).getCssValue("opacity");
				if(opacity == "1"){
					logger.info(alertType+" is selected in progress bar.");
					return true;
				}
				else{
					logger.info(alertType+" is not selected in progress bar.");
					return false;
				}
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

/**
 * Method to click on progress bar for specific alert
 * alertType --> Critical, Warning, Healthy
 */
health.prototype.clickOnAlertProgressBar = function(alertType){
	util.waitForAngular();
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(this.healthStatusProgressBarsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.commandCenterBarChartXaxisLabelsCss)).getText().then(async function(alertsList){
		var i=0;
		for(i=0; i<alertsList.length; i++){
			if(alertsList[i].includes(alertType)){
				await element.all(by.css(self.healthStatusProgressBarsCss)).get(i).click();
				logger.info("Clicked on progress bar with alert type : "+alertType);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				return true;
			}
		}
		if(i == alertsList.length){
			logger.info(alertType+" not found in progress bar.");
			return false;
		}
	});
}

/**
 * Method to get applications/resources cards count from specific table section from command center view
 * sectionName --> Prod, Dev, Aws, IBM DC, etc.
 * alertType --> Critical, Warning, Healthy
 */
health.prototype.getAppResCardsCountFromTableSection = function(sectionName, alertType){
	util.waitForAngular();
	var totalCount = 0;
	var alertCardsXpath = this.appResAlertCardsXpath.format(sectionName,alertType);
	var showMoreLinkForSection = this.sectionShowMoreLinkXpath.format(sectionName);
	return element.all(by.xpath(alertCardsXpath)).count().then(function(labelCount){
		if(labelCount != 0){
			return element.all(by.xpath(showMoreLinkForSection)).count().then(async function(linkCount){
				if(linkCount != 0){
					// To get all cards click on Show More link, if displayed
					var bool = await element(by.xpath(showMoreLinkForSection)).isDisplayed();
					logger.info("Is Show more link displayed: "+bool);
					while(bool)
					{
						await browser.actions().mouseMove(element(by.xpath(showMoreLinkForSection))).perform();
						await element(by.xpath(showMoreLinkForSection)).click();
						await util.waitOnlyForInvisibilityOfKibanaDataLoader();
						linkCount = await element.all(by.xpath(showMoreLinkForSection)).count();
						if(linkCount == 0){
							bool = false;
							logger.info("Is Show more link displayed: "+bool);
						}
						else{
							logger.info("Is Show more link displayed: "+bool+", Clicking on next one..");
						}
					}
				}
				totalCount = await element.all(by.xpath(alertCardsXpath)).count();
				logger.info("Total cards count for "+alertType+" is: "+totalCount);
				return totalCount;
			});
		}
		else{
			logger.info("Section name "+sectionName+" not found. Count : 0");
			return 0;
		}
	});
}

/**
 * Method to verify app or resource card is present in command center view table
 * @param {Application or resource card name to be verified} appResName 
 */
health.prototype.isDisplayedAppResourceCard = function(appResName){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.appResCardNamesCss)).getText().then(function(cardsList){
		var i=0;
		for(i=0; i<cardsList.length; i++){
			if(cardsList[i] == appResName){
				logger.info(appResName+" card found in table.");
				return true;
			}
		}
		if(i == cardsList.length){
			logger.info(appResName+" card not forund in table.");
			return false;
		}
	});
}

/**
 * Method to click on specific app or resource card on command center view table
 * @param {Application or resource card name to be click on} appResName 
 */
health.prototype.clickOnAppResourceCard = function(appResName){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.appResCardNamesCss)).getText().then(async function(cardsList){
		var i=0;
		for(i=0; i<cardsList.length; i++){
			if(cardsList[i] == appResName){
				await element.all(by.css(self.appResCardNamesCss)).get(i).click();
				logger.info("Clicked on "+appResName+" card.");
				return true;
			}
		}
		if(i == cardsList.length){
			logger.info(appResName+" card not forund in table.");
			return false;
		}
	});
}

/**
 * Method to click first app or resource card from command center view table
 */
health.prototype.clickOnFirstAppResourceCard = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.appResCardNamesCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(this.appResCardNamesCss)).get(0).click().then(function(){
		logger.info("Clicked on first application/resources card.");
	});
}

/**
 * Method to search resources according to their health status
 * @param {Type of alert - Critical, Warning, Healthy} alertType 
 */
health.prototype.searchResourcesFromAssociatedResourcesTable = function(alertType){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.searchIconButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.searchIconButtonCss)).click().then(function(){
		logger.info("Clicked on search icon button.");
		browser.wait(EC.visibilityOf(element(by.css(self.searchInputCss))), timeout.timeoutInMilis);
		element(by.css(self.searchInputCss)).click().then(function(){
			logger.info("Focused on search textbox.");
			element(by.css(self.searchInputCss)).sendKeys(alertType + protractor.Key.ENTER).then(function(){
				logger.info("Searching resources using keyword " + alertType + "..");
			})
		})
	});
}

/**
 * Method to check if No Data is available in table
 */
health.prototype.isNoDataMessageTextPresentInTable = function(){
	var self = this;
	util.waitForAngular();
	return element.all(by.css(this.noDataTextCss)).count().then(function(count){
		if(count != 0){
			return element(by.css(self.noDataTextCss)).isDisplayed().then(function(isVisible){
				logger.info("Is No Data available in table: "+ isVisible);
				return isVisible;
			});
		}
		else{
			logger.info("Is No Data available in table: "+ false);
			return false;
		}
	});
}

/**
 * Method to reset global filters
 */
health.prototype.resetGlobalFilters = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.globalFilterResetButtonCss))), timeout.timeoutInMilis);
	return element(by.css(this.globalFilterResetButtonCss)).click().then(function () {
		logger.info("Clicked on reset button");
		browser.sleep(3000);
		return true;
	});
}

/**
 * Method to get list section count from section label
 */
health.prototype.getListSectionCountFromLabel = function (label) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.tabSectionLabelCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.tabSectionLabelCss)).getText().then(function (labels) {
		logger.info(labels);
		let result = false;
		labels.forEach(key => {
			key = key.trim();
			if (key !== '' && key.indexOf(label + '(') > -1) {
				var sectionLabel = key;
				logger.info(label + " Section Label: " + sectionLabel.replace(/\s+/g, ' ').split("(")[0].trim());
				var header = sectionLabel.replace(/\s+/g, ' ').trim();
				var resCount = header.split("(")[1].split(")")[0];
				logger.info(label + " count from label: " + resCount);
				if (resCount >= 0) {
					result = true;
				}
			}
		});
		if (result === true) {
			logger.info(label + " list table contains lable and count");
			return true;
		} else {
			logger.info(label + " list table does't contains lable and count");
			return false;
		}
	});
}


/**
 * Method to click on application/resource list view
 */
health.prototype.isTableOverflowMenuDisplayed = async function () {
	var self = this;

	util.waitForAngular();
	logger.info("Checking for table overflow menu");

	var elementList = element.all(by.css(self.tableOverflowMenuCss));
	browser.wait(EC.visibilityOf(elementList.get(0)), timeout.timeoutInMilis);
	await util.scrollToWebElement(elementList.get(0));
	await browser.actions().mouseMove(elementList.get(0)).click().perform()
	logger.info("Found overflow menu in List View");
	logger.info("Clicked on overflow menu in List View");
	browser.wait(EC.visibilityOf(element(by.css(self.viewDetailsCss))), timeout.timeoutInMilis);
	return element.all(by.css(self.viewDetailsCss)).getText().then(function (label) {
		logger.info(label);
		if (label && label.length > 0) {
			logger.info("List view - 'View details' found");
			element.all(by.css(self.viewDetailsCss)).get(0).click().then(function () {
				logger.info("Clicked on View details");
			});
			return true;
		} else {
			logger.info("List view - 'View details' not found");
			return false;
		}
	});
}


/**
 * Method to click global filter
 */

health.prototype.applyGlobalFilter =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.applyFilterButtonCss))),timeout.timeoutInMilis);
	return await element(by.css(self.applyFilterButtonCss)).click().then(function(){
		 logger.info('Apply filter button is clicked');
		 browser.sleep(5000);
		 return true
	 })
}

/**
 * Method to select checkbox
 */

health.prototype.clickOnCheckBox =async function(checkBoxText){
	var self = this;
	util.waitForAngular();
	var checkboxGlobalFilter = self.checkboxGlobalFilterXpath.format(checkBoxText);
	 browser.wait(EC.elementToBeClickable(element(by.xpath(checkboxGlobalFilter))), timeout.timeoutInMilis)
	 return await element(by.xpath(checkboxGlobalFilter)).click().then(function(){
		logger.info(`${checkBoxText} checkbox is clicked`);
		return true
	 })
}

/**
 * Method to click on more button  on application checkbox
 */

health.prototype.clickOnApplicationMoreBtn =async function(moreBtn){
	var self = this;
	util.waitForAngular();
	 var clickMoreButton = self.clickMoreButtonXpath.format(moreBtn);
	 browser.wait(EC.elementToBeClickable(element.all(by.xpath(clickMoreButton)).get(0)), timeout.timeoutInMilis)
	     await element.all(by.xpath(clickMoreButton)).get(1).click().then(async function(){
		 logger.info('clicked on more button - Application')
	 })
}





/**
 * Method to get specific application on resource tab
 */


health.prototype.getResourceTabApplication =async function(application){
	var self = this;
	util.waitForAngular();
	
	browser.wait(EC.visibilityOf(element.all(by.xpath(self.listViewStoreXpath)).get(0)), timeout.timeoutInMilis);
	 return await element.all(by.xpath(self.listViewStoreXpath)).get(0).getText().then(function(applicationText){
		logger.info('List values are ' + applicationText);
		return applicationText.split(',').includes(application);
	 })
}


/**
 * Method to get specific resource name from business unit
 */

health.prototype.getResourceTabBusinessUnit =async function(businessUnit){
	var EC = protractor.ExpectedConditions;
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.resourceViewTableBusinessUnitColumnCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.resourceViewTableBusinessUnitColumnCss)).getText().then(async function (businessUnitText) {
		logger.info('Business Unit selected for resource tab is ' + businessUnitText[0])
		return businessUnitText[0].split(',').includes(businessUnit)
	})	
}


/**
 * Method to verify KPI Values title
 */
health.prototype.kpiValuesTitle = async function () {
	logger.info("KPI Values Title started");
	browser.wait(EC.visibilityOf(element(by.css(this.kpiValuesTitleCss))), timeout.timeoutInMilis);
	let titleText = await element(by.css(this.kpiValuesTitleCss)).getText();
	logger.info("Title text - " + titleText);
	return titleText;
}

 /**
  * 
  * Method to verify the FilterBy Prometheus Value
  */
  health.prototype.filterValuesTitle = async function () {
	logger.info("KPI Values Title started");
	browser.wait(EC.visibilityOf(element.all(by.css(this.filterByDaysCss)).get(0)), timeout.timeoutInMilis);
	let titleText = await element.all(by.css(this.filterByDaysCss)).get(0).getText();
	logger.info("Title text - " + titleText);
	return titleText;
}

/**
 * method to click on header tab on health resource view
 */
health.prototype.clickOnHeaderTab = async function (tabName) {
	var EC = protractor.ExpectedConditions;
	var self = this;
	browser.wait(EC.visibilityOf(element.all(by.css(self.headerTabsCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(self.headerTabsCss)).then(async function (navItems) {
		for (var i = 0; i < navItems.length; i++) {
			var text = await navItems[i].getText();
			if (text === tabName) {
				await element.all(by.css(self.headerTabsCss)).get(i).click().then(function () {
					logger.info("Clicked on " + tabName + " Tab");
				});
			}
		}
	});
}

/**
 * This function will click on Performance Tab button
 */
health.prototype.clickOnPerformanceTab = async function (tabName) {
	var EC = protractor.ExpectedConditions;
	var self = this;
	browser.wait(EC.visibilityOf(element(by.tagName(self.performanceTabNameCss))), timeout.timeoutInMilis);
	return element.all(by.tagName(self.performanceTabNameCss)).then(async function (navItems) {
		for (var i = 0; i < navItems.length; i++) {
			var text = await navItems[i].getText();
			if (text == tabName || text.indexOf(tabName) > -1) {
				element.all(by.tagName(self.performanceTabNameCss)).get(i).click().then(function () {
					logger.info("Clicked on " + tabName + " Tab");
				});
			}
		}
	});
}

/**
 * Method to verify Resource Availability sub title
 */
health.prototype.resourceAvailabilitySubTitle = async function () {
	logger.info("Resource Availability sub Title check started");
	browser.wait(EC.visibilityOf(element(by.css(this.resourceAvailabilityDateTitleCss))), timeout.timeoutInMilis);
	let subTitleText = await element(by.css(this.resourceAvailabilityDateTitleCss)).getText();
	logger.info("Sub Title text - " + subTitleText);
	return  subTitleText ? true :false;
}

/**
 * Method to verify Resource Availability container check
 */
health.prototype.resourceAvailabilityContainerCheck = async function () {
	logger.info("Resource Availability container check started");
	browser.wait(EC.visibilityOf(element(by.css(this.resourceAvailabilityContainerCss))), timeout.timeoutInMilis);
	let count = await element.all(by.css(this.resourceAvailabilityContainerCss)).count();
	logger.info("container count - " + count);
	return  count === 90 ? true :false;
}

/**
 * Method to verify Resource Availability footer check
 */
health.prototype.resourceAvailabilityFooterCheck = async function () {
	logger.info("Resource Availability footer check started");
	browser.wait(EC.visibilityOf(element(by.css(this.resourceAvailabilityFooterCss))), timeout.timeoutInMilis);
	let footerText = await element.all(by.css(this.resourceAvailabilityFooterCss)).getText();
	logger.info("Footer text - " + footerText);
	return  (footerText.toString() == "Healthy,Critical,Warning,Not Available") ? true :false;
}

/**
 * Method to click on resource category tab
 */



health.prototype.clickOnResourceCategory =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.xpath(self.resourceCategoryCss))), timeout.timeoutInMilis);
	return element(by.xpath(self.resourceCategoryCss)).click().then(function(){
		logger.info("clicked on Resource category Tab")
		return true
	})

}

/**
 * Method to click on compute tab
 */


health.prototype.clickOnComputeTab =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.computeTabNameCss))), timeout.timeoutInMilis);
	return element(by.css(self.computeTabNameCss)).click().then(function(){
		logger.info("clicked on Compute Tab")
		return true
	})
}

/**
 * Method to click on network tab
 */

health.prototype.clickOnNetworkTab =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.networkTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.networkTabCss)).click().then(function(){
		logger.info("clicked on network Tab")
		return true
	})

}


/**
 * Method to click on utilization tab
 */

health.prototype.clickOnUtilization =async function(){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(self.utilizationTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.utilizationTabCss)).click().then(function(){
		logger.info("clicked on Utilization Tab ")
		return true
	})

}

/**
 * Method to click on disk tab
 */

health.prototype.clickOnDiskTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.diskTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.diskTabCss)).click().then(function(){
		logger.info("clicked on disk tab")
		return true
	})

}

/**
 * Method to click on memory tab
 */


health.prototype.clickOnMemoryTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.memoryTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.memoryTabCss)).click().then(function(){
		logger.info("clicked on memory Tab")
		return true
	})

}



/**
 * Method to click on process group tab
 */

health.prototype.clickOnProcessGroups =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.processGroupsCss))), timeout.timeoutInMilis);
	return element(by.css(self.processGroupsCss)).click().then(function(){
		logger.info("clicked on process group tab")
		return true
	})

}

/**
 * Method to click on heap size tab
 */

health.prototype.clickOnHeapSizeTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.heapSizeTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.heapSizeTabCss)).click().then(function(){
		logger.info("clicked on heap size tab")
		return true
	})

}

/**
 * Method to click on garbage collection tab
 */

health.prototype.clickOnGarbageCollectionTab =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element(by.css(self.garbageCollectionTabCss))), timeout.timeoutInMilis);
	return element(by.css(self.garbageCollectionTabCss)).click().then(function(){
		logger.info("clicked on garbage collection tab")
		return true
	})

}

/**
 * Method to click on filter by days under performance tab
 */

health.prototype.clickOnFilterByDays =async function(){
	var self = this;
	util.waitForAngular();

	browser.wait(EC.elementToBeClickable(element.all(by.css(self.filterByDaysCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.filterByDaysCss)).get(1).click().then(async function(){
		logger.info("clicked on filter by days dropdown box")
	})

}

/**
 * Method to select days under filter by 7 , 30 and 90days
 */

health.prototype.selectFilterByDays =async function(){
	var self = this;
	util.waitForAngular();
		await self.clickOnFilterByDays()
		browser.wait(EC.visibilityOf(element.all(by.xpath(self.numbeOfDaysXpath)).get(0)), timeout.timeoutInMilis);
		await element.all(by.xpath(self.numbeOfDaysXpath)).count().then(async function(values){
			for (var i = 0; i < values; i++) {
				await element.all(by.xpath(self.numbeOfDaysXpath)).get(i).getText().then(async function(numberOfDaysText){
					await element.all(by.xpath(self.numbeOfDaysXpath)).get(i).click().then(function(){
						logger.info('clicked on ' + numberOfDaysText)
					})
				})
					await self.clickOnFilterByDays()
			}
		})
}

/**
 * Method to type mainframe in search box and press enter 
 */
health.prototype.filterSearchBox = async function (mainframeText) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(self.searchBoxCss))), timeout.timeoutInMilis);
	await element(by.css(self.searchBoxCss)).sendKeys(mainframeText + protractor.Key.ENTER).then(function(){
		logger.info("Searching resources using keyword " + mainframeText + "..");
	})
}


/**
 * Method to verify headers in application/resource list view
 */
 health.prototype.getListViewHeaders = async function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.listViewHeaderCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.listViewHeaderCss)).getText().then(function (labels) {
		for (var i = 0; i < labels.length; i++) {
			labels[i] = labels[i].trim()
		}
		return labels;
	});
}


/**
 * Method to click on list view item
 */
health.prototype.clickOnListViewUnderTags =async function (index) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.listViewItemsCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(self.listViewItemsCss)).get(index).getText().then(async function (listItemText) {
		await element.all(by.css(self.listViewItemsCss)).get(index).click().then(function () {
			logger.info('clicked on ' + listItemText)
		})
	});
}

/**
 * Method to click on mainframe resource header 
 */
health.prototype.clickOnMainframeResourceHeader =async function (index) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(self.headerMainframeResourceCss)).get(index)), timeout.timeoutInMilis);
	await element.all(by.css(self.headerMainframeResourceCss)).get(index).getText().then(async function (mainframeResourceText) {
		await element.all(by.css(self.headerMainframeResourceCss)).get(index).click().then(function () {
			logger.info("clicked on " + mainframeResourceText +"Mainframe resource")
		})
	});
}


module.exports = health;