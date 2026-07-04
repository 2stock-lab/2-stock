/* =========================
2STOCK Upload System
STEP 5.2
========================= */

const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

uploadBtn.addEventListener("click", async () => {

    const title = document.getElementById("title").value;
    const price = document.getElementById("price").value;
    const category = document.getElementById("category").value;
    const membership = document.getElementById("membership").value;
    const image = document.getElementById("image").files[0];

    if (!title || !image) {
        uploadStatus.innerText = "Please fill all required fields.";
        return;
    }

    uploadStatus.innerText =
    "Image upload system will be connected in the next step...";
});
