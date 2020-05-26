const express=require("express");
const bodyParser=require("body-parser");
const request=require("request");
const app=express()

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs")

app.get("/",function(req,res)
{
    res.render("weatherAPI",{weather:null,error:null})
});

app.post("/",function(req,res)
{
    let city=req.body.city;
    let baseurl="https://api.openweathermap.org/data/2.5/weather?appid=5e47b94a51dc7324c965dbdf757e5f57&q="
    let url=baseurl+city;
    console.log(req.body.city)
    request(url,function(err,response,body)
    {
        if(err)
        {
            res.render("weatherAPI",{weather:null,error:"Error,please try again"});
        }
        else
        {
            let weather=JSON.parse(body)
            if(weather.main==undefined)
            {
                res.render("weatherAPI",{weather:null,error:"Error,please try again"});
            }
            else
            {
                let weatherText=`It's ${Math.ceil(weather.main.temp-273)} degrees with ${weather.weather[0].main} in ${weather.name} `;
                let weatherAddOn=`which feels like ${Math.ceil(weather.main.feels_like-273)} degrees `;
                let weatherAddOn1=`with a humidity of ${weather.main.humidity}% `;
                let weatherAddOn2=`with wind speed of ${weather.wind.speed} kmph.`
                res.render("weatherAPI",{weather:weatherText+weatherAddOn+weatherAddOn1+weatherAddOn2,error:null});
                console.log("body:",body)
            }
        }
    });
})

app.listen(3000,function()
{
    console.log("Server connected on port 3000!")
})