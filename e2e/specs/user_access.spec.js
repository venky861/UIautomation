/**
 * Created by : Padmakar Selokar
 * created on : 30/03/2020
 */

"use strict";
var logGenerator = require("../../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger(),
	userAccessPage = require('../pageObjects/user_access.pageObject.js'),
	userAccessTestData = require('../../testData/cards/userAccessTestData.json'),
	launchpadPage = require('../pageObjects/launchpad.pageObject.js'),
	launchpadTestData = require('../../testData/cards/launchpadTestData.json'),
	appUrls = require('../../testData/appUrls.json'),
	util = require('../../helpers/util.js');


describe('User Access Management - Functionality: ', function () {
	var userAccessObj, launchpadObj;
	var orgName = userAccessTestData.newOrgName + util.getRandomString(5);
	var teamName = userAccessTestData.newTeamName + util.getRandomString(5);
	var msgStrings = {
		createOrgSuccessMsgText: userAccessTestData.createOrgSuccessMsgText.format(orgName),
		createOrgErrorMsgText: userAccessTestData.createOrgErrorMsgText.format(orgName),
		createTeamSuccessMsgText: userAccessTestData.createTeamSuccessMsgText.format(teamName),
		createTeamErrorMsgText: userAccessTestData.createTeamErrorMsgText,
		addRoleSuccessMsgText: userAccessTestData.addRoleSuccessMsgText.format(teamName),
		updateRoleSuccessMsgText: userAccessTestData.updateRoleSuccessMsgText,
		addOneUserSuccessMsgText: userAccessTestData.addOneUserSuccessMsgText
	};
	
	beforeAll(function () {
		userAccessObj = new userAccessPage();
		launchpadObj = new launchpadPage();
	});

	beforeEach(function () {
		userAccessObj.open();
		userAccessObj.waitForPageLoading();
	});

	it('Verify User Access Management page url, header title and sub-title', function () {
		expect(userAccessObj.getUserAccessHeaderTitleText()).toEqual(userAccessTestData.title);
		expect(userAccessObj.getUserAccessHeaderSubTitleText()).toEqual(userAccessTestData.subTitle);
		expect(util.getCurrentURL()).toMatch(appUrls.userAccessUrl);
	});

	it('Verify each tab link present on the page', function () {
		expect(userAccessObj.isDisplayTabLink(userAccessTestData.organizationsTabLinkText)).toBe(true);
		expect(userAccessObj.isDisplayTabLink(userAccessTestData.teamsTabLinkText)).toBe(true);
		expect(userAccessObj.isDisplayTabLink(userAccessTestData.usersTabLinkText)).toBe(true);
		expect(userAccessObj.isDisplayTabLink(userAccessTestData.systemUsersTabLinkText)).toBe(true);
		expect(userAccessObj.isDisplayTabLink(userAccessTestData.apiKeyTabLinkText)).toBe(true);
	});

	it('Create a new Organization', function () {
		userAccessObj.clickOnTabLink(userAccessTestData.organizationsTabLinkText);
		userAccessObj.clickOnAddOrganizationButton();
		userAccessObj.fillCreateOrganizationForm(orgName);
		userAccessObj.clickOnCreateOrgFormButton();
		// Validate create organization success msg
		expect(userAccessObj.getCreateOrgNotificationMsgText()).toEqual(msgStrings.createOrgSuccessMsgText);
		userAccessObj.closeSliderNotification();
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnAddOrganizationButton();
		userAccessObj.fillCreateOrganizationForm(orgName);
		userAccessObj.clickOnCreateOrgFormButton();
		// Validate create organization error msg for duplicate org id
		expect(userAccessObj.getCreateOrgNotificationMsgText()).toEqual(msgStrings.createOrgErrorMsgText);
		userAccessObj.closeSliderNotification();
		userAccessObj.searchOrgTeamUser(orgName);
		userAccessObj.waitForPageLoading();
		// Validate if created organization is present in table or not
		expect(userAccessObj.isOrgTeamUserPresent(orgName, userAccessTestData.idColumnName)).toEqual(orgName);
	});

	it('Create new team and adding "IT Ops Manager" role, with Landing context as "ALL"', function () {
		// Assigned org value on run time
		userAccessTestData["businessEntity"]["value"] = orgName;
		userAccessObj.clickOnTabLink(userAccessTestData.teamsTabLinkText);
		userAccessObj.waitForTableDataLoading();
		userAccessObj.clickOnAddTeamButton();
		userAccessObj.fillCreateTeamForm(teamName, orgName);
		userAccessObj.clickOnCreateTeamFormButton();
		userAccessObj.waitForPageLoading();
		// Validate create team success msg
		expect(userAccessObj.getCreateTeamNotificationMsgText()).toEqual(msgStrings.createTeamSuccessMsgText);
		userAccessObj.clickOnBreadcrumbLink(userAccessTestData.teamsTabLinkText);
		userAccessObj.waitForTableDataLoading();
		userAccessObj.clickOnAddTeamButton();
		userAccessObj.fillCreateTeamForm(teamName, orgName);
		userAccessObj.clickOnCreateTeamFormButton();
		// Validate create team error msg for duplicate team code
		expect(userAccessObj.getCreateTeamNotificationMsgText()).toEqual(msgStrings.createTeamErrorMsgText);
		userAccessObj.clickOnCreateTeamFormCancelButton();
		userAccessObj.waitForTableDataLoading();
		userAccessObj.searchOrgTeamUser(teamName);
		userAccessObj.waitForTableDataLoading();
		// Validate if created team is present in table or not
		expect(userAccessObj.isOrgTeamUserPresent(teamName, userAccessTestData.idColumnName)).toBe(teamName);
		userAccessObj.clickOnShowActionsIconForTableRows(teamName);
		userAccessObj.clickOnViewDetailsActionButton(teamName);
		userAccessObj.waitForPageLoading();
		// Validate team name header on team details page
		expect(userAccessObj.getTeamDetailsPageHeaderText()).toEqual(teamName);
		userAccessObj.clickOnAddRoleButton();
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnRoleDropdown();
		userAccessObj.selectRoleFromDropdown(userAccessTestData.roleName);
		userAccessObj.waitForPageLoading();
		userAccessObj.addBusinessEntityToRole(userAccessTestData.businessEntity);
		userAccessObj.clickOnAddRoleFormButton();
		// Validate add role success message
		expect(userAccessObj.getTempNotificationMsgText()).toEqual(msgStrings.addRoleSuccessMsgText);
		userAccessObj.waitForPageLoading();
		// Validate added role on team details page
		expect(userAccessObj.getAssignedRoleText(userAccessTestData.roleName)).toEqual(userAccessTestData.roleName);
		userAccessObj.clickOnOptionsButtonForRole(userAccessTestData.roleName);
		userAccessObj.clickOnViewDetailsButtonForRole(userAccessTestData.roleName);
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnEditRoleContextButton();
		userAccessObj.waitForPageLoading();
		userAccessObj.clearRoleContextSelection(userAccessTestData.roleContext[0].context);
		userAccessObj.addContextToTeamRole(userAccessTestData.roleContext[0].context);
		userAccessObj.clickOnUpdateRoleContextButton();
		// Validate update role context success message
		// expect(userAccessObj.getTempNotificationMsgText()).toEqual(msgStrings.updateRoleSuccessMsgText);
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnCloseSlidingPanelBtn();
		userAccessObj.waitForTableDataLoading();
		userAccessObj.selectUserFromDropdown(userAccessTestData.newUser);
		userAccessObj.clickOnAssignUsersButton();
		// Validate add user success message
		// expect(userAccessObj.getTempNotificationMsgText()).toEqual(msgStrings.addOneUserSuccessMsgText);
		userAccessObj.waitForTableDataLoading();
		// Validate added user on team details page
		expect(userAccessObj.getAssignedUserText(userAccessTestData.newUser)).toEqual(userAccessTestData.newUser.name);
	});

	xit('Logout from current user and logged in as new user', function () {
		launchpadObj.clickOnUserHeaderActionIcon();
		launchpadObj.clickOnLogoutButton();
		expect(launchpadObj.getTextLogoutMessage()).toEqual(launchpadTestData.logoutSuccessMsg);
		util.deleteAllCookies();
		// Login with new user
		ensureAiopsHome(userAccessTestData.newUserName, userAccessTestData.newUserPassword);
	});

	it('Edit "IT Ops Manager" role, with landing context as "Inventory" & "Actionable Insights"', function () {
		userAccessObj.clickOnTabLink(userAccessTestData.teamsTabLinkText);
		userAccessObj.waitForTableDataLoading();
		userAccessObj.searchOrgTeamUser(teamName);
		userAccessObj.waitForTableDataLoading();
		// Validate if created team is present in table or not
		expect(userAccessObj.isOrgTeamUserPresent(teamName, userAccessTestData.idColumnName)).toBe(teamName);
		userAccessObj.clickOnShowActionsIconForTableRows(teamName);
		userAccessObj.clickOnViewDetailsActionButton(teamName);
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnOptionsButtonForRole(userAccessTestData.roleName);
		userAccessObj.clickOnViewDetailsButtonForRole(userAccessTestData.roleName);
		userAccessObj.waitForPageLoading();
		// Validate added role on team details page
		expect(userAccessObj.getAssignedRoleText(userAccessTestData.roleName)).toEqual(userAccessTestData.roleName);
		userAccessObj.clickOnEditRoleContextButton();
		userAccessObj.waitForPageLoading();
		userAccessObj.clearRoleContextSelection(userAccessTestData.roleContext[1].context);
		userAccessObj.addContextToTeamRole(userAccessTestData.roleContext[1].context);
		userAccessObj.clickOnUpdateRoleContextButton();
		// Validate update role context success message
		// expect(userAccessObj.getTempNotificationMsgText()).toEqual(msgStrings.updateRoleSuccessMsgText);
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnCloseSlidingPanelBtn();
	});

	it('Edit "IT Ops Manager" role, with no landing context', function () {
		userAccessObj.clickOnTabLink(userAccessTestData.teamsTabLinkText);
		userAccessObj.waitForTableDataLoading();
		userAccessObj.searchOrgTeamUser(teamName);
		userAccessObj.waitForTableDataLoading();
		// Validate if created team is present in table or not
		expect(userAccessObj.isOrgTeamUserPresent(teamName, userAccessTestData.idColumnName)).toBe(teamName);
		userAccessObj.clickOnShowActionsIconForTableRows(teamName);
		userAccessObj.clickOnViewDetailsActionButton(teamName);
		userAccessObj.waitForPageLoading();
		// Validate added role on team details page
		expect(userAccessObj.getAssignedRoleText(userAccessTestData.roleName)).toEqual(userAccessTestData.roleName);
		userAccessObj.clickOnOptionsButtonForRole(userAccessTestData.roleName);
		userAccessObj.clickOnViewDetailsButtonForRole(userAccessTestData.roleName);
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnEditRoleContextButton();
		userAccessObj.waitForPageLoading();
		userAccessObj.clearRoleContextSelection(userAccessTestData.roleContext[2].context);
		userAccessObj.addContextToTeamRole(userAccessTestData.roleContext[2].context);
		userAccessObj.clickOnUpdateRoleContextButton();
		// Validate update role context success message
		// expect(userAccessObj.getTempNotificationMsgText()).toEqual(msgStrings.updateRoleSuccessMsgText);
		userAccessObj.waitForPageLoading();
		userAccessObj.clickOnCloseSlidingPanelBtn();
	});
});