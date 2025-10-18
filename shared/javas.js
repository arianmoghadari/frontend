// Dropdown
/*document.querySelectorAll(".dropdown-btn").forEach(btn => {
  btn.addEventListener("click", function(e) {
    e.stopPropagation();
    this.parentElement.classList.toggle("show");
  });
});

document.addEventListener("click", e => {
  document.querySelectorAll(".dropdown").forEach(dropdown => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove("show");
  });
});

// Hamburger + Mobile Panel
const hamburger = document.getElementById("hamburger");   // دکمه
const hamburgerIcon = hamburger.querySelector("i");       // آیکون
const mobilePanel = document.getElementById("mobilePanel"); // پنل

hamburger.addEventListener("click", e => {
  e.stopPropagation();
  mobilePanel.classList.toggle("active");

  // تغییر آیکون
  hamburgerIcon.classList.toggle("fa-bars");
  hamburgerIcon.classList.toggle("fa-times");
});

document.addEventListener("click", e => {
  if (!mobilePanel.contains(e.target)) {
    mobilePanel.classList.remove("active");
    hamburgerIcon.classList.add("fa-bars");
    hamburgerIcon.classList.remove("fa-times");
  }
});

// بستن منو در تغییر سایز
window.addEventListener("resize", () => {
  if (window.innerWidth > 800 && mobilePanel.classList.contains("active")) {
    mobilePanel.classList.remove("active");
    hamburgerIcon.classList.add("fa-bars");
    hamburgerIcon.classList.remove("fa-times");
  }
});*/


document.addEventListener("DOMContentLoaded", () => {
  // Arad holding authentication (احراز هویت آرین)
  // Enforce authentication on all pages except login page

  // try {
  //   const current = window.location.pathname.split('/').pop();
  //   const isLoginPage = current === 'loginpanel.html';
  //   const isAuthenticated = localStorage.getItem('auth') === 'true';
  //   if (!isAuthenticated && !isLoginPage) {
  //     // redirect to login and replace history so back won't return
  //     const marker = "/frontend/";
  //     const path = window.location.pathname;
  //     const idx = path.indexOf(marker);
  //     const base = idx !== -1 ? path.substring(0, idx + marker.length) : '';
  //     window.location.replace(base + 'Login Form/loginpanel.html');
  //     return;
  //   }
  // } catch {}
  // Arad holding authentication (احراز هویت آرین)

  const hamburger = document.querySelector("#hamburger"); // همبرگر
  const hamburgerIcon = hamburger.querySelector("i"); // آیکون همبرگر
  const mobilePanel = document.querySelector("#mobilePanel"); // پنل موبایل
  const dropdownBtns = document.querySelectorAll(".dropdown-btn"); // دکمه های dropdown
  const userProfile = document.querySelector(".user-profile"); // سکشن کاربری دسکتاپ
  const desktopUserProfile = document.querySelector("#desktopUserProfile"); // سکشن کاربری دسکتاپ
  const mobileUserProfile = document.querySelector("#mobileUserProfile"); // سکشن کاربری موبایل
  const mobileUserDropdown = document.querySelector("#mobileUserDropdown"); // dropdown موبایل

  // تشخیص صفحه فعلی و تغییر دکمه ناوبری
  updateNavigationButton();

  // اعمال اطلاعات کاربر ذخیره‌شده روی ناوبار (دسکتاپ و موبایل)
  applyStoredUserToNavbar();

  // بارگذاری شهرها در dropdown
  loadCitiesToNavbar();

  // helper برای بستن همه dropdown ها
  const closeAllDropdowns = () => {
    document.querySelectorAll(".dropdown.show").forEach(d => d.classList.remove("show"));
  };

  // helper برای بستن mobile panel
  const closeMobilePanel = () => {
    mobilePanel.classList.remove("active");
    hamburgerIcon.classList.remove("fa-times");
    hamburgerIcon.classList.add("fa-bars");
  };

  // helper برای بستن user dropdown
  const closeUserDropdown = () => {
    if (userProfile) {
      userProfile.classList.remove("show");
    }
  };

  // helper برای بستن desktop user dropdown
  const closeDesktopUserDropdown = () => {
    if (desktopUserProfile) {
      desktopUserProfile.classList.remove("show");
      desktopUserProfile.classList.remove("active");
    }
  };

  // helper برای بستن mobile user dropdown
  const closeMobileUserDropdown = () => {
    if (mobileUserProfile && mobileUserDropdown) {
      mobileUserProfile.classList.remove("active");
      mobileUserDropdown.classList.remove("show");
    }
  };

  // Dropdown کلیک
  dropdownBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      e.stopPropagation();
      
      // در موبایل، فقط dropdown داخل mobile-panel را باز/بسته می‌کنیم
      if (window.innerWidth <= 800 && btn.closest('.mobile-panel')) {
        btn.parentElement.classList.toggle("show");
      } else if (window.innerWidth > 800) {
        // در دسکتاپ رفتار عادی
        btn.parentElement.classList.toggle("show");
      }
    });
  });

  // Hamburger کلیک
  hamburger.addEventListener("click", e => {
    e.stopPropagation();
    mobilePanel.classList.toggle("active");
    hamburgerIcon.classList.toggle("fa-bars");
    hamburgerIcon.classList.toggle("fa-times");
  });

  // Desktop User Profile کلیک
  if (desktopUserProfile) {
    desktopUserProfile.addEventListener("click", e => {
      e.stopPropagation();
      desktopUserProfile.classList.toggle("show");
      desktopUserProfile.classList.toggle("active");
    });
  }

  // Mobile User Profile کلیک
  if (mobileUserProfile) {
    mobileUserProfile.addEventListener("click", e => {
      e.stopPropagation();
      mobileUserProfile.classList.toggle("active");
      mobileUserDropdown.classList.toggle("show");
    });
  }

  // بستن با کلیک بیرون (dropdown + mobile panel + user profile)
  document.addEventListener("click", e => {
    if (!e.target.closest(".dropdown")) closeAllDropdowns();
    if (!e.target.closest("#mobilePanel") && !e.target.closest("#hamburger")) closeMobilePanel();
    if (!e.target.closest("#desktopUserProfile")) closeDesktopUserDropdown();
    if (!e.target.closest("#mobileUserProfile")) closeMobileUserDropdown();
  });

  // بستن در تغییر سایز
  window.addEventListener("resize", () => {
    if (window.innerWidth > 800) closeMobilePanel();
  });
});

