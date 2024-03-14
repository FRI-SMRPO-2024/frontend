const storagePrefix = "smrpo";

const storage = {
  get: (key: string) => {
    return JSON.parse(
      window.localStorage.getItem(`${storagePrefix}-${key}`) as string,
    );
  },
  set: (key: string, data: object | string | number | boolean | []) => {
    window.localStorage.setItem(
      `${storagePrefix}-${key}`,
      JSON.stringify(data),
    );
  },
  clear: (key: string) => {
    window.localStorage.removeItem(`${storagePrefix}-${key}`);
  },
};

export default storage;
