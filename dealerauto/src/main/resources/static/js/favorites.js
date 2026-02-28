function translateFuel(combustibil) {
  const translations = {
    benzina: "Petrol",
    motorina: "Diesel",
    electric: "Electric",
    hibrid: "Hybrid",
  };
  return translations[combustibil] || combustibil;
}

function translateTransmission(transmisie) {
  const translations = {
    manuala: "Manual",
    automata: "Automatic",
  };
  return translations[transmisie] || transmisie;
}

// ====================================================
// FORMATARE DATA ACTUALIZARE PREȚ
// ====================================================
function formatUpdateDate(dateStr) {
  if (!dateStr) return "Updated recently";

  const date = new Date(dateStr);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = monthNames[date.getMonth()];

  return `Updated on ${day} ${month}`;
}

// ====================================================
// ACTUALIZEAZĂ BADGE-URILE DE ACTUALIZARE PREȚ
// ====================================================
function updatePriceUpdateBadges() {
  const badges = document.querySelectorAll(".price-update-badge");

  badges.forEach((badge) => {
    const dateStr = badge.getAttribute("data-update-date");
    const span = badge.querySelector("span");

    if (dateStr && span) {
      span.textContent = formatUpdateDate(dateStr);
    } else if (span) {
      badge.style.display = "none";
    }
  });
}

// ====================================================
// ACTUALIZEAZĂ PLURAL PENTRU CAR
// ====================================================
function updateCarCount() {
  const carText = document.querySelector(".car-text");
  const countElement = document.querySelector(".fav-count strong");

  if (carText && countElement) {
    const count = parseInt(countElement.textContent);

    if (count === 1) {
      carText.textContent = "car";
    } else {
      carText.textContent = "cars";
    }
  }
}
// ====================================================
// FUNCȚIE PENTRU RELATIVE TIME + DATA EXACTĂ
// ====================================================
function getRelativeTimeWithDate(dateStr) {
  if (!dateStr) return "Added recently";

  const added = new Date(dateStr);
  const now = new Date();
  const diffMs = now - added;
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);
  const diffWeek = Math.floor(diffDay / 7);
  const diffMonth = Math.floor(diffDay / 30);

  // Formatare dată scurtă (Jan 5)
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const month = monthNames[added.getMonth()];
  const day = added.getDate();
  const shortDate = `${month} ${day}`;

  // Determină "relative time"
  let relativeText = "";

  if (diffSec < 60) {
    relativeText = "Added just now";
  } else if (diffMin < 60) {
    relativeText = `Added ${diffMin} min${diffMin > 1 ? "s" : ""} ago`;
  } else if (diffHour < 24) {
    relativeText = `Added ${diffHour} hour${diffHour > 1 ? "s" : ""} ago`;
  } else if (diffDay === 0) {
    relativeText = "Added today";
  } else if (diffDay === 1) {
    relativeText = "Added yesterday";
  } else if (diffDay < 7) {
    relativeText = `Added ${diffDay} day${diffDay > 1 ? "s" : ""} ago`;
  } else if (diffWeek < 4) {
    relativeText = `Added ${diffWeek} week${diffWeek > 1 ? "s" : ""} ago`;
  } else if (diffMonth < 12) {
    relativeText = `Added ${diffMonth} month${diffMonth > 1 ? "s" : ""} ago`;
  } else {
    const years = Math.floor(diffMonth / 12);
    relativeText = `Added ${years} year${years > 1 ? "s" : ""} ago`;
  }

  // Combină: "Added 3 days ago (Jan 5)"
  return `${relativeText} (${shortDate})`;
}

// ====================================================
// ACTUALIZEAZĂ BADGE-URILE LA ÎNCĂRCARE
// ====================================================
function updateFavoriteDateBadges() {
  const badges = document.querySelectorAll(".fav-date-badge");

  badges.forEach((badge) => {
    const dateStr = badge.getAttribute("data-date");
    const span = badge.querySelector("span");

    if (dateStr && span) {
      span.textContent = getRelativeTimeWithDate(dateStr);
    }
  });
}

// ====================================================
// FAVORITES.JS - Pagina de favorites
// ====================================================

