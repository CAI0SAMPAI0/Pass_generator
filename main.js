const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 450,
    height: 700,
    resizable: false, 
    icon: __dirname + '/src/images/icon.ico', // Se tiver um ícone .ico
    webPreferences: {
      nodeIntegration: true
    }
  });

  win.setMenuBarVisibility(false); // Esconde a barra de menu (File, Edit, etc)
  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});