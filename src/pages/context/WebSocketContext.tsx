import { createContext } from 'react';

const WebSocketContext = createContext<WebSocket | null>(null);

export default WebSocketContext;