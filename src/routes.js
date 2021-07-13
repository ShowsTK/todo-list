import Vue from 'vue';
import VueRouter from 'vue-router';

import TodoList from './components/TodoList';
import TodoItem from './components/TodoItem';
import E404 from './components/E404';

import {store} from './store/notes';

Vue.use(VueRouter);


const routes = [
	{
		path: '',
		redirect: {name: 'notes'}
	},
	{
		name: 'notes',
		path: '/notes',
		component: TodoList,
		beforeEnter(from, to, next){
			store.dispatch('loadNotes');
			next();
		}
	},
	{
	  name: 'note',
		path: '/notes/:id',
		component: TodoItem,
    props: true
	},
  {
    path: '*',
    component: E404
  }
];

export const router = new VueRouter({
	routes,
	mode: 'history'
});
