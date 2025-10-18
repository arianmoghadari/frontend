// Sample data for billboards table
const billboardsData = [
  // {
  //   id: 1,
  //   billboardCode: "BB-001",
  //   province: "تهران",
  //   region: "منطقه 1",
  //   position: "میدان آزادی، خیابان آزادی",
  //   viewAngle: "45 درجه",
  //   length: 6,
  //   width: 3,
  //   squareMeter: 18,
  //   isInactive: false,
  //   isEmpty: false,
  //   isCultural: false,
  //   isBroadcasting: true,
  //   isReserved: false,
  //   broadcastStartDate: "2024-01-01",
  //   broadcastEndDate: "2024-01-31",
  //   broadcastDuration: 30,
  //   broadcastBy: "شرکت تبلیغاتی آفتاب",
  //   extension: false,
  //   nextReservedBy: "",
  //   description: "تابلو دیجیتال در میدان آزادی"
  // },
  // {
  //   id: 2,
  //   billboardCode: "BB-002",
  //   province: "تهران",
  //   region: "منطقه 2",
  //   position: "پارک شهر، خیابان ولیعصر",
  //   viewAngle: "60 درجه",
  //   length: 4,
  //   width: 2,
  //   squareMeter: 8,
  //   isInactive: false,
  //   isEmpty: false,
  //   isCultural: true,
  //   isBroadcasting: false,
  //   isReserved: true,
  //   broadcastStartDate: "",
  //   broadcastEndDate: "",
  //   broadcastDuration: 0,
  //   broadcastBy: "",
  //   extension: false,
  //   nextReservedBy: "شرکت فرهنگی هنری",
  //   description: "تابلو سنتی برای طرح فرهنگی"
  // },
  // {
  //   id: 3,
  //   billboardCode: "BB-003",
  //   province: "اصفهان",
  //   region: "منطقه مرکزی",
  //   position: "میدان نقش جهان",
  //   viewAngle: "90 درجه",
  //   length: 5,
  //   width: 2.5,
  //   squareMeter: 12.5,
  //   isInactive: false,
  //   isEmpty: true,
  //   isCultural: false,
  //   isBroadcasting: false,
  //   isReserved: false,
  //   broadcastStartDate: "",
  //   broadcastEndDate: "",
  //   broadcastDuration: 0,
  //   broadcastBy: "",
  //   extension: false,
  //   nextReservedBy: "",
  //   description: "تابلو دیجیتال در میدان نقش جهان"
  // },
  // {
  //   id: 4,
  //   billboardCode: "BB-004",
  //   province: "اصفهان",
  //   region: "منطقه تاریخی",
  //   position: "خیابان چهارباغ عباسی",
  //   viewAngle: "30 درجه",
  //   length: 3,
  //   width: 2,
  //   squareMeter: 6,
  //   isInactive: true,
  //   isEmpty: false,
  //   isCultural: false,
  //   isBroadcasting: false,
  //   isReserved: false,
  //   broadcastStartDate: "",
  //   broadcastEndDate: "",
  //   broadcastDuration: 0,
  //   broadcastBy: "",
  //   extension: false,
  //   nextReservedBy: "",
  //   description: "تابلو سنتی در حال تعمیرات"
  // },
  // {
  //   id: 5,
  //   billboardCode: "BB-005",
  //   province: "فارس",
  //   region: "منطقه مرکزی",
  //   position: "میدان شهدا",
  //   viewAngle: "45 درجه",
  //   length: 4,
  //   width: 3,
  //   squareMeter: 12,
  //   isInactive: false,
  //   isEmpty: true,
  //   isCultural: false,
  //   isBroadcasting: false,
  //   isReserved: false,
  //   broadcastStartDate: "",
  //   broadcastEndDate: "",
  //   broadcastDuration: 0,
  //   broadcastBy: "",
  //   extension: false,
  //   nextReservedBy: "",
  //   description: "تابلو دیجیتال در میدان شهدا"
  // }
];

// Status translations
const statusTranslations = {
  available: "موجود",
  reserved: "رزرو شده",
  maintenance: "تعمیرات"
};

// City translations
const cityTranslations = {
  tehran: "تهران",
  isfahan: "اصفهان",
  shiraz: "شیراز",
  mashhad: "مشهد",
  tabriz: "تبریز"
};

// Pagination state
let currentPage = 1;
const pageSize = 20;
let currentDataRef = [];

// Initialize table when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  // Load from localStorage and merge with defaults
  const stored = JSON.parse(localStorage.getItem("billboardsData") || "[]");
  if (Array.isArray(stored) && stored.length) {
    // ensure ids do not collide
    const maxId = billboardsData.reduce((m, b) => Math.max(m, b.id), 0);
    const normalized = stored.map((b, idx) => ({ ...b, id: b.id || maxId + idx + 1 }));
    billboardsData.push(...normalized);
  }
  currentDataRef = billboardsData;
  populateTable(currentDataRef);
  setupEventListeners();
  try { populateOwnershipOptions(); } catch {}
  try { loadProvincesToDropdown(); } catch {}
  try { loadCitiesToDropdown(); } catch {}
  try { createCityPages(); } catch {}
  
  // Load ownership filter options
  loadOwnershipFilterOptions();
  
  // Load city filter options
  loadCityFilterOptions();
  
  // Setup filter event listeners
  setupFilterEventListeners();
  
  // تشخیص صفحه فعلی و تغییر دکمه ناوبری
  updateNavigationButton();
});

// Modal/edit state
let isEditMode = false;
let editingBillboardId = null;

