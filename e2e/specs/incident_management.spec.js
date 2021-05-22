/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	incident_management = require('../pageObjects/incident_management.pageObject.js'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	pervasiveInsightsPage = require('../pageObjects/pervasive_insights.pageObject.js'),
	appUrls = require('../../testData/appUrls.json'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	incidentManagementTestData = require('../../testData/cards/incidentManagementTestData.json'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	frames = require('../../testData/frames.json'),
	serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
	expectedData = require('../../testData/expected_value/incident_management_expected_values.json'),
	util = require('../../helpers/util.js'),
	esQueriesIncident=require('../../elasticSearchTool/esQuery_incidentPayload.js'),
	tenantId = browser.params.tenantId,
	isEnabledESValidation = browser.params.esValidation;

describe('Incident management - functionality', function () {
	var incidentManagementObj, launchpadObj, dashboardObj, pervasiveInsightsObj;
	var globalFilterList = [incidentManagementTestData.assignmentQueueFilterName,incidentManagementTestData.serviceLineFilterName,incidentManagementTestData.assignmentGroupFilterName,incidentManagementTestData.applicationsFilterName,incidentManagementTestData.priorityFilterName,incidentManagementTestData.statusFilterName,incidentManagementTestData.contactTypeFilterName,incidentManagementTestData.locationFilterName];
	var dateRangeFilterList = [incidentManagementTestData.createdFilterName,incidentManagementTestData.resolvedFilterName, incidentManagementTestData.closedFilterName];
	var incidentDashboardTabWidgetNameList = [incidentManagementTestData.incomingVolWidgetName, incidentManagementTestData.MTTRInclHoldWidgetName, incidentManagementTestData.MTTRExclHoldWidgetName, incidentManagementTestData.resolvedWidgetName, incidentManagementTestData.backlogWidgetName, incidentManagementTestData.reopenedWidgetName, incidentManagementTestData.maxReopenedWidgetName, incidentManagementTestData.priorityViewWidgetName, incidentManagementTestData.regionWiseViewWidgetName, incidentManagementTestData.maxReassignWidgetName, incidentManagementTestData.companyViewWidgetName, incidentManagementTestData.contactTypeWidgetName, incidentManagementTestData.agingBacklogWidgetName, incidentManagementTestData.assignmentParentWidgetName, incidentManagementTestData.top25CitiesWidgetName, incidentManagementTestData.top50AssignmentGrpWidgetName, incidentManagementTestData.categoryViewWidgetName, incidentManagementTestData.subCategoryViewWidgetName, incidentManagementTestData.originalVsActualPriorityWidgetName, incidentManagementTestData.reassignmentBucketWidgetName];
	var topographyTabWidgetNameList = [incidentManagementTestData.siteIdCountWidgetName, incidentManagementTestData.buildingIdsWidgetName, incidentManagementTestData.countryWidgetName, incidentManagementTestData.citiesCountWidgetName, incidentManagementTestData.MTTRInclHoldWidgetName, incidentManagementTestData.MTTRExclHoldWidgetName, incidentManagementTestData.priorityViewWidgetName, incidentManagementTestData.top25StreetAddrWidgetName, incidentManagementTestData.countryViewWidgetName, incidentManagementTestData.topAssignmentParentWidgetName, incidentManagementTestData.personCityViewWidgetName, incidentManagementTestData.topIssueCategoryWidgetName, incidentManagementTestData.top25BuildingIdWidgetName, incidentManagementTestData.top25SiteIdCountWidgetName, incidentManagementTestData.top10StreetAddrIssueCategoryWidgetName];
	var trendsTabWidgetNameList = [incidentManagementTestData.createdVolWeeklyTrendWidgetName, incidentManagementTestData.resolvedVolWeeklyTrendWidgetName, incidentManagementTestData.createdVolMonthlyTrendWidgetName, incidentManagementTestData.resolvedVolMonthlyTrendWidgetName, incidentManagementTestData.priorityViewWidgetName, incidentManagementTestData.MTTRInclHoldWeeklyTrendPriorityViewWidgetName, incidentManagementTestData.MTTRExclHoldWeeklyTrendPriorityViewWidgetName, incidentManagementTestData.whatTimeOfTheDayTheIncidentsResolvedWidgetName, incidentManagementTestData.whatTimeOfTheDayTheIncidentsTriggeredWidgetName];
	var ticketDetailsColumnList = [incidentManagementTestData.numberColumnName, incidentManagementTestData.createDateTimeColumnName, incidentManagementTestData.descColumnName, incidentManagementTestData.priorityColumnName, incidentManagementTestData.subCategoryColumnName, incidentManagementTestData.MTTRInclHoldColumnName, incidentManagementTestData.MTTRExclHoldColumnName, incidentManagementTestData.hostNameColumnName, incidentManagementTestData.statusColumnName];
	var incidentDashboard_expectedData = expectedData.incident_dashboard;
	var incidentDashboard_defaultFilters = incidentDashboard_expectedData.default_filters.expected_values;
	var topography_expectedData = expectedData.topography;
	var topography_defaultFilters = topography_expectedData.default_filters.expected_values;
	var trends_expectedData = expectedData.trends;
	var trends_defaultFilters = trends_expectedData.default_filters.expected_values;
	var ticketDetails_expectedData = expectedData.ticket_details;
	var ticketDetails_defaultFilters = ticketDetails_expectedData.default_filters.expected_values;

	beforeAll(function () {
		incidentManagementObj = new incident_management();
		launchpadObj = new launchpad();
		dashboardObj = new dashboard();
		pervasiveInsightsObj = new pervasiveInsightsPage();
		browser.driver.manage().window().maximize();

	});

	beforeEach(function () {
		launchpadObj.open();
		expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		incidentManagementObj.open();
		expect(util.getCurrentURL()).toMatch(appUrls.incidentManagementPageUrl);
	});

	it("Verify navigation to Incident Management landing page using Common tasks card from Launchpad page", function(){
		launchpadObj.open();
		launchpadObj.clickOnTileBasedOnHeaderAndTileName(launchpadTestData.sectionHeader_getStartedHeaderText,launchpadTestData.commonTask_IncidentMgmtCardTitle);
		expect(util.getCurrentURL()).toMatch(appUrls.incidentManagementPageUrl);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		expect(util.getHeaderTitleText()).toEqual(incidentManagementTestData.headerTitle);
		util.clickOnHeaderDashboardLink();
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
	});

	it("Verify navigation to Incident Management landing page using View details link from Dashboard landing page", async function(){
		await launchpadObj.open();
		await launchpadObj.clickOnIntelligentItOprLink();
        await launchpadObj.clickOnDashboardTile(launchpadTestData.learnPage_aiopsDashboardTile);
		await dashboardObj.open();
		expect(await util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
        expect(await dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.incidentManagement);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		expect(await util.getHeaderTitleText()).toEqual(incidentManagementTestData.headerTitle);
		expect(await util.getCurrentURL()).toMatch(appUrls.incidentManagementPageUrl);
	});

	it("Verify info tooltip and tab links", function(){
		var tabLinkList = [incidentManagementTestData.incidentDashboardTabLink,incidentManagementTestData.topographyTabLink,incidentManagementTestData.trendsTabLink,incidentManagementTestData.ticketDetailsTabLink];
		serviceMgmtUtil.clickOnLastupdatedInfoIcon();
		expect(serviceMgmtUtil.getLastupdatedInfoIconText()).toBe(incidentManagementTestData.headerInfoToolTipText);
		tabLinkList.forEach(function (tabLink) {
			expect(serviceMgmtUtil.getAllTabsLinkText()).toContain(tabLink);
		});
		// Calling again to close the toop tip panel
		serviceMgmtUtil.clickOnLastupdatedInfoIcon();
	});

	// Need to skip the test case as global filters Created Month and Resolved Month are not available now 
	// it('Verify the incident count(Incident created) on Incident Management card and kibana report', async function () {
	// 	util.clickOnHeaderDashboardLink();
	// 	util.waitForAngular();
	// 	await dashboardObj.open();
	// 	expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
	// 	expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
	// 	var twoMonthsPreviousTicketCreatedValue = await dashboardObj.getMatrixBarGraphTicketText(dashboardTestData.incidentManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated);
	// 	var oneMonthPreviousTicketCreatedValue = await dashboardObj.getMatrixBarGraphTicketText(dashboardTestData.incidentManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated);
	// 	var currentMonthTicketCreatedValue = await dashboardObj.getMatrixBarGraphTicketText(dashboardTestData.incidentManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated);

	// 	var twoMonthsPreviousTicketResolvedValue = await dashboardObj.getMatrixBarGraphTicketText(dashboardTestData.incidentManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketResolved);
	// 	var oneMonthPreviousTicketResolvedValue = await dashboardObj.getMatrixBarGraphTicketText(dashboardTestData.incidentManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketResolved);
	// 	var currentMonthTicketResolvedValue = await dashboardObj.getMatrixBarGraphTicketText(dashboardTestData.incidentManagement, dashboardTestData.currentMonth, dashboardTestData.ticketResolved);

	// 	var twoMonthsPreviousName = util.getPreviousMonthName(2);
	// 	var oneMonthsPreviousName = util.getPreviousMonthName(1);
	// 	var currentMonthName = util.getPreviousMonthName(0);

	// 	await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.incidentManagement);
	// 	util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
	// 	expect(util.getCurrentURL()).toMatch(appUrls.incidentManagementPageUrl);

	// 	//selects 2 month's Previous filter to fetch Indcident created text
	// 	await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.createdMonthFilterName);
	// 	await serviceMgmtUtil.selectFilterValueBasedOnName(incidentManagementTestData.createdMonthFilterName, twoMonthsPreviousName);
	// 	await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.createdMonthFilterName);
	// 	await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)).toEqual(twoMonthsPreviousTicketCreatedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(incidentManagementTestData.createdMonthFilterName, twoMonthsPreviousName);
	// 	});

	// 	//selects 1 month's Previous filter to fetch Indcident created text
	// 	await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.createdMonthFilterName);
	// 	await serviceMgmtUtil.selectFilterValueBasedOnName(incidentManagementTestData.createdMonthFilterName, oneMonthsPreviousName);
	// 	await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.createdMonthFilterName);
	// 	await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)).toEqual(oneMonthPreviousTicketCreatedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(incidentManagementTestData.createdMonthFilterName, oneMonthsPreviousName);
	// 	});

	// 	//selects current month's filter to fetch fetch Indcident created text
	// 	await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.createdMonthFilterName);
	// 	await serviceMgmtUtil.selectFilterValueBasedOnName(incidentManagementTestData.createdMonthFilterName, currentMonthName);
	// 	await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.createdMonthFilterName);
	// 	await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)).toEqual(currentMonthTicketCreatedValue);
	// 		// serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)
	// 		await serviceMgmtUtil.deselectFilterValue(incidentManagementTestData.createdMonthFilterName, currentMonthName);
	// 	});

	// 	//selects 2 month's Previous filter to fetch Indcident resolved text
	// 	await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.resolveMonthFilterName);
	// 	await serviceMgmtUtil.selectFilterValueBasedOnName(incidentManagementTestData.resolveMonthFilterName, twoMonthsPreviousName);
	// 	await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.resolveMonthFilterName);
	// 	await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)).toEqual(twoMonthsPreviousTicketResolvedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(incidentManagementTestData.resolveMonthFilterName, twoMonthsPreviousName);
	// 	});

	// 	//selects 1 month's Previous filter to fetch Incident Resolved  text
	// 	await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.resolveMonthFilterName);
	// 	await serviceMgmtUtil.selectFilterValueBasedOnName(incidentManagementTestData.resolveMonthFilterName, oneMonthsPreviousName);
	// 	await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.resolveMonthFilterName);
	// 	await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)).toEqual(oneMonthPreviousTicketResolvedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(incidentManagementTestData.resolveMonthFilterName, oneMonthsPreviousName);
	// 	});

	// 	//selects current month's  filter to fetch Incident Resolved  text
	// 	await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.resolveMonthFilterName);
	// 	await serviceMgmtUtil.selectFilterValueBasedOnName(incidentManagementTestData.resolveMonthFilterName, currentMonthName);
	// 	await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.resolveMonthFilterName);
	// 	await serviceMgmtUtil.clickOnApplyFilterButton().then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(incidentManagementTestData.incomingValueCardName)).toEqual(currentMonthTicketResolvedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(incidentManagementTestData.resolveMonthFilterName,currentMonthName);
	// 	});
	// });

	it("Verify Global filters visibility and their default value/tool tip text on Incident Dashboard tab", function(){
		// Verify if Incident Dashboard tab is selected by default or not
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Verify Global filters presence
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		});
		// Verify Date-range Global filters presence
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(dateRangeFilter);
		});
		// Verify default value / tool tip text for each global filters
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		});
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters visibility and their default value/tool tip text on Topography tab", function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Verify Global filters presence
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		});
		// Verify Date-range Global filters presence
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(dateRangeFilter);
		});
		// Verify default value / tool tip text for each global filters
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		});
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters visibility and their default value/tool tip text on Trends tab", function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Verify Global filters presence
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		});
		// Verify Date-range Global filters presence
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(dateRangeFilter);
		});
		// Verify default value / tool tip text for each global filters
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		});
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters visibility and their default value/tool tip text on Ticket Details tab", function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Verify Global filters presence
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		});
		// Verify Date-range Global filters presence
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(dateRangeFilter);
		});
		// Verify default value / tool tip text for each global filters
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		});
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		dateRangeFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});
	
	it("Verify Global filters functionality on Incident Dashboard tab", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select filter, select first value and verify tooltip text for each tab
		for(var globalFilter of globalFilterList){
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
			}
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of dateRangeFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(incidentManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(incidentManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.closedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
	});

   
	it("Verify implementation of 'Applications' filter from  global filter across the incident management card",async function(){
		//Select the Application & apply the filter 
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		//Apply application filter 
		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.applicationsFilterName);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(incidentManagementTestData.applicationsFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.applicationsFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		//Validate for topography tab 
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.applicationsFilterName)).toEqual(filterValue);  		
		await util.waitForInvisibilityOfKibanaDataLoader();
		//Valdiate for trend tab 
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.applicationsFilterName)).toEqual(filterValue);  		
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Validate for ticket tab 
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.applicationsFilterName)).toEqual(filterValue);  		
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Reset the applied filter 
		await util.clickOnResetFilterLink();	
		await util.waitForInvisibilityOfKibanaDataLoader();
	});

	it("Verify that priority tree view  are getting updated on applying global 'Applications' filter from incident management",async function(){
		//Select the Application and apply the filter 
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		//Apply application filter 
        await serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.applicationsFilterName);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(incidentManagementTestData.applicationsFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.applicationsFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
	    // Get the total of priority view on applying application filter from incident tab 
		var countOfpriorityFromIncidentTab = await serviceMgmtUtil.getTreemapHoverTooltipValue(incidentManagementTestData.priorityViewWidgetName);		
        util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		//Valdiate priority view for topography tab 
		 await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
		 util.switchToFrameById(frames.cssrIFrame);
		 await util.waitForInvisibilityOfKibanaDataLoader();
		 var countofPriorityFromEachTabs=await serviceMgmtUtil.getTreemapHoverTooltipValue(incidentManagementTestData.priorityViewWidgetName);		
		//Compare priority view topography tab to incident management tab  
		 await expect(countofPriorityFromEachTabs).toEqual(countOfpriorityFromIncidentTab);
		//Valdiate priority view for trend tab
		 util.switchToDefault();
		 util.switchToFrameById(frames.mcmpIframe);
		 await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		 util.switchToFrameById(frames.cssrIFrame);
		 await util.waitForInvisibilityOfKibanaDataLoader();
		 var countofPriorityFromEachTabs=await serviceMgmtUtil.getTreemapHoverTooltipValue(incidentManagementTestData.priorityViewWidgetName);		
		//Compare priority view trend tab to incident management tab  
		 await expect(countofPriorityFromEachTabs).toEqual(countOfpriorityFromIncidentTab);
		// Reset the applied filter 
        await util.clickOnResetFilterLink();	
        await util.waitForInvisibilityOfKibanaDataLoader();
	});

	it("Verify Global filters functionality on Topography tab", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select filter, select first value and verify tooltip text for each tab
		for(var globalFilter of globalFilterList){
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
			}
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of dateRangeFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(incidentManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(incidentManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.closedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
	});

	it("Verify Global filters functionality on Trends tab", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select filter, select first value and verify tooltip text for each tab
		for(var globalFilter of globalFilterList){
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
			}
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of dateRangeFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(incidentManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(incidentManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.closedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
	});

	it("Verify Global filters functionality on Ticket Details tab", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Iterate through each multi-select filter, select first value and verify tooltip text for each tab
		for(var globalFilter of globalFilterList){
			await serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			await expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
			var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(globalFilter);
			if(filterValue != false){
				await serviceMgmtUtil.clickOnUpdateFilterButton(globalFilter);
				await serviceMgmtUtil.clickOnApplyFilterButton();
				await util.waitForInvisibilityOfKibanaDataLoader();
				// Verify tooltip text with applied filter value
				await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(filterValue);
				await serviceMgmtUtil.deselectFilterValue(globalFilter, filterValue);
			}
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of dateRangeFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(incidentManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(incidentManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.resolvedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.closedFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
	});

	it("Verify applied Global filter persist across all tabs within Incident Management and won't persist when moved to another report page", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Apply Assignment Queue filter with its first value
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.assignmentQueueFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(incidentManagementTestData.assignmentQueueFilterName)).toBe(true);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(incidentManagementTestData.assignmentQueueFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.assignmentQueueFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied filter value
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(filterValue);
		var incomingVolFromIncidentDashboard = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		var mttrExclHoldFromIncidentDashboard = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetName);
		var mttrInclHoldFromIncidentDashboard = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolInt = util.stringToInteger(incomingVolFromIncidentDashboard);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Topography tab 
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Toporaphy tab with applied filter value on Incident Dashboard tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(filterValue);
		var mttrExclHoldFromTopography = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetNameTopography);
		var mttrInclHoldFromTopography = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
		expect(mttrExclHoldFromIncidentDashboard).toEqual(mttrExclHoldFromTopography);
		expect(mttrInclHoldFromIncidentDashboard).toEqual(mttrInclHoldFromTopography);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Trends tab 
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Trends tab with applied filter value on Incident Dashboard tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(filterValue);
		// Add values from Priority view widget charts
		var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(incidentManagementTestData.priorityViewWidgetName);
		var totalIncomingVolCountFromPriorityViewCharts = await pervasiveInsightsObj.getTotalTicketCountFromPriorityViewFilter(legendsList);
		// Verify Incoming vol count on Incident Dashboard tab with Total Count from Priority View widget charts on Trends tab
		expect(totalIncomingVolCountFromPriorityViewCharts).toEqual(incomingVolInt);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Ticket details tab
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Ticket details tab with applied filter value on Incident Dashboard tab
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(filterValue);
		// Verify if Ticket details tab table row count equals to Incoming Vol value from Incident Dashboard tab
		expect(serviceMgmtUtil.getTicketDetailsTableRowsCount()).toEqual(incomingVolInt);
		// Navigate to Pervasive Insights page
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.pervasiveInsightsCard);
		pervasiveInsightsObj.open();
		// Navigate back to Incident Management page
		incidentManagementObj.open();
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on Incident Dashboard tab with default tooltip text
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
	});

	it("Verify Incoming vol count from Incident Dashboard tab with Ticket Details table and downloaded ticket details xlsx", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		/**
		 * Verify Incoming vol count on Incident Dashboard tab with ticket details table row count
		 * If Incoming vol count >= 10000
		 */
		var incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolCountInt = util.stringToInteger(incomingVolCount);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Ticket details tab
        serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		if(incomingVolCountInt >= 10000){
			// Verify if Ticket details tab table row count equals to Incoming vol count from Incident Dashboard tab
			expect(serviceMgmtUtil.getTicketDetailsTableRowsCount()).toEqual(incomingVolCountInt);
			await serviceMgmtUtil.downloadTicketDetailsXlsx();
			// Verify if the downloaded file exists or not
			expect(util.isTicketDetailsFileExists()).toBe(true);
			var json_data = util.getDataFromXlsxFile();
			// Verify if Tickets count from Json data equals to 10000 [Max number of rows in xlsx file if Total ticket count >= 10000]
			expect(incidentManagementTestData.maxRowsTicketDetailsXlsx).toEqual(util.getTicketCountFromJsonData(json_data));
		}
		if (browser.params.dataValiadtion) {
			logger.info("------Data validation------");
			var ticketNumberForDefaultFilters = ticketDetails_defaultFilters.ticket_id;
			expect(await serviceMgmtUtil.isTicketNumberPresentInTicketDetailsTable(ticketNumberForDefaultFilters)).toBe(true);
		}
		/**
		 * Verify Incoming vol count on Incident Dashboard tab with ticket details table row count and with downloaded xlsx row count
		 * If Incoming vol count < 10000
		 */
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Incident dashboard tab
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Set Incoming vol count below 10K
		await serviceMgmtUtil.setTicketCountBelow10K(incidentManagementTestData.incomingVolWidgetName, globalFilterList);
		incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		incomingVolCountInt = util.stringToInteger(incomingVolCount);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Ticket details tab
        serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// Verify if Ticket details tab table row count equals to Incident vol count from Incident Dashboard tab
		expect(serviceMgmtUtil.getTicketDetailsTableRowsCount()).toEqual(incomingVolCountInt);
		await serviceMgmtUtil.downloadTicketDetailsXlsx();
		// Verify if the downloaded file exists or not
		expect(util.isTicketDetailsFileExists()).toBe(true);
		var json_data = util.getDataFromXlsxFile();
		// Verify if Incoming vol count from Incident Dashboard tab equals to Tickets count from Json data
		expect(incomingVolCountInt).toEqual(util.getTicketCountFromJsonData(json_data));
	});

	it("Validate all widget Names are Present on 'Incident Dashboard' Tab", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check all widgets on Kibana report are Present
		expect(serviceMgmtUtil.verifyWidgetNamesPresentOnKibanaReport(incidentDashboardTabWidgetNameList)).toBe(true);
		if (browser.params.dataValiadtion) {
			var incomingVol = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
			var MTTRInclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
			var MTTRExclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetName);
			var resolvedCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.resolvedWidgetName);
			var backlogCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.backlogWidgetName);
			var reopenedCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.reopenedWidgetName);
			var maxReopened = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.maxReopenedWidgetName);
			var maxReassign = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.maxReassignWidgetName);
			logger.info("------Data validation------");
			expect(util.stringToInteger(incomingVol)).toEqual(incidentDashboard_defaultFilters.incoming_vol);
			expect(parseFloat(MTTRInclVal)).toEqual(incidentDashboard_defaultFilters.mttr_incl_hold);
			expect(parseFloat(MTTRExclVal)).toEqual(incidentDashboard_defaultFilters.mttr_excl_hold);
			expect(util.stringToInteger(resolvedCount)).toEqual(incidentDashboard_defaultFilters.resolved_incidents);
			expect(util.stringToInteger(backlogCount)).toEqual(incidentDashboard_defaultFilters.backlog_incidents);
			expect(util.stringToInteger(reopenedCount)).toEqual(incidentDashboard_defaultFilters.reopened_incidents);
			expect(util.stringToInteger(maxReopened)).toEqual(incidentDashboard_defaultFilters.reopened_max);
			expect(util.stringToInteger(maxReassign)).toEqual(incidentDashboard_defaultFilters.max_reassign);
		}
		if(isEnabledESValidation){
			var incomingVol = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
			var MTTRInclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
			var MTTRExclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetName);
			var resolvedCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.resolvedWidgetName);
			var backlogCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.backlogWidgetName);
			var reopenedCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.reopenedWidgetName);
			var maxReopened = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.maxReopenedWidgetName);
			var maxReassign = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.maxReassignWidgetName);
			logger.info("------ES Data validation------");
			expect(util.stringToInteger(incomingVol)).toEqual(await esQueriesIncident.getDefaultIncomingVolCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(parseFloat(MTTRInclVal)).toEqual(await esQueriesIncident.getDefaultMTTRInclCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(parseFloat(MTTRExclVal)).toEqual(await esQueriesIncident.getDefaultMTTRExclCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(resolvedCount)).toEqual(await esQueriesIncident.getDefaultResolvedCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(backlogCount)).toEqual(await esQueriesIncident.getDefaultBacklogCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(reopenedCount)).toEqual(await esQueriesIncident.getDefaultReopenedCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(maxReopened)).toEqual(await esQueriesIncident.getDefaultMaxReopenedCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(maxReassign)).toEqual(await esQueriesIncident.getDefaultMaxReassignCount(incidentManagementTestData.esIncidentIndex,tenantId));
		}
	});

	it("Validate all widget Names are Present on 'Topography' Tab", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check all widgets on Kibana report are Present
		expect(serviceMgmtUtil.verifyWidgetNamesPresentOnKibanaReport(topographyTabWidgetNameList)).toBe(true);
		if (browser.params.dataValiadtion) {
			var siteIdCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.siteIdCountWidgetName);
			var MTTRInclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
			var MTTRExclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetNameTopography);
			var buildingIdCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.buildingIdsWidgetName);
			var countryCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.countryWidgetName);
			var citiesCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.citiesCountWidgetName);
			logger.info("------Data validation------");
			// site_id_count is missing in JSON
			// expect(util.stringToInteger(siteIdCount)).toEqual(topography_defaultFilters.site_id_count);
			expect(parseFloat(MTTRInclVal)).toEqual(topography_defaultFilters.mttr_incl_hold);
			expect(parseFloat(MTTRExclVal)).toEqual(topography_defaultFilters.mttr_excl_hold);
			expect(util.stringToInteger(buildingIdCount)).toEqual(topography_defaultFilters.building_id_count);
			expect(util.stringToInteger(countryCount)).toEqual(topography_defaultFilters.country_count);
			expect(util.stringToInteger(citiesCount)).toEqual(topography_defaultFilters.cities_count);
		}
		if(isEnabledESValidation){
			var siteIdCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.siteIdCountWidgetName);
			var MTTRInclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
			var MTTRExclVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetNameTopography);
			var buildingIdCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.buildingIdsWidgetName);
			var countryCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.countryWidgetName);
			var citiesCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.citiesCountWidgetName);
			logger.info("------ES Data validation------");
			expect(util.stringToInteger(siteIdCount)).toEqual(await esQueriesIncident.getDefaultSiteIdCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(parseFloat(MTTRInclVal)).toEqual(await esQueriesIncident.getDefaultMTTRInclCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(parseFloat(MTTRExclVal)).toEqual(await esQueriesIncident.getDefaultMTTRExclCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(buildingIdCount)).toEqual(await esQueriesIncident.getDefaultBuildingIdCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(countryCount)).toEqual(await esQueriesIncident.getDefaultPersonCountryCount(incidentManagementTestData.esIncidentIndex,tenantId));
			expect(util.stringToInteger(citiesCount)).toEqual(await esQueriesIncident.getDefaultPersonCityCount(incidentManagementTestData.esIncidentIndex,tenantId));
		}
	});

	it("Validate all widget Names are Present on 'Trends' Tab", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check all widgets on Kibana report are Present
		expect(serviceMgmtUtil.verifyWidgetNamesPresentOnKibanaReport(trendsTabWidgetNameList)).toBe(true);
	});

	it("Validate all columns names are Present on 'Ticket Details' Table", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Check all column names in ticket details table
		expect(serviceMgmtUtil.verifyColumnNamesPresentInTicketDetailsTable(ticketDetailsColumnList)).toBe(true);
	});

	it("Verify Local filters [Widgets] visibility and their functionality", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify all priority view local filters before click on any one
		var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(incidentManagementTestData.priorityViewWidgetName);
		var isListEmpty = util.isListEmpty(legendsList);
		expect(isListEmpty).toBe(false);
		if(!isListEmpty){
			legendsList.forEach(function (legendName){
				expect(serviceMgmtUtil.verifySectionFromBoxFilterWidget(incidentManagementTestData.priorityViewWidgetName, legendName)).toBe(true);
			});
			if (browser.params.dataValiadtion) {
				logger.info("------Data validation------");
				// Get json object for a widget
				var jsonObjForPriorityViewWidget = incidentDashboard_defaultFilters.priority_view;
				expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.priorityViewWidgetName,jsonObjForPriorityViewWidget)).toBe(true);
			}
			await pervasiveInsightsObj.clickOnPriorityViewFilter(legendsList[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify all priority view local filters after click on first one
			expect(serviceMgmtUtil.verifySectionFromBoxFilterWidget(incidentManagementTestData.priorityViewWidgetName, legendsList[0])).toBe(true);
			for(var i=1; i<legendsList.length; i++){
				expect(serviceMgmtUtil.verifySectionFromBoxFilterWidget(incidentManagementTestData.priorityViewWidgetName, legendsList[i])).toBe(false);
			}
			var incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
			var incomingVolCountIntBefore = util.stringToInteger(incomingVolCount);
			// Verify if the Incoming vol count from widget equals to Tooltip text ticket count from selected priority view filter
			expect(serviceMgmtUtil.getCountFromBoxFilterSections(incidentManagementTestData.priorityViewWidgetName, legendsList[0])).toEqual(incomingVolCountIntBefore);
			var mttrInclHoldFromIncidentDashboardTab = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
			var mttrExclHoldFromIncidentDashboardTab = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetName);
			// Navigate to Topography tab
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var mttrInclHoldFromTopographyTab = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRInclHoldWidgetName);
			var mttrExclHoldFromTopographyTab = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.MTTRExclHoldWidgetNameTopography);
			// Verify if MTTR Incl/Excl Hold value on Incident Dashboard tab not equals to MTTR Incl/Excl Hold value on Topography tab
			expect(parseFloat(mttrInclHoldFromIncidentDashboardTab)).toBeGreaterThan(parseFloat(mttrInclHoldFromTopographyTab));
			expect(parseFloat(mttrExclHoldFromIncidentDashboardTab)).toBeGreaterThan(parseFloat(mttrExclHoldFromTopographyTab));
			// Navigate to Trends tab
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Add values from Priority view widget charts
			legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(incidentManagementTestData.priorityViewWidgetName);
			var totalIncomingVolCountFromPriorityViewCharts = await pervasiveInsightsObj.getTotalTicketCountFromPriorityViewFilter(legendsList);
			// Verify Incoming vol count on Incident Dashboard tab with Total Count from Priority View widget charts on Trends tab
			expect(incomingVolCountIntBefore).toBeLessThan(totalIncomingVolCountFromPriorityViewCharts);
			// Navigate to Ticket details tab
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.ticketDetailsTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.ticketDetailsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify if Ticket details tab table row count not equals to Tickets count from Incident Dashboard tab
			expect(incomingVolCountIntBefore).toBeLessThan(serviceMgmtUtil.getTicketDetailsTableRowsCount());
			// Navigate to Incident Dashboard tab
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify all priority view local filters
			legendsList.forEach(function (legendName){
				expect(serviceMgmtUtil.verifySectionFromBoxFilterWidget(incidentManagementTestData.priorityViewWidgetName, legendName)).toBe(true);
			});
			incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
			var incomingVolCountIntAfter = util.stringToInteger(incomingVolCount);
			// Verify Total ticket count after applying local filters and navigate back to same tab
			expect(incomingVolCountIntBefore).toBeLessThan(incomingVolCountIntAfter);
		}
	});

	it("Incoming volumne count and priority total in priority view widget should match", async function() 
	{
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolCountInt = util.stringToInteger(incomingVolCount);
		//Getting total priority value
		var totalpriority = await serviceMgmtUtil.getTreemapHoverTooltipValue(incidentManagementTestData.priorityViewWidgetName);
		expect(totalpriority).toEqual(incomingVolCountInt);
	});

	it("Incoming volume count and sum of P1-Severe, P2-Major, P3-Minor, P4-Minimal in original vs actual priority widget view should match", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		var incomingVolCountInt = util.stringToInteger(incomingVolCount);
		var totalpriority = await incidentManagementObj.getOriginalvsActualcountVal(incidentManagementTestData.originalVsActualPriorityWidgetName);
		expect(totalpriority).toEqual(incomingVolCountInt);
	});

	it("Verify reset global filters functionality", async function(){
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var incomingVolFromIncidentDashboardBefore = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolIntBefore = util.stringToInteger(incomingVolFromIncidentDashboardBefore);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		// Verify default tooltip text for global filter Assignment Queue
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		// Apply Assignment Queue filter with its first value
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(incidentManagementTestData.assignmentQueueFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(incidentManagementTestData.assignmentQueueFilterName)).toBe(true);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(incidentManagementTestData.assignmentQueueFilterName);
		await serviceMgmtUtil.clickOnUpdateFilterButton(incidentManagementTestData.assignmentQueueFilterName);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied filter value
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(filterValue);
		// Apply created date-range filter with "Last 60 days" value
		await serviceMgmtUtil.clickOnDateRangeFilterButton(incidentManagementTestData.createdFilterName);
		await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(incidentManagementTestData.createdFilterName)).toBe(true);
		await serviceMgmtUtil.selectDateRangeFilterValue(incidentManagementTestData.dateRangeFilterLast60Days);
		await serviceMgmtUtil.clickOnApplyFilterButton();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text with applied filter value
		await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.dateRangeFilter60DaysDiff);
		var incomingVolFromIncidentDashboardAfter = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolIntAfter = util.stringToInteger(incomingVolFromIncidentDashboardAfter);
		expect(incomingVolIntBefore).toBeGreaterThan(incomingVolIntAfter);
		await util.clickOnResetFilterLink();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text after reset filters
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(incidentManagementTestData.assignmentQueueFilterName)).toEqual(incidentManagementTestData.noneSelectedTooltipText);
		// Verify date diff for created date range filter after reset filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(incidentManagementTestData.createdFilterName)).toEqual(incidentManagementTestData.defaultCreatedFilterDateRangeDiff);
		incomingVolFromIncidentDashboardAfter = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		incomingVolIntAfter = util.stringToInteger(incomingVolFromIncidentDashboardAfter);
		expect(incomingVolIntBefore).toEqual(incomingVolIntAfter);
	});

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Company View' box filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get json object for a widget
			var jsonObjForCompanyViewWidget = incidentDashboard_defaultFilters.company_view;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.companyViewWidgetName,jsonObjForCompanyViewWidget)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Contact Type' horizontal bar graph widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var contactTypeJsonObj = incidentDashboard_defaultFilters.contact_type;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(incidentManagementTestData.contactTypeWidgetDataTitleName,contactTypeJsonObj)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Aging Backlog' breakdown horizontal bar graph widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var agingBacklogJsonObj = incidentDashboard_defaultFilters.aging_backlog;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBreakdownHorizontalBarGraph(incidentManagementTestData.agingBacklogWidgetName,agingBacklogJsonObj)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Assignment Parent' horizontal bar graph widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var assignParentJsonObj = incidentDashboard_defaultFilters.assignment_group_parent;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(incidentManagementTestData.assignmentParentWidgetDataTitleName,assignParentJsonObj)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Top 25 Cities' box filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get json object for a widget
			var jsonObjForTop25CitiesWidget = incidentDashboard_defaultFilters.top_25_cities;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.top25CitiesWidgetDataTitleName,jsonObjForTop25CitiesWidget)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Top 50 Assignment Group' box filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get json object for a widget
			var jsonObjForTop50AssignGroupWidget = incidentDashboard_defaultFilters.top_50_assignment_group;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.top50AssignmentGrpWidgetDataTitleName,jsonObjForTop50AssignGroupWidget)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Category View' box filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get json object for a widget
			var jsonObjForCategoryViewWidget = incidentDashboard_defaultFilters.category_view;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.categoryViewWidgetDataTitleName,jsonObjForCategoryViewWidget)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Sub Category View' box filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get json object for a widget
			var jsonObjForSubCategoryViewWidget = incidentDashboard_defaultFilters.subcategory_view;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.subCategoryViewWidgetDataTitleName,jsonObjForSubCategoryViewWidget)).toBe(true);
		});
	}

	it("Validate Incoming vol count priority-wise from 'Original Vs Actual Priority' table filter widget", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var totalCountList = await serviceMgmtUtil.getTotalCountListColumnWiseFromTableWidget(incidentManagementTestData.originalVsActualPriorityWidgetName);
		var summaryValuesList = await serviceMgmtUtil.getSummaryValuesListFromTableWidget(incidentManagementTestData.originalVsActualPriorityWidgetName);
		expect(util.compareArrays(totalCountList,summaryValuesList)).toBe(true);
	});

	it("Validate count priority-wise from 'Reassignment Bucket' table filter widget", async function(){
		await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var totalCountList = await serviceMgmtUtil.getTotalCountListColumnWiseFromTableWidget(incidentManagementTestData.reassignmentBucketWidgetName);
		var summaryValuesList = await serviceMgmtUtil.getSummaryValuesListFromTableWidget(incidentManagementTestData.reassignmentBucketWidgetName);
		expect(util.compareArrays(totalCountList,summaryValuesList)).toBe(true);
	});

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Original Vs Actual Priority' table filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var originalActualPriorityJsonObj = incidentDashboard_defaultFilters.original_vs_actual_priority;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForTableWidget(incidentManagementTestData.originalVsActualPriorityWidgetName,originalActualPriorityJsonObj)).toBe(true);
		});
	}

	if (browser.params.dataValiadtion) {
		it("Data validation for 'Reassignment Bucket' table filter widget on Incident Dashboard tab", async function(){
			logger.info("------Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			var reassignBucketJsonObj = incidentDashboard_defaultFilters.reassignment_bucket;
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForTableWidget(incidentManagementTestData.reassignmentBucketWidgetName,reassignBucketJsonObj)).toBe(true);
		});
	}

	it("Incoming volume comparsion with region widgets before and after applying region widget local filter applying", async function() {
		serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
        expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Before applying local filter
		var incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolCountInt = util.stringToInteger(incomingVolCount);
		var totalRegionViseCount = await serviceMgmtUtil.getTooltipCountFromDonutChart(incidentManagementTestData.regionWiseViewWidgetName);
		expect(incomingVolCountInt).toEqual(totalRegionViseCount);
		// After applying local filter
		await serviceMgmtUtil.clickPortionDonutChart(incidentManagementTestData.regionWiseViewWidgetName);
		util.waitForInvisibilityOfKibanaDataLoader();
		var incomingVolCount = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(incidentManagementTestData.incomingVolWidgetName);
		// Remove comma (',') from string and convert to integer
		var incomingVolCountInt = util.stringToInteger(incomingVolCount);
		var totalRegionViseCount = await serviceMgmtUtil.getTooltipCountFromDonutChart(incidentManagementTestData.regionWiseViewWidgetName);
		expect(incomingVolCountInt).toEqual(totalRegionViseCount);
	});

	if(isEnabledESValidation) {
		it("Data validation for Priority View on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var priorityViewObjFromES = await esQueriesIncident.priorityView(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.priorityViewWidgetName,priorityViewObjFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Company View on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var companyViewObjFromES = await esQueriesIncident.companyView(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.companyViewWidgetName,companyViewObjFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Contact Type on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var contactTypeObjFromES = await esQueriesIncident.contactType(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(incidentManagementTestData.contactTypeWidgetDataTitleName, contactTypeObjFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Aging Backlog on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsForHorizontalBarGraphWidget(incidentManagementTestData.agingBacklogWidgetName);
			var agingBacklogObj = await esQueriesIncident.agingBacklog(incidentManagementTestData.esIncidentIndex,tenantId,yAxisLabels);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBreakdownHorizontalBarGraph(incidentManagementTestData.agingBacklogWidgetName,agingBacklogObj)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Assignment Parent on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var assignmentParentObjFromES = await esQueriesIncident.assignmentGroupParent(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(incidentManagementTestData.assignmentParentWidgetDataTitleName, assignmentParentObjFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Top 25 cities on Incident dashboard tab", async function(){
			logger.info("------ Personcity function on Incident dashboard tab : ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var keyCountVal = 25;
			var personCityObjFromES = await esQueriesIncident.personCity(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFiltersDynamic(incidentManagementTestData.top25CitiesWidgetDataTitleName,personCityObjFromES,keyCountVal)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Top 50 Assignment Group on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var keyCountVal = 5;
			var assignmentGroupObjFromES = await esQueriesIncident.assignmentGroup(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFiltersDynamic(incidentManagementTestData.top50AssignmentGrpWidgetDataTitleName,assignmentGroupObjFromES,keyCountVal)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Category View on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var categoryViewObjFromES = await esQueriesIncident.categoryView(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.categoryViewWidgetDataTitleName,categoryViewObjFromES)).toBe(true);
		});
	}

	if(isEnabledESValidation) {
		it("Data validation for Sub-Category View on Incident dashboard tab", async function(){
			logger.info("------ES Data validation------");
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var subCategoryViewObjFromES = await esQueriesIncident.subcategoryView(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.subCategoryViewWidgetDataTitleName,subCategoryViewObjFromES)).toBe(true);
		});
	}

	if (isEnabledESValidation) {
		it("Data validation for 'Original Vs Actual Priority' table filter widget on Incident Dashboard tab", async function(){
			logger.info("------ES Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(incidentManagementTestData.originalVsActualPriorityWidgetName);
			var countListFromUI = await serviceMgmtUtil.getListOfCountListRowWiseFromTableWidget(incidentManagementTestData.originalVsActualPriorityWidgetName, firstColCellValuesList);
			var countListFromES = await esQueriesIncident.originalVsActualPriority(incidentManagementTestData.esIncidentIndex, tenantId, firstColCellValuesList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if (isEnabledESValidation) {
		it("Data validation for 'Reassignment Bucket' table filter widget on Incident Dashboard tab", async function(){
			logger.info("------ES Data validation------");
			await serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.incidentDashboardTabLink);
			// Verify if tab is selected, after clicking on it or not
			await expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.incidentDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(incidentManagementTestData.reassignmentBucketWidgetName);
			var countListFromUI = await serviceMgmtUtil.getListOfCountListRowWiseFromTableWidget(incidentManagementTestData.reassignmentBucketWidgetName, firstColCellValuesList);
			var countListFromES = await esQueriesIncident.reassignmentBucket(incidentManagementTestData.esIncidentIndex, tenantId, firstColCellValuesList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});
	}

	if (isEnabledESValidation) {
		it("Data validation for Priority View on Topography tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var priorityViewObjFromES = await esQueriesIncident.priorityView(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.priorityViewWidgetName,priorityViewObjFromES)).toBe(true);
		});

		it("Data validation for Top 25 Street Addresses on Topography tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var keyCountVal = 5;
			var streetAddrObjFromES = await esQueriesIncident.top25StreetAddress(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFiltersDynamic(incidentManagementTestData.top25StreetAddrWidgetDataTitleName,streetAddrObjFromES,keyCountVal)).toBe(true);
		});

		it("Data validation for Top Assignment Parent on Topography tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var assignmentParentObjFromES = await esQueriesIncident.assignmentGroupParent(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(incidentManagementTestData.topAssignmentParentWidgetDataTitleName, assignmentParentObjFromES)).toBe(true);
		});

		it("Data validation for Top 25 Building ID on Topography tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var keyCountVal = 5;
			var buildingIdObjFromES = await esQueriesIncident.top25BuildingId(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFiltersDynamic(incidentManagementTestData.top25BuildingIdWidgetName,buildingIdObjFromES,keyCountVal)).toBe(true);
		});

		it("Data validation for Top 25 Site ID count on Topography tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var keyCountVal = 25;
			var siteIdCountObjFromES = await esQueriesIncident.top25SiteId(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFiltersDynamic(incidentManagementTestData.top25SiteIdCountWidgetName,siteIdCountObjFromES,keyCountVal)).toBe(true);
		});

		it("Data validation for Top 10 Street Address Issue Category on Topography Tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.topographyTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var yAxisLabels = await serviceMgmtUtil.getYAxisLabelsListForHeatMapFilter(incidentManagementTestData.top10StreetAddrIssueCategoryWidgetName);
			var ListOfCountListFromES = await esQueriesIncident.top10StreetAddressIssueCategory(incidentManagementTestData.esIncidentIndex,tenantId,yAxisLabels);
			var ListOfCountListFromUI = await serviceMgmtUtil.getListOfCountListUsingNameMapWidgetFromHeatMapWidget(incidentManagementTestData.top10StreetAddrIssueCategoryWidgetName,incidentManagementTestData.topIssueCategoryWidgetName,yAxisLabels);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(ListOfCountListFromES, ListOfCountListFromUI)).toBe(true);
		});
	}

	if (isEnabledESValidation) {
		it("Data validation for Created Volume Monthly Trend on Trends tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(incidentManagementTestData.createdVolMonthlyTrendWidgetName);
			var createdVolMothlyTrendObjFromES = await esQueriesIncident.createdVolumeMonthlyTrend(incidentManagementTestData.esIncidentIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(incidentManagementTestData.createdVolMonthlyTrendWidgetName,createdVolMothlyTrendObjFromES)).toBe(true);
		});

		it("Data validation for Resolved Volume Monthly Trend on Trends tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(incidentManagementTestData.resolvedVolMonthlyTrendWidgetDataTitleName);
			var resolvedVolMothlyTrendObjFromES = await esQueriesIncident.resolvedVolumeMonthlyTrend(incidentManagementTestData.esIncidentIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(incidentManagementTestData.resolvedVolMonthlyTrendWidgetDataTitleName,resolvedVolMothlyTrendObjFromES)).toBe(true);
		});

		it("Data validation for Priority View on Trends tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var priorityViewObjFromES = await esQueriesIncident.priorityView(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForBoxFilters(incidentManagementTestData.priorityViewWidgetName,priorityViewObjFromES)).toBe(true);
		});

		it("Data validation for Created Volume Weekly Trend on Trends tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(incidentManagementTestData.createdVolWeeklyTrendWidgetName);
			var createdVolWeeklyTrendObjFromES = await esQueriesIncident.createdVolumeWeeklyTrend(incidentManagementTestData.esIncidentIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(incidentManagementTestData.createdVolWeeklyTrendWidgetName,createdVolWeeklyTrendObjFromES)).toBe(true);
		});

		it("Data validation for Resolved Volume Weekly Trend on Trends tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(incidentManagementTestData.resolvedVolWeeklyTrendWidgetName);
			var resolvedVolWeeklyTrendObjFromES = await esQueriesIncident.resolvedVolumeWeeklyTrend(incidentManagementTestData.esIncidentIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(incidentManagementTestData.resolvedVolWeeklyTrendWidgetName,resolvedVolWeeklyTrendObjFromES)).toBe(true);
		});

		// Blocked by: https://jira.gravitant.net/browse/AIOP-7864

		// it("Data validation for MTTR Incl Hold Weekly Trend Priority View on Trends tab", async function(){
		// 	logger.info("------ES Data validation------");
		// 	serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
		// 	// Verify if tab is selected, after clicking on it or not
		// 	expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	util.waitForAngular();
		// 	var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(incidentManagementTestData.MTTRInclHoldWeeklyTrendPriorityViewWidgetName);
		// 	var legendNames = await serviceMgmtUtil.getLegendNamesFromLocalFilter(incidentManagementTestData.MTTRInclHoldWeeklyTrendPriorityViewWidgetName);
		// 	var priorityBasedListOfCountListFromES = await esQueriesIncident.mttrInclHoldWeeklyTrendPriorityView(incidentManagementTestData.esIncidentIndex,tenantId,xAxisLabels,legendNames);
		// 	var priorityBasedListOfCountListFromUI = await serviceMgmtUtil.getListOfCountListBasedOfEachWaveGraph(incidentManagementTestData.MTTRInclHoldWeeklyTrendPriorityViewWidgetName,legendNames,incidentManagementTestData.priorityFilterName);
		// 	expect(util.compareNestedArrays(priorityBasedListOfCountListFromES, priorityBasedListOfCountListFromUI)).toBe(true);
		// });

		it("Data validation for What Time Of The Day The Incidents Triggered on Trends Tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var whatTimeOfTheDayTheIncidentsTriggeredObjFromES = await esQueriesIncident.whatTimeOfTheDayTheIncidentsTriggered(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHeatMapWidget(incidentManagementTestData.whatTimeOfTheDayTheIncidentsTriggeredWidgetName, whatTimeOfTheDayTheIncidentsTriggeredObjFromES)).toBe(true);
		});

		it("Data validation for What Time Of The Day The Incidents Resolved on Trends Tab", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(incidentManagementTestData.trendsTabLink);
			// Verify if tab is selected, after clicking on it or not
			expect(serviceMgmtUtil.isTabLinkSelected(incidentManagementTestData.trendsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var whatTimeOfTheDayTheIncidentsResolvedObjFromES = await esQueriesIncident.whatTimeOfTheDayTheIncidentsResolved(incidentManagementTestData.esIncidentIndex,tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHeatMapWidget(incidentManagementTestData.whatTimeOfTheDayTheIncidentsResolvedWidgetDataTitleName, whatTimeOfTheDayTheIncidentsResolvedObjFromES)).toBe(true);
		});
	}

	afterAll(async function() {
		await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
	
});