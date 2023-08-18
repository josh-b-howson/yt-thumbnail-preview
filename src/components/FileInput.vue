<script setup lang="ts">
import styles from '@/assets/css/components/button.module.scss';

type Props = {
  label: string;
  // type for the `accept` attribute
  accept: HTMLInputElement['accept'];
}

withDefaults(defineProps<Props>(), {
  label: 'Add file',
});
</script>

<template>
  <label :class="styles.button">
    {{ label }}
    <input
      type="file"
    />
  </label>
</template>

<style scoped lang="scss">
input {
  display: none;
}
</style>