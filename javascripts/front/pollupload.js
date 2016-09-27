var pollUrl = window.location.origin + '/pollupload';

$(document).ready(function(){
    $.get(pollUrl, function(data, status){
        $("#pollDiv").html(data);
        console.log(data);
    })
});