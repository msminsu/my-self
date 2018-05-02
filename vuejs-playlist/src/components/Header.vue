<template>
<header>
  <h1>{{title}}</h1>
</header>
</template>

<script>
    export default {
        data(){
          return{
            title:'Vue Ninjas'
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
