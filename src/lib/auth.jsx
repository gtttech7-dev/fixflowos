import React,{createContext,useContext,useEffect,useState} from 'react';
import {onAuthStateChanged,signOut} from 'firebase/auth';
import {configured,auth} from './firebase';
import {api} from './api';
const Context=createContext(null);
export function AuthProvider({children}){
  const [session,setSession]=useState(null),[user,setUser]=useState(null),[loading,setLoading]=useState(configured);
  const refresh=async()=>{const data=await api('me');setSession(data);return data;};
  useEffect(()=>{
    if(!configured){setLoading(false);return;}
    return onAuthStateChanged(auth(),async u=>{
      setUser(u);
      if(!u){setSession(null);setLoading(false);return;}
      try{await refresh();}catch(e){setSession({error:e.message});}
      finally{setLoading(false);}
    });
  },[]);
  return <Context.Provider value={{session,user,loading,refresh,logout:()=>signOut(auth())}}>{children}</Context.Provider>;
}
export const useAuth=()=>useContext(Context);
