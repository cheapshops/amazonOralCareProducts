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
                  if( err ){
                    console.log(err)
                    console.log('ERROR in UPDATE....')
                    connection.query('UPDATE catalog SET ? WHERE ?', [{scrapStatus:2}, { id: row_id }],function( err , rrrr){

                    })
                  } else {
                    console.log('SUCCESS UPDATE HUA HAI.....');
                  }
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



  var headLess = true;
  // if( row_id % 2 == 0 ){
    // headLess = false;
  // }

  console.log( row_id  + ' headless :: ' + headLess )

  service.getProductByPuppeteer(url, headLess, (product) => {
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

                startScraping( rows );
            })
        }
    }, 2000);
}


function start( low, end ){
  var q = "select * from catalog where scrapStatus = 0  AND id > "+low+" AND id < "+end+"  order by id asc";
  if( low == 0  && end == 0 ){
    q = "select * from catalog where scrapStatus = 0 order by id asc";
  }

  console.log( q )

    connection.query(q, function (err, results) {
        if (err) {

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



var args = process.argv.slice(2);
console.log( args )
var low = 0
var end = 0
if( args[0] ){
  low = args[0]
}
if( args[1] ){
  end = args[1]
}

console.log( low )
console.log( end )

start( low, end )

// if( low != 0 && end != 0 ){
//   start( low, end )
// } else {
//   console.log('pass limit!!')
// }