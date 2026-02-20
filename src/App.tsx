// ---------------------------------------------------------
// 📦 1. IMPORTACIONES Y TIPOS
// ---------------------------------------------------------
import { useState, useEffect } from 'react';
import { ShoppingCart, Package, Search } from 'lucide-react'; 
import { ProductCar } from './components/ProductCar';
import { ProductModal } from './components/ProductModal';
import { ShoppingCartComponent } from './components/ShoppingCart';
import { InventoryPanel } from './components/InventoryPanel';
import { EditProductModal } from './components/EditProductModal';
import Swal from 'sweetalert2';
import Antigravity from './components/react-bits/Antigravity';
import { SalesModal } from './components/SalesModal';

// 🛠️ CONFIGURACIÓN DE RED LOCAL (Tu IP de Manta, Ecuador 🇪🇨)
fetch('https://bazar-server-vend.onrender.com/products')

interface Product {
  id: number;
  name: string;      
  price: number;     
  stock: number;
  image?: string;    
  description?: string;
}

interface CartItem {
  id: number;
  name: string;    
  price: number;   
  quantity: number;
  image?: string;
}

interface SaleRecord {
  id: number;
  fecha: string;
  articulos: any[];
  total: number;
}

export default function App() {
  // ---------------------------------------------------------
  // 🧠 2. ESTADOS GLOBALES
  // ---------------------------------------------------------
  const [productList, setProductList] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isInventoryOpen, setIsInventoryOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSalesOpen, setIsSalesOpen] = useState(false); 

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [salesHistory, setSalesHistory] = useState<SaleRecord[]>([]); 

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newStock, setNewStock] = useState<string>('');

  // ---------------------------------------------------------
  // 🔍 3. LÓGICA DE FILTRADO
  // ---------------------------------------------------------
  const filteredProducts = productList.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ---------------------------------------------------------
  // 🌐 4. CONEXIÓN CON EL SERVIDOR
  // ---------------------------------------------------------
  useEffect(() => {
    fetch(`${API_URL}/products`)
      .then(response => response.json())
      .then((data: Product[]) => setProductList(data))
      .catch(() => {
        Swal.fire({ 
          title: 'Servidor Offline', 
          text: `Asegúrate de que el backend corra en ${API_URL}`, 
          icon: 'error' 
        });
      });
  }, []);

  // ---------------------------------------------------------
  // 🛒 5. LÓGICA DEL CARRITO Y VENTA (CHECKOUT)
  // ---------------------------------------------------------
  const handleAddToCart = (product: Product | CartItem, quantity: number = 1) => {
    const originalProduct = productList.find(p => p.id === product.id);
    if (!originalProduct) return;

    setCartItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === product.id);
      const nuevaCantidad = (itemExistente ? itemExistente.quantity : 0) + quantity;

      if (nuevaCantidad > originalProduct.stock) {
        Swal.fire({ title: 'Stock Insuficiente', icon: 'warning' });
        return prevItems;
      }

      if (itemExistente) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }

      return [...prevItems, { 
        id: originalProduct.id, 
        name: originalProduct.name, 
        price: originalProduct.price, 
        image: originalProduct.image, 
        quantity 
      }];
    });
  };

  const handleDecreaseQuantity = (id: number) => {
    setCartItems(prevItems => prevItems.map(item => 
      item.id === id ? { ...item, quantity: Math.max(1, item.quantity - 1) } : item
    ));
  };

  const handleRemoveFromCart = (id: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const { value: efectivo } = await Swal.fire({
      title: 'Finalizar Venta',
      html: `
        <div class="text-left">
          <p class="mb-2">Total a pagar: <b class="text-xl">$${total.toFixed(2)}</b></p>
          <hr class="my-3 border-gray-200">
          <label class="block text-sm mb-1 text-gray-600">Efectivo recibido:</label>
          <input id="swal-input-efectivo" class="swal2-input" type="number" step="0.01" placeholder="0.00" style="margin-top: 0;">
        </div>
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Procesar Venta',
      confirmButtonColor: '#1a1a1a',
      preConfirm: () => {
        const input = document.getElementById('swal-input-efectivo') as HTMLInputElement;
        const valor = input?.value;
        if (!valor || parseFloat(valor) < total) {
          Swal.showValidationMessage(`El dinero recibido debe ser al menos $${total.toFixed(2)}`);
        }
        return valor;
      }
    });

    if (!efectivo) return;
    const cambio = parseFloat(efectivo) - total;

    try {
      const response = await fetch(`${API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cartItems)
      });

      if (response.ok) {
        const data = await response.json();
        setProductList(data.updatedProducts);
        setCartItems([]);
        setIsCartOpen(false);

        Swal.fire({
          title: '¡Venta Completada!',
          html: `
            <div class="p-6 bg-gray-50 rounded-2xl border border-gray-200">
              <div class="flex justify-between mb-2">
                <span class="text-gray-500">Total Venta:</span>
                <span class="font-bold">$${total.toFixed(2)}</span>
              </div>
              <div class="flex justify-between mb-4">
                <span class="text-gray-500">Recibido:</span>
                <span class="font-bold">$${parseFloat(efectivo).toFixed(2)}</span>
              </div>
              <div class="pt-4 border-t border-gray-300 flex justify-between items-center">
                <span class="text-lg font-bold">CAMBIO:</span>
                <span class="text-3xl text-green-600 font-black">$${cambio.toFixed(2)}</span>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonColor: '#1a1a1a'
        });
      }
    } catch (error) { 
      Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
    }
  };

  // ---------------------------------------------------------
  // 🛠️ 6. ACCIONES DE PRODUCTO (CRUD)
  // ---------------------------------------------------------
  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    const productData = { name: newName, price: parseFloat(newPrice), stock: parseInt(newStock) };
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      if (response.ok) {
        const updatedList = await response.json();
        setProductList(updatedList);
        setNewName(''); setNewPrice(''); setNewStock('');
        Swal.fire({ title: '¡Añadido!', icon: 'success' });
      }
    } catch (error) { console.error(error); }
  };

  const handleOpenSales = async () => {
    try {
      const response = await fetch(`${API_URL}/sales`);
      const data: SaleRecord[] = await response.json();
      setSalesHistory(data);
      setIsSalesOpen(true);
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'No se pudo cargar el reporte', icon: 'error' });
    }
  };

  const handleEditProduct = async (id: number, updatedData: Partial<Product>) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        const data: Product[] = await response.json();
        setProductList(data);
        setEditingProduct(null);
        Swal.fire({ title: 'Actualizado', icon: 'success' });
      }
    } catch (error) { console.error(error); }
  };

  const deleteProduct = async (id: number) => {
    const result = await Swal.fire({ title: '¿Eliminar?', icon: 'warning', showCancelButton: true });
    if (result.isConfirmed) {
      try {
        const response = await fetch(`${API_URL}/products/${id}`, { method: 'DELETE' });
        if (response.ok) {
          setProductList(prev => prev.filter(p => p.id !== id));
        }
      } catch (error) { console.error(error); }
    }
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  // ---------------------------------------------------------
  // 7. RENDERIZADO
  // ---------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#FDFDFD] text-[#1A1A1A] relative">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <Antigravity count={200} magnetRadius={150} particleSize={2} color="#866a0e" />
      </div>

      <div className="relative z-10">
        <header className="bg-white/90 backdrop-blur-md sticky top-0 z-40 border-b border-[#E5E5E5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#1A1A1A] rounded-xl flex items-center justify-center shadow-lg">
                <Package className="text-white w-6 h-6" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold uppercase tracking-tighter">Shirley <span className="font-light opacity-50">Bazar</span></h1>
                <p className="text-[10px] text-[#A1A1A1] uppercase tracking-widest mt-1">Premium Collection 2026</p>
              </div>
            </div>

            <div className="flex-1 max-w-md relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#A1A1A1]" />
              <input
                type="text"
                placeholder="Buscar artículos..."
                className="w-full bg-[#F3F3F3] border border-[#E5E5E5] p-2 pl-10 rounded-full outline-none focus:border-[#1A1A1A] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleOpenSales} className="bg-white border border-[#E5E5E5] p-2 rounded-xl hover:bg-green-50 transition-all">
                <span className="text-[10px] font-bold px-2 tracking-widest text-green-600">REPORTES</span>
              </button>
              <button onClick={() => setIsInventoryOpen(true)} className="bg-white border border-[#E5E5E5] p-2 rounded-xl hover:bg-[#F3F3F3]">
                <span className="text-[10px] font-bold px-2 tracking-widest">ADMIN</span>
              </button>
              <button onClick={() => setIsCartOpen(true)} className="relative p-2 bg-[#1A1A1A] rounded-xl">
                <ShoppingCart className="w-5 h-5 text-white" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-black border border-white text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative w-full mb-20 overflow-hidden min-h-[450px] flex items-center rounded-[40px] shadow-sm border border-[#E5E5E5] bg-white">
            <div className="absolute inset-0 z-0">
              <img src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?q=80&w=1000" className="w-full h-full object-cover grayscale-[20%]" alt="Hero" />
              <div className="absolute inset-0 bg-black/10" /> 
            </div>
            <div className="relative z-20 p-8 md:p-16 w-full max-w-2xl">
              <div className="bg-white/20 backdrop-blur-md p-8 rounded-[32px] border border-white/30 shadow-xl max-w-md">
                <h3 className="text-2xl font-bold text-white mb-6 uppercase flex items-center gap-2">
                  <Package className="text-white/80" /> Nuevo Artículo
                </h3>
                <form onSubmit={handleAddProduct} className="flex flex-col gap-4">
                  <input type="text" placeholder="Nombre..." className="p-4 bg-white/40 rounded-2xl outline-none placeholder:text-white/70 text-white" value={newName} onChange={(e) => setNewName(e.target.value)} required />
                  <div className="grid grid-cols-2 gap-4">
                    <input type="number" step="0.01" placeholder="Precio $" className="p-4 bg-white/40 rounded-2xl outline-none placeholder:text-white/70 text-white" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} required />
                    <input type="number" placeholder="Stock" className="p-4 bg-white/40 rounded-2xl outline-none placeholder:text-white/70 text-white" value={newStock} onChange={(e) => setNewStock(e.target.value)} required />
                  </div>
                  <button type="submit" className="bg-[#1A1A1A] text-white py-4 rounded-2xl font-bold uppercase text-sm tracking-widest">Guardar en Bazar</button>
                </form>
              </div>
            </div>
          </div>

          <h2 className="text-2xl font-light mb-10 text-center uppercase tracking-[0.4em]">Nuestra <span className="font-bold">Colección</span></h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <ProductCar
                key={product.id}
                {...product} 
                image={product.image || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=1000'}
                isOutOfStock={product.stock <= 0}
                onAddToCart={handleAddToCart}
                onViewDetails={(p) => { setSelectedProduct(p); setIsModalOpen(true); }}
                onDelete={deleteProduct}
              />
            ))}
          </div>
        </main>

        <footer className="bg-white border-t border-[#E5E5E5] py-12 mt-20 text-center">
          <h3 className="text-xl font-bold uppercase tracking-tighter">Shirley <span className="font-light opacity-50">Bazar</span></h3>
          <p className="text-[#A1A1A1] text-xs mt-2 tracking-widest uppercase">© 2026 • Design & Furniture</p>
        </footer>

        {/* 🎭 MODALES */}
        <InventoryPanel isOpen={isInventoryOpen} onClose={() => setIsInventoryOpen(false)} products={filteredProducts} onEditClick={setEditingProduct} />
        {editingProduct && <EditProductModal product={editingProduct} onClose={() => setEditingProduct(null)} onSave={handleEditProduct} />}
        <SalesModal isOpen={isSalesOpen} onClose={() => setIsSalesOpen(false)} sales={salesHistory} />
        <ShoppingCartComponent 
          isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} 
          items={cartItems} onRemoveItem={handleRemoveFromCart} 
          onClearCart={() => setCartItems([])} onDecreaseQuantity={handleDecreaseQuantity} 
          onCheckout={handleCheckout} 
          onIncreaseQuantity={(id) => { const item = cartItems.find(i => i.id === id); if (item) handleAddToCart(item, 1); }} 
        />
        {selectedProduct && (
          <ProductModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} product={selectedProduct} onAddToCart={handleAddToCart} />
        )}
      </div>
    </div>
  );
}