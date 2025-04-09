import Icon from '@components/icons';
import React from 'react';

export const sideBarItems = [
  {
    index: 1,
    name: 'Streams',
    url: '/app/social/streams',
    iconName: 'Newspaper'
  },
  {
    index: 2,
    name: 'Chat',
    url: '/app/social/chat/messages',
    iconName: 'ChatCircle'
  },
  {
    index: 3,
    name: 'People',
    url: '/app/social/people',
    iconName: 'UsersThree'
  },
  {
    index: 4,
    name: 'Following',
    url: '/app/social/following',
    iconName: 'UserPlus'
  },
  {
    index: 5,
    name: 'Followers',
    url: '/app/social/followers',
    iconName: 'Heart'
  },
  {
    index: 6,
    name: 'Photos',
    url: '/app/social/photos',
    iconName: 'Image'
  },
  {
    index: 7,
    name: 'Notifications',
    url: '/app/social/notifications',
    iconName: 'Bell'
  },
  {
    index: 8,
    name: 'Profile',
    url: '/app/social/profile',
    iconName: 'User'
  }
];

export const feelingsList = [
  {
    index: 0,
    name: 'happy',
    icon: <Icon name="Smiley" weight="fill" className="feeling-icon" />
  },
  {
    index: 1,
    name: 'excited',
    icon: <Icon name="Star" weight="fill" className="feeling-icon" />
  },
  {
    index: 2,
    name: 'blessed',
    icon: <Icon name="HandsClapping" weight="fill" className="feeling-icon" />
  },
  {
    index: 3,
    name: 'loved',
    icon: <Icon name="Heart" weight="fill" className="feeling-icon" />
  }
];

export const fontAwesomeIcons = {
  Newspaper: <Icon name="Newspaper" className="icon" weight="regular" />,
  ChatCircle: <Icon name="ChatCircle" className="icon" weight="regular" />,
  UsersThree: <Icon name="UsersThree" className="icon" weight="regular" />,
  UserPlus: <Icon name="UserPlus" className="icon" weight="regular" />,
  Heart: <Icon name="Heart" className="icon" weight="regular" />,
  Image: <Icon name="Image" className="icon" weight="regular" />,
  Bell: <Icon name="Bell" className="icon" weight="regular" />,
  Cake: <Icon name="Cake" className="icon" weight="regular" />,
  User: <Icon name="User" className="icon" weight="regular" />
};

export const privacyList = [
  {
    topText: 'Public',
    subText: 'Anyone on SocialApp',
    icon: <Icon name="Globe" className="globe-icon globe" weight="regular" />
  },
  {
    topText: 'Followers',
    subText: 'Your followers on SocialApp',
    icon: <Icon name="UserCheck" className="globe-icon globe" weight="regular" />
  },
  {
    topText: 'Private',
    subText: 'For you only',
    icon: <Icon name="LockSimple" className="globe-icon globe" weight="regular" />
  }
];

export const bgColors = [
  '#ffffff',
  '#f44336',
  '#e91e63',
  '#2196f3',
  '#9c27b0',
  '#3f51b5',
  '#00bcd4',
  '#4caf50',
  '#ff9800',
  '#8bc34a',
  '#009688',
  '#03a9f4',
  '#cddc39'
];

export const avatarColors = [
  '#f44336',
  '#e91e63',
  '#2196f3',
  '#9c27b0',
  '#3f51b5',
  '#00bcd4',
  '#4caf50',
  '#ff9800',
  '#8bc34a',
  '#009688',
  '#03a9f4',
  '#cddc39',
  '#2962ff',
  '#448aff',
  '#84ffff',
  '#00e676',
  '#43a047',
  '#d32f2f',
  '#ff1744',
  '#ad1457',
  '#6a1b9a',
  '#1a237e',
  '#1de9b6',
  '#d84315'
];

export const emptyPostData = {
  _id: '',
  post: '',
  bgColor: '',
  privacy: '',
  feelings: '',
  gifUrl: '',
  profilePicture: '',
  image: '',
  userId: '',
  username: '',
  email: '',
  avatarColor: '',
  commentsCount: '',
  reactions: [],
  imgVersion: '',
  imgId: '',
  createdAt: ''
};

export const reactionsMap = {
  like: <Icon name="ThumbsUp" weight="fill" color="#50b5ff" size="lg" />,
  love: <Icon name="Heart" weight="fill" color="#f33e58" size="lg" />,
  wow: <Icon name="Smiley" weight="duotone" color="#f7b124" size="lg" />,
  sad: <Icon name="SmileyMeh" weight="fill" color="#f7b124" size="lg" />,
  happy: <Icon name="SmileyWink" weight="fill" color="#f7b124" size="lg" />,
  angry: <Icon name="SmileyAngry" weight="fill" color="#e9710f" size="lg" />
};

export const reactionsColor = {
  like: '#50b5ff',
  love: '#f33e58',
  angry: '#e9710f',
  happy: '#f7b124',
  sad: '#f7b124',
  wow: '#f7b124'
};

export const notificationItems = [
  {
    index: 0,
    title: 'Direct Messages',
    description: 'New direct messages notifications.',
    toggle: true,
    type: 'messages'
  },
  {
    index: 1,
    title: 'Follows',
    description: 'New followers notifications.',
    toggle: true,
    type: 'follows'
  },
  {
    index: 2,
    title: 'Post Reactions',
    description: 'New reactions for your posts notifications.',
    toggle: true,
    type: 'reactions'
  },
  {
    index: 3,
    title: 'Comments',
    description: 'New comments for your posts notifications.',
    toggle: true,
    type: 'comments'
  }
];

export const tabItems = (showPassword, showNotification) => {
  const items = [
    { key: 'Timeline', show: true, icon: <Icon name="User" className="banner-nav-item-name-icon" weight="regular" /> },
    {
      key: 'Followers',
      show: true,
      icon: <Icon name="Heart" className="banner-nav-item-name-icon" weight="regular" />
    },
    { key: 'Gallery', show: true, icon: <Icon name="Image" className="banner-nav-item-name-icon" weight="regular" /> },
    {
      key: 'Change Password',
      show: showPassword,
      icon: <Icon name="Key" className="banner-nav-item-name-icon" weight="regular" />
    },
    {
      key: 'Notifications',
      show: showNotification,
      icon: <Icon name="Bell" className="banner-nav-item-name-icon" weight="regular" />
    }
  ];
  return items;
};
