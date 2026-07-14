export default function decorate(block) {
  block.textContent = '';

  const templateHTML = `
    <atomic-result-list>
      <atomic-result-template>
        <template>
          <style>
            .field {
              display: inline-flex;
              align-items: center;
              margin-right: 1rem;
            }
            .field-label {
              font-weight: bold;
              margin-right: 0.25rem;
            }
          </style>
          <atomic-result-section-visual>
            <atomic-result-icon></atomic-result-icon>
          </atomic-result-section-visual>
          <atomic-result-section-badges>
            <atomic-field-condition must-match-is-recommendation="true">
              <atomic-result-badge label="Recommended"></atomic-result-badge>
            </atomic-field-condition>
            <atomic-field-condition must-match-is-top-result="true">
              <atomic-result-badge label="Top Result"></atomic-result-badge>
            </atomic-field-condition>
          </atomic-result-section-badges>
          <atomic-result-section-title>
            <atomic-result-link></atomic-result-link>
          </atomic-result-section-title>
          <atomic-result-section-excerpt>
            <atomic-result-text field="excerpt"></atomic-result-text>
          </atomic-result-section-excerpt>
          <atomic-result-section-bottom-metadata>
            <atomic-result-fields-list>
              <atomic-field-condition class="field" if-defined="author">
                <span class="field-label"><atomic-text value="author"></atomic-text>:</span>
                <atomic-result-text field="author"></atomic-result-text>
              </atomic-field-condition>
              <atomic-field-condition class="field" if-defined="source">
                <span class="field-label"><atomic-text value="source"></atomic-text>:</span>
                <atomic-result-text field="source"></atomic-result-text>
              </atomic-field-condition>
              <span class="field">
                <span class="field-label">Date:</span>
                <atomic-result-date format="ddd MMM D YYYY"></atomic-result-date>
              </span>
            </atomic-result-fields-list>
          </atomic-result-section-bottom-metadata>
        </template>
      </atomic-result-template>
    </atomic-result-list>
    <atomic-query-error></atomic-query-error>
    <atomic-no-results></atomic-no-results>
  `;

  block.innerHTML = templateHTML;
}
