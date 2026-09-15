import { doc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { db, isFirebaseConfigured, MENU_COLLECTION, MENU_DOC_ID } from './firebase-init.js';
import { defaultMenu, cafeInfo } from './menu-data.js';

const menuEl = document.getElementById('menu');
const navEl = document.getElementById('category-nav');

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function toPersianNumber(n) {
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(n).replace(/[0-9]/g, (d) => persian[+d]);
}

function formatPriceDisplay(price) {
  return escapeHtml(String(price || '').trim())
    .split('-')
    .map((p) => p.trim())
    .filter(Boolean)
    .join('&nbsp;/&nbsp;');
}

function renderMenu(categories) {
  if (!categories || categories.length === 0) {
    menuEl.innerHTML = '<p class="empty-state">در حال حاضر آیتمی برای نمایش وجود ندارد.</p>';
    navEl.innerHTML = '';
    return;
  }

  navEl.innerHTML = categories
    .map((cat) => `<a href="#${escapeHtml(cat.id)}">${escapeHtml(cat.icon || '')} ${escapeHtml(cat.name)}</a>`)
    .join('');

  menuEl.innerHTML = categories
    .map((cat) => {
      const items = (cat.items || [])
        .map(
          (item) => `
            <div class="item-row">
              <span class="item-name">${escapeHtml(item.name)}</span>
              <span class="item-leader"></span>
              <span class="item-price">${formatPriceDisplay(item.price)}</span>
            </div>`
        )
        .join('');

      const count = (cat.items || []).length;

      return `
        <section class="category" id="${escapeHtml(cat.id)}">
          <div class="category-heading">
            <div class="cat-heading-main">
              <h2><span class="icon">${escapeHtml(cat.icon || '🍽️')}</span>${escapeHtml(cat.name)}</h2>
              <span class="cat-rule"></span>
            </div>
            <span class="cat-count">${toPersianNumber(count)} مورد</span>
          </div>
          <div class="item-list">${items || '<p class="empty-state">آیتمی ثبت نشده</p>'}</div>
        </section>`;
    })
    .join('');

  setupScrollSpy(categories.map((c) => c.id));
}

function setupScrollSpy(ids) {
  const links = [...navEl.querySelectorAll('a')];
  const sections = ids.map((id) => document.getElementById(id)).filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const link = navEl.querySelector(`a[href="#${entry.target.id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-45% 0px -50% 0px' }
  );

  sections.forEach((s) => observer.observe(s));
}

function renderCafeInfo() {
  const nameEl = document.getElementById('cafe-name');
  const addressEl = document.getElementById('cafe-address');
  const phonesEl = document.getElementById('cafe-phones');
  const instagramEl = document.getElementById('cafe-instagram');

  if (nameEl) nameEl.textContent = cafeInfo.name;
  if (addressEl) addressEl.textContent = `آدرس: ${cafeInfo.address}`;
  if (phonesEl) {
    phonesEl.innerHTML = cafeInfo.phones
      .map((p) => `<a href="tel:${p}" class="phone-link">${toPersianDigits(formatPhone(p))}</a>`)
      .join(' - ');
  }
  if (instagramEl) instagramEl.href = cafeInfo.instagram;
}

function formatPhone(p) {
  return p;
}

function toPersianDigits(str) {
  const persian = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(str).replace(/[0-9]/g, (d) => persian[+d]);
}

const MENU_CACHE_KEY = 'seenCafeMenuCache';

function readCachedMenu() {
  try {
    const raw = localStorage.getItem(MENU_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed.categories) && parsed.categories.length > 0 ? parsed.categories : null;
  } catch {
    return null;
  }
}

function writeCachedMenu(categories) {
  try {
    localStorage.setItem(MENU_CACHE_KEY, JSON.stringify({ categories }));
  } catch {
    // حالت مرور خصوصی یا فضای ذخیره‌سازی پر — قابل چشم‌پوشی
  }
}

function loadMenu() {
  renderCafeInfo();

  if (!isFirebaseConfigured) {
    renderMenu(readCachedMenu() || defaultMenu);
    return;
  }

  onSnapshot(
    doc(db, MENU_COLLECTION, MENU_DOC_ID),
    (snap) => {
      if (snap.exists() && Array.isArray(snap.data().categories) && snap.data().categories.length > 0) {
        const categories = snap.data().categories;
        renderMenu(categories);
        writeCachedMenu(categories);
      } else {
        renderMenu(readCachedMenu() || defaultMenu);
      }
    },
    (err) => {
      // قطعی موقت اتصال به Firebase نباید باعث نمایش قیمت‌های قدیمیِ هاردکدشده
      // بشه؛ آخرین نسخه‌ی موفق قبلی (اگر موجود باشه) ارجح‌تر از defaultMenu است.
      console.error('خطا در دریافت منو از Firebase، نمایش آخرین نسخه ذخیره‌شده:', err);
      renderMenu(readCachedMenu() || defaultMenu);
    }
  );
}

loadMenu();

const scrollBtn = document.querySelector('.scroll-to-top');
if (scrollBtn) {
  window.addEventListener('scroll', () => {
    scrollBtn.style.display = window.scrollY > 300 ? 'flex' : 'none';
  });
  scrollBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}
