/**
 * Created by : Pushpraj
 * created on : 14/02/2020
 */
"use strict";
var request = require('request');
var logGenerator = require("./logGenerator.js"),
    logger = logGenerator.getApplicationLogger();
var testData = require("./testData.js");    
var client = require('node-rest-client').Client;

/**
 * Function to get passcode for google authentication
 */
async function getGoogleAuthPassCode(secretKey) {
    let passcode_url = `${testData.GENERATE_PASS_CODE_URL}${secretKey}`;
    logger.info("URL to fetch the passcode :: ", testData.GENERATE_PASS_CODE_URL);
    let inputToRestClient = await prepareRestClientInputObject("GET", passcode_url, null, 'json');
    let resp = await restClient(inputToRestClient);
    let fetch_resp = JSON.parse(JSON.stringify(resp));
    logger.info("fetch_resp:: ", fetch_resp);			
    let splitStr = fetch_resp.split(":")[1];
    logger.info("response passCode::", splitStr);
    let passCode = splitStr.toString().replace(/[^0-9.]/g, '');
    logger.info("passCode : ", passCode);
    return passCode;
}
    

/**
 * Function to prepare the input data for restClient method
 */
async function prepareRestClientInputObject(http_method, url, data, content_type) {
    let options = {
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
            return reject(createError(response.statusCode, response.body));
        });
    });
}


module.exports = {
    getGoogleAuthPassCode : getGoogleAuthPassCode,
    prepareRestClientInputObject : prepareRestClientInputObject,
    restClient : restClient
};
