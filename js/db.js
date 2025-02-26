// Import Firebase SDK from CDN
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js";
import { getFirestore, collection, getDoc, getDocs, addDoc, where, query, setDoc, deleteDoc, doc, updateDoc, increment, Timestamp, orderBy } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore-lite.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-storage.js";



// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3D8w5hAidJnwAybd_AEZoBFKDtjSl0UU",
  authDomain: "catprojectce.firebaseapp.com",
  projectId: "catprojectce",
  storageBucket: "catprojectce.firebasestorage.app",
  messagingSenderId: "128805338272",
  appId: "1:128805338272:web:fd50c8bc8f73bef823ddc5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// Fetch cat data from Firestore
export async function getPostData() {
  const postQuery = query(
      collection(db, 'Post'),
      orderBy('time', 'desc') // เรียงลำดับจากใหม่ไปเก่า
  );

  const postSnapshot = await getDocs(postQuery);
  return postSnapshot.docs.map(doc => ({
      id: doc.id, // เพิ่ม id ของเอกสาร
      ...doc.data()
  }));
}

// Fetch cat data from Firestore
export async function getAdoptData() {
  const adopttQuery = query(
      collection(db, 'adopt-request'),
      orderBy('time', 'desc') // เรียงลำดับจากใหม่ไปเก่า
  );

  const adoptSnapshot = await getDocs(adopttQuery);
  return adoptSnapshot.docs.map(doc => ({
      id: doc.id, // เพิ่ม id ของเอกสาร
      ...doc.data()
  }));
}

export async function getBookmarkData() {
  const Bookmark = collection(db, 'state-bookmark');
  const bookmarkSnapshot = await getDocs(Bookmark);
  return bookmarkSnapshot.docs.map(doc => doc.data());
}

export async function getAccountData() {
  const Account = collection(db, 'Account');
  const accountSnapshot = await getDocs(Account);
  return accountSnapshot.docs.map(doc => doc.data());
}

export async function getCommenttData() {
  const Comment = collection(db, 'Comment');
  const commentSnapshot = await getDocs(Comment);
  return commentSnapshot.docs.map(doc => doc.data());
}

export async function getStateLike() {
  const State = collection(db, 'State-like');
  const stateSnapshot = await getDocs(State);
  return stateSnapshot.docs.map(doc => doc.data());
}

//-------------------Like----------------------

export async function search_statelike(userID, postId) {
  try {
    const stateRef = collection(db, 'state-like');
    let q = query(stateRef, where("user", "==", userID), where("post_id", "==", postId));
    let querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true
    }
    else {
      return false
    }
  } catch (e) {
    console.error(e);
  }
}

export async function addStateLike(userID, postID) {
  const postRef = doc(db, "Post", postID);
  await updateDoc(postRef, {
    countLike: increment(1)
  })

  const docRef = await addDoc(collection(db, "state-like"), {
    user: userID,
    post_id: postID,
  });
  console.log('add success');
}

export async function deleteStateLike(userID, postID) {
  const postRef = doc(db, "Post", postID);
  await updateDoc(postRef, {
    countLike: increment(-1)
  })

  const stateRef = collection(db, 'state-like');
  let q = query(stateRef, where("user", "==", userID), where("post_id", "==", postID));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "state-like", docSnapshot.id));
      console.log('delete success');
      return true
    });
  }
}


//-------------------------------------------------

//-------------------Bookmark----------------------

export async function search_stateBook(userID, postId) {
  try {
    const stateRef = collection(db, 'state-bookmark');
    let q = query(stateRef, where("user", "==", userID), where("post_id", "==", postId));
    let querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      return true
    }
    else {
      return false
    }
  } catch (e) {
    console.error(e);
  }
}

export async function addStateBook(userID, postID) {
  const docRef = await addDoc(collection(db, "state-bookmark"), {
    user: userID,
    post_id: postID,
  });
  console.log('add success');
}

