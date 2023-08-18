<script setup lang="ts">
</script>

<template>
  <input
    class="surface-3"
    type="text"
  />
</template>

<style scoped lang="scss">
input {
  align-self: start;
  justify-self: start;
  border-radius: var(--radius-3);
  padding: 1.6rem 1rem;
  border-color: rgba(0, 0, 0, .2);

  @media (prefers-color-scheme: dark) {
    border-color: rgba(255, 255, 255, .2);
  }

  &:focus-visible {
    outline: none;
    border-color: var(--on-surface-3);
  }
}
</style>