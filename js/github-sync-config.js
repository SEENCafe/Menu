// تنظیمات لازم برای اینکه پنل مدیریت بعد از ذخیره‌ی قیمت‌ها، اجرای فوری
// ورک‌فلوی «Sync menu prices from Firestore» (.github/workflows/sync-menu.yml)
// را روی گیت‌هاب تریگر کند — تا نسخه‌ی استاتیکِ پشتیبان (js/menu-data.js) در
// عرض چند ثانیه به‌روز شود، نه تا یک ساعت بعد (کرون ساعتی همچنان به‌عنوان
// پشتیبان فعال می‌ماند).
//
// عمداً هیچ توکنی اینجا (در کدی که کامیت و در ریپوی عمومی منتشر می‌شود)
// نگه‌داری نمی‌شود — admin.js توکن را فقط در localStorage همان مرورگری که
// ادمین با آن وارد پنل شده ذخیره می‌کند. برای فعال‌سازی، یک Fine-grained
// Personal Access Token از https://github.com/settings/personal-access-tokens/new
// بسازید:
//   - Repository access: Only select repositories → SEENCafe/Menu
//   - Permissions → Repository permissions → Actions: Read and write
//   - بقیه‌ی دسترسی‌ها را روی «No access» بگذارید (مخصوصاً Contents).
// این محدودیت یعنی حتی اگر این توکن از localStorage یک دستگاه لو برود، فقط
// اجازه‌ی «اجرای مجدد همین ورک‌فلوی sync» را می‌دهد، نه تغییر کد یا محتوا.

export const GITHUB_REPO = 'SEENCafe/Menu';
export const GITHUB_WORKFLOW_FILE = 'sync-menu.yml';
export const GITHUB_REPO_BRANCH = 'main';
export const GITHUB_TOKEN_STORAGE_KEY = 'seenCafeGithubDispatchToken';
