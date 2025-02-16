import { uploadImage } from "./db.js"

let fileLst = [];

export async function crate_popup(catName) {
  const popup = document.getElementById('adoptPopup');
  popup.style.display = 'flex';



  if (popup.innerHTML.trim() === '') {
    const closeBtn = document.createElement('i');
    closeBtn.classList.add('close-btn', 'fa-solid', 'fa-xmark');
    closeBtn.onclick = () => {
      popup.style.display = 'none';
      listContainer.innerHTML = '';  // เคลียร์รายการไฟล์
      list_Section.style.display = 'none';  // ซ่อน list section เมื่อไม่มีไฟล์
      fileLst = [];
    };

    const headerSection = document.createElement('div');
    headerSection.classList.add('header-section');
    headerSection.innerHTML = `
        <h1>คุณต้องการรับเลี้ยง ${catName} ?</h1>
        <p>อัปโหลดรูปภาพและรายละเอียดของคุณมาได้เลย :) </p>
    `;

    // Create drop-section
    const dropSection = document.createElement('div');
    dropSection.classList.add('drop-section');

    // First col in drop-section
    const col1 = document.createElement('div');
    col1.classList.add('col');
    col1.innerHTML = `
        <div class="cloud-icon">
            <i class="fa-solid fa-cloud-arrow-up" style="font-size:48px;color: #E09030;"></i>
        </div>
        <span style="font-weight: bold;">ลากและวางรูปภาพของคุณ</span>
        <span style="font-weight: bold;">หรือ</span>
        <button class="file-selector">เลือกไฟล์</button>
        <input type="file" class="file-selector-input" accept="image/*" multiple>
    `;

    // Second col in drop-section
    const col2 = document.createElement('div');
    col2.classList.add('col');
    col2.innerHTML = `<div class="drop-here">Drop here</div>`;

    // Append col1 and col2 to drop-section
    dropSection.appendChild(col1);
    dropSection.appendChild(col2);

    // Create list-section
    const listSection = document.createElement('div');
    listSection.classList.add('list-section');

    // Create list-title and list
    const listTitle = document.createElement('div');
    listTitle.classList.add('list-title');
    listTitle.innerHTML = 'ไฟล์ที่อัปโหลด';

    const list = document.createElement('div');
    list.classList.add('list');

    //button send
    const button = document.createElement('button');
    button.classList.add('adopt-button');
    button.textContent = "Send";
    button.onclick = async () => {
      // ถ้ามีไฟล์ใน fileLst ให้ทำการอัปโหลด
      if (fileLst.length > 0) {
        for (let file of fileLst) {
          try {
            const imageUrl = await uploadImage(file);  // อัปโหลดรูปและรับ URL
            console.log(`Uploaded: ${file.name}, URL: ${imageUrl}`);
            // ลบไฟล์จากรายการหลังอัปโหลดเสร็จ
            listContainer.innerHTML = '';  // เคลียร์รายการไฟล์
            list_Section.style.display = 'none';  // ซ่อน list section เมื่อไม่มีไฟล์
          } catch (error) {
            console.error(`Error uploading ${file.name}:`, error);
          }
        }
        fileLst = [];
        popup.style.display = 'none';
      } else {
        console.log("No files to upload");
      }

    };

    const detail = document.createElement('div');
    detail.classList.add('detailSection');

    const lable = document.createElement('lable');
    lable.classList.add('lablearea');
    lable.textContent = 'รายละเอียดอื่นๆ';

    const textarea = document.createElement('textarea');
    textarea.classList.add('txtarea');
    textarea.placeholder = 'กรอกรายละเอียดที่ต้องการแจ้งให้เจ้าของแมว';

    detail.appendChild(lable);
    detail.appendChild(textarea);

    // Append list-title and list to list-section
    listSection.appendChild(listTitle);
    listSection.appendChild(list);

    // Append headerSection, dropSection, and listSection to container
    popup.appendChild(headerSection);
    popup.appendChild(dropSection);
    popup.appendChild(listSection);
    popup.appendChild(detail);

    popup.appendChild(button);
    popup.appendChild(closeBtn);

  }

  // ส่วนที่เหลือยังเหมือนเดิม
  const dropArea = document.querySelector('.drop-section');
  const list_Section = document.querySelector('.list-section');
  const listContainer = document.querySelector('.list');
  const fileSelector = document.querySelector('.file-selector');
  const fileSelectorInput = document.querySelector('.file-selector-input');

  // upload files with browse button
  fileSelector.onclick = () => fileSelectorInput.click();
  fileSelectorInput.onchange = () => {
    [...fileSelectorInput.files].forEach((file) => {
      if (typeValidation(file.type)) {
        showFile(file);
      }
    });
  };

  // when file is over the drag area
  dropArea.ondragover = (e) => {
    e.preventDefault();
    [...e.dataTransfer.items].forEach((item) => {
      if (typeValidation(item.type)) {
        dropArea.classList.add('drag-over-effect');
      }
    });
  };

  // when file leave the drag area
  dropArea.ondragleave = () => {
    dropArea.classList.remove('drag-over-effect');
  };

  // when file drop on the drag area
  dropArea.ondrop = (e) => {
    e.preventDefault();
    dropArea.classList.remove('drag-over-effect');
    if (e.dataTransfer.items) {
      [...e.dataTransfer.items].forEach((item) => {
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (typeValidation(file.type)) {
            showFile(file);
          }
        }
      });
    } else {
      [...e.dataTransfer.files].forEach((file) => {
        if (typeValidation(file.type)) {
          showFile(file);
        }
      });
    }
  };

  // check the file type
  function typeValidation(type) {
    var splitType = type.split('/')[0];
    if (splitType == 'image') {
      return true;
    }
    return false;
  }

  // show file function - show the file name, size, and icon in the list
  function showFile(file) {
    fileLst.push(file);
    list_Section.style.border = '1px dashed #E09030';
    list_Section.style.display = 'block';
    var li = document.createElement('li');
    li.classList.add('in-prog');

    // สร้าง Object URL สำหรับแสดงภาพ
    const objectURL = URL.createObjectURL(file);

    li.innerHTML = `
        <div class="col">
            <img src="${objectURL}" style="width: 50px; height: 50px; object-fit: cover;"  alt="${file.name}">
        </div>
        <div class="col">
            <div class="file-name">
                <div class="name">${file.name}</div>
                <div class="file-size">${(file.size / (1024 * 1024)).toFixed(2)}MB</div>
            </div>
        </div>
        <div class="col">
            <i class="fa-solid fa-xmark cross"></i>
        </div>
    `;
    listContainer.prepend(li);

    // ฟังก์ชันการยกเลิกการแสดงไฟล์
    li.querySelector('.cross').onclick = () => {
      li.remove();
      // เมื่อไฟล์ถูกลบออก ให้เช็คจำนวนไฟล์ใน list ถ้าผ่านไปแล้วไม่มีไฟล์ให้ซ่อนขอบ
      fileLst = fileLst.filter(f => f !== file);
      if (fileLst.length === 0) {
        list_Section.style.display = 'none'; // ซ่อนขอบเมื่อไม่มีไฟล์

      }
    };
  }
}