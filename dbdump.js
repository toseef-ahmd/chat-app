/* eslint-disable prettier/prettier */
const { MongoClient, ObjectId } = require('mongodb');
require('dotenv').config();

const mongo_host = process.env.MONGO_DB_HOST;
const mongo_user = process.env.MONGO_DB_USER;
const mongo_password = process.env.MONGO_DB_PASS;
const mongo_database = process.env.MONGO_DB_NAME;

// Connection URL and Database Name
const url =  `mongodb+srv://${mongo_user}:${mongo_password}@${mongo_host}`;
const dbName = mongo_database; // Replace with your actual database name

// Create a new MongoClient
const client = new MongoClient(url);

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    console.log("Connected successfully to server");

    const db = client.db(dbName);

    // Assuming placeholder ObjectIds for demonstration
    const placeholderId = new ObjectId();

    // Insert into the User collection
    const usersCollection = db.collection('users');
    const users = [
      { username: "user1", password: "pass1", email: "user1@example.com", firstName: "User", lastName: "One", avatar: "avatar1.jpg", status: "online", friends: [] },
      { username: "user2", password: "pass2", email: "user2@example.com", firstName: "User", lastName: "Two", avatar: "avatar2.jpg", status: "offline", friends: [] },
      { username: "user3", password: "pass3", email: "user3@example.com", firstName: "User", lastName: "Three", avatar: "avatar3.jpg", status: "typing", friends: [] },
      { username: "user4", password: "pass4", email: "user4@example.com", firstName: "User", lastName: "Four", avatar: "avatar4.jpg", status: "online", friends: [] },
      { username: "user5", password: "pass5", email: "user5@example.com", firstName: "User", lastName: "Five", avatar: "avatar5.jpg", status: "offline", friends: [] },
    ];
    const userInsertResult = await usersCollection.insertMany(users);
    // const userIds = Object.values(userInsertResult.insertedIds);

    // // Insert into the Group collection
    // const groupsCollection = db.collection('groups');
    // const groups = [
    //   { groupName: "Group 1", members: userIds.slice(0, 3), createdBy: userIds[0], createdAt: new Date(), groupDescription: "Group one description." },
    //   { groupName: "Group 2", members: userIds.slice(2, 5), createdBy: userIds[1], createdAt: new Date(), groupDescription: "Group two description." },
    //   { groupName: "Group 3", members: userIds.slice(1, 4), createdBy: userIds[2], createdAt: new Date(), groupDescription: "Group three description." },
    //   { groupName: "Group 4", members: userIds.slice(0, 2), createdBy: userIds[3], createdAt: new Date(), groupDescription: "Group four description." },
    //   { groupName: "Group 5", members: userIds.slice(3, 5), createdBy: userIds[4], createdAt: new Date(), groupDescription: "Group five description." },
    // ];
    // await groupsCollection.insertMany(groups);

    // // Insert into the Message collection
    // const messagesCollection = db.collection('messages');
    // const messages = [
    //   { sender: userIds[0], content: "Hello from user 1", sentAt: new Date(), type: "unread", seenBy: [userIds[1]] },
    //   { sender: userIds[1], content: "Hello from user 2", sentAt: new Date(), type: "read", seenBy: [userIds[2], userIds[3]] },
    //   { sender: userIds[2], content: "Hello from user 3", sentAt: new Date(), type: "unread", seenBy: [userIds[4]] },
    //   { sender: userIds[3], content: "Hello from user 4", sentAt: new Date(), type: "read", seenBy: [userIds[0], userIds[1]] },
    //   { sender: userIds[4], content: "Hello from user 5", sentAt: new Date(), type: "unread", seenBy: [userIds[2], userIds[3]] },
    // ];
    // const messageInsertResult = await messagesCollection.insertMany(messages);
    // const messageIds = Object.values(messageInsertResult.insertedIds);

    // // Insert into the Chat collection
    // const chatsCollection = db.collection('chats');
    // const chats = [
    //   { type: "direct", members: [userIds[0], userIds[1]], messages: [messageIds[0]], group: null },
    //   { type: "direct", members: [userIds[2], userIds[3]], messages: [messageIds[1]], group: null },
    //   { type: "group", members: [], messages: messageIds.slice(2, 4), group: placeholderId }, // Placeholder for group ID
    //   { type: "group", members: [], messages: [messageIds[4]], group: placeholderId }, // Placeholder for group ID
    //   { type: "direct", members: [userIds[4], userIds[0]], messages: [], group: null },
    // ];
    // await chatsCollection.insertMany(chats);

  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}

run().catch(console.dir);
