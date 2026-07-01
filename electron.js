const { app, BrowserWindow } = require("electron");
const path = require("path");

// Inicia o servidor Node
require("./server");

function criarJanela() {

    const janela = new BrowserWindow({

        width: 1300,
        height: 800,

        icon: path.join(__dirname, "public/favicon/favicon.ico"),

        autoHideMenuBar: true,

        webPreferences: {

            nodeIntegration: false,
            contextIsolation: true

        }

    });

    janela.loadURL("http://localhost:3000");

}

app.whenReady().then(() => {

    // Espera o servidor iniciar

    setTimeout(() => {

        criarJanela();

    }, 1000);

});

app.on("window-all-closed", () => {

    app.quit();

});