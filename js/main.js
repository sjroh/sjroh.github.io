$(function() {
  $('.detail-show').click(function(){
    $(this).closest('.detail-hide').show();
    $(this).closest('.project-detail').show();
    $(this).hide();
  });

  $('.detail-hide').click(function(){
    $(this).closest('.detail-show').show();
    $(this).closest('.project-detail').hide();
    $(this).hide();
  });
});
