new Vue({
    el:'#vue-app',
    data:{
        output:'your fav food'
    },
    methods:{
        readRefs:function(){
           console.log( this.$refs.input.value);
           console.log(this.$refs.test.innerText);
           this.output = this.$refs.input.value;
        }
    }

});