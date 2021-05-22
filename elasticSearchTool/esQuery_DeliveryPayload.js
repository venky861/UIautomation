
"use strict";
const searchDoc  =  require('./esManager')
const esManager  =  require('./esManager');
var logGenerator = require("../helpers/logGenerator"),
	logger = logGenerator.getApplicationLogger();

/*DI Automation Summary Action Plan Backend Query Start*/

async function getTotalTicketCount(index,tenant_id,days,action_plan_id){
    console.log("tenant_id : " + tenant_id);
    const body =
    {
        "query": "SELECT total_tickets as total FROM "+index+" WHERE tenant_id = '"+tenant_id+
        "' and metric_date >= (now()-INTERVAL "+days+" DAYS)" +" and year_month = '2021-03'" +"and action_plan_id = "+action_plan_id+" "
    }
    try {
         const resp = await esManager.sqlSearch(body);
         console.log(JSON.stringify(resp));
         var count = resp.rows[0][0];
        logger.info("Total tickets for "+days+" days : ", count);
         return count;
    	 }
    catch(e){
        logger.info(e);
    }
}

/*DI Automation Summary Action Plan Backend Query End*/

module.exports = {
    getTotalTicketCount:getTotalTicketCount
}