document.addEventListener("DOMContentLoaded", () => {
  console.log("🎯 Favorites page loaded");

  loadCarLogos();
  loadCarImages();

  updateFavoritesCount();
  updateFavoritesStats();
  setupFavStagger();

  updateFavoriteDateBadges();
  updatePriceUpdateBadges();
  updateCarCount();

  document.querySelectorAll(".fuel-text").forEach((el) => {
    const text = el.textContent.trim();
    const value = text.split(":").pop().trim();
    const translated = translateFuel(value);
    el.innerHTML = el.innerHTML.replace(value, translated);
  });

  // Transmission
  document.querySelectorAll(".transmission-text").forEach((el) => {
    const text = el.textContent.trim();
    const value = text.split(":").pop().trim();
    const translated = translateTransmission(value);
    el.innerHTML = el.innerHTML.replace(value, translated);
  });
});

// ====================================================
// ACTUALIZEAZĂ CONTORUL DE FAVORITE (în header)
// ====================================================
function updateFavoritesCount() {
  const carBoxes = document.querySelectorAll(".fav-grid .car-box");
  const countInHeader = document.querySelector(".fav-count strong");
  if (countInHeader) {
    countInHeader.textContent = carBoxes.length;
  }
}

// ====================================================
// STATISTICI: număr mașini + total valoare (din DOM)
// ====================================================
function updateFavoritesStats() {
  const totalEl = document.getElementById("favStatsTotal");
  if (!totalEl) return;

  const boxes = document.querySelectorAll(".fav-grid .car-box");
  let total = 0;
  boxes.forEach((box) => {
    const priceEl = box.querySelector(".car-price");
    if (priceEl) {
      const text = priceEl.textContent.replace(/[^\d]/g, "");
      const num = parseInt(text, 10);
      if (!isNaN(num)) total += num;
    }
  });

  if (total > 0) {
    totalEl.textContent = total.toLocaleString("de-DE") + " €";
  } else {
    totalEl.textContent = "—";
  }
}

// ====================================================
// ANIMAȚIE INTRARE: delay progresiv pe carduri
// ====================================================
function setupFavStagger() {
  document.querySelectorAll(".fav-grid .car-box").forEach((box, i) => {
    box.style.animationDelay = `${i * 0.06}s`;
  });
}

// ====================================================
// TOGGLE FAVORITE PE PAGINA FAVORITES
// (specific pentru favorites.html - elimină cardul)
// ====================================================
let isTogglingFavoriteOnFavoritesPage = false;

function toggleFavoriteOnFavoritesPage(button, carId) {
  if (isTogglingFavoriteOnFavoritesPage) {
    return;
  }

  // 🔹 Popup custom în loc de confirm()
  showConfirmPopup(
    "Remove this car from favorites?",
    () => {
      // === ON CONFIRM ===
      isTogglingFavoriteOnFavoritesPage = true;

      fetch("/api/favorite/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `masinaId=${carId}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && !data.isAdded) {
            // Șters cu succes - elimină cardul cu animație
            const carBox = button.closest(".car-box");
            carBox.style.animation = "slideOutRight 0.5s ease-out";

            setTimeout(() => {
              carBox.remove();

              updateFavoritesCount();
              updateFavoritesStats();
              const index = favoriteMasinaIds.indexOf(carId);
              if (index > -1) {
                favoriteMasinaIds.splice(index, 1);
              }
              const remainingCars =
                document.querySelectorAll(".fav-grid .car-box").length;
              if (remainingCars === 0) {
                setTimeout(() => {
                  window.location.reload();
                }, 300);
              }
            }, 500);

            showNotification("Removed from favorites!", "success");
          }
        })
        .catch((error) => {
          console.error("Error toggling favorite:", error);
          showNotification("An error occurred. Please try again.", "error");
        })
        .finally(() => {
          isTogglingFavoriteOnFavoritesPage = false;
        });
    },
    () => {
      isTogglingFavoriteOnFavoritesPage = false;
    },
  );
}

// ====================================================
// REMOVE FROM FAVORITES
// (butonul explicit "Remove")
// ====================================================
let isRemovingFromFavorites = false;

