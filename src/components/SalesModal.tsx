import { X, TrendingUp, DollarSign, Calendar } from 'lucide-react';

export const SalesModal = ({ isOpen, onClose, sales }: { isOpen: boolean, onClose: () => void, sales: any[] }) => {
  if (!isOpen) return null;

  const totalRecaudado = sales.reduce((sum, sale) => sum + sale.total, 0);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white w-full max-w-2xl max-h-[80vh] rounded-[32px] overflow-hidden shadow-2xl flex flex-col">
        
        {/* Header del Reporte */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <TrendingUp className="text-green-600" /> Resumen de Ventas
            </h2>
            <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">Historial Permanente</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Resumen de Caja */}
        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-2xl border border-green-100">
            <p className="text-green-700 text-xs font-bold uppercase mb-1">Total en Caja</p>
            <p className="text-3xl font-black text-green-800">${totalRecaudado.toFixed(2)}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
            <p className="text-blue-700 text-xs font-bold uppercase mb-1">Ventas Realizadas</p>
            <p className="text-3xl font-black text-blue-800">{sales.length}</p>
          </div>
        </div>

        {/* Lista de Ventas */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {sales.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Aún no hay ventas registradas...</p>
          ) : (
            sales.reverse().map((sale) => (
              <div key={sale.id} className="border border-gray-100 rounded-2xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2 text-gray-500 text-sm">
                    <Calendar className="w-4 h-4" /> {sale.fecha}
                  </div>
                  <span className="font-bold text-lg text-gray-800">${sale.total.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-400">
                  {sale.articulos.map((art: any) => `${art.cantidad}x ${art.nombre}`).join(', ')}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};