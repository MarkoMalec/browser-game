import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Layout from "./components/layout";
import { Provider } from 'react-redux';
import store from '@store/store';
import WebSocketContext from '@context/WebSocketContext';
import useWebSocket from '@hooks/useSkills';

const queryClient = new QueryClient();

import "../styles/globals.css";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  const ws = useWebSocket();
  return (
    <WebSocketContext.Provider value={ws}>
    <QueryClientProvider client={queryClient}>
      <SessionProvider session={session}>
        <Provider store={store}>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Provider>
      </SessionProvider>
    </QueryClientProvider>
    </WebSocketContext.Provider>
  );
};

export default MyApp;
