import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';

export const ShoppingCartComponent = ({ isOpen, onClose, items, onRemoveItem, onDecreaseQuantity, onIncreaseQuantity, onCheckout }: any) => {
  const total = items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Overlay con desenfoque para resaltar el panel */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="absolute inset-y-0 right-0 max-w-full flex">
        {/* Animación de entrada suave */}
        <div className="w-screen max-w-md animate-in slide-in-from-right duration-300">
          
          {/* PANEL CON GLASSMORPHISM REFORZADO */}
          <div className="h-full flex flex-col bg-white/70 backdrop-blur-3xl shadow-[0_0_40px_rgba(0,0,0,0.1)] border-l border-white/40">
            
            {/* Header */}
            <div className="p-6 border-b border-black/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-[#1A1A1A] rounded-lg">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-lg font-bold uppercase tracking-[0.2em] text-[#1A1A1A]">Tu Selección</h2>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
                <X className="w-5 h-5 text-[#1A1A1A]" />
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
                  <ShoppingBag className="w-12 h-12 mb-4" />
                  <p className="text-xs uppercase tracking-widest font-medium">Bazar vacío</p>
                </div>
              ) : (
                items.map((item: any) => (
                  <div key={item.id} className="flex items-center gap-4 p-3 rounded-3xl bg-white/40 border border-white/60 group hover:bg-white/60 transition-all shadow-sm">
                    
                    {/* Imagen Dinámica */}
                    <div className="w-20 h-20 bg-gray-100 rounded-2xl overflow-hidden border border-black/5 flex-shrink-0 shadow-inner">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-700"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=200';
                        }}
                      />
                    </div>

                    {/* Contenido */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-[#1A1A1A] text-sm uppercase truncate">{item.name}</h3>
                      <p className="text-[#D4AF37] font-semibold text-sm mb-2">${item.price.toFixed(2)}</p>
                      
                      <div className="flex items-center justify-between">
                        {/* Controles de Cantidad */}
                        <div className="flex items-center bg-[#1A1A1A] rounded-full p-1 shadow-md">
                          <button 
                            onClick={() => onDecreaseQuantity(item.id)} 
                            className="p-1 text-white/70 hover:text-white transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-3 text-[10px] font-bold text-white min-w-[24px] text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onIncreaseQuantity(item.id)} 
                            className="p-1 text-white/70 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Eliminar */}
                        <button 
                          onClick={() => onRemoveItem(item.id)} 
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Checkout Footer */}
            {items.length > 0 && (
              <div className="p-8 bg-white/80 backdrop-blur-md border-t border-black/5">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-[#A1A1A1] uppercase tracking-[0.3em] text-[10px] font-bold">Total Estimado</span>
                  <span className="text-2xl font-black text-[#1A1A1A] tracking-tighter">
                    <span className="text-xs font-light mr-1">$</span>{total.toFixed(2)}
                  </span>
                </div>
                <button 
                  onClick={onCheckout}
                  className="w-full bg-[#1A1A1A] text-white py-5 rounded-[20px] font-bold uppercase text-[10px] tracking-[0.3em] hover:bg-black hover:shadow-2xl transition-all active:scale-[0.97]"
                >
                  Confirmar Pedido
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};