/* =====================================
2STOCK SCRIPT.JS
FINAL VERSION
PART 1
===================================== */

/* Firebase */
const db = firebase.firestore();

/* =========================
DOM
========================= */

const assetGrid = document.getElementById("assetGrid");
const searchGrid = document.getElementById("searchGrid");
const loadingScreen = document.getElementById("loadingScreen");

const purchasePopup = document.getElementById("purchasePopup");
const closePopup = document.getElementById("closePopup");
const buyNow = document.getElementById("buyNow");

const popupTitle = document.getElementById("popupTitle");
const popupPrice = document.getElementById("popupPrice");

const buyerEmail = document.getElementById("buyerEmail");
const buyerTx = document.getElementById("buyerTx");

let selectedAsset = null;

/* =========================
LOAD ASSETS
========================= */

async function loadAssets(){

    if(loadingScreen){
        loadingScreen.style.display="flex";
    }

    assetGrid.innerHTML="";

    const snapshot = await db
        .collection("assets")
        .orderBy("createdAt","desc")
        .get();

    snapshot.forEach(doc=>{

        const data=doc.data();

        const card=document.createElement("div");

        card.className="asset-card";

        card.innerHTML=`

        <div class="asset-image">

            <img src="${data.image}" alt="${data.title}">

            ${
                data.membership==="premium"

                ?

                `<span class="premium-badge">🔒 MEMBERSHIP</span>`

                :

                `<span class="free-badge">FREE</span>`
            }

        </div>

        <div class="asset-info">

            <h3>${data.title}</h3>

            <p>${data.category}</p>

            <button
            class="downloadBtn"
            data-id="${doc.id}">

            ${data.membership==="premium"
            ?
            "Unlock"
            :
            "Download"}

            </button>

        </div>

        `;

        assetGrid.appendChild(card);

    });

    attachButtons();

    if(loadingScreen){
        loadingScreen.style.display="none";
    }

}
/* =====================================
PART 2
POPUP + ORDER SYSTEM
===================================== */

function attachButtons(){

    document.querySelectorAll(".downloadBtn").forEach(btn=>{

        btn.addEventListener("click",()=>{

            selectedAsset=btn.dataset.id;

            const card=btn.closest(".asset-card");

            popupTitle.innerText=
            card.querySelector("h3").innerText;

            if(btn.innerText==="Download"){

                window.location.href="#";

                return;

            }

            purchasePopup.style.display="flex";

        });

    });

}

/* =========================
CLOSE POPUP
========================= */

if(closePopup){

closePopup.addEventListener("click",()=>{

purchasePopup.style.display="none";

});

}

/* =========================
BUY NOW
========================= */

if(buyNow){

buyNow.addEventListener("click",async()=>{

const email=buyerEmail.value.trim();

const txid=buyerTx.value.trim();

if(!email||!txid){

alert("Please fill all fields.");

return;

}

await db.collection("orders").add({

assetId:selectedAsset,

email:email,

txid:txid,

status:"pending",

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Order Submitted Successfully.");

purchasePopup.style.display="none";

buyerEmail.value="";

buyerTx.value="";

});

}

/* =========================
SEARCH
========================= */

const searchInput=document.querySelector(".search input");

const searchButton=document.querySelector(".search button");

if(searchButton){

searchButton.addEventListener("click",()=>{

const keyword=searchInput.value.toLowerCase();

document.querySelectorAll(".asset-card").forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=

text.includes(keyword)

?

"block"

:

"none";

});

});

}
/* =====================================
PART 2
POPUP + ORDER SYSTEM
===================================== */

function attachButtons(){

    document.querySelectorAll(".downloadBtn").forEach(btn=>{

        btn.addEventListener("click",()=>{

            selectedAsset=btn.dataset.id;

            const card=btn.closest(".asset-card");

            popupTitle.innerText=
            card.querySelector("h3").innerText;

            if(btn.innerText==="Download"){

                window.location.href="#";

                return;

            }

            purchasePopup.style.display="flex";

        });

    });

}

/* =========================
CLOSE POPUP
========================= */

if(closePopup){

closePopup.addEventListener("click",()=>{

purchasePopup.style.display="none";

});

}

/* =========================
BUY NOW
========================= */

if(buyNow){

buyNow.addEventListener("click",async()=>{

const email=buyerEmail.value.trim();

const txid=buyerTx.value.trim();

if(!email||!txid){

alert("Please fill all fields.");

return;

}

await db.collection("orders").add({

assetId:selectedAsset,

email:email,

txid:txid,

status:"pending",

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Order Submitted Successfully.");

purchasePopup.style.display="none";

buyerEmail.value="";

buyerTx.value="";

});

}

/* =========================
SEARCH
========================= */

const searchInput=document.querySelector(".search input");

const searchButton=document.querySelector(".search button");

if(searchButton){

searchButton.addEventListener("click",()=>{

const keyword=searchInput.value.toLowerCase();

document.querySelectorAll(".asset-card").forEach(card=>{

const text=card.innerText.toLowerCase();

card.style.display=

text.includes(keyword)

?

"block"

:

"none";

});

});

}
