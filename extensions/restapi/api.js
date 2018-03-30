module.exports = function api () {
  let express = require('express')
  let app = express()

  let run = function(reporter, tradeObject, engine) {

    startServer(reporter.port, reporter.ip, tradeObject, engine)
    
  }

  let objectWithoutKey = (object, key) => {
    // eslint-disable-next-line no-unused-vars
    const {[key]: deletedKey, ...otherKeys} = object
    return otherKeys
  }

  let startServer = function(port, ip, tradeObject, engine) {
    tradeObject.port = port


    app.get('/test', function (req, res) {
      res.send(objectWithoutKey(tradeObject, 'options'))
    })

    app.post('/buyLimit', function (req, res) {
      console.log('Buy by Limit: ')
      engine.executeSignal('buy')
      res.send('{"status":"OK"}')
    })

    app.post('/buyMarket', function (req, res) {
      console.log('Buy by market: ')
      engine.executeSignal('buy', null, null, false, true)
      res.send('{"status":"OK"}')
    })

    app.post('/sellLimit', function (req, res) {
      console.log('Sell by Limit: ')
      engine.executeSignal('sell')
      res.send('{"status":"OK"}')
    })

    app.post('/sellMarket', function (req, res) {
      console.log('Sell by market: ')
      engine.executeSignal('sell', null, null, false, true)
      res.send('{"status":"OK"}')
    })

    app.post('/stop', function (req, res) {
      console.log('STOP signal from restapi')
      
      res.send('{"status":"OK"}')
      process.exit(0)
    })




    app.listen(port, ip)
    tradeObject.url = ip + ':' + port + '/'

    console.log('RESTAPI running on http://' + tradeObject.url)
  }

  return {
    run: run
  }
}

