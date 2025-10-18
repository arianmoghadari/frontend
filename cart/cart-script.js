(function(){
	const els = {
		tableBody: null,
		total: null,
		btnProforma: null,
		btnInvoice: null,
		personForm: null,
		invoiceName: null,
		includeBanner: null,
		bannerPrice: null,
		bannerPriceRow: null,
		docNumber: null,
		genderTitle: null,
		personTypeRadios: null,
		genderRow: null,
		startDate: null,
		endDate: null,
		calendarTypeRadios: null,
		jStartYear: null,
		jStartMonth: null,
		jStartDay: null,
		jEndYear: null,
		jEndMonth: null,
		jEndDay: null,
	};

	function currencyFormatter(value){
		try {
			const number = Number(String(value).replace(/[^0-9.]/g, '')) || 0;
			return new Intl.NumberFormat('fa-IR', { maximumFractionDigits: 2 }).format(number);
		} catch { return String(value); }
	}

	function loadCart(){
		try {
			const raw = localStorage.getItem('cartItems');
			if (!raw) return { items: [], totalNumber: 0 };
			const parsed = JSON.parse(raw);
			if (!parsed || !Array.isArray(parsed.items)) return { items: [], totalNumber: 0 };
			return { items: parsed.items, totalNumber: Number(parsed.totalNumber)||0 };
		} catch { return { items: [], totalNumber: 0 }; }
	}

	function persistCart(items){
		try { localStorage.setItem('cartItems', JSON.stringify({ items, totalNumber: items.reduce((s,i)=>{ const unit=Number(i.priceNumber)||0; const d=Math.min(100,Math.max(0,Number(i.discountPercent)||0)); return s + (unit*(1-d/100))*(i.qty||1); },0), ts: Date.now() })); } catch {}
	}

	function render(){
		const { items } = loadCart();
		els.tableBody.innerHTML = '';
		let total = 0;
		items.forEach((item, idx) => {
			const row = document.createElement('tr');
			const unit = Number(item.priceNumber||0);
			const discount = Math.min(100, Math.max(0, Number(item.discountPercent)||0));
			const discountedUnit = unit * (1 - discount/100);
			const line = discountedUnit * (item.qty||1); total += line;
			row.innerHTML = `
				<td><img class="cart-item-thumb" src="${item.image||''}" alt="${item.title||''}"></td>
				<td>${item.title||''}</td>
				<td><input class="price-input" type="number" min="0" step="0.01" value="${unit}" data-id="${item.id}"></td>
				<td><input class="disc-input" type="number" min="0" max="100" value="${discount}" data-id="${item.id}"></td>
				<td><input class="qty-input" type="number" min="1" value="${item.qty||1}" data-id="${item.id}"></td>
				<td><input class="start-date-input" type="text" placeholder="YYYY/MM/DD" value="${item.startDate||''}" data-id="${item.id}"></td>
				<td><input class="end-date-input" type="text" placeholder="YYYY/MM/DD" value="${item.endDate||''}" data-id="${item.id}"></td>
				<td>${currencyFormatter(line)}</td>
				<td><button class="remove-btn" data-id="${item.id}">×</button></td>
			`;
			els.tableBody.appendChild(row);
		});
		els.total.textContent = currencyFormatter(total);
		els.btnProforma.disabled = items.length === 0;
		els.btnInvoice.disabled = items.length === 0;
	}

	function onQtyChange(e){
		const input = e.target.closest('.qty-input');
		if (!input) return;
		const id = String(input.dataset.id);
		const qty = Math.max(1, Number(input.value)||1);
		const data = loadCart();
		const item = data.items.find(i => String(i.id) === id);
		if (item){ item.qty = qty; persistCart(data.items); render(); }
	}

	function onDiscountChange(e){
		const input = e.target.closest('.disc-input');
		if (!input) return;
		const id = String(input.dataset.id);
		const p = Math.min(100, Math.max(0, Number(input.value)||0));
		const data = loadCart();
		const item = data.items.find(i => String(i.id) === id);
		if (item){ item.discountPercent = p; persistCart(data.items); render(); }
	}

	function onPriceChange(e){
		const input = e.target.closest('.price-input');
		if (!input) return;
		const id = String(input.dataset.id);
		const price = Math.max(0, Number(input.value)||0);
		const data = loadCart();
		const item = data.items.find(i => String(i.id) === id);
		if (item){ item.priceNumber = price; persistCart(data.items); render(); }
	}

	function onDateChange(e){
		const s = e.target.closest('.start-date-input');
		const en = e.target.closest('.end-date-input');
		if (!s && !en) return;
		const el = s || en;
		const id = String(el.dataset.id);
		const data = loadCart();
		const item = data.items.find(i => String(i.id) === id);
		if (!item) return;
		if (s){ item.startDate = el.value; }
		if (en){ item.endDate = el.value; }
		persistCart(data.items);
	}

	function onRemove(e){
		const btn = e.target.closest('.remove-btn');
		if (!btn) return;
		const id = String(btn.dataset.id);
		const data = loadCart();
		const next = data.items.filter(i => String(i.id) !== id);
		persistCart(next); render();
	}

	function printSection(html){
		const printWindow = window.open('', '_blank');
		if (!printWindow) return;
		printWindow.document.open();
		// Compute absolute base (works with file:/// and http://) to resolve images in print window
		const marker = '/frontend/';
		const href = window.location.href;
		const i = href.indexOf(marker);
		const base = i !== -1 ? href.substring(0, i + marker.length) : href;
        printWindow.document.write(`<!DOCTYPE html><html lang="fa" dir="rtl"><head><meta charset="utf-8"><title>پرینت</title><base href="${base}"><style>
            @page { size: A4 portrait; margin: 0; }
            html,body{height:100%}
            body{font-family: calibri, tahoma, sans-serif; direction: rtl; position:relative; margin:0;}
            .print-header{position: fixed; top:0; left:0; right:0; height: 40mm;}
            .print-footer{position: fixed; bottom:0; left:0; right:0; height: 30mm;}
            .print-header img, .print-footer img{width:100%; height:100%; object-fit: cover; display:block;}
            .content{position: relative; padding: 0 12mm; margin-top: 42mm; margin-bottom: 32mm;}
			/* section styles */
			.header-wrap{position: relative; padding: 12px 10px 8px; border-bottom: 2px solid #0f1838; background: #fff;}
			.brand-row{display:flex; align-items:center; justify-content: space-between;}
			.brand-left{display:flex; align-items:center; gap:12px;}
			.brand-logo{width:90px; height:60px; background:#e9eef5; border:1px solid #cbd5e0; border-radius:8px; display:grid; place-items:center; color:#0f1838; font-weight:800}
			.brand-title{font-size: 18px; font-weight: 800; color:#0f1838}
			.brand-sub{font-size: 11px; color:#4a5568}
			.doc-meta{font-size: 12px; color:#2d3748; display:flex; gap:16px}
			.subject{margin: 14px 0 8px; font-weight: 700;}
            .paragraph{line-height: 1.9; font-size: 13px; color:#1a202c}
            .letter-body{font-size:13px; line-height:2.1; color:#1a202c}
            .letter-body p{margin: 6px 0}
			.signature{margin-top: 20px;}
			/* table */
			table{width:100%; border-collapse: collapse; margin-top:12px}
			th,td{border:1px solid #ccc; padding:6px; text-align:center; font-size:12px}
			thead th{background:#f7fafc}
			/* Hide product image column in print */
			.cart-table td:first-child,
			.cart-table th:first-child,
			.cart-item-thumb{ display:none !important; }
		</style></head><body>
			<div class="print-header"><img src="../formA4/Picture1.png" alt="header"/></div>
			<div class="print-footer"><img src="../formA4/Picture2.png" alt="footer"/></div>
			<div class="content">${html}</div>
		</body></html>`);
		printWindow.document.close();
		printWindow.focus();
		printWindow.print();
		printWindow.close();
	}

	function generateUniqueNumber(prefix){
		const ts = Date.now();
		const rand = Math.floor(Math.random()*1e6).toString().padStart(6,'0');
		return `${prefix}-${ts}-${rand}`;
	}

	function getOrderMeta(type){
		const personType = (els.personForm?.querySelector('input[name="personType"]:checked')?.value)||'natural';
		const invoiceName = (els.invoiceName?.value||'').trim();
		const includeBanner = !!els.includeBanner?.checked;
		const bannerPrice = includeBanner ? Math.max(0, Number(els.bannerPrice?.value)||0) : 0;
		const currentDoc = (els.docNumber?.value || els.docNumber?.textContent || '—');
		const docNumber = currentDoc !== '—' ? currentDoc : generateUniqueNumber(type==='invoice'?'INV':'PRO');
		const genderTitle = els.genderTitle ? els.genderTitle.value : 'mr';
		const startDate = els.startDate ? els.startDate.value : '';
		const endDate = els.endDate ? els.endDate.value : '';
		return { personType, invoiceName, includeBanner, bannerPrice, docNumber, genderTitle, startDate, endDate };
	}

	function saveProformaRecord(record){
		try{
			const list = JSON.parse(localStorage.getItem('proformas')||'[]');
			list.push(record);
			localStorage.setItem('proformas', JSON.stringify(list));
		}catch{}
	}

	function handleProforma(){
		const meta = getOrderMeta('proforma');
		if (els.docNumber){ if ('value' in els.docNumber) els.docNumber.value = meta.docNumber; else els.docNumber.textContent = meta.docNumber; }
		const nowFa = new Date().toLocaleDateString('fa-IR');
		const personLabel = meta.personType === 'legal' ? 'مجموعه' : (meta.genderTitle === 'mr' ? 'جناب آقای' : 'سرکار خانم');
		const addressee = `${personLabel} ${meta.invoiceName || ''}`.trim();
		const bannerLine = meta.includeBanner ? `<div>هزینه چاپ بنر: ${currencyFormatter(meta.bannerPrice)}</div>` : '';
		// Build print table with custom columns (row, unit price, discount, start, end)
		const { items } = loadCart();
		let rowsHtml = '';
		items.forEach((it, i) => {
			const unit = Number(it.priceNumber||0);
			const disc = Math.min(100, Math.max(0, Number(it.discountPercent)||0));
			const code = String(it.id||it.billboardCode||'—');
			rowsHtml += `<tr><td>${i+1}</td><td>${it.title||'—'}</td><td>${code}</td><td>${currencyFormatter(unit)}</td><td>${disc ? disc+'%' : '—'}</td><td>${it.startDate||'—'}</td><td>${it.endDate||'—'}</td></tr>`;
		});
		const printTable = `<table class="cart-table"><thead><tr><th>ردیف</th><th>عنوان</th><th>کد تابلو</th><th>قیمت واحد</th><th>تخفیف</th><th>تاریخ شروع</th><th>تاریخ پایان</th></tr></thead><tbody>${rowsHtml}</tbody></table>`;
		const firstPage = `
			<div class="header-wrap">
				<div class="brand-row">
					<div class="brand-left">
						<div class="brand-logo">ARAD</div>
						<div>
							<div class="brand-title">آراد هلدینگ</div>
							<div class="brand-sub">بزرگترین صاحب رسانه تبلیغات محیطی در سراسر کشور</div>
						</div>
					</div>
					<div class="doc-meta">
						<div>شماره: ${meta.docNumber}<br>تاریخ: ${nowFa}</div>
					</div>
				</div>
				<div class="subject">موضوع: ارائه پکیج تبلیغاتی محیطی کشور</div>
				<div class="letter-body">
					<p>${addressee}</p>
					<p>با سلام</p>
					<p>احتراماً ضمن آرزوی توفیق روز افزون برای حضرتعالی و همکاران محترمتان.</p>
					<p>به استحضار می‌رسد پیرو مذاکرات تلفنی فی‌مابین در خصوص ارائه تبلیغات محیطی در سراسر کشور، این مجموعه به عنوان بزرگترین صاحب رسانه تبلیغات محیطی در سراسر کشور با بیش از ۷۵۰ تابلو تبلیغاتی در حال فعالیت می‌باشد.</p>
					<p>فلذا این مجموعه پیشنهادات خویش را جهت شروع همکاری به شرح پیوست تقدیم حضور می‌دارد.</p>
					<p>امید است این خدمات موجب گسترش همکاری فی‌مابین و زمینه‌ای برای توسعه اقتصادی دو طرف گردد.</p>
					${bannerLine}
				</div>
			</div>
			<hr style="border:0;border-top:3px solid #0f1838;margin:12px 0;">
			${printTable}
		`;
		// Store payload and navigate to A4 preview page
		try {
			localStorage.setItem('printPayload', JSON.stringify({
				type: 'proforma',
				docNumber: meta.docNumber,
				createdAtFa: nowFa,
				html: firstPage
			}));
			const marker = '/frontend/';
			const href = window.location.href;
			const i = href.indexOf(marker);
			const base = i !== -1 ? href.substring(0, i + marker.length) : href;
			window.location.href = base + 'formA4/formA4.html';
		}catch{}
		try{
			const { items } = loadCart();
			const total = Number((els.total?.textContent||'0').replace(/[^0-9.]/g,''))||0;
			saveProformaRecord({ id: meta.docNumber, createdAt: Date.now(), personType: meta.personType, invoiceName: meta.invoiceName, includeBanner: meta.includeBanner, bannerPrice: meta.bannerPrice, items, total, status: 'proforma', genderTitle: meta.genderTitle });
		}catch{}
	}

	function handleInvoice(){
		const meta = getOrderMeta('invoice');
		if (els.docNumber){ if ('value' in els.docNumber) els.docNumber.value = meta.docNumber; else els.docNumber.textContent = meta.docNumber; }
		const nowFa = new Date().toLocaleDateString('fa-IR');
		const personLabel = meta.personType === 'legal' ? 'مجموعه' : (meta.genderTitle === 'mr' ? 'جناب آقای' : 'سرکار خانم');
		const addressee = `${personLabel} ${meta.invoiceName || ''}`.trim();
		const bannerLine = meta.includeBanner ? `<div>هزینه چاپ بنر: ${currencyFormatter(meta.bannerPrice)}</div>` : '';
		const { items } = loadCart();
		let rowsHtml = '';
		items.forEach((it, i) => {
			const unit = Number(it.priceNumber||0);
			const disc = Math.min(100, Math.max(0, Number(it.discountPercent)||0));
			const code = String(it.id||it.billboardCode||'—');
			rowsHtml += `<tr><td>${i+1}</td><td>${it.title||'—'}</td><td>${code}</td><td>${currencyFormatter(unit)}</td><td>${disc ? disc+'%' : '—'}</td><td>${it.startDate||'—'}</td><td>${it.endDate||'—'}</td></tr>`;
		});
		const printTable = `<table class=\"cart-table\"><thead><tr><th>ردیف</th><th>عنوان</th><th>کد تابلو</th><th>قیمت واحد</th><th>تخفیف</th><th>تاریخ شروع</th><th>تاریخ پایان</th></tr></thead><tbody>${rowsHtml}</tbody></table>`;
		const firstPage = `
			<div class="header-wrap">
				<div class="brand-row">
					<div class="brand-left">
						<div class="brand-logo">ARAD</div>
						<div>
							<div class="brand-title">آراد هلدینگ</div>
							<div class="brand-sub">بزرگترین صاحب رسانه تبلیغات محیطی در سراسر کشور</div>
						</div>
					</div>
					<div class="doc-meta">
						<div>شماره: ${meta.docNumber}<br>تاریخ: ${nowFa}</div>
					</div>
				</div>
				<div class="subject">فاکتور نهایی</div>
				<div class="letter-body">
					<p>${addressee}</p>
					<p>با سلام</p>
					<p>احتراماً ضمن آرزوی توفیق روز افزون برای حضرتعالی و همکاران محترمتان.</p>
					<p>به استحضار می‌رسد پیرو مذاکرات تلفنی فی‌مابین در خصوص ارائه تبلیغات محیطی در سراسر کشور، این مجموعه به عنوان بزرگترین صاحب رسانه تبلیغات محیطی در سراسر کشور با بیش از ۷۵۰ تابلو تبلیغاتی در حال فعالیت می‌باشد.</p>
					<p>فلذا این مجموعه پیشنهادات خویش را جهت شروع همکاری به شرح پیوست تقدیم حضور می‌دارد.</p>
					<p>امید است این خدمات موجب گسترش همکاری فی‌مابین و زمینه‌ای برای توسعه اقتصادی دو طرف گردد.</p>
					${bannerLine}
				</div>
			</div>
			<hr style="border:0;border-top:3px solid #0f1838;margin:12px 0;">
			${printTable}
		`;
		// Store payload and navigate to A4 preview page (same as proforma flow)
		try {
			localStorage.setItem('printPayload', JSON.stringify({
				type: 'invoice',
				docNumber: meta.docNumber,
				createdAtFa: nowFa,
				html: firstPage
			}));
			const marker = '/frontend/';
			const href = window.location.href;
			const i = href.indexOf(marker);
			const base = i !== -1 ? href.substring(0, i + marker.length) : href;
			window.location.href = base + 'formA4/formA4.html';
		}catch{}
		// پس از فاکتور نهایی: آیتم‌های سبد را به عنوان رزرو شده ذخیره کن و جدول تابلوها را به‌روز کن
		try{
			const { items } = loadCart();
			const reserved = items.map(i => ({ id: String(i.id), title: i.title, image: i.image, priceNumber: i.priceNumber, qty: i.qty, reservedAt: Date.now() }));
			localStorage.setItem('reservedBillboards', JSON.stringify(reserved));
			// همچنین وضعیت رزرو را در billboardsData و billboardsData در localStorage ست کن
			try {
				const stored = JSON.parse(localStorage.getItem('billboardsData')||'[]');
				let changed = false;
				const reservedIds = new Set(reserved.map(r=>String(r.id)));
				stored.forEach(b => {
					const idStr = String(b.id || b.billboardCode || b.productCard?.title || '');
					if (reservedIds.has(idStr)) { b.isReserved = true; changed = true; }
				});
				if (changed) localStorage.setItem('billboardsData', JSON.stringify(stored));
			} catch {}
		}catch{}
	}

		document.addEventListener('DOMContentLoaded', () => {
		els.tableBody = document.getElementById('cartTableBody');
		els.total = document.getElementById('cartTotal');
		els.btnProforma = document.getElementById('btnProforma');
		els.btnInvoice = document.getElementById('btnInvoice');
		els.personForm = document.querySelector('.order-form');
		els.invoiceName = document.getElementById('invoiceName');
		els.includeBanner = document.getElementById('includeBanner');
		els.bannerPrice = document.getElementById('bannerPrice');
		els.bannerPriceRow = document.getElementById('bannerPriceRow');
		els.docNumber = document.getElementById('docNumber');
		els.genderTitle = document.getElementById('genderTitle');
		els.genderRow = document.getElementById('genderRow');
		els.startDate = document.getElementById('startDate');
		els.endDate = document.getElementById('endDate');
		els.personTypeRadios = document.querySelectorAll('input[name="personType"]');
		// removed calendar radio and jalali elements (per-item dates in table)

		// input: فقط تاریخ‌ها را بدون رندر فوری ذخیره کن تا فیلدها حین تایپ فوکوس از دست ندهند
		els.tableBody.addEventListener('input', e => { onDateChange(e); });
		els.tableBody.addEventListener('change', e => { onQtyChange(e); onDiscountChange(e); onPriceChange(e); onDateChange(e); });
		els.tableBody.addEventListener('click', onRemove);
		if (els.includeBanner && els.bannerPriceRow){
			els.includeBanner.addEventListener('change', () => {
				els.bannerPriceRow.style.display = els.includeBanner.checked ? '' : 'none';
			});
		}
		els.btnProforma.addEventListener('click', handleProforma);
		els.btnInvoice.addEventListener('click', handleInvoice);

		// Toggle gender row based on person type
		const toggleGenderRow = () => {
			const type = (document.querySelector('input[name="personType"]:checked')||{}).value || 'natural';
			if (els.genderRow){ els.genderRow.style.display = type === 'natural' ? '' : 'none'; }
		};
		els.personTypeRadios.forEach(r => r.addEventListener('change', toggleGenderRow));
		toggleGenderRow();

		// Jalali helpers (simple, without external libs)
	// removed calendar toggles and jalali helpers for per-item dates


		render();
	});
})();


