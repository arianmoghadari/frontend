// Admin Panel Script

// Users data management functions
function getUsersData() {
  try {
    const stored = localStorage.getItem('users');
    if (stored) {
      return JSON.parse(stored);
    } else {
      // Initialize with default admin user
      const defaultUsers = [
        {
          id: 1,
          username: "arian",
          fullName: "آرین مقدری",
          email: "arian.moqdari@example.com",
          phone: "09121111111",
          role: "admin",
          status: "active",
          joinDate: "01 مهر 1404",
          lastLogin: "امروز - 14:30"
        }
      ];
      localStorage.setItem('users', JSON.stringify(defaultUsers));
      return defaultUsers;
    }
  } catch (error) {
    console.error('Error loading users data:', error);
    return [];
  }
}

function saveUsersData(users) {
  try {
    localStorage.setItem('users', JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users data:', error);
  }
}

// Get current users data
let usersData = getUsersData();

// Role translations
const roleTranslations = {
  admin: "مدیر کل",
  manager: "مدیر",
  user: "کاربر عادی"
};

// Status translations
const statusTranslations = {
  active: "فعال",
  inactive: "غیرفعال"
};

// Initialize when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  setupAdminEvents();
  loadUsersTable();
  setupTabs();
  setupPartners();
  setupProvinces();
  setupCities();
  
  // Load stats immediately
  loadDetailedStats();
  
  // Start auto-refresh
  startStatsAutoRefresh();
  
  // Also refresh when tab becomes visible
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      refreshStats();
    }
  });
});

// Setup admin panel events
function setupAdminEvents() {
  // Add user modal events
  const addUserModal = document.getElementById("addUserModal");
  const closeAddUserBtn = document.getElementById("closeAddUserModal");
  const cancelAddUserBtn = document.getElementById("cancelAddUserBtn");
  const addUserForm = document.getElementById("addUserForm");

  // Close modal events
  closeAddUserBtn.addEventListener("click", closeAddUserModal);
  cancelAddUserBtn.addEventListener("click", closeAddUserModal);

  // Form submission
  addUserForm.addEventListener("submit", handleAddUser);

  // Close modal when clicking outside
  // addUserModal.addEventListener("click", (e) => {
  //   if (e.target === addUserModal) {
  //     closeAddUserModal();
  //   }
  // });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && addUserModal.classList.contains("show")) {
      closeAddUserModal();
    }
  });

  // Settings save button
  const saveSettingsBtn = document.querySelector(".btn-save-settings");
  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener("click", saveSettings);
  }

  // Log filter button
  const filterLogsBtn = document.querySelector(".btn-filter-logs");
  if (filterLogsBtn) {
    filterLogsBtn.addEventListener("click", filterLogs);
  }

  // City modal events
  const addCityModal = document.getElementById("addCityModal");
  const closeAddCityBtn = document.getElementById("closeAddCityModal");
  const cancelAddCityBtn = document.getElementById("cancelAddCityBtn");
  const addCityForm = document.getElementById("addCityForm");

  const editCityModal = document.getElementById("editCityModal");
  const closeEditCityBtn = document.getElementById("closeEditCityModal");
  const cancelEditCityBtn = document.getElementById("cancelEditCityBtn");
  const editCityForm = document.getElementById("editCityForm");

  // Close modal events
  if (closeAddCityBtn) closeAddCityBtn.addEventListener("click", closeAddCityModal);
  if (cancelAddCityBtn) cancelAddCityBtn.addEventListener("click", closeAddCityModal);
  if (closeEditCityBtn) closeEditCityBtn.addEventListener("click", closeEditCityModal);
  if (cancelEditCityBtn) cancelEditCityBtn.addEventListener("click", closeEditCityModal);

  // Form submission
  if (addCityForm) addCityForm.addEventListener("submit", handleAddCity);
  if (editCityForm) editCityForm.addEventListener("submit", handleEditCity);

  // Province modal events
  const addProvinceModal = document.getElementById("addProvinceModal");
  const closeAddProvinceBtn = document.getElementById("closeAddProvinceModal");
  const cancelAddProvinceBtn = document.getElementById("cancelAddProvinceBtn");
  const addProvinceForm = document.getElementById("addProvinceForm");

  const editProvinceModal = document.getElementById("editProvinceModal");
  const closeEditProvinceBtn = document.getElementById("closeEditProvinceModal");
  const cancelEditProvinceBtn = document.getElementById("cancelEditProvinceBtn");
  const editProvinceForm = document.getElementById("editProvinceForm");

  // Close modal events
  if (closeAddProvinceBtn) closeAddProvinceBtn.addEventListener("click", closeAddProvinceModal);
  if (cancelAddProvinceBtn) cancelAddProvinceBtn.addEventListener("click", closeAddProvinceModal);
  if (closeEditProvinceBtn) closeEditProvinceBtn.addEventListener("click", closeEditProvinceModal);
  if (cancelEditProvinceBtn) cancelEditProvinceBtn.addEventListener("click", closeEditProvinceModal);

  // Form submission
  if (addProvinceForm) addProvinceForm.addEventListener("submit", handleAddProvince);
  if (editProvinceForm) editProvinceForm.addEventListener("submit", handleEditProvince);
}

