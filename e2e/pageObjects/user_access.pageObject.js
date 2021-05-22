/**
 * Created by : Padmakar Selokar
 * created on : 30/03/2020
 */

"use strict";
var extend = require('extend');
var url = browser.params.url;
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();
var launchpadPage = require('./launchpad.pageObject.js'),
	launchpadObj = new launchpadPage();
var launchpadTestData = require('../../testData/cards/launchpadTestData.json');
var EC = protractor.ExpectedConditions;
var util = require('../../helpers/util.js');
var timeout = require('../../testData/timeout.json');
var healthPage = require('./health.pageObject.js');
var healthObj = new healthPage();
var userAccessTestData = require('../../testData/cards/userAccessTestData.json');


var defaultConfig = {
	pageUrl: url,
	userAccessPageLoaderCss: "circle.bx--loading__stroke",
	userAccessPageTableLoaderCss: "tr circle.bx--loading__stroke",
	userAccessHeaderTitleTextCss: "div.cb--page-header__title",
	userAccessHeaderSubTitleTextCss: "div.cb--page-header__subtitle",
	searchTextInputCss: "input.bx--search-input",
	userAccessTableBodyCss: "table.bx--data-table tbody",
	userAccessTableRowsCss: "table.bx--data-table tbody tr",
	userAccessTableHeaderCss: "table.bx--data-table thead",
	userAccessTableColsCss: "table.bx--data-table th",
	userAccessTableColNamesCss: "table.bx--data-table th span.bx--table-header-label",
	noDataRowCss: "table.bx--data-table tr.bx--table-row-empty--default h4",
	userAccessTableColSpanCss: "table tbody td:nth-child({0}) span.bx--tooltip-text",
	createNewOrgButtonCss: "#button-addNewOrganizationPanel",
	slidingPanelCss: "div.bx--slide-over-panel",
	closeSlidingPanelBtnCss: "button.bx--slide-over-panel--close",
	orgIdTextInputCss: "#text-input-id",
	orgNameTextInputCss: "#text-input-name",
	createOrgFormButton: "#button-orgCreateFormButton",
	cancelOrgFormButton: "#button-advanced-search-reset-btn",
	idExistFormValidationMsgCss: "form div.orgError",
	sliderNotificationTextCss: "p.bx--toast-notification__subtitle span",
	sliderNotificationCloseBtnCss: "button.bx--toast-notification__close-button",
	contextAlreadyExistsErrorText: "Authorization context with context code {0} already exists",
	orgAddedSuccessText: "{0} has been added",
	userAccessTabLinksCss: "a.bx--tabs__nav-link",
	createNewTeamButtonCss: "#button-addNewTeamBtn",
	organizationDropdownCss: "#bx--dropdown-single-parent_org",
	organizationDropdownInputCss: "#text-input-org",
	organizationDropdownList: "carbon-dropdown[title='Organization'] ul.bx--dropdown-list",
	organizationLabelButtonsCss: "carbon-dropdown[title='Organization'] ul.bx--dropdown-list button",
	teamIDInputTextCss: "#text-input-teamcode",
	teamNameInputTextCss: "#text-input-name",
	createTeamFormButtonCss: "header button.bx--btn--primary",
	createTeamFormCancelButtonCss: "header button.bx--btn--secondary",
	teamNameHeaderTextCss: "header span.header-title",
	breadCrumbLinksCss: "div.bx--breadcrumb a.bx--link",
	showActionsIconXpath: "//td//span[normalize-space(text())='{0}']//ancestor::tr//div[@class='bx--overflow-menu']",
	viewDetailsButtonXpath: "//td//span[normalize-space(text())='{0}']//ancestor::tr//div[@class='bx--overflow-menu']//button[contains(text(),'View Details')]",
	deleteButtonXpath: "//td//span[normalize-space(text())='{0}']//ancestor::tr//div[@class='bx--overflow-menu']//button[contains(text(),'Delete')]",
	addRolesButtonXpath: "//span[normalize-space(text())='Roles']//parent::div//button",
	roleDropdownCss: "#bx--dropdown-single-parent_add-team-role",
	roleDropdownListCss: "#bx--dropdown-single-parent_add-team-role ul.bx--dropdown-list",
	roleDropdownLabelLinksCss: "#bx--dropdown-single-parent_add-team-role ul.bx--dropdown-list button",
	roleContextFormCss: "form div.context-table",
	businessEntityDropdownCss: "#entity",
	businessEntityDropdownListCss: "#entity ul.bx--dropdown-list",
	businessEntityDropdownLabelLinksCss: "#entity ul.bx--dropdown-list button",
	entityValuesDropdownCss: "#bx--dropdown-multi-parent_{0}",
	entityValuesDropdownLoadingDataCss: "#bx--dropdown-multi-parent_{0} h6",
	entityValuesDropdownLabelLinksCss: "#bx--dropdown-multi-parent_{0} ul.bx--dropdown-list span label",
	addRoleFormButtonCss: "#button-editViewUser",
	roleContextCheckboxXpath: "//div[@class='bx--row']//p[text()='{0}']//preceding-sibling::carbon-checkbox//div[@class='bx--form-item']",
	roleContextDropdownCss: "button#bx--search__wrapper_{0}",
	roleContextDropdownLabelLinksCss: "ul#bx--dropdown-multi-parent_{0} ul label.bx--checkbox-label",
	roleContextDropdownSelectedValuesCss: "button#bx--search__wrapper_{0} carbon-tag",
	roleContextDropdownRemoveButtonIconCss: "button#bx--search__wrapper_{0} carbon-tag carbon-icon",
	assignedRoleTextCss: "div.team-role-item > span:nth-child(1)",
	assignedRoleOptionBtnXpath: "//div[@class='team-roles']//span[normalize-space(text())='{0}']//parent::div//div[@class='bx--overflow-menu']",
	assignedRoleViewDetailsButtonXpath: "//div[@class='team-roles']//span[normalize-space(text())='{0}']//parent::div//button[contains(text(),'View Details')]",
	editRoleContextBtnCss: "#button-editContextInRole",
	showAssociatedCheckboxCss: ".associated-checkbox div.bx--form-item",
	updateRoleContextBtnCss: "#button-updateContextInRole",
	inlineNotificationTitleTextCss: "p.bx--inline-notification__title span",
	inlineNotificationSubTitleTextCss: "p.bx--inline-notification__subtitle span",
	inlineNotificationCloseButtonCss: "button.bx--inline-notification__close-button",
	userDropdownXpath: "//span[normalize-space(text())='Users']//ancestor::div[@class='uam-page-section']//button[@class='bx--search__wrapper']",
	userDropdownInputXpath: "//span[normalize-space(text())='Users']//ancestor::div[@class='uam-page-section']//input[@class='bx--search-input']",
	userDropdownLabelLinksXpath: "//span[normalize-space(text())='Users']//ancestor::div[@class='uam-page-section']//span/label",
	userDropdownAssignButtonXpath: "//span[normalize-space(text())='Users']//ancestor::div[@class='uam-page-section']//button[@id='button-team-assign-users-button']",
	assignedUserTableRowsCss: "#carbon-deluxe-data-table-team-users-table tbody tr",
	assignedUserTableEmailAddrValuesCss: "#carbon-deluxe-data-table-team-users-table td:nth-child(5) span",
	searchButtonXpath:"//*[@class='bx--search-magnifier']",
};

