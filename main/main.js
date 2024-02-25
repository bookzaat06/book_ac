const { app, BrowserWindow  } = require("electron");
const serve = require("electron-serve");
const path = require("path");
const { autoUpdater } = require("electron-updater")

// const { updateElectronApp } = require('update-electron-app')

const appServe = app.isPackaged ? serve({
  directory: path.join(__dirname, "../out")
}) : null;

  
// updateElectronApp({
//   updateSource: {
//     type: UpdateSourceType.ElectronPublicUpdateService,
//     repo: 'bookzaat06/book_ac'
//   },
//   updateInterval: '1 hour',
//   logger: require('electron-log')
// })

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });



  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL("app://-");
    });
  } else {
 
    win.setMenuBarVisibility(false);
    win.loadURL("http://localhost:3000");
 
    win.webContents.setWindowOpenHandler(({ url }) => {
      if (url === 'about:blank') {
        return {
          action: 'allow',
          overrideBrowserWindowOptions: {
            frame: false,
            fullscreenable: false,
            backgroundColor: 'black',
            webPreferences: {
              preload: 'my-child-window-preload-script.js'
            }
          }
        }
      }
      return { action: 'deny' }
    })

   // win.webContents.openDevTools();
    // win.webContents.on("did-fail-load", (e, code, desc) => {
    //   win.webContents.reloadIgnoringCache();
    // });
  }
}

app.on("ready", () => {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify()

});

app.on("window-all-closed", () => {
    if(process.platform !== "darwin"){
        app.quit();
    }
});