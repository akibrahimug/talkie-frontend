import { io } from 'socket.io-client';

class SocketService {
  socket;

  setupSocketConnection() {
    this.socket = io(process.env.REACT_APP_BASE_ENDPOINT, {
      transports: ['websocket'],
      secure: true
    });
    this.socketConnectionEvent();
  }

  socketConnectionEvent() {
    this.socket.on('connect', () => {
      console.log('Connected to the server');
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from the server, trying to reconnect...');
      this.socket.connect();
    });

    this.socket.on('connect_error', (error) => {
      console.log('Connection error:', error);
      this.socket.connect();
    });
  }
}

export const socketService = new SocketService();
