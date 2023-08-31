
const dividers = [2,3,4,5,6,7,8,9,10];

// Reduce a fraction by finding the Greatest Common Divisor and dividing by it.
function reduce(numerator,denominator){
  var gcd = function gcd(a,b){
    return b ? gcd(b, a%b) : a;
  };
  gcd = gcd(numerator,denominator);
  return [numerator/gcd, denominator/gcd];
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}


function doQuestion(item) {
  random = Math.floor(Math.random() * dividers.length);
  random_dividers = dividers[random];
  fraction_top = getRandomIntInclusive(1,20) * random_dividers;
  fraction_bottom = getRandomIntInclusive(2,40) * random_dividers;
  //alert(fraction_top);
  $("#fraction-top-q").val(fraction_top);
  $("#fraction-bottom-q").val(fraction_bottom);
  $("#fraction-top-a").val(null);
  $("#fraction-bottom-a").val(null);
  //alert("here");
  
}


function doMath(item) {
  
  //alert("hi");
  fraction_top_q = $("#fraction-top-q").val();
  fraction_bottom_q = $("#fraction-bottom-q").val();
  correct_answer = reduce(fraction_top_q,fraction_bottom_q);
  
  fraction_top_a = $("#fraction-top-a").val();
  fraction_bottom_a = $("#fraction-bottom-a").val();
  
  answer = [];
  answer.push(fraction_top_a, fraction_bottom_a);
  
  if (correct_answer.toString() === answer.toString()) {
    alert("Correct");
    doQuestion(item);
  } else {
    alert("Try again");
  }
  
  
}

