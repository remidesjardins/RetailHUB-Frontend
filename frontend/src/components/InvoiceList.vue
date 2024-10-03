<template>
  <div class="invoice-list">
    <h2>Recent Sales <i class="fa fa-history"></i></h2>
    <div class="invoice-container">
      <!-- Display filtered sales -->
      <div
          v-for="(sale, index) in (sales.length ? sales : Array(10).fill({}))"
          :key="sale._id || index"
          class="invoice-card"
      >
        <template v-if="sales.length">
          <p class="customer-name">{{ sale.customer_name }}</p>
          <p class="total-price">{{ sale.total_price }} €</p>
          <p class="sale-reference">{{ sale.reference }}</p>

          <!-- Buttons for Update and Delete -->
          <div class="card-actions">
            <button @click="updateSale(sale)" class="action-btn update-btn">
              <i class="fa fa-pencil-alt"></i>
            </button>
            <button @click="deleteSale(sale._id)" class="action-btn delete-btn">
              <i class="fa fa-trash"></i>
            </button>
          </div>
        </template>
        <template v-else>
          <p class="nothing-found">Oups, nothing found</p>
        </template>
      </div>
    </div>
  </div>
  <UpdateSaleForm
      :sale="selectedSale"
      :show="showUpdateOverlay"
      @closeOverlay="closeUpdateOverlay"
      @updateSale="handleSaleUpdate"
  />
</template>

<script>
import UpdateSaleForm from "@/components/UpdateSaleForm.vue";

export default {
  props: {
    sales: {
      type: Array,
      default: () => []
    }
  },
  data(){
    return{
      showUpdateOverlay: false,
      selectedSale: null,
    }
  },
  components: {
    UpdateSaleForm,
  },
  methods: {
    // Placeholder methods for updating and deleting sales
    updateSale(sale) {
      this.selectedSale = sale;
      this.showUpdateOverlay = true;
    },
    closeUpdateOverlay() {
      this.showUpdateOverlay = false;
    },
    async deleteSale(saleId) {
      if (confirm("Are you sure you want to delete this sale?")) {
        try {
          const response = await fetch(`https://com.servhub.fr/api/sales/${saleId}`, {
            method: 'DELETE',
          });

          if (response.ok) {
            alert('Sale deleted successfully!');
            // Remove the sale from the list in the frontend
            this.sales = this.sales.filter(sale => sale._id !== saleId);
          } else {
            const errorData = await response.json();
            alert(`Error deleting sale: ${errorData.message}`);
          }
        } catch (error) {
          console.error('Error deleting sale:', error);
        }
      }
    }
  }
};
</script>

<style scoped>
.invoice-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: flex-start;
  padding-bottom: 10px;
}

.invoice-card {
  min-width: 200px;
  max-width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 20px;
  background: linear-gradient(to bottom right, #aac4f6, #c2d7f4);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative; /* Make the card relative to position the buttons */
}

.customer-name {
  font-weight: bold;
  font-size: 28px;
  margin-bottom: 10px;
  margin-left: 10px;
}

.total-price {
  font-size: 24px;
  margin-left: 10px;
}

.sale-reference {
  font-size: 18px;
  color: #333;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-left: 10px;
}

/* Action buttons (Update and Delete) */
.card-actions {
  position: absolute;
  bottom: 10px;
  right: 10px;
  display: flex;
  gap: 10px;
}

.action-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 5px;
  border-radius: 50%;
  transition: background-color 0.3s;
}

.update-btn {
  color: #4caf50; /* Green color for update */
}

.delete-btn {
  color: #f44336; /* Red color for delete */
}

.action-btn:hover {
  background-color: rgba(0, 0, 0, 0.1); /* Hover effect */
}

.nothing-found {
  font-size: 18px;
  color: red;
  text-align: center;
  margin-top: 40px;
}
</style>