'use client';

import { ThemeProvider } from "next-themes";
import { Amplify } from 'aws-amplify';
import { Authenticator } from '@aws-amplify/ui-react';
import { cognitoConfig } from '@/lib/cognito-config';
import '@aws-amplify/ui-react/styles.css';

Amplify.configure(cognitoConfig, { ssr: true });

export function Provider(props: { children?: React.ReactNode }) {
  return (
    <Authenticator.Provider>
      <ThemeProvider attribute="class">
        {props.children}
      </ThemeProvider>
    </Authenticator.Provider>
  );
}