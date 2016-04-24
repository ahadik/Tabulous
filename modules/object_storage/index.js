var request = require('request');
//'https://dal.objectstorage.open.softlayer.com/v1/AUTH_'+project_id+'/'+container;

/*
	TODO: set request URL automatically from token request
*/

module.exports = {
	token:null,
	container:null,
	accountData: {},
	expiration: 0,
	install: function(credentials){
		if(this.checkAccountData(credentials)){
			this.accountData = credentials;
		}else{
			process.stderr.write('Invalid credentials\n');
		}
		return this;
	},

	checkAccountData: function(credentials){
		['auth_url', 'project', 'project_id', 'region', 'user_id', 'username', 'password', 'domain_id', 'domain_name', 'req_url'].forEach((key) => {
			if ((Object.keys(credentials).indexOf(key)) == -1){
				return false;
			}
		});
		return true;
	},

	setToken: function(callback){
		var form = {
			"auth": {
			    "identity": {
			        "methods": [
			            "password"
			        ],
			        "password": {
			            "user": {
			                "id": this.accountData.user_id,
			                "password": this.accountData.password
			            }
			        }
			    },
			    "scope": {
			        "project": {
			            "id": this.accountData.project_id
			        }
			    }
			}
		};

		var options = {
		    json: form,
		    method: 'POST',
			uri : this.accountData.auth_url
		}
		var that = this;
		function processResponse(error, response, body) {
		  if (!error && response.statusCode == 201) {
		    that.token = response.caseless.dict['x-subject-token'];
		    this.expiration = new Date(response.body.token.expires_at);
		    callback(that.token);
		  }else{
		  	process.stderr.write('TOKEN AUTHENTICATION FAILED:\n');
		  	process.stderr.write(error+'\n');
		  	process.stderr.write(response.statusCode+'\n');
		  }
		}

		request.post(options, processResponse);
	},

	setContainer: function(container){
		this.container = container;
	},

	listContainerContents: function(cont){
		var container = this.container;
		if(!container){
			container = cont;
		}
		var that = this;
		var listReq = function(token){
			request(
				{
					'url' : that.accountData.req_url+'AUTH_'+that.accountData.project_id+'/'+container, 
					'headers' : {'X-Auth-Token' : token}
				}, function(error, response, body){
					if (!error && response.statusCode == 200) {
			    		console.log(response.body);
		    		}else{
		    			console.log(error);
			    		console.log(response.statusCode);
		    		}
		    	}
		    );
		}
		//if the token has expired, get and set a new one first
		if(this.expiration < new Date()){
			this.setToken(listReq);
		}else{
			listReq(this.token);
		}
	}
}