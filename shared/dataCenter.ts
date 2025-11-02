// shared/dataCenter.ts

export const Data = {
  urls: {
    base: "http://test.andishehpardaz.local/",
    contracts: "http://test.andishehpardaz.local/contracts",
    banks: "http://test.andishehpardaz.local/base/bank",
  },

  users: {
    admin: { username: "admin", password: "123456" },
    qa: { username: "qa_user", password: "qa_pass" },
  },

  api: {
    getContracts: "/api/contracts",
    saveContract: "/api/contracts/save",
  },

  messages: {
    success: "عملیات با موفقیت انجام شد",
    fail: "خطایی رخ داده است",
  },
  
  timeouts: {
    short: 2000,
    medium: 5000,
    long: 10000,
  },
};
