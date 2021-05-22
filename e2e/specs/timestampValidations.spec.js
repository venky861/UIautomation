/**
 * Created by : Padmakar Selokar
 * created on : 17/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
    launchpad = require('../pageObjects/launchpad.pageObject.js'),
    dashboard = require('../pageObjects/dashboard.pageObject.js'),
	healthPage = require('../pageObjects/health.pageObject.js'),
	inventoryPage = require('../pageObjects/inventory.pageObject.js'),
    appUrls = require('../../testData/appUrls.json'),
    launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
    dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
    sunriseReportTestData = require('../../testData/cards/sunriseReportTestData.json'),
	util = require('../../helpers/util.js'),
	inventoryTestData = require('../../testData/cards/inventoryTestData.json')

describe('IT OPs timestamps ', function() {
    var launchpadObj, dashboardObj, healthObj, inventoryObj;
    var mcmpIframe = "mcmp-iframe";
    var cssrIframe = "cssrIFrame";

	beforeAll(function() {
        launchpadObj = new launchpad();
        dashboardObj = new dashboard();
		healthObj = new healthPage();
		inventoryObj = new inventoryPage();
	});	

	beforeEach(function() {
        launchpadObj.open();
        expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
	});

    it('Verify timestamp difference for Daily Sunrise Report', async function() {
        await launchpadObj.clickOnIntelligentItOprLink();
        await launchpadObj.clickOnDashboardTile(launchpadTestData.learnPage_aiopsDashboardTile);
        await dashboardObj.open();
        expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
        expect(util.getCurrentURL()).toContain(appUrls.dashboardPageUrl);
        expect(dashboardObj.isPresentDSRTile()).toEqual(sunriseReportTestData.headerTitle);
        expect(dashboardObj.getTimestampDiffForSunriseReport()).toEqual(sunriseReportTestData.dsrTimestampDiff);
    });

    it('Verify Last updated Timestamp for Change Management', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
        util.switchToFrameById(mcmpIframe);
        expect(dashboardObj.verifyLastUpdatedTimestampForITOps(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
    });

    it('Verify Last updated Timestamp for Incident Management', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.incidentManagementCard);
        util.switchToFrameById(mcmpIframe);
        expect(dashboardObj.verifyLastUpdatedTimestampForITOps(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
    });

    it('Verify Last updated Timestamp for Problem Management', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.problemManagementCard);
        util.switchToFrameById(mcmpIframe);
        expect(dashboardObj.verifyLastUpdatedTimestampForITOps(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
    });

    it('Verify Last updated Timestamp for Actionable Insights', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.actionableInsightsCard);
        util.switchToFrameById(mcmpIframe);
        expect(dashboardObj.verifyLastUpdatedTimestampForITOps(dashboardTestData.hoursValue, dashboardTestData.hoursTimeUnit)).toBe(true);
    });

    it('Verify Last updated Timestamp for Pervasive Insights', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.pervasiveInsightsCard);
        util.switchToFrameById(mcmpIframe);
        expect(dashboardObj.verifyLastUpdatedTimestampForITOps(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
    });

    it('Verify Last updated Timestamp for Health', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.healthCard);
        expect(dashboardObj.verifyLastUpdatedTimestampForHealthInventory(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
    });

    it('Verify Last updated Timestamp for Inventory', function() {
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.inventoryCard);
        expect(dashboardObj.verifyLastUpdatedTimestampForHealthInventory(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
	});
	
	it('Verify Last updated Timestamp for Inventory Resource overview',async function() {
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.inventoryCard);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventoryObj.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		await inventoryObj.clickOnViewDetails();
		expect(dashboardObj.verifyLastUpdatedTimestampForHealthInventory(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
	});

	it('Verify Last updated Timestamp for Application overview',async function() {
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.inventoryCard);
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		await expect(inventoryObj.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		await inventoryObj.clickOnViewDetails();
		expect(dashboardObj.verifyLastUpdatedTimestampForHealthInventory(dashboardTestData.minsValue, dashboardTestData.minsTimeUnit)).toBe(true);
	});
    
    afterAll(async function() {
    	await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});