// =============================
// Integrated Arian slider logic
// =============================
let slideIndex = 1;
let slides = [];
function showSlide(index) {
  if (!slides.length) return;
  if (index > slides.length) slideIndex = 1;
  if (index < 1) slideIndex = slides.length;
  slides.forEach(s => s.classList.remove('active'));
  slides[slideIndex - 1].classList.add('active');
}
function nextSlide() { slideIndex++; showSlide(slideIndex); }
function prevSlide() { slideIndex--; showSlide(slideIndex); }

window.addEventListener('DOMContentLoaded', () => {
  const slidesContainer = document.querySelector('.slides');
  if (slidesContainer) {
    slides = [...slidesContainer.children];
    showSlide(slideIndex);
    setInterval(() => { nextSlide(); }, 5000);
  }
});

// =============================
// Integrated Arian product popup logic
// =============================
window.addEventListener('DOMContentLoaded', () => {
  // Delegated overlay open on card click (works for dynamic cards)
  const productsSection = document.querySelector('.product-sec-new');
  if (productsSection){
    productsSection.addEventListener('click', (e) => {
      // skip if clicking Buy button area, let cart handler manage
      if (e.target.closest('.extend-btn')) return;
      const card = e.target.closest('.shoping-card');
      if (!card) return;
      const titleText = (card.querySelector('.titlee')||{}).textContent || (card.querySelector('.title')||{}).textContent || '';
      const price = (card.querySelector('.price')||{}).textContent || '';
      const imgEl = card.querySelector('.img-sec img');
      const imageSrc = imgEl ? imgEl.src : '';
      const code = card.getAttribute('data-code') || '-';
      const ownership = card.getAttribute('data-ownership') || '-';
      const length = card.getAttribute('data-length') || '-';
      const width = card.getAttribute('data-width') || '-';
      const square = card.getAttribute('data-square') || '-';
      const info = document.getElementById('popup-info');
      const popup = document.getElementById('product-popup');
      if (!info || !popup) return;
      info.innerHTML = `
        <img src="${imageSrc}" alt="${titleText}">
        <h2>${titleText}</h2>
        <p>${price}</p>
        <div style="margin-top:10px; text-align:right; color:#15214a;">
          <div>کد تابلو: <b>${code}</b></div>
          <div>مالکیت: <b>${ownership}</b></div>
          <div>طول: <b>${length}</b> متر</div>
          <div>عرض: <b>${width}</b> متر</div>
          <div>مساحت: <b>${square}</b> متر مربع</div>
        </div>
      `;
      popup.style.display = 'block';
    });
  }

  const closeBtn = document.querySelector('.close-btn');
  if (closeBtn) {
    closeBtn.addEventListener('click', function() {
      const popup = document.getElementById('product-popup');
      if (popup) popup.style.display = 'none';
    });
  }

  const popupEl = document.getElementById('product-popup');
  if (popupEl) {
    popupEl.addEventListener('click', function(e) {
      if (e.target === this) {
        this.style.display = 'none';
      }
    });
  }
});

