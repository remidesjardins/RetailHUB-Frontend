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
          <input type="email" placeholder="Email" v-model="client.email" required />
        </div>
        <div class="form-group">
          <textarea placeholder="Adress" v-model="client.address" required></textarea>
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
        address: ''
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
      const row = JSON.stringify({
        name: name,
        email: this.client.email,
        phone: this.client.phoneNumber,
        address: this.client.address
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
  width: 400px;
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
}

.form-group {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

input, textarea {
  flex: 1;
  padding: 10px;
  border: 2px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

textarea {
  resize: none;
  height: 100px;
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
</style>