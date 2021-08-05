//Server for API call to database
//@author Rohith Ravindranath
//@version July 10 2019

require('dotenv').config()
var express=require('express');
var app=express();
var path=require('path');
var bodyParser=require('body-parser');
const ibmdb = require('ibm_db');
const async = require('async');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

let connStr = "DATABASE="+process.env.DB_DATABASE+";HOSTNAME="+process.env.DB_HOSTNAME+";PORT="+process.env.DB_PORT+";PROTOCOL=TCPIP;UID="+process.env.DB_UID+";PWD="+process.env.DB_PWD+";";

app.get('/getProducts', function(request, response) {
  console.log("Request for /getProducts");
  ibmdb.open(connStr, function (err,conn) {
    if (err){
      return response.json({success:-1, message:err});
    }
    conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".PRODUCT;", function (err,data) {
      if (err){
        return response.json({success:-2,message:err});
      }
      conn.close(function () {
        return response.json({success:1, message:'Data Received!', data:data});
      });
    })
  })
})

app.get('/getEmployee', function(request, response) {
  console.log("Request for /getEmployee with Employee Number "+request.query.id);
  ibmdb.open(connStr, function (err,conn) {
    if (err){
      return response.json({success:-1, message:err});
    }
    conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".EMPLOYEE WHERE EMPNO="+request.query.id+";", function (err,data) {
      if (err){
        return response.json({success:-2,message:err});
      }
      conn.close(function () {
        return response.json({success:1, message:'Data Received!', data:data});
      });
    })
  })
})

app.get('/getEmployees', function(request, response) {
  console.log("Request for /getEmployees");
  ibmdb.open(connStr, function (err,conn) {
    if (err){
      return response.json({success:-1, message:err});
    }
    conn.query("SELECT EMPNO,FIRSTNME,LASTNAME,JOB FROM "+process.env.DB_SCHEMA+".EMPLOYEE;", function (err,data) {
      if (err){
        return response.json({success:-2,message:err});
      }
      conn.close(function () {
        return response.json({success:1, message:'Data Received!', data:data});
      });
    })
  })
})




 app.post('/newDataEntry', function(request, response){
   var house = JSON.parse(request.body['house']);

    ibmdb.open(connStr, function (err,conn) {
      if (err){
        return response.json({success:-1, message:err});
      }
      conn.query("SELECT MAX(ID) FROM "+process.env.DB_SCHEMA+".HOME_SALES;", function (err, data) {
        if (err){
          return response.json({success:-2, message:err});
        }
        else{
          var id = data[0]['1'] + 1;
          var address_info = JSON.parse(request.body['address']);

          var str = "INSERT INTO "+process.env.DB_SCHEMA+".HOME_ADDRESS (ADDRESS1, ADDRESS2, CITY, STATE,ZIPCODE, COUNTRY,HOME_ID) VALUES ('"+address_info['address1']+"', '"+address_info['address2']+"', '"+address_info['city']+"', '"+address_info['state']+"', "+address_info['zipcode']+", '"+address_info['country']+"', "+id+");";

          var s = "INSERT INTO "+process.env.DB_SCHEMA+".HOME_SALES (ID,LOTAREA, YEARBUILT, BLDGTYPE,HOUSESTYLE,OVERALLCOND,ROOFSTYLE,EXTERCOND,FOUNDATION,BSMTCOND,HEATING,HEATINGQC,CENTRALAIR,ELECTRICAL,FULLBATH,HALFBATH,BEDROOMABVGR,KITCHENABVGR,KITCHENQUAL,TOTRMSABVGRD,FIREPLACES,FIREPLACEQU,GARAGETYPE,GARAGEFINISH,GARAGECARS,GARAGECOND,POOLAREA,POOLQC,FENCE,MOSOLD,YRSOLD,SALEPRICE ) VALUES ("+id+","+house['lotArea']+","+house['yearBuilt']+",'"+house['bldgType']+"','"+house['houseStyle']+"',"+house['overallCond']+",'"+house['roofStyle']+"','"+house['exterCond']+"','"+house['foundation']+"','"+house['bsmtCond']+"','"+house['heating']+"','"+house['heatingQC']+"','"+house['centralAir']+"','"+house['electrical']+"',"+house['fullBath']+","+house['halfBath']+","+house['bedroomAbvGr']+","+house['kitchenAbvGr']+",'"+house['kitchenQual']+"',"+house['tempotRmsAbvGrd']+","+house['fireplaces']+",'"+house['fireplaceQu']+"','"+house['garageType']+"','"+house['garageFinish']+"',"+house['garageCars']+",'"+house['garageCond']+"',"+house['poolArea']+",'"+house['poolQC']+"','"+house['fence']+"',"+house['moSold']+","+house['yrSold']+","+house['salePrice']+");";
          conn.query(s, function (err, data) {
            if (err){
              return response.json({success:-3, message:err});
            }
            else{
              conn.query(str, function (err, data) {
                if (err){
                  return response.json({success:-4, message:err});
                }
                else{
                  conn.close(function () {
                    return response.json({success:1, message:'Data Entered!'});
                  });
                }
              });
            }
          });
        }
      });
    });

})

app.post('/getData', function(request, response){
  console.log('hi')
   ibmdb.open(connStr, function (err,conn) {
     if (err){
       return response.json({success:-1, message:err});
     }
     conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".HOME_SALES ORDER BY ID DESC LIMIT "+request.body.num+";", function (err, data) {
       if (err){
         return response.json({success:-2, message:err});
       }
       conn.close(function () {
         return response.json({success:1, message:'Data Received!', data:data});
       });
     });
   });
})

