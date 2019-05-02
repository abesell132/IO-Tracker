"use strict";
//Add Second Screen Support Please
const { app, BrowserWindow } = require("electron");
const ioHook = require("iohook");
const cors = require("cors");
const express = require("express");
var liveServer = require("live-server");
const server = express();
var bodyParser = require("body-parser");
server.use(bodyParser.json()); // to support JSON-encoded bodies
server.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
server.use(cors());
const port = 31415;
let screenPPI = 141;
let screenPPY = screenPPI * 12;
let initialX, initialY, deltaX, deltaY;
let awaitingFirstMove = true;

let mouseClicks = 0;
let numIterations = 0;
let milesTraveled = 0;
let feetTraveled = 0;
let pixelsTraveled = 0;
let itemsCut = 0;
let itemsCopied = 0;
let itemsPasted = 0;

ioHook.on("mousedown", event => {
  mouseClicks += 1;
});
ioHook.on("keydown", event => {
  if (event.ctrlKey == true && event.keycode == 46) {
    itemsCopied += 1;
    console.log("Item Copied!");
  } else if (event.ctrlKey == true && event.keycode == 45) {
    itemsCut += 1;
    console.log("Item Cut!");
  } else if (event.ctrlKey == true && event.keycode == 47) {
    itemsPasted += 1;
    console.log("Item Pasted!");
  }
});
ioHook.on("mousemove", event => {
  switch (numIterations) {
    case 0:
      if (awaitingFirstMove) {
        initialX = event.x;
        initialY = event.y;
        awaitingFirstMove = false;
      }
      // Add one to the iteration counter
      numIterations += 1;
      break;
    case 5:
      // Reset the interation counter
      numIterations = 0;
      // Grab the final X and Y value
      let finalX = event.x;
      let finalY = event.y;

      // Calculate Delta Values
      deltaX = Math.abs(finalX - initialX);

      deltaY = Math.abs(finalY - initialY);

      pixelsTraveled += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));

      if (pixelsTraveled > screenPPY) {
        feetTraveled += 1;
        pixelsTraveled -= screenPPY;
      }
      if (feetTraveled == screenPPY) {
        milesTraveled += 1;
        feetTraveled = 0;
      }
      // Grab Initial X and Y Values
      initialX = event.x;
      initialY = event.y;

      break;
    default:
      // Add one to the iteration counter
      numIterations += 1;
  }
});

let mainWindow;
let hasLoaded = false;

server.get("/loaded", (req, res) => {
  if (!hasLoaded) {
  }
  res.send("Aye OKAY");
});
function createWindow() {
  ioHook.start();

  var params = {
    port: 27182,
    root: "./client/build",
    open: false,
    file: "index.html"
  };
  //Start UI on Port 27182
  liveServer.start(params);

  // Initialize Window
  mainWindow = new BrowserWindow({
    width: 600,
    height: 400,
    autoHideMenuBar: true,
    file: "loading.html",
    resizable: false,
    icon: "./assets/app-icon.ico",
    show: false
  });
  // Load UI from port 27182
  mainWindow.loadURL("http://localhost:27182/");

  // Show Window when window is ready
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // Close Window
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
}

app.on("ready", createWindow);

// Quit when all windows are closed.
app.on("window-all-closed", function() {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", function() {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
server.get("/", (req, res) => {
  res.json({
    feetTraveled,
    milesTraveled,
    mouseClicks,
    itemsCopied,
    itemsCut,
    itemsPasted
  });
});

server.post("/ppi", (req, res) => {
  console.log(req.body.body.screenPPI);
  screenPPI = req.body.body.screenPPI;
  screenPPY = screenPPI * 12;
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
