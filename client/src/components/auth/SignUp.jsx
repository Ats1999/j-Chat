import React,{useState,useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import {Link} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

import Email from "./Email";
import BottomNav from "./BottomNav";
import StatusCode from "../util/status-code";
// validate
import Validate from '../util/validate';
import helperText from "../util/helper-text";
import SnackBar from "../util/SnackBar";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function SignUp(props) {
  const classes = useStyles();
  const [clicked,setClicked] = useState(false);
  const [isEmail,setIsEmail] = useState(true);
  const [isPassword,setIsPassword] = useState(true);
  const [isName,setIsName] = useState(true);

  //inputs
  const [fname,setFname] = useState("");
  const [lname,setLname] = useState("");
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [rememberMe,setRememberMe] = useState(false);
  const [snackBar,setSnackBar] = useState(null);

  function handleNameChange (e,nameType){
    if(!Validate.text(e.target.value))
      setIsName(false)
    else setIsName(true)

    if(nameType==="fname")
      setFname(e.target.value)
    else setLname(e.target.value);
  } 
  function handleEmailChange (e){
    if(!Validate.email(e.target.value))
      setIsEmail(false)
    else setIsEmail(true)

    setEmail(e.target.value)
  } 

  function handlePasswordChange (e){
    if(!Validate.password(e.target.value))
      setIsPassword(false)
    else setIsPassword(true)

    setPassword(e.target.value)
  }

  function handleSubmit(e){
    e.preventDefault()

    // check valid input
    if(!isName || !isEmail || !isPassword || !fname || !lname || !email || !password){
      setSnackBar(<SnackBar 
        msg="Enter all the fields correctly." 
        severity="info"
        setSnackBar={setSnackBar}
      ></SnackBar>)
      return;
    }

    axios.post("/signup",{
      fname:fname,
      lname:lname,
      email:email,
      password:password
    }).then(res=>{
      if(res.status == StatusCode.success)
          setSnackBar(<SnackBar 
            msg="Email sent sussfully." 
            severity="success"
            setSnackBar={setSnackBar}
          ></SnackBar>)
          try{
            const token = res.data;
            localStorage.token = token;
          }catch(e){
            console.log(e)
          }
        props.history.go(-1);
    }).catch(err=>{
      console.log(err);
      if(err.response.status == StatusCode.internalServerError)
        setSnackBar(<SnackBar 
          msg="Internal server error!" 
          severity="error"
          setSnackBar={setSnackBar}
        ></SnackBar>)

      if(err.response.statu == StatusCode.unProcessableEntity){
        setSnackBar(<SnackBar 
          msg="Try with vailid input!" 
          severity="error"
          setSnackBar={setSnackBar}
        ></SnackBar>)
      }

      if(err.response.status == StatusCode.userAlreadyExists)
        setSnackBar(<SnackBar 
          msg="User already exist!" 
          severity="error"
          setSnackBar={setSnackBar}
        ></SnackBar>)
    })
    
    //setClicked(true);
  }
  if(clicked)
  return <Email/>;

  return (
    <Container component="main" maxWidth="xs">
      {snackBar}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!isName}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                value={fname}
                id="firstName"
                label="First Name"
                autoFocus
                onChange={(e)=>handleNameChange(e,"fname")}
                helperText={!isName?helperText.text:""}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={!isName}
                variant="outlined"
                required
                fullWidth
                value={lname}
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={(e)=>handleNameChange(e,"lname")}
                helperText={!isName?helperText.text:""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!isEmail}
                variant="outlined"
                required
                fullWidth
                value={email}
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={(e)=>handleEmailChange(e)}
                helperText={!isEmail?helperText.email:""}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={!isPassword}
                variant="outlined"
                required
                fullWidth
                value={password}
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={(e)=>handlePasswordChange(e)}
                helperText={!isPassword?helperText.password:""}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel onChange={(e)=>setRememberMe(!rememberMe)}
                control={<Checkbox  color="primary" />}
                label="Remember Me"
                value={rememberMe}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={(e)=>handleSubmit(e)}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      <BottomNav history={props.history}/>
      </div>
    </Container>
  );
}