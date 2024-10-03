import { createStore } from 'vuex';
import router from '@/router';
import createPersistedState from 'vuex-persistedstate';

const store = createStore({
    state: {
        bagContents: []
    },
    mutations: {
        addToCart: (state, payload) => {
            const existingItem = state.bagContents.find(item => item.product._id === payload._id);
            if (existingItem) {
                existingItem.quantity += 1; // Ajoute à la quantité existante
            } else {
                state.bagContents.push({ product: payload, quantity: 1 }); // Ajoute le produit avec une quantité par défaut de 1
            }
            console.log("BAG CONTENT :", state.bagContents);
        },
        removeFromCart: (state, payload) => {
            const index = state.bagContents.findIndex(item => item.product._id === payload.product._id);
            if (index > -1) {
                state.bagContents.splice(index, 1); // Remove the item from the cart
            }
        },
        removeAllFromCart: (state) => {
            state.bagContents = [];
        },
        initialBagContents: (state) => {
            state.bagContents = [];
        },
        updateQuantity: (state, { _id, quantity }) => {
            const item = state.bagContents.find(item => item.product._id === _id);
            if (item) {
                item.quantity = quantity; // Met à jour la quantité du produit
            }
        },
    },
    actions: {},
    plugins: [createPersistedState()],
});

export default store;