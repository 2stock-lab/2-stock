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

await saveAsset({

    title: title,
    price: price,
    category: category,
    membership: membership,

    image: "demo-image"

});

uploadStatus.innerText =
"Asset information saved successfully.";
});
/* =========================
IMAGE PREVIEW
========================= */

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if(!file) return;

    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";

});
