import React from 'react';
import TextField from '@material-ui/core/TextField';
import Send from '@material-ui/icons/Send';
import styles from './styles';
import withStyles from '@material-ui/core/styles/withStyles';

class ChatTextBoxComponent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            chatText: ''
        };
    }

    messageValid = (text) => {
        return text && text.replace(/\s/g, '').length
    }

    userTyping = (e) => {
        e.keyCode === 13 ?
        this.submitMessage() :
        this.setState({
            chatText: e.target.value
        });
    }

    userClickedInput = () => {
        this.props.messageReadFn();
    }

    submitMessage = () => {
        if(this.messageValid(this.state.chatText)) {
            this.props.submitMessageFn(this.state.chatText);
            document.getElementById('chat-text-box').value = '';
        }
    }
    render(){
        const { classes } = this.props;
        return (
            <div className={classes.chatTextBoxContainer}>
                <TextField
                    placeholder='...'
                    onKeyUp={(e) => this.userTyping(e)}
                    id='chat-text-box'
                    className={classes.chatTextBox}
                    onFocus={this.userClickedInput}
                    ></TextField>
                    <Send
                        onClick={this.submitMessage}
                        className={classes.sendBtn}></Send>
            </div>
        );
    }
}

export default withStyles(styles)(ChatTextBoxComponent);