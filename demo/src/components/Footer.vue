<script setup lang="ts">
import { isDark, toggleDark } from '~/logics'
</script>

<template>
  <nav class="text-xl mt-6">
    <router-link class="icon-btn mx-2" to="/">
      <carbon-campsite />
    </router-link>

    <a class="icon-btn mx-2" @click="toggleDark">
      <carbon-moon v-if="isDark" />
      <carbon-sun v-else />
    </a>

    <a
      class="icon-btn mx-2"
      rel="noreferrer"
      href="https://github.com/johncampionjr/vee-validate-devextreme"
      target="_blank"
      title="GitHub"
    >
      <carbon-logo-github />
    </a>
  </nav>
</template>
