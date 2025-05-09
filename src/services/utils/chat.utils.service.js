import { chatService } from '@services/api/chat/chat.service';
import { socketService } from '@services/sockets/socket.service';
import { cloneDeep, find, findIndex, remove } from 'lodash';
import { timeAgo } from '@services/utils/timeago.utils.service';

/**
 * ChatUtils class for handling chat operations.
 */
export class ChatUtils {
  // SocketIO chat
  static socketIOChat = (profile, conversations, setConversations, messages, setMessages, setUnreadCount) => {
    socketService?.socket?.on('message received', (data) => {
      // Handle receiving a new message
      if (profile?._id === data.receiverId) {
        console.log('New message received:', data);

        // If we're already viewing messages from this conversation, add to messages array
        if (messages && messages.length > 0 && messages[0].receiverId === data.senderId) {
          setMessages((prev) => [...prev, data]);

          // Mark message as read if we're actively viewing this conversation
          this.markMessageAsRead(data.senderId, profile?._id);
        } else {
          // Otherwise, increment unread count
          setUnreadCount((prev) => prev + 1);
        }

        // Update conversations list
        this.updateConversationWithNewMessage(conversations, setConversations, data);
      }
    });

    // Update message as read
    socketService?.socket?.on('message read', (data) => {
      if (messages && messages.length > 0) {
        const updatedMessages = cloneDeep(messages);
        const { messageId } = data;

        // Find the message and update its read status
        const messageIndex = findIndex(updatedMessages, (message) => message._id === messageId);
        if (messageIndex !== -1) {
          updatedMessages[messageIndex].isRead = true;
          setMessages(updatedMessages);
        }
      }
    });

    // Delete message
    socketService?.socket?.on('message deleted', (data) => {
      if (messages && messages.length > 0) {
        const updatedMessages = cloneDeep(messages);
        const { messageId } = data;

        // Remove the message from the array
        remove(updatedMessages, { _id: messageId });
        setMessages(updatedMessages);
      }
    });
  };

  /**
   * Update a conversation in the list with a new message
   * @param {Array} conversations - The conversations array
   * @param {Function} setConversations - State setter for conversations
   * @param {Object} message - The new message object
   */
  static updateConversationWithNewMessage(conversations, setConversations, message) {
    const updatedConversations = cloneDeep(conversations);

    // Find the conversation with this user
    let conversation = updatedConversations.find(
      (conv) => conv.receiverId === message.senderId || conv.receiverId === message.receiverId
    );

    if (conversation) {
      // Update existing conversation
      conversation.lastMessage = message.body;
      conversation.unreadCount = (conversation.unreadCount || 0) + 1;
      conversation.updatedAt = message.createdAt;

      // Move conversation to top
      const index = updatedConversations.indexOf(conversation);
      updatedConversations.splice(index, 1);
      updatedConversations.unshift(conversation);
    } else {
      // Create new conversation entry if it doesn't exist
      const newConversation = {
        _id: Math.random().toString(36).substring(2, 15),
        username: message.senderUsername || message.receiverUsername,
        profilePicture: message.senderProfilePicture || message.receiverProfilePicture,
        avatarColor: message.senderAvatarColor || message.receiverAvatarColor,
        lastMessage: message.body,
        unreadCount: 1,
        updatedAt: timeAgo.transform(message.createdAt),
        receiverId: message.senderId
      };

      updatedConversations.unshift(newConversation);
    }

    setConversations(updatedConversations);
  }

  /**
   * Map conversation items for display
   * @param {Array} conversations - Raw conversation data
   * @param {Object} profile - Current user profile
   * @returns {Array} - Mapped conversation items
   */
  static mapConversationItems(conversations, profile) {
    if (!conversations || !Array.isArray(conversations)) {
      return [];
    }

    return conversations.map((conversation) => {
      // The backend might return data in a different format,
      // so we need to adapt our mapping accordingly
      const otherUser =
        conversation.receiverUsername !== profile.username
          ? {
              _id: conversation.receiverId,
              username: conversation.receiverUsername,
              profilePicture: conversation.receiverProfilePicture,
              avatarColor: conversation.receiverAvatarColor
            }
          : {
              _id: conversation.senderId,
              username: conversation.senderUsername,
              profilePicture: conversation.senderProfilePicture,
              avatarColor: conversation.senderAvatarColor
            };

      return {
        _id: conversation._id || Math.random().toString(36).substring(2, 15),
        username: otherUser.username,
        profilePicture: otherUser.profilePicture,
        avatarColor: otherUser.avatarColor,
        lastMessage: conversation.body || 'Start a conversation',
        unreadCount: conversation.isRead ? 0 : 1,
        updatedAt: timeAgo.transform(conversation.createdAt),
        receiverId: otherUser._id
      };
    });
  }

  /**
   * Mark a message as read
   * @param {string} senderId - The sender ID
   * @param {string} receiverId - The receiver ID
   */
  static async markMessageAsRead(senderId, receiverId) {
    try {
      await chatService.markMessagesAsRead(senderId, receiverId);

      // Also emit to socket
      if (socketService?.socket?.connected) {
        socketService.socket.emit('message read', { senderId, receiverId });
      }
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  }

  /**
   * Get all unread messages count
   */
  static async getUnreadMessagesCount(setUnreadCount) {
    try {
      const response = await chatService.getUnreadMessagesCount();
      setUnreadCount(response.data.unreadCount || 0);
    } catch (error) {
      console.error('Error getting unread messages count:', error);
      setUnreadCount(0);
    }
  }
}
