import { X, ShoppingCart } from 'lucide-react';

export function ProductModal({ isOpen, onClose, product, onAddToCart }: any) {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="relative">
          <img src={product.image} alt={product.name} className="w-full h-64 object-cover" />
          <button onClick={onClose} className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-800" />
          </button>
        </div>
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>
          <p className="text-2xl font-bold text-amber-600 mt-2">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 mt-4 leading-relaxed">{product.description}</p>
          <button 
            onClick={() => { onAddToCart(product); onClose(); }}
            className="w-full mt-8 bg-amber-600 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 hover:bg-amber-700 transition-colors"
          >
            <ShoppingCart className="w-6 h-6" /> Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}