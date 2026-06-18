/**
 * ODOP Portal - Main JavaScript
 * One District One Product
 * Version: 1.0 | Prototype
 */
/* =====================================================================
 1. DOM READY
 ===================================================================== */
document.addEventListener('DOMContentLoaded', function () {
 initHeroBackgroundCarousel();
 initLoginModal();
 initLoginRegisterPage();
 initNavigation();
 initBackToTop();
 initScrollReveal();
 initCounterAnimation();
 initNewsUpdates();
 initDistrictPortalTabs();
 initFilterSidebar();
 initProfileTabs();
 initRangeSlider();
 initSearchBar();
 initDistrictMap();
 initSupplierRegistrationForm();
 initGalleryPage();
});

/* =====================================================================
 2. HERO BACKGROUND CAROUSEL
 ===================================================================== */
function initHeroBackgroundCarousel() {
 const slides = document.querySelectorAll('.hero-bg-carousel.hero-bg-slide');
 if (slides.length < 2) return;

 if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
 slides.forEach(function (slide, index) {
 slide.classList.toggle('is-active', index === 0);
 });
 return;
 }

 let activeIndex = 0;

 window.setInterval(function () {
 slides[activeIndex].classList.remove('is-active');
 activeIndex = (activeIndex + 1) % slides.length;
 slides[activeIndex].classList.add('is-active');
 }, 5000);
}

function getLoginModalMarkup() {
 return [
 '<div class="modal-overlay login-modal" id="login-register-modal" aria-hidden="true">',
 ' <div class="modal-box login-modal-box" role="dialog" aria-modal="true" aria-labelledby="login-modal-title">',
 ' <div class="login-modal-shell login-modal-view" data-login-view="login">',
 ' <button class="modal-close login-modal-close" type="button" aria-label="Close login popup" data-login-modal-close>',
 ' <i class="fas fa-times"></i>',
 ' </button>',
 ' <div class="login-modal-brandbar">',
 ' <img src="img/logo.png" alt="ODOP" class="login-modal-brand-logo" loading="lazy">',
 ' </div>',
 ' <div class="login-modal-layout">',
 ' <div class="login-modal-promo">',
 ' <h3>One Stop Platform for Suppliers, Experts &amp; Franchisors</h3>',
 ' <div class="login-modal-illustration" aria-hidden="true">',
 ' <img src="img/hero-odop-1.png" alt="ODOP login illustration" class="login-modal-illustration-image" loading="lazy">',
 ' </div>',
 ' </div>',
 ' <div class="login-modal-panel">',
 ' <button class="login-modal-back" type="button" data-login-modal-close>',
 ' <i class="fas fa-arrow-left"></i> Back',
 ' </button>',
 ' <div class="login-modal-formwrap">',
 ' <h2 id="login-modal-title">Login to Your Account</h2>',
 ' <form class="login-modal-form" onsubmit="return false;">',
 ' <label class="login-modal-field" for="login-mobile-number">',
 ' <i class="fas fa-mobile-screen-button"></i>',
 ' <input id="login-mobile-number" type="tel" inputmode="numeric" maxlength="10" placeholder="Enter Mobile Number">',
 ' </label>',
 ' <button class="btn btn-primary login-modal-submit" type="submit">Continue</button>',
 ' </form>',
 ' <p class="login-modal-register-copy">Don\'t have an account?',
 ' <button class="login-modal-register-link" type="button" data-login-view-target="register-step-1">Register</button>',
 ' </p>',
 ' </div>',
 ' </div>',
 ' </div>',
 ' </div>',
 ' <div class="login-register-screen login-modal-view" data-login-view="register-step-1" hidden>',
 ' <button class="modal-close login-modal-close" type="button" aria-label="Close registration popup" data-login-modal-close>',
 ' <i class="fas fa-times"></i>',
 ' </button>',
 ' <div class="login-register-stage">',
 ' <div class="login-register-stage-head">',
 ' <img src="img/logo.png" alt="ODOP" class="login-register-stage-logo" loading="lazy">',
 ' <h2>Welcome to ODOP</h2>',
 ' <p>One Stop Platform for Suppliers, Experts &amp; Franchisors</p>',
 ' </div>',
 ' <div class="pre-registration-grid pre-registration-grid-roles">',
 ' <button class="pre-registration-card" type="button" data-registration-choice>',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-people-arrows"></i></span>',
 ' <span class="pre-registration-card-copy">',
 ' <strong>Buyer</strong>',
 ' <span>Your selections will enable a more tailored and efficient networking experience within the ODOP ecosystem.</span>',
 ' </span>',
 ' </button>',
 ' <button class="pre-registration-card" type="button" data-registration-choice data-login-view-target="register-step-2">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-store"></i></span>',
 ' <span class="pre-registration-card-copy">',
 ' <strong>Seller</strong>',
 ' <span>Accurate category selection ensures better visibility and relevant business opportunities within the MSME network.</span>',
 ' </span>',
 ' </button>',
 ' </div>',
 ' <div class="login-register-screen-actions">',
 ' <button class="login-register-backlink" type="button" data-login-view-target="login"><i class="fas fa-arrow-left"></i> Back</button>',
 ' </div>',
 ' </div>',
 ' </div>',
 ' <div class="login-register-screen login-modal-view" data-login-view="register-step-2" hidden>',
 ' <button class="modal-close login-modal-close" type="button" aria-label="Close category selection popup" data-login-modal-close>',
 ' <i class="fas fa-times"></i>',
 ' </button>',
 ' <div class="login-register-stage">',
 ' <div class="login-register-stage-head">',
 ' <img src="img/logo.png" alt="ODOP" class="login-register-stage-logo" loading="lazy">',
 ' <h2>Explore Sectors</h2>',
 ' <p>Choose your category</p>',
 ' </div>',
 ' <div class="pre-registration-grid pre-registration-grid-sectors">',
 ' <a class="pre-registration-card pre-registration-card-link" href="supplier-registration.html?type=manufacturer">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-industry"></i></span>',
 ' <span class="pre-registration-card-copy"><strong>Manufacturer</strong><span>Producers who create goods at scale using raw materials, machinery, and labor.</span></span>',
 ' </a>',
 ' <a class="pre-registration-card pre-registration-card-link" href="supplier-registration.html?type=wholesaler">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-boxes-stacked"></i></span>',
 ' <span class="pre-registration-card-copy"><strong>Wholesaler</strong><span>Bulk suppliers who distribute products to retailers and businesses.</span></span>',
 ' </a>',
 ' <a class="pre-registration-card pre-registration-card-link" href="supplier-registration.html?type=distributor">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-truck"></i></span>',
 ' <span class="pre-registration-card-copy"><strong>Distributor</strong><span>Channel partners moving products across districts, markets and dealer networks.</span></span>',
 ' </a>',
 ' <a class="pre-registration-card pre-registration-card-link" href="supplier-registration.html?type=shopkeeper">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-shop"></i></span>',
 ' <span class="pre-registration-card-copy"><strong>Shopkeeper</strong><span>Local retail businesses selling ODOP products directly to customers.</span></span>',
 ' </a>',
 ' <a class="pre-registration-card pre-registration-card-link" href="supplier-registration.html?type=artisan">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-compass-drafting"></i></span>',
 ' <span class="pre-registration-card-copy"><strong>Artisan</strong><span>Skilled individuals crafting handmade or traditional products with unique value.</span></span>',
 ' </a>',
 ' <a class="pre-registration-card pre-registration-card-link" href="supplier-registration.html?type=exporter">',
 ' <span class="pre-registration-card-indicator" aria-hidden="true"></span>',
 ' <span class="pre-registration-card-icon"><i class="fas fa-globe"></i></span>',
 ' <span class="pre-registration-card-copy"><strong>Exporter</strong><span>Businesses taking ODOP products to national and international markets.</span></span>',
 ' </a>',
 ' </div>',
 ' <div class="login-register-screen-actions">',
 ' <button class="login-register-backlink" type="button" data-login-view-target="register-step-1"><i class="fas fa-arrow-left"></i> Back</button>',
 ' </div>',
 ' </div>',
 ' </div>',
 ' </div>',
 '</div>'
 ].join('');
}

