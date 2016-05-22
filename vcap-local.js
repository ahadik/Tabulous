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
		        },
		        {
		        	"name": "tabulous-sl-os-store",
		        	"label": "user-provided",
		        	"credentials": {
		        		"auth_url": process.env.TABULOUS_OBJ_AUTH_URL,
		        		"userId": process.env.TABULOUS_OBJ_UN,
		        		"password": process.env.TABULOUS_OBJ_PW,
		        		"container": process.env.TABULOUS_OBJ_CONTAINER
		        	}
		        }
		    ]
		}
	}
	return vcap;
})();