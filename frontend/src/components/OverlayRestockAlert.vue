<template>
  <div class="home-container">
    <NavBar class="navbar"></NavBar>
    <div class="overlay-restock-alert">
      <div class="overlay-content">
        <h1>Restock Alert</h1>
        <button @click="$emit('close')" class="close-btn">
          <i class="fa-solid fa-xmark fa-xl"></i>
        </button>
        <div v-for="(alert, index) in restockAlerts.slice()" :key="index" class="alerts">
          <div class="alert-product">
            <h3>{{alert.name}}</h3>
            <p>{{alert.SKU}}</p>
          </div>
          <div class="alert-details">
            <p>{{alert.reason}}</p>
          </div>
          <i class="fa-solid fa-check" @click="deleteAlert()"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    NavBar,
  },

  data() {
    return {
      restockAlerts: [],
    };
  },

  computed: {
    fetchGetAlert () {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch("https://com.servhub.fr/api/alerts/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.restockAlerts = result;
          })
          .catch((error) => console.error(error));
    },

    deleteAlert() {
      const requestOptions = {
        method: "DELETE",
        redirect: "follow"
      };

      fetch(`https://com.servhub.fr/api/alerts/${alertsId}`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.restockAlerts = result;
          })
          .catch((error) => console.error(error));
    }
  },
  mounted() {
    this.fetchGetAlert();
  }
}
</script>

<style scoped>

</style>