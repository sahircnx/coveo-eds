import { loadCoveoAssets } from '../../scripts/coveo-utils.js';

export default function decorate(block) {
  // Parse table (support both vertical and horizontal authoring)
  const config = {};
  const rows = [...block.children];
  const isHorizontal = rows[0]?.children[1]?.textContent?.trim().toLowerCase() === 'access token';
  
  if (isHorizontal) {
    const keys = [...rows[0].children].map(col => col.textContent.trim().toLowerCase().replace(/\s/g, ''));
    const values = [...rows[1].children].map(col => col.textContent.trim());
    keys.forEach((key, i) => {
      if (key && values[i]) config[key] = values[i];
    });
  } else {
    rows.forEach((row) => {
      const key = row.children[0]?.textContent?.trim();
      const value = row.children[1]?.textContent?.trim();
      if (key && value) {
        config[key.toLowerCase().replace(/\s/g, '')] = value;
      }
    });
  }

  // clear the block visually
  block.textContent = '';

  // Initialize Coveo asynchronously so we don't block EDS decoration
  setTimeout(async () => {
    await loadCoveoAssets();
    
    await customElements.whenDefined('atomic-search-interface');
    const searchInterface = block.closest('atomic-search-interface') || document.querySelector('atomic-search-interface');
    
    if (searchInterface && config.accesstoken && config.organizationid) {
      await searchInterface.initialize({
        accessToken: config.accesstoken,
        organizationId: config.organizationid,
      });
      searchInterface.executeFirstSearch();
    }
  }, 0);
}
