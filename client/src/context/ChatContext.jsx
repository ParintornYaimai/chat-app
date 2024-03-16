import { createContext, useState, useEffect, useCallback } from "react";
import axios from "axios";
import { io } from "socket.io-client";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children, user }) => {
  //เก็บห้องเเชทของid ที่ล็อกอินอยู่ว่ามีห้องเเชทกับใครบ้าง
  const [userChats, setUserChats] = useState(null);
  const [isUserChatLoading, setIsUserChatLoading] = useState(false);
  const [userChatError, setUserChatError] = useState(null);
  //ใช้เก็บรายชื่อผู้ใช้ที่ยังไม่มีห้องแชทกับผู้ใช้อื่น
  const [potentialChats, setPotentialChats] = useState([]);
  //เก็บเเชทที่ส่งมาจาก pages=> chatcontext => curentChat
  const [currentChat, setcurrentChat] = useState(null);
  //เก็บค่า message ที่คุยกันในเเชทที่ดึงมาจากapi
  const [messages, setMessages] = useState(null);
  const [isMessageLoading, setIsMessageLoading] = useState(false);
  const [messagesError, setMessagesError] = useState(null);
  const [sendMessageError, setSendMessageError] = useState(null);
  const [newMessage, setNewMessage] = useState(null);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  console.log("notifications", notifications);

  //initial socket
  useEffect(() => {
    const newSocket = io("http://localhost:3000");
    setSocket(newSocket);
    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  //add online users
  useEffect(() => {
    if (socket === null) return;
    socket.emit("addNewUser", user?._id);
    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });
    return () => {
      socket.off("getOnlineUsers");
    };
  }, [socket]);

  //send message
  useEffect(() => {
    if (socket === null) return;
    const recipientId = currentChat?.members.find((id) => id !== user?._id);

    socket.emit("sendMessage", { ...newMessage, recipientId });
  }, [newMessage]);

  //receive message and notification
  useEffect(() => {
    if (socket === null) return;

    socket.on("getMessage", (res) => {
      if (currentChat?._id !== res.chatId) return;
      setMessages((prev) => [...prev, res]);
    });

    socket.on("getNotification", (res) => {
      const isChatOpen = currentChat?.members.some((id) => id === res.secondId);

      if (isChatOpen) {
        setNotifications((prev) => [{ ...res, isRead: true }, ...prev]);
      } else {
        setNotifications((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChat]);

  //PotentialChats
  //เเสดงuserทั้งหมด เเละกรองออกเพื่อให้ได้รายชื่อผู้ใช่ที่ยังไม่ได้สร้างการสนทนาเเเละส่งไปยัง==>chat==>potentialChas
  useEffect(() => {
    const getusers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5500/api/user/getAllUser`
        );
        const pChats = res.data.filter((u) => {
          let isChatCreated = false;
          if (user?._id === u._id) return false;

          if (userChats) {
            isChatCreated = userChats?.some((chat) => {
              return chat.members[0] === u._id || chat.members[1] === u._id;
            });
          }
          return !isChatCreated;
        });
        setPotentialChats(pChats);
        setAllUsers(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    getusers();
  }, [userChats]);

  //ค้นหาว่าไอดีที่ล็อกอินอยู่มีเเชทกับใครบ้าง เเล้วส่งไอดีของยูสเซอร์ที่ล็อกอินเข้ามาไปทางapiเเล้วส่งต่าต่อไปที่ pages => chat.jsx
  useEffect(() => {
    setIsUserChatLoading(true);
    const getUserChat = async () => {
      if (user?._id) {
        await axios
          .get(`http://localhost:5500/api/chat/${user?._id}`)
          .then((res) => {
            setUserChats(res.data);
            setIsUserChatLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsUserChatLoading(false);
            setUserChatError(error.message);
          });
      }
    };
    getUserChat();
  }, [user, notifications]);

  //ค้นหา Message จาก idข้อมูลในcurrentChatที่ถูกอัพเดตมา
  //จากฟังชั่น updateCurrentChat ที่ถูกส่งมาจาก pages=>chat
  useEffect(() => {
    setIsMessageLoading(true);
    const getMessage = async () => {
      if (user?._id) {
        await axios
          .get(`http://localhost:5500/api/message/${currentChat._id}`)
          .then((res) => {
            setMessages(res.data);
            setIsMessageLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsMessageLoading(false);
            setMessagesError(error.message);
          });
      }
    };
    getMessage();
  }, [currentChat]);

  //sendMessage
  const sendTextMessage = useCallback(
    async (textMessage, sender, currentChatId, setTextMessage) => {
      if (!textMessage) {
        return alert("You must type something...");
      } else {
        await axios
          .post(`http://localhost:5500/api/message/sendMessage`, {
            chatId: currentChatId,
            senderId: sender._id,
            text: textMessage,
          })
          .then((res) => {
            console.log(res.data);
            setNewMessage(res.data);
            setMessages((prev) => [...prev, res.data]);
            setTextMessage("");
          })
          .catch((err) => {
            console.log(err);
            sendMessageError(err);
          });
      }
    },
    []
  );

  //รับparameterมาจาก pages=>chat
  const updateCurrentChat = useCallback((chat) => {
    setcurrentChat(chat);
  }, []);

  //สร้างช่องchatสำหรับuserที่ยังไม่มีข่องเเชท
  const createChat = useCallback(async (firstId, secondId) => {
    await axios
      .post(`http://localhost:5500/api/chat/createChat`, { firstId, secondId })
      .then((res) => {
        console.log("createChat Function", res.data);
        setUserChats((prev) => [...prev, res.data]);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const markAllNotificationsAsRead = useCallback((notifications) => {
    const mNotifications = notifications.map((n) => {
      return {
        ...n,
        isRead: true,
      };
    });
    setNotifications(mNotifications);
  }, []);

  const markNotificationAsRead = useCallback(
    (n, userChats, user, notifications) => {
      //find chat to open
      const desiredChat = userChats.find((chat) => {
        const chatMembers = [user._id, n.senderId];
        const isDesiredChat = chat?.members.every((member) => {
          return chatMembers.includes(member);
        });

        return isDesiredChat;
      });
      //mark notification as read
      const mNotifications = notifications.map((el) => {
        if (n.senderId === el.senderId) {
          return { ...n, isRead: true };
        } else {
          return el;
        }
      });
      updateCurrentChat(desiredChat);
      setNotifications(mNotifications);
    },
    []
  );

  const markThisUserNotificationsAsRead = useCallback(
    (thisUserNotifications, notifications) => {
      // mark notifications as read
      const mNotifications = notifications.map(el =>{
        let notification 

        thisUserNotifications.forEach(n => {
          if(n.senderId === el.senderId){
            notification = {...n, isRead:true}
          }else{
            notification = el
          }
        })

        return notification
      })

      setNotifications(mNotifications)
    },[]);

  return (
    <ChatContext.Provider
      value={{
        userChats,
        isUserChatLoading,
        userChatError,
        potentialChats,
        createChat,
        updateCurrentChat,
        messages,
        isMessageLoading,
        messagesError,
        currentChat,
        sendTextMessage,
        onlineUsers,
        notifications,
        allUsers,
        markAllNotificationsAsRead,
        markNotificationAsRead,
        markThisUserNotificationsAsRead,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
