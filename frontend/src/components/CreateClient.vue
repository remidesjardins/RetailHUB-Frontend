<template>
  <div class="overlay-create-client">
    <div class="overlay-content">
      <button class="close-button" @click="closeOverlay">✖</button>
      <h1>Create Client</h1>
      <form @submit.prevent="submitForm">
        <div class="form-group">
          <input type="text" placeholder="Last Name" v-model="client.lastName" required />
          <input type="text" placeholder="First Name" v-model="client.firstName" required />
        </div>
        <div class="form-group">
          <input type="text" placeholder="Phone Number" v-model="client.phoneNumber" required />
          <input type="email" placeholder="Email" v-model="client.email" class="full-width" required />
        </div>
        <div class="form-group form-group-address">
          <input type="text" placeholder="Street" v-model="client.addressLine1" required />
          <input type="text" placeholder="City" v-model="client.city" required />
          <input type="text" placeholder="State" v-model="client.state" required />
          <input type="text" placeholder="Postal Code" v-model="client.postalCode" required />
          <input type="text" placeholder="Country" v-model="client.country" class="full-width" required />
        </div>
        <button type="submit" class="create-client-button" @click="createClient">Create client</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      client: {
        lastName: '',
        firstName: '',
        phoneNumber: '',
        email: '',
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: ''
      }
    };
  },
  methods: {
    closeOverlay() {
      this.$emit('close');
    },
    submitForm() {
      // Logique de création de client (envoyer les données)
      console.log(this.client);
    },
    createClient() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const name = this.client.firstName + " " + this.client.lastName;
      const fullAddress = `${this.client.addressLine1}, ${this.client.city}, ${this.client.state}, ${this.client.postalCode}, ${this.client.country}`;

      const row = JSON.stringify({
        name: name,
        email: this.client.email,
        phone: this.client.phoneNumber,
        address: fullAddress // Combine all address fields into one string
      });

      const requestOptions = {
        headers: myHeaders,
        method: "POST",
        body: row,
        redirect: "follow"
      };

      fetch("https://com.servhub.fr/api/customers/", requestOptions)
          .then((response) => response.json())
          .then((result) => console.log(result))
          .catch((error) => console.error(error));

      this.$emit('close');
    },
  }
};
</script>

<style scoped>
.overlay-create-client {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background-color: white;
  padding: 20px;
  border-radius: 10px;
  width: 450px;
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: transparent;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 20px;
}

input, textarea {
  width: 100%;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

.create-client-button {
  width: 100%;
  padding: 10px;
  background-color: #a9c7c5;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  color: white;
  font-weight: bold;
}

.create-client-button:hover {
  background-color: #88b3b1;
}

/* Style for address input fields */
.form-group-address {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

input {
  box-sizing: border-box;
}

/* Making sure the full width inputs (email, etc.) stretch the whole width */
.full-width {
  grid-column: span 2;
}
</style>