function userAccess(selectorConfig) {
	if (!(this instanceof userAccess)) {
		return new userAccess(selectorConfig);
	}
	extend(this, defaultConfig);

	if (selectorConfig) {
		extend(this, selectorConfig);
	}
}

/**
 * Method to open User Access Page using left navigation bar
 */
userAccess.prototype.open = function () {
	util.waitForAngular();
	util.switchToDefault();
	launchpadObj.clickOnHamburgerMenu(launchpadTestData.leftNavigationExpanded);
	launchpadObj.clickOnleftNavigationMenuBasedOnName(launchpadTestData.adminButton);
	launchpadObj.clickLeftNavCardBasedOnName(launchpadTestData.userAccessCard);
};

/**
 * Method to wait for page loader icon to disappear
 */
userAccess.prototype.waitForPageLoading = function () {
	util.waitForAngular();
	browser.wait(EC.invisibilityOf(element(by.css(this.userAccessPageLoaderCss))), timeout.timeoutInMilis).then(function () {
		browser.sleep(10000);
		logger.info("Page is loaded completely..");
	});
}

/**
 * Method to wait for table data loader icon to disappear
 */
userAccess.prototype.waitForTableDataLoading = function () {
	util.waitForAngular();
	browser.wait(EC.invisibilityOf(element(by.css(this.userAccessPageTableLoaderCss))), timeout.timeoutInMilis).then(function () {
		browser.sleep(5000);
		logger.info("Table is loaded completely..");
	});
}

/**
 * Method to get user access page header title text
 */
