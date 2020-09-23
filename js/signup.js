let signupInfo = {

    emailFlag:false,
    idFlag : false,
    userID : "",
    email   : ""

};

$(document).ready(function(){

    $('.ui.dropdown').dropdown()
        
})


async function signup(){

    const $password      = $("#signup__password").val();
    const $passwordCheck = $("#signup__password-check").val();
    const $name          = $("#signup__name").val();

    if(signupInfo.idFlag === false){
        alert("아이디를 설정해주세요.")
        return;
    }else if(signupInfo.emailFlag === false){
        alert("이메일을 설정해주세요.")
        return;
    }else if($password != $passwordCheck){
        alert("비밀번호가 일치하지 않습니다.");
    }else{
        
        const userData = {
            userId : signupInfo.userID,
            password : $password,
            name : $name,
            email : signupInfo.email 
        }

        let response = await $.ajax({
            type: 'post',
            url : `http://localhost:8080/users/signups`,
            contentType : 'application/json',
            data : JSON.stringify(userData),
            beforeSend:()=>{
                $("#loading__container").attr("style","display:inline-block;");
                $("#signup__button").attr("disabled",true);
            },
            error:()=>{
                $("#signup__button").attr("disabled",false);
                alert("회원가입 에러");
            },
            complete:()=>{
                $("#loading__container").attr("style","display:none;");
            }
        })

        if(response.message != null){
            $("#signup__button").attr("disabled",false);
            alert(response.message)
            return;
        }
    
        alert("로그인 페이지로 이동합니다.");
        window.location.href = "login";
    }
}

async function emailAuth(){
    const emailID   = $("#signup__email").val();
    const emailType = $("#signup__email-selectbox option:selected").val();
    const email     =  emailID + "@" + emailType;
   
    if(emailID === ""){
        alert("이메일 계정을 입력해주세요."); return;
    }else if(emailType === ""){
        alert("이메일 종류를 선택해주세요."); return;
    }

    let response = await $.ajax({
        type : 'post',
        url : `http://localhost:8080/users/emails`,
        contentType : 'application/json',
        data : email,
        beforeSend:()=>{
            $("#signup__email-auth-btn").attr("disabled",true);
            $("#loading__container").attr("style","display:inline-block;");
        },
        success:()=>{
            $("#signup__email-authcode-container").attr("hidden",false);
            signupInfo.email = email
        },
        error:()=>{
            $("#signup__email-auth-btn").attr("disabled",false);
            alert("이메일 전송 에러");
        },
        complete:()=>{
            $("#loading__container").attr("style","display:none;");
        }
        
    })

    $("#signup__email-authcode-hidden").val(response);
   
}

async function idCheck(){
    
    const userID = $("#signup__id").val()

    if(userID === "" || userID.length < 8){
        alert("다시 입력해주세요.")
        return;
    }

    const response = await $.ajax({
        type : 'get',
        url : `http://localhost:8080/users/${userID}`,
        contentType : 'application/json'
    })

    if(response.userId === "ok"){

        const msg = userID + " 아이디를 사용하시겠습니까?";
        if (confirm(msg)!=0) {
            $("#signup__id").attr("readonly",true);
            $('#signup__id-checkbtn').attr("disabled",true);
            signupInfo.idFlag = true;
            signupInfo.userID = userID;
        } 
    }else{
        alert("중복된 아이디입니다.")
    }
    
}

function emailCheck(){
    const emailCode       = $("#signup__email-authcode").val();
    const emailCodeHidden = $("#signup__email-authcode-hidden").val();

    if(emailCode === emailCodeHidden){
        signupInfo.emailFlag = true;
        $("#signup__email-authcode-button").attr("disabled",true);
        $("#signup__email-authcode").attr("readonly",true)
        alert("확인되었습니다.") 
    }else{
        alert("값이 다릅니다.")
    }
}