import { authHandlers } from '@mocks/handlers/auth';
import { setupServer } from 'msw/node';

// setup requests interception using the given handlers
export const server = setupServer(...authHandlers);
// export const server = setupServer();