userAccess.prototype.getUserAccessHeaderTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.userAccessHeaderTitleTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.userAccessHeaderTitleTextCss)).getText().then(function (titleText) {
		logger.info("User access page header title text : " + titleText.trim());
		return titleText.trim();
	});
};

/**
 * Method to get user access page header sub-title text
 */
userAccess.prototype.getUserAccessHeaderSubTitleText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.userAccessHeaderSubTitleTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.userAccessHeaderSubTitleTextCss)).getText().then(function (subTitleText) {
		logger.info("User access page header sub-title text : " + subTitleText.trim());
		return subTitleText.trim();
	});
};

/**
 * Method to search Organization/Team/Users
 * Ex. searchText - String value to search in the table [Org/Team/User]
 */

 userAccess.prototype.searchOrgTeamUser =async function (searchText) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.userAccessTableBodyCss))), timeout.timeoutInMilis);
	await element(by.css(this.searchTextInputCss)).clear().sendKeys(searchText + protractor.Key.ENTER).then(function () {
		logger.info("Searching " + searchText + " in the table..");
		browser.sleep(2000)
	});
}

/**
 * Method to click on Add Organization button
 */
userAccess.prototype.clickOnAddOrganizationButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.createNewOrgButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.createNewOrgButtonCss)).click().then(function () {
		logger.info("Clicked on create organization button.");
	});
}

/**
 * Method to fill create organization form
 * Ex. orgId - ID/Name of Organization to be create
 */
userAccess.prototype.fillCreateOrganizationForm = function (orgId) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.orgIdTextInputCss))), timeout.timeoutInMilis);
	element(by.css(this.orgIdTextInputCss)).sendKeys(orgId).then(function () {
		logger.info("Entered organization ID: "+orgId);
		element(by.css(self.orgNameTextInputCss)).sendKeys(orgId).then(function () {
			logger.info("Entered organization Name: "+orgId);
		});
	});
}

/**
 * Method to click on Create Organization form button
 */
userAccess.prototype.clickOnCreateOrgFormButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.createOrgFormButton))), timeout.timeoutInMilis);
	element(by.css(this.createOrgFormButton)).click().then(function () {
		logger.info("Clicked on create organization form button.");
	});
}

/**
 * Method to get text from Success/Error Slider Notification for Organization creation
 */
userAccess.prototype.getCreateOrgNotificationMsgText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.sliderNotificationTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.sliderNotificationTextCss)).getText().then(function (notificationMsg) {
		logger.info("Create org slider nofication msg text: "+notificationMsg.trim());
		return notificationMsg.trim();
	});
}

/**
 * Method to close Success/Error Slider Notification
 */
userAccess.prototype.closeSliderNotification = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.sliderNotificationCloseBtnCss))), timeout.timeoutInMilis);
	element(by.css(this.sliderNotificationCloseBtnCss)).click().then(function(){
		logger.info("Clicked on close button for slider notification");
	});
}

/**
 * Method to click on Add Team button
 */
userAccess.prototype.clickOnAddTeamButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.createNewTeamButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.createNewTeamButtonCss)).click().then(function () {
		logger.info("Clicked on create team button.");
	});
}

/**
 * Method to fill create team form
 * Ex. teamId - ID/Name of Team to be create
 * orgId - Organization ID which is to be associated with created team
 */
userAccess.prototype.fillCreateTeamForm = function (teamId, orgId) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.teamIDInputTextCss))), timeout.timeoutInMilis);
	element(by.css(this.teamIDInputTextCss)).sendKeys(teamId).then(function () {
		logger.info("Entered team ID: "+teamId);
		element(by.css(self.teamNameInputTextCss)).sendKeys(teamId).then(function () {
			logger.info("Entered team Name: "+teamId);
			element(by.css(self.organizationDropdownCss)).click().then(function () {
				logger.info("Clicked on Organization dropdown");
				browser.wait(EC.visibilityOf(element(by.css(self.organizationDropdownList))), timeout.timeoutInMilis);
				element(by.css(self.organizationDropdownInputCss)).sendKeys(orgId).then(function () {
					logger.info("Entered organization ID: "+orgId);
					element.all(by.css(self.organizationLabelButtonsCss)).getText().then(async function (orgIds) {
						for (var i = 0; i < orgIds.length; i++) {
							if (orgIds[i].trim() == orgId) {
								await element.all(by.css(self.organizationLabelButtonsCss)).get(i).click().then(async function () {
									logger.info("Clicked on organization id " + orgIds[i] + " from dropdown list");
								});
							}
						}
					})
				})
			})
		})
	});
}

