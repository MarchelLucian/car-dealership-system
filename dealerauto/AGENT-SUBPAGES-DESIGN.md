# Design unitar pentru paginile agent (subpagini cars-management / sales)

**Referință implementată:** `/agent-dashboard/cars-management/add-brand` (add-brand.html)

Aplică **exact** următoarele modificări pe fiecare pagină accesibilă de pe cars-management (și ulterior de pe sales), **fără** a schimba niciun `font-size` sau alte mărimi setate manual în CSS-urile existente (add-car.css, add-sale.css, etc.).

---

## 1. În `<head>` – linkuri CSS și fonturi

**Adaugă** (după viewport/title, înainte sau după restul linkurilor existente, păstrând ordinea logică):

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&family=Outfit:wght@400;500;600;700&display=swap" rel="stylesheet">
```

**Adaugă** după `agent-page-wrapper.css` (dacă există):

```html
<link rel="stylesheet" th:href="@{/css/agent-dashboard-bg.css}" />
<link rel="stylesheet" th:href="@{/css/agent-top-bar.css}" />
```

- Fonturile (Outfit, DM Sans) și agent-top-bar.css dau același font-family și același aspect pentru **Go Back** și **Agent greeting**.
- agent-dashboard-bg.css dă același **fundal** (gradient, mesh, shapes, grid) în interiorul page-wrapper.
- **Nu** modifica ordinea sau conținutul fișierelor CSS specifice paginii (ex: add-car.css, add-sale.css) și **nu** schimba niciun `font-size` în ele.

---

## 2. Structura în `<body>` – page-wrapper, fundal, content

**Înlocuie** structura din `<body>` astfel:

- Păstrează un singur **`<div class="page-wrapper">`** la rădăcină.
- **Imediat** după deschiderea `page-wrapper`, adaugă blocul de fundal:

```html
<!-- Fundal (ca pe agent-dashboard / cars-management) -->
<div class="agent-dashboard-bg" aria-hidden="true">
    <div class="bg-gradient"></div>
    <div class="bg-mesh"></div>
    <div class="bg-shapes">
        <span class="shape shape-1"></span>
        <span class="shape shape-2"></span>
        <span class="shape shape-3"></span>
        <span class="shape shape-4"></span>
        <span class="shape shape-5"></span>
    </div>
    <div class="bg-grid"></div>
</div>
```

- **După** acest bloc, deschide:

```html
<div class="agent-dashboard-content">
```

- **În interiorul** `agent-dashboard-content`:
  - Păstrează **top bar-ul** existent (Go Back + Agent greeting), cu aceleași clase: `top-bar`, `back-btn top-back`, `agent-greeting`, `#agentNameBadge`. Doar asigură-te că este primul element în `agent-dashboard-content`.
  - Păstrează **tot restul conținutului** paginii (container, form, titluri, etc.) exact ca înainte; doar închide corect `</div>` pentru noul wrapper `agent-dashboard-content` înainte de a închide `page-wrapper`.

- **Înainte** de `</body>`, adaugă:

```html
<script th:src="@{/js/agent-dashboard-bg.js}"></script>
```

Acest script alege aleatoriu una dintre cele 8 variante de umbre pentru fundal.

---

## 3. Rezumat modificări per pagină

| Ce | Acțiune |
|----|--------|
| **Font** | Google Fonts (Outfit, DM Sans) + agent-top-bar.css (font-family pe body) |
| **Go Back & Agent greeting** | Stil din agent-top-bar.css (gradient, poziționare left 40px / right 40px, top 24px) |
| **Fundal page-wrapper** | agent-dashboard-bg.css + bloc HTML `.agent-dashboard-bg` (gradient, mesh, shapes, grid) |
| **Încadrare** | agent-page-wrapper.css (max-width 1800px, borduri verde/gri, border-radius 10px) – deja folosit |
| **Font-size / mărimi** | **Nemodificate** – păstrează toate valorile din add-car.css, add-sale.css etc. |

---

## 4. Pagini de actualizat (din cars-management)

- [x] **add-brand** – făcut
- [x] **add-car** – făcut
- [x] **add-provider** – făcut
- [x] **edit-listings** – făcut
- [x] **retract-car** – făcut
- [x] **car-inventory** – făcut (fonts, bg, top-bar, wrapper + turcoaz tabel/UI, butoane gradient; roșu/verde păstrat la status și swap)

## 5. Pagini sales (același pattern)

- [x] **add-sale** – făcut
- [ ] **view-my-sales** (aplică același pattern ca car-inventory: page-wrapper + bg + top-bar + font; dacă are tabel, turcoaz + butoane gradient; păstrează roșu/verde la status/swap)
- [x] **add-client** – făcut

---

## 8. Modificări specifice Car Inventory / View My Sales

Pentru pagini cu **tabel** și **butoane multiple** (ex: car-inventory, view-my-sales):

1. **HTML:** La fel ca celelalte subpagini (Google Fonts, agent-dashboard-bg.css, agent-top-bar.css, bloc `.agent-dashboard-bg`, wrapper `.agent-dashboard-content`, `top-back` pe back-btn, script agent-dashboard-bg.js).

2. **Culori turcoaz (în loc de verde):**
   - **Închis turcoaz:** `#0f766e` (header tabel, titluri, label-uri, borduri principale).
   - **Deschis turcoaz:** `#ccfbf1` (rânduri impare tabel, input-uri), `#99f6e4` (rânduri pare, hover).
   - **Borduri:** `#14b8a6` (celule tabel, inputs).

3. **Butoane (același gradient ca Go Back):**
   - `background: linear-gradient(135deg, #166534, #0d9488);`
   - `:hover` / `:active`: `background: linear-gradient(135deg, #052e16, #0f766e);`
   - Aplicat la: edit, pagination, action-btn, sale-btn, search-btn, apply-btn, filters-toggle-btn, model-search-button, sort-btn. **Nu** schimba dimensiuni/poziționare.

4. **Păstrat neschimbat:**
   - **Status buttons:** Disponibilă = verde (#1faa00), Indisponibilă = roșu (#d00000); icon swap/refresh = roșu (#ec0b0b).
   - **Reset button:** roșu (#8b1a1a).
   - **Mesaje eroare / not-found:** roșu ca în imagine.
   - Toate **font-size**, **padding**, **margin**, **width**, **height** rămân ca alese manual.

---

## 6. Exemplu complet (add-brand) – ordine head

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:...&family=Outfit:...&display=swap" rel="stylesheet">
<link rel="stylesheet" th:href="@{/css/add-car.css}">
<link rel="stylesheet" href="...font-awesome..."/>
<link rel="stylesheet" th:href="@{/css/agent-page-wrapper.css}" />
<link rel="stylesheet" th:href="@{/css/agent-dashboard-bg.css}" />
<link rel="stylesheet" th:href="@{/css/agent-top-bar.css}" />
<script th:src="@{/js/add-brand.js}"></script>
```

## 7. Exemplu structură body (add-brand)

```html
<body>
<div class="page-wrapper">
    <div class="agent-dashboard-bg" aria-hidden="true">
        <!-- gradient, mesh, shapes, grid -->
    </div>
    <div class="agent-dashboard-content">
        <div class="top-bar">...</div>
        <div class="container">
            <!-- form, titlu, mesaje -->
        </div>
    </div>
</div>
<script th:src="@{/js/agent-dashboard-bg.js}"></script>
</body>
```
