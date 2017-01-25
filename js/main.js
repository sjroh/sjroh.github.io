$(function() {
  $('.detail-show').click(function(){
    $(this).siblings('.detail-hide').show();
    $(this).parent().parent().find('.project-detail').show();
    $(this).hide();
  });
  $('.detail-hide').click(function(){
    $(this).siblings('.detail-show').show();
    $(this).parent().parent().find('.project-detail').hide();
    $(this).hide();
  });
  $('.item-skill').click(function(){
    $( '#list-skill li' ).each(function( i ) {
      $(this).removeClass('active');
    });
    $(this).addClass('active');

    var selected_skill = $(this).attr('value');
    if (selected_skill === 'all') {
      $( '#list-experience li' ).each(function( i ) {
        $(this).show();
      });
      $( '#list-project li' ).each(function( i ) {
        $(this).show();
      });
    } else {
      $( '#list-experience li' ).each(function( i ) {
        $(this).hide();
      });
      $( '#list-project li' ).each(function( i ) {
        $(this).hide();
      });
      $("#list-project li[skill*='" + selected_skill + "']").show();
      $("#list-experience li[skill*='" + selected_skill + "']").show();
    }
  });
});
