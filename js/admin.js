import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js';
import { auth, db, isFirebaseConfigured, MENU_COLLECTION, MENU_DOC_ID } from './firebase-init.js';
import { defaultMenu } from './menu-data.js';

const notConfiguredEl = document.getElementById('not-configured');
const loginView = document.getElementById('login-view');
const dashboardView = document.getElementById('dashboard-view');
const loginForm = document.getElementById('login-form');
const loginError = document.getElementById('login-error');
const logoutBtn = document.getElementById('logout-btn');
const categoriesEl = document.getElementById('categories');
const addCategoryBtn = document.getElementById('add-category-btn');
const saveBtn = document.getElementById('save-btn');
const toastEl = document.getElementById('toast');
const importFileInput = document.getElementById('import-file');
const downloadTemplateBtn = document.getElementById('download-template-btn');

let state = { categories: [] };

function newId(prefix) {
  return `${prefix}_${(crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`).slice(0, 8)}`;
}

function showToast(message, isError = false) {
  toastEl.textContent = message;
  toastEl.classList.toggle('error', isError);
  toastEl.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toastEl.classList.remove('show'), 3200);
}

function escapeHtml(str) {
  return String(str ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function render() {
  if (state.categories.length === 0) {
    categoriesEl.innerHTML = '<p class="empty-state">هنوز دسته‌بندی‌ای اضافه نشده. یک دسته جدید بسازید یا از اکسل ایمپورت کنید.</p>';
    return;
  }

  categoriesEl.innerHTML = state.categories
    .map(
      (cat, ci) => `
      <div class="admin-category" data-cat="${ci}">
        <div class="admin-category-header">
          <input class="icon-input" data-role="cat-icon" data-cat="${ci}" value="${escapeHtml(cat.icon)}" maxlength="4" />
          <input class="name-input" data-role="cat-name" data-cat="${ci}" value="${escapeHtml(cat.name)}" placeholder="نام دسته‌بندی" />
          <button class="btn btn-danger btn-sm" data-action="delete-category" data-cat="${ci}">حذف دسته</button>
        </div>
        ${cat.items
          .map(
            (item, ii) => `
          <div class="admin-item-row" data-cat="${ci}" data-item="${ii}">
            <input class="item-name-input" data-role="item-name" data-cat="${ci}" data-item="${ii}" value="${escapeHtml(item.name)}" placeholder="نام آیتم" />
            <input class="item-price-input" data-role="item-price" data-cat="${ci}" data-item="${ii}" value="${escapeHtml(item.price)}" placeholder="قیمت" />
            <button class="btn btn-secondary btn-sm" data-action="delete-item" data-cat="${ci}" data-item="${ii}">حذف</button>
          </div>`
          )
          .join('')}
        <div class="admin-add-row">
          <button class="btn btn-secondary btn-sm" data-action="add-item" data-cat="${ci}">+ افزودن آیتم</button>
        </div>
      </div>`
    )
    .join('');
}

function getCategory(index) {
  return state.categories[index];
}

categoriesEl.addEventListener('input', (e) => {
  const t = e.target;
  const role = t.dataset.role;
  if (!role) return;
  const ci = Number(t.dataset.cat);
  const cat = getCategory(ci);
  if (!cat) return;

  if (role === 'cat-icon') cat.icon = t.value;
  else if (role === 'cat-name') cat.name = t.value;
  else if (role === 'item-name') cat.items[Number(t.dataset.item)].name = t.value;
  else if (role === 'item-price') cat.items[Number(t.dataset.item)].price = t.value;
});

categoriesEl.addEventListener('click', (e) => {
  const btn = e.target.closest('button[data-action]');
  if (!btn) return;
  const action = btn.dataset.action;
  const ci = Number(btn.dataset.cat);

  if (action === 'add-item') {
    getCategory(ci).items.push({ id: newId('item'), name: '', price: '' });
    render();
  } else if (action === 'delete-item') {
    const ii = Number(btn.dataset.item);
    getCategory(ci).items.splice(ii, 1);
    render();
  } else if (action === 'delete-category') {
    if (confirm('این دسته‌بندی و همه آیتم‌های آن حذف شود؟')) {
      state.categories.splice(ci, 1);
      render();
    }
  }
});

addCategoryBtn.addEventListener('click', () => {
  state.categories.push({ id: newId('cat'), icon: '🍽️', name: '', items: [] });
  render();
});

saveBtn.addEventListener('click', async () => {
  saveBtn.disabled = true;
  saveBtn.textContent = 'در حال ذخیره...';
  try {
    await setDoc(doc(db, MENU_COLLECTION, MENU_DOC_ID), {
      categories: state.categories,
      updatedAt: serverTimestamp(),
    });
    showToast('تغییرات با موفقیت ذخیره شد.');
  } catch (err) {
    console.error(err);
    showToast('خطا در ذخیره‌سازی. دوباره تلاش کنید.', true);
  } finally {
    saveBtn.disabled = false;
    saveBtn.textContent = 'ذخیره تغییرات';
  }
});

async function loadMenuIntoEditor() {
  try {
    const snap = await getDoc(doc(db, MENU_COLLECTION, MENU_DOC_ID));
    if (snap.exists() && Array.isArray(snap.data().categories)) {
      state.categories = structuredClone(snap.data().categories);
    } else {
      state.categories = structuredClone(defaultMenu);
    }
  } catch (err) {
    console.error(err);
    state.categories = structuredClone(defaultMenu);
    showToast('خطا در دریافت منو، نسخه پیش‌فرض بارگذاری شد.', true);
  }
  render();
}

// ---------- Excel import ----------
downloadTemplateBtn.addEventListener('click', () => {
  const headers = ['دسته‌بندی', 'آیکون دسته (اختیاری)', 'نام آیتم', 'قیمت'];
  const sample = [
    ['بار گرم', '☕', 'اسپرسو', '65'],
    ['بار گرم', '☕', 'آمریکانو', '70'],
    ['کیک', '🎂', 'چیز کیک', '110'],
  ];
  const ws = window.XLSX.utils.aoa_to_sheet([headers, ...sample]);
  const wb = window.XLSX.utils.book_new();
  window.XLSX.utils.book_append_sheet(wb, ws, 'منو');
  window.XLSX.writeFile(wb, 'قالب-منو.xlsx');
});

importFileInput.addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    const data = await file.arrayBuffer();
    const wb = window.XLSX.read(data, { type: 'array' });
    const sheet = wb.Sheets[wb.SheetNames[0]];
    const rows = window.XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' });

    if (rows.length < 2) {
      showToast('فایل اکسل خالی است یا داده‌ای ندارد.', true);
      return;
    }

    const [, ...dataRows] = rows;
    const categoriesMap = new Map();

    for (const row of dataRows) {
      const [catName, catIcon, itemName, price] = row;
      const name = String(catName || '').trim();
      const item = String(itemName || '').trim();
      if (!name || !item) continue;

      if (!categoriesMap.has(name)) {
        categoriesMap.set(name, {
          id: newId('cat'),
          icon: String(catIcon || '').trim() || '🍽️',
          name,
          items: [],
        });
      }
      categoriesMap.get(name).items.push({
        id: newId('item'),
        name: item,
        price: String(price ?? '').trim(),
      });
    }

    const imported = [...categoriesMap.values()];
    if (imported.length === 0) {
      showToast('هیچ ردیف معتبری در فایل پیدا نشد.', true);
      return;
    }

    if (confirm(`${imported.length} دسته‌بندی با مجموع ${imported.reduce((n, c) => n + c.items.length, 0)} آیتم پیدا شد. منوی فعلی در ویرایشگر جایگزین شود؟ (برای ثبت نهایی هنوز باید روی «ذخیره تغییرات» کلیک کنید)`)) {
      state.categories = imported;
      render();
      showToast('فایل ایمپورت شد. برای ثبت نهایی روی «ذخیره تغییرات» کلیک کنید.');
    }
  } catch (err) {
    console.error(err);
    showToast('خطا در خواندن فایل اکسل.', true);
  } finally {
    importFileInput.value = '';
  }
});

// ---------- Auth ----------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  loginError.textContent = '';
  const email = document.getElementById('login-email').value.trim();
  const password = document.getElementById('login-password').value;
  const submitBtn = loginForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    loginError.textContent = 'ایمیل یا رمز عبور اشتباه است.';
  } finally {
    submitBtn.disabled = false;
  }
});

logoutBtn.addEventListener('click', () => signOut(auth));

if (!isFirebaseConfigured) {
  loginView.style.display = 'none';
  notConfiguredEl.style.display = 'flex';
} else {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginView.style.display = 'none';
      dashboardView.style.display = 'block';
      loadMenuIntoEditor();
    } else {
      loginView.style.display = 'flex';
      dashboardView.style.display = 'none';
    }
  });
}
