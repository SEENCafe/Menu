// این اسکریپت توسط GitHub Action (.github/workflows/sync-menu.yml) اجرا می‌شود
// و بخش defaultMenu در js/menu-data.js را با آخرین داده‌ی موجود در Firestore
// همگام می‌کند. هدف این است که حتی اگر یک بازدیدکننده‌ی تازه (که هیچ نسخه‌ی
// کش‌شده‌ای در مرورگرش ندارد) درست همان لحظه‌ای که ارتباط با Firebase قطع است
// وارد سایت شود، باز هم قیمت‌های نسبتاً به‌روز (نه قیمت‌های قدیمیِ سال‌ها پیش)
// را ببیند. برای ویرایش قیمت‌ها همیشه از پنل مدیریت (admin.html) استفاده کنید؛
// این فایل به‌صورت خودکار بازنویسی می‌شود.

import fs from 'node:fs';

// همون projectId داخل js/firebase-config.js (کلید مخفی نیست، طبق توضیح
// README.md). اینجا جدا نگه داشته می‌شود چون js/firebase-config.js یک ماژول
// ES است و js/*.js بدون package.json به‌صورت پیش‌فرض CommonJS تفسیر می‌شود.
const FIREBASE_PROJECT_ID = 'seen-cafe-4dadf';

const MENU_DATA_FILE = new URL('../js/menu-data.js', import.meta.url);
const DEFAULT_MENU_MARKER = 'export const defaultMenu = ';

function firestoreValueToJs(value) {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.nullValue !== undefined) return null;
  if (value.mapValue !== undefined) return firestoreMapToJs(value.mapValue.fields || {});
  if (value.arrayValue !== undefined) return (value.arrayValue.values || []).map(firestoreValueToJs);
  return null;
}

function firestoreMapToJs(fields) {
  const out = {};
  for (const [key, value] of Object.entries(fields)) out[key] = firestoreValueToJs(value);
  return out;
}

function cleanCategory(cat) {
  return {
    id: cat.id ?? '',
    icon: cat.icon ?? '',
    name: cat.name ?? '',
    items: Array.isArray(cat.items)
      ? cat.items.map((item) => ({ id: item.id ?? '', name: item.name ?? '', price: item.price ?? '' }))
      : [],
  };
}

async function main() {
  const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/menu/live`;

  const res = await fetch(url);
  if (!res.ok) {
    console.error(`دریافت از Firestore ناموفق بود: ${res.status} ${res.statusText}`);
    process.exit(1);
  }

  const docData = await res.json();
  const categoriesField = docData.fields && docData.fields.categories;
  if (!categoriesField) {
    console.error('فیلد categories در سند Firestore وجود ندارد؛ بدون تغییر خارج می‌شود.');
    process.exit(1);
  }

  const categories = firestoreValueToJs(categoriesField);
  if (!Array.isArray(categories) || categories.length === 0) {
    console.error('لیست categories خالی است؛ بدون تغییر خارج می‌شود.');
    process.exit(1);
  }

  const cleaned = categories.map(cleanCategory);

  const original = fs.readFileSync(MENU_DATA_FILE, 'utf8');
  const markerIndex = original.indexOf(DEFAULT_MENU_MARKER);
  if (markerIndex === -1) {
    console.error(`عبارت "${DEFAULT_MENU_MARKER}" در js/menu-data.js پیدا نشد.`);
    process.exit(1);
  }

  const head = original.slice(0, markerIndex);
  const updated = `${head}${DEFAULT_MENU_MARKER}${JSON.stringify(cleaned, null, 2)};\n`;

  if (updated === original) {
    console.log('تغییری نسبت به قبل وجود ندارد.');
    process.exit(0);
  }

  fs.writeFileSync(MENU_DATA_FILE, updated);
  console.log('js/menu-data.js با داده‌ی جدید Firestore به‌روزرسانی شد.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
