import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
// import Social from '@pages/social/Social';
// import Streams from '@pages/social/streams/Streams';
// import Chat from '@pages/social/chat/chat';
// import Profile from '@pages/social/profile/profile';
// import People from '@pages/social/people/people';
// import Photos from '@pages/social/photos/photos';
// import Followers from '@pages/social/followers/followers';
// import Following from '@pages/social/following/following';
// import Notifications from '@pages/social/notifications/notifications';
import ProtectedRoutes from '@pages/ProtectedRoutes';
import Error from '@pages/error/Error';
import { Suspense, lazy } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
import NotificationSkeleton from '@pages/social/notifications/notificationSkeleton';
// lazy load the routes
const Social = lazy(() => import('@pages/social/Social'));
const Streams = lazy(() => import('@pages/social/streams/Streams'));
const Chat = lazy(() => import('@pages/social/chat/chat'));
const Profile = lazy(() => import('@pages/social/profile/profile'));
const People = lazy(() => import('@pages/social/people/people'));
const Photos = lazy(() => import('@pages/social/photos/photos'));
const Followers = lazy(() => import('@pages/social/followers/followers'));
const Following = lazy(() => import('@pages/social/following/following'));
const Notifications = lazy(() => import('@pages/social/notifications/notifications'));

export const AppRouter = () => {
  const elements = useRoutes([
    {
      path: '/',
      element: <AuthTabs />
    },
    {
      path: '/forgot-password',
      element: <ForgotPassword />
    },
    {
      path: '/reset-password',
      element: <ResetPassword />
    },
    {
      path: '/app/social',
      element: (
        <ProtectedRoutes>
          <Social />
        </ProtectedRoutes>
      ),
      children: [
        {
          path: 'streams',
          element: (
            <Suspense fallback={<StreamsSkeleton />}>
              <Streams />
            </Suspense>
          )
        },
        {
          path: 'chat/messages',
          element: (
            <Suspense>
              <Chat />
            </Suspense>
          )
        },
        {
          path: 'profile/:username',
          element: (
            <Suspense>
              <Profile />
            </Suspense>
          )
        },
        {
          path: 'people',
          element: (
            <Suspense>
              <People />
            </Suspense>
          )
        },
        {
          path: 'photos',
          element: (
            <Suspense>
              <Photos />
            </Suspense>
          )
        },
        {
          path: 'followers',
          element: (
            <Suspense>
              <Followers />
            </Suspense>
          )
        },
        {
          path: 'following',
          element: (
            <Suspense>
              <Following />
            </Suspense>
          )
        },
        {
          path: 'notifications',
          element: (
            <Suspense fallback={<NotificationSkeleton />}>
              <Notifications />
            </Suspense>
          )
        }
      ]
    },
    {
      path: '*',
      element: <Error />
    }
  ]);
  return elements;
};
