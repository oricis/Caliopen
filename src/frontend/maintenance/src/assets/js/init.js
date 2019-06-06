$(document).ready(function(){

  parallaxDevices()
  smoothScroll('header a');

  function parallaxDevices() {
    var $window = $(window);
    var devices = 'figure[data-type="device"]';

    $(devices).each(function(){
        var device = $(this);
        device.css({ top: -$window.scrollTop() / device.data('speed') + '%' });
        $(window).scroll(function() {
          var yPos = -$window.scrollTop() / device.data('speed');
          var coords = yPos + '%';
          device.css({ top: coords });
        });
    });
  };

  function smoothScroll(link) {
    $(link).on('click', function() {
      var anchor = $(this).attr('href');
      var speed = 750;
      $('html, body').animate( { scrollTop: $(anchor).offset().top - 100 }, speed );
      return false;
    });
  };
});
