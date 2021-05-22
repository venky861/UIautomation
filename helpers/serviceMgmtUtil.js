/**
 * Created by : Atiksha
 * created on : 22/05/2020
 */
"use strict";
var logGenerator = require("./logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var util = require("./util.js");
var problemMgmntTestData = require("../testData/cards/problemManagementTestData.json");
var incidentMgmntTestData = require("../testData/cards/incidentManagementTestData.json");
var timeout = require('../testData/timeout.json');
var ticketDetailsTableRowsCss = "table.jsgrid-table tbody tr";
var ticketDetailsTableLastButtonCss = "li.pagination-last";
var ticketDetailsTableFirstButtonCss = "li.pagination-first";
var ticketDetailsTableNextButtonCss = "li.pagination-next";
var ticketDetailsTableActivePageButtonCss = "pagination li.active a";
var downloadXlsxIconCss = "div.menu-bar-containter img";
var ticketDetailsTableColumnsCss = "table.jsgrid-table th p";
var ticketDetailsTableTicketNumberValuesCss = "table.jsgrid-table tbody td:first-child p";
var tabListItemCss = "li.bx--tabs__nav-item";
var filterButtonsXpath = "//span[normalize-space(text())='{0}']//parent::button";
var dateRangeFilterButtonsXpath = "//em[normalize-space(text())='{0}']//parent::button";
var globalFilterButtonsXpath = "//*[normalize-space(text())='{0}']//parent::button";
var multiSelectDropDownPanelXpath = "//span[normalize-space(text())='{0}']//parent::button/following-sibling::ul";
var multiSelectFilterLabelXpath = "//span[normalize-space(text())='{0}']//parent::button/following-sibling::ul//label[contains(text(),'{1}')]";
var labelsFromMultiSelectFiltersXpath = "//span[normalize-space(text())='{0}']//parent::button/following-sibling::ul//label";
var firstMultiselectFilterValueXpath = "(//span[normalize-space(text())='{0}']//parent::button/following-sibling::ul//label)[3]";
var updateButtonName = "Update";
var applyGlobalFilterButtonCss = "button.apply-btn";
var applyButtonName = "Apply";
var ariaExpandedAttributeName = "aria-expanded";
var displayCssName = "display";
var customeRangeText = "Custom Range";
var dateRangeValueXpath = "//li[contains(text(),'{0}')]";
var dateRangePanelCss = "div.daterangepicker";
var startDateInputCss = "input[name=daterangepicker_start]";
var endDateInputCss = "input[name=daterangepicker_end]";
var applyDateRangeButtonCss = "button.applyBtn";
var clearDateRangeButtonCss = "button.cancelBtn";
var dateRangeFilterButtonsSpanCss = "button em.multiselect-selected-text"
var daysTimeUnit = "Days";
var tabListItemSelectedClass = "nav-item--selected";
var tabLinksCss = 'a.bx--tabs__nav-link';
var filterRowCss = 'ul.list-row';
var KibanaCardDataXpath = '//*[contains(text(), "{0}")]/parent::span/parent::h2/parent::figcaption/following-sibling::div//span';
var infoIconCss = "span.iconInfoNew";
var infoIconTextCss = "div.popover-content.popover-body";
var filterButtonsSpanCss = "button .multiselect-selected-text";
var widgetNamesCss = "span.embPanel__titleText";
var localFiltersLegendsTextXpath = "(//div[contains(@data-title,'{0}')])[1]//*[contains(@class,'visLegend__valueTitle')] | (//div[contains(@data-title,'{0}')])[1]//*[@class='highcharts-legend']//*[name()='tspan']";
var tableColumnNamesXpath = "//*[contains(text(),'{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//th//span";
var KibanaBarGraphYaxisLabelXpath = "//span[@class='embPanel__titleText'][contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//div[@class='visAxis--y']//*[name() ='g']//*[name()='text']";
var boxLocalFiltersXpath = "//div[contains(@data-title,'{0}')]//*[name()='g' and contains(@class, 'highcharts-label')]";
var boxLocalFiltersSectionTextXpath = "//div[@data-title='{0}']//*[name()='g' and contains(@class,'highcharts-label')]//*[name()='text']";
var boxLocalFiltersTspanXpath = "(//div[@data-title='{0}']//*[name()='g' and contains(@class,'highcharts-label')]//*[name()='text'])[{1}]//*[name()='tspan' and @class='highcharts-text-outline']";
var priorityViewBoxLocalFiltersTitleXpath = "//div[@data-title='{0}']//*[name()='g' and contains(@class,'highcharts-label')]//*[name()='title' and contains(text(),'{1}')]//parent::*[name()='text']";
var boxLocalFiltersTitleXpath = "//div[@data-title='{0}']//*[name()='g' and contains(@class,'highcharts-label')]//*[name()='title' and text()='{1}']//parent::*[name()='text']";
var boxLocalFiltersTextXpath = "//div[contains(@data-title,'{0}')]//*[name()='g' and contains(@class, 'highcharts-label')]//*[name()='tspan'][1]";
var boxLocalFiltersToolTipTextXpath = "//div[contains(@data-title,'{0}')]//*[name()='g' and contains(@class,'highcharts-tooltip')]//*[name()='tspan'][4]";
var SortTableColumnIconXpath = "//*[contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//th[{1}]//em";
var tableColumnDataXpath = "//*[contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//td//td[{1}]"
var navigationButtonXpath = "//div[normalize-space(text())='{0}']/parent::div/following-sibling::div//li/button";
var navigationButtonTextXpath = "//div[normalize-space(text())='{0}']/parent::div/parent::span/parent::h2/parent::figcaption/following-sibling::div//span";
var decendingClassAttribute = "fa-sort-desc";
var acendingClassAttribute = "fa-sort-asc";
var sortTypeDescending = "Descending";
var sortingTypeAscending = "Ascending";
var GraphFirstBarXpath = "(//span[@class='embPanel__titleText'][contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//div[@class='visWrapper__column']//*[name()='g']//*[name()='rect'])[1]";
var getGraphToolTipTextCss = "div.visTooltip  tr:nth-child({0}) > td.visTooltip__value > div";
var waveGraphPointsXpath = "//div[contains(@data-title,'{0}')]//*[name()='g' and contains(@class, 'points line')]//*[name()='circle' and @fill='transparent']";
var xAxisLabelsForWaveGraphCss = "div[data-title='{0}'] g.x text";
var labelValueFromToolTipCss = "div.visTooltip  tr:nth-child(1) > td.visTooltip__value > div";
var countValueFromToolTipCss = "div.visTooltip  tr:nth-child(2) > td.visTooltip__value > div";
var selectFilterDialogueBoxCss = "div.euiModal";
var graphBarsTextXpath = "//span[@class='embPanel__titleText'][contains(text(), '{0}')]/parent::span/parent::h2/parent::figcaption/following-sibling::div//div[@class='visWrapper__column']//*[name()='g']//*[name()='text' and @class='visColumnChart__barLabel']";
var selectFilterDialogueBoxApplyButtonCss = "div.euiModalFooter button.euiButton";
var barChartsCss = "div[data-title='{0}'] g.series rect";
var boxFilterSectionNameCss = "div[data-title='{0}'] g.highcharts-level-group-1 > *";
var boxFilterSectionToolTipCss = "div[data-title='{0}'] g.highcharts-tooltip text";
var horizontalBarSectionToolTipXpath = "//div[@data-title='{0}']//ancestor::*[@id='kibana-body']//following-sibling::div[@class='visTooltip']//tbody";
var heatMapFilterYAxisLabelsCss = "div[data-title='{0}'] g.y text";
var heatMapFilterRowsCss = "div[data-title='{0}'] g.series";
var heatMapFilterRowValuesXpath = "(//div[@data-title='{0}']//*[@class='series'])[{1}]//*[@class='square']//*[name()='text']";
var namesListForNameListWidgetXpath = "//div[@data-title='{0}']//*[name()='text']"
var nameListFilterSectionsXpath = "//div[@data-title='{0}']//*[name()='text' and text()='{1}']";
var leftCarouselBtnCss = "div.carousel-btn em.fa-angle-left";
var rightCarouselBtnCss = "div.carousel-btn em.fa-angle-right";
var priorityWidgetTitleXpath = "//div[contains(@data-title,'{0}')]//*[@class='highcharts-level-group-1']//*";
var treemapTooltipValueCss = ".highcharts-label.highcharts-tooltip";
var breakDownHorizontalBarChartSectionCss = "div[data-title='{0}'] g.series rect";
var tableWidgetCss = "div[data-title='{0}'] table.table-condensed";
var tableWidgetCellValuesXpath = "//div[@data-title='{0}']//table[contains(@class,'table-condensed')]//tbody//div/span[contains(text(),'{1}')]//ancestor::td[1]//following-sibling::td/span";
var horizontalBarYAxisLabelsCss = "div[data-title='{0}'] div.y-axis-div g>text";
var tableWidgetColumnNamesCss = "div[data-title='{0}'] table.table-condensed thead th span";
var tableWidgetColumnCellValuesCss = "div[data-title='{0}'] table.table-condensed tbody tr td:nth-child({1})>span";
var tableWidgetCellValueCss = "div[data-title='{0}'] table.table-condensed tbody tr:nth-child({1}) td:nth-child({2}) div>span:nth-child(1)";
var tableWidgetSummaryCellValuesCss = "div[data-title='{0}'] table.table-condensed tfoot th:nth-child({1})";
var countValueFromTableWidgetXpath = "//div[@data-title='{0}']//table[contains(@class,'table-condensed')]//td[1]//span[text()='{1}']//ancestor::td[1]//following-sibling::td//span";
var firstColumnCellValuesFromTableWidgetCss = "div[data-title='{0}'] table.table-condensed td div";
var valuesFromMultiselectFilterXpath = "//button[contains(@class,'multiselect')]/span[text()='{0}']//ancestor::div[1]/ul/li[not(contains(@class,'apply-btn-multiselect'))]//input[@type='checkbox']";
var dataPointsFromMultiWaveGraphCss = "div[data-title='{0}'] g.points circle.circle[data-label='{1}']";
var noResultsFoundTextCss = "div[data-title='{0}'] div.euiTextColor p";
var donutWidgetTitleXpath = "//div[contains(@data-title,'{0}')]//*[@class='arcs']//*";
var donutChartTooltipValueCss = ".visTooltip .visTooltip__table";
var KibanaCloudTagDataXpath = "//div[contains(@data-title,'{0}')]//*[name()='g']//*";
var pieWidgetTitleXpath = "//div[contains(@data-title,'{0}')]//*[@class='arcs']//*";
var pieChartTooltipValueCss = ".visTooltip .visTooltip__table";
var circleChartPathCss = "div[data-title='{0}'] .slice[data-label='{1}']";
var circleChartPathCountToolTipTextCss = "div.visTooltip tr:nth-child(1) > td:last-child";
var pieChartTextValueXpath = "//div[contains(@data-title,'{0}')]//*[@class='label-text']";
var pieChartLabelXpath = "//div[contains(@data-title,'{0}')]//*[@class='label-text' and contains(text(),'{1}')]"
var wordCloudValueXpath = "//div[contains(@data-title,'{0}')]//*[name()='g']//*";
var createdChangesTextCss = "span.embPanel__titleText";
var frames = require('../testData/frames.json');
/**
 * This function get ticket details table row count
 */
function getTicketDetailsTableRowsCount() {
	var totalRowCount;
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(ticketDetailsTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(ticketDetailsTableLastButtonCss)).getAttribute("class").then(function (attrVal) {
		if (attrVal.includes("disabled")) {
			return element.all(by.css(ticketDetailsTableRowsCss)).count().then(function (rowCount) {
				totalRowCount = rowCount;
				logger.info("First and Last page of table are same. Total row count is: " + totalRowCount);
				return totalRowCount;
			})
		}
		else {
			// Get row count from first page
			return element.all(by.css(ticketDetailsTableRowsCss)).count().then(function (firstPageRowCount) {
				logger.info("First page row count: " + firstPageRowCount);
				return element(by.css(ticketDetailsTableLastButtonCss)).click().then(function () {
					browser.sleep(2000);
					browser.wait(EC.visibilityOf(element.all(by.css(ticketDetailsTableRowsCss)).get(0)), timeout.timeoutInMilis);
					// Get last page number
					return element(by.css(ticketDetailsTableActivePageButtonCss)).getText().then(function (lastPageNum) {
						logger.info("Last Page Number: " + lastPageNum);
						// Get row count from last page
						return element.all(by.css(ticketDetailsTableRowsCss)).count().then(function (lastPageRowCount) {
							logger.info("Last page row count: " + lastPageRowCount);
							if (lastPageRowCount != firstPageRowCount) {
								totalRowCount = ((parseInt(lastPageNum) - 1) * firstPageRowCount) + lastPageRowCount;
								logger.info("Total row count: " + totalRowCount);
								return totalRowCount;
							}
							else {
								totalRowCount = parseInt(lastPageNum) * firstPageRowCount;
								logger.info("Total row count: " + totalRowCount);
								return totalRowCount;
							}
						})
					})
				})
			})
		}
	})
};

/**
 * This function to get list of column names from ticket details table
 */
function getTicketDetailsTableColumnNameList() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element.all(by.css(ticketDetailsTableColumnsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(ticketDetailsTableColumnsCss)).getText().then(function (columnNamesList) {
		logger.info("Columns in ticket details table: " + columnNamesList);
		return columnNamesList;
	})
}

/**
 * This function will download the xlsx report by clicking download icon.
 * The downloaded file will be in aiops_report directory
 */
function downloadTicketDetailsXlsx() {
	return new Promise(function (resolve) {
		var EC = protractor.ExpectedConditions;
		util.deleteAllReports();
		browser.wait(EC.visibilityOf(element(by.css(downloadXlsxIconCss))), timeout.timeoutInMilis);
		element(by.css(downloadXlsxIconCss)).click().then(async function () {
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("Clicked on download ticket details xlsx report icon");
			setTimeout(() => resolve("done"), 10000);
		});
	});
};

/**
 * This function will check if Tab link is selected or not
 * Ex. tabLinkName -- Ticket Details, Topography tab links on Service Management pages
 */
function isTabLinkSelected(tabLinkName) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(tabLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(tabLinksCss)).getText().then(async function (links) {
		for (var i = 0; i < links.length; i++) {
			if (links[i].trim() == tabLinkName) {
				return await element.all(by.css(tabListItemCss)).get(i).getAttribute("class").then(function (attrVal) {
					if (attrVal.includes(tabListItemSelectedClass)) {
						logger.info("Tab link " + tabLinkName + " is selected.");
						return true;
					}
					else {
						logger.info("Tab link " + tabLinkName + " is not selected.");
						return false;
					}
				})
			}
		}
	});
};

/**
 * Method to click on tab
 */

async function clickOnTab(tabLinkName){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(tabLinksCss)).get(0)), 100000);
	return element.all(by.css(tabLinksCss)).getText().then(function (links) {
		for (var i = 0; i < links.length; i++) {
			if (links[i] == tabLinkName) {
				return element.all(by.css(tabLinksCss)).get(i).click().then(function () {
					logger.info("Clicked on " + tabLinkName + " link...");
				});
			}
		}
	});
 }

/**
 * This function will click on Tab link on any page
 */

async function clickOnTabLink(tabLinkName) {
	var arrayList = ["Topography" , "Trend" , "Change Ticket Details" , "Trends" , "Ticket Details", "Overall Trend", "Top Volume Drivers"]
	if(arrayList.includes(tabLinkName)){
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		var EC = protractor.ExpectedConditions;
		browser.wait(EC.visibilityOf(element.all(by.css(createdChangesTextCss)).get(0)), 90000);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		await clickOnTab(tabLinkName)	
	}else{
		await clickOnTab(tabLinkName)
	}
}
/**
 * This function will click on left carousel button for global filter row
 */
function clickOnGlobalFilterLeftCarouselArrow(){
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(leftCarouselBtnCss))), timeout.timeoutInMilis);
	element(by.css(leftCarouselBtnCss)).click().then(function(){
		logger.info("Clicked on Global filter's Left Carousel button..");
	});
}

/**
 * This function will click on right carousel button for global filter row
 */
