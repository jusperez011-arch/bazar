// src/components/ProductCar.tsx

export const ProductCar = ({ id, name, price, image, description, stock, onAddToCart, onViewDetails, onDelete }: any) => {
  
  const isOutOfStock = stock <= 0;
  const isLowStock = stock > 0 && stock <= 5;

  return (
    // Mantenemos p-4 y la estructura compacta original
    <div className="relative group bg-white rounded-xl shadow-md p-4 border border-[#E5E5E5] flex flex-col justify-between transition-all hover:shadow-xl hover:-translate-y-1">
      
      {/* 🚩 INSIGNIAS */}
      {isOutOfStock ? (
        <span className="absolute top-6 left-6 bg-[#1A1A1A] text-white text-[10px] font-bold px-3 py-1 rounded-full z-10">
          AGOTADO
        </span>
      ) : isLowStock ? (
        <span className="absolute top-6 left-6 bg-white border border-[#1A1A1A] text-[#1A1A1A] text-[10px] font-bold px-3 py-1 rounded-full z-10 animate-pulse shadow-sm">
          ¡QUEDAN {stock}!
        </span>
      ) : null}

      {/* IMAGEN: Volvemos a h-40 para mantener el tamaño original */}
      <div className="overflow-hidden rounded-md bg-[#F9F9F9] h-40 flex items-center justify-center">
        <img 
          src={image} 
          alt={name} 
          className={`w-full h-full object-contain p-1 transform transition-transform duration-500 group-hover:scale-110 ${isOutOfStock ? 'grayscale opacity-50' : ''}`} 
        />
      </div>

      <div>
        <h3 className="text-lg font-bold mt-3 text-[#1A1A1A] leading-tight">
          {name}
        </h3>
        <div className="flex justify-between items-end">
          <p className="text-[#1A1A1A] font-bold text-xl">${price.toFixed(2)}</p>
          <span className={`text-[10px] font-medium ${isOutOfStock ? 'text-red-500' : 'text-[#A1A1A1]'}`}>
            Stock: {stock}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-2 mt-4">
        {/* BOTONES: Mismo tamaño que el original */}
        <button 
          onClick={() => onViewDetails({ id, name, price, image, description, stock })}
          className="bg-[#F3F3F3] text-[#1A1A1A] py-2 rounded-lg text-sm font-medium hover:bg-[#E5E5E5] transition-colors"
        >
          🔍 Ver Detalles
        </button>

        <button 
          onClick={() => onAddToCart({ id, name, price })}
          disabled={isOutOfStock}
          className={`py-2 rounded-lg font-bold shadow-sm transition-all active:scale-95 ${
            isOutOfStock 
              ? 'bg-[#E5E5E5] text-[#A1A1A1] cursor-not-allowed' 
              : 'bg-[#1A1A1A] text-white hover:bg-black' 
          }`}
        >
          {isOutOfStock ? 'Sin Existencias' : 'Agregar al Carrito'}
        </button>

        <button 
          onClick={() => onDelete(id)} 
          className="mt-2 text-[#A1A1A1] text-[10px] uppercase tracking-widest opacity-60 hover:opacity-100 hover:text-red-600 transition-all text-center"
        >
          🗑️ Eliminar
        </button>
      </div>
    </div>
  );
};