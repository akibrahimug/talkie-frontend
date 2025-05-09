import axios from '@services/axios';

/**
 * ChatService class for handling chat-related operations.
 */
class ChatService {
  /**
   * Get user conversations.
   * @returns {Promise<object>} - The response from the server
   */
  async getUserConversations() {
    const response = await axios.get('/chat/message/conversation-list');
    return response;
  }

  /**
   * Get chat messages for a specific user.
   * @param {string} receiverId - The receiver id
   * @returns {Promise<object>} - The response from the server
   */
  async getConversationMessages(receiverId) {
    const response = await axios.get(`/chat/message/user/${receiverId}`);
    return response;
  }

  /**
   * Send a new message.
   * @param {object} body - The message data
   * @returns {Promise<object>} - The response from the server
   */
  async sendMessage(body) {
    const response = await axios.post('/chat/message', body);
    return response;
  }

  /**
   * Mark messages as read.
   * @param {string} senderId - The sender id
   * @param {string} receiverId - The receiver id
   * @returns {Promise<object>} - The response from the server
   */
  async markMessagesAsRead(senderId, receiverId) {
    const response = await axios.put('/chat/message/mark-as-read', { senderId, receiverId });
    return response;
  }

  /**
   * Add a reaction to a message.
   * @param {string} conversationId - The conversation id
   * @param {string} messageId - The message id
   * @param {string} reaction - The reaction type
   * @param {string} type - The action type ('add' or 'remove')
   * @returns {Promise<object>} - The response from the server
   */
  async addMessageReaction(conversationId, messageId, reaction, type) {
    const response = await axios.put('/chat/message/reaction', {
      conversationId,
      messageId,
      reaction,
      type
    });
    return response;
  }

  /**
   * Delete a message.
   * @param {string} messageId - The message id
   * @param {string} senderId - The sender id
   * @param {string} receiverId - The receiver id
   * @param {string} type - The deletion type ('deleteForMe' or 'deleteForEveryone')
   * @returns {Promise<object>} - The response from the server
   */
  async deleteMessage(messageId, senderId, receiverId, type) {
    const response = await axios.delete(`/chat/message/mark-as-deleted/${messageId}/${senderId}/${receiverId}/${type}`);
    return response;
  }

  /**
   * Get unread messages count.
   * @returns {Promise<object>} - The response from the server with unread count
   */
  async getUnreadMessagesCount() {
    // This endpoint doesn't appear to exist in the backend yet
    // We'll use a mock implementation for now
    return Promise.resolve({
      data: {
        unreadCount: 0
      }
    });
  }

  /**
   * Add a user to chat.
   * @param {string} userOne - The logged in user id
   * @param {string} userTwo - The user to add id
   * @returns {Promise<object>} - The response from the server
   */
  async addChatUser(userOne, userTwo) {
    const response = await axios.post('/chat/message/add-chat-users', { userOne, userTwo });
    return response;
  }

  /**
   * Remove a user from chat.
   * @param {string} userOne - The logged in user id
   * @param {string} userTwo - The user to remove id
   * @returns {Promise<object>} - The response from the server
   */
  async removeChatUser(userOne, userTwo) {
    const response = await axios.post('/chat/message/remove-chat-users', { userOne, userTwo });
    return response;
  }
}

export const chatService = new ChatService();
