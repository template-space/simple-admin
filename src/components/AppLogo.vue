<template>
  <div class="size-full shrink-0">
    <div class="flex size-full items-center justify-center rounded bg-primary/10">
      {{ APP_NAME.slice(0, 1) }}
    </div>
  </div>
</template>
<script setup lang="ts">
const APP_NAME = import.meta.env.VITE_APP_NAME
</script>
