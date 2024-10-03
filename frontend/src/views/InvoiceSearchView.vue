<template>
  <NavBar />
  <!-- Main content inside the invoice-search container -->
  <div class="invoice-search">
    <!-- Toggle Button and Header at the top -->
    <div class="top-section">
      <div class="top-bar">
        <button :class="{ active: activeTab === 'client' }" @click="switchTab('client')">Client</button>
        <button :class="{ active: activeTab === 'invoice' }" @click="switchTab('invoice')">Invoice</button>
      </div>

      <!-- Place the header inside the top-section -->
      <Header :searchQuery="searchQuery" @search="searchSales" id="header" />
    </div>

    <!-- Scrollable Recent Sales Section -->
    <div class="recent-sales">
      <InvoiceList :sales="filteredSales"></InvoiceList>
    </div>
  </div>
</template>

<script>
import Header from '@/components/Header.vue';
import InvoiceList from "@/components/InvoiceList.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    Header,
    InvoiceList,
    NavBar,
  },
  data() {
    return {
      searchQuery: '',
      activeTab: 'invoice',
      sales: [],
      filteredSales: [],
    };
  },
  methods: {
    // Fetch sales from the backend
    async fetchSales() {
      try {
        const response = await fetch('https://com.servhub.fr/api/sales');
        const data = await response.json();

        if (Array.isArray(data) && data.length > 0) {
          this.sales = await Promise.all(
              data.map(async sale => {
                const customerName = await this.fetchCustomerName(sale.customer_id);
                return {
                  _id: sale._id,
                  customer_name: customerName || 'Unknown Customer',
                  total_price: sale.total_price,
                  reference: `I-${sale._id.substring(0, 8)}`,
                };
              })
          );
          this.filteredSales = this.sales; // Initially, show all sales
        }
      } catch (error) {
        console.error('Error fetching sales:', error);
      }
    },

    // Filter sales based on the search query
    searchSales(query) {
      const lowerQuery = query.toLowerCase();
      this.filteredSales = this.sales.filter(
          sale =>
              sale.customer_name.toLowerCase().includes(lowerQuery) ||
              sale.reference.toLowerCase().includes(lowerQuery)
      );
    },

    async fetchCustomerName(customer_id) {
      try {
        const response = await fetch(`https://com.servhub.fr/api/customers/${customer_id}`);
        const customerData = await response.json();
        return customerData.name;
      } catch (error) {
        console.error('Error fetching customer details:', error);
        return null;
      }
    },

    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'client') {
        this.$router.push({ name: 'ClientSearch' });
      }
    },
  },
  mounted() {
    this.fetchSales();
  },
};
</script>

<style scoped>
/* Container for toggle buttons and header */
.top-section {
  position: sticky;
  top: 0;
  z-index: 10;
  background-color: white;
  padding-bottom: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* Add a subtle shadow to distinguish it */
}

/* Toggle buttons container */
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

/* Header inside top-section */
#header {
  padding: 10px 0;
  background-color: white;
}

/* Scrollable Recent Sales Section */
.recent-sales {
  margin-top: 20px;
  margin-left: 80px;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 75%; /* Adjust the height as needed */
  padding-right: 20px; /* Add some padding for better scrollability */
}
.invoice-search {
  margin-left: 65px;
  width: calc(100% - 65px);
}
.invoice-list {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
}

</style>