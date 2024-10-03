<template>
  <div class="page-container">
    <!-- Main Container centré -->
    <div class="main-container">
      <!-- Navbar sur le côté gauche -->
      <NavBar />

      <!-- Contenant pour la partie centrale -->
      <div class="content-container">
        <!-- Icône de retour en arrière en haut à gauche -->
        <div class="back-button" @click="goBack">
          <i class="fa-solid fa-arrow-left"></i> <!-- Icône flèche gauche -->
        </div>

        <!-- Contenu principal (le contenant bleu pour les charts) -->
        <div class="chart-container">
          <!-- Ici tes charts seront affichés -->
        </div>

        <!-- Footer avec boutons Day, Week, Month, Year -->
        <div class="footer-buttons">
          <button :class="{'active-button': period === 'week'}" @click="changePeriod('week')">Week</button>
          <button :class="{'active-button': period === 'month'}" @click="changePeriod('month')">Month</button>
          <button :class="{'active-button': period === 'year'}" @click="changePeriod('year')">Year</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import ChartComp from "@/components/ChartComp.vue";
export default {
  components: {
    NavBar,
    ChartComp,
  },
  data() {
    return {
      period: 'week',
    };
  },
  methods: {
    changePeriod(period) {
      this.period = period;
    },
    goBack() {
      this.$router.go(-1); // Retour à la page précédente
    },
  },
};
</script>

<style scoped>
.page-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  width: 100vw;
}

.main-container {
  display: flex;
  width: 80vw;
  height: 80vh;
  background-color: white;
  border-radius: 10px;
}

.content-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px;
  margin-left: 60px;
  position: relative;
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  font-size: 20px;
}

.chart-container {
  flex-grow: 1;
  background-color: #cceeff;
  margin: 50px 10px 10px 10px; /* Ajoute un margin-top pour espacer l'icône */
  border-radius: 10px;
}

.footer-buttons {
  display: flex;
  justify-content: center;
  padding: 10px;
}

.footer-buttons button {
  margin: 0 5px;
}
</style>