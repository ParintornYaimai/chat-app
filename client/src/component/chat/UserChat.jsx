import React, { useContext } from "react";
import useFetchRecipient from "../../hooks/useFetchRecipient";
import { Stack } from "react-bootstrap";
import avatar from "../../assets/avatar.jpg";
import { ChatContext } from "../../context/ChatContext";
import { unReadNotifications } from "../../utils/unReadNotifications";
import { useFetchLastMessage } from "../../hooks/useFetchLastMessage";
import moment from 'moment'

//รับค่าจาก pages => chat.jsxที่ได้มาจากการmapเเละส่งมาจากpropsมาที่componentนี้(userchat)
//เเละส่งค่าต่อไปยัง hooks=> recipientUser
const UserChat = ({ chat, user }) => {
  const { recipientUser } = useFetchRecipient(chat, user);
  const { onlineUsers, notifications, markThisUserNotificationsAsRead, } = useContext(ChatContext);
  const {latestMessage} = useFetchLastMessage(chat)
  const unReadNotification = unReadNotifications(notifications);
  const thisUserNotifications = unReadNotification?.filter((n) => {
    return n.senderId == recipientUser?._id;
  });
  const isOnlien = onlineUsers?.some(
    (user) => user?.userId === recipientUser?._id
  );

  const truncateText = (text) =>{
    let shortText =  text.substring(0,20)

    if(text.lenght > 20){
      shortText = shortText + "..."
    }
    return shortText
  }
  
  return (
    <Stack
      direction="horizontal"
      gap={3}
      className="user-card align-items-center p-2 justify-content-between"
      role="button"
      onClick={() => {
        if(thisUserNotifications?.length !== 0){
          markThisUserNotificationsAsRead(
            thisUserNotifications,
            notifications
          )
        }
      } }
    >
      <div className="d-flex">
        <div className="me-2">
          <img src={avatar} height="35px" className="rounded-circle" />
        </div>
        <div className="text-content">
          <div className="name">{recipientUser?.username}</div>
          <div className="text">{
            latestMessage?.text  && (
              <span>{truncateText(latestMessage?.text)}</span>
            )
          }</div>
        </div>
      </div>
      <div className="d-flex flex-column align-items-end">
        <div className="date">{moment(latestMessage?.createAt).calendar()}</div>
        <div
          className={
            thisUserNotifications?.length > 0 ? "this-user-notifications" : ""
          }
        >
          {thisUserNotifications?.length > 0
            ? thisUserNotifications?.length
            : ""}
        </div>
        <span className={isOnlien ? "user-online" : ""}></span>
      </div>
    </Stack>
  );
};

export default UserChat;
