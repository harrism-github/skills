
//==========================PRIME NUMBER GENERATOR WORKER=============================

  var w = self;  //same as w = window = this

  var num = 2;
  var bPause = false;
  var bStop = false;
  var numPrimes = 0;
  var delay = 1024;  //1 sec

  function isPrime() {
    var bPrime = true;
    //try to divide all numbers bigger than n and < sqrt(n) into n
    for (var i = 2; i <= Math.sqrt(num); i++) {
      //does i divide into n evenly?
      if (bPause || bStop || num % i === 0) {
        //not a prime number
        bPrime=false;
        break;
      }
    }
    if (bPrime) {
      //report newly found prime number
      numPrimes++ ;
      w.postMessage({"cmd":"prime","primeNum":num,"numOfPrimes":numPrimes});
    }
    if (!bPause && !bStop) {
      // restart prime check on next number
      // wait 1 sec if a prime was found so user can see it;
      // otherwise start looking at next number immediately
      setTimeout(function () { num++; isPrime(); }, ((bPrime)?delay:0));
    }
  }

  //handle commands from parent page
  w.addEventListener('message', function (e) {
    var data = e.data;
    switch (data.cmd) {
      case 'start':
        num = 2;
        numPrimes=0;
        delay = 1024;
        bPause = false;
        bStop = false;
        isPrime();
        w.postMessage({"cmd":"start","msg":data.msg});
        break;
      case 'pause':
        bPause = true;
        w.postMessage({"cmd":"pause","msg":data.msg});
        break;
      case 'resume':
        bPause = false;
        w.postMessage({"cmd":"resume","msg":data.msg});
        isPrime();
        break;
      case 'stop':
        bStop=true;
        w.postMessage({"cmd":"stop","msg":data.msg});
        break;
      case 'speedup':
        delay = Math.round(delay / 2);
        delay = (delay<1?1:delay);
        w.postMessage({"cmd":"stop","msg":data.msg+" ("+delay+" msec loop delay)"});
        break;
      case 'slowdown':
        delay = (delay>0?delay:1) * 2;
        w.postMessage({"cmd":"stop","msg":data.msg+" ("+delay+" msec loop delay)"});
        break;
      case 'disable':
        w.postMessage({"cmd":"disable","msg":data.msg});
        //terminate the worker
        w.close();
        break;
      default:
        w.postMessage('Unknown command: ' + data.msg);
    }
  }, false);  //false attaches a function that prevents event from bubbling



