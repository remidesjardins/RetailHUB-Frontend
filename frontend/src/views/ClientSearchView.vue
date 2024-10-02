<template>
  <div class="client-site">
    <!-- Sidebar / Navbar -->
    <NavBar />

    <!-- Main content -->
    <div class="main-content">
      <!-- Search Form -->
      <div class="search-form">
        <form @submit.prevent="searchClient">
          <label>
            Last Name
            <input type="text" v-model="search.lastName" />
          </label>
          <label>
            First Name
            <input type="text" v-model="search.firstName" />
          </label>
          <p>Or</p>
          <label>
            Phone Number
            <input type="text" v-model="search.phoneNumber" />
          </label>
          <p>Or</p>
          <label>
            E-Mail
            <input type="text" v-model="search.email" />
          </label>
        </form>
      </div>

      <!-- Clients List -->
      <div class="clients-list">
        <h3>Clients</h3>
        <div v-if="filteredClients.length === 0">No clients found.</div>
        <div v-for="client in filteredClients" :key="client.id" class="client-card">
          <div class="client-info">
            <p class="client-name">{{ client.name }}</p>
            <p>{{ client.address }}</p>
          </div>
          <div class="client-contact">
            <p>{{ client.phone }}</p>
            <p>{{ client.email }}</p>
          </div>
        </div>
        <button class="create-client-btn">Create client</button>
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
      activeTab: 'client',
      search: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
      },
      clients: [],
    };
  },
  computed: {
    filteredClients() {
      return this.clients.filter((client) => {
        const matchesLastName = this.search.lastName === '' || client.name.toLowerCase().includes(this.search.lastName.toLowerCase());
        const matchesFirstName = this.search.firstName === '' || client.name.toLowerCase().includes(this.search.firstName.toLowerCase());
        const matchesPhone = this.search.phoneNumber === '' || this.normalizePhoneNumber(client.phone).includes(this.normalizePhoneNumber(this.search.phoneNumber));
        const matchesEmail = this.search.email === '' || client.email.toLowerCase().includes(this.search.email.toLowerCase());

        return matchesLastName && matchesFirstName && matchesPhone && matchesEmail;
      });
    }
  },
  methods: {
    fetchInitialClients() {
      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => {
            console.log(result);
            this.clients = result;
          })
          .catch((error) => console.error(error));
    },
    switchTab(tab) {
      this.activeTab = tab;
    },
    normalizePhoneNumber(phoneNumber) {
      // Enlever tous les caractères qui ne sont pas des chiffres
      return phoneNumber.replace(/\D/g, '');
    }
  },
  mounted() {
    this.fetchInitialClients();
  }
};
</script>

<style scoped>
.client-site {
  display: flex;
  height: 100vh;
}

.main-content {
  display: flex; /* Ajoutez flex pour aligner les éléments en ligne */
  flex-direction: row; /* Dispose les éléments horizontalement */
  justify-content: space-between; /* Espace entre les éléments */
  padding: 20px;
  width: 100%;
}

.top-bar {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.top-bar button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px;
  background-color: #eaeaea;
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

.search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 300px; /* Assurez-vous que la largeur ne dépasse pas trop */
}

.search-form label {
  font-size: 18px;
  margin-bottom: 5px;
}

.search-form input {
  padding: 12px;
  border-radius: 25px;
  border: 1px solid #ccc;
  width: 100%;
}

.clients-list {
  background-color: #e0f7fa;
  padding: 20px;
  border-radius: 15px;
  width: 100%;
  max-width: 600px;
  margin-left: 20px; /* Ajoute un espace entre la search-form et la clients-list */
}

.clients-list h3 {
  font-size: 24px;
  margin-bottom: 20px;
}

.client-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  padding: 15px;
  border-radius: 10px;
  margin-bottom: 15px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.client-info {
  flex: 1;
}

.client-info .client-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 18px;
}

.client-contact {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.client-contact p {
  margin: 5px 0;
  font-size: 14px;
}

.create-client-btn {
  background-color: #80cbc4;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  margin-top: 20px;
  align-self: flex-end;
  transition: background-color 0.3s ease;
}

.create-client-btn:hover {
  background-color: #4caf50;
}
</style>