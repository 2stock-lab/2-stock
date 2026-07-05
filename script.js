/* ==========================================
2STOCK FINAL SCRIPT.JS
PART 1
========================================== */

/* ==========================================
FIREBASE
========================================== */

const db = firebase.firestore();

const auth = firebase.auth();

let currentUser = null;

let userData = null;

/* ==========================================
DOM
========================================== */

const assetGrid = document.getElementById("assetGrid");

const searchGrid = document.getElementById("searchGrid");

const searchInput = document.querySelector(".search input");

const searchButton = document.querySelector(".search button");

const searchSection = document.getElementById("searchResults");

const emptyState = document.getElementById("emptyState");

const backHomeBtn = document.getElementById("backHomeBtn");

const filterButtons = document.querySelectorAll(".filter-btn");

const loginModal=document.getElementById("loginModal");

const loginEmail=document.getElementById("loginEmail");

const loginPassword=document.getElementById("loginPassword");

const membershipModal = document.getElementById("membershipModal");

const membershipBtn = document.getElementById("membershipBtn");

const transactionId = document.getElementById("transactionId");

const previewDownload = document.getElementById("previewDownload");

const loginBtn=document.getElementById("loginBtn");

const signupBtn=document.getElementById("signupBtn");

const closeLogin=document.querySelector(".closeLogin");

const purchasePopup = document.getElementById("purchasePopup");

const closePopup = document.getElementById("closePopup");

const buyNow = document.getElementById("buyNow");

const buyerEmail = document.getElementById("buyerEmail");

const buyerTx = document.getElementById("buyerTx");

const popupTitle = document.getElementById("popupTitle");

const imageModal = document.getElementById("imageModal");

const modalImage = document.getElementById("modalImage");

const modalTitle = document.getElementById("modalTitle");

const modalCategory = document.getElementById("modalCategory");

const modalMembership = document.getElementById("modalMembership");

const buyImageBtn = document.getElementById("buyImageBtn");

const closeImageModal = document.querySelector(".close-image-modal");

/* ==========================================
GLOBAL
========================================== */

let assets = [];

let selectedAsset = null;

/* ==========================================
LOAD FIREBASE ASSETS
========================================== */

async function loadAssets(){

assetGrid.innerHTML="";

assets=[];

const snapshot=await db.collection("assets")
.orderBy("createdAt","desc")
.get();

snapshot.forEach(doc=>{

const data=doc.data();

data.id=doc.id;

assets.push(data);

renderCard(data,assetGrid);

});

}

/* ==========================================
CREATE CARD
========================================== */

function renderCard(data,target){

const card=document.createElement("div");

card.className="card";

card.innerHTML=`

<div class="img-container">

<img src="${data.image}" alt="${data.title}">

</div>

<div class="card-bottom">

<div>

<h4>${data.title}</h4>

<small>${data.membership==="free"?"Free":"Premium"}</small>

</div>

<button class="apple-btn">

View

</button>

</div>

`;

card.querySelector(".img-container").onclick=()=>{

openImage(data);

};

card.querySelector(".apple-btn").onclick=()=>{

openImage(data);

};

target.appendChild(card);

}

/* ==========================================
INIT
========================================== */

window.addEventListener("load",loadAssets);
/* ==========================================
2STOCK FINAL SCRIPT.JS
PART 2
========================================== */

/* ==========================================
OPEN IMAGE MODAL
========================================== */

