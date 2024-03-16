import { useContext,useEffect,useState } from "react";
import { ChatContext } from "../context/ChatContext";
import axios from "axios";



export const useFetchLastMessage =(chat)=>{
    const {newMessage, notifications} = useContext(ChatContext)
    const [latestMessage, setLatestMessage] = useState(null)

    useEffect(()=>{
        const getMessage = async () =>{
            axios.get(`http://localhost:5500/api/message/${chat?._id}`)
            .then(res=>{
                const lastMessage = res.data[res.data?.length -1 ]
                setLatestMessage(lastMessage)
            })
            .catch(err=>{
                console.log(err);
            })
        }
        getMessage()
    },[newMessage,notifications,chat])
    return {latestMessage}
}