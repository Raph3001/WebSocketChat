"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
const log = (message, ...optionalParams) => {
    console.log(new Date().toISOString(), message, ...optionalParams);
};
wss.on("connection", (ws, req) => {
    log(`connected: ${req.socket.remoteAddress}, ${req.headers.origin}`);
    ws.on("error", (error) => log(`ERROR: ${error}`));
    ws.on("message", (_data) => {
        const data = _data.toString();
        log("received: " + data);
        // @ts-ignore shut up lint
        if (data === 'ping') {
            ws.send('pong');
            log(`client count: ${wss.clients.size} clients`);
        }
        else {
            for (const client of wss.clients) {
                client.send(data);
            }
        }
    });
    ws.on("close", () => {
        log("disconnected: " + req.socket.remoteAddress);
    });
});
