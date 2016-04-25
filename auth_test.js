var auth_url = process.env.TABULOUS_OBJ_AUTH_URL;
var project = process.env.TABULOUS_OBJ_PROJECT;
var project_id = process.env.TABULOUS_OBJ_PROJECT_ID;
var region = process.env.TABULOUS_OBJ_REGION;
var user_id = process.env.TABULOUS_OBJ_USER_ID;
var username = process.env.TABULOUS_OBJ_UN;
var password = process.env.TABULOUS_OBJ_PW;
var domain_id = process.env.TABULOUS_OBJ_DOMAIN_ID;
var domain_name = process.env.TABULOUS_OBJ_DOMAIN_NAME;
var container = process.env.TABULOUS_OBJ_CONTAINER;
var req_url = 'https://dal.objectstorage.open.softlayer.com/v1/';


var credentials = {
	auth_url : process.env.TABULOUS_OBJ_AUTH_URL,
	project : process.env.TABULOUS_OBJ_PROJECT,
	project_id : process.env.TABULOUS_OBJ_PROJECT_ID,
	region : process.env.TABULOUS_OBJ_REGION,
	user_id : process.env.TABULOUS_OBJ_USER_ID,
	username : process.env.TABULOUS_OBJ_UN,
	password : process.env.TABULOUS_OBJ_PW,
	domain_id : process.env.TABULOUS_OBJ_DOMAIN_ID,
	domain_name : process.env.TABULOUS_OBJ_DOMAIN_NAME,
	container : process.env.TABULOUS_OBJ_CONTAINER,
	req_url : req_url
};

var objStorage = require('./modules/object_storage/index.js').install(credentials);

objStorage.setContainer('dev_uploads');
objStorage.listContainerContents();