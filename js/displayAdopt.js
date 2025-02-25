import { timeAgo } from "./timeago.js";
import { search_accountByid, getAdoptData, search_post } from "./db.js";
import { sendNotification } from "./notification.js";
import { createDetailRequest } from "./requestAdoptPopup.js";


export async function displayMyrequest() {
  let usersession = sessionStorage.getItem("user");
  const myaccount = await search_accountByid(usersession);
  const ListElement = document.querySelector('#content-container');
  ListElement.innerHTML = "";
  const adopts = await getAdoptData();    

  adopts.forEach(async adopt => {
    const post = await search_post(adopt.postid);
    if (adopt.ownerpost == myaccount.id){
        const timeadopt = timeAgo(adopt.time.toDate());

        const card = document.createElement('div');
        card.classList.add('card', 'request-card', 'mb-3');

        const top = document.createElement('div'); 
        top.classList.add('d-flex', 'align-items-center', 'justify-content-between');

        const containerin = document.createElement('div'); 
        containerin.classList.add('d-flex', 'align-items-center');

        const accountowner = await search_accountByid(adopt.ownerrequest);

        const imgownerRequest = document.createElement('img');
        imgownerRequest.classList.add('request-img', 'me-3');
        imgownerRequest.src = accountowner.img;

        const containerInfo = document.createElement('div');
        containerInfo.classList.add('request-info');

        const namerequest = document.createElement('p');
        namerequest.classList.add('request-user');
        namerequest.textContent =  `${accountowner.username} ส่งคำขอถึงคุณ`;

        const timeAdopt = document.createElement('p');
        timeAdopt.classList.add('request-time');
        timeAdopt.textContent = timeadopt;

        let cat_sex = post.sex === 'ชาย' ? '♂' : '♀';
        const detailCat = document.createElement('p');
        detailCat.classList.add('request-detail');
        detailCat.innerHTML  = `<strong>แมวที่ต้องการรับเลี้ยง</strong> : ${post.catname} ${cat_sex}`;

        const detailAdopt = document.createElement('p');
        detailAdopt.classList.add('request-detail');
        detailAdopt.innerHTML = `<strong>รายละเอียดอื่นๆ</strong> : ${adopt.detail}`;

        containerInfo.appendChild(namerequest);
        containerInfo.appendChild(timeAdopt);
        containerInfo.appendChild(detailCat); 
        containerInfo.appendChild(detailAdopt);


        containerin.appendChild(imgownerRequest);
        containerin.appendChild(containerInfo);

        top.appendChild(containerin);

        const bottom = document.createElement('div');
        bottom.classList.add('request-actions', 'd-flex', 'justify-content-between', 'align-items-center', 'mt-3');

        const viewbutton = document.createElement('button');
        viewbutton.classList.add('btn', 'request-btn');
        viewbutton.textContent = "ดูรายละเอียด";
        viewbutton.addEventListener("click", async () => {
          await createDetailRequest(adopt.id);
        });



        bottom.appendChild(viewbutton);

        card.appendChild(top);
        card.appendChild(bottom);

        ListElement.append(card);

    }
    
  });
}


























