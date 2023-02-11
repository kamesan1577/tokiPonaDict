const {
    PythonShell
} = require('python-shell');
const electron = require('electron');
const {
    exec
} = require('child_process');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let backendApp = path.join(process.cwd(), "./backend/dist/app.exe");
let backendScraper = path.join(process.cwd(), "./backend/dist/scraper.exe");
var execfile = require('child_process').execFile;

let mainWindow;

const template = electron.Menu.buildFromTemplate([{
    label: 'メニュー',
    submenu: [{
            label: "ホームに戻る",
            click: function () {
                mainWindow.loadURL('http://localhost:5000');
            }
        },
        {
            role: "quit",
            label: "終了"
        }
    ],
}, {

    label: 'ヘルプ',
    submenu: [{
        role: "help",
        label: "トキポナとは？",
        click: function () {
            electron.shell.openExternal('https://ja.wikibooks.org/wiki/%E3%83%88%E3%82%AD%E3%83%9D%E3%83%8A');
        }
    }, {
        role: "help",
        label: "単語一覧",
        click: function () {
            electron.shell.openExternal('https://ja.wikibooks.org/wiki/%E3%83%88%E3%82%AD%E3%83%9D%E3%83%8A/%E8%BE%9E%E6%9B%B8');
        }
    }, {
        role: "help",
        label: "ソースコード",
        click: function () {
            electron.shell.openExternal('https://github.com/kamesan1577/tokiPonaDict');
        }
    }]
}]);

electron.Menu.setApplicationMenu(template);

app.on('ready', function () {

    execfile(
        backendScraper, {
            windowsHide: true
        },
        (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.log(stderr);
            }
        }
    );

    execfile(
        backendApp, {
            windowsHide: true
        },
        (error, stdout, stderr) => {
            if (error) {
                throw error;
            }
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.log(stderr);
            }
        }
    );

    const openWindow = function () {
        mainWindow = new BrowserWindow({
            width: 800,
            height: 600,
            webPreferences: {
                spellcheck: false,
                nodeIntegration: false,
                contextIsolation: true,
                enableRemoteModule: true,
                preload: __dirname + '/preload.js'
            }
        });
        mainWindow.setMenuBarVisibility(true);
        mainWindow.loadURL('http://localhost:5000');
    };
    openWindow();
    mainWindow.on('closed', function () {
        mainWindow = null;
        exec("taskkill /f /t /im app.exe", (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        });
        exec("taskkill /f /t /im scraper.exe", (err, stdout, stderr) => {
            if (err) {
                console.log(err)
                return;
            }
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr}`);
        }
        );
    });
});



// //ショートカットキーの設定
// app.whenReady().then(() => {
//     electron.globalShortcut.register('CommandOrControl+Shift+Space', () => {
//         console.log('CommandOrControl+T+Space is pressed')
//         electron.ipcMain.handle('send', () => {
//             return electron.clipboard.readText();
//         });
//     })
// });

app.on('window-all-closed', function () {
    if (process.platform != 'darwin') {
        app.quit();
    }
});