// =============================
// Cart panel logic
// =============================
(function(){
  const currencyFormatter = (value) => {
    try {
      const number = Number(String(value).replace(/[^0-9.]/g, '')) || 0;
      return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(number);
    } catch { return String(value); }
  };

  const cartState = {
    items: [], // {id, title, priceNumber, image, qty, discountPercent}
  };

  const els = {
    panel: null,
    backdrop: null,
    closeBtn: null,
    checkoutBtn: null,
    total: null,
    tableBody: null,
    cartBtn: null,
    cartCount: null,
  };

  function queryElements(){
    els.panel = document.getElementById('cartPanel');
    els.backdrop = document.getElementById('cartBackdrop');
    els.closeBtn = document.getElementById('cartClose');
    els.checkoutBtn = document.getElementById('cartCheckout');
    els.total = document.getElementById('cartTotal');
    els.tableBody = document.getElementById('cartTableBody');
    els.cartBtn = document.querySelector('.nav-left .cart');
    els.cartCount = document.querySelector('.nav-left .cart-count');
  }

  function openPanel(){ if (els.panel && els.backdrop){ els.panel.classList.add('active'); els.backdrop.classList.add('active'); } }
  function closePanel(){ if (els.panel && els.backdrop){ els.panel.classList.remove('active'); els.backdrop.classList.remove('active'); } }

  function updateCartCount(){ if (els.cartCount){ const count = cartState.items.reduce((s,i)=>s+i.qty,0); els.cartCount.textContent = count; } }

  function renderTable(){
    if (!els.tableBody) return;
    els.tableBody.innerHTML = '';
    let total = 0;
    cartState.items.forEach(item => {
      const row = document.createElement('tr');
      const unit = Number(item.priceNumber)||0;
      const discount = Math.min(100, Math.max(0, Number(item.discountPercent)||0));
      const discountedUnit = unit * (1 - discount/100);
      const lineTotal = discountedUnit * item.qty; total += lineTotal;
      row.innerHTML = `
        <td><img class="cart-item-thumb" src="${item.image}" alt="${item.title}"></td>
        <td>${item.title}</td>
        <td>${currencyFormatter(unit)}</td>
        <td><input class=\"disc-input\" type=\"number\" min=\"0\" max=\"100\" value=\"${discount}\" data-id=\"${item.id}\"></td>
        <td><input class="qty-input" type="number" min="1" value="${item.qty}" data-id="${item.id}"/></td>
        <td>${currencyFormatter(lineTotal)}</td>
        <td><button class="remove-btn" title="حذف" data-id="${item.id}">×</button></td>
      `;
      els.tableBody.appendChild(row);
    });
    if (els.total) els.total.textContent = currencyFormatter(total);
    if (els.checkoutBtn) els.checkoutBtn.disabled = cartState.items.length === 0;
    updateCartCount();
  }

  function addItem(data){
    const existing = cartState.items.find(i => i.id === data.id);
    if (existing){ 
      // نمایش هشدار برای آیتم تکراری
      showNotification('این آیتم قبلاً به سبد خرید اضافه شده است!', 'error');
      return; // از اضافه کردن مجدد جلوگیری می‌کند
    }
    else { 
      cartState.items.push({ ...data, qty: 1, discountPercent: 0 }); 
      showNotification('به سبد خرید اضافه شد', 'success');
    }
    renderTable();
  }

  function removeItem(id){ cartState.items = cartState.items.filter(i => i.id !== id); renderTable(); }

  function updateQty(id, qty){
    const item = cartState.items.find(i => i.id === id);
    if (!item) return;
    const n = Math.max(1, Number(qty)||1);
    item.qty = n; renderTable();
  }

  function extractCardData(card){
    const img = card.querySelector('.img-sec img');
    const title = (card.querySelector('.titlee')||{}).textContent?.trim() || (card.querySelector('.title')||{}).textContent?.trim() || 'محصول';
    const priceText = (card.querySelector('.price')||{}).textContent || '0';
    const priceNumber = Number(priceText.replace(/[^0-9.]/g,'')) || 0;
    const image = img ? img.src : '';
    const dataId = card.getAttribute('data-id');
    const id = String(dataId || image || (title + '-' + priceNumber));
    return { id, title, priceNumber, image };
  }

  function wireBuyButtons(){
    // Delegated handler so dynamically added cards work
    const productsSection = document.querySelector('.product-sec-new');
    if (!productsSection) return;
    if (productsSection.__buyDelegated) return; // idempotent

    const handler = (e) => {
      if (e.__buyHandled) return; // avoid double-handling
      const btn = e.target.closest && e.target.closest('.extend-btn');
      if (!btn) return;
      // Ensure we take control even if other handlers call stopPropagation
      e.preventDefault();
      e.stopImmediatePropagation?.();
      e.__buyHandled = true;
      const card = btn.closest('.shoping-card');
      if (!card) return;
      const data = extractCardData(card);
      addItem(data);
      openPanel();
    };

    // Capture-phase listener to run before page-specific inline handlers
    productsSection.addEventListener('click', handler, true);
    // Bubble-phase listener as fallback
    productsSection.addEventListener('click', handler);

    productsSection.__buyDelegated = true;
  }

  function wireTableEvents(){
    if (!els.tableBody) return;
    els.tableBody.addEventListener('input', e => {
      const input = e.target.closest('.qty-input');
      if (input){ updateQty(String(input.dataset.id), input.value); }
    });
    els.tableBody.addEventListener('change', e => {
      const disc = e.target.closest('.disc-input');
      if (disc){ updateDiscount(String(disc.dataset.id), disc.value); }
    });
    els.tableBody.addEventListener('click', e => {
      const btn = e.target.closest('.remove-btn');
      if (btn){ removeItem(String(btn.dataset.id)); }
    });
  }

  function updateDiscount(id, percent){
    const item = cartState.items.find(i => i.id === id);
    if (!item) return;
    const p = Math.min(100, Math.max(0, Number(percent)||0));
    item.discountPercent = p; renderTable();
  }

  // جمع آوری اقلام سبد از جدول برای انتقال به صفحه سبد خرید
  function collectCartFromTable(){
    const items = [];
    if (!els.tableBody) return items;
    els.tableBody.querySelectorAll('tr').forEach(row => {
      const imgEl = row.querySelector('img.cart-item-thumb');
      const titleEl = row.querySelector('td:nth-child(2)');
      const qtyInput = row.querySelector('input.qty-input');
      const priceEl = row.querySelector('td:nth-child(3)');
      const discInput = row.querySelector('input.disc-input');
      const image = imgEl ? imgEl.getAttribute('src') : '';
      const title = titleEl ? titleEl.textContent.trim() : '';
      const qty = qtyInput ? Math.max(1, Number(qtyInput.value)||1) : 1;
      const priceNumber = priceEl ? (Number(priceEl.textContent.replace(/[^0-9.]/g,''))||0) : 0;
      const discountPercent = discInput ? Math.min(100, Math.max(0, Number(discInput.value)||0)) : 0;
      const id = (qtyInput && qtyInput.dataset.id) ? String(qtyInput.dataset.id) : (image || title);
      items.push({ id, title, image, qty, priceNumber, discountPercent });
    });
    return items;
  }

  function wireCheckout(){
    if (!els.checkoutBtn) return;
    els.checkoutBtn.addEventListener('click', () => {
      const items = collectCartFromTable();
      const totalNumber = items.reduce((s,i)=> s + (i.priceNumber * i.qty), 0);
      try {
        localStorage.setItem('cartItems', JSON.stringify({ items, totalNumber, ts: Date.now() }));
        // توجه: رزرو فقط در مرحله فاکتور نهایی انجام می‌شود (cart/cart-script.js)
      } catch {}
      // هدایت به صفحه سبد خرید
      window.location.href = 'cart/cart.html';
    });
  }

  function wireOpenClose(){
    if (els.cartBtn){ els.cartBtn.addEventListener('click', e => { e.preventDefault(); openPanel(); }); }
    if (els.closeBtn){ els.closeBtn.addEventListener('click', () => closePanel()); }
    if (els.backdrop){ els.backdrop.addEventListener('click', () => closePanel()); }
    document.addEventListener('keydown', (e)=>{ if(e.key==='Escape') closePanel(); });
  }

  window.addEventListener('DOMContentLoaded', () => {
    queryElements();
    wireOpenClose();
    wireTableEvents();
    wireCheckout();
    wireBuyButtons();
    renderTable();
    // فقط در صفحه اصلی (navbar.html) کارت‌های محصول عمومی را هیدراته کن
    try {
      const isHome = window.location.pathname.includes('navbar.html') || window.location.pathname.endsWith('/') || /index\.html$/i.test(window.location.pathname);
      if (isHome) { hydrateProductGridFromLocalStorage(); }
    } catch {}
  });
})();