export async function deleteStateBook(userID, postID) {
  const stateRef = collection(db, 'state-bookmark');
  let q = query(stateRef, where("user", "==", userID), where("post_id", "==", postID));
  let querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    querySnapshot.forEach(async (docSnapshot) => {
      await deleteDoc(doc(db, "state-bookmark", docSnapshot.id));
      console.log('delete success');
      return true
    });
  }
}

//-------------------------------------------------


// search หา account
export async function login(usernameOrEmail, password) {
  try {
    const accountRef = collection(db, "Account");

    // ลองค้นหาด้วย username ก่อน
    let q = query(accountRef, where("username", "==", usernameOrEmail), where("password", "==", password));
    let querySnapshot = await getDocs(q);

    // ถ้าไม่เจอ username ให้ลองค้นหาด้วย email
    if (querySnapshot.empty) {
      q = query(accountRef, where("mail", "==", usernameOrEmail), where("password", "==", password));
      querySnapshot = await getDocs(q);
    }

    // ถ้าเจอ username หรือ email พร้อม password ที่ถูกต้อง
    if (!querySnapshot.empty) {
      const userData = querySnapshot.docs[0].data();
      return userData;
    }
  } catch (error) {
    console.error("Error searching account:", error);
  }
  return false;
}

export async function search_accountByusername(username) {
  if (username) {
    try {
      const accountRef = collection(db, "Account");
      let q = query(accountRef, where("username", "==", username));
      let querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      }
    } catch (e) {
      console.error("Error searching account:", e);
    }
  }
}

export async function search_accountByid(accountId) {
  if (accountId) {
    try {
      const accountRef = collection(db, "Account");
      let q = query(accountRef, where("id", "==", accountId));
      let querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const userData = querySnapshot.docs[0].data();
        return userData;
      }
    } catch (e) {
      console.error("Error searching account:", e);
    }
  }
}

export async function search_post(postId) {
  if (postId) {
    try {
      const postRef = collection(db, "Post");
      let q = query(postRef, where("id", "==", postId));
      let querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const postData = querySnapshot.docs[0].data();
        return postData;
      }
    } catch (e) {
      console.error("Error searching account:", e);
    }
  }
}

export async function updateStatusPost(postId) {
  if(postId){

      const postRef = collection(db, "Post");
      const q = query(postRef, where("id", "==", postId));
      let querySnapshot = await getDocs(q);

      if (querySnapshot) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef,{
          status: false
        })
        console.log('update Success!')
      }
  }
}

export async function search_request(requestId) {
  if (requestId) {
    try {
      const requestRef = collection(db, "adopt-request");
      let q = query(requestRef, where("id", "==", requestId));
      let querySnapshot = await getDocs(q);
      if (querySnapshot) {
        const requestData = querySnapshot.docs[0].data();
        return requestData;
      }
    } catch (e) {
      console.error("Error searching account:", e);
    }
  }
}

export async function search_comment(postId) {
  if (postId) {
    try {
      const commentRef = collection(db, "Comment");
      let q = query(commentRef, where("idPost", "==", postId));
      let querySnapshot = await getDocs(q);

      const comments = querySnapshot.docs.map(doc => ({
        ownerComment: doc.ownerComment,
        text: doc.text,
        ...doc.data()
      }));

      return comments


    } catch (e) {
      console.error(e);
    }
  }
}

export async function addComment(username, postId, text) {
  try {
    const account = await search_accountByid(username);

    const docRef = await addDoc(collection(db, "Comment"), {
      idPost: postId,
      ownerComment: account.id,
      text: text,
      timestamp: Date.now(),
    });
    const postRef = doc(db, "Post", postId);
    await updateDoc(postRef, {
      countComment: increment(1)
    })
    console.log("Comment added with ID: ", docRef.id);
  } catch (e) {
    console.log(e);
  }

}

