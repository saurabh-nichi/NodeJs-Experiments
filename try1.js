let port = 8080;
let http = require('http');
let dt = require('./custom_modules/date_module');
let url = require('url');
let uc = require('upper-case');
let mysql = require('mysql');
let con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root"
});
let databaseConnectionStatus = 'Not connected';
con.connect(function (err) {
  if (err) throw err;
  databaseConnectionStatus = 'Connected';
  return true;
});

http.createServer(function (req, res) {
  console.log('Request received at ' + dt.myDateTime() + ' : http://localhost:' + port + req.url);
  res.writeHead(200, { 'Content-Type': 'application/json' });
  let response = [];
  let payload = url.parse(req.url, true).query;
  if (payload.month) {
    payload.month = uc.upperCase(payload.month);
  }
  let queryResult = null;
  if (payload.query) {
    // con.query(payload.query, function(err, result){
    //   queryResult = err ? err.sqlMessage : result;
    //   return true;
    // });
    // console.log(queryResult);
    queryResult = await new Promise((resolve, reject) => {
      con.query(payload.query, function(err, result) {
        if (err) {
          reject(err.sqlMessage);
        } else {
          resolve(result);
        }
      });
    });
  }
  response.push({
    'payload': payload,
    'message': 'First attempt at node js, time: ' + dt.myDateTime(),
    'db': databaseConnectionStatus,
    'query_result': queryResult
  });
  res.write(JSON.stringify(response));
  res.end();
  console.log('--------------- Request completed at: ' + dt.myDateTime());
}).listen(port);