// تابع برای تشخیص صفحه فعلی و تغییر دکمه ناوبری
function updateNavigationButton() {
  // محاسبه base تا پوشه frontend برای ساخت لینک مطمئن در تمام صفحات
  const marker = '/frontend/';
  const path = window.location.pathname;
  const idx = path.indexOf(marker);
  const base = idx !== -1 ? path.substring(0, idx + marker.length) : '';

  const currentFile = path.split('/').pop();
  const isAtTable = currentFile === 'billboards-table.html' || currentFile === '' || currentFile === 'index.html';

  const navLinks = document.querySelectorAll('.nav-right a[href*="billboards-table.html"], .nav-right a[href*="navbar.html"]');
  const mobileNavLinks = document.querySelectorAll('.mobile-links a[href*="billboards-table.html"], .mobile-links a[href*="navbar.html"]');

  if (isAtTable) {
    // اگر در صفحه جدول یا ریشه هستیم → دکمه به صفحه اصلی برود
    navLinks.forEach(link => {
      link.href = base + 'navbar.html';
      link.innerHTML = '<b>صفحه اصلی</b>';
    });
    mobileNavLinks.forEach(link => {
      link.href = base + 'navbar.html';
      link.textContent = 'صفحه اصلی';
    });
  } else {
    // در سایر صفحات → دکمه به جدول کل تابلوها برود
    navLinks.forEach(link => {
      link.href = base + 'billboards-table/billboards-table.html';
      link.innerHTML = '<b>جدول کل تابلوها</b>';
    });
    mobileNavLinks.forEach(link => {
      link.href = base + 'billboards-table/billboards-table.html';
      link.textContent = 'جدول کل تابلوها';
    });
  }
}

// خواندن اطلاعات کاربر از localStorage و اعمال روی سکشن‌های ناوبار
function applyStoredUserToNavbar() {
  try {
    const stored = JSON.parse(localStorage.getItem("userProfile") || "{}");
    if (!stored || typeof stored !== "object") return;

    // دسکتاپ
    const desktopName = document.querySelector(".user-name");
    const desktopRole = document.querySelector(".user-role");
    if (desktopName && stored.fullName) desktopName.textContent = stored.fullName;
    if (desktopRole && stored.role) desktopRole.textContent = stored.role;

    // موبایل
    const mobileName = document.querySelector(".mobile-user-name");
    const mobileRole = document.querySelector(".mobile-user-role");
    if (mobileName && stored.fullName) mobileName.textContent = stored.fullName;
    if (mobileRole && stored.role) mobileRole.textContent = stored.role;
  } catch(e) {
    // در صورت نبود JSON معتبر، نادیده بگیر
  }
}

