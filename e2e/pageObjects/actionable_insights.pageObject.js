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
		devicesIncidentTicketsSummaryTextXpath : "//div[@class='kbnAggTable__paginated']//span[text()='Summary']/../../../following-sibling::tbody//td",
		monthYearTabCss : "a.bx--tabs__nav-link",
		insightsCategoryTxtCss : "[class='embPanel__titleText']",
		insightsCategoriesCss : "div[class='mtrVis'] div div:not([class='mtrVis__value'])",
		insightsCategoriesNumCss : ".mtrVis__value span",
		resetFilterLinkXpath : "//a[contains(text(), 'Reset Filters')]",
		actionableInsightLinkXpath : "//a[contains(text(), 'Actionable Insights')]",
		insightsOverviewSearchFilterCss : "div.kuiLocalSearch input.ng-untouched",
		noResultsFoundSearchFilterCss : "p[i18n-id = 'tableVis.vis.noResultsFoundTitle']",
		insightsOverviewWidgetsRowtxtCss : ".kbnTableCellFilter__hover.text-left a",
		nextPageButtonFromTableCss : "[data-test-subj='paginateNext'] .euiButtonEmpty__content",
		insightsOverviewWidgetsFirstRowCountCss : ".kbnAggTable__paginated td.text-center",
		sectionHeaderNamesCss : "span.embPanel__titleText",
		noResultsFoundAdditionalDetailsTableXpath : "//*[@data-title='Additional Details for Monitors']//p[contains(text(),'No results found')]",
		additionalDetailsTableBodyCss : "[data-title='Additional Details for Monitors'] table.table-condensed tbody",
		additionalDetailsTableRowsXpath : "//*[@data-title='Additional Details for Monitors']//table[contains(@class,'table-condensed')]//tbody//div//ancestor::tr[1]",
		additionalDetailsTableLastPageXpath : "//*[contains(@class, 'pagination-sm')]//button[contains(@ng-click,'page.next')]//parent::li//preceding-sibling::li[1]/button/span",
		additionalDetailsTableFirstPageXpath : "//*[contains(@class, 'pagination-sm')]//button[contains(@ng-click,'page.prev')]//parent::li//following-sibling::li[1]/button/span",
		ticketsDetailsTableRowCountCss : "div.jsgrid-grid-body table.jsgrid-table tr",
		ticketsDetailsTableFirstPageBtnCss : "pagination li.pagination-first",
		ticketsDetailsTableLastPageBtnCss : "pagination li.pagination-last",
		ticketDetailsTableLastPageNumberXpath : "//pagination//li[contains(@class,'pagination-next')]//preceding-sibling::li[1]",
		ticketsDetailsTablePaginationNumber : "pagination li.pagination-page a",
		ticketDetailsTableFirstCellCss : "div.health-list-grid .jsgrid-grid-body table td:nth-child(2) p.tooltip-title",
		noDataCellTicketDetailsCss : "tr.jsgrid-nodata-row td",
		donutChartCss : "div.embPanel div.chart g.arcs",
		donutChartLabelsCss : "div.embPanel div.chart g.label text",
		donutChartLegendXpath : "//div[@class='chart']//ancestor::div[@class='visChart']//ul[@class='visLegend__list']//button[@title='{0}']",
		donutChartLegendDialogueCss : "div.visLegend__valueDetails",
		donutChartLegendDialogueAddBtnXpath : "//div[@class='visLegend__valueDetails']//input[contains(@data-test-subj, 'filterIn')]",
		donutChartLegendDialogueRemoveBtnXpath : "//div[@class='visLegend__valueDetails']//input[contains(@data-test-subj, 'filterOut')]",
		firstRowFromObservationTableCss : "div[data-title='Observations from data'] table.table-condensed tr ol li:nth-child(2)",
		secondRowFromObservationTableCss : "div[data-title='Observations from data'] table.table-condensed tr ol li:nth-child(3)"
};	

