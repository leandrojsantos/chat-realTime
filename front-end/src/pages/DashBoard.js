import React, { useEffect, useState } from 'react';
import { Container } from 'reactstrap';
import ChatContainer from '../components/chat-components/ChatContainer';
import MessageBar from '../components/chat-components/MessageBar';
import Header from '../components/common/layout/Header';
import { socket } from '../utils/helper';

const DashBoard = (props) => {
  const { params } = props.match;
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('JOIN_ROOM', params.roomId);
  }, [params.roomId]);

  useEffect(() => {
    socket.on('NEW_MESSAGE', (message) => {
      setMessages((prevState) => [...prevState, message]);
    });
  }, []);
  return (
    <>
      <Header roomId={params.roomId} />
      <Container fluid className="p-0">
        <Container className="d-flex flex-column chat-container">
          <div className="scroll-content pl-2 pr-2">
            <ChatContainer messages={messages} />
            <MessageBar />
          </div>
        </Container>
      </Container>
    </>
  );
};

export default DashBoard;
