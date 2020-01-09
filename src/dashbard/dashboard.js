import React from 'react';
import ChatListComponent from '../chatList/chatList';
const firebase = require('firebase');

class DashboardComponent extends React.Component {
    constructor(props){
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
        console.log(chatIndex);
    }

    componentDidMount(){
        firebase
            .auth()
            .onAuthStateChanged(async _user => {
                if(!_user){
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

    render() {
        return (
            <ChatListComponent
                history={this.props.history}
                newChatFn={this.newChatBtnClicked}
                selectChatFn={this.selectChat}
                chats={this.state.chats}
                userEmail={this.state.email}
                selectedChatIndex={this.state.selectedChat}
            >
            </ChatListComponent>
        )
    }
}

export default DashboardComponent;