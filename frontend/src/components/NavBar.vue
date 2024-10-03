<template>
  <div class="sidebar">
    <div
        v-for="(item, index) in menuItems"
        :key="index"
        class="menu-item"
        @click="item.action"
    >
      <i :class="item.icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        {icon: 'fa-solid fa-bell', action: this.notifyFunction}, // Icône de la cloche
        {icon: 'fa-solid fa-cart-shopping', action: this.cartFunction}, // Icône du panier
        {icon: 'fa-solid fa-inbox', action: this.inboxFunction}, // Icône de l'inbox
        {icon: 'fa-solid fa-user', action: this.profileFunction}, // Icône de l'utilisateur
      ],
    };
  },
  methods: {
    notifyFunction() {
      alert('Notification center clicked!');
    },
    cartFunction() {
      this.$router.push({name: "Sale"});
    },
    inboxFunction() {
      this.$router.push({name: "ClientSearch"});
    },
    profileFunction() {
      this.$router.push('/employee/66fdffb56790cc1514a6a267');
    }
  }
};
</script>

<style scoped>
.sidebar {
  position: fixed; /* Rendre la sidebar fixe sur le côté gauche */
  top: 0;
  left: 0;
  width: 60px;
  height: 100vh; /* Utiliser 100vh pour la hauteur complète de l'écran */
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
  overflow: hidden; /* Évite tout débordement */
}

.menu-item {
  padding: 20px 0;
}

.menu-item i {
  font-size: 24px;
  color: #000;
  cursor: pointer;
}

.menu-item i:hover {
  color: #4CAF50; /* Changement de couleur au survol */
}
</style>