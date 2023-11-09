"use strict"

const express = require('express')

function postChecker(method) {
    if(method === "POST") {
        return true;
    } else {
        return false;
    }
}

let app = express()
app.use(express.static("dist"))

// dummy post checker middleware
app.use("/", (req, res, next) => {
    console.log(postChecker(req.method) ? "isPOST" : "notPost");
    next();
});

app.listen(3000, () => {
    console.log("Connected to port 3000")
})
