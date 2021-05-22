/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";


var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	InventoryPage = require('../pageObjects/inventory.pageObject.js'),
	appUrls = require('../../testData/appUrls.json'),
	dashboardTestData = require('../../testData/cards/dashboardTestData.json'),
	dashboard = require('../pageObjects/dashboard.pageObject.js'),
	launchpad = require('../pageObjects/launchpad.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	inventoryTestData = require('../../testData/cards/inventoryTestData.json'),
	frames = require('../../testData/frames.json'),
	elasticViewData = require('../../expected_values.json'),
	healthInventoryUtil = require('../../helpers/healthAndInventoryUtil.js'),
	util = require('../../helpers/util.js'),
	esQueriesInventory=require('../../elasticSearchTool/esQuery_InventoryPayload.js'),
	tenantId = browser.params.tenantId,
	isEnabledESValidation = browser.params.esValidation;
	
  describe('Inventory - functionality ', function () {
	var inventory_page, dashboard_page, launchpad_page;


	beforeAll(function () {
		inventory_page = new InventoryPage();
		dashboard_page = new dashboard();
		launchpad_page = new launchpad();
		browser.driver.manage().window().maximize();
	});

	beforeEach(function () {
		launchpad_page.open();
		expect(launchpad_page.getWelcomeMessageTxt()).toEqual(launchpadTestData.welcome);
		inventory_page.open();
	});

	// Disabled as UI is changed and now exact cannot be get from Resource Summary section
	// it("Verify inventory total asset count from Dasboard and Inventory's Kibana Report", async function () {
	// 	await launchpad_page.open();
	// 	await launchpad_page.clickOnIntelligentItOprLink();
    //  await launchpad_page.clickOnDashboardTile(launchpadTestData.learnPage_aiopsDashboardTile);
	// 	await dashboard_page.open();
	// 	expect(await util.getCurrentURL()).toMatch(appUrls.dashboardPageUrl);
	// 	var ItemCount = await dashboard_page.getItemInventoryCount();
	// 	await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
	// 	expect(await inventory_page.getDataCentersAndMultiCloudTextTotalCount()).toEqual(ItemCount)
	// });

	it("Verify if all elements within Applications tab are loaded and ES response validation with application tab ui values", async function () {
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.topInsightsSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationBreakdownSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationsByRegionSectionLabel)).toBe(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.applicationsWithMostResourcesSubSectionLabel)).toEqual(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel)).toEqual(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel)).toEqual(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationsTableLabel)).toBe(true);
		logger.info("===============================================");
		logger.info("ES Validation flag value: "+ isEnabledESValidation);
		logger.info("===============================================");
		if (isEnabledESValidation) {
			logger.info("==============ES Data Validation===================");
			//Application with most resources
			var uiresponse=await inventory_page.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
			var dbresponse=await esQueriesInventory.application_With_Most_Resources(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(dbresponse,uiresponse)).toBe(true);
			
			//Application with most active resources
			var uiresponse=await inventory_page.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel);
			var dbresponse=await esQueriesInventory.application_With_Most_Active_Resources(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(dbresponse,uiresponse)).toBe(true);
			
			//Application with most EOL resources
			var uiresponse=await inventory_page.getResourcesCountFromTopInsightsSubSectionFrmUiForEsValidation(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel);
			var dbresponse=await esQueriesInventory.application_With_EOL_Resources(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(dbresponse,uiresponse)).toBe(true);
		}
		expect(inventory_page.isAppResTableDisplayed()).toBe(true);
	});

	if (isEnabledESValidation) {
		it("Verify Data center and Multicloud resource count from es response", async function () {	
			logger.info("==============ES Data Validation===================");
			var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
			var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
			await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			// Datacenter resources count from kibana page
			var uiDataCenterResponse = await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(dataCentreList);
			var esDataCenterResponse = await esQueriesInventory.dataCenter_Resources_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(esDataCenterResponse,uiDataCenterResponse)).toBe(true);
			healthInventoryUtil.clickOnClearFilterButton();
			//Multicloud resources count from kibana page
			var uiMultiCloudResponse = await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
			var esMultiCloudResponse = await esQueriesInventory.multiCloud_Resources_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(util.isJsonObjectsEqual(esMultiCloudResponse,uiMultiCloudResponse)).toBe(true);
		});
	}
	
	if (isEnabledESValidation) {
		it("Verify untagged resources application, environment, unmanagged & monitored resources count from es response", async function () {	
			logger.info("==============ES Data Validation===================");
			util.waitForAngular();
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			var uiApplicationCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesApplicationLabel);
			var esApplicationResponse = await esQueriesInventory.untagged_Resources_Application_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(uiApplicationCount).toEqual(esApplicationResponse);
			
			var uiEnvironmentCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesEnvironmentLabel);
			var esEnvironmentResponse = await esQueriesInventory.untagged_Resources_Environment_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(uiEnvironmentCount).toEqual(esEnvironmentResponse);
			
			var uiUnmanagedCount = await inventory_page.getCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel, inventoryTestData.untaggedResourcesUnmanagedLabel);
			var esUnmanagedResponse = await esQueriesInventory.untagged_Resources_Unmanaged_count(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(uiUnmanagedCount).toEqual(esUnmanagedResponse);
			
			var uiMonitoredResourcesCount = await inventory_page.getResourceCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel);
			var esMonitoredResourcesCount = await esQueriesInventory.monitored_Resources_Counts(inventoryTestData.eSInventorySearchIndex,tenantId);
			expect(uiMonitoredResourcesCount.sort()).toEqual(esMonitoredResourcesCount.sort());
		});
	}
	
	if (browser.params.dataValiadtion) {
		it("Verify Applications tab UI data with Elastic view JSON data", async function () {
			logger.info("------Data Validation------");
			var inventoryAppData = elasticViewData.inventory.applications.no_filters.expected_values;
			util.clickOnTabButton(inventoryTestData.applicationsButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			/**
			 * Validation for Top Insights section in Applications tab
			 */
			// Verify resources count under sub-section Applications with Most Resources
			var appsWithMostResourcesCount = util.getDataFromElasticViewJSON(inventoryAppData[inventoryTestData.topInsightsJsonKey], inventoryTestData.applicationsWithMostResourcesJsonKey);
			var resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(appsWithMostResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(appsWithMostResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(appsWithMostResourcesCount).length; i++) {
					expect(Object.values(appsWithMostResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Applications with Most Active Resources
			var appsWithMostActiveResourcesCount = util.getDataFromElasticViewJSON(inventoryAppData[inventoryTestData.topInsightsJsonKey], inventoryTestData.applicationsWithMostActiveResourcesJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostActiveResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(appsWithMostActiveResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(appsWithMostActiveResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(appsWithMostActiveResourcesCount).length; i++) {
					expect(Object.values(appsWithMostActiveResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Applications with Most EOL Resources
			var appsWithMostEolResourcesCount = util.getDataFromElasticViewJSON(inventoryAppData[inventoryTestData.topInsightsJsonKey], inventoryTestData.applicationsWithMostEolResourcesJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.applicationsWithMostEOLResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(appsWithMostEolResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(appsWithMostEolResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(appsWithMostEolResourcesCount).length; i++) {
					expect(Object.values(appsWithMostEolResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
		});
	}

	it("Verify if all elements within Resources tab are loaded or not", function () {
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.topInsightsSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.resourcesBreakdownSectionLabel)).toBe(true);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.resourcesByRegionSectionLabel)).toBe(true);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.untaggedResourcesSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.monitoredResourcesSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.resourceCloudReadinessSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel);
		expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel)).toEqual(true);
		inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.resourcesTableLabel)).toBe(true);
		expect(inventory_page.isAppResTableDisplayed()).toBe(true);
	});

	if (browser.params.dataValiadtion) {
		it("Verify Resources tab UI data with Elastic view JSON data", async function () {
			logger.info("------Data Validation------");
			var inventoryResData = elasticViewData.inventory.resources.no_filters.expected_values;
			util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			util.waitOnlyForInvisibilityOfKibanaDataLoader();
			/**
			 * Validation for Top Insights section in Resources tab
			 */
			// Verify resources count under sub-section Untagged Resources
			var untaggedResourcesCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.untaggedResourcesJsonKey);
			var resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(untaggedResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(untaggedResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(untaggedResourcesCount).length; i++) {
					expect(Object.values(untaggedResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Monitored Resources
			var monitoredResourcesCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.monitoredResourcesJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.monitoredResourcesSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(monitoredResourcesCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(monitoredResourcesCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(monitoredResourcesCount).length; i++) {
					expect(Object.values(monitoredResourcesCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Resource Cloud Readiness
			var resourceCloudReadinessCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.resourceCloudReadinessJsonKey);
			resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCloudReadinessSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(resourceCloudReadinessCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(resourceCloudReadinessCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(resourceCloudReadinessCount).length; i++) {
					expect(Object.values(resourceCloudReadinessCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
			// Verify resources count under sub-section Resource Currency Designator
			var resourceCurrencyDesignatorCount = util.getDataFromElasticViewJSON(inventoryResData[inventoryTestData.topInsightsJsonKey], inventoryTestData.resourceCurrencyDesignatorJsonKey);
			var resourceCountList = await inventory_page.getResourcesCountFromTopInsightsSubSection(inventoryTestData.resourceCurrencyDesignatorSubSectionLabel);
			expect(util.IsDataMissingInJSONOrUI(resourceCurrencyDesignatorCount, resourceCountList)).toBe(true);
			if (util.IsDataMissingInJSONOrUI(resourceCurrencyDesignatorCount, resourceCountList)) {
				for (var i = 0; i < Object.keys(resourceCurrencyDesignatorCount).length; i++) {
					expect(Object.values(resourceCurrencyDesignatorCount)[i]).toEqual(parseInt(resourceCountList[i]));
				}
			}
		});
	}
	
	 it('Verify inventory card data count for Multicloud is displaying properly', async function() { 
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.aiopsConsoleLabel);
		util.switchToFrame();
		dashboard_page.clickOnMiniViewIcon();
		var multicloudInventoryCount = await dashboard_page.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.multiCloud);
		if(multicloudInventoryCount > 0){
			dashboard_page.clickOnLargeViewIcon();
			// Get all legends from inventory card pie chart
			var legendList = await dashboard_page.getAllLegendsFromInventoryCard();
			var filteredList = [];
			// Remove IBM Data center from list
			for(var i=0; i<legendList.length; i++){
				if(legendList[i] != inventoryTestData.IBMDataCenter){
					filteredList.push(legendList[i]);
				}
			}
			await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			// Click on all providers from multi-cloud
			for(var j=0; j<filteredList.length; j++){
				await healthInventoryUtil.clickOnProviderCheckBox(filteredList[j]);
			}
			await healthInventoryUtil.clickOnApplyFilterButton();
			await expect(multicloudInventoryCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
			}
    });
	
	it('Verify inventory card data count for Data center is displaying properly', async function() { 
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.aiopsConsoleLabel);
		util.switchToFrame();
		dashboard_page.clickOnMiniViewIcon();
		var dataCenterInventoryCount = await dashboard_page.getTextFromMiniViewCard(dashboardTestData.inventory, dashboardTestData.dataCenter);
		if(dataCenterInventoryCount > 0){
			dashboard_page.clickOnLargeViewIcon();
			dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
			healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.IBMDataCenter);
			healthInventoryUtil.clickOnApplyFilterButton();
			expect(dataCenterInventoryCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
		}
    });
	
	it('Verify local filter is applying and count is matching on Applications tab', async function() { 
		expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		var appCountBefore = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		inventory_page.clickOnFirstAppResBreakdownFilter();
		var appCountAfter = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(appCountBefore).toBeGreaterThanOrEqual(appCountAfter);
	});
	
	it('Verify local filter is applying and count is matching on Resources tab', async function() { 
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		var resourceCountBefore = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		inventory_page.clickOnFirstAppResBreakdownFilter();
		var resourceCountAfter = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(resourceCountBefore).toBeGreaterThanOrEqual(resourceCountAfter);
	});

	/*it('Verify Inventory Applications resources by region (Geo Map) Zoom & Reset features', function(){
		logger.info("------ Verify Applications resources by region (Geo Map) Zoom & Reset features are loaded ------");
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.isTitleTextFromSectionPresent(inventoryTestData.applicationsResourcesByRegionSectionLabel)).toEqual(true);
		inventory_page.clickOnZoomResetGeoMap(inventory_page.geoMapZoomIn, "Zoom In");
		inventory_page.clickOnZoomResetGeoMap(inventory_page.geoMapZoomIn, "Zoom In");
		inventory_page.clickOnZoomResetGeoMap(inventory_page.geoMapZoomOut, "Zoom Out");
		inventory_page.clickOnZoomResetGeoMap(inventory_page.geoMapZoomIn, "Zoom In");
		inventory_page.clickOnZoomResetGeoMap(inventory_page.geoMapReset, "Reset");

	});*/

	it('Verify Application List view headers, sort functionality, pagination and view details', async function(){
		logger.info("------ Verify Application List view headers, sort functionality, pagination and view details ------");
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		expect(headers).toEqual(inventoryTestData.applicationTableHeaders);
		expect(inventory_page.isTableSearchBarDisplayed()).toBe(true);
		inventory_page.clickOnTableSort(3);
		expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTableItemsPerPageCss, "Items Per Page", 0)).toBeTruthy()
		expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTablePageNumberCss, "Pagination", 0)).toBeTruthy()
		inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
	});


	it('Verify if Applications list table has an export option with CSV & JSON format', function(){
		logger.info("------ Verify Application List view export feature ------");
		util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		expect(inventory_page.isTableExportDisplayed()).toBe(true);
		expect(inventory_page.clickOnExport(1, "JSON")).toBe(true);
		expect(inventory_page.clickOnExport(0, "CSV")).toBe(true);
	});

	it('Verify Resource List view headers, sort functionality, pagination and view details', async function(){
		logger.info("------ Verify Resource List view headers, sort functionality, pagination and view details ------");
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		await expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		expect(headers).toEqual(inventoryTestData.resourceTableHeaders);
		expect(inventory_page.isTableSearchBarDisplayed()).toBe(true);
		inventory_page.clickOnTableSort(3);
		expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTableItemsPerPageCss, "Items Per Page", 0)).toBeTruthy()
		inventory_page.searchTable(inventoryTestData.sampleSearchText);
		expect(inventory_page.clickOnItemsPerPage(inventory_page.applicationResourceTablePageNumberCss, "Pagination", 0)).toBeTruthy()
		inventory_page.clickOnTableSort(3);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);

	});
   
	it("Verify count of Data centre categories in DC summary is matching with resource list view", async function () {	
		logger.info("=========DC count validation with resource list view===================");
		var count =[];
	    var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		// Apply Datacenter filter in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(dataCentreList);
		var DCResrcSummaryObj = await inventory_page.getDCResrcSummaryTextAndCount();
		await expect(DCResrcSummaryObj.subcategorytext).toEqual(inventoryTestData.dCResourceSummary);
		//Get the resource list view count corresponding to DC Summary
		count = await inventory_page.getListViewCountWrtDCSummary(DCResrcSummaryObj);
		//Verify the counts in list view against DC Summary
		await expect(DCResrcSummaryObj.subcategorycount).toEqual(count);
	});

    it("Verify count of MC categories in MC summary is matching with resource list view", async function () {	
		logger.info("=========MC count validation with resource list view===================");
		var count =[];
	    var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		// Apply Multicloud filter in global filters
		await inventory_page.getDataCenterAndMulticloudResourcesCountForEs(multiCloudList);
		var MCResrcSummaryObj = await inventory_page.getMCResrcSummaryTextAndCount();
		await expect(MCResrcSummaryObj.subcategorytext).toEqual(inventoryTestData.mCResourceSummary);
	    //Get the resource list view count corresponding to MC Summary
		count = await inventory_page.getListViewCountWrtMCSummary(MCResrcSummaryObj);
		//Verify the counts in list view against MC Summary
		await expect(MCResrcSummaryObj.subcategorycount).toEqual(count);

	});


	it('Verify if all elements within Global filter loaded or not in Inventory', async function(){
		logger.info("------ Verify Inventory Global filter and all elements within ------");
		//healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.aiopsConsoleLabel);
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		let gfilter = await inventory_page.isGlobalFilterDisplayed();
		let filterCategory = await inventory_page.isPresentglobalFilterCategories(inventoryTestData.globalFilterCategories);
		if(gfilter && filterCategory){
			await expect(inventory_page.isPresentglobalFilterProviderSubCategories(inventoryTestData.globalFilterProviderSubCategories)).toBe(true);
			await expect(inventory_page.isPresentglobalFilterProviders()).toBe(true);
			await healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.awsProvider);
			await healthInventoryUtil.clickOnApplyFilterButton();
			await healthInventoryUtil.clickOnClearFilterButton();
		}
		else{
			expect(filterCategory).toEqual(false);
		}
	});

	it('Verify interaction between resource breakdown and list view for Resource Category dropdown', async function(){
		logger.info("------ Verify interaction between resource breakdown and list view for Resource Category dropdown ------");
		//Resource Category Dropdown
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownResourceCategory);
        //Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(inventoryTestData.resourceCategories,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify interaction between resource breakdown and list view for Provider dropdown', async function(){
		logger.info("------ Verify interaction between resource breakdown and list view for Provider dropdown ------");
		//Get MC Providers list from Dashboard
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		//Compare list view count with resource breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(multiCloudList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);

		//Get DC Providers list from Dashboard
		var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		//Compare list view count with resource breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(dataCentreList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify interaction between resource breakdown and list view for Business Unit dropdown', async function(){
		logger.info("------ Verify interaction between resource breakdown and list view for Business Unit dropdown ------");
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Get list of business units from global filter
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(businessUnitsList,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
		
	});

	it('Verify interaction between resource breakdown and list view for Environment dropdown', async function(){
        logger.info("------ Verify interaction between resource breakdown and list view for Environment dropdown ------");
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownEnvironment);
		//Get environment values from Resource Breakdown
		var BoxContent = await inventory_page.getApplicationResourceBreakdownGraphText();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(BoxContent,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});


	it('Verify whether resource list view is reverted to match  the deselection or selection of different View By', async function(){
        logger.info("------ Verify whether resource list view is reverted to match  the deselection or selection of different View By------");
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		await inventory_page.getListViewHeaders();
		var listViewCountBeforeClick = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
	   //Select Resource Category Dropdown
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownResourceCategory);
		//Click on network resource category
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.networkName);
		await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Select a diffrent view by - Business Unit
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		var listViewCountDiffViewBy = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		expect(listViewCountBeforeClick).toEqual(listViewCountDiffViewBy);
	    //Select a Business Unit 
	    var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.firstIndex]);
	    //await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
	    //Deselect the same attribute
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.firstIndex]);
	    //List view count after deselection
		var listViewCountAfterDeselection = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
	    await expect(listViewCountDiffViewBy).toEqual(listViewCountAfterDeselection);

	});
	
	it('Verify whether Resource by Region widget is updated when resource breakdown segment is clicked', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Get list of business units from global filter
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		//Get resourcebyregion count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownAndRegion(businessUnitsList);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.resourcesByRegionCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify whether resource by region is reverted to match  the deselection or selection of different View By', async function(){
		logger.info("------ Verify whether resource list view is reverted to match  the deselection or selection of different View By------");
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		//Select Resource Category Dropdown
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownResourceCategory);
		var resourceByRegionBeforeClickRC = await inventory_page.getResourceByRegionCount();
		//Click on network resource category
		await inventory_page.clickAndGetTextFromSingleBreakdownBox(inventoryTestData.computeName);
		//Select a diffrent view by - Business Unit
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		var resourceByRegionDiffViewBy = await inventory_page.getResourceByRegionCount();
		expect(resourceByRegionBeforeClickRC).toEqual(resourceByRegionDiffViewBy);
	    //Select a Business Unit 
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		var resourceByRegionBeforeClickBU = await inventory_page.getResourceByRegionCount();
	    inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.firstIndex]);
	    //Deselect the same attribute
	    await inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.firstIndex]);
	    //List view count after deselection
	    var resourceByRegionAfterDeselection = await inventory_page.getResourceByRegionCount();;
	    await expect(resourceByRegionBeforeClickBU).toEqual(resourceByRegionAfterDeselection);

	});

	it('Verify interaction between resource breakdown and list view for Operating System dropdown', async function(){
		logger.info("------ Verify interaction between resource breakdown and list view for Operating System dropdown ------");
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownOperatingSystem);
		//Get OS values from Resource Breakdown
		var toolTipContent = await inventory_page.getApplicationResourceBreakdownGraphToolTip();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(toolTipContent,inventoryTestData.resources);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});
	
	it('Verify whether Resource by Region widget is updated when resource breakdown segment is clicked for Operating System dropdown ', async function(){
		util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownOperatingSystem);
		//Get OS values from Resource Breakdown
		var toolTipContent = await inventory_page.getApplicationResourceBreakdownGraphToolTip();
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownAndRegion(toolTipContent);
		//Compare list view count with resource breakdown count
		await expect(interactionObj.resourcesByRegionCount).toEqual(interactionObj.breakdownCount);
	});

	if(tenantId === inventoryTestData.mainframeTenantID)
	{
	 it('Verify LPAR Details page headers,navigation to assoc overview page,title,search and content validation in overview page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the headers from tags section and compare with expected new headers
		var lparHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(lparHeaders).toEqual(inventoryTestData.mainframeTagsHeaders);
		//Get the subsection contents from overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Click on first name available in tags section
		var nameFromLPARDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the page title of application Overview page and compare with selected name in resource list view
		var assocOverviewPageTitle = await inventory_page.getOverviewPageTitleText();
		expect(nameFromLPARDetailsPage).toEqual(assocOverviewPageTitle);
		await inventory_page.searchTable(overviewContents[inventoryTestData.zerothIndex]);
		//Get the ID from associate overview section and compare with System ID in res list view details
		var nameFromAppOverview = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		expect(overviewContents[inventoryTestData.firstIndex]).toEqual(nameFromAppOverview);
	 });

	 it('Verify Subsystem Details page headers,navigation to assoc overview page,title,search and content validation in overview page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Click on first subsytem available in tags section
		var nameFromLPARDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Get the page title of subsytem details page and compare with selected name in LPAR details page
		var nameFromSubSytemDetailsPage = await inventory_page.getOverviewPageTitleText();
		expect(nameFromLPARDetailsPage).toEqual(nameFromSubSytemDetailsPage);
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		//Click on application name in subsytem detail page
		var nameFromSubSytemDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		//Validate whether it is navigated to application overview section
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the page title of application Overview page and compare with selected name in susbsytem details page
		var assocOverviewPageTitle = await inventory_page.getOverviewPageTitleText();
		expect(nameFromSubSytemDetailsPage).toEqual(assocOverviewPageTitle);
	
	  });

	  it('Verify navigation from subsystem details page to LPAR details page from Assc to column and title,search and content validation', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Click on first subsytem available in tags section
		await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Get the subsystem overview contents from overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		//Click on Associated to in subsytem detail page
		var assctoFromSubSytemDetailsPage = await inventory_page.clickAndGetNameTagSubSectionLink("associatedTo");
		//Validate whether it is navigated to LPAR Details page
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Get the page title of LPAR Details and compare with selected name in susbsytem details page
		var lparDetailsPageTitle = await inventory_page.getOverviewPageTitleText();
		expect(assctoFromSubSytemDetailsPage).toEqual(lparDetailsPageTitle);
		await inventory_page.searchTable(overviewContents[inventoryTestData.zerothIndex]);
		//Get the name fro LPAR Details page and compare with mapped application in subsystem details page
		var nameFromAppOverview = await inventory_page.clickAndGetNameTagSubSectionLink("name");
		expect(overviewContents[inventoryTestData.seventhIndex]).toEqual(nameFromAppOverview);
		
	  });

	  it('Verify applications tagged in LPAR Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName)
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of name links from all pages
		var count = await inventory_page.getCountOfLinks("name",loopCount);
		//Get the applications tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyThirdIndex]).toEqual(count.toString());

		});

	  it('Verify subsystems tagged in LPAR Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of subsytem links from all pages
		var count = await inventory_page.getCountOfLinks("subSection",loopCount);
	    //Get the subsystems tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyFourthIndex]).toEqual(count.toString());
	  });

	  it('Verify applications tagged in subsystem Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName)
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		//Click on first subsection
		await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of name links from all pages
		var count = await inventory_page.getCountOfLinks("name",loopCount);
		//Get the applications tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyOneIndex]).toEqual(count.toString());

		});

	  it('Verify LPARs tagged in subsystem Details page', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName)
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await inventory_page.getResourceWithTagData(count,"subSection");
		//Click on first subsection
		await inventory_page.clickAndGetNameTagSubSectionLink("subSection");
		//Validate susbsytem detail page header section
		var subsytemHeaders = await inventory_page.getTagsSectionHeaders();
		await expect(subsytemHeaders).toEqual(inventoryTestData.subsytemTagsHeaders);
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		//Get the number of pages in the tags section
		var loopCount = await inventory_page.getPageCountForAppsResourcesTable();
		//Get unique count of name links from all pages
		var count = await inventory_page.getCountOfLinks("associatedTo",loopCount);
		//Get the applications tagged value from overview section and compare with count of links
		expect(overviewContents[inventoryTestData.twentyTwoIndex]).toEqual(count.toString());	
	   });


	 it('Verify subsystems tagged and LPARs tagged in Associated resources column in associated overview page for mainframe resource', async function(){
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		await inventory_page.searchTable(inventoryTestData.mainframeName);
		var count = await inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Get the resource which has application tagged
		await inventory_page.getResourceWithTagData(count,"name");
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		await inventory_page.getListViewHeaders();
		//Click on application available in tags section
		await inventory_page.clickAndGetNameTagSubSectionLink("name");
		//Get the count of Subsystems and LPAR's tagged by navigating to all pages
		var counts = await inventory_page.getSubsystemsCountAsscOverview();
		//Get subsytems count from LPAR details page
        var subSystemsTaggedFromPages = counts.subSystemCount;
		//Get the subsytems count displayed in overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		var subSystemsTaggedFromOverview = (overviewContents[1]).split(" ")[0];
		//Compare the susbystems count with count in associated resources in overview section
		expect(subSystemsTaggedFromOverview).toEqual(subSystemsTaggedFromPages.toString());	
		//Get LPAR's count from LPAR details page
		var lparTaggedFromAssocOverview = counts.lparCount;
		//Get the subsytems count displayed in overview section
		var overviewContents = await inventory_page.resourceOverviewSubSectionContentCheck();
		var lparsTaggedFromOverview = (overviewContents[1]).split(" ")[2];
		//Compare the lpar's count with count in associated resources in overview sectionx
		expect(lparsTaggedFromOverview).toEqual(lparTaggedFromAssocOverview.toString());	

	  });

	}
	  it('Application/Resources : Verify that on applying business unit global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		  expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		  // Select Business unit from breakdown region
		  await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		  // fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		  var appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication();
		  // select filter
		  var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		  var filterSelected = await inventory_page.clickAndGetTextFromGlobalFilters(businessUnitsList);
		  healthInventoryUtil.clickOnApplyFilterButton();
		  await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		  await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		  var appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication();
		  //Validations
		  await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).not.toEqual(jasmine.arrayContaining(appWidgetCountObjAfter.applicationsWithMostResourcesCounts));
		  await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).not.toEqual(jasmine.arrayContaining(appWidgetCountObjAfter.applicationsWithMostActiveResourcesCounts));
		  await expect(appWidgetCountObjBefore.resourceByRegionCount).not.toEqual(appWidgetCountObjAfter.resourceByRegionCount);
		  await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
		  await expect(appWidgetCountObjAfter.appResBreakdownList).toEqual([filterSelected]);
		  // Reset filter and validate the count is restored
		  await healthInventoryUtil.clickOnClearFilterButton();
		  await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		  // fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		  var appWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsApplication();
		  await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostResourcesCounts);
		  await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostActiveResourcesCounts);
		  await expect(appWidgetCountObjBefore.resourceByRegionCount).toEqual(appWidgetCountObjAfterReset.resourceByRegionCount);
		  await expect(appWidgetCountObjBefore.listviewcount).toEqual(appWidgetCountObjAfterReset.listviewcount);
		  await expect(appWidgetCountObjBefore.appResBreakdownList).toEqual(appWidgetCountObjAfterReset.appResBreakdownList);
		  // Switch to resource tab and perform simlar actions
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  util.waitForAngular();
		  await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		  await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		  await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		  // fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		  var resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource();
		  // select filter
		  var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		  filterSelected = await inventory_page.clickAndGetTextFromGlobalFilters(businessUnitsList);
		  healthInventoryUtil.clickOnApplyFilterButton();
		  await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		  // fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		  var resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource();
		  //Validations
		  await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(jasmine.arrayContaining(resWidgetCountObjAfter.untaggedResourcesCounts));
		  await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(jasmine.arrayContaining(resWidgetCountObjAfter.monitoredResourcesCounts));
		  await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(jasmine.arrayContaining(resWidgetCountObjAfter.resourceCloudReadinessCounts));
		  await expect(resWidgetCountObjBefore.resourceByRegionCount).not.toEqual(resWidgetCountObjAfter.resourceByRegionCount);
		  await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
		  await expect(resWidgetCountObjAfter.appResBreakdownList).toEqual([filterSelected]);
		  // Reset filter and validate the count is restored
		  await healthInventoryUtil.clickOnClearFilterButton();
		  await inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		  // fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		  var resWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsResource();
		  await expect(resWidgetCountObjBefore.untaggedResourcesCounts).toEqual(resWidgetCountObjAfterReset.untaggedResourcesCounts);
		  await expect(resWidgetCountObjBefore.monitoredResourcesCounts).toEqual(resWidgetCountObjAfterReset.monitoredResourcesCounts);
		  await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).toEqual(resWidgetCountObjAfterReset.resourceCloudReadinessCounts);
		  await expect(resWidgetCountObjBefore.resourceByRegionCount).toEqual(resWidgetCountObjAfterReset.resourceByRegionCount);
		  await expect(resWidgetCountObjBefore.listviewcount).toEqual(resWidgetCountObjAfterReset.listviewcount);
		  await expect(resWidgetCountObjBefore.appResBreakdownList).toEqual(resWidgetCountObjAfterReset.appResBreakdownList);
	  });

	  it('Application/Resources : Verify that on applying application global filters all the widgets in inventory dashboard gets updated and the selection is reverted when the filter is deselected', async function () {
		  expect(util.isSelectedTabButton(inventoryTestData.applicationsButtonName)).toEqual(true);
		  // fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		  let appWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsApplication();
		  // select filter
		  var applicationList = await inventory_page.getglobalFilterApplicationList();
		  var selectedFilter = await inventory_page.clickAndGetTextFromGlobalFilters(applicationList);
		  healthInventoryUtil.clickOnApplyFilterButton();
		  await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		  let appWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsApplication();
		  let topInsightApplication = await inventory_page.getAppResNameFromTopInsightsSubSection(inventoryTestData.applicationsWithMostResourcesSubSectionLabel);
		  //Validations
		  await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(jasmine.arrayContaining(appWidgetCountObjAfter.applicationsWithMostResourcesCounts));
		  await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(jasmine.arrayContaining(appWidgetCountObjAfter.applicationsWithMostActiveResourcesCounts));
		  await expect(appWidgetCountObjBefore.resourceByRegionCount).not.toEqual(appWidgetCountObjAfter.resourceByRegionCount);
		  await expect(appWidgetCountObjBefore.listviewcount).not.toEqual(appWidgetCountObjAfter.listviewcount);
		  await expect(appWidgetCountObjAfter.listviewcount).toEqual(inventoryTestData.firstIndex);
		  await expect(topInsightApplication).toEqual([selectedFilter]);
		  // Reset filter and validate the count is restored
		  await healthInventoryUtil.clickOnClearFilterButton();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		  let appWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsApplication();
		  await expect(appWidgetCountObjBefore.applicationsWithMostResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostResourcesCounts);
		  await expect(appWidgetCountObjBefore.applicationsWithMostActiveResourcesCounts).toEqual(appWidgetCountObjAfterReset.applicationsWithMostActiveResourcesCounts);
		  await expect(appWidgetCountObjBefore.resourceByRegionCount).toEqual(appWidgetCountObjAfterReset.resourceByRegionCount);
		  await expect(appWidgetCountObjBefore.listviewcount).toEqual(appWidgetCountObjAfterReset.listviewcount);
		  await expect(appWidgetCountObjBefore.appResBreakdownList).toEqual(appWidgetCountObjAfterReset.appResBreakdownList);
		  // Switch to resource tab and perform simlar actions
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  util.waitForAngular();
		  await expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		  await util.waitOnlyForInvisibilityOfKibanaDataLoader();
		  // fetch counts of top insights , App breakdown , resources by region , List view	before applying filter
		  let resWidgetCountObjBefore = await inventory_page.getCountsFromAllWidgetsResource();
		  // select filter
		  var applicationList = await inventory_page.getglobalFilterApplicationList();
		  await inventory_page.clickAndGetTextFromGlobalFilters(applicationList);
		  healthInventoryUtil.clickOnApplyFilterButton();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after applying filter
		  let resWidgetCountObjAfter = await inventory_page.getCountsFromAllWidgetsResource();
		  //Validations
		  await expect(resWidgetCountObjBefore.untaggedResourcesCounts).not.toEqual(resWidgetCountObjAfter.untaggedResourcesCounts);
		  await expect(resWidgetCountObjBefore.monitoredResourcesCounts).not.toEqual(resWidgetCountObjAfter.monitoredResourcesCounts);
		  await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).not.toEqual(resWidgetCountObjAfter.resourceCloudReadinessCounts);
		  await expect(resWidgetCountObjBefore.resourceByRegionCount).not.toEqual(resWidgetCountObjAfter.resourceByRegionCount);
		  await expect(resWidgetCountObjBefore.listviewcount).not.toEqual(resWidgetCountObjAfter.listviewcount);
		  // Reset filter and validate the count is restored
		  await healthInventoryUtil.clickOnClearFilterButton();
		  // fetch counts of top insights , App breakdown , resources by region , List view	after filter reset
		  let resWidgetCountObjAfterReset = await inventory_page.getCountsFromAllWidgetsResource();
		  await expect(resWidgetCountObjBefore.untaggedResourcesCounts).toEqual(resWidgetCountObjAfterReset.untaggedResourcesCounts);
		  await expect(resWidgetCountObjBefore.monitoredResourcesCounts).toEqual(resWidgetCountObjAfterReset.monitoredResourcesCounts);
		  await expect(resWidgetCountObjBefore.resourceCloudReadinessCounts).toEqual(resWidgetCountObjAfterReset.resourceCloudReadinessCounts);
		  await expect(resWidgetCountObjBefore.resourceByRegionCount).toEqual(resWidgetCountObjAfterReset.resourceByRegionCount);
		  await expect(resWidgetCountObjBefore.listviewcount).toEqual(resWidgetCountObjAfterReset.listviewcount);
		  await expect(resWidgetCountObjBefore.appResBreakdownList).toEqual(resWidgetCountObjAfterReset.appResBreakdownList);
	  });

    it('[IBM Cloud] Verify whether user is able to assign single application and environment tag to single resource by selecting Application section in Untagged Resources Card', async function(){
            var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
            await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
            var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.IBMCloudProvider);
            // Verify selected provider is present or not in Global filter, return provider name and check name.
            expect(providerPresentText).toEqual(inventoryTestData.IBMCloudProvider);
            // Click on Resources tab
            util.clickOnTabButton(inventoryTestData.resourcesButtonName);
            // Verify selected tab is Resources or not
            expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
            // Select IBM Cloud provider from global filter
            healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.IBMCloudProvider);
            // Click on Apply filter button in global filter section
            healthInventoryUtil.clickOnApplyFilterButton();
            // Verify 'Untagged resources text is present or not
            expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.untaggedResourcesSubSectionLabel)).toBe(true);
            // Select Application count from Untagged resources subsection of Top Insights
            await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,
                                                                                  inventoryTestData.untaggedResourcesApplicationLabel);
            // Get Untagged Resources Application/ Environment counts
            var appEnvCount = await inventory_page.getUntaggedResourcesAppEnvCount();
            // Verify Untagged resources application count should match with Resources list view count when 'Application' option is selected from untagged resources
            expect(appEnvCount.untaggedResourcesApplicationCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
            // Search by specific keyword in search box of List view
            await inventory_page.searchTable(inventoryTestData.ibmCloudResourceType);
            // Get Untagged Resources Application/ Environment counts along with number of records to ve selected in resources list view
            var records = await inventory_page.getNumberOfRecordsToSelect(inventoryTestData.untaggedResourcesApplicationLabel);
            expect(records.noDataInListView).toEqual(false);
            // Select single resource in Resources list view by passing number of records count in parameter
            await inventory_page.selectResourcesFromListView(inventoryTestData.firstIndex);
            // Verify Select Resources count from list view should be equal to total item(s) selected count displaying in Assign/Remove tags bar
            var selectedItemText = inventoryTestData.firstIndex+' '+inventoryTestData.singleItemSelected;
            expect(selectedItemText).toEqual(inventory_page.isSelectedResourcesCountWithTextPresent());
            // Given column names to be fetched from list view
            var listOfColumnsToFetch = [inventoryTestData.resourceListColumnID, inventoryTestData.resourceListColumnResourceName,
                                        inventoryTestData.resourceListColumnApplication, inventoryTestData.resourceListColumnEnvironment];
            // Get details of specific columns of selected resources from resources list view
            var resourceListView = await inventory_page.getSelectedRowsFromListView(listOfColumnsToFetch);
            //Click on Assign tags option
            await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
            // Verify Assign Tags text in Assign Tag window
            await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
            // Select single resource from 'Select resources' dropdown in Assign Tags window
            await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.firstIndex,
                                                             inventoryTestData.firstIndex);
            await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex);
            // Select Application key from 'Application key' dropdown in Assign Tags window
            await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex,
                                                             inventoryTestData.secondIndex);
            await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.secondIndex , inventoryTestData.IBMCloudProvider);
            // Select Application value from 'Application value' dropdown in Assign Tags window
            await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue,
                                                             inventoryTestData.firstIndex, inventoryTestData.thirdIndex);
            var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.IBMCloudProvider);
            await expect(selectedApplicationTag.length).not.toEqual(0);
            // Select Environment key from 'Environment key' dropdown in Assign Tags window
            await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex,
                                                             inventoryTestData.fourthIndex);
            await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.thirdIndex, inventoryTestData.IBMCloudProvider);
            // Select Environment value from 'Environment value' dropdown in Assign Tags window
            await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue,
                                                             inventoryTestData.firstIndex, inventoryTestData.fifthIndex);
            var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.IBMCloudProvider);
            await expect(selectedEnvironmentTag.length).not.toEqual(0);
            // Click on Assign Tags button
            await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
            util.waitForAngular();
            //Validation
            //switch to application tab and come back to resource tab
            util.clickOnTabButton(inventoryTestData.applicationsButtonName);
            util.clickOnTabButton(inventoryTestData.resourcesButtonName);
            // Step1: Get untagged resources: Application / Environment count after tagging
            var appEnvCountAfterTagging = await inventory_page.getUntaggedResourcesAppEnvCount();
            // Step2: Search the tagged resource in resource list view based on selected resources 'Resource ID' and the assigned Application/Environment Tags
            var assignedTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
                                                                listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
            // Step3: If tagged app/env resource is found in All resources list view then Verify Assigned Tags details for same resource
            expect(assignedTagsResult.appTags.toString()).toContain(selectedApplicationTag[0].toString());
            expect(assignedTagsResult.envTags.toString()).toContain(selectedEnvironmentTag[0].toString());

            // Getting performance issue: Many times updated counts are not reflecting immediately or not even in 1-2 minutes
            // Known defect : https://jira.gravitant.net/browse/AIOP-11433
            expect(appEnvCountAfterTagging.untaggedResourcesApplicationCount).toEqual(appEnvCount.untaggedResourcesApplicationCount-inventoryTestData.firstIndex);
            expect(appEnvCountAfterTagging.untaggedResourcesEnvironmentCount).toEqual(appEnvCount.untaggedResourcesEnvironmentCount-assignedTagsResult.count);
	});

	it('Verify inventory dashboard supports on fire fox ,chrome & safari browser and whether user is able to mouse hover on all attribute in Application and Resources',async function() {
		var browserName = await util.getBrowserName()
		expect(await inventory_page.checkMouseHoverOnApplicationBeakdownAndResources(browserName)).toBe(true)
	});

	it('Verify interaction between application breakdown and list view for provider dropdown',async function() {
		logger.info("------ Verify interaction between application breakdown and list view for Provider dropdown ------");
		//Get MC Providers list from Dashboard
		var multiCloudList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		//Compare list view count with application breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(multiCloudList,inventoryTestData.applications);
		//Compare list view count with application breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);

		//Get DC Providers list from Dashboard
		var dataCentreList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("DC");
		await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownProvider);
		//Compare list view count with application breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(dataCentreList,inventoryTestData.applications);
		//Compare list view count with application breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
	});

	it('Verify interaction between application breakdown and list view for Business Unit dropdown', async function(){
		logger.info("------ Verify interaction between application breakdown and list view for Business Unit dropdown ------");
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Get list of business units from global filter
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		//Get list view count and Breakdown count
		var interactionObj = await inventory_page.interactionBetweenBreakdownListView(businessUnitsList,inventoryTestData.applications);
		//Compare list view count with application breakdown count
		await expect(interactionObj.listViewCount).toEqual(interactionObj.breakdownCount);
		
	});

	it('Verify application breakdown is reset when other View By is selected or same attribute is clicked again', async function(){
		logger.info("------ Verify application breakdown is reset when other View By is selected or same attribute is clicked again ------");
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Get list of business units from global filter
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		var countBeforeSelection = inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.zerothIndex]);
		inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownEnvironment);
		var countDiffViewBy = inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(countBeforeSelection).toEqual(countDiffViewBy);
		//Get environment values from application Breakdown
		var BoxContent = await inventory_page.getApplicationResourceBreakdownGraphText();
		//Select and click one environment value
		inventory_page.clickAndGetTextFromSingleBreakdownBox(BoxContent[inventoryTestData.zerothIndex]);
		inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		//Deselect the attribute
		inventory_page.clickAndGetTextFromSingleBreakdownBox(BoxContent[inventoryTestData.zerothIndex]);
		var countAfterDeselection = inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		await expect(countDiffViewBy).toEqual(countAfterDeselection);

	});

	  it('[GCP] Verify whether user is able to assign and remove application and environment tag to single resource from list view', async function () {
		var envKeys = [] , appKeys = [];
		  var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		  await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		  var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.gcpProvider);
		  // Verify selected provider is present or not in Global filter, return provider name and check name.
		  expect(providerPresentText).toEqual(inventoryTestData.gcpProvider);
		  // Click on Resources tab
		  util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Verify selected tab is Resources or not
		  expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		  // Select GCP provider from global filter
		  healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.gcpProvider);
		  // Click on Apply filter button in global filter section
		  healthInventoryUtil.clickOnApplyFilterButton();
		  // Sort table based on resource category under List view
		  util.waitForAngular();
		  await inventory_page.clickOnTableSort(7);
		  util.waitForAngular();
		  // Select single resource in Resources list view by passing number of records count in parameter
		  await inventory_page.selectResourcesFromListView(inventoryTestData.firstIndex);
		  // Verify Select Resources count from list view should be equal to total item(s) selected count displaying in Assign/Remove tags bar
		  var selectedItemText = inventoryTestData.firstIndex + ' ' + inventoryTestData.singleItemSelected;
		  expect(selectedItemText).toEqual(inventory_page.isSelectedResourcesCountWithTextPresent());
		  // Given column names to be fetched from list view
		  var listOfColumnsToFetch = [inventoryTestData.resourceListColumnID, inventoryTestData.resourceListColumnResourceName,
		  inventoryTestData.resourceListColumnApplication, inventoryTestData.resourceListColumnEnvironment, inventoryTestData.resourceListColumnTagKeyValue];
		  // Get details of specific columns of selected resources from resources list view
		  var resourceListView = await inventory_page.getSelectedRowsFromListView(listOfColumnsToFetch);
		  //Click on Assign tags option
		  await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		  // Verify Assign Tags text in Assign Tag window
		  await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		  //Verify note for GCP resource on assign tags page
		  await expect(inventory_page.taggingGcpResourceNotePresent()).toEqual(inventoryTestData.gcpAssignTagsNote);
		  // Select single resource from 'Select resources' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.firstIndex,
			  inventoryTestData.firstIndex);
		  await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex);
		  // Select Application key from 'Application key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex,
			  inventoryTestData.secondIndex);
		  var appTagKey = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  // Select Application value from 'Application value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue,
			  inventoryTestData.firstIndex, inventoryTestData.thirdIndex);
		  var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedApplicationTag.length).not.toEqual(0);
		  // Select Environment key from 'Environment key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex,
			  inventoryTestData.fourthIndex);
			var envTagKey = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		   //Push appkey and envkey to array 
		   appKeys.push(appTagKey);
		   envKeys.push(envTagKey);
			  // Select Environment value from 'Environment value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, inventoryTestData.firstIndex, inventoryTestData.fifthIndex);
		  var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedEnvironmentTag.length).not.toEqual(0);
		  // Click on Assign Tags button
		  await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		  util.waitForAngular();
		  //Validation
		  //switch to application tab and come back to resource tab
		  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Step1: Search the tagged resource in resource list view based on selected resources 'Resource ID' and the assigned Application/Environment Tags
		  var assignedTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			  listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		  // Step2: If tagged app/env resource is found in All resources list view then Verify Assigned Tags details for same resource
		  await expect(assignedTagsResult.appTags.toString()).toContain(selectedApplicationTag[0].toString());
		  await expect(assignedTagsResult.envTags.toString()).toContain(selectedEnvironmentTag[0].toString());
		  //Remove assign tags
		  await inventory_page.searchResourceAndRemoveTags(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel, listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag, inventoryTestData.firstIndex , appKeys ,envKeys);
		  //switch to application tab and come back to resource tab
		  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  var removeTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			  listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		  // If untagged app/env resource is not found in All resources list view then Verify Assigned Tags details for same resource
		  await expect(removeTagsResult.appTags.toString()).not.toContain(selectedApplicationTag.toString());
		  await expect(removeTagsResult.envTags.toString()).not.toContain(selectedEnvironmentTag.toString());
	  });

	it('Application list view: Verify whether filters applied in application breakdown, geo map are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Select any value from application breakdown and get the value
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		var breakdownToolTip = await inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.zerothIndex]);
		var breakdownValue = breakdownToolTip.substring(0,breakdownToolTip.indexOf('\n'));
		//Select any value from application geo map and get the value
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		var geoMapToolTip = await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		var geoMapValue = geoMapToolTip.substring(0,geoMapToolTip.indexOf('\n'));
		//Navigate to application list view and click on view details
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		await inventory_page.getListViewHeaders();
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.applicationViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether breakdown filter is retained by comparing the active box text
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.applicationBreakdownSectionLabel);
		var breakdownActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.applicationBreakdownSectionLabel);
		expect(breakdownValue).toEqual(breakdownActiveBoxText);
		//Verify whether geo map filter is retained and get the text
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.applicationsByRegionSectionLabel);
		var geoMapActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.applicationsByRegionSectionLabel);
		expect(geoMapValue).toEqual(geoMapActiveBoxText);
		await inventory_page.resetGlobalFilters();
	});

	it('Application list view: Verify whether pagination,search,sort,items per page selected are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		//Navigate to application list view
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.applicationsTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		var rows = await inventory_page.getrowData(inventoryTestData.eighthIndex,inventoryTestData.applicationsButtonName);
		var mapped = await inventory_page.mapRowsWithHeaders(rows,headers)
		//search for any resource
		await inventory_page.searchTable(mapped["Provider"]);
		//Apply sort on any of the column
		await inventory_page.clickOnTableSort(inventoryTestData.secondIndex);
		//Click on a different page
		var listViewDetails = await inventory_page.getTotalPagesAndItemsInListView();
		await inventory_page.clickOnPageNumber(inventoryTestData.thirdIndex,listViewDetails.totalEntries);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.applicationViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether selected page number is retained
		var pagenumber =  await inventory_page.getPageNumber(listViewDetails.totalEntries);
		//Index start from zero, hence page number is compared with index+1
		expect(inventoryTestData.fourthIndex).toEqual(pagenumber);
		//Verify whether search text is retained
		var searchText = await inventory_page.getTextFromSearchBar();
		expect(searchText).toEqual(mapped["Provider"]);
		//Verify whether sort is retained
		var sortedIndex = await inventory_page.getSortedColumnIndex();
		expect(inventoryTestData.secondIndex).toEqual(sortedIndex);
		await inventory_page.resetGlobalFilters();

	});

	it('Resource list view: Verify whether pagination,search,sort,items per page selected are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Navigate to application list view
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		var headers = await inventory_page.getListViewHeaders();
		var rows = await inventory_page.getrowData(inventoryTestData.firstIndex,inventoryTestData.resourcesButtonName);
		var mapped = await inventory_page.mapRowsWithHeaders(rows,headers)
		//search for any resource
		await inventory_page.searchTable(mapped["Provider account"]);
		//Apply sort on any of the column
		await inventory_page.clickOnTableSort(inventoryTestData.secondIndex);
		//Click on a different page
		var listViewDetails = await inventory_page.getTotalPagesAndItemsInListView();
		await inventory_page.clickOnPageNumber(inventoryTestData.thirdIndex,listViewDetails.totalEntries);
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to application view via breadcrumb
		await healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.resourceViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether selected page number is retained
		var pagenumber =  await inventory_page.getPageNumber(listViewDetails.totalEntries);
		//Index start from zero, hence page number is compared with index+1
		expect(inventoryTestData.fourthIndex).toEqual(pagenumber);
		//Verify whether search text is retained
		var searchText = await inventory_page.getTextFromSearchBar();
		expect(searchText).toEqual(mapped["Provider account"]);
		//Verify whether sort is retained
		var sortedIndex = await inventory_page.getSortedColumnIndex();
		expect(inventoryTestData.secondIndex).toEqual(sortedIndex);
		await inventory_page.resetGlobalFilters();
	});


	it('Resource list view: Verify whether filters applied in resource breakdown, geo map are retained when user navigates back from overview section', async function () {
		await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		//Select any value from resource breakdown and get the value
		expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		inventory_page.selectCategoryFromAppResBreakdownWidget(inventoryTestData.dropDownBusinessUnit);
		inventory_page.getApplicationOrResourcesTableHeaderTextCount();
		var businessUnitsList = await inventory_page.getglobalFilterBusinessUnitList();
		var breakdownToolTip = await inventory_page.clickAndGetTextFromSingleBreakdownBox(businessUnitsList[inventoryTestData.zerothIndex]);
		var breakdownValue = breakdownToolTip.substring(0,breakdownToolTip.indexOf('\n'));
		//Select any value from resource geo map and get the value
		expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		var toolTipContent = await inventory_page.getApplicationResourceByRegionToolTip();
		var geoMapToolTip = await inventory_page.clickAndGetTextFromResourceByRegion(toolTipContent[inventoryTestData.zerothIndex]);
		var geoMapValue = geoMapToolTip.substring(0,geoMapToolTip.indexOf('\n'));
		//Navigate to resource list view and click on view details
		expect(inventory_page.getAppsResTableSectionLabelText()).toEqual(inventoryTestData.resourcesTableLabel);
		await inventory_page.getListViewHeaders();
		await expect(inventory_page.isViewDetailsButtonDisplayed(inventoryTestData.zerothIndex)).toBe(true);
		inventory_page.clickOnViewDetails();
		await expect(inventory_page.getViewDetailsOverviewLabelText()).toEqual(inventoryTestData.OverviewTitle);
		//Navigate back to resource view via breadcrumb
		healthInventoryUtil.clickOnBreadcrumbLink(inventoryTestData.resourceViewLink);
		//Check whether its navigated to application list view
		await expect(inventory_page.isAppResTableDisplayed()).toBe(true);
		//Verify whether breakdown filter is retained by comparing the active box text
		await expect(inventory_page.getAppResBreakdownSectionLabelText()).toEqual(inventoryTestData.resourcesBreakdownSectionLabel);
		var breakdownActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.resourcesBreakdownSectionLabel);
		expect(breakdownValue).toEqual(breakdownActiveBoxText);
		//Verify whether geo map filter is retained and get the text
		await expect(inventory_page.getAppsResByRegionSectionLabelText()).toEqual(inventoryTestData.resourcesByRegionSectionLabel);
		var geoMapActiveBoxText= await inventory_page.getActiveBoxText(inventoryTestData.resourcesByRegionSectionLabel);
		expect(geoMapValue).toEqual(geoMapActiveBoxText);
		await inventory_page.resetGlobalFilters();
   
	});

	
	  it('[GCP] Verify whether user is able to assign multiple application and environment tag to single resource from list view and remove those', async function () {
		var envKeys = [] , appKeys = [];
		  var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		  await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		  var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.gcpProvider);
		  // Verify selected provider is present or not in Global filter, return provider name and check name.
		  expect(providerPresentText).toEqual(inventoryTestData.gcpProvider);
		  // Click on Resources tab
		  util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Verify selected tab is Resources or not
		  expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		  // Select GCP provider from global filter
		  healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.gcpProvider);
		  // Click on Apply filter button in global filter section
		  healthInventoryUtil.clickOnApplyFilterButton();
		  // Sort table based on resource category under List view
		  util.waitForAngular();
		  await browser.sleep(3000);
		  await inventory_page.clickOnTableSort(7);
		  util.waitForAngular();
		  // Select single resource in Resources list view by passing number of records count in parameter
		  await inventory_page.selectResourcesFromListView(inventoryTestData.firstIndex);
		  // Verify Select Resources count from list view should be equal to total item(s) selected count displaying in Assign/Remove tags bar
		  var selectedItemText = inventoryTestData.firstIndex + ' ' + inventoryTestData.singleItemSelected;
		  expect(selectedItemText).toEqual(inventory_page.isSelectedResourcesCountWithTextPresent());
		  // Given column names to be fetched from list view
		  var listOfColumnsToFetch = [inventoryTestData.resourceListColumnID, inventoryTestData.resourceListColumnResourceName,
		  inventoryTestData.resourceListColumnApplication, inventoryTestData.resourceListColumnEnvironment, inventoryTestData.resourceListColumnTagKeyValue];
		  // Get details of specific columns of selected resources from resources list view
		  var resourceListView = await inventory_page.getSelectedRowsFromListView(listOfColumnsToFetch);
		  //Click on Assign tags option
		  await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		  // Verify Assign Tags text in Assign Tag window
		  await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		  //Verify note for GCP resource on assign tags page
		  await expect(inventory_page.taggingGcpResourceNotePresent()).toEqual(inventoryTestData.gcpAssignTagsNote);
		  // Select single resource from 'Select resources' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.firstIndex, inventoryTestData.firstIndex);
		  await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex);
		  // Select Application key from 'Application key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex, inventoryTestData.secondIndex);
		  var appTagKey1 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  // Select Application value from 'Application value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, inventoryTestData.firstIndex, inventoryTestData.thirdIndex);
		  var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedApplicationTag.length).not.toEqual(0);
		  // Select Environment key from 'Environment key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex, inventoryTestData.fourthIndex);
		  var envTagKey1 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  //Push appkey and envkey to array 
		  appKeys.push(appTagKey1);
		  envKeys.push(envTagKey1);
		  // Select Environment value from 'Environment value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, inventoryTestData.firstIndex, inventoryTestData.fifthIndex);
		  var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedEnvironmentTag.length).not.toEqual(0);
		  //Click on + icon to add new row
		  await inventory_page.clickOnAddNewRowIcon();
		  // Add data on new row
		  // Select single resource from 'Select resources' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.secondIndex, inventoryTestData.firstIndex);
		  await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex);
		  // Select Application key from 'Application key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.secondIndex, inventoryTestData.secondIndex);
		  var appTagKey2 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  // Select Application value from 'Application value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, inventoryTestData.secondIndex, inventoryTestData.thirdIndex);
		  var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  await expect(selectedApplicationTag.length).not.toEqual(0);
		  // Select Environment key from 'Environment key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.secondIndex, inventoryTestData.fourthIndex);
		  var envTagKey2 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		 //Push appkey and envkey to array 
		 appKeys.push(appTagKey2);
		 envKeys.push(envTagKey2);
		  // Select Environment value from 'Environment value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, inventoryTestData.secondIndex, inventoryTestData.fifthIndex);
		  var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  await expect(selectedEnvironmentTag.length).not.toEqual(0);
		  // Click on Assign Tags button
		  await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		  util.waitForAngular();
		  //Validation
		  //switch to application tab and come back to resource tab
		  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  await browser.sleep(3000);
		  // Step1: Search the tagged resource in resource list view based on selected resources 'Resource ID' and the assigned Application/Environment Tags
		  var assignedTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			  listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		  // Step2: If tagged app/env resource is found in All resources list view then Verify Assigned Tags details for same resource
		  await expect(assignedTagsResult.appTags.toString()).toContain(selectedApplicationTag[0].toString());
		  await expect(assignedTagsResult.envTags.toString()).toContain(selectedEnvironmentTag[0].toString());
			//switch to application tab and come back to resource tab
			await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
			await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		   //Remove assign tags
		   await inventory_page.searchResourceAndRemoveTags(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel, listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag, inventoryTestData.firstIndex , appKeys ,envKeys);
		   //switch to application tab and come back to resource tab
		   await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		   await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		   var removeTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			   listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		   // If untagged app/env resource is not found in All resources list view then Verify Assigned Tags details for same resource
		   await expect(removeTagsResult.appTags.toString()).not.toContain(selectedApplicationTag.toString());
		   await expect(removeTagsResult.envTags.toString()).not.toContain(selectedEnvironmentTag.toString());
	  });

	  it('[GCP] Verify whether user is able to assign multiple application and environment tag to multiple resource from list view and remove same tags', async function () {
		var envKeys = [] , appKeys = [];
		  var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		  await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		  var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.gcpProvider);
		  // Verify selected provider is present or not in Global filter, return provider name and check name.
		  expect(providerPresentText).toEqual(inventoryTestData.gcpProvider);
		  // Click on Resources tab
		  util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Verify selected tab is Resources or not
		  expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		  // Select GCP provider from global filter
		  healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.gcpProvider);
		  // Click on Apply filter button in global filter section
		  healthInventoryUtil.clickOnApplyFilterButton();
		  // Sort table based on resource category under List view
		  util.waitForAngular();
		  await inventory_page.clickOnTableSort(7);
		  util.waitForAngular();
		  // Select single resource in Resources list view by passing number of records count in parameter
		  await inventory_page.selectResourcesFromListView(inventoryTestData.secondIndex);
		  // Verify Select Resources count from list view should be equal to total item(s) selected count displaying in Assign/Remove tags bar
		  var selectedItemText = inventoryTestData.secondIndex + ' ' + inventoryTestData.multipleItemsSelected;
		  expect(selectedItemText).toEqual(inventory_page.isSelectedResourcesCountWithTextPresent());
		  // Given column names to be fetched from list view
		  var listOfColumnsToFetch = [inventoryTestData.resourceListColumnID, inventoryTestData.resourceListColumnResourceName,
		  inventoryTestData.resourceListColumnApplication, inventoryTestData.resourceListColumnEnvironment, inventoryTestData.resourceListColumnTagKeyValue];
		  // Get details of specific columns of selected resources from resources list view
		  var resourceListView = await inventory_page.getSelectedRowsFromListView(listOfColumnsToFetch);
		  //Click on Assign tags option
		  await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		  // Verify Assign Tags text in Assign Tag window
		  await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		  //Verify note for GCP resource on assign tags page
		  await expect(inventory_page.taggingGcpResourceNotePresent()).toEqual(inventoryTestData.gcpAssignTagsNote);
		  // Select single resource from 'Select resources' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.firstIndex, inventoryTestData.firstIndex);
		  await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex);
		  // Select Application key from 'Application key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex, inventoryTestData.secondIndex);
		  var appTagKey1 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  // Select Application value from 'Application value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, inventoryTestData.firstIndex, inventoryTestData.thirdIndex);
		  var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedApplicationTag.length).not.toEqual(0);
		  // Select Environment key from 'Environment key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex, inventoryTestData.fourthIndex);
		  var envTagKey1 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  appKeys.push(appTagKey1);
		 envKeys.push(envTagKey1);
		  // Select Environment value from 'Environment value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, inventoryTestData.firstIndex, inventoryTestData.fifthIndex);
		  var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedEnvironmentTag.length).not.toEqual(0);
		  //Click on + icon to add new row
		  await inventory_page.clickOnAddNewRowIcon();
		  // Add data on new row
		  // Select single resource from 'Select resources' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.secondIndex, inventoryTestData.firstIndex);
		  await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex);
		  // Select Application key from 'Application key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.secondIndex, inventoryTestData.secondIndex);
		  var appTagKey2 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  // Select Application value from 'Application value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue, inventoryTestData.secondIndex, inventoryTestData.thirdIndex);
		  var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  await expect(selectedApplicationTag.length).not.toEqual(0);
		  // Select Environment key from 'Environment key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.secondIndex, inventoryTestData.fourthIndex);
		  var envTagKey2 = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  appKeys.push(appTagKey2);
		 envKeys.push(envTagKey2);
		  // Select Environment value from 'Environment value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue, inventoryTestData.secondIndex, inventoryTestData.fifthIndex);
		  var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex, inventoryTestData.gcpProvider);
		  await expect(selectedEnvironmentTag.length).not.toEqual(0);
		  // Click on Assign Tags button
		  await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		  util.waitForAngular();
		  //Validation
		  //switch to application tab and come back to resource tab
		  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Step1: Search the tagged resource in resource list view based on selected resources 'Resource ID' and the assigned Application/Environment Tags
		  var assignedTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			  listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		  // Step2: If tagged app/env resource is found in All resources list view then Verify Assigned Tags details for same resource
		  await expect(assignedTagsResult.appTags.toString()).toContain(selectedApplicationTag[0].toString());
		  await expect(assignedTagsResult.envTags.toString()).toContain(selectedEnvironmentTag[0].toString());
		     //Remove assign tags
			 await inventory_page.searchResourceAndRemoveTags(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel, listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag, inventoryTestData.firstIndex , appKeys ,envKeys);
			 //switch to application tab and come back to resource tab
			 await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
			 await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
			 var removeTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
				 listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
			 // If untagged app/env resource is not found in All resources list view then Verify Assigned Tags details for same resource
			 await expect(removeTagsResult.appTags.toString()).not.toContain(selectedApplicationTag.toString());
			 await expect(removeTagsResult.envTags.toString()).not.toContain(selectedEnvironmentTag.toString());
	  });

	  it('[GCP] Verify whether user is able to assign and remove application and environment tag to multiple resource from untagged card', async function () {
		var envKeys = [] , appKeys = [];  
		var providersList = await inventory_page.getMCAndDCListFromDashboardInventoryCard("MC");
		  await dashboard_page.clickOnViewDetailsLinkBasedOnCard(dashboardTestData.inventory);
		  var providerPresentText = inventory_page.checkPresenceOfProviderInGlobalFilter(providersList, inventoryTestData.gcpProvider);
		  // Verify selected provider is present or not in Global filter, return provider name and check name.
		  expect(providerPresentText).toEqual(inventoryTestData.gcpProvider);
		  // Click on Resources tab
		  util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Verify selected tab is Resources or not
		  expect(util.isSelectedTabButton(inventoryTestData.resourcesButtonName)).toEqual(true);
		  // Select GCP provider from global filter
		  healthInventoryUtil.clickOnProviderCheckBox(inventoryTestData.gcpProvider);
		  // Click on Apply filter button in global filter section
		  healthInventoryUtil.clickOnApplyFilterButton();
		  // Verify 'Untagged resources text is present or not
		  expect(inventory_page.verifyTopInsightsSubSectionLabelText(inventoryTestData.untaggedResourcesSubSectionLabel)).toBe(true);
		  // Select Application count from Untagged resources subsection of Top Insights
		  await inventory_page.clickOntCategoryResourceCountFromTopInsightsSubSection(inventoryTestData.untaggedResourcesSubSectionLabel,
			  inventoryTestData.untaggedResourcesApplicationLabel);
		  // Get Untagged Resources Application/ Environment counts (AIOP-12397)
		  var appEnvCount = await inventory_page.getUntaggedResourcesAppEnvCount();
		  // Verify Untagged resources application count should match with Resources list view count when 'Application' option is selected from untagged resources
		  expect(appEnvCount.untaggedResourcesApplicationCount).toEqual(inventory_page.getApplicationOrResourcesTableHeaderTextCount());
		  // Sort table based on resource category under List view
		  util.waitForAngular();
		  await inventory_page.searchTable(inventoryTestData.storageName);
		  //await inventory_page.searchTable('sprinttestnew');
		  util.waitForAngular();
		  // Get Untagged Resources Application/ Environment counts along with number of records to ve selected in resources list view
		  var records = await inventory_page.getNumberOfRecordsToSelect(inventoryTestData.untaggedResourcesApplicationLabel);
		  expect(records.noDataInListView).toEqual(false);
		  // Select single resource in Resources list view by passing number of records count in parameter
		  await inventory_page.selectResourcesFromListView(inventoryTestData.secondIndex);
		  // Verify Select Resources count from list view should be equal to total item(s) selected count displaying in Assign/Remove tags bar
		  var selectedItemText = inventoryTestData.secondIndex + ' ' + inventoryTestData.multipleItemsSelected;
		  expect(selectedItemText).toEqual(inventory_page.isSelectedResourcesCountWithTextPresent());
		  // Given column names to be fetched from list view
		  var listOfColumnsToFetch = [inventoryTestData.resourceListColumnID, inventoryTestData.resourceListColumnResourceName,
		  inventoryTestData.resourceListColumnApplication, inventoryTestData.resourceListColumnEnvironment, inventoryTestData.resourceListColumnTagKeyValue];
		  // Get details of specific columns of selected resources from resources list view
		  var resourceListView = await inventory_page.getSelectedRowsFromListView(listOfColumnsToFetch);
		  //Click on Assign tags option
		  await inventory_page.selectAssignRemoveTags(inventoryTestData.assignTags);
		  // Verify Assign Tags text in Assign Tag window
		  await expect(inventory_page.taggingPageTitle()).toEqual(inventoryTestData.assignTags);
		  //Verify note for GCP resource on assign tags page
		  await expect(inventory_page.taggingGcpResourceNotePresent()).toEqual(inventoryTestData.gcpAssignTagsNote);
		  // Select single resource from 'Select resources' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveSelectedResources, inventoryTestData.firstIndex,
			  inventoryTestData.firstIndex);
		  await inventory_page.selectResourcesAssignOrRemoveTagsScreen(inventoryTestData.secondIndex);
		  // Select Application key from 'Application key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex,
			  inventoryTestData.secondIndex);
		  var appTagKey = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  // Select Application value from 'Application value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveApplicationTagValue,
			  inventoryTestData.firstIndex, inventoryTestData.thirdIndex);
		  var selectedApplicationTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedApplicationTag.length).not.toEqual(0);
		  // Select Environment key from 'Environment key' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex,
			  inventoryTestData.fourthIndex);
		  var envTagKey = await inventory_page.selectTagKeysAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagKey, inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		   //Push appkey and envkey to array 
		   appKeys.push(appTagKey);
		   envKeys.push(envTagKey);
		  // Select Environment value from 'Environment value' dropdown in Assign Tags window
		  await inventory_page.clickDropDownAssignOrRemoveTagsScreen(inventoryTestData.assignRemoveEnvironmentTagValue,
			  inventoryTestData.firstIndex, inventoryTestData.fifthIndex);
		  var selectedEnvironmentTag = await inventory_page.selectTagValuesAssignOrRemoveTagsScreen(inventoryTestData.firstIndex, inventoryTestData.gcpProvider);
		  await expect(selectedEnvironmentTag.length).not.toEqual(0);
		  // Click on Assign Tags button
		  await inventory_page.clickOnAssignRemoveButton(inventoryTestData.assignTags);
		  util.waitForAngular();
		  //Validation
		  //switch to application tab and come back to resource tab
		  util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Step1: Get untagged resources: Application / Environment count after tagging
		  var appEnvCountAfterTagging = await inventory_page.getUntaggedResourcesAppEnvCount();
		  // Step2: Search the tagged resource in resource list view based on selected resources 'Resource ID' and the assigned Application/Environment Tags
		  var assignedTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			  listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		  // Step3: If tagged app/env resource is found in All resources list view then Verify Assigned Tags details for same resource
		  expect(assignedTagsResult.appTags.toString()).toContain(selectedApplicationTag[0].toString());
		  expect(assignedTagsResult.envTags.toString()).toContain(selectedEnvironmentTag[0].toString());
		  // Getting performance issue: Many times updated counts are not reflecting immediately or not even in 1-2 minutes
		  // Known defect : https://jira.gravitant.net/browse/AIOP-11433 also https://jira.gravitant.net/browse/AIOP-12397
		  expect(appEnvCountAfterTagging.untaggedResourcesApplicationCount).toEqual(appEnvCount.untaggedResourcesApplicationCount - inventoryTestData.secondIndex);
		  expect(appEnvCountAfterTagging.untaggedResourcesEnvironmentCount).toEqual(appEnvCount.untaggedResourcesEnvironmentCount - assignedTagsResult.count);
		  //switch to application tab and come back to resource tab
		  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  //Remove assign tags
		  await inventory_page.searchResourceAndRemoveTags(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel, listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag, inventoryTestData.firstIndex, appKeys , envKeys);
		  //switch to application tab and come back to resource tab
		  await util.clickOnTabButton(inventoryTestData.applicationsButtonName);
		  await util.clickOnTabButton(inventoryTestData.resourcesButtonName);
		  // Step1: Get untagged resources: Application / Environment count after untagging
		  var appEnvCountAfterUntagging = await inventory_page.getUntaggedResourcesAppEnvCount();
		  var removeTagsResult = await inventory_page.getSelectedResourceTaggingDetails(resourceListView, inventoryTestData.untaggedResourcesApplicationLabel,
			  listOfColumnsToFetch, selectedApplicationTag, selectedEnvironmentTag);
		  // If untagged app/env resource is not found in All resources list view then Verify Assigned Tags details for same resource
		  await expect(removeTagsResult.appTags.toString()).not.toContain(selectedApplicationTag.toString());
		  await expect(removeTagsResult.envTags.toString()).not.toContain(selectedEnvironmentTag.toString());
		  // Getting performance issue: Many times updated counts are not reflecting immediately or not even in 1-2 minutes
		  // Known defect : https://jira.gravitant.net/browse/AIOP-11433 also https://jira.gravitant.net/browse/AIOP-12397
		  expect(appEnvCountAfterUntagging.untaggedResourcesApplicationCount).toEqual(appEnvCount.untaggedResourcesApplicationCount);
		  expect(appEnvCountAfterUntagging.untaggedResourcesEnvironmentCount).toEqual(appEnvCount.untaggedResourcesEnvironmentCount);
	  });


	afterAll(async function() {
		await launchpad_page.clickOnLogoutAndLogin(browser.params.username, browser.params.password);
	});
});