// ฟังก์ชันเพื่ออัปโหลดไฟล์รูป
export async function uploadImage(file, folder) {
  const timestamp = Date.now();  // ใช้เวลาปัจจุบันในรูปแบบ millisecond
  const storageRef = ref(storage, `${folder}/${timestamp}_${file.name}`);
  await uploadBytes(storageRef, file);
  const imageUrl = await getDownloadURL(storageRef);
  return imageUrl;
}



export async function register(username, phone, password, name, mail, contract, imageFile) {
  try {
    const imageUrl = await uploadImage(imageFile, "pictureProfile");
    const docRef = await addDoc(collection(db, "Account"), {});

    await setDoc(docRef, {
      id: docRef.id,
      name: name,
      phone: phone,
      contract: contract,
      username: username,
      password: password,
      mail: mail,
      img: imageUrl,
    });

    console.log("Account added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding cat: ", e);
  }
}


export async function updateProfile(userId, newData) {
    try {
        if (newData.img != null) {
            const imageUrl = await uploadImage(newData.img, "pictureProfile");
            newData.img = imageUrl;
        }

        const userRef = doc(db, "Account", userId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
            const oldData = userSnap.data();
            const accountRef = collection(db, "Account");

            // เช็๕ Email ซ้ำ
            if (newData.mail && newData.mail !== oldData.mail) {
                const emailQuery = query(accountRef, where("mail", "==", newData.mail));
                const emailSnap = await getDocs(emailQuery);
                if (!emailSnap.empty) {
                    alert("Email นี้มีคนใช้แล้วค้าบ");
                    return;
                }
            }

            // เช็ค Username ซ้ำ
            if (newData.username && newData.username !== oldData.username) {
                const usernameQuery = query(accountRef, where("username", "==", newData.username));
                const usernameSnap = await getDocs(usernameQuery);
                if (!usernameSnap.empty) {
                    alert("Username นี้มีคนใช้แล้วค้าบ");
                    return;
                }
            }

            const updatedData = {
                name: newData.name || oldData.name,
                phone: newData.phone || oldData.phone,
                contract: newData.contract || oldData.contract,
                mail: newData.mail || oldData.mail,
                username: newData.username || oldData.username,
                password: newData.password || oldData.password,
                img: newData.img || oldData.img
            };

            // อัพเดตข้อมูล
            await updateDoc(userRef, updatedData);
            location.reload();

        } else {
            console.log("User not found.");
        }
    } catch (error) {
        console.error("Error updating profile: ", error);
    }
}



export async function addPostData(catImg, catName, catSex, catColor, catAge, catLocation,  catDetails, ownerPost) {
  try {
    const imageUrl = await uploadImage(catImg, "catimgPost");
    const docRef = await addDoc(collection(db, "Post"), {}); // สร้าง document เปล่าก่อน เพื่อให้ได้ docRef.id

    await setDoc(docRef, {  
      catcolor: catColor,
      catname: catName,
      countComment: 0,
      countLike: 0,
      details: catDetails,
      id: docRef.id,
      img: imageUrl,
      location: catLocation,
      owner: ownerPost,
      sex: catSex,
      status: true,
      time: Timestamp.now(),
      catage: catAge,
    });

    console.log("Cat added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding cat: ", e);
  }
}

export async function addAdoptrequest(postId, ownerPost, ownerRequest, imgLst, details) {
  try {
    const docRef = await addDoc(collection(db, "adopt-request"), {}); // สร้าง document เปล่าก่อน เพื่อให้ได้ docRef.id

    await setDoc(docRef, {  
      id : docRef.id,
      postid : postId,
      ownerpost : ownerPost,
      ownerrequest : ownerRequest,
      status: true,
      imglst : imgLst,
      detail : details,
      time: Timestamp.now(),
    });

    console.log("adopt added with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding adopt: ", e);
  }
}

export async function deleteRequest(requestID) {
  try {
    const requestRef = doc(db, "adopt-request", requestID);
    await deleteDoc(requestRef);
    location.reload();
} catch (error) {
    console.error("Error deleting request: ", error);
}

}




