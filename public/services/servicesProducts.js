const API_URL = 'http://localhost:3001/products';

async function getProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error('No se pudo obtener productos');
    return await response.json();
  } catch (error) {
    console.error('Error al obtener productos:', error);
    throw error;
  }
}

async function createProduct(product) {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('No se pudo crear producto');
    return await response.json();
  } catch (error) {
    console.error('Error al crear producto:', error);
    throw error;
  }
}

async function updateProduct(id, product) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('No se pudo actualizar producto');
    return await response.json();
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    throw error;
  }
}

async function deleteProduct(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('No se pudo eliminar producto');
    return true;
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    throw error;
  }
}

export { getProducts, createProduct, updateProduct, deleteProduct };