function initLoginModal() {
 const openButtons = document.querySelectorAll('[data-login-modal-open]');

 if (!openButtons.length) return;

 let modal = document.getElementById('login-register-modal');

 if (!modal) {
 document.body.insertAdjacentHTML('beforeend', getLoginModalMarkup());
 modal = document.getElementById('login-register-modal');
 }

 if (!modal) return;

 const closeButtons = modal.querySelectorAll('[data-login-modal-close]');
 const mobileInput = modal.querySelector('#login-mobile-number');
 const loginForm = modal.querySelector('.login-modal-form');
 const viewButtons = modal.querySelectorAll('[data-login-view-target]');
 const views = modal.querySelectorAll('[data-login-view]');
 const choiceButtons = modal.querySelectorAll('[data-registration-choice]');

 function setView(viewName) {
 views.forEach(function (view) {
 const isActive = view.dataset.loginView === viewName;
 view.hidden = !isActive;
 });
 modal.dataset.currentView = viewName;

 if (viewName === 'login' && mobileInput) {
 window.setTimeout(function () {
 mobileInput.focus();
 }, 60);
 }
 }

 function openModal() {
 modal.classList.add('active');
 modal.setAttribute('aria-hidden', 'false');
 document.body.style.overflow = 'hidden';
 setView('login');
 }

 function closeModal() {
 modal.classList.remove('active');
 modal.setAttribute('aria-hidden', 'true');
 document.body.style.overflow = '';
 setView('login');
 }

 openButtons.forEach(function (button) {
 button.addEventListener('click', function (event) {
 event.preventDefault();
 openModal();
 });
 });

 closeButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 closeModal();
 });
 });

 viewButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 const targetView = button.dataset.loginViewTarget;
 if (!targetView) return;
 setView(targetView);
 });
 });

 choiceButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 const group = button.closest('.pre-registration-grid');
 if (!group) return;

 group.querySelectorAll('[data-registration-choice]').forEach(function (choice) {
 choice.classList.remove('is-selected');
 });

 button.classList.add('is-selected');
 });
 });

 if (loginForm && mobileInput) {
 loginForm.addEventListener('submit', function () {
 if (!mobileInput.value.trim()) {
 mobileInput.focus();
 return;
 }

 window.location.href = 'admincp/buyer-dashboard.html';
 });
 }

 modal.addEventListener('click', function (event) {
 if (event.target === modal) {
 closeModal();
 }
 });

 document.addEventListener('keydown', function (event) {
 if (event.key === 'Escape' && modal.classList.contains('active')) {
 closeModal();
 }
 });
}

function initLoginRegisterPage() {
 const pageFlow = document.querySelector('[data-login-register-page]');
 if (!pageFlow) return;

 const views = pageFlow.querySelectorAll('[data-login-view]');
 const viewButtons = pageFlow.querySelectorAll('[data-login-view-target]');
 const choiceButtons = pageFlow.querySelectorAll('[data-registration-choice]');
 const mobileInput = pageFlow.querySelector('#login-page-mobile-number');
 const loginForm = pageFlow.querySelector('[data-buyer-login-form]');
 const allowedViews = ['login', 'register-step-1', 'register-step-2'];

 function setView(viewName) {
 views.forEach(function (view) {
 view.hidden = view.dataset.loginView !== viewName;
 });

 if (viewName === 'login' && mobileInput) {
 window.setTimeout(function () {
 mobileInput.focus();
 }, 60);
 }
 }

 viewButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 const targetView = button.dataset.loginViewTarget;
 if (!targetView) return;
 setView(targetView);
 });
 });

 choiceButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 const group = button.closest('.pre-registration-grid');
 if (!group) return;

 group.querySelectorAll('[data-registration-choice]').forEach(function (choice) {
 choice.classList.remove('is-selected');
 });

 button.classList.add('is-selected');
 });
 });

 if (loginForm && mobileInput) {
 loginForm.addEventListener('submit', function () {
 if (!mobileInput.value.trim()) {
 mobileInput.focus();
 return;
 }

 window.location.href = 'admincp/buyer-dashboard.html';
 });
 }

 const params = new URLSearchParams(window.location.search);
 const initialView = params.get('view');
 setView(allowedViews.includes(initialView) ? initialView : 'login');
}

/* =====================================================================
 3. NAVIGATION
 ===================================================================== */
function initNavigation() {
 const navToggle = document.querySelector('.nav-toggle');
 const navMenu = document.querySelector('.nav-menu');
 const siteHeader = document.querySelector('.site-header');
 const mobileNavBreakpoint = window.matchMedia('(max-width: 767px)');

 function closeMobileMenu() {
 if (!navToggle || !navMenu) return;

 navToggle.classList.remove('active');
 navMenu.classList.remove('open');
 document.body.style.overflow = '';
 navMenu.querySelectorAll('.nav-item-dropdown.is-open').forEach(function (item) {
 item.classList.remove('is-open');
 });
 }

 // Mobile hamburger toggle
 if (navToggle && navMenu) {
 navToggle.addEventListener('click', function () {
 this.classList.toggle('active');
 navMenu.classList.toggle('open');
 document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';

 if (!navMenu.classList.contains('open')) {
 navMenu.querySelectorAll('.nav-item-dropdown.is-open').forEach(function (item) {
 item.classList.remove('is-open');
 });
 }
 });

 // Toggle dropdown parents on mobile, close menu only for leaf links
 navMenu.querySelectorAll('.nav-link').forEach(function (link) {
 link.addEventListener('click', function (e) {
 const dropdownItem = link.closest('.nav-item-dropdown');

 if (dropdownItem && mobileNavBreakpoint.matches) {
 e.preventDefault();
 e.stopPropagation();

 const isOpen = dropdownItem.classList.contains('is-open');

 navMenu.querySelectorAll('.nav-item-dropdown.is-open').forEach(function (item) {
 item.classList.remove('is-open');
 });

 if (!isOpen) {
 dropdownItem.classList.add('is-open');
 }

 return;
 }

 closeMobileMenu();
 });
 });

 navMenu.querySelectorAll('.nav-submenu a').forEach(function (link) {
 link.addEventListener('click', function () {
 closeMobileMenu();
 });
 });

 // Close menu on outside click
 document.addEventListener('click', function (e) {
 if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
 closeMobileMenu();
 }
 });
 }

 // Sticky header shadow on scroll
 if (siteHeader) {
 window.addEventListener('scroll', function () {
 if (window.scrollY > 10) {
 siteHeader.style.boxShadow = '0 2px 20px rgba(0,0,0,0.14)';
 } else {
 siteHeader.style.boxShadow = '0 2px 12px rgba(0,0,0,0.10)';
 }
 }, { passive: true });
 }

 // Set active nav link based on current page
 const currentPage = window.location.pathname.split('/').pop() || 'index.html';
 document.querySelectorAll('.nav-link').forEach(function (link) {
 const href = link.getAttribute('href');
 if (href === currentPage || (currentPage === '' && href === 'index.html')) {
 link.classList.add('active');
 }
 });
}

/* =====================================================================
 3. BACK TO TOP BUTTON
 ===================================================================== */
function initBackToTop() {
 const btn = document.getElementById('back-to-top');
 if (!btn) return;

 window.addEventListener('scroll', function () {
 if (window.scrollY > 500) {
 btn.classList.add('visible');
 } else {
 btn.classList.remove('visible');
 }
 }, { passive: true });

 btn.addEventListener('click', function () {
 window.scrollTo({ top: 0, behavior: 'smooth' });
 });
}

/* =====================================================================
 4. SCROLL REVEAL ANIMATION
 ===================================================================== */
function initScrollReveal() {
 alert('Scroll reveal animations have been temporarily disabled to improve performance. They will be re-enabled in a future update.');
 const observer = new IntersectionObserver(function (entries) {
 entries.forEach(function (entry) {
 if (entry.isIntersecting) {
 entry.target.classList.add('visible');
 }
 });
 }, {
 threshold: 0.12,
 rootMargin: '0px 0px -40px 0px'
 });

 document.querySelectorAll('.reveal').forEach(function (el) {
 observer.observe(el);
 });
}

/* =====================================================================
 5. COUNTER ANIMATION
 ===================================================================== */
function initCounterAnimation() {
 const counters = document.querySelectorAll('.stat-number,.mini-stat-number');
 if (!counters.length) return;

 const observer = new IntersectionObserver(function (entries) {
 entries.forEach(function (entry) {
 if (entry.isIntersecting && !entry.target.dataset.animated) {
 entry.target.dataset.animated = 'true';
 animateCounter(entry.target);
 }
 });
 }, { threshold: 0.5 });

 counters.forEach(function (counter) { observer.observe(counter); });
}

function animateCounter(el) {
 const text = el.textContent.trim();
 const suffix = text.replace(/[0-9,]/g, '');
 const target = parseInt(text.replace(/[^0-9]/g, ''), 10);
 if (isNaN(target)) return;

 const duration = 1800;
 const startTime = performance.now();

 function update(currentTime) {
 const elapsed = currentTime - startTime;
 const progress = Math.min(elapsed / duration, 1);
 const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
 const current = Math.floor(eased * target);

 el.textContent = current.toLocaleString('en-IN') + suffix;

 if (progress < 1) {
 requestAnimationFrame(update);
 } else {
 el.textContent = text; // restore exact original
 }
 }

 requestAnimationFrame(update);
}

/* =====================================================================
 6. NEWS UPDATES FILTERS
 ===================================================================== */
function initNewsUpdates() {
 const section = document.getElementById('news-events');
 if (!section) return;

 const filterButtons = section.querySelectorAll('.news-filter-btn');
 const cards = section.querySelectorAll('.news-update-card');
 const emptyState = section.querySelector('.news-updates-empty');

 if (!filterButtons.length || !cards.length) return;

 function applyFilter(filterValue) {
 let visibleCount = 0;

 cards.forEach(function (card) {
 const category = card.dataset.category;
 const shouldShow = filterValue === 'all' || category === filterValue;
 card.classList.toggle('is-hidden', !shouldShow);
 if (shouldShow) visibleCount += 1;
 });

 if (emptyState) {
 emptyState.hidden = visibleCount !== 0;
 }
 }

 filterButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 const filterValue = this.dataset.filter || 'all';

 filterButtons.forEach(function (btn) {
 const isActive = btn === button;
 btn.classList.toggle('is-active', isActive);
 btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
 });

 applyFilter(filterValue);
 });
 });

 applyFilter('all');
}