function openImage(data){

    selectedAsset = data;

    const downloadBtn = document.getElementById("previewDownload");

    // Premium Image + User is NOT Premium
    if (
        data.membership === "premium" &&
        (!currentUser || !userData || userData.membership !== "premium")
    ) {

        // Watermark Preview
        modalImage.src = data.preview || data.image;

        modalMembership.innerText =
        "Premium Preview (Membership Required)";

        if (downloadBtn) {

            downloadBtn.innerText = "Become Premium Member";

            downloadBtn.onclick = () => {

                if (!currentUser) {

                    loginModal.style.display = "flex";

                } else {

                    membershipModal.style.display = "flex";

                }

            };

        }

    } else {

        // Free Image OR Premium Member
        modalImage.src = data.image;

        modalMembership.innerText =
            data.membership === "free"
            ? "Free Download"
            : "Premium Download";

        if (downloadBtn) {

            downloadBtn.innerText = "Download";

            downloadBtn.onclick = () => {

                if (data.membership === "free") {

                    window.open(data.image, "_blank");
                    return;

                }

                if (!currentUser) {

                    loginModal.style.display = "flex";
                    return;

                }

                if (!userData || userData.membership !== "premium") {

                    membershipModal.style.display = "flex";
                    return;

                }

                window.open(data.image, "_blank");

            };

        }

    }

    modalTitle.innerText = data.title;

    modalCategory.innerText =
        "Category : " + (data.category || "Photo");

    imageModal.style.display = "flex";

}
/* ==========================================
CLOSE IMAGE MODAL
========================================== */

closeImageModal.onclick=function(){

imageModal.style.display="none";

};

window.addEventListener("click",(e)=>{

if(e.target===imageModal){

imageModal.style.display="none";

}

});

/* ==========================================
DOWNLOAD BUTTON
========================================== */

buyImageBtn.onclick=function(){

imageModal.style.display="none";

if(selectedAsset.membership==="free"){

window.open(selectedAsset.image,"_blank");

return;

}

popupTitle.innerText=selectedAsset.title;

purchasePopup.style.display="flex";

};

/* ==========================================
PURCHASE POPUP
========================================== */

closePopup.onclick=function(){

purchasePopup.style.display="none";

};

window.addEventListener("click",(e)=>{

if(e.target===purchasePopup){

purchasePopup.style.display="none";

}

});

/* ==========================================
SAVE ORDER
========================================== */

buyNow.onclick=async function(){

const email=buyerEmail.value.trim();

const txid=buyerTx.value.trim();

if(email==="" || txid===""){

alert("Please fill all fields.");

return;

}

await db.collection("orders").add({

assetId:selectedAsset.id,

title:selectedAsset.title,

email:email,

txid:txid,

status:"pending",

createdAt:firebase.firestore.FieldValue.serverTimestamp()

});

alert("Order submitted successfully.");

buyerEmail.value="";

buyerTx.value="";

purchasePopup.style.display="none";

};

/* ==========================================
SEARCH
========================================== */

searchButton.onclick=function(){

const keyword=searchInput.value
.toLowerCase()
.trim();

searchGrid.innerHTML="";

if(keyword===""){

searchSection.style.display="none";

emptyState.style.display="none";

return;

}

const result=assets.filter(asset=>{

return asset.title.toLowerCase().includes(keyword);

});

if(result.length===0){

searchSection.style.display="none";

emptyState.style.display="block";

return;

}

emptyState.style.display="none";

searchSection.style.display="block";

result.forEach(asset=>{

renderCard(asset,searchGrid);

});

};

backHomeBtn.onclick=function(){

searchSection.style.display="none";

emptyState.style.display="none";

searchInput.value="";

};

/* ==========================================
2STOCK FINAL SCRIPT.JS
PART 3
========================================== */

/* ==========================================
CATEGORY FILTER
========================================== */

filterButtons.forEach(button=>{

button.onclick=function(){

document.querySelector(".filter-btn.active")
?.classList.remove("active");

button.classList.add("active");

const filter=button.dataset.category;

assetGrid.innerHTML="";

if(filter==="all"){

assets.forEach(asset=>{

renderCard(asset,assetGrid);

});

return;

}

const filtered=assets.filter(asset=>{

return (

(asset.category||"").toLowerCase()===filter ||

(asset.membership||"").toLowerCase()===filter

);

});

filtered.forEach(asset=>{

renderCard(asset,assetGrid);

});

};

});

/* ==========================================
CURSOR GLOW
========================================== */

const cursorGlow=document.getElementById("cursorGlow");

document.addEventListener("mousemove",(e)=>{

cursorGlow.style.left=e.clientX-12+"px";

cursorGlow.style.top=e.clientY-12+"px";

});

/* ==========================================
DRAGON FOLLOW
========================================== */

const dragon=document.getElementById("dragonAnimation");