/**
 * Method to click on Create Team form button
 */
userAccess.prototype.clickOnCreateTeamFormButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.createTeamFormButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.createTeamFormButtonCss)).click().then(function () {
		logger.info("Clicked on create team form button.");
	});
}

/**
 * Method to get text from Success/Error Notification for Team creation
 */
userAccess.prototype.getCreateTeamNotificationMsgText = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.inlineNotificationSubTitleTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.inlineNotificationSubTitleTextCss)).getText().then(function (notificationMsg) {
		logger.info("Create team nofication msg text: "+notificationMsg.trim());
		return notificationMsg.trim();
	});
}

/**
 * Method to click on create team form cancel button
 */
userAccess.prototype.clickOnCreateTeamFormCancelButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.createTeamFormCancelButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.createTeamFormCancelButtonCss)).click().then(function () {
		logger.info("Clicked on create team form cancel button");
	});
}

/**
 * Method to click on Breadcrumb link based on name
 * Ex. linkName - Teams, Users, etc
 */
userAccess.prototype.clickOnBreadcrumbLink = function (linkName) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.breadCrumbLinksCss)).get(0)), timeout.timeoutInMilis);
	element.all(by.css(this.breadCrumbLinksCss)).getText().then(async function (links) {
		for (var i = 0; i < links.length; i++) {
			if (links[i].trim() == linkName) {
				await browser.wait(EC.elementToBeClickable(element.all(by.css(self.breadCrumbLinksCss)).get(i)), timeout.timeoutInMilis);
				await browser.executeScript('arguments[0].click();', element.all(by.css(self.breadCrumbLinksCss)).get(i)).then(function () {
					logger.info("Clicked on breadcrumb link " + links[i]);
				});
			}
		}
	});
}

/**
 * Method to get index for the column name in table [Org/Team/User]
 * Ex. columnName - Column name from table whose index to be get
 */
userAccess.prototype.getIndexForColumnName = function (columnName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.userAccessTableHeaderCss))), timeout.timeoutInMilis);
	browser.wait(EC.visibilityOf(element(by.css(this.userAccessTableBodyCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.userAccessTableColsCss)).getText().then(function (colNames) {
		for (var i = 0; i < colNames.length; i++) {
			if (colNames[i].trim() == columnName) {
				var index = i + 1;
				return index;
			}
		}
	});
}

/**
 * Method to check if organization/team/user is present or not
 * Ex. columnValue - ID/Name or any other column value of Organization/Team/User to be checked
 * columnName - Column name from table like ID, Name, Email Address, etc
 */
userAccess.prototype.isOrgTeamUserPresent = function (columnValue, columnName) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.userAccessTableBodyCss))), timeout.timeoutInMilis);
	return element.all(by.css(this.userAccessTableRowsCss)).count().then(function (rowCount) {
		if (rowCount > 0) {
			return element.all(by.css(self.noDataRowCss)).count().then(async function (noDataRowCount) {
				if (!noDataRowCount) {
					for (var i = 0; i < rowCount; i++) {
						// Get Index value for ID column
						var index = await self.getIndexForColumnName(columnName);
						var columnSpanCss = self.userAccessTableColSpanCss.format(index);
						await browser.wait(EC.visibilityOf(element.all(by.css(columnSpanCss)).get(i)), timeout.timeoutInMilis);
						var id = await element.all(by.css(columnSpanCss)).get(i).getText();
						logger.info("Comparing " + id.trim() + " with " + columnValue);
						if (id.trim() == columnValue) {
							logger.info(columnValue + " is present");
							return id.trim();
						}
					}
					if (i == rowCount) {
						logger.info(columnValue + " is not present");
						return false;
					}
				}
				else {
					return await element(by.css(self.noDataRowCss)).getText().then(function (text) {
						logger.info("No data available text: " + text);
						return false;
					});
				}
			})
		}
		else {
			logger.info("There are no rows present in table");
			return false;
		}
	});
}

/**
 * Method to verify each tab link based on link name
 * Ex. linkName - Organizations, Teams, Users, etc.
 */
userAccess.prototype.isDisplayTabLink = function (linkName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.userAccessTabLinksCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.userAccessTabLinksCss)).getText().then(function (links) {
		for (var i = 0; i < links.length; i++) {
			if (links[i].trim() == linkName) {
				logger.info("Tab link " + linkName + " is present.");
				return true;
			}
		}
		if (i == links.length) {
			logger.info("Tab link " + linkName + " not found.");
			return false;
		}
	});
}

