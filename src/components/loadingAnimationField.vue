<template>
  <div v-bind:class="[ animation ? 'loadingFadeIn' : 'loadingFadeOff' ]">
    <div class="d-flex align-items-center justify-content-center loading-box">
      <div class="text-center">
        <span>Loading, please wait...</span>
        <br />
        <icon scale="3" name="spinner" pulse></icon>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'loadingAnimation',
    props: ['animation']
  }
</script>

<style scoped>
  .loadingFadeIn,
  .loadingFadeOut {
    position: absolute;
    left: 0px;
    top: 0px;
    width: 100%;
    height: 100%;
    transition: 0.5s;
  }
  .loading-box {
    width: 100%;
    height: 100%;
    display: block;
  }
  .loadingFadeIn {
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0.9);
    display: block;
  }
  .loadingFadeOff {
    z-index: 1000;
    background-color: rgba(255, 255, 255, 0);
    display: none;
  }
  .loadingFadeIn>div>div>*,
  .loadingFadeOff>div>div>* {
    margin: 15px;
  }
  .loadingFadeIn>div>div>span,
  .loadingFadeOff>div>div>span {
    font-weight: bold;
    font-size: 20px;
  }
</style>
