<template>
  <div>
   <!-- <form-one></form-one>
    <form-two></form-two>-->
    <keep-alive>
      <component v-bind:is="component"></component>
    </keep-alive>
    <button v-on:click="component='form-one'">Show form one</button>
    <button v-on:click="component='form-two'">Show form two</button>
  </div>

</template>

<script>
  import formOne  from './formcom/formOne.vue';
  import formTwo  from './formcom/formTwo.vue';

export default {
  components:{
    'form-one': formOne,
    'form-two': formTwo
  },
  data () {
    return {
      component:'form-two'
    }
  },
  methods:{

  }
}
</script>

<style>

</style>
