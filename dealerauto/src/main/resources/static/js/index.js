
const API_KEY = "pk_cgOeSLYJQ-KDrK3Q6vlXzw";

const BRAND_DOMAIN_MAP = {
  Volkswagen: "vw.com",
  BMW: "bmw.com",
  "Mercedes-Benz": "mercedes-benz.com",
  Audi: "audi.com",
  Porsche: "porsche.com",
  Opel: "opel.com",
  Skoda: "skoda-auto.com",
  Toyota: "toyota.com",
  Volvo: "volvocars.com",
  Honda: "honda.com",
  Nissan: "nissan-global.com",
  Mazda: "mazda.com",
  Subaru: "subaru.com",
  Suzuki: "suzuki.com",
  Mitsubishi: "mitsubishi-motors.com",
  Dacia: "dacia.ro",
  MG: "mgmotor.ro",
  Smart: "smart.com",
  Isuzu: "isuzu.co.jp",
  Ford: "ford.com",
  Chevrolet: "chevrolet.com",
  Iveco: "iveco.com",
  Seat: "seat.com",
  Tesla: "tesla.com",
  Dodge: "dodge.com",
  Jeep: "jeep.com",
  Renault: "renault.ro",
  Peugeot: "peugeot.com",
  Citroen: "citroen.com",
  Hyundai: "hyundai.com",
  Kia: "kia.com",
  "Land Rover": "landrover.com",
  Jaguar: "jaguar.com",
  Mini: "mini.com",
  Fiat: "fiat.com",
  "Alfa Romeo": "alfaromeo.com",
};

function generateFloatingLogos() {
  const container = document.getElementById("floatingLogos");
  if (!container) return;

  const domains = Object.values(BRAND_DOMAIN_MAP);

  const logoCount = Math.min(36, domains.length);
  const startIndex = 0;
  for (let i = 0; i < logoCount; i++) {
    const index = (startIndex + i) % domains.length;
    createFloatingLogo(container, domains[index], i);
  }
}

function createFloatingLogo(container, domain, index) {
  const logo = document.createElement("img");

  logo.src = `https://img.logo.dev/${domain}?token=${API_KEY}&size=80&retina=true`;
  logo.alt = domain;
  logo.className = "floating-logo";

  const position = getRandomPosition(index);
  logo.style.top = position.top;
  logo.style.left = position.left;

  const animation = getRandomAnimation();
  logo.style.animation = `float-${animation.type} ${animation.duration}s infinite ease-in-out`;
  logo.style.animationDelay = `${animation.delay}s`;

  container.appendChild(logo);
}

function getRandomPosition(index) {
  const zones = [
    { top: "5%", left: "5%" },
    { top: "5%", left: "50%" },
    { top: "5%", left: "90%" },
    { top: "30%", left: "10%" },
    { top: "30%", left: "60%" },
    { top: "30%", left: "85%" },
    { top: "60%", left: "8%" },
    { top: "60%", left: "45%" },
    { top: "60%", left: "80%" },
    { top: "85%", left: "15%" },
    { top: "85%", left: "55%" },
    { top: "85%", left: "88%" },
  ];
  if (index < zones.length) {
    return zones[index];
  } else {
    return {
      top: `${Math.random() * 80 + 5}%`,
      left: `${Math.random() * 85 + 5}%`,
    };
  }
}

function getRandomAnimation() {
  return {
    type: Math.floor(Math.random() * 4) + 1, // float-1 până float-4
    duration: Math.random() * 10 + 20, // 20-30 secunde
    delay: Math.random() * 5, // 0-5 secunde delay
  };
}

/* ================================
   CANDLE / FLASHLIGHT — CURSOR EFFECT
   ================================ */

