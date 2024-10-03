<template>
  <div v-if="show" class="overlay">
    <div class="overlay-content">
      <h2>Update Sale</h2>

      <form @submit.prevent="updateSale">
        <!-- Customer Name -->
        <div class="form-group">
          <label for="customer_name">Customer Name</label>
          <input
              type="text"
              id="customer_name"
              v-model="sale.customer_name"
              placeholder="Enter customer name"
              required
          />
        </div>

        <!-- Total Price -->
        <div class="form-group">
          <label for="total_price">Total Price</label>
          <input
              type="number"
              step="0.01"
              id="total_price"
              v-model="sale.total_price"
              placeholder="Enter total price"
              required
          />
        </div>

        <!-- Sale Reference -->
        <div class="form-group">
          <label for="reference">Reference</label>
          <input
              type="text"
              id="reference"
              v-model="sale.reference"
              placeholder="Enter reference"
              required
          />
        </div>

        <!-- Payment Status -->
        <div class="form-group">
          <label for="payment_status">Payment Status</label>
          <select id="payment_status" v-model="sale.payment_status" required>
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        <!-- Submit Button -->
        <button type="submit" class="submit-btn">Update Sale</button>
        <button type="button" class="close-btn" @click="closeOverlay">Close</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    sale: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async updateSale() {
      try {
        const response = await fetch(`https://com.servhub.fr/api/sales/${this.sale._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.sale),
        });

        if (response.ok) {
          const updatedSale = await response.json();
          this.$emit('updateSale', updatedSale); // Emit the updated sale to the parent component
          alert(`Sale "${this.sale.reference}" updated successfully!`);
          this.closeOverlay();
        } else {
          const errorData = await response.json();
          alert(`Error updating sale: ${errorData.message}`);
        }
      } catch (error) {
        console.error('Error updating sale:', error);
        alert('An error occurred while updating the sale.');
      }
    },
    closeOverlay() {
      this.$emit('closeOverlay');
    }
  }
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 20px;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
}

.submit-btn,
.close-btn {
  margin-top: 10px;
  padding: 10px;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.close-btn {
  background-color: #a6a5a5;
}

.close-btn:hover {
  background-color: #888;
}

.submit-btn:hover {
  background-color: #45a049;
}
</style>S