function actionable(selectorConfig) {
	if (!(this instanceof actionable)) {
		return new actionable(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to perform switch to default content then switch to frame 
 */
actionable.prototype.open = function(){
	util.waitForAngular();
	util.switchToDefault();
	util.waitForAngular();
	util.switchToFrameById(frames.mcmpIframe);
	util.waitForAngular();
};


/**
 * Method to get actionable insight incident tickets summary text title
 */
actionable.prototype.getActionableInsightIncidentTicketsSummaryText = function(){
	browser.wait(EC.visibilityOf(element(by.xpath(this.devicesIncidentTicketsSummaryTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.devicesIncidentTicketsSummaryTextXpath)).getText().then(function(summaryText){
		logger.info("actionable insights incident tickets summary text : "+summaryText);
		return summaryText;
	});
};


/**
 * Method to get numeric value from actionable insight incident tickets summary 
 */
actionable.prototype.getNumericValuefromIncidentTicketsSummary = function(){
	browser.wait(EC.visibilityOf(element(by.xpath(this.devicesIncidentTicketsSummaryTextXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.devicesIncidentTicketsSummaryTextXpath)).getText().then(function(summaryText){
		logger.info("Actionable insights overview summary text : "+summaryText);
		var numericvalue = Number(summaryText.match(/\d+/g)[0]);
		logger.info("Ticket count from Summary text : ", numericvalue);
		return numericvalue;
	});
};


/**
 * Method to get month & year section tab based on input provided
 */
actionable.prototype.getMonthAndYearTabText = function(index){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.monthYearTabCss)).get(index)), timeout.timeoutInMilis);
	return element.all(by.css(this.monthYearTabCss)).get(index).getText().then(function(monthYearText){
		logger.info("actionable insights month and year text : "+monthYearText);
		return monthYearText;
	});
};


/**
 * Method to click on month & year section tab based on input provided
 */
actionable.prototype.clickOnMonthAndYearTab = function(index){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.css(this.monthYearTabCss)).get(index)), timeout.timeoutInMilis);
	element.all(by.css(this.monthYearTabCss)).get(index).click().then(function(){
		logger.info("clicked on actionable insights month and year tab");
	});
};


/**
 * Method to get on insights category header text
 */
actionable.prototype.getInsightsCategoryHeaderText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.insightsCategoryTxtCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.insightsCategoryTxtCss)).get(0).getText().then(function(insightsCategoryHeader){
		logger.info("Insights category header text "+ insightsCategoryHeader);
		return insightsCategoryHeader;
	});	
};


/**
 * Method to get on insights 6 different category text
 */
actionable.prototype.getInsightsCategoriesText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.insightsCategoriesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.insightsCategoriesCss)).getText().then(function(insightsCategories){
		logger.info("actionable insights categories text : "+insightsCategories);
		var myList = new Array();
		for(var i = 0; i < insightsCategories.length; i++){
			var value = insightsCategories[i].toString().split("-")[0];
			myList.push(value.trim());
		}
		logger.info("actionable insights categories text list : "+myList);
		return myList;
	});
};


/**
 * Method to get total sum of insights category count based on numeric data
 */
actionable.prototype.getTotalInsightsCategoriesCount = async function(){
	util.waitForAngular();
	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	await browser.wait(EC.visibilityOf(element.all(by.css(this.insightsCategoriesNumCss)).get(0)), timeout.timeoutInMilis);
	return await element.all(by.css(this.insightsCategoriesNumCss)).getText().then(function(insightsCategoriesNum){
		logger.info("actionable insights categories numeric text : "+insightsCategoriesNum);
		var total = 0;
		for(var i = 0; i < insightsCategoriesNum.length; i++){
			total = total + parseInt(insightsCategoriesNum[i]);
		}
		logger.info("total count : "+total);
		return total;
	});
};


/**
 * Method to click on insights category number index based on input provided
 */
actionable.prototype.clickOnInsightsCategoryNumber = function(index){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element.all(by.css(this.insightsCategoriesNumCss)).get(index)), timeout.timeoutInMilis);
	element.all(by.css(this.insightsCategoriesNumCss)).get(index).click().then(function(){
		logger.info("Clicked on insights category numeric data");		
	});
};


var total = 0;
var totalCount = 0;
/**
 * Method to get total rows from table from all the pages
 */