// رندر خودکار کارت‌های محصول ذخیره‌شده از localStorage در صفحه اصلی
function hydrateProductGridFromLocalStorage(){
  const container = document.querySelector('.product-sec-new .row');
  if (!container) return;
  
  // Clear all existing content first
  container.innerHTML = '';
  
  // Reset product cards from billboards data to ensure consistency
  resetProductCardsFromBillboards();
  
  const cards = JSON.parse(localStorage.getItem('productCards') || '[]');
  const reserved = new Set((JSON.parse(localStorage.getItem('reservedBillboards')||'[]')||[]).map(i=>String(i.id)));
  
  if (!Array.isArray(cards) || !cards.length) {
    // Show message if no products
    container.innerHTML = `
      <div class="col-12" style="text-align: center; padding: 40px; color: #718096;">
        <i class="fa-solid fa-billboard" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
        <h3>هیچ تابلو تبلیغاتی یافت نشد</h3>
        <p>برای مشاهده تابلوها، ابتدا از جدول تابلوها یک تابلو اضافه کنید</p>
      </div>
    `;
    return;
  }
  
  cards.forEach(card => {
    const col = document.createElement('div');
    col.className = 'col-lg-3 col-md-4 col-sm-6 col-xs-12 ';
    const priceText = card.priceNumber ? `${card.priceNumber}$` : '';
    col.innerHTML = `
      <div class="shoping-card" data-id="${card.id||''}" data-code="${card.billboardCode||''}" data-ownership="${card.ownership||''}" data-length="${card.length||''}" data-width="${card.width||''}" data-square="${card.squareMeter||''}">
        <div class="img-sec">
          <img src="${card.image || 'images/products/h1.jpg'}" alt="" />
          ${reserved.has(String(card.id||card.billboardCode||card.image||((card.title||'')+'-'+(card.priceNumber||'')))) ? '<span class="hot-offer">رزرو شده</span>' : ''}
        </div>
        <div class="title">بیلبورد</div>
        <div style="display: none;" class="titlee">${card.title || 'بیلبورد'}</div>
        <div class="buttons">
          <div class="right"><span class="price">${priceText}</span></div>
          <div class="left">
            <div class="extend-btn">
              <a class="b-text" href="">خرید</a>
              <a class="b-icon" href=""><i class="fas fa-shopping-cart"></i></a>
            </div>
          </div>
        </div>
      </div>
    `;
    container.appendChild(col);
  });
}

// تابع خروج از سیستم
function logout() {
  if (confirm("آیا مطمئن هستید که می‌خواهید از سیستم خارج شوید؟")) {
    // در یک برنامه واقعی، اینجا session پاک می‌شود و به صفحه login هدایت می‌شود
    // showNotification("در حال خروج از سیستم...", "info");
    // Arad holding authentication (احراز هویت آرین)
    try { localStorage.removeItem('auth'); localStorage.removeItem('userProfile'); } catch {}
    showNotification("خروج انجام شد. در حال انتقال به صفحه ورود...", "info");
    setTimeout(() => {
      // دیگر ریدایرکت اجباری انجام نمی‌شود
    }, 600);
  }
}

// تابع بارگذاری شهرها در navbar
function loadCitiesToNavbar() {
  try {
    const cities = JSON.parse(localStorage.getItem('cities') || '[]');
    const activeCities = cities.filter(c => c.status === 'active');
    // محاسبه base تا پوشه frontend
    const marker = '/frontend/';
    const path = window.location.pathname;
    const idx = path.indexOf(marker);
    const base = idx !== -1 ? path.substring(0, idx + marker.length) : '';
    // آیا الان در پوشه city list هستیم؟
    const inCityFolder = /\/city%20list\//i.test(path) || /\/city list\//i.test(decodeURIComponent(path));
    
    // Update desktop navbar dropdown
    const desktopDropdown = document.getElementById('desktopCityDropdown');
    if (desktopDropdown) {
      desktopDropdown.innerHTML = '';
      activeCities.forEach(city => {
        const link = document.createElement('a');
        const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
        link.href = inCityFolder ? `${citySlug}.html` : `${base}city list/${citySlug}.html`;
        link.textContent = city.name;
        desktopDropdown.appendChild(link);
      });
    }
    
    // Update mobile navbar dropdown
    const mobileDropdown = document.getElementById('mobileCityDropdown');
    if (mobileDropdown) {
      mobileDropdown.innerHTML = '';
      activeCities.forEach(city => {
        const link = document.createElement('a');
        const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
        link.href = inCityFolder ? `${citySlug}.html` : `${base}city list/${citySlug}.html`;
        link.textContent = city.name;
        mobileDropdown.appendChild(link);
      });
    }
    
    // Create city pages if they don't exist
    createCityPagesIfNeeded(activeCities);
  } catch (error) {
    console.log('Error loading cities to navbar:', error);
  }
}

// Function to create city pages if they don't exist
function createCityPagesIfNeeded(cities) {
  try {
    const cityPages = JSON.parse(localStorage.getItem('cityPages') || '{}');
    
    cities.forEach(city => {
      const citySlug = city.name.toLowerCase().replace(/\s+/g, '-');
      
      if (!cityPages[citySlug]) {
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
        
        cityPages[citySlug] = cityPageContent;
      }
    });
    
    localStorage.setItem('cityPages', JSON.stringify(cityPages));
  } catch (error) {
    console.log('Error creating city pages:', error);
  }
}

