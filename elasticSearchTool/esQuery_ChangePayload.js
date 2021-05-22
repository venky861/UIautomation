"use strict";
const searchDoc  =  require('./esManager')
const esManager  =  require('./esManager');
const util = require('../helpers/util');
var logGenerator = require("../helpers/logGenerator"),
	logger = logGenerator.getApplicationLogger();


async function getCreatedChangesCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS)"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Created changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getClosedChangesCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= now()-INTERVAL "+days+" DAYS and CREATED < now() AND UCASE(STATUS_CD) IN ('CLOSED')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Closed changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getImplementedChangesCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CREATED >= (now()-INTERVAL "+days+" DAYS)"
        +" AND STATUS_CD IN ('IN PROGRESS','CLOSED','REVIEW','READY TO DEPLOY') AND SCHED_FINISH_DTTM <= now()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Implemented changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getBacklogChangesCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND UCASE(STATUS_CD) IN ('IN PROGRESS','REVIEW') AND SCHED_FINISH_DTTM < now()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Backlog changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getOpenPendingCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND STATUS_CD IN ('AUTHORIZE','ASSESS','DRAFT')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Count of Open pending for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getFSCon72HrsCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CREATED >= (now()-INTERVAL "+days+" DAYS) "
        +"and CREATED < now() and STATUS_CD IN ('ASSESS','AUTHORIZE','DRAFT','IN PROGRESS','READY TO DEPLOY','REVIEW') and "
        +"PLAN_ST_DTTM < (now()+INTERVAL 3 DAYS) and PLAN_ST_DTTM > now()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Count of FSC on 72 hrs for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeTypeExpedictedCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') " +
        "AND SCHED_FINISH_DTTM <= now() and CHANGE_TYPE_CD IN ('NORMAL - EXPEDITED')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Change Type : Expedicted for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeTypeEmergencyCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') " +
        "AND SCHED_FINISH_DTTM <= now() and CHANGE_TYPE_CD IN ('EMERGENCY')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Change Type : Emergency for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeTypeStandardCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') " +
        "AND SCHED_FINISH_DTTM <= now() and CHANGE_TYPE_CD IN ('STANDARD BAU', 'STANDARD')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Change Type : Standard for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeTypeNormalCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') " +
        "AND SCHED_FINISH_DTTM <= now() and CHANGE_TYPE_CD IN ('NORMAL')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Change Type : Normal for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT CHANGE_TYPE_CD, count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') " +
        "AND SCHED_FINISH_DTTM < now() group by CHANGE_TYPE_CD"
    }
    try {
        const res = await esManager.sqlSearch(body);
        var changeCount = [];
        var total=0
        if (res && res.rows){
            res.rows.forEach(function (item){
            	total=total+item[1];
             });
        }
        if (res && res.rows){
            res.rows.forEach(function (item){
            	changeCount[item[0].replace(/[^a-z]/gi, '')] = Math.round((item[1]*100)/total);
            });
        }
        logger.info("Change count from ES Query : ",changeCount);
        return changeCount;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getUnauthorisedCount(index,tenant_id){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CREATED >= (now()-INTERVAL 210 DAYS) "
        +"AND CREATED < now() AND SCHED_FINISH_DTTM <= now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') "
        +"AND CMPLTN_CODE_CD = 'UNAUTHORIZED'"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Count of Unauthorised : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getUnauthorisedOthersCount(index,tenant_id){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CREATED >= (now()-INTERVAL 210 DAYS) "
        +"AND CREATED < now() AND SCHED_FINISH_DTTM <= now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') "
        +"AND CMPLTN_CODE_CD != 'UNAUTHORIZED'"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Count of Unauthorised Others : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getFailedChangeCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CREATED >= (now()-INTERVAL "+days+" DAYS) "
        +"AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') AND SCHED_FINISH_DTTM <= now() "
        +"AND CMPLTN_CODE_CD IN ('BACKED OUT','INCOMPLETE','INSTALLED WITH ISSUES','ISSUES','OVER RAN','UNAUTHORIZED')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Failed changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getSuccessChangeCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CREATED >= (now()-INTERVAL "+days+" DAYS) "
        +"AND CREATED < now() AND STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') AND SCHED_FINISH_DTTM <= now() "
        +"AND CMPLTN_CODE_CD NOT IN ('BACKED OUT','INCOMPLETE','INSTALLED WITH ISSUES','ISSUES','OVER RAN','UNAUTHORIZED')"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Success changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeStatusCount(index,tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,STATUS_CD FROM ${index} WHERE TENANT_ID='${tenant_id}' and CREATED >= (now()-INTERVAL 210 DAYS) `
        +`and CREATED < now() and STATUS_CD is not null group by STATUS_CD order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let changeStatusObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    changeStatusObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Change Status JSON Obj: ", changeStatusObj);
        return changeStatusObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function getClosureCodesCount(index,tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,CMPLTN_CODE_CD FROM ${index} WHERE TENANT_ID='${tenant_id}' and CREATED >= (now()-INTERVAL 210 DAYS) `
        +`and CREATED < now() and CMPLTN_CODE_CD is not null group by CMPLTN_CODE_CD order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let closureCodesObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    closureCodesObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Closure codes JSON Obj: ", closureCodesObj);
        return closureCodesObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function getChangeAgingBucketCount(index,tenant_id,firstCellValueList){
    var totalCountList = [];
    var body = ``;
    var to_days = "";
    var from_days = "";
    // Loop to traverse through each row filter
    for(var i=0; i<firstCellValueList.length; i++){
        var rowCountList = [];
        if(firstCellValueList[i] == "Above 60 Days"){
            from_days = firstCellValueList[i].split(" ")[1];
            to_days = "210";
        }
        else{
            var daysRange = firstCellValueList[i].split(" ")[0];
            from_days =  util.stringToInteger(daysRange.split("-")[0]) - 1;
            to_days = util.stringToInteger(daysRange.split("-")[1]);
        }
        logger.info("From days: ", from_days);
        logger.info("To days: ", to_days);
        if(from_days > 0){
            body = `{"query":"SELECT COUNT(*) AS CNT,STATUS_CD FROM ${index} WHERE TENANT_ID='${tenant_id}' and `
                +`CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and REQUEST_DTTM < (now()-INTERVAL ${from_days} DAYS) and `
                +`REQUEST_DTTM >= (now()-INTERVAL ${to_days} DAYS) and STATUS_CD IN ('IN PROGRESS','REVIEW') group by STATUS_CD"}`;
        }
        else{
            body = `{"query":"SELECT COUNT(*) AS CNT,STATUS_CD FROM ${index} WHERE TENANT_ID='${tenant_id}' and `
                +`CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and REQUEST_DTTM >= (now()-INTERVAL ${to_days} DAYS) and `
                +`STATUS_CD IN ('IN PROGRESS','REVIEW') group by STATUS_CD"}`;
        }
        try {
                const resp = await esManager.sqlSearch(body);
                var cellValues = resp.rows;
                for(var j=0; j<cellValues.length; j++){
                    // Dont push, if status-code is null
                    if(cellValues[j][1] != null){
                        rowCountList.push(cellValues[j][0]);
                    }
                }
                logger.info("Row count list for '"+firstCellValueList[i]+"' is :", rowCountList);
                // After completing list for a row filter, pushing it to the list to create nested list
                totalCountList.push(rowCountList);
            }
       catch(e){
           logger.info(e);
       }
    }
    logger.info("Total count list for ES Query :", totalCountList);
    return totalCountList;
}

async function getTotalChangeTypeCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() AND UCASE(STATUS_CD) IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') " +
        "AND SCHED_FINISH_DTTM < now()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Total changes for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getExceptionReasonCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT case when EXCEPTION_REASON='null' then 'Missing' else EXCEPTION_REASON end as EXCEPTION_REASON,count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() group by EXCEPTION_REASON"
    }
    try {
        const res = await esManager.sqlSearch(body);
        var exceptions = {};
        var total=0
        if (res && res.rows){
            res.rows.forEach(function (item){
            	total=total+item[1];
             });
        }
        if (res && res.rows){
            res.rows.forEach(function (item){
            	exceptions[item[0]]=Math.round((item[1]*100)/total);
                });
        }
        logger.info("Exceptions count from ES Query: ", exceptions);
        return exceptions;
   	 }
    catch(e){
        logger.info(e);
    }
}

async function getTotalExceptionReasonCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Count of Total Exception Reason for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getTop25AssignmentGroup(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(1) as CNT,ASSIGNEE_GROUP_CD FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() group by ASSIGNEE_GROUP_CD having CNT>1 order by CNT desc limit 25" 
    }
    try {
        const res = await esManager.sqlSearch(body);
        var assignmentGroup = [];
        if (res && res.rows){
            res.rows.forEach(function (item){
                if(item[1] != null){
                    assignmentGroup.push(item[1]);
                }
            });
        }
        logger.info("Top 25 Assignment Group JSON Obj: ", assignmentGroup);
        return assignmentGroup;
        }
    catch(e){
        logger.info(e);
    }
}

async function getOpcoView(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(1) as CNT,COMPANY FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() group by COMPANY having CNT>1 order by CNT desc limit 50"
    }
    try {
        const res = await esManager.sqlSearch(body);
        var opcoView = [];
        if (res && res.rows){
            res.rows.forEach(function (item){
                if(item[1] != null){
                    opcoView.push(item[1]);
                }
            });
        }
        logger.info("OpCo View JSON Obj: ", opcoView);
        return opcoView;
        }
    catch(e){
        logger.info(e);
    }
}

async function getCategoryView(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(1) as CNT,CATEGORY_CD FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() group by CATEGORY_CD having CNT>1 order by CNT desc limit 25"
    }
    try {
        const res = await esManager.sqlSearch(body);
        var categoryView = [];
        if (res && res.rows){
            res.rows.forEach(function (item){
                if(item[1] != null){
                    categoryView.push(item[1]);
                }
            });
        }
        logger.info("Category View JSON Obj: ", categoryView);
        return categoryView;
        }
    catch(e){
        logger.info(e);
    }
}

