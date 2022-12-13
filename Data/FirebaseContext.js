const { AllowedMentionsTypes } = require('discord.js')
const { firestore } = require('firebase-admin')
const { db,admin} = require( '../firebaseConfig.js')


/**
 * Updates the user's balance in the database
 * @param {*} userId users's discord ID
 * @param {*} amount amount to update the user's balance by
 */
const updateBalance = async (userId, amount) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', userId).get()
    // if the user is not found, return
    if (user.empty) return
    // if the user is found, update their balance
    user.forEach(doc => {
        db.collection('users').doc(doc.id).update({
        balance: doc.data().balance + amount
        })
    })
}

/**
 * Get the logs of a user.
 * @param {integer} userId User's discord id
 * @returns {admin.firestore.QuerySnapshot} Collection of users logs
 */
const getLogs = async (userId) => {
    const user = await db.collection('users').where('discordId', '==', userId).get();
    if (user.empty) return;
    const logs = await db.collection('users').doc(user.docs[0].id).collection('Log').orderBy('time', 'desc').get();
    return logs;
}

/**s
 * Get all items in the items database.
 * @returns {admin.firestore.QuerySnapshot} Collection of all items in the database
 */
const getAllItems = async () => {
    const items = await db.collection('items').get()
    return items
}


/**
 * Get the first user from the database that matches the given discord ID
 * @param {*} userId Users's discord ID
 * @returns {admin.firestore.QuerySnapshot} Firebase document of the user
 */
const getUser = async (userId) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', userId).get()
    // if the user is not found, return
    if (user.empty) return
    // if the user is found, return the user
    return user
}

/**
 * Adds a new user to the database
 * @param {*} userId user's discord ID
 * @param {*} initialBalance initial starting balance of the user
 */
const addUser = async (userId, initialBalance) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', userId).get()
    // if the user is found, return
    if (!user.empty) return
    // if the user is not found, add them to the database
    db.collection('users').add({
        discordId: userId,
        balance: initialBalance,
        monthFromNow: null
    })
}
/**
 * Get an item from the database
 * @param {string} itemName 
 * @returns {admin.firestore.QuerySnapshot} Firebase document of the item
 */
const getItem = async (itemName) => {
    // query the database to find the item
    const item = await db.collection('items').where('name', '==', itemName).get()
    // if the item is not found, return
    if (item.empty) return
    // if the item is found, return the item
    return item
}
/**
 * Add an item to the database
 * @param {*} maxPerUser 
 * @param {*} itemName 
 * @param {*} itemPrice 
 * @param {*} quantity 
 * @param {*} type 
 */
const addItem = async (maxPerUser, itemName, itemPrice, quantity, type) => {
    // query the database to find the item
    const item = await db.collection('items').where('name', '==', itemName).get()
    // if the item is found, return
    if (!item.empty) return
    // if the item is not found, add it to the database
    db.collection('items').add({
        maxPerUser: maxPerUser,
            name: itemName,
            price: itemPrice,
            quantity: quantity,
            type: type
    })
}

/**
 * Add an item to the user's inventory
 * @param {*} userId User's discord ID
 * @param {*} item Name of the item to add to the user's inventory
 */
const addItemToUser = async (userId, item) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', userId).get()
    //query to find the item
    const itemData = await db.collection('items').where('name', '==', item).get()
    // if the user is not found, return
    if (user.empty) return

    // remove quantity 1 from the item
    db.collection('items').doc(itemData.docs[0].id).update({
        quantity: itemData.docs[0].data().quantity - 1
    });

    // Check if the user already has the item
    const userItem = await db.collection('users').doc(user.docs[0].id).collection('inventory').where('name', '==', item).get()
    // if the user already has the item, update the quantity
    if (!userItem.empty) {
        console.log(userItem);
        db.collection('users').doc(user.docs[0].id).collection('inventory').doc(userItem.docs[0].id).update({
            owned: userItem.docs[0].data().owned + 1
        });
    } else {
        // if the user does not have the item, add it to their inventory
        db.collection('users').doc(user.docs[0].id).collection('inventory').add({
            name: item,
            type: itemData.docs[0].data().type,
            owned: 1,
            purchased: admin.firestore.Timestamp.now()
        });
    }
}

/**
 * Get the users inventory.
 * @param {int} userId User's discord id.
 * @returns {admin.firestore.QuerySnapshot} Collection of the user's inventory.
 */
const getInventory = async (userId) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', userId).get()
    // if the user is not found, return
    if (user.empty) return
    // if the user is found, return their inventory
    const inventory = await db.collection('users').doc(user.docs[0].id).collection('inventory').get()
    return inventory
}

/**
 * Log the command usage to the database
 * @param {ChatInputCommandInteraction} interaction 
 * @param {string} args 
 */
const dbLog = async (interaction, args) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', interaction.user.id).get()
    // if the user is not found, return
    if (user.empty) return
    // if the user is found, add the log to the database
    db.collection('users').doc(user.docs[0].id).collection('Log').add({
        command: interaction.commandName,
        guild: interaction.guildId,
        userID: interaction.user.id,
        time: admin.firestore.Timestamp.now(),
        parameters: args
    });
}

/**
 * Get the monthly rate of a users role
 * @param {ChatInputCommandInteraction} interaction 
 * @returns {int} Monthly rate of the users role. Will return zero if the role does not exist in the database.
 */
const getMonthlyRate = async (interaction) => {
    // Check if the user has a role, if not return zero.
    if (interaction.member.roles.cache.size == 0) return 0
    // Query the roles database to find the users role
    const role = await db.collection('roles').where('id', '==', interaction.member.roles.cache.first().id).get()
    // if the role is not found, return
    if (role.empty) return
    // if the role is found, return the monthly rate
    return role.docs[0].data().monthlyRate;
}

const getRolesWithPermissions = async (command) => {
    // Query the roles database to find all roles with permissions
    const roles = await db.collection('roles').where('permissions', 'array-contains', command).get()
    // if the roles are not found, return
    if (roles.empty) return
    // if the roles are found, return the roles
    return roles;
}


const getRole = async (roleId) => {
    // Query the roles database to find the role
    const role = await db.collection('roles').where('id', '==', roleId).get()
    // if the role is not found, return
    if (role.empty) return
    // if the role is found, return the role
    return role
}

const getRolePermission = async (roleId, permission) => {
    // Query the roles database to find the role
    const role = await db.collection('roles').where('id', '==', roleId).get()
    // if the role is not found, return
    if (role.empty) return false;
    // if the role is found, return the role
    return role.docs[0].data().permissions.includes(permission);
}

const changeMonthlyRate = async (roleId, rate) => {
    // Query the roles database to find the role
    const role = await db.collection('roles').where('id', '==', roleId).get()
    // if the role is not found, return
    if (role.empty) return false;
    // if the role is found, change the monthly rate
    db.collection('roles').doc(role.docs[0].id).update({
        monthlyRate: rate
    })
}

//Async function to restock a specific item in the database
const restockItem = async (item, quantity) => {
    //Query the database to find the item
    const itemData = await db.collection('items').where('name', '==', item).get()
    //If the item is not found, return
    if (itemData.empty) return
    //If the item is found, update the quantity
    db.collection('items').doc(itemData.docs[0].id).update({
        quantity: itemData.docs[0].data().quantity + quantity
    });
}


module.exports = {
    updateBalance,
    addUser,
    getUser,
    getAllItems,
    addItem,
    getItem,
    addItemToUser,
    getInventory,
    dbLog,
    getLogs,
    getMonthlyRate,
    getRolesWithPermissions,
    getRolePermission,
    changeMonthlyRate,
    restockItem
}