app.post('/getUniqueData', function(request, response){
   ibmdb.open(connStr, function (err,conn) {
     if (err){
       return response.json({success:-1, message:err});
     }
     conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".HOME_SALES WHERE ID="+request.body.id+";", function (err, data) {
       if (err){
         return response.json({success:-2, message:err});
       }
       else{
         conn.query("SELECT * FROM "+process.env.DB_SCHEMA+".HOME_ADDRESS WHERE HOME_ID="+request.body.id+";", function (err, data2) {
           if (err){
             return response.json({success:-3, message:err});
           }
           conn.close(function () {
             console.log(data);
             console.log(data2.length);
             if (data2.length == 0){
               data2[0] = {'ADDRESS1': '', 'ADDRESS2': '','CITY': '','STATE': '','COUNTRY': '','ZIPCODE': '','HOME_ID': data[0]['ID']};
               console.log(data2);
             }

             return response.json({success:1, message:'Data Received!', data:data,data2:data2 });
           });
         });
       }
     });
   });
})

app.post('/updateDataEntry', function(request, response){
  ibmdb.open(connStr, function (err,conn) {
    if (err){
      return response.json({success:-1, message:err});
    }

    var str2 = "UPDATE "+process.env.DB_SCHEMA+".HOME_ADDRESS SET ADDRESS1='"+request.body.addressInfo.address1+"',ADDRESS2='"+request.body.addressInfo.address2+"',CITY='"+request.body.addressInfo.city+"',STATE='"+request.body.addressInfo.state+"',COUNTRY='"+request.body.addressInfo.country+"',ZIPCODE="+request.body.addressInfo.zipcode+" WHERE HOME_ID="+request.body.id+";";

    var str4 = "INSERT INTO "+process.env.DB_SCHEMA+".HOME_ADDRESS (ADDRESS1, ADDRESS2, CITY, STATE,ZIPCODE, COUNTRY,HOME_ID) VALUES ('"+request.body.addressInfo.address1+"', '"+request.body.addressInfo.address2+"', '"+request.body.addressInfo.city+"', '"+request.body.addressInfo.state+"', "+request.body.addressInfo.zipcode+", '"+request.body.addressInfo.country+"', "+request.body.id+");";

    var str = "UPDATE "+process.env.DB_SCHEMA+".HOME_SALES SET LOTAREA="+request.body.data.lotArea+", YEARBUILT="+request.body.data.yearBuilt+", BLDGTYPE='"+request.body.data.bldgType+"',HOUSESTYLE='"+request.body.data.houseStyle+"',OVERALLCOND="+request.body.data.overallCond+",ROOFSTYLE='"+request.body.data.roofStyle+"',EXTERCOND='"+request.body.data.exterCond+"',FOUNDATION='"+request.body.data.foundation+"',BSMTCOND='"+request.body.data.bsmtCond+"',HEATING='"+request.body.data.heating+"',HEATINGQC='"+request.body.data.heatingQC+"',CENTRALAIR='"+request.body.data.centralAir+"',ELECTRICAL='"+request.body.data.electrical+"',FULLBATH="+request.body.data.fullBath+",HALFBATH="+request.body.data.halfBath+",BEDROOMABVGR="+request.body.data.bedroomAbvGr+",KITCHENABVGR="+request.body.data.kitchenAbvGr+",KITCHENQUAL='"+request.body.data.kitchenQual+"',TOTRMSABVGRD="+request.body.data.tempotRmsAbvGrd+",FIREPLACES="+request.body.data.fireplaces+",FIREPLACEQU='"+request.body.data.fireplaceQu+"',GARAGETYPE='"+request.body.data.garageType+"',GARAGEFINISH='"+request.body.data.garageFinish+"',GARAGECARS="+request.body.data.garageCars+",GARAGECOND='"+request.body.data.garageCond+"',POOLAREA="+request.body.data.poolArea+",POOLQC='"+request.body.data.poolQC+"',FENCE='"+request.body.data.fence+"',MOSOLD="+request.body.data.moSold+",YRSOLD="+request.body.data.yrSold+",SALEPRICE="+request.body.data.salePrice+" WHERE ID="+request.body.id+";";

    var str3 = "SELECT * FROM "+process.env.DB_SCHEMA+".HOME_ADDRESS WHERE HOME_ID="+request.body.id + ";";

    conn.query(str, function (err, data) {
      if (err){
        return response.json({success:-2, message:err});
      }
      conn.query(str3, function (err, data2) {
        console.log(data);
        if (err){
          return response.json({success:-3, message:err});
        }
        else{
          if (data2.length == 0 ){
            conn.query(str4, function (err, data) {
              if (err){
                return response.json({success:-2, message:err});
              }
              else{
                conn.close(function () {
                  return response.json({success:1, message:'Data Edited!'});
                });
              }
            });
          }
          else{
            conn.query(str2, function (err, data) {
              if (err){
                return response.json({success:-2, message:err});
              }
              else{
                conn.close(function () {
                  return response.json({success:1, message:'Data Edited!'});
                });
              }
            });
          }
        }

      });
    });
  });
})


app.post('/deleteData', function(request, response){
   ibmdb.open(connStr, function (err,conn) {
     if (err){
       return response.json({success:-1, message:err});
     }
     conn.query("DELETE FROM "+process.env.DB_SCHEMA+".HOME_SALES WHERE ID="+request.body.id+";", function (err, data) {
       if (err){
         return response.json({success:-2, message:err});
       }
       else{
         conn.query(" DELETE FROM "+process.env.DB_SCHEMA+".HOME_ADDRESS WHERE HOME_ID="+request.body.id+";", function (err, data) {
           if (err){
             return response.json({success:-3, message:err});
           }
           conn.close(function () {
             return response.json({success:1, message:'Data Deleted!'});
           });
         });
       }

     });
   });
})

app.listen(8080, function(){
    console.log("Server is listening on port 8080");
})
