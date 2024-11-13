import { useEffect, useState } from "react";


const WSTest = () => {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080/ws/orders');

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            console.log('Message received: ', event.data);
            setMessages(prevMessages => [...prevMessages, event.data]);
        };

        socket.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socket.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        return () => {
            socket.close();
        };
    }, []);

    return (
       <>
        <div className="App">
            <h1>WebSocket Test</h1>
            <ul>
                {messages.map((message, index) => (
                    <li key={index}>{message}</li>
                ))}
            </ul>
        </div>
        </>
    );
};

export default WSTest;