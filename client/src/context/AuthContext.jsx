import { createContext, useCallback, useEffect, useState } from "react";
import axios from 'axios'

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerError, setRegisterError] = useState(null);
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  //เก็บค่าที่ถูกส่งมาจาก ฟังชั่น updateRegisterInfo
  const [registerInfo, setRegisterInfo] = useState({
    username: "",
    email: "",
    password: "",
  });
  //เก็บค่าที่ถูกส่งมาจาก ฟังชั่น updateLoginInfo
  const [loginInfo,setLoginInfo] = useState({
    email: "",
    password: "",
  })
  const [loginError,setLoginError] = useState(null)
  const [isLoginLoading,setIsLoginLoading] = useState(false)

  //update state registerInfo ด้วยค่าที่ถูงส่งมาจาก pages => register
  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  }, []);
  
  //protect route
  useEffect(()=>{
    const user = localStorage.getItem('User')
    setUser(JSON.parse(user))
  },[])

  //regiaster 
  const registerUser = useCallback(async (e) => {
    e.preventDefault()
    setIsRegisterLoading(true)
    setRegisterError(null)
    await axios.post(`http://localhost:5500/api/user/register`,registerInfo)
    .then(res=>{
      setIsRegisterLoading(false)
    })
    .catch(err=>{
      setRegisterError(err.response.data.message)
      console.log(err.message);
      setIsRegisterLoading(false)
    })
    
  }, [registerInfo]);

  //update state LoginInfo ด้วยค่าที่ถูงส่งมาจาก pages => login
  const updateLoginInfo = useCallback((info)=>{
    setLoginInfo(info)
  },[])
  
  //login user
  const loginUser = useCallback(async(e)=>{
    e.preventDefault()
    setIsLoginLoading(true)
    setLoginError(null)
    await axios.post(`http://localhost:5500/api/user/login`,loginInfo)
    .then(res=>{
      setIsLoginLoading(false)
      localStorage.setItem('User',JSON.stringify(res.data))
      setUser(res.data)
    })
    .catch(err=>{
      setLoginError(err.response.data.message)
      console.log(err.message)
      setIsLoginLoading(false)
    })
  },[loginInfo])

  //logoutUser
  const logoutUser = useCallback(()=>{
    localStorage.removeItem('User')
    setUser(null)
  },[])


  return (
    <>
      <AuthContext.Provider
        value={{
          user,
          registerInfo,
          updateRegisterInfo,
          registerUser,
          registerError,
          isRegisterLoading,
          logoutUser,
          updateLoginInfo,
          loginUser,
          loginError,
          isLoginLoading,
          loginInfo,
        }}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
};
