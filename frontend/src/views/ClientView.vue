<template>
  <div class="invoice-container">
    <UpdateClient
        v-if="showUpdateClient"
        :client="clientCopy"
        @close="closeUpdateClient"
        @close-data="updateClient"
    />
    <NavBar/>
    <div class="top-bar">
      <button :class="{ active: activeTab === 'client' }" @click="switchTab('client')">Client</button>
      <button :class="{ active: activeTab === 'invoice' }" @click="switchTab('invoice')">Invoice</button>
    </div>
    <div class="client-header">
      <div class="client-info">
        <h3>M. {{ client.name }}</h3>
        <p>C-{{ client._id }}</p>
        <p>{{ client.address }}</p>
      </div>
      <div class="client-actions">
        <div class="contact-info">
          <p>{{ client.phone }}</p>
          <p>{{ client.email }}</p>
        </div>
        <button @click="editClientInfo" class="edit-button"><i class="fa fa-pencil-alt"></i></button>
      </div>
    </div>

    <div class="recent-invoice-section">
      <InvoiceList :sales="this.filteredSales" />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import NavBar from "@/components/NavBar.vue";
import InvoiceList from "@/components/InvoiceList.vue";
import UpdateClient from "@/components/UpdateClient.vue";

export default {
  props: ["clientId"],
  components: {
    NavBar,
    InvoiceList,
    UpdateClient,
  },
  data() {
    return {
      client: {},
      filteredSales: [],
      sales: [],
      showUpdateClient: false,
      clientCopy: {},
      activeTab: 'client',
    };
  },
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },
    async fetchClientInfo() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch(`https://com.servhub.fr/api/customers/${this.clientId}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.client = result;
          })
          .catch((error) => console.error(error));
    },
    async fetchSales() {
      try {
        const response = await fetch('https://com.servhub.fr/api/sales');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          this.sales = await Promise.all(
              data.map(async sale => {
                // Check if the sale matches the clientId
                if (sale.customer_id === this.clientId) {
                  return {
                    _id: sale._id,
                    sale: sale,
                    customer: this.client,
                    total_price: sale.total_price,
                    reference: `I-${sale._id.substring(0, 8)}`,
                  };
                }
                return null; // If the sale doesn't match, return null
              })
          );
          // Filter out null values (non-matching sales)
          this.sales = this.sales.filter(sale => sale !== null);
          this.filteredSales = this.sales; // Initially, show only the filtered sales
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },
    editClientInfo() {
      this.showUpdateClient = true;
      this.clientCopy = { ...this.client };
    },
    closeUpdateClient() {
      this.showUpdateClient = false;
    },
    updateClient(updatedClient) {
      this.showUpdateClient = false; // Ferme l'overlay
      this.client = updatedClient;
    },
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'client') {
        this.$router.push({name: 'ClientSearch'});
      }
      if(tab === 'invoice'){
        this.$router.push({name: 'InvoiceSearch'})
      }
    },
  },
  mounted() {
    this.fetchClientInfo();
    this.fetchSales();
  }
};
</script>

<style scoped>
.top-section {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding-bottom: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow to distinguish it */
}
.top-bar {
  display: flex;
  justify-content: center; /* Center the buttons horizontally */
  position: absolute;
  border-radius: 30px;
  background-color: #fafafa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px 3px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 20px;
  z-index: 100;
}

.top-bar button.active {
  background-color: #80cbc4; /* Active state background */
}

.top-bar button:hover {
  background-color: #e0e0e0; /* Slightly darker grey when hovered */
}

.invoice-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  margin-left: 60px;
}

.client-header {
  display: flex;
  justify-content: space-between;
  padding: 10px;
  background-color: #e6f0ff;
  border-radius: 10px;
  margin-bottom: 20px;
}

.client-info {
  font-size: 16px;
}

.card-button {
  background-color: #d9b3b3;
  border: none;
  border-radius: 15px;
  padding: 5px 10px;
}

.contact-info {
  text-align: right;
}

.edit-button {
  background: none;
  border: none;
  cursor: pointer;
}

.recent-invoice-section {
  margin-top: 20px;
}

.invoice-list {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}

.invoice-card {
  min-width: 150px;
  padding: 15px;
  background-color: #aac4f6;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.1);
}

.top-bar {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: white;
}

.top-bar button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background-color: #f0f0f0;
  cursor: pointer;
  margin: 0 10px;
  font-size: 16px;
  color: #333;
  transition: background-color 0.3s ease;
}

.top-bar button.active {
  background-color: #80cbc4;
  color: white;
}
</style>