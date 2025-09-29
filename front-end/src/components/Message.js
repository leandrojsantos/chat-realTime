import React from 'react';

const Message = ({ message, author, type, timestamp }) => {
  const isSystem = type === 'system';
  const isYou = author === 'Você';
  
  return (
    <div
      className={`message ${isYou ? 'you' : isSystem ? 'system' : 'other'}`}
      role="listitem"
    >
      <div className="message-content">
        <p>{message}</p>
      </div>
      {!isSystem && (
        <div className="message-meta">
          <p>{author}</p>
          <p>{timestamp || new Date().toLocaleTimeString()}</p>
        </div>
      )}
    </div>
  );
};

export default Message;
