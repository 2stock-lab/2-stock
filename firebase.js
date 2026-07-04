/* =========================
2STOCK FIREBASE CONFIG
========================= */

/* Firebase App */
firebase.initializeApp(firebaseConfig);

/* Firestore DB */
const db = firebase.firestore();

/* =========================
GLOBAL SETTINGS
========================= */

// Enable offline persistence (optional but useful)
db.enablePersistence()
.catch((err) => {
    console.log("Persistence error:", err.code);
});

/* =========================
COLLECTION STRUCTURE
========================= */

/*

assets
------
id
title
image
price
category
type
createdAt

orders
------
assetId
email
txid
status (pending / approved)
created

users (future)
-----
email
membership (free / premium)

*/

/* =========================
HELPER FUNCTIONS
========================= */

// Add Asset (for admin later)
async function addAsset(data) {
    return await db.collection("assets").add({
        ...data,
        createdAt: Date.now()
    });
}

// Create Order
async function createOrder(order) {
    return await db.collection("orders").add({
        ...order,
        status: "pending",
        created: Date.now()
    });
}

// Update Order Status (admin)
async function updateOrder(id, status) {
    return await db.collection("orders").doc(id).update({
        status: status
    });
}

/* =========================
READY EXPORT (GLOBAL USE)
========================= */

window.db = db;
window.addAsset = addAsset;
window.createOrder = createOrder;
window.updateOrder = updateOrder;
/* =========================
SAVE ASSET TO FIRESTORE
========================= */

async function saveAsset(assetData){

    return await db.collection("assets").add({

        title: assetData.title,
        price: Number(assetData.price),
        category: assetData.category,
        membership: assetData.membership,
        image: assetData.image,

        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    });

}

window.saveAsset = saveAsset;