// تابع نمایش اعلان
function showNotification(message, type = "info") {
  // ایجاد عنصر اعلان
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
  
  // اضافه کردن استایل‌ها
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
  
  // اضافه کردن به صفحه
  document.body.appendChild(notification);
  
  // حذف بعد از 3 ثانیه
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease";
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// Filter System Functions
let allProducts = [];
let filteredProducts = [];
let currentFilters = {
  search: '',
  labels: [],
  ownership: []
};

// Initialize filter system
function initializeFilterSystem() {
  // Load all products from localStorage
  loadAllProducts();
  // اگر روی صفحه شهر هستیم، فقط محصولات همان شهر را نگه داریم
  try {
    const body = document.body;
    const currentCity = (body && body.getAttribute('data-city')) ? body.getAttribute('data-city') : '';
    if (currentCity) {
      const norm = v => String(v||'').trim().toLowerCase();
      allProducts = (allProducts||[]).filter(p => norm(p.city) === norm(currentCity));
      filteredProducts = [...allProducts];
    }
  } catch {}
  
  // Load ownership options from partners
  loadOwnershipOptions();
  
  // Set up event listeners
  setupFilterEventListeners();
  
  // Initial render
  renderProducts();
}

// Load all products from localStorage
function loadAllProducts() {
  try {
    const productCards = JSON.parse(localStorage.getItem('productCards') || '[]');
    const billboardsData = JSON.parse(localStorage.getItem('billboardsData') || '[]');
    
    // Remove duplicates from productCards first
    const uniqueCards = [];
    const seenIds = new Set();
    const seenCodes = new Set();
    
    productCards.forEach(card => {
      const id = card.id || '';
      const code = card.billboardCode || '';
      
      // Skip if we've already seen this id or code
      if ((id && seenIds.has(id)) || (code && seenCodes.has(code))) {
        return;
      }
      
      if (id) seenIds.add(id);
      if (code) seenCodes.add(code);
      uniqueCards.push(card);
    });
    
    // Merge product cards with billboard data
    allProducts = uniqueCards.map(card => {
      const billboard = billboardsData.find(b => b.id === card.id);
      return {
        ...card,
        ...billboard,
        // Add filter labels based on billboard status
        labels: getProductLabels(billboard),
        ownership: billboard?.ownership || 'نامشخص'
      };
    });
    
    filteredProducts = [...allProducts];
    console.log(`Loaded ${allProducts.length} products for filtering`);
  } catch (error) {
    console.error('Error loading products:', error);
    allProducts = [];
    filteredProducts = [];
  }
}

// Get product labels based on billboard status
function getProductLabels(billboard) {
  const labels = [];
  
  if (!billboard) return labels;
  
  if (billboard.isReserved) {
    labels.push('reserved');
  } else if (billboard.isEmpty) {
    labels.push('available');
  }
  
  if (billboard.isCultural) {
    labels.push('cultural');
  }
  
  if (billboard.isBroadcasting) {
    labels.push('broadcasting');
  }
  
  // Add inactive label for inactive billboards
  if (billboard.isInactive) {
    labels.push('inactive');
  }
  
  return labels;
}

// Load ownership options from partners
function loadOwnershipOptions() {
  try {
    const partners = JSON.parse(localStorage.getItem('partners') || '[]');
    const ownershipFilter = document.getElementById('ownershipDropdownMenu');
    
    if (!ownershipFilter) return;
    
    ownershipFilter.innerHTML = '';
    
    // Add "همه" option
    const allOption = createDropdownItem('all', 'همه', 'allOwnership');
    ownershipFilter.appendChild(allOption);
    
    // Add partner options
    partners.forEach(partner => {
      const option = createDropdownItem(partner.name, partner.name, `ownership_${partner.id}`);
      ownershipFilter.appendChild(option);
    });
    
    // Add "نامشخص" option
    const unknownOption = createDropdownItem('نامشخص', 'نامشخص', 'ownership_unknown');
    ownershipFilter.appendChild(unknownOption);
    
  } catch (error) {
    console.error('Error loading ownership options:', error);
  }
}

// Create checkbox item element
function createCheckboxItem(value, text, id) {
  const label = document.createElement('label');
  label.className = 'checkbox-item';
  label.innerHTML = `
    <input type="checkbox" value="${value}" id="${id}">
    <span class="checkmark"></span>
    ${text}
  `;
  return label;
}

// Create dropdown item element
function createDropdownItem(value, text, id) {
  const label = document.createElement('label');
  label.className = 'dropdown-item';
  label.innerHTML = `
    <input type="checkbox" value="${value}" id="${id}">
    <span class="checkmark"></span>
    ${text}
  `;
  return label;
}

// Setup filter event listeners
function setupFilterEventListeners() {
  // Search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) {
    searchInput.addEventListener('input', debounce(handleSearchInput, 300));
  }
  
  // Dropdown toggles
  setupDropdownToggle('labelDropdownToggle', 'labelDropdownMenu');
  setupDropdownToggle('ownershipDropdownToggle', 'ownershipDropdownMenu');
  
  // Label checkboxes
  document.addEventListener('change', (e) => {
    if (e.target.id && ['filterReserved', 'filterAvailable', 'filterInactive'].includes(e.target.id)) {
      handleLabelFilter();
      updateDropdownText('labelDropdownToggle', 'labelDropdownMenu');
    }
  });
  
  // Ownership checkboxes
  document.addEventListener('change', (e) => {
    if (e.target.id && e.target.id.startsWith('ownership_')) {
      handleOwnershipFilter();
      updateDropdownText('ownershipDropdownToggle', 'ownershipDropdownMenu');
    }
  });
  
  // Close dropdowns when clicking outside
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.custom-dropdown')) {
      closeAllDropdowns();
    }
  });
}

// Setup dropdown toggle functionality
function setupDropdownToggle(toggleId, menuId) {
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  const container = toggle ? toggle.closest('.custom-dropdown') : null;
  
  if (toggle && menu) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = menu.classList.contains('show');
      // ابتدا همه را ببند
      closeAllDropdowns();
      // اگر قبلاً باز بوده، دیگر بازش نکن (یعنی همین کلیک باعث بستن شود)
      if (!isOpen) {
        toggle.classList.add('active');
        menu.classList.add('show');
      }
    });

    // امکان بستن با کلیک روی محدوده خود فیلد (نه فقط بیرون)
    if (container) {
      container.addEventListener('click', (e) => {
        // اگر روی خود container کلیک شد (نه روی آیتم‌های منو یا چک‌باکس‌ها)
        const clickedInsideMenu = !!e.target.closest('.dropdown-menu');
        const clickedOnToggle = !!e.target.closest('.dropdown-toggle');
        if (!clickedInsideMenu && !clickedOnToggle) {
          // اگر منو باز است، ببند
          if (menu.classList.contains('show')) {
            menu.classList.remove('show');
            toggle.classList.remove('active');
          } else {
            // در غیر این صورت، مشابه کلیک روی toggle عمل کن
            closeAllDropdowns();
            toggle.classList.add('active');
            menu.classList.add('show');
          }
        }
      });
    }
  }
}