/* =====================================================================
 7. DISTRICT PORTAL TABS
 ===================================================================== */
function initDistrictPortalTabs() {
 const tabLists = document.querySelectorAll('.district-portal-tab-list');
 if (!tabLists.length) return;

 tabLists.forEach(function (tabList) {
 const tabs = Array.from(tabList.querySelectorAll('.district-portal-tab'));
 const panels = tabs.map(function (tab) {
 const panelId = tab.getAttribute('aria-controls');
 return panelId ? document.getElementById(panelId) : null;
 }).filter(Boolean);

 function activateTab(nextTab) {
 const targetPanelId = nextTab.getAttribute('aria-controls');

 tabs.forEach(function (tab) {
 const isActive = tab === nextTab;
 tab.classList.toggle('active', isActive);
 tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
 tab.setAttribute('tabindex', isActive ? '0' : '-1');
 });

 panels.forEach(function (panel) {
 const isActive = panel.id === targetPanelId;
 panel.hidden = !isActive;
 panel.classList.toggle('active', isActive);
 });
 }

 tabs.forEach(function (tab, index) {
 tab.addEventListener('click', function () {
 activateTab(tab);
 });

 tab.addEventListener('keydown', function (event) {
 let nextIndex = index;

 if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
 if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
 if (event.key === 'Home') nextIndex = 0;
 if (event.key === 'End') nextIndex = tabs.length - 1;

 if (nextIndex !== index) {
 event.preventDefault();
 tabs[nextIndex].focus();
 activateTab(tabs[nextIndex]);
 }
 });
 });
 });
}

/* =====================================================================
 7. FILTER SIDEBAR (Mobile Toggle)
 ===================================================================== */
function initFilterSidebar() {
 const mobileFilterBtn = document.querySelector('.mobile-filter-btn');
 const filterSidebar = document.querySelector('.filter-sidebar');
 const filterClose = document.querySelector('.filter-close');
 const applyFiltersBtn = document.querySelector('.filter-sidebar-footer.btn');

 function closeFilterSidebar() {
 if (!filterSidebar) return;
 filterSidebar.classList.remove('open');
 }

 if (mobileFilterBtn && filterSidebar) {
 mobileFilterBtn.addEventListener('click', function () {
 filterSidebar.classList.toggle('open');
 });
 }

 if (filterClose && filterSidebar) {
 filterClose.addEventListener('click', function () {
 closeFilterSidebar();
 });
 }

 if (applyFiltersBtn && filterSidebar) {
 applyFiltersBtn.addEventListener('click', function () {
 closeFilterSidebar();
 });
 }

 // Filter group collapse/expand
 document.querySelectorAll('.filter-group-title').forEach(function (title) {
 title.addEventListener('click', function () {
 const options = this.nextElementSibling;
 if (options) {
 const isOpen = options.style.display !== 'none';
 options.style.display = isOpen ? 'none' : 'flex';
 const icon = this.querySelector('.toggle-icon');
 if (icon) icon.style.transform = isOpen ? 'rotate(-90deg)' : 'rotate(0)';
 }
 });
 });

 // Clear all filters
 const clearBtn = document.querySelector('.filter-clear');
 if (clearBtn) {
 clearBtn.addEventListener('click', function () {
 document.querySelectorAll('.filter-option input').forEach(function (input) {
 input.checked = false;
 });
 const rangeInputs = document.querySelectorAll('.range-slider input[type="range"]');
 rangeInputs.forEach(function (input) {
 input.value = input.defaultValue;
 });
 });
 }
}

/* =====================================================================
 8. PROFILE TABS
 ===================================================================== */
function initProfileTabs() {
 const tabs = document.querySelectorAll('.profile-tab');
 const panels = document.querySelectorAll('.tab-panel');

 tabs.forEach(function (tab) {
 tab.addEventListener('click', function () {
 const target = this.dataset.tab;

 tabs.forEach(function (t) { t.classList.remove('active'); });
 this.classList.add('active');

 panels.forEach(function (panel) {
 if (panel.id === target) {
 panel.style.display = 'block';
 panel.classList.add('animate-fadeIn');
 } else {
 panel.style.display = 'none';
 }
 });
 });
 });
}

/* =====================================================================
 9. RANGE SLIDER
 ===================================================================== */
function initRangeSlider() {
 document.querySelectorAll('.range-slider').forEach(function (wrapper) {
 const input = wrapper.querySelector('input[type="range"]');
 const minLabel = wrapper.parentElement.querySelector('.range-min');
 const maxLabel = wrapper.parentElement.querySelector('.range-max');

 if (!input) return;

 input.addEventListener('input', function () {
 if (maxLabel) maxLabel.textContent = '₹' + parseInt(this.value).toLocaleString('en-IN');
 });
 });
}

/* =====================================================================
 9. SEARCH BAR
 ===================================================================== */
function initSearchBar() {
 const searchForm = document.querySelector('.hero-search');
 if (!searchForm) return;

 const searchInput = searchForm.querySelector('input[type="text"]');
 const promptChips = document.querySelectorAll('.hero-prompt-chip');

 function redirectToSearch(query) {
 const url = new URL('supplier-listing.html', window.location.href);
 if (query) {
 url.searchParams.set('q', query);
 }
 window.location.href = url.toString();
 }

 searchForm.addEventListener('submit', function (e) {
 e.preventDefault();
 const query = searchInput?.value.trim();
 redirectToSearch(query);
 });

 if (searchInput) {
 searchInput.addEventListener('keydown', function (e) {
 if (e.key === 'Enter') {
 e.preventDefault();
 redirectToSearch(searchInput.value.trim());
 }
 });
 }

 promptChips.forEach(function (chip) {
 chip.addEventListener('click', function () {
 const prompt = this.dataset.prompt || this.textContent.trim();
 if (searchInput) {
 searchInput.value = prompt;
 }
 redirectToSearch(prompt);
 });
 });
}

/* =====================================================================
 10. DISTRICT MAP
 ===================================================================== */
function initDistrictMap() {
 const image = document.querySelector('.district-map-image');
 const map = document.querySelector('map[name="odop-up-map"]');
 if (!image || !map) return;

 const districtLabelOverrides = {
 'bulandshahar': 'Bulandshahr',
 'pratabgarh': 'Pratapgarh',
 'siddharthnagar': 'Siddharthnagar'
 };

 const areas = map.querySelectorAll('area');

 function getDistrictLabel(area) {
 const rawLabel = (area.getAttribute('title') || area.getAttribute('alt') || '').trim();
 const normalizedKey = rawLabel.toLowerCase().replace(/[-_]+/g, ' ').replace(/\s+/g, ' ').trim();

 if (districtLabelOverrides[normalizedKey]) {
 return districtLabelOverrides[normalizedKey];
 }

 return normalizedKey.split(' ').filter(Boolean).map(function (word) {
 return word.length <= 2
 ? word.toUpperCase()
 : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
 }).join(' ');
 }

 function updateAreaLinks() {
 areas.forEach(function (area) {
 const districtLabel = getDistrictLabel(area);

 if (!area.dataset.originalCoords) {
 area.dataset.originalCoords = area.coords;
 }

 area.setAttribute('title', districtLabel);
 area.setAttribute('alt', districtLabel);
 area.setAttribute('aria-label', districtLabel);
 area.setAttribute('href', 'agra-district-profile.html?district=' + encodeURIComponent(districtLabel));
 });
 }

 function resizeImageMap() {
 if (!image.naturalWidth || !image.naturalHeight) return;

 const scaleX = image.clientWidth / image.naturalWidth;
 const scaleY = image.clientHeight / image.naturalHeight;

 areas.forEach(function (area) {
 const originalCoords = area.dataset.originalCoords;
 if (!originalCoords) return;

 const scaledCoords = originalCoords.split(',').map(function (coord, index) {
 const scale = index % 2 === 0 ? scaleX : scaleY;
 return Math.round(parseFloat(coord) * scale);
 });

 area.coords = scaledCoords.join(',');
 });
 }

 updateAreaLinks();

 if (image.complete) {
 resizeImageMap();
 } else {
 image.addEventListener('load', resizeImageMap, { once: true });
 }

 window.addEventListener('resize', resizeImageMap, { passive: true });
}

/* =====================================================================
 11. SUPPLIER REGISTRATION FORM
 ===================================================================== */
