
var students =[];

students.push({이름 : '철수0', 국어: 80, 수학:90, 영어: 80, 과학: 90});
students.push({이름 : '철수1', 국어: 81, 수학:91, 영어: 81, 과학: 91});
students.push({이름 : '철수2', 국어: 82, 수학:92, 영어: 82, 과학: 92});
students.push({이름 : '철수3', 국어: 83, 수학:93, 영어: 83, 과학: 93});
students.push({이름 : '철수4', 국어: 84, 수학:94, 영어: 84, 과학: 94});
students.push({이름 : '철수5', 국어: 85, 수학:95, 영어: 85, 과학: 95});
students.push({이름 : '철수6', 국어: 86, 수학:96, 영어: 86, 과학: 96});
students.push({이름 : '철수7', 국어: 87, 수학:97, 영어: 87, 과학: 97});
students.push({이름 : '철수8', 국어: 88, 수학:98, 영어: 88, 과학: 98});
students.push({이름 : '철수9', 국어: 89, 수학:99, 영어: 89, 과학: 99});

var output = '이름\t총합 \t평균\n';
for( var i = 0; i< students.length; i++){
    with(students[i]){
        var sumAll = 국어 + 수학+영어+과학 ;
        var average = sumAll/4;

        output += 이름 +"\t"+sumAll +"\t"+average +"\n";
    }
}

console.log(output);