<template>
  <div class="home-container">
    <ClientSearchOverlay
        v-if="showClientSearch"
        @close="closeClientOverlay"
        @close-data="closeClientOverlayWithData"
    />
    <NavBar class="navbar"></NavBar>
    <div class="content">
      <div class="cart-page">
        <div class="cart-container">
          <div class="bag">
            <h2>Bag</h2>
            <!-- Transition group to handle removal animation -->
            <transition-group name="snap" tag="div">
              <div v-for="(product, index) in cartProducts.slice()" :key="index" class="cart-item">
                <img :src="product.product.Image" alt="Product image" />
                <div class="item-details">
                  <div class="details-left">
                    <h3>{{ product.product.name }}</h3>
                    <p>{{ product.product.SKU }}</p>
                  </div>
                  <div class="quantity-selector">
                    <button @click="decreaseQuantity(index, product)">-</button>
                    <span>{{ product.quantity }}</span>
                    <button @click="increaseQuantity(index, product)">+</button>
                  </div>
                  <span>{{ (product.product.price * product.quantity).toFixed(2) }} $
                    <i class="fa-solid fa-trash" @click="deleteProductFromCart(product)"></i>
                  </span>
                </div>
              </div>
            </transition-group>
          </div>

          <div class="summary">
            <button @click="openClientOverlay">{{ this.clientName }}</button>
            <div class="totals">
              <p>Sub-total: {{ subtotal }} $</p>
              <p>Tax: {{ tax }} $</p>
              <h2>Total: {{ total }} $</h2>
            </div>
            <select v-model="this.paymentStatus" class="paymentStatus">
              <option>Pending</option>
              <option>Completed</option>
            </select>
            <select v-model="this.paymentMethod" class="paymentMethod">
              <option>Cash</option>
              <option>Credit Card</option>
              <option>Bank Transfer</option>
              <option>PayPal</option>
            </select>
            <button @click="transferInvoice">Transfer the invoice</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ClientSearchOverlay from "@/components/ClientSearchOverlay.vue";

export default {
  components: {
    NavBar,
    ClientSearchOverlay,
  },
  data() {
    return {
      cartProducts: [],
      taxRate: 0.15, // Example tax rate
      showClientSearch: false,
      client: undefined,
      clientName: "Identity your client",
      paymentStatus: "",
      paymentMethod: "",
    };
  },
  computed: {
    subtotal() {
      let total = 0;
      this.cartProducts.forEach(productOrList => {
        if (Array.isArray(productOrList)) {
          productOrList.forEach(product => {
            if (product.product.price) {
              total += parseFloat(product.quantity) * parseFloat(product.product.price);
            }
          });
        } else {
          if (productOrList.product.price) {
            total += parseFloat(productOrList.quantity) *  parseFloat(productOrList.product.price);
          }
        }
      });
      return total.toFixed(2);
    },
    tax() {
      return (this.subtotal * this.taxRate).toFixed(2);
    },
    total() {
      return (parseFloat(this.subtotal) + parseFloat(this.tax)).toFixed(2);
    }
  },
  methods: {
    loadCartProducts() {
      this.cartProducts = this.$store.state.bagContents.reverse();
    },
    transferInvoice() {
      // Préparer les headers
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      // Préparer la liste des produits à partir du panier
      const products = this.cartProducts.map(product => ({
        SKU: product.product.SKU,
        quantity: product.quantity,
        price_per_unit: product.product.price
      }));

      // Calculer le prix total
      const total_price = this.total; // Utilise la computed property 'total'

      // Préparer les données pour la requête
      const row = JSON.stringify({
        products: products,
        total_price: total_price,
        customer_id: this.client._id, // L'ID du client doit être défini après la sélection du client,
        payment_status: this.paymentStatus,
        payment_method: this.paymentMethod, // Méthode de paiement choisie
        soldBy: "66fdffb56790cc1514a6a267"// Utilisateur qui vend, supposant que l'ID de l'utilisateur est stocké dans le store
      });

      // Options de la requête
      const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: row,
        redirect: "follow"
      };

      // Effectuer la requête
      fetch("https://com.servhub.fr/api/sales/", requestOptions)
          .then(response => response.json())
          .then(result => {
            console.log(result);
            this.$router.push({name: "Sale"});
            this.$store.commit("removeAllFromCart");
            // Gérer la réponse, comme afficher une notification ou rediriger l'utilisateur
          })
          .catch(error => {
            console.error('Erreur lors de la création de la facture:', error);
            // Gérer l'erreur, comme afficher un message d'erreur à l'utilisateur
          });
    },
    deleteProductFromCart(product) {
      this.$store.commit("removeFromCart", product);
    },
    increaseQuantity(index, product) {
      this.cartProducts[index].quantity++;
      this.$store.commit("updateQuantity", {_id: product.product._id, quantity: this.cartProducts[index].quantity});
    },
    decreaseQuantity(index, product) {
      if (this.cartProducts[index].quantity > 1) {
        this.cartProducts[index].quantity--;
        this.$store.commit("updateQuantity", {_id: product.product._id, quantity: this.cartProducts[index].quantity});
      }
    },
    openClientOverlay() {
      this.showClientSearch = true;
    },
    closeClientOverlay() {
      this.showClientSearch = false;
    },
    closeClientOverlayWithData(client){
      this.showClientSearch = false;
      this.client = client;
      this.clientName = client.name;
    },
  },
  mounted() {
    this.loadCartProducts();
  }
};
</script>

<style scoped>
/* Keyframes for dust effect */
@keyframes dust {
  0% {
    opacity: 1;
    transform: translateX(0) translateY(0) scale(1);
    filter: blur(0);
  }
  50% {
    opacity: 0.6;
    transform: translateX(-20px) translateY(-10px) scale(0.8);
    filter: blur(1px);
  }
  100% {
    opacity: 0;
    transform: translateX(50px) translateY(-50px) scale(0);
    filter: blur(3px);
  }
}

/* Animation applied on leave */
.snap-leave-active {
  position: relative; /* Ensure the item is taken out of normal flow */
  animation: dust 1s forwards ease-out; /* 1-second dust animation */
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
  justify-content: flex-start; /* Répartit les éléments dans tout l'espace vertical */
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
  width: auto;
  height: 97px;
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
  justify-content: space-between;
  flex-grow: 1;
}

.quantity-selector {
  display: flex;
  align-items: center;
  margin: 0 20px;
}

.quantity-selector button {
  background-color: #f0f0f0;
  border: none;
  padding: 5px 10px;
  font-size: 16px;
  cursor: pointer;
}

.quantity-selector span {
  margin: 0 10px;
  font-size: 16px;
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

.item-details i.fa-trash {
  display: none; /* Cache uniquement l'icône de poubelle par défaut */
}

.item-details:hover i.fa-trash {
  display: inline-block; /* Affiche l'icône de poubelle lors du survol de .item-details */
}

.fa-trash:hover{
  color: red;
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