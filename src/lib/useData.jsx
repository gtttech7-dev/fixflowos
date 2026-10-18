import {useCallback,useEffect,useState} from 'react';
import {api} from './api';
export function useData(collection,enabled=true){
  const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const refresh=useCallback(async()=>{
    if(!enabled){setLoading(false);return;}
    setLoading(true);setError('');
    try{setRows(await api('records.list',{collection,limit:500}));}catch(e){setError(e.message);}finally{setLoading(false);}
  },[collection,enabled]);
  useEffect(()=>{refresh();},[refresh]);
  return {rows,loading,error,refresh};
}
export function usePlatform(collection,enabled=true){
  const [rows,setRows]=useState([]),[loading,setLoading]=useState(true),[error,setError]=useState('');
  const refresh=useCallback(async()=>{if(!enabled){setLoading(false);return;}setLoading(true);setError('');try{setRows(await api('platform.list',{collection}));}catch(e){setError(e.message);}finally{setLoading(false);}},[collection,enabled]);
  useEffect(()=>{refresh()},[refresh]);return{rows,loading,error,refresh};
}
export function useBundle(collections,enabled=true){
  const key=collections.join('|'),[state,setState]=useState({data:{},loading:true,error:''});
  const refresh=useCallback(async()=>{
    if(!enabled){setState({data:{},loading:false,error:''});return;}
    setState(old=>({...old,loading:true,error:''}));
    const responses=await Promise.allSettled(collections.map(collection=>api('records.list',{collection,limit:500})));
    const data={};let error='';responses.forEach((r,i)=>{if(r.status==='fulfilled')data[collections[i]]=r.value;else error+=`${collections[i]}: ${r.reason?.message} `;});
    setState({data,loading:false,error});
  },[key,enabled]);
  useEffect(()=>{refresh()},[refresh]);return{...state,refresh};
}
