"use strict";

var es=require('elasticsearch');
var creds = require('../testData/env.json');
var esHostName = browser.params.esHostName;

const esClient = new es.Client(
    { 
    	host: `${esHostName}`,
        // log:'trace'
    }
    )

const searchDoc = async function(indexName, payload){
    return await esClient.search({
        index: indexName,
        body: payload
    });
}

const searchDocWithScroll = async function(indexName, payload){
    return await esClient.search({
        // Keep the search results "scrollable" for 30 seconds
        scroll: '30s',
        index: indexName,
        body: payload
    });
}

const sqlSearch = async function(payload){
    return await esClient.transport.request({
        path: "_sql",
        body: payload
    });
}
module.exports = {
    searchDoc:searchDoc,
    searchDocWithScroll:searchDocWithScroll,
    sqlSearch:sqlSearch
};
