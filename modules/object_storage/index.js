var request = require('request');
var fs = require('fs');
var mimeTypes = require('mime-types');
var crypto = require('crypto');

/*
	TODO: set request URL automatically from token request
*/

module.exports = {
	token:null,
	accountData: {},
	expiration: 0,
	install: function(credentials){
		//Check if the token URL was brought in with the VCAP credentials. If not, add it from environmental variables.
		if(Object.keys(credentials).indexOf('token_url') == -1){
			credentials['token_url'] = process.env.TABULOUS_OBJ_TOKEN_URL;
		}

		if(this.checkAccountData(credentials)){
			this.accountData = credentials;
		}else{
			process.stderr.write('Invalid credentials\n');
		}
		return this;
	},

	checkAccountData: function(credentials){

		['auth_url', 'token_url', 'project', 'projectId', 'region', 'userId', 'username', 'password', 'domainId', 'domainName', 'req_url'].forEach((key) => {
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
			                "id": this.accountData.userId,
			                "password": this.accountData.password
			            }
			        }
			    },
			    "scope": {
			        "project": {
			            "id": this.accountData.projectId
			        }
			    }
			}
		};

		var options = {
		    json: form,
		    method: 'POST',
			uri : this.accountData.token_url
		}
		var that = this;
		function processResponse(error, response, body) {
		  if (!error && response.statusCode == 201) {
		    that.token = response.caseless.dict['x-subject-token'];
		    this.expiration = new Date(response.body.token.expires_at);
		    if(callback){
		    	callback(that.token);
		    }
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
		var container = this.accountData.container;
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
	},
	createObject: function(cont, req, res){
		var skipperSwift = require('skipper-openstack')();

		var container = this.accountData.container;
		if(!container){
			container = cont;
		}
		var that = this;
		crypto.pseudoRandomBytes(16, function (err, raw) {
			var filename = raw.toString('hex') + '.' + mimeTypes.extension(req.file('wireframe')._files[0].stream.headers['content-type']);
			req.file('wireframe')._files[0].stream.filename = filename;
			req.file('wireframe').upload({
				adapter: require('skipper-openstack'),
				credentials: that.accountData,
				container: container
			},function(err, uploadedFiles){
				if(err){
					console.log(err);
					return res.json({
						success: false,
						error: err
					});
				}else{
					console.log(that.accountData);
					return res.json({
						success: true,
						path: 'http://dal.objectstorage.open.softlayer.com/v1/AUTH_'+that.accountData.projectId+'/'+that.accountData.container+'/'+filename
					});
				}
			});
		});
	}
}