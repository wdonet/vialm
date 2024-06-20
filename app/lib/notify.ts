import { notifications } from '@mantine/notifications';

export const notifySuccess = (message: string) => {
  notifications.show({ title: 'Success', message, color: '#5a7b49' })
}
export const notifyError = (userMessage: string, e: Error) => {
  const errorMessage = e?.message;
  let message = userMessage;
  if (errorMessage) {
    message += ` .. ${errorMessage}`;
  }
  notifications.show({ title: 'Error', message, color: '#8f0e0e' })
}
