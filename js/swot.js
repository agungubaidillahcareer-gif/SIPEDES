/* ============================================================
   SWOT ANALISIS - SIPEDES (LENGKAP)
   ============================================================ */

const SWOT = {
  colors: {
    kekuatan: {
      bg: "#e8f5e9",
      border: "#2e7d32",
      text: "#1b5e20",
      icon: "#2e7d32",
    },
    kelemahan: {
      bg: "#ffebee",
      border: "#c62828",
      text: "#b71c1c",
      icon: "#c62828",
    },
    peluang: {
      bg: "#e3f2fd",
      border: "#0d47a1",
      text: "#0d47a1",
      icon: "#1565c0",
    },
    ancaman: {
      bg: "#fff3e0",
      border: "#e65100",
      text: "#bf360c",
      icon: "#e65100",
    },
  },

  renderForm: function (containerId) {
    const container = document.getElementById(containerId);
    if (!container) return;

    let data = CRUD.getLocalData("swot");
    if (!data) {
      data = {
        faktor: { kekuatan: [], kelemahan: [], peluang: [], ancaman: [] },
        hasil: {},
      };
      CRUD.saveData("swot", data);
    }

    const faktor = data.faktor || {
      kekuatan: [],
      kelemahan: [],
      peluang: [],
      ancaman: [],
    };

    let html = `
            <div class="swot-container-inner">
                <div class="swot-form-grid">
                    ${this.renderKolom(faktor.kekuatan, "kekuatan", "S", this.colors.kekuatan)}
                    ${this.renderKolom(faktor.kelemahan, "kelemahan", "W", this.colors.kelemahan)}
                    ${this.renderKolom(faktor.peluang, "peluang", "O", this.colors.peluang)}
                    ${this.renderKolom(faktor.ancaman, "ancaman", "T", this.colors.ancaman)}
                </div>
                <div class="swot-form-actions">
                    <button class="btn btn-primary" onclick="SWOT.hitungSWOT()">
                        <i class="fas fa-calculator"></i> Hitung Analisis
                    </button>
                    <button class="btn btn-outline" onclick="SWOT.resetSWOT()" style="background:#c62828;color:#fff;border:none;">
                        <i class="fas fa-undo"></i> Reset
                    </button>
                    <button class="btn btn-outline" onclick="SWOT.loadDefault()" style="background:#0d47a1;color:#fff;border:none;">
                        <i class="fas fa-database"></i> Muat Data Default
                    </button>
                </div>
            </div>
        `;

    container.innerHTML = html;

    if (data.hasil && data.hasil.total_s !== undefined) {
      this.tampilkanHasil(data.hasil);
      this.renderKuadran(data.hasil);
      this.renderMatriks();
      document.getElementById("swot-hasil").style.display = "block";
      document.getElementById("swot-kuadran").style.display = "block";
      document.getElementById("matrix-wrapper").style.display = "block";
    }
  },

  renderKolom: function (faktorList, tipe, prefix, colors) {
    const listHtml =
      faktorList && faktorList.length > 0
        ? faktorList
            .map(
              (f, index) => `
                <div class="swot-faktor-item" style="border-left:4px solid ${colors.border};">
                    <span class="faktor-id" style="color:${colors.border};">${f.id || prefix + (index + 1)}</span>
                    <input type="text" class="faktor-nama" value="${f.nama || ""}" placeholder="Nama faktor" data-tipe="${tipe}" data-index="${index}" style="border-color:${colors.border};">
                    <input type="number" class="faktor-bobot" value="${f.bobot || 0}" step="0.01" min="0" max="1" placeholder="Bobot" data-tipe="${tipe}" data-index="${index}" style="border-color:${colors.border};">
                    <select class="faktor-rating" data-tipe="${tipe}" data-index="${index}" style="border-color:${colors.border};">
                        ${[1, 2, 3, 4].map((r) => `<option value="${r}" ${f.rating === r ? "selected" : ""}>${r}</option>`).join("")}
                    </select>
                    <span class="faktor-skor" style="color:${colors.border};">${(f.bobot * f.rating).toFixed(2)}</span>
                    <button class="btn-remove" onclick="SWOT.hapusFaktor('${tipe}', ${index})" style="color:${colors.border};">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `,
            )
            .join("")
        : `<div class="empty-state">Belum ada data. Klik "Tambah" untuk menambahkan.</div>`;

    const iconMap = {
      kekuatan: "fa-plus-circle",
      kelemahan: "fa-minus-circle",
      peluang: "fa-arrow-trend-up",
      ancaman: "fa-triangle-exclamation",
    };

    return `
            <div class="swot-form-col" style="background:${colors.bg};border-radius:12px;padding:16px;border:2px solid ${colors.border};">
                <h4 style="color:${colors.text};">
                    <i class="fas ${iconMap[tipe]}" style="color:${colors.icon};"></i>
                    ${tipe.charAt(0).toUpperCase() + tipe.slice(1)} (${prefix})
                    <span style="font-weight:400;font-size:12px;color:#7a8a92;margin-left:8px;">${faktorList ? faktorList.length : 0}</span>
                </h4>
                <div id="swot-${tipe}-list" class="swot-faktor-list">${listHtml}</div>
                <button class="btn-sm btn-add" onclick="SWOT.tambahFaktor('${tipe}', '${prefix}')" style="background:${colors.border};color:#fff;">
                    <i class="fas fa-plus"></i> Tambah Faktor
                </button>
            </div>
        `;
  },

  tambahFaktor: function (tipe, prefix) {
    let data = CRUD.getLocalData("swot");
    if (!data) {
      data = {
        faktor: { kekuatan: [], kelemahan: [], peluang: [], ancaman: [] },
        hasil: {},
      };
    }
    if (!data.faktor)
      data.faktor = { kekuatan: [], kelemahan: [], peluang: [], ancaman: [] };
    if (!data.faktor[tipe]) data.faktor[tipe] = [];

    const newId = prefix + (data.faktor[tipe].length + 1);
    data.faktor[tipe].push({ id: newId, nama: "", bobot: 0, rating: 3 });

    CRUD.saveData("swot", data).then(() => {
      this.renderForm("swot-container");
      this.showNotification("Faktor baru berhasil ditambahkan", "success");
    });
  },

  hapusFaktor: function (tipe, index) {
    if (!confirm("Yakin ingin menghapus faktor ini?")) return;

    let data = CRUD.getLocalData("swot");
    if (!data || !data.faktor || !data.faktor[tipe]) return;

    data.faktor[tipe].splice(index, 1);
    CRUD.saveData("swot", data).then(() => {
      this.renderForm("swot-container");
      this.showNotification("Faktor berhasil dihapus", "info");
    });
  },

  hitungSWOT: function () {
    const faktor = { kekuatan: [], kelemahan: [], peluang: [], ancaman: [] };

    ["kekuatan", "kelemahan", "peluang", "ancaman"].forEach((tipe) => {
      document
        .querySelectorAll(`.faktor-nama[data-tipe="${tipe}"]`)
        .forEach((item, i) => {
          if (item.value.trim()) {
            const bobots = document.querySelectorAll(
              `.faktor-bobot[data-tipe="${tipe}"]`,
            );
            const ratings = document.querySelectorAll(
              `.faktor-rating[data-tipe="${tipe}"]`,
            );
            const idEl = item
              .closest(".swot-faktor-item")
              .querySelector(".faktor-id");
            faktor[tipe].push({
              id: idEl
                ? idEl.textContent
                : tipe.charAt(0).toUpperCase() + (i + 1),
              nama: item.value.trim(),
              bobot: parseFloat(bobots[i]?.value) || 0,
              rating: parseInt(ratings[i]?.value) || 3,
            });
          }
        });
    });

    if (
      faktor.kekuatan.length === 0 ||
      faktor.kelemahan.length === 0 ||
      faktor.peluang.length === 0 ||
      faktor.ancaman.length === 0
    ) {
      this.showNotification(
        "Setiap kategori harus memiliki minimal 1 faktor",
        "error",
      );
      return;
    }

    const semuaFaktor = [
      ...faktor.kekuatan,
      ...faktor.kelemahan,
      ...faktor.peluang,
      ...faktor.ancaman,
    ];
    const totalBobot = semuaFaktor.reduce((sum, f) => sum + f.bobot, 0);

    if (totalBobot < 0.9 || totalBobot > 1.1) {
      this.showNotification(
        "Total bobot: " + totalBobot.toFixed(2) + " (idealnya 1.00)",
        "info",
      );
    }

    const hasil = this.hitungSkor(faktor);

    let data = CRUD.getLocalData("swot");
    if (!data) data = { faktor: {}, hasil: {} };
    data.faktor = faktor;
    data.hasil = hasil;
    CRUD.saveData("swot", data).then(() => {
      this.tampilkanHasil(hasil);
      this.renderKuadran(hasil);
      this.renderMatriks();
      document.getElementById("swot-hasil").style.display = "block";
      document.getElementById("swot-kuadran").style.display = "block";
      document.getElementById("matrix-wrapper").style.display = "block";
      document
        .getElementById("swot-hasil")
        .scrollIntoView({ behavior: "smooth", block: "start" });
      this.showNotification("Analisis SWOT berhasil dihitung", "success");
    });
  },

  hitungSkor: function (faktor) {
    const totalS = faktor.kekuatan.reduce(
      (sum, f) => sum + f.bobot * f.rating,
      0,
    );
    const totalW = faktor.kelemahan.reduce(
      (sum, f) => sum + f.bobot * f.rating,
      0,
    );
    const totalO = faktor.peluang.reduce(
      (sum, f) => sum + f.bobot * f.rating,
      0,
    );
    const totalT = faktor.ancaman.reduce(
      (sum, f) => sum + f.bobot * f.rating,
      0,
    );

    const selisihSW = totalS - totalW;
    const selisihOT = totalO - totalT;

    let kuadran, strategi, deskripsi, warna;
    if (selisihSW > 0 && selisihOT > 0) {
      kuadran = "I";
      strategi = "Agresif (SO)";
      deskripsi = "Memanfaatkan kekuatan untuk merebut peluang yang ada";
      warna = "#2e7d32";
    } else if (selisihSW < 0 && selisihOT > 0) {
      kuadran = "II";
      strategi = "Diversifikasi (ST)";
      deskripsi = "Menggunakan kekuatan untuk menghadapi ancaman";
      warna = "#e65100";
    } else if (selisihSW < 0 && selisihOT < 0) {
      kuadran = "III";
      strategi = "Turnaround (WO)";
      deskripsi = "Memperbaiki kelemahan dengan memanfaatkan peluang";
      warna = "#0d47a1";
    } else {
      kuadran = "IV";
      strategi = "Defensif (WT)";
      deskripsi = "Meminimalkan kelemahan dan menghindari ancaman";
      warna = "#c62828";
    }

    return {
      total_s: totalS,
      total_w: totalW,
      total_o: totalO,
      total_t: totalT,
      selisih_s_w: selisihSW,
      selisih_o_t: selisihOT,
      kuadran: kuadran,
      strategi: strategi,
      deskripsi: deskripsi,
      warna: warna,
      posisi_x: selisihSW,
      posisi_y: selisihOT,
    };
  },

  tampilkanHasil: function (hasil) {
    const container = document.getElementById("swot-hasil-content");
    if (!container) return;

    const warnaS = hasil.selisih_s_w >= 0 ? "#2e7d32" : "#c62828";
    const warnaO = hasil.selisih_o_t >= 0 ? "#0d47a1" : "#e65100";

    container.innerHTML = `
            <div class="hasil-container">
                <div class="hasil-grid">
                    <div class="hasil-item" style="border-left:4px solid #2e7d32;">
                        <span class="hasil-label"><i class="fas fa-plus-circle" style="color:#2e7d32;"></i> Kekuatan (S)</span>
                        <span class="hasil-value" style="color:#2e7d32;">${hasil.total_s.toFixed(2)}</span>
                    </div>
                    <div class="hasil-item" style="border-left:4px solid #c62828;">
                        <span class="hasil-label"><i class="fas fa-minus-circle" style="color:#c62828;"></i> Kelemahan (W)</span>
                        <span class="hasil-value" style="color:#c62828;">${hasil.total_w.toFixed(2)}</span>
                    </div>
                    <div class="hasil-item highlight" style="border-left:4px solid ${warnaS};background:${warnaS}15;">
                        <span class="hasil-label"><i class="fas fa-arrow-right" style="color:${warnaS};"></i> Selisih (S - W)</span>
                        <span class="hasil-value" style="color:${warnaS};font-size:28px;">
                            ${hasil.selisih_s_w >= 0 ? "+" : ""}${hasil.selisih_s_w.toFixed(2)}
                        </span>
                    </div>
                    <div class="hasil-item" style="border-left:4px solid #0d47a1;">
                        <span class="hasil-label"><i class="fas fa-arrow-trend-up" style="color:#0d47a1;"></i> Peluang (O)</span>
                        <span class="hasil-value" style="color:#0d47a1;">${hasil.total_o.toFixed(2)}</span>
                    </div>
                    <div class="hasil-item" style="border-left:4px solid #e65100;">
                        <span class="hasil-label"><i class="fas fa-triangle-exclamation" style="color:#e65100;"></i> Ancaman (T)</span>
                        <span class="hasil-value" style="color:#e65100;">${hasil.total_t.toFixed(2)}</span>
                    </div>
                    <div class="hasil-item highlight" style="border-left:4px solid ${warnaO};background:${warnaO}15;">
                        <span class="hasil-label"><i class="fas fa-arrow-right" style="color:${warnaO};"></i> Selisih (O - T)</span>
                        <span class="hasil-value" style="color:${warnaO};font-size:28px;">
                            ${hasil.selisih_o_t >= 0 ? "+" : ""}${hasil.selisih_o_t.toFixed(2)}
                        </span>
                    </div>
                </div>
                <div class="hasil-kuadran-info" style="border-top:4px solid ${hasil.warna};">
                    <span class="kuadran-badge" style="background:${hasil.warna};">Kuadran ${hasil.kuadran}</span>
                    <span class="strategi-badge" style="background:${hasil.warna};">${hasil.strategi}</span>
                    <p class="strategi-deskripsi" style="color:${hasil.warna};">
                        <i class="fas fa-lightbulb"></i> ${hasil.deskripsi}
                    </p>
                </div>
            </div>
        `;
  },

  renderKuadran: function (hasil) {
    const container = document.getElementById("swot-kuadran-content");
    if (!container) return;

    const x = Math.min(Math.max(hasil.selisih_s_w, -2), 2);
    const y = Math.min(Math.max(hasil.selisih_o_t, -2), 2);
    const posX = ((x + 2) / 4) * 100;
    const posY = 100 - ((y + 2) / 4) * 100;

    container.innerHTML = `
            <div class="kuadran-container">
                <div class="kuadran-chart-wrapper">
                    <div class="kuadran-chart">
                        <div class="kuadran-axis-x">
                            <span>← Kelemahan</span>
                            <span>Kekuatan →</span>
                        </div>
                        <div class="kuadran-axis-y">
                            <span>Ancaman ↑</span>
                            <span>↓ Peluang</span>
                        </div>
                        <div class="kuadran-grid">
                            <div class="kuadran-area ${hasil.kuadran === "II" ? "active" : ""}" style="${hasil.kuadran === "II" ? "background:#fff3e0;border-color:#e65100;" : ""}">
                                <div><span class="kuadran-label" style="color:#e65100;">Kuadran II</span><span class="kuadran-strategy" style="color:#e65100;">Diversifikasi (ST)</span></div>
                            </div>
                            <div class="kuadran-area ${hasil.kuadran === "I" ? "active" : ""}" style="${hasil.kuadran === "I" ? "background:#e8f5e9;border-color:#2e7d32;" : ""}">
                                <div><span class="kuadran-label" style="color:#2e7d32;">Kuadran I</span><span class="kuadran-strategy" style="color:#2e7d32;">Agresif (SO)</span>${hasil.kuadran === "I" ? '<span class="check" style="color:#2e7d32;">✓</span>' : ""}</div>
                            </div>
                            <div class="kuadran-area ${hasil.kuadran === "III" ? "active" : ""}" style="${hasil.kuadran === "III" ? "background:#e3f2fd;border-color:#0d47a1;" : ""}">
                                <div><span class="kuadran-label" style="color:#0d47a1;">Kuadran III</span><span class="kuadran-strategy" style="color:#0d47a1;">Turnaround (WO)</span></div>
                            </div>
                            <div class="kuadran-area ${hasil.kuadran === "IV" ? "active" : ""}" style="${hasil.kuadran === "IV" ? "background:#ffebee;border-color:#c62828;" : ""}">
                                <div><span class="kuadran-label" style="color:#c62828;">Kuadran IV</span><span class="kuadran-strategy" style="color:#c62828;">Defensif (WT)</span></div>
                            </div>
                            <div class="kuadran-dot" style="left:${posX}%;top:${posY}%;background:${hasil.warna};">
                                <span class="dot-label">(${hasil.selisih_s_w.toFixed(2)}, ${hasil.selisih_o_t.toFixed(2)})</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="kuadran-note" style="border-left:4px solid ${hasil.warna};">
                    <i class="fas fa-location-dot" style="color:${hasil.warna};"></i>
                    Desa Sleman berada pada <strong style="color:${hasil.warna};">Kuadran ${hasil.kuadran}</strong>,
                    strategi: <strong style="color:${hasil.warna};">${hasil.strategi}</strong>
                </div>
            </div>
        `;
  },

  renderMatriks: function () {
    const container = document.getElementById("matrix-content");
    if (!container) return;

    container.innerHTML = `
            <div class="matrix-container">
                <div class="matrix-grid">
                    <div class="matrix-header"></div>
                    <div class="matrix-header matrix-s" style="background:#2e7d32;color:#fff;">Kekuatan (S)</div>
                    <div class="matrix-header matrix-w" style="background:#c62828;color:#fff;">Kelemahan (W)</div>
                    <div class="matrix-header matrix-o" style="background:#0d47a1;color:#fff;">Peluang (O)</div>
                    <div class="matrix-cell matrix-so" style="border-left:4px solid #2e7d32;background:#e8f5e9;">
                        <strong style="color:#2e7d32;">Strategi SO (Agresif)</strong>
                        <ul><li>Mengembangkan pertanian modern berbasis irigasi teknis</li><li>Memperkuat BUMDes dengan Dana Desa</li><li>Mengembangkan UMKM melalui program pemberdayaan</li></ul>
                    </div>
                    <div class="matrix-cell matrix-wo" style="border-left:4px solid #0d47a1;background:#e3f2fd;">
                        <strong style="color:#0d47a1;">Strategi WO (Turnaround)</strong>
                        <ul><li>Pelatihan keterampilan & literasi digital</li><li>Memanfaatkan e-commerce untuk pemasaran</li><li>Kerja sama program beasiswa & pendidikan</li></ul>
                    </div>
                    <div class="matrix-header matrix-t" style="background:#e65100;color:#fff;">Ancaman (T)</div>
                    <div class="matrix-cell matrix-st" style="border-left:4px solid #e65100;background:#fff3e0;">
                        <strong style="color:#e65100;">Strategi ST (Diversifikasi)</strong>
                        <ul><li>Diversifikasi komoditas pertanian</li><li>Mengembangkan usaha non-pertanian alternatif</li><li>Membangun infrastruktur pengendalian banjir</li></ul>
                    </div>
                    <div class="matrix-cell matrix-wt" style="border-left:4px solid #c62828;background:#ffebee;">
                        <strong style="color:#c62828;">Strategi WT (Defensif)</strong>
                        <ul><li>Memperkuat BPD dan LKMD</li><li>Membentuk koperasi/kelompok usaha bersama</li><li>Efisiensi APBDes untuk program berdampak ekonomi</li></ul>
                    </div>
                </div>
            </div>
        `;
  },

  resetSWOT: function () {
    if (confirm("Yakin ingin mereset semua data SWOT?")) {
      CRUD.saveData("swot", {
        faktor: { kekuatan: [], kelemahan: [], peluang: [], ancaman: [] },
        hasil: {},
      }).then(() => {
        this.renderForm("swot-container");
        document.getElementById("swot-hasil").style.display = "none";
        document.getElementById("swot-kuadran").style.display = "none";
        document.getElementById("matrix-wrapper").style.display = "none";
        this.showNotification("Data SWOT berhasil direset", "info");
      });
    }
  },

  loadDefault: function () {
    if (confirm("Muat data default?")) {
      fetch("data/swot.json")
        .then((r) => r.json())
        .then((data) => {
          CRUD.saveData("swot", data).then(() => {
            this.renderForm("swot-container");
            if (data.hasil && data.hasil.total_s !== undefined) {
              this.tampilkanHasil(data.hasil);
              this.renderKuadran(data.hasil);
              this.renderMatriks();
              document.getElementById("swot-hasil").style.display = "block";
              document.getElementById("swot-kuadran").style.display = "block";
              document.getElementById("matrix-wrapper").style.display = "block";
            }
            this.showNotification("Data default berhasil dimuat", "success");
          });
        })
        .catch(() => {
          this.showNotification("Gagal memuat data default", "error");
        });
    }
  },

  showNotification: function (message, type) {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const colors = {
      success: { bg: "#2e7d32", icon: "fa-check-circle" },
      error: { bg: "#c62828", icon: "fa-exclamation-circle" },
      warning: { bg: "#e65100", icon: "fa-triangle-exclamation" },
      info: { bg: "#0d47a1", icon: "fa-info-circle" },
    };

    const color = colors[type] || colors.info;
    const notif = document.createElement("div");
    notif.className = "toast " + type;
    notif.style.cssText = `
            position: fixed; top: 80px; right: 20px;
            background: ${color.bg}; color: #fff; padding: 14px 20px; border-radius: 12px;
            font-weight: 500; font-size: 14px; z-index: 9999;
            box-shadow: 0 8px 40px rgba(0,0,0,0.15);
            animation: toastIn 0.5s cubic-bezier(0.22, 1, 0.36, 1);
            max-width: 380px; display: flex; align-items: center; gap: 12px;
            font-family: 'Inter', sans-serif; border-left: 4px solid ${color.bg};
        `;
    notif.innerHTML = `<i class="fas ${color.icon}" style="font-size:18px;"></i> ${message}`;

    container.appendChild(notif);

    setTimeout(() => {
      notif.classList.add("hide");
      setTimeout(() => notif.remove(), 400);
    }, 3500);
  },
};

window.SWOT = SWOT;
