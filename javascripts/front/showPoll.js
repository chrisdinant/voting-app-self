function windowload(){
    
    $(".upvote").click(function(e){
        e.preventDefault;
        
        $.ajax({
            url: "/votes",
            type: "post",
            data: {"question": window.location.pathname.slice(7), "option": this.id},
            success: function(result){
                window.location.reload();
            }
        })
    })
   
};

$(document).ready(windowload());



