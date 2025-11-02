declare module "moment-jalaali" {
  import moment from "moment";
  export = moment;
  export interface SpecResult {
  spec: string;                // مسیر فایل تست
  success: boolean;            // موفق/ناموفق
  stopLine?: boolean;          // آیا باید پایپ‌لاین متوقف شود؟
  attempt: number;             // شمارۀ تلاش
  timestamp: string;           // زمان ثبت
  error?: string | null;       // پیام خطا
  video?: string | null;       // مسیر ویدیو
  screenshot?: string | null;  // مسیر اسکرین
}
}
// خروجی استاندارد اجرای هر spec

