(function(){
	function getQueryParam(name){
		const params = new URLSearchParams(window.location.search);
		return params.get(name) || '';
	}

	function normalizeCity(value){
		return (value||'').trim();
	}

	function detectCity(){
		// Priority: ?city= query > body[data-city] > filename slug mapping
		let city = getQueryParam('city');
		if (city) return city;
		const bodyAttr = document.body.getAttribute('data-city');
		if (bodyAttr) return bodyAttr;
		const filename = (window.location.pathname.split('/').pop()||'').replace(/\.html$/i,'');
		const map = { tehran: 'تهران', isfahan: 'اصفهان', shiraz: 'شیراز', mashhad: 'مشهد', tabriz: 'تبریز' };
		return map[filename] || '';
	}

	function createCityPageIfNeeded(cityName) {
		const citySlug = cityName.toLowerCase().replace(/\s+/g, '-');
		const cityPages = JSON.parse(localStorage.getItem('cityPages') || '{}');
		
		if (!cityPages[citySlug]) {
			// Create city page content
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
			
			cityPages[citySlug] = cityPageContent;
			localStorage.setItem('cityPages', JSON.stringify(cityPages));
		}
	}

	function loadBillboards(){
		try{ return JSON.parse(localStorage.getItem('billboardsData')||'[]')||[]; }catch{ return []; }
	}

	function toCardData(b){
		const price = (b.productCard && b.productCard.priceNumber) || 0;
		const image = (b.productCard && b.productCard.imageDataUrl) || '';
		const title = b.productCard?.title || (b.position || b.billboardCode || 'بیلبورد');
		return {
			id: b.id || b.billboardCode || title,
			title,
			image,
			priceNumber: price,
			city: b.city || ''
		};
	}

	function currency(v){ try{ return Number(v).toLocaleString('fa-IR'); }catch{return String(v);} }

	function renderCards(city){
		const grid = document.getElementById('cardsGrid');
		const countEl = document.getElementById('billboardCount');
		if (!grid || !countEl) return;
		
		// Load billboards and filter by city
		const billboards = loadBillboards();
		const cityBillboards = billboards.filter(b => normalizeCity(b.city) === normalizeCity(city));
		
		// Convert to card data
		const data = cityBillboards.map(toCardData);
		
		countEl.textContent = String(data.length);
		grid.innerHTML = '';
		
		if (data.length === 0) {
			grid.innerHTML = '<div class="no-billboards"><p>هیچ تابلو تبلیغاتی برای این شهر یافت نشد.</p></div>';
			return;
		}
		
		data.forEach(c => {
			const card = document.createElement('div');
			card.className = 'card';
			card.innerHTML = `
				${c.image ? `<img src="${c.image}" alt="${c.title}">` : '<div class="no-image">بدون تصویر</div>'}
				<div class="card-body">
					<div class="title">${c.title}</div>
					<div class="subtitle">${city}</div>
					<div class="price">${currency(c.priceNumber)} تومان</div>
					<div class="actions">
						<button class="btn btn-primary" data-id="${c.id}">افزودن به سبد</button>
					</div>
				</div>
			`;
			grid.appendChild(card);
		});
	}

	function addToCart(cardId){
		try{
			const billboards = loadBillboards();
			const b = billboards.find(x => String(x.id) === String(cardId) || String(x.billboardCode) === String(cardId));
			if (!b) return;
			const pc = b.productCard || {};
			const item = {
				id: String(b.id || b.billboardCode || pc.title || Date.now()),
				title: pc.title || b.position || 'بیلبورد',
				priceNumber: pc.priceNumber || 0,
				image: pc.imageDataUrl || '',
				qty: 1,
				discountPercent: 0
			};
			const raw = localStorage.getItem('cartItems');
			let items = [];
			try { items = JSON.parse(raw||'{}').items || []; } catch {}
			const existing = items.find(i => String(i.id) === String(item.id));
			if (existing){ existing.qty += 1; }
			else { items.push(item); }
			localStorage.setItem('cartItems', JSON.stringify({ items, totalNumber: items.reduce((s,i)=>s+(Number(i.priceNumber)||0)*(i.qty||1),0), ts: Date.now() }));
			alert('به سبد اضافه شد');
		}catch{}
	}

	document.addEventListener('DOMContentLoaded', () => {
		const city = detectCity();
		const title = document.getElementById('cityTitle');
		if (title){ title.textContent = city ? `بیلبوردهای شهر ${city}` : 'بیلبوردهای شهر'; }
		
		// Create city page if needed
		if (city) {
			createCityPageIfNeeded(city);
		}
		
		renderCards(city);
		document.getElementById('cardsGrid')?.addEventListener('click', e => {
			const btn = e.target.closest('button.btn-primary');
			if (!btn) return;
			addToCart(btn.dataset.id);
		});
	});
})();


