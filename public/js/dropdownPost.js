import { search_accountByid, search_stateBook, addStateBook, deleteStateBook, search_post, deletePost, updatePost, closePost } from "./db.js";
import { sendNotification } from "./notification.js";

export function toggleDropdown(postId) {
    menupopup(postId);
    var menu = document.getElementById(`dropdownMenu${postId}`);
    menu.style.display = (menu.style.display === "block") ? "none" : "block";
}

// ปิด dropdown เมื่อคลิกที่อื่น
document.addEventListener("click", function (event) {
    const dropdownMenus = document.querySelectorAll('[id^="dropdownMenu"]');
    
    dropdownMenus.forEach(menu => {
        const icon = menu.closest('.menu-container');
        
        if (icon && !icon.contains(event.target)) {
            menu.style.display = "none";
        }
    });
});

export async function menupopup(post_id) {
    const post = await search_post(post_id)
    let usersession = sessionStorage.getItem("user");
    const account = await search_accountByid(usersession);
    let stateBoomark = await search_stateBook(account.id, post.id);

    const dropdownMenu = document.getElementById(`dropdownMenu${post_id}`)
    dropdownMenu.innerHTML = '';

    if (post.owner == usersession){
        const Menu_item1 = document.createElement('p');
        Menu_item1.textContent = "แก้ไขโพสต์";
        Menu_item1.addEventListener("click",async () => {
          await editPost(post.id);
          dropdownMenu.style.display = "none";
        });

        const Menu_item2 = document.createElement('p');
        Menu_item2.textContent = "ลบโพสต์";
        Menu_item2.addEventListener("click",async () => {
            dropdownMenu.style.display = "none";
            await confirmDelete(post.id)
            
        });

        const Menu_item3 = document.createElement('p');
        if (!stateBoomark){
            Menu_item3.textContent = "บันทึกโพสต์";
        }
        else{
            Menu_item3.textContent = "ลบบันทึกโพสต์";
        }
        Menu_item3.addEventListener("click",async () => {
            dropdownMenu.style.display = "none";

            if (!stateBoomark){
                await addStateBook(account.id, post.id);
            }
            else{
                await deleteStateBook(account.id, post.id);
            }


        });

        const Menu_item4 = document.createElement('p');
        Menu_item4.textContent = "ปิดรับเลี้ยง";
        Menu_item4.addEventListener("click",async () => {
            dropdownMenu.style.display = "none";
            await closePost(post.id);
            location.reload();
        });

        dropdownMenu.appendChild(Menu_item1);
        dropdownMenu.appendChild(Menu_item2);
        dropdownMenu.appendChild(Menu_item3);
        dropdownMenu.appendChild(Menu_item4);
    }
    else{
        const Menu_item3 = document.createElement('p');
        if (!stateBoomark){
            Menu_item3.textContent = "บันทึกโพสต์";
        }
        else{
            Menu_item3.textContent = "ลบบันทึกโพสต์";
        }
        Menu_item3.addEventListener("click",async () => {
            dropdownMenu.style.display = "none";

            if (!stateBoomark){
                await addStateBook(account.id, post.id);
                if (usersession != post.owner){
                    await sendNotification(post.id, post.owner, "bookmark", usersession);
                    setTimeout(() => {
                    }, 1000);
                }
            }
            else{
                await deleteStateBook(account.id, post.id);
            }
        });
        dropdownMenu.appendChild(Menu_item3);
    }
    
}

export async function confirmDelete(postID){
    const formdelete = document.getElementById('DeleteForm');
    formdelete.style.display = "flex";

    const cancelbutton = document.getElementById('cancelbutton');
    cancelbutton.addEventListener("click", () => {
        formdelete.style.display = "none";
    })

    const confirmbutton = document.getElementById('confirmbutton');
    confirmbutton.addEventListener("click",async () => {
    await deletePost(postID);
    location.reload();
    })
}

export async function editPost(postID) {
    const post = await search_post(postID);

    const modal = new bootstrap.Modal(document.getElementById("editpost"));
    modal.show();
    
    document.getElementById("edcloseAddpost").addEventListener("click", function () {
        modal.hide();
    });
    
    const catpreview = document.getElementById('edcat-preview');
    catpreview.style.backgroundImage = `url(${post.img})`;
    catpreview.style.backgroundSize = "cover";
    catpreview.style.backgroundPosition = "center";
    
    
    const catname = document.getElementById('edcatName');
    catname.value = post.catname;

    const catSex = document.getElementById('edcatSex');
    catSex.value = post.sex;

    const catColor = document.getElementById('edcatColor');
    catColor.value = post.catcolor;

    const catAge = document.getElementById('edcatAge');
    catAge.value = post.catage;

    const catLocation = document.getElementById('edcatLocation');
    catLocation.value = post.location;

    const catDetails = document.getElementById('edcatDetails');
    catDetails.value = post.details;

    //กดปุ่มยืนยัน
    const confirmButton = document.getElementById('edconfirmpost');
    confirmButton.addEventListener("click",async () => {

    //ดึงข้อมูล
    const img = document.getElementById("edcatImg");
    let avatarFile = null;
    if (img.files[0] == undefined){
        avatarFile = null
    }else{
        avatarFile = img.files[0];
    }
    

    const catname = document.getElementById('edcatName').value;

    const catSex = document.getElementById('edcatSex').value;

    const catColor = document.getElementById('edcatColor').value;

    const catAge = document.getElementById('edcatAge').value;

    const catLocation = document.getElementById('edcatLocation').value;

    const catDetails = document.getElementById('edcatDetails').value;

    const newData = {
        img: avatarFile,
        name: catname,
        sex: catSex,
        color: catColor,
        age: catAge,
        location: catLocation,
        details: catDetails
    }
    await updatePost(post.id, newData);
    //ปิด Form

    modal.hide();
    location.reload();
    })



}