"use strict";
const util = require('../helpers/util');
const esManager = require('./esManager');
var logGenerator = require("../helpers/logGenerator"),
    logger = logGenerator.getApplicationLogger();

/**
 * Get default Total Open Tickets Count value [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */    
async function getTotalOpenTicketsCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and dv_status NOT IN ('CLOSED', 'CANCELLED') and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var count = resp.rows[0][0];
        logger.info("Total Open Tickets count from ES : ", count);

        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get default Total Tickets Created Count value [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */ 
async function getTotalTicketsCreatedinLast24HoursCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) AS CNT from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and created_24hrs=1 and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var count = resp.rows[0][0];
        logger.info("Total Tickets Created in Last 24 Hours count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get default Total Tickets Resolved Count value [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */ 
async function getTotalTicketsResolvedinLast24HoursCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*)  AS CNT from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and resolved_24hrs=1 and created_24hrs=1 and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var count = resp.rows[0][0];
        logger.info("Total Tickets Resolved in Last 24 Hours count from ES : ", count);
        return count;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get default Total Closure Rate Count value [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */ 
async function getTotalClosureRateinLast24HoursCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select avg(closure_percent) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and created_24hrs=1 and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var count = resp.rows[0][0];
        logger.info("Total Closure Rate in Last 24 Hours count from ES : ", count);
        if(count == null){
            return 0;
        }
        else{
            return parseFloat(count.toFixed(3));
        }
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get default Total Backlog Rate Count value [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getTotalBacklogRateinLast24HoursCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select avg(backlog_percent) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and created_24hrs=1 and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var count = resp.rows[0][0];
        console.log("Total Backlog Rate in Last 24 Hours count from ES : ", count);
        if(count == null){
            return 0;
        }
        else{
            return parseFloat(count.toFixed(3));
        }
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get default Total cancelled Rate Count value [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getTotalCancelledRateinLast24HoursCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select avg(cancelled_percent) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and created_24hrs=1 and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var count = resp.rows[0][0];
        logger.info("Total Cancelled Rate in Last 24 Hours from ES : ", count);
        if(count == null){
            return 0;
        }
        else{
            return parseFloat(count.toFixed(3));
        }
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall Backlog Tickets By Priority for In Progress Column values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallBacklogTicketsByPriorityInProgressStatus(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4')  and dv_status NOT IN ('CLOSED', 'CANCELLED')  and dsr_status='IN PROGRESS' group by priority"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Backlog Tickets By Priority In Progress from ES Query: ", countList);
        return countList
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count for Overall Backlog Tickets By Priority for In Progress Column values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryofOverallBacklogTicketsforInProgressStatus(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4')  and dv_status NOT IN ('CLOSED', 'CANCELLED')  and dsr_status='IN PROGRESS'"
        }`
    try {

        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count of Backlog Tickets By Priority In Progress from ES Query: ", countValues);
        return countValues
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall Backlog Tickets By Priority for Queued Column values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallBacklogTicketsByPriorityQueuedStatus(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4')  and dv_status NOT IN ('CLOSED', 'CANCELLED')  and dsr_status='QUEUED' group by priority"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            logger.info(countValues[j][1])
            countList.push(countValues[j][1]);
        }
        logger.info("List of Overall Backlog Tickets By Priority Queued Status count from ES Query: ", countList);
        return countList
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count for Overall Backlog Tickets By Priority for queued Column values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryofOverallBacklogTicketsForQueuedStatus(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4')  and dv_status NOT IN ('CLOSED', 'CANCELLED')  and dsr_status='QUEUED'"
        }`
    try {

        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count of Overall Backlog Tickets By Priority Queued Status from ES Query: ", countValues);
        return countValues;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall Backlog Tickets By Priority for On Hold Column values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallBacklogTicketsByPriorityOnHoldStatus(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4')  and dv_status NOT IN ('CLOSED', 'CANCELLED')  and dsr_status='SLA HOLD' group by priority"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Overall Backlog Tickets By Priority OnHold Status  count from ES Query: ", countList);
        return countList
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count of Overall Backlog Tickets By Priority for On Hold Column values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryofOverallBacklogTicketsForOnHoldStatus(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4')  and dv_status NOT IN ('CLOSED', 'CANCELLED')  and dsr_status='SLA HOLD'"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count for  Overall Backlog Tickets For OnHold Status count from ES Query: ", countValues);
        return countValues
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall View of Tickets Created In Last 24 hours for Created Column values By Priority values [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallViewofTicketsCreatedInLast24hoursCreatedCountByPriority(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and created_24hrs=1  group by priority"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Overall View of Tickets Created In Last 24 hours Created count from ES Query: ", countList);
        return countList
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall View of Tickets Created In Last 24 hours for Resolved Column values By Priority  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallViewofTicketsCreatedInLast24hoursResolvedCountByPriority(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and created_resolved_24hrs=1 group by priority"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Overall View of Tickets Created In Last 24 hours Resolved count from ES Query: ", countList);
        return countList
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall View of Tickets Created In Last 24 hours for Overall Resolved Column values By Priority  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallViewofTicketsCreatedInLast24hoursOverallResolvedCountByPriority(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and resolved_24hrs=1 group by priority"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Overall View of Tickets Created In Last 24 hours Overall Resolved count from ES Query: ", countList);
        return countList;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count of Overall View of Tickets Created In Last 24 hours for Overall Resolved Column values By Priority  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryForOverallViewofTicketsCreatedInLast24hoursForOverallResolvedCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and resolved_24hrs=1"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count of Overall View of Tickets Created In Last 24 hours Overall Resolved from ES Query: ", countValues);
        return countValues;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Contact Type's Count Cloumn Values  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getContactTypeCountByPriority(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select contact_type,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and dv_status NOT IN ('CLOSED', 'CANCELLED')  group by contact_type"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Contact Type  count from ES Query: ", countList);
        return countList;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count of Contact Type's Count Cloumn Values  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryforContactTypeCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and dv_status NOT IN ('CLOSED', 'CANCELLED') "
        }`
    try {

        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count of Contact Type 'Count' from ES Query: ", countValues);
        return countValues;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Column Values for backlog Ticket Aging  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getTotalSummaryColumnValuesforbacklogTicketAging(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{
            "query": "select assignment_group,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and dv_status NOT IN ('CLOSED', 'CANCELLED') group by assignment_group"
        }`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Backlog Ticket Aging Count for Greater Than 30 Days  count from ES Query: ", countList);
        return countList;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count for Summary Column Values for backlog Ticket Aging  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryForBacklogTicketAgingCount(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and priority in ('1','2','3','4') and dv_status NOT IN ('CLOSED', 'CANCELLED')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count of  Backlog Ticket Aging Count for Greater Than 30 Days from ES Query: ", countValues);
        return countValues;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Overall Tickets Created in Last 24 Hours by Status For Opened By Priority  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority(index, tenant_id, snapshotDate) {
    var countList = [];
    const body =
        `{"query": "select priority,count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and created_24hrs=1 and dv_status = 'OPENED' and priority in ('1','2','3','4') group by priority"}`
    try {
        countList = [];
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows;
        for (var j = 0; j < countValues.length; j++) {
            countList.push(countValues[j][1]);
        }
        logger.info("List of Overall Tickets Created in Last 24 Hours by Status For Opened By Priority  count from ES Query: ", countList);
        return countList;
    }
    catch (e) {
        logger.info(e);
    }
}

/**
 * Get Summary Count of Overall Tickets Created in Last 24 Hours by Status For Opened By Priority  [Default date-range filter value is 24 hours]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getSummaryforOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority(index, tenant_id, snapshotDate) {
    const body =
        `{
            "query": "select count(*) from `+ index + ` where tenant_id='` + tenant_id + `' and snapshot_date = '`+snapshotDate+`' and created_24hrs=1 and priority in ('1','2','3','4')"
        }`
    try {
        const resp = await esManager.sqlSearch(body);
        var countValues = resp.rows[0][0];
        logger.info("Summary Count of Overall Tickets Created in Last 24 Hours by Status For Opened By Priority from ES Query: ", countValues);
        return countValues;
    }
    catch (e) {
        logger.info(e);
    }
}

//main function can be used just to execute the query and fecth the response
//instead of complete UI flow whenever required during coding.

//  async function main(){ var response =await
//     getOverallViewofTicketsCreatedInLast24hoursCreatedCountByPriority("sunrise_data","5e17ec1a82b7b100012538cc")
//   console.log(response) }
//   main()

module.exports = {
    getTotalOpenTicketsCount: getTotalOpenTicketsCount,
    getTotalTicketsCreatedinLast24HoursCount: getTotalTicketsCreatedinLast24HoursCount,
    getTotalTicketsResolvedinLast24HoursCount: getTotalTicketsResolvedinLast24HoursCount,
    getTotalClosureRateinLast24HoursCount: getTotalClosureRateinLast24HoursCount,
    getTotalBacklogRateinLast24HoursCount: getTotalBacklogRateinLast24HoursCount,
    getTotalCancelledRateinLast24HoursCount: getTotalCancelledRateinLast24HoursCount,
    getOverallBacklogTicketsByPriorityInProgressStatus: getOverallBacklogTicketsByPriorityInProgressStatus,
    getOverallBacklogTicketsByPriorityQueuedStatus: getOverallBacklogTicketsByPriorityQueuedStatus,
    getOverallBacklogTicketsByPriorityOnHoldStatus: getOverallBacklogTicketsByPriorityOnHoldStatus,
    getOverallViewofTicketsCreatedInLast24hoursCreatedCountByPriority: getOverallViewofTicketsCreatedInLast24hoursCreatedCountByPriority,
    getOverallViewofTicketsCreatedInLast24hoursResolvedCountByPriority: getOverallViewofTicketsCreatedInLast24hoursResolvedCountByPriority,
    getOverallViewofTicketsCreatedInLast24hoursOverallResolvedCountByPriority: getOverallViewofTicketsCreatedInLast24hoursOverallResolvedCountByPriority,
    getContactTypeCountByPriority: getContactTypeCountByPriority,
    getTotalSummaryColumnValuesforbacklogTicketAging: getTotalSummaryColumnValuesforbacklogTicketAging,
    getSummaryofOverallBacklogTicketsforInProgressStatus: getSummaryofOverallBacklogTicketsforInProgressStatus,
    getSummaryofOverallBacklogTicketsForQueuedStatus: getSummaryofOverallBacklogTicketsForQueuedStatus,
    getSummaryofOverallBacklogTicketsForOnHoldStatus: getSummaryofOverallBacklogTicketsForOnHoldStatus,
    getSummaryForOverallViewofTicketsCreatedInLast24hoursForOverallResolvedCount: getSummaryForOverallViewofTicketsCreatedInLast24hoursForOverallResolvedCount,
    getSummaryforContactTypeCount: getSummaryforContactTypeCount,
    getSummaryForBacklogTicketAgingCount: getSummaryForBacklogTicketAgingCount,
    getSummaryforOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority: getSummaryforOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority,
    getOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority: getOverallTicketsCreatedinLast24HoursbyStatusForOpenedByPriority
}