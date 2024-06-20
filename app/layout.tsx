import '@mantine/core/styles.css';
import React from 'react';
import { MantineProvider, ColorSchemeScript } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import { theme } from '@/theme';

export const metadata = {
  title: 'Vial Subjects',
  description: 'Hope I get the job',
};

export default function RootLayout({ children }: { children: any }) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript />
        <link rel="shortcut icon" href="https://vial.com/wp-content/uploads/2021/09/cropped-favicon_512-32x32.png" />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body>
        <MantineProvider theme={theme}>
          <Notifications position="bottom-right" zIndex={1000} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
