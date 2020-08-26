const fs = require('fs')
const qs = require('querystring')
const path = require('path')
const url = require('url')
const os = require('os')
const process = require('process')
const Electron = require('electron')
const { ipcMain, Menu, app, BrowserWindow, BrowserView } = Electron
const TouchBar = Electron.TouchBar
let platform = os.platform
let arch = os.arch
let gitVersion = ''
app.on('ready', () => {
    let option = {
        width: 1024,
        height: 768,
        movable: true,
        resizable: true,
        frame: true,
        transparent: false,
        maximizable: true,
        minimizable: true,
        webPreferences: {
            nodeIntegration: true
        }
    }
    if(platform == 'win32') {
        option.frame = false
        // option.transparent = true
    }
    else if(platform == 'darwin') {
        option.frame = false
    }
    let mainWindow = new BrowserWindow(option)
    // mainWindow.webContents.openDevTools()
    mainWindow.loadURL(path.join('file://', __dirname, './frame.html'))
    if(platform == 'darwin') {
        mainWindow.setWindowButtonVisibility(true)
    }
    // let mainWindowBounds, mainWindowWidth, mainWindowHeight, viewHeight, viewWidth
    let mainWindowBounds = mainWindow.getBounds()
    let mainWindowWidth = mainWindowBounds.width
    let mainWindowHeight = mainWindowBounds.height
    let viewWidth = Math.floor(mainWindowWidth)
    let viewHeight = Math.floor(mainWindowWidth - 80)
    // console.log('mainWindow: \n', 'width:', mainWindowWidth, '\nheight: ', mainWindowHeight)
    // console.log(mainWindowBounds)
    // console.log('view: \n', 'width:', viewWidth, '\nheight: ', viewHeight)
    let viewBounds = {
        x: 0,
        y: 80,
        width: parseInt(viewWidth),
        height: parseInt(viewHeight)
    }
    let view = new BrowserView({
        webPreferences: {
            nodeIntegration: true
        }
    })
    // view.setBounds(viewBounds)
    mainWindow.setBrowserView(view)
    view.setBounds(viewBounds)
    view.webContents.loadURL(path.join('file://', __dirname, './index.html'))
    ipcMain.on('closeMainWindow', () => {
        mainWindow.close()
    })
    ipcMain.on('minMainWindow', () => {
        mainWindow.minimize()
    })
    ipcMain.on('maxMainWindow', () => {
        if(mainWindow.isMaximized()) {
            mainWindow.unmaximize()
        }
        else {
            mainWindow.maximize()
        }
    })
    ipcMain.on('fullMainWindow', () => {
        mainWindow.setFullScreen(!mainWindow.isFullScreen())
    })
    mainWindow.on('close', () => {
        mainWindow = null
    })
})