function setModalMode(mode){
  isEditMode = mode === 'edit';
  const titleEl = document.querySelector('.modal-title-section h2');
  const saveBtn = document.querySelector('.btn-save');
  if (titleEl){ titleEl.innerHTML = isEditMode ? '<i class="fa-solid fa-edit"></i> ویرایش تابلو' : '<i class="fa-solid fa-plus"></i> افزودن تابلو جدید'; }
  if (saveBtn){ saveBtn.innerHTML = isEditMode ? '<i class="fa-solid fa-save"></i> ذخیره تغییرات' : '<i class="fa-solid fa-save"></i> ذخیره تابلو'; }
}

// Populate ownership select from partners list
function populateOwnershipOptions(){
  const select = document.getElementById('ownership');
  if (!select) return;
  const partners = JSON.parse(localStorage.getItem('partners')||'[]');
  if (!Array.isArray(partners)) return;
  // reset options (keep first placeholder)
  select.innerHTML = '<option value="">انتخاب شرکت</option>' +
    partners.map(p => `<option value="${(p.name||'').replace(/"/g,'&quot;')}">${p.name||''}</option>`).join('');
}

// Populate table with data
function populateTable(data) {
  const tbody = document.querySelector("#billboardsTable tbody");
  tbody.innerHTML = "";

  const totalItems = data.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;
  const sliceStart = (currentPage - 1) * pageSize;
  const sliceEnd = Math.min(sliceStart + pageSize, totalItems);

  const pageSlice = data.slice(sliceStart, sliceEnd);

  pageSlice.forEach((billboard, i) => {
    const row = document.createElement("tr");
    const remainingDays = calculateRemainingDays(billboard.broadcastEndDate);
    row.innerHTML = `
      <td>${sliceStart + i + 1}</td>
      <td>${billboard.billboardCode}</td>
      <td>${billboard.province}</td>
      <td>${billboard.city || '-'}</td>
      <td>${billboard.region}</td>
      <td>${billboard.position}</td>
      <td>${billboard.viewAngle || '-'}</td>
      <td>${billboard.structureType || '-'}</td>
      <td>${billboard.length}</td>
      <td>${billboard.width}</td>
      <td>${billboard.squareMeter}</td>
      <td>${billboard.ownership || '-'}</td>
      <td><span class="status-badge ${billboard.isInactive ? 'status-inactive' : 'status-active'}">${billboard.isInactive ? 'غیرفعال' : 'فعال'}</span></td>
      <td><span class="status-badge ${billboard.isEmpty ? 'status-empty' : 'status-full'}">${billboard.isEmpty ? 'خالی' : 'پر'}</span></td>
      <td><span class="status-badge ${billboard.isCultural ? 'status-cultural' : 'status-normal'}">${billboard.isCultural ? 'بله' : 'خیر'}</span></td>
      <td><span class="status-badge ${billboard.isBroadcasting ? 'status-broadcasting' : 'status-normal'}">${billboard.isBroadcasting ? 'بله' : 'خیر'}</span></td>
      <td><span class="status-badge ${billboard.isReserved ? 'status-reserved' : 'status-normal'}">${billboard.isReserved ? 'بله' : 'خیر'}</span></td>
      <td>${billboard.broadcastStartDate || '-'}</td>
      <td>${billboard.broadcastEndDate || '-'}</td>
      <td>${billboard.broadcastDuration || '-'}</td>
      <td>${remainingDays}</td>
      <td>${billboard.broadcastBy || '-'}</td>
      <td><span class="status-badge ${billboard.extension ? 'status-extension' : 'status-normal'}">${billboard.extension ? 'بله' : 'خیر'}</span></td>
      <td>${billboard.nextReservedBy || '-'}</td>
      <td>
        <div class="action-buttons">
          <button class="btn-view" onclick="viewBillboard(${billboard.id})">
            <i class="fa-solid fa-eye"></i>
            مشاهده
          </button>
          <button class="btn-edit" onclick="editBillboard(${billboard.id})">
            <i class="fa-solid fa-edit"></i>
            ویرایش
          </button>
          <button class="btn-delete" onclick="deleteBillboard(${billboard.id})">
            <i class="fa-solid fa-trash"></i>
            حذف
          </button>
        </div>
      </td>
    `;
    tbody.appendChild(row);
  });

  renderPagination(totalItems);
}

// Setup event listeners
function setupEventListeners() {
  // Filter button
  const filterBtn = document.querySelector(".filter-btn");
  filterBtn.addEventListener("click", applyFilters);

  // Search input
  const searchInput = document.querySelector("#searchInput");
  searchInput.addEventListener("input", debounce(applyFilters, 300));

  // Filter selects
  const provinceFilter = document.querySelector("#provinceFilter");
  const statusFilter = document.querySelector("#statusFilter");
  const cityFilter = document.querySelector("#cityFilter");
  
  provinceFilter.addEventListener("change", applyFilters);
  statusFilter.addEventListener("change", applyFilters);
  cityFilter.addEventListener("change", applyFilters);

  // Export button
  const exportBtn = document.querySelector(".export-btn");
  exportBtn.addEventListener("click", exportToExcel);

  // Export PDF button
  const exportPdfBtn = document.querySelector(".export-pdf-btn");
  if (exportPdfBtn) {
    exportPdfBtn.addEventListener("click", exportToPDF);
  }

  // Add button
  const addBtn = document.querySelector(".add-btn");
  addBtn.addEventListener("click", addBillboard);

  // Modal event listeners
  setupModalEvents();

  // Pagination
  setupPagination();
}

