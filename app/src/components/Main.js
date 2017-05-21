"use strict"

const m = require('mithril')

const Main = {
    oninit : () => {
        console.log("Initialising...")
    },
    view : () => {
        return m("h1", "Hello Guys!")
    }
}

module.exports = Main