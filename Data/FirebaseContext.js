const { AllowedMentionsTypes } = require('discord.js')
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
 * 
 * @returns collection of all items in the database
 */
const getAllItems = async () => {
    const items = await db.collection('items').get()
    return items
}


/**
 * Get the first user from the database that matches the given discord ID
 * @param {*} userId users's discord ID
 * @returns Firebase document of the user
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
        monthFromNow: 'PLACEHOLDER NULL'
    })
}
/**
 * 
 * @param {*} itemName 
 * @returns Firebase document of the item
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
 * 
 * @param {*} maxPerUser 
 * @param {*} itemName 
 * @param {*} itemPrice 
 * @param {*} quantity 
 * @param {*} type 
 */
const addItem = async (maxPerUser,itemName, itemPrice,quantity,type) => {
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

const addItemToUser = async (userId, item) => {
    // query the database to find the user
    const user = await db.collection('users').where('discordId', '==', userId).get()
    //query to find the item
    const itemData = await db.collection('items').where('name', '==', item).get()
    // if the user is not found, return
    if (user.empty) return

    
    if(itemData.docs[0].data().quantity > 0){

        //map of the item to push to db.
        const itemMap = {
            name: itemData.docs[0].data().name,
            type: itemData.docs[0].data().type,
            purchased_at: new Date().getTime(),
            owned: 1
        }
        //push itemMap into inventory array inside user document
        user.forEach(doc => {
            db.collection('users').doc(doc.id).update({
                inventory: admin.firestore.FieldValue.arrayUnion(itemMap)
            })
        })
    }
}

module.exports = {
    updateBalance,
    addUser,
    getUser,
    getAllItems,
    addItem,
    getItem,
    addItemToUser
}