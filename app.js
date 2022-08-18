const { app, shell, BrowserWindow } = require('electron');
const path = require('path');
const express = require('express');

const serveMainPage = (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
};

const createServer = () => {
  const server = express();

  server.use(express.static(path.join(__dirname, '.')));

  // Routes are managed directly by client app
  server.get('/', serveMainPage);
  server.get('/dashboard', serveMainPage);
  server.get('/mobile', serveMainPage);
  server.get('/logs', serveMainPage);

  server.listen(62521);
};

const createWindow = () => {
  const win = new BrowserWindow({
    title: 'Wifi-Controller',
    autoHideMenuBar: true,
  });

  if (process.env.NODE_ENV !== 'development') {
    // Load production build
    createServer();
    win.loadURL('http://localhost:62521/');
  } else {
    // Load vite dev server page
    win.loadURL('http://localhost:3000/');
  }

  // Open new tabs in browser
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
