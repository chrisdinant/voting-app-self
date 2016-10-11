
var apiUrl = window.location.origin +'/api/:id';

$(document).ready(function(){
    $.get(apiUrl, function(data, status){
        if(data.name){
            $(".subtitle").html('Hi ' + data.name + '! What do you want to do?');
             $("#userID").fadeOut(500, function(){   
                $(this).html('<span class="glyphicon glyphicon-user" ></span> ' + data.name).fadeIn(500)
                $(this).attr('href', '/profile'); 
            }); 
            $("#loginout").html('<span class="glyphicon glyphicon-log-out"></span> Logout')
            $("#loginout").attr('href', '/logout');
            
            $("#main-btns").toggleClass("hide");
            $("#addOptionDiv").toggleClass("hide");
            $('a').filter('.' + data.name).toggleClass("hide");
        } 
    });
});
