$(document).ready(function(){
    
var apiUrl = window.location.origin +'/api/:id';
    $.get(apiUrl, function(data, status){
        if(data.name != undefined){
             $("#userID").fadeOut(500, function(){   
                $(this).html('<span class="glyphicon glyphicon-user" ></span> ' + data.name).fadeIn(500); 
            });   
        } 
    });
    
var counter = 0;
   $("#add-option").on('click', function(e){
       $("#pollForm").append('<input class="pollInput" type="text" name="option" id = "added' + counter + '">');
       counter++;
       $("#remove-option").show();
       return false;
   }); 
   $("#remove-option").on('click', function(e){
       e.preventDefault;
       counter--;
       $("#added" + counter).remove();
       
       if(counter===0){
           $("#remove-option").hide();
       }
   });
   
});