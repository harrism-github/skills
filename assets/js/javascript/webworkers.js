$(document).ready(function () {
  $("header a[href$='javascript/home']").parent().addClass('selected');
  $("article a[href$='javascript/webworkers']").parent().addClass('selected');
});

var $startBtn = $('.startBtn').removeAttr("disabled");
var $pauseBtn = $('.pauseBtn').attr('disabled', 'disabled');
var $stopBtn = $('.stopBtn').attr('disabled', 'disabled');
var $speedUpBtn = $('.speedUpBtn').attr('disabled', 'disabled');
var $slowDownBtn = $('.slowDownBtn').attr('disabled', 'disabled');
var $disabledBtn = $('.disableBtn').removeAttr("disabled");

var worker = new Worker('/js/javascript/prime.js');
worker.addEventListener('message', function (evt) {
  switch (evt.data.cmd) {
    case 'prime':
      $('.primenum').html(evt.data.primeNum);
      $('.primescnt').html(evt.data.numOfPrimes);
      break;
    case 'rec':
      $('.recursion').html(evt.data.value);
      break;
    case 'start':
    case 'pause':
    case 'resume':
    case 'stop':
    case 'speedup':
    case 'slowdown':
    case 'disable':
    default:
      $('.command').html(evt.data.msg);
  }

});

function startPrimeNumberSearch() {
  $startBtn.attr('disabled', 'disabled');
  $pauseBtn.removeAttr('disabled');
  $stopBtn.removeAttr('disabled');
  $speedUpBtn.removeAttr('disabled');
  $slowDownBtn.removeAttr('disabled')
  worker.postMessage({'cmd': 'start', 'msg': "Searching for prime numbers..."});
}

function pauseResumePrimeNumberSearch() {
  if ($pauseBtn.hasClass('resume')) {
    //resume click
    $pauseBtn.html("Pause");
    $pauseBtn.removeClass('resume');
    $speedUpBtn.removeAttr('disabled');
    $slowDownBtn.removeAttr('disabled');
    worker.postMessage({'cmd': 'resume', 'msg': "Resuming prime number search..."});
  }
  else {
    //pause click
    $pauseBtn.html("Resume");
    $pauseBtn.addClass("resume");
    $speedUpBtn.attr('disabled', 'disabled');
    $slowDownBtn.attr('disabled', 'disabled');

    worker.postMessage({'cmd': 'pause', 'msg': "Paused prime number search"});
  }
}

function stopPrimeNumberSearch() {
  $stopBtn.attr('disabled', 'disabled');
  $pauseBtn.attr('disabled', 'disabled');
  $speedUpBtn.attr('disabled', 'disabled');
  $slowDownBtn.attr('disabled', 'disabled');
  $startBtn.removeAttr('disabled');
  worker.postMessage({'cmd': 'stop', 'msg': "Stopped prime number search"});
}

function speedUpPrimeNumberSearch() {
  worker.postMessage({'cmd': 'speedup', 'msg': "Sped up prime number search"});
}
function slowDownPrimeNumberSearch() {
  worker.postMessage({'cmd': 'slowdown', 'msg': "Slowed down prime number search"});
}

function disableWorker() {
  $startBtn.attr('disabled', 'disabled');
  $pauseBtn.attr('disabled', 'disabled');
  $stopBtn.attr('disabled', 'disabled');
  $speedUpBtn.attr('disabled', 'disabled');
  $slowDownBtn.attr('disabled', 'disabled');
  $disabledBtn.attr('disabled', 'disabled');
  worker.postMessage({'cmd': 'disable', 'msg': "Prime number search worker disabled"});
}