function clickOnGlobalFilterRightCarouselArrow(){
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(rightCarouselBtnCss))), timeout.timeoutInMilis);
	element(by.css(rightCarouselBtnCss)).click().then(function(){
		logger.info("Clicked on Global filter's Right Carousel button..");
	});
}

/**
 * This function will get tool tip text for all global filter buttons on any page 
 * filterName - Assignment Group, Contact Type, Created, Resolved, etc
 */
function getGlobalFilterButtonToolTipText(filterName) {
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	// Create dynamic xpath by formatting string
	var filterBtn = globalFilterButtonsXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	// clickOnGlobalFilterLeftCarouselArrow();
	return element.all(by.xpath(filterBtn)).count().then(function(count){
		if(count != 0){
			return element(by.xpath(filterBtn)).isDisplayed().then(function(status){
				if(status == false){
					logger.info(filterName+" is not found in list, clicking on right carousel button..");
					// clickOnGlobalFilterRightCarouselArrow();
				}
				return browser.actions().mouseMove(element(by.xpath(filterBtn))).perform().then(function(){
					return element(by.xpath(filterBtn)).getAttribute("title").then(function (toolTipText) {
						logger.info("Tool tip text for filter "+filterName+": "+toolTipText.trim());
						return toolTipText.trim();
					});
				});
			});
		}
		else{
			logger.info(filterName+" is not in the entire list.");
			return;
		}
	});
}

/**
 * This function will get difference between two dates in Days selected from date-range filter
 * filterName - Created, Resolved, etc
 */
async function getDateRangeFilterDateDifference(filterName) {
	var dateRange = await getGlobalFilterButtonToolTipText(filterName);
	var startDate = dateRange.split("to")[0].trim();
	var endDate = dateRange.split("to")[1].trim();
	logger.info("Start Date: " + startDate + " End Date: " + endDate);
	var diffDays = util.getDateDifference(startDate, endDate, daysTimeUnit);
	return diffDays;
};

async function getDaysFromDateRangeFilterToolTip(filterName) {
	var dateRange = await getGlobalFilterButtonToolTipText(filterName);
	var days = dateRange.split(" ")[1].trim();
	// var endDate = dateRange.split("to")[1].trim();
	logger.info("Date range difference in days: " + days);
	return parseInt(days);
};

/**
 * This function will check and click on filter buttons on any page
 */
function clickOnFilterButtonBasedOnName(filterName) {
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	// Create dynamic xpath by formatting string
	var filterBtns = filterButtonsXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	// clickOnGlobalFilterLeftCarouselArrow();
	return element.all(by.xpath(filterBtns)).count().then(function(count){
		if(count != 0){
			return element(by.xpath(filterBtns)).isDisplayed().then(function(status){
				if(status == false){
					logger.info(filterName+" is not found in list, clicking on right carousel button..");
					// clickOnGlobalFilterRightCarouselArrow();
				}
				return element(by.xpath(filterBtns)).getAttribute(ariaExpandedAttributeName).then(function (res) {
					if (res == "false" || res == "null" || res == null) {
						// Click on filter button, if not clicked
						element(by.xpath(filterBtns)).click().then(function () {
							logger.info("Clicked on " + filterName + " filter button...");
						});
					}
					else {
						logger.info(filterName + " is already clicked..");
					}
				});
			});
		}
		else{
			logger.info(filterName+" is not in the entire list.");
			return;
		}
	});
}

/**
 * This function will check whether the clicked filter is expanded or not
 * filterName - Assignment Group, Contact Type, etc
 */
function verifyFilterPanelExpanded(filterName) {
	var EC = protractor.ExpectedConditions;
	var filterPanel = multiSelectDropDownPanelXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	return element(by.xpath(filterPanel)).getAttribute("class").then(function (classValue) {
		if (classValue.includes("show")) {
			logger.info(filterName + " is expanded.");
			return true;
		}
		else {
			logger.info(filterName + " is not expanded.");
			return false;
		}
	});
}

/**
 * This function will verify global filter has values to select or not
 * @param {Global filter names; Ex. Assignment Group, Contact Type, etc.} filterName  
 */
function verifyFilterValuesInFilterPanel(filterName){
	var EC = protractor.ExpectedConditions;
	var filterPanel = multiSelectDropDownPanelXpath.format(filterName);
	var labelsForFilters =  labelsFromMultiSelectFiltersXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.xpath(filterPanel))), timeout.timeoutInMilis);
	return element.all(by.xpath(labelsForFilters)).count().then(function(filterCount){
		if(filterCount > 2){
			logger.info(filterName+" has filter values to select.");
			return true;
		}
		else{
			logger.info(filterName+" has no filter values to select.");
			return false;
		}
	});
}

/**
 * Get lost of all filter values present for a multi-select dropdown global filter
 * @param {Name of the global filter} filterName 
 */
async function getAllValuesFromMultiselectFilter(filterName){
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	var listOfValues = [];
	var bool = await verifyFilterPanelExpanded(filterName);
	if(!bool){
		await clickOnFilterButtonBasedOnName(filterName);
	}
	// Create dynamic xpath by formatting string
	var filterBtns = filterButtonsXpath.format(filterName);
	var valuesFromFilterXpath = valuesFromMultiselectFilterXpath.format(filterName)
	browser.wait(EC.visibilityOf(element(by.xpath(filterBtns))), timeout.timeoutInMilis);
	var isFilterValuesPresent = await verifyFilterValuesInFilterPanel(filterName);
	if(isFilterValuesPresent){
		return element.all(by.xpath(valuesFromFilterXpath)).getAttribute("value").then(function(values){
			listOfValues = values;
			logger.info("List of values from filter: "+filterName+" is: "+listOfValues);
			return listOfValues;
		})
	}
	else{
		return listOfValues;
	}
}

/**
 * This function will select the value from filter on any page
 */
async function selectFilterValueBasedOnName(filterName, filterValue) {
	var EC = protractor.ExpectedConditions;
	var bool = await verifyFilterValuesInFilterPanel(filterName);
	if(bool){
		var filterValueCheckbox = multiSelectFilterLabelXpath.format(filterName, filterValue);
		var filterPanel = multiSelectDropDownPanelXpath.format(filterName);
		browser.wait(EC.visibilityOf(element(by.xpath(filterPanel))), timeout.timeoutInMilis);
		return element(by.xpath(filterValueCheckbox)).click().then(function () {
			logger.info("Clicked on " + filterValue + " checkbox link...");
		});
	}
}

/**
 * This function will select the value from multi-select filter on any page
 */
async function selectFirstFilterValueBasedOnName(filterName) {
	var EC = protractor.ExpectedConditions;
	var bool = await verifyFilterValuesInFilterPanel(filterName);
	if(bool){
		var filterValueCheckbox = firstMultiselectFilterValueXpath.format(filterName);
		browser.wait(EC.presenceOf(element(by.xpath(filterValueCheckbox))), timeout.timeoutInMilis);
		return element(by.xpath(filterValueCheckbox)).getText().then(function (filterValue1) {
			// If first element is empty choose next one
			if (filterValue1 == "") {
				logger.info("First filter value is empty, searching for next one..");
				filterValueCheckbox = "(" + filterValueCheckbox + "//following::li//label)[1]";
			}
			return element(by.xpath(filterValueCheckbox)).click().then(function () {
				return element(by.xpath(filterValueCheckbox)).getText().then(function (filterValue2) {
					logger.info("Clicked on " + filterValue2.trim() + " checkbox link...");
					return filterValue2.trim();
				})
			})
		});
	}
	else{
		return bool;
	}
}

/**
 * This function will click on Update button based on filter name on any page
 */
function clickOnUpdateFilterButton(filterName){
	var EC = protractor.ExpectedConditions;
	var updateBtn = multiSelectFilterLabelXpath.format(filterName, updateButtonName);
	var filterPanel = multiSelectDropDownPanelXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.xpath(filterPanel))), timeout.timeoutInMilis);
	return element(by.xpath(updateBtn)).click().then(function () {
		logger.info("Clicked on Update button...");
	});
}

/**
 * This function will click on Apply button
 */
function clickOnApplyFilterButton() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(applyGlobalFilterButtonCss))), timeout.timeoutInMilis);
	return element(by.css(applyGlobalFilterButtonCss)).click().then(function () {
		logger.info("Clicked on Apply button...");
	});
}

/**
 * This function will click on Date-range filter button on any page
 */
function clickOnDateRangeFilterButton(filterName) {
	var EC = protractor.ExpectedConditions;
	var rangeFilterBtn = dateRangeFilterButtonsXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	// clickOnGlobalFilterLeftCarouselArrow();
	return element.all(by.xpath(rangeFilterBtn)).count().then(function(count){
		if(count != 0){
			return element(by.xpath(rangeFilterBtn)).isDisplayed().then(function(status){
				if(status == false){
					logger.info(filterName+" is not found in list, clicking on right carousel button..");
					// clickOnGlobalFilterRightCarouselArrow();
				}
				return element(by.xpath(rangeFilterBtn)).click().then(function () {
					logger.info("Clicked on Date-range " + filterName + " button...");
				});
			});
		}
		else{
			logger.info(filterName+" is not in the entire list.");
			return;
		}
	});
}

/**
 * This function will check whether the clicked date-range filter is expanded or not
 * filterName - Created, Resolved, etc
 */
function verifyDateRangeFilterPanelExpanded(filterName) {
	var EC = protractor.ExpectedConditions;
	var dateRangeCss = element.all(by.css(dateRangePanelCss));
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	return element.all(by.css(dateRangeFilterButtonsSpanCss)).getText().then(async function (btnName) {
		for (var i = 0; i < btnName.length; i++) {
			if (btnName[i].trim() == filterName) {
				return await dateRangeCss.get(i).getCssValue(displayCssName).then(function (val) {
					if (val == "block") {
						logger.info("Date range picker for " + filterName + " is expanded..");
						return true;
					}
					else {
						logger.info("Date range picker for " + filterName + " is not expanded..");
						return false;
					}
				});
			}
		}
	});
}

/**
 * This function will select the value from Date-range filter on any page
 */
function selectDateRangeFilterValue(filterValue) {
	var EC = protractor.ExpectedConditions;
	var rangeValue = dateRangeValueXpath.format(filterValue);
	var dateRangeCss = element.all(by.css(dateRangePanelCss));
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	return dateRangeCss.count().then(async function (cnt) {
		logger.info("Count of daterange elements: " + cnt);
		for (var i = 0; i < cnt; i++) {
			await dateRangeCss.get(i).getCssValue(displayCssName).then(async function (val) {
				logger.info("Display CSS value: " + i + ": " + val);
				if (val == "block") {
					await element.all(by.xpath(rangeValue)).get(i).click().then(function () {
						logger.info("Clicked on " + filterValue + " range value...");
						return;
					});
				}
				else {
					logger.info("Date range picker is not expanded..");
				}
			});
		}
	});
}

/**
 * This function will select custom range value from Date-range filter on any page
 * range - Array of two date objects having start and end date for Date-Time Filters
 */
function selectCustomDateRangeFilterValue(range) {
	var EC = protractor.ExpectedConditions;
	var rangeValue = dateRangeValueXpath.format(customeRangeText);
	var dateRangeCss = element.all(by.css(dateRangePanelCss));
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	return dateRangeCss.count().then(async function (cnt) {
		logger.info("Count of daterange elements: " + cnt);
		for (var i = 0; i < cnt; i++) {
			await dateRangeCss.get(i).getCssValue(displayCssName).then(async function (val) {
				logger.info("Display CSS value: " + i + ": " + val);
				if (val == "block") {
					await element.all(by.xpath(rangeValue)).get(i).click().then(async function () {
						logger.info("Clicked on " + customeRangeText + " range value...");
						await element.all(by.css(startDateInputCss)).get(i).clear().sendKeys(range[0]).then(async function () {
							logger.info("Entered start date: " + range[0]);
							await element.all(by.css(endDateInputCss)).get(i).clear().sendKeys(range[1]).then(async function () {
								logger.info("Entered end date: " + range[1]);
								await element.all(by.css(applyDateRangeButtonCss)).get(i).click().then(function () {
									logger.info("Clicked on Apply button...");
									return;
								});
							});
						});
					});
				}
				else {
					logger.info("Date range picker is not expanded..");
				}
			});
		}
	});
}

/**
 * This function will clear date-range filter value
 * filterName - Created, Resolved, etc
 */
function clearDateRangeFilter(filterName) {
	var EC = protractor.ExpectedConditions;
	var dateRangeCss = element.all(by.css(dateRangePanelCss));
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	return element.all(by.css(dateRangeFilterButtonsSpanCss)).getText().then(async function (btnName) {
		for (var i = 0; i < btnName.length; i++) {
			if (btnName[i].trim() == filterName) {
				return await dateRangeCss.get(i).getCssValue(displayCssName).then(async function (val) {
					if (val == "block") {
						return await element.all(by.css(clearDateRangeButtonCss)).get(i).click().then(function () {
							logger.info("Clicked on Clear button...");
							return;
						});
					}
					else {
						logger.info("Date range picker for " + filterName + " is not expanded..");
						return;
					}
				});
			}
		}
	});
}

/**
 * this function deselects the selected filter value from given filter name 
 */
async function deselectFilterValue(filterName, filterValue) {
	await clickOnFilterButtonBasedOnName(filterName);
	await selectFilterValueBasedOnName(filterName, filterValue);
	await clickOnUpdateFilterButton(filterName);
	await clickOnApplyFilterButton();
	await util.waitForInvisibilityOfKibanaDataLoader();
}

/**
 * this functions  returns value of card on Kibana report 
 * @param {*} cardName  Name of card on Kibana report 
 */
function getKabianaBoardCardTextBasedOnName(cardName) {
	var EC = protractor.ExpectedConditions;
	var cardValueXapth = KibanaCardDataXpath.format(cardName);
	util.waitForAngular();
	browser.sleep(2000);
	browser.wait(EC.visibilityOf(element(by.xpath(cardValueXapth))), timeout.timeoutInMilis);
	return element(by.xpath(cardValueXapth)).getText().then(function (cardValue) {
		logger.info(cardName + " Card Text Value is: " + cardValue);
		return cardValue;
	})
}

/** return kibana report card value greater than 999 in K format
 * eg: 1000 =1k
 * */
function getKabianaBoardCardValueInKformatter(cardName) {
	return getKabianaBoardCardTextBasedOnName(cardName).then(function (cardvalue) {
		var cardVal = cardvalue.replace(/[, ]+/g, "").trim();
		cardVal = parseInt(cardVal);
		var card_value = util.kFormatter(cardVal);
		card_value = card_value.toString();
		logger.info("value of " + cardName + " is " + card_value);
		return card_value;
	});
}

/**
 * Method clicks on Info Icon
 */
function clickOnLastupdatedInfoIcon() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(infoIconCss))), timeout.timeoutInMilis);
	element(by.css(infoIconCss)).click().then(function () {
		logger.info("Clicked on Last updated Info Icon");
	})
}

/**
 * Method returns last updated info Tooltip Text
 */
function getLastupdatedInfoIconText() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(infoIconTextCss))), timeout.timeoutInMilis);
	return element(by.css(infoIconTextCss)).getText().then(function (text) {
		logger.info("Last updated Info Icon Test is " + text);
		return text;
	})
}

/**
 * Method return All Tabs Texts on Kibana report
 */
function getAllTabsLinkText() {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(tabLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(tabLinksCss)).getText().then(function (tabLinks) {
		logger.info("Available Tabs names : " + tabLinks);
		return tabLinks;
	});
}

/**
 * Method return All Global Filter Texts on Kibana report
 */
function getAllFiltersButtonNameText() {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element.all(by.css(filterButtonsSpanCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(filterButtonsSpanCss)).getAttribute('textContent').then(async function (filterButtons) {
		var filterButtonsList = [];
		for(var i=0; i<filterButtons.length; i++){
			filterButtonsList.push(filterButtons[i].toString().trim());
		}
		logger.info("Available Filters names : " + filterButtonsList);
		return filterButtonsList;
	});
}

/**
 * Method return All widget Name Texts on Kibana report
 */
function getAllKibanaReportWidgetsNameText() {
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(filterRowCss))), timeout.timeoutInMilis);
	return element.all(by.css(widgetNamesCss)).getText().then(function (widgetNames) {
		logger.info("widget's Present are :" + widgetNames)
		return widgetNames

	})
}

