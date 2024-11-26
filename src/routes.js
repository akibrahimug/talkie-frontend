import { useRoutes } from 'react-router-dom';
import { AuthTabs, ForgotPassword, ResetPassword } from '@pages/auth';
import Social from '@pages/social/Social';
import Streams from '@pages/social/streams/Streams';
import Chat from '@pages/social/chat/chat';
import Profile from '@pages/social/profile/profile';
import People from '@pages/social/people/people';
import Photos from '@pages/social/photos/photos';
import Followers from '@pages/social/followers/followers';
import Following from '@pages/social/following/following';
import Notifications from '@pages/social/notifications/notifications';
import ProtectedRoutes from '@pages/ProtectedRoutes';
import Error from '@pages/error/Error';
import { Suspense } from 'react';
import StreamsSkeleton from '@pages/social/streams/StreamsSkeleton';
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
          element: <Chat />
        },
        {
          path: 'profile/:username',
          element: <Profile />
        },
        {
          path: 'people',
          element: <People />
        },
        {
          path: 'photos',
          element: <Photos />
        },
        {
          path: 'followers',
          element: <Followers />
        },
        {
          path: 'following',
          element: <Following />
        },
        {
          path: 'notifications',
          element: <Notifications />
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
