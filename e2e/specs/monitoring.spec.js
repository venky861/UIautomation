
/**
 * Created by : Pushpraj
 * created on : 11/03/2020
 */

"use strict";
var since = require('jasmine2-custom-message');
var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
    launchpad = require('../pageObjects/launchpad.pageObject.js'),
    dashboard = require('../pageObjects/dashboard.pageObject.js'),
    sunrise_report = require('../pageObjects/sunrise_report.pageObject.js'),
    health = require('../pageObjects/health.pageObject.js'),
    inventory = require('../pageObjects/inventory.pageObject.js'),
    actionableInsight = require('../pageObjects/actionable_insights.pageObject.js'),
    pervasiveInsight = require('../pageObjects/pervasive_insights.pageObject.js'),
    incidentManagement = require('../pageObjects/incident_management.pageObject.js'),
    problemManagement = require('../pageObjects/problem_management.pageObject.js'),
    changeManagement = require('../pageObjects/change_management.pageObject.js'),
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
	util = require('../../helpers/util.js');

describe('Monitoring test', function() {
    var launchpadObj, dashboardObj, healthObj, inventoryObj, actionableInsightObj, pervasiveInsightObj, incidentManagementObj, problemManagementObj,
     changeManagementObj,  sunrise_reportObj;

	beforeAll(function() {
        launchpadObj = new launchpad();
        dashboardObj = new dashboard();
        healthObj = new health();
        inventoryObj = new inventory();
        actionableInsightObj = new actionableInsight();
        pervasiveInsightObj = new pervasiveInsight();
        incidentManagementObj = new incidentManagement();
        problemManagementObj = new problemManagement();
        changeManagementObj = new changeManagement();
        sunrise_reportObj = new sunrise_report();
	});	

	beforeEach(function() {
		launchpadObj.open();		
	});

    it('verify welcome page and application url to confirm for login', function() { 
        expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
        expect(util.getCurrentURL()).toContain(appUrls.launchpad);
    });
    
	it('verify dashboard page and cards by clicking on AIOps - Intelligent IT Operation', async function() { 
        launchpadObj.clickOnIntelligentItOprLink();
        dashboardObj.open();
        since(await dashboardObj.getDashboardHeaderTitleText() +" header title is not correct").expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
        since(await util.getCurrentURL() +" dashboard page URL").expect(util.getCurrentURL()).toContain(appUrls.dashboardPageUrl);
        var alertCount = await dashboardObj.getAlertsTotalCount();
        var alertRowCount = await dashboardObj.getAlertsRowCount();
        var healthCardCount = await dashboardObj.getTotalAlertsCountFromHealthCard();
        since("mismatched - Expected Alert title count is "+alertCount+" and Alert row count "+alertRowCount).expect(alertCount).toEqual(alertRowCount);
        since("mismatched - Expected Alert card count "+alertCount+" and Health card critical & warning count "+healthCardCount).expect(alertCount).toEqual(healthCardCount);
        var allAvailableCard = await dashboardObj.getAllAvialableCardsNameFromDashboard();
        since(dashboardTestData.dailySunriseReport +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.dailySunriseReport);
        since(dashboardTestData.alerts +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.alerts);
        since(dashboardTestData.health +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.health);
        since(dashboardTestData.inventory +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.inventory);
        since(dashboardTestData.actionableInsights +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.actionableInsights);
        since(dashboardTestData.pervasiveInsights +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.pervasiveInsights);
        since(dashboardTestData.incidentManagement +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.incidentManagement);
        since(dashboardTestData.problemManagement +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.problemManagement);
        since(dashboardTestData.changeManagement +" card is not available").expect(allAvailableCard).toContain(dashboardTestData.changeManagement);
    });
    
    it('Verify no data available and connection failure message is not present', function() { 
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
        expect(util.getCurrentURL()).toContain(appUrls.dashboardPageUrl);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.inventoryCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.pervasiveInsightsCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.healthCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.incidentManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.problemManagementCard)).toBe(false);
		expect(dashboardObj.isNoDataAvailableTextPresent(launchpadTestData.changeManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.inventoryCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.pervasiveInsightsCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.healthCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.incidentManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.problemManagementCard)).toBe(false);
		expect(dashboardObj.isConnectionFailureTextPresent(launchpadTestData.changeManagementCard)).toBe(false);
	});
    
    
    it('Verify incident problem and change management api data should be greter than zero for created and resolved tickets', async function() {
    	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
    	
    	var twoMonthsPreviousDate = util.getPreviousMonthYearDate(2);
		expect(await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate)).toBeGreaterThan(0);
		
		var oneMonthPreviousDate = util.getPreviousMonthYearDate(1);
		expect(await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate)).toBeGreaterThan(0);
		
		var currentMonthDate = util.getPreviousMonthYearDate(0);
		expect(await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.created, currentMonthDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getIncidentManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate)).toBeGreaterThan(0);
		
		expect(await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate)).toBeGreaterThan(0);
		
		expect(await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate)).toBeGreaterThan(0);
		
		expect(await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.created, currentMonthDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getProblemManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate)).toBeGreaterThan(0);
		
		expect(await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, twoMonthsPreviousDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, twoMonthsPreviousDate)).toBeGreaterThan(0);
		
		expect(await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, oneMonthPreviousDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, oneMonthPreviousDate)).toBeGreaterThan(0);
		
		expect(await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.created, currentMonthDate)).toBeGreaterThan(0);
		expect(await dashboardApiUtil.getChangeManagementCardDetails(dashboardApiTestData.resolved, currentMonthDate)).toBeGreaterThan(0);
	});	
	
    it('Verify daily sunrise report card is displaying data', function() { 
    	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p1Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p2Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.created)).toEqual(jasmine.any(Number));
		expect(dashboardObj.getTextFromDailySunRiseReportCard(dashboardTestData.p3Tickets, dashboardTestData.resolved)).toEqual(jasmine.any(Number));
    });
    
    it('verify logout & login functionality by clicking on logout and login button', function() { 
        launchpadObj.clickOnUserHeaderActionIcon();
        launchpadObj.clickOnLogoutButton();
        expect(launchpadObj.getTextLogoutMessage()).toEqual(launchpadTestData.logoutSuccessMsg);
    });

});
