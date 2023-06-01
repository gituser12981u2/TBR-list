// main.ts
import {app, BrowserWindow} from "electron";
import {createServer} from "./backend/dist/server";
import path from "path";
import isDev from "electron-is-dev";

function createWindow() {
	let win = new BrowserWindow({
		width: 800,
		height: 600,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	const url = isDev
		? "http://localhost:3000"
		: `file://${path.join(__dirname, "../build/index.html")}`; // In prod, we'll serve from local build directory

	win.loadURL(url);
	createServer();
}

app.whenReady().then(createWindow);
