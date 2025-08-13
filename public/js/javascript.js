import { getProducts, createProduct, updateProduct, deleteProduct } from "../services/servicesProducts.js";

// Elementos del DOM
const productForm = document.getElementById('productForm');
const productList = document.getElementById('productlist');

// Variables globales
let editingId = null;

// Función para cargar productos
async function loadProducts() {
  try {
    const products = await getProducts();
    displayProducts(products);
  } catch (error) {
    console.error('Error:', error);
  }
}

// Función para mostrar productos
function displayProducts(products) {
  productList.innerHTML = '';
  
  if (products.length === 0) {
    productList.innerHTML = '<li class="no-products">No hay productos registrados</li>';
    return;
  }
  
  products.forEach(product => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div class="product-info">
        <div class="product-name">${product.nombre}</div>
        <div class="product-details">
          <span class="product-price">$${product.precio}</span>
          <span class="product-stock">Stock: ${product.stock}</span>
        </div>
      </div>
      <div class="product-actions">
        <button class="edit-btn" data-id="${product.id}">
          <i class="fas fa-edit"></i> Editar
        </button>
        <button class="delete-btn" data-id="${product.id}">
          <i class="fas fa-trash"></i> Eliminar
        </button>
      </div>
    `;
    
    // Agregar event listeners a los botones
    const editBtn = li.querySelector('.edit-btn');
    const deleteBtn = li.querySelector('.delete-btn');
    
    editBtn.addEventListener('click', () => editProduct(product.id));
    deleteBtn.addEventListener('click', () => removeProduct(product.id));
    
    productList.appendChild(li);
  });
}

// Función para agregar o actualizar producto
async function addProduct(event) {
  event.preventDefault();
  
  const nombre = document.getElementById('nombre').value;
  const precio = document.getElementById('precio').value;
  const stock = document.getElementById('stock').value;
  
  if (!nombre || !precio || !stock) {
    alert('Complete todos los campos');
    return;
  }
  
  try {
    if (editingId) {
      // Actualizar producto existente
      await updateProduct(editingId, {
        nombre: nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock)
      });
      
      editingId = null;
      alert('Producto actualizado exitosamente');
    } else {
      // Crear nuevo producto
      await createProduct({
        nombre: nombre,
        precio: parseFloat(precio),
        stock: parseInt(stock)
      });
      
      alert('Producto agregado exitosamente');
    }
    
    // Limpiar formulario y restaurar botón
    productForm.reset();
    const submitBtn = productForm.querySelector('button[type="submit"]');
    submitBtn.innerHTML = '<i class="fas fa-plus"></i> Agregar';
    submitBtn.style.background = '#007bff';
    
    loadProducts();
  } catch (error) {
    console.error('Error detallado:', error);
    alert('Error al guardar producto: ' + error.message);
  }
}

// Función para editar producto
async function editProduct(id) {
  try {
    const products = await getProducts();
    const product = products.find(p => p.id === id);
    
    if (product) {
      editingId = id;
      document.getElementById('nombre').value = product.nombre;
      document.getElementById('precio').value = product.precio;
      document.getElementById('stock').value = product.stock;
      
      // Cambiar el botón del formulario
      const submitBtn = productForm.querySelector('button[type="submit"]');
      submitBtn.innerHTML = '<i class="fas fa-save"></i> Actualizar';
      submitBtn.style.background = '#ffc107';
      
      // Enfocar el primer campo
      document.getElementById('nombre').focus();
    }
  } catch (error) {
    console.error('Error al cargar producto para editar:', error);
    alert('Error al cargar producto para editar');
  }
}

// Función para eliminar producto
async function removeProduct(id) {
  if (confirm('¿Está seguro de que desea eliminar este producto?')) {
    try {
      await deleteProduct(id);
      loadProducts();
      alert('Producto eliminado exitosamente');
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar producto');
    }
  }
}

// Event listeners
productForm.addEventListener('submit', addProduct);

// Cargar productos al iniciar
document.addEventListener('DOMContentLoaded', loadProducts);
