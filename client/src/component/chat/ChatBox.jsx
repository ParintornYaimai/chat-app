import React, { useContext, useState,useRef,useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import { ChatContext } from "../../context/ChatContext";
import useFetchRecipient from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import moment from "moment";
import InputEmoji from "react-input-emoji";
import { IoIosSend } from "react-icons/io";

const ChatBox = () => {
  const { user } = useContext(AuthContext);
  const { currentChat, messages, isMessageLoading, sendTextMessage } =
    useContext(ChatContext);
  const { recipientUser } = useFetchRecipient(currentChat, user);
  console.log("recipientUser", recipientUser);
  //เก็บค่าจาก input
  const [textMessage, setTextMessage] = useState("");
  const scroll  = useRef()

  console.log('text',textMessage)
  
  useEffect(() => {
    scroll.current?.scrollIntoView({behavior:'smooth'})
    
  }, [messages])
  
  if (!recipientUser) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>
        No Conversation selected yet...
      </p>
    );
  }
  if (isMessageLoading) {
    return (
      <p style={{ textAlign: "center", width: "100%" }}>Loading Chat...</p>
    );
  }
  return (
    <Stack gap={4} className="chat-box text-white ">
      <div className="chat-header ">
        <strong>{recipientUser?.username}</strong>
      </div>
      <Stack gap={3} className="messages">
        {messages &&
          messages.map((message, index) => {
            return (
              <Stack
                key={index}
                className={`${
                  message?.senderId === user?._id
                    ? "message self align-self-end flex-grow-0"
                    : "message align-self-start flex-grow-0"
                }`}
                ref={scroll}
              >
                <span>{message.text}</span>
                <span>{moment(message.createdAt).calendar()}</span>
              </Stack>
            );
          })}
      </Stack>
      <Stack direction="horizontal" gap={3} className="chat-input flex-grow-0">
        <InputEmoji
          value={textMessage}
          onChange={setTextMessage}
          fontFamily="nunito"
          borderColor="rgba(72,112,223,0.2)"
        />
        <button
          className="send-btn"
          onClick={()=>
            sendTextMessage(textMessage, user, currentChat._id,setTextMessage)
          }
        >
          <IoIosSend />
        </button>
      </Stack>
    </Stack>
  );
};

export default ChatBox;
