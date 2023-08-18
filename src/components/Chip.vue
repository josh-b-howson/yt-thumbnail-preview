<script setup lang="ts">
type Props = {
  active: boolean
}

defineProps<Props>();
</script>

<template>
  <button :class="['chip', active && 'active']">
    <slot></slot>
  </button>
</template>

<style scoped lang="scss">
.chip {
  border-radius: var(--radius-4);
  background-color: var(--bg-surface-3);
  color: var(--on-surface-3);
  padding: .5em .8em;
  font-size: 1.4rem;
  border: none;
  transition: transform 75ms ease;

  &:active {
    transform: scale(0.96);
  }

  &.active {
    background-color: var(--on-surface-3);
    color: var(--bg-surface-3);
  }
}
</style>