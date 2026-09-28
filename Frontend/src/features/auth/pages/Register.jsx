import React, {useState} from 'react'
import "../auth.form.scss"
import { useNavigate,Link } from 'react-router'
import { useAuth } from '../hooks/useAuth'


const Login = () => {

  const navigate = useNavigate()

  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")  

  const { loading, handleRegister } = useAuth()

  const handleSubmit = async (e) => {
    e.preventDefault()
    await handleRegister({ username, email, password })
    navigate("/")
  }

  if (loading) {
    return (<main><h1>Loading.....</h1></main>)
  }

  return (
    <main>
        <div className="form-container">
            <h1>Register</h1>
            <form onSubmit={handleSubmit}>
              {/* For Username */}
                <div className="input-group">
                  <label htmlFor='username'>Username</label>
                  <input 
                    onChange={ (e) => { setUsername(e.target.value) } }
                    type='text' name='username' id='username' placeholder='Enter username'/>
                </div>
              {/* For Email */}
                <div className="input-group">
                  <label htmlFor='email'>Email</label>
                  <input 
                    onChange={ (e) => { setEmail(e.target.value) } }
                    type='email' name='email' id='email' placeholder='Enter email address'/>
                </div>
              {/* For password */}
                <div className="input-group">
                  <label htmlFor='password'>Password</label>
                  <input 
                    onChange={ (e) => {  setPassword(e.target.value) } }
                    type='password' name='password' id='password' placeholder='Enter password'/>
                </div>
                <button className="button primary-button">Register</button>
            </form>

            <p>Already have an account? <Link to={"/login"}>Logic</Link></p>
        </div>

    </main>
  )
}

export default Login
