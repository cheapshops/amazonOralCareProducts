var Spooky = require('spooky');
var request = require("request");

const getCatalogHtmlBySpookyJs = function(url, callback_success, callback_error ) {
  var product_details = {};
  var spooky = new Spooky({
    child: {"transport": 'http',"ssl-protocol": "tlsv1","ignore-ssl-errors": true},
    casper: {
        logLevel      : "debug",
        verbose       : true,
        pageSettings: {
            userAgent : "Mozilla/5.0 (Windows NT 10.0; WOW64; rv:44.0) Gecko/20100101 Firefox/44.0"
        },
        clientScripts: ['./jquery.js']
    }
  }, function (err) {
    if (err) {
      e = new Error('Failed to initialize SpookyJS');
      e.details = err;
      throw e;
    }
    spooky.start( url, function(){});
    // spooky.wait(1000,function(){});
    spooky.then(function(){
      // this.capture('a.png')
      var catalogProducts = this.evaluate(function(){
        var products = []
        jQuery('.s-result-list').find('div[data-asin]').each(function(){
          var url = $(this).find('a.a-link-normal').attr('href') || "";
          if( url != ""){
            url = "https://www.amazon.com" + url
          }
          var asin = $(this).attr('data-asin')

          products.push({
            asin: asin,
            url: url
          })
        })

        // return document.getElementsByTagName('pre')[0].textContent;
        return products
      })
      this.emit( 'output_data', catalogProducts );
    });
    spooky.run();
  });
  //**********************************************
  //**********************************************
  spooky.on('output_data', function ( data ) {
    // console.log('ARUn -----')
    // console.log( data )
    callback_success( data )
  });
  spooky.on('error', function (e, stack) {
    console.log(e);
    callback_error(e);
  });
  spooky.on('run.complete', function (e, stack) {
    console.error(e);
    if(e){
      callback_error(e);
    }
  });
  spooky.on('console', function (line) {
    console.log(line);
  });
  spooky.on('logg', function (line) {
    // console.log(line);
  });
}

const extractInfoFromAmazonResponse = function(html){
  var availableQuantity = ""
  var merchantName = ""
  var title = ""
  var price = ""
  try {
    let json = JSON.parse(html)
    console.log(html)
    if( json && json.itemData  ){
      var data = json.itemData
      var asinDetails = data[Object.keys(data)[0]];
      if( asinDetails ){
        availableQuantity = asinDetails.price && asinDetails.price.availableQuantity || ""
        merchantName = asinDetails.price && asinDetails.price.merchantName || ""
        title = asinDetails.itemData && asinDetails.itemData.title || ""
        price = asinDetails.price && asinDetails.price.minBuyingPrice || ""
      }
    }
  } catch(e){
    console.log(e)
  }
  return {
    instock: availableQuantity,
    seller: merchantName,
    title: title,
    price: price
  }
}


module.exports = {
  getCatalogHtmlBySpookyJs: getCatalogHtmlBySpookyJs,
  extractInfoFromAmazonResponse: extractInfoFromAmazonResponse,
}