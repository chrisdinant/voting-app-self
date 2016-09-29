
var apiUrl = window.location.origin +'/api/:id';

$(document).ready(function(){
    $.get(apiUrl, function(data, status){
        if(data.name != undefined){
             $("#userID").fadeOut(500, function(){   
                $(this).html('<span class="glyphicon glyphicon-user" ></span> ' + data.name).fadeIn(500)
                $(this).attr('href', '/profile'); 
            }); 
            $("#loginout").html('<span class="glyphicon glyphicon-log-out"></span> Logout')
            $("#loginout").attr('href', '/logout');
        } 
    });
});
