import {ChatMessage} from "./common/models.ts";
import MessageListItem from "./MessageListItem.tsx";

interface Props {
    messages: ChatMessage[]
    ownUserName: string
}

const MessageList = ({messages, ownUserName}: Props) => {
    return (
        <div className="chat-box p-3 mb-4" style={{height: '400px', overflowY: 'scroll', background: '#f9f9f9'}}>
            {messages && messages.map(message => <MessageListItem key={message.timestamp.toString()}
                                                                  chatMessage={message}
                                                                  isFromSelf={message.nickname === ownUserName}/>)}
        </div>
    );
};

export default MessageList;