/**
 * Return all column names of given Table/widget Name on Kibana report
 */
function getColumnNamesBasedOnTableName(tableName) {
	util.waitForAngular();
	util.waitForInvisibilityOfKibanaDataLoader();
	var EC = protractor.ExpectedConditions;
	var tableColumnNames = tableColumnNamesXpath.format(tableName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(tableColumnNames)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(tableColumnNames)).getText().then(function (columnNames) {
		logger.info("Column Name for " + tableName + " are :" + columnNames)
		return columnNames;

	})
}

/**
 * Return Y'axis labels count of given Graph/widget Name on Kibana report
 */
function getKibanaBarGraphYaxisLabelsCountBasedOnWidgetName(widgetName) {
	var EC = protractor.ExpectedConditions;
	var KibanaBarGraphYaxisLabels = KibanaBarGraphYaxisLabelXpath.format(widgetName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(KibanaBarGraphYaxisLabels)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(KibanaBarGraphYaxisLabels)).getText().then(function (Labels) {
		logger.info("No of Column Name for " + widgetName + " are :" + Labels.length)
		var labels = Labels.length.toString();
		return labels;

	})
}

/**
 * check if data is present on widgets and returns boolian Expression
 */
function checkIfDataPresentOnwidget(cardName) {
	var cardValueXapth = KibanaCardDataXpath.format(cardName);
	util.waitForAngular();
	return element(by.xpath(cardValueXapth)).isPresent().then(function (bool) {
		if (bool) {
			element(by.xpath(cardValueXapth)).getText().then(function (cardValue) {
				logger.info(cardName + " Card Text Value is: " + cardValue);
			})
		}
		else {
			logger.info(cardName + " Card Text Value is not Present");
		}
		return bool;
	})
}

/**
 * This function will get legends name from local filters
 * filterName -- Priority View, Server Region, Capacity vs Non Capacity, Month Wise Trend, Week wise Trend, Top Servers On Issues, etc
 */
function getLegendNamesFromLocalFilter(filterName) {
	util.waitForAngular();
	util.waitForInvisibilityOfKibanaDataLoader();
	var EC = protractor.ExpectedConditions;
	var legendNamesXpath = localFiltersLegendsTextXpath.format(filterName);
	browser.wait(EC.visibilityOf(element.all(by.xpath(legendNamesXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(legendNamesXpath)).getText().then(function (legendsName) {
		logger.info("All legends for filter " + filterName + " are: " + legendsName);
		return legendsName;
	});
}

/**
 * This function will verify if Dialogue box for selecting filters is visible or not
 */
function isDisplayedSelectFiltersDialogueBox() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(selectFilterDialogueBoxCss))), timeout.timeoutInMilis);
	return element(by.css(selectFilterDialogueBoxCss)).isDisplayed().then(function (isVisible) {
		logger.info("Select Filters Dialogue box is visible.");
		return isVisible;
	});
}

/**
 * This function will click on Dialogue box for selecting filters Apply Button 
 */
function clickOnSelectFiltersDialogueBoxApplyButton() {
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(selectFilterDialogueBoxApplyButtonCss))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.css(selectFilterDialogueBoxApplyButtonCss)));
	element(by.css(selectFilterDialogueBoxApplyButtonCss)).click().then(function () {
		logger.info("Clicked on Select Filters Dialogue box Apply button.");
	});
}

/**
 * This function clicks on first box local filter
 * filterName -- Server Function, OpCo, Assignment Group, etc
 */
async function clickOnFirstBoxLocalFilter(filterName) {
	var EC = protractor.ExpectedConditions;
	var boxLocalFilters = boxLocalFiltersXpath.format(filterName);
	var boxLocalFiltersText = boxLocalFiltersTextXpath.format(filterName);
	await browser.wait(EC.visibilityOf(element.all(by.xpath(boxLocalFilters)).get(0)), timeout.timeoutInMilis);
	util.waitForAngular();
	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	return await element.all(by.xpath(boxLocalFilters)).count().then(function (count) {
		if (count > 0) {
			return element.all(by.xpath(boxLocalFiltersText)).get(0).getAttribute("innerHTML").then(function (boxFilterText) {
				browser.wait(EC.elementToBeClickable(element.all(by.xpath(boxLocalFilters)).get(0)), timeout.timeoutInMilis);
				return browser.actions().mouseMove(element.all(by.xpath(boxLocalFilters)).get(0)).click().perform().then(function () {
					logger.info("Clicked on box local filter with text: " + boxFilterText.trim());
					return true;
				})
			})
		}
		else {
			logger.info("No box local filter is present.");
			return false;
		}
	});
}

/**
 * This function returns ticket count from topltip text of box local filter
 * filterName -- Server Function, OpCo, Assignment Group, etc
 */
function getTicketCountFromBoxLocalFilterTooltipText(filterName) {
	var EC = protractor.ExpectedConditions;
	var boxLocalFilterTooltipXpath = boxLocalFiltersToolTipTextXpath.format(filterName);
	browser.wait(EC.visibilityOf(element(by.xpath(boxLocalFilterTooltipXpath))), timeout.timeoutInMilis);
	util.scrollToWebElement(element(by.xpath(boxLocalFilterTooltipXpath)));
	browser.actions().mouseMove(element(by.xpath(boxLocalFilterTooltipXpath))).perform();
	return element(by.xpath(boxLocalFilterTooltipXpath)).getText().then(function (toolTipText) {
		logger.info("Ticket count from tooltip text: " + toolTipText);
		return util.stringToInteger(toolTipText);
	});
}

/**
 * 
 sortingOrder : Ascending/Desending , columnType :alphabetic/numeric
 click on the Stort Icon of given table name based on expected sort type
 */
function clickOnColumnIconBasedOnSortingOrder(tableName, columnNo, sortingOrder) {
	//down/up arrow for making table columns value accending or decending
	var SortTableColumnIcon = SortTableColumnIconXpath.format(tableName, columnNo)
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	util.waitForInvisibilityOfKibanaDataLoader();
	//checking visibility and click on down/up arrow for making table columns value accending or decending
	browser.wait(EC.visibilityOf(element(by.xpath(SortTableColumnIcon))), timeout.timeoutInMilis);
	return element(by.xpath(SortTableColumnIcon)).getAttribute('class').then(async function (attribute) {
		if ((attribute.includes(decendingClassAttribute) && sortingOrder == sortTypeDescending) || (attribute.includes(acendingClassAttribute) && sortingOrder == sortingTypeAscending)) {
			logger.info(columnNo + " is in " + sortingOrder + " Order");
		}
		else {
			browser.wait(EC.elementToBeClickable(element(by.xpath(SortTableColumnIcon))), timeout.timeoutInMilis);
			await element(by.xpath(SortTableColumnIcon)).click().then(async function () {
				logger.info("Clicked on column number " + columnNo + ", as it is not in " + sortingOrder + " Order");
				await clickOnColumnIconBasedOnSortingOrder(tableName, columnNo, sortingOrder);
			});
		}
	});
}

/**
 * 
 * @param {Name of the table} tableName 
 * @param {column no of table from left to right ,i.e starts with 1} columnNo 
 * return list of all the values of a particular coulmn for given column no and table name
 */
function getColumnDataBasedOnColumnNo(tableName, columnNo) {
	let ColumnValueslist = [];
	var EC = protractor.ExpectedConditions;
	var NagivationTextButtonTextOfTable = navigationButtonTextXpath.format(tableName);
	var NagivationButtonOfTable = navigationButtonXpath.format(tableName);
	//data present in each column
	var tableColumnData = tableColumnDataXpath.format(tableName, columnNo);
	// gettig all values of data present in column of each row
	browser.wait(EC.visibilityOf(element.all(by.xpath(tableColumnData)).last()));
	return element.all(by.xpath(tableColumnData)).getText().then(function (columnValues) {
		ColumnValueslist = columnValues;
		// checking visibility of navigation buttons if there then first collecting all data via concation if not present than just sorting and returning
		return element.all(by.xpath(NagivationButtonOfTable)).get(2).isPresent().then(function (boolean) {
			if (boolean) {
				return element.all(by.xpath(NagivationTextButtonTextOfTable)).getText().then(function (buttonText) {
					for (var i = 2; i < buttonText.length - 1; i++) {
						return element.all(by.xpath(NagivationButtonOfTable)).get(i).click().then(function () {
							browser.wait(EC.visibilityOf(element.all(by.xpath(tableColumnData)).last()));
							return element.all(by.xpath(tableColumnData)).getText().then(function (additionalColumnValues) {
								ColumnValueslist = ColumnValueslist.concat(additionalColumnValues);
								logger.info("column values are :" + ColumnValueslist);
								return ColumnValueslist;
							})
						});
					}
				});
			}
			else {
				logger.info("column values are :" + columnValues);
				return columnValues;
			}
		});
	});
}

/*
*check Ascending/ Descending order of table columns and returns boolean expression
* SortType : Ascending/Desending , columnNo :start from 1(left to right) , columnType :alphabetic/numeric
*/
async function checkAscendingDescendingOrderOfTableItems(tableName, columnNames, sortingOrder, columnType) {
	let ticketColumnValues = [], ColumnValueslist = [];
	var sortColumnValues = [];
	var bool = true;
	var boolValue = false;
	var booleanValue = true;
	for(var j = 0; j < columnNames.length; j++){
		var colIndex = j+2;
		await clickOnColumnIconBasedOnSortingOrder(tableName, colIndex, sortingOrder);
		var columnValues = await getColumnDataBasedOnColumnNo(tableName, colIndex);
		ticketColumnValues = columnValues;
		ColumnValueslist = columnValues;
		sortColumnValues = await util.sortArrayList(ticketColumnValues, sortingOrder, columnType);
		// Match sorted list array of column values with  column Values present on UI
		for (var i = 0; i < sortColumnValues.length; i++) {
			sortColumnValues[i] = sortColumnValues[i].replace(",", "")
			ColumnValueslist[i] = ColumnValueslist[i].replace(",", "")
			logger.info("Sorted Value is " + sortColumnValues[i] + " and value on table is " + ColumnValueslist[i]);
			if ((sortColumnValues[i] == ColumnValueslist[i]) && bool == true) {
				bool = true;
				boolValue = true;
			}
			else {
				bool = false;
				boolValue = false;
			}
		}
		if(boolValue == false){
			logger.info("Sorting for "+columnNames[j]+" column is NOT correct");
			booleanValue = false;
		}
		else{
			logger.info("Sorting for "+columnNames[j]+" column is correct");
		}
	}
	return booleanValue;
}

// get First Label Name of Y-axis for Bar Graph present on Kibana Report (widgetName : Name of Widget representing Graph)
function getKibanaBarGraphYaxisFirstLabelsBasedOnWidgetName(widgetName) {
	var EC = protractor.ExpectedConditions;
	var KibanaBarGraphYaxisLabels = KibanaBarGraphYaxisLabelXpath.format(widgetName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(KibanaBarGraphYaxisLabels)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(KibanaBarGraphYaxisLabels)).get(0).getText().then(function (FirstLabel) {
		logger.info(" First Label Name for " + widgetName + " is :" + FirstLabel)
		return FirstLabel;
	})
}

// get  Label Names of Y-axis for Bar Graph present on Kibana Report (widgetName : Name of Widget representing Graph)
function getKibanaBarGraphYaxisLabelsBasedOnWidgetName(widgetName) {
	var EC = protractor.ExpectedConditions;
	var KibanaBarGraphYaxisLabels = KibanaBarGraphYaxisLabelXpath.format(widgetName)
	browser.wait(EC.visibilityOf(element.all(by.xpath(KibanaBarGraphYaxisLabels)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(KibanaBarGraphYaxisLabels)).getText().then(function (Labels) {
		logger.info(" Y-Axix Labels Name for " + widgetName + " are :" + Labels)
		return Labels;
	})
}

// Get text of bar values for given Graph name
function getTextValuesofHorizontalBar(graphName) {
	var EC = protractor.ExpectedConditions;
	var BarsText = graphBarsTextXpath.format(graphName);
	var barValuesArray = []
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(BarsText)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(BarsText)).getText().then(function (barTextValues) {
		var i = 0;
		barTextValues.forEach(function (barValue) {
			barValuesArray[i] = parseInt(barValue.replace(/\,/g, ''));
			logger.info("Value for  " + graphName + " bar's text are " + barValuesArray[i]);
			i++;
		});
		logger.info("Value for  " + graphName + " bar's text are " + barValuesArray);
		return barValuesArray;
	});
}

// Get first column value for given table name and its column no (left to right)
function getColumnFirstValueBasedOnTableName(tableName, ColumnNo) {
	util.waitForAngular();
	var EC = protractor.ExpectedConditions;
	var tableColumnData = tableColumnDataXpath.format(tableName, ColumnNo);
	browser.wait(EC.visibilityOf(element.all(by.xpath(tableColumnData)).first()), timeout.timeoutInMilis);
	return element.all(by.xpath(tableColumnData)).first().getText().then(async function (columnValue) {
		logger.info("First Value of " + tableName + " table with Column No : " + ColumnNo + " is " + columnValue);
		return columnValue;
	})
}

/*
* get tooltip text value of first Bar of graph for given graph name 
* eg. tooltip matrix will be
*  QUEUE ID   IBM-SW-PROBLEM MGNT
*  COUNT      2,346
* if value of QUEUE ID  is required i.e. IBM-SW-PROBLEM MGNT (tooltip value would be 1)
* if value of COUNT  is required i.e. 2,346 (tooltip value would be 2)
*/
function getFirstBarGraphToolTipText(Tooltip, graphName) {
	var EC = protractor.ExpectedConditions;
	var firstBarGraph = GraphFirstBarXpath.format(graphName)
	util.waitForAngular();
	// Create dynamic CSS by formatting string
	var ToolTipText = getGraphToolTipTextCss.format(Tooltip);
	browser.wait(EC.presenceOf(element(by.xpath(firstBarGraph))), timeout.timeoutInMilis);
	return element(by.xpath(firstBarGraph)).click().then(function () {
		return browser.actions().mouseMove(element(by.xpath(firstBarGraph))).perform().then(function () {
			browser.wait(EC.presenceOf(element(by.css(ToolTipText))), timeout.timeoutInMilis);
			return element(by.css(ToolTipText)).getText().then(function (toolTipText) {
				logger.info("Tool tip text for Graph is : " + toolTipText);
				return toolTipText;
			});
		});
	});
}

/**
 * Method to get list of count values for a specific Y-Axis label in Breakdown Horizontal Bar Graph Widget
 * @param {Name of Widget for which you to evaluate count} widgetName 
 * @param {Label name from Y Axis in the graph} YAxisLabel 
 */
async function getCountListForBreakdownHorizontalBarGraphWidget(widgetName, YAxisLabel){
	var EC = protractor.ExpectedConditions;
	var countList = [];
	var barChartsCss = breakDownHorizontalBarChartSectionCss.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(barChartsCss)).get(0)), timeout.timeoutInMilis);
	var barChartsCount = await element.all(by.css(barChartsCss)).count();
	for(var i=0; i<barChartsCount; i++){
		await util.scrollToWebElement(element.all(by.css(barChartsCss)).get(i));
		await browser.actions().mouseMove(element.all(by.css(barChartsCss)).get(i)).perform();
		await browser.wait(EC.presenceOf(element(by.css(labelValueFromToolTipCss))), timeout.timeoutInMilis);
		var label = await element(by.css(labelValueFromToolTipCss)).getText();
		var count = await element(by.css(countValueFromToolTipCss)).getText();
		if(label.trim() == YAxisLabel){
			countList.push(util.stringToInteger(count));
		}
	}
	logger.info("List of count values for "+YAxisLabel+" is: "+countList);
	return countList;
}

/**
 * Method to verify values from expected JSON with UI values for Breakdown Horizontal Bar Graph Widget
 * @param {Name of Widget for which you to evaluate count.} widgetName 
 * @param {Json object for a widget from expected data JSON} widgetJsonObj 
 */
