import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {useEffect, useRef, useState} from "react";
import {ChatMessage} from "./common/models.ts";
import MessageList from "./MessageList.tsx";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Alert from 'react-bootstrap/Alert'; // Import Alert component

function App() {
    const [userName, setUserName] = useState("");
    const userNameInput = useRef<HTMLInputElement>(null);
    const [isSetUserNameModalOpen, setIsSetUserNameModalOpen] = useState(false);
    const closeModal = () => setIsSetUserNameModalOpen(false);
    const openModal = () => setIsSetUserNameModalOpen(true);

    const [ws, setWs] = useState<WebSocket | null>(null);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [text, setText] = useState("");
    const input = useRef<HTMLInputElement>(null);

    useEffect(() => {
        return disconnectOrConnect();
    }, []);

    const sendMessage = (overriddenUserName?: string) => {
        const userNameActual = (overriddenUserName || userName);

        if (userNameActual) {
            if (ws) {
                const message: ChatMessage = {
                    text: input.current!.value,
                    nickname: userNameActual,
                    timestamp: new Date(),
                };
                ws.send(JSON.stringify(message))
            }
        } else {
            openModal();
        }
    }

    const connected = !!ws
    const [wsPingIntervalId, setWsPingIntervalId] = useState<number | NodeJS.Timeout | undefined>()
    const disconnectOrConnect = () => {
        if (!connected) {
            const webSocket = new WebSocket("ws://localhost:8080")
            setWs(webSocket)
            let intervalId: number | NodeJS.Timeout | undefined
            webSocket.onopen = () => {
                setWs(webSocket)

                intervalId = setInterval(() => {
                    webSocket.send("ping");
                }, 2000)
                setWsPingIntervalId(intervalId)
            }
            webSocket.onmessage = (ev) => {
                const data = ev.data.toString()
                if (data !== 'pong' && data !== 'ping') {
                    const message: ChatMessage = JSON.parse(data)
                    message.timestamp = new Date(message.timestamp as unknown as string)
                    setChatMessages(c => [...c, message])
                } else {
                    setText(`last '${data}' received ${new Date().toISOString()}`)
                }
            }

            return () => {
                clearInterval(intervalId)
                webSocket.close()
            }
        } else {
            clearInterval(wsPingIntervalId)
            ws!.close()
            setWs(null)
        }
    }

    return (
        <>
            <Navbar bg="dark" variant="dark">
                <Container>
                    <Navbar.Brand>Chat App</Navbar.Brand>
                    <Button variant="outline-light" onClick={disconnectOrConnect}>
                        {connected ? 'Disconnect' : 'Connect'}
                    </Button>
                </Container>
            </Navbar>

            <Container className="mt-4">
                <Alert variant="info" className="text-center">
                    Welcome to my Chat App!
                </Alert>

                <MessageList messages={chatMessages} ownUserName={userName}/>
                <p className="text-muted">Status: {text}</p>
                <form onSubmit={(event) => {
                    event.preventDefault()
                    sendMessage()
                }} className="d-flex">
                    <input ref={input} type="text" className="form-control me-2" placeholder="Type your message..."/>
                    <Button type="submit" variant="primary" disabled={!connected}>Send</Button>
                </form>
            </Container>

            <Modal show={isSetUserNameModalOpen} onHide={closeModal}>
                <Modal.Header closeButton><Modal.Title>Set user name</Modal.Title></Modal.Header>
                <Modal.Body>
                    <input ref={userNameInput} type="text" className="form-control" placeholder="Enter your name"/>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={closeModal}>Cancel</Button>
                    <Button variant="primary" onClick={() => {
                        const userName = userNameInput.current!.value
                        setUserName(userName)
                        closeModal()
                        sendMessage(userName)
                    }}>Save</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default App;
