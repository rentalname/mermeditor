import { openDB } from 'idb';
import { MermaidFile, MermaidFileClass } from './MermaidFile.js';

const DB = 'mermeditor-db'
const FileStore = 'files'
const DB_VERSION = 3

const dbPromise = openDB(DB, DB_VERSION, {
  upgrade(db, oldVersion) {
    if (!db.objectStoreNames.contains(FileStore)) {
      db.createObjectStore(FileStore, { keyPath: 'id' })
    } else if (oldVersion < DB_VERSION) {
      db.deleteObjectStore(FileStore)
      db.createObjectStore(FileStore, { keyPath: 'id' })
    }
  },
});

export const storeFile = async (file: MermaidFile) => {
  const db = await dbPromise
  const tx = db.transaction(FileStore, 'readwrite')
  const store = tx.objectStore(FileStore)
  await store.put(file)
  tx.commit
}

export const loadFiles = async (): Promise<MermaidFile[]> => {
  const db = await dbPromise
  const tx = db.transaction(FileStore, 'readonly')
  const store = tx.objectStore(FileStore)
  const files: MermaidFile[] = (await store.getAll()).map(({ id, name, content }) => (new MermaidFileClass({ id, name, content })))

  return files
}

export const deleteFile = async (file: MermaidFile) => {
  const db = await dbPromise
  const tx = db.transaction(FileStore, 'readwrite')
  const store = tx.objectStore(FileStore)
  await store.delete(file.id)
  tx.commit
}
