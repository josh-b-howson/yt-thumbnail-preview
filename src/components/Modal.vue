<script setup lang="ts">
import { watch } from 'vue';

const emit = defineEmits(['close'])

type Props = {
  isOpen: boolean
  resizeable?: boolean
  title: string
  bgDismiss: boolean
}

const props = withDefaults(defineProps<Props>(), {
  isOpen: false,
  resizeable: false,
  title: 'Modal',
  bgDismiss: true,
});

const handleClose = () => {
  emit('close')
}

const handleBgDismiss = () => {
  if (props.bgDismiss)
  handleClose()
}

watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    document.documentElement.style.overflow = 'hidden'
  } else {
    document.documentElement.style.overflow = 'auto'
  }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div class="modal" v-show="isOpen" @click.self="handleBgDismiss">
        <div :class="['modal-body elevation-2', resizeable && 'resizeable']">
          <header>
            <h3>{{ title }}</h3>
          </header>

          <div class="modal-content">
            <slot />
          </div>

          <footer
            class="elevation-2"
            v-if="$slots.footer"
          >
            <slot name="footer" />
          </footer>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped lang="scss">
.modal {
  --transform-close: translateY(calc(50vh - var(--gutter-x) - 1rem)) scale(0);
  --transform-open: translateY(0px) scale(1);
  position: fixed;
  top: 0;
  left: 0;
  isolation: isolate;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  width: 100%;
  max-width: 100vw;
  max-width: 100dvw;
  height: 100vh;
  height: 100dvh;
  max-height: 100vh;
  max-height: 100dvh;
  padding: var(--gutter-x);
  display: grid;
  place-items: center;
  transition: .75s ease;
  transition-property: background-color, backdrop-filter;

  .modal-body {
    position: relative;
    display: flex;
    flex-flow: column nowrap;
    transition-timing-function: inherit;
    transition-property: transform opacity;
    transition-duration: inherit;
    width: 100%;
    max-height: 100%;
    max-height: 100dvh;
    max-width: 56rem;
    height: max-content;
    overflow: hidden;
  }
  
  .modal-content {
    flex: 1 0 auto;
    display: grid;
    grid-template-columns: var(--gutter-x) minmax(0, 1fr) var(--gutter-x);

    & > :deep(*) {
      grid-column: 2;
    }
  }
}

header {
  flex: 0 0 auto;
  display: flex;
  align-items: center;
  padding: 3rem var(--gutter-x) 1rem;
}

footer {
  flex: 0 0 auto;
  grid-column: 1 / -1 !important;
  position: sticky;
  display: flex;
  align-items: center;
  justify-content: end;
  gap: 1rem;
  bottom: 0;
  min-height: 8rem;
  padding: 0 var(--gutter-x);
  border-radius: 0;
  border-inline: 0;
  border-bottom: 0;
}

.slide-up-enter-from,
.slide-up-leave-to {
  backdrop-filter: blur(0px);
  background-color: transparent;
  .modal-body {
    transform: var(--transform-close);
    opacity: 0;
  }
}

.slide-up-enter-to,
.slide-up-leave-from {
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  .modal-body {
    transform: var(--transform-open);
  }
}
</style>