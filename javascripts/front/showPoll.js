$(document).ready(function(){
    
    $("#upvote").submit(function(e){
        e.preventDefault;
        console.log("voting");
        $("#addOptionDiv").hide();
        var $selected = $('input[type="radio"]:checked');
        var idee=$selected.attr("id");
        
        $.ajax({
            url: "/votes",
            type: "post",
            data: {"question": window.location.pathname.slice(7), "option": idee},
            success: function(result){
               $("#votePosted").html('Your vote has been recorded, Thank you!');
            }
        });
        return false;
    });
    
    $("#add-option").click(function(e){
       e.preventDefault();
        $("#added-option").removeClass('hide');
        
    });
    
    $("#added-option-form").submit(function(e){
       var addOp = $('input[name="option"]').val();
       $.ajax({
           url: '/addOption',
           type: 'post',
           data: {"question": window.location.pathname.slice(7), "option": addOp},
           success: function(result){
                window.location.reload(true);
           }
       });
       return false; 
    });
});