function initSupplierRegistrationForm() {
 const formPage = document.querySelector('.supplier-registration-page');
 if (!formPage) return;

 const typeInputs = formPage.querySelectorAll('input[name="profileType"]');
 const panels = formPage.querySelectorAll('.registration-type-panel');
 const conditionalGroups = formPage.querySelectorAll('.registration-conditional');
 const supportedTypes = ['manufacturer', 'wholesaler', 'distributor', 'shopkeeper', 'artisan', 'exporter'];

 const profileTypeContent = {
 manufacturer: {
 businessNameLabel: 'Business / Legal Name',
 businessNamePlaceholder: 'e.g. Taj Leather World Pvt. Ltd.',
 displayNameLabel: 'Profile Display Name',
 displayNamePlaceholder: 'Name to show on the public profile',
 contactPersonLabel: 'Owner / Contact Person',
 contactPersonPlaceholder: 'Primary business contact',
 designationLabel: 'Designation',
 designationPlaceholder: 'Managing Director, Sales Head, Proprietor, etc.',
 districtLabel: 'District',
 areaLabel: 'City / Market / Industrial Area',
 areaPlaceholder: 'e.g. Nunhai Industrial Area, Sadar Bazar',
 addressLabel: 'Full Business Address',
 addressPlaceholder: 'Enter full registered or operational address',
 pincodeLabel: 'Pincode',
 pincodePlaceholder: '6-digit pincode',
 yearLabel: 'Year Established',
 yearPlaceholder: 'e.g. 2006',
 logoLabel: 'Logo / Profile Image URL',
 logoPlaceholder: 'Image path or uploaded asset URL',
 bannerLabel: 'Banner / Cover Image URL',
 bannerPlaceholder: 'Background image used in the profile banner',
 summaryLabel: 'Profile Summary Line',
 summaryPlaceholder: 'e.g. Manufacturer & Exporter | Nunhai Industrial Area, Agra | Established 1998',
 overviewLabel: 'About Business / Overview',
 overviewPlaceholder: 'Write the main overview paragraph(s) shown in the profile overview tab',
 badges: ['ODOP Verified Supplier', 'Top Rated', 'Export House', 'ISO Certified', 'Ready Dispatch', 'GST Compliant'],
 operationsCopy: 'Fill the common details first, then provide the type-specific business metrics that appear in the overview and sidebar panels.',
 coreCategoryLabel: 'ODOP Product / Core Category',
 coreCategoryPlaceholder: 'e.g. Leather Goods, Chikankari, Brassware',
 webLabel: 'Business Website / Marketplace Link',
 webPlaceholder: 'https://example.com',
 taxLabel: 'GSTIN',
 taxPlaceholder: 'GST registration number',
 licenseLabel: 'Udyam / Registration Number',
 licensePlaceholder: 'MSME, trade licence or other registration',
 productsHeading: '5. Product Catalogue & Pricing',
 productsCopy: 'These fields map to the product cards shown on supplier and wholesaler profile pages.',
 productCardPrefix: 'Product Entry',
 productNameLabel: 'Product Name',
 productNamePlaceholders: ['e.g. Premium Ladies Leather Bag', 'Second listed product', 'Third listed product'],
 priceLabel: 'Price Range',
 pricePlaceholders: ['e.g. ₹1,200 - ₹3,500', 'Price band', 'Price band'],
 lotLabel: 'MOQ / Order Lot',
 lotPlaceholders: ['e.g. 50 pieces / 120 pieces', 'Order quantity', 'Order quantity'],
 productNoteLabel: 'Short Description',
 productNotePlaceholder: 'Short description shown below the product card.',
 contactHeading: '6. Contact, Sidebar & Enquiry Setup',
 primaryPhoneLabel: 'Primary Phone',
 primaryPhonePlaceholder: 'Main business phone number',
 secondaryPhoneLabel: 'Secondary Phone',
 secondaryPhonePlaceholder: 'Landline or alternate number',
 whatsappLabel: 'WhatsApp Number',
 whatsappPlaceholder: 'WhatsApp-enabled mobile number',
 emailLabel: 'Public Email',
 emailPlaceholder: 'sales@company.com',
 ctaLabel: 'CTA Button Label',
 ctaPlaceholder: 'e.g. Send Enquiry / Request Price List',
 sidebarTitleLabel: 'Sidebar Contact Title',
 sidebarTitlePlaceholder: 'e.g. Contact Details / Sales Desk',
 glanceLabel: 'At a Glance Summary',
 glancePlaceholder: 'Provide the concise sidebar facts: supplier type, product focus, order bracket, stock status, dispatch timeline, etc.',
 enquiryIntroLabel: 'Enquiry Form Intro',
 enquiryIntroPlaceholder: 'Intro text shown above the public enquiry form.',
 compliance: ['GST certificate available', 'Trade licence available', 'Udyam registration available', 'Product photos ready', 'Catalogue / price list ready', 'Address proof verified']
 },
 wholesaler: {
 businessNameLabel: 'Wholesale Business Name',
 businessNamePlaceholder: 'e.g. Balaji Leather Traders',
 displayNameLabel: 'Profile Display Name',
 displayNamePlaceholder: 'Public wholesale counter name',
 contactPersonLabel: 'Sales Head / Trade Contact',
 contactPersonPlaceholder: 'Primary wholesale contact',
 designationLabel: 'Designation',
 designationPlaceholder: 'Sales Manager, Proprietor, Trade Partner, etc.',
 districtLabel: 'District',
 areaLabel: 'Market / Trade Zone / Warehouse Area',
 areaPlaceholder: 'e.g. Sadar Bazar Trade Zone, Transport Nagar',
 addressLabel: 'Warehouse / Trade Address',
 addressPlaceholder: 'Enter the main warehouse, trade office or billing address',
 pincodeLabel: 'Pincode',
 pincodePlaceholder: '6-digit pincode',
 yearLabel: 'Year Established',
 yearPlaceholder: 'e.g. 2006',
 logoLabel: 'Logo / Trade Counter Image URL',
 logoPlaceholder: 'Trade logo, warehouse logo or storefront image URL',
 bannerLabel: 'Banner / Warehouse Image URL',
 bannerPlaceholder: 'Background image used for the wholesale profile banner',
 summaryLabel: 'Profile Summary Line',
 summaryPlaceholder: 'e.g. Wholesaler & Distribution Partner | Sadar Bazar, Agra | Established 2006',
 overviewLabel: 'About Trade Business / Overview',
 overviewPlaceholder: 'Write the trade overview shown in the wholesaler profile page.',
 badges: ['ODOP Verified Wholesaler', 'Bulk Stockist', 'Ready Dispatch', 'GST Compliant', 'Dealer Network', 'Trade Counter Supply'],
 operationsCopy: 'Fill the trade details first, then provide wholesale-specific stock, dispatch and dealer-network metrics.',
 coreCategoryLabel: 'ODOP Product / Trade Category',
 coreCategoryPlaceholder: 'e.g. Leather goods, packaged stock, ready inventory',
 webLabel: 'Business Website / Catalogue Link',
 webPlaceholder: 'https://example.com/catalogue',
 taxLabel: 'GSTIN',
 taxPlaceholder: 'Wholesale GST registration number',
 licenseLabel: 'Trade Licence / Registration Number',
 licensePlaceholder: 'Trade licence, Udyam or warehouse registration',
 productsHeading: '5. Bulk Stock Catalogue & Pricing',
 productsCopy: 'These fields map to the stock cards shown on wholesaler profile pages.',
 productCardPrefix: 'Stock Entry',
 productNameLabel: 'Stock / Category Name',
 productNamePlaceholders: ['e.g. Retail Wallet Assortment', 'Second stock category', 'Third stock category'],
 priceLabel: 'Trade Price Range',
 pricePlaceholders: ['e.g. ₹190 - ₹420', 'Trade price band', 'Trade price band'],
 lotLabel: 'Wholesale Lot / Order Quantity',
 lotPlaceholders: ['e.g. 120 pieces', 'Lot size', 'Lot size'],
 productNoteLabel: 'Stock Note',
 productNotePlaceholder: 'Short note shown below the stock card.',
 contactHeading: '6. Sales Desk, Sidebar & Trade Enquiry Setup',
 primaryPhoneLabel: 'Sales Desk Phone',
 primaryPhonePlaceholder: 'Main wholesale contact number',
 secondaryPhoneLabel: 'Alternate Sales Phone',
 secondaryPhonePlaceholder: 'Landline or backup trade contact',
 whatsappLabel: 'Trade WhatsApp Number',
 whatsappPlaceholder: 'WhatsApp number for price-list and stock enquiries',
 emailLabel: 'Sales Email',
 emailPlaceholder: 'sales@company.com',
 ctaLabel: 'CTA Button Label',
 ctaPlaceholder: 'e.g. Request Price List',
 sidebarTitleLabel: 'Sidebar Contact Title',
 sidebarTitlePlaceholder: 'e.g. Sales Desk',
 glanceLabel: 'Trade Glance Summary',
 glancePlaceholder: 'Provide concise sidebar facts: stock status, lot size, dispatch window, dealer base, etc.',
 enquiryIntroLabel: 'Trade Enquiry Intro',
 enquiryIntroPlaceholder: 'Intro text shown above the wholesale enquiry form.',
 compliance: ['GST certificate available', 'Trade licence available', 'Warehouse proof available', 'Stock photos ready', 'Price list ready', 'Address proof verified']
 },
 distributor: {
 businessNameLabel: 'Distribution Business Name',
 businessNamePlaceholder: 'e.g. Royal Channel Distribution',
 displayNameLabel: 'Profile Display Name',
 displayNamePlaceholder: 'Public distributor profile name',
 contactPersonLabel: 'Channel / Territory Contact',
 contactPersonPlaceholder: 'Primary distributor contact',
 designationLabel: 'Designation',
 designationPlaceholder: 'Territory Manager, Channel Head, Proprietor, etc.',
 districtLabel: 'District / Primary Territory Base',
 areaLabel: 'Service Hub / Territory Base',
 areaPlaceholder: 'e.g. Agra depot, Kanpur route office',
 addressLabel: 'Hub / Office Address',
 addressPlaceholder: 'Enter the dispatch hub, depot or distribution office address',
 pincodeLabel: 'Hub Pincode',
 pincodePlaceholder: '6-digit pincode',
 yearLabel: 'Year Established',
 yearPlaceholder: 'e.g. 2012',
 logoLabel: 'Logo / Distributor Image URL',
 logoPlaceholder: 'Distributor logo or route team image URL',
 bannerLabel: 'Banner / Route or Delivery Image URL',
 bannerPlaceholder: 'Background image used in the distributor profile banner',
 summaryLabel: 'Profile Summary Line',
 summaryPlaceholder: 'e.g. Regional Distributor | Agra & Western region | Established 2012',
 overviewLabel: 'About Distribution Business / Overview',
 overviewPlaceholder: 'Write the overview used on the distributor profile page.',
 badges: ['ODOP Verified Distributor', 'Regional Coverage', 'Fast Replenishment', 'GST Compliant', 'Retail Network', 'Delivery Support'],
 operationsCopy: 'Fill the common details first, then provide route coverage, retailer network and delivery metrics for the distributor profile.',
 coreCategoryLabel: 'Product / Distribution Category',
 coreCategoryPlaceholder: 'e.g. Leather goods retail distribution',
 webLabel: 'Business Website / Dealer Portal Link',
 webPlaceholder: 'https://example.com/dealers',
 taxLabel: 'GSTIN',
 taxPlaceholder: 'Distributor GST registration number',
 licenseLabel: 'Distribution Licence / Registration Number',
 licensePlaceholder: 'Trade licence, Udyam or channel registration',
 productsHeading: '5. Distributed Product Lines',
 productsCopy: 'These fields map to the product lines or supply categories shown on distributor profile pages.',
 productCardPrefix: 'Line Entry',
 productNameLabel: 'Product Line',
 productNamePlaceholders: ['e.g. Formal Shoe Distribution Line', 'Second product line', 'Third product line'],
 priceLabel: 'Trade Price Band',
 pricePlaceholders: ['e.g. ₹920 - ₹1,850', 'Trade price band', 'Trade price band'],
 lotLabel: 'Reorder / Supply Quantity',
 lotPlaceholders: ['e.g. 80 pairs', 'Reorder quantity', 'Reorder quantity'],
 productNoteLabel: 'Channel Note',
 productNotePlaceholder: 'Short note shown below the product line card.',
 contactHeading: '6. Territory Contact, Sidebar & Dealer Enquiry Setup',
 primaryPhoneLabel: 'Territory Phone',
 primaryPhonePlaceholder: 'Main distributor contact number',
 secondaryPhoneLabel: 'Secondary Territory Phone',
 secondaryPhonePlaceholder: 'Backup contact for route support',
 whatsappLabel: 'Dealer WhatsApp Number',
 whatsappPlaceholder: 'WhatsApp number for retailer and dealer follow-up',
 emailLabel: 'Distribution Email',
 emailPlaceholder: 'channel@company.com',
 ctaLabel: 'CTA Button Label',
 ctaPlaceholder: 'e.g. Request Dealer Support',
 sidebarTitleLabel: 'Sidebar Contact Title',
 sidebarTitlePlaceholder: 'e.g. Territory Contact',
 glanceLabel: 'Territory Summary',
 glancePlaceholder: 'Provide concise sidebar facts: territory, retailer count, delivery cycle, servicing model, etc.',
 enquiryIntroLabel: 'Dealer Enquiry Intro',
 enquiryIntroPlaceholder: 'Intro text shown above the distributor enquiry form.',
 compliance: ['GST certificate available', 'Trade licence available', 'Delivery network verified', 'Route photos / proof ready', 'Dealer list available', 'Address proof verified']
 },
 shopkeeper: {
 businessNameLabel: 'Store / Shop Name',
 businessNamePlaceholder: 'e.g. Agra Heritage Leather Store',
 displayNameLabel: 'Profile Display Name',
 displayNamePlaceholder: 'Public retail profile name',
 contactPersonLabel: 'Store Owner / Contact Person',
 contactPersonPlaceholder: 'Primary store contact',
 designationLabel: 'Designation',
 designationPlaceholder: 'Owner, Store Manager, Retail Partner, etc.',
 districtLabel: 'District / Store Location',
 areaLabel: 'Market / Shopping Area',
 areaPlaceholder: 'e.g. Sadar Bazar, Taj Ganj, Mall Road',
 addressLabel: 'Store Address',
 addressPlaceholder: 'Enter the storefront or retail address',
 pincodeLabel: 'Store Pincode',
 pincodePlaceholder: '6-digit pincode',
 yearLabel: 'Year Started',
 yearPlaceholder: 'e.g. 2018',
 logoLabel: 'Store Logo / Frontage Image URL',
 logoPlaceholder: 'Store logo or frontage image URL',
 bannerLabel: 'Banner / Store Interior Image URL',
 bannerPlaceholder: 'Background image used in the retail profile banner',
 summaryLabel: 'Profile Summary Line',
 summaryPlaceholder: 'e.g. Retail Leather Store | Sadar Bazar, Agra | Since 2018',
 overviewLabel: 'About Store / Overview',
 overviewPlaceholder: 'Write the overview used on the public shopkeeper profile.',
 badges: ['ODOP Verified Retailer', 'Walk-in Friendly', 'Tourist Favourite', 'GST Compliant', 'Gift Packaging', 'Ready Stock'],
 operationsCopy: 'Fill the common details first, then provide storefront, footfall and retail-customer information for the shopkeeper profile.',
 coreCategoryLabel: 'Retail Category / ODOP Product',
 coreCategoryPlaceholder: 'e.g. leather goods, handcrafted gifting, tourist retail',
 webLabel: 'Business Website / Social Store Link',
 webPlaceholder: 'https://instagram.com/yourstore or website URL',
 taxLabel: 'GSTIN',
 taxPlaceholder: 'Retail GST registration number',
 licenseLabel: 'Trade Licence / Shop Registration',
 licensePlaceholder: 'Shop licence or local registration number',
 productsHeading: '5. Retail Product Display',
 productsCopy: 'These fields map to the featured items shown on a shopkeeper profile page.',
 productCardPrefix: 'Retail Entry',
 productNameLabel: 'Display Product Name',
 productNamePlaceholders: ['e.g. Tourist Gift Leather Wallet', 'Second displayed product', 'Third displayed product'],
 priceLabel: 'Selling Price / Range',
 pricePlaceholders: ['e.g. ₹420 - ₹980', 'Selling price band', 'Selling price band'],
 lotLabel: 'Available Quantity / Pack',
 lotPlaceholders: ['e.g. ready stock / 20 pieces', 'Available quantity', 'Available quantity'],
 productNoteLabel: 'Retail Note',
 productNotePlaceholder: 'Short note shown below the retail product card.',
 contactHeading: '6. Store Contact, Sidebar & Customer Enquiry Setup',
 primaryPhoneLabel: 'Store Phone',
 primaryPhonePlaceholder: 'Main store contact number',
 secondaryPhoneLabel: 'Alternate Store Phone',
 secondaryPhonePlaceholder: 'Landline or backup store number',
 whatsappLabel: 'Customer WhatsApp Number',
 whatsappPlaceholder: 'WhatsApp number for customer queries and reservations',
 emailLabel: 'Store Email',
 emailPlaceholder: 'store@company.com',
 ctaLabel: 'CTA Button Label',
 ctaPlaceholder: 'e.g. Enquire / Reserve Product',
 sidebarTitleLabel: 'Sidebar Contact Title',
 sidebarTitlePlaceholder: 'e.g. Store Contact',
 glanceLabel: 'Store Summary',
 glancePlaceholder: 'Provide concise sidebar facts: store type, footfall, stock position, customer segment, etc.',
 enquiryIntroLabel: 'Customer Enquiry Intro',
 enquiryIntroPlaceholder: 'Intro text shown above the retail enquiry form.',
 compliance: ['GST certificate available', 'Shop licence available', 'Storefront photos ready', 'Product display photos ready', 'Retail pricing ready', 'Address proof verified']
 },
 artisan: {
 businessNameLabel: 'Artisan / Workshop Name',
 businessNamePlaceholder: 'e.g. Rafiq Handcrafted Leather Studio',
 displayNameLabel: 'Public Artisan Name',
 displayNamePlaceholder: 'Name to show on the artisan profile',
 contactPersonLabel: 'Artisan / Master Craftsperson',
 contactPersonPlaceholder: 'Primary craft contact',
 designationLabel: 'Role / Identity',
 designationPlaceholder: 'Master Artisan, Craftsperson, SHG Member, etc.',
 districtLabel: 'District / Craft Base',
 areaLabel: 'Village / Mohalla / Craft Cluster',
 areaPlaceholder: 'e.g. artisan cluster, village, local workshop area',
 addressLabel: 'Workshop / Home Unit Address',
 addressPlaceholder: 'Enter the workshop, home unit or craft cluster address',
 pincodeLabel: 'Workshop Pincode',
 pincodePlaceholder: '6-digit pincode',
 yearLabel: 'Years of Practice / Since',
 yearPlaceholder: 'e.g. 18 years or since 2007',
 logoLabel: 'Artisan / Workshop Image URL',
 logoPlaceholder: 'Workshop image, artisan portrait or craft identity image URL',
 bannerLabel: 'Craft Process / Workshop Banner URL',
 bannerPlaceholder: 'Background image showing the craft process or workshop',
 summaryLabel: 'Profile Summary Line',
 summaryPlaceholder: 'e.g. Handcrafted Leather Artisan | Agra Craft Cluster | 18 Years of Practice',
 overviewLabel: 'Craft Story / Overview',
 overviewPlaceholder: 'Write the artisan story, handmade process and craft background shown in the overview tab.',
 badges: ['ODOP Verified Artisan', 'Handcrafted', 'Traditional Skill', 'Custom Orders', 'Award / Recognition', 'Workshop Visits'],
 operationsCopy: 'Fill the common details first, then provide artisan-specific craft practice, workshop and handmade capacity details.',
 coreCategoryLabel: 'Craft / ODOP Category',
 coreCategoryPlaceholder: 'e.g. hand-stitched leather work, chikankari, terracotta',
 webLabel: 'Portfolio / Social Link',
 webPlaceholder: 'Instagram, Facebook page, portfolio or marketplace link',
 taxLabel: 'GSTIN / Artisan ID',
 taxPlaceholder: 'GST number, artisan card or cooperative ID',
 licenseLabel: 'SHG / Cooperative / Registration Number',
 licensePlaceholder: 'Artisan card, SHG, cooperative or local registration',
 productsHeading: '5. Handmade Product Showcase',
 productsCopy: 'These fields map to the handmade pieces or artisan showcase cards shown on artisan profile pages.',
 productCardPrefix: 'Craft Entry',
 productNameLabel: 'Craft Product Name',
 productNamePlaceholders: ['e.g. Hand-stitched Leather Journal', 'Second craft piece', 'Third craft piece'],
 priceLabel: 'Selling Price / Range',
 pricePlaceholders: ['e.g. ₹850 - ₹1,500', 'Selling price band', 'Selling price band'],
 lotLabel: 'Custom Order / Batch Size',
 lotPlaceholders: ['e.g. 10-25 pieces per batch', 'Batch size', 'Batch size'],
 productNoteLabel: 'Craft Note',
 productNotePlaceholder: 'Short note about the handmade process, finish or customisation.',
 contactHeading: '6. Artisan Contact, Sidebar & Buyer Enquiry Setup',
 primaryPhoneLabel: 'Artisan Phone',
 primaryPhonePlaceholder: 'Primary artisan contact number',
 secondaryPhoneLabel: 'Coordinator / Alternate Phone',
 secondaryPhonePlaceholder: 'Alternate buyer support or family contact',
 whatsappLabel: 'WhatsApp / Buyer Contact',
 whatsappPlaceholder: 'WhatsApp number for buyer communication and custom orders',
 emailLabel: 'Public Email / Coordinator Email',
 emailPlaceholder: 'artisan@craftstudio.in or coordinator email',
 ctaLabel: 'CTA Button Label',
 ctaPlaceholder: 'e.g. Request Custom Order',
 sidebarTitleLabel: 'Sidebar Contact Title',
 sidebarTitlePlaceholder: 'e.g. Artisan Contact',
 glanceLabel: 'Artisan Summary',
 glancePlaceholder: 'Provide concise sidebar facts: craft type, years of practice, batch size, custom order ability, etc.',
 enquiryIntroLabel: 'Buyer Enquiry Intro',
 enquiryIntroPlaceholder: 'Intro text shown above the artisan enquiry form.',
 compliance: ['Artisan ID / SHG proof available', 'Workshop address proof available', 'Craft process photos ready', 'Finished product photos ready', 'Pricing / custom-order sheet ready', 'Bank / payment details verified']
 },
 exporter: {
 businessNameLabel: 'Exporter / Company Name',
 businessNamePlaceholder: 'e.g. Global Agra Leather Exports',
 displayNameLabel: 'Public Export Profile Name',
 displayNamePlaceholder: 'Name to show on the exporter profile',
 contactPersonLabel: 'Export / International Trade Contact',
 contactPersonPlaceholder: 'Primary export contact',
 designationLabel: 'Designation',
 designationPlaceholder: 'Export Director, International Sales Manager, Proprietor, etc.',
 districtLabel: 'District / Export Base',
 areaLabel: 'Factory / Export Office / Logistics Base',
 areaPlaceholder: 'e.g. export office, industrial area or logistics hub',
 addressLabel: 'Export Office / Factory Address',
 addressPlaceholder: 'Enter the export office, factory or logistics address',
 pincodeLabel: 'Office Pincode',
 pincodePlaceholder: '6-digit pincode',
 yearLabel: 'Year Established',
 yearPlaceholder: 'e.g. 2010',
 logoLabel: 'Exporter Logo URL',
 logoPlaceholder: 'Company logo or export business identity image URL',
 bannerLabel: 'Banner / Export Shipment Image URL',
 bannerPlaceholder: 'Background image used in the exporter profile banner',
 summaryLabel: 'Profile Summary Line',
 summaryPlaceholder: 'e.g. Leather Exporter | Agra Export Hub | 20+ Global Markets',
 overviewLabel: 'About Export Business / Overview',
 overviewPlaceholder: 'Write the international trade overview shown on the exporter profile page.',
 badges: ['ODOP Verified Exporter', 'Global Markets', 'IEC Registered', 'Buyer Compliance', 'Export Packaging', 'DGFT / Export House'],
 operationsCopy: 'Fill the common details first, then provide exporter-specific market coverage, compliance and shipping information.',
 coreCategoryLabel: 'Export Product Category',
 coreCategoryPlaceholder: 'e.g. leather accessories, fashion exports, gift products',
 webLabel: 'Website / B2B Export Link',
 webPlaceholder: 'https://example.com or B2B marketplace profile',
 taxLabel: 'GSTIN',
 taxPlaceholder: 'GST registration number for export business',
 licenseLabel: 'IEC / DGFT / Registration Number',
 licensePlaceholder: 'IEC, DGFT, RCMC or export registration',
 productsHeading: '5. Export Product Showcase',
 productsCopy: 'These fields map to the export-ready products shown on exporter profile pages.',
 productCardPrefix: 'Export Entry',
 productNameLabel: 'Export Product Name',
 productNamePlaceholders: ['e.g. Leather Laptop Bag for EU Buyers', 'Second export-ready product', 'Third export-ready product'],
 priceLabel: 'FOB / Trade Price Range',
 pricePlaceholders: ['e.g. $12 - $24 or INR equivalent', 'FOB price band', 'FOB price band'],
 lotLabel: 'Export MOQ / Shipment Lot',
 lotPlaceholders: ['e.g. 300 pieces / container lot', 'Shipment lot', 'Shipment lot'],
 productNoteLabel: 'Export Note',
 productNotePlaceholder: 'Short note about compliance, packaging or buyer-market fit.',
 contactHeading: '6. Export Contact, Sidebar & Buyer Enquiry Setup',
 primaryPhoneLabel: 'Export Desk Phone',
 primaryPhonePlaceholder: 'Main export contact number',
 secondaryPhoneLabel: 'Alternate Export Phone',
 secondaryPhonePlaceholder: 'Backup international trade contact',
 whatsappLabel: 'Buyer WhatsApp Number',
 whatsappPlaceholder: 'WhatsApp number for buyer coordination and sample follow-up',
 emailLabel: 'Export Email',
 emailPlaceholder: 'exports@company.com',
 ctaLabel: 'CTA Button Label',
 ctaPlaceholder: 'e.g. Contact Export Desk',
 sidebarTitleLabel: 'Sidebar Contact Title',
 sidebarTitlePlaceholder: 'e.g. Export Desk',
 glanceLabel: 'Export Summary',
 glancePlaceholder: 'Provide concise sidebar facts: markets served, MOQ, compliance, shipment lead time, etc.',
 enquiryIntroLabel: 'International Buyer Enquiry Intro',
 enquiryIntroPlaceholder: 'Intro text shown above the exporter enquiry form.',
 compliance: ['GST certificate available', 'IEC / DGFT documents available', 'Buyer compliance documents ready', 'Export product photos ready', 'FOB / export price sheet ready', 'Address proof verified']
 }
 };

 function setText(id, value) {
 const element = document.getElementById(id);
 if (element) {
 element.textContent = value;
 }
 }

 function setLabel(id, value, isRequired) {
 const element = document.getElementById(id);
 if (!element) return;

 element.textContent = value;
 if (isRequired) {
 const required = document.createElement('span');
 required.className = 'required';
 required.textContent = '*';
 element.appendChild(document.createTextNode(' '));
 element.appendChild(required);
 }
 }

 function setPlaceholder(id, value) {
 const element = document.getElementById(id);
 if (element) {
 element.setAttribute('placeholder', value);
 }
 }

 function updateSharedFields(activeType) {
 const content = profileTypeContent[activeType];
 if (!content) return;

 setLabel('registrationBusinessNameLabel', content.businessNameLabel, true);
 setPlaceholder('registrationBusinessNameInput', content.businessNamePlaceholder);
 setLabel('registrationDisplayNameLabel', content.displayNameLabel, true);
 setPlaceholder('registrationDisplayNameInput', content.displayNamePlaceholder);
 setLabel('registrationContactPersonLabel', content.contactPersonLabel, true);
 setPlaceholder('registrationContactPersonInput', content.contactPersonPlaceholder);
 setLabel('registrationDesignationLabel', content.designationLabel, false);
 setPlaceholder('registrationDesignationInput', content.designationPlaceholder);
 setLabel('registrationDistrictLabel', content.districtLabel, true);
 setLabel('registrationAreaLabel', content.areaLabel, false);
 setPlaceholder('registrationAreaInput', content.areaPlaceholder);
 setLabel('registrationAddressLabel', content.addressLabel, true);
 setPlaceholder('registrationAddressInput', content.addressPlaceholder);
 setLabel('registrationPincodeLabel', content.pincodeLabel, false);
 setPlaceholder('registrationPincodeInput', content.pincodePlaceholder);
 setLabel('registrationYearLabel', content.yearLabel, false);
 setPlaceholder('registrationYearInput', content.yearPlaceholder);

 setLabel('registrationLogoLabel', content.logoLabel, false);
 setPlaceholder('registrationLogoInput', content.logoPlaceholder);
 setLabel('registrationBannerLabel', content.bannerLabel, false);
 setPlaceholder('registrationBannerInput', content.bannerPlaceholder);
 setLabel('registrationSummaryLabel', content.summaryLabel, false);
 setPlaceholder('registrationSummaryInput', content.summaryPlaceholder);
 setLabel('registrationOverviewLabel', content.overviewLabel, true);
 setPlaceholder('registrationOverviewInput', content.overviewPlaceholder);

 content.badges.forEach(function (badge, index) {
 setText('registrationBadge' + (index + 1), badge);
 });

 setText('registrationOperationsCopy', content.operationsCopy);
 setLabel('registrationCoreCategoryLabel', content.coreCategoryLabel, true);
 setPlaceholder('registrationCoreCategoryInput', content.coreCategoryPlaceholder);
 setLabel('registrationWebLabel', content.webLabel, false);
 setPlaceholder('registrationWebInput', content.webPlaceholder);
 setLabel('registrationTaxLabel', content.taxLabel, false);
 setPlaceholder('registrationTaxInput', content.taxPlaceholder);
 setLabel('registrationLicenseLabel', content.licenseLabel, false);
 setPlaceholder('registrationLicenseInput', content.licensePlaceholder);

 setText('registrationProductsHeading', content.productsHeading);
 setText('registrationProductsCopy', content.productsCopy);
 ['1', '2', '3'].forEach(function (index, arrayIndex) {
 setText('registrationProductCard' + index + 'Heading', content.productCardPrefix + ' ' + index);
 setLabel('registrationProductNameLabel' + index, content.productNameLabel, false);
 setPlaceholder('registrationProductNameInput' + index, content.productNamePlaceholders[arrayIndex]);
 setLabel('registrationPriceLabel' + index, content.priceLabel, false);
 setPlaceholder('registrationPriceInput' + index, content.pricePlaceholders[arrayIndex]);
 setLabel('registrationLotLabel' + index, content.lotLabel, false);
 setPlaceholder('registrationLotInput' + index, content.lotPlaceholders[arrayIndex]);
 setLabel('registrationProductNoteLabel' + index, content.productNoteLabel, false);
 setPlaceholder('registrationProductNoteInput' + index, content.productNotePlaceholder);
 });

 setText('registrationContactHeading', content.contactHeading);
 setLabel('registrationPrimaryPhoneLabel', content.primaryPhoneLabel, true);
 setPlaceholder('registrationPrimaryPhoneInput', content.primaryPhonePlaceholder);
 setLabel('registrationSecondaryPhoneLabel', content.secondaryPhoneLabel, false);
 setPlaceholder('registrationSecondaryPhoneInput', content.secondaryPhonePlaceholder);
 setLabel('registrationWhatsappLabel', content.whatsappLabel, false);
 setPlaceholder('registrationWhatsappInput', content.whatsappPlaceholder);
 setLabel('registrationEmailLabel', content.emailLabel, true);
 setPlaceholder('registrationEmailInput', content.emailPlaceholder);
 setLabel('registrationCtaLabel', content.ctaLabel, false);
 setPlaceholder('registrationCtaInput', content.ctaPlaceholder);
 setLabel('registrationSidebarTitleLabel', content.sidebarTitleLabel, false);
 setPlaceholder('registrationSidebarTitleInput', content.sidebarTitlePlaceholder);
 setLabel('registrationGlanceLabel', content.glanceLabel, false);
 setPlaceholder('registrationGlanceInput', content.glancePlaceholder);
 setLabel('registrationEnquiryIntroLabel', content.enquiryIntroLabel, false);
 setPlaceholder('registrationEnquiryIntroInput', content.enquiryIntroPlaceholder);

 content.compliance.forEach(function (item, index) {
 setText('registrationCompliance' + (index + 1), item);
 });
 }

 function updateConditionalGroups(activeType) {
 conditionalGroups.forEach(function (group) {
 const supportedTypes = (group.dataset.profileTypes || '')
.split(',')
.map(function (value) {
 return value.trim();
 })
.filter(Boolean);

 const shouldShow = supportedTypes.includes(activeType);
 group.classList.toggle('is-hidden', !shouldShow);
 });
 }

 function updateTypePanels() {
 const activeType = formPage.querySelector('input[name="profileType"]:checked')?.value;
 panels.forEach(function (panel) {
 panel.classList.toggle('is-active', panel.dataset.type === activeType);
 });
 updateSharedFields(activeType);
 updateConditionalGroups(activeType);
 }

 typeInputs.forEach(function (input) {
 input.addEventListener('change', updateTypePanels);
 });

 const params = new URLSearchParams(window.location.search);
 const selectedType = (params.get('type') || '').toLowerCase();

 if (supportedTypes.includes(selectedType)) {
 typeInputs.forEach(function (input) {
 input.checked = input.value === selectedType;
 });
 }

 updateTypePanels();
}

