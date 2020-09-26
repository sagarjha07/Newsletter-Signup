const express=require("express");
const bp=require("body-parser");
const request=require("request");
const https=require("https");
const { dir } = require("console");

const app=express();

//in order to serve up static files such as css and images
//we need to use a special function of express that is static
//ake a folder which will be static and used by server
app.use(express.static('public'));
app.use(bp.urlencoded({extended:true}));

app.get("/",function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

//root post route
app.post("/",function(req,res){
   const firstname=req.body.fname;
    const lastname=req.body.lname;
    const email=req.body.email;

    const data={
        members:[
            {
              email_address:email,
              status:"subscribed",
              merge_fields:{
                  FNAME:firstname,
                  LNAME:lastname
              }
            }
        ]
    };

    const jsondata=JSON.stringify(data);

    //https.request(url,options,function(response))
    const url="https://us2.api.mailchimp.com/3.0/lists/28d84225b3";
    const options={
        method:"POST",
        auth:"SAGAR:8885a844f2ac85906831641f183e05ef-us2"
    }
    const request_data=https.request(url,options,function(response){
        if(response.statusCode===200){
            res.sendFile(__dirname+"/success.html");
        }
        else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data",function(data){
            // console.log(JSON.parse(data));
        });
    });
    request_data.write(jsondata);
    request_data.end();
});


//failure post route
app.post("/failure",function(req,res){
    res.redirect("/");
});



app.listen(process.env.PORT || 3000,function(){
    console.log("server started at 3000");
}); 



//API key---->8885a844f2ac85906831641f183e05ef-us2
//list_id-->28d84225b3