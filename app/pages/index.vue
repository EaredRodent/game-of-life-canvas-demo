<template>
  <div class="x-page">
    <div class="x-draw-zone">
      <canvas ref="canvas" :width="areaSize" :height="areaSize" />
    </div>
    <div class="x-actions">
      <v-btn @click="run = !run">
        {{ run ? 'Стоп' : 'Старт' }}
      </v-btn>
    </div>
  </div>
</template>

<script>
export { default } from './index.js'
</script>

<style scoped lang="less">
  .x-page {
    height: 100%;
    display: flex;
    flex-flow: column;
  }

  .x-draw-zone {
    flex: 1 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .x-actions {
    flex: 0 0 auto;
  }
</style>
