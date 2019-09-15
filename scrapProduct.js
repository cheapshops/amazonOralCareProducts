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


function update_record( row_id, data, callback){
    console.log( row_id );
    data['scrapStatus'] = 1;


    connection.query('select * from catalog where id = ?', row_id, function (err, results) {
        if (err) {
            callback();
        } else {
            if( results.length > 0 ){
                connection.query('UPDATE catalog SET ? WHERE ?', [data, { id: row_id }],function( err , rrrr){
                    console.log('UPDATE HUA HAI!!!');
                    callback();
                });
            }else{
                callback();
            }
        }
    });
}

function scrapProductPage( row_id, url, row_asin, callback ){

  console.log("Scrapping:: " + url )

  service.getProductByPuppeteer(url, (product) => {
    console.log('success')
    console.log(product)
    update_record( row_id, product, function(){
      callback( 'success',product);
    })
  }, () => {
    console.log('fail')
    callback('error','');
  })

}

function startScraping( rows ){

    console.log('\n');
    console.log('\n');
    console.log('--------------PENDING URLS :: '+rows.length);
    console.log('\n');
    console.log('\n');
    console.log('WAIT TIME : 5 SECS' );

    setTimeout(function() {
        if( rows.length == 0){
            console.log('All are done');
            process.exit(0);
        }else{
            row = rows[0];

            rows.splice(0, 1);

            row_url = row['url'];
            row_asin = row['asin'];
            row_id = row['id'];
            console.log( row_url );
            scrapProductPage( row_id, row_url,row_asin, function( status, data){
                if( status == 'error'){

                }else{
                    console.log( data );
                }
                console.log('---------------------------------------------------------');
                console.log('---------------------------------------------------------');
                console.log('---------------------------------------------------------');
                console.log('---------------------------------------------------------');
                console.log('---------------------------------------------------------');

                startScraping( rows );
            })
        }
    }, 1000);
}


function start(){
    connection.query('select * from catalog where scrapStatus = ? AND id < 2000 order by id asc', 0, function (err, results) {
        if (err) {
          console.log( err )
        } else {
            if( results.length == 0){
                console.log('All are done');
                process.exit(0);
            }else{
                startScraping( results );
            }
        }
    });
}




start();