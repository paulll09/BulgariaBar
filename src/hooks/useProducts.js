import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { dummyProducts, dummyCategories } from '../data/dummyMenu';

const isSupabaseConfigured = () => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    return url && url !== 'https://tu-proyecto.supabase.co';
};

/**
 * Fetches products and categories from Supabase.
 * Falls back to dummyMenu if Supabase is not configured.
 * @param {boolean} adminMode - If true, fetches ALL products (including hidden). Requires auth.
 */
export function useProducts(adminMode = false) {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        if (!isSupabaseConfigured()) {
            setCategories(dummyCategories);
            setProducts(adminMode ? dummyProducts : dummyProducts.filter(p => p.visible !== false));
            setLoading(false);
            return;
        }

        try {
            const [catRes, prodRes] = await Promise.all([
                supabase.from('categories').select('*').order('display_order'),
                adminMode
                    ? supabase.from('products').select('*').order('created_at')
                    : supabase.from('products').select('*').eq('visible', true).order('created_at'),
            ]);

            if (catRes.error) throw catRes.error;
            if (prodRes.error) throw prodRes.error;

            setCategories(catRes.data);
            setProducts(prodRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [adminMode]);

    return { products, categories, loading, error, refetch: fetchData };
}
