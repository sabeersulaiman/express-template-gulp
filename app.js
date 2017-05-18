"use strict"

const express = require('express')

let app = express()
app.use(express.static("dist"))

app.listen(3000, () => {
    console.log("Connected to port 3000")
})