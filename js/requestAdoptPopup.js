import { search_request, search_accountByid, search_post, updateStatusPost, deleteRequest } from "./db.js";
import { sendNotification } from "./notification.js";
import { updateDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";

export async function createDetailRequest(requestID) {
    const popup = document.getElementById('request-popup');
    popup.innerHTML= '';
    popup.style.display = 'flex';

    let usersession = sessionStorage.getItem("user");
    const account = await search_accountByid(usersession);
    const request = await search_request(requestID);
    const post = await search_post(request.postid);
    const targetAccount = await search_accountByid(request.ownerrequest);


    let imgLst = request.imglst;
    
        const content = document.createElement('div');
        content.classList.add('request-popup-content');

        const closebtn = document.createElement('span');
        closebtn.classList.add('request-popup-close', 'fa-solid', 'fa-xmark');
        closebtn.onclick = () =>{
            popup.style.display = 'none';
        }

        const header = document.createElement('h2');
        header.classList.add('request-popup-title');
        header.textContent = `คำขอจาก ${targetAccount.username}`;


        const bottomButton = document.createElement('div');
        bottomButton.classList.add('carousel', 'slide');
        bottomButton.id = 'carouselExampleIndicators';

        const innerbottom1 = document.createElement('div');
        innerbottom1.classList.add('carousel-indicators');

        for (let i = 0; i < imgLst.length; i++) {
            const button = document.createElement('button');
            if (i == 0){
              button.classList.add('active'); 
            }
            button.type = 'button';
            button.setAttribute('data-bs-target', '#carouselExampleIndicators');
            button.setAttribute('data-bs-slide-to', i);

            innerbottom1.appendChild(button);
        }

        const innerbottom2 = document.createElement('div');
        innerbottom2.classList.add('carousel-inner');

        for (let i = 0; i < imgLst.length; i++) {
            const carousel = document.createElement('div');
            if(i == 0){
                carousel.classList.add('carousel-item', 'active');
            }
            else{
                carousel.classList.add('carousel-item');
            }

            const img = document.createElement('img');
            img.classList.add('d-block', 'w-100');
            img.src = imgLst[i]

            carousel.appendChild(img);
            innerbottom2.appendChild(carousel);
        }

        bottomButton.appendChild(innerbottom1);
        bottomButton.appendChild(innerbottom2);

        for (let i = 0; i < 2; i++) {
            const buttoncontrol = document.createElement('button');
            buttoncontrol.type = 'button';
            buttoncontrol.setAttribute('data-bs-target', "#carouselExampleIndicators")

            const control = document.createElement('span');
            control.setAttribute('aria-hidden', "true");
            if (i == 0){
                buttoncontrol.classList.add('carousel-control-prev');
                buttoncontrol.setAttribute('data-bs-slide', "prev")    
                control.classList.add('carousel-control-prev-icon');
            }
            else{
                buttoncontrol.classList.add('carousel-control-next');
                buttoncontrol.setAttribute('data-bs-slide', "next")    
                control.classList.add('carousel-control-next-icon');
            }
            buttoncontrol.appendChild(control);
            bottomButton.appendChild(buttoncontrol);
        }
        

        // 
        const detailSection = document.createElement('div');
        detailSection.classList.add('detailSection')

        const catwant = document.createElement('p');
        catwant.classList.add('catwantadopt')
        catwant.innerHTML  = `แมวที่ต้องการรับเลี้ยง : <span class="catnameadopt">${post.catname}</span>`;

        const contractlable = document.createElement('p');
        contractlable.classList.add('contractlable');
        contractlable.innerHTML = `ช่องทางการติดต่อ ${targetAccount.username}`;


        const groupcontract = document.createElement('div');
        groupcontract.classList.add('groupcontract');

        const contract = document.createElement('p');
        contract.classList.add('contractadopt');
        contract.textContent = `${targetAccount.contract}`;

        const tel = document.createElement('p');
        tel.classList.add('teladopt');
        tel.textContent = `tel. : ${targetAccount.phone}`

        groupcontract.appendChild(contract);
        groupcontract.appendChild(tel);

        const detailslable = document.createElement('p');
        detailslable.classList.add('detailslable')
        detailslable.innerHTML = `รายละเอียด`

        const details = document.createElement('p');
        details.classList.add('detailadopt')
        details.innerHTML = request.detail

        const groupdatail = document.createElement('div');
        groupdatail.classList.add('groupdatail')

        groupdatail.appendChild(details)


        detailSection.appendChild(catwant);
        detailSection.appendChild(detailslable);
        detailSection.appendChild(groupdatail);
        detailSection.appendChild(contractlable);
        detailSection.appendChild(groupcontract);
       

        const buttonSection = document.createElement('div');
        buttonSection.classList.add('request-popup-actions');

        const buttonOk = document.createElement('button');
        buttonOk.classList.add('request-popup-approve');
        buttonOk.textContent = "ยอมรับ";
        buttonOk.onclick = async () => {
            await updateStatusPost(post.id);
            await sendNotification(post.id, targetAccount.id, "confirm", usersession);
            popup.style.display = 'none';
        }

        const buttonCancel = document.createElement('button');
        buttonCancel.classList.add('request-popup-decline');
        buttonCancel.textContent = "ปฏิเสธ";
        buttonCancel.onclick = async () => {
            await deleteRequest(request.id);
            await sendNotification(post.id, targetAccount.id, "cancel", usersession);
            popup.style.display = 'none';
        }
        console.log(request.status)
        if (request.status == false){
            buttonOk.disabled = true;
            buttonCancel.disabled = true;
        }
        else{
            buttonOk.disabled = false;
            buttonCancel.disabled = false;
        }

        buttonSection.appendChild(buttonOk);
        buttonSection.appendChild(buttonCancel);
        


        content.appendChild(closebtn);
        content.appendChild(header);
        content.appendChild(bottomButton);
        content.appendChild(detailSection);
        content.appendChild(buttonSection);


        popup.appendChild(content);
    
}


