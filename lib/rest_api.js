var path = require('path')

module.exports = function restApi (conf) {

  var api;

  var initializeRestApi = function(tradeObject,engine) {
    for (var restapi in conf.restapi) {
      if (conf.restapi[restapi].on) {
        if (conf.debug) {
          console.log(`initializing restapi ${restapi}`)
        }
        api = require(path.resolve(__dirname, `../extensions/restapi/${restapi}`))(conf)
        api.run(conf, conf.restapi[restapi], tradeObject,engine)
      }
    }
  }

  var backFilled = function(){
    api.backFilled();
  }

  return {
    initializeRestApi: initializeRestApi,
    backFilled: backFilled
  }
}

