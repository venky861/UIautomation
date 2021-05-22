"use strict";
const esManager  =  require('./esManager');
const util = require('../helpers/util');
var logGenerator = require("../helpers/logGenerator.js"),
	logger = logGenerator.getApplicationLogger();

async function application_With_Most_Resources(index,tenant_id){
    const body =
    {
    	 "query": {"bool": {"must": [{"match": {"tenant_id.keyword": tenant_id}}]}},
    	 "aggs":  {"2": {"terms": {"field": "context.application.keyword","order": {"_count": "desc"},"size": 3}}},"size": 0
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"]
    	 var res={}
    	 for(var i in bucket_results){
             var applicationName = bucket_results[i]["key"]
             var applicationCount = bucket_results[i]["doc_count"]
             res[applicationName]=applicationCount
		   } 
		   logger.info("Json obj from es: ", res);
    	 return res
    	 }
    catch(e){
        console.log(e)
    }
}


async function application_With_Most_Active_Resources(index,tenant_id){
    const body =
    {
    	  "query": {"bool": {"filter": [{"term": {"status.keyword": "Active"}},
    		       {"term": {"source_type.keyword": "cloud"}},
    		       {"term": {"tenant_id.keyword": tenant_id}}],"must": []}},
    	  "aggs":  {   "2": {"terms": {"field": "context.application.keyword","order": {"_count": "desc"},"size": 3}}},"size": 0
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"]
    	 var res={}
    	 for(var i in bucket_results){
             var applicationName = await util.getAlphaNumericCharactersFromString(bucket_results[i]["key"])
             var applicationCount = bucket_results[i]["doc_count"]
             res[applicationName]=applicationCount
		   } 
		   logger.info("Json obj from es: ", res);
    	 return res
    	 }
    catch(e){
        console.log(e)
    }
}

async function application_With_EOL_Resources(index,tenant_id){
    const body =
    {
    	 "query": {"bool": {"filter": [{"term": {"eol_status.keyword": "Y"}},{"term": {"tenant_id.keyword": tenant_id}}],"must": []}},
    	 "aggs" : {"2": {"terms": {"field": "context.application.keyword","order": {"_count": "desc"},"size": 3}}}, "size": 0
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"]
    	 var res={}
    	 for(var i in bucket_results){
             var applicationName = bucket_results[i]["key"]
             var applicationCount = bucket_results[i]["doc_count"]
             res[applicationName]=applicationCount
		   } 
		   logger.info("Json obj from es: ", res);
    	 return res
    	 }
    catch(e){
        console.log(e)
    }
}

async function application_Breakdown_Environment(index,tenant_id){
    const body =
    {
    		  "size":  0,"track_total_hits": true,
    		  "query": { "bool": {"must": [{"term": {"tenant_id": { "value": tenant_id } }  },
    		           { "exists": {"field": "context.application.keyword"} } ]} },
    		   "aggs": { "2": {"terms": {"field": "context.environment.keyword","missing": "Others","size": 1000000},
    		   "aggs": { "4": {"terms": {"field": "context.application.keyword","size": 1000000,"order": {"_count": "desc"
    		            } } } } } } }
    try {
        const resp = await esManager.searchDoc(index, body);
      var bucket_results=resp.aggregations["2"]["buckets"]
          res = {}
        for(i in bucket_results){
            var env = bucket_results[i]["key"]
            console.log(bucket_results[i])
            inner_bucket_results=bucket_results[i]["4"]["buckets"]
            resource_output ={}
            for(j in inner_bucket_results){
                resource_name = inner_bucket_results[j]["key"]
                count = inner_bucket_results[j]["doc_count"]
                resource_output[resource_name]=count

            }
            res[env]=resource_output
        }
      return res
    }catch(e){
        console.log(e)
    }
}


/**
 * Method to fetch data centers resources count
 */
async function dataCenter_Resources_count(index,tenant_id){
	var totalCount = 0;
    const body =
    {
    		"query":{"bool":{"must":[{"match":{"tenant_id": tenant_id}},{"match":{"source_type":"DataCenter"}}]}},
    		"aggs":{"2":{"terms":{"field":"service_category.keyword","order":{"_count":"desc"},"size":1000}}},"size":0
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"];
    	 for(var i in bucket_results){
			 var applicationCount = bucket_results[i]["doc_count"];
			 totalCount = totalCount + applicationCount;
      	 } 
    	 logger.info("Elastic Response Data center resources count: ",totalCount);
    	 return totalCount;
    	 }
    catch(e){
        console.log(e);
    }
}


/**
 * Method to fetch multiCloud centers resources count
 */