async function verifyValuesFromJSONAndUIForBreakdownHorizontalBarGraph(widgetName, widgetJsonObj){
	var bool = true;
	var yAxisLabels = util.getJSONObjectKeys(widgetJsonObj);
	for(var i=0; i<yAxisLabels.length; i++){
		var sectionNames = util.getDataFromElasticViewJSON(widgetJsonObj, yAxisLabels[i]);
		var listFromJson = util.getJSONObjectValues(sectionNames);
		var listFromUI = await getCountListForBreakdownHorizontalBarGraphWidget(widgetName, yAxisLabels[i]);
		if(!util.compareArrays(listFromJson, listFromUI)){
			bool = false;
			logger.info("List of count values in JSON are NOT matching with UI for " + yAxisLabels[i] + " y-axis label.");
		}
		else{
			logger.info("List of count values in JSON are matching with UI for " + yAxisLabels[i] + " y-axis label.");
		}
	}
	return bool;
}

/**
 * Method to get Y-axis labels list from horizontal bar graph widget
 * @param {Name of Widget for which you to evaluate count. Ex. Owner Group by Volume of Problem in Problem Management} widgetName 
 */
function getYAxisLabelsForHorizontalBarGraphWidget(widgetName){
	var EC = protractor.ExpectedConditions;
	var yAxisLabels = [];
	var yAxisLabelsCss = horizontalBarYAxisLabelsCss.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(yAxisLabelsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(yAxisLabelsCss)).getText().then(function(labels){
		for(var i=0; i<labels.length; i++){
			if(!labels[i]==""){
				yAxisLabels.push(labels[i]);
			}
		}
		logger.info("Y-axis labels list for "+widgetName+" is : "+yAxisLabels);
		return yAxisLabels;
	});
}

/**
 * Method to get count from horizontal bar chart count
 * widgetname - Name of Widget for which you to evaluate count. Ex. Owner Group by Volume of Problem in Problem Management
 * YAxisLabel - Label name from Y Axis in the graph
 */
async function getCountFromHorizontalBarGraphWidget(widgetName, YAxisLabel) {
	var EC = protractor.ExpectedConditions;
	var barChartsForWidget = barChartsCss.format(widgetName);
	var horizontalBarSectionToolTip = horizontalBarSectionToolTipXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(barChartsForWidget)).get(0)), timeout.timeoutInMilis);
	var barChartsCount = await element.all(by.css(barChartsForWidget)).count();
	var i = 0;
	for (i = 0; i < barChartsCount; i++) {
		await util.scrollToWebElement(element.all(by.css(barChartsForWidget)).get(i));
		await browser.actions().mouseMove(element.all(by.css(barChartsForWidget)).get(i)).perform();
		await browser.wait(EC.visibilityOf(element(by.xpath(horizontalBarSectionToolTip))), timeout.timeoutInMilis);
		var tooltip = await element(by.xpath(horizontalBarSectionToolTip)).getAttribute("textContent");
		if (tooltip.includes(YAxisLabel)) {
			var tootipText = util.removeBlankSpaces(tooltip);
			var splitToolTip = tootipText.trim().split(" ");
			logger.info("splitToolTip: ", splitToolTip);
			var sectionCount = splitToolTip[splitToolTip.length-1];
			logger.info(YAxisLabel + " value is: " + sectionCount);
			return util.stringToInteger(sectionCount);
		}
	}
	if (i == barChartsCount) {
		logger.info(YAxisLabel + " value not found.");
		return 0;
	}
}

/**
 * Method to get list of count from horizontal bar chart count
 * @param {Name of Widget for which you to evaluate count.} widgetName 
 * @param {List of Y-axis labels from horizontal bar graph} YaxisLabelsList 
 */
async function getCountListForHorizontalBarGraphWidget(widgetName, YaxisLabelsList){
	var tooltipCountList = [];
	var yAxisLabelsListLength = YaxisLabelsList.length;
	if(yAxisLabelsListLength > 5){
		yAxisLabelsListLength = 5;
	}
	util.waitForAngular();
	for(var i=0; i<yAxisLabelsListLength; i++){
		var tooltipCount = await getCountFromHorizontalBarGraphWidget(widgetName, YaxisLabelsList[i]);
		tooltipCountList.push(tooltipCount);
	}
	logger.info("List of tooltip count from "+widgetName+" is :", tooltipCountList);
	return tooltipCountList;
}

/**
 * Method to verify values from expected JSON with UI values for Horizontal Bar Graph
 * @param {Name of Widget for which you to evaluate count.} widgetName 
 * @param {Json object for a widget from expected data JSON} widgetJsonObj 
 */
async function verifyValuesFromJSONAndUIForHorizontalBarGraph(widgetName, widgetJsonObj){
	var bool = true;
	// Y-Axis Labels
	var yAxisLabels = util.getJSONObjectKeys(widgetJsonObj);
	// Count values
	var countValues = util.getJSONObjectValues(widgetJsonObj);
	// Validating values for first 5 filter sections
	var keysCounter = yAxisLabels.length;
	if (keysCounter > 5) {
		keysCounter = 5;
	}
	for (var i = 0; i < keysCounter; i++) {
		if(yAxisLabels[i].length != 0){
			var countFromUI = await getCountFromHorizontalBarGraphWidget(widgetName, yAxisLabels[i]);
			if (countFromUI != countValues[i]) {
				bool = false;
				logger.info("Count is NOT matching for " + yAxisLabels[i]);
			}
			else {
				logger.info("Count is matching for " + yAxisLabels[i]);
			}
		}
	}
	return bool;
}

// click on first horizontal bar of graph for given graph-name
function clickOnGraphFirstHorizontalBar(graphName) {
	var EC = protractor.ExpectedConditions;
	var firstBarGraph = GraphFirstBarXpath.format(graphName)
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(firstBarGraph))), timeout.timeoutInMilis);
	return element(by.xpath(firstBarGraph)).click().then(function () {
		logger.info("clicked On " + graphName + " First Horizontal Bar");
	});
}

/**
 * This function will set Ticket count less than 10K
 * widgetName -- Ticket count widget name
 * Ex. Total Ticket Count, Incoming Vol, etc.
 *  */
async function setTicketCountBelow10K(widgetName, globalFilterList) {
	util.waitForAngular();
	var ini_count = await getKabianaBoardCardTextBasedOnName(widgetName);
	var strToIntCount = util.stringToInteger(ini_count);
	if (strToIntCount < 10000) {
		logger.info(widgetName + " value is already below 10K and value is: " + strToIntCount);
		return;
	}
	else {
		for (var globalFilter of globalFilterList) {
			await clickOnFilterButtonBasedOnName(globalFilter);
			await selectFirstFilterValueBasedOnName(globalFilter);
			await clickOnUpdateFilterButton(globalFilter);
			await clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			ini_count = await getKabianaBoardCardTextBasedOnName(widgetName);
			strToIntCount = util.stringToInteger(ini_count);
			if (strToIntCount < 10000) {
				logger.info(widgetName + " value is set below 10K and value is: " + strToIntCount);
				return;
			}
		}
		if (strToIntCount >= 10000) {
			logger.info(widgetName + " value is greater than or equal to 10000 and value is: " + strToIntCount);
			return;
		}
	}
}

/**
 * Get list of list of column values from Table widget
 * @param {Name of the table widget } widgetName 
 * @param {Name of the global filter to be applied} filterName 
 * @param {List of filter values present in the global filter to be applied} filterValues 
 */
async function getListOfListOfColumnValuesFromTableWidget(widgetName, filterName, filterValues){
	var totalCountList = [];
	var isPresent = true;
	var noResultsTextCss = noResultsFoundTextCss.format(widgetName);
	var bool = await verifyFilterPanelExpanded(filterName);
	if(!bool){
		await clickOnFilterButtonBasedOnName(filterName);
	}
	var j=0;
	for(j = 0; j < filterValues.length; j++){
		var filterCountList = [];
		await selectFilterValueBasedOnName(filterName, filterValues[j]);
		await clickOnApplyFilterButton(filterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check of No results found text in the widget
		await element.all(by.css(noResultsTextCss)).count().then(async function(textCount){
			if(textCount > 0){
				isPresent = await element(by.css(noResultsTextCss)).isDisplayed();
				await element(by.css(noResultsTextCss)).getText().then(function(noResultsFoundText){
					logger.info(noResultsFoundText+" text present in "+widgetName);
				});
			}
			else{
				isPresent = false;
			}
		});
		if(isPresent != true){
			var countList = [];
			filterCountList = await getColumnWiseCountListFromTableWidget(widgetName, problemMgmntTestData.columnNameCount);
			// Add each element in the list
			var sum = filterCountList.reduce(function(a, b){
				return a + b;
			});
			countList.push(sum);
			logger.info("Count for "+filterValues[j]+" is:", countList);
			totalCountList.push(countList);
		}
		util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
		if(j < filterValues.length-1){
			await clickOnFilterButtonBasedOnName(filterName);
			await expect(verifyFilterPanelExpanded(filterName)).toBe(true);
		}
	}
	logger.info("Total count list for column values in "+widgetName+" : ", totalCountList);
	return totalCountList;
}

/**
 * Get list of summary count list from table widget
 * @param {Name of the table widget } widgetName 
 * @param {Name of the global filter to be applied} filterName 
 * @param {List of filter values present in the global filter to be applied} filterValues 
 */
async function getListOfSummaryCountListFromTableWidget(widgetName, filterName, filterValues){
	var totalCountList = [];
	var isPresent = true;
	var noResultsTextCss = noResultsFoundTextCss.format(widgetName);
	var bool = await verifyFilterPanelExpanded(filterName);
	if(!bool){
		await clickOnFilterButtonBasedOnName(filterName);
	}
	var j=0;
	for(j = 0; j < filterValues.length; j++){
		var filterCountList = [];
		await selectFilterValueBasedOnName(filterName, filterValues[j]);
		await clickOnApplyFilterButton(filterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check of No results found text in the widget
		await element.all(by.css(noResultsTextCss)).count().then(async function(textCount){
			if(textCount > 0){
				isPresent = await element(by.css(noResultsTextCss)).isDisplayed();
				await element(by.css(noResultsTextCss)).getText().then(function(noResultsFoundText){
					logger.info(noResultsFoundText+" text present in "+widgetName);
				});
			}
			else{
				isPresent = false;
			}
		});
		if(isPresent != true){
			filterCountList = await getSummaryValuesListFromTableWidget(widgetName);
			totalCountList.push(filterCountList);
		}
		util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
		if(j < filterValues.length-1){
			await clickOnFilterButtonBasedOnName(filterName);
			await expect(verifyFilterPanelExpanded(filterName)).toBe(true);
		}
	}
	logger.info("Total count list for summary values in "+widgetName+" : ", totalCountList);
	return totalCountList;
}

/**
 * Method to get count from wave point graph widget
 * @param {Name of Widget for which you to evaluate count. Ex. Week Wise Trend in Pervasive Insights} widgetName 
 * @param {Label name from X Axis in the graph} XAxisLabel
 * @param {Name of the legend in the widget} legendName
 */
async function getCountFromWaveGraphPointsUsingLegendName(widgetName, XAxisLabel, legendName) {
	var EC = protractor.ExpectedConditions;
	var waveGraphPoints = dataPointsFromMultiWaveGraphCss.format(widgetName, legendName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(waveGraphPoints)).get(0)), timeout.timeoutInMilis);
	var pointsCount = await element.all(by.css(waveGraphPoints)).count();
	var i = 0;
	for (i = 0; i < pointsCount; i++) {
		await browser.actions().mouseMove(element.all(by.css(waveGraphPoints)).get(i)).perform();
		await browser.wait(EC.presenceOf(element(by.css(countValueFromToolTipCss))), timeout.timeoutInMilis);
		var label = await element(by.css(labelValueFromToolTipCss)).getText();
		var count = await element(by.css(countValueFromToolTipCss)).getText();
		if (label.trim() == XAxisLabel) {
			logger.info(XAxisLabel + " value is: " + count);
			return util.stringToInteger(count);
		}
	}
	if (i == pointsCount) {
		logger.info(XAxisLabel + " value not found.");
		return 0;
	}
}

/**
 * Method to get list of count list from multi-wave points graph widget
 * @param {Name of Widget for which you to evaluate count} widgetName 
 * @param {List of Legend names from widget} legendNames 
 * @param {Global filter name} filterName 
 */
async function getListOfCountListBasedOfEachWaveGraph(widgetName, legendNames, filterName){
	var EC = protractor.ExpectedConditions;
	var totalCountList = [];
	var legendBasedList = [];
	for(var k=0; k<legendNames.length; k++){
		let priorityNum = await util.getNumberFromString(legendNames[k]);
		await clickOnFilterButtonBasedOnName(filterName);
		await selectFilterValueBasedOnName(filterName, priorityNum);
		await clickOnApplyFilterButton(filterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		let waveGraphPointsCss = dataPointsFromMultiWaveGraphCss.format(widgetName, legendNames[k]);
		util.waitForAngular();
		browser.wait(EC.visibilityOf(element.all(by.css(waveGraphPointsCss)).get(0)), timeout.timeoutInMilis);
		let xAxisLabels = await getXAxisLabelsFromWaveGraph(widgetName);
		for(var i=0; i < xAxisLabels.length; i++){
			var count = await getCountFromWaveGraphPointsUsingLegendName(widgetName, xAxisLabels[i], legendNames[k]);
			legendBasedList.push(count);
		}
		logger.info("Count list from " + widgetName + " for " +legendNames[k]+ " : " + legendBasedList);
		totalCountList.push(legendBasedList);
		await deselectFilterValue(filterName, priorityNum);
	}
	logger.info("List of count list for "+widgetName+": ", totalCountList);
	return totalCountList;
}

/**
 * This function returns list of total count list from multi-wave graph widgets
 * @param {Name of the multi-wave graph widget } widgetName 
 * @param {Name of the global filter to be applied} filterName 
 * @param {List of filter values present in the global filter to be applied} filterValues 
 */
async function getListOfTotalCountListFromMultiWaveGraphPoints(widgetName, filterName, filterValues){
	var EC = protractor.ExpectedConditions;
	var totalCountList = [];
	var isPresent = true;
	var noResultsTextCss = noResultsFoundTextCss.format(widgetName);
	var bool = await verifyFilterPanelExpanded(filterName);
	if(!bool){
		await clickOnFilterButtonBasedOnName(filterName);
	}
	var j=0;
	for(j = 0; j < filterValues.length; j++){
		var filterCountList = [];
		await selectFilterValueBasedOnName(filterName, filterValues[j]);
		await clickOnApplyFilterButton(filterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check of No results found text in the widget
		await element.all(by.css(noResultsTextCss)).count().then(async function(textCount){
			if(textCount > 0){
				isPresent = await element(by.css(noResultsTextCss)).isDisplayed();
				await element(by.css(noResultsTextCss)).getText().then(function(noResultsFoundText){
					logger.info(noResultsFoundText+" text present in "+widgetName);
				});
			}
			else{
				isPresent = false;
			}
		});
		if(isPresent != true){
			var legendsList = await getLegendNamesFromLocalFilter(widgetName);
			var isListEmpty = util.isListEmpty(legendsList);
			if(!isListEmpty){
				for(var k=0; k<legendsList.length; k++){
					var waveGraphPointsCss = dataPointsFromMultiWaveGraphCss.format(widgetName, legendsList[k]);
					util.waitForAngular();
					browser.wait(EC.visibilityOf(element.all(by.css(waveGraphPointsCss)).get(0)), timeout.timeoutInMilis);
					var pointsCount = await element.all(by.css(waveGraphPointsCss)).count();
					var countInt = 0;
					var totalCount = 0;
					for (var i = 0; i < pointsCount; i++) {
						await browser.actions().mouseMove(element.all(by.css(waveGraphPointsCss)).get(i)).perform().then(async function () {
							await browser.wait(EC.presenceOf(element(by.css(countValueFromToolTipCss))), timeout.timeoutInMilis);
							await element(by.css(countValueFromToolTipCss)).getText().then(function (tooltip) {
								countInt = util.stringToInteger(tooltip);
								totalCount = totalCount + countInt;
							})
						});
					}
					logger.info("Total count from " + widgetName + " for " +legendsList[k]+ " : " + totalCount);
					filterCountList.push(totalCount);
				}
				logger.info("List of total count for "+filterValues[j]+": ", filterCountList);
				totalCountList.push(filterCountList);
			}
			else{
				logger.info("No legends are present in "+widgetName+" for "+filterValues[j]);
			}
		}
		util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
		if(j < filterValues.length-1){
			await clickOnFilterButtonBasedOnName(filterName);
			await expect(verifyFilterPanelExpanded(filterName)).toBe(true);
		}
	}
	logger.info("List of list total of count from " + widgetName + " is: ", totalCountList);
	return totalCountList;
}

/**
 * This function will return the total count from wave graph widget
 * widgetName - Name of the wave graph widget from kibana report.
 * Ex. "Created Change Trend" from Change Management report
 */
async function getTotalCountFromWaveGraphPoints(widgetName) {
	var EC = protractor.ExpectedConditions;
	var totalCount = 0;
	var waveGraphPoints = waveGraphPointsXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(waveGraphPoints)).get(0)), timeout.timeoutInMilis);
	var pointsCount = await element.all(by.xpath(waveGraphPoints)).count();
	var countInt = 0;
	for (var i = 0; i < pointsCount; i++) {
		await browser.actions().mouseMove(element.all(by.xpath(waveGraphPoints)).get(i)).perform().then(async function () {
			await browser.wait(EC.visibilityOf(element(by.css(countValueFromToolTipCss))), timeout.timeoutInMilis);
			await element(by.css(countValueFromToolTipCss)).getText().then(function (tooltip) {
				countInt = util.stringToInteger(tooltip);
				totalCount = totalCount + countInt;
			})
		})
	}
	logger.info("Total count from " + widgetName + " points: " + totalCount);
	return totalCount;
}

