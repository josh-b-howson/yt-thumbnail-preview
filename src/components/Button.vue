<script setup lang="ts">
import styles from '@/assets/css/components/button.module.scss';
</script>

<template>
  <button :class="styles.button">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
</style>