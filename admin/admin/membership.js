/* =========================
MEMBERSHIP REQUESTS
========================= */

const requestList = document.getElementById("requestList");

loadRequests();

async function loadRequests() {

    requestList.innerHTML = "";

    const snapshot = await db.collection("membershipRequests")
        .orderBy("createdAt", "desc")
        .get();

    snapshot.forEach(doc => {

        const data = doc.data();

        const card = document.createElement("div");

        card.className = "order-card";

        card.innerHTML = `

        <h3>${data.email}</h3>

        <p>
        Binance TXID:
        <br>
        ${data.transactionId}
        </p>

        <p>
        Status:
        <b>${data.status}</b>
        </p>

        <button onclick="approveRequest('${doc.id}','${data.uid}')">

        Approve

        </button>

        <button onclick="rejectRequest('${doc.id}')">

        Reject

        </button>

        `;

        requestList.appendChild(card);

    });

}

/* =========================
APPROVE
========================= */

async function approveRequest(requestId, uid) {

    try {

        await db.collection("users")
            .doc(uid)
            .update({

                membership: "premium"

            });

        await db.collection("membershipRequests")
            .doc(requestId)
            .update({

                status: "approved"

            });

        alert("Membership Approved.");

        loadRequests();

    } catch (err) {

        alert(err.message);

    }

}

/* =========================
REJECT
========================= */

async function rejectRequest(requestId) {

    try {

        await db.collection("membershipRequests")
            .doc(requestId)
            .update({

                status: "rejected"

            });

        alert("Request Rejected.");

        loadRequests();

    } catch (err) {

        alert(err.message);

    }

}
