// runner/policyEngine.ts

export type ErrorAction = "retry" | "stop_line" | "skip" | "relogin_then_retry";

export interface TestPolicyConfig {
  retries?: number;
  onError?: Record<string, ErrorAction>;
  fallback?: "continue" | "stop";
}

// پالیسی پیش‌فرض در صورت نبود تنظیم
const defaultPolicy: Required<TestPolicyConfig> = {
  retries: 1,
  onError: {
    visit: "retry",
    timeout: "retry",
    unauthorized: "stop_line",
  },
  fallback: "continue",
};

// پالیسی‌های ذخیره‌شده (در حافظه زمان اجرا)
const policies: Record<string, TestPolicyConfig> = {};

// 🧩 ثبت پالیسی برای تست خاص
export function TestPolicy(testName: string, config?: TestPolicyConfig) {
  const merged = { ...defaultPolicy, ...config };
  policies[testName.toLowerCase()] = merged;
  console.log(`⚙️ TestPolicy registered for '${testName}' →`, merged);
  return merged;
}

// 🧩 گرفتن پالیسی ثبت‌شده
export function getPolicy(testName: string): TestPolicyConfig {
  return policies[testName.toLowerCase()] || defaultPolicy;
}

// 🧠 مرج پالیسی از preset + inline
export function resolvePolicy(
  testName: string,
  opts?: { inline?: TestPolicyConfig }
): TestPolicyConfig {
  const base = getPolicy(testName);
  const merged = { ...defaultPolicy, ...base, ...(opts?.inline || {}) };
  return merged;
}

/**
 * 🧩 resolveCasePolicy
 * ادغام پالیسی سطح فایل با CasesPolicy خاص describe/it
 * اولویت:
 *   it > describe > فایل
 */
export function resolveCasePolicy(
  filePolicy: TestPolicyConfig,
  casesPolicy?: Record<string, Record<string, TestPolicyConfig>>,
  describeName?: string,
  itName?: string
): TestPolicyConfig {
  let merged = { ...filePolicy };

  if (!casesPolicy) return merged;

  // اگر describe موجود بود
  const describeBlock = describeName ? casesPolicy[describeName] : undefined;
  if (describeBlock) {
    merged = { ...merged, ...describeBlock["*"] }; // پالیسی عمومی برای کل describe
  }

  // اگر it خاصی هم بود، اون override نهایی
  if (describeBlock && itName && describeBlock[itName]) {
    merged = { ...merged, ...describeBlock[itName] };
  }

  return merged;
}
