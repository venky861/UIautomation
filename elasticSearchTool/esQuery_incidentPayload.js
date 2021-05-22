"use strict";
const esManager = require('./esManager');
const util = require('../helpers/util');
var logGenerator = require("../helpers/logGenerator"),
	logger = logGenerator.getApplicationLogger();

async function getDefaultIncomingVolCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Incoming Vol count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultMTTRInclCount(index, tenant_id) {
    const body = `{"query":"SELECT avg(mttr_incl_hold) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Avg MTTR_INCL_HOLD value from ES : ", count.toFixed(3));
        return parseFloat(count.toFixed(3));
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultMTTRExclCount(index, tenant_id) {
    const body = `{"query":"SELECT avg(mttr_excl_hold) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Avg MTTR_EXCL_HOLD value from ES : ", count.toFixed(3));
        return parseFloat(count.toFixed(3));
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultResolvedCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
        + ` AND open_dttm >= 'now-210d' and open_dttm < NOW() and status in ('RESOLVED','RESOLVCONF') AND resolved_dttm is not null"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Resolved count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultBacklogCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW() and status in ('QUEUED','ON HOLD','WORK IN PR','INPROG','SLAHOLD','WORK IN PROGRESS')"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Backlog count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultReopenedCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` AND open_dttm >= 'now-210d' and open_dttm < NOW() and reopen_count not in (0) AND reopen_count is not null"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Reopened count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultMaxReopenedCount(index, tenant_id) {
    const body = `{"query":"SELECT max(reopen_count) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Max Reopened count from ES : ", count);
        return parseInt(count);
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultMaxReassignCount(index, tenant_id) {
    const body = `{"query":"SELECT max(reassignment_count) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Max Reassign count from ES : ", count);
        return parseInt(count);
    }
    catch (e) {
        logger.info(e);
    }
}

async function priorityView(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,priority FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and priority IN ('1', '2', '3', '4') and priority is not null group by priority order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let priorityObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    priorityObj[item[1]]=item[0];
                }
            });
        }
        return priorityObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function companyView(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,company FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and company is not null group by company order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let companyObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    companyObj[item[1]]=item[0];
                }
            });
        }
        return companyObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function contactType(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,contact_type FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and contact_type is not null group by contact_type order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let contactTypeObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    contactTypeObj[item[1]]=item[0];
                }
            });
        }
        return contactTypeObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function agingBacklog(index, tenant_id, yAxisLabels){
    var to = "";
    var from = "";
    var body = "";
    var agingBacklogObj = {};
    // Loop to traverse through each row filter
    for(var i=0; i<yAxisLabels.length; i++){
        if(yAxisLabels[i] == "0 - 01"){
            to = yAxisLabels[i].split("-")[1].slice(1);
            body = `{"query":"SELECT count(*) as cnt, status FROM ${index} WHERE open_dttm >= 'now-`+to+`d' and ticket_class='INCIDENT' and `
                + `tenant_id = '${tenant_id}' and status in ('WORK IN PR','QUEUED','ON HOLD','SLAHOLD','INPROG','WORK IN PROGRESS') group by status order by cnt"}`;
        }
        else{
            if(yAxisLabels[i] == "90+"){
                to = '0210';
                from = yAxisLabels[i].split("+")[0];
            }
            else{
                to = yAxisLabels[i].split("-")[1];
                if(!to.startsWith('0')){
                    to = ['0', to].join('').replace(' ','');
                }
                from = (yAxisLabels[i].split("-")[0]).trim();
                if(from.startsWith('0')){
                   from = from.slice(1);
                }
            }
            logger.info("to: "+to);
            logger.info("from: "+from);
            body = `{"query":"SELECT count(*) as cnt, status FROM ${index} WHERE open_dttm < 'now-`+from+`d' and open_dttm >= 'now-`+to+`d' and `
                + `ticket_class='INCIDENT' and tenant_id = '${tenant_id}' and status in ('WORK IN PR','QUEUED','ON HOLD','SLAHOLD','INPROG','WORK IN PROGRESS') `
                + `group by status order by cnt"}`;
        }
        try {
            const res = await esManager.sqlSearch(JSON.parse(body));
            if (res && res.rows){
                var cellValues = res.rows;
                let tmpObj = {};
                for(var j=0; j<cellValues.length; j++){
                    if(cellValues[j][1] != null){
                        tmpObj[cellValues[j][1]] = cellValues[j][0];
                    }
                }
                logger.info("JSON object for "+yAxisLabels[i]+": ", tmpObj);
                agingBacklogObj[yAxisLabels[i]] = tmpObj;
            }
        }
        catch (e) {
            console.log(e)
        }
    }
    logger.info("JSON object for Aging Backlog widget : ", agingBacklogObj);
    return agingBacklogObj;
}