/**
 * Get number of points on wave-points graph widget
 * @param {Name of the wave graph widget from kibana report} widgetName 
 */
function getCountOfWaveGraphPoints(widgetName){
	var EC = protractor.ExpectedConditions;
	var waveGraphPoints = waveGraphPointsXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(waveGraphPoints)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(waveGraphPoints)).count().then(function(count){
		logger.info("Number of points in wave-points widget '"+widgetName+"' is: "+count);
		return count;
	})
}

/**
 * Click on one of the point from wave points graph using index number
 * @param {Name of the wave graph widget from kibana report} widgetName 
 * @param {Index for point to click on} pointIndex 
 */
function clickOnWavePointGraphUsingIndex(widgetName, pointIndex){
	var EC = protractor.ExpectedConditions;
	var waveGraphPoints = waveGraphPointsXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(waveGraphPoints)).get(pointIndex)), timeout.timeoutInMilis);
	return element.all(by.xpath(waveGraphPoints)).get(pointIndex).click().then(function(){
		logger.info("Clicked on index "+pointIndex+" from widget: "+widgetName);
	});
}

/**
 * Get count of a point from wave points graph using index number
 * @param {Name of the wave graph widget from kibana report} widgetName 
 * @param {Index for point to get count of} pointIndex 
 */
function getCountOnWavePointGraphUsingIndex(widgetName, pointIndex){
	var EC = protractor.ExpectedConditions;
	var waveGraphPoints = waveGraphPointsXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(waveGraphPoints)).get(pointIndex)), timeout.timeoutInMilis);
	return browser.actions().mouseMove(element.all(by.xpath(waveGraphPoints)).get(pointIndex)).perform().then(async function () {
		browser.wait(EC.visibilityOf(element(by.css(countValueFromToolTipCss))), timeout.timeoutInMilis);
		return element(by.css(countValueFromToolTipCss)).getText().then(function (tooltip) {
			var countInt = util.stringToInteger(tooltip);
			logger.info("Count on index "+pointIndex+" from widget "+widgetName+" : "+countInt);
			return countInt;
		})
	});
}

/**
 * Get x-axis labels list from wave-points graph widget
 * @param {Name of the wave graph widget from kibana report} widgetName 
 */
async function getXAxisLabelsFromWaveGraph(widgetName){
	var EC = protractor.ExpectedConditions;
	var waveGraphXAxisLabels = xAxisLabelsForWaveGraphCss.format(widgetName);
	var filteredXAxisLabels = [];
	await util.waitForInvisibilityOfKibanaDataLoader();
	util.waitForAngular();
	await browser.wait(EC.visibilityOf(element.all(by.css(waveGraphXAxisLabels)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(waveGraphXAxisLabels)).getText().then(function(xAxisLabels){
		for(var i=0; i<xAxisLabels.length; i++){
			// check for empty and null value
			if(!(xAxisLabels[i] == "" && xAxisLabels[i] == null)){
				filteredXAxisLabels.push(xAxisLabels[i]);
			}
		}
		logger.info("X axis labels for "+widgetName+" are: "+filteredXAxisLabels);
		return filteredXAxisLabels;
	});
}

/**
 * Method to get count from wave point graph widget
 * @param {Name of Widget for which you to evaluate count. Ex. Week Wise Trend in Pervasive Insights} widgetName 
 * @param {Label name from X Axis in the graph} XAxisLabel 
 */
async function getCountFromWaveGraphPoints(widgetName, XAxisLabel) {
	var EC = protractor.ExpectedConditions;
	var waveGraphPoints = waveGraphPointsXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(waveGraphPoints)).get(0)), timeout.timeoutInMilis);
	var pointsCount = await element.all(by.xpath(waveGraphPoints)).count();
	var i = 0;
	for (i = 0; i < pointsCount; i++) {
		await browser.actions().mouseMove(element.all(by.xpath(waveGraphPoints)).get(i)).perform();
		var countValueEle = await element.all(by.css(countValueFromToolTipCss)).count();
		if(countValueEle != 0){
			await browser.wait(EC.presenceOf(element(by.css(countValueFromToolTipCss))), timeout.timeoutInMilis);
			var label = await element(by.css(labelValueFromToolTipCss)).getText();
			var count = await element(by.css(countValueFromToolTipCss)).getText();
			if (label.trim() == XAxisLabel) {
				logger.info(XAxisLabel + " value is: " + count);
				return util.stringToInteger(count);
			}
		}
		else{
			logger.info("Label/Count is not available for "+i+"th element.");
		}
	}
	if (i == pointsCount) {
		logger.info(XAxisLabel + " value not found.");
		return 0;
	}
}

async function verifyCountListWaveGraphPointsFromUIAndESQuery(widgetName, widgetJsonObj){
	var bool = true;
	// X-Axis Labels
	var xAxisLabels = util.getJSONObjectKeys(widgetJsonObj);
	// Count values
	var countValues = util.getJSONObjectValues(widgetJsonObj);

	for (var i = 0; i < xAxisLabels.length; i++) {
		var countFromUI = await getCountFromWaveGraphPoints(widgetName, xAxisLabels[i]);
		logger.info("countFromUI: ", countFromUI);
		if(countFromUI != 0){
			if (countFromUI != countValues[i]) {
				bool = false;
				logger.info("Count is NOT matching for " + xAxisLabels[i]);
			}
			else {
				logger.info("Count is matching for " + xAxisLabels[i]);
			}
		}
	}
	return bool;
}

/**
 * Method to get count from vertical bar chart
 * widgetName - Name of Widget for which you to evaluate count. Ex. Month Wise Trend in Pervasive Insights
 * XAxisLabel - Label name from X Axis in the graph
 */
async function getCountFromVerticalBarChart(widgetName, XAxisLabel) {
	var EC = protractor.ExpectedConditions;
	var barchartsForWidget = barChartsCss.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(barchartsForWidget)).get(0)), timeout.timeoutInMilis);
	var barChartsCount = await element.all(by.css(barchartsForWidget)).count();
	var i = 0;
	for (i = 0; i < barChartsCount; i++) {
		await util.scrollToWebElement(element.all(by.css(barchartsForWidget)).get(i));
		await browser.actions().mouseMove(element.all(by.css(barchartsForWidget)).get(i)).perform();
		await browser.wait(EC.presenceOf(element(by.css(countValueFromToolTipCss))), timeout.timeoutInMilis);
		var label = await element(by.css(labelValueFromToolTipCss)).getText();
		var count = await element(by.css(countValueFromToolTipCss)).getText();
		if (label.trim() == XAxisLabel) {
			logger.info(XAxisLabel + " value is: " + count);
			return util.stringToInteger(count);
		}
	}
	if (i == barChartsCount) {
		logger.info(XAxisLabel + " value not found.");
		return 0;
	}
}

/**
 * Method to get count from box filter sections
 * widgetName - Name of Widget for which you to evaluate count. Ex. Server Function, Opco, Top 50 Category, etc in Pervasive Insights
 * legendName - Name of legend for different sections
 */
async function getCountFromBoxFilterSections(widgetName, legendName) {
	var EC = protractor.ExpectedConditions;
	var boxLocalFiltersText = boxLocalFiltersSectionTextXpath.format(widgetName);
	var boxFilterSectionTooltip = boxFilterSectionToolTipCss.format(widgetName);
	var textCount = await element.all(by.xpath(boxLocalFiltersText)).count();
	for (var i = 0; i < textCount; i++) {
		var index = i + 1;
		var tspanEleXpath = boxLocalFiltersTspanXpath.format(widgetName, index);
		var tspanEleCount = await element.all(by.xpath(tspanEleXpath)).count();
		var tspanTotalText = "";
		for(var j = 0; j < tspanEleCount; j++){
			var tspanText = await element.all(by.xpath(tspanEleXpath)).get(j).getText();
			if(tspanText.endsWith('-')){
				tspanTotalText = tspanTotalText + tspanText.trim();
			}
			else{
				tspanTotalText = tspanTotalText + tspanText.trim() + ' ';
			}
		}
		// Remove extra spaces in between
		tspanTotalText = tspanTotalText.replace(/\s\s+/g, " ");
		if(tspanTotalText.includes('…')){
			var titleText = await element.all(by.xpath(boxLocalFiltersText)).get(i).getAttribute("textContent");
			var noExtraSpaceTitleText = titleText.replace(/\s\s+/g, " ");
			logger.info("Title1 - Comparing " + noExtraSpaceTitleText + " with " + legendName);
			if(noExtraSpaceTitleText.includes(legendName)){
				await browser.actions().mouseMove(element.all(by.xpath(boxLocalFiltersText)).get(i)).perform();
				await browser.wait(EC.visibilityOf(element(by.css(boxFilterSectionTooltip))), timeout.timeoutInMilis);
				var toolTipText = await element(by.css(boxFilterSectionTooltip)).getAttribute("textContent");
				var filteredToolTipText = toolTipText.replace(/\s\s+/g, " ");
				logger.info("Title2 - Comparing " + filteredToolTipText + " with " + legendName);
				if (filteredToolTipText.includes(legendName)) {
					var count = filteredToolTipText.split(":")[1].trim();
					logger.info("Count for " + legendName + " in " + widgetName + "from tooltip text: " + count);
					return util.stringToInteger(count);
				}
			}
		}
		else{
			logger.info("Tspan1 - Comparing "+tspanTotalText+" with "+legendName);
			if(tspanTotalText.includes(legendName)){
				await browser.actions().mouseMove(element.all(by.xpath(boxLocalFiltersText)).get(i)).perform();
				await browser.wait(EC.visibilityOf(element(by.css(boxFilterSectionTooltip))), timeout.timeoutInMilis);
				var toolTipText = await element(by.css(boxFilterSectionTooltip)).getAttribute("textContent");
				var filteredToolTipText = toolTipText.replace(/\s\s+/g, " ");
				logger.info("Tspan2 - Comparing " + filteredToolTipText + " with " + legendName);
				if (filteredToolTipText.includes(legendName)) {
					var count = filteredToolTipText.split(":")[1].trim();
					logger.info("Count for " + legendName + " in " + widgetName + "from tooltip text: " + count);
					return util.stringToInteger(count);
				}
			}
		}
	}
}

/**
 * Method to verify filter section is present in box filter widget or not
 * widgetName - Name of Widget for which you to evaluate count. Ex. Server Function, Opco, Top 50 Category, etc in Pervasive Insights
 * legendName - Name of legend for different sections
 */
function verifySectionFromBoxFilterWidget(widgetName, legendName) {
	var EC = protractor.ExpectedConditions;
	var boxFilterSectionName = boxFilterSectionNameCss.format(widgetName);
	var boxFilterSectionTooltip = boxFilterSectionToolTipCss.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(boxFilterSectionName)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(boxFilterSectionName)).count().then(async function (sectionCount) {
		var i=0;
		for (i = 0; i < sectionCount; i++) {
			await browser.actions().mouseMove(element.all(by.css(boxFilterSectionName)).get(i)).perform();
			await browser.wait(EC.visibilityOf(element(by.css(boxFilterSectionTooltip))), timeout.timeoutInMilis);
			var toolTipText = await element(by.css(boxFilterSectionTooltip)).getAttribute("textContent");
			logger.info("Comparing " + toolTipText + " with " + legendName);
			if (toolTipText.includes(legendName)) {
				logger.info(legendName+ " found in widget "+widgetName);
				return true;
			}
		}
		if(i == sectionCount){
			logger.info(legendName+ " not found in widget "+widgetName);
			return false;
		}
	});
}

/**
 * Method to verify JSON and UI values from Box Filter widgets
 * @param {Name of Widget for which you to evaluate count. Ex. Server Function, Opco, Top 50 Category, etc in Pervasive Insights} widgetName 
 * @param {Json object for a widget from expected data JSON} widgetJsonObj 
 */
async function verifyValuesFromJSONAndUIForBoxFilters(widgetName, widgetJsonObj) {
	var bool = true;
	// Section legend keys
	var sectionLegends = util.getJSONObjectKeys(widgetJsonObj);
	// Count values
	var countValues = util.getJSONObjectValues(widgetJsonObj);
	// Validating values for first 5 filter sections
	var keysCounter = sectionLegends.length;
	if (keysCounter > 5) {
		keysCounter = 5;
	}
	for (var i = 0; i < keysCounter; i++) {
		var countFromUI = await getCountFromBoxFilterSections(widgetName, sectionLegends[i]);
		if (countFromUI != countValues[i]) {
			bool = false;
			logger.info("Count is NOT matching for " + sectionLegends[i]);
		}
		else{
			logger.info("Count is matching for "+sectionLegends[i]);
		}
	}
	return bool;
}

/**
 * Method to verify JSON and UI values from Box Filter widgets
 * @param {Name of Widget for which you to evaluate count. with dynamic count values. Widget name, Widgetjosn object, Dynamic count to validate} widgetName 
 * @param {Json object for a widget from expected data JSON} widgetJsonObj 
 */
async function verifyValuesFromJSONAndUIForBoxFiltersDynamic(widgetName, widgetJsonObj,keysCountVal) {
	var bool = true;
	// Section legend keys
	var sectionLegends = util.getJSONObjectKeys(widgetJsonObj);
	// Count values
	var countValues = util.getJSONObjectValues(widgetJsonObj);
	// Validating values for keyscountVal count
	var keysCounter = sectionLegends.length;
	if (keysCounter > keysCountVal) {
		keysCounter = keysCountVal;
	}
	for (var i = 0; i < keysCounter; i++) {
		var countFromUI = await getCountFromBoxFilterSections(widgetName, sectionLegends[i]);
		if (countFromUI != countValues[i]) {
			bool = false;
			logger.info("Count is NOT matching for " + sectionLegends[i]);
		}
		else{
			logger.info("Count is matching for "+sectionLegends[i]);
		}
	}
	return bool;
}

/**
 * Method to get list of count from table widget as a row
 * @param {Name of Widget for which you to evaluate count} widgetName 
 * @param {Row name from the table widget} rowName 
 */
