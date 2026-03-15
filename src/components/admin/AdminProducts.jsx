import { useState, useRef, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Edit2, Trash2, Eye, EyeOff, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { useProducts } from '../../hooks/useProducts';
import toast from 'react-hot-toast';
import { inputCls } from '../../utils/styles';

const EMPTY_FORM = { name: '', description: '', price: '', category_id: '', image_url: '' };

export default function AdminProducts() {
    const navigate = useNavigate();
    const { products, categories, loading, refetch } = useProducts(true);
    const categoryMap = useMemo(
        () => new Map(categories.map(c => [c.id, c.name])),
        [categories]
    );
    const [modalOpen, setModalOpen] = useState(false);
    const [editing, setEditing] = useState(null);
    const [form, setForm] = useState(EMPTY_FORM);
    const [formLoading, setFormLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const fileInputRef = useRef(null);

    const openCreate = () => {
        setEditing(null);
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEdit = (product) => {
        setEditing(product);
        setForm({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category_id: product.category_id || '',
            image_url: product.image_url || '',
        });
        setImageFile(null);
        setImagePreview(product.image_url || null);
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditing(null);
        setForm(EMPTY_FORM);
        setImageFile(null);
        setImagePreview(null);
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImage = async (file) => {
        const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        const MAX_MB = 5;
        if (!ALLOWED_TYPES.includes(file.type))
            throw new Error('Solo se permiten imágenes JPG, PNG, WEBP o GIF.');
        if (file.size > MAX_MB * 1024 * 1024)
            throw new Error(`La imagen no puede superar los ${MAX_MB} MB.`);
        const ext = file.type.split('/')[1];
        const filename = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from('product-images').upload(filename, file);
        if (error) throw error;
        const { data } = supabase.storage.from('product-images').getPublicUrl(filename);
        return data.publicUrl;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name.trim() || !form.price || !form.category_id) {
            toast.error('Completá nombre, precio y categoría');
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            toast.error('Sesión expirada. Volvé a iniciar sesión.');
            navigate('/admin');
            return;
        }

        setFormLoading(true);
        try {
            let imageUrl = form.image_url;
            if (imageFile) imageUrl = await uploadImage(imageFile);

            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: parseFloat(form.price),
                category_id: form.category_id,
                image_url: imageUrl || null,
            };

            if (editing) {
                const { error } = await supabase.from('products').update(payload).eq('id', editing.id);
                if (error) throw error;
                toast.success('Producto actualizado');
            } else {
                const { error } = await supabase.from('products').insert({ ...payload, visible: true });
                if (error) throw error;
                toast.success('Producto creado');
            }

            closeModal();
            refetch();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setFormLoading(false);
        }
    };

    const handleToggleVisible = async (product) => {
        const { error } = await supabase
            .from('products')
            .update({ visible: !product.visible })
            .eq('id', product.id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success(product.visible ? 'Producto ocultado' : 'Producto visible');
            refetch();
        }
    };

    const handleDelete = async (product) => {
        if (!window.confirm(`¿Eliminar "${product.name}"?`)) return;
        const { error } = await supabase.from('products').delete().eq('id', product.id);
        if (error) {
            toast.error(error.message);
        } else {
            toast.success('Eliminado');
            refetch();
        }
    };

    return (
        <div className="max-w-6xl mx-auto animate-fade-up pb-10">

            {/* ── Header ── */}
            <div className="flex items-center justify-between mb-6 gap-3">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="cursor-pointer p-2.5 rounded-xl border border-border text-text-muted hover:text-text hover:border-primary/30 transition-all active:scale-95"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h1 className="font-display text-2xl sm:text-3xl font-black text-secondary uppercase tracking-wider leading-none">Productos</h1>
                        <p className="text-text-muted text-xs font-body italic mt-0.5">
                            {loading ? '...' : `${products.length} en total`}
                        </p>
                    </div>
                </div>
                <button
                    onClick={openCreate}
                    className="cursor-pointer flex items-center gap-2 bg-primary hover:bg-primary-dark text-white px-4 py-2.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all active:scale-95 shadow-[0_4px_14px_rgba(217,0,9,0.25)] shrink-0"
                >
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Nuevo Producto</span>
                    <span className="sm:hidden">Nuevo</span>
                </button>
            </div>

            {/* ── Mobile: Cards ── */}
            <div className="sm:hidden flex flex-col gap-3">
                {loading ? (
                    [...Array(3)].map((_, i) => (
                        <div key={i} className="h-20 rounded-2xl bg-surface animate-pulse" />
                    ))
                ) : products.length === 0 ? (
                    <div className="py-16 text-center text-text-muted text-sm">
                        No hay productos. Creá el primero.
                    </div>
                ) : (
                    products.map((product) => {
                        const catName = categoryMap.get(product.category_id);
                        return (
                            <div
                                key={product.id}
                                className={`flex items-center gap-3 p-3 rounded-2xl border border-border bg-background transition-all ${!product.visible ? 'opacity-50' : ''}`}
                            >
                                {/* Image */}
                                <div className="w-14 h-14 rounded-xl bg-surface overflow-hidden border border-border flex items-center justify-center shrink-0">
                                    {product.image_url
                                        ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                                        : <ImageIcon className="w-5 h-5 text-text-dim" />
                                    }
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-text text-sm truncate">{product.name}</p>
                                    {catName && <p className="text-text-muted text-xs truncate">{catName}</p>}
                                    <p className="text-primary font-bold text-sm mt-0.5">${Number(product.price).toLocaleString('es-AR')}</p>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-1 shrink-0">
                                    <button
                                        onClick={() => handleToggleVisible(product)}
                                        className={`p-2.5 rounded-xl transition-all active:scale-90 ${product.visible ? 'text-green-500 bg-green-500/10' : 'text-text-dim bg-surface'}`}
                                    >
                                        {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                    </button>
                                    <button
                                        onClick={() => openEdit(product)}
                                        className="p-2.5 rounded-xl text-blue-500 bg-blue-500/10 active:scale-90 transition-all"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product)}
                                        className="p-2.5 rounded-xl text-red-500 bg-red-500/10 active:scale-90 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* ── Desktop: Table ── */}
            <div className="hidden sm:block border border-border rounded-2xl overflow-hidden bg-background shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-border text-text-muted text-xs uppercase tracking-widest">
                                <th className="p-4 font-semibold">Imagen</th>
                                <th className="p-4 font-semibold">Nombre</th>
                                <th className="p-4 font-semibold">Categoría</th>
                                <th className="p-4 font-semibold">Precio</th>
                                <th className="p-4 font-semibold text-center">Visible</th>
                                <th className="p-4 font-semibold text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                [...Array(4)].map((_, i) => (
                                    <tr key={i}><td colSpan="6" className="p-4">
                                        <div className="h-10 bg-surface animate-pulse rounded-lg" />
                                    </td></tr>
                                ))
                            ) : products.length === 0 ? (
                                <tr><td colSpan="6" className="p-10 text-center text-text-muted text-sm">
                                    No hay productos. Creá el primero.
                                </td></tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className={`transition-colors hover:bg-surface/50 ${!product.visible ? 'opacity-50' : ''}`}>
                                        <td className="p-4">
                                            <div className="w-12 h-12 rounded-xl bg-surface overflow-hidden border border-border flex items-center justify-center">
                                                {product.image_url
                                                    ? <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                                                    : <ImageIcon className="w-5 h-5 text-text-dim" />
                                                }
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-semibold text-text text-sm truncate max-w-[180px]">{product.name}</p>
                                            {product.description && <p className="text-text-muted text-xs truncate max-w-[180px] mt-0.5">{product.description}</p>}
                                        </td>
                                        <td className="p-4 text-text-muted text-sm">
                                            {categoryMap.get(product.category_id) || '—'}
                                        </td>
                                        <td className="p-4 font-bold text-primary text-sm">
                                            ${Number(product.price).toLocaleString('es-AR')}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button onClick={() => handleToggleVisible(product)}
                                                className={`cursor-pointer p-1.5 rounded-lg transition-all ${product.visible ? 'text-green-500 hover:bg-green-500/10' : 'text-text-dim hover:bg-surface'}`}>
                                                {product.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                                            </button>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button onClick={() => openEdit(product)}
                                                    className="cursor-pointer p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product)}
                                                    className="cursor-pointer p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-all">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ── Modal / Bottom Sheet ── */}
            {modalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
                    style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
                    onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
                >
                    <div className="bg-background w-full sm:max-w-lg sm:rounded-2xl rounded-t-3xl border border-border shadow-2xl animate-fade-up max-h-[92dvh] flex flex-col">

                        {/* Drag handle — mobile only */}
                        <div className="sm:hidden flex justify-center pt-3 pb-1">
                            <div className="w-10 h-1 rounded-full bg-border" />
                        </div>

                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                            <h2 className="font-display text-lg font-black text-secondary uppercase tracking-wider">
                                {editing ? 'Editar Producto' : 'Nuevo Producto'}
                            </h2>
                            <button onClick={closeModal}
                                className="cursor-pointer p-2 rounded-xl text-text-muted hover:text-text hover:bg-surface transition-all active:scale-90">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Form — scrollable */}
                        <form onSubmit={handleSubmit} className="flex flex-col gap-4 px-5 py-5 overflow-y-auto">

                            {/* Image upload */}
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Imagen</label>
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="cursor-pointer relative w-full h-40 rounded-xl border-2 border-dashed border-border active:border-primary/60 transition-colors flex items-center justify-center overflow-hidden bg-surface"
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center gap-2 text-text-muted">
                                            <Upload className="w-7 h-7" />
                                            <span className="text-sm font-medium">Tocar para subir foto</span>
                                        </div>
                                    )}
                                    {imagePreview && (
                                        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-lg font-medium">
                                            Cambiar
                                        </div>
                                    )}
                                </div>
                                <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileChange} />
                            </div>

                            {/* Name */}
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
                                    Nombre <span className="text-primary">*</span>
                                </label>
                                <input type="text" value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    placeholder="Ej: Doble Burger"
                                    className={inputCls} />
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">Descripción</label>
                                <textarea value={form.description}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Ej: Doble carne, doble queso..."
                                    rows="2"
                                    className={`${inputCls} resize-none`} />
                            </div>

                            {/* Price + Category */}
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
                                        Precio <span className="text-primary">*</span>
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-text-dim text-sm">$</span>
                                        <input type="number" min="0" step="100" value={form.price}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })}
                                            placeholder="8500"
                                            className={`${inputCls} pl-7`} />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-text-muted uppercase tracking-widest mb-2">
                                        Categoría <span className="text-primary">*</span>
                                    </label>
                                    <select value={form.category_id}
                                        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
                                        className={inputCls}>
                                        <option value="">Elegir...</option>
                                        {categories.map((c) => (
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {/* Submit */}
                            <div className="flex gap-3 pt-1 pb-2">
                                <button type="button" onClick={closeModal}
                                    className="cursor-pointer flex-1 py-3 rounded-xl border border-border text-text-muted font-semibold text-sm active:scale-95 transition-all">
                                    Cancelar
                                </button>
                                <button type="submit" disabled={formLoading}
                                    className="cursor-pointer flex-1 py-3 rounded-xl bg-primary hover:bg-primary-dark text-white font-bold text-sm uppercase tracking-widest transition-all active:scale-[0.98] disabled:opacity-60 shadow-[0_4px_14px_rgba(217,0,9,0.2)]">
                                    {formLoading ? 'Guardando...' : editing ? 'Guardar' : 'Crear'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
