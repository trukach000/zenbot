var path = require('path')

module.exports = function restApi (conf) {

  var initializeRestApi = function(tradeObject,engine) {
    for (var restapi in conf.restapi) {
      if (conf.restapi[restapi].on) {
        if (conf.debug) {
          console.log(`initializing restapi ${restapi}`)
        }
        require(path.resolve(__dirname, `../extensions/restapi/${restapi}`))(conf).run(conf, conf.restapi[restapi], tradeObject,engine)
      }
    }
  }

  return {
    initializeRestApi: initializeRestApi
  }
}

