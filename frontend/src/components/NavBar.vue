<template>
  <div class="sidebar">
    <div v-for="(item, index) in menuItems" :key="index" class="menu-item">
      <i :class="item.icon"></i>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { icon: 'fa-solid fa-bell' }, // Icône de la cloche
        { icon: 'fa-solid fa-cart-shopping' }, // Icône du panier
        { icon: 'fas fa-inbox' }, // Icône de l'enveloppe
        { icon: 'fas fa-user' }, // Icône de l'utilisateur
      ],
    };
  },
};
</script>

<style scoped>
.sidebar {
  width: 60px;
  height: 100vh;
  background-color: #f0f0f0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  padding: 20px 0;
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