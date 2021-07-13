<!--template to show user notification about performing action-->
<template>
  <div id="notify-block">
    <slot>Done!</slot>
  </div>
</template>

<script>
  export default {
    name: "Notify"
  }
</script>

<style scoped>
  #notify-block {
    font-size: 12px;
    font-weight: 600;
    width: 100%;
    background-color: rgba(0, 250, 154, 0.54);
    padding: 5px;
    text-align: center;
  }
</style>
