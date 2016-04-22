module.exports = {
	'url' : function(appEnv){
		var mongo_uri, mongo_un, mongo_pw, mongo_port, mongo_db_name;
		if (appEnv.isLocal){
			mongo_uri = process.env.TABULOUS_DB_URI;
			mongo_un = process.env.TABULOUS_DB_UN;
			mongo_port = process.env.TABULOUS_DB_PORT;
			mongo_db_name = process.env.TABULOUS_DB;
			mongo_pw = process.env.TABULOUS_DB_PW;
		}else{
			var user_provided = JSON.parse(process.env.VCAP_SERVICES)['user-provided'];
			var credentials;
			for(var i=0; i<user_provided.length; i++){
				if (user_provided[i]['name'] == 'tabulous-mongo'){
			  		credentials = user_provided[i]['credentials']
				}
			}
			mongo_uri = credentials['uri'];
			mongo_port = credentials['port'];
			mongo_db_name = 'production';
			mongo_un = credentials['user'];
			mongo_pw = credentials['password'];
		}
		return "mongodb://"+mongo_un+":"+mongo_pw+"@"+mongo_uri+":"+mongo_port+"/"+mongo_db_name+"?ssl=true";
	}
	//'url' : 'mongodb://<user>:<password>@aws-us-east-1-portal.16.dblayer.com:10228/development'
	/*
    'url' : function(appEnv){ return 'mongodb://'+( appEnv.isLocal ? process.env.TABULOUS_DB_UN : appEnv.services()['user-provided']['credentials']['user'])
    		+':'+( appEnv.isLocal == true ? process.env.TABULOUS_DB_PW : appEnv.services()['user-provided']['credentials']['password'])
    		+'@'+( appEnv.isLocal == true ? process.env.TABULOUS_DB_URI : appEnv.services()['user-provided']['credentials']['uri'])
    		+':'+( appEnv.isLocal == true ? process.env.TABULOUS_DB_PORT : appEnv.services()['user-provided']['credentials']['port'])
    		+(appEnv.isLocal == true ? '/development?ssl=true' : '/production');
    	}
    */
};