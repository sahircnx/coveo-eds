/**
 * loads and decorates the header, mainly the nav
 * @param {Element} block The header block element
 */
export default async function decorate(block) {
  // Clear the block
  block.textContent = '';

  // Create header wrapper
  const headerWrapper = document.createElement('div');
  headerWrapper.className = 'mchp-header-wrapper';

  // 1. Top Bar
  const topBar = document.createElement('div');
  topBar.className = 'mchp-top-bar';

  // Logo
  const logo = document.createElement('div');
  logo.className = 'mchp-logo';
  logo.innerHTML = `<a href="/" aria-label="Microchip Homepage">
      <div class="mchp-logo-text">
         <span style="color:var(--mchp-red);font-weight:900;margin-right:2px;">M</span>ICROCHIP
      </div>
  </a>`;

  const searchContainer = document.createElement('div');
  searchContainer.className = 'mchp-search';
  searchContainer.innerHTML = `
    <div class="mchp-search-inner">
      <input type="search" placeholder="AI-powered Search: find products, documentation or ask a question" />
      <button aria-label="Search">
        <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>
      </button>
    </div>`;

  const searchInput = searchContainer.querySelector('input');
  const searchButton = searchContainer.querySelector('button');

  const executeSearch = () => {
    const query = searchInput.value.trim();
    if (query) {
      window.location.href = `/search#q=${encodeURIComponent(query)}`;
    }
  };

  searchButton.addEventListener('click', executeSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      executeSearch();
    }
  });

  // Account / Login
  const account = document.createElement('div');
  account.className = 'mchp-account';
  account.innerHTML = `<a href="#login" aria-label="My Account" class="mchp-account-link">
      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"></path></svg>
      <span>myMicrochip</span>
      <svg focusable="false" aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="18" height="18"><path d="M7 10l5 5 5-5z"></path></svg>
  </a>`;

  topBar.append(logo, searchContainer, account);

  // 2. Main Nav
  const mainNav = document.createElement('nav');
  mainNav.className = 'mchp-main-nav';
  
  const navItems = [
    'Products',
    'Applications',
    'Design',
    'Training',
    'Sample',
    'About'
  ];

  const ul = document.createElement('ul');
  navItems.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `<a href="#${item.toLowerCase()}">${item}</a>`;
    ul.append(li);
  });
  mainNav.append(ul);

  headerWrapper.append(topBar, mainNav);
  block.append(headerWrapper);
}
