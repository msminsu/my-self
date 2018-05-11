import Vue from 'vue';
import App from './AppBlog.vue';
import VueResource from 'vue-resource';
import VueRouter from 'vue-router';
import Routes from './router';

export const bus = new Vue();

Vue.use(VueResource);
Vue.use(VueRouter);

const router = new VueRouter({
  routes: Routes,
  mode:'history'
});

//filters
Vue.filter('to-uppercase',function(value){
  return value.toUpperCase();
});
Vue.filter('snippet',function(value){
  return value.slice(0, 100) + '...';
});
// custom directives
//move to showBlogs
/*Vue.directive('rainbow',{
  bind(el,binding,vnode){
    el.style.color = "#"+Math.random().toString(16).slice(2,8);
  }
});*/

Vue.directive('theme',{
  bind(el,binding,vnode){
    if(binding.value == 'wide'){
      el.style.maxWidth = "1200px";
    }else if(binding.value=="narrow"){
      el.style.maxWidth = "560px";
    }

    if(binding.arg=='column'){
      el.style.background='#ddd';
      el.style.padding = '20px';
    }

  }
});

new Vue({
  el: '#app',
  render: h => h(App),
  router:router
});
