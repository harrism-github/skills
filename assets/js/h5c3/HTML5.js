$(document).ready(function() {
	$("header a[href$='h5c3/home']").parent().addClass('selected');
	$("article a[href$='h5c3/HTML5']").parent().addClass('selected');

  // on load, display the current value of the guage
  // fetch the last value from local storage
  var lastValue = localStorage.guageValue ? localStorage.guageValue : 5; 
  $("[name='guage']").val(lastValue);
  $("[name='result']").html("Value: " + lastValue);

  // handle the changing of the guage
  // store the new value in local storage
  $("[name='guage']").change( function(){
    var newValue = $("[name='guage']").val();
    localStorage.guageValue = newValue;
    $("[name='result']").html("Value: "+newValue);
  });




});