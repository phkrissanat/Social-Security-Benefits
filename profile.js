export function readProfile(text) {
  let saved;
  try { saved=JSON.parse(text); } catch { return null; }
  if (!saved || !['33','39','40'].includes(saved.section)) return null;
  const fields=saved.fields&&typeof saved.fields==='object'&&!Array.isArray(saved.fields)?saved.fields:{};
  return {
    section:saved.section,
    option:['1','2','3'].includes(saved.option)?saved.option:'1',
    months:Number.isInteger(saved.months)&&saved.months>=0&&saved.months<=1200?saved.months:null,
    asOf:saved.asOf,
    fields:Object.fromEntries(Object.entries(fields).filter(([key,value])=>
      !['__proto__','constructor','prototype'].includes(key)&&typeof value==='string')),
  };
}

let database;

function deviceDatabase() {
  if (!database) {
    database = new Promise((resolve, reject) => {
      const request = indexedDB.open('sithi-device-profiles', 1);
      request.onupgradeneeded = () => request.result.createObjectStore('profiles');
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
      request.onblocked = () => reject(new Error('Profile storage is blocked'));
    }).catch(error => {
      database = undefined;
      throw error;
    });
  }
  return database;
}

export async function loadDeviceProfile(key) {
  const db = await deviceDatabase();
  return new Promise((resolve, reject) => {
    const request = db.transaction('profiles').objectStore('profiles').get(key);
    request.onsuccess = () => resolve(readProfile(request.result));
    request.onerror = () => reject(request.error);
  });
}

export async function saveDeviceProfile(key, profile) {
  const db = await deviceDatabase();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction('profiles', 'readwrite');
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.objectStore('profiles').put(JSON.stringify(profile), key);
  });
}
