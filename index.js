const http = require('http');
const fs = require('fs');
var requests = require("requests");

const homeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempVal,orgVal)=>{
    let temperature = tempVal.replace("{%tempval%}",orgVal.main.temp);
     temperature = temperature.replace("{%tempmin%}",orgVal.main.temp_min);
     temperature = temperature.replace("{%tempmax%}",orgVal.main.temp_max);
     temperature = temperature.replace("{%location%}",orgVal.name);
     temperature = temperature.replace("{%country%}",orgVal.sys.country);
     temperature = temperature.replace("{%tempstatus%}",orgVal.weather[0].main);
return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Indore&appid=93fec8718b7b23d0703637f37d32ccc1')
            .on('data',  (chunk) =>{
                const objData = JSON.parse(chunk);
                const arrData = [objData];
                // console.log(arrData[0].main.temp_min);   
                // console.log(arrData);

                const realTimeData = arrData.map(val=>replaceVal(homeFile,val)).join("");
                
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on('end',  (err)=> {
                if (err) return console.log('connection closed due to errors', err);

                console.log('end');
                res.end();
            });

    }
    else{
        res.end("File not found");
    }
});

server.listen(8000,()=>{
    console.log(`The server is running at port 8000 and the url is 127.0.0.1:8000`);
});

