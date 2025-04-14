import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from '@components/avatar/Avatar';
import '@pages/social/chat/chat.scss';
import { chatService } from '@services/api/chat/chat.service';
import { ChatUtils } from '@services/utils/chat.utils.service';
import { Utils } from '@services/utils/utils.service';
import { socketService } from '@services/sockets/socket.service';
import useEffectOnce from '@hooks/useEffectOnce';

const Chat = () => {
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);

  // Fetch conversations on component mount
  useEffectOnce(() => {
    getUserConversations();

    // Setup socket listeners
    socketService?.socket?.emit('setup', { userId: profile?._id });
  });

  // Get user conversations
  const getUserConversations = async () => {
    try {
      setLoading(true);
      const response = await chatService.getUserConversations();
      console.log('Conversations response:', response.data);

      // Map conversations for display
      const mappedConversations = ChatUtils.mapConversationItems(response.data.conversations || [], profile);
      console.log('Mapped conversations:', mappedConversations);

      setConversations(mappedConversations);

      // Get unread count
      await ChatUtils.getUnreadMessagesCount(setUnreadCount);

      setLoading(false);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setLoading(false);
      Utils.dispatchNotification(dispatch, error?.response?.data?.message || 'Error fetching conversations', 'error');
    }
  };

  // Setup socket listeners
  useEffect(() => {
    ChatUtils.socketIOChat(profile, conversations, setConversations, messages, setMessages, setUnreadCount);

    return () => {
      // Clean up socket listeners
      if (socketService?.socket) {
        socketService.socket.off('message received');
        socketService.socket.off('message read');
        socketService.socket.off('message deleted');
      }
    };
  }, [profile, conversations, messages]);

  // Get messages for selected conversation
  const getConversationMessages = async (receiverId) => {
    try {
      setLoading(true);
      const response = await chatService.getConversationMessages(receiverId);
      console.log('Messages response:', response.data);

      if (response.data && response.data.messages) {
        setMessages(response.data.messages);

        // Mark messages as read
        if (profile?._id) {
          await ChatUtils.markMessageAsRead(receiverId, profile._id);
        }
      } else {
        setMessages([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setLoading(false);
      Utils.dispatchNotification(dispatch, error?.response?.data?.message || 'Error fetching messages', 'error');
    }
  };

  // Select a conversation
  const selectConversation = (conversation) => {
    setActiveConversation(conversation);
    getConversationMessages(conversation.receiverId);
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() || !activeConversation) return;

    try {
      const messageData = {
        receiverId: activeConversation.receiverId,
        receiverUsername: activeConversation.username,
        receiverAvatarColor: activeConversation.avatarColor,
        receiverProfilePicture: activeConversation.profilePicture,
        body: messageText,
        gifUrl: '',
        isRead: false,
        selectedImage: ''
      };

      // Add to UI immediately for better UX
      const tempMessage = {
        ...messageData,
        _id: `temp-${Date.now()}`,
        senderUsername: profile.username,
        senderAvatarColor: profile.avatarColor,
        senderProfilePicture: profile.profilePicture,
        senderId: profile._id,
        createdAt: new Date().toISOString()
      };

      setMessages([...messages, tempMessage]);
      setMessageText('');

      // Scroll to bottom
      scrollToBottom();

      // Send to server
      const response = await chatService.sendMessage(messageData);
      console.log('Message sent response:', response.data);

      // Replace temp message with real one if possible
      if (response.data && response.data.message) {
        setMessages((prev) => prev.map((msg) => (msg._id === tempMessage._id ? response.data.message : msg)));
      }
    } catch (error) {
      console.error('Error sending message:', error);
      Utils.dispatchNotification(dispatch, error?.response?.data?.message || 'Error sending message', 'error');
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-container">
      {/* Conversations sidebar */}
      <div className="conversations-container">
        <h2>Conversations</h2>
        {loading && !conversations.length ? (
          <div className="loading">Loading conversations...</div>
        ) : (
          <div className="conversation-list">
            {conversations.length === 0 ? (
              <div className="no-conversations">No conversations yet.</div>
            ) : (
              conversations.map((conversation) => (
                <div
                  key={conversation._id}
                  className={`conversation-item ${activeConversation?._id === conversation._id ? 'active' : ''}`}
                  onClick={() => selectConversation(conversation)}>
                  <Avatar
                    name={conversation.username}
                    bgColor={conversation.avatarColor}
                    textColor="#ffffff"
                    size={40}
                    avatarSrc={conversation.profilePicture}
                  />
                  <div className="conversation-info">
                    <h4>{conversation.username}</h4>
                    <p>{conversation.lastMessage || 'Start a conversation'}</p>
                    <span className="time">{conversation.updatedAt}</span>
                  </div>
                  {conversation.unreadCount > 0 && <div className="unread-badge">{conversation.unreadCount}</div>}
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Messages section */}
      <div className="messages-container">
        {activeConversation ? (
          <>
            <div className="conversation-header">
              <Avatar
                name={activeConversation.username}
                bgColor={activeConversation.avatarColor}
                textColor="#ffffff"
                size={40}
                avatarSrc={activeConversation.profilePicture}
              />
              <h3>{activeConversation.username}</h3>
            </div>

            <div className="messages-list">
              {loading ? (
                <div className="loading">Loading messages...</div>
              ) : messages.length === 0 ? (
                <div className="no-messages">No messages yet. Start the conversation!</div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message._id}
                    className={`message-item ${message.senderId === profile._id ? 'sent' : 'received'}`}>
                    {message.senderId !== profile._id && (
                      <Avatar
                        name={message.senderUsername}
                        bgColor={message.senderAvatarColor}
                        textColor="#ffffff"
                        size={30}
                        avatarSrc={message.senderProfilePicture}
                      />
                    )}
                    <div className="message-content">
                      {message.body}
                      <span className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))
              )}
              <div ref={messagesEndRef} />
            </div>

            <form className="message-input-container" onSubmit={sendMessage}>
              <input
                type="text"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
              />
              <button type="submit" disabled={!messageText.trim()}>
                Send
              </button>
            </form>
          </>
        ) : (
          <div className="no-conversation-selected">
            <h3>Select a conversation to start chatting</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
