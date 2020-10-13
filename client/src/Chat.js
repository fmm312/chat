import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';

const myId = uuidv4();
const socket = io('http://localhost:8080');
socket.on('connect', () => console.log('[IO] Connect => A new connection has been established'));

const Chat = () => {
    const [message, updateMessage] = useState('');
    const [messages, updateMessages] = useState([]);

    useEffect(() => {
      const handleNewMessage = (newMessage) => {
        updateMessages([...messages, newMessage])
      };
          
      socket.on('chat.message', handleNewMessage);

      return () => socket.off('chat.message', handleNewMessage);
    }, [messages]);

    const handleFormSubmit = event => {
      event.preventDefault();

      if (message.trim()) {
        socket.emit('chat.message', {
            id: myId,
            message
        });

        updateMessage('');
      }
    };

    const handleInputChange = (event) => {
      updateMessage(event.target.value);
    };

    return (
      <main className="container">
        <ul className="list">
          { messages.map((item, index) => (
            <li
              className={`list__item list__item--${item.id === myId ? 'mine' : 'other'}`}
              key={index}
            >
              <span className={`message message--${item.id === myId ? 'mine' : 'other'}`}>
                {item.message}
              </span>
            </li>
          ))}
        </ul>
        <form className="form" onSubmit={handleFormSubmit}>
          <input
            className="form__field"
            onChange={handleInputChange}
            placeholder="Type a new message here"
            type="text"
            value={message}
          />
        </form>
      </main>
    )
}

export default Chat
