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

const getProductHtmlBySpookyJs = function(url, callback_success, callback_error ) {
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
      var productDetails = this.evaluate(function(){
        // var asin = "";
        var name = "";
        var category = ""
        var brand = ""
        var upc = ""
        var supplier = ""
        var starRate = ""
        var reviewRate = ""
        var price = ""
        var image = ""

        // asin = jQuery('#mbc') && jQuery('#mbc').attr('data-asin') || ""
        name = jQuery('#productTitle') && jQuery('#productTitle').text() || ""
        category = jQuery('#wayfinding-breadcrumbs_feature_div').find('li') && jQuery('#wayfinding-breadcrumbs_feature_div').find('li').last().text() || ""
        brand = jQuery('#mbc') && jQuery('#mbc').attr('data-brand') || ""

        if( jQuery('#detail-bullets').find('div.content').find('li').length > 0 ){
          jQuery('#detail-bullets').find('div.content').find('li').each(function(){
            var txt = $(this).text()
            if( txt.indexOf('UPC:') != -1 ){
              upc = txt
            }
          })
        }
        if( upc != "" && upc.indexOf("UPC:") != -1 ){
          upc = upc.replace("UPC:", "");
          upc = upc.trim();
        }
        if( upc != "" ){
          var rawUpc = upc.split(" ");
          if( rawUpc.length > 1 ){
            upc = rawUpc.join();
          }
        }

        supplier = jQuery('#sellerProfileTriggerId') && jQuery('#sellerProfileTriggerId').text() || ""

        starRate = jQuery('#acrPopover') && jQuery('#acrPopover').attr('title') || ""
        if( starRate != "" && starRate.indexOf("out of 5 stars") != -1 ){
          starRate = starRate.replace("out of 5 stars", "");
        }

        reviewRate = jQuery('#acrCustomerReviewText') && jQuery('#acrCustomerReviewText').text() || ""
        if( reviewRate != "" && reviewRate.indexOf("customer reviews") != -1 ){
          reviewRate = reviewRate.replace("customer reviews", "");
        }

        price = jQuery('#priceblock_ourprice_row').find('span#priceblock_dealprice')
          && jQuery('#priceblock_ourprice_row').find('span#priceblock_dealprice').text() || ""
        if( price == "" ){
          price = jQuery('#snsPrice').find('span#priceblock_snsprice_Based').find('.a-size-large')
          && jQuery('#snsPrice').find('span#priceblock_snsprice_Based').find('.a-size-large').text() || ""
        }
        if(price == ""){
          price = jQuery('#sns-base-price') && jQuery('#sns-base-price').text() || ""
        }
        if( price == ""){
          price = jQuery('#priceblock_ourprice') && jQuery('#priceblock_ourprice').text() || ""
        }

        image = jQuery('img#landingImage') && jQuery('img#landingImage').attr('data-old-hires') || ""

        return {
          // asin: asin.trim(),
          name: name.trim(),
          category: category.trim(),
          brand: brand.trim(),
          upc: upc.trim(),
          supplier: supplier.trim(),
          starRate: starRate.trim(),
          reviewRate: reviewRate.trim(),
          price: price.trim(),
          image: image.trim(),

        }
      })
      this.emit( 'output_data', productDetails );
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


module.exports = {
  getCatalogHtmlBySpookyJs: getCatalogHtmlBySpookyJs,
  getProductHtmlBySpookyJs: getProductHtmlBySpookyJs
}