/**
 * Method to click on tab link based on link name
 * Ex. linkName - Organizations, Teams, Users, etc.
 */
userAccess.prototype.clickOnTabLink =async function (linkName) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.userAccessTabLinksCss)).get(0)), timeout.timeoutInMilis);
	await element.all(by.css(this.userAccessTabLinksCss)).getText().then(async function (links) {
		for (var i = 0; i < links.length; i++) {
			if (links[i].trim() == linkName) {
				await browser.wait(EC.elementToBeClickable(element.all(by.css(self.userAccessTabLinksCss)).get(i)), timeout.timeoutInMilis);
				await browser.executeScript('arguments[0].click();', element.all(by.css(self.userAccessTabLinksCss)).get(i)).then(function () {
					logger.info("Clicked on tab link " + links[i]);
					return;
				});
			}
		}
	});
}

/**
 * Method to click on Show actions icon for table rows
 * Ex. cellValue - ID/Name or any unique cell value for Organization/Team/User
 */
userAccess.prototype.clickOnShowActionsIconForTableRows = function (cellValue) {
	var showActionsXpath = this.showActionsIconXpath.format(cellValue);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(showActionsXpath))), timeout.timeoutInMilis);
	element(by.xpath(showActionsXpath)).click().then(function () {
		logger.info("Clicked on Show actions icon.");
	});
}

/**
 * Method to click on view details Action button for Org/Team/User
 * Ex. cellValue - ID/Name or any unique cell value for Organization/Team/User
 */
userAccess.prototype.clickOnViewDetailsActionButton = function (cellValue) {
	var actionBtnXpath = this.viewDetailsButtonXpath.format(cellValue);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(actionBtnXpath))), timeout.timeoutInMilis);
	element(by.xpath(actionBtnXpath)).click().then(function () {
		logger.info("Clicked on view details action button.");
	});
}

/**
 * Method to verify header text on team details page
 */
userAccess.prototype.getTeamDetailsPageHeaderText = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.teamNameHeaderTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.teamNameHeaderTextCss)).getText().then(function (headerText) {
		logger.info("Team details page header text: "+headerText.trim());
		return headerText.trim();
	});
}

/**
 * Method to click on delete Action button for Org/Team/User
 * Ex. cellValue - ID/Name or any unique cell value for Organization/Team/User
 */
userAccess.prototype.clickOnDeleteActionButton = function (cellValue) {
	var actionBtnXpath = this.deleteButtonXpath.format(cellValue);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(actionBtnXpath))), timeout.timeoutInMilis);
	element(by.xpath(actionBtnXpath)).click().then(function () {
		logger.info("Clicked on delete action button.");
	});
}

/**
 * Method to click Add role button on team details page
 */
