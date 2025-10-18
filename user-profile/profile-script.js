// Profile Page Script

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupProfileEvents();
  loadUserProfile();
});

// Setup profile page events
function setupProfileEvents() {
  // Edit profile modal events
  const editModal = document.getElementById("editProfileModal");
  const closeEditBtn = document.getElementById("closeEditModal");
  const cancelEditBtn = document.getElementById("cancelEditBtn");
  const editForm = document.getElementById("editProfileForm");

  // Close modal events
  closeEditBtn.addEventListener("click", closeEditModal);
  cancelEditBtn.addEventListener("click", closeEditModal);

  // Form submission
  editForm.addEventListener("submit", handleEditProfile);

  // Close modal when clicking outside
  editModal.addEventListener("click", (e) => {
    if (e.target === editModal) {
      closeEditModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && editModal.classList.contains("show")) {
      closeEditModal();
    }
  });
}

// Load user profile data
function getDefaultUserData() {
  return {
    fullName: "آرین مقدری",
    username: "arian",
    email: "arian.moqdari@example.com",
    phone: "09121111111",
    role: "مدیر سیستم",
    joinDate: "01 مهر 1404",
    lastLogin: "امروز - 14:30",
    status: "فعال",
    bio: "مدیر سیستم مدیریت تابلوهای تبلیغاتی",
    permissions: [
      { name: "مدیریت کاربران", allowed: true },
      { name: "مدیریت تابلوها", allowed: true },
      { name: "گزارش‌گیری", allowed: true },
      { name: "تنظیمات سیستم", allowed: true },
      { name: "خروجی Excel", allowed: true },
      { name: "افزودن تابلو", allowed: true }
    ],
    stats: {
      billboardsAdded: 25,
      editsMade: 48,
      reportsDownloaded: 12,
      hoursActive: 156
    },
    activities: [
      { text: "تابلو جدید \"BB-025\" اضافه شد", time: "2 ساعت پیش", icon: "plus" },
      { text: "تابلو \"BB-012\" ویرایش شد", time: "4 ساعت پیش", icon: "edit" },
      { text: "گزارش Excel دانلود شد", time: "1 روز پیش", icon: "download" },
      { text: "ورود به سیستم", time: "امروز - 14:30", icon: "sign-in-alt" }
    ]
  };
}

function loadUserProfile() {
  const defaults = getDefaultUserData();
  const stored = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const userData = { ...defaults, ...stored };
  updateProfileDisplay(userData);
}

// Update profile display with data
function updateProfileDisplay(userData) {
  // Update header info
  document.querySelector(".profile-name").textContent = userData.fullName;
  document.querySelector(".profile-role").innerHTML = `
    <i class="fa-solid fa-crown"></i>
    ${userData.role}
  `;
  document.querySelector(".profile-email").innerHTML = `
    <i class="fa-solid fa-envelope"></i>
    ${userData.email}
  `;

  // Update detail grid
  const detailItems = document.querySelectorAll(".detail-item");
  detailItems[0].querySelector("span").textContent = userData.fullName;
  detailItems[1].querySelector("span").textContent = userData.username;
  detailItems[2].querySelector("span").textContent = userData.phone;
  detailItems[3].querySelector("span").textContent = userData.joinDate;
  detailItems[4].querySelector("span").textContent = userData.lastLogin;

  // Update stats
  const statNumbers = document.querySelectorAll(".stat-number");
  statNumbers[0].textContent = userData.stats.billboardsAdded;
  statNumbers[1].textContent = userData.stats.editsMade;
  statNumbers[2].textContent = userData.stats.reportsDownloaded;
  statNumbers[3].textContent = userData.stats.hoursActive;

  // Update activities
  const activityList = document.querySelector(".activity-list");
  activityList.innerHTML = "";
  
  userData.activities.forEach(activity => {
    const activityItem = document.createElement("div");
    activityItem.className = "activity-item";
    activityItem.innerHTML = `
      <div class="activity-icon">
        <i class="fa-solid fa-${activity.icon}"></i>
      </div>
      <div class="activity-content">
        <p class="activity-text">${activity.text}</p>
        <p class="activity-time">${activity.time}</p>
      </div>
    `;
    activityList.appendChild(activityItem);
  });
}

