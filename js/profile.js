document.addEventListener("DOMContentLoaded", function () {
  function showSection(sectionId) {
    // Hide all sections
    document.querySelectorAll(".section").forEach((section) => {
      section.classList.add("d-none");
    });

    // Show the selected section
    document.getElementById(sectionId).classList.remove("d-none");
  }

  // Attach event listeners to navigation links
  document
    .getElementById("my-posts-btn")
    .addEventListener("click", function () {
      showSection("my-posts");
    });

  document
    .getElementById("adopt-requests-btn")
    .addEventListener("click", function () {
      showSection("adopt-requests");
    });

  document
    .getElementById("bookmarks-btn")
    .addEventListener("click", function () {
      showSection("bookmarks");
    });
});
document.addEventListener("DOMContentLoaded", function () {
  let editBtn = document.querySelector(".edit-btn");
  let modal = document.getElementById("editProfileModal");
  let closeModal = document.querySelector(".close-btn");

  // Open modal when clicking the edit button
  editBtn.addEventListener("click", function () {
    modal.style.display = "block";
  });

  // Close modal when clicking the close button (X)
  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  // Close modal when clicking outside the modal content
  window.addEventListener("click", function (event) {
    if (event.target == modal) {
      modal.style.display = "none";
    }
  });

  // Save Profile Button (You can expand this to save data)
  document.getElementById("saveProfile").addEventListener("click", function () {
    alert("Profile Updated Successfully!");
    modal.style.display = "none";
  });
});