// Apply filters
function applyFilters() {
  const provinceFilter = document.querySelector("#provinceFilter").value;
  const statusFilter = document.querySelector("#statusFilter").value;
  const cityFilter = document.querySelector("#cityFilter").value;
  const searchInput = document.querySelector("#searchInput").value.toLowerCase();

  let filteredData = billboardsData.filter(billboard => {
    const matchesProvince = !provinceFilter || billboard.province === provinceFilter;
    const matchesCity = !cityFilter || billboard.city === cityFilter;
    
    let matchesStatus = true;
    if (statusFilter) {
      switch(statusFilter) {
        case "empty":
          matchesStatus = billboard.isEmpty;
          break;
        case "cultural":
          matchesStatus = billboard.isCultural;
          break;
        case "broadcasting":
          matchesStatus = billboard.isBroadcasting;
          break;
        case "reserved":
          matchesStatus = billboard.isReserved;
          break;
        case "inactive":
          matchesStatus = billboard.isInactive;
          break;
      }
    }
    
    const matchesSearch = !searchInput || 
      billboard.billboardCode.toLowerCase().includes(searchInput) ||
      billboard.province.toLowerCase().includes(searchInput) ||
      billboard.city.toLowerCase().includes(searchInput) ||
      billboard.region.toLowerCase().includes(searchInput) ||
      billboard.position.toLowerCase().includes(searchInput);

    return matchesProvince && matchesCity && matchesStatus && matchesSearch;
  });

  currentDataRef = filteredData;
  currentPage = 1;
  populateTable(currentDataRef);
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export to Excel using SheetJS
function exportToExcel() {
  try {
    // Get current filtered data
    const dataToExport = currentDataRef || billboardsData;
    
    if (dataToExport.length === 0) {
      showNotification("هیچ داده‌ای برای خروجی وجود ندارد", "error");
      return;
    }

    // Prepare data for Excel
    const excelData = dataToExport.map((billboard, index) => ({
      'ردیف': index + 1,
      'کد تابلو': billboard.billboardCode || '',
      'استان': billboard.province || '',
      'شهر': billboard.city || '',
      'منطقه': billboard.region || '',
      'موقعیت تابلو': billboard.position || '',
      'زاویه دید تابلو': billboard.viewAngle || '',
      'نوع سازه تابلو': billboard.structureType || '',
      'طول (متر)': billboard.length || '',
      'عرض (متر)': billboard.width || '',
      'مترمربع': billboard.squareMeter || '',
      'مالکیت': billboard.ownership || '',
      'غیرفعال بودن': billboard.isInactive ? 'بله' : 'خیر',
      'تابلوهای خالی': billboard.isEmpty ? 'بله' : 'خیر',
      'طرح فرهنگی': billboard.isCultural ? 'بله' : 'خیر',
      'اکران شده ها': billboard.isBroadcasting ? 'بله' : 'خیر',
      'رزرو شده‌ها': billboard.isReserved ? 'بله' : 'خیر',
      'تاریخ شروع اکران': billboard.broadcastStartDate || '',
      'تاریخ پایان اکران': billboard.broadcastEndDate || '',
      'مدت زمان اکران (روز)': billboard.broadcastDuration || '',
      'تعداد روز های باقیمانده از رزرو': calculateRemainingDays(billboard.broadcastEndDate),
      'اکران شده توسط': billboard.broadcastBy || '',
      'تمدید اکران': billboard.extension ? 'بله' : 'خیر',
      'رزرو شده بعدی توسط': billboard.nextReservedBy || '',
      'توضیحات': billboard.description || ''
    }));

    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);

    // Set column widths
    const colWidths = [
      { wch: 8 },   // ردیف
      { wch: 15 },  // کد تابلو
      { wch: 12 },  // استان
      { wch: 12 },  // شهر
      { wch: 15 },  // منطقه
      { wch: 25 },  // موقعیت تابلو
      { wch: 15 },  // زاویه دید
      { wch: 20 },  // نوع سازه
      { wch: 10 },  // طول
      { wch: 10 },  // عرض
      { wch: 12 },  // مترمربع
      { wch: 20 },  // مالکیت
      { wch: 15 },  // غیرفعال
      { wch: 15 },  // خالی
      { wch: 15 },  // فرهنگی
      { wch: 15 },  // اکران شده
      { wch: 15 },  // رزرو شده
      { wch: 18 },  // تاریخ شروع
      { wch: 18 },  // تاریخ پایان
      { wch: 15 },  // مدت اکران
      { wch: 20 },  // روزهای باقیمانده
      { wch: 20 },  // اکران شده توسط
      { wch: 15 },  // تمدید
      { wch: 20 },  // رزرو بعدی
      { wch: 30 }   // توضیحات
    ];
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'تابلوهای تبلیغاتی');

    // Generate filename with current date
    const now = new Date();
    const dateStr = now.toLocaleDateString('fa-IR').replace(/\//g, '-');
    const timeStr = now.toLocaleTimeString('fa-IR', { hour12: false }).replace(/:/g, '-');
    const filename = `تابلوهای_تبلیغاتی_${dateStr}_${timeStr}.xlsx`;

    // Export file
    XLSX.writeFile(wb, filename);
    
    showNotification(`فایل Excel با موفقیت دانلود شد: ${filename}`, "success");
    
  } catch (error) {
    console.error('Error exporting to Excel:', error);
    showNotification("خطا در ایجاد فایل Excel", "error");
  }
}

