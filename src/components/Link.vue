<script setup lang="ts">
import { RouteLocationRaw } from 'vue-router'

type Props = {
  to: RouteLocationRaw,
}

defineProps<Props>()
</script>

<template>
  <RouterLink class="link" :to="to">
    <slot />
  </RouterLink>
</template>

<style scoped lang="scss">
.link {
  color: var(--on-surface-1);
  font-weight: bold;
}
</style>