async function assignmentGroupParent(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,assignment_group_parent FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and assignment_group_parent is not null group by assignment_group_parent order by CNT desc"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let assignmentParentObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    assignmentParentObj[item[1]]=item[0];
                }
            });
        }
        return assignmentParentObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function personCity(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,person_city FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and person_city is not null group by person_city order by CNT desc limit 25"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let personCityObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    personCityObj[item[1]]=item[0];
                }
            });
        }
        return personCityObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function assignmentGroup(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,assignment_group FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and assignment_group is not null group by assignment_group order by CNT desc limit 50"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let assignmentGroupObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    assignmentGroupObj[item[1].replace(/\&nbsp;/g, ' ')]=item[0];
                }
            });
        }
        return assignmentGroupObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function categoryView(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,category FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and category is not null group by category order by CNT desc limit 10"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let categoryObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    categoryObj[item[1]]=item[0];
                }
            });
        }
        return categoryObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function subcategoryView(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,subcategory FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and subcategory is not null group by subcategory order by CNT desc limit 10"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let subcategoryObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    subcategoryObj[item[1]]=item[0];
                }
            });
        }
        return subcategoryObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function originalVsActualPriority(index, tenant_id, firstCellValueList) {
    var countList = [];
    var listOfCountList = [];
    // Loop to traverse through each row filter
    for(var i=0; i<firstCellValueList.length; i++){
        countList = [];
        const body = `{"query":"SELECT count(*) as cnt, original_priority, priority FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and original_priority = '${firstCellValueList[i]}' group by original_priority, priority"}`;
        try{
            const resp = await esManager.sqlSearch(body);
            var cellValues = resp.rows;
            for(var j=0; j<cellValues.length; j++){
                // Dont push if severity is null
                if(cellValues[j][2] != null){
                    // If found, pushing value to the list
                    countList.push(cellValues[j][0]);
                }
            }
        }
        catch(e){
            logger.info(e);
        }
        logger.info("List of count for "+firstCellValueList[i]+" is :", countList);
        // After completing list for a row filter, pushing it to the list to create nested list
        listOfCountList.push(countList);
    }
    logger.info("List of count list for ES Query :", listOfCountList);
    return listOfCountList;
}

async function reassignmentBucket(index,tenant_id,firstCellValueList){
    var countList = [];
    var listOfCountList = [];
    var to = "";
    var from = "";
    // Loop to traverse through each row filter
    for(var i=0; i<firstCellValueList.length; i++){
        countList = [];
        var firstCellValue = firstCellValueList[i].split(" ");
        // Calculate from value
        if(firstCellValue[0] == '00'){
            from = '0';
        }
        else{
            from = firstCellValue[0];
        }
        // Calculate to value
        if(firstCellValue[0] == '20'){
            to = '210';
        }
        else{
            to = firstCellValue[2];
        }
        logger.info("FROM value for "+firstCellValueList[i]+" is: "+from);
        logger.info("TO value for "+firstCellValueList[i]+" is: "+to);
        const body = `{"query":"SELECT count(*) as cnt, priority FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
                    +` and open_dttm >= 'now-210d' and open_dttm < NOW() and reassignment_bucket between '${from}' and '${to}' and `
                    +` priority in ('1','2','3','4') group by priority order by cnt desc"}`;
        try{
            const resp = await esManager.sqlSearch(body);
            var cellValues = resp.rows;
            for(var j=0; j<cellValues.length; j++){
                // Dont push if severity is null
                if(cellValues[j][1] != null){
                    // If found, pushing value to the list
                    countList.push(cellValues[j][0]);
                }
            }
        }
        catch(e){
            logger.info(e);
        }
        logger.info("List of count for "+firstCellValueList[i]+" is :", countList);
        // After completing list for a row filter, pushing it to the list to create nested list
        listOfCountList.push(countList);
    }
    logger.info("List of count list for ES Query :", listOfCountList);
    return listOfCountList;
}

