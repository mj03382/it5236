var mysql = require('./node_modules/mysql');
var config = require('./config.json');
var validator = require('./validation.js');

function formatErrorResponse(code, errs) {
	return JSON.stringify({ // converts Javascript or value to a JSON string
		error  : code, 
		errors : errs
	}); // exports: "{"error":code,"errors":errs}"
}

exports.handler = (event, context, callback) => {
	//instruct the function to return as soon as the callback is invoked
	context.callbackWaitsForEmptyEventLoop = false;

	//validate input
	var errors = new Array();
	
	 // Validate the user input
	validator.validateUserID(event.thingid, errors);
	
	if(errors.length > 0) {
		// This should be a "Bad Request" error
		callback(formatErrorResponse('BAD_REQUEST', errors));
	} else {
	
		//getConnection equivalent
		var conn = mysql.createConnection({
			host 	: config.dbhost,
			user 	: config.dbuser,
			password : config.dbpassword,
			database : config.dbname
		});
		
		//attempts to connect to the database
		conn.connect(function(err) {
		  	
			if (err)  {
				// This should be a "Internal Server Error" error
				callback(formatErrorResponse('INTERNAL_SERVER_ERROR', [err]));
			} else {
				console.log("Connected!");
				var sql = "SELECT things.thingid, things.thingname, convert_tz(things.thingcreated,@@session.time_zone,'America/New_York') as thingcreated, things.thinguserid, things.thingattachmentid, things.thingregistrationcode, username, filename " +
                "FROM things LEFT JOIN users ON things.thinguserid = users.userid " +
                "LEFT JOIN attachments ON things.thingattachmentid = attachments.attachmentid " +
                "WHERE thingid = ?"; // ? is a placeholder
				
				conn.query(sql, [event.thingid], function (err, result) {
				  	if (err) {
						// This should be a "Internal Server Error" error
						callback(formatErrorResponse('INTERNAL_SERVER_ERROR', [err]));
				  	} else {
				  	
						// Build an object for the JSON response..
						var json = { 
							thingid : event.thingid,
							thingname: event.thingname,
							thingcreated: result[0].thingcreated,
							thinguserid: result[0].thinguserid,
							thingattachmentid: result[0].thingattachmentid,
							thingregistrationcode: result[0].thingregistrationcode
						};
						// Return the json object
						callback(null, json);
						setTimeout(function(){conn.end(); }, 3000); // waits 3 seconds before ending connection, giving callback enough time to execute, recommended by Jonathan
				  	}
				}); //query registration codes
			} // no connection error
		}); //connect database
	} //no validation errors
} //handler