import { useState } from 'react';

// 1. Agregamos 'image' a la interfaz para que TypeScript no se queje
interface EditModalProps {
  product: { id: number; name: string; price: number; stock: number; image?: string };
  onClose: () => void;
  onSave: (id: number, data: any) => void;
}

export function EditProductModal({ product, onClose, onSave }: EditModalProps) {
  const [name, setName] = useState(product.name);
  const [price, setPrice] = useState(product.price.toString());
  const [stock, setStock] = useState(product.stock.toString());
  // Estado para la imagen
  const [image, setImage] = useState(product.image || '');

  const handleSubmit = () => {
    onSave(product.id, { 
      name, 
      price: parseFloat(price), 
      stock: parseInt(stock),
      image: image // Enviamos la nueva URL
    });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 p-8 rounded-3xl w-full max-w-md shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-6">✏️ Editar Producto</h2>
        
        <div className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Nombre</label>
            <input 
              className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
              value={name} onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Precio */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Precio</label>
              <input 
                type="number" 
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
                value={price} onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            {/* Stock */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">Stock</label>
              <input 
                type="number"
                className="w-full bg-slate-800 border border-slate-700 rounded-xl p-3 text-white outline-none focus:border-blue-500 transition-all"
                value={stock} onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* 🌟 CAMPO DE IMAGEN (URL) */}
          <div className="space-y-1 pt-2">
            <label className="text-[10px] font-bold text-slate-500 uppercase ml-1">URL de la Imagen</label>
            <input
              type="text"
              className="w-full bg-slate-800 border border-slate-700 p-3 rounded-xl text-white outline-none focus:border-blue-500 transition-all text-sm"
              placeholder="Pega el link de la foto aquí..."
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </div>

          {/* VISTA PREVIA MINI */}
          {image && (
            <div className="mt-2 h-20 w-full rounded-xl overflow-hidden border border-slate-700">
              <img src={image} alt="Vista previa" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div className="flex gap-3 mt-8">
          <button onClick={onClose} className="flex-1 py-3 text-gray-400 hover:text-white transition-colors">
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="flex-1 bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-xl font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}