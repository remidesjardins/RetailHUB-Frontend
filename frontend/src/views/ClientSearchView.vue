<template>
  <div class="client-site">
    <!-- Sidebar / Navbar -->
    <NavBar />

    <!-- Main content -->
    <div class="main-content">
      <!-- Search Form -->
      <div class="search-form">
        <form @submit.prevent="filteredClients">
          <div>
            <label>
              Last Name
              <input type="text" v-model="search.lastName" class="custom-input"/>
            </label>
          </div>
          <div>
            <label>
              First Name
              <input type="text" v-model="search.firstName" class="custom-input"/>
            </label>
          </div>
          <p>Or</p>
          <div>
            <label>
              Phone Number
              <input type="text" v-model="search.phoneNumber" class="custom-input"/>
            </label>
          </div>
          <p>Or</p>
          <div>
            <label>
              E-Mail
              <input type="text" v-model="search.email" class="custom-input"/>
            </label>
          </div>
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
        <button class="create-client-btn" @click="openCreateClient">Create client</button>
      </div>
    </div>

    <CreateClient
        v-if="showCreateClient"
        @close="closeCreateClient"
    />

  </div>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import CreateClient from "@/components/CreateClient.vue";

export default {
  components: {
    NavBar,
    CreateClient,
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
      showCreateClient: false,
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
    },
    openCreateClient() {
      this.showCreateClient = true;
    },
    closeCreateClient() {
      this.showCreateClient = false;
    },
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
  justify-content: center;
  align-items: center;
}

.main-content {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
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

.search-form div{
  margin-top: 10px;
}

.search-form label {
  font-size: 18px;
  margin: 5px;
}

.search-form input {
  padding: 12px;
  border-radius: 5px;
  border: 1px solid #ccc;
  width: 100%;
}

.custom-input {
  border-radius: 10px;
  transition: box-shadow 0.3s ease;
}

.custom-input:focus {
  box-shadow: 0px 0px 10px rgba(0, 123, 255, 0.5);
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
  align-items: stretch; /* Assure que les hauteurs de .client-info et .client-contact soient les mêmes */
  padding: 15px;
  margin-bottom: 15px;
}

.client-info {
  flex: 2;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  margin-right: 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Aligne le contenu verticalement */
  justify-content: center; /* Centre le contenu verticalement */
}

.client-info .client-name {
  font-weight: bold;
  margin-bottom: 5px;
  font-size: 18px;
}

.client-contact {
  flex: 1;
  background-color: white;
  border-radius: 10px;
  padding: 15px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column; /* Aligne le contenu verticalement */
  justify-content: center; /* Centre le contenu verticalement */
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