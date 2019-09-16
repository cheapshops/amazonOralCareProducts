var request = require("request");
var cheerio = require('cheerio');
var mysql = require('mysql');
const service = require('./service')

var connection = mysql.createConnection({
  //socketPath : '/var/run/mysqld/mysqld.sock',
  host: '127.0.0.1',
  user: 'root',
  password: 'arun',
  database: 'amazonOralCareProducts'
});

function get_html( url, callback ){
  request(url, function (error, response, body) {
    if (!error) {
      callback('success',body);
    } else {
      callback('error',body)
    }
  });
}
function save_url(data,callback){
  if( data.length ==  0 ){
    callback('all products url inserted .....');
  }else{
    console.log( data.length);
    rec = data[0];
    data.splice(0, 1); //remove first product
    var DATA = {
      asin : rec.asin,
      url : rec.url,
      scrapStatus : 0
    }
    console.log( DATA );
    sql = 'insert into catalog set ?';
    sql = mysql.format(sql, DATA);
    connection.query(sql,function(err, rrrr){
      console.log( err )
      console.log('INSERT HUA HAI!!!');
      save_url(data,callback)
    });
  }
}
function scrap_catalog_page( urls, callback ){
  console.log( 'Pending urls :: ' + urls.length );
  console.log( 'Pending urls :: ' + urls.length );
  console.log( 'Pending urls :: ' + urls.length );
  if( urls.length == 0 ){
    callback();
  }else{
    var urlToScrap = urls[0];
    urls.splice(0, 1);
    service.getCatalogByPuppeteer(urlToScrap, (all_urls) => {
      console.log('success')
      console.log(all_urls)
      if( all_urls.length > 0 ){
        save_url( all_urls, function(a){
          scrap_catalog_page( urls, callback );
        })
      }else{
        scrap_catalog_page( urls, callback );
      }
    }, () => {
      console.log('fail')
      scrap_catalog_page( urls, callback );
    })
  }
}

//https://www.amazon.com/s?i=beauty-intl-ship&bbn=16225006011&rh=n%3A16225006011%2Cn%3A10079992011&_encoding=UTF8&qid=1568302549&ref=

// 1-50
// 51-100
// 101-150
// 151-200
// 201-250
// 251-300
// DONE 301-350


function startScraping(){
  var urls = [];
  for( i = 1; i <= 500 ; i++ ){

    var url = "https://www.amazon.com/s?i=beauty-intl-ship&bbn=16225006011&rh=n%3A16225006011%2Cn%3A10079992011&dc&page="+i+"&_encoding=UTF8&qid=1568519643&ref=sr_pg_3"

    urls.push( url );
  }
  console.log(urls)
  scrap_catalog_page( urls, function(){
    console.log('All are done!!!');
    process.exit(0);
  })

}

startScraping();