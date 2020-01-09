import React from 'react';
import ChatListComponent from '../chatList/chatList';
import ChatViewComponent from '../chatView/chatView';
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

    selectChat = (chatIndex) => {
        this.setState({
            selectedChat: chatIndex
        });
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
                            console.log(this.state);
                        });
                }
            })
    }

    signOut = () => {
        firebase.auth().signOut();
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