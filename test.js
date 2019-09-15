const service = require('./service')


var url = "https://www.amazon.com/Crest-Toothpaste-Ounce-Frozen-Bubble/dp/B07DP712B5/ref=sr_1_6034?_encoding=UTF8&qid=1568489537&s=beauty-intl-ship&sr=1-6034"

service.getProductByPuppeteer(url, (product) => {
  console.log('success')
  console.log(product)
  // update_record( row_id, product, function(){
  //   callback( 'success',product);
  // })
}, () => {
  console.log('fail')
  callback('error','');
})