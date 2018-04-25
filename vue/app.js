new Vue({
   el:'#vue-app',
   data:{
       name:'Shaun',
       job:'Ninja',
       website:'http://naver.com',
       websiteTag:'<a href="http://naver.com">네이버</a>'
   },
    methods:{
       greet:function(time){
           return "Good "+ time +' '+ this.job;
       }
    }
});


new Vue({
    el:'#vue-app2',
    data:{
        age:23,
        x:0,
        y:0
    },
    methods:{
     add:function(inc){
         this.age+=inc;
     },
        subtract:function(dec){
         this.age-=dec;
     },
        updateXY:function(event){
         this.x = event.offsetX;
         this.y = event.offsetY;
        }
    }
});


new Vue({
    el:'#vue-app3',
    data:{
        age:23,
        x:0,
        y:0
    },
    methods:{
        add:function(inc){
            this.age+=inc;
        },
        subtract:function(dec){
            this.age-=dec;
        },
        updateXY:function(event){
            this.x = event.offsetX;
            this.y = event.offsetY;
        },
        click:function(){
            alert('You clicked me')
        }
    }
});

new Vue({
    el:'#vue-app7',
    data:{

    },
    methods:{
        logName:function(){
            console.log('name enter')
        },
        logAge:function(){
            console.log('Age enter')
        }
    }
});


new Vue({
    el:'#vue-app8',
    data:{
        name:'',
        age:''
    },
    methods:{
        logName:function(){
            console.log('name enter')
        },
        logAge:function(){
            console.log('Age enter')
        }
    }
});



new Vue({
    el:'#vue-app9',
    data:{
        age:20,
        a:0,
        b:0

    },
    methods:{
       /* addToA: function(){
            console.log('addToA');
            return this.a + this.age;
        },
        addToB: function(){
            console.log('addToB');
            return this.b + this.age;
        }*/
    },
    computed:{
        addToA: function(){
            console.log('addToA');
            return this.a + this.age;
        },
        addToB: function(){
            console.log('addToB');
            return this.b + this.age;
        }
    }
});


new Vue({
    el:'#vue-app10',
    data:{
        available:false,
        nearby:false
    },
    methods:{

    },
    computed:{
        compClasses: function(){
            return {
                available: this.available,
                nearby: this.nearby
            }
        }
    }
});

new Vue({
    el:'#vue-app11',
    data:{
        error: false,
        success: false
    },
    methods:{

    },
    computed:{

    }
});



new Vue({
    el:'#vue-app12',
    data:{
        characters: ['Mario','Luigi','Yoshi','Bowser'],
        ninjas:[
            {name:'Ryu', age:25},
            {name:'Yoshi', age:35},
            {name:'Ken', age:55},
        ]
    },
    methods:{

    },
    computed:{

    }
});


new Vue({
    el:'#vue-app10000',
    data:{

    },
    methods:{

    },
    computed:{

    }
});

new Vue({
    el:'#vue-app10000',
    data:{

    },
    methods:{

    },
    computed:{

    }
});