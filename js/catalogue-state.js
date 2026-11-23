let catalogue = [];

export function getCatalogueState() {
  return catalogue;
}

export function setCatalogueState(items) {
  catalogue = items;
}

export function addCatalogueItem(item) {
  catalogue.push(item);
}

export function updateCatalogueItem(id, updatedItem) {
  catalogue = catalogue.map((item) => (item.id === id ? updatedItem : item));
}

export function deleteCatalogueItem(id) {
  catalogue = catalogue.filter((item) => item.id !== id);
}