// Edit profile function
function editProfile() {
  const modal = document.getElementById("editProfileModal");
  modal.classList.add("show");
  
  // Focus on first input
  document.getElementById("editFullName").focus();
}

// Close edit modal
function closeEditModal() {
  const modal = document.getElementById("editProfileModal");
  modal.classList.remove("show");
}

// Handle edit profile form submission
function handleEditProfile(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const updatedData = {
    fullName: formData.get("fullName"),
    username: formData.get("username"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    bio: formData.get("bio"),
    currentPassword: formData.get("currentPassword"),
    newPassword: formData.get("newPassword")
  };

  // Validate form
  if (!validateEditForm(updatedData)) {
    return;
  }

  // Persist to localStorage to apply across all pages
  const defaults = getDefaultUserData();
  const stored = JSON.parse(localStorage.getItem("userProfile") || "{}");
  const merged = { ...defaults, ...stored };
  // Only override editable fields
  merged.fullName = updatedData.fullName;
  merged.username = updatedData.username;
  merged.email = updatedData.email;
  merged.phone = updatedData.phone;
  merged.bio = updatedData.bio;
  localStorage.setItem("userProfile", JSON.stringify(merged));

  // Show success message
  showNotification("پروفایل با موفقیت به‌روزرسانی شد!", "success");
  
  // Close modal
  closeEditModal();
  
  // Update display immediately
  updateProfileDisplay(merged);
}

// Validate edit form
function validateEditForm(data) {
  // Check required fields
  if (!data.fullName.trim()) {
    showNotification("نام کامل الزامی است", "error");
    return false;
  }
  
  if (!data.username.trim()) {
    showNotification("نام کاربری الزامی است", "error");
    return false;
  }
  
  if (!data.email.trim()) {
    showNotification("ایمیل الزامی است", "error");
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    showNotification("فرمت ایمیل صحیح نیست", "error");
    return false;
  }
  
  // Validate phone format (Iranian mobile)
  if (data.phone && !/^09\d{9}$/.test(data.phone)) {
    showNotification("فرمت شماره تلفن صحیح نیست", "error");
    return false;
  }
  
  // Check password change
  if (data.newPassword && !data.currentPassword) {
    showNotification("برای تغییر رمز عبور، رمز فعلی الزامی است", "error");
    return false;
  }
  
  if (data.newPassword && data.newPassword.length < 6) {
    showNotification("رمز عبور جدید باید حداقل 6 کاراکتر باشد", "error");
    return false;
  }
  
  return true;
}

// Logout function
function logout() {
  if (confirm("آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟")) {
    // In a real application, this would clear session and redirect
    showNotification("در حال خروج از سیستم...", "info");
    
    setTimeout(() => {
      // Redirect to login page or home
      window.location.href = "navbar.html";
    }, 1500);
  }
}

// Show notification
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  
  let iconClass;
  if (type === "success") {
    iconClass = "check-circle";
  } else if (type === "error") {
    iconClass = "exclamation-circle";
  } else {
    iconClass = "info-circle";
  }
  
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid fa-${iconClass}"></i>
      <span>${message}</span>
    </div>
  `;
  
  // Add styles
  let backgroundColor;
  if (type === "success") {
    backgroundColor = "linear-gradient(135deg, #48bb78, #38a169)";
  } else if (type === "error") {
    backgroundColor = "linear-gradient(135deg, #e53e3e, #c53030)";
  } else {
    backgroundColor = "linear-gradient(135deg, #4299e1, #3182ce)";
  }
  
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: ${backgroundColor};
    color: white;
    padding: 15px 20px;
    border-radius: 10px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    z-index: 3000;
    animation: slideInRight 0.3s ease;
    max-width: 300px;
  `;
  
  // Add to page
  document.body.appendChild(notification);
  
  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}
