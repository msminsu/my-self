<template>
  <div>
<!-- <add-blog> </add-blog>-->
    <!--<show-blogs></show-blogs>-->
    <!--<list-blogs></list-blogs>-->
<app-header></app-header>
    <router-view></router-view>
  </div>
</template>

<script>
import addBlog from './blogs/addBlog';
import showBlogs from './blogs/showBlogs';
import listBlogs from './blogs/listBlogs';
import header from './blogs/header';

export default {
  components:{
    'add-blog':addBlog,
    'show-blogs':showBlogs,
    'list-blogs':listBlogs,
    'app-header':header
  },

  data () {
    return {

    }
  },
  methods:{

  }
}
</script>

<style>
body {margin: 0;
  font-family: 'Nouto SemiBold';
}
</style>
