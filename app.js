const express = require("express");
const bodyParser = require("body-parser");
const https = require("https");
const mailchimp = require("@mailchimp/mailchimp_marketing");

//for api keys
require("dotenv").config();

const app = express();

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

mailchimp.setConfig({
  apiKey: `${process.env.API_KEY}`,
  server: "us7",
});

console.log(mailchimp.config);

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", function (req, res) {
  var firstName = String(req.body.firstName);
  var lastName = String(req.body.lastName);
  var email = String(req.body.email);

  const listId = "3bd1130dbe";

  async function run() {
    const response = await mailchimp.lists
      .addListMember(listId, {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      })
      .then((response) => {
        console.log(
          `Successfully added contact as an audience member. The contact's id is ${response.id}.`
        );
        res.sendFile(__dirname + "/success.html");
      })
      .catch((err) => {
        console.log("error" + err.localDescription);
        res.sendFile(__dirname + "/failure.html");
      });
  }

  run();
});

app.post("/failure", function (req, res) {
  res.redirect("/");
});
//run last
app.listen(3000, function () {
  console.log("success on port 3000");
});
