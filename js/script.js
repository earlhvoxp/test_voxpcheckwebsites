var domains = [
  'https://leemendiolamd.com/',
  'https://www.leemendiolamd.com/tcov/',
  'https://leemendiolamd.com/vck',
  'https://www.mindbody-therapeutics.com/',
  'http://iot.voxptech.com/',
  'http://voxptech.com/'

];

$(document).ready(function(){
  
  var downWebsitesFound = [];
  const checkWebsites = () => {
    //init
    downWebsitesFound = [];
    $('#container').html('');

    var stopper = 0;
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
        
        //Send an email only when at least one website is down
        downWebsitesFound.length > 0 ? sendReport() : '';
        console.log('end');

      }
    },2000);

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
          downWebsitesFound.push(val);
        },
        complete: function(){
          window.scrollTo(0,100);
          stopper++;
        }
      });  
    });
  }; //end of checkWebsites

  const sendReport = () => {
    var formattedMSG = '';
    downWebsitesFound.forEach((val,i) => {
      formattedMSG += (val + ' | ');
    });
    
    var templateParams = {
        downWebsitesList: formattedMSG,
      };
      
    emailjs.send('gmail', 'template_8dgDr4hT', templateParams);
  };

  checkWebsites();

  //Checks websites on interval; default = 7,200,000ms (2hrs)
  var checkWebsitesInterval = setInterval(function(){
    checkWebsites();
  },7200000);

});