function getCountListForTableWidget(widgetName, rowName){
	var EC = protractor.ExpectedConditions;
	var countList = [];
	var tableCss = tableWidgetCss.format(widgetName);
	var cellValuesXpath = tableWidgetCellValuesXpath.format(widgetName, rowName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	return element.all(by.xpath(cellValuesXpath)).getText().then(function(cellDataList){
		for(var i=0; i<cellDataList.length; i++){
			countList.push(util.stringToInteger(cellDataList[i]));
		}
		logger.info("List of row values for row : "+rowName+" is : "+countList);
		return countList;
	});
}

/**
 * Method to verify JSON and UI values from Table widgets
 * @param {Name of Widget for which you to evaluate count} widgetName 
 * @param {Json object for a widget from expected data JSON} widgetJsonObj 
 */
async function verifyValuesFromJSONAndUIForTableWidget(widgetName, widgetJsonObj){
	var bool = true;
	var rowNames = util.getJSONObjectKeys(widgetJsonObj);
	for(var i=0; i<rowNames.length; i++){
		var rowValuesFromUI = await getCountListForTableWidget(widgetName, rowNames[i]);
		var rowValues = util.getDataFromElasticViewJSON(widgetJsonObj, rowNames[i]);
		var rowValuesFromJson = util.getJSONObjectValues(rowValues);
		if(!util.compareArrays(rowValuesFromJson, rowValuesFromUI)){
			bool = false;
			logger.info("List of count values in JSON are NOT matching with UI for " + rowNames[i] + " row label.");
		}
		else{
			logger.info("List of count values in JSON are matching with UI for " + rowNames[i] + " row label.");
		}
	}
	return bool;
}

/**
 * Method to click on First button for ticket details table pagination
 */
function clickOnTicketDetailsFirstButton(){
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(ticketDetailsTableFirstButtonCss))), timeout.timeoutInMilis);
	return element(by.css(ticketDetailsTableFirstButtonCss)).click().then(function () {
		util.waitForInvisibilityOfKibanaDataLoader();
		logger.info("Clicked on First pagination button..");
	});
}

/**
 * Method to click on Next button for ticket details table pagination
 */
function clickOnTicketDetailsNextButton(){
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(ticketDetailsTableNextButtonCss))), timeout.timeoutInMilis);
	return element(by.css(ticketDetailsTableNextButtonCss)).click().then(function () {
		util.waitForInvisibilityOfKibanaDataLoader();
		logger.info("Clicked on Next pagination button..");
	});
}

/**
 * Method to click on Last button for ticket details table pagination
 */
function clickOnTicketDetailsLastButton(){
	var EC = protractor.ExpectedConditions;
	browser.wait(EC.visibilityOf(element(by.css(ticketDetailsTableLastButtonCss))), timeout.timeoutInMilis);
	return element(by.css(ticketDetailsTableLastButtonCss)).click().then(function () {
		util.waitForInvisibilityOfKibanaDataLoader();
		logger.info("Clicked on Last pagination button..");
	});
}

/**
 * Method to get page count in ticket details table
 */
function getPageCountForTicketDetailsTable() {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(ticketDetailsTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element(by.css(ticketDetailsTableLastButtonCss)).getAttribute("class").then(async function (attrVal1) {
		return element(by.css(ticketDetailsTableFirstButtonCss)).getAttribute("class").then(async function (attrVal2) {
			if (attrVal1.includes("disabled") && attrVal2.includes("disabled")) {
				logger.info("First and Last page of table are same, Count of pages in table is: 1");
				return 1;
			}
			else if (attrVal1.includes("disabled")) {
				logger.info("Already on Last page of table");
				browser.wait(EC.visibilityOf(element(by.css(ticketDetailsTableActivePageButtonCss))), timeout.timeoutInMilis);
				return element(by.css(ticketDetailsTableActivePageButtonCss)).getText().then(function (lastPageNum) {
					logger.info("Count of pages in table is: " + lastPageNum);
					return lastPageNum;
				});
			}
			else {
				await clickOnTicketDetailsLastButton();
				browser.wait(EC.visibilityOf(element(by.css(ticketDetailsTableActivePageButtonCss))), timeout.timeoutInMilis);
				return element(by.css(ticketDetailsTableActivePageButtonCss)).getText().then(function (lastPageNum) {
					logger.info("Count of pages in table is: " + lastPageNum);
					return lastPageNum;
				});
			}
		});
	});
}

/**
 * Method to check if the ticket number present in ticket details table or not
 * @param {Ticket number from ticket details table to be verify} ticketNumber 
 */
async function isTicketNumberPresentInTicketDetailsTable(ticketNumber) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(ticketDetailsTableRowsCss)).get(0)), timeout.timeoutInMilis);
	var pageCount = await getPageCountForTicketDetailsTable();
	if (pageCount > 1) {
		await clickOnTicketDetailsFirstButton();
	}
	for (var i = 0; i < pageCount; i++) {
		browser.wait(EC.visibilityOf(element.all(by.css(ticketDetailsTableRowsCss)).get(0)), timeout.timeoutInMilis);
		var ticketNumbersList = await element.all(by.css(ticketDetailsTableTicketNumberValuesCss)).getText();
		var j = 0;
		for (j = 0; j < ticketNumbersList.length; j++) {
			if (ticketNumbersList[j] == ticketNumber) {
				logger.info("Ticket number " + ticketNumber + " found in table on page number " + (i + 1));
				return true;
			}
		}
		if (j == ticketNumbersList.length) {
			logger.info("Ticket number " + ticketNumber + " not found in table on page number " + (i + 1) + ".. Searching in next page.");
			await clickOnTicketDetailsNextButton();
		}
	}
	if (i == pageCount) {
		logger.info("Ticket number " + ticketNumber + " not found in table.");
		return false;
	}
}

/**
 * Get all the names in list from Name list widget
 * @param {Name of the widget} widgetName 
 */
function getAllNamesFromNameListWidget(widgetName){
	var EC = protractor.ExpectedConditions;
	var filteredNameList = [];
	var namesListXpath = namesListForNameListWidgetXpath.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(namesListXpath)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(namesListXpath)).getText().then(function(namesList){
		for(var i=0; i<namesList.length; i++){
			if(namesList[i] != ""){
				filteredNameList.push(namesList[i]);
			}
		}
		logger.info("List of names in widget "+widgetName+" is: "+filteredNameList);
		return filteredNameList;
	});
}

/**
 * Method to click on any name from Name List Filter
 * @param {Widget name; Ex. 'Top 50 Servers' on Pervasive Insights} widgetName
 * @param {Server name from 'Top 50 Servers' widget} sectionName
 */
function clickOnSectionInNameListsFilters(widgetName, sectionName) {
	var EC = protractor.ExpectedConditions;
	var nameListFilterSection = nameListFilterSectionsXpath.format(widgetName, sectionName);
	util.waitForAngular();
	return element(by.xpath(nameListFilterSection)).isDisplayed().then(function(isPresent){
		if(isPresent){
			return element(by.xpath(nameListFilterSection)).click().then(function () {
				logger.info("Clicked on " + sectionName + " from " + widgetName + " filter");
				return true;
			});
		}
	}).catch(function(){
		logger.info(sectionName+" not found in name map widget "+widgetName);
		return false;
	})
}

/**
 * Get list of count for each section in Name list widget
 * @param {Name of the name list widget} widgetName 
 * @param {List of names in Name list widget} namesList 
 */
async function getListOfCountForNameListWidgetSections(widgetName, namesList){
	var totalCountList = [];
	var namesListLength = namesList.length;
	util.waitForAngular();
	for(var i=0; i<namesListLength; i++){
		var bool = await clickOnSectionInNameListsFilters(widgetName,namesList[i]);
		if(bool){
			var summaryValuesList = await getSummaryValuesListFromTableWidget(problemMgmntTestData.ticketCount);
			totalCountList.push(summaryValuesList[0]);
			util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
	}
	logger.info("List of count for widget "+widgetName+" is: ",totalCountList);
	return totalCountList;
}

/**
 * Method to get y-axis label index from heat map filter
 * @param {Widget name; Ex. Top Servers On Issues from Pervasive Insights} widgetName
 * @param {Y axis labels like for widget 'Top Servers On Issues' values can be Unclassified Actionable, Service In Alert, Database, etc.} YAxisLabel
 */
async function getYAxisLabelIndexForHeatMapFilter(widgetName, YAxisLabel) {
	var EC = protractor.ExpectedConditions;
	var YAxisLabels = heatMapFilterYAxisLabelsCss.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(YAxisLabels)).get(0)), timeout.timeoutInMilis);
	var labelsCount = await element.all(by.css(YAxisLabels)).count();
	var i = 0;
	for (i = 0; i < labelsCount; i++) {
		var labelText = await element.all(by.css(YAxisLabels)).get(i).getText();
		if (labelText == YAxisLabel) {
			var labelIndex = i + 1;
			logger.info("Row Index for " + YAxisLabel + " row is : " + labelIndex);
			return labelIndex;
		}
	}
	if (i == labelsCount) {
		logger.info(YAxisLabel + " not found.");
		return 0;
	}
}

/**
 * Method to get y-axis labels list from heat map filter
 * @param {Widget name; Ex. Top Servers On Issues from Pervasive Insights} widgetName 
 */
