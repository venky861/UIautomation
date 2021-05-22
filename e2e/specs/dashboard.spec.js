/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";

var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
	dashboardPage = require('../pageObjects/dashboard.pageObject.js'),
	launchpadPage = require('../pageObjects/launchpad.pageObject.js'),
	healthPage = require('../pageObjects/health.pageObject.js'),
	inventory = require('../pageObjects/inventory.pageObject.js'),
    actionableInsight = require('../pageObjects/actionable_insights.pageObject.js'),
    pervasiveInsight = require('../pageObjects/pervasive_insights.pageObject.js'),
    incidentManagement = require('../pageObjects/incident_management.pageObject.js'),
    problemManagement = require('../pageObjects/problem_management.pageObject.js'),
    changeManagement = require('../pageObjects/change_management.pageObject.js'),
    sunrise_report = require('../pageObjects/sunrise_report.pageObject.js'),
	userAccess = require("../pageObjects/user_access.pageObject.js"),
	appUrls = require('../../testData/appUrls.json'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	healthTestData = require('../../testData/cards/healthTestData.json'),
    inventoryTestData = require('../../testData/cards/inventoryTestData.json'),
    actionableInsightTestData = require('../../testData/cards/actionableInsightsTestData.json'),
    pervasiveInsightTestData = require('../../testData/cards/pervasiveInsightsTestData.json'),
    incidentManagementTestData = require('../../testData/cards/incidentManagementTestData.json'),
    problemManagementTestData = require('../../testData/cards/problemManagementTestData.json'),
    changeManagementTestData = require('../../testData/cards/changeManagementTestData.json'),
    sunriseReportTestData = require('../../testData/cards/sunriseReportTestData.json'),
    dashboardApiUtil = require('../../helpers/dashboardApiUtil.js'),
	dashboardApiTestData = require('../../testData/cards/dashboardAPITestData.json'),
	frames = require('../../testData/frames.json'),
	expected_values = require('../../expected_values.json'),
	dashboard_expected_values = require('../../testData/expected_value/dashboard_expected_values.json'),
	healthAndInventoryUtil = require("../../helpers/healthAndInventoryUtil.js"),
	util = require('../../helpers/util.js');
var applicationUrl = browser.params.url;
describe('Dashboard Test Suite: ', function() {
	var dashboardObj, launchpadObj, healthObj, inventoryObj, actionableInsightObj, pervasiveInsightObj, incidentManagementObj, problemManagementObj,
    changeManagementObj, sunrise_reportObj , user_accessObj;
	var expected_valuesObj, dashboard_expected_valuesObj;

	beforeAll(function() {
		dashboardObj = new dashboardPage();
		launchpadObj = new launchpadPage();
		healthObj = new healthPage();
        inventoryObj = new inventory();
        actionableInsightObj = new actionableInsight();
        pervasiveInsightObj = new pervasiveInsight();
        incidentManagementObj = new incidentManagement();
        problemManagementObj = new problemManagement();
        changeManagementObj = new changeManagement();
        sunrise_reportObj = new sunrise_report();
		user_accessObj = new userAccess();
        expected_valuesObj = JSON.parse(JSON.stringify(expected_values));
        dashboard_expected_valuesObj = JSON.parse(JSON.stringify(dashboard_expected_values));
	});	

	beforeEach(function() {
		launchpadObj.open();
		expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
	});

	it('Verify available cards on dashboard page', function() { 
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.dailySunriseReport);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.alerts);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.health);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.inventory);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.actionableInsights);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.pervasiveInsights);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.incidentManagement);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.problemManagement);
		expect(dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.changeManagement);
	});

	it('Compare Alerts total count, No. of alert rows on Alerts card and Critical+Warning count on Health card', async function() {
		expect(dashboardObj.getAlertsTotalCount()).toEqual(dashboardObj.getAlertsRowCount());
		expect(dashboardObj.getAlertsTotalCount()).toBeLessThanOrEqual(dashboardObj.getTotalAlertsCountFromHealthCard());
		var object = await dashboardApiUtil.getAlertsCardDetails(0);
		expect(await dashboardObj.getAlertsTotalCount()).toEqual(object["count"]);
		expect(await dashboardObj.getAlertsRowCount()).toEqual(object["count"]);
	});

	it('Verify that the alert items from Alerts card are clickable or not', async function(){
	   //verify alert presence
	    var rowCnt = await dashboardObj.getAlertsRowCount();
	    expect(rowCnt).toBeGreaterThanOrEqual(0);
	    //Retrieve alert and match against alert header page
	    var alertName=await dashboardObj.retrieveFirstAlert();
		await dashboardObj.clickOnFirstAlertFromAlertsCard();
		expect(alertName).toContain(dashboardObj.retrieveAlertHeader());
	});


	it('verify aiops admin role user is able to see admin card on dashboard page', async function() {
		await launchpadObj.clickOnUserHeaderActionIcon()
		var myTeams = await launchpadObj.getMyTeamsOnProfile(dashboardTestData.adminRoleTeams)
		if(myTeams){
		expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toBe(true);
		expect(await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.selfServiceName)).toBe(true);
		await dashboardObj.getAuditLogHeaderText()
		}else{
			expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toBe(false);
		}
	});

	it('Verify that the alert are displaying in descending order', async function(){
		var alerts = await dashboardObj.getAlertsTimestamp();
		util.waitForAngular();
		var sortedAlerts = await util.sortArrayList(alerts,"descending","numeric")
		var alertLength = await dashboardObj.getAlertsTotalCount();
		if(alertLength>1)
		{
	         expect(alerts).toEqual(sortedAlerts);
		}
	});

	it('Verify that the associated resource header and count is displaying', async function(){
		var alertBool = false;
		alertBool= await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
		util.waitForAngular();
		expect(await healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
		expect(await healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(await healthObj.getRowCountFromAssociatedResourcesAppsTable());
		}
	});

	it('Verify that the right parameter is displaying in alert overview section', async function(){
		var alertBool = false;
		alertBool= await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
		util.waitForAngular();
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewApplicationCategory);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewImpactedResources);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewProvider);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewEnvironment);
		expect(await dashboardObj.getAllAvailableParameterNameFromAlert()).toContain(healthTestData.OverviewBusinessUnit);
		}
	});
    it('Verify that associated resource is downloadable as csv and json and match the count againast table rows count', async function () {
		var alertBool = false;
		alertBool = await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
		// Download Associated resources as csv and json file
		var jsonFileDownload = await healthAndInventoryUtil.downloadAssociatedResourcesJSON();
		var csvFileDownload =  await healthAndInventoryUtil.downloadAssociatedResourcesCSV();
		if(csvFileDownload == true && jsonFileDownload == true)
		{
			// Verify if the downloaded file exists or not
			expect(util.isTicketDetailsFileExists()).toBe(true);
			var associated_resources_csv_count = await util.getCsvFileRowCount();
			var associated_resources_json_count=await util.getTicketCountFromJsonData();
			//verify number of record in csv and json file matches with number of records in table
			expect(associated_resources_csv_count).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
			expect(associated_resources_json_count).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
		}
	}
	});
	it('Verify that user is able to search and verify the right columns in the associated resource table', async function () {
		var totalAlertCount = await dashboardObj.getAlertsTotalCount()
		if(totalAlertCount >0){
			await dashboardObj.clickOnFirstAlertFromAlertsCard();
			await expect(inventoryObj.isTableSearchBarDisplayed()).toBe(true);
			//Search validation
			await inventoryObj.searchTable(dashboardTestData.sampleSearchText);
	    	await expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(await healthObj.getRowCountFromAssociatedResourcesAppsTable());
	    	//Associated table columns presence checks
	    	await expect(healthObj.getAssociatedColumnPresence()).toBe(true);
		}
	});

    it('Verify that upon clicking on health breadcrumb from alerts, system is navigating to health dashboard', async function () {
		var alertBool = false;
		alertBool = await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
	        //Click on Health breadcrumb
	        healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.breadcrumbApplication);
			expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
		}
	});

	it('Verify that upon clicking on Aiops console breadcrumb from alerts, system is navigating to Aiops landing page', async function () {
		var alertBool = false;
		alertBool = await dashboardObj.clickOnFirstAlertFromAlertsCard();
		if(alertBool === true){
	        //Click on AIops Console breadcrumb
	        healthAndInventoryUtil.clickOnBreadcrumbLink(dashboardTestData.dashboardBreadCrumb);
			expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		}
	});

	it('Verify that critical alerts count is same on Dashboard and Health page donut chart', async function(){
		var count = await dashboardObj.getCriticalAlertsCountFromHealthCard();
		if(count != 0){	
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
			await healthObj.clickOnCriticalSliceFromDonutChart();
			expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(count);
			if(browser.params.dataValiadtion){
				logger.info("------data validation------");
				var healthCriticalCount =  dashboard_expected_valuesObj.health.business_applications.critical;
				expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(healthCriticalCount);
			}
		}
	});

	it('Verify that warning alerts count is same on Dashboard and Health page donut chart', async function(){
		var count = await dashboardObj.getWarningAlertsCountFromHealthCard();
		if(count != 0){
			dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
			await healthObj.clickOnWarningSliceFromDonutChart();
			expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(count);
			if(browser.params.dataValiadtion){
				logger.info("------data validation------");
				var healthWarningCount =  dashboard_expected_valuesObj.health.business_applications.warning;
				expect(healthObj.getSelectedTypeCountFromDonutChart()).toEqual(healthWarningCount);
			}
		}
	});

	// Disabled because of Protractor limitation [Not able to automate donut chart]
	
	// it('Verify that healthy alerts count is same on Dashboard and Health page donut chart', async function(){
	// 	var count = await dashboardObj.getHealthyAlertsCountFromHealthCard();		
	// 	dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 	healthObj.open();
	// 	var status = await healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
	// 	if(status != 0){
	// 		expect(healthObj.getCountFromDonutChart()).toEqual(count);
	// 		if(browser.params.dataValiadtion){
	// 			logger.info("------data validation------");
	// 			var healthHealthyCount =  dashboard_expected_valuesObj.health.business_applications.healthy;
	// 			expect(healthObj.getCountFromDonutChart()).toEqual(healthHealthyCount);
	// 		}
	// 	}	
	// });
	
	it('Verify health card count from dashboard API', async function() { 
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.critical))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.health, dashboardTestData.criticalAlertName));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.warning))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.health, dashboardTestData.warningAlertName));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedHealth, dashboardApiTestData.healthy))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.health, dashboardTestData.healthyAlertName));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedOpenTicket, dashboardApiTestData.high))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.health, dashboardTestData.highPriority));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedOpenTicket, dashboardApiTestData.medium))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.health, dashboardTestData.mediumPriority));
		expect(await dashboardApiUtil.getHealthCardDetails(dashboardApiTestData.convergedOpenTicket, dashboardApiTestData.low))
		.toEqual(await dashboardObj.getTextFromMiniViewCard(dashboardTestData.health, dashboardTestData.lowPriority));
	});
	
	it('Verify no data available message is not present', function() { 
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.inventoryCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.pervasiveInsightsCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.healthCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.incidentManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.problemManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.changeManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.actionableInsightsCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(dashboardTestData.alerts)).toBe(false);
	});
	
	it('Verify connection failure message is not present', function() { 
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.inventoryCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.pervasiveInsightsCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.healthCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.incidentManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.problemManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.changeManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.actionableInsightsCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(dashboardTestData.alerts)).toBe(false);
	});
	
	it('verify able to click on View Details link for health card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
        expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.healthPageUrl);
    });
	
	it('verify able to click on View Details link for Inventory card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
        expect(inventoryObj.getInventoryHeaderTitleText()).toEqual(inventoryTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.inventoryPageUrl);
    });
	
	it('verify able to click on View Details link for Actionable Insights card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);
		actionableInsightObj.open();
        expect(util.getHeaderTitleText()).toEqual(actionableInsightTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.actionableInsightPageUrl);
	});
	
	it("Verify count of total insights ticket from Actionable Insights card should match with sum of the count from different categories on AI Landing page", async function(){
		var countFromTitleText = await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights);
		if(countFromTitleText != 0){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.actionableInsights);
			await actionableInsightObj.open();
			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
			util.switchToFrameById(frames.cssrIFrame);
			util.waitForAngular();
			expect(await actionableInsightObj.getTotalInsightsCategoriesCount()).toEqual(countFromTitleText);
		}
	})
	
	it('verify able to click on View Details link for Pervasive Insights card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.pervasiveInsights);
		pervasiveInsightObj.open();
        expect(util.getHeaderTitleText()).toEqual(pervasiveInsightTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.pervasiveInsightPageUrl);
    });
	
	it('verify able to click on View Details link for Incident Management card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.incidentManagement);
		incidentManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(incidentManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.incidentManagementPageUrl);
    });
	
	it('verify able to click on View Details link for Problem Management card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.problemManagement);
		problemManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(problemManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.problemManagementPageUrl);
    });
			
	it('verify able to click on View Details link for Change Management card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.changeManagement);
        changeManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.changeManagementPageUrl);
    });
	
	it('verify able to click on daily sunrise report card from dashboard page, navigation url and header title', function() { 
		dashboardObj.clickOnDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created);
		sunrise_reportObj.open();
		expect(util.getCurrentURL()).toEqual(applicationUrl + appUrls.sunriseReportPageUrl);
		util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
        expect(util.getHeaderTitleText()).toEqual(sunriseReportTestData.headerTitle);
    });
	
	it('Verify daily sunrise report card is displaying data', function() { 
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
    });
	
	it('Verify daily sunrise report card data from dashboard sunriseReportCard api', async function() { 
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.created));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.resolved))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p1Tickets, dashboardApiTestData.resolved));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.created))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p2Tickets, dashboardApiTestData.created));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.resolved))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p2Tickets, dashboardApiTestData.resolved));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.created))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p3Tickets, dashboardApiTestData.created));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.resolved))
		.toEqual(await dashboardApiUtil.getSunRiseReportCardDetails(dashboardApiTestData.p3Tickets, dashboardApiTestData.resolved));
    });
	
	it('Verify inventory card data count for MC and DC is displayed in inventory page', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		var dcCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.dataCenter);
		expect(dcCount).toEqual(await dashboardApiUtil.getInventoryCardDetails(dashboardApiTestData.dataCenter));
		var mcCount = await dashboardObj.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.multiCloud);
		expect(mcCount).toEqual(await dashboardApiUtil.getInventoryCardDetails(dashboardApiTestData.multiCloud));
		var totalInventoryCount = dcCount + mcCount;
		await dashboardObj.clickOnLargeViewIcon();
		await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		expect(totalInventoryCount).toEqual(await inventoryObj.getApplicationOrResourcesTableHeaderTextCount());
    });
	
	it('Verify incident management api data should be a number [zero or greater than zero] for created and resolved tickets', async function() {
		var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		var createdTicketsCount1 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate);
		expect(createdTicketsCount1).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount1).toEqual(jasmine.any(Number));
		var resolvedticketsCount1 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate);
		expect(resolvedticketsCount1).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount1).toEqual(jasmine.any(Number));
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		var createdTicketsCount2 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate);
		expect(createdTicketsCount2).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount2).toEqual(jasmine.any(Number));
		var resolvedticketsCount2 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate);
		expect(resolvedticketsCount2).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount2).toEqual(jasmine.any(Number));
		// Not necessary data will be present for current month
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		var createdTicketsCount3 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, currentMonthDate);
		expect(createdTicketsCount3).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount3).toEqual(jasmine.any(Number));
		var resolvedticketsCount3 = await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate);
		expect(resolvedticketsCount3).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount3).toEqual(jasmine.any(Number));
	});
	
	it('Verify problem management api data should be a number [zero or greater than zero] for created and resolved tickets', async function() {
		var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		var createdTicketsCount1 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate);
		expect(createdTicketsCount1).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount1).toEqual(jasmine.any(Number));
		var resolvedticketsCount1 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate);
		expect(resolvedticketsCount1).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount1).toEqual(jasmine.any(Number));
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		var createdTicketsCount2 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate);
		expect(createdTicketsCount2).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount2).toEqual(jasmine.any(Number));
		var resolvedticketsCount2 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate);
		expect(resolvedticketsCount2).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount2).toEqual(jasmine.any(Number));
		//Not necessary data will be present for current month
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		var createdTicketsCount3 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, currentMonthDate);
		expect(createdTicketsCount3).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount3).toEqual(jasmine.any(Number));
		var resolvedticketsCount3 = await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate);
		expect(resolvedticketsCount3).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount3).toEqual(jasmine.any(Number));
	});
	
	it('Verify change management api data should be a number [zero or greater than zero] for created and implemented tickets', async function() {
		var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		var createdTicketsCount1 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate)
		expect(createdTicketsCount1).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount1).toEqual(jasmine.any(Number));
		var resolvedticketsCount1 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate)
		expect(resolvedticketsCount1).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount1).toEqual(jasmine.any(Number));
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		var createdTicketsCount2 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate)
		expect(createdTicketsCount2).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount2).toEqual(jasmine.any(Number));
		var resolvedticketsCount2 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate)
		expect(resolvedticketsCount2).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount2).toEqual(jasmine.any(Number));
		//Not necessary data will be present for current month
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		var createdTicketsCount3 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, currentMonthDate)
		expect(createdTicketsCount3).toBeGreaterThanOrEqual(0);
		expect(createdTicketsCount3).toEqual(jasmine.any(Number));
		var resolvedticketsCount3 = await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate)
		expect(resolvedticketsCount3).toBeGreaterThanOrEqual(0);
		expect(resolvedticketsCount3).toEqual(jasmine.any(Number));
	});
	
	it('Verify pervasive insights graph tickets count from api data', async function() {
		var serversName = await dashboardObj.getPervasiveInsightsCardTop5ServersText();
		await expect(await dashboardObj.getPervasiveInsightsGraphBarText(0)).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[0]));
		await expect(await dashboardObj.getPervasiveInsightsGraphBarText(1)).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[1]));
		await expect(await dashboardObj.getPervasiveInsightsGraphBarText(2)).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[2]));
		await expect(await dashboardObj.getPervasiveInsightsGraphBarText(3)).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[3]));
		await expect(await dashboardObj.getPervasiveInsightsGraphBarText(4)).toEqual(await dashboardApiUtil.getPervasiveInsightsCardDetails(serversName[4]));
	});
	
	it('Verify actionable insights graph tickets count from api data', async function() {
		var object = await dashboardApiUtil.getActionableInsightsCardDetails(0);	
		await logger.info("count : ", object["count"]);
		expect(await dashboardObj.getCardTitleCount(dashboardTestData.actionableInsights)).toEqual(object["count"]);
		if(object["count"] != 0){
			expect(await dashboardObj.getActionableInsightsCardRowCount()).toEqual(object["count"]);
			expect(await dashboardObj.getActionableInsightsCardRowText(0)).toEqual(object["title"]);
		}
	});
	
	it('Verify component name Text is Present for Pervasive Insights, Incident Management, Change Management, Problem Management, Inventory, and Health', function () {
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.pervasiveInsights)).toEqual(dashboardTestData.pervasiveCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.incidentManagement)).toEqual(dashboardTestData.incidentMangementCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.problemManagement)).toEqual(dashboardTestData.problemMangementCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.changeManagement)).toEqual(dashboardTestData.changeMangementCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.health)).toEqual(dashboardTestData.healthCardComponentText);
		expect(dashboardObj.getCardsDefinitionTextBasedOnCardName(dashboardTestData.inventory)).toContain(dashboardTestData.inventoryCardComponentText);

	});

	it('Verify all Key values of Incident Management, Change Management, Problem Management graphs are Present', function () {
		expect(dashboardObj.getCardKeyValuesTextBasedOnCardName(dashboardTestData.incidentManagement)).toContain(dashboardTestData.ticketCreatedName);
		expect(dashboardObj.getCardKeyValuesTextBasedOnCardName(dashboardTestData.incidentManagement)).toContain(dashboardTestData.ticketResolvedName);
		expect(dashboardObj.getCardKeyValuesTextBasedOnCardName(dashboardTestData.problemManagement)).toContain(dashboardTestData.ticketCreatedName);
		expect(dashboardObj.getCardKeyValuesTextBasedOnCardName(dashboardTestData.problemManagement)).toContain(dashboardTestData.ticketResolvedName);
		expect(dashboardObj.getCardKeyValuesTextBasedOnCardName(dashboardTestData.changeManagement)).toContain(dashboardTestData.changeImplementedName);
		expect(dashboardObj.getCardKeyValuesTextBasedOnCardName(dashboardTestData.changeManagement)).toContain(dashboardTestData.changeCreatedName);
	});

	it('Verify x-axis Label values are Present for last 3 months and y-axis Label Value start from 0 for Pervasive Insights, Incident Management, Change Management, Problem Management', function () {
		var cardNameList = [dashboardTestData.incidentManagement, dashboardTestData.problemManagement, dashboardTestData.changeManagement]
		cardNameList.forEach(function (cardName) {
			expect(dashboardObj.getCardXaxisLabelsTextBasedOnCardName(cardName)).toContain(util.getPreviousMonthYearDate(2));
			expect(dashboardObj.getCardXaxisLabelsTextBasedOnCardName(cardName)).toContain(util.getPreviousMonthYearDate(1));
			expect(dashboardObj.getCardXaxisLabelsTextBasedOnCardName(cardName)).toContain(util.getPreviousMonthYearDate(0));
			expect(dashboardObj.getCardXaxisLabelsCountTextBasedOnCardName(cardName)).toBe(dashboardTestData.previousMonthsLabelsCount);
			expect(dashboardObj.getCardYaxisFirstLabelTextBasedOnCardName(cardName)).toBe(dashboardTestData.firstYaxisLabelvalue);
		});
		expect(dashboardObj.getCardYaxisFirstLabelTextBasedOnCardName(dashboardTestData.pervasiveInsights)).toContain(dashboardTestData.firstYaxisLabelvalue);
	});

	it('Verify x-axis and y-axis Title of bar graphs', function () {
		var cardNameList = [dashboardTestData.incidentManagement, dashboardTestData.problemManagement, dashboardTestData.changeManagement, dashboardTestData.pervasiveInsights]
		cardNameList.forEach(function (cardName) {
			expect(dashboardObj.getCardYaxisTitleTextBasedOnCardName(cardName)).toBe(dashboardTestData.yaxisTitle);
		});
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.pervasiveInsights)).toBe(dashboardTestData.pervasiveInsightsXaxisTitle);
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.changeManagement)).toBe(dashboardTestData.changeMgntXaxisTitle);
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.problemManagement)).toBe(dashboardTestData.problemMgntXaxisTitle);
		expect(dashboardObj.getCardXaxisTitleTextBasedOnCardName(dashboardTestData.incidentManagement)).toBe(dashboardTestData.IncidentMgntXaxisTitle);
	});

	it('Verify the color codes for bar graphs on incident management', function(){
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		// Verify color code for ticket created bar graphs
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		// Verify color code for ticket resolved bar graphs
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.incidentManagement, dashboardTestData.currentMonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
	});

	it('Verify the color codes for bar graphs on change management', function(){
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		// Verify color code for ticket created bar graphs
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		// Verify color code for ticket resolved bar graphs
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.changeManagement, dashboardTestData.currentMonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
	});

	it('Verify the color codes for bar graphs on problem management', function(){
		expect(util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
		// Verify color code for ticket created bar graphs
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemManagement, dashboardTestData.currentMonth, dashboardTestData.ticketCreated)).toEqual(dashboardTestData.ticketsCreatedColorCode);
		// Verify color code for ticket resolved bar graphs
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemManagement, dashboardTestData.previousSecondMonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemManagement, dashboardTestData.previousFirstmonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
		expect(dashboardObj.getColorCodeForBarGraph(dashboardTestData.problemManagement, dashboardTestData.currentMonth, dashboardTestData.ticketResolved)).toEqual(dashboardTestData.ticketsResolvedColorCode);
	});

	it('verify user is able to verify account name and click on settings for customisation', async function() { 

		expect(await dashboardObj.getAccountNameText()).not.toEqual(null);
		dashboardObj.customiseButtonClick();
		expect(await dashboardObj.getSettingsCancelButtonText()).toEqual(dashboardTestData.cancelName);
		expect(await dashboardObj.getSettingsSaveButtonText()).toEqual(dashboardTestData.saveName);
		expect(await dashboardObj.getCardDisabled()).toEqual(dashboardTestData.cardDisabledMsg);
		dashboardObj.clickCancelButton();

	});

	it('verify user is able to apply customisation and save changes', async function() { 
		
		dashboardObj.customiseButtonClick();
		dashboardObj.clickOnVisibilityIcon(dashboardTestData.health);
		dashboardObj.clickSaveButton();
		expect(await dashboardObj.getCustomisationMessage()).toEqual(dashboardTestData.customizationMsg);
		expect(await dashboardObj.getAllAvialableCardsNameFromDashboard()).not.toContain(dashboardTestData.health);
			
	});

	it('verify user is able to apply customisation and save changes again', async function() { 
		
		dashboardObj.customiseButtonClick();
		dashboardObj.clickOnVisibilityIcon(dashboardTestData.health);
		dashboardObj.clickSaveButton();
		expect(await dashboardObj.getCustomisationMessage()).toEqual(dashboardTestData.customizationMsg);
		expect(await dashboardObj.getAllAvialableCardsNameFromDashboard()).toContain(dashboardTestData.health);
			
	});

	it('verify user is able to click change Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickCreatedChangeMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.changeManagement);
		 util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click incident Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickCreatedIncidentMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.incidentManagement);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click Parvasive Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickParvasiveMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.pervasiveInsights);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click Problem Management from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickProblemMgmt();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.problemManagement);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify user is able to click Sunrise report from mini card view', async function() { 
		dashboardObj.clickOnMiniViewIcon();
		dashboardObj.clickSunriseReport();
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.dailySunriseReport);
		util.clickOnHeaderDashboardLink();
		expect(await dashboardObj.getDashboardTitleText()).toContain(dashboardTestData.headerTitle);
	});

	it('verify if resolver group link is clickable on admin card on dashboard page and verify table headers for both tabs ', async function() {		
		expect(await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName)).toBe(true);
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.scopeOfTicketsTabName)).toBe(dashboardTestData.scopeOfTicketsTabName);
		var headers = await healthObj.getListViewHeaders();
		expect(headers).toEqual(dashboardTestData.scopeOfTicketsTabColumns);
		expect(dashboardObj.checkVisibilityOfApplyButton()).toBe(true);
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.auditLogTabName)).toBe(dashboardTestData.auditLogTabName);
		headers = await healthObj.getListViewHeaders();
		expect(headers).toEqual(dashboardTestData.auditLogTabColumns);	
	});
	
	it('verify if audit entry is added under Audit LOg tab after selecting/deselecting resolver group', async function () {
		await expect(await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName)).toBe(true);
		await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		// Switch to audit logs tab and get the entry count
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.auditLogTabName)).toBe(dashboardTestData.auditLogTabName);
		var beforeChange = await dashboardObj.getAuditLogCountDetails();
		//Switch to scope of ticket tab and make
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.scopeOfTicketsTabName)).toBe(dashboardTestData.scopeOfTicketsTabName);
		await expect(await dashboardObj.selectTicketsInScopeCheckbox(1)).toBe(true);
		await dashboardObj.clickonApplyButton();
		//verify sccess message
		await expect(await dashboardObj.getResolverGroupChangeSuccessMessage()).toEqual(dashboardTestData.resolverGroupSuccessMessage);
		//Switch to Audit lgs tab and check for the audit log counts
		await expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.auditLogTabName)).toBe(dashboardTestData.auditLogTabName);
		var afterChange = await dashboardObj.getAuditLogCountDetails();
		expect(beforeChange).not.toBe(afterChange);
		var firstfieldInTable = await dashboardObj.getTableColumnDataByIndex(1);
		await user_accessObj.clickOnSearch();
		await user_accessObj.searchOrgTeamUser(firstfieldInTable[0]);
		var statusOfTheFirstRecord = await dashboardObj.getTableColumnDataByIndex(6);
		expect(statusOfTheFirstRecord[0]).toEqual('In progress')

	});

	it('verify if search functionality works for scope of ticket tab and audit log tab', async function () {
		expect(await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName)).toBe(true);
		expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.scopeOfTicketsTabName)).toBe(dashboardTestData.scopeOfTicketsTabName);
		var firstNameInTable = await dashboardObj.getTableColumnDataByIndex(1);
		await user_accessObj.clickOnSearch();
		await user_accessObj.searchOrgTeamUser(firstNameInTable[0]);
		var firstNameInTableAfterSearch = await dashboardObj.getTableColumnDataByIndex(1);
		expect(firstNameInTableAfterSearch.indexOf(firstNameInTable[0]) >= 0).toBe(true);
		//Switch to Audit lgs tab and search for text
		expect(await dashboardObj.selectResolverGroupTabBasedOnName(dashboardTestData.auditLogTabName)).toBe(dashboardTestData.auditLogTabName);
		firstNameInTable = await dashboardObj.getTableColumnDataByIndex(2);
		await user_accessObj.clickOnSearch();
		await user_accessObj.searchOrgTeamUser(firstNameInTable[0]);
		firstNameInTableAfterSearch = await dashboardObj.getTableColumnDataByIndex(2);
		expect(firstNameInTableAfterSearch.every((name)=>name.toLowerCase() === firstNameInTable[0].toLowerCase())).toBe(true)
	});

	it('verify aiops admin role user is able to see resolver group option under admin card on dashboard page', async function() {
		await launchpadObj.clickOnUserHeaderActionIcon()
		var myTeams = await launchpadObj.getMyTeamsOnProfile(dashboardTestData.adminRoleTeams)
		if(myTeams){
		await expect(await dashboardObj.getAllCardsHeadersFromDashboard(dashboardTestData.adminCardName)).toBe(true);
		await expect(await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.resolverGroupName)).toBe(true);
		await expect(await util.getHeaderTitleText()).toEqual(dashboardTestData.resolverGroupName);
		}else{
			expect(await dashboardObj.getAllCardsNameFromDashboard(dashboardTestData.adminCardName)).toBe(false);
		}
	});

	afterAll(async function() {
    	await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});	
});