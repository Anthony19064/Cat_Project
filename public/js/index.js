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
function getSelectedCatSex() {
    // ดึงค่าจาก Radio Button ที่เลือก (ถ้าไม่ได้เลือกจะเป็น null)
    const selectedSex = document.querySelector('input[name="catsex"]:checked')?.value || '';
    const selectedColor = document.querySelector('input[name="catcolor"]:checked')?.value || '';
    const selectedAge = document.querySelector('input[name="catage"]:checked')?.value || '';

    // กรองการ์ดแมวตามค่าที่เลือก
    document.querySelectorAll('.cat-card').forEach(card => {
        const catSex = card.querySelector('.Pcatsex').value;
        const catColor = card.querySelector('.Pcatcolor').value;
        const catAge = card.querySelector('.Pcatage').value;

        // ตรวจสอบเงื่อนไขการแสดงการ์ด (ต้องตรงกับทุกค่าที่เลือก)
        const matchSex = !selectedSex || catSex === selectedSex;
        const matchColor = !selectedColor || catColor === selectedColor;
        const matchAge = !selectedAge || catAge === selectedAge;

        // แสดงหรือซ่อนการ์ดแมวตามเงื่อนไข
        if (matchSex && matchColor && matchAge) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }

        
    });
    
    const filterPopup = bootstrap.Modal.getInstance(document.getElementById('filterPopup'));
    filterPopup.hide();

}

function resetFilter() {
    // เคลียร์ค่าทั้งหมดของ Radio Buttons
    document.querySelectorAll('input[type="radio"]:checked').forEach(radio => {
        radio.checked = false;
    });

    // แสดงการ์ดแมวทั้งหมดเมื่อรีเซ็ต
    document.querySelectorAll('.cat-card').forEach(card => {
        card.style.display = 'block';
    });

    // ปิด Modal หลังจากรีเซ็ต
    const filterPopup = bootstrap.Modal.getInstance(document.getElementById('filterPopup'));
    if (filterPopup) {
        filterPopup.hide();
    }
}



