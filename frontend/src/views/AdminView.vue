<template>
  <div class="page-container">
    <!-- Main Container centré -->
    <div class="main-container">
      <!-- Navbar sur le côté gauche -->
      <NavBar />

      <!-- Contenant pour la partie centrale -->
      <div class="content-container">
        <!-- Icône de retour en arrière en haut à gauche -->

        <div class="top-bar">
          <div class="back-button" @click="goBack">
            <i class="fa-solid fa-arrow-left"></i> <!-- Icône flèche gauche -->
          </div>
          <button :class="{ active: period === 'week' }" @click="changePeriod('week')">Week</button>
          <button :class="{ active: period === 'month' }" @click="changePeriod('month')">Month</button>
          <button :class="{ active: period === 'year' }" @click="changePeriod('year')">Year</button>
        </div>

        <!-- Contenu principal (le contenant bleu pour les charts) -->
        <div class="chart-container">
          <!-- Ici tes charts seront affichés -->
          <ChartComp
              v-show="weeks"
              :years="false"
              :months="false"
              :weeks="true"
          />
          <ChartComp
              v-show="months"
              :years="false"
              :months="true"
              :weeks="false"
          />
          <ChartComp
              v-show="years"
              :years="true"
              :months="false"
              :weeks="false"
          />
        </div>

        <!-- Footer avec boutons Day, Week, Month, Year
        <div class="footer-buttons">
          <button :class="{'active-button': period === 'week', 'toggle-button': true}" @click="changePeriod('week')">Week</button>
          <button :class="{'active-button': period === 'month', 'toggle-button': true}" @click="changePeriod('month')">Month</button>
          <button :class="{'active-button': period === 'year', 'toggle-button': true}" @click="changePeriod('year')">Year</button>
        </div>-->
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
      weeks: false,
      months: false,
      years: false,
      period: 'week',

    };
  },
  methods: {
    changePeriod(period) {
      this.period = period;
      if (period === 'week') {
        this.weeks = true;
        this.months = false;
        this.years = false;
      } else if (period === 'month') {
        this.weeks = false;
        this.months = true;
        this.years = false;
      } else {
        this.weeks = false;
        this.months = false;
        this.years = true;
      }
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
.chart-container {
  margin-left: 65px;
  width: calc(100% - 65px);
  padding-top: 20px;
}

/* Add a sticky top bar for the buttons */
.top-bar {
  display: flex;
  justify-content: center;
  padding: 10px 0;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 10;
}

/* Button styling (same as AdminView) */
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
  color: black;
}

/* Add chart content styling */
.chart-content {
  padding: 20px;
  background-color: #fafafa;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.back-button {
  position: absolute;
  top: 10px;
  left: 10px;
  cursor: pointer;
  font-size: 20px;
}

.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; /* Takes full height */
}

.chart-wrapper {
  width: 90%;
  height: 70vh; /* Takes 70% of the view height */
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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