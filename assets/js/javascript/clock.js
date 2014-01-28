
var worker = self;

function update_clock(){

    var now = new Date();
    var time = {hours:now.getHours(),minutes:now.getMinutes(),seconds:now.getSeconds()};

    worker.postMessage(time);

    // add an event listener to stop worker
    // worker.addEventListener('message', function(e) {
    //   worker.postMessage(e.data);
    // }, false);
   
}

update_clock();
setInterval("update_clock()",1000);
