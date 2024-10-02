<template>
  <div class="home-container">
    <NavBar class="navbar"></NavBar>
    <div class="content">
      <div class="cart-page">
        <div class="cart-container">
          <div class="bag">
            <h2>Bag</h2>
            <div v-for="(product, index) in cartProducts" :key="index" class="cart-item">
              <img :src="product.image" alt="Product image" />
              <div class="item-details">
                <h3>{{ product.name }}</h3>
                <p>{{ product.SKU }}</p>
                <span>{{ product.price }} $</span>
              </div>
            </div>
          </div>

          <div class="summary">
            <h3>Identify your client</h3>
            <div class="totals">
              <p>Sub-total: {{ subtotal }} $</p>
              <p>Tax: {{ tax }} $</p>
              <h2>Total: {{ total }} $</h2>
            </div>
            <button @click="transferInvoice">Transfer the invoice</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar
  },
  data() {
    return {
      cartProducts: [],
      taxRate: 0.15, // Example tax rate
    };
  },
  computed: {
    subtotal() {
      let total = 0;
      this.cartProducts.forEach(productOrList => {
        if (Array.isArray(productOrList)) {
          productOrList.forEach(product => {
            if (product.price) {
              total += parseFloat(product.price);
            }
          });
        } else {
          if (productOrList.price) {
            total += parseFloat(productOrList.price);
          }
        }
      });
      return total;
    },
    tax() {
      return (this.subtotal * this.taxRate).toFixed(2);
    },
    total() {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2);
    }
  },
  methods: {
    fetchInitialClients() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.clients = result;
          })
          .catch((error) => console.error(error));
    },
    loadCartProducts() {
      this.cartProducts = this.$store.state.bagContents;
    },
    transferInvoice() {
      alert('Invoice transferred!');
    },
    getTodayDate() {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`; // Format YYYY-MM-DD
    }
  },
  mounted() {
    this.loadCartProducts();
  }
};
</script>

<style scoped>
.styled-date-button {
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-color: #e1dddd;
  border: none;
  padding: 5px;
  text-align: center;
  font-size: 10px;
  cursor: pointer;
  border-radius: 25px;
  width: auto;
}

.styled-date-button::-webkit-inner-spin-button,
.styled-date-button::-webkit-calendar-picker-indicator {
  display: none;
}

.styled-date-button:hover {
  background-color: rgba(225, 221, 221, 0.65);
}

html, body, #app {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
}

.home-container {
  display: flex;
  height: 100vh; /* Assure que le conteneur occupe toute la hauteur de la fenêtre */
  width: 100vw;  /* Pleine largeur de la fenêtre */
}

.navbar {
  width: 60px; /* Largeur fixe pour la barre de navigation */
  background-color: #f0f0f0;
  height: 100%; /* Prend toute la hauteur */
}

.content {
  flex-grow: 1; /* Prend tout l'espace restant à côté de la navbar */
  background-color: white; /* Enlève le fond gris avec un fond blanc explicite */
  padding: 20px;
  display: flex;
  justify-content: flex-start; /* Alignement vers le haut */
  align-items: flex-start;
  height: 100%; /* Prend toute la hauteur disponible */
}

.cart-page {
  width: 100%;
  height: 100%; /* S'assure que cart-page prend toute la hauteur disponible */
  display: flex;
  justify-content: center; /* Centre horizontalement */
  align-items: center; /* Centre verticalement */
}

.cart-container {
  display: flex;
  justify-content: space-between;
  width: 100%; /* Occupe toute la largeur disponible */
  height: 100%; /* Prend toute la hauteur de la page */
  max-width: 1200px; /* Limite la largeur maximale pour garder le conteneur centré */
}

.bag {
  width: 60%;
  background-color: #d0e7eb;
  padding: 20px;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* Répartit les éléments dans tout l'espace vertical */
  overflow-x: auto; /* Permet le scroll horizontal */
  white-space: nowrap; /* Empêche le retour à la ligne pour les éléments enfants */
}

.cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 25px;
  background-color: transparent; /* Aucun fond ici */
}

.cart-item img {
  width: 70px;
  height: auto;
  border-radius: 15px; /* Bord légèrement arrondi pour l'image */
  margin-right: 20px; /* Ajoute une marge entre l'image et les détails */
}

.item-details {
  flex-grow: 1;
  padding: 15px;
  display: flex;
  justify-content: space-between; /* Espace entre nom/SKU à gauche et prix à droite */
  align-items: center;
  background-color: white; /* Ajoute un fond blanc ici */
  border-radius: 25px;
  margin-right: 20px; /* Espacement entre les détails et les options de livraison */
}

.item-details .details-left {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.item-details h3 {
  font-size: 20px;
  margin: 0;
  font-weight: 600;
}

.item-details p {
  font-size: 14px;
  color: gray;
}

.item-details span {
  font-size: 18px;
  font-weight: bold;
  color: black;
  text-align: right; /* Aligne le prix complètement à droite */
}

button {
  background-color: #007bff;
  color: white;
  padding: 12px;
  border: none;
  cursor: pointer;
  border-radius: 25px;
  font-size: 16px;
}

button:hover {
  background-color: #0056b3;
}

.summary {
  width: 30%;
  padding: 20px;
  background-color: #b4d4db;
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between; /* S'assure que les éléments de la section récapitulative sont bien espacés */
}
</style>