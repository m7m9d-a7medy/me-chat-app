import React from 'react';
import { Link } from 'react-router-dom';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import Paper from '@material-ui/core/Paper';
import withStyles from '@material-ui/core/styles/withStyles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import styles from './styles';
const firebase = require('firebase');


class LoginComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: null,
            password: null,
            loginError: ''
        };
    }

    submitLogin = (e) => {
        e.preventDefault();
        
        firebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then(() => {
                this.props.history.push('/dashboard')
            })
            .catch(authError => {
                console.log(authError);
                this.setState({
                    loginError: authError.message
                });
            });
    }

    userTyping = (type, e) => {
        switch (type) {
            case 'email':
                this.setState({
                    email: e.target.value
                });
                break;
            case 'password':
                this.setState({
                    password: e.target.value
                });
                break;
            default:
                break;
        }
    }
    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>Login</Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitLogin(e)}>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-email-input'>Enter Your Email</InputLabel>
                            <Input autoComplete='email' autoFocus id='login-email-input' onChange={(e) => this.userTyping('email', e)}></Input>
                        </FormControl>
                        <FormControl required fullWidth margin='normal'>
                            <InputLabel htmlFor='login-password-input'>Enter Your Password</InputLabel>
                            <Input id='login-password-input' onChange={(e) => this.userTyping('password', e)} type='password'></Input>
                        </FormControl>
                        <Button type='submit' fullWidth variant='contained' className={classes.submit} color='primary'>Log In</Button>
                    </form>
                    {
                        this.state.loginError ?
                    <Typography component='h5' variant='h6' className={classes.errorText}>
                        Incorrect Login Information
                        <br></br>
                        {this.state.loginError}
                    </Typography> :
                            null
                    }
                    <Typography component='h5' variant='h6' className={classes.noAccountHeader}>Don't Have An Account?</Typography>
                    <Link className={classes.signUpLink} to='/signup'>Sign Up!</Link>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(LoginComponent);