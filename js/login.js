(function(){
    document.addEventListener('keydown', function(e){
      const keyCode = e.keyCode;

      if(keyCode == 13){ // Enter key
        login();
      }
    })
})();

async function login(){

    let userID = $("#login__id").val();
    let userPW = $("#login__pw").val();

    if(userID === "" || userPW === ""){
        alert("모두 입력해주세요.")
        return;
    }else{
        let userData ={
            userId : userID,
            password: userPW
        }

        let response = await $.ajax({
            type: 'post',
            url : `http://localhost:8080/users/logins`,
            contentType : 'application/json',
            data : JSON.stringify(userData),
            beforeSend:()=>{
                $("#loading__container").attr("style","display:inline-block;");
                $("#login__button").attr("disabled",true);
            },
            error:()=>{
                alert("로그인 에러");
                $("#login__button").attr("disabled",false);
            },
            complete:()=>{
                $("#loading__container").attr("style","display:none;");
            }
        })

        if(response.message != null){
            $("#login__button").attr("disabled",false);
            alert(response.message)
            return;
        }
    
        window.location.href = "/";
    }

}

function gosignup() {
    location.href='signup'
}