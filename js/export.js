/* ============================================================
   EXPORT REPORT - SIPEDES
   ============================================================ */

const ExportReport = {
  toPDF: function () {
    if (typeof jspdf === "undefined" || typeof html2canvas === "undefined") {
      this.loadLibraries("pdf");
      return;
    }

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    const content = document.getElementById("report-content");
    if (!content) {
      alert("Konten laporan tidak ditemukan!");
      return;
    }

    html2canvas(content, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    })
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const imgWidth = 210;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        doc.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);
        doc.save("Laporan_SIPEDES.pdf");
      })
      .catch((err) => {
        alert("Gagal export PDF: " + err.message);
      });
  },

  toExcel: function () {
    if (typeof XLSX === "undefined") {
      this.loadLibraries("excel");
      return;
    }

    const workbook = XLSX.utils.book_new();

    const data = [
      ["LAPORAN SIPEDES"],
      [""],
      ["Desa", "Sleman"],
      ["Kecamatan", "Sliyeg"],
      ["Kabupaten", "Indramayu"],
      [""],
      ["Total Penduduk", "4.975"],
      ["Luas Lahan", "505,50 Ha"],
      ["Jumlah Potensi", "8 Sektor"],
      ["Jumlah Strategi", "6"],
      [""],
      ["Dicetak:", new Date().toLocaleString()],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);
    XLSX.utils.book_append_sheet(workbook, ws, "Laporan SIPEDES");
    XLSX.writeFile(workbook, "Laporan_SIPEDES.xlsx");
  },

  loadLibraries: function (type) {
    const scripts = [];

    if (type === "pdf") {
      scripts.push(
        "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js",
        "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
      );
    } else if (type === "excel") {
      scripts.push(
        "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js",
      );
    }

    let loaded = 0;
    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.onload = function () {
        loaded++;
        if (loaded === scripts.length) {
          if (type === "pdf") {
            ExportReport.toPDF();
          } else if (type === "excel") {
            ExportReport.toExcel();
          }
        }
      };
      document.head.appendChild(script);
    });
  },

  print: function () {
    window.print();
  },
};

window.ExportReport = ExportReport;
