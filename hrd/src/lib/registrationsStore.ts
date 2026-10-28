import fs from "fs";
import path from "path";
import { PendingRegistration } from "@/types/approval";

export interface StoredRegistration extends PendingRegistration {
  password?: string;
}

const DATA_DIR = path.join(process.cwd(), "data");
const DATA_FILE = path.join(DATA_DIR, "registrations.json");

// In-memory cache
const memoryCache = new Map<string, StoredRegistration>();
let isInitialized = false;

function ensureLoaded() {
  if (isInitialized) return;
  isInitialized = true;

  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }

    if (fs.existsSync(DATA_FILE)) {
      const raw = fs.readFileSync(DATA_FILE, "utf-8");
      const list: StoredRegistration[] = JSON.parse(raw);
      list.forEach((item) => {
        if (item && item.email) {
          memoryCache.set(item.email.toLowerCase().trim(), item);
        }
      });
    }
  } catch (err) {
    console.warn("Notice loading registrations file:", err);
  }

  // Pre-seed Kevina Maydiva Heriansaputri (kevinamay23@gmail.com) as APPROVED
  const kevinKey = "kevinamay23@gmail.com";
  if (!memoryCache.has(kevinKey)) {
    const kevinRecord: StoredRegistration = {
      id: kevinKey,
      email: kevinKey,
      fullName: "Kevina Maydiva Heriansaputri",
      institution: "Universitas Teknologi Yogyakarta",
      status: "APPROVED",
      password: "car123los.",
      approvedAt: new Date().toISOString(),
      approvedBy: "Administrator HRD",
      createdAt: new Date().toISOString(),
    };
    memoryCache.set(kevinKey, kevinRecord);
    saveToFile();
  }
}

function saveToFile() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const arr = Array.from(memoryCache.values());
    fs.writeFileSync(DATA_FILE, JSON.stringify(arr, null, 2), "utf-8");
  } catch (err) {
    console.warn("Notice saving registrations file:", err);
  }
}

export const registrationsStore = {
  getAll(): StoredRegistration[] {
    ensureLoaded();
    return Array.from(memoryCache.values()).sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  get(email: string): StoredRegistration | null {
    ensureLoaded();
    const key = (email || "").toLowerCase().trim();
    return memoryCache.get(key) || null;
  },

  set(email: string, record: StoredRegistration): StoredRegistration {
    ensureLoaded();
    const key = (email || "").toLowerCase().trim();
    const updated = { ...record, id: key, email: key };
    memoryCache.set(key, updated);
    saveToFile();
    return updated;
  },

  approve(email: string, approvedBy: string = "Administrator HRD"): StoredRegistration | null {
    ensureLoaded();
    const key = (email || "").toLowerCase().trim();
    const existing = memoryCache.get(key);
    if (!existing) return null;

    const updated: StoredRegistration = {
      ...existing,
      status: "APPROVED",
      approvedAt: new Date().toISOString(),
      approvedBy,
      updatedAt: new Date().toISOString(),
    };
    memoryCache.set(key, updated);
    saveToFile();
    return updated;
  },

  reject(email: string, reason: string): StoredRegistration | null {
    ensureLoaded();
    const key = (email || "").toLowerCase().trim();
    const existing = memoryCache.get(key);
    if (!existing) return null;

    const updated: StoredRegistration = {
      ...existing,
      status: "REJECTED",
      rejectionReason: reason,
      updatedAt: new Date().toISOString(),
    };
    memoryCache.set(key, updated);
    saveToFile();
    return updated;
  },
};