actionable.prototype.getTotalRowCountFromTable = async function(){
	util.waitForAngular();
	var self = this;	
	var nextButton = element(by.css(self.nextPageButtonFromTableCss));	
	browser.wait(EC.visibilityOf(element.all(by.css(self.insightsOverviewWidgetsRowtxtCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(self.insightsOverviewWidgetsRowtxtCss)).count().then(async function(count){
		total = total + count;		
		await browser.wait(EC.elementToBeClickable(nextButton), 15*1000).then(async function(){
			await nextButton.click().then(async function(){
				logger.info("Clicked on next button");
				await self.getTotalRowCountFromTable();
			});
		}).catch(function(){
			logger.info("From catch block");
			totalCount = total;
			total = 0;
		});
		return await browser.wait(EC.visibilityOf(element.all(by.css(self.insightsOverviewWidgetsRowtxtCss)).get(0)), timeout.timeoutInMilis).then(async function(){
			logger.info("Total row count : "+totalCount);
			return totalCount;
		});
	});	
};

/**
 * Method to get total ticket counts from first row text of observation table
 */
actionable.prototype.getTotalCountFromObservationFirstRowText = function(){
	util.waitForAngular();
	var self = this;
	var totalCount = 0;
	var spiltedTextList = "";
	browser.wait(EC.visibilityOf(element(by.css(this.firstRowFromObservationTableCss))), timeout.timeoutInMilis);
	return element(by.css(this.firstRowFromObservationTableCss)).getAttribute("innerText").then(async function(firstRowText){
		logger.info("First Row text from Observation table: "+firstRowText);
		if(firstRowText.includes('Note:')){
			await browser.wait(EC.visibilityOf(element(by.css(self.secondRowFromObservationTableCss))), timeout.timeoutInMilis);
			var secondRowText = await element(by.css(self.secondRowFromObservationTableCss)).getAttribute("innerText")
			logger.info("Second Row text from Observation table: "+secondRowText);
			spiltedTextList = secondRowText.split("(");
		}
		else{
			spiltedTextList = firstRowText.split("(");
		}
		logger.info("Splited text list:", spiltedTextList);
		for(var i=1; i<spiltedTextList.length; i++){
			var count = Number(spiltedTextList[i].split(" ")[0]);
			logger.info("Count:", count);
			totalCount = totalCount + count;
		}
		logger.info("Total count from Observation table first row:", totalCount);
		return totalCount;
	});
}

/**
 * Method to get list of labels from Donut chart
 */
actionable.prototype.getListOfDonutChartLabelsText = async function(){
	var labelsList = [];
	await browser.actions().mouseMove(element(by.css(this.donutChartCss))).perform();
	await browser.wait(EC.visibilityOf(element(by.css(this.donutChartCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.donutChartLabelsCss)).getText().then(function(donutChartLabels){
		for(var i=0; i<donutChartLabels.length; i++){
			labelsList.push(donutChartLabels[i].split("(")[0].trim());
		}
		logger.info("Donut chart labels list: ", labelsList);
		return labelsList;
	});
}

/**
 * Method to get percentage(%) value for a specific label from donut chart
 * @param {Label name from donut chart} labelName 
 */
actionable.prototype.getPercentageValueForDonutChartLabel = async function(labelName){
	await browser.actions().mouseMove(element(by.css(this.donutChartCss))).perform();
	await browser.wait(EC.visibilityOf(element(by.css(this.donutChartCss))), timeout.timeoutInMilis);
	return await element.all(by.css(this.donutChartLabelsCss)).getText().then(function(donutChartLabels){
		for(var i=0; i<donutChartLabels.length; i++){
			if(donutChartLabels[i].includes(labelName)){
				var percentageValue = donutChartLabels[i].split("(")[1].split("%")[0].trim();
				logger.info("Percentage value for label "+labelName+" is: "+percentageValue);
				return parseFloat(percentageValue);
			}
		}
	});
}

/**
 * Method to click on legend name from Donut chart legends
 * @param {Donut chart legend name to be clicked} legendName 
 */
actionable.prototype.clickOnDonutChartLegend = async function(legendName){
	var legendNameXpath = this.donutChartLegendXpath.format(legendName);
	await browser.actions().mouseMove(element(by.xpath(legendNameXpath))).perform();
	await browser.wait(EC.visibilityOf(element(by.xpath(legendNameXpath))), timeout.timeoutInMilis);
	await element(by.xpath(legendNameXpath)).click().then(function(){
		logger.info("Clicked on "+legendName+" legend");
	});
}

/**
 * Method to click on donut chart legend dialogue add(+) button
 */
actionable.prototype.clickOnDonutChartLegendDialogueAddButton = async function(){
	await browser.actions().mouseMove(element(by.css(this.donutChartLegendDialogueCss))).perform();
	await browser.wait(EC.presenceOf(element(by.xpath(this.donutChartLegendDialogueAddBtnXpath))), timeout.timeoutInMilis);
	await element(by.xpath(this.donutChartLegendDialogueAddBtnXpath)).click().then(function(){
		logger.info("Clicked on Add button legend dialogue");
	});
}

/**
 * Method to click on donut chart legend dialogue remove(-) button
 */
actionable.prototype.clickOnDonutChartLegendDialogueRemoveButton = async function(){
	await browser.actions().mouseMove(element(by.css(this.donutChartLegendDialogueCss))).perform();
	await browser.wait(EC.presenceOf(element(by.xpath(this.donutChartLegendDialogueRemoveBtnXpath))), timeout.timeoutInMilis);
	await element(by.xpath(this.donutChartLegendDialogueRemoveBtnXpath)).click().then(function(){
		logger.info("Clicked on Add button legend dialogue");
	});
}

/**
 * Verify id Reset Filters link is Present or not
 */
actionable.prototype.isResetFiltersLinkPresent = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.resetFilterLinkXpath))), timeout.timeoutInMilis);
	return element(by.xpath(this.resetFilterLinkXpath)).isDisplayed().then(function(status){
		if(status == true){
			logger.info("Reset filters link is present..");
			return true;
		}
	}).catch(function(){
		logger.info("Reset filters link is not present..");
		return false;
	});
}

