// ====================================================
// INDEX.JS - Generare logo-uri plutitoare
// ====================================================

const API_KEY = "pk_cgOeSLYJQ-KDrK3Q6vlXzw";

// Map-ul complet de mărci (exact ca în CarLogoService)
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

// ====================================================
// GENERARE LOGO-URI PLUTITOARE
// ====================================================
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

// ====================================================
// CREEAZĂ UN LOGO PLUTITOR
// ====================================================
function createFloatingLogo(container, domain, index) {
  const logo = document.createElement("img");

  // URL logo
  logo.src = `https://img.logo.dev/${domain}?token=${API_KEY}&size=80&retina=true`;
  logo.alt = domain;
  logo.className = "floating-logo";

  // Poziție random
  const position = getRandomPosition(index);
  logo.style.top = position.top;
  logo.style.left = position.left;

  // Animație random
  const animation = getRandomAnimation();
  logo.style.animation = `float-${animation.type} ${animation.duration}s infinite ease-in-out`;
  logo.style.animationDelay = `${animation.delay}s`;

  // Adaugă în container
  container.appendChild(logo);
}

// ====================================================
// POZIȚII RANDOM (DISTRIBUITE PE ECRAN)
// ====================================================
function getRandomPosition(index) {
  // Împarte ecranul în zone pentru distribuție mai bună
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

  // Dacă avem mai multe logo-uri decât zone, generăm poziții random
  if (index < zones.length) {
    return zones[index];
  } else {
    return {
      top: `${Math.random() * 80 + 5}%`,
      left: `${Math.random() * 85 + 5}%`,
    };
  }
}

// ====================================================
// ANIMAȚII RANDOM
// ====================================================
function getRandomAnimation() {
  return {
    type: Math.floor(Math.random() * 4) + 1, // float-1 până float-4
    duration: Math.random() * 10 + 20, // 20-30 secunde
    delay: Math.random() * 5, // 0-5 secunde delay
  };
}

// ====================================================
// INIȚIALIZARE LA ÎNCĂRCARE
// ====================================================
document.addEventListener("DOMContentLoaded", () => {
  generateFloatingLogos();
});
