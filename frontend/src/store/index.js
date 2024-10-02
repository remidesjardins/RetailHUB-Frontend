import { createStore } from 'vuex';
import router from '@/router'

const store = createStore({
    state: {
        bagContents: JSON.parse(localStorage.getItem('cartProducts')) || []
    },
    mutations: {
        addToCart: (state, payload) => {
            console.log("BAG CONTENT :", state.bagContents);
            state.bagContents.push(payload);
            console.log("Added : ", payload);
        },
        removeFromCart: (state, payload) => {
            const index = state.bagContents.indexOf(payload);
            if (index > -1) { // only splice array when item is found
                state.bagContents.splice(index, 1); // 2nd parameter means remove one item only
            }
        },
        removeAllFromCart: (state) => {
            state.bagContents = []
        },
    },
    actions: {
    },
});

export default store;