/**
 * Method to click on reset filter link
 */
actionable.prototype.clickResetFilterLink = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.xpath(this.resetFilterLinkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.resetFilterLinkXpath)).click().then(function(){
		logger.info("clicked on reset filter link");
	});
};


/**
 * Method to click on actionable insights link
 */
actionable.prototype.clickOnActionableInsightLink = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.xpath(this.actionableInsightLinkXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.actionableInsightLinkXpath)).click().then(function(){
		logger.info("clicked on actionable insights link");
	});
};


/**
 * Method to filter from insights overview widgets
 */
actionable.prototype.filterInsightsOverviewData = function(input){
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.insightsOverviewSearchFilterCss)).get(1)), timeout.timeoutInMilis);
	return element.all(by.css(this.insightsOverviewSearchFilterCss)).get(1).sendKeys(input).then(function(){
		logger.info("Searched '"+input+"' from insights overview widgets");
		return element(by.css(self.noResultsFoundSearchFilterCss)).isDisplayed().then(function(status){
			if(status == true){
				logger.info("Skipped as No Results found for searched string");
				return false;
			}
		}).catch(function(){
			logger.info("One or more results found for searched string");
			return true;
		})
	});
};


/**
 * Method to get first row first column text from insights overview widgets table
 */
actionable.prototype.getFirstInsightNameFromLandingPageTable = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.insightsOverviewWidgetsRowtxtCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.insightsOverviewWidgetsRowtxtCss)).get(0).getText().then(function(firstRowMiddleColumTxt){
		logger.info("Insight name text: "+firstRowMiddleColumTxt);
		return firstRowMiddleColumTxt;
	});
};


/**
 * Method to get first row last column value from insights overview widgets table
 */
actionable.prototype.getTicketCountFromLandingPageTable = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.insightsOverviewWidgetsFirstRowCountCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.insightsOverviewWidgetsFirstRowCountCss)).get(0).getText().then(function(firstRowLastColumntxt){
		var count = Number(firstRowLastColumntxt.replace(/[^0-9.]/g, ''));
		logger.info("Insight ticket count from landing page table: "+count);
		return count;
	});
};


/**
 * Method to get table row count from insights overview widgets table
 */
actionable.prototype.getTableRowCountFromLandingPageTable = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.insightsOverviewWidgetsFirstRowCountCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.insightsOverviewWidgetsFirstRowCountCss)).count().then(function(firstRowlastColumntxt){
		logger.info("Number of rows in Landing page table : "+firstRowlastColumntxt);
		return firstRowlastColumntxt;
	});
};


/**
 * Method to click on first row first column hyper link from insights overview widgets table
 */
actionable.prototype.clickOnFirstInsightFromLandingPageTable = function(){
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.insightsOverviewWidgetsRowtxtCss))), timeout.timeoutInMilis);
	element(by.css(this.insightsOverviewWidgetsRowtxtCss)).click().then(function(){
		logger.info("Clicked on first insight from landing page table");
	});
};

actionable.prototype.isTablePresent = function(tableHeaderName){
	var bool = true;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.sectionHeaderNamesCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.sectionHeaderNamesCss)).getText().then(function(headerNames){
		logger.info("All section header names: ", headerNames);
		var i=0;
		for(i=0; i<headerNames.length; i++){
			if(headerNames[i].includes(tableHeaderName)){
				logger.info("Is present "+tableHeaderName+" : "+bool);
				return bool;
			}
		}
		if(i == headerNames.length){
			bool = false;
			logger.info("Is present "+tableHeaderName+" : "+bool);
			return bool;
		}
	})
}

