/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	problem_management = require('../pageObjects/problem_management.pageObject.js'),
	change_management = require('../pageObjects/change_management.pageObject.js'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	problemManagementTestData = require('../../testData/cards/problemManagementTestData.json'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	appUrls = require('../../testData/appUrls.json'),
	frames = require('../../testData/frames.json'),
	serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
	elasticViewData = require('../../expected_values.json'),
	elasticViewDataProblemMgmt = require('../../testData/expected_value/problem_management_expected_values.json'),
	util = require('../../helpers/util.js'),
	esQueriesProblem = require('../../elasticSearchTool/esQuery_ProblemPayload.js'),
	tenantId = browser.params.tenantId,
	isEnabledESValidation = browser.params.esValidation;


describe('Problem management  - functionality ', function () {
	var problem_management_page, dashboard_page, launchpad_page, change_management_page;
	var problemManagementTestDataObject = JSON.parse(JSON.stringify(problemManagementTestData));
	var globalFilterList = [problemManagementTestDataObject.assignmentQueueFilterName, problemManagementTestDataObject.statusFilterName, problemManagementTestDataObject.ownerGroupFilterName, problemManagementTestDataObject.priorityFilterName];
	var globalFilterToolTipList = [problemManagementTestDataObject.assignmentQueueFilterName, problemManagementTestDataObject.statusFilterName, problemManagementTestDataObject.ownerGroupFilterName, problemManagementTestDataObject.priorityFilterName];
	var TabLinkList = [problemManagementTestDataObject.ticketOverviewLinkText, problemManagementTestDataObject.overallTrendLinkText, problemManagementTestDataObject.topVolumeDriversLinktext, problemManagementTestDataObject.ticketDetailsLinktext];
	var twoMonthsPreviousDate = util.getPerviousDateInMonthYearFormat(2);
	var oneMonthPreviousDate = util.getPerviousDateInMonthYearFormat(1);
	var currentMonthDate = util.getPerviousDateInMonthYearFormat(0);
	var expected_ValuesProblemMgnt_ticket_overview,expected_ValuesProblemMgnt_overall_trend,expected_ValuesProblemMgnt_top_volume_drivers;

	beforeAll(function () {
		problem_management_page = new problem_management();
		dashboard_page = new dashboard();
		launchpad_page = new launchpad();
		change_management_page = new change_management();
		browser.driver.manage().window().maximize();
		expected_ValuesProblemMgnt_ticket_overview = elasticViewDataProblemMgmt.ticket_overview.default_filters.expected_values;
		expected_ValuesProblemMgnt_overall_trend = elasticViewDataProblemMgmt.overall_trend.default_filters.expected_values;
		expected_ValuesProblemMgnt_top_volume_drivers = elasticViewDataProblemMgmt.top_volume_drivers.default_filters.expected_values;
	});

	beforeEach(function () {
		launchpad_page.open();
		expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		problem_management_page.open();
	});

	// Need to skip the test case as global filters Created and Resolved are not available now 
	// it('Verify the problem count on Problem Management card and kibana report for "Created" Global Filter ', async function () {
	// 	launchpad_page.open();
	// 	launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	await dashboard_page.open();
	// 	var twoMonthsPreviousTicketCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated);
	// 	var oneMonthPreviousTicketCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated);
	// 	var currentMonthTicketCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated);
	// 	await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.problemManagement);
	// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
	// 	expect(util.getCurrentURL()).toMatch(appUrls.problemManagementPageUrl);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(twoMonthsPreviousTicketCreatedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.createdFilterName);
	// 		//selects 2 month's Previous filter to fetch Problem count text
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.createdFilterName, twoMonthsPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.createdFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount)).toEqual(twoMonthsPreviousTicketCreatedValue);
	// 			// deselects 2 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.createdFilterName, twoMonthsPreviousDate);
	// 		});
	// 	}
	// 	//selects 1 month's Previous filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(oneMonthPreviousTicketCreatedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.createdFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.createdFilterName, oneMonthPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.createdFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount)).toEqual(oneMonthPreviousTicketCreatedValue);
	// 			// deselects 1 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.createdFilterName, oneMonthPreviousDate);
	// 		});
	// 	}
	// 	//selects current month's filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(currentMonthTicketCreatedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.createdFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.createdFilterName, currentMonthDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.createdFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount)).toEqual(currentMonthTicketCreatedValue);
	// 			// deselects current months filter to avoid addition of Problem count value  with Next value filter
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.createdFilterName, currentMonthDate);
	// 		});
	// 	}
	// });

	// it('Verify the problem count on Problem Management card and kibana report for "Resolved" Global Filter ', async function () {
	// 	launchpad_page.open();
	// 	launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	await dashboard_page.open();
	// 	var twoMonthsPreviousTicketResolvedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, problemManagementTestDataObject.firstColumnOrGraphBar, dashboardTestData.ticketResolved);
	// 	var oneMonthPreviousTicketResolvedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, problemManagementTestDataObject.SecondColumnOrGraphBar, dashboardTestData.ticketResolved);
	// 	var currentMonthTicketResolvedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.problemManagement, problemManagementTestDataObject.thirdColumnOrGraphBar, dashboardTestData.ticketResolved);
	// 	await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.problemManagement);
	// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
	// 	expect(util.getCurrentURL()).toMatch(appUrls.problemManagementPageUrl);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	//selects 2 month's Previous filter to fetch Problem count text
	// 	if(twoMonthsPreviousTicketResolvedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.resolvedFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.resolvedFilterName, twoMonthsPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.resolvedFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(function () {
	// 			expect(serviceMgmtUtil.getKabianaBoardCardValueInKformatter(problemManagementTestData.problemCount)).toEqual(twoMonthsPreviousTicketResolvedValue);
	// 			// deselects 2 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.resolvedFilterName, twoMonthsPreviousDate);
	// 		});
	// 	}
	// 	//selects 1 month's Previous filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(oneMonthPreviousTicketResolvedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.resolvedFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.resolvedFilterName, oneMonthPreviousDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.resolvedFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(function () {
	// 			expect(serviceMgmtUtil.getKabianaBoardCardValueInKformatter(problemManagementTestData.problemCount)).toEqual(oneMonthPreviousTicketResolvedValue);
	// 			// deselects 1 month's Previous filter to avoid addition of Problem count value  with Next Month value
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.resolvedFilterName, oneMonthPreviousDate);
	// 		});
	// 	}
	// 	//selects current month's filter to fetch Problem count text
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	if(currentMonthTicketResolvedValue != '0'){
	// 		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestData.resolvedFilterName);
	// 		serviceMgmtUtil.selectFilterValueBasedOnName(problemManagementTestData.resolvedFilterName, currentMonthDate);
	// 		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestData.resolvedFilterName);
	// 		await serviceMgmtUtil.clickOnApplyFilterButton().then(function () {
	// 			expect(serviceMgmtUtil.getKabianaBoardCardValueInKformatter(problemManagementTestData.problemCount)).toEqual(currentMonthTicketResolvedValue);
	// 			// deselects current months filter to avoid addition of Problem count value  with Next value filter
	// 			await serviceMgmtUtil.deselectFilterValue(problemManagementTestData.resolvedFilterName, currentMonthDate);
	// 		});
	// 	}
	// });

	it('Validate Problem Management title section, last updated Information  and all Tabs Present', async function () {
		expect(util.getHeaderTitleText()).toEqual(problemManagementTestData.headerTitle);
		serviceMgmtUtil.clickOnLastupdatedInfoIcon();
		expect(serviceMgmtUtil.getLastupdatedInfoIconText()).toBe(problemManagementTestData.infoIconText);
		TabLinkList.forEach(function (tabLink) {
			expect(serviceMgmtUtil.getAllTabsLinkText()).toContain(tabLink);
		});
		serviceMgmtUtil.clickOnLastupdatedInfoIcon();
	});

	it("Validate  all widgets and there Data is Present on 'Ticket Overview' Tab for Problem Management", async function () {
		var widgetNameList = [problemManagementTestDataObject.problemCount, problemManagementTestDataObject.prioritybyAgeBin, problemManagementTestDataObject.contactType, problemManagementTestDataObject.ownerGroup, problemManagementTestDataObject.prioritybyStatus, problemManagementTestDataObject.trendOfIncomingProblemVolumebyPriority, problemManagementTestDataObject.ownerGroup];
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		// check results are found for Widgets on Kibana report
		widgetNameList.forEach( async function (widgetName) {
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName);
			if(status != true){
			expect(await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName)).toBe(false);
			}
		});
		if(browser.params.dataValiadtion){
			var problemCountValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount);
			logger.info("------Data validation------");
			expect(util.stringToInteger(problemCountValue)).toEqual(expected_ValuesProblemMgnt_ticket_overview.problem_count);
			expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.ownerGroup)).toEqual(JSON.stringify(expected_ValuesProblemMgnt_ticket_overview.owner_group_count));
		}
		if(isEnabledESValidation){
			logger.info("------ES Query validation------");
			var problemCountValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount);
			var problemCountFromES =  await esQueriesProblem.getDefaultProblemCount(problemManagementTestData.eSProblemSearchIndex, tenantId);
			// Verify Problem count value from UI with Problem count value from ES query response
			expect(util.stringToInteger(problemCountValue)).toEqual(problemCountFromES);
			var ownerGroupValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.ownerGroup);
			var ownerGroupFromES = await esQueriesProblem.getDefaultOwnerGroupCount(problemManagementTestData.eSProblemSearchIndex, tenantId);
			// Verify Owner group value from UI with Owner group value from ES query response
			expect(util.stringToInteger(ownerGroupValue)).toEqual(ownerGroupFromES);
			
			// Apply Creation Date filter for Last 30 Days
			await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
			var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
			await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();

			problemCountValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount);
			problemCountFromES =  await esQueriesProblem.getCustomLastDaysProblemCount(problemManagementTestData.eSProblemSearchIndex, tenantId, problemManagementTestDataObject.thirtyDaysDateRangeDiff);
			// Verify Problem count value from UI with Problem count value from ES query response after applying date-range filter for 30 days
			expect(util.stringToInteger(problemCountValue)).toEqual(problemCountFromES);
			ownerGroupValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.ownerGroup);
			ownerGroupFromES = await esQueriesProblem.getCustomLastDaysOwnerGroupCount(problemManagementTestData.eSProblemSearchIndex, tenantId, problemManagementTestDataObject.thirtyDaysDateRangeDiff);
			// Verify Owner group value from UI with Owner group value from ES query response after applying date-range filter for 30 days
			expect(util.stringToInteger(ownerGroupValue)).toEqual(ownerGroupFromES);
		}
	});

	it("Validate Priority By Bin Table's Column presence and Acending Decending Order Features on 'Ticket Overview' Tab for Problem Management", async function () {
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected(problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var expected_Values_priority_by_age_bin = expected_ValuesProblemMgnt_ticket_overview.priority_by_age_bin;
			logger.info("------data validation------");
			var PriorityByBinFiltersFirstcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyAgeBin, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var PriorityByBinFiltersSecondcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyAgeBin, problemManagementTestDataObject.thirdColumnOrGraphBar);
			var PriorityByBinFiltersThirdcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyAgeBin, problemManagementTestDataObject.fourthColumnOrGraphBar);
			var PriorityByBinFiltersFourthcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyAgeBin, problemManagementTestDataObject.fifthColumnOrGraphBar);
			expect(PriorityByBinFiltersFirstcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRangegreaterThan15][problemManagementTestDataObject.priorityByBinColumnNameOne]));
			expect(PriorityByBinFiltersFirstcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange11_15][problemManagementTestDataObject.priorityByBinColumnNameOne]));
			expect(PriorityByBinFiltersFirstcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange6_10][problemManagementTestDataObject.priorityByBinColumnNameOne]));
			expect(PriorityByBinFiltersFirstcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange0_5][problemManagementTestDataObject.priorityByBinColumnNameOne]));
			expect(PriorityByBinFiltersSecondcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRangegreaterThan15][problemManagementTestDataObject.priorityByBinColumnNameTwo]));
			expect(PriorityByBinFiltersSecondcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange11_15][problemManagementTestDataObject.priorityByBinColumnNameTwo]));
			expect(PriorityByBinFiltersSecondcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange6_10][problemManagementTestDataObject.priorityByBinColumnNameTwo]));
			expect(PriorityByBinFiltersSecondcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange0_5][problemManagementTestDataObject.priorityByBinColumnNameTwo]));
			expect(PriorityByBinFiltersThirdcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRangegreaterThan15][problemManagementTestDataObject.priorityByBinColumnNameThree]));
			expect(PriorityByBinFiltersThirdcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange11_15][problemManagementTestDataObject.priorityByBinColumnNameThree]));
			expect(PriorityByBinFiltersThirdcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange6_10][problemManagementTestDataObject.priorityByBinColumnNameThree]));
			expect(PriorityByBinFiltersThirdcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange0_5][problemManagementTestDataObject.priorityByBinColumnNameThree]));
			expect(PriorityByBinFiltersFourthcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRangegreaterThan15][problemManagementTestDataObject.priorityByBinColumnNameFour]));
			expect(PriorityByBinFiltersFourthcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange11_15][problemManagementTestDataObject.priorityByBinColumnNameFour]));
			expect(PriorityByBinFiltersFourthcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange6_10][problemManagementTestDataObject.priorityByBinColumnNameFour]));
			expect(PriorityByBinFiltersFourthcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_age_bin[problemManagementTestDataObject.priorityByBinRange0_5][problemManagementTestDataObject.priorityByBinColumnNameFour]));
		}
		
		// Check all column Names are present for "Priorty By Bin" and "Priority By Status" Table
		var PriorityByBincloumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.prioritybyAgeBin);
		expect(PriorityByBincloumnNames).toContain(problemManagementTestDataObject.columnNameFilters);
		// Can not validate, as column values are dynamic in nature
		// (expect(PriorityByBincloumnNames).toContain(problemManagementTestDataObject.columnNameOne));
		// expect(PriorityByBincloumnNames).toContain(problemManagementTestDataObject.columnNameTwo);
		// expect(PriorityByBincloumnNames).toContain(problemManagementTestDataObject.columnNameThree);
		// expect(PriorityByBincloumnNames).toContain(problemManagementTestDataObject.columnNameFour);
		// Check Ascending Descending  order of table columns(Local filters) for Tables
		// Check for 'Priority by Age Bin' widget
		PriorityByBincloumnNames.shift();
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.prioritybyAgeBin, PriorityByBincloumnNames, problemManagementTestDataObject.OrderTypeDecending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.prioritybyAgeBin, PriorityByBincloumnNames, problemManagementTestDataObject.OrderTypeAcending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
	});

	it("Validate Contact Type's Column presence and data on 'Ticket Overview' Tab for Problem Management", async function () {
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected(problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		await util.waitForInvisibilityOfKibanaDataLoader();
		var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(problemManagementTestDataObject.contactType);
		if (status != true) {
			var contactTypecloumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.contactType);
			expect(contactTypecloumnNames).toContain(problemManagementTestDataObject.contactType);
			expect(contactTypecloumnNames).toContain(problemManagementTestDataObject.columnNameCount);
			if (browser.params.dataValiadtion) {
				var expected_Values_Contact_type = expected_ValuesProblemMgnt_ticket_overview.contact_type;
			var	contactTypeCountcloumnValues =  await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.contactType, problemManagementTestDataObject.SecondColumnOrGraphBar);
			expect(contactTypeCountcloumnValues[0]).toEqual(JSON.stringify(expected_Values_Contact_type[problemManagementTestDataObject.contactTypeRowNamePHONECALL]));
			expect(contactTypeCountcloumnValues[1]).toEqual(JSON.stringify(expected_Values_Contact_type[problemManagementTestDataObject.contactTypeRowNameEMAIL]));
			expect(contactTypeCountcloumnValues[2]).toEqual(JSON.stringify(expected_Values_Contact_type[problemManagementTestDataObject.contactTypeRowNameCHAT]));
			expect(contactTypeCountcloumnValues[3]).toEqual(JSON.stringify(expected_Values_Contact_type[problemManagementTestDataObject.contactTypeRowNameEVENTMANAGEMENT]));
			expect(contactTypeCountcloumnValues[4]).toEqual(JSON.stringify(expected_Values_Contact_type[problemManagementTestDataObject.contactTypeRowNamePHONE]));	
		}
		}
	})
	
	it("Validate Priority By Status Table's Column presence and Acending Decending Order Features on 'Ticket Overview' Tab for Problem Management", async function () {
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if(browser.params.dataValiadtion){
			var expected_Values_priority_by_status = expected_ValuesProblemMgnt_ticket_overview.priority_by_status;
			var PriorityByStatusFiltersFirstcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyStatus, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var PriorityByStatusFiltersSecondcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyStatus, problemManagementTestDataObject.thirdColumnOrGraphBar);
			var PriorityByStatusFiltersThirdcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyStatus, problemManagementTestDataObject.fourthColumnOrGraphBar);
			var PriorityByStatusFiltersFourthcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.prioritybyStatus, problemManagementTestDataObject.fifthColumnOrGraphBar);
			expect(PriorityByStatusFiltersFirstcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusAPPROVED][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCANCELLED][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCLOSED][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusINPROG][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[4]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusNEW][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[5]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusON_HOLD][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[6]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusQUEUED][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[7]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCA_COMPLE][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[8]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCACOMP][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersFirstcloumnValues[9]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusREADY_FOR][problemManagementTestDataObject.priorityByStatusColumnNameOne]));
			expect(PriorityByStatusFiltersSecondcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusAPPROVED][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCANCELLED][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCLOSED][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusINPROG][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[4]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusNEW][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[5]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusON_HOLD][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[6]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusQUEUED][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[7]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCA_COMPLE][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[8]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCACOMP][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersSecondcloumnValues[9]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusREADY_FOR][problemManagementTestDataObject.priorityByStatusColumnNameTwo]));
			expect(PriorityByStatusFiltersThirdcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusAPPROVED][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCANCELLED][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCLOSED][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusINPROG][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[4]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusNEW][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[5]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusON_HOLD][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[6]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusQUEUED][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[7]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCA_COMPLE][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[8]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCACOMP][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersThirdcloumnValues[9]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusREADY_FOR][problemManagementTestDataObject.priorityByStatusColumnNameThree]));
			expect(PriorityByStatusFiltersFourthcloumnValues[0]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusAPPROVED][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[1]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCANCELLED][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[2]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusCLOSED][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[3]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusINPROG][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[4]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusNEW][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[5]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusON_HOLD][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[6]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusQUEUED][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[7]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCA_COMPLE][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[8]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusRCACOMP][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
			expect(PriorityByStatusFiltersFourthcloumnValues[9]).toEqual(JSON.stringify(expected_Values_priority_by_status[problemManagementTestDataObject.priorityByStatusREADY_FOR][problemManagementTestDataObject.priorityByStatusColumnNameFour]));
		}
		
		// Check all column Names are present for  "Priority By Status" Table
		var PriorityByStatuscolumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.prioritybyStatus);
		// Can not validate, as column values are dynamic in nature
		// expect(PriorityByStatuscolumnNames).toContain(problemManagementTestDataObject.columnNameOne);
		// expect(PriorityByStatuscolumnNames).toContain(problemManagementTestDataObject.columnNameTwo);
		// expect(PriorityByStatuscolumnNames).toContain(problemManagementTestDataObject.columnNameThree);
		// expect(PriorityByStatuscolumnNames).toContain(problemManagementTestDataObject.columnNameFour);
		// Check Ascending Descending  order of table columns(Local filters) for Tables
		// Check for 'priorty by status' widget
		PriorityByStatuscolumnNames.shift();
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.prioritybyStatus, PriorityByStatuscolumnNames, problemManagementTestDataObject.OrderTypeDecending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.prioritybyStatus, PriorityByStatuscolumnNames, problemManagementTestDataObject.OrderTypeAcending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
	});

	it("Validate all  widgets and there Data are Present on 'Overall Trend' Tab for Problem Management", async function () {
		var widgetNameList = [problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.OwnerGroupbyVolumeofProblem, problemManagementTestDataObject.trendOfIncomingProblemVolumebyPriority,problemManagementTestDataObject.trendOfIncomingProblemVolumebyPriority];
		var widgetList = [problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.OwnerGroupVolumeOfProblemWidgetName, problemManagementTestDataObject.trendOfIncomingProblemVolumebyPriority,problemManagementTestDataObject.trendOfIncomingProblemVolumebyPriority];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		// check results are found for Widgets on Kibana report
		widgetList.forEach(async function (widgetName) {
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName);
			if(status != true){
			expect(await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName)).toBe(false);
			}
		});
	});

	it("Validate 'ticket count' Table's Column presence and Acending Decending Order Features on 'Overall Trend' Tab for Problem Management", async function () {
		var ticketCountColumnNamesList = [problemManagementTestDataObject.MTTRDays, problemManagementTestDataObject.PriorityColumnName, problemManagementTestDataObject.columnNameCount];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			serviceMgmtUtil.clickOnColumnIconBasedOnSortingOrder(problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.firstColumnOrGraphBar, problemManagementTestDataObject.OrderTypeAcending);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expected_Values_ticket_count = expected_ValuesProblemMgnt_overall_trend.ticket_count;
			var ticketCountCountcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var ticketCountMTTRcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.thirdColumnOrGraphBar);
			expect(ticketCountCountcloumnValues[0]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameOne][problemManagementTestData.columnNamecount]));
			expect(ticketCountCountcloumnValues[1]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameTwo][problemManagementTestData.columnNamecount]));
			expect(ticketCountCountcloumnValues[2]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameThree][problemManagementTestData.columnNamecount]));
			expect(ticketCountCountcloumnValues[3]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameFour][problemManagementTestData.columnNamecount]));
			expect(ticketCountMTTRcloumnValues[0]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameOne][problemManagementTestData.columnNameMTTR]));
			expect(ticketCountMTTRcloumnValues[1]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameTwo][problemManagementTestData.columnNameMTTR]));
			expect(ticketCountMTTRcloumnValues[2]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameThree][problemManagementTestData.columnNameMTTR]));
			expect(ticketCountMTTRcloumnValues[3]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameFour][problemManagementTestData.columnNameMTTR]));
		}
		var ticketCountColumnNamesListOnUI = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.ticketCount);
		// check all column Names are present for "Ticket Count" Table
		ticketCountColumnNamesList.forEach(function (ticketCountColumnName) {
			expect(ticketCountColumnNamesListOnUI).toContain(ticketCountColumnName);
		});
		ticketCountColumnNamesListOnUI.shift();
		// check for 'Ticket Count' widget (Ascending Descending order of cloumns)
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.ticketCount, ticketCountColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeAcending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.ticketCount, ticketCountColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeDecending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
	});

	it("Validate all  widgets and there Data are Present on 'Top Volume Drivers' Tab for Problem Management", async function () {
		var widgetNameList = [problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.OwnerGroupbyVolumeofProblem, problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.MinedCategorybyVolumeOfProblem, problemManagementTestDataObject.CausebyVolumeOfProblemRecords, problemManagementTestDataObject.subComponentbyVolumeOfProblemRecords];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		// check results are found for Widgets on Kibana report
		widgetNameList.forEach(async function (widgetName) {
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName);
			if(status != true){
			expect(await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName)).toBe(false);
			}
		});
	});

	it("Validate 'ticket count' Table's Column presence and Acending Decending Order Features on 'Top Volume Drivers' Tab for Problem Management", async function () {
		var ticketCountColumnNamesList = [problemManagementTestDataObject.MTTRDays, problemManagementTestDataObject.PriorityColumnName, problemManagementTestDataObject.columnNameCount];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var ticketCountColumnNamesListOnUI = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.ticketCount);
		//check all column Names are present for "Ticket Count" Table
		ticketCountColumnNamesList.forEach(function (ticketCountColumnName) {
			expect(ticketCountColumnNamesListOnUI).toContain(ticketCountColumnName);
		});
		if (browser.params.dataValiadtion) {
			serviceMgmtUtil.clickOnColumnIconBasedOnSortingOrder(problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.firstColumnOrGraphBar, problemManagementTestDataObject.OrderTypeAcending);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expected_Values_ticket_count = expected_ValuesProblemMgnt_top_volume_drivers.ticket_count;
			var ticketCountCountcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var ticketCountMTTRcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.ticketCount, problemManagementTestDataObject.thirdColumnOrGraphBar);
			expect(ticketCountCountcloumnValues[0]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameOne][problemManagementTestData.columnNamecount]));
			expect(ticketCountCountcloumnValues[1]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameTwo][problemManagementTestData.columnNamecount]));
			expect(ticketCountCountcloumnValues[2]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameThree][problemManagementTestData.columnNamecount]));
			expect(ticketCountCountcloumnValues[3]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameFour][problemManagementTestData.columnNamecount]));
			expect(ticketCountMTTRcloumnValues[0]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameOne][problemManagementTestData.columnNameMTTR]));
			expect(ticketCountMTTRcloumnValues[1]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameTwo][problemManagementTestData.columnNameMTTR]));
			expect(ticketCountMTTRcloumnValues[2]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameThree][problemManagementTestData.columnNameMTTR]));
			expect(ticketCountMTTRcloumnValues[3]).toEqual(JSON.stringify(expected_Values_ticket_count[problemManagementTestDataObject.columnNameFour][problemManagementTestData.columnNameMTTR]));
		}
		ticketCountColumnNamesListOnUI.shift();
		//check Ascending Descending  order of table columns(Local filters) for  'Ticket Count' Table
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.ticketCount, ticketCountColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeDecending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.ticketCount, ticketCountColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeAcending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
	});
	
	it("Validate Owner Group Sumarry Table's Column presence and Acending Decending Order Features on 'Top Volume Drivers' Tab for Problem Management", async function () {
		var overallGroupSummaryColumnNamesList = [problemManagementTestDataObject.MTTRDays, problemManagementTestDataObject.ownerGroupColumnName, problemManagementTestDataObject.columnNameCount];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var overallGroupSummaryColumnNamesListOnUI = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.OwnerGroupSummary);
		//check all column Names are present for "Overall group Summary" Table
		overallGroupSummaryColumnNamesList.forEach(function (overallGroupSummaryColumnName) {
			expect(overallGroupSummaryColumnNamesListOnUI).toContain(overallGroupSummaryColumnName);
		});
		if (browser.params.dataValiadtion) {
			
			util.waitForInvisibilityOfKibanaDataLoader();
			var expected_Values_owner_group_summary = expected_ValuesProblemMgnt_top_volume_drivers.owner_group_summary;
			var ticketCountCountcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var ticketCountMTTRcloumnValues = await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.thirdColumnOrGraphBar);
			var envKeyList = Object.keys(expected_Values_owner_group_summary);
			for (var i = 0; i < envKeyList.length; i++) {
			logger.info("value on UI for Count of coulumn No :" +i + " is :"+ticketCountCountcloumnValues[i]+" and value in JSON for "+envKeyList[i] + " is "  +expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNamecount]);
			// for ticketCountMTTRcloumnValues[i] = "-" the json will be undefined
			logger.info("value on UI for MTTR of coulumn No :" +i + " is :"+ticketCountMTTRcloumnValues[i]+" and value in JSON for "+envKeyList[i] + " is "  +expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNameMTTR]);
			var ticketCountCountcloumnValue = util.stringToInteger(ticketCountCountcloumnValues[i]);
			expect(ticketCountCountcloumnValue).toEqual(expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNamecount]);
			if(ticketCountMTTRcloumnValues[i] != "-")
			{
				//var ticketCountMTTRcloumnValue = util.stringToInteger(ticketCountMTTRcloumnValues[i])
			expect(ticketCountMTTRcloumnValues[i]).toEqual(JSON.stringify(expected_Values_owner_group_summary[envKeyList[i]][problemManagementTestData.columnNameMTTR]));
		}
			}
		}
		overallGroupSummaryColumnNamesListOnUI.shift();
		//check Ascending Descending order of table columns(Local filters) for  'Ticket Count' Table
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.OwnerGroupSummary, overallGroupSummaryColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeDecending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(problemManagementTestDataObject.OwnerGroupSummary, overallGroupSummaryColumnNamesListOnUI, problemManagementTestDataObject.OrderTypeAcending, problemManagementTestData.cloumnTypeNumeric)).toBe(true);
	});

	it("Validate Cause By Volume Of Problem Records's Column presence and data on 'Top Volume Drivers' Tab for Problem Management", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		util.waitForInvisibilityOfKibanaDataLoader()
			var CausebyVolumeOfProblemRecordscloumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(problemManagementTestDataObject.CausebyVolumeOfProblemRecords);
			expect(CausebyVolumeOfProblemRecordscloumnNames).toContain(problemManagementTestDataObject.columnNameCount);
			expect(CausebyVolumeOfProblemRecordscloumnNames).toContain(problemManagementTestDataObject.columnNameCause);
			if (browser.params.dataValiadtion) {
				var expected_Values_cause_by_volume_of_problem_records =  expected_ValuesProblemMgnt_top_volume_drivers.cause_by_volume_of_problem_records;
			var	CausebyVolumeOfProblemRecordsCountcloumnValues =  await serviceMgmtUtil.getColumnDataBasedOnColumnNo(problemManagementTestDataObject.CausebyVolumeOfProblemRecords, problemManagementTestDataObject.SecondColumnOrGraphBar);
			var envKeyList = Object.keys(expected_Values_cause_by_volume_of_problem_records);
			for (var i = 0; i < envKeyList.length; i++) {
				var CausebyVolumeOfProblemRecordsCountcloumnValue = util.stringToInteger(CausebyVolumeOfProblemRecordsCountcloumnValues[i]);
			expect(CausebyVolumeOfProblemRecordsCountcloumnValue).toEqual(expected_Values_cause_by_volume_of_problem_records[envKeyList[i]]);
			}
		}
	})

	it("Validate all  widget Names and widget Data are Present on 'Tickets Details' Tab", async function () {
		var widgetNameList = [problemManagementTestDataObject.ticketDetails];
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketDetailsLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		// check results are found for Widgets on Kibana report
		widgetNameList.forEach(async function (widgetName) {
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName);
			if(status != true){
			expect(await problem_management_page.isNoResultFoundTextPresentOnWidgets(widgetName)).toBe(false);
			}
		});
		await serviceMgmtUtil.downloadTicketDetailsXlsx();
		// Verify if the downloaded file exists or not
		expect(util.isTicketDetailsFileExists()).toBe(true);
	});

	it("Verify applied Global filter persist across all tabs within Problem magement and won't persist when moved to another report page", async function () {
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketOverviewLinkText);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Apply Contact Type filter with its first value
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestDataObject.priorityFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(problemManagementTestDataObject.priorityFilterName)).toBe(true);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(problemManagementTestDataObject.priorityFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(problemManagementTestDataObject.priorityFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied filter value
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to'Overall Trends' tab 
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on 'Overall Trends' with applied filter value on 'Ticket Overview' tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Top Volume Drivers tab 
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Top Volume Drivers tab with applied filter value on 'Ticket Overview' tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Ticket details tab
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketDetailsLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Ticket details tab with applied filter value on 'Ticket Overview' tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(filterValue);
		// Navigate to Problem Management page
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
		change_management_page.open();
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.problemManagementCard);
		problem_management_page.open();
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Problem Magement 'Ticket Overview' tab with default tooltip text
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
	});

	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Ticket Overview' Tab for Problem Management", async function () {
		util.waitForAngular();
		//tab link selection check
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		});

		// Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Validate each global filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
		// Iterate through "Creation Date" date-range filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
	});

	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Overall Trends' Tab for Problem Management", async function(){
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		// Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		// Validate each global filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
		//Iterate through "Creation Date" date-range global filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader(problemManagementTestDataObject.createdOnFilterName);
		// Verify tooltip text with applied global filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
	});

	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Top Volume Drivers' Tab for Problem Management", async function(){
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		//// Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		// Validate each global filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		//Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied global filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
		// Iterate through each date-range global filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader(problemManagementTestDataObject.createdOnFilterName);
		// Verify tooltip text with applied global filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
	});

	it("verify global Filter's Presence ,Expantion, default and selected Tooltip text  on 'Ticket Details' Tab for Problem Management", async function(){
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketDetailsLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketDetailsLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(async function (globalFilter) {
			await expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(problemManagementTestDataObject.createdOnFilterName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// // Validate each global filter default tooltip text (None selected)
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.assignmentQueueFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.priorityFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.statusFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(problemManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Creation Date date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.defaultCreationDateFilterDateRangeDiff);
		// Validate each global filter is expanded or not
		globalFilterList.forEach(async function (globalFilter) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Iterate through each date-range filter, select first value and verify tooltip text
		await serviceMgmtUtil.clickOnDateRangeFilterButton(problemManagementTestDataObject.createdOnFilterName);
		await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(problemManagementTestDataObject.createdOnFilterName)).toBe(true);
		var last30DaysText = problemManagementTestDataObject.lastCustomDaysDateRangeText.format(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await serviceMgmtUtil.selectDateRangeFilterValue(last30DaysText);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied global filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(problemManagementTestDataObject.createdOnFilterName)).toEqual(problemManagementTestDataObject.thirtyDaysDateRangeDiff);
		await util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select global filter, select first value and verify tooltip text
		for (var globalFilter of globalFilterToolTipList) {
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(await serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied global filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
				await util.waitForInvisibilityOfKibanaDataLoader();
			}
		}
	});

	it("Verify Local Filter (owner's Group) Functionality doesn't persist accross all the Tabs", async function () {
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		//click on first bar graph of owner group
		serviceMgmtUtil.clickOnGraphFirstHorizontalBar(problemManagementTestDataObject.ownerGroupGraph);
		var GraphLabelName = await serviceMgmtUtil.getKibanaBarGraphYaxisFirstLabelsBasedOnWidgetName(problemManagementTestDataObject.ownerGroupGraph);
		//click on filter button of owner group
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestDataObject.ownerGroupFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(problemManagementTestDataObject.ownerGroupFilterName)).toBe(true);
		//validate only bar graph label visible to equal only value present on 'owner group' filter 
		expect(problem_management_page.getFilterValueTextBasedOnName(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(GraphLabelName);
		var problemCountValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount);
		//validate only bar of graph tooltip text to equal problem count and only bar graph label visible
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(problemManagementTestDataObject.firstColumnOrGraphBar, problemManagementTestDataObject.ownerGroupGraph)).toEqual(GraphLabelName);
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(problemManagementTestDataObject.SecondColumnOrGraphBar, problemManagementTestDataObject.ownerGroupGraph)).toEqual(problemCountValue);
		//validate 'Owner group' widget value should equal to 1 as particular owner group filter is selected
		expect(serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.ownerGroup)).toEqual(problemManagementTestData.OwnergroupValue);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to'Overall Trends' tab 
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.overallTrendLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var ticketCount = await problem_management_page.getTicketCountTableTotalCountText();
		//validate 'problem count' value on 'Ticket Overview' should not equal or less than 'problem count' on 'overall trends' tab
		expect(util.stringToInteger(problemCountValue)).toBeLessThan(util.stringToInteger(ticketCount));
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		//Navigate to Top Volume Drivers tab 
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		ticketCount = await problem_management_page.getTicketCountTableTotalCountText();
		//validate 'problem count' value on 'Ticket Overview' should not equal or less than 'problem count' on 'Top Voulme Drivers' tab
		expect(util.stringToInteger(problemCountValue)).toBeLessThan(util.stringToInteger(ticketCount));
		//click on first bar graph of owner group
		serviceMgmtUtil.clickOnGraphFirstHorizontalBar(problemManagementTestDataObject.OwnerGroupbyVolumeofProblem);
		var OwnerGroupGraphLabelName = await serviceMgmtUtil.getKibanaBarGraphYaxisFirstLabelsBasedOnWidgetName(problemManagementTestDataObject.OwnerGroupbyVolumeofProblem);
		await util.waitForInvisibilityOfKibanaDataLoader();
		//click on filter button of owner group
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(problemManagementTestDataObject.ownerGroupFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(problemManagementTestDataObject.ownerGroupFilterName)).toBe(true);
		await util.waitForInvisibilityOfKibanaDataLoader();
		ticketCount = await problem_management_page.getTicketCountTableTotalCountText();
		//validate only bar graph label visible to equal only value present on 'owner group' filter 
		expect(problem_management_page.getFilterValueTextBasedOnName(problemManagementTestDataObject.ownerGroupFilterName)).toEqual(OwnerGroupGraphLabelName);
		//validate only bar of graph tooltip text to equal problem count and only bar graph label visible
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(problemManagementTestDataObject.firstColumnOrGraphBar, problemManagementTestDataObject.OwnerGroupbyVolumeofProblem)).toEqual(OwnerGroupGraphLabelName);
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(problemManagementTestDataObject.SecondColumnOrGraphBar, problemManagementTestDataObject.OwnerGroupbyVolumeofProblem)).toEqual(ticketCount);
		//validate only bar graph label,count visible to equal only value present on 'owner group Summary Table' column 
		expect(await serviceMgmtUtil.getColumnFirstValueBasedOnTableName(problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.firstColumnOrGraphBar)).toEqual(OwnerGroupGraphLabelName);
		expect(await serviceMgmtUtil.getColumnFirstValueBasedOnTableName(problemManagementTestDataObject.OwnerGroupSummary, problemManagementTestDataObject.SecondColumnOrGraphBar)).toEqual(serviceMgmtUtil.getFirstBarGraphToolTipText(problemManagementTestDataObject.SecondColumnOrGraphBar, problemManagementTestDataObject.OwnerGroupbyVolumeofProblem));
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.ticketOverviewLinkText);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		problemCountValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(problemManagementTestData.problemCount);
		//validate 'problem count' value on 'Ticket Overview' should not equal or less than 'problem count' on 'Top Voulme Drivers' tab
		expect(util.stringToInteger(ticketCount)).toBeLessThan(util.stringToInteger(problemCountValue));

	});

	if (browser.params.dataValiadtion) {
	it("Validate all value count from 'Owner Group by Volume of Problem' horizontal bar chart with JSON data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
		
		serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
		expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
		util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------Data validation------");
			var ownerGroupKeys = Object.keys(expected_ValuesProblemMgnt_top_volume_drivers.owner_group_by_volume_of_problem);
			var ownerGroupValues = Object.values(expected_ValuesProblemMgnt_top_volume_drivers.owner_group_by_volume_of_problem);
			var ownerGroupLength = ownerGroupKeys.length;
			if(ownerGroupLength > 5){ ownerGroupLength=5 }
			for(var i=0; i<ownerGroupLength; i++){
				var problemCount = await serviceMgmtUtil.getCountFromHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, ownerGroupKeys[i]);
				await expect(problemCount).toEqual(ownerGroupValues[i]);
			}
		
	});
}

	if (browser.params.dataValiadtion) {
		it("Validate all value count from 'Mined Category by Volume of Problem' horizontal bar chart with JSON data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.topVolumeDriversLinktext)).toBe(true);
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------Data validation------");
			var minedCategoryKeys = Object.keys(expected_ValuesProblemMgnt_top_volume_drivers.mined_category_by_volume_of_problem);
			var minedCategoryValues = Object.values(expected_ValuesProblemMgnt_top_volume_drivers.mined_category_by_volume_of_problem);
			var minedCategoryLength = minedCategoryKeys.length;
			if(minedCategoryLength > 5) { minedCategoryLength = 5 }
			for(var i=0; i<minedCategoryLength; i++){
				var problemCount = await serviceMgmtUtil.getCountFromHorizontalBarGraphWidget(problemManagementTestData.MinedCategorybyVolumeOfProblem, minedCategoryKeys[i]);
				await expect(problemCount).toEqual(minedCategoryValues[i]);
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Validate all value count from 'Owner Group by Volume of Problem' horizontal bar chart with JSON data  on 'Ticket Overview' Tab for Problem Management", async function () {
			expect(serviceMgmtUtil.isTabLinkSelected (problemManagementTestDataObject.ticketOverviewLinkText)).toBe(true);
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------Data validation------");
			var ownerGroupKeys = Object.keys(expected_ValuesProblemMgnt_ticket_overview.owner_group);
			var ownerGroupValues = Object.values(expected_ValuesProblemMgnt_ticket_overview.owner_group);
			var ownerGroupLength = ownerGroupKeys.length ;
			if(ownerGroupLength >5){ ownerGroupLength=5 }
			for(var i=0; i<ownerGroupLength; i++){
				var problemCount = await serviceMgmtUtil.getCountFromHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, ownerGroupKeys[i]);
				await expect(problemCount).toEqual(ownerGroupValues[i]);
			}
		});
	}

	if (isEnabledESValidation) {
		it("Validate all value count from 'Owner Group by Volume of Problem' Horizontal bar chart with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get Y-Axis labels list from horizontal bar chart widget
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem);
			var problemCountUIList = await serviceMgmtUtil.getCountListForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, yAxisLabels);
			var problemCountESList = await esQueriesProblem.getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, yAxisLabels);
			// Verify the list of count values for each Y-axis label from UI with the list of count values from ES query response
			expect(util.compareArrays(problemCountUIList, problemCountESList)).toBe(true);
		});
	}
	
	if (isEnabledESValidation) {
		it("Validate all value count from 'Contact Type' 2 column Table widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var status = await problem_management_page.isNoResultFoundTextPresentOnWidgets(problemManagementTestDataObject.contactType);
			if (status != true) {
				logger.info("------ES Query validation------");
				// Get list of cell values from the first column [row filter names]
				var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestData.contactType);
				var countListFromUI = await serviceMgmtUtil.getCountListFrom2ColumnsTableWidget(problemManagementTestData.contactType, firstColCellValuesList);
				var countListFromES = await esQueriesProblem.getContactTypeTableWidgetCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList);
				// Verify the list of count values for each row filter value from UI with the list of count values from ES query response
				expect(util.compareArrays(countListFromUI, countListFromES)).toBe(true);
			}
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Priority by Age Bin' Table widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestDataObject.prioritybyAgeBin);
			var columnList = await serviceMgmtUtil.getColumnNameListFromTableWidget(problemManagementTestDataObject.prioritybyAgeBin);
			columnList.shift();
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.prioritybyAgeBin);
			var countListFromES = await esQueriesProblem.getListOfCountListFromPrioritybyAgeBinTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList, columnList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Priority by Status' Table widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
			util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestDataObject.prioritybyStatus);
			var columnList = await serviceMgmtUtil.getColumnNameListFromTableWidget(problemManagementTestDataObject.prioritybyStatus);
			columnList.shift();
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.prioritybyStatus);
			var countListFromES = await esQueriesProblem.getListOfCountListFromPriorityByStatusTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList, columnList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		// Commented due to kibana limitation wave charts count can not be verified properly. Defect ID: AIOP-6522

		// it("Validate all value count from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget with ES Query data  on 'Ticket Overview' Tab for Problem Management", async function () {
		// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfTotalCountListFromMultiWaveGraphPoints(problemManagementTestData.trendOfIncomingProblemVolumebyPriority, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });

		// Need to skip the test case as global filters Created and Resolved are not available now 
		// it("Validate count from 'Priority by Age Bin' Table widget applying 'Created' filter values with ES Query data from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget on 'Ticket Overview' Tab for Problem Management", async function () {
		// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfSummaryCountListFromTableWidget(problemManagementTestData.prioritybyAgeBin, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Ticket count' Table widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.ticketCount);
			var countListFromES = await esQueriesProblem.getListOfCountListFromTicketCountTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		// Commented due to kibana limitation wave charts count can not be verified properly. Defect ID: AIOP-6522

		// it("Validate all value count from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
		// 	await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	util.waitForAngular();
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfTotalCountListFromMultiWaveGraphPoints(problemManagementTestData.trendOfIncomingProblemVolumebyPriority, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });

		// Need to skip the test case as global filters Created and Resolved are not available now 
		// it("Validate count from 'Ticket Count' Table widget applying 'Created' filter values with ES Query data from 'Trend Of Incoming Problem Volume by Priority' Multi-wave data points widget on 'Overall Trend' Tab for Problem Management", async function () {
		// 	await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	util.waitForAngular();
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	logger.info("------ES Query validation------");
		// 	var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.createdFilterName);
		// 	expect(util.isListEmpty(filterValues)).toBe(false);
		// 	if(!util.isListEmpty(filterValues)){
		// 		var countListFromUI = await serviceMgmtUtil.getListOfListOfColumnValuesFromTableWidget(problemManagementTestData.ticketCount, problemManagementTestData.createdFilterName, filterValues);
		// 		var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
		// 		// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
		// 		expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		// 	}
		// });
	}

	// Commented due to kibana limitation wave charts count can not be verified properly. Defect ID: AIOP-6522

	// if(isEnabledESValidation) {
	// 	it("Validate all value count from 'Trend Of Resolved Problem Volume by Priority' Multi-wave data points widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
	// 		await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
	// 		util.switchToFrameById(frames.cssrIFrame);
	// 		util.waitForAngular();
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		logger.info("------ES Query validation------");
	// 		var filterValues = await serviceMgmtUtil.getAllValuesFromMultiselectFilter(problemManagementTestData.resolvedFilterName);
	// 		expect(util.isListEmpty(filterValues)).toBe(false);
	// 		if(!util.isListEmpty(filterValues)){
	// 			var countListFromUI = await serviceMgmtUtil.getListOfTotalCountListFromMultiWaveGraphPoints(problemManagementTestData.TrendOfResolvedProblemVolumebyPriority, problemManagementTestData.resolvedFilterName, filterValues);
	// 			var countListFromES = await esQueriesProblem.getListOfCountListFromTrendOfResolvedProblemVolumebyPriorityMultiWaveWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, filterValues);
	// 			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
	// 			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
	// 		}
	// 	});
	// }

	if(isEnabledESValidation) {
		it("Validate all value count from 'Owner Group by Volume of Problem' Name list widget with ES Query data  on 'Overall Trend' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.overallTrendLinkText);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			var listOfNames = await serviceMgmtUtil.getAllNamesFromNameListWidget(problemManagementTestData.OwnerGroupbyVolumeofProblemWidget);
			var countListFromUI = await serviceMgmtUtil.getListOfCountForNameListWidgetSections(problemManagementTestData.OwnerGroupbyVolumeofProblemWidget, listOfNames);
			var countListFromES = await esQueriesProblem.getCountListForOwnerGroupByVolumeOfProblemWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, listOfNames);
			expect(util.compareArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if (isEnabledESValidation) {
		it("Validate all value count from 'Owner Group by Volume of Problem' Horizontal bar chart with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get Y-Axis labels list from horizontal bar chart widget
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem);
			var problemCountUIList = await serviceMgmtUtil.getCountListForHorizontalBarGraphWidget(problemManagementTestData.OwnerGroupbyVolumeofProblem, yAxisLabels);
			var problemCountESList = await esQueriesProblem.getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, yAxisLabels);
			// Verify the list of count values for each Y-axis label from UI with the list of count values from ES query response
			expect(util.compareArrays(problemCountUIList, problemCountESList)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Ticket count' Table widget with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var countListFromUI = await serviceMgmtUtil.getListOfCountListColumnWiseFromTableWidget(problemManagementTestDataObject.ticketCount);
			var countListFromES = await esQueriesProblem.getListOfCountListFromTicketCountTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Owner Group Summary' Table widget with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(problemManagementTestDataObject.OwnerGroupSummary);
			var countListFromUI = await serviceMgmtUtil.getListOfCountListRowWiseFromTableWidget(problemManagementTestDataObject.OwnerGroupSummary, firstColCellValuesList);
			var countListFromES = await esQueriesProblem.getListOfCountListFromOwnerGroupSummaryTableWidget(problemManagementTestData.eSProblemSearchIndex, tenantId, firstColCellValuesList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Validate all value count from 'Mined Category by Volume of Problem' Horizontal bar chart with ES Query data  on 'Top Volume Drivers' Tab for Problem Management", async function () {
			await serviceMgmtUtil.clickOnTabLink(problemManagementTestDataObject.topVolumeDriversLinktext);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			await util.waitForInvisibilityOfKibanaDataLoader();
			logger.info("------ES Query validation------");
			// Get Y-Axis labels list from horizontal bar chart widget
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(problemManagementTestData.MinedCategorybyVolumeOfProblem);
			var problemCountUIList = await serviceMgmtUtil.getCountListForHorizontalBarGraphWidget(problemManagementTestData.MinedCategorybyVolumeOfProblem, yAxisLabels);
			var problemCountESList = await esQueriesProblem.getMinedCategoryByVolumeOfProblemHorizontalBarGraphCountList(problemManagementTestData.eSProblemSearchIndex, tenantId, yAxisLabels);
			// Verify the list of count values for each Y-axis label from UI with the list of count values from ES query response
			expect(util.compareArrays(problemCountUIList, problemCountESList)).toBe(true);
		});
	}

	afterAll(async function() {
		await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});