async function getDefaultSiteIdCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(distinct(site_id)) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Site ID count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultBuildingIdCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(distinct(person_building_id)) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Building ID count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultPersonCountryCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(distinct(person_country)) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and person_country != '' and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("Country count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function getDefaultPersonCityCount(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(distinct(person_city)) AS CNT FROM ${index} WHERE tenant_id='${tenant_id}' and ticket_class='INCIDENT' `
        + ` and open_dttm >= 'now-210d' and open_dttm < NOW()"}`;
    try {
        const resp = await esManager.sqlSearch(JSON.parse(body));
        var count = resp.rows[0][0];
        logger.info("City count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

async function top25StreetAddress(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,person_addressline1 FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and person_addressline1 is not null group by person_addressline1 order by CNT desc limit 25"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let streetAddrObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    streetAddrObj[item[1].replace(/(\r\n|\n|\r)/gm, " ")]=item[0];
                }
            });
        }
        return streetAddrObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function top25BuildingId(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,person_building_id FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and person_building_id is not null group by person_building_id order by CNT desc limit 25"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let buildingIdObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    buildingIdObj[item[1]]=item[0];
                }
            });
        }
        return buildingIdObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function top25SiteId(index, tenant_id) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,site_id FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and site_id is not null group by site_id order by CNT desc limit 25"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let siteIdObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Check for empty string
                if(item[1] != ""){
                    siteIdObj[item[1]]=item[0];
                }
            });
        }
        return siteIdObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function createdVolumeMonthlyTrend(index, tenant_id, xAxisLabels) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,year_month_created FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and year_month_created is not null group by year_month_created"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let createdVolMonthlyTrendObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Verifying X axis labels from UI 
                if(xAxisLabels.includes(item[1])){
                    createdVolMonthlyTrendObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Created Vol Monthly Trend JSON Obj: ", createdVolMonthlyTrendObj);
        return createdVolMonthlyTrendObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function resolvedVolumeMonthlyTrend(index, tenant_id, xAxisLabels) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,year_month_resolved FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and year_month_resolved is not null group by year_month_resolved"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let resolvedVolMonthlyTrendObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Verifying X axis labels from UI 
                if(xAxisLabels.includes(item[1])){
                    resolvedVolMonthlyTrendObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Resolved Vol Monthly Trend JSON Obj: ", resolvedVolMonthlyTrendObj);
        return resolvedVolMonthlyTrendObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function createdVolumeWeeklyTrend(index, tenant_id, xAxisLabels) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,created_week FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and created_week is not null group by created_week"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let createdVolWeeklyTrendObj = {};
        let listOfNumbers = xAxisLabels.map(Number);
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Verifying X axis labels from UI 
                if(listOfNumbers.includes(item[1])){
                    createdVolWeeklyTrendObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Created Vol Weekly Trend JSON Obj: ", createdVolWeeklyTrendObj);
        return createdVolWeeklyTrendObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function resolvedVolumeWeeklyTrend(index, tenant_id, xAxisLabels) {
    const body = `{"query":"SELECT COUNT(*) AS CNT,resolved_week FROM ${index} WHERE tenant_id='${tenant_id}' AND ticket_class='INCIDENT' `
                    +` AND open_dttm >= 'now-210d' and open_dttm < NOW() and resolved_week is not null group by resolved_week"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let resolvedVolWeeklyTrendObj = {};
        let listOfNumbers = xAxisLabels.map(Number);
        if (res && res.rows){
            res.rows.forEach(function (item){
                // Verifying X axis labels from UI 
                if(listOfNumbers.includes(item[1])){
                    resolvedVolWeeklyTrendObj[item[1]]=item[0];
                }
            });
        }
        logger.info("Resolved Vol Weekly Trend JSON Obj: ", resolvedVolWeeklyTrendObj);
        return resolvedVolWeeklyTrendObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function mttrInclHoldWeeklyTrendPriorityView(index, tenant_id, xAxisLabels, legendNames){
    var priorityCountList = [];
    var totalCountList = [];
    var priorityNumberList = [];
    for(var i=0; i<legendNames.length; i++){
        priorityNumberList.push(util.getNumberFromString(legendNames[i]));
    }
    logger.info("Priorities in number: "+ priorityNumberList);
    // Loop to travese through each priority number
    for(var j=0; j<priorityNumberList.length; j++){
        const body = `{"query":"SELECT COUNT(distinct(mttr_incl_hold)) AS CNT,priority,resolved_week FROM ${index} WHERE tenant_id='${tenant_id}' AND `
            +` ticket_class='INCIDENT' AND open_dttm >= 'now-210d' and open_dttm < NOW() and resolved_week is not null and priority in ('${priorityNumberList[j]}') `
            +` group by priority,resolved_week"}`;
        try {
            const res = await esManager.sqlSearch(JSON.parse(body));
            let listOfNumbers = xAxisLabels.map(Number);
            if (res && res.rows){
                res.rows.forEach(function (item){
                    // Verifying X axis labels from UI 
                    if(listOfNumbers.includes(item[2])){
                        priorityCountList.push(item[0]);
                    }
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        logger.info("Priority based List count for "+priorityNumberList[j]+": ", priorityCountList);
        totalCountList.push(priorityCountList);
    }
    logger.info("Priority based List of count list from ES Query: ", totalCountList);
    return totalCountList;
}

async function whatTimeOfTheDayTheIncidentsTriggered(index, tenant_id){
    const body = `{"query":"SELECT count(*) as cnt, created_day_name, created_hour FROM ${index} WHERE tenant_id='${tenant_id}' AND `
        +` ticket_class='INCIDENT' AND open_dttm >= 'now-210d' and open_dttm < NOW() group by created_day_name, created_hour"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let whatTimeOfTheDayTheIncidentsTriggeredObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                let tmpObj = {};
                if(item[1] != null){
                    if(whatTimeOfTheDayTheIncidentsTriggeredObj.hasOwnProperty(item[1])){
                        tmpObj = whatTimeOfTheDayTheIncidentsTriggeredObj[item[1]];
                        tmpObj[item[2]] = item[0];
                        whatTimeOfTheDayTheIncidentsTriggeredObj[item[1]] = tmpObj;
                    }else {
                        tmpObj[item[2]] = item[0];
                        whatTimeOfTheDayTheIncidentsTriggeredObj[item[1]] = tmpObj;
                    }
                }
            });
        }
        logger.info("JSON object for What Time Of The Day The Incidents Triggered widget : ", whatTimeOfTheDayTheIncidentsTriggeredObj)
        return whatTimeOfTheDayTheIncidentsTriggeredObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function whatTimeOfTheDayTheIncidentsResolved(index, tenant_id){
    const body = `{"query":"SELECT count(*) as cnt, resolved_day_name, resolved_hour FROM ${index} WHERE tenant_id='${tenant_id}' AND `
        +` ticket_class='INCIDENT' AND open_dttm >= 'now-210d' and open_dttm < NOW() group by resolved_day_name, resolved_hour"}`;
    try {
        const res = await esManager.sqlSearch(JSON.parse(body));
        let whatTimeOfTheDayTheIncidentsResolvedObj = {};
        if (res && res.rows){
            res.rows.forEach(function (item){
                let tmpObj = {};
                if(item[1] != null){
                    if(whatTimeOfTheDayTheIncidentsResolvedObj.hasOwnProperty(item[1])){
                        tmpObj = whatTimeOfTheDayTheIncidentsResolvedObj[item[1]];
                        tmpObj[item[2]] = item[0];
                        whatTimeOfTheDayTheIncidentsResolvedObj[item[1]] = tmpObj;
                    }else {
                        tmpObj[item[2]] = item[0];
                        whatTimeOfTheDayTheIncidentsResolvedObj[item[1]] = tmpObj;
                    }
                }
            });
        }
        logger.info("JSON object for What Time Of The Day The Incidents Resolved widget : ", whatTimeOfTheDayTheIncidentsResolvedObj)
        return whatTimeOfTheDayTheIncidentsResolvedObj;
    }
    catch (e) {
        console.log(e)
    }
}

async function top10StreetAddressIssueCategory(index, tenant_id, yAxisLabels){
    var totalCountList = [];
    var yAxisLabelsListLength = yAxisLabels.length;
    if(yAxisLabelsListLength > 5){
        yAxisLabelsListLength = 5;
    }
    // Loop to travese through each subcategory [y-axis labels] name
    for(var j=0; j<yAxisLabelsListLength; j++){
        var subCategoryCountList = [];
        const body = `{"query":"SELECT count(*) as cnt, person_addressline1, subcategory FROM ${index} WHERE tenant_id='${tenant_id}' AND `
            +` ticket_class='INCIDENT' AND open_dttm >= 'now-210d' and open_dttm < NOW() and subcategory is not null and person_addressline1 is not null and person_addressline1 != '' and `
            +` subcategory = '${yAxisLabels[j]}' group by person_addressline1, subcategory order by cnt desc limit 10"}`;
        try {
            const res = await esManager.sqlSearch(JSON.parse(body));
            if (res && res.rows){
                res.rows.forEach(function (item){
                    subCategoryCountList.push(item[0]);
                });
            }
        }
        catch (e) {
            console.log(e);
        }
        logger.info("Subcategory based List count for "+yAxisLabels[j]+": ", subCategoryCountList);
        totalCountList.push(subCategoryCountList);
    }
    logger.info("Subcategory based List of count list from ES Query: ", totalCountList);
    return totalCountList;
}

module.exports = {
    getDefaultIncomingVolCount: getDefaultIncomingVolCount,
    getDefaultMTTRInclCount: getDefaultMTTRInclCount,
    getDefaultMTTRExclCount: getDefaultMTTRExclCount,
    getDefaultResolvedCount: getDefaultResolvedCount,
    getDefaultBacklogCount: getDefaultBacklogCount,
    getDefaultReopenedCount: getDefaultReopenedCount,
    getDefaultMaxReopenedCount: getDefaultMaxReopenedCount,
    getDefaultMaxReassignCount: getDefaultMaxReassignCount,
    priorityView: priorityView,
    companyView: companyView,
    contactType: contactType,
    agingBacklog: agingBacklog,
    assignmentGroupParent: assignmentGroupParent,
    personCity: personCity,
    assignmentGroup: assignmentGroup,
    categoryView: categoryView,
    subcategoryView: subcategoryView,
    originalVsActualPriority: originalVsActualPriority,
    reassignmentBucket: reassignmentBucket,
    getDefaultSiteIdCount: getDefaultSiteIdCount,
    getDefaultBuildingIdCount: getDefaultBuildingIdCount,
    getDefaultPersonCountryCount: getDefaultPersonCountryCount,
    getDefaultPersonCityCount: getDefaultPersonCityCount,
    top25StreetAddress: top25StreetAddress,
    top25BuildingId: top25BuildingId,
    top25SiteId: top25SiteId,
    createdVolumeMonthlyTrend: createdVolumeMonthlyTrend,
    resolvedVolumeMonthlyTrend: resolvedVolumeMonthlyTrend,
    createdVolumeWeeklyTrend: createdVolumeWeeklyTrend,
    resolvedVolumeWeeklyTrend: resolvedVolumeWeeklyTrend,
    mttrInclHoldWeeklyTrendPriorityView: mttrInclHoldWeeklyTrendPriorityView,
    whatTimeOfTheDayTheIncidentsTriggered: whatTimeOfTheDayTheIncidentsTriggered,
    whatTimeOfTheDayTheIncidentsResolved: whatTimeOfTheDayTheIncidentsResolved,
    top10StreetAddressIssueCategory: top10StreetAddressIssueCategory
}