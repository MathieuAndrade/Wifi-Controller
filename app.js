const { app, shell, BrowserWindow } = require('electron');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const express = require('express');
const fileUpload = require('express-fileupload');

const userDataPath = path.join(app.getPath('userData'), 'wifi-controller');

const checkAppDataFolder = () => {
  if (!fs.existsSync(userDataPath)) {
    fs.mkdirSync(userDataPath, { recursive: true });
  }

  if (!fs.existsSync(path.join(userDataPath, 'images'))) {
    fs.mkdirSync(path.join(userDataPath, 'images'), { recursive: true });
  }
};

const serveMainPage = (_req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
};

const createServer = () => {
  const server = express();

  server.use(cors());
  server.use(express.static(path.join(__dirname, '.')));
  server.use('/static', express.static(userDataPath));
  server.use(
    '/api/file-upload',
    fileUpload({
      limits: { fileSize: 50 * 1024 * 1024 },
    }),
  );

  // Routes are managed directly by client app
  server.get('/', serveMainPage);
  server.get('/dashboard', serveMainPage);
  server.get('/mobile', serveMainPage);
  server.get('/logs', serveMainPage);

  server.post('/api/file-upload', (req, res) => {
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    const uploadedFile = req.files.file;
    let uploadPath = path.join(userDataPath, uploadedFile.name);

    if (uploadedFile.mimetype.startsWith('image/')) {
      uploadPath = path.join(userDataPath, 'images', uploadedFile.name);
    }

    return uploadedFile.mv(uploadPath, (err) => {
      if (err) {
        return res.status(500).send(err);
      }
      return res.status(200).send('File uploaded!');
    });
  });

  server.delete('/api/delete', (req, res) => {
    const fileName = req.query.name;
    const filePath = path.join(userDataPath, fileName);

    console.log('Deleting file:', filePath);

    fs.unlink(filePath, (err) => {
      if (err) {
        return res.status(500).send('File deletion failed.');
      }
      return res.status(200).send('File deleted.');
    });
  });

  server.post('/api/open-user-folder', (_req, res) => {
    shell.openPath(userDataPath);
    res.status(200).send('User folder opened');
  });

  server.listen(62521);
};

const createWindow = () => {
  const win = new BrowserWindow({
    title: 'Wifi-Controller',
    autoHideMenuBar: true,
  });

  createServer();

  if (process.env.NODE_ENV !== 'development') {
    // Load production build
    win.loadURL('http://localhost:62521/');
  } else {
    // Load vite dev server page
    win.loadURL('http://localhost:5173/');
  }

  // Open new tabs in browser
  win.webContents.on('new-window', (event, url) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

app.whenReady().then(() => {
  createWindow();
  checkAppDataFolder();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