function initCandle() {
  const mainLight = document.createElement("div");
  mainLight.className = "candle-main";
  document.body.appendChild(mainLight);

  // Card candle — auriu, pe fiecare card
  document.querySelectorAll(".card").forEach((card) => {
    const glow = document.createElement("div");
    glow.className = "card-candle";
    card.appendChild(glow);

    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      glow.style.left = (e.clientX - rect.left) + "px";
      glow.style.top = (e.clientY - rect.top) + "px";
      glow.style.opacity = "1";
    });

    card.addEventListener("mouseleave", () => {
      glow.style.opacity = "0";
    });
  });

  let onCard = false;
  let lastTrailTime = 0;
  const TRAIL_INTERVAL = 25;
  const MAX_TRAILS = 80;
  const REVEAL_RADIUS = 120;

  document.addEventListener("mousemove", (e) => {
    const isCard = !!e.target.closest(".card");

    if (isCard) {
      onCard = true;
      mainLight.style.opacity = "0";
      return;
    }

    if (onCard) {
      onCard = false;
    }

    mainLight.style.left = e.clientX + "px";
    mainLight.style.top = e.clientY + "px";
    mainLight.style.opacity = "1";

    const now = Date.now();
    if (now - lastTrailTime >= TRAIL_INTERVAL) {
      lastTrailTime = now;
      createTrailSpot(e.clientX, e.clientY);
    }

    revealLogos(e.clientX, e.clientY);
  });

  document.addEventListener("mouseleave", () => {
    mainLight.style.opacity = "0";
    resetLogos();
  });

  function createTrailSpot(x, y) {
    const existing = document.querySelectorAll(".candle-trail");
    if (existing.length >= MAX_TRAILS) return;

    const spot = document.createElement("div");
    spot.className = "candle-trail";
    spot.style.left = x + "px";
    spot.style.top = y + "px";
    document.body.appendChild(spot);
    spot.addEventListener("animationend", () => spot.remove());
  }

  /* --- UNDO: pentru a reveni la comportamentul vechi, inlocuieste
         tot blocul revealLogos + resetLogos cu versiunea din BACKUP mai jos.

  // === BACKUP REVEAL (comportament vechi — fara persistenta) ===
  // function revealLogos(cx, cy) {
  //   const logos = document.querySelectorAll(".floating-logo");
  //   logos.forEach((logo) => {
  //     const rect = logo.getBoundingClientRect();
  //     const lx = rect.left + rect.width / 2;
  //     const ly = rect.top + rect.height / 2;
  //     const dist = Math.sqrt((cx - lx) ** 2 + (cy - ly) ** 2);
  //     if (dist < REVEAL_RADIUS) {
  //       const factor = 1 - dist / REVEAL_RADIUS;
  //       logo.style.opacity = 0.12 + factor * 0.78;
  //       logo.style.filter =
  //         "grayscale(" + (100 - factor * 100) + "%) brightness(" + (200 - factor * 100) + "%)";
  //       logo.style.transition = "opacity 0.15s, filter 0.15s";
  //     } else {
  //       logo.style.transition = "opacity 0.5s, filter 0.5s";
  //       logo.style.opacity = "";
  //       logo.style.filter = "";
  //     }
  //   });
  // }
  // function resetLogos() {
  //   document.querySelectorAll(".floating-logo").forEach((logo) => {
  //     logo.style.transition = "opacity 0.5s, filter 0.5s";
  //     logo.style.opacity = "";
  //     logo.style.filter = "";
  //   });
  // }
  // === END BACKUP ===
  */

  const LOGO_LINGER_MS = 3000;

  function revealLogos(cx, cy) {
    const logos = document.querySelectorAll(".floating-logo");
    logos.forEach((logo) => {
      const rect = logo.getBoundingClientRect();
      const lx = rect.left + rect.width / 2;
      const ly = rect.top + rect.height / 2;
      const dist = Math.sqrt((cx - lx) ** 2 + (cy - ly) ** 2);

      if (dist < REVEAL_RADIUS) {
        const factor = 1 - dist / REVEAL_RADIUS;
        logo.style.transition = "opacity 0.15s, filter 0.15s";
        logo.style.opacity = 0.12 + factor * 0.78;
        logo.style.filter =
          "grayscale(" + (100 - factor * 100) + "%) brightness(" + (200 - factor * 100) + "%)";
        logo._revealed = true;
        if (logo._lingerTimer) {
          clearTimeout(logo._lingerTimer);
          logo._lingerTimer = null;
        }
      } else if (logo._revealed && !logo._lingerTimer) {
        logo._lingerTimer = setTimeout(() => {
          logo.style.transition = "opacity 1.5s ease-out, filter 1.5s ease-out";
          logo.style.opacity = "";
          logo.style.filter = "";
          logo._revealed = false;
          logo._lingerTimer = null;
        }, LOGO_LINGER_MS);
      }
    });
  }

  function resetLogos() {
    document.querySelectorAll(".floating-logo").forEach((logo) => {
      if (logo._lingerTimer) {
        clearTimeout(logo._lingerTimer);
        logo._lingerTimer = null;
      }
      if (logo._revealed) {
        logo._lingerTimer = setTimeout(() => {
          logo.style.transition = "opacity 1.5s ease-out, filter 1.5s ease-out";
          logo.style.opacity = "";
          logo.style.filter = "";
          logo._revealed = false;
          logo._lingerTimer = null;
        }, LOGO_LINGER_MS);
      }
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  generateFloatingLogos();
  initCandle();

});

