var domains = [
  'http://www.voxptech.com',
  'http://www.voxp.com',
  'http://www.qlabs-ai.com',
  'https://www.youtube.com',
  'https://smart.com.ph',
  'https://www.github.com',
  'https://cramless.elementfx.com',
  'http://findeee.000webhostapp.com',
  'https://www.ladbrokes.com',
  'https://www.gap.com',
  'https://www.viooz.ac',
  'https://www.hsbc.co.uk',
  'https://www.victoriassecret.com',
  'https://www.accuweather.com'
];

$(document).ready(function(){

  const checkWebsites = () => {
    //clear draw field
    $('#container').html('');

    var stopper = 0;
  
    domains.forEach((val, i) => {
      $.ajax({
        url: val,
        success: function(){
          $('#container').append('<div class="alert alert-success text-center" role="alert">' + val + ' is UP</div>');
        },
        error: function(xhr,status,error){
          $('#container').append('<div class="alert alert-danger text-center" role="alert">' + val + ' : ' + error + '</div>');
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