function getYAxisLabelsListForHeatMapFilter(widgetName) {
	var EC = protractor.ExpectedConditions;
	var YAxisLabel = heatMapFilterYAxisLabelsCss.format(widgetName);
	util.waitForAngular();
	browser.wait(EC.presenceOf(element.all(by.css(YAxisLabel)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(YAxisLabel)).getText().then(function (labelList) {
		var filteredLabelList = [];
		for(var i=0; i<labelList.length; i++){
			if(labelList[i] != ''){
				filteredLabelList.push(labelList[i]);
			}
		}
		logger.info("Y-Axis Label List is : " + filteredLabelList);
		return filteredLabelList;
	});
}

/**
 * Method to get row value list from heat map filter
 * @param {Widget name; Ex. Top Servers On Issues from Pervasive Insights} widgetName 
 * @param {Y axis labels like for widget 'Top Servers On Issues' values can be Unclassified Actionable, Service In Alert, Database, etc.} YAxisLabel 
 */
function getRowValueListFromHeatmapFilter(widgetName, YAxisLabel) {
	var EC = protractor.ExpectedConditions;
	var filterRows = heatMapFilterRowsCss.format(widgetName);
	var intRowValuesList = [];
	util.waitForAngular();
	return browser.wait(EC.visibilityOf(element.all(by.css(filterRows)).get(0)), timeout.timeoutInMilis).then(async function () {
		var labelIndex = await getYAxisLabelIndexForHeatMapFilter(widgetName, YAxisLabel);
		var rowValuesXpath = heatMapFilterRowValuesXpath.format(widgetName, labelIndex);
		return element.all(by.xpath(rowValuesXpath)).getText().then(function (rowValuesList){
			for(var i=0; i<rowValuesList.length; i++){
				if(rowValuesList[i] != '0'){
					intRowValuesList[i] = util.stringToInteger(rowValuesList[i]);
				}
				else{
					logger.info("Skipped, as value count is 0");
				}
			}
			// Remove empty elements
			var filteredList = intRowValuesList.filter(function (ele) { 
                return ele != null;
            });
			logger.info("List of row values from UI for " + YAxisLabel + " is : " + filteredList);
			return filteredList;
		});
	});
}

/**
 * Get list of row-wise count list from Heat map widget using Name map widget
 * @param {Name of heat map widget from kibana report} widgetName 
 * @param {Name of name map widget from kibana report} nameMapWidgetName
 * @param {y-axis labels list fot heat map widget} yAxisLabels 
 */
async function getListOfCountListUsingNameMapWidgetFromHeatMapWidget(widgetName, nameMapWidgetName, yAxisLabels){
	var totalCountList = [];
	var yAxisLabelsListLength = yAxisLabels.length;
    if(yAxisLabelsListLength > 5){
        yAxisLabelsListLength = 5;
    }
	var i=0;
	for(i=0; i<yAxisLabelsListLength; i++){
		var countListForYAxisLabel = [];
		var bool = await clickOnSectionInNameListsFilters(nameMapWidgetName, yAxisLabels[i]);
		if(bool){
			await util.waitForInvisibilityOfKibanaDataLoader();
			countListForYAxisLabel = await getRowValueListFromHeatmapFilter(widgetName, yAxisLabels[i]);
		}
		totalCountList.push(countListForYAxisLabel);
		util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
	}
	logger.info("Total count list of list for "+widgetName+" :", totalCountList);
	return totalCountList;
}

/**
 * Method to verify values from expected JSON with UI values for Heat map Widgets
 * @param {Widget name; Ex. Top Servers On Issues from Pervasive Insights} widgetName 
 * @param {Json object for a widget from expected data JSON} jsonObjForWidget 
 */
async function verifyValuesFromJSONAndUIForHeatMapWidget(widgetName, jsonObjForWidget) {
	var bool = true;
	// Get all keys from JSON
	var jsonObjKeys = util.getJSONObjectKeys(jsonObjForWidget);
	// Get Y-axis labels list
	var listOfYAxisLabels = await getYAxisLabelsListForHeatMapFilter(widgetName);
	var j = 0;
	for (j = 0; j < listOfYAxisLabels.length; j++) {
		var rowValuesListFromJSON = [];
		for (var i = 0; i < jsonObjKeys.length; i++) {
			// Get JSON object for specific key
			var jsonObj = jsonObjForWidget[jsonObjKeys[i]];
			// If key is present, then push the value to the list
			if (jsonObj.hasOwnProperty(listOfYAxisLabels[j])) {
				rowValuesListFromJSON.push(jsonObj[listOfYAxisLabels[j]]);
			}
		}
		logger.info("List of row values from JSON for " + listOfYAxisLabels[j] + " is : " + rowValuesListFromJSON);
		// Get row values list from UI
		var rowValuesListFromUI = await getRowValueListFromHeatmapFilter(widgetName, listOfYAxisLabels[j]);
		if(!util.compareArrays(rowValuesListFromJSON,rowValuesListFromUI)){
			bool = false;
			logger.info("List of row values in JSON matching with UI for "+listOfYAxisLabels[j]+" y-axis label are NOT matching.");
		}
		else{
			logger.info("List of row values in JSON matching with UI for "+listOfYAxisLabels[j]+" y-axis label are matching.");
		}
	}
	return bool;
}

/**
 * Method to count child elements from parents elements
 * Widget name: It will use in all places to find child count for parent element.
 * Params: priority widget title, priority widgetparent element xpath
 */
function childElementCount(priorityWidgetTitle, priorityWidTitleXpath) {
	util.waitForAngular();
	util.waitForInvisibilityOfKibanaDataLoader();
	var EC = protractor.ExpectedConditions;
	var priorityWidgetTitleXpathVal = priorityWidTitleXpath.format(priorityWidgetTitle);
	browser.wait(EC.presenceOf(element.all(by.xpath(priorityWidgetTitleXpathVal)).get(0)), timeout.timeoutInMilis);
	return element.all(by.xpath(priorityWidgetTitleXpathVal)).count().then(function (elemns) {
		return elemns;
	});
}

/**
 * Method to get all tooltip value in priority view dynamically
 * Widget name: Priority widget ( It can be used in all treemap widget)
 * Params: Priority widget title, priority widget title xpath
 */
async function getTreemapHoverTooltipValue(widgetTitle) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var priorityTotalVal = 0;
	var toolTipCount;
	var totalCountValue = await childElementCount(widgetTitle, priorityWidgetTitleXpath);
	var priorityWidgetTitleXpathVal = priorityWidgetTitleXpath.format(widgetTitle);
	for (var i = 0; i < totalCountValue; i++) {
		await browser.actions().mouseMove(element(by.xpath(priorityWidgetTitleXpathVal + "[@class='highcharts-point highcharts-color-" + i + "']"))).perform();
		browser.wait(EC.visibilityOf(element.all(by.css(treemapTooltipValueCss)).get(0)), timeout.timeoutInMilis);
		var toolTipText = await element(by.css(treemapTooltipValueCss)).getText();
		toolTipCount = parseInt(toolTipText.split(": ")[1].trim());
		logger.info(toolTipText);
		priorityTotalVal = priorityTotalVal + toolTipCount;
	}
	logger.info("Total Priority value " + ": " + priorityTotalVal);
	return priorityTotalVal;
}

function getCircleChartCountFromUIUsingLabel(widgetName, labelName){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var specificPathCss = circleChartPathCss.format(widgetName, labelName);
	return browser.wait(EC.visibilityOf(element(by.css(specificPathCss))), timeout.timeoutInMilis).then(async function(){
		await browser.actions().mouseMove(element(by.css(specificPathCss))).perform();
		var toolTipText = await element(by.css(circleChartPathCountToolTipTextCss)).getText();
		logger.info("Tootltip text for "+labelName+" : "+toolTipText);
		var count = toolTipText.split(" ")[0];
		logger.info("Count for "+labelName+" : "+count);
		return util.stringToInteger(count);
	}).catch(function(){
		logger.info(labelName+" not found");
		return 0;
    });
}

async function verifyCircleChartCountListFromUIWithESValues(widgetName, jsonObjForWidget){
	var bool = true;
	var countListFromUI = [];
	// Get all keys from JSON
	var legendNames = util.getJSONObjectKeys(jsonObjForWidget);
	var countListFromES = util.getJSONObjectValues(jsonObjForWidget);
	for(var i=0; i<legendNames.length; i++){
		var countForKey = await getCircleChartCountFromUIUsingLabel(widgetName, legendNames[i]);
		countListFromUI.push(countForKey);
	}
	logger.info("countListFromUI: ", countListFromUI);
	if(!util.compareArrays(countListFromES,countListFromUI)){
		bool = false;
		logger.info("List of count values in JSON matching with UI are NOT matching.");
	}
	else{
		logger.info("List of count values in JSON matching with UI are matching.");
	}
	return bool;
}

/**
 * Verify if the widget names are present on kibana report or not
 * widgetNameList - List of widget names
 */
async function verifyWidgetNamesPresentOnKibanaReport(widgetNameList){
	var bool = true;
	var widgetListFromUI = await getAllKibanaReportWidgetsNameText();
	// Check all widgets on Kibana report are 
	for(var i=0; i<widgetNameList.length; i++){
		if(!widgetListFromUI.includes(widgetNameList[i])){
			bool = false;
			logger.info(widgetNameList[i]+ " not present in kibana report widget name list.");
		}
	}
	if(bool == true){
		logger.info("All widget names are present in kibana report widget name list.");
	}
	return bool;
}

/**
 * Verify if the column names are present in ticket details table or not
 * columnNameList - List of column names
 */
async function verifyColumnNamesPresentInTicketDetailsTable(columnNameList){
	var bool = true;
	var columnListFromUI = await getTicketDetailsTableColumnNameList();
	// Check all column names in ticket details table
	for(var i=0; i<columnNameList.length; i++){
		if(!columnListFromUI.includes(columnNameList[i])){
			bool = false;
			logger.info(columnNameList[i]+ " not present in ticket details column name list.");
		}
	}
	if(bool == true){
		logger.info("All column names are present in ticket details column name list.");
	}
	return bool;
}

/**
 * Get list of column names from Table widget
 * @param {Name of the table widget from kibana report; Ex: Original Vs Actual Priority from Incident Management} widgetName 
 */
function getColumnNameListFromTableWidget(widgetName){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableColumnNamesCss = tableWidgetColumnNamesCss.format(widgetName);
	browser.wait(EC.visibilityOf(element.all(by.css(tableColumnNamesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(tableColumnNamesCss)).getText().then(function(colNameList){
		logger.info(widgetName+" table column names list: "+colNameList);
		return colNameList;
	});
}

/**
 * Get List of sum of column-wise values from Table widget
 * @param {Name of the table widget from kibana report; Ex: Original Vs Actual Priority from Incident Management} widgetName 
 */
async function getTotalCountListColumnWiseFromTableWidget(widgetName){
	var totalCountList = [];
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	var columnNameList = await getColumnNameListFromTableWidget(widgetName);
	for(var i=1; i<columnNameList.length; i++){
		var columnIndex = i+1;
		var totalCount = 0;
		var cellValueCss = tableWidgetColumnCellValuesCss.format(widgetName, columnIndex);
		await element.all(by.css(cellValueCss)).getText().then(function(columnValuesList){
			for(var j=0; j<columnValuesList.length; j++){
				totalCount = totalCount + util.stringToInteger(columnValuesList[j]);
			}
			logger.info("Sum of all values from "+columnNameList[i]+" is: "+ totalCount);
		});
		totalCountList.push(totalCount);
	}
	logger.info("Total count List for "+widgetName+" is : "+totalCountList);
	return totalCountList;
}

/**
 * Get column index from table widget
 * @param {Name of the Table widget} widgetName 
 * @param {Name of the column in Table widget} columnName 
 */
async function getColumnIndexFromTableWidget(widgetName, columnName){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var columnIndex = 0;
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	var columnNameList = await getColumnNameListFromTableWidget(widgetName);
	var i=0;
	for(i=0; i<columnNameList.length; i++){
		if(columnNameList[i] == columnName){
			columnIndex = i+1;
			logger.info("Column index for "+columnName+" is: "+columnIndex);
			return columnIndex;
		}
	}
	if(i == columnNameList.length){
		logger.info("Column name is not found in "+widgetName);
		return columnIndex;
	}
}

/**
 * Check if cell value is empty or unknown
 * @param {Name of the Table widget} widgetName 
 * @param {Name of the column in Table widget} columnName 
 * @param {Row Index for cell value} rowIndex 
 */
async function checkNonEmptyNonUnknownCellValueFromTable(widgetName, columnName, rowIndex){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	var columnIndex = await getColumnIndexFromTableWidget(widgetName, columnName);
	var cellValueCss = tableWidgetCellValueCss.format(widgetName, rowIndex, columnIndex);
	var cellValue = await element(by.css(cellValueCss)).getText();
	logger.info("cellValue:"+cellValue);
	if(!(cellValue == '' || cellValue == 'Unknown')){
		logger.info("Cell value for "+columnName+" at row index is NOT Empty or Unknown.");
		return true;
	}
	else{
		logger.info("Cell value for "+columnName+" at row index is Empty or Unknown.");
		return false;
	}
}

/**
 * Get column wise count list from table widget
 * @param {Name of the Table widget} widgetName 
 * @param {Name of the column in Table widget} columnName 
 */
async function getColumnWiseCountListFromTableWidget(widgetName, columnName){
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	var columnIndex = await getColumnIndexFromTableWidget(widgetName, columnName);
	var cellValuesList = [];
	var cellValueCss = await tableWidgetColumnCellValuesCss.format(widgetName, columnIndex);
	await element.all(by.css(cellValueCss)).getText().then(async function(columnValuesList){
		for(var j=0; j<columnValuesList.length; j++){
			var rowIndex = j+1;
			var cellValueStatus = await checkNonEmptyNonUnknownCellValueFromTable(widgetName, problemMgmntTestData.PriorityColumnName, rowIndex);
			if(cellValueStatus == true){
				if(util.hasNumber(columnValuesList[j])){
					// If contains '0', dont push it
					if(columnValuesList[j] != '0'){
						cellValuesList.push(util.stringToFloat(await util.getNumberFromString(columnValuesList[j])));
					}
				}
			}
		}
	});
	logger.info("List of cell values from "+columnName+" is : "+cellValuesList);
	return cellValuesList;
}

/**
 * Get column-wise list of list of cell values from table widget
 * @param {Name of the table widget from kibana report; Ex: Original Vs Actual Priority from Incident Management} widgetName 
 */
async function getListOfCountListColumnWiseFromTableWidget(widgetName){
	var listOfListOfColumnValues = [];
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	var columnNameList = await getColumnNameListFromTableWidget(widgetName);
	for(var i=1; i<columnNameList.length; i++){
		if(!columnNameList[i].includes('Unknown')){
			var columnIndex = i+1;
			var cellValuesList = [];
			var cellValueCss = await tableWidgetColumnCellValuesCss.format(widgetName, columnIndex);
			await element.all(by.css(cellValueCss)).getText().then(async function(columnValuesList){
				for(var j=0; j<columnValuesList.length; j++){
					if(util.hasNumber(columnValuesList[j])){
						// If contains '0', dont push it
						if(columnValuesList[j] != '0'){
							cellValuesList.push(util.stringToFloat(await util.getNumberFromString(columnValuesList[j])));
						}
					}
				}
				// Sort in descending order and slice list to length of 5
				if(cellValuesList.length > 5){
					cellValuesList = cellValuesList.sort(function(a, b){return b-a}).slice(0, 5);
				}
				else{
					cellValuesList.sort(function(a, b){return b-a});
				}
				logger.info("List of cell values from "+columnNameList[i]+" in UI is: "+ cellValuesList);
			});
			listOfListOfColumnValues.push(cellValuesList);
		}
	}
	logger.info("List of list of column values from "+widgetName+" in UI is :", listOfListOfColumnValues);
	return listOfListOfColumnValues;
}

/**
 * Get row-wise list of list of count values from table widget
 * @param {Name of the table widget from kibana report; Ex: Original Vs Actual Priority from Incident Management} widgetName 
 * @param {First column cell values list i.e. Row filter names} firstColCellValuesList 
 */
async function getListOfCountListRowWiseFromTableWidget(widgetName, firstColCellValuesList){
	var listOfCountList = [];
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	await browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis).then(async function(){
		for(var i=0; i<firstColCellValuesList.length; i++){
			var countValueXpath = countValueFromTableWidgetXpath.format(widgetName, firstColCellValuesList[i]);
			await element.all(by.xpath(countValueXpath)).getText().then(function(countList){
				var filteredCountList = [];
				for(var j=0; j<countList.length; j++){
					// If contains '0' and ' - ', dont push it
					if(!(countList[j].includes('-'))){
						if(countList[j] != '0'){
							var val = util.stringToFloat(countList[j]);
							logger.info("Value for "+firstColCellValuesList[i]+" in "+j+": "+val);
							filteredCountList.push(val);
						}
					}
				}
				logger.info("Count List for "+firstColCellValuesList[i]+" is:", filteredCountList);
				listOfCountList.push(filteredCountList);
			});
		}
	});
	logger.info("List of count list from "+widgetName+" is :",listOfCountList);
	return listOfCountList;
}

/**
 * Get List of summary values from Table widget
 * @param {Name of the table widget from kibana report; Ex: Original Vs Actual Priority from Incident Management} widgetName 
 */
async function getSummaryValuesListFromTableWidget(widgetName){
	var summaryValueCount = 0;
	var summaryValuesList = [];
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	var columnNameList = await getColumnNameListFromTableWidget(widgetName);
	for(var i=1; i<columnNameList.length; i++){
		var columnIndex = i+1;
		var summaryCellValueCss = tableWidgetSummaryCellValuesCss.format(widgetName, columnIndex);
		await element(by.css(summaryCellValueCss)).getText().then(function(summaryValue){
			summaryValueCount = util.stringToInteger(summaryValue);
			logger.info("Summary count value from "+columnNameList[i]+" is: "+summaryValueCount);
		});
		summaryValuesList.push(summaryValueCount);
	}
	logger.info("Summary values List for "+widgetName+" is : "+summaryValuesList);
	return summaryValuesList;
}

/**
 * Get list of all first column cell values from table widget
 * @param {Name of the table widget from kibana report; Ex: Contact Type from Problem Management} widgetName 
 */
async function getFirstColumnCellValuesListFromTableWidget(widgetName){
	var firstColumnCellValuesList = [];
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	await util.waitForInvisibilityOfKibanaDataLoader();
	var cellValuesCss = firstColumnCellValuesFromTableWidgetCss.format(widgetName);
	var tableCss = tableWidgetCss.format(widgetName);
	await util.scrollToWebElement(element(by.css(tableCss)));
	await browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	return element.all(by.css(cellValuesCss)).getText().then(function(cellValuesList){
		for(var i=0; i<cellValuesList.length; i++){
			if(!(cellValuesList[i] == '' | cellValuesList[i] == 'Unknown')){
				firstColumnCellValuesList.push(cellValuesList[i]);
			}
		}
		logger.info("First column cell values list from "+widgetName+" is :",firstColumnCellValuesList);
		return firstColumnCellValuesList;
	});
}

/**
 * Get count list from 2 column table widget
 * @param {Name of the 2 column table widget from kibana report; Ex: Contact Type from Problem Management} widgetName 
 */
async function getCountListFrom2ColumnsTableWidget(widgetName, firstColCellValuesList){
	var countList =[];
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var tableCss = tableWidgetCss.format(widgetName);
	browser.wait(EC.visibilityOf(element(by.css(tableCss))), timeout.timeoutInMilis);
	for(var i=0; i<firstColCellValuesList.length; i++){
		var countValueXpath = countValueFromTableWidgetXpath.format(widgetName, firstColCellValuesList[i]);
		await element(by.xpath(countValueXpath)).getText().then(function(countValue){
			countList.push(util.stringToInteger(countValue));
		});
	}
	logger.info("Count list from "+widgetName+" is :", countList);
	return countList;
}


/**
 * Method to get Total tooltip count from donut chart widgets in PIA
 * Eg : Capacity vs Non Capacity, OS vs Non OS Drive & Server Region
 *  @param { Name of card on Kibana report} widgetTitle
 */
async function getTooltipCountFromDonutChart(widgetTitle) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var donutChartTotalVal = 0;
	var toolTipCount;
	logger.info("widgetTitle : " + widgetTitle);
	var childCount = await childElementCount(widgetTitle, donutWidgetTitleXpath);
	var donutWidgetTitleXpathVal = donutWidgetTitleXpath.format(widgetTitle);
	for (var i = 1; i < childCount; i++) {
		let size = await element.all(by.xpath(donutWidgetTitleXpathVal)).get(i).getSize();
		let dataLabel = await element.all(by.xpath(donutWidgetTitleXpathVal)).get(i).getAttribute('data-label');
		logger.info('count : ' + i + ' size : ' + size['width'] + ' label :' + dataLabel);
		let xpoint = 3;
		await browser.actions().mouseMove(element.all(by.xpath(donutWidgetTitleXpathVal)).get(i)).mouseMove({ x: xpoint, y: 0 }).perform();
		browser.wait(EC.visibilityOf(element.all(by.css(donutChartTooltipValueCss)).get(0)), timeout.timeoutInMilis);
		var toolTipText = await element(by.css(donutChartTooltipValueCss)).getText();
		toolTipCount = util.stringToInteger((toolTipText.split("\n")[3]).split(" ")[0]);
		logger.info(toolTipCount);
		donutChartTotalVal = donutChartTotalVal + toolTipCount;
	}
	logger.info(`${widgetTitle} Total donutChart value : ${donutChartTotalVal}`);
	return donutChartTotalVal;
}

/**
 * Click on donut chart for applying local filter
 * param: Widget Title
 */
async function clickPortionDonutChart(widgetTitle) {
	util.waitForAngular();
	let xpoint = 1;
	var donutWidgetTitleXpathVal = donutWidgetTitleXpath.format(widgetTitle);
	await browser.actions().mouseMove(element.all(by.xpath(donutWidgetTitleXpathVal)).get(1)).mouseMove({ x: xpoint, y: 0 }).click().perform();
	logger.info('Part of Donut chart is clicked');
}

/**
 * this functions  returns value of cloud tag card(Top 50 servers) on Kibana report
 * @param {*} cardName  Name of card on Kibana report
 */
async function getKabianaBoardCardCloudTagListBasedOnName(cardName) {
	var EC = protractor.ExpectedConditions;
	var cardValueXapth = KibanaCloudTagDataXpath.format(cardName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(cardValueXapth))), timeout.timeoutInMilis);
	return element.all(by.xpath(cardValueXapth)).getText().then(function (items) {
		var tagList = items ? items.toString().split(",") : [];
		logger.info(`${cardName} cloud tag list vals : ${tagList}`);
		return tagList;
	});
}

async function getPieChartPercentageUsingLegendName(widgetName, legendsList){
	var EC = protractor.ExpectedConditions;
	var totalCountList = [];
	util.waitForAngular();
	var childCount = await childElementCount(widgetName,pieChartTextValueXpath);
	logger.info('Count of elements found on Widget '+ childCount);
	if(childCount > 0){
		var i=0;
		for(i=0; i<legendsList.length; i++){
			var pieWidgetTitleXpathVal = pieChartLabelXpath.format(widgetName, legendsList[i]);
			var count = await element.all(by.xpath(pieWidgetTitleXpathVal)).count();
			if(count != 0){
				let labelText = await element(by.xpath(pieWidgetTitleXpathVal)).getText();
				var labelPercentageValue = parseFloat(labelText.match(/([\d.]+)/)[1]);
				totalCountList.push(labelPercentageValue);
			}
			else{
				logger.info(legendsList[i]+" not found in pie chart.");
				totalCountList.push(0);
			}
		}
		logger.info("Total count list from "+widgetName+" is: "+ totalCountList);
		return totalCountList;
	}
	else{
		logger.info("Child count of widget is 0.");
		return totalCountList;
	}
}

