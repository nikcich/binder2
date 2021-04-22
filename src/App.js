import React, {useState, useEffect } from "react";
import './App.css';
import LoginBox from './LoginBox';
import Home from './Home';
import axios from 'axios';
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";
import Cookies from 'js-cookie';
import Bar from './Bar';
import Top from './Top';
import Vote from './Vote';

const bcrypt = require('bcryptjs');
const saltRounds = 6;

const App = () =>{

  const [user, setUser] = useState(-1);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [usernameError, setUsernameError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [auth, setAuth] = useState(false);

  const readCookie = () => {
    const userCookie = Cookies.get("user");
    if(userCookie){
      setUser(userCookie);
      setAuth(true);
    }
  }

  useEffect(() => {

    readCookie();
  }, []);

  const handleSignUp = () => {
    // Check if User Already Exists
    // If Exists throw error
    if(username === ''){
      setUsernameError('Please provide a username');
      return;
    }else if(password === ''){
      setUsernameError('Please provide a password');
      return;
    }

    axios.get('http://66.228.51.99:4000/find/'+username).then(response => {
      const users = response.data;
      if(users.length > 0){
        setUsernameError('User already exists');
      }else{
        // Else encrypt password
        bcrypt.hash(password, saltRounds, function(err, hash) {
          // Store hash in your password DB.
          if(err){
            setPasswordError('Error encrypting password');
          }else{
            // Create new user with password
            axios.post('http://66.228.51.99:4000/add/user', {newusername: username, newpassword: hash}).then(response => {
              setUser(response.data.insertId);
              setAuth(true);
              Cookies.set("user", response.data.insertId, { expires: 0.04166666666 });
            });
          }
        });
      }
    }).catch(error => {
      console.log(error);
      setUsernameError('Erroring searching database');
    });
  }

  return (
      <Router>
        <Routes 
          user={user}
          setUser={setUser}
          password={password}
          setPassword={setPassword}
          usernameError={usernameError}
          passwordError={passwordError}
          handleSignUp={handleSignUp}
          setUsernameError={setUsernameError}
          setPasswordError={setPasswordError}
          setAuth={setAuth}
          auth={auth}
          username={username}
          setUsername={setUsername}
        />
      </Router>
  );
}

const LoginPage = (props) => {
  const{ 
    user,
    setUser,
    password,
    setPassword,
    usernameError,
    passwordError,
    handleSignUp,
    setUsernameError,
    setPasswordError,
    setAuth,
    username,
    setUsername
  } = props;

  const handleLogin = () => {
    if(username === ''){
      setUsernameError('Please provide a username');
      return;
    }else if(password === ''){
      setUsernameError('Please provide a password');
      return;
    }

    axios.get('http://66.228.51.99:4000/users?username='+username+'&pass='+password).then(response => {
      const users = response.data;
      if(users.data < 0){
        setUsernameError('User does not exist');
      }else{
        //LOG IN
        setUser(users.data);
        setAuth(true);
        //console.log(users);
        //Cookies.set("user", users.data);
        Cookies.set("user", users.data, { expires: 0.04166666666 });
      }
    }).catch(error => {
      console.log(error);
      setUsernameError('Error searching database');
    });
  }


  return(
    <div className="AppBackground">
      <div className="App-header">
      <img src={'http://66.228.51.99:4000/getimage/-1'} className="barLogoLogin" alt="Loading..."></img>
          <LoginBox 
            user={user}
            setUser={setUser}
            password={password}
            setPassword={setPassword}
            handleLogin={handleLogin}
            usernameError={usernameError}
            passwordError={passwordError}
            handleSignUp={handleSignUp}
            username={username}
            setUsername={setUsername}
          />
        
      </div>
    </div>
  )
}


const Routes = (props) => {
  const{ 
      user,
      setUser,
      password,
      setPassword,
      usernameError,
      passwordError,
      handleSignUp,
      setUsernameError,
      setPasswordError,
      setAuth,
      auth,
      username,
      setUsername
  } = props;

  const logOut = () => {
    Cookies.remove('user');
    setAuth(false);
    setUser(-1);
  }

  return(
    <Switch>
          
          <Route path="/account" >
            {!auth?(
              <Redirect to="/" />
            ):(
              <Home 
                logOut={logOut}
                user={user}
              />
            )}
          </Route >

          <Route path="/top">
            {(!auth && !Cookies.get("user")) ?(
              <Redirect to="/" />
            ):(
              <div>
                <Bar />
                <Top />
              </div>
            )}
          </Route>

          <Route path="/home">
            {(!auth && !Cookies.get("user")) ?(
              <Redirect to="/" />
            ):(
              <div>
                <Bar />
                <Vote user={user}/>
              </div>
            )}
          </Route>

          <Route path="/">
            {auth?(
              <Redirect to="/account" />
            ):(
              <LoginPage
                user={user}
                setUser={setUser}
                password={password}
                setPassword={setPassword}
                usernameError={usernameError}
                passwordError={passwordError}
                handleSignUp={handleSignUp}
                setUsernameError={setUsernameError}
                setPasswordError={setPasswordError}
                setAuth={setAuth}
                auth={auth}
                username={username}
                setUsername={setUsername}
              />
            )}
            
          </Route >
        </Switch>
  )
}









export default App;
