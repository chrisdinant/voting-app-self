var apiUrl = window.location.origin +'/api/:id';

$(document).ready(function(){
    $.get(apiUrl, function(data, status){
        $("#userID").fadeOut(500, function(){
            $(this).html('<span class="glyphicon glyphicon-user" ></span> ' + data.name).fadeIn(500);
        });
        $("#profile").html('Name: ' + data.name +'<br /> email: ' + data.email + '<br /> Polls: ' + data.polls);
    });
});

