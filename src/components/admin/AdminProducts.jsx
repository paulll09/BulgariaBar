import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Image as ImageIcon } from 'lucide-react';
import { dummyProducts, dummyCategories } from '../../data/dummyMenu';
import toast from 'react-hot-toast';

export default function AdminProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState(dummyProducts);

    const handleDelete = (id) => {
        if (window.confirm('¿Seguro que deseas eliminar este producto?')) {
            setProducts(products.filter(p => p.id !== id));
            toast.success('Producto eliminado (Simulado)');
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-in slide-in-from-bottom-8 duration-500">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="p-2 bg-secondary/30 hover:bg-secondary/60 rounded-xl transition-colors text-gray-400 hover:text-white"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h1 className="text-3xl font-bold text-white">Gestión de Productos</h1>
                </div>
                <button
                    onClick={() => toast('Función de "crear" próximamente')}
                    className="flex items-center gap-2 bg-primary hover:bg-orange-600 px-5 py-2.5 rounded-xl font-bold text-white transition-all"
                >
                    <Plus className="w-5 h-5" />
                    Nuevo Producto
                </button>
            </div>

            <div className="bg-secondary/40 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-white/5 border-b border-white/10 text-gray-300">
                                <th className="p-4 font-medium">Imagen</th>
                                <th className="p-4 font-medium">Nombre</th>
                                <th className="p-4 font-medium">Categoría</th>
                                <th className="p-4 font-medium">Precio</th>
                                <th className="p-4 font-medium text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {products.map(product => (
                                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="w-12 h-12 rounded-lg bg-background overflow-hidden border border-white/10 flex items-center justify-center">
                                            {product.image_url ? (
                                                <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <ImageIcon className="w-5 h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 font-bold text-white max-w-[200px] truncate">
                                        {product.name}
                                    </td>
                                    <td className="p-4 text-gray-400">
                                        {dummyCategories.find(c => c.id === product.category_id)?.name || 'Sin Categ.'}
                                    </td>
                                    <td className="p-4 text-primary font-bold">
                                        ${product.price.toLocaleString('es-AR')}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => toast('Modificar próximamente')}
                                                className="p-2 text-blue-400 hover:bg-blue-400/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                className="p-2 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-8 text-center text-gray-400">
                                        No hay productos cargados.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