/* =====================================================================
 12. GALLERY PAGE
 ===================================================================== */
function initGalleryPage() {
 const galleryPage = document.querySelector('.gallery-page,.gallery-showcase-section,.gallerySwiper');
 if (!galleryPage) return;

 initGalleryModal();
 initGalleryShowcaseSwiper();
 initGallerySuccessStorySwipers();
 initGallerySuccessStoryControls();
 initGalleryTabs();
}

function initGalleryModal() {
 const cards = Array.from(document.querySelectorAll('.pin-card,.reel-video-card'));
 const modal = document.getElementById('modal');
 const modalBody = document.getElementById('modalBody');
 const closeBtn = document.getElementById('closeBtn');
 const prevBtn = document.getElementById('prevBtn');
 const nextBtn = document.getElementById('nextBtn');

 if (!cards.length || !modal || !modalBody || !closeBtn || !prevBtn || !nextBtn) return;

 let currentIndex = 0;

 function openModalForIndex(index) {
 currentIndex = index;
 const card = cards[currentIndex];
 if (!card) return;

 const isVideo = card.dataset.video === 'true' || card.classList.contains('reel-video-card');
 const src = card.dataset.src || card.querySelector('.reel-video source')?.src;
 const fallbackImage = card.querySelector('img')?.src || card.dataset.src || '';

 modalBody.innerHTML = isVideo
 ? '<video src="' + src + '" controls autoplay class="modal-media"></video>'
 : '<img src="' + fallbackImage + '" class="modal-media" alt="Gallery media">';

 modal.style.display = 'flex';
 document.body.style.overflow = 'hidden';
 }

 function closeModal() {
 modal.style.display = 'none';
 modalBody.innerHTML = '';
 document.body.style.overflow = '';
 }

 cards.forEach(function (card, index) {
 if (card.classList.contains('reel-video-card')) {
 card.addEventListener('click', function (event) {
 if (!event.target.closest('.reel-controls')) {
 openModalForIndex(index);
 }
 });
 return;
 }

 card.addEventListener('click', function () {
 openModalForIndex(index);
 });
 });

 closeBtn.addEventListener('click', closeModal);
 prevBtn.addEventListener('click', function (event) {
 event.stopPropagation();
 openModalForIndex((currentIndex - 1 + cards.length) % cards.length);
 });
 nextBtn.addEventListener('click', function (event) {
 event.stopPropagation();
 openModalForIndex((currentIndex + 1) % cards.length);
 });

 modal.addEventListener('click', function (event) {
 if (event.target === modal) {
 closeModal();
 }
 });

 document.addEventListener('keydown', function (event) {
 if (modal.style.display !== 'flex') return;

 if (event.key === 'Escape') {
 closeModal();
 }

 if (event.key === 'ArrowLeft') {
 prevBtn.click();
 }

 if (event.key === 'ArrowRight') {
 nextBtn.click();
 }
 });
}