/**
 * Method to extract individual element data from pie chart (extracts both labels and values)
 */
async function getElementDataFrompieChart(widgetTitle) {
	var EC = protractor.ExpectedConditions;
	util.waitForAngular();
	var total=0;
	var Elements={};
	logger.info("widgetTitle : " + widgetTitle);
	var childCount = await childElementCount(widgetTitle,pieChartTextValueXpath);
	logger.info('Count of elements found on Widget '+ childCount);
	var pieWidgetTitleXpathVal = pieChartTextValueXpath.format(widgetTitle);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.xpath(pieWidgetTitleXpathVal)).get(0)), timeout.timeoutInMilis);
	for (var i = 0; i < childCount; i++) {
		if (childCount==0){
			logger.info("Child count of widget is zero, hence breaking the test case");
			break;
		}
		else{
			let val = await element.all(by.xpath(pieWidgetTitleXpathVal)).get(i).getText();
			let valueregex=val.match(/([\d.]+)/);
			let datavalue=parseFloat(valueregex[1]);
			logger.info("datavalue: ", datavalue);
			var dataLabel=val.replace(/[^a-z]/gi, '');
			if(dataLabel == "Missing"){
				dataLabel = null;
			}
			logger.info("dataLabel: ", dataLabel);
			total=total+datavalue;
			Elements[dataLabel]=Math.round(datavalue);
		}
	}
	logger.info('Element/s found in the widget', Elements, 'and ' + 'Sum Total of elements '+ total);
	return [Elements,total];
	}
/**
 * Method to sum the bar values and return the sum
 */
async function getSumStatusBarValue(widgetName) {
    logger.info("widgetName",widgetName);
    var sum=0;
	for (var i = 0; i < widgetName.length; i++) {
				sum=sum+widgetName[i];
			}
    return sum;
  }

/**
 * Method to extract individual element names from word cloud
 */
async function getNamesFromWordCloud(widgetTitle) {
	util.waitForAngular();
	var Variables=[];
	var childCount = await childElementCount(widgetTitle,wordCloudValueXpath);
	logger.info('Count of names found on widget '+ childCount);
	var wordCloudTitleXpathVal = wordCloudValueXpath.format(widgetTitle);
	util.waitForAngular();
	for (var i = 0; i < childCount; i++) {
		if (childCount==0) {
			logger.info("Childcount of Widget is Zero, hence breaking the test case");
			return;
		}
		else{
			let val = await element.all(by.xpath(wordCloudTitleXpathVal)).get(i).getAttribute("textContent");
			if(val != ""){
				Variables.push(val.replace(/\s\s+/g, ' '));
			}
		}
	}
	logger.info('Name/s found in the widget: '+ Variables);
	return Variables;
}

/**
 * Method to extract individual element names from word map excluding the names which contains [\n and \r] in text
 */
async function getFilteredNamesFromWordCloud(widgetTitle) {
	util.waitForAngular();
	var Variables=[];
	var childCount = await childElementCount(widgetTitle,wordCloudValueXpath);
	logger.info('Count of names found on widget '+ childCount);
	var wordCloudTitleXpathVal = wordCloudValueXpath.format(widgetTitle);
	util.waitForAngular();
	for (var i = 0; i < childCount; i++) {
		if (childCount==0) {
			logger.info("Child count of Widget is Zero, hence breaking the test case");
			return;
		}
		else{
			let val = await element.all(by.xpath(wordCloudTitleXpathVal)).get(i).getAttribute("textContent");
			if(val != ""){
				var match = /\r|\n/.exec(val);
				if(!match){
					Variables.push(val);
				}
			}
		}
	}
	logger.info('Filtered Name/s found in the widget: '+ Variables);
	return Variables;
}

/**
 * @param {Name of the table} tableName 
 * @param {column no of table from left to right ,i.e starts with 1} columnNo 
 * return list of all the values In Integer Form of a particular coulmn for given column no and table name
 */
	function getIntgerColumnDataBasedOnColumnNo(tableName, columnNo) {
		browser.sleep(5000);
		util.waitForInvisibilityOfKibanaDataLoader();
		let ColumnValueslist = [];
		var EC = protractor.ExpectedConditions;
		//data present in each column
		var tableColumnData = tableColumnDataXpath.format(tableName, columnNo);
		// gettig all values of data present in column of each row
		browser.wait(EC.visibilityOf(element.all(by.xpath(tableColumnData)).last()));
		return element.all(by.xpath(tableColumnData)).getText().then(function (columnValues) {
	
			for (var j =0 ; j<columnValues.length;j++)
			{
				if(columnValues[j] != '0')
				{			
				logger.info("column values for "+ tableName +" are : " + columnValues[j]);
				ColumnValueslist.push(util.stringToInteger(columnValues[j]));
				}
			}
			return ColumnValueslist;
			});
	}

/*
 getAllValuesofWordCloudGraph function helps you compare the results between 
 Data gathered from wordcloud widget on Dashboard vs Data gathered from Kibana Query
 
 Every single element from Wordcloud is compared and a Tag of "Matching" or "Not Matching"
 
 widget - Data Gathered from UI - Dashboard widget
 query - Data Extracted from Elastic Index
 */

function getAllValuesofWordCloudGraph(widget,query){
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

module.exports = {
	getTicketDetailsTableRowsCount:getTicketDetailsTableRowsCount,
	setTicketCountBelow10K:setTicketCountBelow10K,
	clickOnGraphFirstHorizontalBar:clickOnGraphFirstHorizontalBar,
	getFirstBarGraphToolTipText:getFirstBarGraphToolTipText,
	getColumnFirstValueBasedOnTableName:getColumnFirstValueBasedOnTableName,
	getKibanaBarGraphYaxisFirstLabelsBasedOnWidgetName:getKibanaBarGraphYaxisFirstLabelsBasedOnWidgetName,
	checkAscendingDescendingOrderOfTableItems:checkAscendingDescendingOrderOfTableItems,
	getColumnDataBasedOnColumnNo:getColumnDataBasedOnColumnNo,
	clickOnColumnIconBasedOnSortingOrder:clickOnColumnIconBasedOnSortingOrder,
	getTicketCountFromBoxLocalFilterTooltipText:getTicketCountFromBoxLocalFilterTooltipText,
	clickOnFirstBoxLocalFilter:clickOnFirstBoxLocalFilter,
	getLegendNamesFromLocalFilter:getLegendNamesFromLocalFilter,
	checkIfDataPresentOnwidget:checkIfDataPresentOnwidget,
	getKibanaBarGraphYaxisLabelsCountBasedOnWidgetName:getKibanaBarGraphYaxisLabelsCountBasedOnWidgetName,
	getColumnNamesBasedOnTableName:getColumnNamesBasedOnTableName,
	getAllKibanaReportWidgetsNameText:getAllKibanaReportWidgetsNameText,
	getAllFiltersButtonNameText:getAllFiltersButtonNameText,
	getAllTabsLinkText:getAllTabsLinkText,
	getLastupdatedInfoIconText:getLastupdatedInfoIconText,
	clickOnLastupdatedInfoIcon:clickOnLastupdatedInfoIcon,
	getKabianaBoardCardValueInKformatter:getKabianaBoardCardValueInKformatter,
	deselectFilterValue:deselectFilterValue,
	clearDateRangeFilter:clearDateRangeFilter,
	selectDateRangeFilterValue:selectDateRangeFilterValue,
	verifyDateRangeFilterPanelExpanded:verifyDateRangeFilterPanelExpanded,
	clickOnDateRangeFilterButton:clickOnDateRangeFilterButton,
	clickOnApplyFilterButton:clickOnApplyFilterButton,
	selectFilterValueBasedOnName:selectFilterValueBasedOnName,
	verifyFilterPanelExpanded:verifyFilterPanelExpanded,
	clickOnFilterButtonBasedOnName:clickOnFilterButtonBasedOnName,
	getDateRangeFilterDateDifference:getDateRangeFilterDateDifference,
	getGlobalFilterButtonToolTipText:getGlobalFilterButtonToolTipText,
	clickOnTabLink:clickOnTabLink,
	isTabLinkSelected:isTabLinkSelected,
	downloadTicketDetailsXlsx:downloadTicketDetailsXlsx,
	getTicketDetailsTableColumnNameList:getTicketDetailsTableColumnNameList,
	getKabianaBoardCardTextBasedOnName:getKabianaBoardCardTextBasedOnName,
	selectFirstFilterValueBasedOnName:selectFirstFilterValueBasedOnName,
	getTotalCountFromWaveGraphPoints:getTotalCountFromWaveGraphPoints,
	isDisplayedSelectFiltersDialogueBox:isDisplayedSelectFiltersDialogueBox,
	clickOnSelectFiltersDialogueBoxApplyButton:clickOnSelectFiltersDialogueBoxApplyButton,
	getKibanaBarGraphYaxisLabelsBasedOnWidgetName:getKibanaBarGraphYaxisLabelsBasedOnWidgetName,
	getTextValuesofHorizontalBar:getTextValuesofHorizontalBar,
	getCountFromVerticalBarChart:getCountFromVerticalBarChart,
	getCountFromWaveGraphPoints:getCountFromWaveGraphPoints,
	getCountFromBoxFilterSections:getCountFromBoxFilterSections,
	getCountFromHorizontalBarGraphWidget:getCountFromHorizontalBarGraphWidget,
	getPageCountForTicketDetailsTable:getPageCountForTicketDetailsTable,
	isTicketNumberPresentInTicketDetailsTable:isTicketNumberPresentInTicketDetailsTable,
	clickOnTicketDetailsFirstButton:clickOnTicketDetailsFirstButton,
	clickOnTicketDetailsNextButton:clickOnTicketDetailsNextButton,
	clickOnTicketDetailsLastButton:clickOnTicketDetailsLastButton,
	getYAxisLabelIndexForHeatMapFilter:getYAxisLabelIndexForHeatMapFilter,
	getRowValueListFromHeatmapFilter:getRowValueListFromHeatmapFilter,
	getYAxisLabelsListForHeatMapFilter:getYAxisLabelsListForHeatMapFilter,
	clickOnSectionInNameListsFilters:clickOnSectionInNameListsFilters,
	verifyValuesFromJSONAndUIForBoxFilters:verifyValuesFromJSONAndUIForBoxFilters,
	verifyValuesFromJSONAndUIForBoxFiltersDynamic:verifyValuesFromJSONAndUIForBoxFiltersDynamic,
	verifyValuesFromJSONAndUIForHeatMapWidget:verifyValuesFromJSONAndUIForHeatMapWidget,
	clickOnGlobalFilterLeftCarouselArrow:clickOnGlobalFilterLeftCarouselArrow,
	clickOnGlobalFilterRightCarouselArrow:clickOnGlobalFilterRightCarouselArrow,
	childElementCount: childElementCount,
	getTreemapHoverTooltipValue: getTreemapHoverTooltipValue,
	verifyFilterValuesInFilterPanel:verifyFilterValuesInFilterPanel,
	verifyValuesFromJSONAndUIForHorizontalBarGraph:verifyValuesFromJSONAndUIForHorizontalBarGraph,
	getCountListForBreakdownHorizontalBarGraphWidget:getCountListForBreakdownHorizontalBarGraphWidget,
	verifyValuesFromJSONAndUIForBreakdownHorizontalBarGraph:verifyValuesFromJSONAndUIForBreakdownHorizontalBarGraph,
	selectCustomDateRangeFilterValue:selectCustomDateRangeFilterValue,
	getCountListForTableWidget:getCountListForTableWidget,
	verifyValuesFromJSONAndUIForTableWidget:verifyValuesFromJSONAndUIForTableWidget,
	verifyWidgetNamesPresentOnKibanaReport:verifyWidgetNamesPresentOnKibanaReport,
	verifyColumnNamesPresentInTicketDetailsTable:verifyColumnNamesPresentInTicketDetailsTable,
	getYAxisLabelsForHorizontalBarGraphWidget:getYAxisLabelsForHorizontalBarGraphWidget,
	getCountListForHorizontalBarGraphWidget:getCountListForHorizontalBarGraphWidget,
	getColumnNameListFromTableWidget:getColumnNameListFromTableWidget,
	getTotalCountListColumnWiseFromTableWidget:getTotalCountListColumnWiseFromTableWidget,
	getSummaryValuesListFromTableWidget:getSummaryValuesListFromTableWidget,
	getCountListFrom2ColumnsTableWidget:getCountListFrom2ColumnsTableWidget,
	getFirstColumnCellValuesListFromTableWidget:getFirstColumnCellValuesListFromTableWidget,
	getListOfCountListRowWiseFromTableWidget:getListOfCountListRowWiseFromTableWidget,	
	getListOfCountListColumnWiseFromTableWidget:getListOfCountListColumnWiseFromTableWidget,
	getListOfTotalCountListFromMultiWaveGraphPoints:getListOfTotalCountListFromMultiWaveGraphPoints,
	getAllValuesFromMultiselectFilter:getAllValuesFromMultiselectFilter,
	verifySectionFromBoxFilterWidget:verifySectionFromBoxFilterWidget,
	getAllNamesFromNameListWidget:getAllNamesFromNameListWidget,
	getListOfCountForNameListWidgetSections:getListOfCountForNameListWidgetSections,
	verifySectionFromBoxFilterWidget:verifySectionFromBoxFilterWidget,
	getTooltipCountFromDonutChart:getTooltipCountFromDonutChart,
	getKabianaBoardCardCloudTagListBasedOnName:getKabianaBoardCardCloudTagListBasedOnName,
	getElementDataFrompieChart:getElementDataFrompieChart,
    getNamesFromWordCloud:getNamesFromWordCloud,
 	clickPortionDonutChart:clickPortionDonutChart,
 	getSumStatusBarValue:getSumStatusBarValue,
	getListOfSummaryCountListFromTableWidget:getListOfSummaryCountListFromTableWidget,
	getColumnIndexFromTableWidget:getColumnIndexFromTableWidget,
	getColumnWiseCountListFromTableWidget:getColumnWiseCountListFromTableWidget,
	getListOfListOfColumnValuesFromTableWidget:getListOfListOfColumnValuesFromTableWidget,
	verifyCountListWaveGraphPointsFromUIAndESQuery:verifyCountListWaveGraphPointsFromUIAndESQuery,
	getXAxisLabelsFromWaveGraph:getXAxisLabelsFromWaveGraph,
	getListOfCountListBasedOfEachWaveGraph:getListOfCountListBasedOfEachWaveGraph,
	getCountFromWaveGraphPointsUsingLegendName:getCountFromWaveGraphPointsUsingLegendName,
	getListOfCountListUsingNameMapWidgetFromHeatMapWidget:getListOfCountListUsingNameMapWidgetFromHeatMapWidget,
	getIntgerColumnDataBasedOnColumnNo:getIntgerColumnDataBasedOnColumnNo,
	getPieChartPercentageUsingLegendName:getPieChartPercentageUsingLegendName,
	getCircleChartCountFromUIUsingLabel:getCircleChartCountFromUIUsingLabel,
	verifyCircleChartCountListFromUIWithESValues:verifyCircleChartCountListFromUIWithESValues,
	getAllValuesofWordCloudGraph:getAllValuesofWordCloudGraph,
	getCountOfWaveGraphPoints:getCountOfWaveGraphPoints,
	getFilteredNamesFromWordCloud:getFilteredNamesFromWordCloud,
	clickOnWavePointGraphUsingIndex:clickOnWavePointGraphUsingIndex,
	getCountOnWavePointGraphUsingIndex:getCountOnWavePointGraphUsingIndex,
	clickOnUpdateFilterButton:clickOnUpdateFilterButton,
	getDaysFromDateRangeFilterToolTip:getDaysFromDateRangeFilterToolTip,
	clickOnTab:clickOnTab,
}