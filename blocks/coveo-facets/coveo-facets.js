export default function decorate(block) {
  const facetManager = document.createElement('atomic-facet-manager');

  const rows = [...block.children];
  const fields = rows.map(row => row.children[0]?.textContent?.trim() || '');
  const labels = rows.map(row => row.children[1]?.textContent?.trim() || '');
  const types = rows.map(row => row.children[2]?.textContent?.trim().toLowerCase() || 'facet');

  fields.forEach((field, i) => {
    const label = labels[i];
    let type = types[i];

    if (field && label) {
      // Fallback for missing types in authoring
      if (type === 'facet') {
        if (field === 'filetype') type = 'color';
        else if (field === 'date') type = 'timeframe';
        else if (field === 'sncost' || field === 'ytviewcount' || field === 'ytlikecount') type = 'numeric';
        else if (field === 'snrating') type = label.toLowerCase().includes('range') ? 'rating-range' : 'rating';
        else if (field === 'geographicalhierarchy') type = 'category';
      }

      let facetElement;
      if (type.includes('numeric')) {
        facetElement = document.createElement('atomic-numeric-facet');
        if (field === 'sncost') {
          facetElement.innerHTML = '<atomic-format-currency currency="CAD"></atomic-format-currency>';
        } else if (field === 'ytviewcount') {
          facetElement.setAttribute('depends-on-filetype', 'YouTubeVideo');
          facetElement.setAttribute('with-input', 'integer');
        } else if (field === 'ytlikecount') {
          facetElement.setAttribute('depends-on-filetype', 'YouTubeVideo');
          facetElement.setAttribute('display-values-as', 'link');
          facetElement.innerHTML = `
            <atomic-numeric-range start="0" end="1000" label="Unpopular"></atomic-numeric-range>
            <atomic-numeric-range start="1000" end="8000" label="Well liked"></atomic-numeric-range>
            <atomic-numeric-range start="8000" end="100000" label="Popular"></atomic-numeric-range>
            <atomic-numeric-range start="100000" end="999999999" label="Treasured"></atomic-numeric-range>
          `;
        }
      } else if (type.includes('timeframe')) {
        facetElement = document.createElement('atomic-timeframe-facet');
        facetElement.setAttribute('with-date-picker', '');
        facetElement.innerHTML = `
          <atomic-timeframe unit="hour"></atomic-timeframe>
          <atomic-timeframe unit="day"></atomic-timeframe>
          <atomic-timeframe unit="week"></atomic-timeframe>
          <atomic-timeframe unit="month"></atomic-timeframe>
          <atomic-timeframe unit="quarter"></atomic-timeframe>
          <atomic-timeframe unit="year"></atomic-timeframe>
          <atomic-timeframe unit="year" amount="10" period="next"></atomic-timeframe>
        `;
      } else if (type.includes('rating')) {
        if (type.includes('range')) {
          facetElement = document.createElement('atomic-rating-range-facet');
          facetElement.setAttribute('facet-id', field + '_range');
        } else {
          facetElement = document.createElement('atomic-rating-facet');
        }
        facetElement.setAttribute('number-of-intervals', '5');
      } else if (type.includes('color')) {
        facetElement = document.createElement('atomic-color-facet');
        facetElement.setAttribute('number-of-values', '6');
        facetElement.setAttribute('sort-criteria', 'occurrences');
      } else if (type.includes('category')) {
        facetElement = document.createElement('atomic-category-facet');
        facetElement.setAttribute('with-search', '');
      } else {
        facetElement = document.createElement('atomic-facet');
        if (field === 'source') {
          facetElement.setAttribute('display-values-as', 'link');
        } else if (field === 'year') {
          facetElement.setAttribute('display-values-as', 'box');
        }
      }

      facetElement.setAttribute('field', field);
      facetElement.setAttribute('label', label);
      facetManager.append(facetElement);
    }
  });

  block.textContent = '';
  block.append(facetManager);
}
