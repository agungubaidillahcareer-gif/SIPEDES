/* ============================================================
   CRUD OPERATIONS - SIPEDES
   ============================================================ */

const CRUD = {
  loadData: function (file) {
    return new Promise((resolve, reject) => {
      const local = this.getLocalData(file);
      if (local) {
        resolve(local);
        return;
      }
      fetch(`data/${file}.json`)
        .then((response) => {
          if (!response.ok) throw new Error("File tidak ditemukan");
          return response.json();
        })
        .then((data) => {
          this.saveData(file, data);
          resolve(data);
        })
        .catch(() => reject(new Error("Gagal memuat data")));
    });
  },

  saveData: function (file, data) {
    return new Promise((resolve, reject) => {
      try {
        localStorage.setItem(`sipedes_${file}`, JSON.stringify(data));
        resolve({ success: true });
      } catch (e) {
        reject(e);
      }
    });
  },

  getLocalData: function (file) {
    const data = localStorage.getItem(`sipedes_${file}`);
    return data ? JSON.parse(data) : null;
  },

  deleteData: function (file) {
    localStorage.removeItem(`sipedes_${file}`);
  },

  getAll: function (file) {
    return this.getLocalData(file);
  },

  getById: function (file, id, key = "id") {
    const data = this.getLocalData(file);
    if (!data) return null;
    if (Array.isArray(data)) {
      return data.find((item) => item[key] === id);
    }
    return null;
  },

  add: function (file, item) {
    let data = this.getLocalData(file);
    if (!data) data = [];
    if (!Array.isArray(data)) data = [];
    item.id = data.length > 0 ? Math.max(...data.map((d) => d.id)) + 1 : 1;
    data.push(item);
    this.saveData(file, data);
    return item;
  },

  update: function (file, id, newData, key = "id") {
    let data = this.getLocalData(file);
    if (!data || !Array.isArray(data)) return null;
    const index = data.findIndex((item) => item[key] === id);
    if (index === -1) return null;
    data[index] = { ...data[index], ...newData };
    this.saveData(file, data);
    return data[index];
  },

  remove: function (file, id, key = "id") {
    let data = this.getLocalData(file);
    if (!data || !Array.isArray(data)) return false;
    data = data.filter((item) => item[key] !== id);
    this.saveData(file, data);
    return true;
  },
};

window.CRUD = CRUD;
