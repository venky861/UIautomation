/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
    logger = logGenerator.getApplicationLogger(),
	healthPage = require('../pageObjects/health.pageObject.js'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	healthTestData = require('../../testData/cards/healthTestData.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	appUrls = require('../../testData/appUrls.json'),
	elasticViewData = require('../../expected_values.json'),
	util = require('../../helpers/util.js'),
	healthAndInventoryUtil = require("../../helpers/healthAndInventoryUtil.js"),
	InventoryPage = require('../pageObjects/inventory.pageObject.js');

describe('Health - functionality: ', function() {
	var healthObj,launchpadObj, dashboardObj, inventory_page;
	var healthAppData = elasticViewData.health.applications.no_filters.expected_values;
	var healthResData = elasticViewData.health.resources.no_filters.expected_values;

	beforeAll(function() {
		healthObj = new healthPage();
		launchpadObj = new launchpad();
		dashboardObj = new dashboard();
		inventory_page = new InventoryPage();
		browser.driver.manage().window().maximize();
	});	

	beforeEach(function() {
		launchpadObj.open();
		expect(launchpadObj.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.healthCard);
		expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
	});

	it('Verify if all elements within Applications tab are loaded or not', function(){
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
		expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
		expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.appBreakdownLabelText);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastAvailableAppLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.mostAvailableAppLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appsWithMostIncidentsLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appWithMostHighPriorityIncidentsLabelText)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.applicationsLabelText)).toBe(true);
		expect(healthObj.getApplicationsCountFromLabel()).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		expect(inventory_page.checkNoDataTable()).toBe(false);
	});

	it('Verify Specific Business Unit in Health Resource Tab with Global filter', async function(){
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		expect(await healthObj.clickOnCheckBox(healthTestData.businessUnitSvt)).toBe(true);
		expect(await healthObj.applyGlobalFilter()).toBe(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName)
		expect(await healthObj.getResourceTabBusinessUnit(healthTestData.businessUnitSvt)).toBe(true);
	});

	it('Verify Specific Application in Health Resource Tab with Global filter', async function(){
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		await healthObj.clickOnApplicationMoreBtn(healthTestData.moreFilterOptionsLink)
		expect(await healthObj.clickOnCheckBox(healthTestData.applicationUnit)).toEqual(true);
		expect(await healthObj.applyGlobalFilter()).toEqual(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName)
		expect(await healthObj.getResourceTabApplication(healthTestData.applicationUnit)).toEqual(true);
	});

	it('Verify the tabs are clickable under KPI values', async function () {
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await expect(inventory_page.checkNoDataTable()).toBe(false);
		await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
		await util.clickOnTabButton(healthTestData.performanceLinkText);
		await expect(util.isSelectedTabButton(healthTestData.performanceLinkText)).toEqual(true);
		await expect(healthObj.kpiValuesTitle()).toEqual(healthTestData.kpiValues);
		await expect(util.clickOnTabButton(healthTestData.performanceLinkText));
		await expect(healthObj.resourceAvailabilitySubTitle()).toEqual(true);
		await expect(healthObj.resourceAvailabilityContainerCheck()).toEqual(true);
		await expect(healthObj.resourceAvailabilityFooterCheck()).toEqual(true);
		await expect(healthObj.clickOnResourceCategory()).toEqual(true)
		await expect(healthObj.filterValuesTitle()).toEqual(healthTestData.filterBy);
		await healthObj.selectFilterByDays()
		await expect(healthObj.clickOnComputeTab()).toEqual(true)
		await expect(healthObj.clickOnNetworkTab()).toEqual(true)
		await expect(healthObj.clickOnUtilization()).toEqual(true)
		await expect(healthObj.clickOnDiskTab()).toEqual(true)
		await expect(healthObj.clickOnMemoryTab()).toEqual(true)
		await expect(healthObj.clickOnProcessGroups()).toEqual(true)
		await expect(healthObj.clickOnHeapSizeTab()).toEqual(true)
		await expect(healthObj.clickOnGarbageCollectionTab()).toEqual(true)
	});

	it('Verify hyperlinks are there for application Name & Subsystems and check whether able to navigate to the respective page', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toBe(true);
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		expect(await healthObj.clickOnCheckBox(healthTestData.ibmDcProviderFilterText)).toEqual(true);
		expect(await healthObj.applyGlobalFilter()).toEqual(true);
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await inventory_page.searchTable(healthTestData.mainframe)
		// If there is no table data , then tableDataBool will return false
		var tableDataBool = await inventory_page.checkNoDataTable()
			//await healthObj.clickOnHealthDonut()
			if(!tableDataBool){
			await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			
			var tagsTableDataBool = await inventory_page.checkNoDataTable()
			if(!tagsTableDataBool){
			// index one clicks on subsystem name under tags sections and takes to subsystem page
			await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex); 
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			var headerNames = await healthObj.getListViewHeaders();
			// check whether we are in LPAR page by verify headername 
			await expect(headerNames.includes(healthTestData.lparHealth)).toBe(true);
			

			await inventory_page.checkNoDataTable()
			// click on mainframe resource header to reach resource page
			await healthObj.clickOnMainframeResourceHeader(healthTestData.oneIndex)
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			await inventory_page.checkNoDataTable()
			// click on mainframe resource with index 1
			await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex)
			//index zero clicks on application under tags sections and takes to application page
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			await healthObj.clickOnListViewUnderTags(healthTestData.zeroIndex) 
			// verify whether we are in application page by verifying headername
			headerNames = await healthObj.getListViewHeaders();
			await expect(headerNames.includes(healthTestData.application)).toBe(true);
			}
		}
	});

	
	it('Verify Proetheus filter, LPAR details page,Verify Tags section table columns, Verify hyperlinks are there for application Name & Subsystems and check whether able to navigate to the respective page', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toBe(true);
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		expect(await healthObj.clickOnCheckBox(healthTestData.ibmDcProviderFilterText)).toEqual(true);
		expect(await healthObj.applyGlobalFilter()).toEqual(true);
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await inventory_page.searchTable(healthTestData.mainframe)
		// If there is no table data , then tableDataBool will return false
		var tableDataBool = await inventory_page.checkNoDataTable()
			//await healthObj.clickOnHealthDonut()
			if(!tableDataBool){
			await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
			await util.clickOnTabButton(healthTestData.tagsLinkText);
		
			await expect(headerNames.includes(healthTestData.subsystem)).toBe(true);
			var tagsTableDataBool = await inventory_page.checkNoDataTable()
			if(!tagsTableDataBool){
			// index one clicks on subsystem name under tags sections and takes to subsystem page
			await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex); 
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			var headerNames = await healthObj.getListViewHeaders();
			//check whether the Mapped application field displayed in overview
			await expect(healthObj.getOverviewLabelFromResourceDetailsPage(healthTestData.OverveiwMappedApplicaiton)).toEqual(true);

			//To verify the App Category column
			//getListViewHeaders
			await expect(headerNames.includes(healthTestData.appCategory)).toBe(true);
			// check whether we are in LPAR page by verify headername 
			await expect(headerNames.includes(healthTestData.lparHealth)).toBe(true);
			
			util.clickOnTabButton(healthTestData.resourcesButtonName);

			await inventory_page.checkNoDataTable()
			// click on mainframe resource header to reach resource page
			await healthObj.clickOnMainframeResourceHeader(healthTestData.oneIndex)
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			await inventory_page.checkNoDataTable()
			// click on mainframe resource with index 1
			await healthObj.clickOnListViewUnderTags(healthTestData.oneIndex)
			//index zero clicks on application under tags sections and takes to application page
			await util.clickOnTabButton(healthTestData.tagsLinkText);
			await healthObj.clickOnListViewUnderTags(healthTestData.zeroIndex) 
			// verify whether we are in application page by verifying headername
			headerNames = await healthObj.getListViewHeaders();
			await expect(headerNames.includes(healthTestData.application)).toBe(true);
			}
		}
	});

	it('Verif Export is working in Tickets and Tags tabs', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		await expect(healthObj.resetGlobalFilters()).toBe(true);
		expect(await healthObj.clickOnCheckBox(healthTestData.ibmDcProviderFilterText)).toEqual(true);
		expect(await healthObj.applyGlobalFilter()).toEqual(true);
		await expect(healthObj.getListSectionCountFromLabel(healthTestData.resourcesLabelText)).toEqual(true);
		await inventory_page.searchTable(healthTestData.mainframe);
		// If there is no table data , then tableDataBool will return false
		var tableDataBool = await inventory_page.checkNoDataTable()
			if(!tableDataBool){
			await expect(healthObj.isTableOverflowMenuDisplayed()).toBe(true);
			for(var i=0; i<healthTestData.tagsTickets.length; i++){
			await util.clickOnTabButton(healthTestData.tagsTickets[i]);
			await expect(inventory_page.isTableExportDisplayed()).toBe(true);
			await expect(inventory_page.clickOnExport(1, "JSON")).toBe(true);
			await expect(inventory_page.clickOnExport(0, "CSV")).toBe(true);
			}
		}
	});


	//To verify user able to click on CommandCenter and verify to navigate to Applications and Resources tab and tab labels
	it('Verify to click on CommandCenter and verify to navigate to Applications and Resources tab and tab labels', async function(){
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		healthObj.clickonCommandCenter();
		expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
		await util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		
	});

	//To verify application view and view details,resource view and view details loaded on navigating to carbon health pages
	it('Verify to click on CommandCenter and verify to navigate to Applications and Resources tab and tab labels', async function(){
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		await expect(inventory_page.isViewDetailsButtonDisplayed(healthTestData.zeroIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);

		util.clickOnTabButton(healthTestData.resourcesButtonName);
		await expect(inventory_page.isViewDetailsButtonDisplayed(healthTestData.zeroIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.resourceViewLink);
		
	});
	
	it('Verify Application List view headers, sort functionality, pagination and view details', async function(){
		util.clickOnTabButton(healthTestData.applicationsButtonName);
		var headers = await healthObj.getListViewHeaders();
		expect(headers).toEqual(healthTestData.applicationTableHeaders);
		expect(inventory_page.isTableSearchBarDisplayed()).toBe(true);
		inventory_page.clickOnTableSort(3);
		expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTableItemsPerPageCss, "Items Per Page", 0)).toBeTruthy()
		expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTablePageNumberCss, "Pagination", 0)).toBeTruthy()
		inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(healthTestData.zeroIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
		
	});

	it('Verify the application breakdown selection,sort and back to application list via breadcrumb', async function(){
        healthObj.clickOnFirstAppResBreakdownFilter();
		inventory_page.searchTable(healthTestData.sampleSearchText);
		inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(healthTestData.zeroIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
	});

	it('Verify the resource breakdown selection,sort and back to resource list via breadcrumb', async function(){
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		healthObj.clickOnFirstResBreakdownFilter();
		inventory_page.searchTable(healthTestData.sampleSearchText);
		inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(healthTestData.zeroIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(healthTestData.OverviewTitle);
		healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.applicationViewLink);
	});


	if (browser.params.dataValiadtion) {
		it("Applications tab: Verify Application Breakdown Section 'By Provider' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Application Breakdown section By Provider
			 */
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var appBreakdownData = healthAppData[healthTestData.appBreakdownJsonKey];
			var awsAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.awsJsonKey);
			var azureAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.azureJsonKey);
			var ibmCloudAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmCloudJsonKey);
			var ibmDCAppCountForProviderFilter = util.getDataFromElasticViewJSON(appBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmDcJsonKey);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCAppCountForProviderFilter[healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDcProviderFilterText));
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCAppCountForProviderFilter[healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDcProviderFilterText));
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCAppCountForProviderFilter[healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDcProviderFilterText));
		});
	}

	if (browser.params.dataValiadtion) {
		it("Applications tab: Verify Application Breakdown Section 'By Environment' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Application Breakdown section By Environment
			 */
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var appCountForEnvFilter = util.getDataFromElasticViewJSON(healthAppData[healthTestData.appBreakdownJsonKey], healthTestData.environmentFilterJsonKey);
			var envKeyList = Object.keys(appCountForEnvFilter);
			var envValueList = Object.values(appCountForEnvFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Applications tab: Verify Application Breakdown Section 'By Business Unit' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Application Breakdown section By Business Unit
			 */
			util.clickOnTabButton(healthTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var appCountForBusinessUnitFilter = util.getDataFromElasticViewJSON(healthAppData[healthTestData.appBreakdownJsonKey], healthTestData.businessUnitFilterJsonKey);
			var businessUnitKeyList = Object.keys(appCountForBusinessUnitFilter);
			var businessUnitValueList = Object.values(appCountForBusinessUnitFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<businessUnitKeyList.length; i++){
				await expect(businessUnitValueList[i][healthTestData.criticalAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(businessUnitKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<businessUnitKeyList.length; i++){
				await expect(businessUnitValueList[i][healthTestData.warningAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(businessUnitKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<businessUnitKeyList.length; i++){
				await expect(businessUnitValueList[i][healthTestData.healthyAppJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(businessUnitKeyList[i])));
			}
		});
	};

	it('Verify if all elements within Resources tab are loaded or not', function(){
		util.clickOnTabButton(healthTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.topInsightsLabelText)).toBe(true);
		expect(healthObj.getHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
		expect(healthObj.getHealthBreakdownSectionLabelText()).toEqual(healthTestData.resourceBreakdownLabelText);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMaxCPUUtilizationLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMostIncidentsLabelText)).toEqual(true);
		expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithLeastAvailabilityLabelText)).toEqual(true);
		expect(healthObj.isTitleTextFromSectionPresent(healthTestData.resourceListLabelText)).toBe(true);
		expect(healthObj.getResourcesCountFromLabel()).toEqual(healthObj.getSelectedTypeCountFromDonutChart());
		expect(inventory_page.checkNoDataTable()).toBe(false);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resourceTotalResources)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resouceCriticalText)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resouceWarningText)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resouceHealthyText)).toEqual(true);
		expect(healthObj.verifyResourceSummarySectionLabelText(healthTestData.resouceDeletedText)).toEqual(true);
	});

	if (browser.params.dataValiadtion) {
		it("Resources tab: Verify Resources Breakdown Section 'By Provider' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Resources Breakdown section By Provider
			 */
			util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var resBreakdownData = healthResData[healthTestData.resBreakdownJsonKey];
			var awsResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.awsJsonKey);
			var azureResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.azureJsonKey);
			var ibmCloudResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmCloudJsonKey);
			var ibmDCResCountForProviderFilter = util.getDataFromElasticViewJSON(resBreakdownData[healthTestData.providerFilterJsonKey], healthTestData.ibmDcJsonKey);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCResCountForProviderFilter[healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDcProviderFilterText));
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCResCountForProviderFilter[healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDcProviderFilterText));
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			expect(awsResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.awsProviderFilterText));
			expect(azureResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.azureProviderFilterText));
			expect(ibmCloudResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmCloudProviderFilterText));
			expect(ibmDCResCountForProviderFilter[healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(healthTestData.ibmDcProviderFilterText));
		});
	}

	if (browser.params.dataValiadtion) {
		it("Resources tab: Verify Resources Breakdown Section 'By Environment' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Resources Breakdown section By Environment
			 */
			util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var resCountForEnvFilter = util.getDataFromElasticViewJSON(healthResData[healthTestData.resBreakdownJsonKey], healthTestData.environmentFilterJsonKey);
			var envKeyList = Object.keys(resCountForEnvFilter);
			var envValueList = Object.values(resCountForEnvFilter);
			logger.info(envKeyList);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<envKeyList.length; i++){
				await expect(envValueList[i][healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(envKeyList[i])));
			}
		});
	}

	if (browser.params.dataValiadtion) {
		it("Resources tab: Verify Resources Breakdown Section 'By Business Unit' data with JSON data", async function(){
			logger.info("------Data Validation------");
			/**
			 * Data validation for Resources Breakdown section By Business Unit
			 */
			util.clickOnTabButton(healthTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			var resCountForBusinessUnitFilter = util.getDataFromElasticViewJSON(healthResData[healthTestData.resBreakdownJsonKey], healthTestData.businessUnitFilterJsonKey);
			var businessUnitKeyList = Object.keys(resCountForBusinessUnitFilter);
			var businessUnitValueList = Object.values(resCountForBusinessUnitFilter);
			// For critical alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.criticalAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<businessUnitKeyList.length; i++){
				await expect(businessUnitValueList[i][healthTestData.criticalResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(businessUnitKeyList[i])));
			}
			// For warning alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.warningAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<businessUnitKeyList.length; i++){
				await expect(businessUnitValueList[i][healthTestData.warningResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(businessUnitKeyList[i])));
			}
			// For healthy alerts
			healthObj.selectAlertTypeFromDropdown(dashboardTestData.healthyAlertName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			for(var i=0; i<businessUnitKeyList.length; i++){
				await expect(businessUnitValueList[i][healthTestData.healthyResJsonKey]).toEqual(await healthObj.getAppResCountFromBreakdownSection(JSON.stringify(businessUnitKeyList[i])));
			}
		});
	};

	it('Verify Critical servers count from Critical application details', async function(){
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		// Verify critical row count on alerts card should be less than equal to critical alerts on health card
		expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
		var criticalAppDetails = await dashboardObj.getFirstCriticalAlertDetailsFromAlertsCard();
		if(criticalAppDetails != false){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
			expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
			await healthObj.clickOnApplicationViewDetailsButton(criticalAppDetails[0]);
			var criticalServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.criticalAlertName);
			// Compare CI impacted count on Dashboard with affected resource count on Health
			expect(criticalAppDetails[1]).toEqual(criticalServerCount);
		}
	});

	// Disabled because of Protractor limitation [Not able to automate donut chart]

	// it('Verify Warning servers count from Warning application details', async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppDetails = await dashboardObj.getFirstWarningAlertDetailsFromAlertsCard();
	// 	if(warningAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		await healthObj.clickOnApplicationViewDetailsButton(warningAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var warningServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.warningAlertName);
	// 		// Compare CI impacted count on Dashboard with affected resource count on Health
	// 		expect(warningAppDetails[1]).toEqual(warningServerCount);
	// 	}
	// });

	it('Verify if Resource details page for Critical Resource is loaded or not', async function(){
		launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
		launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
		launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
		dashboardObj.open();
		// Verify critical row count on alerts card should be less than equal to critical alerts on health card
		expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
		var criticalAppDetails = await dashboardObj.getFirstCriticalAlertDetailsFromAlertsCard();
		if(criticalAppDetails != false){
			await dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
			expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
			await healthObj.clickOnApplicationViewDetailsButton(criticalAppDetails[0]);
			// Verify the Application name text for App details page header
			expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(criticalAppDetails[0]);
			// Verify Associated Resources table label text
			expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
			// Verify count from Associated Resources table label with row count in the table
			expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
			await healthAndInventoryUtil.clickOnBreadcrumbLink(healthTestData.healthBreadcrumbLabel);
			expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
			await healthObj.clickOnApplicationViewDetailsButton(criticalAppDetails[0]);
			// Verify Resource name from the app details page with Hostname field value on resource details page
			var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.criticalAlertName);
			expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
			// Verify if Tickets/Performance/Tags links are displayed or not in table
			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.performanceLinkText)).toBe(true);
			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.tagsLinkText)).toBe(true);
			await healthObj.clickOnResourceDetailsTableSectionLink(healthTestData.tagsLinkText);
			// Verify Associated Application name
			expect(healthObj.getAssociatedAppsTableLabelText(1)).toEqual(criticalAppDetails[0]);
			await healthObj.clickOnResourceDetailsTableSectionLink(healthTestData.ticketsLinkText);
			// Verify if critical event is present or not
			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsHealthColumnName, healthTestData.criticalAlertName);
			expect(resDetails).toEqual(true);
		}
	});

	


	// Disabled because of Protractor limitation [Not able to automate donut chart]

	// it('Verify if Resource details page for Warning Resource is loaded or not', async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppDetails = await dashboardObj.getFirstWarningAlertDetailsFromAlertsCard();
	// 	if(warningAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await healthObj.clickOnApplicationViewDetailsButton(warningAppDetails[0]);
	// 		// Verify the Application name text for App details page header
	// 		expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(warningAppDetails[0]);
	// 		// Verify Associated Resources table label text
	// 		expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
	// 		// Verify count from Associated Resources table label with row count in the table
	// 		expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		healthObj.clickOnNavigationButtonLinks(dashboardTestData.health);
	// 		healthObj.open();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await healthObj.clickOnApplicationViewDetailsButton(warningAppDetails[0]);
	// 		// Verify Resource name from the app details page with Hostname field value on resource details page
	// 		var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
	// 		// Verify if Events and Tickets links are displayed or not in Alerts table
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 		// Verify Associated Applications table label text
	// 		expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 		// Verify count from Associated Applications table label with row count in the table
	// 		expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		// Verify if warning event is present or not
	// 		var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.warningAlertName);
	// 		expect(resDetails).toEqual(true);
	// 	}
	// });

	// Disabled because Carbonization is still in progress for Command centre UI

	// it("Verify command center view from Application tab is loaded or not", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(healthTestData.commandCenterLabel);
	// 	expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 	expect(healthObj.getCommandCenterHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.leastHealthyAppLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.mostHealthyAppLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appsWithMostIncidentsLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.appWithMostHighPriorityIncidentsLabelText)).toEqual(true);
	// 	expect(healthObj.getCommandCenterAppsResSectionLabelText()).toEqual(healthTestData.applicationsLabelText);
	// 	var appCountFromLabel = await healthObj.getCountFromCommandCenterAppsResSectionLabelText();
	// 	if(appCountFromLabel > 0){
	// 		expect(appCountFromLabel).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 	}
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.environmentDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.providerDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.businessUnitDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.categoryDropdownValue);
	// 	healthObj.clickOnCommandCenterCompressButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
	// });

	// it("Verify command center view from Resources tab is loaded or not", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(healthTestData.commandCenterLabel);
	// 	expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 	expect(healthObj.getCommandCenterHealthStatusSectionLabelText()).toEqual(healthTestData.healthStatusLabelText);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMaxCPUUtilizationLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithMostIncidentsLabelText)).toEqual(true);
	// 	expect(healthObj.verifyTopInsightsSubSectionLabelText(healthTestData.resourcesWithLeastHealthLabelText)).toEqual(true);
	// 	expect(healthObj.getCommandCenterAppsResSectionLabelText()).toEqual(healthTestData.resourcesLabelText);
	// 	var resCountFromLabel = await healthObj.getCountFromCommandCenterAppsResSectionLabelText();
	// 	if(resCountFromLabel > 0){
	// 		expect(resCountFromLabel).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 	}
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.environmentDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.providerDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.businessUnitDropdownValue);
	// 	expect(await healthObj.getListOfOptionsFromViewByDropdown()).toContain(healthTestData.categoryDropdownValue);
	// 	healthObj.clickOnCommandCenterCompressButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(healthObj.getHealthHeaderTitleText()).toEqual(healthTestData.headerTitle);
	// });

	// it("Verify 'Critical' Applications count from Health page with Command center view Applications count", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// For Critical alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var appCountFromDountChart = 0;
	// 	}
	// 	else{
	// 		// Get app count from Health status donut chart
	// 		var appCountFromDountChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(appCountFromDountChart != 0){
	// 		// Get filter name and app count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract app count from String
	// 			var appCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var appCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			var appCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			// Validate app count from breakdown section with app count in command center table section label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[0]);
	// 			// Validate app count from breakdown section with app count in command center table alert label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[1]);
	// 			// Validate app cards count in a section with app count table section label
	// 			expect(appCardCountFromTable).toEqual(appCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Warning' Applications count from Health page with Command center view Applications count", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// For Warning alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var appCountFromDountChart = 0;
	// 	}
	// 	else{
	// 		// Get app count from Health status donut chart
	// 		var appCountFromDountChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(appCountFromDountChart != 0){
	// 		// Get filter name and app count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.warningAlertName));
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract app count from String
	// 			var appCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var appCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.warningAlertName);
	// 			var appCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.warningAlertName);
	// 			// Validate app count from breakdown section with app count in command center table section label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[0]);
	// 			// Validate app count from breakdown section with app count in command center table alert label
	// 			expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[1]);
	// 			// Validate app cards count in a section with app count table section label
	// 			expect(appCardCountFromTable).toEqual(appCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Healthy' Applications count from Health page with Command center view Applications count", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// For Healthy alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var appCountFromDountChart = 0;
	// 	}
	// 	else{
	// 		// Get app count from Health status donut chart
	// 		var appCountFromDountChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(appCountFromDountChart != 0){
	// 		// Get filter name and app count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		await healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.healthyAlertName));
	// 		expect(appCountFromDountChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract app count from String
	// 			var appCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var appCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			var appCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			// Validate app count from breakdown section with app count in command center table section label
	// 			await expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[0]);
	// 			// Validate app count from breakdown section with app count in command center table alert label
	// 			await expect(appCountFromBreakdownSection).toEqual(appCountFromCommandCenter[1]);
	// 			// Validate app cards count in a section with app count table section label
	// 			await expect(appCardCountFromTable).toEqual(appCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Critical' Resources count from Health page with Command center view Resources count", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// For Critical alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var resCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get resources count from Health status donut chart
	// 		var resCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(resCountFromDonutChart != 0){
	// 		// Get filter name and resources count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.criticalAlertName));
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract resource count from String
	// 			var resCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var resCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			var resCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.criticalAlertName);
	// 			// Validate resources count from breakdown section with resources count in command center table section label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[0]);
	// 			// Validate resources count from breakdown section with resources count in command center table alert label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[1]);
	// 			// Validate resources cards count in a section with resources count table section label
	// 			expect(resCardCountFromTable).toEqual(resCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Warning' Resources count from Health page with Command center view Resources count", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// For Warning alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var resCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get resources count from Health status donut chart
	// 		var resCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(resCountFromDonutChart != 0){
	// 		// Get filter name and resources count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.warningAlertName));
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i =0; i<sectionKeysList.length; i++){
	// 			// Extract resource count from String
	// 			var resCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var resCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.warningAlertName);
	// 			var resCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.warningAlertName);
	// 			// Validate resources count from breakdown section with resources count in command center table section label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[0]);
	// 			// Validate resources count from breakdown section with resources count in command center table alert label
	// 			expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[1]);
	// 			// Validate resources cards count in a section with resources count table section label
	// 			expect(resCardCountFromTable).toEqual(resCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify 'Healthy' Resources count from Health page with Command center view Resources count", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// For Healthy alerts
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var resCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get resources count from Health status donut chart
	// 		var resCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	if(resCountFromDonutChart != 0){
	// 		// Get filter name and resources count in list from breakdown section
	// 		var sectionKeysList = await healthObj.getListOfBreakdownSectionWithCount();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterBarChartXaxisLabels(healthTestData.healthyAlertName));
	// 		expect(resCountFromDonutChart).toEqual(await healthObj.getCountFromCommandCenterAppsResSectionLabelText());
	// 		for(var i = 0; i < sectionKeysList.length; i++){
	// 			// Extract resource count from String
	// 			var resCountFromBreakdownSection = util.stringToInteger(sectionKeysList[i].split("(")[1].split(")")[0]);
	// 			// Get list of count from both subheaders [Section Label count, Alert Label count] in apps/resources table
	// 			var resCountFromCommandCenter = await healthObj.getAppResCountFromCommandCenterTableSubHeaderLabel(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			// Commenting this validation as taking too much time to calculate all cards
	// 			// var resCardCountFromTable = await healthObj.getAppResCardsCountFromTableSection(sectionKeysList[i], healthTestData.healthyAlertName);
	// 			// Validate resources count from breakdown section with resources count in command center table section label
	// 			await expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[0]);
	// 			// Validate resources count from breakdown section with resources count in command center table alert label
	// 			await expect(resCountFromBreakdownSection).toEqual(resCountFromCommandCenter[1]);
	// 			// Validate resources cards count in a section with resources count table section label
	// 			// expect(resCardCountFromTable).toEqual(resCountFromCommandCenter[1]);
	// 		}
	// 	}
	// });

	// it("Verify Progess bar chart opacity and 'Applications' cards in table", async function(){
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationsButtonName)).toEqual(true);
	// 	// Get Healthy count
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var healthyAppCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Healthy app count from Health status donut chart
	// 		var healthyAppCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Warning count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var warningAppCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Warning app count from Health status donut chart
	// 		var warningAppCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Critical count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var criticalAppCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Critical app count from Health status donut chart
	// 		var criticalAppCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.applicationViewTabName)).toEqual(true);
	// 	// For Critical alerts
	// 	if(criticalAppCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.criticalAlertName));
	// 	}
	// 	// For Warning alerts
	// 	if(warningAppCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.warningAlertName));
	// 	}
	// 	// For Healthy alerts
	// 	if(healthyAppCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(true);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.healthyAlertName));
	// 	}
	// });

	// it("Verify Progess bar chart opacity and 'Resources' cards in table", async function(){
	// 	util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourcesButtonName)).toEqual(true);
	// 	// Get Healthy count
	// 	var status = await healthObj.selectAlertTypeFromDropdown(healthTestData.healthyAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var healthyResCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Healthy resources count from Health status donut chart
	// 		var healthyResCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Warning count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var warningResCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Warning resources count from Health status donut chart
	// 		var warningResCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	// Get Critical count
	// 	status = await healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	if(status == 0){
	// 		var criticalResCountFromDonutChart = 0;
	// 	}
	// 	else{
	// 		// Get Critical resources count from Health status donut chart
	// 		var criticalResCountFromDonutChart = await healthObj.getCountFromDonutChart();
	// 	}
	// 	healthObj.clickOnCommandCenterExpandButton();
	// 	await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 	expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 	// For Critical alerts
	// 	if(criticalResCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.criticalAlertName));
	// 	}
	// 	// For Warning alerts
	// 	if(warningResCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(true);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(false);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.warningAlertName));
	// 	}
	// 	// For Healthy alerts
	// 	if(healthyResCountFromDonutChart != 0){
	// 		await healthObj.selectSpecificProgressBar(healthTestData.healthyAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.warningAlertName);
	// 		await healthObj.deselectSpecificProgressBar(healthTestData.criticalAlertName);
	// 		// Verify progress bar opacity for each alert
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.criticalAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.warningAlertName)).toBe(false);
	// 		expect(await healthObj.checkSelectionOfAlertsProgressBar(healthTestData.healthyAlertName)).toBe(true);
	// 		expect(await healthObj.getCountFromCommandCenterAppsResSectionLabelText()).toEqual(await healthObj.getTooltipCountForProgressBarFromCommandCenterView(healthTestData.healthyAlertName));
	// 	}
	// });
	
	// it("Verify 'Critical' servers count from Critical application details and Verify mapped resource to it, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify critical row count on alerts card should be less than equal to critical alerts on health card
	// 	expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
	// 	var criticalAppDetails = await dashboardObj.getFirstCriticalAlertDetailsFromAlertsCard();
	// 	if(criticalAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(criticalAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(criticalAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		// Verify the Application name text for App details page header
	// 		expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(criticalAppDetails[0]);
	// 		// Verify application name from breadcrumb navigation
	// 		expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(criticalAppDetails[0]);
	// 		// Verify Associated Resources table label text
	// 		expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
	// 		// Verify count from Associated Resources table label with row count in the table
	// 		expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		healthObj.clickOnNavigationButtonLinks(dashboardTestData.health);
	// 		healthObj.open();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(criticalAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(criticalAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var criticalServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.criticalAlertName);
	// 		// Compare CI impacted count on Dashboard with affected resource count on Health
	// 		expect(criticalAppDetails[1]).toEqual(criticalServerCount);
	// 		healthObj.searchResourcesFromAssociatedResourcesTable(healthTestData.criticalAlertName);
	// 		expect(await healthObj.isNoDataMessageTextPresentInTable()).toBe(false);
	// 		var isNoDataAvailable = await healthObj.isNoDataMessageTextPresentInTable();
	// 		if(isNoDataAvailable != true){
	// 			// Verify Resource name from the app details page with Hostname field value on resource details page
	// 			var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.criticalAlertName);
	// 			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 			// Validate resource name from application details page with hostname field value from overview section
	// 			expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
	// 			// Verify if Events and Tickets links are displayed or not in Alerts table
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 			// Verify Associated Applications table label text
	// 			expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 			// Verify count from Associated Applications table label with row count in the table
	// 			expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 			// Verify the application mapped to resource in resource details page
	// 			expect(healthObj.isAppPresentInAssociatedApplicationsTable(criticalAppDetails[0])).toBe(true);
	// 			// Verify if critical event is present or not
	// 			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.criticalAlertName);
	// 			expect(resDetails).toEqual(true);
	// 		}
	// 	}
	// });

	// it("Verify 'Warning' servers count from Warning application details and Verify mapped resource to it, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppDetails = await dashboardObj.getFirstWarningAlertDetailsFromAlertsCard();
	// 	if(warningAppDetails != false){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(warningAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(warningAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		// Verify the Application name text for App details page header
	// 		expect(healthObj.getAppNameFromAppDetailsPageHeaderText()).toEqual(warningAppDetails[0]);
	// 		// Verify application name from breadcrumb navigation
	// 		expect(healthObj.getCurrentPageBreadcrumbNameText()).toEqual(warningAppDetails[0]);
	// 		// Verify Associated Resources table label text
	// 		expect(healthObj.getAssociatedResourcesTableLabelText()).toEqual(healthTestData.associatedResourcesTableText);
	// 		// Verify count from Associated Resources table label with row count in the table
	// 		expect(healthObj.getResourceCountFromAssociatedResourcesTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		healthObj.clickOnNavigationButtonLinks(dashboardTestData.health);
	// 		healthObj.open();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(await healthObj.isDisplayedAppResourceCard(warningAppDetails[0])).toBe(true);
	// 		await healthObj.clickOnAppResourceCard(warningAppDetails[0]);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var warningServerCount = await healthObj.getAffectedServerCountFromAssociatedResourcesTable(healthTestData.warningAlertName);
	// 		// Compare CI impacted count on Dashboard with affected resource count on Health
	// 		expect(warningAppDetails[1]).toEqual(warningServerCount);
	// 		healthObj.searchResourcesFromAssociatedResourcesTable(healthTestData.warningAlertName);
	// 		expect(await healthObj.isNoDataMessageTextPresentInTable()).toBe(false);
	// 		var isNoDataAvailable = await healthObj.isNoDataMessageTextPresentInTable();
	// 		if(isNoDataAvailable != true){
	// 			// Verify Resource name from the app details page with Hostname field value on resource details page
	// 			var resourceName = await healthObj.clickOnFirstAffectedResourceViewDetailsButton(healthTestData.warningAlertName);
	// 			await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 			// Validate resource name from application details page with hostname field value from overview section
	// 			expect(healthObj.getResourceNameFromResourceDetailsPageText(healthTestData.overviewHostnameLabelText)).toEqual(resourceName);
	// 			// Verify if Events and Tickets links are displayed or not in Alerts table
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 			// Verify Associated Applications table label text
	// 			expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 			// Verify count from Associated Applications table label with row count in the table
	// 			expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 			// Verify the application mapped to resource in resource details page
	// 			expect(await healthObj.isAppPresentInAssociatedApplicationsTable(warningAppDetails[0])).toBe(true);
	// 			// Verify if warning event is present or not
	// 			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.warningAlertName);
	// 			expect(resDetails).toEqual(true);
	// 		}
	// 	}
	// });

	// it("Verify Resource details page for 'Critical' Resource is loaded, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify critical row count on alerts card should be less than equal to critical alerts on health card
	// 	expect(dashboardObj.getCriticalAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getCriticalAlertsCountFromHealthCard());
	// 	var criticalAppCount = await dashboardObj.getCriticalAlertsCountFromHealthCard();
	// 	if(criticalAppCount != 0){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.criticalAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		healthObj.clickOnFirstAppResourceCard();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		var resourceName = await healthObj.getHealthHeaderTitleText();
	// 		if(resourceName.includes(healthTestData.ibmProvider)){
	// 			// Verify if Events and Tickets links are displayed or not in Alerts table
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 			// Verify Associated Applications table label text
	// 			expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 			// Verify count from Associated Applications table label with row count in the table
	// 			expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 			// Verify if critical event is present or not
	// 			var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.criticalAlertName);
	// 			expect(resDetails).toEqual(true);
	// 		}
	// 		else{
	// 			// Verify if Summary and Open Tickets links are displayed or not
	// 			expect(healthObj.isDisplayedSummaryAndOpenTicketsSectionLinks(healthTestData.summaryLinkText)).toBe(true);
	// 			expect(healthObj.isDisplayedSummaryAndOpenTicketsSectionLinks(healthTestData.openTicketsLinkText)).toBe(true);
	// 		}
	// 	}
	// });

	// it("Verify Resource details page for 'Warning' Resource is loaded, when navigate from command center view", async function(){
	// 	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	// 	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.aIOpsIntelligentITOperationsBtn);
	// 	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.dashboardCard);
	// 	dashboardObj.open();
	// 	// Verify warning row count on alerts card should be less than equal to warning alerts on health card
	// 	expect(dashboardObj.getWarningAlertsRowCount()).toBeLessThanOrEqual(dashboardObj.getWarningAlertsCountFromHealthCard());
	// 	var warningAppCount = await dashboardObj.getWarningAlertsCountFromHealthCard();
	// 	if(warningAppCount != 0){
	// 		dashboardObj.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.health);
	// 		healthObj.open();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		util.clickOnTabButton(healthTestData.resourcesButtonName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.selectAlertTypeFromDropdown(healthTestData.warningAlertName);
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		healthObj.clickOnCommandCenterExpandButton();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		expect(util.isSelectedTabButton(healthTestData.resourceViewTabName)).toEqual(true);
	// 		healthObj.clickOnFirstAppResourceCard();
	// 		await util.waitOnlyForInvisibilityOfKibanaDataLoader();
	// 		// Verify if Events and Tickets links are displayed or not in Alerts table
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.eventsLinkText)).toBe(true);
	// 		expect(healthObj.isDisplayedResourceDetailsTableSectionLinks(healthTestData.ticketsLinkText)).toBe(true);
	// 		// Verify Associated Applications table label text
	// 		expect(healthObj.getAssociatedAppsTableLabelText()).toEqual(healthTestData.associatedApplicationsTableText);
	// 		// Verify count from Associated Applications table label with row count in the table
	// 		expect(healthObj.getAppsCountFromAssociatedAppsTableLabel()).toEqual(healthObj.getRowCountFromAssociatedResourcesAppsTable());
	// 		// Verify if warning event is present or not
	// 		var resDetails = await healthObj.verifyCellValueFromTicketsTable(healthTestData.eventsSeverityColumnName, healthTestData.warningAlertName);
	// 		expect(resDetails).toEqual(true);
	// 	}
	// });

	afterAll(async function() {
		await launchpadObj.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});