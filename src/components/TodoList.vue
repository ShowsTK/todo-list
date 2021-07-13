<!--template for notes list on main page-->
<template>
  <main>
    <section class="info">
      <h3 class="h3">
        <span class="info-item">You have <em>{{notes.length}}</em> notes,</span>
        <span class="info-item"><em>{{countCompletedTasks}}</em> completed tasks,</span>
        <span class="info-item"><em>{{countIncompleteTasks}}</em> incomplete tasks</span>
      </h3>
    </section>
    <section class="start-controls">
      <router-link tag="button"
                             :to="{name: 'note',
                                   params: {id: nextID, newItem: true}}"
                             class="btn">
        Create new note
      </router-link>
    </section>
    <section class="list-notes">
    <ul>
      <li v-for="note in notes"
          :key="note.id">
        <div class="data">
          <div class="caption">
            {{note.caption}}
          </div>
          <p v-for="(task, index) in note.tasks"
             v-if="index < countShowedTasks"
             :key="index">
            <input type="checkbox"
                   disabled
                   :checked="task.done"
                   title="Completed/incomplete">
            <span :class="{done: task.done}">
              {{task.description}}
            </span>
          </p>
          <p class="total"
             v-if="note.tasks.length > countShowedTasks">
            total tasks: {{note.tasks.length}}
          </p>
        </div>
        <div class="buttons">
          <router-link tag="button"
                       :to="{name: 'note',
                             params: {id: note.id}}"
                       class="btn">
            Edit
          </router-link>
          <button @click.prevent="callConfirmBox(note.id)"
                  class="btn">
            Delete
          </button>
        </div>
      </li>
    </ul>
    <confirm-box v-if="isConfirmBox"
                  @confirm-no="confirmBoxNo"
                  @confirm-yes="confirmBoxYes(delItemId)">
    </confirm-box>
    </section>
  </main>
</template>

<script>
  import ConfirmBox from "./Confirm";
  import {mapGetters} from 'vuex';
  import {mapActions} from 'vuex';

  export default {
    name: "TodoList",
    components: {'confirm-box': ConfirmBox},
    data() {
      return {
        isConfirmBox: false, //show/hide confirmation dialog box
        delItemId: 0, //identifier item to delete
        countShowedTasks: 3 //property for count of showed tasks for every note
      }
    },
    computed: {
      ...mapGetters(['notes', 'nextID']),
      countCompletedTasks() {
        return this.countTasksStatus(true);
      },
      countIncompleteTasks() {
        return this.countTasksStatus(false);
      }
    },
    methods: {
      ...mapActions({
        remove: 'removeNote'
      }),
      countTasksStatus(isStatus) {
        return this.notes.reduce((sum, item) => sum + (item.tasks.filter((taskItem) => taskItem.done === isStatus).length), 0);
      },
      callConfirmBox(id) {
        this.delItemId = id;
        this.isConfirmBox = true
      },
      confirmBoxToggle() {
        this.isConfirmBox = !this.isConfirmBox;
      },
      confirmBoxNo() {
        this.isConfirmBox = false;
      },
      confirmBoxYes(id) {
        this.remove(id);
        this.confirmBoxToggle();
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "../styles/todolist";
</style>
