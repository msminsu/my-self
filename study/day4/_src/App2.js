class App2{
    constructor(){
        console.log('im App!!!');
        let user = null;
    }

    loadData(_user){

        $.ajax({url:'https://api.github.com/users/'+_user})
            .done((data)=>{
                $.ajax({url:'https://api.github.com/users/'+_user+'/followers'})
                    .done((data2)=>{
                        if(data2.length != 0) {
                            this.draw(data, data2);
                        }else{
                            this.draw(data,null);
                        }
                    })
                    .fail((xhr)=>{
                        console.log('user not found~~!!');
                        return false;
                    });
            })
            .fail((xhr)=>{
                alert('존재하지 않는 id 입니다.');
                $('input').val('');
                return false;
            })
    }

    draw(_data,_data2){
        const userInfoTmpl = this.tmpl(_data,_data2);
        $('.con').html(userInfoTmpl);
    }

    tmpl(_data, _data2){

        // let _list = '';

/*        if(_data2 != null){
            for(let value of _data2){
                _list += '<li><a href="'+value.url+'"><img src="'+value.avatar_url+'"  width="50px" height="50px" alt="">'+value.login+'</a></li>'
            }
            /!*for( let i =0; i < _data2.length; i++){
                _list += '<li><a href="'+_data2[i].url+'"><img src="'+_data2[i].avatar_url+'"  width="50px" height="50px" alt="">'+_data2[i].login+'</a></li>'
            }*!/
        }*/

        return `
        <div class="sample">
            <h1>${_data.login}'s Info</h1>
            <img src="${_data.avatar_url}" width="100px" height="100px" alt="사진">
           <h2>name:${_data.name}</h2>
            <p>bio:${_data.bio}</p>
            <p>company:${_data.company}</p>
            <p>github: <a href="${_data.html_url}">${_data.html_url}</a></p>
            ${_data2 ? `<ul>${this.followers(_data2)}</ul>` : '<p>아직 followers 가 없습니다 </p>'}
        </div>`;
    }

    followers(_data2){
        let _list='';
        if(_data2 != null){
            for(let value of _data2){
                _list += '<li><a href="'+value.url+'"><img src="'+value.avatar_url+'"  width="50px" height="50px" alt="">'+value.login+'</a></li>'
            }
            /*for( let i =0; i < _data2.length; i++){
                _list += '<li><a href="'+_data2[i].url+'"><img src="'+_data2[i].avatar_url+'"  width="50px" height="50px" alt="">'+_data2[i].login+'</a></li>'
            }*/
        }
        return _list;
    }

}




$(document).ready(function(){
    var ap = new App2();
    $('.btn').on('click',function(e){
        var _user = $('input').val();
        ap.loadData(_user);
        return false;
    });
});
