import { useEffect, useState, useContext, useRef, useCallback } from 'react';
import WebSocketContext from '@context/WebSocketContext';

const useWebSocket = (retryInterval = 5000) => {
  const context = useContext(WebSocketContext);

  if (context) {
    return context;
  }

  const [ws, setWs] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (wsRef.current) {
        return;
      }

      const newWs = new WebSocket("wss://sevario.xyz:1337");
      wsRef.current = newWs;

      newWs.addEventListener("open", () => {
        console.log("Connected to the server");
      });

      newWs.addEventListener("message", (event) => {
        console.log(`Received message: ${event.data}`);
      });

      newWs.addEventListener("close", (event) => {
        console.log("Disconnected from the server");
        wsRef.current = null;
        setTimeout(connectWebSocket, retryInterval);
      });

      newWs.addEventListener("error", (event) => {
        console.error("WebSocket error:", event);
      });

      setWs(newWs);
    };

    connectWebSocket();

    return () => {
      if (ws) {
        ws.close();
      }
    };
  }, [retryInterval]);

  return ws;
};

export default useWebSocket;


const getSkill = (url: string, dependencies = []) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
      const data = await response.json();
      setData(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
    } finally {
      setIsLoading(false);
    }
  }, [url]);

  useEffect(() => {
    fetchData();
  }, [fetchData, ...dependencies]);

  const refreshData = () => {
    fetchData();
  };

  return { data, isLoading, error, refreshData };
};
export { getSkill };

const startXP = () => {
  const context = useContext(WebSocketContext);

  if (context) {
    return context;
  }

  const [ws, setWs] = useState<WebSocket | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  if (ws) {
    ws.send(JSON.stringify({
      "type": "skill",
    }));
  }
};
export { startXP };