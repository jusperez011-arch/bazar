import { X, Package, TrendingUp, AlertTriangle, Coins, BarChart3 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
}

interface InventoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  products: any[];
  onEditClick: (product: any) => void; // <--- AGREGA ESTA LÍNEA EXACTAMENTE
}

export function InventoryPanel({ isOpen, onClose, products, onEditClick }: InventoryPanelProps) { 
  // ... asegúrate de recibir onEditClick aquí arriba también
  // --- CÁLCULOS DE NEGOCIO EN TIEMPO REAL ---
  const totalStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);
  const valorInventario = products.reduce((sum, p) => sum + (p.price * (Number(p.stock) || 0)), 0);
  const productosAgotados = products.filter((p) => (Number(p.stock) || 0) === 0).length;

  return (
    <>
      {/* Fondo oscuro cuando el panel está abierto */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Panel Lateral */}
      <div className={`fixed inset-y-0 right-0 w-full sm:w-[450px] bg-slate-900 text-slate-100 shadow-2xl z-[70] transform transition-transform duration-500 ease-in-out border-l border-slate-700 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="h-full flex flex-col">
          
          {/* Header */}
          <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500/20 p-2 rounded-lg">
                <BarChart3 className="text-amber-500 w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold tracking-tight text-white">Dashboard Admin</h2>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest font-black italic">Estado de la Base de Datos</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-slate-700 rounded-full transition-all active:scale-90">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Estadísticas de Dinero y Stock */}
          <div className="p-6 grid grid-cols-2 gap-4 bg-slate-900">
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-inner">
              <Coins className="text-emerald-400 mb-2" size={20} />
              <p className="text-[10px] text-slate-500 uppercase font-black">Capital en Vitrina</p>
              <p className="text-2xl font-black text-white">${valorInventario.toFixed(2)}</p>
            </div>
            
            <div className="bg-slate-800/40 p-5 rounded-2xl border border-slate-700 shadow-inner">
              <AlertTriangle className={`${productosAgotados > 0 ? 'text-red-400' : 'text-slate-500'} mb-2`} size={20} />
              <p className="text-[10px] text-slate-500 uppercase font-black">Productos Agotados</p>
              <p className="text-2xl font-black text-white">{productosAgotados}</p>
            </div>
          </div>

          {/* Lista de Existencias - CON SCROLL PERSONALIZADO */}
<div className="flex-1 overflow-y-auto px-6 pb-6 
  [&::-webkit-scrollbar]:w-2
  [&::-webkit-scrollbar-track]:bg-slate-900
  [&::-webkit-scrollbar-thumb]:bg-slate-700
  [&::-webkit-scrollbar-thumb]:rounded-full
  hover:[&::-webkit-scrollbar-thumb]:bg-slate-600">
    
    <h3 className="text-xs font-black text-slate-500 uppercase tracking-wider mb-4 sticky top-0 bg-slate-900 pt-4 z-10">
      Desglose de Stock Real
    </h3>

    <div className="space-y-3">
      {products.map((p) => (
                <div key={p.id} className="flex justify-between items-center p-4 bg-slate-800/20 rounded-xl border border-slate-800 hover:border-blue-500/30 transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-2 rounded-full ${p.stock <= 5 ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'bg-emerald-500'}`} />
                    <div>
                      <p className="font-bold text-sm text-slate-200">{p.name}</p>
                      <p className="text-[10px] text-slate-500">${p.price.toFixed(2)} c/u</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className={`text-base font-black ${p.stock === 0 ? 'text-red-500' : 'text-slate-100'}`}>
                        {p.stock} <span className="text-[10px] font-normal text-slate-500 uppercase">u.</span>
                      </p>
                    </div>

                    {/* El Lápiz de Figma que activamos recién */}
                    <button 
                      onClick={() => onEditClick(p)}
                      className="w-8 h-8 bg-[#2563EB] hover:bg-blue-500 text-white rounded-[8px] flex items-center justify-center shadow-lg transition-all active:scale-90 opacity-0 group-hover:opacity-100"
                    >
                      <span className="text-xs">✏️</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
          

          {/* Footer Informativo */}
          <div className="p-6 bg-slate-800 border-t border-slate-700">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Package className="text-slate-500" size={16} />
                <span className="text-xs text-slate-400 font-bold uppercase">Unidades Totales:</span>
              </div>
              <span className="text-xl font-black text-amber-500">{totalStock}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}