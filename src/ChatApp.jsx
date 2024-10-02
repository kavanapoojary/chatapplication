import React, { useEffect, useState } from 'react';
import './ChattApp.css';

const ChatApp = () => {
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [username, setUsername] = useState('Kavana'); // Default user
  const [ws, setWs] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const users = ['Kavana', 'Kavanapoojary', 'Kavanakarkera'];

  // Comprehensive list of 300 emojis
  const emojis = [
    // Smiles
    '😀', '😁', '😂', '🤣', '😃', '😄', '😅', '😆', '😉', '😊',
    '😇', '😍', '😘', '🥰', '😗', '😙', '😚', '🙂', '🤗', '🤩',
    '🤔', '🤭', '🤫', '🤥', '😐', '😑', '😶', '🙄', '😯', '😦',
    '😧', '😮', '😲', '😵', '😳', '😱', '😨', '😰', '😥', '😓',
    '😪', '😴', '🤤', '😋', '😜', '😝', '😛', '🤑', '🤗', '🤪',
    // Hearts
    '❤️', '🧡', '💛', '💚', '💙', '💜', '🤎', '🖤', '🤍', '💖',
    '💞', '💓', '💘', '💝', '💌', '💟', '🌈', '🌹', '🌻', '🌼',
    '🌷', '🌺', '💐', '🥀', '🌸', '🌺', '🌼', '🌻', '🌷', '🌹',
    // Animals
    '🐶', '🐕', '🐩', '🐺', '🐾', '🐱', '🐈', '🐅', '🐆', '🐯',
    '🐮', '🐂', '🐄', '🐪', '🐫', '🐘', '🐭', '🐷', '🐖', '🐏',
    '🐑', '🐐', '🦙', '🦒', '🦓', '🐕', '🐶', '🐕', '🐕', '🐱',
    // Birds
    '🐦', '🐧', '🐤', '🐣', '🐥', '🦉', '🦅', '🦩', '🦢', '🦚',
    
    // People
    '👶', '🧒', '👦', '👧', '👩', '👨', '🧔', '👩‍🦰', '👩‍🦳', '👩‍🦲',
    '🧑', '👩‍🦰', '👵', '👴', '🤵', '👰', '👸', '🤴', '🧚', '🧜',
    // Miscellaneous
    '🦄', '🤖', '👽', '🎩', '🧙', '🧙‍♀️', '🧛', '🧛‍♀️', '🧝', '🧝‍♀️',
    '🧞', '🧞‍♀️', '🧟', '🧟‍♀️', '👻', '💀', '☠️', '🤡', '👽', '🎃',
  ];

  useEffect(() => {
    const webSocket = new WebSocket('ws://localhost:8080'); // Mock WebSocket URL

    webSocket.onopen = () => {
      console.log('Connected to WebSocket server');
    };

    webSocket.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setMessages((prevMessages) => [...prevMessages, message]);
      console.log(`New message from ${message.username}: ${message.text}`);
    };

    setWs(webSocket);

    return () => {
      webSocket.close();
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      const message = {
        text: messageText,
        username,
        timestamp: new Date().toLocaleTimeString(),
        id: Date.now(),
      };
      ws.send(JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
      console.log(`Sent message: ${message.text}`);
      setMessageText('');
    }
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const addEmoji = (emoji) => {
    setMessageText((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  return (
    <div className={`chat-app ${darkMode ? 'dark-mode' : ''}`}>
      <h1>Real-Time Chat Application</h1>
      <select onChange={(e) => setUsername(e.target.value)} value={username} className="user-select">
        {users.map((user) => (
          <option key={user} value={user}>{user}</option>
        ))}
      </select>
      <button onClick={toggleDarkMode} className="toggle-button">
        Toggle Dark Mode
      </button>
      <div className="messages">
        {messages.map((msg) => (
          <div key={msg.id} className="message">
            <span className="username">{msg.username}</span>
            <p className="text">{msg.text}</p>
            <span className="timestamp">{msg.timestamp}</span>
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          placeholder="Type your message..."
          className="message-input"
        />
        <button type="button" className="emoji-button" onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
          😊
        </button>
        <button type="submit" className="send-button">Send</button>
      </form>
      {showEmojiPicker && (
        <div className="emoji-picker">
          {emojis.map((emoji) => (
            <span key={emoji} onClick={() => addEmoji(emoji)} className="emoji">
              {emoji}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatApp;
