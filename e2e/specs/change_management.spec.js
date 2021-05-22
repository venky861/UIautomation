/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	change_management = require('../pageObjects/change_management.pageObject.js'),
	appUrls = require('../../testData/appUrls.json'),
	util = require('../../helpers/util.js'),
	serviceMgmtUtil = require('../../helpers/serviceMgmtUtil.js'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	changeManagementTestData = require('../../testData/cards/changeManagementTestData.json'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	frames = require('../../testData/frames.json'),
	expected_values = require('../../expected_values.json'),
	change_Mgmt_expected_values = require('../../testData/expected_value/change_management_expected_values.json'),
	esQueriesChange = require('../../elasticSearchTool/esQuery_ChangePayload.js'),
	tenantId = browser.params.tenantId,
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	isEnabledESValidation = browser.params.esValidation;

describe('Change management - functionality ', function () {
	var change_management_page, dashboard_page, launchpad_page;
	var changeManagementTestDataObject = JSON.parse(JSON.stringify(changeManagementTestData));
	var globalFilterList = [changeManagementTestDataObject.assignmentQueueFilterName, changeManagementTestDataObject.locationFilterName, changeManagementTestDataObject.assignmentGroupFilterName, changeManagementTestDataObject.statusFilterName, changeManagementTestDataObject.serviceLineFilterName]
	var datePickerGlobalFilterList = [changeManagementTestDataObject.createdOnFilterName, changeManagementTestDataObject.closedOnFilterName, changeManagementTestDataObject.scheduledStartFilterName, changeManagementTestDataObject.scheduledFinishFilterName]
	var expected_valuesObj, expected_ValuesChangeMgmtDashboard, expected_ValuesChangeMgmtTopography, expected_ValuesChangeMgmtTrend ,expected_values_change_Mgmt_Obj;
	beforeAll(function () {
		change_management_page = new change_management();
		dashboard_page = new dashboard();
		launchpad_page = new launchpad();
		browser.driver.manage().window().maximize();
		expected_valuesObj = JSON.parse(JSON.stringify(expected_values));
		expected_values_change_Mgmt_Obj = JSON.parse(JSON.stringify(change_Mgmt_expected_values));
		expected_ValuesChangeMgmtDashboard = expected_values_change_Mgmt_Obj.dashboard.default_filters.expected_values;
		expected_ValuesChangeMgmtTopography = expected_values_change_Mgmt_Obj.topography.default_filters.expected_values;
		expected_ValuesChangeMgmtTrend = expected_values_change_Mgmt_Obj.trend.default_filters.expected_values;
	});

	beforeEach(function () {
		launchpad_page.open();
		expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
		change_management_page.open();
	});

	// Need to skip the test case as global filter Created is not available now 
	// it('Verify the change count(change created) on Change Management card and kibana report', async function () {
	// 	launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboard_page.open();
	// 	var twoMonthsPreviousChangeCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated);
	// 	var oneMonthPreviousChangeCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated);
	// 	var currentMonthChangeCreatedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated);
	// 	var twoMonthsPreviousChangeImplementedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketResolved);
	// 	var oneMonthPreviousChangeImplementedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketResolved);
	// 	var currentMonthChangeImplementedValue = await dashboard_page.getMatrixBarGraphTicketText(dashboardTestData.changeManagement, dashboardTestData.currentMonth, dashboardTestData.ticketResolved);
	// 	dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.changeManagement);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	util.waitForAngular();
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	expect(util.getCurrentURL()).toMatch(appUrls.changeManagementPageUrl);

	// 	var twoMonthsPreviousName = util.getPreviousMonthName(2);
	// 	var oneMonthsPreviousName = util.getPreviousMonthName(1);
	// 	var currentMonthName = util.getPreviousMonthName(0);
	// 	//selects 2 month's Previous filter to fetch changes created 
	// 	serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdMonthFilterName);
	// 	serviceMgmtUtil.selectFilterValueBasedOnName(changeManagementTestData.createdMonthFilterName, twoMonthsPreviousName);
	// 	serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdMonthFilterName).then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.createdChangesCardName)).toEqual(twoMonthsPreviousChangeCreatedValue);
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.implementedChangesCardName)).toEqual(twoMonthsPreviousChangeImplementedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(changeManagementTestData.createdMonthFilterName, twoMonthsPreviousName);
	// 	});

	// 	//selects 1 month's Previous filter to fetch changes created 
	// 	serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdMonthFilterName);
	// 	serviceMgmtUtil.selectFilterValueBasedOnName(changeManagementTestData.createdMonthFilterName, oneMonthsPreviousName);
	// 	serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdMonthFilterName).then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.createdChangesCardName)).toEqual(oneMonthPreviousChangeCreatedValue);
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.implementedChangesCardName)).toEqual(oneMonthPreviousChangeImplementedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(changeManagementTestData.createdMonthFilterName, oneMonthsPreviousName);
	// 	});

	// 	//selects current month's filter to fetch changes created 
	// 	serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdMonthFilterName);
	// 	serviceMgmtUtil.selectFilterValueBasedOnName(changeManagementTestData.createdMonthFilterName, currentMonthName);
	// 	serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdMonthFilterName).then(async function () {
	// 		await util.waitForInvisibilityOfKibanaDataLoader();
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.createdChangesCardName)).toEqual(currentMonthChangeCreatedValue);
	// 		expect(await serviceMgmtUtil.getKabianaBoardCardValueInKformatter(changeManagementTestData.implementedChangesCardName)).toEqual(currentMonthChangeImplementedValue);
	// 		await serviceMgmtUtil.deselectFilterValue(changeManagementTestDataObject.createdMonthFilterName, currentMonthName);
	// 	});
	// });

	it('Validate Change Management title section, last updated Information  and all Tabs Present on Change Management Page', function () {
		var TabLinkList = [changeManagementTestDataObject.changeDashboardTabLink, changeManagementTestDataObject.trendTabLink, changeManagementTestDataObject.topographyTabLink, changeManagementTestDataObject.changeTicketDetailsTabLink]
		expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
		serviceMgmtUtil.clickOnLastupdatedInfoIcon();
		expect(serviceMgmtUtil.getLastupdatedInfoIconText()).toBe(changeManagementTestData.infoIconText)
		TabLinkList.forEach(function (tabLink) {
			expect(serviceMgmtUtil.getAllTabsLinkText()).toContain(tabLink);
		});
		serviceMgmtUtil.clickOnLastupdatedInfoIcon();
	});

	it("Validate all widget Names are Present on 'change Dashboard' Tab for change Management", async function () {
		var widgetNameList = [changeManagementTestDataObject.createdChangesCardName, changeManagementTestDataObject.closedChangesCardName, changeManagementTestDataObject.backlogChangesCardName, changeManagementTestDataObject.opCoViewCardName,
		changeManagementTestDataObject.openPendingCardName, changeManagementTestDataObject.implementedChangesCardName, changeManagementTestDataObject.FSCHrsCardName, changeManagementTestDataObject.expeditedCardName, changeManagementTestDataObject.emergencyCardName, changeManagementTestDataObject.categoryViewCardName,
		changeManagementTestDataObject.normalCardName, changeManagementTestDataObject.failedChangesCardName, changeManagementTestDataObject.successChangesCardName, changeManagementTestDataObject.changeAgingBucketCardName,
		changeManagementTestDataObject.changeTypePercentCardName, changeManagementTestDataObject.exceptionReasonCardName, changeManagementTestDataObject.unauthorizedPercentCardName, changeManagementTestDataObject.changeStatusCardName, changeManagementTestDataObject.top25AssignmentGroupCardName,
		changeManagementTestDataObject.failedandSuccessfulPercentCardName, changeManagementTestDataObject.changeRiskCardName, changeManagementTestDataObject.regionViewCardName, changeManagementTestDataObject.changeTypeCardName, changeManagementTestDataObject.closureCodesCardName, changeManagementTestDataObject.serviceLineCardName]
		var widgetTextList = [changeManagementTestDataObject.createdChangesCardName, changeManagementTestDataObject.closedChangesCardName, changeManagementTestDataObject.backlogChangesCardName, changeManagementTestDataObject.emergencyCardName,
		changeManagementTestDataObject.openPendingCardName, changeManagementTestDataObject.implementedChangesCardName, changeManagementTestDataObject.FSCHrsCardName, changeManagementTestDataObject.expeditedCardName,
		changeManagementTestDataObject.normalCardName, changeManagementTestDataObject.failedChangesCardName, changeManagementTestDataObject.successChangesCardName]
		//verify landing on correct Tab
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular()
		util.waitForInvisibilityOfKibanaDataLoader();

		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		})
		//check widget data is present
		widgetTextList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.checkIfDataPresentOnwidget(widgetName)).toBe(true);
		});
		if (browser.params.dataValiadtion) {
			var createdChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangesCardName);
			var backlogChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.backlogChangesCardName);
			var openPendingValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.openPendingCardName);
			var changeTypeExpeditedValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.expeditedCardName);
			var changeTypeEmergencyValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.emergencyCardName);
			var changeTypeNormalValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.normalCardName);
			var failedChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.failedChangesCardName);
			logger.info("------data validation------");
			expect(util.stringToInteger(createdChangesValue)).toEqual(expected_ValuesChangeMgmtDashboard.created_changes.created);
			expect(util.stringToInteger(backlogChangesValue)).toEqual(expected_ValuesChangeMgmtDashboard.backlog_changes);
			expect(util.stringToInteger(openPendingValue)).toEqual(expected_ValuesChangeMgmtDashboard.open_pending);
			expect(util.stringToInteger(changeTypeExpeditedValue)).toEqual(expected_ValuesChangeMgmtDashboard.change_type_Expedited);
			expect(util.stringToInteger(changeTypeEmergencyValue)).toEqual(expected_ValuesChangeMgmtDashboard.change_type_Emergency);
			expect(util.stringToInteger(changeTypeNormalValue)).toEqual(expected_ValuesChangeMgmtDashboard.change_type_Normal);
			expect(util.stringToInteger(failedChangesValue)).toEqual(expected_ValuesChangeMgmtDashboard.failed_changes);

		}
	});

	it("verify global Filter's Presence ,Expantion, default Tooltip text  on 'change Dashboard' Tab for change Management", function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		//check all date Picker Global filters on Kibana report are Present
		datePickerGlobalFilterList.forEach(function (datePickerGlobalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(datePickerGlobalFilter);
		})
		// Verify default value / tool tip text for each global filter
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentQueueFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.statusFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.locationFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.serviceLineFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.closedOnFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledStartFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledFinishFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestDataObject.createdOnFilterName)).toEqual(changeManagementTestDataObject.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		datePickerGlobalFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters functionality on 'Change Dashboard' tab", async function(){
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
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
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of datePickerGlobalFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(changeManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(changeManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestData.createdOnFilterName)).toEqual(changeManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.closedOnFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledStartFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledFinishFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
	});

	it("Validate 'change Aging Bucket' Acending Decending Order Features  on 'change Dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var changeAgingBucketcolumnNames = await serviceMgmtUtil.getColumnNamesBasedOnTableName(changeManagementTestData.changeAgingBucketCardName)
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columnNameFilters);
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columNameSummary);
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columnNameInProgress);
		expect(changeAgingBucketcolumnNames).toContain(changeManagementTestData.columnNameReview);
		changeAgingBucketcolumnNames.shift();
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(changeManagementTestData.changeAgingBucketCardName, changeAgingBucketcolumnNames, changeManagementTestData.OrderTypeAcending, changeManagementTestData.cloumnTypeNumeric)).toBe(true);
		await expect(await serviceMgmtUtil.checkAscendingDescendingOrderOfTableItems(changeManagementTestData.changeAgingBucketCardName, changeAgingBucketcolumnNames, changeManagementTestData.OrderTypeDecending, changeManagementTestData.cloumnTypeNumeric)).toBe(true);
	});

	it("Validate all widget Names are Present on 'Topography' Tab for change Management", async function () {
		var widgetNameList = [changeManagementTestDataObject.createdChangeCardName, changeManagementTestDataObject.closedChangeCardName, changeManagementTestDataObject.backlogChangeCardName,
		changeManagementTestDataObject.openPendingCardName, changeManagementTestDataObject.FSCHrsCardName, changeManagementTestDataObject.failedandSuccessfulPercentCardName, changeManagementTestDataObject.serviceLineCardName, changeManagementTestDataObject.Top25StreetAddressesCardName,
		changeManagementTestDataObject.Top25SiteIDsCardName, changeManagementTestDataObject.changeRiskCardName, changeManagementTestDataObject.regionViewCardName, changeManagementTestDataObject.changeTypeCardName, changeManagementTestDataObject.closureCodesCardName]
		var widgetTextList = [changeManagementTestDataObject.createdChangeCardName, changeManagementTestDataObject.closedChangeCardName, changeManagementTestDataObject.backlogChangeCardName,
		changeManagementTestDataObject.openPendingCardName, changeManagementTestDataObject.FSCHrsCardName]
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular()
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		})
		//check widget data is present
		widgetTextList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.checkIfDataPresentOnwidget(widgetName)).toBe(true);
		})
		if (browser.params.dataValiadtion) {
			var createdChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangeCardName);
			var backlogChangesValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.backlogChangeCardName);
			var openPendingValue = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.openPendingCardName);
			logger.info("------data validation------");
			expect(util.stringToInteger(createdChangesValue)).toEqual(expected_ValuesChangeMgmtTopography.created_changes.created);
			expect(util.stringToInteger(backlogChangesValue)).toEqual(expected_ValuesChangeMgmtTopography.backlog_changes);
			expect(util.stringToInteger(openPendingValue)).toEqual(expected_ValuesChangeMgmtTopography.open_pending);

		}
	});

	it("verify global Filter's Presence ,Expantion, default Tooltip text  on 'Topography' Tab for change Management", function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(async function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		//check all date Picker Global filters on Kibana report are Present
		datePickerGlobalFilterList.forEach(async function (datePickerGlobalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(datePickerGlobalFilter);
		})
		// Verify default value / tool tip text for each global filter
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentQueueFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.statusFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.locationFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.serviceLineFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.closedOnFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledStartFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledFinishFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestDataObject.createdOnFilterName)).toEqual(changeManagementTestDataObject.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		datePickerGlobalFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters functionality on 'Topography' tab", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
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
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of datePickerGlobalFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(changeManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(changeManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestData.createdOnFilterName)).toEqual(changeManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.closedOnFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledStartFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledFinishFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
	});

	it("Validate all  widget Names are Present on 'Trends' Tab for change Management", function () {
		var widgetNameList = [changeManagementTestDataObject.createdChangeTrendCardName, changeManagementTestDataObject.closedChangeTrendCardName, changeManagementTestDataObject.createdChangeWeeklyTrendCardName, changeManagementTestDataObject.timeInDayChangeCreatedCardName, changeManagementTestDataObject.timeInDayChangeClosedCardName,
		changeManagementTestDataObject.closedChangeWeeklyTrendCardName, changeManagementTestDataObject.serviceLineCardName, changeManagementTestDataObject.changeRiskCardName, changeManagementTestDataObject.regionViewCardName, changeManagementTestDataObject.changeTypeCardName, changeManagementTestDataObject.closureCodesCardName]
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(false);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular()
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		})
	});

	it("verify global Filter's Presence ,Expantion, default Tooltip text  on 'Trends' Tab for change Management", function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		//check all date Picker Global filters on Kibana report are Present
		datePickerGlobalFilterList.forEach(function (datePickerGlobalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(datePickerGlobalFilter);
		})
		// Verify default value / tool tip text for each global filter
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentQueueFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.statusFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.locationFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.serviceLineFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.closedOnFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledStartFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledFinishFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestDataObject.createdOnFilterName)).toEqual(changeManagementTestDataObject.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		datePickerGlobalFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters functionality on 'Trends' tab", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
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
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of datePickerGlobalFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(changeManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(changeManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestData.createdOnFilterName)).toEqual(changeManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.closedOnFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledStartFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledFinishFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
	});

	it("Validate all  widget Names are Present on 'Change Tickets Details' Tab", async function () {
		var widgetNameList = [changeManagementTestDataObject.changeTicketDetailsCardName]
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeTicketDetailsTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(false);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular()
		util.waitForInvisibilityOfKibanaDataLoader();
		// check all widgets on Kibana report are Present
		widgetNameList.forEach(function (widgetName) {
			expect(serviceMgmtUtil.getAllKibanaReportWidgetsNameText()).toContain(widgetName);
		});
		await serviceMgmtUtil.downloadTicketDetailsXlsx();
		// Verify if the downloaded file exists or not
		expect(util.isTicketDetailsFileExists()).toBe(true);
	});

	it("verify global Filter's Presence ,Expantion, default Tooltip text  on 'Change Tickets Details' Tab for change Management", function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeTicketDetailsTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		// check all global filters on Kibana report are Present
		globalFilterList.forEach(function (globalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(globalFilter);
		})
		//check all date Picker Global filters on Kibana report are Present
		datePickerGlobalFilterList.forEach(function (datePickerGlobalFilter) {
			expect(serviceMgmtUtil.getAllFiltersButtonNameText()).toContain(datePickerGlobalFilter);
		});
		// Verify default value / tool tip text for each global filter
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentQueueFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.statusFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.locationFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.serviceLineFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.closedOnFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledStartFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.scheduledFinishFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
		// Validate the default global filter is applied for "Last 210 days" on Created date-range filter
		expect(serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestDataObject.createdOnFilterName)).toEqual(changeManagementTestDataObject.defaultCreatedFilterDateRangeDiff);
		// Validate each filter is expanded or not
		globalFilterList.forEach(function (globalFilter) {
			serviceMgmtUtil.clickOnFilterButtonBasedOnName(globalFilter);
			expect(serviceMgmtUtil.verifyFilterPanelExpanded(globalFilter)).toBe(true);
		});
		// Validate each date-range filter is expanded or not
		datePickerGlobalFilterList.forEach(function (dateRangeFilter) {
			serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
		});
	});

	it("Verify Global filters functionality on 'Change Tickets Details' tab", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeTicketDetailsTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(true);
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
			await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(globalFilter)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		}
		// Iterate through each date-range filter, select first value and verify tooltip text for each tab
		for(var dateRangeFilter of datePickerGlobalFilterList){
			await serviceMgmtUtil.clickOnDateRangeFilterButton(dateRangeFilter);
			await expect(serviceMgmtUtil.verifyDateRangeFilterPanelExpanded(dateRangeFilter)).toBe(true);
			await serviceMgmtUtil.selectDateRangeFilterValue(changeManagementTestData.dateRangeFilterLast60Days);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			await expect(serviceMgmtUtil.getDaysFromDateRangeFilterToolTip(dateRangeFilter)).toEqual(changeManagementTestData.dateRangeFilter60DaysDiff);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
		}
		// Validate default values for date-range filter after clearing it
		await expect(await serviceMgmtUtil.getDateRangeFilterDateDifference(changeManagementTestData.createdOnFilterName)).toEqual(changeManagementTestData.defaultCreatedFilterDateRangeDiff);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.closedOnFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledStartFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
		await expect(await serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.scheduledFinishFilterName)).toEqual(changeManagementTestData.noneSelectedTooltipText);
	});

	it("Verify Local Filter Functionality doesn't persist accross all the Tabs for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToCssrIFramebyID(frames.mcmpIframe, frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var createdChangesVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName);
		var createdChangesValOnChangeDashboardTabBeforeFilter = util.stringToInteger(createdChangesVal);
		var changeTypelegendName = await change_management_page.getAllChartLabels(changeManagementTestData.changeTypeChartName);
		var isListEmpty = util.isListEmpty(changeTypelegendName);
		if(!isListEmpty){
			change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.changeTypeChartName, changeTypelegendName[0]);
			expect(serviceMgmtUtil.isDisplayedSelectFiltersDialogueBox()).toBe(true);
			serviceMgmtUtil.clickOnSelectFiltersDialogueBoxApplyButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			createdChangesVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName);
			var createdChangesValOnChangeDashboardTabAfterFilter = util.stringToInteger(createdChangesVal);
			expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeTypeChartName, changeTypelegendName[0])).toBe(true);
			for(var i=1; i<changeTypelegendName.length; i++){
				await expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeTypeChartName, changeTypelegendName[i])).toBe(false);
			}
			// Click on Topology tab
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<changeTypelegendName.length; i++){
				await expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeTypeCardName, changeTypelegendName[i])).toBe(true);
			}
			createdChangesVal = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName);
			var createdChangesValOnTopologyTab = util.stringToInteger(createdChangesVal);
			expect(createdChangesValOnChangeDashboardTabAfterFilter).toBeLessThanOrEqual(createdChangesValOnTopologyTab);
			expect(createdChangesValOnChangeDashboardTabBeforeFilter).toEqual(createdChangesValOnTopologyTab);
			// Click on Trends Tab
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<changeTypelegendName.length; i++){
				await expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeTypeCardName, changeTypelegendName[i])).toBe(true);
			}
			expect(createdChangesValOnChangeDashboardTabAfterFilter).toBeLessThanOrEqual(await serviceMgmtUtil.getTotalCountFromWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName));
			expect(createdChangesValOnChangeDashboardTabBeforeFilter).toEqual(await serviceMgmtUtil.getTotalCountFromWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName));
		}
	});

	it("Verify Local Filter Functionality of 'Change Type' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var changeTypelegendName = await change_management_page.getAllChartLabels(changeManagementTestData.changeTypePercentChartName);
		var isListEmpty = util.isListEmpty(changeTypelegendName);
		if(!isListEmpty){
			change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.changeTypePercentChartName, changeTypelegendName[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeTypeChartName, changeTypelegendName[0])).toBe(true);
			for(var i=1; i<changeTypelegendName.length; i++){
				await expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeTypeChartName, changeTypelegendName[i])).toBe(false);
			}
			expect(change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeTypePercentChartName, changeTypelegendName[0]));
			expect(change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeTypeChartName, changeTypelegendName[0]));
		}
	});

	// Protractor limitation
	// it("Verify Local Filter Functionality of 'exception reason' on 'change dashboard' Tab for change Management", async function () {
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	var changeTypelegendName = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.exceptionReasonCardName);
	// 	change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.exceptionReasonCardName, changeTypelegendName[0]);
	// 	util.waitForInvisibilityOfKibanaDataLoader();
	// });

	it("Verify Local Filter Functionality of 'Change Status' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var changeStatusBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.changeStatusCardName);
			var YaxisChangeStatusBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.changeStatusCardName);
			var expectedValuesChangeMgmtDashboardChangeStatus = expected_ValuesChangeMgmtDashboard.change_status
			logger.info("------data validation------");
			for (var i = 0; i < YaxisChangeStatusBarLabels.length; i++) {
				expect(changeStatusBarValue[i]).toEqual(expectedValuesChangeMgmtDashboardChangeStatus[YaxisChangeStatusBarLabels[i]]);
			}
		}
		serviceMgmtUtil.clickOnGraphFirstHorizontalBar(changeManagementTestData.changeStatusCardName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(changeManagementTestData.graphtooltipText2, changeManagementTestData.changeStatusCardName)).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
	});

	it("Verify Local Filter Functionality of 'Closure Codes' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var closureCodesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.closureCodesCardName);
			var YaxisClosureCodessBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.closureCodesCardName);
			var expectedValuesChangeMgmtDashboardClosureCodes = expected_ValuesChangeMgmtDashboard.closure_codes
			logger.info("------data validation------");
			for (var i = 0; i < YaxisClosureCodessBarLabels.length; i++) {
				expect(closureCodesBarValue[i]).toEqual(expectedValuesChangeMgmtDashboardClosureCodes[YaxisClosureCodessBarLabels[i]]);
			}
		}
		serviceMgmtUtil.clickOnGraphFirstHorizontalBar(changeManagementTestData.closureCodesCardName);
		util.waitForInvisibilityOfKibanaDataLoader();
		expect(serviceMgmtUtil.getFirstBarGraphToolTipText(changeManagementTestData.graphtooltipText2, changeManagementTestData.closureCodesCardName)).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
	});

	// Protractor limitation
	// it("Verify Local Filter Functionality of 'Region View' on 'change dashboard' Tab for change Management", async function () {
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	var changeTypelegendName = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.regionViewCardName);
	// 	await change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1]);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	expect(await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	// });

	it("Verify Local Filter Functionality of 'Change Risk' on 'change dashboard' Tab for change Management", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var changeTypelegendName = await change_management_page.getAllChartLabels(changeManagementTestData.changeRiskCardName);
		var isListEmpty = util.isListEmpty(changeTypelegendName);
		if(!isListEmpty){
			change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, changeTypelegendName[0]);
			expect(await serviceMgmtUtil.isDisplayedSelectFiltersDialogueBox()).toBe(true);
			serviceMgmtUtil.clickOnSelectFiltersDialogueBoxApplyButton();
			await util.waitForInvisibilityOfKibanaDataLoader();	
			expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeTypelegendName[0])).toBe(true);
			for(var i=1; i<changeTypelegendName.length; i++){
				expect(await change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskCardName, changeTypelegendName[i])).toBe(false);
			}
		}
		expect(await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, changeTypelegendName[0])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
	});

	it("Verify Local Filter Functionality of 'service line' on 'Topography' Tab for change Management", async function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var serviceLineBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.serviceLineCardName);
			var YaxisBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.serviceLineCardName);
			var expectedValuesChangeMgmtTopographyServiceLines = expected_ValuesChangeMgmtTopography.service_line
			logger.info("------data validation------");
			for (var i = 0; i < YaxisBarLabels.length; i++) {
				expect(serviceLineBarValue[i]).toEqual(expectedValuesChangeMgmtTopographyServiceLines[YaxisBarLabels[i]]);
			}
		}
		await serviceMgmtUtil.clickOnGraphFirstHorizontalBar(changeManagementTestData.serviceLineCardName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		await expect(await serviceMgmtUtil.getFirstBarGraphToolTipText(changeManagementTestData.graphtooltipText2, changeManagementTestData.serviceLineCardName)).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	});

	it("Verify Local Filter Functionality of 'closure codes' on 'Topography' Tab for change Management", async function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		if (browser.params.dataValiadtion) {
			var closureCodesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.closureCodesCardName);
			var YaxisClosureCodessBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.closureCodesCardName);
			var expectedValuesChangeMgmtTopographyClosureCodes = expected_ValuesChangeMgmtTopography.closure_codes
			logger.info("------data validation------");
			for (var i = 0; i < YaxisClosureCodessBarLabels.length; i++) {
				expect(closureCodesBarValue[i]).toEqual(expectedValuesChangeMgmtTopographyClosureCodes[YaxisClosureCodessBarLabels[i]]);
			}
		}
		await serviceMgmtUtil.clickOnGraphFirstHorizontalBar(changeManagementTestData.closureCodesCardName);
		await util.waitForInvisibilityOfKibanaDataLoader();
		expect(await serviceMgmtUtil.getFirstBarGraphToolTipText(changeManagementTestData.graphtooltipText2, changeManagementTestData.closureCodesCardName)).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	});

	// Protractor limitation
	// it("Verify Local Filter Functionality of 'Region View' on 'Topography' Tab for change Management", async function () {
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	util.waitForInvisibilityOfKibanaDataLoader();
	// 	var changeTypelegendName = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.regionViewCardName);
	// 	change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1]);
	// 	util.waitForInvisibilityOfKibanaDataLoader();
	// 	expect(change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.regionViewCardName, changeTypelegendName[1])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	// });

	it("Verify Local Filter Functionality of 'change risk' on 'Topography' Tab for change Management", async function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForInvisibilityOfKibanaDataLoader();
		var changeRisklegendNames = await change_management_page.getAllChartLabels(changeManagementTestData.changeRiskChartName);
		
		if(browser.params.dataValiadtion){
			var expectedValuesChangeMgmtTopographyChangeRisk = expected_ValuesChangeMgmtTopography.change_risk;
			util.waitForInvisibilityOfKibanaDataLoader();
			var changeRiskList = Object.keys(expectedValuesChangeMgmtTopographyChangeRisk);
			for (var i = 0; i < changeRiskList.length; i++) {
				var changeTypeToolTipText = await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskChartName, changeRiskList[i]);
				expect(util.stringToInteger(changeTypeToolTipText)).toEqual(expectedValuesChangeMgmtTopographyChangeRisk[changeRiskList[i]]);
			}
		}
		
		change_management_page.clickOnChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskChartName, changeRisklegendNames[0]);
		expect(serviceMgmtUtil.isDisplayedSelectFiltersDialogueBox()).toBe(true);
		serviceMgmtUtil.clickOnSelectFiltersDialogueBoxApplyButton();
		util.waitForInvisibilityOfKibanaDataLoader();
		expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskChartName, changeRisklegendNames[0])).toBe(true);
		expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskChartName, changeRisklegendNames[1])).toBe(false);
		expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskChartName, changeRisklegendNames[2])).toBe(false);
		expect(change_management_page.verifyChartFilterIsPresent(changeManagementTestData.changeRiskChartName, changeRisklegendNames[3])).toBe(false);
		expect(change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskChartName, changeRisklegendNames[0])).toEqual(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
	});


	it("Verify applied Global filter persist across all tabs within Change management and won't persist when moved to another report page", async function () {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		// Verify if tab is selected, after clicking on it or not
		expect(serviceMgmtUtil.isTabLinkSelected (changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Apply Contact Type filter with its first value
		serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		expect(serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestDataObject.assignmentGroupFilterName)).toBe(true);
		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(changeManagementTestDataObject.assignmentGroupFilterName);
		if(filterValue != false){
			await serviceMgmtUtil.clickOnUpdateFilterButton(changeManagementTestDataObject.assignmentGroupFilterName);
			await serviceMgmtUtil.clickOnApplyFilterButton();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text with applied filter value
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(filterValue);
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			// Navigate to' Trends' tab 
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected (changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text on 'Trends' with applied filter value on 'Ticket Overview' tab
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(filterValue);
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			// Navigate to Topography tab 
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected (changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text on Topography tab with applied filter value on 'Ticket Overview' tab
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(filterValue);
			util.switchToDefault();
			util.switchToFrameById(frames.mcmpIframe);
			// Navigate to Ticket details tab
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeTicketDetailsTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected (changeManagementTestDataObject.changeTicketDetailsTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Verify tooltip text on Ticket details tab with applied filter value on 'Ticket Overview' tab
			expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(filterValue);
		}
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		launchpad_page.clickOnMCMPHeader();
		launchpad_page.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpad_page.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpad_page.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
		// Navigate to Change Management page
		change_management_page.open();
		util.switchToFrameById(frames.cssrIFrame);
		util.waitForAngular();
		await util.waitForInvisibilityOfKibanaDataLoader();
		// Verify tooltip text on change Magement 'Ticket Overview' tab with default tooltip text
		expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestDataObject.assignmentGroupFilterName)).toEqual(changeManagementTestDataObject.noneSelectedTooltipText);
	});

	// Disable Test case because of Known issue: https://jira.gravitant.net/browse/AIOP-7557
	// it("Verify if Exception Reason data on chart is equal 100%", async function() {
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	util.waitForAngular();
	// 	var exceptionDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.exceptionReasonCardName);
	// 	expect(Math.round(exceptionDatafromDashboard[1])).toEqual(100);
	// });

	it("Verify if Change type percentage data on chart is equal to 100%", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var changeTypeDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.changeTypePercentChartName);
		expect(Math.round(changeTypeDatafromDashboard[1])).toEqual(100);
	});

	it("Verify if Failed and Success percentage is equal to 100%", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var pieChartDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.failedandSuccessfulPercentCardName);
		expect(Math.round(pieChartDatafromDashboard[1])).toEqual(100);
	});

	it("Verify if Unauthorized percentage is equal to 100%", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var pieChartDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.unauthorizedPercentCardName);
		expect(Math.round(pieChartDatafromDashboard[1])).toEqual(100);
	});

	it("Verify if Count of Created Changes matches with the breakup in Chart for Change Status", async function () {
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		var changeStatusBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.changeStatusCardName);
		var createdChangesChangeDashboardTab = await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangesCardName);
		createdChangesChangeDashboardTab=createdChangesChangeDashboardTab.replace(/,/g, '');
		var createChanges = parseInt(createdChangesChangeDashboardTab)
		var sumChangeStatus = await serviceMgmtUtil.getSumStatusBarValue(changeStatusBarValue)
		expect(createChanges).toEqual(sumChangeStatus);
	});

	it("Verify Local Filter Functionality of 'Top 25 assignment group' on 'Change Dashboard' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
		// Get Implemented changes count before applying local filter
		var implementedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
		// Get all names from name map widget
		var top25AssignmentGroupNamesFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestData.top25AssignmentGroupCardName);
		if(!util.isListEmpty(top25AssignmentGroupNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.top25AssignmentGroupCardName, top25AssignmentGroupNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(implementedChangesAfter).toBeLessThanOrEqual(implementedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(implementedChangesAfterReset).toEqual(implementedChangesBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Service Line' on 'Change Dashboard' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
		// Get Implemented changes count before applying local filter
		var implementedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
		// Get all names from name map widget
		var serviceLineNamesFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestData.serviceLineCardName);
		if(!util.isListEmpty(serviceLineNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.serviceLineCardName, serviceLineNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(implementedChangesAfter).toBeLessThanOrEqual(implementedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(implementedChangesAfterReset).toEqual(implementedChangesBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Category View' on 'Change Dashboard' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
		// Get Implemented changes count before applying local filter
		var implementedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
		// Get all names from name map widget
		var categoryViewNamesFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestData.categoryViewCardName);
		if(!util.isListEmpty(categoryViewNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.categoryViewCardName, categoryViewNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(implementedChangesAfter).toBeLessThanOrEqual(implementedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Implemented changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangesCardName));
			var implementedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.implementedChangesCardName));
			// Verify if Created changes and Implemented changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(implementedChangesAfterReset).toEqual(implementedChangesBefore);
		}
	});

	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Change Type' on 'Topography' Tab for change Management", async function () {
			logger.info("------data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTopographyChangeType = expected_ValuesChangeMgmtTopography.change_type
			var envKeyList = Object.keys(expectedValuesChangeMgmtTopographyChangeType);
			for (var i = 0; i < envKeyList.length; i++) {
				var changeTypeToolTipText = await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeTypeCardName, envKeyList[i])
				expect(util.stringToInteger(changeTypeToolTipText)).toEqual(expectedValuesChangeMgmtTopographyChangeType[envKeyList[i]])
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'closure codes' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var closureCodesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.closureCodesCardName);
			var YaxisClosureCodessBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.closureCodesCardName);
			var expectedValuesChangeMgmtTrendClosureCodes = expected_ValuesChangeMgmtTrend.closure_codes
			logger.info("------data validation------");
			for (var i = 0; i < YaxisClosureCodessBarLabels.length; i++) {
				expect(closureCodesBarValue[i]).toEqual(expectedValuesChangeMgmtTrendClosureCodes[YaxisClosureCodessBarLabels[i]]);
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Service Lines' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var serviceLinesBarValue = await serviceMgmtUtil.getTextValuesofHorizontalBar(changeManagementTestDataObject.serviceLineCardName);
			var YaxisServiceLinesBarLabels = await serviceMgmtUtil.getKibanaBarGraphYaxisLabelsBasedOnWidgetName(changeManagementTestDataObject.serviceLineCardName);
			var expectedValuesChangeMgmtTrendsServiceLines = expected_ValuesChangeMgmtTrend.service_line
			logger.info("------data validation------");
			for (var i = 0; i < YaxisServiceLinesBarLabels.length; i++) {
				expect(serviceLinesBarValue[i]).toEqual(expectedValuesChangeMgmtTrendsServiceLines[YaxisServiceLinesBarLabels[i]]);
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Change Type' on 'Trends' Tab for change Management", async function () {
			logger.info("------data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendChangeType = expected_ValuesChangeMgmtTrend.change_type
			var envKeyList = Object.keys(expectedValuesChangeMgmtTrendChangeType);
			for (var i = 0; i < envKeyList.length; i++) {
				var changeTypeToolTipText = await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeTypeCardName, envKeyList[i])
				expect(util.stringToInteger(changeTypeToolTipText)).toEqual(expectedValuesChangeMgmtTrendChangeType[envKeyList[i]])
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'Change Risk' on 'Trends' Tab for change Management", async function () {
			logger.info("------data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendChangeRisk = expected_ValuesChangeMgmtTrend.change_risk
			var envKeyList = Object.keys(expectedValuesChangeMgmtTrendChangeRisk);
			for (var i = 0; i < envKeyList.length; i++) {
				var changeTypeToolTipText = await change_management_page.getToolTipTextForChartSectionBasedOnDataLabel(changeManagementTestData.changeRiskCardName, envKeyList[i])
				expect(util.stringToInteger(changeTypeToolTipText)).toEqual(expectedValuesChangeMgmtTrendChangeRisk[envKeyList[i]])
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'What time in the day change was created' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendschangeCreatedDayTime = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_created
			var changeCreatedWeeksKeyList = Object.keys(expectedValuesChangeMgmtTrendschangeCreatedDayTime);
			logger.info("------data validation------");
			for (var i = 0; i < changeCreatedWeeksKeyList.length - 1; i++) {
				var changeCreatedWeeksKey = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_created[changeCreatedWeeksKeyList[i]]
				var changeCreatedDayTimekeys = Object.keys(changeCreatedWeeksKey)
				for (var j = 0; j < changeCreatedDayTimekeys.length; j++) {
					var changeCreatedDayTimeValue = await change_management_page.getAllValuesofSpecifRowFromMatrixGraph(changeManagementTestDataObject.timeInDayChangeCreatedCardName, j);
					var changeCreatedDayTimeblockvalue = util.stringToInteger(changeCreatedDayTimeValue[i])
					logger.info("value of row no " + j + " and column no " + i + " is :" + changeCreatedDayTimeblockvalue + " on UI")
					logger.info("value of " + changeCreatedWeeksKeyList[i] + " :" + changeCreatedDayTimekeys[j] + " is :" + expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]] + " in JSON")
					await expect(changeCreatedDayTimeblockvalue).toEqual(expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]]);
				}
			}
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Local Filter Functionality of 'What time in the day change was closed' on 'Trends' Tab for change Management", async function () {
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForInvisibilityOfKibanaDataLoader();
			var expectedValuesChangeMgmtTrendschangeCreatedDayTime = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_closed
			var changeCreatedWeeksKeyList = Object.keys(expectedValuesChangeMgmtTrendschangeCreatedDayTime);
			logger.info("------data validation------");
			for (var i = 0; i < changeCreatedWeeksKeyList.length - 1; i++) {
				var changeCreatedWeeksKey = expected_ValuesChangeMgmtTrend.what_time_in_the_day_change_was_closed[changeCreatedWeeksKeyList[i]]
				var changeCreatedDayTimekeys = Object.keys(changeCreatedWeeksKey)
				for (var j = 0; j < changeCreatedDayTimekeys.length; j++) {
					var changeCreatedDayTimeValue = await change_management_page.getAllValuesofSpecifRowFromMatrixGraph(changeManagementTestDataObject.timeInDayChangeClosedCardName, j);
					var changeCreatedDayTimeblockvalue = util.stringToInteger(changeCreatedDayTimeValue[i])
					logger.info("value of row no " + j + " and column no " + i + " is :" + changeCreatedDayTimeblockvalue + " on UI")
					logger.info("value of " + changeCreatedWeeksKeyList[i] + " :" + changeCreatedDayTimekeys[i] + " is :" + expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]] + " in JSON")
					await expect(changeCreatedDayTimeblockvalue).toEqual(expectedValuesChangeMgmtTrendschangeCreatedDayTime[changeCreatedWeeksKeyList[i]][changeCreatedDayTimekeys[j]]);
				}
			}
		});
	}
	
	if (isEnabledESValidation) {
		/*it("Verify if the count of variables in Top 25 Assignment Group widget from Change Dashboard tab is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var top25assignmentGroupfromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.top25AssignmentGroupCardName);
			var filteredTop25AssignmentGroupFromWidget = await util.removeEmptyNullValuesFromList(top25assignmentGroupfromWidget);
			var top25AssignmentGroupFromES =  await esQueriesChange.getTop25AssignmentGroup(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredTop25AssignmentGroupFromWidget,top25AssignmentGroupFromES)).not.toContain("Not-matching");
		});*/

		it("Verify if the count of variables in OpCo View widget from Change Dashboard tab is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var opcoViewfromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.opCoViewCardName);
			var filteredOpcoViewfromWidget = await util.removeEmptyNullValuesFromList(opcoViewfromWidget);
			var opcoViewFromES =  await esQueriesChange.getOpcoView(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredOpcoViewfromWidget,opcoViewFromES)).not.toContain("Not-matching");
		});

		it("Verify if the count of variables in Category View widget from Change Dashboard tab is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var categoryViewfromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.categoryViewCardName);
			var filteredCategoryViewFromWidget = await util.removeEmptyNullValuesFromList(categoryViewfromWidget);
			var categoryViewFromES =  await esQueriesChange.getCategoryView(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredCategoryViewFromWidget,categoryViewFromES)).not.toContain("Not-matching");
		});
	}
		
	it("Verify if count of Created/Closed/Backlog changes, Open Pending, FSC on 72hrs on Change Dashboard tab is equal to count on Topology tab and count from Elastic Index", async function() {
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		var CreatedChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangesCardName));
		var ClosedChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.closedChangeCardName));
		var BacklogChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.backlogChangeCardName));
		var OpenPendingChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.openPendingCardName));
		var FSCon72hrsChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.FSCHrsCardName));

		// Need to resolve Jenkins/ES Query timezone issue
		/*if (isEnabledESValidation) {
			logger.info("------ES Data validation------");
			var CreatedChangesCountFromES =  await esQueriesChange.getCreatedChangesCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var ClosedChangesCountFromES =  await esQueriesChange.getClosedChangesCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var BacklogCountFromES =  await esQueriesChange.getBacklogChangesCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var OpenPendingCountFromES =  await esQueriesChange.getOpenPendingCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var FSCon72hrsCountFromES = await esQueriesChange.getFSCon72HrsCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			expect(CreatedChangesChangeDashboardTab).toEqual(CreatedChangesCountFromES);
			expect(ClosedChangesChangeDashboardTab).toEqual(ClosedChangesCountFromES);
			expect(BacklogChangesChangeDashboardTab).toEqual(BacklogCountFromES);
			expect(OpenPendingChangeDashboardTab).toEqual(OpenPendingCountFromES);
			expect(FSCon72hrsChangeDashboardTab).toEqual(FSCon72hrsCountFromES);
		}*/
		
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
		// Navigate to Topography tab 
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected (changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();		
		var CreatedChangesTopographyTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.createdChangeCardName));
		var ClosedChangesTopographyTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.closedChangeCardName));
		var BacklogChangesTopographyTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.backlogChangeCardName));
		var OpenPendingTopographyTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.openPendingCardName));
		var FSCon72hrsTopographyTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.FSCHrsCardName));
		expect(CreatedChangesChangeDashboardTab).toEqual(CreatedChangesTopographyTab);
		expect(ClosedChangesChangeDashboardTab).toEqual(ClosedChangesTopographyTab);
		expect(BacklogChangesChangeDashboardTab).toEqual(BacklogChangesTopographyTab);
		expect(OpenPendingChangeDashboardTab).toEqual(OpenPendingTopographyTab);
		expect(FSCon72hrsChangeDashboardTab).toEqual(FSCon72hrsTopographyTab);	
	});

	if (isEnabledESValidation) {
		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if count of Change Type: Expedited/Emergency/Standard/Normal, Failed/Success Changes on Change Dashboard tab is equal to count from Elastic Index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
			expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeExpedictedCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.expeditedCardName));
			var changeTypeExpedictedCountFromES =  await esQueriesChange.getChangeTypeExpedictedCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var changeTypeEmergencyCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.emergencyCardName));
			var changeTypeEmergencyCountFromES =  await esQueriesChange.getChangeTypeEmergencyCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var changeTypeStandardCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.standardCardName));
			var changeTypeStandardCountFromES =  await esQueriesChange.getChangeTypeStandardCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var changeTypeNormalCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.normalCardName));
			var changeTypeNormalCountFromES =  await esQueriesChange.getChangeTypeNormalCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var failedChangesCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.failedChangesCardName));
			var failedChangesCountFromES =  await esQueriesChange.getFailedChangeCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			var successChangesCountFromUI = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.successChangesCardName));
			var successChangesCountFromES =  await esQueriesChange.getSuccessChangeCount(changeManagementTestData.eSChangeSearchIndex,tenantId,210);
			expect(changeTypeExpedictedCountFromUI).toEqual(changeTypeExpedictedCountFromES);
			expect(changeTypeEmergencyCountFromUI).toEqual(changeTypeEmergencyCountFromES);
			expect(changeTypeStandardCountFromUI).toEqual(changeTypeStandardCountFromES);
			expect(changeTypeNormalCountFromUI).toEqual(changeTypeNormalCountFromES);
			expect(failedChangesCountFromUI).toEqual(failedChangesCountFromES);
			expect(successChangesCountFromUI).toEqual(successChangesCountFromES);
		});

		it("Verify if count of Implemented changes on Change Dashboard tab is greater or equal to count of Closed changes and is equal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var ClosedChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.closedChangesCardName));
			var ImplementedChangesChangeDashboardTab = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestDataObject.implementedChangesCardName));
			var ImplementedChangesCountFromES =  await esQueriesChange.getImplementedChangesCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(ImplementedChangesChangeDashboardTab).toBeGreaterThanOrEqual(ClosedChangesChangeDashboardTab);
			expect(ImplementedChangesChangeDashboardTab).toEqual(ImplementedChangesCountFromES);
		});
			
		it("Verify if Unauthorised % and Others % on Change Dashboard tab matches the percentage of data extracted from Elastic Index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.unauthorizedPercentCardName);
			var pieChartPercentageList = await serviceMgmtUtil.getPieChartPercentageUsingLegendName(changeManagementTestData.unauthorizedPercentCardName,legendsList);
			var unauthorisedCountFromES =  await esQueriesChange.getUnauthorisedCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			var othersCountFromES =  await esQueriesChange.getUnauthorisedOthersCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			var totalCount = unauthorisedCountFromES + othersCountFromES;
			var unauthorisedCountFromChart = Math.round((pieChartPercentageList[0]*totalCount)/100);
			expect(unauthorisedCountFromChart).toEqual(unauthorisedCountFromES);
			var othersCountFromChart = Math.round((pieChartPercentageList[1]*totalCount)/100);
			expect(othersCountFromChart).toEqual(othersCountFromES);
		});*/

		// Disable Test case because of Known issue: https://jira.gravitant.net/browse/AIOP-7557
		// it("Verify if Exception Reason percentage on Change Dashboard tab matches the percentage of data extracted from Elastic Index", async function() {
		// 	logger.info("------ES Data validation------");
		// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	    //     expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
		// 	util.switchToFrameById(frames.cssrIFrame);
		// 	await util.waitForInvisibilityOfKibanaDataLoader();
		// 	util.waitForAngular();
		// 	var exceptionDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.exceptionReasonCardName);
		// 	var ExceptionCountFromES =  await esQueriesChange.getExceptionReasonCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
		// 	expect(change_management_page.getAllValuesofPieChart(exceptionDatafromDashboard[0],ExceptionCountFromES)).not.toContain('Not Matching');
		// });
		
		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if Failed and Success percentage on Change Dashboard tab is equivalent to percentage data from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.failedandSuccessfulPercentCardName);
			var pieChartPercentageList = await serviceMgmtUtil.getPieChartPercentageUsingLegendName(changeManagementTestData.failedandSuccessfulPercentCardName,legendsList);
			var failedchangesFromES =  await esQueriesChange.getFailedChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			var successchangesFromES =  await esQueriesChange.getSuccessChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			var totalfailsuccesscount = (failedchangesFromES + successchangesFromES);
			var successcountfromchart=Math.round((pieChartPercentageList[0]*totalfailsuccesscount)/100);
			expect(successcountfromchart).toEqual(successchangesFromES);
			var failedcountfromchart=Math.round((pieChartPercentageList[1]*totalfailsuccesscount)/100);
			expect(failedcountfromchart).toEqual(failedchangesFromES);
		});*/
		
	 	it("Verify if Change type percentage data on Change Dashboard tab is equal to data from Elastic index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeDatafromDashboard = await serviceMgmtUtil.getElementDataFrompieChart(changeManagementTestData.changeTypePercentChartName);
			var changeCountFromES =  await esQueriesChange.getChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(change_management_page.getAllValuesofPieChart(changeTypeDatafromDashboard[0],changeCountFromES)).not.toContain('Not Matching');
		});

		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if Change Status count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeStatusJsonObj = await esQueriesChange.getChangeStatusCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.changeStatusCardName, changeStatusJsonObj)).toBe(true);
		});

		it("Verify if Closure Codes count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var closureCodesJsonObj = await esQueriesChange.getClosureCodesCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.closureCodesCardName, closureCodesJsonObj)).toBe(true);
		});

		it("Verify if Change Risk count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeRiskJsonObj = await esQueriesChange.getChangeRiskCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeRiskCardName, changeRiskJsonObj)).toBe(true);
		});

		it("Verify if Change Type count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeJsonObj = await esQueriesChange.getChangeTypeCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeTypeChartName, changeTypeJsonObj)).toBe(true);
		});

		it("Verify if Change Aging Bucket count on Change Dashboard tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.changeDashboardTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.changeDashboardTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			// Get list of cell values from the first column [row filter names]
			var firstColCellValuesList = await serviceMgmtUtil.getFirstColumnCellValuesListFromTableWidget(changeManagementTestData.changeAgingBucketDataTitleName);
			var countListFromUI = await serviceMgmtUtil.getListOfCountListRowWiseFromTableWidget(changeManagementTestData.changeAgingBucketDataTitleName, firstColCellValuesList);
			var countListFromES = await esQueriesChange.getChangeAgingBucketCount(changeManagementTestData.eSChangeSearchIndex, tenantId, firstColCellValuesList);
			// Verify the list of list of count values for each row filter from UI with the list of list of count values from ES query response
			expect(util.compareNestedArrays(countListFromUI, countListFromES)).toBe(true);
		});*/

		it("Verify if the count of variables in Top 25 Street Address widget from Topography tab is euqal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var top25streetAddress = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.Top25StreetAddressesCardName);
			var filteredTop25streetAddress = await util.removeEmptyNullValuesFromList(top25streetAddress);
			var top25StreetAddressFromES =  await esQueriesChange.getTop25StreetAddress(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredTop25streetAddress,top25StreetAddressFromES)).not.toContain("Not-matching");
		});
		
		it("Verify if the count of variables in Top 25 Site IDs widget from Topography tab is euqal to count from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var siteIdFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestDataObject.Top25SiteIDsCardName);
			var filteredSiteIdFromWidget = await util.removeEmptyNullValuesFromList(siteIdFromWidget);
			var top25SiteIdsFromES =  await esQueriesChange.getTop25SiteIds(changeManagementTestData.eSChangeSearchIndex, tenantId,210);
			expect(change_management_page.getAllValuesofWordCloudGraph(filteredSiteIdFromWidget,top25SiteIdsFromES)).not.toContain("Not-matching");
		});

		// Need to resolve Jenkins/ES Query timezone issue
		/*it("Verify if Failed and Success percentage on Topography tab is equivalent to percentage data from Elastic Index", async function() {
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var legendsList = await serviceMgmtUtil.getLegendNamesFromLocalFilter(changeManagementTestData.failedandSuccessfulPercentCardName);
			var pieChartPercentageList = await serviceMgmtUtil.getPieChartPercentageUsingLegendName(changeManagementTestData.failedandSuccessfulPercentCardName,legendsList);
			var failedchangesFromES =  await esQueriesChange.getFailedChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			var successchangesFromES =  await esQueriesChange.getSuccessChangeCount(changeManagementTestData.eSChangeSearchIndex, tenantId, 210);
			var totalfailsuccesscount = (failedchangesFromES + successchangesFromES);
			var successcountfromchart=Math.round((pieChartPercentageList[0]*totalfailsuccesscount)/100);
			expect(successcountfromchart).toEqual(successchangesFromES);
			var failedcountfromchart=Math.round((pieChartPercentageList[1]*totalfailsuccesscount)/100);
			expect(failedcountfromchart).toEqual(failedchangesFromES);
		});

		it("Verify if Service Line count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var serviceLineJsonObj = await esQueriesChange.getServiceLineCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.serviceLineCardName, serviceLineJsonObj)).toBe(true);
		});

		it("Verify if Closure Codes count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var closureCodesJsonObj = await esQueriesChange.getClosureCodesCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.closureCodesCardName, closureCodesJsonObj)).toBe(true);
		});

		it("Verify if Change Risk count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeRiskJsonObj = await esQueriesChange.getChangeRiskCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeRiskChartName, changeRiskJsonObj)).toBe(true);
		});

		it("Verify if Change Type count on Topography tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeJsonObj = await esQueriesChange.getChangeTypeCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeTypeCardName, changeTypeJsonObj)).toBe(true);
		});

		it("Verify if Service Line count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var serviceLineJsonObj = await esQueriesChange.getServiceLineCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.serviceLineCardName, serviceLineJsonObj)).toBe(true);
		});

		it("Verify if Created Change Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.createdChangeTrendCardName);
			var createdChangeTrendObjFromES = await esQueriesChange.getCreatedChangeTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.createdChangeTrendCardName,createdChangeTrendObjFromES)).toBe(true);
		});

		it("Verify if Closed Change Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.closedChangeTrendCardName);
			var closedChangeTrendObjFromES = await esQueriesChange.getClosedChangeTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.closedChangeTrendCardName,closedChangeTrendObjFromES)).toBe(true);
		});

		it("Verify if Created Change Weekly Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.createdChangeWeeklyTrendCardName);
			var createdChangeWeeklyTrendObjFromES = await esQueriesChange.getCreatedChangeWeeklyTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.createdChangeWeeklyTrendCardName,createdChangeWeeklyTrendObjFromES)).toBe(true);
		});

		it("Verify if Closed Change Weekly Trend count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var xAxisLabels = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.closedChangeWeeklyTrendCardName);
			var closedChangeWeeklyTrendObjFromES = await esQueriesChange.getClosedChangeWeeklyTrendCount(changeManagementTestData.eSChangeSearchIndex,tenantId,xAxisLabels);
			expect(await serviceMgmtUtil.verifyCountListWaveGraphPointsFromUIAndESQuery(changeManagementTestData.closedChangeWeeklyTrendCardName,closedChangeWeeklyTrendObjFromES)).toBe(true);
		});

		it("Verify if Closure Codes count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var closureCodesJsonObj = await esQueriesChange.getClosureCodesCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHorizontalBarGraph(changeManagementTestData.closureCodesCardName, closureCodesJsonObj)).toBe(true);
		});

		it("Verify if Change Risk count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeRiskJsonObj = await esQueriesChange.getChangeRiskCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeRiskCardName, changeRiskJsonObj)).toBe(true);
		});

		it("Verify if Change Type count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var changeTypeJsonObj = await esQueriesChange.getChangeTypeCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyCircleChartCountListFromUIWithESValues(changeManagementTestData.changeTypeCardName, changeTypeJsonObj)).toBe(true);
		});

		it("Verify if What time in the day change was created count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var whatTimeInDayChangeWasCreatedJsonObj = await esQueriesChange.getWhatTimeInDayChangeWasCreatedCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHeatMapWidget(changeManagementTestData.timeInDayChangeCreatedCardName, whatTimeInDayChangeWasCreatedJsonObj)).toBe(true);
		});

		it("Verify if What time in the day change was closed count on Trends tab is equal to data from Elastic index", async function(){
			logger.info("------ES Data validation------");
			serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	        expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
			util.switchToFrameById(frames.cssrIFrame);
			await util.waitForInvisibilityOfKibanaDataLoader();
			util.waitForAngular();
			var whatTimeInDayChangeWasClosedJsonObj = await esQueriesChange.getWhatTimeInDayChangeWasClosedCount(changeManagementTestData.eSChangeSearchIndex, tenantId);
			expect(await serviceMgmtUtil.verifyValuesFromJSONAndUIForHeatMapWidget(changeManagementTestData.timeInDayChangeClosedCardName, whatTimeInDayChangeWasClosedJsonObj)).toBe(true);
		});*/
	}

	// Need to skip the test case as global filter Created Year Month and Closed Year Month is not available now
	// it("Verify Wave-points widgets on 'Trends' tab after applying global filter 'Created Year Month'", async function(){
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	util.waitForAngular();
	// 	// Get number of points from 'Created Change Trend' widget
	// 	var createdChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
	// 	if(createdChangeTrendWidgetPointsCountBefore > 1){
	// 		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.createdYearMonthFilterName);
	// 		await expect(serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestData.createdYearMonthFilterName)).toBe(true);
	// 		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(changeManagementTestData.createdYearMonthFilterName);
	// 		if(filterValue != false){
	// 			// Apply 'Created Year Month' filter
	// 			await serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.createdYearMonthFilterName);
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Verify tooltip text with applied filter value
	// 			await expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.createdYearMonthFilterName)).toEqual(filterValue);
	// 			// Get number of points from 'Created Change Trend' widget after applying filter
	// 			var createdChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
	// 			expect(createdChangeTrendWidgetPointsCountAfter).toBeLessThan(createdChangeTrendWidgetPointsCountBefore);
	// 			expect(createdChangeTrendWidgetPointsCountAfter).toEqual(1);
	// 			var xAxisLabel = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.createdChangeTrendCardName);
	// 			expect(xAxisLabel[0]).toEqual(filterValue);
	// 			await util.clickOnResetFilterLink();
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Get number of points from 'Created Change Trend' widget after resetting filter
	// 			var createdChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
	// 			expect(createdChangeTrendWidgetPointsCountAfter1).toEqual(createdChangeTrendWidgetPointsCountBefore);
	// 		}
	// 	}
	// });

	// it("Verify Wave-points widgets on 'Trends' tab after applying global filter 'Closed Year Month'", async function(){
	// 	serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
	// 	expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
	// 	util.switchToFrameById(frames.cssrIFrame);
	// 	await util.waitForInvisibilityOfKibanaDataLoader();
	// 	util.waitForAngular();
	// 	// Get number of points from 'Closed Change Trend' widget
	// 	var closedChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
	// 	if(closedChangeTrendWidgetPointsCountBefore > 1){
	// 		await serviceMgmtUtil.clickOnFilterButtonBasedOnName(changeManagementTestData.closedMonthYearFilterName);
	// 		await expect(serviceMgmtUtil.verifyFilterPanelExpanded(changeManagementTestData.closedMonthYearFilterName)).toBe(true);
	// 		var filterValue = await serviceMgmtUtil.selectFirstFilterValueBasedOnName(changeManagementTestData.closedMonthYearFilterName);
	// 		if(filterValue != false){
	// 			// Apply 'Closed Year Month' filter
	// 			await serviceMgmtUtil.clickOnApplyFilterButton(changeManagementTestData.closedMonthYearFilterName);
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Verify tooltip text with applied filter value
	// 			await expect(serviceMgmtUtil.getGlobalFilterButtonToolTipText(changeManagementTestData.closedMonthYearFilterName)).toEqual(filterValue);
	// 			// Get number of points from 'Closed Change Trend' widget after applying filter
	// 			var closedChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
	// 			expect(closedChangeTrendWidgetPointsCountAfter).toBeLessThan(closedChangeTrendWidgetPointsCountBefore);
	// 			expect(closedChangeTrendWidgetPointsCountAfter).toEqual(1);
	// 			var xAxisLabel = await serviceMgmtUtil.getXAxisLabelsFromWaveGraph(changeManagementTestData.closedChangeTrendCardName);
	// 			expect(xAxisLabel[0]).toEqual(filterValue);
	// 			await util.clickOnResetFilterLink();
	// 			await util.waitForInvisibilityOfKibanaDataLoader();
	// 			// Get number of points from 'Closed Change Trend' widget after resetting filter
	// 			var closedChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
	// 			expect(closedChangeTrendWidgetPointsCountAfter1).toEqual(closedChangeTrendWidgetPointsCountBefore);
	// 		}
	// 	}
	// });

	it("Verify Local Filter Functionality of 'Top 25 Site IDs' on 'Topography' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
		// Get Closed changes count before applying local filter
		var closedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.closedChangeCardName));
		// Get all names from name map widget
		var top25SiteIdsNamesFromWidget = await serviceMgmtUtil.getNamesFromWordCloud(changeManagementTestData.Top25SiteIDsCardName);
		if(!util.isListEmpty(top25SiteIdsNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.Top25SiteIDsCardName, top25SiteIdsNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Closed changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
			var closedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.closedChangeCardName));
			// Verify if Created changes and Closed changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(closedChangesAfter).toBeLessThanOrEqual(closedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Closed changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
			var closedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.closedChangeCardName));
			// Verify if Created changes and Closed changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(closedChangesAfterReset).toEqual(closedChangesBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Top 25 Street Addresses' on 'Topography' Tab for Change Management", async function(){
		await serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.topographyTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.topographyTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get Created changes count before applying local filter
		var createdChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
		// Get Closed changes count before applying local filter
		var closedChangesBefore = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.closedChangeCardName));
		// Get all names from name map widget
		var top25StreetAddressesNamesFromWidget = await serviceMgmtUtil.getFilteredNamesFromWordCloud(changeManagementTestData.Top25StreetAddressesCardName);
		if(!util.isListEmpty(top25StreetAddressesNamesFromWidget)){
			// Click on first name from name map widget
			await serviceMgmtUtil.clickOnSectionInNameListsFilters(changeManagementTestData.Top25StreetAddressesCardName, top25StreetAddressesNamesFromWidget[0]);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Closed changes count after applying local filter
			var createdChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
			var closedChangesAfter = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.closedChangeCardName));
			// Verify if Created changes and Closed changes count are less than or equal to the count values before applying local filter
			expect(createdChangesAfter).toBeLessThanOrEqual(createdChangesBefore);
			expect(closedChangesAfter).toBeLessThanOrEqual(closedChangesBefore);
			// Click on reset filters link to undo local filter applied
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get Created changes and Closed changes count after applying reset filters
			var createdChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.createdChangeCardName));
			var closedChangesAfterReset = util.stringToInteger(await serviceMgmtUtil.getKabianaBoardCardTextBasedOnName(changeManagementTestData.closedChangeCardName));
			// Verify if Created changes and Closed changes count are equal to the count values before applying local filter
			expect(createdChangesAfterReset).toEqual(createdChangesBefore);
			expect(closedChangesAfterReset).toEqual(closedChangesBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Created Change Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Created Change Trend' widget
		var createdChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
		if(createdChangeTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(createdChangeTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Created Change Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.createdChangeTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Trend' widget after applying local filter
			var createdChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
			expect(createdChangeTrendWidgetPointsCountAfter).toBeLessThan(createdChangeTrendWidgetPointsCountBefore);
			expect(createdChangeTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Trend' widget after resetting local filter
			var createdChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeTrendCardName);
			expect(createdChangeTrendWidgetPointsCountAfter1).toEqual(createdChangeTrendWidgetPointsCountBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Closed Change Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Closed Change Trend' widget
		var closedChangeTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
		if(closedChangeTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(closedChangeTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Closed Change Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.closedChangeTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Trend' widget after applying local filter
			var closedChangeTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
			expect(closedChangeTrendWidgetPointsCountAfter).toBeLessThan(closedChangeTrendWidgetPointsCountBefore);
			expect(closedChangeTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Trend' widget after resetting local filter
			var closedChangeTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeTrendCardName);
			expect(closedChangeTrendWidgetPointsCountAfter1).toEqual(closedChangeTrendWidgetPointsCountBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Created Change Weekly Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Created Change Weekly Trend' widget
		var createdChangeWeeklyTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeWeeklyTrendCardName);
		if(createdChangeWeeklyTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(createdChangeWeeklyTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Created Change Weekly Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.createdChangeWeeklyTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Weekly Trend' widget after applying local filter
			var createdChangeWeeklyTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeWeeklyTrendCardName);
			expect(createdChangeWeeklyTrendWidgetPointsCountAfter).toBeLessThan(createdChangeWeeklyTrendWidgetPointsCountBefore);
			expect(createdChangeWeeklyTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Created Change Weekly Trend' widget after resetting local filter
			var createdChangeWeeklyTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.createdChangeWeeklyTrendCardName);
			expect(createdChangeWeeklyTrendWidgetPointsCountAfter1).toEqual(createdChangeWeeklyTrendWidgetPointsCountBefore);
		}
	});

	it("Verify Local Filter Functionality of 'Closed Change Weekly Trend' on 'Trends' Tab for Change Management", async function(){
		serviceMgmtUtil.clickOnTabLink(changeManagementTestDataObject.trendTabLink);
		expect(serviceMgmtUtil.isTabLinkSelected(changeManagementTestDataObject.trendTabLink)).toBe(true);
		util.switchToFrameById(frames.cssrIFrame);
		await util.waitForInvisibilityOfKibanaDataLoader();
		util.waitForAngular();
		// Get number of points from 'Closed Change Weekly Trend' widget
		var closedChangeWeeklyTrendWidgetPointsCountBefore = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeWeeklyTrendCardName);
		if(closedChangeWeeklyTrendWidgetPointsCountBefore > 1){
			var pointIndex = parseInt(closedChangeWeeklyTrendWidgetPointsCountBefore / 2);
			// Click on mid point from Closed Change Weekly Trend widget
			await serviceMgmtUtil.clickOnWavePointGraphUsingIndex(changeManagementTestData.closedChangeWeeklyTrendCardName, pointIndex);
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Weekly Trend' widget after applying local filter
			var closedChangeWeeklyTrendWidgetPointsCountAfter = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeWeeklyTrendCardName);
			expect(closedChangeWeeklyTrendWidgetPointsCountAfter).toBeLessThan(closedChangeWeeklyTrendWidgetPointsCountBefore);
			expect(closedChangeWeeklyTrendWidgetPointsCountAfter).toEqual(1);
			await util.clickOnResetFilterLink();
			await util.waitForInvisibilityOfKibanaDataLoader();
			// Get number of points from 'Closed Change Weekly Trend' widget after resetting local filter
			var closedChangeWeeklyTrendWidgetPointsCountAfter1 = await serviceMgmtUtil.getCountOfWaveGraphPoints(changeManagementTestData.closedChangeWeeklyTrendCardName);
			expect(closedChangeWeeklyTrendWidgetPointsCountAfter1).toEqual(closedChangeWeeklyTrendWidgetPointsCountBefore);
		}
	});
	
	afterAll(async function () {
		await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});

});
