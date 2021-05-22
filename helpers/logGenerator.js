/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

"use strict";
function getApplicationLogger(){
	var log4js = require("log4js");
	log4js.configure("logs/log4js.json");
	var logger = log4js.getLogger();
	return logger;
}
module.exports = {
	getApplicationLogger:getApplicationLogger
};