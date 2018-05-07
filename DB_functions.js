var cradle = require('cradle');
/**
 * @function get_beacon_data - Retrieves data relating to the Beacon's ID and pushes the request onto the user's DB
 * @param {String} uid - ID of user making the request 
 * @param {String} beacon_id - Beacon ID
 * @param callback - sends back the data relating to the Beacon ID
 */
exports.get_beacon_data = function(uid, beacon_id, callback)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_data");
	db.get(beacon_id , function (err, data) {
	  	if (data == undefined)
		{
	    	callback("Beacon ID does not exist!");
		}
		else 
		{
	    	callback(data);
		}
	});
}

exports.set_current_room = function(uid, beacon_id)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	db.merge(uid, {"current_room": beacon_id}, function (err, res) {
	});
}

/**
 * @function get_user_history - method to retrieve user history from DB
 * @param {String} uid - user ID 
 * @param callback - sends back the user history as an array of objects 
 */
exports.get_user_history = function(uid, callback)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	db.get(uid , function (err, data) {
	  	callback(data.history);
	});
}

/**
 * @function push_into_history - Method to push history into the user's database
 * @param {String} uid - user ID 
 * @param {String} beacon_id - Beacon ID
 * @param {String} beacon_data - Data related to Beacon ID
 */
exports.push_into_history = function(uid, beacon_id, beacon_data)
{
 	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	exports.get_user_history(uid, function(history)
	{
		var history_input;
		if (history){
			history = history.concat(
								[
									{"beacon_id": beacon_id,
									"beacon_data": beacon_data}
								]);
		}
		else 
		{
			history = [
						{"beacon_id": beacon_id,
						"beacon_data": beacon_data}
					];
		}

	db.merge(uid, {"history": history}, function (err, res) {
		console.log(res);
	  });
	});
}

/**
 * @function insert_user - Method to insert user into database 
 * @param {String} uid - user ID 
 * @param {String} password - password is hashed using SHA-256 and pushed into the database
 * @param callback - If 'true' is returned, user has been inserted. If false is returned, user has not been inserted (username already exists in the database). 
 */
exports.insert_user = function(uid, password, callback)
{
	const crypto = require('crypto');
	const hash = crypto.createHash('sha256');
	hash.update(password);
	if(password!= null)
	password = hash.digest('hex');

  	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	check_user_existence(uid, function(bool){
		console.log("existtttt " + bool);
  		if (bool)
  		{
  			callback(false);
  		}
  		else 
  		{
  			db.save(uid, {"password": password}, function (err, res) {
				callback(true);
			});
  		}
  	});
}

/**
 * @function check_user_existence - Method to check if username is found in database 
 * @param {String} uid - user ID 	
 * @param callback - if callback==true, user is found in the database, else username does not exist in the database
 */
check_user_existence = function(uid, callback)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	db.get(uid, function (err, data) {
		if (data == undefined)
			callback(false);
		else
			callback(true);
	});
}
/**
 * @function authenticate_user - Method to authenticate user 
 * @param {String} uid - user ID 	
 * @param {String} beacon_id - Beacon ID
 * @param callback - if callback==true, user has been authenticated, else passwords do not match
 */
exports.authenticate_user = function(uid, password, callback)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	check_user_existence(uid, function(bool)
	{
		if (bool){
			db.get(uid, function (err, data) {
			const crypto = require('crypto');
			const hash = crypto.createHash('sha256');
			hash.update(password);
			if(password!= null)
			password = hash.digest('hex');
			if(password == data.password)
				callback("ok");
			else
				callback("!pass");
			});
		}
		else
		{
			callback("!exist");

		}
	});
}

/**
** @function get_user_profile  - Method to get user profile
 * @param {String} uid - user ID 
 * @param callback - callback returns user profile document
 */
exports.get_user_profile = function(uid, callback)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	db.get(uid , function (err, data) {
		delete data["history"];
		delete data["password"];
	  	callback(data);
	});
}

/**
 * @function edit_profile - Method to edit user profile
 * @param {object} edits - new data to be pushed in - in JSON format
 */
exports.edit_profile = function (uid, edits)
{
	var db = new(cradle.Connection)("localhost:5984").database("ip_proj_users");
	db.merge(uid, edits, function (err, res) {
		console.log(res);
	});
}