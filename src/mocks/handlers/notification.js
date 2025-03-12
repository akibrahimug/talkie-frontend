import { rest } from 'msw';
import { notificationData } from '@mocks/data/notification.mock';

export const notificationHandlers = [
  rest.get('http://localhost:5000/api/v1/notifications', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Notifications retrieved successfully',
        notifications: [notificationData]
      })
    );
  }),

  rest.put('http://localhost:5000/api/v1/notification/:messageId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Notification marked as read'
      })
    );
  }),

  rest.delete('http://localhost:5000/api/v1/notification/:messageId', (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        message: 'Notification deleted successfully'
      })
    );
  })
];

export const emptyNotificationsMock = rest.get('http://localhost:5000/api/v1/notifications', (req, res, ctx) => {
  return res(
    ctx.status(200),
    ctx.json({
      message: 'Notifications retrieved successfully',
      notifications: []
    })
  );
});
