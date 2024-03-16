import {useEffect,useState } from "react";
import axios from "axios";


//1 กรองไอดีผู้รับจากchatที่ด้านในมี2เขียนเงื่อนไขเอาเเต่ไอดีของคนรับ
//2 เอาไอดีที่ได้ส่งผ่านapi ไปเพื่อเอาข้อมูลของผู้รับ
export const useFetchRecipient = (chat,user) => {
    //เก็บค่าของIdผู้รับข้อความที่กรองเเล้ว
    const [recipientUser,setRecipientUser] = useState(null)
    const [error,setError] = useState(null)
    const recipientId = chat?.members?.find((id)=>id !== user?._id)

    useEffect(()=>{
        const getUser = async()=>{
            if(!recipientId) return null
            await axios.get(`http://localhost:5500/api/user/find/${recipientId}`)
            .then(res=>{
                setRecipientUser(res.data)
            })
            .catch(err=>{
                console.log(err);
                setError(err)
            })
        }
        getUser()
    },[recipientId])
    return {recipientUser ,error}
} 

export default useFetchRecipient