function initGalleryShowcaseSwiper() {
 const swiperEl = document.querySelector('.gallerySwiper');
 if (!swiperEl || typeof Swiper === 'undefined') return;

 const swiper = new Swiper('.gallerySwiper', {
 loop: false,
 loopAdditionalSlides: 10,
 slidesPerView: 'auto',
 spaceBetween: 0,
 speed: 4000,
 allowTouchMove: false,
 autoplay: {
 delay: 0,
 disableOnInteraction: false
 },
 freeMode: {
 enabled: true,
 momentum: false
 }
 });

 swiperEl.addEventListener('mouseenter', function () {
 swiper.wrapperEl.style.transitionDuration = '0ms';
 swiper.autoplay.stop();
 });

 swiperEl.addEventListener('mouseleave', function () {
 swiper.wrapperEl.style.transitionDuration = '4000ms';
 swiper.autoplay.start();
 });
}

function initGallerySuccessStorySwipers() {
 if (typeof Swiper === 'undefined') return;

 const successTabs = document.querySelectorAll('.tab-pane[id^="success-"]');
 if (!successTabs.length) return;

 successTabs.forEach(function (tab) {
 const swiperContainer = tab.querySelector('.success-stories-swiper');
 if (!swiperContainer) return;

 new Swiper(swiperContainer, {
 slidesPerView: 'auto',
 spaceBetween: 0,
 centeredSlides: false,
 grabCursor: true,
 keyboard: {
 enabled: true
 },
 navigation: {
 nextEl: '.swiper-button-next',
 prevEl: '.swiper-button-prev'
 },
 breakpoints: {
 320: {
 spaceBetween: 12
 },
 768: {
 spaceBetween: 15
 },
 1024: {
 spaceBetween: 20
 }
 },
 on: {
 slideChange: function () {
 this.slides.forEach(function (slide) {
 const video = slide.querySelector('.horizontal-video');
 if (!video) return;

 video.pause();
 const playBtn = slide.querySelector('.play-btn');
 if (playBtn) {
 playBtn.innerHTML = '<i class="fas fa-play"></i>';
 }
 });
 }
 }
 });
 });
}

