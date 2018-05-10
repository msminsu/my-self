<template>
<div id="ninjas">
  <ul>
    <p>{{ninjas}}</p>
    <li v-for="ninja in ninjas" v-on:click="ninja.show = !ninja.show" >
      <h2>{{ninja.name}}</h2>
      <h3 v-show="ninja.show">{{ninja.speciality}}</h3>
    </li>
  </ul>
  <button v-on:click="deleteNinja">Delete ninja</button>
</div>
</template>

<script>
    export default {
      props:
        //['ninjas']
        {ninjas:{
          type:Array,
            required:true
          }}
        ,
     data(){
       return {
        /* ninjas:[
           {name:'Ryu',speciality:'VueComponents', show:false},
           {name:'Crystal',speciality:'HTML Wizardry', show:false},
           {name:'Hitoshi',speciality:'Click Events', show:false},
           {name:'Tango',speciality:'Conditionals', show:false},
           {name:'Kami',speciality:'Webpack', show:false},
           {name:'Yoshi',speciality:'Data Diggin', show:false},
         ]*/
       }
     },
      methods:{
        deleteNinja:function(){
         this.ninjas.pop();
        }
      },
      // lifecycle hook
      beforeCreate(){
        alert("beforeCreate");
      },
      created(){
        alert("Created");
      },
      beforeMount(){
        alert('beforeMount');
      },
      mounted(){
        alert('mounted');
      },
      beforeUpdate(){
        alert('beforeUpdate');
      },
      updated(){
        alert('updated');
      }

    }
</script>

<style scoped>
#ninjas{
  width: 100%;
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
  box-sizing:border-box;
}
  ul{
    display: flex;
    flex-wrap:wrap;
    list-style-type: none;
    padding: 0;
  }

  li{
    flex-grow:1;
    flex-basis: 300px;
    text-align: center;
    padding: 30px;
    border: 1px solid #222;
    margin: 10px;
  }
</style>