// Close all dropdowns
function closeAllDropdowns() {
  document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
    toggle.classList.remove('active');
  });
  document.querySelectorAll('.dropdown-menu').forEach(menu => {
    menu.classList.remove('show');
  });
}

// Update dropdown text based on selected items
function updateDropdownText(toggleId, menuId) {
  const toggle = document.getElementById(toggleId);
  const menu = document.getElementById(menuId);
  
  if (!toggle || !menu) return;
  
  const selectedItems = menu.querySelectorAll('input[type="checkbox"]:checked');
  const textSpan = toggle.querySelector('.dropdown-text');
  
  if (selectedItems.length === 0) {
    textSpan.textContent = toggleId === 'labelDropdownToggle' ? 'انتخاب لیبل' : 'انتخاب مالکیت';
  } else if (selectedItems.length === 1) {
    textSpan.textContent = selectedItems[0].nextElementSibling.nextElementSibling.textContent;
  } else {
    textSpan.textContent = `${selectedItems.length} مورد انتخاب شده`;
  }
}

// Handle search input
function handleSearchInput(e) {
  currentFilters.search = e.target.value.toLowerCase().trim();
  applyFilters();
}

// Handle label filter
function handleLabelFilter() {
  const selectedLabels = [];
  document.querySelectorAll('input[type="checkbox"][value="reserved"]:checked, input[type="checkbox"][value="available"]:checked, input[type="checkbox"][value="inactive"]:checked').forEach(checkbox => {
    selectedLabels.push(checkbox.value);
  });
  
  currentFilters.labels = selectedLabels;
  applyFilters();
}

// Handle ownership filter
function handleOwnershipFilter() {
  const selectedOwnership = [];
  const allChecked = document.getElementById('allOwnership')?.checked;
  
  if (allChecked) {
    // If "همه" is checked, uncheck others
    document.querySelectorAll('input[id^="ownership_"]:not(#allOwnership)').forEach(checkbox => {
      checkbox.checked = false;
    });
    currentFilters.ownership = [];
  } else {
    // Get selected ownership options
    document.querySelectorAll('input[id^="ownership_"]:checked').forEach(checkbox => {
      selectedOwnership.push(checkbox.value);
    });
    
    // If any specific option is checked, uncheck "همه"
    if (selectedOwnership.length > 0) {
      const allCheckbox = document.getElementById('allOwnership');
      if (allCheckbox) allCheckbox.checked = false;
    }
    
    currentFilters.ownership = selectedOwnership;
  }
  
  applyFilters();
}

// Apply all filters
function applyFilters() {
  filteredProducts = allProducts.filter(product => {
    // Search filter
    if (currentFilters.search) {
      const searchTerm = currentFilters.search;
      const searchableText = [
        product.title || '',
        product.billboardCode || '',
        product.city || '',
        product.region || '',
        product.position || '',
        product.ownership || ''
      ].join(' ').toLowerCase();
      
      if (!searchableText.includes(searchTerm)) {
        return false;
      }
    }
    
    // Label filter
    if (currentFilters.labels.length > 0) {
      const hasMatchingLabel = currentFilters.labels.some(label => 
        product.labels && product.labels.includes(label)
      );
      if (!hasMatchingLabel) {
        return false;
      }
    }
    
    // Ownership filter
    if (currentFilters.ownership.length > 0) {
      if (!currentFilters.ownership.includes(product.ownership)) {
        return false;
      }
    }
    
    return true;
  });
  
  renderProducts();
  updateFilterResults();
}

// Render filtered products
function renderProducts() {
  const container = document.getElementById('productsContainer');
  if (!container) return;
  
  // Clear existing products
  container.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    container.innerHTML = `
      <div class="no-products" style="grid-column: 1 / -1; text-align: center; padding: 40px; color: #718096;">
        <i class="fa-solid fa-search" style="font-size: 48px; margin-bottom: 20px; opacity: 0.5;"></i>
        <h3>محصولی یافت نشد</h3>
        <p>لطفاً فیلترهای جستجو را تغییر دهید</p>
      </div>
    `;
    return;
  }
  
  // Remove duplicates before rendering
  const uniqueProducts = [];
  const seenIds = new Set();
  const seenCodes = new Set();
  
  filteredProducts.forEach(product => {
    const id = product.id || '';
    const code = product.billboardCode || '';
    
    // Skip if we've already seen this id or code
    if ((id && seenIds.has(id)) || (code && seenCodes.has(code))) {
      return;
    }
    
    if (id) seenIds.add(id);
    if (code) seenCodes.add(code);
    uniqueProducts.push(product);
  });
  
  // Render product cards
  uniqueProducts.forEach(product => {
    const productCard = createProductCard(product);
    container.appendChild(productCard);
  });
}