function initGallerySuccessStoryControls() {
 const slides = document.querySelectorAll('.success-stories-swiper.swiper-slide');
 if (!slides.length) return;

 function pauseAllVideos(exceptVideo) {
 document.querySelectorAll('.success-stories-swiper.horizontal-video').forEach(function (video) {
 if (video === exceptVideo) return;

 video.pause();
 const otherBtn = video.closest('.swiper-slide')?.querySelector('.play-btn');
 if (otherBtn) {
 otherBtn.innerHTML = '<i class="fas fa-play"></i>';
 }
 });
 }

 document.querySelectorAll('.success-stories-swiper.play-btn').forEach(function (button) {
 button.addEventListener('click', function (event) {
 event.stopPropagation();
 const slide = this.closest('.swiper-slide');
 const video = slide?.querySelector('.horizontal-video');
 if (!video) return;

 if (video.paused) {
 pauseAllVideos(video);
 video.play();
 this.innerHTML = '<i class="fas fa-pause"></i>';
 return;
 }

 video.pause();
 this.innerHTML = '<i class="fas fa-play"></i>';
 });
 });

 document.querySelectorAll('.success-stories-swiper.mute-btn').forEach(function (button) {
 button.addEventListener('click', function (event) {
 event.stopPropagation();
 const video = this.closest('.swiper-slide')?.querySelector('.horizontal-video');
 if (!video) return;

 video.muted = !video.muted;
 this.innerHTML = video.muted
 ? '<i class="fas fa-volume-mute"></i>'
 : '<i class="fas fa-volume-up"></i>';
 });
 });

 document.querySelectorAll('.success-stories-swiper.expand-btn').forEach(function (button) {
 button.addEventListener('click', function (event) {
 event.stopPropagation();
 const slide = this.closest('.swiper-slide');
 const videoSrc = slide?.dataset.src;
 const modal = document.getElementById('modal');
 const modalBody = document.getElementById('modalBody');

 if (!videoSrc || !modal || !modalBody) return;

 modalBody.innerHTML = '<video src="' + videoSrc + '" controls autoplay class="modal-media"></video>';
 modal.style.display = 'flex';
 document.body.style.overflow = 'hidden';
 });
 });

 slides.forEach(function (slide) {
 slide.addEventListener('click', function (event) {
 if (event.target.closest('.horizontal-controls')) return;

 const video = this.querySelector('.horizontal-video');
 const playBtn = this.querySelector('.play-btn');
 if (!video || !playBtn) return;

 if (video.paused) {
 pauseAllVideos(video);
 video.play();
 playBtn.innerHTML = '<i class="fas fa-pause"></i>';
 return;
 }

 video.pause();
 playBtn.innerHTML = '<i class="fas fa-play"></i>';
 });
 });
}

