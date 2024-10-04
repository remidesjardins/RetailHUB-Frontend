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
            <div id="paypal-button-container" v-show="clientName !== 'Identity your client'"></div>
            <button @click="transferInvoice" v-show="false">Transfer the invoice</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ClientSearchOverlay from "@/components/ClientSearchOverlay.vue";
import { loadScript } from "@paypal/paypal-js"; // SDK PayPal

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
      paymentStatus: "", // Updated payment status from PayPal
      paymentMethod: "PayPal", // We will use PayPal Sandbox
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
    async transferInvoice() {
      try {
        const accessToken = await this.getAccessToken(); // Await the access token retrieval
        // Split the client address string into its components
        const addressParts = this.client.address.split(","); // Assuming your format is "Street, City, State, PostalCode, Country"
        const addressLine1 = addressParts[0] ? addressParts[0].trim() : "";
        const city = addressParts[1] ? addressParts[1].trim() : "";
        const state = addressParts[2] ? addressParts[2].trim() : "";
        const postalCode = addressParts[3] ? addressParts[3].trim() : "";
        const country = addressParts[4] ? addressParts[4].trim() : "";

        // Step 1: Send the sale data to your server
        for (const product of this.cartProducts) {
          await this.$store.dispatch("handleReceipt", { payload: product.product, number: product.quantity });
        }

        const products = this.cartProducts.map(product => ({
          SKU: product.product.SKU,
          quantity: product.quantity,
          price_per_unit: product.product.price
        }));

        const total_price = this.total;
        const client_name = this.client.firstName + " " + this.client.lastName;

        const saleResponse = await fetch("https://com.servhub.fr/api/sales/", {
          headers: { "Content-Type": "application/json" },
          method: "POST",
          body: JSON.stringify({
            products,
            total_price,
            customer_id: this.client._id,
            payment_status: this.paymentStatus,
            payment_method: this.paymentMethod,
            soldBy: "66fdffb56790cc1514a6a267"
          }),
          redirect: "follow"
        });

        const saleResult = await saleResponse.json();
        console.log("Sale created:", saleResult);

        // Step 2: Generate PayPal Invoice after payment is confirmed
        const invoicePayload = {
          detail: {
            currency_code: "CAD",
            invoice_number: `INV-${new Date().getTime()}`,
            reference: "order-ref",
            invoice_date: new Date().toISOString().split("T")[0],
            note: "Thank you for your purchase.",
            payment_term: {
              term_type: "NET_10",
              due_date: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString().split("T")[0]
            }
          },
          invoicer: {
            name: {
              given_name: "YourCompany",
              surname: "Name"
            },
            address: {
              address_line_1: "YourCompany Address",
              admin_area_2: "YourCity",
              admin_area_1: "YourState",
              postal_code: "YourPostalCode",
              country_code: "CA"
            },
            email_address: "yourcompany@example.com"
          },
          primary_recipients: [
            {
              billing_info: {
                name: {
                  given_name: this.client.firstName,
                  surname: this.client.lastName
                },
                address: {
                  address_line_1: addressLine1,  // The street address from the split
                  admin_area_2: city,            // The city from the split
                  admin_area_1: state,           // The state from the split
                  postal_code: postalCode,       // The postal code from the split
                  country_code: "CA"          // The country code from the split
                },
                email_address: this.client.email
              }
            }
          ],
          items: products.map(product => ({
            name: product.SKU,  // Ensure this field is present
            description: product.Details || "Product",
            quantity: product.quantity,
            unit_amount: {
              currency_code: "CAD",
              value: product.price_per_unit
            },
            tax: {
              name: "Sales Tax",
              percent: "7.25"
            }
          }))
        };
        console.log("ACCESS TOKEN : ", accessToken);
        const invoiceResponse = await fetch('https://api-m.sandbox.paypal.com/v2/invoicing/invoices', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(invoicePayload)
        });

        const invoiceResult = await invoiceResponse.json();
        console.log("Invoice created:", invoiceResult);
        console.log("OK? :", invoiceResponse.ok);
        if (invoiceResult.href) {
          // Step 3: Fetch Invoice Details using the self link
          const invoiceDetailsResponse = await fetch(invoiceResult.href, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${accessToken}`,
              'Content-Type': 'application/json'
            }
            });

            const invoiceDetails = await invoiceDetailsResponse.json();
            console.log("Invoice details:", invoiceDetails);

            // Step 4: Open recipient view URL
            const invoiceMetadata = invoiceDetails.detail.metadata;
            const recipientViewURL = invoiceMetadata.recipient_view_url;
            console.log("LINKS : ", invoiceDetails.links);
            console.log("Recipient : ", recipientViewURL);
            if (recipientViewURL) {
              window.open(recipientViewURL, "_blank");  // Open the invoice in a new tab
            }
        }

      } catch (error) {
        console.error("Error creating invoice:", error);
      }
    },
    async getAccessToken() {
      const clientID = "AZARWGYIQ1t8j1JqA2s-3G4ttRXc-uivXrk31VcVFnuQHMADwtmhEHRaHe7F_WAgZbp5UZO7mnnvPHyM";  // Replace with your actual sandbox client ID
      const clientSecret = "ELZfZJzG29tgQBnF5bRY5u__o9Tq54KLzO1lGQcoPnAKsgsHpsCgdMcke2P5f7Z3m2QDggVgE2seU0X6";  // Replace with your actual sandbox client secret

      const credentials = btoa(`${clientID}:${clientSecret}`); // Base64 encode the client ID and secret

      const response = await fetch("https://api-m.sandbox.paypal.com/v1/oauth2/token", {
        method: "POST",
        headers: {
          "Authorization": `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: "grant_type=client_credentials"
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data.access_token);
        return data.access_token;
      } else {
        console.error('Error fetching access token:', data);
        throw new Error("Unable to fetch PayPal access token");
      }
    },
    deleteProductFromCart(product) {
      this.$store.dispatch("removeFromCartAndHandleReceipt", product);
    },
    increaseQuantity(index, product) {
      this.cartProducts[index].quantity++;
      this.$store.commit("updateQuantity", {_id: product.product._id, quantity: this.cartProducts[index].quantity});
      this.$store.dispatch("handleReceipt", {payload: product.product, number: -1});
    },
    decreaseQuantity(index, product) {
      if (this.cartProducts[index].quantity > 1) {
        this.cartProducts[index].quantity--;
        this.$store.commit("updateQuantity", {_id: product.product._id, quantity: this.cartProducts[index].quantity});
        this.$store.dispatch("handleReceipt", {payload: product.product, number: 1});
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
    setupPayPalButton() {
      loadScript({
        "client-id": "AZARWGYIQ1t8j1JqA2s-3G4ttRXc-uivXrk31VcVFnuQHMADwtmhEHRaHe7F_WAgZbp5UZO7mnnvPHyM", // Remplace par ton ID Sandbox
        currency: "CAD"
      }).then(paypal => {
        paypal.Buttons({
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [{
                amount: {
                  value: this.total,
                }
              }]
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then(details => {
              this.paymentStatus = "Completed"; // Mettre à jour le statut du paiement
              console.log("Transaction effectuée par " + details.payer.name.given_name);
              this.transferInvoice();
            });
          },
          onError: (err) => {
            console.error('Erreur lors de la transaction PayPal:', err);
            this.paymentStatus = "Failed"; // Si une erreur survient, marquer comme échoué
          }
        }).render("#paypal-button-container");
      }).catch(err => {
        console.error('Erreur lors du chargement du SDK PayPal:', err);
      });
    }
  },
  mounted() {
    this.loadCartProducts();
    this.setupPayPalButton(); // Configurer le bouton PayPal quand le composant est monté
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
  overflow: scroll;
  justify-content: space-between; /* S'assure que les éléments de la section récapitulative sont bien espacés */
}
</style>