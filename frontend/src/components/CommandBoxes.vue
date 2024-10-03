<template>
  <div>
    <h2>Commands</h2>
    <div class="command-list">
      <div class="command-box" @click="onCommandClick('receipt')">Receipt of a parcel</div>
      <div class="command-box" @click="onCommandClick('placeProduct')">Place a product</div>
      <div class="command-box" @click="onCommandClick('stockCorrection')">Stock correction</div>
      <div class="command-box" @click="onCommandClick('addProduct')">Add Product</div>
    </div>
  </div>
  <AddProductForm v-if="showAddProductForm" @close="closeForm" />
  <StockCorrectionForm v-if="showStockCorrectionForm" @close="closeForm" />
  <ReceiptParcelForm v-if="showReceiptForm" @close="showReceiptForm = false" />
  <PlaceProductForm v-if="showPlaceProductForm" @close="showPlaceProductForm = false" />
</template>

<script>

import AddProductForm from '@/components/AddProductForm.vue';
import StockCorrectionForm from '@/components/StockCorrection.vue';
import ReceiptParcelForm from '@/components/ReceiptParcelForm.vue';
import PlaceProductForm from "@/components/PlaceProductForm.vue";

export default {
  components: {
    AddProductForm,
    StockCorrectionForm,
    ReceiptParcelForm,
    PlaceProductForm,
  },
  data() {
    return {
      showAddProductForm: false,
      showStockCorrectionForm: false,
      showReceiptForm: false,
      showPlaceProductForm: false,
    };
  },
  methods: {
    onCommandClick(action) {
      switch (action) {
        case 'receipt':
          this.handleReceiptOfParcel();
          break;
        case 'placeProduct':
          this.handlePlaceProduct();
          break;
        case 'stockCorrection':
          this.handleStockCorrection();
          break;
        case 'addProduct':
          this.handleAddProduct();
          break;
        default:
          console.log('Unknown action');
      }
    },
    handleReceiptOfParcel() {
      // Add your logic here for receipt of parcel
      this.showReceiptForm = true; // Show the receipt form overlay
    },
    handlePlaceProduct() {
      this.showPlaceProductForm = true;
    },
    handleStockCorrection() {
      this.showStockCorrectionForm = true;
    },
    handleAddProduct() {
      this.showAddProductForm = true;
    },
    closeForm() {
      this.showStockCorrectionForm = false;
      this.showAddProductForm = false;
    },
  },
};
</script>

<<style scoped>
.command-list {
  display: flex;
  gap: 16px;
  justify-content: start;
  overflow-x: auto;
}

.command-box {
  min-width: 200px;
  max-width: 200px;
  height: 200px;
  padding: 10px;
  border-radius: 20px;
  background: linear-gradient(to bottom right, #e0eafc, #cfdef3);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
  display: flex;
  font-size: 32px;
  font-weight: bold;
  color: #333;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.command-box:hover {
  transform: scale(1.05); /* Slightly enlarges on hover */
}
</style>