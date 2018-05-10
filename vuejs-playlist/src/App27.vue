<template>
  <div>
    <form-helper>
      <!--<h2 slot="title">{{title}}</h2>
      <p slot="text">I am the paragraph text for the slot</p>-->
      <div slot="form-header">
        <h3>This is the tilte of the form</h3>
        <p>Infomation about the form</p>
      </div>
      <div slot="form-fields">
        <input type="text" placeholder="name" required>
        <input type="password" placeholder="password" required>
      </div>
      <div slot="form-controls">
        <button v-on:click="handleSubmit">Submit</button>
      </div>
    </form-helper>
  </div>

</template>

<script>
  import fromHelper from './components/fromHelper.vue'

export default {
  components:{
    'form-helper':fromHelper
  },
  data () {
    return {
      title:'i am a dynamic datea'
    }
  },
  methods:{


  }
}
</script>

<style>

</style>
