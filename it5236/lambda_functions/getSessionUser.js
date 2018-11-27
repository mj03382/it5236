var mysql = require('./node_modules/mysql');
var config = require('./config.json');
var validator = require('./validation.js');

function formatErrorResponse(code, errs) {
	return JSON.stringify({ 
		error  : code,
		errors : errs
	});
}

exports.handler = (event, context, callback) => {
	//instruct the function to return as soon as the callback is invoked
	context.callbackWaitsForEmptyEventLoop = false;

	//validate input
	var errors = new Array();
	
	
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
		};
		console.log("Connected!");
		var sql = "SELECT usersessionid, usersessions.userid, email, username, usersessions.registrationcode, isadmin " +
                "FROM usersessions " +
                "LEFT JOIN users on usersessions.userid = users.userid " +
                "WHERE usersessionid = ? AND expires > now()";
		
		conn.query(sql, [event.usersessionid], function (err, result) {
		  	if (err) {
				// This should be a "Internal Server Error" error
				callback(formatErrorResponse('INTERNAL_SERVER_ERROR', [err]));
		  	} else {
		  	// Build an object for the JSON response..
						var json = { 
							usersessionid : event.usersessionid,
							userid: result[0].userid,
						//	email: result[0].email,
							registrationcode: result[0].registrationcode,
							isadmin: result[0].isadmin
						};
						
				// Return the json object
      			callback(null, json);
      			setTimeout(function(){
      				conn.end(); }, 4000); // waits 3 seconds before ending connection, giving callback enough time to execute
		  	}
		  	}); //query registration codes
		}); //connect database
	} //no validation errors
} //handler