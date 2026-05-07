const { chromium } = require("playwright"); // We are using Playwright
const ClassHelper = require("./ClassHelper.js"); // Module file that stores the whole grid and the individual boxes
const { Algorithm } = require("./Algorithm.js");

// asynchronous function that runs our website
async function runBot() {
    
    const browser = await chromium.launch( {channel: "msedge", headless: false} );
    const page = await browser.newPage();
    await page.goto("https://www.zipgameunlimited.com/unlimited");
    console.log("Website opened");  

    const gridClass = await ClassHelper.Grid.getGridClass(page);
    if (!gridClass) {
        throw new Error("Could not read a square grid from the page");
    }

    Algorithm.hunt(gridClass);

}



runBot();
