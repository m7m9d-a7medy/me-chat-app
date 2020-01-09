import React from 'react';
import styles from './styles';
import { withStyles } from '@material-ui/core';

class ChatViewComponent extends React.Component {
    componentDidUpdate() {
        const container = document.getElementById('chatview-container');
        if(container)
            container.scrollTo(0, container.scrollHeight);
    }
    render(){
        const { classes, chat, user } = this.props;

        if(chat === undefined) {
            return (
                <main className={classes.content} id='chatview-container'></main>
            );
        }
        else {
            return (
                <div>
                    <div className={classes.chatHeader}>
                        Your conversation with {chat.users.filter(_user => _user !== user)[0]}
                    </div>
                    <main className={classes.content} id='chatview-container'>
                        {
                            chat.messages.map((_message, _index) => {
                                return (
                                    <div key={_index} className={_message.sender === user ? classes.userSent : classes.friendSent}>
                                        {
                                            _message.message
                                        }
                                    </div>
                                )
                            })
                        }
                    </main>
                </div>
            );
        }
    }
}

export default withStyles(styles)(ChatViewComponent);