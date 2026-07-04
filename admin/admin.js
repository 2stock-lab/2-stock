/* =========================
2STOCK ADMIN - STEP 2
========================= */

function loadOrders() {
    const ordersDiv = document.getElementById("orders");

    db.collection("orders")
    .orderBy("created", "desc")
    .onSnapshot(snapshot => {

        ordersDiv.innerHTML = "";

        snapshot.forEach(doc => {
            const o = doc.data();

            const box = document.createElement("div");

            box.style = `
                background:rgba(255,255,255,0.05);
                margin:10px 0;
                padding:15px;
                border-radius:12px;
            `;

            box.innerHTML = `
                <h3>Asset: ${o.assetId}</h3>
                <p>Email: ${o.email}</p>
                <p>TxID: ${o.txid}</p>
                <p>Status: <b>${o.status}</b></p>

                <button onclick="approveOrder('${doc.id}')">
                    Approve
                </button>
            `;

            ordersDiv.appendChild(box);
        });

    });
}

function approveOrder(id) {
    db.collection("orders").doc(id).update({
        status: "approved"
    });
}

window.addEventListener("load", loadOrders);
/* =========================
ADMIN LOGIN
========================= */

const ADMIN_PASSWORD = "2stock2026";

document.getElementById("loginBtn").addEventListener("click", () => {

    const password = document.getElementById("adminPassword").value;

    if (password === ADMIN_PASSWORD) {

        document.getElementById("loginBox").style.display = "none";
        document.getElementById("adminPanel").style.display = "block";

    } else {

        document.getElementById("loginError").innerText = "Wrong password!";

    }

});
