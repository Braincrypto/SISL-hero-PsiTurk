/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = PsiTurk(uniqueId, adServerLoc);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-ready.html",
  "experiment/client.html",
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/
// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
  var token = psiTurk.taskdata.get('workerId');
  
  console.log('Loading app for workerId: ' + workerId);
  console.log(Config.endPoint + '/user/' + token + '/create');
  $.ajax({
    type: "POST",
    crossDomain: true,
    contentType: "application/json; charset=utf-8",
    dataType: "json",
    url: Config.endPoint + '/user/' + token + '/create',
    data: '',
    // Will retry three times
    timeout: 60000,
    tryCount: 0,
    retryLimit: 3,
    error: function(xhr, textStatus, errorThrown ) {
      if (textStatus === 'timeout') {
        console.log('Timeout');
        this.tryCount++;
        if (this.tryCount <= 3) {
          //try again
          $.ajax(this);
          return;
        }            
        return;
      }
    },
    success: function() {
      console.log('WorkerId created!');
    },
    complete: function() {
      console.log('WorkerId create request sent.');
    }
  });

  psiTurk.doInstructions(
    instructionPages, // a list of pages you want to display in sequence
    function () {
      psiTurk.showPage('experiment/client.html');
              // disable bootstrap for rendering the experiment
      $('#bootstrap').prop('disabled', true);
      $(function () {
        window.hero = new Hero({
          token: 'test2',
          callback: psiTurk.completeHIT,
        });
        window.scrollTo(0,1);
      });
    }
  );
});