// Export to PDF (print-friendly)
function exportToPDF() {
  try {
    const table = document.getElementById("billboardsTable");
    if (!table) { alert("جدول یافت نشد"); return; }

    // Clone table and remove operations column (last column)
    const cleanTable = table.cloneNode(true);
    const headRow = cleanTable.querySelector('thead tr');
    if (headRow && headRow.lastElementChild) {
      headRow.removeChild(headRow.lastElementChild);
    }
    cleanTable.querySelectorAll('tbody tr').forEach(tr => {
      if (tr.lastElementChild) tr.removeChild(tr.lastElementChild);
    });

    // Build a clean HTML document for printing
    const printStyles = `
      <style>
        body { direction: rtl; font-family: calibri, tahoma, sans-serif; color: #111; }
        h1 { text-align:center; margin: 0 0 16px; font-size: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 11px; }
        th, td { border: 1px solid #ccc; padding: 6px; text-align: center; }
        thead th { background: #f1f5f9; }
        @page { size: A4 landscape; margin: 12mm; }
      </style>
    `;
    const now = new Date().toLocaleString('fa-IR');
    const html = `
      <html lang="fa" dir="rtl">
        <head>
          <meta charset="utf-8"/>
          <title>خروجی PDF - جدول تابلوها</title>
          ${printStyles}
        </head>
        <body>
          <h1>لیست تابلوهای تبلیغاتی</h1>
          <div style="margin-bottom:8px;text-align:left;font-size:10px;">تاریخ: ${now}</div>
          ${cleanTable.outerHTML}
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) { alert('برای ایجاد PDF اجازه پاپ‌آپ را فعال کنید'); return; }
    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    // Give it a moment to render before printing
    setTimeout(() => { printWindow.print(); }, 300);
  } catch (e) {
    alert('خطا در ساخت PDF');
  }
}

// Add new billboard
function addBillboard() {
  const modal = document.getElementById("addBillboardModal");
  modal.classList.add("show");
  
  // Clear form
  clearForm();
  setModalMode('add');
  editingBillboardId = null;
  
  // Focus on first input
  document.getElementById("billboardCode").focus();
  
  // Setup auto calculations
  setupAutoCalculations();
}

// View billboard details
function viewBillboard(id) {
  const billboard = billboardsData.find(b => b.id === id);
  if (billboard) {
    alert(`مشاهده جزئیات تابلو:\n\nشناسه: ${billboard.billboardId}\nنام: ${billboard.name}\nشهر: ${billboard.city}\nمحل: ${billboard.location}\nابعاد: ${billboard.dimensions}\nنوع: ${billboard.type}\nوضعیت: ${statusTranslations[billboard.status]}\nقیمت روزانه: ${billboard.dailyPrice} تومان`);
  }
}

// Edit billboard
function editBillboard(id) {
  const b = billboardsData.find(bb => bb.id === id);
  if (!b) return;
  const modal = document.getElementById("addBillboardModal");
  clearForm();
  setModalMode('edit');
  editingBillboardId = id;
  // Prefill fields
  const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val ?? ''; };
  setVal('billboardCode', b.billboardCode);
  setVal('province', b.province);
  setVal('city', b.city);
  setVal('region', b.region);
  setVal('position', b.position);
  setVal('viewAngle', b.viewAngle);
  setVal('structureType', b.structureType);
  setVal('length', b.length);
  setVal('width', b.width);
  setVal('squareMeter', b.squareMeter);
  // مالکیت: اگر select موجود باشد، مقدار را ست می‌کنیم
  const ownershipEl = document.getElementById('ownership');
  if (ownershipEl){
    try { populateOwnershipOptions(); } catch {}
    ownershipEl.value = b.ownership || '';
  }
  setVal('isInactive', String(Boolean(b.isInactive)));
  setVal('isEmpty', String(Boolean(b.isEmpty)));
  setVal('isCultural', String(Boolean(b.isCultural)));
  setVal('isBroadcasting', String(Boolean(b.isBroadcasting)));
  setVal('isReserved', String(Boolean(b.isReserved)));
  setVal('broadcastStartDate', b.broadcastStartDate);
  setVal('broadcastEndDate', b.broadcastEndDate);
  setVal('broadcastDuration', b.broadcastDuration);
  setVal('broadcastBy', b.broadcastBy);
  setVal('extension', String(Boolean(b.extension)));
  setVal('nextReservedBy', b.nextReservedBy);
  setVal('description', b.description);
  // price only if productCard exists
  if (b.productCard) setVal('productPrice', b.productCard.priceNumber || '');
  modal.classList.add('show');
}

// Delete billboard
function deleteBillboard(id) {
  const billboard = billboardsData.find(b => b.id === id);
  if (billboard) {
    if (confirm(`آیا مطمئن هستید که می‌خواهید تابلو "${billboard.name}" را حذف کنید؟`)) {
      const index = billboardsData.findIndex(b => b.id === id);
      billboardsData.splice(index, 1);
      // sync localStorage as well
      try {
        const existing = JSON.parse(localStorage.getItem("billboardsData") || "[]");
        const arr = Array.isArray(existing) ? existing : [];
        const updated = arr.filter(b => b.id !== id);
        localStorage.setItem("billboardsData", JSON.stringify(updated));
      } catch {}
      // remove related product cards too (by id or billboardCode)
      try {
        const cards = JSON.parse(localStorage.getItem("productCards") || "[]");
        if (Array.isArray(cards)) {
          const updatedCards = cards.filter(c => !(c.id === id || (billboard.billboardCode && c.billboardCode === billboard.billboardCode)));
          localStorage.setItem("productCards", JSON.stringify(updatedCards));
        }
      } catch {}
      currentDataRef = applyCurrentFiltersSnapshot();
      populateTable(currentDataRef);
      alert("تابلو با موفقیت حذف شد");
    }
  }
}

// Apply current filter controls without re-reading values elsewhere
function applyCurrentFiltersSnapshot(){
  try {
    const provinceFilter = document.querySelector("#provinceFilter").value;
    const statusFilter = document.querySelector("#statusFilter").value;
    const cityFilter = document.querySelector("#cityFilter").value;
    const searchInput = (document.querySelector("#searchInput").value || '').toLowerCase();
    return billboardsData.filter(billboard => {
      const matchesProvince = !provinceFilter || billboard.province === provinceFilter;
      const matchesCity = !cityFilter || billboard.city === cityFilter;
      let matchesStatus = true;
      if (statusFilter) {
        switch(statusFilter) {
          case "empty": matchesStatus = billboard.isEmpty; break;
          case "cultural": matchesStatus = billboard.isCultural; break;
          case "broadcasting": matchesStatus = billboard.isBroadcasting; break;
          case "reserved": matchesStatus = billboard.isReserved; break;
          case "inactive": matchesStatus = billboard.isInactive; break;
        }
      }
      const matchesSearch = !searchInput || 
        (billboard.billboardCode||'').toLowerCase().includes(searchInput) ||
        (billboard.province||'').toLowerCase().includes(searchInput) ||
        (billboard.city||'').toLowerCase().includes(searchInput) ||
        (billboard.region||'').toLowerCase().includes(searchInput) ||
        (billboard.position||'').toLowerCase().includes(searchInput);
      return matchesProvince && matchesCity && matchesStatus && matchesSearch;
    });
  } catch { return billboardsData.slice(); }
}

// Setup modal events
function setupModalEvents() {
  const modal = document.getElementById("addBillboardModal");
  const closeBtn = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const form = document.getElementById("addBillboardForm");

  // Close modal events - only with X button
  closeBtn.addEventListener("click", closeModal);
  
  // Cancel button - clear form but don't close modal
  cancelBtn.addEventListener("click", () => {
    if (confirm("آیا مطمئن هستید که می‌خواهید فرم را پاک کنید؟")) {
      clearForm();
    }
  });
  
  // Remove click outside to close
  // modal.addEventListener("click", (e) => {
  //   if (e.target === modal) {
  //     closeModal();
  //   }
  // });

  // Remove Escape key to close
  // document.addEventListener("keydown", (e) => {
  //   if (e.key === "Escape" && modal.classList.contains("show")) {
  //     closeModal();
  //   }
  // });

  // Form submission
  form.addEventListener("submit", handleFormSubmit);
}

// Check if form has any data
function hasFormData() {
  const form = document.getElementById("addBillboardForm");
  
  // Get all input, select, and textarea elements
  const inputs = form.querySelectorAll("input, select, textarea");
  
  for (let input of inputs) {
    // Skip readonly fields (auto-calculated)
    if (input.readOnly) {
      continue;
    }
    
    // Check different input types
    if (input.type === "checkbox" || input.type === "radio") {
      if (input.checked) {
        return true;
      }
    } else if (input.type === "date") {
      if (input.value) {
        return true;
      }
    } else if (input.type === "number") {
      if (input.value && parseFloat(input.value) > 0) {
        return true;
      }
    } else {
      // Text inputs, selects, textareas
      if (input.value && input.value.trim() !== "") {
        return true;
      }
    }
  }
  
  return false;
}

// Close modal with confirmation
function closeModal() {
  const modal = document.getElementById("addBillboardModal");
  
  // Check if form has any data
  if (hasFormData()) {
    if (confirm("آیا مطمئن هستید که می‌خواهید این پنجره را ببندید؟ اطلاعات وارد شده از بین خواهد رفت.")) {
      // Clear form before closing
      clearForm();
      modal.classList.remove("show");
    }
  } else {
    // No data, close directly
    modal.classList.remove("show");
  }
}

// Clear form function
function clearForm() {
  const form = document.getElementById("addBillboardForm");
  form.reset();
  
  // Reset auto-calculated fields
  document.getElementById("squareMeter").value = "";
  document.getElementById("broadcastDuration").value = "";
}

// Setup auto calculations
function setupAutoCalculations() {
  const lengthInput = document.getElementById("length");
  const widthInput = document.getElementById("width");
  const squareMeterInput = document.getElementById("squareMeter");
  const startDateInput = document.getElementById("broadcastStartDate");
  const endDateInput = document.getElementById("broadcastEndDate");
  const durationInput = document.getElementById("broadcastDuration");

  // Calculate square meter
  function calculateSquareMeter() {
    const length = parseFloat(lengthInput.value) || 0;
    const width = parseFloat(widthInput.value) || 0;
    const squareMeter = length * width;
    squareMeterInput.value = squareMeter.toFixed(1);
  }

  // Calculate broadcast duration
  function calculateDuration() {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      durationInput.value = diffDays;
    } else {
      durationInput.value = "";
    }
  }

  // Add event listeners
  lengthInput.addEventListener("input", calculateSquareMeter);
  widthInput.addEventListener("input", calculateSquareMeter);
  startDateInput.addEventListener("change", calculateDuration);
  endDateInput.addEventListener("change", calculateDuration);
}

// Calculate remaining days until end date (negative if passed)
function calculateRemainingDays(endDateStr) {
  if (!endDateStr) return '-';
  const today = new Date();
  const end = new Date(endDateStr);
  if (isNaN(end.getTime())) return '-';
  // Zero out time for date-only diff
  const startOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const startOfEnd = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const diffMs = startOfEnd - startOfToday;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

// Check if form is complete
function isFormComplete() {
  const requiredFields = [
    "billboardCode",
    "province", 
    "region",
    "position",
    "length",
    "width"
  ];
  
  for (let field of requiredFields) {
    const input = document.getElementById(field);
    if (!input.value.trim()) {
      return false;
    }
  }
  
  return true;
}

// Handle form submission
function handleFormSubmit(e) {
  e.preventDefault();
  
  // Check if form is complete
  if (!isFormComplete()) {
    showNotification("لطفاً تمام فیلدهای اجباری را پر کنید", "error");
    return;
  }
  
  const formData = new FormData(e.target);
  // Uniqueness check for billboardCode
  const submittedCode = (formData.get("billboardCode") || "").trim();
  if (!submittedCode) {
    showNotification("کد تابلو نامعتبر است", "error");
    return;
  }
  const isDuplicate = billboardsData.some(b => {
    const sameCode = (b.billboardCode || "").trim() === submittedCode;
    if (!isEditMode) return sameCode;
    return sameCode && b.id !== editingBillboardId;
  });
  if (isDuplicate) {
    showNotification("این کد تابلو تکراری است. لطفاً کد دیگری وارد کنید.", "error");
    return;
  }
  const priceNumber = parseFloat(formData.get("productPrice")) || 0;
  const newBillboard = {
    id: isEditMode ? editingBillboardId : (billboardsData.length + 1),
    billboardCode: formData.get("billboardCode"),
    province: formData.get("province"),
    city: formData.get("city") || "",
    region: formData.get("region"),
    position: formData.get("position"),
    viewAngle: formData.get("viewAngle") || "",
    structureType: formData.get("structureType") || "",
    length: parseFloat(formData.get("length")),
    width: parseFloat(formData.get("width")),
    squareMeter: parseFloat(formData.get("squareMeter")),
    ownership: formData.get("ownership") || "",
    isInactive: formData.get("isInactive") === "true",
    isEmpty: formData.get("isEmpty") === "true",
    isCultural: formData.get("isCultural") === "true",
    isBroadcasting: formData.get("isBroadcasting") === "true",
    isReserved: formData.get("isReserved") === "true",
    broadcastStartDate: formData.get("broadcastStartDate") || "",
    broadcastEndDate: formData.get("broadcastEndDate") || "",
    broadcastDuration: parseInt(formData.get("broadcastDuration")) || 0,
    broadcastBy: formData.get("broadcastBy") || "",
    extension: formData.get("extension") === "true",
    nextReservedBy: formData.get("nextReservedBy") || "",
    description: formData.get("description") || "",
    // product card payload
    productCard: {
      title: formData.get("position") || formData.get("billboardCode") || "بیلبورد",
      priceNumber,
      imageDataUrl: "", // will be set if image selected
    }
  };

  const imageFile = formData.get("imageFile");
  if (imageFile && imageFile.size) {
    const reader = new FileReader();
    reader.onload = () => {
      newBillboard.productCard.imageDataUrl = reader.result;
      finalizeAdd(newBillboard);
    };
    reader.onerror = () => {
      finalizeAdd(newBillboard);
    };
    reader.readAsDataURL(imageFile);
  } else {
    finalizeAdd(newBillboard);
  }
}

function finalizeAdd(newBillboard){
  if (isEditMode) {
    // update existing in-memory
    const idx = billboardsData.findIndex(b => b.id === editingBillboardId);
    if (idx !== -1) {
      try {
        if (newBillboard && newBillboard.productCard && !newBillboard.productCard.imageDataUrl) {
          const prev = billboardsData[idx];
          const prevImg = (prev && prev.productCard && prev.productCard.imageDataUrl) || '';
          if (prevImg) newBillboard.productCard.imageDataUrl = prevImg;
        }
      } catch {}
      billboardsData[idx] = newBillboard;
    }
  } else {
    billboardsData.push(newBillboard);
  }
  // Persist to localStorage
  try {
    const existing = JSON.parse(localStorage.getItem("billboardsData") || "[]");
    let arr = Array.isArray(existing) ? existing : [];
    if (isEditMode) {
      const idx = arr.findIndex(b => b.id === editingBillboardId);
      if (idx !== -1) {
        try {
          if (newBillboard && newBillboard.productCard && !newBillboard.productCard.imageDataUrl) {
            const prev = arr[idx];
            const prevImg = (prev && prev.productCard && prev.productCard.imageDataUrl) || '';
            if (prevImg) newBillboard.productCard.imageDataUrl = prevImg;
          }
        } catch {}
        arr[idx] = newBillboard;
      } else arr.push(newBillboard);
    } else {
      arr.push(newBillboard);
    }
    localStorage.setItem("billboardsData", JSON.stringify(arr));
  } catch {}
  // Also persist a lightweight product card list for homepage rendering
  try {
    const pc = newBillboard.productCard || {};
    const cards = JSON.parse(localStorage.getItem("productCards") || "[]");
    let arr = Array.isArray(cards) ? cards : [];
    
    // Only create/update product card if it has valid data
    if (pc && (pc.imageDataUrl || pc.title)) {
      const cardData = {
        id: newBillboard.id,
        billboardCode: newBillboard.billboardCode || "",
        ownership: newBillboard.ownership || "",
        length: newBillboard.length || "",
        width: newBillboard.width || "",
        squareMeter: newBillboard.squareMeter || "",
        title: pc.title,
        priceNumber: pc.priceNumber || 0,
        image: pc.imageDataUrl || ""
      };
      
      // Find existing card by id or billboardCode
      const existingIndex = arr.findIndex(c => 
        (c.id && c.id === newBillboard.id) || 
        (c.billboardCode && c.billboardCode === newBillboard.billboardCode)
      );
      
      if (existingIndex !== -1) {
        // Update existing card
        if (!cardData.image && arr[existingIndex].image) {
          cardData.image = arr[existingIndex].image;
        }
        arr[existingIndex] = cardData;
      } else {
        // Add new card only if it doesn't exist
        arr.push(cardData);
      }
      
      localStorage.setItem("productCards", JSON.stringify(arr));
    }
  } catch {}

  // Refresh table
  populateTable(billboardsData);
  // Close modal
  closeModal();
  // Show success message
  showNotification(isEditMode ? "ویرایش تابلو با موفقیت ذخیره شد!" : "تابلو جدید با موفقیت اضافه شد! کارت محصول نیز به صفحه اصلی افزوده شد.", "success");
  // reset edit state
  isEditMode = false;
  editingBillboardId = null;
}

// Format price with commas
function formatPrice(price) {
  return parseInt(price).toLocaleString("fa-IR");
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
      document.body.removeChild(notification);
    }, 300);
  }, 3000);
}

// Setup pagination
function setupPagination() {
  renderPagination((currentDataRef||[]).length || billboardsData.length);
}

function renderPagination(totalItems){
  const numbersWrap = document.querySelector('.pagination-numbers');
  const prevBtn = document.querySelector('.pagination .pagination-btn:first-child');
  const nextBtn = document.querySelector('.pagination .pagination-btn:last-child');
  if (!numbersWrap || !prevBtn || !nextBtn) return;

  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  if (currentPage > totalPages) currentPage = totalPages;

  numbersWrap.innerHTML = '';
  const windowSize = 7;
  let start = Math.max(1, currentPage - Math.floor(windowSize/2));
  let end = Math.min(totalPages, start + windowSize - 1);
  if (end - start + 1 < windowSize) start = Math.max(1, end - windowSize + 1);

  for (let p = start; p <= end; p++){
    const span = document.createElement('span');
    span.className = 'page-number' + (p === currentPage ? ' active' : '');
    span.textContent = String(p);
    span.addEventListener('click', () => {
      currentPage = p;
      populateTable(currentDataRef);
    });
    numbersWrap.appendChild(span);
  }

  prevBtn.disabled = currentPage <= 1;
  nextBtn.disabled = currentPage >= totalPages;

  prevBtn.onclick = () => { if (currentPage > 1){ currentPage--; populateTable(currentDataRef); } };
  nextBtn.onclick = () => { if (currentPage < totalPages){ currentPage++; populateTable(currentDataRef); } };
}

// تابع برای تشخیص صفحه فعلی و تغییر دکمه ناوبری
function updateNavigationButton() {
  const currentPage = window.location.pathname.split('/').pop();
  const navLinks = document.querySelectorAll('.nav-right a[href*="billboards-table.html"]');
  const mobileNavLinks = document.querySelectorAll('.mobile-links a[href*="billboards-table.html"]');
  
  // اگر در صفحه جدول هستیم
  if (currentPage === 'billboards-table.html' || currentPage === '' || currentPage === 'index.html') {
    // تغییر لینک‌های ناوبری اصلی
    navLinks.forEach(link => {
      link.href = '../navbar.html';
      link.innerHTML = '<b>صفحه اصلی</b>';
    });
    
    // تغییر لینک‌های ناوبری موبایل
    mobileNavLinks.forEach(link => {
      link.href = '../navbar.html';
      link.textContent = 'صفحه اصلی';
    });
  } else {
    // اگر در صفحه اصلی هستیم (navbar.html)
    navLinks.forEach(link => {
      link.href = 'billboards-table.html';
      link.innerHTML = '<b>جدول کل تابلوها</b>';
    });
    
    mobileNavLinks.forEach(link => {
      link.href = 'billboards-table.html';
      link.textContent = 'جدول کل تابلوها';
    });
  }
}

// Load provinces to dropdown from admin panel
function loadProvincesToDropdown() {
  try {
    const provinces = JSON.parse(localStorage.getItem('provinces') || '[]');
    const activeProvinces = provinces.filter(p => p.status === 'active');
    
    const provinceSelect = document.getElementById('province');
    if (provinceSelect) {
      const currentValue = provinceSelect.value;
      provinceSelect.innerHTML = '<option value="">انتخاب استان</option>';
      activeProvinces.forEach(province => {
        const option = document.createElement('option');
        option.value = province.name;
        option.textContent = province.name;
        provinceSelect.appendChild(option);
      });
      if (currentValue) provinceSelect.value = currentValue;
      
      // Add event listener for province change
      provinceSelect.addEventListener('change', function() {
        const selectedProvince = this.value;
        loadCitiesToDropdown(selectedProvince);
      });
    }
  } catch (error) {
    console.log('Error loading provinces:', error);
  }
}

// Load cities to dropdown from admin panel
function loadCitiesToDropdown(selectedProvince = null) {
  try {
    const cities = JSON.parse(localStorage.getItem('cities') || '[]');
    const activeCities = cities.filter(c => c.status === 'active');
    
    // Filter cities by province if specified
    let filteredCities = activeCities;
    if (selectedProvince) {
      filteredCities = activeCities.filter(c => c.province === selectedProvince);
    }
    
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
      
      // Keep current value if it's still valid
      if (currentValue && filteredCities.some(c => c.name === currentValue)) {
        citySelect.value = currentValue;
      } else {
        citySelect.value = '';
      }
    }
    
    // Update navbar city dropdowns
    updateNavbarCityDropdowns(activeCities);
  } catch (error) {
    console.log('Error loading cities:', error);
  }
}

// Function to update navbar city dropdowns
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

// Function to create city pages dynamically
function createCityPages() {
  try {
    const cities = JSON.parse(localStorage.getItem('cities') || '[]');
    const activeCities = cities.filter(c => c.status === 'active');
    
    activeCities.forEach(city => {
      const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
      const cityPageContent = `<!DOCTYPE html>
<html lang="fa" dir="rtl">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>بیلبوردهای شهر ${city.name}</title>
	<link rel="stylesheet" href="../shared/style.css"/>
	<link rel="stylesheet" href="../shared/main.css"/>
	<link rel="stylesheet" href="city-style.css"/>
</head>
<body data-city="${city.name}">
	<header class="city-header">
		<div class="container">
			<h1 id="cityTitle">بیلبوردهای شهر ${city.name}</h1>
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
      
      // Store in localStorage
      const cityPages = JSON.parse(localStorage.getItem('cityPages') || '{}');
      cityPages[citySlug] = cityPageContent;
      localStorage.setItem('cityPages', JSON.stringify(cityPages));
    });
  } catch (error) {
    console.log('Error creating city pages:', error);
  }
}

