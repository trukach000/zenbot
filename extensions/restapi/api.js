module.exports = function api () {
  let express = require('express')
  let app = express() 
  let collectionService = require('../../lib/services/collection-service')
  let isBackFilled = false;
  const util = require('util')

  let run = function(conf ,reporter, tradeObject, engine) {

    startServer(conf, reporter.port, reporter.ip, tradeObject, engine)
    
  }

  let objectWithoutKey = (object, key) => {
    // eslint-disable-next-line no-unused-vars
    const {[key]: deletedKey, ...otherKeys} = object
    return otherKeys
  }

  let backFilled = function(){
    isBackFilled  = true;
  }

  let startServer = function(conf, port, ip, tradeObject, engine) {
    tradeObject.port = port

    var collectionServiceInstance = collectionService(conf)



    app.get('/trades', function (req, res) {
      console.log('Get trades:\n')
      if(!isBackFilled){
        res.send('{"status":"Backfilling"}')
        return
      }
      collectionServiceInstance.getMyTrades().find().toArray(
        function(e,docs){
          console.log(util.inspect(docs, false, null))
          res.send(JSON.stringify(docs))
        }
      );
    
    })

    app.post('/buyLimit', function (req, res) {
      console.log('Buy by Limit: \n')
      if(!isBackFilled){
        res.send('{"status":"Backfilling"}')
        return
      }
      engine.executeSignal('buy')
      res.send('{"status":"OK"}')
    })

    app.post('/buyMarket', function (req, res) {
      console.log('Buy by market: \n')
      if(!isBackFilled){
        res.send('{"status":"Backfilling"}')
        return
      }
      engine.executeSignal('buy', null, null, false, true)
      res.send('{"status":"OK"}')
    })

    app.post('/sellLimit', function (req, res) {
      console.log('Sell by Limit: \n')
      if(!isBackFilled){
        res.send('{"status":"Backfilling"}')
        return
      }
      engine.executeSignal('sell')
      res.send('{"status":"OK"}')
    })

    app.post('/sellMarket', function (req, res) {
      console.log('Sell by market: \n')
      if(!isBackFilled){
        res.send('{"status":"Backfilling"}')
        return
      }
      engine.executeSignal('sell', null, null, false, true)
      res.send('{"status":"OK"}')
    })

    app.post('/stop', function (req, res) {
      console.log('STOP signal from restapi\n')
      if(!isBackFilled){
        res.send('{"status":"Backfilling"}')
        return
      }
      res.send('{"status":"OK"}')
      process.exit(0)
    })


    app.listen(port, ip)
    tradeObject.url = ip + ':' + port + '/'

    console.log('RESTAPI running on http://' + tradeObject.url)
  }

  return {
    run: run,
    backFilled: backFilled 
  }
}

