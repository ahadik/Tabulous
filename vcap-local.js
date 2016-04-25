module.exports = (function(){
	var vcap = {
		services:{
		    "user-provided": [
		        {
		            "name": "tabulous-mongo",
		            "label": "user-provided",
		            "credentials": {
		                "uri": process.env.TABULOUS_DB_URI,
		                "port": process.env.TABULOUS_DB_PORT,
		                "user": process.env.TABULOUS_DB_UN,
		                "password": process.env.TABULOUS_DB_PW
		            }
		        }
		    ],
		    "Object-Storage": [
		        {
		            "name": "tabulous-storage",
		            "label": "Object-Storage",
		            "plan": "standard",
		            "credentials": {
		                "auth_url": process.env.TABULOUS_OBJ_AUTH_URL,
		                "token_url": process.env.TABULOUS_OBJ_TOKEN_URL,
		                "project": process.env.TABULOUS_OBJ_PROJECT,
		                "projectId": process.env.TABULOUS_OBJ_PROJECT_ID,
		                "region": process.env.TABULOUS_OBJ_REGION,
		                "userId": process.env.TABULOUS_OBJ_USER_ID,
		                "username": process.env.TABULOUS_OBJ_UN,
		                "password": process.env.TABULOUS_OBJ_PW,
		                "domainId": process.env.TABULOUS_OBJ_DOMAIN_ID,
		                "domainName": process.env.TABULOUS_OBJ_DOMAIN_NAME
		            }
		        }
		    ]
		}
	}
	return vcap;
})();