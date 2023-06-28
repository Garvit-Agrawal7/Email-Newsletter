const express = require("express")
const bodyParser = require("body-parser")
const request = require("request")
const https = require("https")

const app = express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}));


app.get("/", function(req, res) {
    res.sendFile(__dirname + "/signup.html");
});

app.post("/", function(req, res) {
    var name = req.body.name.split(' ');
    var firstName = name[0];
    var lastName = name[1];
    var email = req.body.email

    var data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    }

    const jsonData = JSON.stringify(data);  
   
    const url = "https://us21.api.mailchimp.com/3.0/lists/edf669f8f5"

    const options = {
        method: "POST",
        auth: "Dimension:9ddecb43e34c5911c4f6dd9d39eabcd4-us21"
    }

    const request = https.request(url, options, function(response) {

        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/passed.html");
        } else {
            res.sendFile(__dirname + "/failed.html");
        }

        response.on("data", function(data) {
            console.log(JSON.parse(data));
        });
    });
    request.write(jsonData);
    request.end();
});

app.post("/failed", function(req, res) {
    res.redirect("/")
});

app.listen(3000, function() {
    console.log("Server is running on port 3000")
});
