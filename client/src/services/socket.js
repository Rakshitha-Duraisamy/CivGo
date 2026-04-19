import { io } from 'socket.io-client';

// Use same host as API base URL
const SOCKET_URL = 'http://localhost:5000';

const socket = io(SOCKET_URL, {
  autoConnect: false,
  withCredentials: true,
});

export default socket;
