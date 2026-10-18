import { auth } from './firebase';
export async function api(action,params={}){
  const user=auth().currentUser;
  if(!user)throw new Error('Faça login para continuar.');
  const token=await user.getIdToken();
  let response;
  try{response=await fetch('/api/index',{method:'POST',headers:{'Content-Type':'application/json','Authorization':`Bearer ${token}`},body:JSON.stringify({action,...params})});}
  catch{throw new Error('Não foi possível acessar o servidor. Verifique a conexão e o endereço da API.');}
  let body;try{body=await response.json();}catch{throw new Error('Resposta inválida do servidor.');}
  if(!response.ok||!body.ok)throw new Error(body.error||`Erro ${response.status}`);
  return body.data;
}
