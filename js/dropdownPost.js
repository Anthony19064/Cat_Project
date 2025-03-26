import { getPostData, getBookmarkData, search_accountByid, search_statelike, addStateLike, deleteStateLike, search_stateBook, addStateBook, deleteStateBook, search_post, deletePost } from "./db.js";
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

        dropdownMenu.appendChild(Menu_item1);
        dropdownMenu.appendChild(Menu_item2);
        dropdownMenu.appendChild(Menu_item3);
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

    const modal = new bootstrap.Modal(document.getElementById("filterModal2"));
    modal.show();
    
    document.getElementById("closeAddpost").addEventListener("click", function () {
        modal.hide();
    });
    
    const catpreview = document.getElementById('cat-preview');
    catpreview.style.backgroundImage = `url(${post.img})`;
    catpreview.style.backgroundSize = "cover";
    catpreview.style.backgroundPosition = "center";
    
    
    const catname = document.getElementById('catName');
    catname.value = post.catname;

    const catSex = document.getElementById('catSex');
    catSex.value = post.sex;

    const catColor = document.getElementById('catColor');
    catColor.value = post.catcolor;

    const catAge = document.getElementById('catAge');
    catAge.value = post.catage;

    const catLocation = document.getElementById('catLocation');
    catLocation.value = post.location;

    const catDetails = document.getElementById('catDetails');
    catDetails.value = post.details;

    const confirmButton = document.getElementById('btn-cancel');
    confirmButton.addEventListener("click", () => {
        console.log('editPost')
    })
}