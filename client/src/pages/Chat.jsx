import React, { useContext } from "react";
import { ChatContext } from "../context/ChatContext";
import { Container, Stack } from "react-bootstrap";
import UserChat from "../component/chat/UserChat";
import {AuthContext} from '../context/AuthContext'
import PotentialChat from "../component/chat/PotentialChat";
import ChatBox from "../component/chat/ChatBox";


const Chat = () => {
  //ดึงค่าที่ได้มากจากchat context ว่าไอดีที่ล็อกอินอยู่มีเเชทกับใครบ้างมาเเล้ว 
  //mapค่าเเละส่งผ่านpropsส่งต่อไปที่ chat => UserChat.jsx 
  const { userChats, isUserChatLoading, userChatError,updateCurrentChat } = useContext(ChatContext);
  const {user} = useContext(AuthContext)
  return (
    <Container className="text-danger">
      <PotentialChat/>
      {userChats?.length < 1 ? null : (
        <Stack direction="horizontal" gap={4} className="align-items-start">
          <Stack className="messages-box flex-grow-0 pe-3" gap={3}>
            {isUserChatLoading && <p>Loading chats....</p>}
            {
              userChats && userChats.map((chat,index)=>{
                return(
                  <div key={index} onClick={()=>updateCurrentChat(chat)}>
                    <UserChat chat={chat} user={user}/>
                  </div>
                )
              })
            }
          </Stack>
          <ChatBox/>
        </Stack>
      )}
    </Container>
  );
};

export default Chat;
