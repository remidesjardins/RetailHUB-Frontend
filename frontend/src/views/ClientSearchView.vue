<!--
 * RetailHub - ClientSearchView.vue
 *
 * Participants:
 * - Alexandre Borny
 * - Maël Castellan
 * - Laura Donato
 * - Rémi Desjardins
 *
 * This component provides a user interface for searching and managing clients within RetailHub.
 * Users can search for clients by various criteria, view the list of clients, and create new clients.
 * Additionally, it includes navigation to invoice search and client detail pages.
 -->

<template>
  <div class="client-site">
    <!-- Navigation Bar -->
    <NavBar/>

    <!-- Sidebar / Navbar -->
    <div class="top-section"></div>

    <!-- Top Bar with Tab Buttons -->
    <div class="top-bar">
      <!-- Client Tab Button -->
      <button
          :class="{ active: activeTab === 'client' }"
          @click="switchTab('client')"
      >
        Client
      </button>

      <!-- Invoice Tab Button -->
      <button
          :class="{ active: activeTab === 'invoice' }"
          @click="switchTab('invoice')"
      >
        Invoice
      </button>
    </div>

    <!-- Main Content Area -->
    <div class="main-content">
      <!-- Search Form for Clients -->
      <div class="search-form">
        <form @submit.prevent="filteredClients">
          <!-- Last Name Search Field -->
          <div>
            <label>
              Last Name
              <input type="text" v-model="search.lastName" class="custom-input"/>
            </label>
          </div>

          <!-- First Name Search Field -->
          <div>
            <label>
              First Name
              <input type="text" v-model="search.firstName" class="custom-input"/>
            </label>
          </div>

          <p>Or</p>

          <!-- Phone Number Search Field -->
          <div>
            <label>
              Phone Number
              <input type="text" v-model="search.phoneNumber" class="custom-input"/>
            </label>
          </div>

          <p>Or</p>

          <!-- E-Mail Search Field -->
          <div>
            <label>
              E-Mail
              <input type="text" v-model="search.email" class="custom-input"/>
            </label>
          </div>
        </form>
      </div>

      <!-- Clients List Display -->
      <div class="clients-list">
        <h3>Clients</h3>
        <div class="clients-list-content">
          <!-- Message when no clients are found -->
          <div v-if="filteredClients.length === 0">No clients found.</div>

          <!-- List of Client Cards -->
          <div
              v-for="client in filteredClients"
              :key="client.id"
              class="client-card"
              @click="goToClientPage(client._id)"
          >
            <!-- Client Information Section -->
            <div class="client-info">
              <p class="client-name">{{ client.name }}</p>
              <p>{{ client.address }}</p>
            </div>

            <!-- Client Contact Information -->
            <div class="client-contact">
              <p>{{ client.phone }}</p>
              <p>{{ client.email }}</p>
            </div>
          </div>
        </div>

        <!-- Button to Open Create Client Overlay -->
        <button class="create-client-btn" @click="openCreateClient">Create client</button>
      </div>
    </div>

    <!-- CreateClient Component Overlay -->
    <CreateClient
        v-if="showCreateClient"
        @close="closeCreateClient"
    />
  </div>
</template>

<script>
import CreateClient from "@/components/CreateClient.vue";
import NavBar from "@/components/NavBar.vue";

export default {
  components: {
    CreateClient,
    NavBar,
  },

  data() {
    return {
      /**
       * Currently active tab ('client' or 'invoice').
       */
      activeTab: 'client',

      /**
       * Search criteria for filtering clients.
       */
      search: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
      },

      /**
       * Array of all clients fetched from the backend.
       */
      clients: [],

      /**
       * Flag to control the visibility of the CreateClient overlay.
       */
      showCreateClient: false,
    };
  },

  computed: {
    /**
     * Filters the list of clients based on the search criteria.
     *
     * @returns {Array} - Array of clients that match the search criteria.
     */
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
    /**
     * Fetches the initial list of clients from the backend API.
     */
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

    /**
     * Switches the active tab between 'client' and 'invoice'.
     *
     * @param {string} tab - The tab to switch to ('client' or 'invoice').
     */
    switchTab(tab) {
      this.activeTab = tab;
      if (tab === 'invoice') {
        this.$router.push({ name: 'InvoiceSearch' }); // Redirect to InvoiceSearchView
      }
    },

    /**
     * Normalizes a phone number by removing all non-digit characters.
     *
     * @param {string} phoneNumber - The phone number to normalize.
     * @returns {string} - The normalized phone number containing only digits.
     */
    normalizePhoneNumber(phoneNumber) {
      // Remove all non-digit characters
      return phoneNumber.replace(/\D/g, '');
    },

    /**
     * Opens the CreateClient overlay to allow the user to create a new client.
     */
    openCreateClient() {
      this.showCreateClient = true;
    },

    /**
     * Closes the CreateClient overlay without saving changes.
     */
    closeCreateClient() {
      this.showCreateClient = false;
    },

    /**
     * Navigates to the client detail page for the selected client.
     *
     * @param {string} clientId - The unique identifier of the client.
     */
    goToClientPage(clientId) {
      this.$router.push(`/client/${clientId}`);
    },
  },

  /**
   * Lifecycle hook called when the component is mounted.
   * Initiates fetching of client data.
   */
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
  justify-content: center; /* Center the buttons horizontally */
  position: absolute;
  border-radius: 30px;
  background-color: #fafafa;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  padding: 5px 3px;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  margin-bottom: 20px;
  z-index: 100;
}

.top-bar button {
  padding: 12px 24px;
  border: none;
  border-radius: 30px; /* Make the button rounded */
  background-color: #f0f0f0; /* Light grey background */
  cursor: pointer;
  margin: 0 10px;
  font-size: 16px;
  color: #333;
  transition: background-color 0.3s ease;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3); /* Add subtle shadow */
}

.top-bar button.active {
  background-color: #80cbc4; /* Active state background */
}

.top-bar button:hover {
  background-color: #e0e0e0; /* Slightly darker grey when hovered */
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
.search-form {
  flex-grow: 1;
  margin: 0 20px;
}
.search-bar input {
  width: 90%;
  padding: 10px;
  font-size: 16px;
  border: 2px solid black;
  border-radius: 30px;
  background: white;
}
.search-bar input::placeholder {
  color: black;
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

.clients-list-content{
  overflow: scroll;
  max-height: 600px;
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
.search-bar{
  width: 100%;
}
.search-bar input {
  padding: 10px;
  font-size: 16px;
  width: 300px;
}
</style>