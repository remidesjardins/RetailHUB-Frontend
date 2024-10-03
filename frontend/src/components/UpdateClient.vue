<template>
  <div class="overlay">
    <div class="overlay-content">
      <button class="close-button" @click="closeOverlay">✖</button>
      <h1>Modify Client</h1>
      <form @submit.prevent="updateClient">
        <div class="form-group">
          <input type="text" placeholder="Last Name" v-model="client.name" required/>
        </div>

        <div class="form-group">
          <input type="text" placeholder="Phone Number" v-model="client.phone" required />
          <input type="email" placeholder="Email" v-model="client.email" required />
        </div>

        <div class="form-group">
          <textarea placeholder="Adress" v-model="client.address" required></textarea>
        </div>
        <button type="submit" class="update-client-button" @click="updateClient">Modify client</button>
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
  padding: 20px;
  border-radius: 20px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>