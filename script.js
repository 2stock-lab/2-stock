/* =========================
2STOCK SCRIPT.JS
========================= */

/* Firebase Init (already loaded in index.html) */
const db = firebase.firestore();

/* =========================
DOM ELEMENTS
========================= */

const assetGrid = document.getElementById("assetGrid");
const appleOverlay = document.getElementById("appleOverlay");
const closeApple = document.getElementById("closeApple");

let selectedAsset = null;

/* =========================
LOAD ASSETS FROM FIREBASE
========================= */

async function loadAssets() {
    assetGrid.innerHTML = "";

    const snapshot = await db.collection("assets").get();

    snapshot.forEach(doc => {
        const data = doc.data();

        const card = document.createElement("div");
        card.className = "card";

        card.innerHTML = `
            <div class="img-container">
                <img src="${data.image}" />
            </div>

            <div class="card-bottom">
                <div>
                    <h4>${data.title}</h4>
                    <small>$${data.price || 1.5}</small>
                </div>

                <button class="apple-btn" data-id="${doc.id}">
                    Buy
                </button>
            </div>
        `;

        assetGrid.appendChild(card);
    });

    attachBuyEvents();
}

/* =========================
BUY BUTTON EVENTS
========================= */

function attachBuyEvents() {
    document.querySelectorAll(".apple-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            selectedAsset = btn.getAttribute("data-id");
            openPopup();
        });
    });
}

/* =========================
POPUP SYSTEM
========================= */

function openPopup() {
    appleOverlay.style.display = "flex";
}

closeApple.addEventListener("click", () => {
    appleOverlay.style.display = "none";
});

/* =========================
ORDER SYSTEM (SIMPLE)
========================= */

async function placeOrder(email, txid) {
    await db.collection("orders").add({
        assetId: selectedAsset,
        email: email,
        txid: txid,
        status: "pending",
        created: Date.now()
    });

    alert("Order placed!");
}

/* =========================
FILTER SYSTEM
========================= */

document.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {

        document.querySelector(".filter-btn.active")?.classList.remove("active");
        btn.classList.add("active");

        const filter = btn.dataset.category || "all";

        document.querySelectorAll(".card").forEach(card => {
            if(filter === "all") {
                card.style.display = "block";
            } else {
                card.style.display =
                    card.innerText.toLowerCase().includes(filter)
                    ? "block"
                    : "none";
            }
        });

    });
});

/* =========================
DRAGON ANIMATION (FOLLOW CURSOR)
========================= */

const dragon = document.getElementById("dragonAnimation");

let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function moveDragon() {
    if(dragon) {
        dragon.style.position = "fixed";
        dragon.style.left = mouseX + 20 + "px";
        dragon.style.top = mouseY + 20 + "px";

        dragon.style.width = "120px";
        dragon.style.height = "120px";
        dragon.style.background = "url('dragon.png') no-repeat center/contain";
        dragon.style.pointerEvents = "none";
        dragon.style.zIndex = "9999";
    }

    requestAnimationFrame(moveDragon);
}
moveDragon();

/* =========================
EAGLE ANIMATION (FLOAT LOGO AREA)
========================= */

const eagle = document.getElementById("eagleAnimation");

function animateEagle() {
    if(eagle) {
        eagle.style.position = "absolute";
        eagle.style.top = "20px";
        eagle.style.left = "40px";
        eagle.style.width = "80px";
        eagle.style.height = "80px";
        eagle.style.background = "url('eagle.png') no-repeat center/contain";
        eagle.style.animation = "floatEagle 3s ease-in-out infinite";
    }
}

animateEagle();

/* =========================
SCROLL ANIMATION
========================= */

window.addEventListener("scroll", () => {
    document.querySelectorAll(".card").forEach(card => {
        const rect = card.getBoundingClientRect();
        if(rect.top < window.innerHeight) {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
        }
    });
});

/* =========================
INIT
========================= */

window.addEventListener("load", () => {
    loadAssets();
});
