import { authHandlers } from '@mocks/handlers/auth';
import { giphyHandlers } from '@mocks/handlers/giphy';
import { notificationHandlers } from '@mocks/handlers/notification';
import { setupServer } from 'msw/node';

// setup requests interception using the given handlers
export const server = setupServer(...authHandlers, ...notificationHandlers, ...giphyHandlers);
// export const server = setupServer();
