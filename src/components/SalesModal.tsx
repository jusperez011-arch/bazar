import { X, TrendingUp, Calendar, Trash2 } from 'lucide-react';

// Definimos qué datos necesita recibir el modal para funcionar
interface SalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  sales: any[];
  onClear: () => void; // Función para borrar el historial
}

export const SalesModal = ({ isOpen, onClose, sales, onClear }: SalesModalProps) => {
  if (!isOpen) return null;

  // Calculamos el total asegurando que cada valor sea tratado como número
  const totalRecaudado = sales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Cabecera del Reporte */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-green-600 w-5 h-5" /> Resumen de Ventas
            </h2>
            <p className="text-[10px] text-gray-400 uppercase tracking-[0.2em] mt-1 font-bold">
              Shirley Bazar • Control de Caja
            </p>
          </div>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Indicadores Rápidos */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-5 rounded-[24px] border border-green-100">
            <p className="text-green-600 text-[10px] font-black uppercase tracking-widest mb-1">Total en Efectivo</p>
            <p className="text-3xl font-black text-green-900">${totalRecaudado.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 p-5 rounded-[24px] border border-blue-100">
            <p className="text-blue-600 text-[10px] font-black uppercase tracking-widest mb-1">Ventas Totales</p>
            <p className="text-3xl font-black text-blue-900">{sales.length}</p>
          </div>
        </div>

        {/* Cuerpo: Listado de Ventas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 pt-0">
          {sales.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 font-medium italic">No hay registros en el historial</p>
            </div>
          ) : (
            [...sales].reverse().map((sale) => (
              <div key={sale.id} className="group border border-gray-100 rounded-2xl p-5 hover:border-gray-300 hover:bg-gray-50 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-2 text-gray-400 text-[11px] font-bold uppercase tracking-tighter">
                    <Calendar className="w-3 h-3" /> 
                    {new Date(sale.fecha).toLocaleString('es-EC', { 
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' 
                    })}
                  </div>
                  <span className="font-black text-gray-900 text-lg">
                    ${Number(sale.total).toFixed(2)}
                  </span>
                </div>
                
                {/* Detalle de productos vendidos */}
                <div className="text-[11px] text-gray-500 leading-relaxed">
                  <span className="text-gray-300 mr-2">●</span>
                  {sale.articulos && sale.articulos.map((art: any) => (
                    <span key={art.id || art.name} className="mr-3">
                      <b className="text-gray-700">{art.quantity}x</b> {art.name}
                    </span>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🗑️ Botón de Acción Final: Vaciar Historial */}
        {sales.length > 0 && (
          <div className="p-4 bg-white border-t border-gray-50 flex justify-center">
            <button 
              onClick={onClear}
              className="group flex items-center gap-2 px-6 py-2 rounded-full hover:bg-red-50 transition-all"
            >
              <Trash2 className="w-3 h-3 text-red-300 group-hover:text-red-500 transition-colors" />
              <span className="text-[9px] font-black text-red-300 group-hover:text-red-500 uppercase tracking-[0.3em]">
                Vaciar Historial de Ventas
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};