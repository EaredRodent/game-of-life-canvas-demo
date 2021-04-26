<template>
  <div class="x-page">
    <div class="x-draw-zone">
      <span class="x-fps">FPS: {{ fps }}</span>
      <canvas ref="canvas" :width="areaSize" :height="areaSize" />
    </div>
    <div class="x-actions">
      <v-btn outlined class="x-button" :color="run ? 'error' : 'primary'" @click="run = !run">
        {{ run ? 'Стоп' : 'Старт' }}
      </v-btn>
      <v-slider
        v-model="cellsUpdateDelay"
        :label="`Задержка`"
        class="x-slider"
        min="17"
        max="1000"
        thumb-label="always"
      />
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
    position: relative;
    flex: 1 1 0;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .x-fps {
    position: absolute;
    font-size: 20px;
    top: 20px;
    left: 20px;
  }

  .x-actions {
    flex: 0 0 auto;
    padding: 10px;
    display: flex;
    justify-content: center;
  }

  .x-button {
    flex: 0 0 100px;
  }

  .x-slider {
    margin-left: 20px;
    flex: 0 0 300px;
  }
</style>
