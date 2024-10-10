import {ChatMessage} from "./common/models.ts";

interface Props {
    chatMessage: ChatMessage
    isFromSelf: boolean
}

const MessageListItem = ({chatMessage, isFromSelf}: Props) => {
    return (
        <div className={`mb-2 p-2 ${isFromSelf ? 'bg-primary text-white' : 'bg-light text-dark'}`}
             style={{borderRadius: '10px', maxWidth: '75%', alignSelf: isFromSelf ? 'flex-end' : 'flex-start'}}>
            <strong>{isFromSelf ? "You" : chatMessage.nickname}</strong> <small className="text-muted">
            on {chatMessage.timestamp.toLocaleTimeString()}:
        </small>
            <p className="mb-0">{chatMessage.text}</p>
        </div>
    );
};

export default MessageListItem;