async function getTop25StreetAddress(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as CNT,PERSON_STREET_ADDRESS FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() group by PERSON_STREET_ADDRESS order by CNT desc limit 25" 
    }
    try {
        const res = await esManager.sqlSearch(body);
        var streetAddress = [];
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for null and empty string
                if(!(item[1] == null || item[1] == '')){
                    streetAddress.push(item[1].replace(/(\r\n|\n|\r)/gm, " ").replace(/  +/g, ' '));
                }
            });
        }
        logger.info("Street Addresses from ES query: "+ streetAddress);
        return streetAddress;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getTop25SiteIds(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(*) as CNT,PERSON_SITE_ID FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and CREATED >= (now()-INTERVAL "+days+" DAYS) AND CREATED < now() group by PERSON_SITE_ID order by CNT desc limit 25"
    }
    try {
        const res = await esManager.sqlSearch(body);
        var siteIds = [];
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for null and empty string
                if(!(item[1] == null || item[1] == '')){
                    siteIds.push(item[1]);
                }
            });
        }
        logger.info("Site IDs from ES query: "+ siteIds);
        return siteIds;
    	 }
    catch(e){
        logger.info(e);
    }
}

async function getChangeRiskCount(index, tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,RISK_CODE_CD FROM ${index} WHERE TENANT_ID='${tenant_id}' and `
        +`CREATED >= (now()-INTERVAL 210 DAYS) AND CREATED < now() and RISK_CODE_CD != '' group by RISK_CODE_CD order by RISK_CODE_CD desc limit 5"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let changeRiskObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                changeRiskObj[item[1]]=item[0];
            });
        }
        logger.info("Change Risk JSON Obj: ", changeRiskObj);
        return changeRiskObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function getChangeTypeCount(index, tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,CHANGE_TYPE_CD FROM ${index} WHERE TENANT_ID='${tenant_id}' and `
        +`CREATED >= (now()-INTERVAL 210 DAYS) AND CREATED < now() and SCHED_FINISH_DTTM <= now() and STATUS_CD IN ('WORK IN PROGRESS','INPRG','CLOSED','REVIEW','READY TO DEPLOY') `
        +`and CHANGE_TYPE_CD != '' group by CHANGE_TYPE_CD order by CHANGE_TYPE_CD desc limit 5"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let changeTypeObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                changeTypeObj[item[1]]=item[0];
            });
        }
        logger.info("Change Type JSON Obj: ", changeTypeObj);
        return changeTypeObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function getServiceLineCount(index, tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,PARENT FROM ${index} WHERE TENANT_ID='${tenant_id}' and CREATED >= (now()-INTERVAL 210 DAYS) `
        +`and CREATED < now() and PARENT is not null group by PARENT order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let serviceLineObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    serviceLineObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Service Line JSON Obj: ", serviceLineObj);
        return serviceLineObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function getCreatedChangeTrendCount(index, tenant_id, xAxisLabels){
    const body = `{"query":"SELECT COUNT(*) AS CNT,YEAR_MONTH_CREATED FROM ${index} WHERE TENANT_ID='${tenant_id}'`
        +` and CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and YEAR_MONTH_CREATED is not null group by YEAR_MONTH_CREATED"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let createdChangeTrendObj = {};
        for(var i = 0; i < xAxisLabels.length; i++){
            if (res && res.rows){
                res.rows.forEach(function (item){
                    if(xAxisLabels[i].includes(item[1])){
                        createdChangeTrendObj[item[1]]=item[0];
                    }
                });
            }
        }
        logger.info("Created Change Trend JSON Obj: ", createdChangeTrendObj);
        return createdChangeTrendObj;
    }
    catch (e) {
        console.log(e);
    }
}

async function getClosedChangeTrendCount(index, tenant_id, xAxisLabels){
    const body = `{"query":"SELECT COUNT(*) AS CNT,YEAR_MONTH_CLOSED FROM ${index} WHERE TENANT_ID='${tenant_id}'`
        +` and CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and YEAR_MONTH_CLOSED is not null group by YEAR_MONTH_CLOSED"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let closedChangeTrendObj = {};
        for(var i = 0; i < xAxisLabels.length; i++){
            if (res && res.rows){
                res.rows.forEach(function (item){
                    if(xAxisLabels[i].includes(item[1])){
                        closedChangeTrendObj[item[1]]=item[0];
                    }
                });
            }
        }
        logger.info("Closed Change Trend JSON Obj: ", closedChangeTrendObj);
        return closedChangeTrendObj;
    }
    catch (e) {
        console.log(e);
    }
}

async function getCreatedChangeWeeklyTrendCount(index, tenant_id, xAxisLabels){
    const body = `{"query":"SELECT COUNT(*) AS CNT,CREATED_WEEK FROM ${index} WHERE TENANT_ID='${tenant_id}'`
        +` and CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and CREATED_WEEK is not null group by CREATED_WEEK"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let createdChangeWeeklyTrendObj = {};
        var xAxisLabelsInt = xAxisLabels.map(Number);
        for(var i = 0; i < xAxisLabelsInt.length; i++){
            if (res && res.rows){
                res.rows.forEach(function (item){
                    if(xAxisLabelsInt.includes(item[1])){
                        if(item[0] != '0'){
                            createdChangeWeeklyTrendObj[item[1]]=item[0];
                        }
                    }
                });
            }
        }
        logger.info("Created Change Weekly Trend JSON Obj: ", createdChangeWeeklyTrendObj);
        return createdChangeWeeklyTrendObj;
    }
    catch (e) {
        console.log(e);
    }
}

async function getClosedChangeWeeklyTrendCount(index, tenant_id, xAxisLabels){
    const body = `{"query":"SELECT COUNT(*) AS CNT,CLOSED_WEEK FROM ${index} WHERE TENANT_ID='${tenant_id}'`
        +` and CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and CLOSED_WEEK is not null group by CLOSED_WEEK"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let closedChangeWeeklyTrendObj = {};
        var xAxisLabelsInt = xAxisLabels.map(Number);
        for(var i = 0; i < xAxisLabelsInt.length; i++){
            if (res && res.rows){
                res.rows.forEach(function (item){
                    if(xAxisLabelsInt.includes(item[1])){
                        if(item[1] != '0'){
                            closedChangeWeeklyTrendObj[item[1]]=item[0];
                        }
                    }
                });
            }
        }
        logger.info("Closed Change Weekly Trend JSON Obj: ", closedChangeWeeklyTrendObj);
        return closedChangeWeeklyTrendObj;
    }
    catch (e) {
        console.log(e);
    }
}

async function getWhatTimeInDayChangeWasCreatedCount(index, tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,CREATED_DAY,CREATED_TIME FROM ${index} WHERE TENANT_ID='${tenant_id}'`
        +` and CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and CREATED_DAY is not null group by CREATED_DAY,CREATED_TIME"}`;
    try{
        const res = await esManager.sqlSearch(JSON.parse(body));
        var whatTimeInDayChangeWasCreatedObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                let tmpObj = {};
                // Remove extra spaces from item[1]
                let filteredItem1 = item[1].replace(/\s+/g,' ').trim();
                if(!(filteredItem1 == null || filteredItem1 == '')){
                    if(whatTimeInDayChangeWasCreatedObj.hasOwnProperty(filteredItem1)){
                        tmpObj = whatTimeInDayChangeWasCreatedObj[filteredItem1];
                        tmpObj[item[2]] = item[0];
                        whatTimeInDayChangeWasCreatedObj[filteredItem1] = tmpObj;
                    }else {
                        tmpObj[item[2]] = item[0];
                        whatTimeInDayChangeWasCreatedObj[filteredItem1] = tmpObj;
                    }
                }
            });
        }
        logger.info("JSON object for What Time In Day Change Was Created widget : ", whatTimeInDayChangeWasCreatedObj)
        return whatTimeInDayChangeWasCreatedObj;
    }
    catch (e) {
        console.log(e);
    }
}

async function getWhatTimeInDayChangeWasClosedCount(index, tenant_id){
    const body = `{"query":"SELECT COUNT(*) AS CNT,CLOSED_DAY,CLOSED_TIME FROM ${index} WHERE TENANT_ID='${tenant_id}'`
        +` and CREATED >= (now()-INTERVAL 210 DAYS) and CREATED < now() and CLOSED_DAY is not null group by CLOSED_DAY,CLOSED_TIME"}`;
    try{
        const res = await esManager.sqlSearch(JSON.parse(body));
        var whatTimeInDayChangeWasClosedObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                let tmpObj = {};
                // Remove extra spaces from item[1]
                let filteredItem1 = item[1].replace(/\s+/g,' ').trim();
                if(!(filteredItem1 == null || filteredItem1 == '')){
                    if(whatTimeInDayChangeWasClosedObj.hasOwnProperty(filteredItem1)){
                        tmpObj = whatTimeInDayChangeWasClosedObj[filteredItem1];
                        tmpObj[item[2]] = item[0];
                        whatTimeInDayChangeWasClosedObj[filteredItem1] = tmpObj;
                    }else {
                        tmpObj[item[2]] = item[0];
                        whatTimeInDayChangeWasClosedObj[filteredItem1] = tmpObj;
                    }
                }
            });
        }
        logger.info("JSON object for What Time In Day Change Was Closed widget : ", whatTimeInDayChangeWasClosedObj)
        return whatTimeInDayChangeWasClosedObj;
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = {
		getCreatedChangesCount:getCreatedChangesCount,
		getClosedChangesCount:getClosedChangesCount,
		getImplementedChangesCount:getImplementedChangesCount,
		getBacklogChangesCount:getBacklogChangesCount,
        getOpenPendingCount:getOpenPendingCount,
        getFSCon72HrsCount:getFSCon72HrsCount,
        getChangeTypeExpedictedCount:getChangeTypeExpedictedCount,
        getChangeTypeEmergencyCount:getChangeTypeEmergencyCount,
        getChangeTypeStandardCount:getChangeTypeStandardCount,
        getChangeTypeNormalCount:getChangeTypeNormalCount,
        getUnauthorisedCount:getUnauthorisedCount,
        getUnauthorisedOthersCount:getUnauthorisedOthersCount,
		getFailedChangeCount:getFailedChangeCount,
        getSuccessChangeCount:getSuccessChangeCount,
        getChangeStatusCount:getChangeStatusCount,
        getClosureCodesCount:getClosureCodesCount,
        getChangeAgingBucketCount:getChangeAgingBucketCount,
		getTotalChangeTypeCount:getTotalChangeTypeCount,
		getExceptionReasonCount:getExceptionReasonCount,
		getTotalExceptionReasonCount:getTotalExceptionReasonCount,
        getTop25AssignmentGroup:getTop25AssignmentGroup,
        getOpcoView:getOpcoView,
        getCategoryView:getCategoryView,
		getTop25StreetAddress:getTop25StreetAddress,
		getTop25SiteIds:getTop25SiteIds,
        getChangeCount:getChangeCount,
        getChangeRiskCount:getChangeRiskCount,
        getChangeTypeCount:getChangeTypeCount,
        getServiceLineCount:getServiceLineCount,
        getCreatedChangeTrendCount:getCreatedChangeTrendCount,
        getClosedChangeTrendCount:getClosedChangeTrendCount,
        getCreatedChangeWeeklyTrendCount:getCreatedChangeWeeklyTrendCount,
        getClosedChangeWeeklyTrendCount:getClosedChangeWeeklyTrendCount,
        getWhatTimeInDayChangeWasCreatedCount:getWhatTimeInDayChangeWasCreatedCount,
        getWhatTimeInDayChangeWasClosedCount:getWhatTimeInDayChangeWasClosedCount
}