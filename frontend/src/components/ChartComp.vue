<template>
  <div class="chart-container">
    <button @click="InitChart">Appuie</button>
    <div class="chart-wrapper">
      <canvas ref="chart"></canvas>
    </div>

  </div>
</template>

<script>
import { Chart } from 'chart.js/auto';
export default {
  data() {
    return {
      chartLabel : [],
      chartData : [],
      chartAvg : [],
    }
  },
  mounted() {
    this.fetchData(false, false, true);





  },
  methods:{

    InitChart(){
      const avg = this.CalculateAvg();
      console.log(avg);
      console.log(this.chartData);
      console.log(this.chartLabel);
      this.chartAvg = Array(this.chartData.length).fill(avg);
      this.CreateChart();
    },

    fetchData(years, months, weeks) {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      // Vérifie qu'un seul paramètre est à true
      if (!(years ^ months ^ weeks)) {
        console.error('Un seul des paramètres doit être true');
        return;
      }


      // Ajoute l'année actuelle pour le fetch des mois et des semaines
      const currentYear = new Date().getFullYear();
      const currentWeek = this.getCurrentWeek()-1; // Assurez-vous d'avoir une méthode pour obtenir la semaine actuelle

      // Modifie l'URL en fonction du paramètre
      let url = `https://com.servhub.fr/api/sales?`;
      if (years) {
        url += `years=true`;
      } else if (months) {
        url += `months=true&year=${currentYear}`;
      } else if (weeks) {
        url += `weeks=true&year=${currentYear}&week=${currentWeek}`;
      }


      fetch(url, requestOptions)
          .then(res => res.json())
          .then(data => {



            // Traiter les données selon les paramètres
            if (years) {
              data.forEach(item => {
                let sum = 0;
                this.chartLabel.push(item._id.year);
                item.sales.forEach(sale => {
                  sum += sale.total_price;
                });
                this.chartData.push(sum);
              });
            }

            if (months) {

              data.forEach(item => {
                let sum = 0;
                const month = new Date(item._id.year, item._id.month - 1).toLocaleString('default', { month: 'long' });
                this.chartLabel.push(month + ' ' + item._id.year);
                item.sales.forEach(sale => {
                  sum += sale.total_price;
                });
                this.chartData.push(sum);
              });

            }

            if (weeks) {
              this.chartLabel = ['lundi', 'mardi', 'mercredi', 'jeudi', 'vendredi', 'samedi', 'dimanche'];
              this.chartData = [0,0,0,0,0,0,0]
              const body = data[0];
              body.sales.forEach(sale => {
                const saleDate = new Date(sale.sale_date);
                const dayOfWeek = saleDate.toLocaleString('default', { weekday: 'long' }); // Obtenir le jour de la semaine (lundi, mardi, etc.)
                const index = this.chartLabel.indexOf(dayOfWeek);
                this.chartData[index] += sale.total_price;
              })



            }
          })
          .catch(error => console.error('Error fetching data:', error));
    },
    getCurrentWeek() {
      const currentDate = new Date();
      const firstDayOfYear = new Date(currentDate.getFullYear(), 0, 1);
      const pastDaysOfYear = (currentDate - firstDayOfYear) / 86400000;
      return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    },
    CreateChart(){
      const ctx = this.$refs.chart.getContext('2d');
      new Chart(ctx, {
        type: 'bar', // Type de graphique de base
        data: {
          labels: this.chartLabel,
          datasets: [
            {
              label: 'Bar Dataset',
              data: this.chartData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              order:1,
            },
            {
              label: 'Line Dataset',
              data: this.chartAvg,
              type: 'line', // Ajout de la ligne
              borderColor: 'rgba(255, 99, 132, 1)',
              fill: false,
              order: 0,
            },
          ],
        },
        options: {
          plugins: {
            legend: {
              display: false, // Désactive la légende
            },
          },
          animation:{
            y: {
              from: 500, // Les barres et la ligne apparaîtront à partir du bas
            },
            duration: 2000,
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
    CalculateAvg(){
      const sum = this.chartData.reduce((acc, val) => acc + val, 0);
      const avg = sum/this.chartData.length;
      return avg;
    }
  },
};
</script>

<style scoped>
.chart-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Pleine hauteur de l'écran */
}

canvas {
  border-radius: 20px;
}
.chart-wrapper {
  width: 50%; /* Ajuste la largeur du div pour le redimensionner */
  aspect-ratio: 2 / 1; /* Garde le ratio 2:1, tu peux ajuster selon le graphique */
  max-width: 600px; /* Limite la taille maximale */
  max-height: 300px; /* Limite la hauteur maximale */
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
