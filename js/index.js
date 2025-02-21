function previewAvatar() {
    const file = document.getElementById("catImg").files[0];
    const preview = document.getElementById("cat-preview");

    if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
            preview.style.backgroundImage = `url(${e.target.result})`;
            preview.style.backgroundSize = "cover";
            preview.style.backgroundPosition = "center";
            preview.style.border = "6px solid #E09030;";
        };
        reader.readAsDataURL(file);
    }
}

