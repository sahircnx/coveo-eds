import { loadCSS } from './aem.js';

let coveoLoaded = false;
let coveoLoading = null;

function loadScript(url, attrs = {}) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    Object.keys(attrs).forEach((key) => {
      script.setAttribute(key, attrs[key]);
    });
    document.head.append(script);
  });
}

/**
 * Loads Coveo assets lazily
 */
export async function loadCoveoAssets() {
  if (coveoLoaded) return;
  if (coveoLoading) {
    await coveoLoading;
    return;
  }

  coveoLoading = Promise.all([
    loadCSS('https://static.cloud.coveo.com/atomic/v3/themes/coveo.css'),
    loadScript('https://static.cloud.coveo.com/atomic/v3/atomic.esm.js', { type: 'module' })
  ]);
  // Also inject nomodule script but don't await it since it might not fire onload in modern browsers
  const nomoduleScript = document.createElement('script');
  nomoduleScript.src = 'https://static.cloud.coveo.com/atomic/v3/atomic.js';
  nomoduleScript.setAttribute('nomodule', 'true');
  document.head.append(nomoduleScript);

  await coveoLoading;
  coveoLoaded = true;
}

/**
 * Orchestrates Coveo blocks into the required atomic-search-layout
 * @param {Element} main The main container element
 */
export function buildCoveoSearchLayout(main) {
  const coveoBlocks = main.querySelectorAll('.coveo-search-box, .coveo-facets, .coveo-results, .coveo-config');
  if (coveoBlocks.length === 0) return;

  // Create the scaffolding
  const searchInterface = document.createElement('atomic-search-interface');
  searchInterface.setAttribute('fields-to-include', '["snrating", "sncost"]');
  const searchLayout = document.createElement('atomic-search-layout');
  searchInterface.append(searchLayout);

  const sectionSearch = document.createElement('atomic-layout-section');
  sectionSearch.setAttribute('section', 'search');
  const sectionFacets = document.createElement('atomic-layout-section');
  sectionFacets.setAttribute('section', 'facets');
  const sectionMain = document.createElement('atomic-layout-section');
  sectionMain.setAttribute('section', 'main');

  const sectionHorizontalFacets = document.createElement('atomic-layout-section');
  sectionHorizontalFacets.setAttribute('section', 'horizontal-facets');
  sectionHorizontalFacets.innerHTML = `
    <atomic-segmented-facet-scrollable>
      <atomic-segmented-facet field="inat_kingdom" label="Kingdom"></atomic-segmented-facet>
    </atomic-segmented-facet-scrollable>
    <atomic-popover>
      <atomic-facet field="inat_family" label="Family"></atomic-facet>
    </atomic-popover>
    <atomic-popover>
      <atomic-facet field="inat_class" label="Class"></atomic-facet>
    </atomic-popover>
  `;

  const sectionStatus = document.createElement('atomic-layout-section');
  sectionStatus.setAttribute('section', 'status');
  sectionStatus.innerHTML = `
    <atomic-breadbox></atomic-breadbox>
    <atomic-query-summary></atomic-query-summary>
    <atomic-refine-toggle></atomic-refine-toggle>
    <atomic-sort-dropdown>
      <atomic-sort-expression label="relevance" expression="relevancy"></atomic-sort-expression>
      <atomic-sort-expression label="most-recent" expression="date descending"></atomic-sort-expression>
    </atomic-sort-dropdown>
    <atomic-did-you-mean></atomic-did-you-mean>
    <atomic-notifications></atomic-notifications>
  `;

  const sectionResults = document.createElement('atomic-layout-section');
  sectionResults.setAttribute('section', 'results');

  const sectionPagination = document.createElement('atomic-layout-section');
  sectionPagination.setAttribute('section', 'pagination');
  sectionPagination.innerHTML = `<atomic-load-more-results></atomic-load-more-results>`;

  sectionMain.append(sectionHorizontalFacets);
  sectionMain.append(sectionStatus);
  sectionMain.append(sectionResults);
  sectionMain.append(sectionPagination);

  searchLayout.append(sectionSearch);
  searchLayout.append(sectionFacets);
  searchLayout.append(sectionMain);

  // We want to keep this inside a valid EDS section. 
  // Let's create a wrapper div for the section, or reuse the first block's parent.
  const firstBlock = coveoBlocks[0];
  const sectionWrapper = firstBlock.closest('.section');

  if (sectionWrapper && sectionWrapper !== main) {
    sectionWrapper.prepend(searchInterface);
  } else {
    main.prepend(searchInterface);
  }

  // Move blocks into their respective slots
  coveoBlocks.forEach((block) => {
    // Keep block classes intact so they get decorated normally
    if (block.classList.contains('coveo-search-box')) {
      sectionSearch.append(block);
    } else if (block.classList.contains('coveo-facets')) {
      sectionFacets.append(block);
    } else if (block.classList.contains('coveo-results')) {
      sectionResults.append(block);
    } else if (block.classList.contains('coveo-config')) {
      // Config doesn't strictly need a visual section, but we put it in search interface
      searchInterface.prepend(block);
    }
  });
}
