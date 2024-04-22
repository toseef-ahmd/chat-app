const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const url = process.env.MONGO_DB_URL;

console.log('URL: ', url);

const dbName = 'chatapp';

// Create a new MongoClient
const client = new MongoClient(url);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log('Connected successfully to server');

    const db = client.db(dbName);

    // Insert into the User collection
    const usersCollection = db.collection('users');
    const users = [
      {
        username: 'user1',
        password: 'pass1',
        email: 'user1@example.com',
        firstName: 'User',
        lastName: 'One',
        avatar: 'avatar1.jpg',
        status: 1,
        role: 0,
        friends: [],
      },
      {
        username: 'user2',
        password: 'pass2',
        email: 'user2@example.com',
        firstName: 'User',
        lastName: 'Two',
        avatar: 'avatar2.jpg',
        status: 0,
        role: 0,
        friends: [],
      },
      {
        username: 'user3',
        password: 'pass3',
        email: 'user3@example.com',
        firstName: 'User',
        lastName: 'Three',
        avatar: 'avatar3.jpg',
        status: 2,
        role: 0,
        friends: [],
      },
      {
        username: 'user4',
        password: 'pass4',
        email: 'user4@example.com',
        firstName: 'User',
        lastName: 'Four',
        avatar: 'avatar4.jpg',
        status: 1,
        role: 1,
        friends: [],
      },
      {
        username: 'user5',
        password: 'pass5',
        email: 'user5@example.com',
        firstName: 'User',
        lastName: 'Five',
        avatar: 'avatar5.jpg',
        status: 0,
        role: 1,
        friends: [],
      },
    ];
    const userInsertResult = await usersCollection.insertMany(users);
    const userIds = userInsertResult.insertedIds;

    // Insert into the Group collection
    const groupsCollection = db.collection('groups');
    const groups = [
      {
        name: 'Group 1',
        members: [userIds[0], userIds[1], userIds[2]],
        createdBy: userIds[0],
        createdAt: new Date(),
        status: 1,
        description: 'Group one description.',
      },
      {
        name: 'Group 2',
        members: [userIds[2], userIds[3], userIds[4]],
        createdBy: userIds[1],
        createdAt: new Date(),
        status: 1,
        description: 'Group two description.',
      },
      {
        name: 'Group 3',
        members: [userIds[1], userIds[3]],
        createdBy: userIds[2],
        createdAt: new Date(),
        status: 1,
        description: 'Group three description.',
      },
    ];
    const groupInsertResult = await groupsCollection.insertMany(groups);
    const groupIds = groupInsertResult.insertedIds;

    // Insert into the Message collection
    const messagesCollection = db.collection('messages');
    const messages = [
      {
        sender: userIds[0],
        content: 'Hello from user 1',
        sentAt: new Date(),
        type: 1,
        seenBy: [userIds[1]],
      },
      {
        sender: userIds[1],
        content: 'Hello from user 2',
        sentAt: new Date(),
        type: 0,
        seenBy: [userIds[2], userIds[3]],
      },
      {
        sender: userIds[2],
        content: 'Hello from user 3',
        sentAt: new Date(),
        type: 1,
        seenBy: [userIds[4]],
      },
    ];
    const messageInsertResult = await messagesCollection.insertMany(messages);
    const messageIds = messageInsertResult.insertedIds;

    // Insert into the Chat collection
    const chatsCollection = db.collection('chats');
    const chats = [
      {
        type: 0,
        members: [userIds[0], userIds[1]],
        messages: [messageIds[0]],
        group: null,
      },
      {
        type: 0,
        members: [userIds[2], userIds[3]],
        messages: [messageIds[1]],
        group: null,
      },
      {
        type: 1,
        members: [userIds[0], userIds[1], userIds[2]],
        messages: [messageIds[0], messageIds[1]],
        group: groupIds[0],
      },
    ];

    await chatsCollection.insertMany(chats);
  } finally {
    console.log('Data inserted successfully. Closing the connection.');
    await client.close();
  }
}

run().catch(console.dir);
