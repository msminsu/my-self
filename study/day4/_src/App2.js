class App2{
    constructor(){
        console.log('im App!!!');
        //this.loadData();
        let user = null;
    }

    loadData(_user){

        this.user = _user;

        $.ajax({url:'https://api.github.com/users/'+_user})//hansangho
            .done((da)=>{

                $.ajax({url:'https://api.github.com/users/'+_user+'/followers'})//hansangho
                    .done((data)=>{
                      this.tmpl(da,data);
                    })
                    .fail((xhr)=>{
                        console.log('user not found~~!!')
                    });
            })
            .fail((xhr)=>{
                console.log('user not found~~!!')
            })
    }

    draw(_data){
        const userInfoTmpl = this.tmpl(_data);

        $('.con').html(userInfoTmpl);
    }

    tmpl(_data, _data2){
console.log(_data2.length);
        return `
        <div class="sample">
            <h1>${_data.login}'s Info</h1>
            <img src="${_data.avatar_url}" alt="사진">
           <h2>name:${_data.name}</h2>
            <p>bio:${_data.bio}</p>
            <p>company:${_data.company}</p>
            <p>github: <a href="${_data.html_url}">${_data.html_url}</a></p>
            <ul>
            
       
            </ul>
        </div>`;
    }

    follower(_user){
        $.ajax({url:'https://api.github.com/users/'+_user+'/followers'})//hansangho
            .done((data)=>{
                console.log(data);
            })
            .fail((xhr)=>{
                console.log('user not found~~!!')
            });
    }
}




$(document).ready(function(){
    var ap = new App2();
    $('.btn').on('click',function(e){
        var _user = $('input').val();
        ap.loadData('demoon84');
        return false;
    });
});
