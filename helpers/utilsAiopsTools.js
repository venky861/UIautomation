/**
 * Created by : Pushpraj
 * created on : 12/02/2020
 */

var httpRequest = require('request-promise');
const fs = require('fs');
var xml2js = require('xml2js');

global.postToSlack = function (){
    return new Promise((resolve,reject)=>{
	 	var boolValue = ('true' === browser.params.postSlack);
        console.log("post-to-slack? "+boolValue);
        if (boolValue){
            var parser = new xml2js.Parser();

            console.log("Initiating consolidation of test results....");
            fs.readFile('./reports/htmlReports/junitresults.xml', function(err, data) {
                parser.parseString(data, function (err, result) {

                    var testExecutiontitle = "AIOPs UI Automation Test results:\n URL: "+browser.params.url
                    +"\n Build URL: "+browser.params.buildURL;
                    console.log("AIOPs UI Automation Test results:\n URL: "+browser.params.url);
                    console.log("\n Build URL: "+browser.params.buildURL);
                    var lenSuite = result.testsuites.testsuite.length;
                    var totalTestSuits = "Total Test Suite Count: "+ lenSuite;
                    console.log("Total Test Suite Count: "+ lenSuite);
                    var finalTestSuiteSummaryToPost = "Feature-wise Summary:\n";
                    var totalPassed = 0;
                    var totalFailed = 0;
				//	var totalSkipped = 0;
					var totalPassedPercentage = 0;
                    for(var j=0; j<lenSuite; j++){
                                        	
                    	var testSuiteName = result.testsuites.testsuite[j].$.name;
                    	var testSuiteSummary =testSuiteName;
                        var totalTestCase = result.testsuites.testsuite[j].testcase.length;
                        var failed = 0;
                        var passed = 0;
                        var skipped = 0;
                       
                        
                        for (var i=0; i<totalTestCase; i++){
                            if((result.testsuites.testsuite[j].testcase[i].failure)){
                                failed = Number(failed) + 1;
                                                             
                            }
                            else if((result.testsuites.testsuite[j].testcase[i].skipped)){
                                skipped = Number(skipped) + 1;
                                                            
                            }
                            else {
                                passed = Number(passed) + 1;
                                                             
                            }
                        }
                        totalFailed = totalFailed+failed;
                        totalPassed = totalPassed+passed;
                   //     totalSkipped = totalSkipped+skipped;
                        
                         testSuiteSummary = testSuiteSummary +"   -  "+"_Passed: "+passed.toString()+"_"+"`Failed: "+failed.toString()+" "+"\n";
                        
                         finalTestSuiteSummaryToPost = finalTestSuiteSummaryToPost + testSuiteSummary;
                    }
                   
                                       
                    var totalCount=totalFailed+totalPassed;
                    var body = "testExecutiontitle \ntotalCount \ntotalPassed \ntotalFailed \ntotalPassedPercentage \nfinalTestSuiteSummaryToPost ";
                    

                    body = body.replace("testExecutiontitle", testExecutiontitle.toString()+"\n");
                    body = body.replace("totalCount", "Total TestCases Executed : " +totalCount.toString());
                    body = body.replace("totalPassed", "Passed : " +totalPassed.toString());
					body = body.replace("totalFailed", "Failed : " +totalFailed.toString());
					body = body.replace("totalPassedPercentage", "Passed % : " +Math.ceil(((totalPassed/totalCount)*100)).toString()+"\n");
                   // body = body.replace("totalTestSuits", totalTestSuits.toString()+"\n");
                    body = body.replace("finalTestSuiteSummaryToPost", finalTestSuiteSummaryToPost.toString()+"\n");
                              
                    console.log("Test Summary: \n"+body)

                    console.log('Posting test summary to slack....');

                    var reqOptions={
                        method: 'POST',
                        url:browser.params.postSlackWebhookURL,
                        body:{"text": body
                        },
                        json:true
                    };

                    httpRequest(reqOptions).then( function(httpResponse) {
                        console.log('Response after posting to slack: \n' + httpResponse.toString());
                        resolve(httpResponse.toString());
                    })
                    .catch(function (err) {
                        console.error('Error during posting to slack: \n'+err.toString());
                        reject(err);
                        return;
                    });
                });

            });
        }else {
            console.warn("Skipped posting to Slack.")
        }
    });
};

global.generateHTMLReport = function (configFileName){
    return new Promise(()=>{
        var browserName, browserVersion;
        var capsPromise = browser.getCapabilities();

        capsPromise.then(function (caps) {
            browserName = caps.get('browserName');
            browserVersion = caps.get('version');

            var HTMLReport = require('protractor-html-reporter');

            testConfig = {
                reportTitle: 'Test Execution Report for '+configFileName,
                outputPath: './reports/',
                screenshotPath: './reports/screenshots',
                htmlReportDir: './reports/htmlReports',
                testBrowser: browserName,
                browserVersion: browserVersion,
                modifiedSuiteName: false,
                screenshotsOnlyOnFailure: true
            };
            new HTMLReport().from('./reports/htmlReports/junitresults.xml', testConfig);
        });
    });

};

module.exports = {
    postToSlack : postToSlack,
    generateHTMLReport:generateHTMLReport
};
