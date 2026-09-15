// تنظیمات لازم برای اینکه پنل مدیریت بعد از ذخیره‌ی قیمت‌ها، اجرای فوری
// ورک‌فلوی «Sync menu prices from Firestore» (.github/workflows/sync-menu.yml)
// را روی گیت‌هاب تریگر کند — تا نسخه‌ی استاتیکِ پشتیبان (js/menu-data.js) در
// عرض چند ثانیه به‌روز شود، نه تا یک ساعت بعد.
//
// GITHUB_DISPATCH_TOKEN یک Fine-grained Personal Access Token است که باید از
// https://github.com/settings/personal-access-tokens/new ساخته شود:
//   - Repository access: Only select repositories → SEENCafe/Menu
//   - Permissions → Repository permissions → Actions: Read and write
//   - بقیه‌ی دسترسی‌ها را روی «No access» بگذارید (مخصوصاً Contents).
// این توکن با این محدودیت فقط اجازه‌ی «اجرای مجدد همین ورک‌فلوی sync» را
// می‌دهد و نمی‌تواند کد یا محتوای ریپو را تغییر دهد؛ با این حال چون در کد
// سمت مرورگر قرار می‌گیرد، هر کسی که admin.html را باز کند می‌تواند آن را
// ببیند. اگر خالی بماند، تریگر فوری غیرفعال می‌شود و فقط کرون ساعتی کار
// می‌کند.

export const GITHUB_DISPATCH_TOKEN = 'YOUR_GITHUB_ACTIONS_TOKEN';
export const GITHUB_REPO = 'SEENCafe/Menu';
export const GITHUB_WORKFLOW_FILE = 'sync-menu.yml';
export const GITHUB_REPO_BRANCH = 'main';
