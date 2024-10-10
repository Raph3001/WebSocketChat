import {WebSocketServer, WebSocket} from "ws";
import {IncomingMessage} from "http";

const wss = new WebSocketServer({port: 8080});

const log = (message: any, ...optionalParams: any[]) => {
    console.log(new Date().toISOString(), message, ...optionalParams)
}

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
    log(`connected: ${req.socket.remoteAddress}, ${req.headers.origin}`)

    ws.on("error", (error) => log(`ERROR: ${error}`));

    ws.on("message", (_data) => {
        const data = _data.toString()
        log("received: " + data);
        if (data === 'ping') {
            ws.send('pong')
            log(`connected clients: ${wss.clients.size}`)
        } else {
            for (const client of wss.clients) {
                client.send(data);
            }
        }
    });

    ws.on("close", () => {
        log("disconnected: " + req.socket.remoteAddress)
    });
});