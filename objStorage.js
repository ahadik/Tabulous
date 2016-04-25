var cfenv = require('cfenv');
var vcapLocal = null
try {
  vcapLocal = require("./vcap-local.js");
}catch (e) {}

var appEnvOpts = vcapLocal ? {vcap:vcapLocal} : {};

var appEnv = cfenv.getAppEnv(appEnvOpts);

var req_url = 'https://dal.objectstorage.open.softlayer.com/v1/';
var swiftCredentials = appEnv.getServiceCreds("tabulous-storage");
swiftCredentials.container = process.env.TABULOUS_OBJ_CONTAINER;
swiftCredentials.req_url = req_url;

var objStorage = require('./modules/object_storage/index.js').install(swiftCredentials);