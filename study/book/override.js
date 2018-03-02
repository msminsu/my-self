function MyParent(){
    this.property1 = "value1";
}

MyParent.prototype.method1 = function () {
    console.log("property1 = " + this.property1);
};


function MyChild(){

}

MyChild.prototype = new MyParent();

var parent1 = new MyParent();
var child1 = new MyChild();

if(parent1.constructor == MyParent){
    console.log('1. parent1는 MyParent 의 인스턴스 입니다. ');
}

if(child1.constructor == MyChild){
    console.log('2. child1는 MyChild의 인스턴스 입니다. ');

}

