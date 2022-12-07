const localStorage: any = {
  // 获取一个 key
  get(key: string): any {
    const val: string | null = window.localStorage.getItem(key);
    if (val == null) {
      return val;
    }
    return JSON.parse(val);
  },
  // 设置一个 key
  set(key: string, val: any): void {
    window.localStorage.setItem(key, JSON.stringify(val));
  },
  // 移除一个 key
  remove(key: string): void {
    window.localStorage.removeItem(key);
  },
  // 清空所有 key
  clear(): void {
    window.localStorage.clear();
  },
};

export { localStorage };
