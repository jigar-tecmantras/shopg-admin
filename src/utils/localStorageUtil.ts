export async function setLocalStorageItem<T>(
  key: string,
  data: T,
): Promise<void> {
  localStorage.setItem(key, JSON.stringify(data));
}

export function getLocalStorageItem(key: string): any {
  const item = localStorage.getItem(key);
  if (typeof item === 'string') {
    return JSON.parse(item);
  }
  return null; // Or handle this null case as per your requirement
}
