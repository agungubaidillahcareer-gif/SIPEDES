/* ============================================================
   MAIN JAVASCRIPT - SIPEDES
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  // PRELOADER
  const preloader = document.getElementById("preloader");
  if (preloader) {
    window.addEventListener("load", function () {
      setTimeout(function () {
        preloader.classList.add("hide");
      }, 600);
    });
  }

  // NAV TOGGLE
  const navToggle = document.getElementById("navToggle");
  const navMenu = document.getElementById("navMenu");
  if (navToggle && navMenu) {
    navToggle.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("open");
    });
    document.querySelectorAll(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        navToggle.classList.remove("active");
        navMenu.classList.remove("open");
      });
    });
  }

  // NAVBAR SCROLL
  const header = document.getElementById("header");
  if (header) {
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.pageYOffset > 50);
    });
  }

  // NAV LINK ACTIVE
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  if (sections.length > 0 && navLinks.length > 0) {
    window.addEventListener("scroll", function () {
      let current = "";
      sections.forEach(function (section) {
        if (window.pageYOffset >= section.offsetTop - 120) {
          current = section.getAttribute("id");
        }
      });
      navLinks.forEach(function (link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
          link.classList.add("active");
        }
      });
    });
  }

  // ANIMATED COUNTER
  function animateCounters() {
    document
      .querySelectorAll(".stat-number[data-count]")
      .forEach(function (counter) {
        const target = parseInt(counter.getAttribute("data-count"));
        const observer = new IntersectionObserver(
          function (entries) {
            entries.forEach(function (entry) {
              if (entry.isIntersecting) {
                let current = 0;
                const step = Math.max(1, Math.floor(target / 60));
                const interval = setInterval(function () {
                  current += step;
                  if (current >= target) {
                    counter.textContent = target.toLocaleString();
                    clearInterval(interval);
                  } else {
                    counter.textContent = current.toLocaleString();
                  }
                }, 30);
                observer.unobserve(counter);
              }
            });
          },
          { threshold: 0.5 },
        );
        observer.observe(counter);
      });
  }
  animateCounters();

  // SMOOTH SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
      }
    });
  });

  // SCROLL TO TOP
  const scrollBtn = document.createElement("button");
  scrollBtn.className = "scroll-top";
  scrollBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollBtn.setAttribute("aria-label", "Scroll to top");
  document.body.appendChild(scrollBtn);

  window.addEventListener("scroll", function () {
    scrollBtn.classList.toggle("visible", window.pageYOffset > 500);
  });

  scrollBtn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  console.log(
    "%c SIPEDES ",
    "background:#0f4c3a;color:#fff;padding:12px 24px;font-size:20px;font-weight:700;border-radius:6px;",
  );
  console.log(
    "%c Sistem Informasi Potensi Desa ",
    "background:#f0e0c8;color:#0f4c3a;padding:8px 16px;border-radius:6px;",
  );
});
