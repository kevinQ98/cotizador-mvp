// store/useQuoteStore.ts
import { create } from 'zustand';

interface Item {
    id: string;
    nombre: string;
    descripcion?: string;
    precio: number;
    cantidad: number;
}

interface QuoteState {
    items: Item[];
    subtotal: number;
    descuento: number;
    total: number;
    addItem: (item: Item) => void;
    removeItem: (id: string) => void;
    updateDescuento: (descuento: number) => void;
    calculateTotals: () => void;
}

export const useQuoteStore = create<QuoteState>((set) => ({
    items: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
    addItem: (item) => set((state) => {
        const newItems = [...state.items, item];
        const subtotal = newItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        const total = subtotal - state.descuento;
        return { items: newItems, subtotal, total };
    }),
    removeItem: (id) => set((state) => {
        const newItems = state.items.filter((item) => item.id !== id);
        const subtotal = newItems.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        const total = subtotal - state.descuento;
        return { items: newItems, subtotal, total };
    }),
    updateDescuento: (descuento) => set((state) => {
        const total = state.subtotal - descuento;
        return { descuento, total };
    }),
    calculateTotals: () => set((state) => {
        const subtotal = state.items.reduce((acc, item) => acc + item.precio * item.cantidad, 0);
        const total = subtotal - state.descuento;
        return { subtotal, total };
    }),
}));