userAccess.prototype.clickOnAddRoleButton = function(){
	browser.wait(EC.visibilityOf(element(by.xpath(this.addRolesButtonXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.addRolesButtonXpath)).click().then(function () {
		logger.info("Clicked on Add role button.");
	});
}

/**
 * Method to click on role dropdown
 */
userAccess.prototype.clickOnRoleDropdown = function(){
	browser.wait(EC.visibilityOf(element(by.css(this.roleDropdownCss))), timeout.timeoutInMilis);
	element(by.css(this.roleDropdownCss)).click().then(function () {
		logger.info("Clicked on Role dropdown.");
	});
}

/**
 * Method to select Role from dropdown
 * Ex. roleName - IT Ops Manager, System Admin, etc
 */
userAccess.prototype.selectRoleFromDropdown = function(roleName){
	var self = this;
	browser.wait(EC.visibilityOf(element(by.css(this.roleDropdownListCss))), timeout.timeoutInMilis);
	element.all(by.css(this.roleDropdownLabelLinksCss)).getText().then(async function (roleNames) {
		for (var i = 0; i < roleNames.length; i++) {
			if (roleNames[i].trim() == roleName) {
				await browser.wait(EC.visibilityOf(element.all(by.css(self.roleDropdownLabelLinksCss)).get(i)), timeout.timeoutInMilis);
				await element.all(by.css(self.roleDropdownLabelLinksCss)).get(i).click().then(function () {
					logger.info("Clicked on role " + roleNames[i] + " from dropdown list");
				});
			}
		}
	});
}

/**
 * Method to add business entity to selected role
 * entityContext - JSON object to pass Business entity [Organization/Team] values
 */
userAccess.prototype.addBusinessEntityToRole = function (entityContext) {
	var self = this;
	var entityValuesDropdown = this.entityValuesDropdownCss.format(entityContext.id);
	var entityValuesDropdownLabelLinks = this.entityValuesDropdownLabelLinksCss.format(entityContext.id);
	var entityValuesDropdownLoadingData = this.entityValuesDropdownLoadingDataCss.format(entityContext.id);
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.businessEntityDropdownCss))), timeout.timeoutInMilis);
	element(by.css(this.businessEntityDropdownCss)).click().then(function () {
		logger.info("Clicked on Business entity dropdown.");
		browser.wait(EC.visibilityOf(element(by.css(self.businessEntityDropdownListCss))), timeout.timeoutInMilis);
		element.all(by.css(self.businessEntityDropdownLabelLinksCss)).getText().then(async function (entities) {
			for (var i = 0; i < entities.length; i++) {
				if (entities[i].trim() == entityContext.name) {
					await browser.wait(EC.presenceOf(element.all(by.css(self.businessEntityDropdownLabelLinksCss)).get(i)), timeout.timeoutInMilis);
					await element.all(by.css(self.businessEntityDropdownLabelLinksCss)).get(i).click().then(function () {
						logger.info("Clicked on entity " + entities[i] + " from dropdown list");
					});
				}
			}
		})
		browser.wait(EC.visibilityOf(element(by.css(entityValuesDropdown))), timeout.timeoutInMilis);
		element(by.css(entityValuesDropdown)).click().then(function () {
			logger.info("Clicked on Entity values dropdown.");
			browser.wait(EC.invisibilityOf(element(by.css(entityValuesDropdownLoadingData))), timeout.timeoutInMilis).then(function(){
				element.all(by.css(entityValuesDropdownLabelLinks)).getText().then(async function (values) {
					for (var i = 0; i < values.length; i++) {
						if (values[i].trim() == entityContext.value) {
							await browser.wait(EC.presenceOf(element.all(by.css(entityValuesDropdownLabelLinks)).get(i)), timeout.timeoutInMilis);
							await element.all(by.css(entityValuesDropdownLabelLinks)).get(i).click().then(function () {
								logger.info("Clicked on entity value " + values[i] + " from dropdown list");
							});
						}
					}
				})
			})
		})
	});
}

/**
 * Method to click on Add role form button
 */
userAccess.prototype.clickOnAddRoleFormButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.addRoleFormButtonCss))), timeout.timeoutInMilis);
	element(by.css(this.addRoleFormButtonCss)).click().then(function () {
		logger.info("Clicked on add role form button");
	});
}

/**
 * Method to get text from Success/Error Temporary Notification
 */
userAccess.prototype.getTempNotificationMsgText = function () {
	browser.ignoreSynchronization = true;
	browser.wait(EC.visibilityOf(element(by.css(this.inlineNotificationSubTitleTextCss))), timeout.timeoutInMilis);
	return element(by.css(this.inlineNotificationSubTitleTextCss)).getText().then(function (msgText) {
		logger.info("Notification msg text: "+msgText);
		browser.ignoreSynchronization = false;
		return msgText;
	});
}

/**
 * Method to get Assigned role on Team details page
 */
userAccess.prototype.getAssignedRoleText = function (roleName) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.assignedRoleTextCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.assignedRoleTextCss)).getText().then(function(roleNames){
		var i;
		for(i=0; i<roleNames.length; i++){
			if(roleNames[i].trim() == roleName){
				logger.info(roleName+" is present in assigned roles section.");
				return roleNames[i].trim();
			}
		}
		if(i == roleNames.length){
			logger.info(roleName+" is not present in assigned roles section.");
		}
	});
}

/**
 * Method click on Options button for role
 * Ex. roleName - IT Ops Manager, System Admin, etc
 */
userAccess.prototype.clickOnOptionsButtonForRole = function(roleName){
	var assignedRoleOptionBtn = this.assignedRoleOptionBtnXpath.format(roleName);
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.xpath(assignedRoleOptionBtn))), timeout.timeoutInMilis);
	element(by.xpath(assignedRoleOptionBtn)).click().then(function () {
		logger.info("Clicked on option button for " + roleName);
	});
}
/**
 * Method to click on Action button for assigned role
 * Ex. roleName - IT Ops Manager, System Admin, etc
 */
userAccess.prototype.clickOnViewDetailsButtonForRole = function (roleName) {
	var assignedRoleActionBtn = this.assignedRoleViewDetailsButtonXpath.format(roleName);
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(assignedRoleActionBtn))), timeout.timeoutInMilis);
	element(by.xpath(assignedRoleActionBtn)).click().then(function () {
		logger.info("Clicked on view details button for " + roleName);
	});
}

