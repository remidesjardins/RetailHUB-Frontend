<template>
  <div class="employee-dashboard">
    <NavBar /> <!-- Assuming you have a Navbar component -->

    <div class="dashboard-container">
      <div class="stats-card">
        <h2>Total sold in {{ this.monthInLetter(currentMonth) }} :</h2>
        <p class="value">{{ totalSold }} $</p>
      </div>

      <div class="stats-card">
        <h2>Total bonus in {{ this.monthInLetter(currentMonth) }} :</h2>
        <p class="value">{{ totalBonus }} $</p>
      </div>
    </div>

    <div class="button-container">
      <button @click="accessStats" class="stats-button">Access stats</button>
      <button @click="logOut" class="logout-button">Log out</button>
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
      employeeId: "66fdffb56790cc1514a6a267", // Example employee ID, should be dynamic
      totalSold: 0,
      totalBonus: 0,
      currentMonth: new Date().getMonth(), // Get current month (0 = January, 11 = December)
    };
  },
  methods: {
    fetchSalesData() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      fetch("https://com.servhub.fr/api/sales/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            this.calculateTotalSales(result);
          })
          .catch((error) => console.error("Error fetching sales data:", error));
    },
    calculateTotalSales(sales) {
      let total = 0;

      sales.forEach((sale) => {
        const saleDate = new Date(sale.sale_date);
        const saleMonth = saleDate.getMonth(); // Get the month of the sale

        if (
            sale.soldBy === this.employeeId &&
            sale.payment_status === "Completed" &&
            saleMonth === this.currentMonth // Check if the sale is in the current month
        ) {
          total += sale.total_price;
        }
      });

      this.totalSold = total.toFixed(2);
      this.totalBonus = (total * 0.01).toFixed(2);
    },
    accessStats() {
      // Handle accessing stats
      this.$router.push({name: "Admin"});
    },
    logOut() {
      // Handle logout logic
      console.log("Logging out");
    },
    monthInLetter(monthId) {
      const date = new Date();
      date.setMonth(monthId);
      return date.toLocaleString('en-EN', { month: 'long' });
    },
  },
  mounted() {
    this.fetchSalesData();
  },
};
</script>

<style scoped>
.employee-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.dashboard-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  max-width: 800px;
  margin-bottom: 20px;
}

.stats-card {
  background-color: #e0f7fa;
  border-radius: 10px;
  padding: 20px;
  text-align: center;
  flex: 1;
  margin: 10px;
}

.value {
  color: green;
  font-size: 40px;
  font-weight: bold;
}

.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.stats-button,
.logout-button {
  background-color: #80cbc4;
  border: none;
  border-radius: 10px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  color: white;
}

.logout-button {
  background-color: #607d8b;
}

.stats-button:hover,
.logout-button:hover {
  opacity: 0.9;
}
</style>