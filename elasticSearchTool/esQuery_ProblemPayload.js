"use strict";
const util = require('../helpers/util');
const esManager  =  require('./esManager');
var logGenerator = require("../helpers/logGenerator"),
	logger = logGenerator.getApplicationLogger();

/**
 * Get default Problem count value [Default date-range filter value is 210 days]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getDefaultProblemCount(index,tenant_id){
    const body =
    {
        "query": "SELECT count(1) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Problem count from ES : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

/**
 * Get Problem count value as per the date-range filter applied
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {Number of days as per the date-range filter applies; Ex. 15,30,60, etc.} days
 */
async function getCustomLastDaysProblemCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(1) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -"+days+", NOW()) AND NOW()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
        logger.info("Problem count from ES for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

/**
 * Get default Owner group value [Default date-range filter value is 210 days]
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 */
async function getDefaultOwnerGroupCount(index,tenant_id){
    const body =
    {
        "query": "SELECT count(distinct(QUEUE_ID)) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and QUEUE_ID != '' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW()"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Owner Group count from ES : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

/**
 * Get Owner group value as per the date-range filter applied
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {Number of days as per the date-range filter applies; Ex. 15,30,60, etc.} days
 */
async function getCustomLastDaysOwnerGroupCount(index,tenant_id,days){
    const body =
    {
        "query": "SELECT count(distinct(QUEUE_ID)) as cnt FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
        "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -"+days+", NOW()) AND NOW() AND QUEUE_ID != ''"
    }
    try {
         const resp = await esManager.sqlSearch(body);
         var count = resp.rows[0][0];
         logger.info("Owner Group count from ES for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

/**
 * Get list of count values from Owner Group by Volume of Problem Horizontal bar chart widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of Y-axis labels from horizontal bar chart widget} yAxisLabelsList 
 */
async function getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList(index,tenant_id,yAxisLabelsList){
    var countList = [];
    var yAxisLabelsListLength = yAxisLabelsList.length;
    // If Y-axis labels are more than 5, get the value for first 5 Y-axis labels
	if(yAxisLabelsListLength > 5){
		yAxisLabelsListLength = 5;
    }
    // Loop to traverse through each Y-axis label
    for(var i=0; i<yAxisLabelsListLength; i++){
        const body =
        {
            "query": "SELECT count(*) as cnt, QUEUE_ID FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and QUEUE_ID='"+yAxisLabelsList[i]+
            "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() group by QUEUE_ID"
        }
        try {
            const resp = await esManager.sqlSearch(body);
            var count = resp.rows[0][0];
            logger.info("Count value for "+yAxisLabelsList[i]+" is :", count);
            // If found, pushing value to the list
            countList.push(count);
        }
        catch(e){
            logger.info(e);
            // If not found, pushing 0 to the list
            countList.push(0);
        }
    }
    logger.info("List of count for ES Query:", countList);
    return countList;
}

/**
 * Get list of count values from Contact type Table widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of cell values from first column i.e. Row filter names from table widget} firstCellValueList 
 */
async function getContactTypeTableWidgetCountList(index,tenant_id,firstCellValueList){
    var countList = [];
    // Loop to traverse through each row filter
    for(var i=0; i<firstCellValueList.length; i++){
        const body =
        {
            "query": "SELECT count(*) as cnt, CALL_CD FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and CALL_CD='"+firstCellValueList[i]+
            "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() group by CALL_CD"
        }
        try {
            const resp = await esManager.sqlSearch(body);
            var count = resp.rows[0][0];
            logger.info("Count value for "+firstCellValueList[i]+" is :", count);
            // If found, pushing value to the list
            countList.push(count);
        }
        catch(e){
            logger.info(e);
            // If not found, pushing 0 to the list
            countList.push(0);
        }
    }
    logger.info("List of count for ES Query:", countList);
    return countList;
}

/**
 * Get list of list of count values for each row filter name from Priority by age bin Table widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of cell values from first column i.e. Row filter names from table widget} firstCellValueList 
 */
async function getListOfCountListFromPrioritybyAgeBinTableWidget(index,tenant_id,firstCellValueList,columnNamesList){
    var countList = [];
    var listOfCountList = [];
    var to = "";
    var from = "";
    for(var k=0; k<columnNamesList.length; k++){
        countList = [];
        // Loop to traverse through each row filter
        for(var i=0; i<firstCellValueList.length; i++){
            if(firstCellValueList[i] == ">=16"){
                from = util.stringToInteger(await util.getNumberFromString(firstCellValueList[i])) - 1;
                to = 210;
            }
            else{
                var firstCellValue = firstCellValueList[i].split("-");
                if(firstCellValue[0] != '00'){
                    from = util.stringToInteger(firstCellValue[0]) - 1;
                }
                else{
                    from = util.stringToInteger(firstCellValue[0]);
                }
                to = util.stringToInteger(firstCellValue[1]);
            }
            logger.info("FROM value for "+firstCellValueList[i]+" is: "+from);
            logger.info("TO value for "+firstCellValueList[i]+" is: "+to);
            const body =
            {
                "query": "SELECT count(*) as cnt, SEVERITY FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
                "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -"+to+", NOW()) AND DATEADD('DAYS', -"+from+", NOW()) AND SEVERITY IN ('"+columnNamesList[k]+"') group by SEVERITY"
            }
            try{
                const resp = await esManager.sqlSearch(body);
                var cellValues = resp.rows;
                for(var j=0; j<cellValues.length; j++){
                    // Dont push if severity is null
                    if(cellValues[j][1] != null){
                        // If found, pushing value to the list
                        if(cellValues[j][0] != 0){
                            countList.push(cellValues[j][0]);
                        }
                    }
                }
            }
            catch(e){
                logger.info(e);
            }
        }
        logger.info("List of count for "+columnNamesList[k]+" is :", countList);
        // After completing list for a column filter, pushing it to the list after checking whether its empty or not to create nested list
        if(countList.length != 0){
            listOfCountList.push(countList);
        }
    }
    logger.info("List of count list for ES Query :", listOfCountList);
    return listOfCountList;
}

/**
 * Get list of list of count values for each row filter name from Priority by status Table widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of cell values from first column i.e. Row filter names from table widget} firstCellValueList 
 */
async function getListOfCountListFromPriorityByStatusTableWidget(index,tenant_id,firstCellValueList,columnNamesList){
    var countList = [];
    var listOfCountList = [];
    for(var k=0; k<columnNamesList.length; k++){
        countList = [];
        // Loop to traverse through each row filter
        for(var i=0; i<firstCellValueList.length; i++){
            const body =
            {
                "query": "SELECT count(*) as cnt, STATUS, SEVERITY FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and STATUS='"+firstCellValueList[i]+
                "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() AND SEVERITY IN ('"+columnNamesList[k]+"') group by STATUS, SEVERITY"
            }
            try{
                const resp = await esManager.sqlSearch(body);
                var cellValues = resp.rows;
                for(var j=0; j<cellValues.length; j++){
                    // Dont push if severity is null
                    if(cellValues[j][2] != null){
                        // If found, pushing value to the list
                        if(cellValues[j][0] != 0){
                            countList.push(cellValues[j][0]);
                        }
                    }
                }
            }
            catch(e){
                logger.info(e);
            }
        }
        logger.info("List of count for "+columnNamesList[k]+" is :", countList);
        // After completing list for a column filter, pushing it to the list after checking whether its empty or not to create nested list
        if(countList.length != 0){
            listOfCountList.push(countList);
        }
    }
    logger.info("List of count list for ES Query :", listOfCountList);
    return listOfCountList;
}

/**
 * Get list of list of count values for each row filter name from Ticket count Table widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id  
 */
async function getListOfCountListFromTicketCountTableWidget(index,tenant_id){
    var countList = [];
    var mttrDaysList = [];
    var listOfCountList = [];
        const body =
        {
            "query": "SELECT count(*) as cnt, avg(TTR_DAYS), SEVERITY FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
            "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() group by SEVERITY"
        }
        try{
            const resp = await esManager.sqlSearch(body);
            var cellValues = resp.rows;
            for(var j=0; j<cellValues.length; j++){
                // Dont push if severity is null
                if(cellValues[j][2] != null){
                    var cellVal = cellValues[j][1];
                    // If found, pushing value to the list
                    countList.push(cellValues[j][0]);
                    if(cellVal != null){
                        mttrDaysList.push(parseFloat(cellVal.toFixed(3)));
                    }
                }
            }
        }
        catch(e){
            logger.info(e);
        }
        // Sort in descending order and slice list to length of 5
        if(countList.length > 5){
            countList = countList.sort(function(a, b){return b-a}).slice(0, 5);
        }
        else{
            countList.sort(function(a, b){return b-a});
        }
        if(mttrDaysList.length > 5){
            mttrDaysList = mttrDaysList.sort(function(a, b){return b-a}).slice(0, 5);
        }
        else{
            mttrDaysList.sort(function(a, b){return b-a});
        }
        logger.info("List of count for ES Query :", countList);
        logger.info("List of MTTR Days for ES Query :", mttrDaysList);
        // After completing list for a row filter, pushing it to the list to create nested list
        listOfCountList.push(countList);
        listOfCountList.push(mttrDaysList);
    logger.info("List of list for ES Query :", listOfCountList);
    return listOfCountList;
}

/**
 * Get list of list of count values for each row filter name from Owner group summary Table widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id  
 * @param {List of queue_id labels from first column} queue_id_list
 */
async function getListOfCountListFromOwnerGroupSummaryTableWidget(index,tenant_id, queue_id_list){
    var listOfCountList = [];
    for(var i = 0; i < queue_id_list.length; i++){
        var countList = [];
        const body =
        {
            "query": "SELECT count(*) as cnt, avg(TTR_DAYS), QUEUE_ID FROM "+index+" WHERE TENANT_ID = '"+tenant_id+
            "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() and QUEUE_ID = '"+queue_id_list[i]+"' group by QUEUE_ID"
        }
        try{
            const resp = await esManager.sqlSearch(body);
            var cellValues = resp.rows;
            if(cellValues[0][2] != null){
                if(cellValues[0][0] != null){
                    countList.push(cellValues[0][0]);
                }
                if(cellValues[0][1] != null){
                    countList.push(parseFloat(cellValues[0][1].toFixed(3)));
                }
            }
            logger.info("List of count for ES Query : "+ countList);
            listOfCountList.push(countList);
        }
        catch(e){
            logger.info(e);
        }
    }
    logger.info("List of list for ES Query :", listOfCountList);
    return listOfCountList;
}

/**
 * Get list of count values from Mined Category by Volume of Problem Horizontal bar chart widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of Y-axis labels from horizontal bar chart widget} yAxisLabelsList 
 */
async function getMinedCategoryByVolumeOfProblemHorizontalBarGraphCountList(index,tenant_id,yAxisLabelsList){
    var countList = [];
    var yAxisLabelsListLength = yAxisLabelsList.length;
    // If Y-axis labels are more than 5, get the value for first 5 Y-axis labels
	if(yAxisLabelsListLength > 5){
		yAxisLabelsListLength = 5;
    }
    // Loop to traverse through each Y-axis label
    for(var i=0; i<yAxisLabelsListLength; i++){
        const body =
        {
            "query": "SELECT count(*) as cnt, LABEL FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and LABEL='"+yAxisLabelsList[i]+
            "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() group by LABEL"
        }
        try {
            const resp = await esManager.sqlSearch(body);
            var count = resp.rows[0][0];
            logger.info("Count value for "+yAxisLabelsList[i]+" is :", count);
            // If found, pushing value to the list
            countList.push(count);
        }
        catch(e){
            logger.info(e);
            // If not found, pushing 0 to the list
            countList.push(0);
        }
    }
    logger.info("List of count for ES Query:", countList);
    return countList;
}

/**
 * Get list of total count list from Trend Of Incoming Problem Volume by Priority Multi-wave graph widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of filter values for Created global filter} createdfilterValues 
 */
async function getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget(index,tenant_id, createdfilterValues){
    var countList = [];
    var totalCountList = [];
    // Loop to traverse through each filter values
    for(var i=0; i<createdfilterValues.length; i++){
        var sum = 0;
        const body =
            {
                "query": "SELECT count(*) as cnt, SEVERITY, YEAR_MONTH_CREATED FROM "+index+" WHERE YEAR_MONTH_CREATED = '"+createdfilterValues[i]+
                "' and TENANT_ID = '"+tenant_id+"' and CREATIONDATE_DF >= 'now-210d' AND CREATIONDATE_DF < now() group by SEVERITY, YEAR_MONTH_CREATED"
            }
            try{
                countList = [];
                const resp = await esManager.sqlSearch(body);
                var countValues = resp.rows;
                for(var j=0; j<countValues.length; j++){
                    if(!(countValues[j][1] == '' || countValues[j][1] == null)){
                        sum = sum + countValues[j][0];
                    }
                }
                countList.push(sum);
            }
            catch(e){
                logger.info(e);
            }
            logger.info("List of total count for "+createdfilterValues[i]+": ", countList);
            totalCountList.push(countList);
    }
    logger.info("List of list total count from ES Query: ", totalCountList);
    return totalCountList;
}

/**
 * Get list of total count list from Trend Of Resolved Problem Volume by Priority Multi-wave graph widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of filter values for Resolved global filter} resolvedfilterValues 
 */
async function getListOfCountListFromTrendOfResolvedProblemVolumebyPriorityMultiWaveWidget(index,tenant_id, resolvedfilterValues){
    var countList = [];
    var totalCountList = [];
    // Loop to traverse through each filter values
    for(var i=0; i<resolvedfilterValues.length; i++){
        const body =
            {
                "query": "SELECT count(*) as cnt, SEVERITY, YEAR_MONTH_RESOLVED FROM "+index+" WHERE YEAR_MONTH_RESOLVED = '"+resolvedfilterValues[i]+
                "' and TENANT_ID = '"+tenant_id+"' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() group by SEVERITY, YEAR_MONTH_RESOLVED"
            }
            try{
                countList = [];
                const resp = await esManager.sqlSearch(body);
                var countValues = resp.rows;
                for(var j=0; j<countValues.length; j++){
                    countList.push(countValues[j][0]);
                }
            }
            catch(e){
                logger.info(e);
            }
            logger.info("List of total count for "+resolvedfilterValues[i]+": ", countList);
            totalCountList.push(countList);
    }
    logger.info("List of list total count from ES Query: ", totalCountList);
    return totalCountList;
}

/**
 * Get count list for Owner Group By Volume Of Problem Name list Widget
 * @param {Index value for Problem Management} index 
 * @param {Tenant ID for the environment} tenant_id 
 * @param {List of names in Name list widget} namesList 
 */
async function getCountListForOwnerGroupByVolumeOfProblemWidget(index, tenant_id, namesList){
    var countList = [];
    var namesListLength = namesList.length;
    // Loop to traverse through each name
    for(var i=0; i<namesListLength; i++){
        const body =
        {
            "query": "SELECT count(*) as cnt, QUEUE_ID FROM "+index+" WHERE TENANT_ID = '"+tenant_id+"' and QUEUE_ID='"+namesList[i]+
            "' and OPEN_DTTM BETWEEN DATEADD('DAYS', -210, NOW()) AND NOW() group by QUEUE_ID"
        }
        try {
            const resp = await esManager.sqlSearch(body);
            var count = resp.rows[0][0];
            logger.info("Count value for "+namesList[i]+" is :", count);
            // If found, pushing value to the list
            countList.push(count);
        }
        catch(e){
            logger.info(e);
        }
    }
    logger.info("List of count for ES Query:", countList);
    return countList;
}

// main function can be used just to execute the query and fetch the response
// instead of complete UI flow whenever required during coding.
// async function main(){ 
//     var response1 = await getDefaultTotalProblemCount("unified_problem_processed_v2","<tenant-id>");
//     logger.info(response1);
// }
// main();

module.exports = {
    getDefaultProblemCount:getDefaultProblemCount,
    getCustomLastDaysProblemCount:getCustomLastDaysProblemCount,
    getDefaultOwnerGroupCount:getDefaultOwnerGroupCount,
    getCustomLastDaysOwnerGroupCount:getCustomLastDaysOwnerGroupCount,
    getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList:getOwnerGroupByVolumeOfProblemHorizontalBarGraphCountList,
    getContactTypeTableWidgetCountList:getContactTypeTableWidgetCountList,
    getListOfCountListFromPrioritybyAgeBinTableWidget:getListOfCountListFromPrioritybyAgeBinTableWidget,
    getListOfCountListFromPriorityByStatusTableWidget:getListOfCountListFromPriorityByStatusTableWidget,
    getListOfCountListFromTicketCountTableWidget:getListOfCountListFromTicketCountTableWidget,
    getListOfCountListFromOwnerGroupSummaryTableWidget:getListOfCountListFromOwnerGroupSummaryTableWidget,
    getMinedCategoryByVolumeOfProblemHorizontalBarGraphCountList:getMinedCategoryByVolumeOfProblemHorizontalBarGraphCountList,
    getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget:getListOfCountListFromTrendOfIncomingProblemVolumebyPriorityMultiWaveWidget,
    getListOfCountListFromTrendOfResolvedProblemVolumebyPriorityMultiWaveWidget:getListOfCountListFromTrendOfResolvedProblemVolumebyPriorityMultiWaveWidget,
    getCountListForOwnerGroupByVolumeOfProblemWidget:getCountListForOwnerGroupByVolumeOfProblemWidget
}