import React from 'react';
import ChatListComponent from '../chatList/chatList';
import ChatViewComponent from '../chatView/chatView';
import ChatTextBoxComponent from '../chatTextBox/chatTextBox';
import { Button, withStyles } from '@material-ui/core';
import styles from './styles';
const firebase = require('firebase');

class DashboardComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedChat: null,
            newChatFormVisible: false,
            email: null,
            chats: []
        };
    }

    newChatBtnClicked = () => {
        this.setState({
            newChatFormVisible: true,
            selectedChat: null
        });
    }

    selectChat = async (chatIndex) => {
        await this.setState({
            selectedChat: chatIndex
        });
        this.messageRead();
    }

    componentDidMount() {
        firebase
            .auth()
            .onAuthStateChanged(async _user => {
                if (!_user) {
                    this.props.history.push('/login');
                }
                else {
                    await firebase
                        .firestore()
                        .collection('chats')
                        .where('users', 'array-contains', _user.email)
                        .onSnapshot(async result => {
                            const chats = result.docs.map(_document => {
                                return _document.data();
                            });
                            await this.setState({
                                email: _user.email,
                                chats: chats
                            });
                            //console.log(this.state);
                        });
                }
            })
    }

    signOut = () => {
        firebase.auth().signOut();
    }

    buildDocKey = (friend) => {
        return [this.state.email, friend].sort().join(':');
    }

    submitMessage = (message) => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => this.state.email !== _user)[0]);
        firebase
            .firestore()
            .collection('chats')
            .doc(docKey)
            .update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    sender: this.state.email,
                    message: message,
                    timestamp: Date.now()
                }),
                recieverHasRead: false
            })
    }

    clickedChatWhereNotSender = (chatIndex) => {
        const _messages = this.state.chats[chatIndex].messages;
        return _messages[_messages.length - 1].sender !== this.state.email;
    }

    messageRead = () => {
        const docKey = this.buildDocKey(this.state.chats[this.state.selectedChat].users.filter(_user => _user !== this.state.email)[0]);
        if(this.clickedChatWhereNotSender(this.state.selectedChat)) {
            firebase
                .firestore()
                .collection('chats')
                .doc(docKey)
                .update({
                    recieverHasRead: true
                });
        }
        else {
            console.log('clicked message where user is the sender');
        }
    }

    render() {
        const { classes } = this.props;

        return (
            <div>
                <ChatListComponent
                    history={this.props.history}
                    newChatFn={this.newChatBtnClicked}
                    selectChatFn={this.selectChat}
                    chats={this.state.chats}
                    userEmail={this.state.email}
                    selectedChatIndex={this.state.selectedChat}
                >
                </ChatListComponent>
                {
                    this.state.newChatFormVisible ?
                    null :
                    <ChatViewComponent
                        user={this.state.email}
                        chat={this.state.chats[this.state.selectedChat]}></ChatViewComponent>
                }
                {
                    this.state.selectedChat !== null && !this.state.newChatFormVisible ?
                    <ChatTextBoxComponent messageReadFn={this.messageRead} submitMessageFn={this.submitMessage}></ChatTextBoxComponent> :
                    null
                }
                <Button 
                    onClick={this.signOut}
                    className={classes.signOutBtn}>
                    Sign Out
                </Button>
            </div>
        )
    }
}

export default withStyles(styles)(DashboardComponent);