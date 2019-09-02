var domains = [
  'http://www.voxptech.com',
  'http://www.voxp.com',
  'http://www.qlabs-ai.com',
  'https://reetoxxi.github.io/thesandbox',
  'https://cramless.elementfx.com',
  'https://www.viooz.ac',
  'https://jollibebe.com'

];

$(document).ready(function(){

  const checkWebsites = () => {
    //clear draw field
    $('#container').html('');

    var stopper = 0;
  
    domains.forEach((val, i) => {

      $.ajax({
        url: 'https://bypasscors.herokuapp.com/api/?url=' + encodeURIComponent(val),
        success: function(){
          $('#container').append('<div class="alert alert-success text-center" role="alert"><b>' + val + '</b> is UP</div>');
          window.scrollTo(0,100);
        },
        error: function(xhr,status,error){
          $('#container').append('<div class="alert alert-danger text-center" role="alert"><b>' + val + '</b> : ' + xhr.responseJSON.code + '</div>');
          window.scrollTo(0,100);
        },
        complete: function(){
          window.scrollTo(0,100);
          stopper++;
        }
      });
  
      var checker = setInterval(function(){
        window.scrollTo(0,100);
        if(stopper == domains.length){
          clearInterval(checker);
          $('#loader').removeClass('fa-spin');
          $('#loader').removeClass('fa-cog');//.addClass('fa-check-circle');
          // $('#loader').css('color','green');
          // setTimeout(function(){
          //   $('#loader').fadeOut(2000);
          // },2000);
        }
      },2000);
    });

  }; //end of checkWebsites

  checkWebsites();
  //Checks websites on interval; default = 7,200,000ms (2hrs)
  var checkWebsitesInterval = setInterval(function(){
    checkWebsites();
  },7200000);

});