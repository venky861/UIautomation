
/**
 * Created by : Pushpraj
 * created on : 14/02/2020
 */

"use strict";
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
    deliveryInsightTestData = require('../../testData/cards/deliveryInsightsTestData.json'),
    sunriseReportTestData = require('../../testData/cards/sunriseReportTestData.json'),
    monitoringTestData = require('../../testData/cards/monitoringVisibilityTestData.json'),
    frames = require('../../testData/frames.json'),
	util = require('../../helpers/util.js'),
	user_access = require('../pageObjects/user_access.pageObject.js'),
	healthPage = require('../pageObjects/health.pageObject.js')

describe('launchpad functionality', function() {
    var launchpadObj, dashboardObj, healthObj, inventoryObj, actionableInsightObj, pervasiveInsightObj, incidentManagementObj, problemManagementObj,
     changeManagementObj,  sunrise_reportObj, user_accessObj,healthObj;

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
		user_accessObj = new user_access();
		healthObj = new healthPage();
	});	

	beforeEach(function() {
		launchpadObj.open();		
	});

    it('verify welcome page and application url to confirm for login', function() { 
        expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
        expect(util.getCurrentURL()).toContain(appUrls.launchpad);
    });
    
	it('verify dashboard page by clicking on AIOps - Intelligent IT Operation', async function() { 
        await launchpadObj.clickOnIntelligentItOprLink();
        await launchpadObj.clickOnDashboardTile(launchpadTestData.learnPage_aiopsDashboardTile);
        await dashboardObj.open();
        expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.dashboardPageUrl);
    });

    it('verify able to click on Dashboard card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
        dashboardObj.open();
        expect(dashboardObj.getDashboardHeaderTitleText()).toEqual(dashboardTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.dashboardPageUrl);
    });

    it('verify able to click on Sunrise Report card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.sunriseReportCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.sunriseReportCard);
        sunrise_reportObj.open();
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.sunriseReportPageUrl);
        util.switchToDefault();
		util.switchToFrameById(frames.mcmpIframe);
        expect(util.getHeaderTitleText()).toEqual(sunriseReportTestData.headerTitle);
    });

    it('verify able to click on Health card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.healthCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.healthCard);
        expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.healthPageUrl);
    });
    
    it('verify able to click on Inventory card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.inventoryCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.inventoryCard);
        expect(inventoryObj.getInventoryHeaderTitleText()).toEqual(inventoryTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.inventoryPageUrl);
    });

    it('verify able to click on Actionable Insights card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.actionableInsightsCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.actionableInsightsCard);
        actionableInsightObj.open();
        expect(util.getHeaderTitleText()).toEqual(actionableInsightTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.actionableInsightPageUrl);
    });

    it('verify able to click on Pervasive Insights card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.pervasiveInsightsCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.pervasiveInsightsCard);
        pervasiveInsightObj.open();
        expect(util.getHeaderTitleText()).toEqual(pervasiveInsightTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.pervasiveInsightPageUrl);
    });

    it('verify able to click on Incident Management card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.incidentManagementCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.incidentManagementCard);
        incidentManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(incidentManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.incidentManagementPageUrl);
    });

    it('verify able to click on Problem Management card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.problemManagementCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.problemManagementCard);
        problemManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(problemManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.problemManagementPageUrl);
    });

    it('verify able to click on Change Management card link from launchpad, navigation url and header title from humberger link', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.changeManagementCard)).toBe(true);
        launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.changeManagementCard);
        changeManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.changeManagementPageUrl);
    });
    
    it('verify on clicking hamburger link X symbol and card links displays and disapears after clicking on it again', function() { 
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
        expect(launchpadObj.getHamburgerNavigationStatus()).toBe(launchpadTestData.leftNavigationExpanded);
        expect(launchpadObj.isHamburgerCrossSymbolDisplayed()).toBe(true);
        launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.leftNavigationLinkPortal)).toBe(true);
        launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationHidden);
        expect(launchpadObj.getHamburgerNavigationStatus()).toBe(launchpadTestData.leftNavigationHidden);
        expect(launchpadObj.isHamburgerCrossSymbolDisplayed()).toBe(false);
        expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.leftNavigationLinkPortal)).toBe(false);
    });
    
    it('verify on launchpad page all the tiles present under Get started header section', async function() { 
        expect(await launchpadObj.verifySectionHeaderIsPresentOrNot(launchpadTestData.sectionHeader_getStartedHeaderText)).toBe(true);
        launchpadObj.clickOnShowAllTasksLink();
    	var sectionTilesList = await launchpadObj.getAllTilesFromSpecificHeaderSection(launchpadTestData.sectionHeader_getStartedHeaderText);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_SunriseCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_ActionalbleCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_InventoryCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_PervasiveCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_HealthCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_IncidentMgmtCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_ChangeMgmtCardTitle);
    	expect(sectionTilesList).toContain(launchpadTestData.commonTask_ProblemMgmtCardTitle);
    });
    
    it('verify on clicking Change Management tile from Get started Header section, it navigates to Change Management page', async function() {
    	launchpadObj.clickOnTileBasedOnHeaderAndTileName(launchpadTestData.sectionHeader_getStartedHeaderText,launchpadTestData.commonTask_ChangeMgmtCardTitle);
    	changeManagementObj.open();
        expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
        expect(util.getCurrentURL()).toEqual(browser.params.url + appUrls.changeManagementPageUrl);
	});
	
	it('verify aiops admin role user is able to navigate to self service page', async function() {
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole();
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard)).toBe(true);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		var allCardNames = await dashboardObj.getAllCardsNameFromDashboard()
		if(aiopsAdminBool){
			await expect(allCardNames.includes(dashboardTestData.adminCardName)).toBe(true)
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.selfServiceName)
			await expect(util.getHeaderTitleText()).toEqual(dashboardTestData.selfServiceName);
		}else{
			await expect(allCardNames.includes(dashboardTestData.adminCardName)).toBe(false)
		}
	});
	
	it('Verify user is able to search in audit log page using search icon.', async function() { 
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole();
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard)).toBe(true);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		var allCardNames = await dashboardObj.getAllCardsNameFromDashboard()
		if(aiopsAdminBool){
			await expect(allCardNames.includes(dashboardTestData.adminCardName)).toBe(true)
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.selfServiceName)
			var firstNameInTable = await dashboardObj.getTableColumnDataByIndex(1);
			await user_accessObj.clickOnSearch();
			await user_accessObj.searchOrgTeamUser(firstNameInTable[0]);
			var firstNameInTableAfterSearch = await dashboardObj.getTableColumnDataByIndex(1);
			expect(firstNameInTableAfterSearch.every((name)=>name.toLowerCase() === firstNameInTable[0].toLowerCase())).toBe(true)
		}else{
			await expect(allCardNames.includes(dashboardTestData.adminCardName)).toBe(false)
		}
	})

	it('verify AIOp Admin user is able to download and upload self service files', async function() {
		var aiopsAdminBool = await user_accessObj.verifyUserHasAiopsAdminrole();
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		expect(launchpadObj.isCardDisplayedOnLeftNavigation(launchpadTestData.dashboardCard)).toBe(true);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		var allCardNames = await dashboardObj.getAllCardsNameFromDashboard()
		if(aiopsAdminBool){
			await expect(allCardNames.includes(dashboardTestData.adminCardName)).toBe(true)
			await dashboardObj.clickOnAdminConsoleCategories(dashboardTestData.selfServiceName)
			await dashboardObj.getTableColumnDataByIndex(1);
			expect(await dashboardObj.downloadTemplate(dashboardTestData.download)).toBe(true)
			expect(await dashboardObj.uploadTemplate()).toBe(true)
		}else{
			await expect(allCardNames.includes(dashboardTestData.adminCardName)).toBe(false)
		}
	})
    
    it('Verify if upon clicking on link from common task , User should lead to respective page', async function() { 
        // Change management verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_ChangeMgmtCardTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(changeManagementTestData.headerTitle);
        // Actionable insight verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_ActionalbleCardTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(actionableInsightTestData.headerTitle);
        // Incident management verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_IncidentMgmtCardTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(incidentManagementTestData.headerTitle);
        // Problem management verification     
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_ProblemMgmtCardTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(problemManagementTestData.headerTitle);
        // Daily Sunrise Report verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_SunriseCardTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(sunriseReportTestData.headerTitle); 
        // Monitoring and Visibility verification 
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_MonitoringTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(monitoringTestData.headerTitle);
        // Pervasive Insight verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_PervasiveCardTitle,true);
        await expect(util.getHeaderTitleText()).toEqual(pervasiveInsightTestData.headerTitle);
        // Health verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_HealthCardTitle,false);
        await expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
        // Inventory verification
        await launchpadObj.clickOnCommonTasksMenuLink(launchpadTestData.commonTask_InventoryCardTitle,false);
        await expect(inventoryObj.getInventoryHeaderTitleText()).toEqual(inventoryTestData.headerTitle);

    });

    afterAll(async function() {
    	await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});	

});
