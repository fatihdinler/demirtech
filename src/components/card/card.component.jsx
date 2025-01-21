import React from "react";

function Card({ title, value, icon, children }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
      {/* Üst kısım: başlık + ikon (isteğe bağlı) */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="font-semibold text-gray-800">{title}</h2>
        {icon && <div>{icon}</div>}
      </div>

      {/* Değer (value) */}
      {value && (
        <div className="text-xl font-bold text-gray-700 mb-2">
          {value}
        </div>
      )}

      {/* Ek içerik (children) */}
      {children && <div>{children}</div>}
    </div>
  );
}

export default Card;
