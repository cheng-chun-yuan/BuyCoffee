const express = require("express");
const fetch = require("node-fetch");
const https = require("https");
const bodyParser = require('body-parser');
const agent = new https.Agent({
    rejectUnauthorized: false
})
const app = express();
require('dotenv').config();
const port = process.env.PORT;
const cors = require('cors');
const API_URL = process.env.API_URL;
const API_SECRET = process.env.API_SECRET; // Replace with your API secret
const API_KEY = process.env.API_KEY; // this will be injected to index.html
const messageData = [];
console.log("Using API URL: " + API_URL);
console.log("Using API key: " + API_KEY);
console.log("Using API secret: " + API_SECRET);

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*')
    next();
});
app.use(cors());
app.use(bodyParser.json());
/** 
 * Register - Get token from the passwordless API
 * 
 * The passwordless client side code needs a Token to register a passkey to a UserId.
 * The token is used by the Passwordless API to verify that this action is allowed for this user.
 * Your server can create this token by calling the Passwordless API with the ApiSecret.
 * This allows you to control the process, perhaps you only want to allow new users to register or only allow already signed in users to add a passkey to their own account.
 * Please see: https://docs.passwordless.dev/guide/get-started.html#build-a-registration-flow
 */
app.get("/create-token", async (req, res) => {

    const userId = getRandomInt(999999999);
    const alias = req.query.alias;
    const displayname = "Mr Guest";
    // grab the userid from session, cookie etc
    const payload = {
        userId,
        username: alias || displayname,
        displayname,
        aliases: alias ? [alias] : [] // We can also set aliases for the userid, so that signin can be initiated without knowing the userid
    };

    console.log("creating-token", API_URL);
    // Send the username to the passwordless api to get a token
    var response = await fetch(API_URL + "/register/token", {
        method: "POST",
        body: JSON.stringify(payload),
        headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json' },
        agent
    });

    var responseData = await response.json();

    console.log("passwordless api response", response.status, response.statusText, responseData);

    if (response.status == 200) {
        console.log("received token: ", responseData.token);
    } else {
        // Handle or log any API error
    }

    res.status(response.status);
    res.send(responseData);
});
app.get("/verify-signin", async (req, res) => {
    const token = { token: req.query.token };

    console.log("Validating token", token);
    const response = await fetch(API_URL + "/signin/verify", {
        method: "POST",
        body: JSON.stringify(token),
        headers: { ApiSecret: API_SECRET, 'Content-Type': 'application/json' },
        agent
    });

    var body = await response.json();

    if (body.success) {
        console.log("Succesfully verfied signin for user", body);
    } else {
        console.warn("Sign in failed", body);
    }
    res.statusCode = response.status;
    res.send(body);
});
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}