// =============================
// Partners (Collaborating Companies)
// =============================
function setupPartners(){
  const form = document.getElementById('partnerForm');
  if (form){
    form.addEventListener('submit', handlePartnerSubmit);
  }
  renderPartnersTable();
}

function readPartners(){
  try {
    const raw = localStorage.getItem('partners');
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function writePartners(list){
  try { localStorage.setItem('partners', JSON.stringify(list)); } catch {}
}

function handlePartnerSubmit(e){
  e.preventDefault();
  const name = (document.getElementById('partnerName')||{}).value || '';
  const p1 = (document.getElementById('partnerPhone1')||{}).value || '';
  const p2 = (document.getElementById('partnerPhone2')||{}).value || '';
  const p3 = (document.getElementById('partnerPhone3')||{}).value || '';
  const p4 = (document.getElementById('partnerPhone4')||{}).value || '';
  if (!name.trim()) { showNotification('نام شرکت الزامی است', 'error'); return; }
  const partners = readPartners();
  if (partners.some(p => (p.name||'').trim() === name.trim())){
    showNotification('این شرکت قبلاً ثبت شده است', 'error');
    return;
  }
  const nextId = partners.reduce((m,p)=> Math.max(m, p.id||0), 0) + 1;
  partners.push({ id: nextId, name: name.trim(), phones: [p1,p2,p3,p4].filter(Boolean).slice(0,4) });
  writePartners(partners);
  (document.getElementById('partnerForm')||{reset:()=>{}}).reset();
  renderPartnersTable();
  showNotification('شرکت همکار با موفقیت ذخیره شد', 'success');
  
  // Refresh stats
  refreshStats();
}

function renderPartnersTable(){
  const tbody = document.getElementById('partnersTableBody');
  if (!tbody) return;
  const partners = readPartners();
  tbody.innerHTML = '';
  partners.forEach((p, idx) => {
    const tr = document.createElement('tr');
    const phones = (p.phones||[]).join(' , ');
    tr.innerHTML = `
      <td>${idx+1}</td>
      <td>${p.name}</td>
      <td>${phones || '-'}</td>
      <td>
        <div class="partner-actions">
          <button class="btn-sm btn-edit-sm" onclick="editPartner(${p.id})">ویرایش</button>
          <button class="btn-sm btn-del-sm" onclick="deletePartner(${p.id})">حذف</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editPartner(id){
  const partners = readPartners();
  const p = partners.find(x => x.id === id);
  if (!p) return;
  (document.getElementById('partnerName')||{}).value = p.name || '';
  const [a,b,c,d] = p.phones||[];
  (document.getElementById('partnerPhone1')||{}).value = a||'';
  (document.getElementById('partnerPhone2')||{}).value = b||'';
  (document.getElementById('partnerPhone3')||{}).value = c||'';
  (document.getElementById('partnerPhone4')||{}).value = d||'';
  // حذف رکورد و منتظر submit برای ثبت مجدد به عنوان ویرایش ساده
  const next = partners.filter(x => x.id !== id);
  writePartners(next);
  renderPartnersTable();
  showNotification('اطلاعات برای ویرایش به فرم منتقل شد. پس از تغییر، ذخیره را بزنید.', 'info');
}

function deletePartner(id){
  if (!confirm('حذف این شرکت همکار انجام شود؟')) return;
  const partners = readPartners().filter(p => p.id !== id);
  writePartners(partners);
  renderPartnersTable();
  showNotification('شرکت همکار حذف شد', 'success');
  
  // Refresh stats
  refreshStats();
}

// Setup tabs functionality
function setupTabs() {
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetTab = button.getAttribute("data-tab");

      // Remove active class from all buttons and contents
      tabButtons.forEach(btn => btn.classList.remove("active"));
      tabContents.forEach(content => content.classList.remove("active"));

      // Add active class to clicked button and corresponding content
      button.classList.add("active");
      document.getElementById(`${targetTab}-tab`).classList.add("active");
    });
  });
}

// Load users table
function loadUsersTable() {
  const tbody = document.querySelector("#usersTableBody");
  tbody.innerHTML = "";

  // Reload users data from localStorage
  usersData = getUsersData();

  usersData.forEach((user, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td>${user.username}</td>
      <td>${user.fullName}</td>
      <td>${user.email}</td>
      <td><span class="role-badge ${user.role}">${roleTranslations[user.role]}</span></td>
      <td><span class="status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}">${statusTranslations[user.status]}</span></td>
      <td>${user.joinDate}</td>
      <td>${user.lastLogin}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-edit" onclick="editUser(${user.id})">
            <i class="fa-solid fa-edit"></i>
            ویرایش
          </button>
          <button class="btn-delete" onclick="deleteUser(${user.id})">
            <i class="fa-solid fa-trash"></i>
            حذف
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Add new user
function addUser() {
  const modal = document.getElementById("addUserModal");
  modal.classList.add("show");
  
  // Clear form
  document.getElementById("addUserForm").reset();
  
  // Focus on first input
  document.getElementById("newUsername").focus();
}

// Close add user modal
function closeAddUserModal() {
  const modal = document.getElementById("addUserModal");
  modal.classList.remove("show");
}

// Handle add user form submission
function handleAddUser(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const newUser = {
    id: usersData.length + 1,
    username: formData.get("username"),
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    role: formData.get("role"),
    status: formData.get("status"),
    joinDate: new Date().toLocaleDateString("fa-IR"),
    lastLogin: "هنوز وارد نشده"
  };

  // Validate form
  if (!validateUserForm(newUser, formData.get("confirmPassword"))) {
    return;
  }

  // Check if username already exists
  if (usersData.some(user => user.username === newUser.username)) {
    showNotification("نام کاربری قبلاً استفاده شده است", "error");
    return;
  }

  // Check if email already exists
  if (usersData.some(user => user.email === newUser.email)) {
    showNotification("ایمیل قبلاً استفاده شده است", "error");
    return;
  }

  // Add to users array
  usersData.push(newUser);
  
  // Save to localStorage
  saveUsersData(usersData);
  
  // Refresh table
  loadUsersTable();
  
  // Close modal
  closeAddUserModal();
  
  // Show success message
  showNotification("کاربر جدید با موفقیت اضافه شد!", "success");
  
  // Refresh stats
  refreshStats();
  
  // Log activity
  logActivity("create", `کاربر جدید "${newUser.fullName}" اضافه شد`);
}

// Validate user form
function validateUserForm(user, confirmPassword) {
  // Check required fields
  if (!user.username.trim()) {
    showNotification("نام کاربری الزامی است", "error");
    return false;
  }
  
  if (!user.fullName.trim()) {
    showNotification("نام کامل الزامی است", "error");
    return false;
  }
  
  if (!user.email.trim()) {
    showNotification("ایمیل الزامی است", "error");
    return false;
  }
  
  if (!user.role) {
    showNotification("نقش کاربر الزامی است", "error");
    return false;
  }
  
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(user.email)) {
    showNotification("فرمت ایمیل صحیح نیست", "error");
    return false;
  }
  
  // Validate phone format (Iranian mobile)
  if (user.phone && !/^09\d{9}$/.test(user.phone)) {
    showNotification("فرمت شماره تلفن صحیح نیست", "error");
    return false;
  }
  
  // Validate password
  const password = document.getElementById("newPassword").value;
  if (!password || password.length < 6) {
    showNotification("رمز عبور باید حداقل 6 کاراکتر باشد", "error");
    return false;
  }
  
  if (password !== confirmPassword) {
    showNotification("رمز عبور و تأیید رمز عبور مطابقت ندارند", "error");
    return false;
  }
  
  return true;
}

// Edit user
function editUser(id) {
  const user = usersData.find(u => u.id === id);
  if (user) {
    showNotification(`ویرایش کاربر: ${user.fullName}\n\nاین قابلیت در نسخه کامل پیاده‌سازی خواهد شد`, "info");
  }
}

// Delete user
function deleteUser(id) {
  const user = usersData.find(u => u.id === id);
  if (user) {
    if (confirm(`آیا مطمئن هستید که می‌خواهید کاربر "${user.fullName}" را حذف کنید؟`)) {
      const index = usersData.findIndex(u => u.id === id);
      usersData.splice(index, 1);
      
      // Save to localStorage
      saveUsersData(usersData);
      
      loadUsersTable();
      showNotification("کاربر با موفقیت حذف شد", "success");
      
      // Refresh stats
      refreshStats();
      
      // Log activity
      logActivity("delete", `کاربر "${user.fullName}" حذف شد`);
    }
  }
}

// Add new role
function addRole() {
  showNotification("افزودن نقش جدید\n\nاین قابلیت در نسخه کامل پیاده‌سازی خواهد شد", "info");
}

// Edit role
function editRole(roleType) {
  showNotification(`ویرایش نقش: ${roleTranslations[roleType]}\n\nاین قابلیت در نسخه کامل پیاده‌سازی خواهد شد`, "info");
}

// Save settings
function saveSettings() {
  showNotification("تنظیمات با موفقیت ذخیره شد!", "success");
  
  // Log activity
  logActivity("update", "تنظیمات سیستم تغییر کرد");
}

// Filter logs
function filterLogs() {
  const typeFilter = document.getElementById("logTypeFilter").value;
  const dateFilter = document.getElementById("logDateFilter").value;
  
  // In a real application, this would filter the logs
  showNotification("فیلتر اعمال شد", "info");
}

// Log activity
function logActivity(type, description) {
  // In a real application, this would save to server
  console.log(`Activity: ${type} - ${description}`);
}

// Logout function
function logout() {
  if (confirm("آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟")) {
    // showNotification("در حال خروج از سیستم...", "info");
    try { localStorage.removeItem('auth'); localStorage.removeItem('userProfile'); } catch {}
    showNotification("خروج انجام شد. در حال انتقال به صفحه ورود...", "info");
    setTimeout(() => {
      //   window.location.href = "navbar.html";
      // }, 1500);
      const marker = "/frontend/";
      const path = window.location.pathname;
      const idx = path.indexOf(marker);
      const base = idx !== -1 ? path.substring(0, idx + marker.length) : '';
      window.location.replace(base + 'Login Form/loginpanel.html');
      // دیگر ریدایرکت اجباری انجام نمی‌شود
    }, 600);
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

// =============================
// Provinces Management
// =============================
function setupProvinces() {
  const form = document.getElementById('provinceForm');
  if (form) {
    form.addEventListener('submit', handleProvinceSubmit);
  }
  renderProvincesTable();
  loadProvincesToDropdown();
}

function readProvinces() {
  try {
    const raw = localStorage.getItem('provinces');
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function writeProvinces(list) {
  try { localStorage.setItem('provinces', JSON.stringify(list)); } catch {}
}

function handleProvinceSubmit(e) {
  e.preventDefault();
  const name = (document.getElementById('provinceName') || {}).value || '';
  const code = (document.getElementById('provinceCode') || {}).value || '';
  const status = (document.getElementById('provinceStatus') || {}).value || 'active';
  const description = (document.getElementById('provinceDescription') || {}).value || '';
  
  if (!name.trim()) { 
    showNotification('نام استان الزامی است', 'error'); 
    return; 
  }
  
  const provinces = readProvinces();
  if (provinces.some(p => (p.name || '').trim() === name.trim())) {
    showNotification('این استان قبلاً ثبت شده است', 'error');
    return;
  }
  
  const nextId = provinces.reduce((m, p) => Math.max(m, p.id || 0), 0) + 1;
  provinces.push({ 
    id: nextId, 
    name: name.trim(), 
    code: code.trim(),
    status: status,
    description: description.trim(),
    cityCount: 0
  });
  
  writeProvinces(provinces);
  (document.getElementById('provinceForm') || { reset: () => {} }).reset();
  renderProvincesTable();
  loadProvincesToDropdown();
  showNotification('استان با موفقیت ذخیره شد', 'success');
}

function renderProvincesTable() {
  const tbody = document.getElementById('provincesTableBody');
  if (!tbody) return;
  const provinces = readProvinces();
  tbody.innerHTML = '';
  provinces.forEach((p, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${p.name}</td>
      <td>${p.code || '-'}</td>
      <td>${p.cityCount || 0}</td>
      <td><span class="status-badge ${p.status === 'active' ? 'status-active' : 'status-inactive'}">${p.status === 'active' ? 'فعال' : 'غیرفعال'}</span></td>
      <td>
        <div class="province-actions">
          <button class="btn-sm btn-edit-sm" onclick="editProvince(${p.id})">ویرایش</button>
          <button class="btn-sm btn-del-sm" onclick="deleteProvince(${p.id})">حذف</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editProvince(id) {
  const provinces = readProvinces();
  const province = provinces.find(p => p.id === id);
  if (!province) return;
  
  // Fill edit modal
  document.getElementById('editProvinceId').value = province.id;
  document.getElementById('editProvinceName').value = province.name || '';
  document.getElementById('editProvinceCode').value = province.code || '';
  document.getElementById('editProvinceStatus').value = province.status || 'active';
  document.getElementById('editProvinceDescription').value = province.description || '';
  
  // Show edit modal
  const modal = document.getElementById('editProvinceModal');
  modal.classList.add('show');
}

function deleteProvince(id) {
  const provinces = readProvinces();
  const province = provinces.find(p => p.id === id);
  if (!province) return;
  
  if (!confirm(`حذف استان "${province.name}" انجام شود؟`)) return;
  
  const updatedProvinces = provinces.filter(p => p.id !== id);
  writeProvinces(updatedProvinces);
  renderProvincesTable();
  loadProvincesToDropdown();
  showNotification('استان حذف شد', 'success');
}

function addProvince() {
  const modal = document.getElementById('addProvinceModal');
  modal.classList.add('show');
  
  // Clear form
  document.getElementById('addProvinceForm').reset();
  
  // Focus on first input
  document.getElementById('newProvinceName').focus();
}

function closeAddProvinceModal() {
  const modal = document.getElementById('addProvinceModal');
  modal.classList.remove('show');
}

function closeEditProvinceModal() {
  const modal = document.getElementById('editProvinceModal');
  modal.classList.remove('show');
}

function handleAddProvince(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const newProvince = {
    id: Date.now(),
    name: formData.get('provinceName'),
    code: formData.get('provinceCode'),
    status: formData.get('status'),
    description: formData.get('description'),
    cityCount: 0
  };
  
  // Validate form
  if (!newProvince.name.trim()) {
    showNotification('نام استان الزامی است', 'error');
    return;
  }
  
  const provinces = readProvinces();
  
  // Check if province already exists
  if (provinces.some(p => p.name.trim() === newProvince.name.trim())) {
    showNotification('این استان قبلاً ثبت شده است', 'error');
    return;
  }
  
  // Add to provinces array
  provinces.push(newProvince);
  writeProvinces(provinces);
  
  // Refresh table and dropdown
  renderProvincesTable();
  loadProvincesToDropdown();
  
  // Close modal
  closeAddProvinceModal();
  
  // Show success message
  showNotification('استان جدید با موفقیت اضافه شد!', 'success');
  
  // Log activity
  logActivity('create', `استان جدید "${newProvince.name}" اضافه شد`);
}

function handleEditProvince(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const provinceId = parseInt(formData.get('provinceId'));
  const updatedProvince = {
    id: provinceId,
    name: formData.get('provinceName'),
    code: formData.get('provinceCode'),
    status: formData.get('status'),
    description: formData.get('description')
  };
  
  // Validate form
  if (!updatedProvince.name.trim()) {
    showNotification('نام استان الزامی است', 'error');
    return;
  }
  
  const provinces = readProvinces();
  const provinceIndex = provinces.findIndex(p => p.id === provinceId);
  
  if (provinceIndex === -1) {
    showNotification('استان مورد نظر یافت نشد', 'error');
    return;
  }
  
  // Check if name already exists (excluding current province)
  if (provinces.some(p => p.id !== provinceId && p.name.trim() === updatedProvince.name.trim())) {
    showNotification('این نام استان قبلاً استفاده شده است', 'error');
    return;
  }
  
  // Preserve city count
  updatedProvince.cityCount = provinces[provinceIndex].cityCount || 0;
  
  // Update province
  provinces[provinceIndex] = updatedProvince;
  writeProvinces(provinces);
  
  // Refresh table and dropdown
  renderProvincesTable();
  loadProvincesToDropdown();
  
  // Close modal
  closeEditProvinceModal();
  
  // Show success message
  showNotification('استان با موفقیت ویرایش شد!', 'success');
  
  // Log activity
  logActivity('update', `استان "${updatedProvince.name}" ویرایش شد`);
}

function loadProvincesToDropdown() {
  const provinces = readProvinces().filter(p => p.status === 'active');
  
  // Update province dropdowns in city forms
  const cityProvinceSelects = [
    document.getElementById('cityProvince'),
    document.getElementById('newCityProvince'),
    document.getElementById('editCityProvince')
  ];
  
  cityProvinceSelects.forEach(select => {
    if (select) {
      const currentValue = select.value;
      select.innerHTML = '<option value="">انتخاب استان</option>';
      provinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        select.appendChild(option);
      });
      if (currentValue) select.value = currentValue;
    }
  });
  
  // Update province dropdown in billboards table
  const provinceSelect = document.getElementById('province');
  if (provinceSelect) {
    const currentValue = provinceSelect.value;
    provinceSelect.innerHTML = '<option value="">انتخاب استان</option>';
    provinces.forEach(province => {
      const option = document.createElement('option');
      option.value = province.name;
      option.textContent = province.name;
      provinceSelect.appendChild(option);
    });
    if (currentValue) provinceSelect.value = currentValue;
  }
}

// =============================
// Cities Management
// =============================
function setupCities() {
  const form = document.getElementById('cityForm');
  if (form) {
    form.addEventListener('submit', handleCitySubmit);
  }
  renderCitiesTable();
  loadCitiesToDropdown();
}

function readCities() {
  try {
    const raw = localStorage.getItem('cities');
    const arr = JSON.parse(raw || '[]');
    return Array.isArray(arr) ? arr : [];
  } catch { return []; }
}

function writeCities(list) {
  try { localStorage.setItem('cities', JSON.stringify(list)); } catch {}
}

function handleCitySubmit(e) {
  e.preventDefault();
  const name = (document.getElementById('cityName') || {}).value || '';
  const province = (document.getElementById('cityProvince') || {}).value || '';
  const code = (document.getElementById('cityCode') || {}).value || '';
  const description = (document.getElementById('cityDescription') || {}).value || '';
  
  if (!name.trim()) { 
    showNotification('نام شهر الزامی است', 'error'); 
    return; 
  }
  
  if (!province.trim()) { 
    showNotification('نام استان الزامی است', 'error'); 
    return; 
  }
  
  const cities = readCities();
  if (cities.some(c => (c.name || '').trim() === name.trim())) {
    showNotification('این شهر قبلاً ثبت شده است', 'error');
    return;
  }
  
  const nextId = cities.reduce((m, c) => Math.max(m, c.id || 0), 0) + 1;
  cities.push({ 
    id: nextId, 
    name: name.trim(), 
    province: province.trim(),
    code: code.trim(),
    description: description.trim(),
    status: 'active',
    billboardCount: 0
  });
  
  writeCities(cities);
  (document.getElementById('cityForm') || { reset: () => {} }).reset();
  renderCitiesTable();
  loadCitiesToDropdown();
  showNotification('شهر با موفقیت ذخیره شد', 'success');
}

function renderCitiesTable() {
  const tbody = document.getElementById('citiesTableBody');
  if (!tbody) return;
  const cities = readCities();
  tbody.innerHTML = '';
  cities.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td>${c.name}</td>
      <td>${c.province}</td>
      <td>${c.code || '-'}</td>
      <td>${c.billboardCount || 0}</td>
      <td>
        <div class="city-actions">
          <button class="btn-sm btn-edit-sm" onclick="editCity(${c.id})">ویرایش</button>
          <button class="btn-sm btn-del-sm" onclick="deleteCity(${c.id})">حذف</button>
        </div>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

function editCity(id) {
  const cities = readCities();
  const city = cities.find(c => c.id === id);
  if (!city) return;
  
  // Fill edit modal
  document.getElementById('editCityId').value = city.id;
  document.getElementById('editCityName').value = city.name || '';
  document.getElementById('editCityProvince').value = city.province || '';
  document.getElementById('editCityCode').value = city.code || '';
  document.getElementById('editCityStatus').value = city.status || 'active';
  document.getElementById('editCityDescription').value = city.description || '';
  
  // Show edit modal
  const modal = document.getElementById('editCityModal');
  modal.classList.add('show');
}

function deleteCity(id) {
  const cities = readCities();
  const city = cities.find(c => c.id === id);
  if (!city) return;
  
  if (!confirm(`حذف شهر "${city.name}" انجام شود؟`)) return;
  
  const updatedCities = cities.filter(c => c.id !== id);
  writeCities(updatedCities);
  
  // Remove city page from localStorage
  const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
  const cityPages = JSON.parse(localStorage.getItem('cityPages') || '{}');
  delete cityPages[citySlug];
  localStorage.setItem('cityPages', JSON.stringify(cityPages));
  
  // Remove city page
  if (window.cityPageManager) {
    window.cityPageManager.removeCityPage(city.name);
  } else {
    removePhysicalCityPage(citySlug);
  }
  
  renderCitiesTable();
  loadCitiesToDropdown();
  showNotification('شهر و صفحه مربوطه حذف شد', 'success');
  
  // Refresh stats
  refreshStats();
}

// Function to remove physical city page
function removePhysicalCityPage(citySlug) {
  try {
    // Note: Due to browser security restrictions, we cannot directly delete files
    // from the file system. This is a limitation of web browsers.
    // The user will need to manually delete the file from the city list folder.
    console.log(`Please manually delete: city list/${citySlug}.html`);
    showNotification(`لطفاً فایل city list/${citySlug}.html را به صورت دستی حذف کنید`, 'info');
  } catch (error) {
    console.log('Error removing physical city page:', error);
  }
}

function addCity() {
  const modal = document.getElementById('addCityModal');
  modal.classList.add('show');
  
  // Clear form
  document.getElementById('addCityForm').reset();
  
  // Focus on first input
  document.getElementById('newCityName').focus();
}

function closeAddCityModal() {
  const modal = document.getElementById('addCityModal');
  modal.classList.remove('show');
}

function closeEditCityModal() {
  const modal = document.getElementById('editCityModal');
  modal.classList.remove('show');
}

function handleAddCity(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const newCity = {
    id: Date.now(), // Simple ID generation
    name: formData.get('cityName'),
    province: formData.get('cityProvince'),
    code: formData.get('cityCode'),
    status: formData.get('status'),
    description: formData.get('description'),
    billboardCount: 0
  };
  
  // Validate form
  if (!newCity.name.trim()) {
    showNotification('نام شهر الزامی است', 'error');
    return;
  }
  
  if (!newCity.province.trim()) {
    showNotification('نام استان الزامی است', 'error');
    return;
  }
  
  const cities = readCities();
  
  // Check if city already exists
  if (cities.some(c => c.name.trim() === newCity.name.trim())) {
    showNotification('این شهر قبلاً ثبت شده است', 'error');
    return;
  }
  
  // Add to cities array
  cities.push(newCity);
  writeCities(cities);
  
  // Create city page dynamically
  if (window.cityPageManager) {
    window.cityPageManager.createCityPage(newCity.name);
  } else {
    createCityPage(newCity.name);
  }
  
  // Refresh table and dropdown
  renderCitiesTable();
  loadCitiesToDropdown();
  
  // Close modal
  closeAddCityModal();
  
  // Show success message
  showNotification('شهر جدید با موفقیت اضافه شد!', 'success');
  
  // Refresh stats
  refreshStats();
  
  // Log activity
  logActivity('create', `شهر جدید "${newCity.name}" اضافه شد`);
}

function handleEditCity(e) {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const cityId = parseInt(formData.get('cityId'));
  const updatedCity = {
    id: cityId,
    name: formData.get('cityName'),
    province: formData.get('cityProvince'),
    code: formData.get('cityCode'),
    status: formData.get('status'),
    description: formData.get('description')
  };
  
  // Validate form
  if (!updatedCity.name.trim()) {
    showNotification('نام شهر الزامی است', 'error');
    return;
  }
  
  if (!updatedCity.province.trim()) {
    showNotification('نام استان الزامی است', 'error');
    return;
  }
  
  const cities = readCities();
  const cityIndex = cities.findIndex(c => c.id === cityId);
  
  if (cityIndex === -1) {
    showNotification('شهر مورد نظر یافت نشد', 'error');
    return;
  }
  
  // Check if name already exists (excluding current city)
  if (cities.some(c => c.id !== cityId && c.name.trim() === updatedCity.name.trim())) {
    showNotification('این نام شهر قبلاً استفاده شده است', 'error');
    return;
  }
  
  // Preserve billboard count
  updatedCity.billboardCount = cities[cityIndex].billboardCount || 0;
  
  // Update city
  cities[cityIndex] = updatedCity;
  writeCities(cities);
  
  // Refresh table and dropdown
  renderCitiesTable();
  loadCitiesToDropdown();
  
  // Close modal
  closeEditCityModal();
  
  // Show success message
  showNotification('شهر با موفقیت ویرایش شد!', 'success');
  
  // Log activity
  logActivity('update', `شهر "${updatedCity.name}" ویرایش شد`);
}

function loadCitiesToDropdown(selectedProvince = null) {
  const cities = readCities().filter(c => c.status === 'active');
  
  // Filter cities by province if specified
  let filteredCities = cities;
  if (selectedProvince) {
    filteredCities = cities.filter(c => c.province === selectedProvince);
  }
  
  // Update city dropdown in billboards table
  const citySelect = document.getElementById('city');
  if (citySelect) {
    const currentValue = citySelect.value;
    citySelect.innerHTML = '<option value="">انتخاب شهر</option>';
    filteredCities.forEach(city => {
      const option = document.createElement('option');
      option.value = city.name;
      option.textContent = city.name;
      citySelect.appendChild(option);
    });
    if (currentValue && filteredCities.some(c => c.name === currentValue)) {
      citySelect.value = currentValue;
    } else {
      citySelect.value = '';
    }
  }
  
  // Update city dropdowns in navbar (show all cities)
  updateNavbarCityDropdowns(cities);
}

// Function to filter cities based on selected province
function filterCitiesByProvince(provinceName) {
  loadCitiesToDropdown(provinceName);
}

function updateNavbarCityDropdowns(cities) {
  // Update desktop navbar dropdown
  const desktopDropdown = document.querySelector('.nav-right .dropdown-content');
  if (desktopDropdown) {
    desktopDropdown.innerHTML = '';
    cities.forEach(city => {
      const link = document.createElement('a');
      link.href = `../city list/${city.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      link.textContent = city.name;
      desktopDropdown.appendChild(link);
    });
  }
  
  // Update mobile navbar dropdown
  const mobileDropdown = document.querySelector('.mobile-links .dropdown-content');
  if (mobileDropdown) {
    mobileDropdown.innerHTML = '';
    cities.forEach(city => {
      const link = document.createElement('a');
      link.href = `../city list/${city.name.toLowerCase().replace(/\s+/g, '-')}.html`;
      link.textContent = city.name;
      mobileDropdown.appendChild(link);
    });
  }
}

// Function to create city page dynamically
function createCityPage(cityName) {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const cityPageContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>بیلبوردهای شهر ${cityName}</title>
	<link rel="stylesheet" href="../shared/style.css"/>
	<link rel="stylesheet" href="../shared/main.css"/>
	<link rel="stylesheet" href="city-style.css"/>
</head>
<body data-city="${cityName}">
	<header class="city-header">
		<div class="container">
			<h1 id="cityTitle">بیلبوردهای شهر ${cityName}</h1>
			<a class="back-link" href="../navbar.html">بازگشت به صفحه اصلی</a>
		</div>
	</header>
	<main class="container city-page">
		<section class="city-summary">
			<div class="meta">
				<span>تعداد بیلبوردها: <strong id="billboardCount">0</strong></span>
			</div>
		</section>
		<section class="cards-grid" id="cardsGrid"></section>
	</main>
	<script src="city-script.js"></script>
</body>
</html>`;
  
  // Store the page content in localStorage for dynamic loading
  const cityPages = JSON.parse(localStorage.getItem('cityPages') || '{}');
  cityPages[citySlug] = cityPageContent;
  localStorage.setItem('cityPages', JSON.stringify(cityPages));
  
  // Create physical HTML file using File API
  createPhysicalCityPage(citySlug, cityPageContent);
  
  return cityPageContent;
}

// Function to create physical HTML file
function createPhysicalCityPage(citySlug, content) {
  try {
    // Create a blob with the HTML content
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link to download the file
    const link = document.createElement('a');
    link.href = url;
    link.download = `${citySlug}.html`;
    link.style.display = 'none';
    
    // Add to page, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Clean up the URL object
    URL.revokeObjectURL(url);
    
    console.log(`Physical city page created: ${citySlug}.html`);
  } catch (error) {
    console.log('Error creating physical city page:', error);
    // Fallback: just store in localStorage
    showNotification('صفحه شهر در localStorage ذخیره شد. برای ایجاد فایل فیزیکی، از پنل مدیریت استفاده کنید.', 'info');
  }
}

// Function to get or create city page
function getCityPage(cityName) {
  const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
  const cityPages = JSON.parse(localStorage.getItem('cityPages') || '{}');
  
  if (cityPages[citySlug]) {
    return cityPages[citySlug];
  } else {
    return createCityPage(cityName);
  }
}

// Function to download all city pages
function downloadAllCityPages() {
  if (window.cityPageManager) {
    window.cityPageManager.downloadAllCityPages();
  } else {
    showNotification('سیستم مدیریت صفحات شهر در دسترس نیست', 'error');
  }
}

// Real-time Statistics Functions
function loadRealTimeStats() {
  try {
    // Load users data
    const users = getUsersData(); // Use the function to get users data
    const activeUsers = users.filter(user => user.status === 'active');
    const admins = users.filter(user => user.role === 'admin');
    
    // Load billboards data
    const billboards = JSON.parse(localStorage.getItem('billboardsData') || '[]');
    const totalBillboards = billboards.length;
    const activeBillboards = billboards.filter(b => !b.isInactive).length;
    const reservedBillboards = billboards.filter(b => b.isReserved).length;
    
    // Calculate usage rate
    const usageRate = totalBillboards > 0 ? Math.round((reservedBillboards / totalBillboards) * 100) : 0;
    
    // Update UI
    updateStatElement('activeUsersCount', activeUsers.length);
    updateStatElement('adminsCount', admins.length);
    updateStatElement('totalBillboardsCount', totalBillboards);
    updateStatElement('usageRate', `${usageRate}%`);
    
    console.log('Real-time stats loaded:', {
      activeUsers: activeUsers.length,
      admins: admins.length,
      totalBillboards,
      usageRate: `${usageRate}%`
    });
    
  } catch (error) {
    console.error('Error loading real-time stats:', error);
    // Set default values
    updateStatElement('activeUsersCount', 0);
    updateStatElement('adminsCount', 0);
    updateStatElement('totalBillboardsCount', 0);
    updateStatElement('usageRate', '0%');
  }
}

// Update individual stat element
function updateStatElement(elementId, value) {
  const element = document.getElementById(elementId);
  if (element) {
    element.textContent = value;
  }
}

// Enhanced stats with more details
function loadDetailedStats() {
  try {
    // Load all data
    const users = getUsersData(); // Use the function to get users data
    const billboards = JSON.parse(localStorage.getItem('billboardsData') || '[]');
    const partners = JSON.parse(localStorage.getItem('partners') || '[]');
    const cities = JSON.parse(localStorage.getItem('cities') || '[]');
    
    // Calculate detailed statistics
    const stats = {
      // User stats
      totalUsers: users.length,
      activeUsers: users.filter(u => u.status === 'active').length,
      inactiveUsers: users.filter(u => u.status === 'inactive').length,
      admins: users.filter(u => u.role === 'admin').length,
      managers: users.filter(u => u.role === 'manager').length,
      regularUsers: users.filter(u => u.role === 'user').length,
      
      // Billboard stats
      totalBillboards: billboards.length,
      activeBillboards: billboards.filter(b => !b.isInactive).length,
      inactiveBillboards: billboards.filter(b => b.isInactive).length,
      reservedBillboards: billboards.filter(b => b.isReserved).length,
      emptyBillboards: billboards.filter(b => b.isEmpty).length,
      culturalBillboards: billboards.filter(b => b.isCultural).length,
      broadcastingBillboards: billboards.filter(b => b.isBroadcasting).length,
      
      // Other stats
      totalPartners: partners.length,
      totalCities: cities.filter(c => c.status === 'active').length,
      
      // Usage rate
      usageRate: billboards.length > 0 ? 
        Math.round((billboards.filter(b => b.isReserved).length / billboards.length) * 100) : 0
    };
    
    // Update main stats
    updateStatElement('activeUsersCount', stats.activeUsers);
    updateStatElement('adminsCount', stats.admins);
    updateStatElement('totalBillboardsCount', stats.totalBillboards);
    updateStatElement('usageRate', `${stats.usageRate}%`);
    
    // Log detailed stats for debugging
    console.log('Detailed stats loaded:', stats);
    
    return stats;
    
  } catch (error) {
    console.error('Error loading detailed stats:', error);
    return null;
  }
}

// Refresh stats when data changes
function refreshStats() {
  loadDetailedStats();
}

// Auto-refresh stats every 30 seconds
function startStatsAutoRefresh() {
  setInterval(refreshStats, 30000);
}

