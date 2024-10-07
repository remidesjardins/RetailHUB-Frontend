<!--
  =====================================================
  Project: RetailHub
  File: RestockAlert.vue
  Description: Component for displaying and managing restock alerts within RetailHub.
  Participants:
    - Alexandre Borny
    - Maël Castellan
    - Laura Donato
    - Rémi Desjardins
  =====================================================
-->

<template>
  <!-- Main container for the Restock Alert section -->
  <div class="home-container">
    <!-- Navigation Bar component -->
    <NavBar class="navbar"></NavBar>

    <!-- Overlay for displaying restock alerts -->
    <div class="overlay-restock-alert">
      <div class="overlay-content">
        <!-- Header with title and close button -->
        <h1>Restock Alert</h1>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>

        <!-- Loop through each restock alert to display its details -->
        <div
            v-for="(alert, index) in restockAlerts.slice()"
            :key="index"
            class="alerts"
        >
          <!-- Display product name and SKU -->
          <div class="alert-product">
            <h3>{{ alert.ref_product }}</h3>
          </div>

          <!-- Display reason for restocking -->
          <div class="alert-details">
            <p>{{ alert.reason }}</p>
          </div>

          <!-- Button to mark the alert as resolved/deleted -->
          <i class="fa-solid fa-check" @click="deleteAlert(alert._id)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * RestockAlert Component
 * Displays a list of restock alerts and provides functionalities to manage them.
 */
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar,
  },

  data() {
    return {
      /**
       * Array holding all restock alerts fetched from the API.
       * @type {Array}
       */
      restockAlerts: [],
    };
  },

  methods: {
    /**
     * Fetches the list of restock alerts from the API.
     * Called when the component is mounted.
     */
    async fetchGetAlert() {
      const requestOptions = {
        method: "GET",
        redirect: "follow",
      };

      try {

        const requestOptions2 = {
          method: "POST",
          redirect: "follow"
        };

        await fetch("https://com.servhub.fr/api/alerts/ai", requestOptions2)
            .then((res) => {
              console.log("Fetching ia prediction successfully", res)})
            .catch(err => {
              console.log(err)})

        const response = await fetch("https://com.servhub.fr/api/alerts/", requestOptions);
        const result = await response.json();
        console.log("Fetched Restock Alerts:", result);
        this.restockAlerts = result;
        console.log("Alerts: ", this.restockAlerts);
      } catch (error) {
        console.error("Error fetching restock alerts:", error);
      }
    },


    /**
     * Deletes a specific restock alert by its ID.
     * Sends a DELETE request to the API and updates the local alerts list upon success.
     * @param {String} alertId - The unique identifier of the alert to be deleted.
     */
    async deleteAlert(alertId) {
      if (confirm("Are you sure you want to delete this restock alert?")) {
        const requestOptions = {
          method: "DELETE",
          redirect: "follow",
        };

        try {
          const response = await fetch(`https://com.servhub.fr/api/alerts/${alertId}`, requestOptions);
          if (response.ok) {
            const result = await response.json();
            console.log("Deleted Alert:", result);
            // Remove the deleted alert from the local list
            this.restockAlerts = this.restockAlerts.filter(alert => alert._id !== alertId);
            alert("Restock alert deleted successfully!");
          } else {
            const errorData = await response.json();
            console.error("Failed to delete alert:", errorData);
            alert(`Error deleting alert: ${errorData.message}`);
          }
        } catch (error) {
          console.error("Error deleting alert:", error);
          alert("An error occurred while deleting the alert.");
        }
      }
    },
  },

  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates the fetching of restock alerts.
   */
  mounted() {

    this.fetchGetAlert();

  },
};
</script>

<style scoped>
.overlay-restock-alert {
  margin-left: 60px;
}
</style>