// Load ownership options for filter
function loadOwnershipFilterOptions() {
  try {
    const partners = JSON.parse(localStorage.getItem('partners') || '[]');
    const ownershipFilter = document.getElementById('ownershipFilter');
    
    if (!ownershipFilter) return;
    
    // Clear existing options except the first one
    ownershipFilter.innerHTML = '<option value="">همه مالکیت‌ها</option>';
    
    // Add partner options
    partners.forEach(partner => {
      const option = document.createElement('option');
      option.value = partner.name;
      option.textContent = partner.name;
      ownershipFilter.appendChild(option);
    });
    
    // Add "نامشخص" option
    const unknownOption = document.createElement('option');
    unknownOption.value = 'نامشخص';
    unknownOption.textContent = 'نامشخص';
    ownershipFilter.appendChild(unknownOption);
    
  } catch (error) {
    console.error('Error loading ownership filter options:', error);
  }
}

// Load city options for filter from admin panel
function loadCityFilterOptions() {
  try {
    const cities = JSON.parse(localStorage.getItem('cities') || '[]');
    const cityFilter = document.getElementById('cityFilter');
    
    if (!cityFilter) return;
    
    // Clear existing options except the first one
    cityFilter.innerHTML = '<option value="">همه شهرها</option>';
    
    // Add city options from admin panel
    cities.forEach(city => {
      if (city.status === 'active') {
        const option = document.createElement('option');
        option.value = city.name;
        option.textContent = city.name;
        cityFilter.appendChild(option);
      }
    });
    
  } catch (error) {
    console.error('Error loading city filter options:', error);
  }
}

