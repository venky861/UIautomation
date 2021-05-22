/**
 * Created by : Pushpraj
 * created on : 19/03/2020
 */
"use strict";
var request = require('request');
var logGenerator = require("./logGenerator.js"),
    logger = logGenerator.getApplicationLogger();
var testData = require("./testData.js");    
var client = require('node-rest-client').Client;
var apiCreds = require('../testData/env.json');
var util = require("./util.js");
var userId = browser.params.userId;
var apiKey = browser.params.apiKey;
var tenantId = browser.params.tenantId;
var endpoint_url = browser.params.apiUrl;


/**
 * Function to get sunrise report card details based on input provided
 * @ticket it's input parameter to pass as p1Tickets, p2Tickets, p3Tickets
 * @attribute it's input parameter to pass as created, resolved
 */
async function getSunRiseReportCardDetails(ticket, attribute) {
	let sunriseCard_url = `${endpoint_url}${testData.DAILY_SUNRISE_REPORT_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the sunrise report card details :: ", sunriseCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", sunriseCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    //let fetch_resp = JSON.parse(JSON.stringify(resp));
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp:: ", fetch_resp);
    var fetch_total = fetch_resp.MESSAGE.sunrise.total;  
    for (var ticketKey in fetch_total) {
        //logger.info("Ticket value",fetch_total[ticketKey]);
        if(ticketKey == ticket){
        	var ticketValue = fetch_total[ticketKey];
        	for (var attributeKey in ticketValue) {
        		if(attributeKey == attribute){
        			logger.info(ticket +" "+attribute+ " Attribute value",ticketValue[attributeKey]);
        			var attributeValue = ticketValue[attributeKey];
        			if(attributeValue.toString().length >= 4){
        				attributeValue = (parseFloat(attributeValue/1000)).toFixed(1);
        				logger.info("Attribute fixed value : ", attributeValue);
        			}
        			return Number(attributeValue);
        		}
        	}
        }
    }
}


/**
 * Function to get incident management card details based on input provided
 * @dateTime it's input parameter to pass as dateTime : Feb 20, Mar 20 etc 
 * @attribute it's input parameter to pass as created, resolved
 */
async function getIncidentManagementCardDetails(attribute, dateTime) {
	let incidentManagentCard_url = `${endpoint_url}${testData.INCIDENT_MANAGEMENT_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the incident management card details :: ", incidentManagentCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", incidentManagentCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_incident = fetch_resp.MESSAGE.incident;  
    for(var i = 0; i< fetch_incident.length; i++){
    	//logger.info("fetch_incident["+i+"]  "+ attribute, fetch_incident[i]);
    	for(var key in fetch_incident[i]){
    		if(key == attribute){
    			var attributeKey = fetch_incident[i][key];
    			for(var j=0; j < attributeKey.length; j++){
    				//logger.info("attributeKey[j].dateTime", attributeKey[j].dateTime);
    				if(attributeKey[j].dateTime == dateTime){
    					var tickets = attributeKey[j].tickets;
    					logger.info("tickets: ", tickets);
    					return Number(tickets);
    				}
    			}
    		}
    	}
    }
}


/**
 * Function to get problem management card details based on input provided
 * @dateTime it's input parameter to pass as dateTime : Feb 20, Mar 20 etc 
 * @attribute it's input parameter to pass as created, resolved
 */
async function getProblemManagementCardDetails(attribute, dateTime) {
	let problemManagentCard_url = `${endpoint_url}${testData.PROBLEM_MANAGEMENT_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the problem management card details :: ", problemManagentCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", problemManagentCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_problem = fetch_resp.MESSAGE.problem;  
    for(var i = 0; i< fetch_problem.length; i++){
    	for(var key in fetch_problem[i]){
    		if(key == attribute){
    			var attributeKey = fetch_problem[i][key];
    			for(var j=0; j < attributeKey.length; j++){
    				//logger.info("attributeKey[j].dateTime", attributeKey[j].dateTime);
    				if(attributeKey[j].dateTime == dateTime){
    					var tickets = attributeKey[j].tickets;
    					logger.info("tickets: ", tickets);
    					return Number(tickets);
    				}
    			}
    		}
    	}
    }
}


/**
 * Function to get change management card details based on input provided
 * @dateTime it's input parameter to pass as dateTime : Feb 20, Mar 20 etc 
 * @attribute it's input parameter to pass as created, resolved
 */
async function getChangeManagementCardDetails(attribute, dateTime) {
	let changeManagentCard_url = `${endpoint_url}${testData.CHANGE_MANAGEMENT_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the change management card details :: ", changeManagentCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", changeManagentCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_problem = fetch_resp.MESSAGE.change;  
    for(var i = 0; i< fetch_problem.length; i++){
    	for(var key in fetch_problem[i]){
    		if(key == attribute){
    			var attributeKey = fetch_problem[i][key];
    			for(var j=0; j < attributeKey.length; j++){
    				//logger.info("attributeKey[j].dateTime", attributeKey[j].dateTime);
    				if(attributeKey[j].dateTime == dateTime){
    					var tickets = attributeKey[j].tickets;
    					logger.info("tickets: ", tickets);
    					return Number(tickets);
    				}
    			}
    		}
    	}
    }
}


/**
 * Function to get pervasive insights card details based on input provided
 * @hostName is parameter passed to get the total tickets count for last 30 days 
 */
async function getPervasiveInsightsCardDetails(hostName) {
	let pervasiveInsightsCard_url = `${endpoint_url}${testData.PERVASIVE_INSIGHTS_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the pervasive insights card details :: ", pervasiveInsightsCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", pervasiveInsightsCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_pervasive = fetch_resp.MESSAGE.pervasive;  
    for(var i = 0; i< fetch_pervasive.length; i++){
		if(fetch_pervasive[i].hostname == hostName){
            var ticketsValue = util.kFormatterWithoutK(fetch_pervasive[i].tickets);
			logger.info("Tickets for hostname "+hostName + " is : ", ticketsValue);
			return ticketsValue;
		}
    }
}


/**
 * Function to get actionable insights card details based on input provided
 * @index is parameter passed to get the title
 * this method return total count of actionable insights and title for provided index
 */
async function getActionableInsightsCardDetails(index) {
	let actinableInsightsCard_url = `${endpoint_url}${testData.ACTIONABLE_INSIGHTS_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the actionable insights card details :: ", actinableInsightsCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", actinableInsightsCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_actionableInsight = fetch_resp.MESSAGE.actionableInsights;  
    //logger.info("fetch_resp.length :: ", fetch_actionableInsight.length);
    var obj = {"count" : 0};
    for(var i = 0; i< fetch_actionableInsight.length; i++){
    	//logger.info("fetch_actionableInsight["+i+"].title : ", fetch_actionableInsight[i].title);
    	if(i == index){
    		obj["title"] = fetch_actionableInsight[i].title;
    		obj["count"] = fetch_actionableInsight.length;
    		return obj;
    	}
    }
    return obj;
}


/**
 * Function to get alerts card details based on input provided
 * @index is parameter passed to get the title
 * this method return total count of alerts card and title for provided index
 */
async function getAlertsCardDetails(index) {
	let alertsCard_url = `${endpoint_url}${testData.ALERT_DETAILS_API_URL}${tenantId}`;
    logger.info("URL to fetch the alerts card details :: ", alertsCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", alertsCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_alertsDC = fetch_resp.MESSAGE.convergedAlert.dataCenter;  
    logger.info("fetch_alertsDC.length :: ", fetch_alertsDC.length);
    var obj = {"count" : 0};
    for(var i = 0; i< fetch_alertsDC.length; i++){
    	logger.info("fetch_alertsDC["+i+"].title : ", fetch_alertsDC[i].title);
    	if(i == index){
    		obj["title"] = fetch_alertsDC[i].title;
    		obj["count"] = fetch_alertsDC.length;
    		return obj;
    	}
    }
    return obj;
}


/**
 * Function to get health card details count based on input provided
 * @key is parameter passed to get the value i.e. : critical, warning, healthy, high, medium, low
 * @headerKey is top parameter to get the different set of array i.e. convergedHealth, convergedOpenTicket
 * this method return total count of health card for provided key
 */
async function getHealthCardDetails(headerKey, key) {
	let healthCard_url = `${endpoint_url}${testData.HEALTH_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the health card details :: ", healthCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", healthCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);
    var fetch_Total;
    if(headerKey  == "convergedHealth"){
    	fetch_Total = fetch_resp.MESSAGE.convergedHealth.total;  
    }else if (headerKey  == "convergedOpenTicket"){
    	fetch_Total = fetch_resp.MESSAGE.convergedOpenTicket.total;  
    }    
    logger.info("fetch_Total :: ", fetch_Total);
    for(var childKey in fetch_Total){
		if(childKey == key){
			logger.info(key+" value", fetch_Total[childKey]);
			return fetch_Total[childKey];
		}
	}
}


/**
 * Function to get Inventory card details count based on input provided
 * @providerType is parameter passed to get the value i.e. : dataCenter, multiCloud
 * this method return total count of inventory card for provided key
 */
async function getInventoryCardDetails(providerType) {
	let inventoryCard_url = `${endpoint_url}${testData.INVENTORY_CARD_API_URL}${tenantId}`;
    logger.info("URL to fetch the inventory card details :: ", inventoryCard_url);
    let inputToRestClient = await prepareRestClientInputObject("GET", inventoryCard_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(resp);
    //logger.info("fetch_resp :: ", fetch_resp);    
    var fetch_inventory = fetch_resp.MESSAGE.convergedInventory;      
    logger.info("fetch_inventory :: ", fetch_inventory);
    for(var childKey in fetch_inventory){
    	//logger.info(providerType+" value", fetch_inventory[childKey]);
		if(childKey == providerType){
			var childJson = fetch_inventory[childKey];
			var count = 0;
			for(var i=0; i< childJson.length; i++){
				count = count + childJson[i].doc_count;
				logger.info("count : ", count);
			}
			return count
		}
	}
}


/**
 * Function to prepare the input data for restClient method
 */
function prepareRestClientInputObject(http_method, url, data, content_type) {
    let options = {
        headers: {
            'Content-Type': `application/${content_type}`,
            'Accept': `application/${content_type}`,
            'Username': userId,
            'Apikey': apiKey
        },
        method: http_method,
        url: url
    }
    if (http_method != 'GET')
        options.body = data;
    return options;
}


/**
 * Function to create the connection and fetch the response
 */
async function restClient(options, callback) {
    return new Promise(function (resolve, reject) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
        request(options, function (error, response, body) {
            logger.info(response.statusCode)            
            if (error)            	
                return reject(error);
            if (response.statusCode == 200)
                return resolve(body);
            logger.error("response.body code : "+response.body);
            //return reject(createError(response.statusCode, response.body));
            return reject("Error code : "+response.statusCode +" and body response : "+ response.body);
        });
    });
}


module.exports = {
	getSunRiseReportCardDetails : getSunRiseReportCardDetails,
	getIncidentManagementCardDetails : getIncidentManagementCardDetails,
	getProblemManagementCardDetails : getProblemManagementCardDetails,
	getChangeManagementCardDetails : getChangeManagementCardDetails,
	getPervasiveInsightsCardDetails : getPervasiveInsightsCardDetails,
    getActionableInsightsCardDetails : getActionableInsightsCardDetails,
    getAlertsCardDetails : getAlertsCardDetails,
    getHealthCardDetails : getHealthCardDetails,
    getInventoryCardDetails : getInventoryCardDetails,
    prepareRestClientInputObject : prepareRestClientInputObject,
    restClient : restClient
};
