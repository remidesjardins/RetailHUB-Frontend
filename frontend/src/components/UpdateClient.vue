<template>
  <div class="overlay">
    <div class="overlay-content">
      <button class="close-button" @click="closeOverlay">✖</button>
      <h1>Modify Client</h1>
      <form @submit.prevent="updateClient">
        <div class="form-group">
          <label for="name">Last Name</label>
          <input type="text" id="name" v-model="client.name" required/>
        </div>

        <div class="form-group form-inline">
          <div>
            <label for="phone">Phone Number</label>
            <input type="text" id="phone" v-model="client.phone" required />
          </div>
          <div>
            <label for="email">Email</label>
            <input type="email" id="email" v-model="client.email" required />
          </div>
        </div>

        <div class="form-group">
          <label for="address">Address</label>
          <textarea id="address" placeholder="Address" v-model="client.address" required></textarea>
        </div>

        <button type="submit" class="update-client-button">Modify Client</button>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    client: undefined,  // Les données reçues du parent
  },
  methods: {
    closeOverlay() {
      this.$emit('close');
    },
    updateClient() {
      const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      const row = JSON.stringify({
        name: this.client.name,
        email: this.client.email,
        phone: this.client.phone,
        address: this.client.address
      });

      const requestOptions = {
        headers: myHeaders,
        method: "PUT",
        body: row,
        redirect: "follow"
      };
      fetch(`https://com.servhub.fr/api/customers/${this.client._id}`, requestOptions)
          .then((response) => {
            response.json();
            console.log("Response:", response.body);
          })
          .then((result) => {
            console.log(result);
            this.closeOverlayWithData()
          })
          .catch((error) => console.error(error));
    },
    closeOverlayWithData() {
      this.$emit('close-data', this.client);
    },
  },
};

</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.overlay-content {
  background: white;
  padding: 30px;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

h1 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 25px;
  font-size: 16px;
}

.form-inline {
  display: flex;
  justify-content: space-between;
  gap: 10px;
}

.form-inline div {
  flex: 1;
}

.form-group textarea {
  resize: none;
  height: 80px;
}

.update-client-button {
  width: 100%;
  padding: 10px;
  background-color: #4CAF50;
  border: none;
  color: white;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s ease;
}

.update-client-button:hover {
  background-color: #45a049;
}
</style>