function initGalleryTabs() {
 const allTabSections = document.querySelectorAll('.gallery-filter-tabs');
 if (!allTabSections.length) return;

 function pauseSuccessStoryVideos() {
 document.querySelectorAll('.success-stories-swiper.horizontal-video').forEach(function (video) {
 video.pause();
 const playBtn = video.closest('.swiper-slide')?.querySelector('.play-btn');
 if (playBtn) {
 playBtn.innerHTML = '<i class="fas fa-play"></i>';
 }
 });
 }

 allTabSections.forEach(function (tabSection) {
 const filterButtons = tabSection.querySelectorAll('.gallery-tab');
 const header = tabSection.closest('.masonry-header');
 const tabContent = header ? header.nextElementSibling : null;
 const tabPanes = tabContent ? tabContent.querySelectorAll('.tab-pane') : [];

 filterButtons.forEach(function (button) {
 button.addEventListener('click', function () {
 filterButtons.forEach(function (btn) {
 btn.classList.remove('active');
 });

 this.classList.add('active');
 pauseSuccessStoryVideos();

 const filterValue = this.getAttribute('data-filter') || 'all';
 let paneId = filterValue.toLowerCase().replace(/\s+/g, '-') + '-content';
 let activePane = tabContent ? tabContent.querySelector('#' + paneId) : null;

 if (!activePane && tabContent) {
 paneId = 'success-' + filterValue.toLowerCase().replace(/\s+/g, '-') + '-content';
 activePane = tabContent.querySelector('#' + paneId);
 }

 tabPanes.forEach(function (pane) {
 pane.classList.remove('active');
 });

 if (activePane) {
 activePane.classList.add('active');
 }
 });
 });
 });
}

/* =====================================================================
 11. ENQUIRY FORM (Prototype — shows success message)
 ===================================================================== */
document.addEventListener('submit', function (e) {
 const form = e.target;
 if (!form.classList.contains('enquiry-form') && !form.classList.contains('contact-form')) return;
 e.preventDefault();

 const btn = form.querySelector('button[type="submit"]');
 if (!btn) return;

 const original = btn.innerHTML;
 btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Submitting...';
 btn.disabled = true;

 setTimeout(function () {
 btn.innerHTML = '<i class="fas fa-check-circle"></i> Submitted Successfully!';
 btn.style.background = 'var(--success)';
 btn.style.borderColor = 'var(--success)';

 // Reset after 3 seconds
 setTimeout(function () {
 btn.innerHTML = original;
 btn.disabled = false;
 btn.style.background = '';
 btn.style.borderColor = '';
 form.reset();
 }, 3000);
 }, 1400);
});

/* =====================================================================
 12. SMOOTH ANCHOR SCROLLING
 ===================================================================== */
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
 anchor.addEventListener('click', function (e) {
 const target = document.querySelector(this.getAttribute('href'));
 if (!target) return;
 e.preventDefault();
 const offset = 88;
 const top = target.getBoundingClientRect().top + window.scrollY - offset;
 window.scrollTo({ top: top, behavior: 'smooth' });
 });
});

/* =====================================================================
 12. CARD HOVER RIPPLE EFFECT (subtle)
 ===================================================================== */
document.querySelectorAll('.district-card,.product-card,.scheme-card,.journey-card').forEach(function (card) {
 card.addEventListener('mouseenter', function () {
 this.style.willChange = 'transform, box-shadow';
 });
 card.addEventListener('mouseleave', function () {
 this.style.willChange = 'auto';
 });
});
