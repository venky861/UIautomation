/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";

var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
    sunrise_report = require('../pageObjects/sunrise_report.pageObject.js'),
    launchpadPage = require('../pageObjects/launchpad.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	sunriseReportTestData = require('../../testData/cards/sunriseReportTestData.json'),
	appUrls = require('../../testData/appUrls.json'),
	frames = require('../../testData/frames.json'),
	util = require('../../helpers/util.js'),
	dashboardApiUtil = require('../../helpers/dashboardApiUtil.js'),
	dashboardApiTestData = require('../../testData/cards/dashboardAPITestData.json'),
	serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
	esQueriesSunrise = require('../../elasticSearchTool/esQuery_SunrisePayload.js'),
    tenantId = browser.params.tenantId,
	isEnabledESValidation = browser.params.esValidation;

describe('Daily sunrise report card - functionality ', function() {
	var sunriseReportObj, launchpadObj;
	var lastSnapshotDate = "";
	var globalFilterList = [sunriseReportTestData.statusFilterName,sunriseReportTestData.ownerGroupFilterName,sunriseReportTestData.contactTypeFilterName,sunriseReportTestData.priorityFilterName,sunriseReportTestData.ibmOwnedFilterName];
	
	beforeAll(function() {
		launchpadObj = new launchpadPage();
		sunriseReportObj = new sunrise_report();
	});

	beforeEach(function() {
		launchpadObj.open();
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.sunriseReportCard);
		sunriseReportObj.open();
	});

	it('Verify global filter default tooltip is None selected and filters are expanding', function() {
		util.waitForInvisibilityOfKibanaDataLoader();
		// Verify Global filters presence
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		});
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.statusFilterName)).toEqual(sunriseReportTestData.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.ownerGroupFilterName)).toEqual(sunriseReportTestData.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.contactTypeFilterName)).toEqual(sunriseReportTestData.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.priorityFilterName)).toEqual(sunriseReportTestData.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.ibmOwnedFilterName)).toEqual(sunriseReportTestData.noneSelectedTooltipText);
		
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
	});
	
	it('Verify global filter tooltip after selecting the filter', async function() {	
		util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi select filter, select first value and verify tool-tip text for each tab
		for(var globalFilter of globalFilterList){
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);	
			util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(sunriseReportTestData.noneSelectedTooltipText);
		}
		
	});
	
	it('Verify all widgets are available and having numeric data or - if not a table', async function() {
		await util.waitForInvisibilityOfKibanaDataLoader();
		var allWidgetNames= serviceMgmtUtil.getAllKibanaReportWidgetsNameText();
		expect(allWidgetNames).toContain(sunriseReportTestData.totalOpenTicketsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.ticketsCreatedInLast24HrsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.ticketsResolvedInLast24HrsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.closureRatePrcntInLast24HrsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.backlogRatePrcntInLast24HrsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.cancelledPrcntInLastLast24HrsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.overallTicketsCreatedInLast24HrsByStatusWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.overallBackLogTicketsByStatusWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.contactTypeWidgetName);
		expect(allWidgetNames).toContain(sunriseReportTestData.backlogTicketAgingWidgetName);
		expect(await sunriseReportObj.getWidgetsNumericValue(sunriseReportTestData.totalOpenTicketsWidgetName)).toEqual(jasmine.any(Number));
		expect(await sunriseReportObj.getWidgetsNumericValue(sunriseReportTestData.ticketsCreatedInLast24HrsWidgetName)).toEqual(jasmine.any(Number));
		expect(await sunriseReportObj.getWidgetsNumericValue(sunriseReportTestData.ticketsResolvedInLast24HrsWidgetName)).toEqual(jasmine.any(Number));
		
		expect(sunriseReportObj.checkWidgetsValueIsNumericOrString(sunriseReportTestData.closureRatePrcntInLast24HrsWidgetName)).toBe(true);
		expect(sunriseReportObj.checkWidgetsValueIsNumericOrString(sunriseReportTestData.backlogRatePrcntInLast24HrsWidgetName)).toBe(true);
		expect(sunriseReportObj.checkWidgetsValueIsNumericOrString(sunriseReportTestData.cancelledPrcntInLastLast24HrsWidgetName)).toBe(true);

		lastSnapshotDate = await sunriseReportObj.getToTimeFromTimestamp();
		if(isEnabledESValidation){
			logger.info("------ES Query validation------");
			var totalOpenTicketsFromEs = await esQueriesSunrise.getTotalOpenTicketsCount(sunriseReportTestData.esSunriseSearchIndex,tenantId, lastSnapshotDate);
			var ticketsCreatedInLast24HrsValueFromEs = await esQueriesSunrise.getTotalTicketsCreatedinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex,tenantId, lastSnapshotDate);
			var ticketsResolvedInLast24HrsvalueFromEs = await esQueriesSunrise.getTotalTicketsResolvedinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex,tenantId, lastSnapshotDate);
			var closureRatePrcntInLast24HrsvalueFromEs = await esQueriesSunrise.getTotalClosureRateinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex,tenantId, lastSnapshotDate);
			var backlogRatePrcntInLast24HrsvalueFromEs = await esQueriesSunrise.getTotalBacklogRateinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex,tenantId, lastSnapshotDate);
			var cancelledPrcntInLastLast24HrsvalueFromEs = await esQueriesSunrise.getTotalCancelledRateinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex,tenantId, lastSnapshotDate);
			expect(await sunriseReportObj.getWidgetsIntegerValue(sunriseReportTestData.totalOpenTicketsWidgetName)).toEqual(totalOpenTicketsFromEs);
			expect(await sunriseReportObj.getWidgetsIntegerValue(sunriseReportTestData.ticketsCreatedInLast24HrsWidgetName)).toEqual(ticketsCreatedInLast24HrsValueFromEs);
			expect(await sunriseReportObj.getWidgetsIntegerValue(sunriseReportTestData.ticketsResolvedInLast24HrsWidgetName)).toEqual(ticketsResolvedInLast24HrsvalueFromEs);
			expect(await sunriseReportObj.getWidgetsFloatValue(sunriseReportTestData.closureRatePrcntInLast24HrsWidgetName)).toBe(closureRatePrcntInLast24HrsvalueFromEs);
		    expect(await sunriseReportObj.getWidgetsFloatValue(sunriseReportTestData.backlogRatePrcntInLast24HrsWidgetName)).toBe(backlogRatePrcntInLast24HrsvalueFromEs);
		    expect(await sunriseReportObj.getWidgetsFloatValue(sunriseReportTestData.cancelledPrcntInLastLast24HrsWidgetName)).toBe(cancelledPrcntInLastLast24HrsvalueFromEs);
		}
	});
	
	it('Verify owner group table data based on applied filter', async function() {
		await util.waitForInvisibilityOfKibanaDataLoader();
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.ownerGroupFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(sunriseReportTestData.ownerGroupFilterName)).toBe(true);
		var firstFilterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(sunriseReportTestData.ownerGroupFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(sunriseReportTestData.ownerGroupFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.ownerGroupFilterName)).toEqual(firstFilterValue);
		expect(await serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(sunriseReportTestData.backlogTicketAgingWidgetName);
		expect(await sunriseReportObj.getOwnerGroupRowTextFromAginTable()).toEqual(firstFilterValue);
	});
	
	it('Verify count from column value from overall view of tickets created in last 24 hrs table', async function() {
		lastSnapshotDate = await sunriseReportObj.getToTimeFromTimestamp();
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (isEnabledESValidation) {
			logger.info("------ES Query validation------");
			var overallViewofTicketsCreatedInLast24hoursCreatedSummaryCountFromEs = await esQueriesSunrise.getTotalTicketsCreatedinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var overallViewofTicketsCreatedInLast24hoursResolvedSummaryCountFromEs = await esQueriesSunrise.getTotalTicketsResolvedinLast24HoursCount(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var OverallViewofTicketsCreatedInLast24hoursOverallResolvedSummaryCountFromEs = await esQueriesSunrise.getSummaryForOverallViewofTicketsCreatedInLast24hoursForOverallResolvedCount(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var SummaryValuesofAllColumn= await serviceMgmtUtil.getSummaryValuesListFromTableWidget(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName);
			expect(SummaryValuesofAllColumn[0]).toEqual(overallViewofTicketsCreatedInLast24hoursCreatedSummaryCountFromEs);
			expect(SummaryValuesofAllColumn[1]).toEqual(overallViewofTicketsCreatedInLast24hoursResolvedSummaryCountFromEs);
			expect(SummaryValuesofAllColumn[2]).toEqual(OverallViewofTicketsCreatedInLast24hoursOverallResolvedSummaryCountFromEs);
		}
		var ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameTwo))[0]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.created));
		
		ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameFour))[0]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.resolved));		
		
		ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameTwo))[1]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p2Tickets, dashboardApiTestData.created));
		
		ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameFour))[1]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p2Tickets, dashboardApiTestData.resolved));		
		
		ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameTwo))[2]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p3Tickets, dashboardApiTestData.created));		
		
		ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameFour))[2]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p3Tickets, dashboardApiTestData.resolved));
		
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(sunriseReportTestData.priorityFilterName)).toBe(true);
		await serviceMgmtUtil.selectFilterValueBasedOnName(sunriseReportTestData.priorityFilterName, sunriseReportTestData.p1Priority);
		await serviceMgmtUtil.clickOnUpdateFilterButton(sunriseReportTestData.priorityFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(sunriseReportTestData.priorityFilterName)).toEqual(sunriseReportTestData.p1Priority);
		expect(await serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName);
		
		ticketCount = util.stringToInteger((await serviceMgmtUtil.getColumnDataBasedOnColumnNo(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName, sunriseReportTestData.columnNameTwo))[0]);
		expect(util.kFormatterWithoutK(ticketCount)).toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.created));
	});

	if (isEnabledESValidation) {
		it('Verify count from column value from overall Backlog Tickets By Priority table', async function() {
			logger.info("------ES Query validation------");
			lastSnapshotDate = await sunriseReportObj.getToTimeFromTimestamp();
			await util.waitForInvisibilityOfKibanaDataLoader();
			var overallBacklogTicketsByPriorityOnHoldStatusValueFromEs = await esQueriesSunrise.getOverallBacklogTicketsByPriorityOnHoldStatus(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var overallBacklogTicketsByPriorityQueuedStatusvalueFromEs = await esQueriesSunrise.getOverallBacklogTicketsByPriorityQueuedStatus(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var overallBacklogTicketsByPriorityInProgressStatusvalueFromEs = await esQueriesSunrise.getOverallBacklogTicketsByPriorityInProgressStatus(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			for (var i = 0; i < overallBacklogTicketsByPriorityOnHoldStatusValueFromEs.length; i++) {
				expect((await serviceMgmtUtil.getIntgerColumnDataBasedOnColumnNo(sunriseReportTestData.overallBackLogTicketsByStatusWidgetName, sunriseReportTestData.columnNameTwo))[i]).toEqual(overallBacklogTicketsByPriorityOnHoldStatusValueFromEs[i]);
			}
			for (var i = 0; i < overallBacklogTicketsByPriorityOnHoldStatusValueFromEs.length; i++) {
				expect(( await serviceMgmtUtil.getIntgerColumnDataBasedOnColumnNo(sunriseReportTestData.overallBackLogTicketsByStatusWidgetName, sunriseReportTestData.columnNameThree))[i]).toEqual(overallBacklogTicketsByPriorityQueuedStatusvalueFromEs[i]);
			}
			for (var i = 0; i < overallBacklogTicketsByPriorityOnHoldStatusValueFromEs.length; i++) {
				expect((await serviceMgmtUtil.getIntgerColumnDataBasedOnColumnNo(sunriseReportTestData.overallBackLogTicketsByStatusWidgetName, sunriseReportTestData.columnNameFour))[i]).toEqual(overallBacklogTicketsByPriorityInProgressStatusvalueFromEs[i]);
			}
			var overallBacklogTicketsByPriorityOnHoldStatusSummaryCountFromEs = await esQueriesSunrise.getSummaryofOverallBacklogTicketsForOnHoldStatus(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var overallBacklogTicketsByPriorityQueuedStatusSummaryCountFromEs = await esQueriesSunrise.getSummaryofOverallBacklogTicketsForQueuedStatus(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var overallBacklogTicketsByPriorityInProgressStatusSummaryCountFromEs = await esQueriesSunrise.getSummaryofOverallBacklogTicketsforInProgressStatus(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var SummaryValuesofAllColumn= await serviceMgmtUtil.getSummaryValuesListFromTableWidget(sunriseReportTestData.overallBackLogTicketsByStatusWidgetName);
			expect(SummaryValuesofAllColumn[0]).toEqual(overallBacklogTicketsByPriorityOnHoldStatusSummaryCountFromEs);
			expect(SummaryValuesofAllColumn[1]).toEqual(overallBacklogTicketsByPriorityQueuedStatusSummaryCountFromEs);
			expect(SummaryValuesofAllColumn[2]).toEqual(overallBacklogTicketsByPriorityInProgressStatusSummaryCountFromEs);
		});
	}

	if (isEnabledESValidation) {
		it('Verify count from column value from Contact Type and Backlog Ticket Aging table', async function () {
			logger.info("------ES Query validation------");
			lastSnapshotDate = await sunriseReportObj.getToTimeFromTimestamp();
			await util.waitForInvisibilityOfKibanaDataLoader();
			var contactTypeCountValueFromEs = await esQueriesSunrise.getContactTypeCountByPriority(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var contactTypeLength = contactTypeCountValueFromEs.length
			serviceMgmtUtil.clickOnColumnIconBasedOnSortingOrder(sunriseReportTestData.contactTypeWidgetName,sunriseReportTestData.columnNameOne,sunriseReportTestData.OrderTypeAcending);
			if(contactTypeLength >5){ contactTypeLength=5 }
			for (var i = 0; i < contactTypeLength; i++) {
				expect((await serviceMgmtUtil.getIntgerColumnDataBasedOnColumnNo(sunriseReportTestData.contactTypeWidgetName, sunriseReportTestData.columnNameTwo))[i]).toEqual(contactTypeCountValueFromEs[i]);
			}
			var contactTypeCountSummaryCountFromEs = await esQueriesSunrise.getSummaryforContactTypeCount(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
		var SummaryValuesofAllColumnContactType = await serviceMgmtUtil.getSummaryValuesListFromTableWidget(sunriseReportTestData.contactTypeTableName);
		expect(SummaryValuesofAllColumnContactType[0]).toEqual(contactTypeCountSummaryCountFromEs);	
	});
	};

	if (isEnabledESValidation) {
		it('Verify count from column value from  Backlog Ticket Aging table', async function () {
			logger.info("------ES Query validation------");
			lastSnapshotDate = await sunriseReportObj.getToTimeFromTimestamp();
			await util.waitForInvisibilityOfKibanaDataLoader();
			var totalSummaryColumnValuesforbacklogTicketAging = await esQueriesSunrise.getTotalSummaryColumnValuesforbacklogTicketAging(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var totalSummaryColumnValuesforbacklogTicketAgingLength = totalSummaryColumnValuesforbacklogTicketAging.length
			serviceMgmtUtil.clickOnColumnIconBasedOnSortingOrder(sunriseReportTestData.backlogTicketAgingWidgetName,sunriseReportTestData.columnNameOne,sunriseReportTestData.OrderTypeAcending);
			if(totalSummaryColumnValuesforbacklogTicketAgingLength >15){ totalSummaryColumnValuesforbacklogTicketAgingLength=15 }
			for (var i = 0; i < totalSummaryColumnValuesforbacklogTicketAgingLength; i++) {
				expect((await serviceMgmtUtil.getIntgerColumnDataBasedOnColumnNo(sunriseReportTestData.backlogTicketAgingWidgetName, sunriseReportTestData.columnNameEleven))[i]).toEqual(totalSummaryColumnValuesforbacklogTicketAging[i]);
			}
			var backlogTicketAgingSummaryCount= await esQueriesSunrise.getSummaryForBacklogTicketAgingCount(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var SummaryValuesofAllColumnBacklogTicketAging = await serviceMgmtUtil.getSummaryValuesListFromTableWidget(sunriseReportTestData.backlogTicketAgingWidgetName);
			expect(SummaryValuesofAllColumnBacklogTicketAging[9]).toEqual(backlogTicketAgingSummaryCount);
		});
	};

	if (isEnabledESValidation) {
		it('Verify count from column value from  overall Tickets Created in Last 24 Hours by Status table', async function () {
			logger.info("------ES Query validation------");
			lastSnapshotDate = await sunriseReportObj.getToTimeFromTimestamp();
			await util.waitForInvisibilityOfKibanaDataLoader();
			var overallTicketsCreatedinLast24HoursbyStatusForOpenedValueFromEs = await esQueriesSunrise.getOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			for (var i = 0; i < overallTicketsCreatedinLast24HoursbyStatusForOpenedValueFromEs.length; i++) {
				expect((await serviceMgmtUtil.getIntgerColumnDataBasedOnColumnNo(sunriseReportTestData.overallTicketsCreatedInLast24HrsByStatusWidgetName, sunriseReportTestData.columnNameThree))[i]).toEqual(overallTicketsCreatedinLast24HoursbyStatusForOpenedValueFromEs[i]);
			}
			var overallTicketsCreatedinLast24HoursbyStatusForOpenedSummaryCountFromEs = await esQueriesSunrise.getSummaryforOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority(sunriseReportTestData.esSunriseSearchIndex, tenantId, lastSnapshotDate);
			var SummaryValuesofAllColumn = await serviceMgmtUtil.getSummaryValuesListFromTableWidget(sunriseReportTestData.overallTicketsCreatedInLast24HrsByStatusWidgetName);
			// Validate last element from array with total summary value
			expect(SummaryValuesofAllColumn[SummaryValuesofAllColumn.length-1]).toEqual(overallTicketsCreatedinLast24HoursbyStatusForOpenedSummaryCountFromEs);
		});
	};

	it('Verify Download Report Link and Tooltip on Sunrise Report', async function () {
		util.switchToDefault();	
		util.switchToFrameById(frames.mcmpIframe);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify Download Reports link
		var status = await sunriseReportObj.downloadSunriseReportXlsx();
		if(status == true) {
			// Verify if the downloaded file exists or not
			expect(util.isTicketDetailsFileExists()).toBe(true);
			var sunrise_report_data = util.getDataFromXlsxFile();
			var downloadedTicketsCountFromXlsx = Object.keys(sunrise_report_data).length;
		}
		// Click on Download Reports tooltip Icon
		await sunriseReportObj.clickOnDownloadSunriseReportTooltip();
		// Verify Download Reports Tooltip Message
		await expect(sunriseReportObj.getSunriseReportTooltipMessage()).toEqual(sunriseReportTestData.downloadReportsTooltipMessage);
		// Close Download Report tooltip icon
		await sunriseReportObj.clickOnDownloadSunriseReportTooltip();	
		util.waitForAngular();	
		util.switchToFrameById(frames.cssrIFrame);
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(sunriseReportTestData.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(sunriseReportTestData.priorityFilterName)).toBe(true);
		await serviceMgmtUtil.selectFilterValueBasedOnName(sunriseReportTestData.priorityFilterName, sunriseReportTestData.p1Priority);
		await serviceMgmtUtil.selectFilterValueBasedOnName(sunriseReportTestData.priorityFilterName, sunriseReportTestData.p2Priority);
		await serviceMgmtUtil.clickOnUpdateFilterButton(sunriseReportTestData.priorityFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		var totalOpenTicketsCount = await sunriseReportObj.getWidgetsNumericValue(sunriseReportTestData.totalOpenTicketsWidgetName);
		var SummaryValuesofAllColumn= await serviceMgmtUtil.getSummaryValuesListFromTableWidget(sunriseReportTestData.overallViewOfTicketsCreatedInLast24HrsWidgetName);
		var totalTicketsCounts = (totalOpenTicketsCount + SummaryValuesofAllColumn[2]);

		// Known defect (https://jira.gravitant.net/browse/AIOP-9453) for count not matching in 
		// downloaded excel sheet and in UI after apply P! and P2 priority filter. So testcase will fail.
		expect(totalTicketsCounts).toEqual(downloadedTicketsCountFromXlsx);		
	});

	afterAll(async function() {
		await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
 
});
