import React from 'react';
import { FormControl, Input, InputLabel, Button, Paper, withStyles, CssBaseline, Typography } from '@material-ui/core';
import styles from './styles';
const firebase = require('firebase');

class NewChatComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            message: null
        };
    }

    userTyping = (type, e) => {
        switch (type) {
            case 'email':
                this.setState({
                    username: e.target.value
                });
                break;
            case 'message':
                this.setState({
                    message: e.target.value
                });
                break;
            default:
                break;
        }
    }

    submitNewChat = async (e) => {
        e.preventDefault();
        const userExists = await this.userExists();
        if(userExists){
            const chatExists = await this.chatExists();
            chatExists ? this.goToChat() : this.createChat();
        }
    }

    createChat = () => {
        this.props.newChatSubmitFn({
            sendTo: this.state.username,
            message: this.state.message
        });
    }

    goToChat = () => {
        this.props.goToChatFn(this.buildDocKey(), this.state.message);
    }

    buildDocKey = () => {
        return [firebase.auth().currentUser.email, this.state.username].sort().join(':');
    }

    chatExists = async () => {
        const docKey = this.buildDocKey();
        const chat = await firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .get();
        console.log(chat.exists)
        return chat.exists;
    }

    userExists = async () => {
        const usersSnapshot = await firebase
            .firestore()
            .collection('users')
            .get();
        const exists = usersSnapshot.docs
            .map(_document => _document.data().email)
            .includes(this.state.username);
        this.setState({
            serverError: !exists
        });
        return exists;
    }

    render() {
        const { classes } = this.props;
        return (
            <main className={classes.main}>
                <CssBaseline></CssBaseline>
                <Paper className={classes.paper}>
                    <Typography component='h1' variant='h5'>Send A Message!</Typography>
                    <form className={classes.form} onSubmit={(e) => this.submitNewChat(e)}>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-username'>Enter your friend's email</InputLabel>
                            <Input required
                                className={classes.input}
                                autoFocus
                                onChange={(e) => this.userTyping('email', e)}
                                id='new-chat-username'></Input>
                        </FormControl>
                        <FormControl fullWidth>
                            <InputLabel htmlFor='new-chat-message'>
                                Enter your Message
                            </InputLabel>
                            <Input required
                                className={classes.input}
                                onChange={(e) => this.userTyping('message', e)}
                                id='new-chat-message'></Input>
                        </FormControl>
                        
                    <Button className={classes.submit} variant='contained' color='primary' fullWidth type='submit'>Submit</Button>
                    </form>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(NewChatComponent);