document.addEventListener("mousemove",(e)=>{

dragon.style.left=e.clientX+25+"px";

dragon.style.top=e.clientY+25+"px";

});

/* ==========================================
SCROLL TO TOP
========================================== */

const scrollTopBtn=document.getElementById("scrollTop");

if(scrollTopBtn){

window.addEventListener("scroll",()=>{

if(window.scrollY>400){

scrollTopBtn.style.display="block";

}else{

scrollTopBtn.style.display="none";

}

});

scrollTopBtn.onclick=()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

};

}

/* ==========================================
PRELOAD IMAGES
========================================== */

function preloadImages(){

assets.forEach(asset=>{

const img=new Image();

img.src=asset.image;

});

}

auth.onAuthStateChanged(async (user) => {

    currentUser = user || null;

    if (currentUser) {

        console.log("Logged in:", currentUser.email);

        await loadUserProfile();

    } else {

        console.log("Not logged in");

        userData = null;

    }

    loadAssets();

});


setTimeout(preloadImages,1000);

/* ==========================================
END OF PART 3
========================================== */
/* =========================
AUTH SYSTEM
========================= */

async function register(email, password) {

    return await auth.createUserWithEmailAndPassword(email, password);

}

async function login(email, password) {

    return await auth.signInWithEmailAndPassword(email, password);

}

async function logout() {

    return await auth.signOut();

}
/* =========================
LOGIN SYSTEM
========================= */

loginBtn.onclick=async()=>{

try{

await login(

loginEmail.value,

loginPassword.value

);

alert("Login Successful");

loginModal.style.display="none";

}catch(err){

alert(err.message);

}

};

signupBtn.onclick = async () => {

    try {

        const result = await register(

            loginEmail.value.trim(),

            loginPassword.value

        );

        await createUser({

            uid: result.user.uid,

            email: result.user.email

        });

        alert("Account created successfully!");

        loginModal.style.display = "none";

        loginEmail.value = "";

        loginPassword.value = "";

    } catch (err) {

        alert(err.message);

    }

};

/* =========================
JOIN BUTTON
========================= */

document.querySelectorAll(".join-btn").forEach(btn => {

    btn.addEventListener("click", () => {

        loginModal.style.display = "flex";

    });

});

document.querySelectorAll(".primary").forEach(btn => {

    if (btn.innerText.includes("Become Member")) {

        btn.addEventListener("click", () => {

            loginModal.style.display = "flex";

        });

    }

});

/* =========================
LOAD USER PROFILE
========================= */

async function loadUserProfile() {

    if (!currentUser) {

        userData = null;

        return;

    }

    const doc = await db.collection("users")
        .doc(currentUser.uid)
        .get();

    if (doc.exists) {

        userData = doc.data();

        console.log("User Profile:", userData);

    } else {

        userData = null;

    }

}
/* =========================
CHECK PREMIUM ACCESS
========================= */

function hasPremiumAccess(asset) {

    // Free asset
    if (asset.membership === "free") {
        return true;
    }

    // Not logged in
    if (!currentUser) {
        return false;
    }

    // Premium member
    if (userData && userData.membership === "premium") {
        return true;
    }

    return false;

}

/* ==========================================
MEMBERSHIP MODAL
========================================== */

document.querySelectorAll(".closeMembership").forEach(btn => {

    btn.onclick = () => {

        membershipModal.style.display = "none";

    };

});

/* =========================
MEMBERSHIP PAYMENT
========================= */

if (membershipBtn) {

    membershipBtn.onclick = async () => {

        if (!currentUser) {

            alert("Please login first.");
            loginModal.style.display = "flex";
            return;

        }

        const txid = transactionId.value.trim();

        if (!txid) {

            alert("Please enter your Binance Transaction ID.");
            return;

        }

        try {

            await createMembershipRequest({

                uid: currentUser.uid,

                email: currentUser.email,

                method: "Binance",

                transactionId: txid

            });

            alert("Payment request submitted successfully. Please wait for admin approval.");

            membershipModal.style.display = "none";

            transactionId.value = "";

        } catch (err) {

            alert(err.message);

        }

    };

}
