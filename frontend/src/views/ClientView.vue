<!--
 * RetailHub - ClientView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component displays detailed information about a specific client,
 * including their contact information and a list of recent invoices.
 * It also provides functionality to update client information and navigate
 * between client and invoice views.
 -->

<template>
  <div class="invoice-container">
    <!-- UpdateClient Overlay for modifying client details -->
    <UpdateClient
        v-if="showUpdateClient"
        :client="clientCopy"
        @close="closeUpdateClient"
        @close-data="updateClient"
    />

    <!-- Navigation Bar -->
    <NavBar/>

    <!-- Top Bar with Tab Buttons -->
    <div class="top-bar">
      <!-- Client Tab Button -->
      <button
          :class="{ active: activeTab === 'client' }"
          @click="switchTab('client')"
      >
        Client
      </button>

      <!-- Invoice Tab Button -->
      <button
          :class="{ active: activeTab === 'invoice' }"
          @click="switchTab('invoice')"
      >
        Invoice
      </button>
    </div>

    <!-- Client Header Section -->
    <div class="client-header">
      <div class="client-info">
        <!-- Display Client Name -->
        <h3>M. {{ client.name }}</h3>
        <!-- Display Client ID -->
        <p>C-{{ client._id }}</p>
        <!-- Display Client Address -->
        <p>{{ client.address }}</p>
      </div>

      <div class="client-actions">
        <div class="contact-info">
          <!-- Display Client Phone Number -->
          <p>{{ client.phone }}</p>
          <!-- Display Client Email -->
          <p>{{ client.email }}</p>
        </div>
        <!-- Button to Edit Client Information -->
        <button @click="editClientInfo" class="edit-button">
          <i class="fa fa-pencil-alt"></i>
        </button>
      </div>
    </div>

    <!-- Recent Invoices Section -->
    <div class="recent-invoice-section">
      <!-- InvoiceList Component to display filtered sales -->
      <InvoiceList :sales="filteredSales" />
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
      /**
       * Object containing the client's detailed information.
       */
      client: {},

      /**
       * Array of sales (invoices) related to the client.
       */
      filteredSales: [],

      /**
       * Array of all sales fetched from the backend.
       */
      sales: [],

      /**
       * Flag to control the visibility of the UpdateClient overlay.
       */
      showUpdateClient: false,

      /**
       * A copy of the client object used for editing purposes to avoid mutating the original data.
       */
      clientCopy: {},

      /**
       * Currently active tab ('client' or 'invoice').
       */
      activeTab: 'client',
    };
  },

  methods: {
    /**
     * Formats a date string into 'MM/DD/YYYY' format.
     *
     * @param {string} date - The date string to format.
     * @returns {string} - The formatted date string.
     */
    formatDate(date) {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return new Date(date).toLocaleDateString(undefined, options);
    },

    /**
     * Fetches detailed information about the client from the backend API.
     */
    async fetchClientInfo() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      try {
        const response = await fetch(`https://com.servhub.fr/api/customers/${this.clientId}`, requestOptions);
        if (!response.ok) {
          throw new Error(`Failed to fetch client info: ${response.statusText}`);
        }
        const result = await response.json();
        this.client = result;
      } catch (error) {
        console.error(error);
      }
    },

    /**
     * Fetches all sales from the backend API and filters them to include only those related to the current client.
     */
    async fetchSales() {
      try {
        const response = await fetch('https://com.servhub.fr/api/sales');
        if (!response.ok) {
          throw new Error(`Failed to fetch sales: ${response.statusText}`);
        }
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          this.sales = await Promise.all(
              data.map(async sale => {
                // Check if the sale is associated with the current client
                if (sale.customer_id === this.clientId) {
                  return {
                    _id: sale._id,
                    sale: sale,
                    customer: this.client,
                    total_price: sale.total_price,
                    reference: `I-${sale._id.substring(0, 8)}`,
                  };
                }
                return null; // Exclude sales not related to the client
              })
          );
          // Remove null values resulting from non-matching sales
          this.sales = this.sales.filter(sale => sale !== null);
          this.filteredSales = this.sales; // Initialize with all filtered sales
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },

    /**
     * Opens the UpdateClient overlay to allow editing of client information.
     */
    editClientInfo() {
      this.showUpdateClient = true;
      // Create a copy of the client data to prevent direct mutation
      this.clientCopy = { ...this.client };
    },

    /**
     * Closes the UpdateClient overlay without saving changes.
     */
    closeUpdateClient() {
      this.showUpdateClient = false;
    },

    /**
     * Updates the client data with the modified information from the UpdateClient component.
     *
     * @param {Object} updatedClient - The updated client information.
     */
    updateClient(updatedClient) {
      this.showUpdateClient = false; // Close the overlay
      this.client = updatedClient; // Update the client data with the modified information
    },

    /**
     * Switches the active tab between 'client' and 'invoice'.
     * Redirects to the corresponding view based on the selected tab.
     *
     * @param {string} tab - The tab to switch to ('client' or 'invoice').
     */
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'client') {
        this.$router.push({ name: 'ClientSearch' });
      }
      if (tab === 'invoice') {
        this.$router.push({ name: 'InvoiceSearch' });
      }
    },
  },

  mounted() {
    // Fetch client information and related sales when the component is mounted
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
}
</style>