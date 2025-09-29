import React from 'react';

const TypingIndicator = ({ users }) => {
  if (!users || users.length === 0) return null;

  return (
    <p className="typing-indicator" role="status" aria-live="polite">
      {users.join(', ')} está digitando...
    </p>
  );
};

export default TypingIndicator;
