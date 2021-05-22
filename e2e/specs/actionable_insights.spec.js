/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
    dashboardPage = require('../pageObjects/dashboard.pageObject.js'),
    launchpadPage = require('../pageObjects/launchpad.pageObject.js'),   
    actionableInsight = require('../pageObjects/actionable_insights.pageObject.js'),
    launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	actionableInsightTestData = require('../../testData/cards/actionableInsightsTestData.json'),
	appUrls = require('../../testData/appUrls.json'),
	util = require('../../helpers/util.js');
var frames = require('../../testData/frames.json');
var applicationUrl = browser.params.url;
	

describe('Actionable insight - functionality ', function() {
	var dashboardObj, launchpadObj, actionableInsightObj;

	beforeAll(function() {
		dashboardObj = new dashboardPage();
		launchpadObj = new launchpadPage();
		actionableInsightObj = new actionableInsight();
		browser.driver.manage().window().maximize();
	});

	beforeEach(function() {
		launchpadObj.open();
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
	});

	it('verify Actionable Insights data card table links are clickable and redirect to respective page', async function() {
		expect(await dashboardObj.getCardTitleDataCenterText(dashboardTestData.actionableInsights)).toEqual(dashboardTestData.dataCenterTxt);
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			var actionableInsightIncidentTicketsSummaryRowTitle = await dashboardObj.getActionableInsightsCardRowText(0);
			await dashboardObj.clickOnActionableInsightsCardRow(0);
			await actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			expect(await actionableInsightObj.getActionableInsightIncidentTicketsSummaryText()).toEqual(actionableInsightIncidentTicketsSummaryRowTitle);
		}
    });

	it('verify Actionable Insights landing page showing two months data', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			expect(actionableInsightObj.getMonthAndYearTabText(0)).toEqual(util.getFullPreviousMonthYearDate(0));	
			expect(actionableInsightObj.getMonthAndYearTabText(1)).toEqual(util.getFullPreviousMonthYearDate(1));
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(actionableInsightObj.getInsightsCategoryHeaderText()).toEqual(actionableInsightTestData.insightsCategory);
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(1);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(actionableInsightObj.getInsightsCategoryHeaderText()).toEqual(actionableInsightTestData.insightsCategory);
		}
    });
	
	// Ignored, because insights category visibility is dynamic in nature
	// it('verify Actionable Insights should have 6 different category in different tab', function() {
	// 	dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
	// 	actionableInsightObj.open();
	// 	actionableInsightObj.clickOnMonthAndYearTab(0);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	var currentMonthTabInsightsCategory = actionableInsightObj.getInsightsCategoriesText();
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.proactiveProblemManagement);
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.performance);
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.automationOpportunity);
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.storage);
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.change);
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.capacity);
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.cloudMigration);
				
	// 	actionableInsightObj.open();
	// 	actionableInsightObj.clickOnMonthAndYearTab(1);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	var previousMonthTabInsightsCategory = actionableInsightObj.getInsightsCategoriesText();
	// 	expect(currentMonthTabInsightsCategory).toContain(actionableInsightTestData.proactiveProblemManagement);	
	// 	expect(previousMonthTabInsightsCategory).toContain(actionableInsightTestData.performance);
	// 	expect(previousMonthTabInsightsCategory).toContain(actionableInsightTestData.automationOpportunity);
	// 	expect(previousMonthTabInsightsCategory).toContain(actionableInsightTestData.storage);
	// 	expect(previousMonthTabInsightsCategory).toContain(actionableInsightTestData.change);
	// 	expect(previousMonthTabInsightsCategory).toContain(actionableInsightTestData.capacity);
	// 	expect(previousMonthTabInsightsCategory).toContain(actionableInsightTestData.cloudMigration);
    // });
	
	it('verify Actionable Insights category total count from table', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var totalInsightsCategoryCount = await actionableInsightObj.getTotalInsightsCategoriesCount();
			var totalRowCount = await actionableInsightObj.getTotalRowCountFromTable();
			expect(totalInsightsCategoryCount).toEqual(totalRowCount);
			expect(totalInsightsCategoryCount).toEqual(countFromTitleText);
		}
    });
	
	it('verify Actionable Insights specific category count from table', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var insightsCategoryText = await actionableInsightObj.getInsightsCategoriesText();
			for(var i = 0; i < insightsCategoryText.length; i++){
				await actionableInsightObj.clickOnInsightsCategoryNumber(i);
				var totalInsightsCategoryCount = await actionableInsightObj.getTotalInsightsCategoriesCount();
				var totalRowCount = await actionableInsightObj.getTotalRowCountFromTable();
				await expect(totalInsightsCategoryCount).toEqual(totalRowCount);
				await actionableInsightObj.clickResetFilterLink();
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			}
		}
    });
	
	it('verify Actionable Insights reset filter functionality', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			var totalInsightsCategoryCount = actionableInsightObj.getTotalInsightsCategoriesCount();
			actionableInsightObj.clickOnInsightsCategoryNumber(0);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			actionableInsightObj.clickResetFilterLink();
			var totalInsightsCategoryCountAfterReset = actionableInsightObj.getTotalInsightsCategoriesCount();
			expect(totalInsightsCategoryCount).toEqual(totalInsightsCategoryCountAfterReset);
		}
    });
	
	it('verify able to click on Actionable Insights link and navigating to home page', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var firstRowData = await actionableInsightObj.getFirstInsightNameFromLandingPageTable();
			actionableInsightObj.filterInsightsOverviewData(firstRowData);
			actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
			actionableInsightObj.open();
			util.switchToFrameById(frames.cssrIFrame);
			actionableInsightObj.clickOnActionableInsightLink();
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(actionableInsightObj.getInsightsCategoryHeaderText()).toEqual(actionableInsightTestData.insightsCategory);
		}
    });
	
	it('verify Actionable Insights overview page - search and clickable functionability', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var firstRowData = await actionableInsightObj.getFirstInsightNameFromLandingPageTable();
			actionableInsightObj.filterInsightsOverviewData(firstRowData);
			var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
			expect(actionableInsightObj.getTableRowCountFromLandingPageTable()).toEqual(1);
			actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
			actionableInsightObj.open();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			expect(actionableInsightObj.getNumericValuefromIncidentTicketsSummary()).toEqual(ticketCountFromLandingPageTable);
		}
    });
	
	it('verify Actionable Insights overview page - search and navigtion page and total row count on table from sub section', async function() {
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			actionableInsightObj.clickOnMonthAndYearTab(0);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var firstRowData = await actionableInsightObj.getFirstInsightNameFromLandingPageTable();
			actionableInsightObj.filterInsightsOverviewData(firstRowData);
			var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
			expect(actionableInsightObj.getTableRowCountFromLandingPageTable()).toEqual(1);
			actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
			actionableInsightObj.open();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			expect(actionableInsightObj.getNumericValuefromIncidentTicketsSummary()).toEqual(ticketCountFromLandingPageTable);
			expect(actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromLandingPageTable));
		}
    });
	
	it("Verify 'reset filter' link functionality on Insights overview page", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Get first Insight name from AI landing page
			var firstRowData = await actionableInsightObj.getFirstInsightNameFromLandingPageTable();
			actionableInsightObj.filterInsightsOverviewData(firstRowData);
			// Get ticket count from filtered insight
			var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
			// Click on filtered insight
			actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
			// actionableInsightObj.open();
			// util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Get ticket count from summary text from insight overview page
			var ticketCountFromSummaryBefore = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
			expect(ticketCountFromSummaryBefore).toEqual(ticketCountFromLandingPageTable);
			// Validate ticket count from summary text with the ticket details table rows
			expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountFromSummaryBefore);
			// Click again on first page to reset table pages
			await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
			// Get list of donut chart labels before
			var donutChartLabelsListBefore = await actionableInsightObj.getListOfDonutChartLabelsText();
			if(!util.isListEmpty(donutChartLabelsListBefore)){
				// Get percentage value for specific donut section
				var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsListBefore[0]);
				var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummaryBefore);
				// Select specific donut section using legend dialogue add(+) button
				await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsListBefore[0]);
				await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Donut chart labels list length is equal to 1
				expect(donutChartLabelsListBefore.length).toBeGreaterThanOrEqual(1);
				// Validate ticket count from specific donut section with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				expect(ticketCountFromSummaryBefore).toBeGreaterThanOrEqual(ticketCountDonutSection);
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
			}

			// Check visibility of Reset Filters link
			expect(await actionableInsightObj.isResetFiltersLinkPresent()).toBe(true);
			// Click on Reset Filters link
			await actionableInsightObj.clickResetFilterLink();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var donutChartLabelsListAfter2 = await actionableInsightObj.getListOfDonutChartLabelsText();
			// Donut chart labels list length is equal as before
			expect(donutChartLabelsListBefore.length).toEqual(donutChartLabelsListAfter2.length);

			// Validate ticket count from summary text should be equal as before
			expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountFromSummaryBefore);
		}
	});
	
	it("Verify the validations for 'Devices with the most incident tickets' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithMostIncidentTickets);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Top business applications with the most incident tickets' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.topBusinessAppsWithMostIncidentTickets);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);

				// A single ticket may be associated with multiple business applications. Thats why, Ticket details table showing multiple records;
				// Different than Summary and Landing page table count --> https://jira.gravitant.net/browse/AIOP-10256

				/*// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromObservationTable));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromObservationTable);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}*/
			}
		}
	});

	it("Verify the validations for 'Office locations of devices with the most incidents' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.officeLocaltionsOfDevicesWithMostIncidents);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with the most disk or swap space related incident tickets' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithMostDiskOrSwapSpaceIncidentTickets);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with the most high CPU or memory related incident tickets' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithMostHighCPUOrMemoryIncidentTickets);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Enable all events/tickets flow into the automation engine' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.enableAllEventsFlowIntoTheAutomationEngine);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Reduce automated escalated tickets by updating matcher processes' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.reduceAutomatedEscalatedTicketsByUpdatingMatcherProcesses);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Reduce diagnostic tickets' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.reduceDiagnosticTickets);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with monitoring frequently offline or server not available' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.frequentlyofflineOrServerNotAvailable);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});
	
	it("Verify the validations for 'Devices with the most auto-resolved incident tickets' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithTheMostAutoResolvedIncidentTickets);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Reduce automation connection failures' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.reduceAutomationConnectionFailures);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Enable Resolve on Clear (RoC) in Netcool' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.enableResolveClearInNetcool);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with the most frequent process or service down issues' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithTheMostFrequentProcessOrServiceDownIssues);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with the most missed or failed backup issues' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithTheMostMissedOrFailedBackupIssues);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with the most database issues' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithTheMostDatabaseIssues);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Change groups with the most changes' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.changeGroupsWithTheMostChanges);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Cloud-ready servers' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.cloudReadyServers);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromObservationTable));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromObservationTable);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Devices with the most batch jobs and job abend issues' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.devicesWithTheMostBatchJobsAndJobAbendIssues);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Events not automated (Console only)' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.eventsNotAutomated);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Events ticketed without automation requests' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.eventsTicketedWithoutAutomationRequests);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	it("Verify the validations for 'Incident ticket reduction from event correlations' insight", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);	
			actionableInsightObj.open();
			util.waitForAngular();
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			// Filter insights with name
			var status = await actionableInsightObj.filterInsightsOverviewData(actionableInsightTestData.incidentTicketReductionFromEventCorrelations);
			if(status == true){
				// Get ticket count from filtered insight
				var ticketCountFromLandingPageTable = await actionableInsightObj.getTicketCountFromLandingPageTable();
				// Click on filtered insight
				actionableInsightObj.clickOnFirstInsightFromLandingPageTable();
				actionableInsightObj.open();
				util.waitForAngular();
				util.switchToFrameById(frames.cssrIFrame);
				await util.waitOnlyForInvisibilityOfKibanaDataLoader();
				// Get ticket count from Observation table first row
				var ticketCountFromObservationTable = await actionableInsightObj.getTotalCountFromObservationFirstRowText();
				// Validate ticket count from Observation table first row with the ticket count from landing page
				expect(ticketCountFromObservationTable).toEqual(ticketCountFromLandingPageTable);
				// Get ticket count from summary text from insight overview page
				var ticketCountFromSummary = await actionableInsightObj.getNumericValuefromIncidentTicketsSummary();
				// Validate ticket count from summary text with the ticket count from landing page
				expect(ticketCountFromSummary).toEqual(ticketCountFromLandingPageTable);
				// Validate ticket count from summary text with the ticket details table rows
				expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(parseInt(ticketCountFromSummary));
				// Click again on first page to reset table pages
				await actionableInsightObj.clickOnFirstPageButtonInTicketDetailsTable();
				// Get list of donut chart labels
				var donutChartLabelsList = await actionableInsightObj.getListOfDonutChartLabelsText();
				if(!util.isListEmpty(donutChartLabelsList)){
					// Get percentage value for specific donut section
					var percentageValue = await actionableInsightObj.getPercentageValueForDonutChartLabel(donutChartLabelsList[0]);
					var ticketCountDonutSection = util.calcIntNumberFromPercentage(percentageValue, ticketCountFromSummary);
					// Select specific donut section using legend dialogue add(+) button
					await actionableInsightObj.clickOnDonutChartLegend(donutChartLabelsList[0]);
					await actionableInsightObj.clickOnDonutChartLegendDialogueAddButton();
					await util.waitOnlyForInvisibilityOfKibanaDataLoader();
					// Validate ticket count from specific donut section with the ticket details table rows
					expect(await actionableInsightObj.getRowCountFromTicketsDetailsTable()).toEqual(ticketCountDonutSection);
				}
			}
		}
	});

	afterAll(async function() {
		await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});	
});
