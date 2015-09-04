$(document).ready(function() {

  /*
  * Plugin intialization
  */
    $('#pagepiling').pagepiling({
      menu: '#menu',
      anchors: ['me', 'projects', 'r', 'd', 'rdv', 'kags', 'contact'],
      sectionsColor: ['white', '#ee005a', '#CCC69F', '#000000', '#2C3E50', '#500000', '#39C'],
      navigation: {
        'position': 'right',
        'tooltips': ['Me', 'Projects', 'R for Resistance', 'D for Debug', 'RaspberryDropVoice', 'KoreanAggies']
      },
      afterRender: function(){
        $('#pp-nav').addClass('custom');
      },
      afterLoad: function(anchorLink, index){
        if(index>1){
          $('#pp-nav').removeClass('custom');
        }else{
          $('#pp-nav').addClass('custom');
        }
      }
  });


  /*
    * Internal use of the demo website
    */
    $('#showExamples').click(function(e){
    e.stopPropagation();
    e.preventDefault();
    $('#examplesList').toggle();
  });

  $('html').click(function(){
    $('#examplesList').hide();
  });
  });