// Create product card element
function createProductCard(product) {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-md-4 col-sm-6 col-xs-12';
  
  // Determine product status
  const isReserved = product.isReserved || product.labels?.includes('reserved');
  const isAvailable = product.isEmpty || product.labels?.includes('available');
  const isInactive = product.isInactive || product.labels?.includes('inactive');
  
  card.innerHTML = `
    <div class="shoping-card">
      <div class="img-sec">
        <img src="${product.image || 'images/products/h1.jpg'}" alt="${product.title}" />
        ${isReserved ? '<span class="hot-offer">رزرو شده</span>' : ''}
        ${isInactive ? '<span class="inactive-offer">غیرفعال</span>' : ''}
      </div>
      <div class="title">${product.title || 'بیلبورد'}</div>
      <div style="display: none;" class="titlee">${product.title || 'بیلبورد'}</div>
      <div class="buttons">
        <div class="right"><span class="price">${product.priceNumber || 0}$</span></div>
        <div class="left">
          <div class="extend-btn">
            <a class="b-text" href="#" onclick="addToCart(${product.id})">خرید</a>
            <a class="b-icon" href="#" onclick="addToCart(${product.id})"><i class="fas fa-shopping-cart"></i></a>
          </div>
        </div>
      </div>
    </div>
  `;
  
  return card;
}


// Update filter results display
function updateFilterResults() {
  const resultsText = `نمایش ${filteredProducts.length} از ${allProducts.length} محصول`;
  
  // Remove existing results display
  const existingResults = document.querySelector('.filter-results');
  if (existingResults) {
    existingResults.remove();
  }
  
  // Add new results display
  const filterContainer = document.querySelector('.filter-container');
  if (filterContainer) {
    const resultsDiv = document.createElement('div');
    resultsDiv.className = 'filter-results';
    resultsDiv.innerHTML = `<p>${resultsText}</p>`;
    filterContainer.appendChild(resultsDiv);
  }
}

// Clear all filters
function clearFilters() {
  // Clear search input
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
  
  // Uncheck all checkboxes
  document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
  
  // Close all dropdowns
  closeAllDropdowns();
  
  // Reset dropdown texts
  updateDropdownText('labelDropdownToggle', 'labelDropdownMenu');
  updateDropdownText('ownershipDropdownToggle', 'ownershipDropdownMenu');
  
  // Reset filters
  currentFilters = {
    search: '',
    labels: [],
    ownership: []
  };
  
  // Reset products
  filteredProducts = [...allProducts];
  renderProducts();
  updateFilterResults();
  
  showNotification('فیلترها پاک شدند', 'info');
}

// Debounce function
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

// Clean up duplicate product cards in localStorage
function cleanupDuplicateProductCards() {
  try {
    const cards = JSON.parse(localStorage.getItem('productCards') || '[]');
    if (!Array.isArray(cards) || cards.length === 0) return;
    
    const uniqueCards = [];
    const seenIds = new Set();
    const seenCodes = new Set();
    
    cards.forEach(card => {
      const id = card.id || '';
      const code = card.billboardCode || '';
      
      // Skip if we've already seen this id or code
      if ((id && seenIds.has(id)) || (code && seenCodes.has(code))) {
        return;
      }
      
      if (id) seenIds.add(id);
      if (code) seenCodes.add(code);
      uniqueCards.push(card);
    });
    
    // Only update if we found duplicates
    if (uniqueCards.length !== cards.length) {
      localStorage.setItem('productCards', JSON.stringify(uniqueCards));
      console.log(`Cleaned up ${cards.length - uniqueCards.length} duplicate product cards`);
    }
  } catch (error) {
    console.error('Error cleaning up duplicate product cards:', error);
  }
}

// Function to completely reset product cards from billboards data
function resetProductCardsFromBillboards() {
  try {
    const billboards = JSON.parse(localStorage.getItem('billboardsData') || '[]');
    const productCards = [];
    const seenIds = new Set();
    const seenCodes = new Set();
    
    billboards.forEach(billboard => {
      // Only create card if billboard has valid product card data
      if (billboard.productCard && (billboard.productCard.imageDataUrl || billboard.productCard.title)) {
        const id = billboard.id || '';
        const code = billboard.billboardCode || '';
        
        // Skip if we've already seen this id or code
        if ((id && seenIds.has(id)) || (code && seenCodes.has(code))) {
          return;
        }
        
        if (id) seenIds.add(id);
        if (code) seenCodes.add(code);
        
        const cardData = {
          id: billboard.id,
          billboardCode: billboard.billboardCode || "",
          ownership: billboard.ownership || "",
          length: billboard.length || "",
          width: billboard.width || "",
          squareMeter: billboard.squareMeter || "",
          title: billboard.productCard.title,
          priceNumber: billboard.productCard.priceNumber || 0,
          image: billboard.productCard.imageDataUrl || ""
        };
        productCards.push(cardData);
      }
    });
    
    localStorage.setItem('productCards', JSON.stringify(productCards));
    console.log(`Reset product cards from ${billboards.length} billboards, created ${productCards.length} unique cards`);
  } catch (error) {
    console.error('Error resetting product cards:', error);
  }
}

// Function to clear all product cards and reset
function clearAllProductCards() {
  try {
    localStorage.removeItem('productCards');
    console.log('All product cards cleared');
  } catch (error) {
    console.error('Error clearing product cards:', error);
  }
}

// Initialize filter system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize on navbar.html page
  if (window.location.pathname.includes('navbar.html') || window.location.pathname.endsWith('/')) {
    // Clear all existing product cards first
    clearAllProductCards();
    
    // Reset from billboards data
    resetProductCardsFromBillboards();
    
    // Initialize filter system
    initializeFilterSystem();
  }
});

