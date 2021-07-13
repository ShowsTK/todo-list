<!--Dialog for confirmation action-->
<template>
  <div class="modal is-active">
    <div class="modal-background">
      <div class="modal-box">
        <div class="modal-content">
          <slot>Are you sure?</slot>
        </div>
        <div class="modal-buttons">
          <button class="btn btn-modal-yes"
                  @click.prevent="confirmYes">
            Yes
          </button>
          <button class="btn btn-modal-no"
                  @click.prevent="confirmNo">
            No
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "ConfirmBox",
    methods: {
      //generates event for parent if "yes" result is
      confirmYes() {
        this.$emit('confirm-yes');
      },
      //generates event for parent if "no" result is
      confirmNo() {
        this.$emit('confirm-no');
      }
    }
  }
</script>

<style scoped lang="scss">
  @import "../styles/confirm";
</style>
