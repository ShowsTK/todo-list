<!--template for one item (note with tasks).
It's used in page for addition and changing note and its tasks
It has parameters:
id - note identifier,
newItem - logical value of page mode (addition/correction)-->
<template>
  <form>
    <transition name="fade">
      <notify-block v-show="isNotify"></notify-block>
    </transition>
    <div class="data">
      <input type="text"
             class="data__caption-note"
             v-model.trim="noteLocal.caption"
             @input="isChanged = true"
             placeholder="Note description"
      >
      <p class="data__task" v-for="(task, index) in noteLocal.tasks"
         :key="index">
        <input type="checkbox"
               class="data__caption-status"
               v-model="task.done"
               @change="isChanged = true"
               title="Completed/incomplete">
        <input type="text"
               class="data__caption-task"
               v-model.trim="task.description"
               @input="isChanged = true"
               placeholder="Task description">
        <button class="btn btn__remove-task"
                @click.prevent="removeTask(index)">
          Remove
        </button>
      </p>
    </div>
    <div class="buttons">
      <button class="btn"
              @click.prevent="addTask">
        Add task
      </button>
      <button class="btn"
              @click.prevent="addNote(noteLocal)"
              v-if="newItem"
              :disabled="!isChanged">
        Add
      </button>
      <button class="btn"
              @click.prevent="saveNote(noteLocal)"
              v-if="!newItem"
              :disabled="!isChanged">
        Save
      </button>
      <button class="btn"
              @click.prevent="callConfirmBox('delete')"
              v-if="!newItem">
        Delete
      </button>
      <button class="btn"
              @click.prevent="callConfirmBox('cancelEdit')"
              v-if="!newItem">
        Cancel edition
      </button>
      <button class="btn"
              @click.prevent="cancelLastChanges"
              v-if="!newItem"
              :disabled="!isChanged">
        Cancel changes
      </button>
      <button class="btn"
              @click.prevent="revertCanceledChanges"
              v-if="!newItem"
              :disabled="!isCanceledChanges">
        Revert last changes
      </button>
      <router-link :to="{name: 'notes'}"
                   tag="button"
                   class="btn"
                   :disabled="isChanged && !newItem">
        {{newItem ? "Close/Cancel" : "Return to list"}}
      </router-link>
    </div>
    <confirm-box v-if="isConfirmBox"
             @confirm-no="confirmBoxNo"
             @confirm-yes="confirmBoxYes">
    </confirm-box>
  </form>
</template>

<script>
  import ConfirmBox from './Confirm';
  import Notify from './Notify';
  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  export default {
    name: 'TodoItem',
    props: {
      id: Number,
      newItem: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'confirm-box': ConfirmBox,
      'notify-block': Notify
    },
    data() {
      return {
        noteLocal: {}, //current object to change data
        noteStartLocal: {}, //object to save initial state of item
        noteLastSavedLocal: {}, //object to save item state after even saving
        noteCanceledChangesLocal: {}, //object to save item state after even cancelling changes
        isChanged: false, //changing data status
        isSaved: false, //saving changing status
        isCanceledChanges: false, //cancelling of changes data status
        isConfirmBox: false, //show/hide confirmation dialog box
        isNotify: false, //show/hide user notification
        actionToConfirm: '' //"cancelEditMode"/"delete" values to know what action confirm is
      }
    },
    mounted() {
      this.noteLocal = this.cloneObject(this.note);
      if (!this.newItem) {
        this.noteStartLocal = this.cloneObject(this.note);
      }
      document.querySelector(".data__caption-note").focus();
    },

    computed: {
      ...mapGetters(['newNote']),
        note() {
          if(this.newItem) {
            return this.newNote;
          }
          return this.$store.getters['note'](this.id);
        }
    },
    methods: {
      ...mapActions({
        add: 'addNote',
        saveOne: 'saveNote',
        remove: 'removeNote'
      }),
      showNotify() {
        this.isNotify = true;
        setTimeout(() => {this.isNotify = false}, 1500);
      },
      addNote(noteLocal) {
        if(this.add(noteLocal)) {
          this.showNotify();
          this.isChanged = false;
          this.noteLocal = this.cloneObject(this.newNote);
          this.$router.push({name: 'note', params: {id: this.noteLocal.id, newItem: true}});
        }
      },
      saveNote(noteLocal) {
        if(this.saveOne(noteLocal)) {
          this.isChanged = false;
          this.isSaved = true;
          this.noteLastSavedLocal = this.cloneObject(this.noteLocal);
          this.showNotify();
        }
      },
      addTask() {
        this.noteLocal.tasks.unshift({description: '', done: false});
        this.isChanged = true;
        setTimeout(() => (document.querySelector(".data__caption-task").focus()), 1);
      },
      removeTask(index) {
        this.noteLocal.tasks.splice(index, 1);
        this.isChanged = true;
      },
      cancelLastChanges() {
        this.noteCanceledChangesLocal = this.cloneObject(this.noteLocal);
        if(this.isSaved) {
          this.noteLocal = this.cloneObject(this.noteLastSavedLocal);
        } else {
          this.noteLocal = this.cloneObject(this.noteStartLocal);
        }
        this.isChanged = false;
        this.isCanceledChanges = true;
      },
      revertCanceledChanges() {
        this.noteLocal = this.cloneObject(this.noteCanceledChangesLocal);
        this.isChanged = true;
        this.isCanceledChanges = false;
      },
      cloneObject(obj) {
        return JSON.parse(JSON.stringify(obj));
      },
      callConfirmBox(action) {
        this.actionToConfirm = action;
        this.isConfirmBox = true;
      },
      confirmBoxToggle() {
        this.isConfirmBox = !this.isConfirmBox;
      },
      confirmBoxNo() {
        this.isConfirmBox = false;
      },
      confirmBoxYes() {
        switch (this.actionToConfirm) {
          case "delete":
            if(this.remove(this.id)) {
              this.confirmBoxToggle();
              this.$router.go(-1);
              break;
            }
          case "cancelEdit":
            if(this.saveNote(this.noteStartLocal)) {
              this.confirmBoxToggle();
              this.$router.go(-1);
              break;
            }
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/todoitem";
</style>