/**
 * Method to click on Edit role context button
 */
userAccess.prototype.clickOnEditRoleContextButton = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.editRoleContextBtnCss))), timeout.timeoutInMilis);
	element(by.css(this.editRoleContextBtnCss)).click().then(function () {
		logger.info("Clicked on Edit role context button.");
	});
}

/**
 * Method to clear the selected values from role context
 * context - JSON object to pass Context [landing/environment/application] values
 */
userAccess.prototype.clearRoleContextSelection = async function(context){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.roleContextFormCss))), timeout.timeoutInMilis);
	for (var i = 0; i < context.length; i++) {
		var roleContextCheckbox = this.roleContextCheckboxXpath.format(context[i].name);
		var roleContextDropdownSelectedValues = this.roleContextDropdownSelectedValuesCss.format(context[i].id);
		var roleContextDropdownRemoveButtonIcon = this.roleContextDropdownRemoveButtonIconCss.format(context[i].id);
		var contextCount = await element.all(by.xpath(roleContextCheckbox)).count();
		if(contextCount == 0){
			await browser.wait(EC.elementToBeClickable(element(by.css(this.showAssociatedCheckboxCss))), timeout.timeoutInMilis);
			await element(by.css(this.showAssociatedCheckboxCss)).click().then(function(){
				logger.info("Clicked on show associated checkbox..")
			})
		}
		var valCount = await element.all(by.css(roleContextDropdownSelectedValues)).count();
		// No values selected, hence click on checkbox for context
		if (valCount == 0) {
			logger.info(context[i].name + " has no already selected value");
			await browser.wait(EC.visibilityOf(element(by.xpath(roleContextCheckbox))), timeout.timeoutInMilis);
			await element(by.xpath(roleContextCheckbox)).click().then(function () {
				logger.info("Clicked on checkbox for " + context[i].name + " context..");
			});
		}
		// Select new values, hence clearing already selected values
		else {
			var valCount = await element.all(by.css(roleContextDropdownSelectedValues)).count();
			await browser.wait(EC.visibilityOf(element.all(by.css(roleContextDropdownRemoveButtonIcon)).get(0)), timeout.timeoutInMilis).then(async function(){
				while (valCount != 0) {
					await element.all(by.css(roleContextDropdownRemoveButtonIcon)).get(0).click();
					valCount = await element.all(by.css(roleContextDropdownSelectedValues)).count();
				}
				logger.info("Cleared the dropdown values..");
			})
		}
	};
}

/**
 * Method to add context to specific team role
 * context - JSON object to pass Context [landing/environment/application] values
 */
userAccess.prototype.addContextToTeamRole = async function (context) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.roleContextFormCss))), timeout.timeoutInMilis);
	for (var i = 0; i < context.length; i++) {
		var roleContextCheckbox = this.roleContextCheckboxXpath.format(context[i].name);
		if (context[i].value == "") {
			await browser.wait(EC.visibilityOf(element(by.xpath(roleContextCheckbox))), timeout.timeoutInMilis);
			logger.info("Passing empty context value");
			await element(by.xpath(roleContextCheckbox)).click().then(function () {
				logger.info("Clicked on checkbox for " + context[i].name + " context..");
			});
		}
		else{
			var roleContextDropdown = this.roleContextDropdownCss.format(context[i].id);
			var roleContextDropdownLabelLinks = this.roleContextDropdownLabelLinksCss.format(context[i].id);
			await browser.wait(EC.visibilityOf(element(by.css(roleContextDropdown))), timeout.timeoutInMilis);
			await element(by.css(roleContextDropdown)).click().then(async function () {
				logger.info("Clicked on " + context[i].name + " values dropdown.");
				await browser.wait(EC.visibilityOf(element.all(by.css(roleContextDropdownLabelLinks)).get(0)), timeout.timeoutInMilis);
				await element.all(by.css(roleContextDropdownLabelLinks)).getText().then(async function (links) {
					for (var j = 0; j < context[i].value.length; j++) {
						logger.info(context[i].name + " Value: " + context[i].value[j]);
						for (var k = 0; k < links.length; k++) {
							if (links[k].trim() == context[i].value[j]) {
								await element.all(by.css(roleContextDropdownLabelLinks)).get(k).click().then(function () {
									logger.info("Clicked on " + context[i].name + " value " + links[k] + " from dropdown list");
								});
							}
						}
					}
				})
			})
		}
	};
}