actionable.prototype.getRowCountFromAdditionalDetailsTable = function(){
	var self = this;
	var pageSize = 10;
	var rowCount = 0;
	util.waitForAngular();
	return element.all(by.xpath(this.noResultsFoundAdditionalDetailsTableXpath)).count().then(async function(noResultsFountCount){
		if(noResultsFountCount != 0){
			logger.info("No results found..");
			return rowCount;
		}
		else{
			browser.wait(EC.visibilityOf(element(by.css(self.additionalDetailsTableBodyCss))), timeout.timeoutInMilis);
			var firstPageNo = parseInt(await element(by.xpath(self.additionalDetailsTableFirstPageXpath)).getText());
			var lastPageNo = parseInt(await element(by.xpath(self.additionalDetailsTableLastPageXpath)).getText());
			if(firstPageNo == lastPageNo){
				logger.info("There is only one page in table..");
				return element.all(by.xpath(self.additionalDetailsTableRowsXpath)).count().then(function(count){
					rowCount = count;
					logger.info("Total Number of rows in table : "+ rowCount);
					return rowCount;
				});
			}
			else{
				return element(by.xpath(self.additionalDetailsTableLastPageXpath)).click().then(function(){
					logger.info("Clicked on last page..");
					return element.all(by.xpath(self.additionalDetailsTableRowsXpath)).count().then(function(count){
						rowCount = count + ((lastPageNo - 1) * pageSize);
						logger.info("Total Number of rows in table : "+ rowCount);
						return rowCount;
					});
				});
			}
		}
	});
}

/**
 * Method to click on First page button ticket details table
 */
actionable.prototype.clickOnFirstPageButtonInTicketDetailsTable = async function(){
	var self = this;
	await browser.wait(EC.elementToBeClickable(element(by.css(this.ticketsDetailsTableFirstPageBtnCss))), timeout.timeoutInMilis).then(async function(){
		await element(by.css(self.ticketsDetailsTableFirstPageBtnCss)).click().then(function(){
			logger.info("Clicked on First page button from ticket details table");
		})
	});
}

/**
 * Method to click on Last page button ticket details table
 */
actionable.prototype.clickOnLastPageButtonInTicketDetailsTable = async function(){
	var self = this;
	await browser.wait(EC.elementToBeClickable(element(by.css(this.ticketsDetailsTableLastPageBtnCss))), timeout.timeoutInMilis).then(async function(){
		await element(by.css(self.ticketsDetailsTableLastPageBtnCss)).click().then(function(){
			logger.info("Clicked on Last page button from ticket details table");
		})
	});
}

/**
 * Method to get row count from tickets details table
 */
actionable.prototype.getRowCountFromTicketsDetailsTable = function(){
	var self = this;
	var rowCount = 0;
	util.waitForAngular();
	return element.all(by.css(this.noDataCellTicketDetailsCss)).count().then(function(noDataCellCount){
		if(noDataCellCount != 0){
			logger.info("No data found..");
			return rowCount;
		}
		else{
			browser.wait(EC.visibilityOf(element.all(by.css(self.ticketDetailsTableFirstCellCss)).get(0)), timeout.timeoutInMilis);
			return element(by.css(self.ticketsDetailsTableLastPageBtnCss)).getAttribute('class').then(async function(className){
				if(className.includes('disabled')){
					logger.info("Only one page is available in table.");
					rowCount = await element.all(by.css(self.ticketsDetailsTableRowCountCss)).count();
					logger.info("Total number of rows in table: "+rowCount);
					return rowCount;
				}
				else{
					let pageSize = await element.all(by.css(self.ticketsDetailsTableRowCountCss)).count();
					logger.info("Page size for ticket details table: "+pageSize);
					await self.clickOnLastPageButtonInTicketDetailsTable();
					util.waitForAngular();
					let lastPageNumber = await element(by.xpath(self.ticketDetailsTableLastPageNumberXpath)).getText();
					logger.info("Last page number for ticket details table: "+lastPageNumber);
					let rowCountOnLastPage = await element.all(by.css(self.ticketsDetailsTableRowCountCss)).count();
					logger.info("Row count on last page: "+rowCountOnLastPage);
					if(rowCountOnLastPage == pageSize){
						rowCount = (lastPageNumber * pageSize);
						logger.info("Total number of rows in table: "+rowCount);
						return rowCount;
					}
					else{
						rowCount = ((lastPageNumber - 1) * pageSize) + rowCountOnLastPage;
						logger.info("Total number of rows in table: "+rowCount);
						return rowCount;
					}
				}
			});
		}
	});
};


module.exports = actionable;