// Apply ownership filter
function applyOwnershipFilter() {
  const ownershipFilter = document.getElementById('ownershipFilter');
  if (!ownershipFilter) return;
  
  const selectedOwnership = ownershipFilter.value;
  
  if (!selectedOwnership) {
    // Show all data
    currentDataRef = billboardsData;
  } else {
    // Filter by ownership
    currentDataRef = billboardsData.filter(billboard => {
      return billboard.ownership === selectedOwnership;
    });
  }
  
  // Reset to first page and repopulate table
  currentPage = 1;
  populateTable(currentDataRef);
  updatePagination();
}

// Enhanced filter function
function applyAllFilters() {
  const provinceFilter = document.getElementById('provinceFilter');
  const statusFilter = document.getElementById('statusFilter');
  const ownershipFilter = document.getElementById('ownershipFilter');
  const cityFilter = document.getElementById('cityFilter');
  const searchInput = document.getElementById('searchInput');
  
  let filteredData = [...billboardsData];
  
  // Province filter
  if (provinceFilter && provinceFilter.value) {
    filteredData = filteredData.filter(billboard => 
      billboard.province === provinceFilter.value
    );
  }
  
  // City filter
  if (cityFilter && cityFilter.value) {
    filteredData = filteredData.filter(billboard => 
      billboard.city === cityFilter.value
    );
  }
  
  // Status filter
  if (statusFilter && statusFilter.value) {
    filteredData = filteredData.filter(billboard => {
      switch (statusFilter.value) {
        case 'empty':
          return billboard.isEmpty;
        case 'cultural':
          return billboard.isCultural;
        case 'broadcasting':
          return billboard.isBroadcasting;
        case 'reserved':
          return billboard.isReserved;
        case 'inactive':
          return billboard.isInactive;
        default:
          return true;
      }
    });
  }
  
  // Ownership filter
  if (ownershipFilter && ownershipFilter.value) {
    filteredData = filteredData.filter(billboard => 
      billboard.ownership === ownershipFilter.value
    );
  }
  
  // Search filter
  if (searchInput && searchInput.value.trim()) {
    const searchTerm = searchInput.value.toLowerCase().trim();
    filteredData = filteredData.filter(billboard => {
      const searchableText = [
        billboard.billboardCode || '',
        billboard.province || '',
        billboard.city || '',
        billboard.region || '',
        billboard.position || '',
        billboard.ownership || '',
        billboard.description || ''
      ].join(' ').toLowerCase();
      
      return searchableText.includes(searchTerm);
    });
  }
  
  currentDataRef = filteredData;
  currentPage = 1;
  populateTable(currentDataRef);
  updatePagination();
}

// Setup filter event listeners
function setupFilterEventListeners() {
  // Province filter
  const provinceFilter = document.getElementById('provinceFilter');
  if (provinceFilter) {
    provinceFilter.addEventListener('change', applyAllFilters);
  }
  
  // Status filter
  const statusFilter = document.getElementById('statusFilter');
  if (statusFilter) {
    statusFilter.addEventListener('change', applyAllFilters);
  }
  
  // City filter
  const cityFilter = document.getElementById('cityFilter');
  if (cityFilter) {
    cityFilter.addEventListener('change', applyAllFilters);
  }
  
  // Ownership filter
  const ownershipFilter = document.getElementById('ownershipFilter');
  if (ownershipFilter) {
    ownershipFilter.addEventListener('change', applyAllFilters);
  }
  
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(applyAllFilters, 300));
  }
  
  // Filter button
  const filterBtn = document.querySelector('.filter-btn');
  if (filterBtn) {
    filterBtn.addEventListener('click', applyAllFilters);
  }
}

// Debounce function for search
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}
