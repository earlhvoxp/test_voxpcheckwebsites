var domains = [ //be sure to add a target/criteria
  // 'http://reetoxxi.github.io/test_voxpcheckwebsites',
  'https://www.leemendiolamd.com',
  'https://www.leemendiolamd.com/tcov',
  'https://www.leemendiolamd.com/vkc',
  'https://www.mindbody-therapeutics.com',
  // 'http://iot.voxptech.com',
  'http://www.voxptech.com',
  'http://www.qlabs-ai.com',
];
var downWebsitesFound = [];

const init = () => {
  //if offline, retry every 5 seconds
  isOnline = window.navigator.onLine ? checkBypassCors() : setTimeout(isOnline, 5000);
};

const sendReport = () => {
  var formattedMSG = '';
  downWebsitesFound.forEach((val,i) => {
    formattedMSG += (val + ' | ');
  });
  
  var templateParams = {
      downWebsitesList: formattedMSG,
    };
    
  emailjs.send('gmail', 'template_8dgDr4hT', templateParams);
  setTimeout(() => {
    console.log('Report sent!')
  },2000);
};

const checkWebsites = () => {
  $('#container').html(''); // clear output container
  downWebsitesFound = []; // initialize down websites found

  domains.forEach((val, i) => {
    this._lastRecord = ''; 
    $.ajax({
      url: 'https://bypasscors.herokuapp.com/api/?url=' + encodeURIComponent(val),
      async: false,
      success: (res) => {
        this._criteria = [
          //add target/criteria here to qualify for checking
          res.match(/\<meta property\=\"og\:title\" content\=\"Home \- Lee Mendiola\, M\.D\.\"/g) ? 1 : 0,
          res.match(/\<meta property\=\"og\:title\" content\=\"TMS Center of Ventura \- Lee Mendiola MD\"/g) ? 1 : 0,
          res.match(/\<link rel\=\"canonical\" href\=\"https\:\/\/www\.leemendiolamd\.com\/vkc\/\"/g) ? 1 : 0,
          res.match(/\<meta property\=\"og\:title\" content\=\"MindBody Therapeutics \| Ketamine Infusion Therapy\"/g) ? 1 : 0,
          res.match(/\<link rel\=\"canonical\" href\=\"http\:\/\/voxptech\.com\/\"/g) ? 1 : 0,
          res.match(/\<link rel\=\"canonical\" href\=\"http\:\/\/qlabs\-ai\.com\/\"/g) ? 1 : 0,
          res.match(/\<span id\=\"lastrecorddate\"/g) ? 1 : 0
        ];

        if (this._criteria.includes(1) && val == 'http://iot.voxptech.com') {
          $.ajax({url:'https://bypasscors.herokuapp.com/api/?url=http://iot.voxptech.com/api/retrieve2.php',async: false, success: (res)=>{this._lastRecord = JSON.parse(res)[JSON.parse(res).length - 1].insertdate;}});    
        }
      },
      complete: (xhr, status) => {
        //-- iot.voxptech.com (specifics)
        var currTime = new Date();
        var lastRecord = new Date (this._lastRecord);
        var criteria0_iot = val == 'http://iot.voxptech.com' && status == 'success' && this._criteria.includes(1) && !((currTime.getTime() - lastRecord.getTime()) > 7200000);
        // if last record is 2 hours or more from current time, alert us.

        var criteria1_general = val !== 'http://iot.voxptech.com' && status == 'success' && this._criteria.includes(1);
        //for general, just check if certain element is found on result and if status of ajax is success

        //build basic main display element
        var elementToAdd = document.createElement('div');
        var anchoredElement = document.createElement('a');
        anchoredElement.classList.add('font-weight-bold');
        anchoredElement.setAttribute('href', val);
        anchoredElement.setAttribute('target', '_blank');
        elementToAdd.appendChild(anchoredElement);
        
        if (criteria0_iot) { // add new if for new special-treatment/site-specific handling
          elementToAdd.classList.add('alert');
          elementToAdd.classList.add('alert-success');
          elementToAdd.classList.add('text-center');
          anchoredElement.innerHTML = val + ' is UP';
          anchoredElement.classList.add('text-success');
          $('#container').append(elementToAdd);
        } else if (criteria1_general) {
          elementToAdd.classList.add('alert');
          elementToAdd.classList.add('alert-success');
          elementToAdd.classList.add('text-center');
          anchoredElement.innerHTML = val + ' is UP';
          anchoredElement.classList.add('text-success');
          $('#container').append(elementToAdd);
        } else { //all with error in request needs to be checked manually
          elementToAdd.classList.add('alert');
          elementToAdd.classList.add('alert-danger');
          elementToAdd.classList.add('text-center');
          anchoredElement.innerHTML = val + ': Something\'s wrong. Check!';
          anchoredElement.classList.add('text-danger');
          $('#container').append(elementToAdd);

          downWebsitesFound.push(val); // to be collected for email report
        }

        // (domains.length - 1) == i ? sendReport() : console.log('No issues. Checked at ' + new Date());

        if ((domains.length - 1) == i && downWebsitesFound.length < 1) {
          console.log('No issues. Checked at ' + new Date());
        } else if ((domains.length - 1) == i && downWebsitesFound.length > 0) {
          console.log('Sending report...');
          sendReport();
        }
        
        if ((domains.length - 1) == i) {
          $('#loader').removeClass('fa-spin');
          $('#loader').remove(); //.addClass('fa-check-circle');
        }
      }
    });
  });
};

const checkBypassCors = () => {
  $.ajax({url:'https://bypasscors.herokuapp.com/api/?url=https://reetoxxi.github.io/',
    async: false,
    success: function() {
      checkWebsites();
    },
    error: function(xhr) { //because for cors issues, we are dependent to this api :(
      alert('Please check the websites manually. Thank you!');
      console.log('Logged at ' + new Date());
    }
   });
};

$(document).ready(() =>{
  init();
  setInterval(init, 3600000);
});