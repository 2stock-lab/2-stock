/* =========================
2STOCK Upload System
========================= */

const uploadBtn = document.getElementById("uploadBtn");
const uploadStatus = document.getElementById("uploadStatus");

uploadBtn.addEventListener("click", async () => {

    const title = document.getElementById("title").value.trim();
    const category = document.getElementById("category").value;
    const membership = document.getElementById("membership").value;
    const image = document.getElementById("image").files[0];

    if (!title || !image) {
        uploadStatus.innerText = "Please fill all required fields.";
        return;
    }

    uploadStatus.innerText = "Uploading image...";

    try {

        const formData = new FormData();
        formData.append("file", image);
        formData.append("upload_preset", "2stock_upload");

        const response = await fetch(
            "https://api.cloudinary.com/v1_1/dkgm718kt/image/upload",
            {
                method: "POST",
                body: formData
            }
        );

        const cloudinaryData = await response.json();

        if (!cloudinaryData.secure_url) {
            console.log(cloudinaryData);
            uploadStatus.innerText = "Image upload failed.";
            return;
        }

        await saveAsset({
            title,
            category,
            membership,
            image: cloudinaryData.secure_url
        });

        uploadStatus.innerText = "✅ Asset uploaded successfully.";

        document.getElementById("title").value = "";
        document.getElementById("price").value = "";
        document.getElementById("image").value = "";

        if (previewImage) {
            previewImage.style.display = "none";
        }

    } catch (err) {

        console.error(err);
        uploadStatus.innerText = err.message;

    }

});

/* =========================
IMAGE PREVIEW
========================= */

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = "block";

});
