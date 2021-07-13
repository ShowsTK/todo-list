import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    notes: [],
    nextID: 1
  },
  getters: {
    notes(state) {
      return state.notes;
    },
    notesMap(state) {
      let notesMap = {};
      for (let i = 0; i < state.notes.length; i++) {
        let note = state.notes[i];
        notesMap[note.id] = note;
      }
      return notesMap;
    },
    newNote(state) {
      let newNote = {
        id: state.nextID,
        caption: '',
        tasks: []
      };
      return newNote;
    },
    note: (state, getters) => (id) => {
      return getters.notesMap[id];
    },
    nextID(state) {
      return state.nextID;
    }
  },
  mutations: {
    loadNotes(state) {
      state.nextID = 1;
      if(localStorage.getItem('notes')) {
        try {
          state.notes = JSON.parse(localStorage.getItem('notes'));
          state.nextID = state.notes[0].id + 1;
        } catch(e) {
          localStorage.removeItem('notes');
        }
      }
    },
    addNote(state, note) {
      state.notes.unshift(note);
      state.nextID = ++state.nextID;
    },
    saveNote(state, note) {
      const pos = state.notes.findIndex((item) => item.id === note.id);
      if(pos !== -1) {
        state.notes.splice(pos, 1, note);
      }
    },
    saveNotes(state) {
      const parsedData = JSON.stringify(state.notes);
      localStorage.setItem('notes', parsedData);
    },
    removeNote(state, id) {
      const pos = state.notes.findIndex((item) => item.id === id);
      if(pos !== -1) {
        state.notes.splice(pos, 1);
      }
    }
  },
  actions: {
    loadNotes(context) {
      context.commit('loadNotes');
    },
    addNote(context, note) {
      if(note) {
        context.commit('addNote', note);
        context.commit('saveNotes');
      }
    },
    saveNote(context, note) {
      if(note) {
        context.commit('saveNote', note);
        context.commit('saveNotes');
      }
    },
    saveNotes(context) {
      context.commit('saveNotes');
    },
    removeNote(context, index) {
      context.commit('removeNote', index);
      context.commit('saveNotes');
    }
  },
  strict: process.env.NODE_ENV === 'production'
})
