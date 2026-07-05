/* =========================
2STOCK FIREBASE CONFIG
========================= */

const firebaseConfig = {
    apiKey: "AIzaSyDTnaC48yboc4_9u7gSzrzDgAqnu-Fn6To",
    authDomain: "stock-db-3f41a.firebaseapp.com",
    projectId: "stock-db-3f41a",
    storageBucket: "stock-db-3f41a.firebasestorage.app",
    messagingSenderId: "1066037651835",
    appId: "1:1066037651835:web:a57d9a691c16b6c76175de"
};

/* =========================
INITIALIZE FIREBASE
========================= */

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

const auth = firebase.auth();

window.auth = auth;

/* =========================
OPTIONAL OFFLINE MODE
========================= */

db.enablePersistence().catch((err) => {
    console.log("Persistence:", err.code);
});

/* =========================
SAVE ASSET
========================= */

async function saveAsset(assetData) {

    return await db.collection("assets").add({

        title: assetData.title,
        price: Number(assetData.price || 0),
        category: assetData.category,
        membership: assetData.membership,
        image: assetData.image,

        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    });

}

/* =========================
ADD ASSET
========================= */

async function addAsset(data) {

    return await db.collection("assets").add({

        ...data,

        createdAt: firebase.firestore.FieldValue.serverTimestamp()

    });

}

/* =========================
CREATE ORDER
========================= */

async function createOrder(order) {

    return await db.collection("orders").add({

        ...order,

        status: "pending",

        created: firebase.firestore.FieldValue.serverTimestamp()

    });

}

/* =========================
UPDATE ORDER
========================= */

async function updateOrder(id, status) {

    return await db.collection("orders").doc(id).update({

        status: status

    });

}

/* =========================
GLOBAL EXPORT
========================= */

window.db = db;
window.auth = auth;

window.saveAsset = saveAsset;
window.addAsset = addAsset;
window.createOrder = createOrder;
window.updateOrder = updateOrder;