function removeFromFavorites(button, carId) {
  if (isRemovingFromFavorites) {
    return;
  }

  //  Popup custom în loc de confirm()
  showConfirmPopup(
    "Are you sure you want to remove this car from favorites?",
    () => {
      // === ON CONFIRM ===
      isRemovingFromFavorites = true;

      // Dezactivează butonul
      button.disabled = true;
      button.innerHTML =
        '<i class="fa-solid fa-spinner fa-spin"></i> Removing...';

      fetch("/api/favorite/toggle", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `masinaId=${carId}`,
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success && !data.isAdded) {
            // Șters cu succes - animație de eliminare
            const carBox = button.closest(".car-box");
            carBox.style.animation = "slideOutRight 0.5s ease-out";

            setTimeout(() => {
              carBox.remove();
              updateFavoritesCount();
              updateFavoritesStats();
              const index = favoriteMasinaIds.indexOf(carId);
              if (index > -1) {
                favoriteMasinaIds.splice(index, 1);
              }
              const remainingCars =
                document.querySelectorAll(".fav-grid .car-box").length;
              if (remainingCars === 0) {
                setTimeout(() => {
                  window.location.reload();
                }, 300);
              }
            }, 500);

            showNotification("Removed from favorites!", "success");
          } else {
            button.disabled = false;
            button.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove';
            showNotification("Failed to remove. Please try again.", "error");
          }
        })
        .catch((error) => {
          console.error("Error removing favorite:", error);
          button.disabled = false;
          button.innerHTML = '<i class="fa-solid fa-trash-can"></i> Remove';
          showNotification("An error occurred. Please try again.", "error");
        })
        .finally(() => {
          isRemovingFromFavorites = false;
        });
    },
    () => {
      // === ON CANCEL ===
      isRemovingFromFavorites = false;
    },
  );
}

// ====================================================
// NOTIFICARE
// ====================================================
function showNotification(message, type) {
  const notification = document.createElement("div");
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === "success" ? "#28a745" : "#dc3545"};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        z-index: 9999;
        animation: slideInRight 0.3s ease-out;
        font-size: 16px;
        font-weight: 600;
    `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.4s ease-out";
    setTimeout(() => notification.remove(), 400);
  }, 4000);
}

// ====================================================
// POPUP CONFIRMARE PERSONALIZAT
// ====================================================
function showConfirmPopup(message, onConfirm, onCancel) {
  // Creează overlay
  const overlay = document.createElement("div");
  overlay.className = "fav-confirm-overlay";

  // Creează popup
  const popup = document.createElement("div");
  popup.className = "fav-confirm-popup";
  popup.innerHTML = `
        <div class="fav-confirm-icon">
            <i class="fa-solid fa-circle-exclamation"></i>
        </div>
        <h3 class="fav-confirm-title">Confirm Removal</h3>
        <p class="fav-confirm-message">${message}</p>
        <div class="fav-confirm-buttons">
            <button class="fav-confirm-btn fav-btn-cancel">Cancel</button>
            <button class="fav-confirm-btn fav-btn-confirm">Remove</button>
        </div>
    `;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);

  // Animație de intrare
  setTimeout(() => {
    overlay.classList.add("active");
    popup.classList.add("active");
  }, 10);

  // Event listeners pentru butoane
  const btnCancel = popup.querySelector(".fav-btn-cancel");
  const btnConfirm = popup.querySelector(".fav-btn-confirm");

  btnCancel.onclick = () => {
    closePopup();
    if (onCancel) onCancel();
  };

  btnConfirm.onclick = () => {
    closePopup();
    if (onConfirm) onConfirm();
  };

  // Click pe overlay pentru a închide
  overlay.onclick = (e) => {
    if (e.target === overlay) {
      closePopup();
      if (onCancel) onCancel();
    }
  };

  function closePopup() {
    overlay.classList.remove("active");
    popup.classList.remove("active");
    setTimeout(() => overlay.remove(), 300);
  }
}

// ====================================================
// ANIMAȚII CSS
// ====================================================
const style = document.createElement("style");
style.textContent = `
    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100%);
        }
    }
    
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(400px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }
`;
document.head.appendChild(style);
