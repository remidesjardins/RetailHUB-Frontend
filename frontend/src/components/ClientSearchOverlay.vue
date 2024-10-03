<template>
  <div class="overlay-container">
    <div class="overlay">
      <button class="close-button" @click="closeClientSearch"><i class="fa-solid fa-xmark"></i></button>

      <!-- Main Content inside Overlay -->
      <div class="main-content">
        <!-- Search Form -->
        <div class="search-form">
          <form @submit.prevent="filteredClients">
            <div class="form-group">
              <label>Last Name</label>
              <input type="text" v-model="search.lastName" class="custom-input"/>
            </div>
            <div class="form-group">
              <label>First Name</label>
              <input type="text" v-model="search.firstName" class="custom-input"/>
            </div>
            <p class="separator">Or</p>
            <div class="form-group">
              <label>Phone Number</label>
              <input type="text" v-model="search.phoneNumber" class="custom-input"/>
            </div>
            <p class="separator">Or</p>
            <div class="form-group">
              <label>E-Mail</label>
              <input type="text" v-model="search.email" class="custom-input"/>
            </div>
            <button type="submit" class="submit-btn">Search</button>
          </form>
        </div>

        <!-- Clients List -->
        <div class="clients-list">
          <h3>Clients</h3>
          <div v-if="filteredClients.length === 0">No clients found.</div>
          <div v-for="client in filteredClients" :key="client.id" class="client-card" @click="chooseClient(client)">
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

      <!-- Create Client Modal -->
      <CreateClient
          v-if="showCreateClient"
          @close="closeCreateClient"
      />
    </div>
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
            this.clients = result;
          })
          .catch((error) => console.error(error));
    },
    normalizePhoneNumber(phoneNumber) {
      return phoneNumber.replace(/\D/g, '');
    },
    openCreateClient() {
      this.showCreateClient = true;
    },
    closeCreateClient() {
      this.showCreateClient = false;
    },
    closeClientSearch() {
      this.$emit("close");
    },
    chooseClient(client) {
      this.$emit("close-data", client);
    },
  },
  mounted() {
    this.fetchInitialClients();
  }
};
</script>

<style scoped>
.overlay-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
}

.overlay {
  background: white;
  width: 80%;
  max-width: 900px;
  height: 90%;
  border-radius: 15px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  padding: 20px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  transition: color 0.3s ease;
}

.close-button:hover {
  color: #f44336;
}

.main-content {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.custom-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.separator {
  margin: 10px 0;
  text-align: center;
  font-weight: bold;
}

.submit-btn {
  background-color: #80cbc4;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #4caf50;
}

.clients-list {
  background-color: #e0f7fa;
  padding: 20px;
  border-radius: 15px;
  margin-top: 20px;
}

.client-card {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  margin-bottom: 10px;
  cursor: pointer;
  transition: box-shadow 0.3s ease;
}

.client-card:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.create-client-btn {
  background-color: #80cbc4;
  border: none;
  padding: 12px 24px;
  border-radius: 25px;
  color: white;
  cursor: pointer;
  margin-top: 20px;
}

.create-client-btn:hover {
  background-color: #4caf50;
}

.client-info,
.client-contact {
  flex: 1;
  padding: 10px;
}
</style>