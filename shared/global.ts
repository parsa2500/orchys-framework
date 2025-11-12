// تعریف نوع داده‌هات برای TypeScript
declare global {
  var GlobalData: {
    urls: {
      base: string;
      dashboard: string;
      contracts: string;
    };
    user: {
      username: string;
      password: string;
      role: string;
    };
    timeouts: {
      short: number;
      medium: number;
      long: number;
    };
  };
}

// مقداردهی اولیه فقط یکبار
globalThis.GlobalData ??= {
  urls: {
    base: "http://test.andishehpardaz.local/",
    dashboard: "http://test.andishehpardaz.local/dashboard",
    contracts: "http://test.andishehpardaz.local/contracts",
  },
  user: {
    username: "qa-automation",
    password: "12345678",
    role: "admin",
  },
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
  },
};

export {};
