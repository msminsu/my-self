<template>
<header>
  <h1 v-on:click="changeTitle">{{title}}</h1>
</header>
</template>

<script>
  import {bus} from '../main';

    export default {
      props:{
        title:{
          type:String
        }
      },
        data(){
          return{
            title:'Vue Ninjas'
          }
        },
      methods:{
        changeTitle:function(){
          //this.title = 'Vue Wizards';
          //this.$emit('changeTitle','Vue Wizards');
          this.title = 'Vuew Wizareds dd';
          bus.$emit('titleChanged','Vue Wizards Bus');
        }
      }
    }
</script>

<style scoped>
header  {
  background: lightgreen;
  padding: 10px;
  text-align: center;
}
</style>