/**
 * Method to click on Update role context button
 */
userAccess.prototype.clickOnUpdateRoleContextButton = function () {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.css(this.updateRoleContextBtnCss))), timeout.timeoutInMilis);
	element(by.css(this.updateRoleContextBtnCss)).click().then(function () {
		logger.info("Clicked on Update role context button.");
	});
}

/**
 * Method to close sliding panel button
 */
userAccess.prototype.clickOnCloseSlidingPanelBtn = function () {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.elementToBeClickable(element(by.css(this.closeSlidingPanelBtnCss))), timeout.timeoutInMilis);
	element(by.css(this.closeSlidingPanelBtnCss)).click().then(function () {
		logger.info("Clicked on close button for sliding panel.");
		browser.wait(EC.invisibilityOf(element(by.css(self.slidingPanelCss))), timeout.timeoutInMilis);
	});
}

/**
 * Method to select Users for team
 * Ex. usersInfo - JSON object to pass UsersInfo [name/emailId] values
 */
userAccess.prototype.selectUserFromDropdown = function (usersInfo) {
	var self = this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.userDropdownXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.userDropdownXpath)).click().then(function () {
		logger.info("Clicked on users dropdown.");
		browser.wait(EC.visibilityOf(element.all(by.xpath(self.userDropdownLabelLinksXpath)).get(0)), timeout.timeoutInMilis);
		element(by.xpath(self.userDropdownInputXpath)).clear().sendKeys(usersInfo.emailId + protractor.Key.ENTER).then(function(){
			logger.info("Searching user name using email ID: " + usersInfo.emailId);
			browser.wait(EC.visibilityOf(element.all(by.xpath(self.userDropdownLabelLinksXpath)).get(0)), timeout.timeoutInMilis);
			element.all(by.xpath(self.userDropdownLabelLinksXpath)).getText().then(async function(userNames){
				for (var i = 0; i < userNames.length; i++) {
					if (userNames[i].includes(usersInfo.name)) {
						await element.all(by.xpath(self.userDropdownLabelLinksXpath)).get(i).click().then(function () {
							logger.info("Clicked on " + usersInfo.name + " from users dropdown list.");
						})
					}
				}
			})
		})
	});
}

/**
 * Method to click on assign users button
 */
userAccess.prototype.clickOnAssignUsersButton = function(){
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(this.userDropdownAssignButtonXpath))), timeout.timeoutInMilis);
	element(by.xpath(this.userDropdownAssignButtonXpath)).click().then(function () {
		logger.info("Clicked on assign button for users dropdown.");
	});
}

/**
 * Method to get added user in the User table on Team details page
 * Ex. usersInfo - JSON object to pass UsersInfo [name/emailId] values for single user
 */
userAccess.prototype.getAssignedUserText = function (usersInfo) {
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element.all(by.css(this.assignedUserTableRowsCss)).get(0)), timeout.timeoutInMilis);
	return element.all(by.css(this.assignedUserTableEmailAddrValuesCss)).getText().then(function(emailIDs){
		var i;
		for (i = 0; i < emailIDs.length; i++) {
			if (usersInfo.emailId == emailIDs[i].trim()) {
				logger.info(usersInfo.name + " user is present");
				return usersInfo.name;
			}
		}
		if(i == emailIDs.length){
			logger.info(usersInfo.name + " user is not present");
		}
	});
}

/**
 * Method to click on search on User access management
 */

 userAccess.prototype.clickOnSearch =async function () {
	var self= this;
	util.waitForAngular();
	browser.wait(EC.visibilityOf(element(by.xpath(self.searchButtonXpath))), timeout.timeoutInMilis);
	await element(by.xpath(self.searchButtonXpath)).click().then(function () {
		logger.info("Clicked on Search button.");
	})
}


/**
 * Method to user has aiops admin role or not
 */

userAccess.prototype.verifyUserHasAiopsAdminrole =async function () {
	await this.open();
	await this.waitForPageLoading();
	await this.clickOnTabLink(userAccessTestData.teams);
	await this.clickOnSearch();
	await this.searchOrgTeamUser("aiops admin");
	var aiopsAdminTeams = await healthObj.getAssociatedAppsTableLabelText(1);
	logger.info('Aiops admin teams are ' + aiopsAdminTeams)
	await launchpadObj.clickOnUserHeaderActionIcon();
	var myTeams = await launchpadObj.getMyTeamsOnProfile(aiopsAdminTeams)
	return myTeams
}

module.exports = userAccess;