import React,{useState,useContext} from 'react'
import {Link,useHistory,useParams} from 'react-router-dom'
import M from 'materialize-css'

const Signin = () =>{
  
  const history = useHistory()
  const [password,setPassword] = useState("")
  const {token} = useParams()
  const PostData = ()=>{
    fetch('/new-password',{
    method:"post",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({
      password,
      token
    })
  }).then(res=>res.json())
    .then(data=>{
      console.log(data)
       if(data.error){
         M.toast({html:data.error,classes:"#9e2020 red darken-3"})
       }
       else{
         M.toast({html:data.message,classes:"#368039 green darken-1"})
         history.push('/signin')
       }
    }).catch(err=>{
      console.log(err)
    })
  }
  return (
    <div className="mycard">
      <div className="card auth-card input-field">
       <h2>Instagram</h2>
         <input
         type="password"
         placeholder="Enter a new password"
         value={password}
         onChange={(e)=>setPassword(e.target.value)}
         />
         <button className="btn waves-effect waves-light #08528d blue darken-1
         " onClick={()=>PostData()}
         >
           Update Password 
         </button>
      </div>
    </div>
  );
};

export default Signin;
