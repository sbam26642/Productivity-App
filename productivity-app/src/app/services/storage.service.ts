import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
  read<T>(key: string): T | null {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  write<T>(key: string, value: T) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}
