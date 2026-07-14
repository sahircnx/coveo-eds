export default function decorate(block) {
  block.textContent = '';
  const searchBox = document.createElement('atomic-search-box');
  block.append(searchBox);
}
