$(document).ready(function(){
    var delUrl;
    $(".delbtn").click(function(e){
        $("#deldiv").removeClass("hide");
        $("#delyes").val($(this).attr('name'))
        
    });
    $("#delno").click(function(e){
        e.preventDefault();
        $("#deldiv").addClass("hide");
    });
});