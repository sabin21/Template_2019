var winWidth = $(window).innerWidth();
var winHeight = $(window).innerHeight();

$(document).ready(function(){
  
  function initMain(){

  var main_wheel = $('.wheel-wrap');
  var tl_wheel = new TimelineMax({paused:true});
    tl_wheel
      .to(main_wheel, 1, {rotation: 90, ease:Expo.easeOut})
      .to(main_wheel, 1, {rotation: 180, ease:Expo.easeOut})
      .to(main_wheel, 1, {rotation: 270, ease:Expo.easeOut});

    $(window).on("scroll", function(){
        scrollTop = $(window).scrollTop();       
        mainBoxHeight = winHeight*3;
        scrollPercent = (scrollTop) / (mainBoxHeight - winHeight);
        scrollPercentRounded = Math.round(scrollPercent*100)/100;
        tl_wheel.progress( scrollPercent ).pause();

        if ($(this).scrollTop() > mainBoxHeight){ 
            
          }
          else {
                    
        }
    });
  };
  initMain();
  
});
$(window).resize(function(){
    initMain();
  });
$(window).trigger('resize');


