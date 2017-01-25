$(function() {
  $('.detail-show').click(function(){
    $(this).closest('.detail-hide').css("background-color", "yellow"); //.show();
    $(this).closest('.project-detail').css("background-color", "yellow"); //.show();
    $(this).css("background-color", "yellow"); //.hide();
  });

  $('.detail-hide').click(function(){
    $(this).closest('.detail-show').css("background-color", "red"); //.show();
    $(this).closest('.project-detail').css("background-color", "red");//.hide();
    $(this).css("background-color", "red");//.hide();
  });
});
