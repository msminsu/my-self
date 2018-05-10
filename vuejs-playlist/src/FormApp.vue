<template>
  <div>
    <!--<form-one></form-one>-->
    <component v-bind:is="components"></component>
    <!--<form-two></form-two>-->
    <button v-on:clock="component='form-one'">Show form one</button>
    <button v-on:clock="component='form-two'">Show form two</button>
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
      components:'form-one'
    }
  },
  methods:{

  }
}
</script>

<style>

</style>