async function multiCloud_Resources_count(index,tenant_id){
	var totalCount = 0;
    const body =
    {
    		"query":{"bool":{"must":[{"match":{"tenant_id":tenant_id}},{"match":{"source_type":"cloud"}}]}},
    		"aggs":{"2":{"terms":{"field":"type.keyword","order":{"_count":"desc"},"size":1000}}},"size":0
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var bucket_results=resp.aggregations["2"]["buckets"];
    	 for(var i in bucket_results){
			 if(bucket_results[i]["key"] != ""){
				var applicationCount = bucket_results[i]["doc_count"];
				totalCount = totalCount + applicationCount;
			 }
      	 } 
		 logger.info("Elastic Response Multicloud resources count: ",totalCount);
		 return totalCount;
    	 }
    catch(e){
        console.log(e);
    }
}


/**
 * Method to fetch data for untagged resource application category from Resource Tab
 */
async function untagged_Resources_Application_count(index,tenant_id){
    const bodyApplication = 
    {
    		"query":{"bool":{"must":[{"match":{"tenant_id.keyword":tenant_id}}],
    		"must_not":{"exists":{"field":"context.application"}}}},"size":10 
    }
    try {
    	 const resp = await esManager.searchDocWithScroll(index, bodyApplication);
    	 var applicationResultCount = resp.hits["total"]["value"];    	  
    	 logger.info("Elastic Response", applicationResultCount);
    	 return applicationResultCount
    	 }
    catch(e){
        console.log(e)
    }
}

/**
 * Method to fetch data for untagged resource environment category from Resource Tab
 */
async function untagged_Resources_Environment_count(index,tenant_id){
    const body =
    {
    		"query":{"bool":{"must":[{"match":{"tenant_id.keyword":tenant_id}}],
    		"must_not":{"exists":{"field":"context.environment"}}}}
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var environmentResultCount = resp.hits["total"]["value"];    	  
    	 logger.info("Elastic Response", environmentResultCount);
    	 return environmentResultCount
    	 }
    catch(e){
        console.log(e)
    }
}

/**
 * Method to fetch data for untagged resource unmanaged category from Resource Tab
 */
async function untagged_Resources_Unmanaged_count(index,tenant_id){
    const body =
    {
    		"query":{"bool":{"must":[{"term":{"tenant_id.keyword":{"value":tenant_id}}},
    		{"term":{"context.manage.keyword":""}}]}}
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var unmanagedResultCount = resp.hits["total"]["value"];    	  
    	 logger.info("Elastic Response", unmanagedResultCount);
    	 return unmanagedResultCount
    	 }
    catch(e){
        console.log(e)
    }
}


/**
 * Method to fetch data for monitored resource category from Resource Tab
 */
async function monitored_Resources_Counts(index,tenant_id){
    const body =
    {
    		"query":{"bool":{"must":[{"match":{"tenant_id.keyword":tenant_id}}]}},
    		"size":0,"aggs":{"Count":{"terms":{"field":"is_monitored.keyword","size":10}}}
    }
    try {
    	 const resp = await esManager.searchDoc(index, body);
    	 var monitoredResultCount = resp.aggregations["Count"]["buckets"];    	  
    	 var res=[];
    	 var sum = 0;
    	 for(var i in monitoredResultCount){
             var docCount = monitoredResultCount[i]["doc_count"];
             sum = sum + Number(docCount);
             res.push(docCount);
		 }
		 if(sum != 0){
			res.push(sum);
		 }
    	 logger.info("Elastic Response",res);
    	 return res;
    	 }
    catch(e){
        console.log(e)
    }
}

// main function can be used just to execute the query and fecth the response
// instead of complete UI flow whenever required during coding.
/*
 * async function main(){ var response =await
 * application_With_Most_Resources("inventory","5e17ec1a82b7b100012538cc")
 * console.log(response) }
 * 
 * main()
 */

module.exports = {
	    application_With_Most_Resources:application_With_Most_Resources,
		application_With_Most_Active_Resources:application_With_Most_Active_Resources,
		application_With_EOL_Resources:application_With_EOL_Resources,
		application_Breakdown_Environment:application_Breakdown_Environment,
		dataCenter_Resources_count:dataCenter_Resources_count,
		multiCloud_Resources_count:multiCloud_Resources_count,
		untagged_Resources_Application_count:untagged_Resources_Application_count,
		untagged_Resources_Environment_count:untagged_Resources_Environment_count,
		untagged_Resources_Unmanaged_count:untagged_Resources_Unmanaged_count,
		monitored_Resources_Counts:monitored_Resources_Counts
}