const {
    PythonShell
} = require('python-shell');
const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;

app.on('ready', function () {
    PythonShell.run('./scraper.py', null, function (err) { 
        if (err) throw err;
        console.log('saved');
    });

    PythonShell.run('./app.py');
    const openWindow = function () {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600
        });
        mainWindow.setMenuBarVisibility(true);
        mainWindow.loadURL('http://localhost:5000');
    };
    openWindow();
    mainWindow.on('closed', function () {
        mainWindow = null;
    });
});

// ショートカットキーの設定
// app.whenReady().then(() => {
//     electron.globalShortcut.register('CommandOrControl+Shift+Space', () => {
//         console.log('CommandOrControl+T+Space is pressed')
//     })
// });

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
}
}
);