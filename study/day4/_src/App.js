class App{
    constructor(){
        console.log('im App!!!');
        this.loadData();
    }

    loadData(){
        $.ajax({url:'https://api.github.com/users/hansangho'})
            .done((data)=>{
                this.draw(data);
            })
            .fail((xhr)=>{
                console.log('user not found~~!!')
            })
    }

    draw(_data){
        const userInfoTmpl = this.tmpl(_data);

        $('.con').html(userInfoTmpl);
    }

    tmpl(_data){
        return `
        <div class="sample">
            <h1>${_data.login}'s Info</h1>
            <img src="${_data.avatar_url}" alt="사진">
           <h2>name:${_data.name}</h2>
            <p>bio:${_data.bio}</p>
            <p>company:${_data.company}</p>
            <p>github:${_data.html_url}</p>
        </div>`;
    }
}


new App();