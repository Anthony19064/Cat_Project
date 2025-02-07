// ข้อมูลจำลองคำขอรับเลี้ยงแมว
const adoptRequests = [
    {
      catName: "Fluffy",
      requester: "Alice",
      email: "alice@example.com",
      phone: "123-456-7890",
      reason: "Looking for a companion"
    },
    {
      catName: "Whiskers",
      requester: "Bob",
      email: "bob@example.com",
      phone: "987-654-3210",
      reason: "Love cats and want to adopt one"
    },
    {
      catName: "Mittens",
      requester: "Charlie",
      email: "charlie@example.com",
      phone: "555-123-4567",
      reason: "My house is perfect for a cat"
    }
  ];
  
  // ฟังก์ชันแสดงข้อมูลในตาราง
  export const adoptCats = () => {
    const adoptRequestsList = document.getElementById("adoptRequestsList");
  
    // ลบข้อมูลเก่าออกก่อน
    adoptRequestsList.innerHTML = '';
  
    // ลูปผ่านข้อมูลและสร้างแถวใหม่ในตาราง
    adoptRequests.forEach(request => {
      const row = document.createElement("tr");
  
      // เพิ่มข้อมูลในแต่ละเซลล์
      row.innerHTML = `
        <td>${request.catName}</td>
        <td>${request.requester}</td>
        <td>${request.email}</td>
        <td>${request.phone}</td>
        <td>${request.reason}</td>
        <td>
          <button class="btn btn-success">Approve</button>
          <button class="btn btn-danger">Reject</button>
        </td>
      `;
  
      // เพิ่มแถวในตาราง
      adoptRequestsList.appendChild(row);
    });
  };
  