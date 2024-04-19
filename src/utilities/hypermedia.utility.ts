import { Link } from 'src/interfaces/link.interface';

export const Routes = {
  Auth: 'Auth',
  Chat: 'Chat',
  Group: 'Group',
  Message: 'Message',
  User: 'User',
};

export const Methods = {
  login: 'login',
  signup: 'signup',
  create: 'create',
  read: 'read',
  update: 'update',
  delete: 'delete',
  allChats: 'allChats',
  allMessages: 'allMessages',
  allGroups: 'allGroups',
  allUsers: 'allUsers',
};

const HypermediaLinks = {
  Auth: {
    login: [
      { self: { href: '/auth/login', method: 'POST' } },
      { signup: { href: '/auth/signup', method: 'POST' } },
    ],
    signup: [
      { self: { href: '/auth/signup', method: 'POST' } },
      { login: { href: '/auth/login', method: 'POST' } },
    ],
  },
  Chat: {
    create: [
      { self: { href: '/chats', method: 'POST' } },
      { allChats: { href: '/chats', method: 'GET' } },
    ],
    allChats: [
      { self: { href: '/chats', method: 'GET' } },
      { create: { href: '/chats', method: 'POST' } },
    ],
    read: [
      { self: { href: '/chats/{id}', method: 'GET' } },
      { update: { href: '/chats/{id}', method: 'PUT' } },
      { delete: { href: '/chats/{id}', method: 'DELETE' } },
      { create: { href: '/chats', method: 'POST' } },
    ],
    update: [
      { self: { href: '/chats/{id}', method: 'PUT' } },
      { read: { href: '/chats/{id}', method: 'GET' } },
      { delete: { href: '/chats/{id}', method: 'DELETE' } },
      { create: { href: '/chats', method: 'POST' } },
    ],
    delete: [
      { self: { href: '/chats/{id}', method: 'DELETE' } },
      { self: { href: '/chats/{id}', method: 'GET' } },
      { update: { href: '/chats/{id}', method: 'PUT' } },
      { create: { href: '/chats', method: 'POST' } },
    ],
  },
  Group: {
    create: [
      { self: { href: '/groups', method: 'POST' } },
      { allGroups: { href: '/groups', method: 'GET' } },
    ],
    allGroups: [
      { self: { href: '/groups', method: 'GET' } },
      { create: { href: '/groups', method: 'POST' } },
    ],
    read: [
      { self: { href: '/groups/{id}', method: 'GET' } },
      { update: { href: '/groups/{id}', method: 'PUT' } },
      { delete: { href: '/groups/{id}', method: 'DELETE' } },
      //   { create: { href: '/groups', method: 'POST' } },
      //   { allGroups: { href: '/groups', method: 'GET' } },
    ],
    update: [
      { self: { href: '/groups/{id}', method: 'PUT' } },
      { read: { href: '/groups/{id}', method: 'GET' } },
      { delete: { href: '/groups/{id}', method: 'DELETE' } },
      //   { create: { href: '/groups', method: 'POST' } },
      //   { allGroups: { href: '/groups', method: 'GET' } },
    ],
    delete: [
      { self: { href: '/groups/{id}', method: 'DELETE' } },
      { read: { href: '/groups/{id}', method: 'GET' } },
      { update: { href: '/groups/{id}', method: 'PUT' } },
      //   { create: { href: '/groups', method: 'POST' } },
      //   { allGroups: { href: '/groups', method: 'GET' } },
      { create: { href: '/groups', method: 'POST' } },
    ],
  },
  Message: {
    create: [
      { self: { href: '/messages', method: 'POST' } },
      { allMessages: { href: '/messages', method: 'GET' } },
    ],
    allMessages: [
      { self: { href: '/messages', method: 'GET' } },
      { create: { href: '/messages', method: 'POST' } },
    ],
    read: [
      { self: { href: '/messages/{id}', method: 'GET' } },
      { update: { href: '/messages/{id}', method: 'PUT' } },
      { delete: { href: '/messages/{id}', method: 'DELETE' } },
    ],
    update: [
      { self: { href: '/messages/{id}', method: 'PUT' } },
      { read: { href: '/messages/{id}', method: 'GET' } },
      { delete: { href: '/messages/{id}', method: 'DELETE' } },
    ],
    delete: [
      { self: { href: '/messages/{id}', method: 'DELETE' } },
      //   { update: { href: '/messages/{id}', method: 'PUT' } },
      //   { delete: { href: '/messages/{id}', method: 'DELETE' } },
      { create: { href: '/messages', method: 'POST' } },
    ],
  },
  User: {
    create: [
      { self: { href: '/users', method: 'POST' } },
      { allUsers: { href: '/users', method: 'GET' } },
    ],
    allUsers: [
      { self: { href: '/users', method: 'GET' } },
      { create: { href: '/users', method: 'POST' } },
    ],
    read: [
      { self: { href: '/users/{id}', method: 'GET' } },
      { update: { href: '/users/{id}', method: 'PUT' } },
      { delete: { href: '/users/{id}', method: 'DELETE' } },
    ],
    update: [
      { self: { href: '/users/{id}', method: 'PUT' } },
      { read: { href: '/users/{id}', method: 'GET' } },
      { delete: { href: '/users/{id}', method: 'DELETE' } },
    ],
    delete: [
      { self: { href: '/users/{id}', method: 'DELETE' } },
      //   { self: { href: '/users/{id}', method: 'GET' } },
      //   { update: { href: '/users/{id}', method: 'PUT' } },
      { create: { href: '/users', method: 'POST' } },
    ],
  },
};

export const GetHyperLinks = (T1, T2): Array<Link> => {
  return HypermediaLinks[T1]?.[T2] || [];
};
