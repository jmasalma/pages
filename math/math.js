

$( document ).ready(function() {
    console.log( "ready!" );
    hideAll();
    showStats();
});



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


function doReset() {
  localStorage['quiz_type'] = 'fractions';
  localStorage['quiz_level'] = 1;
  localStorage['quiz_correct'] = 0;
  localStorage['quiz_wrong'] = 0;
  
}


function showStats() {
  //alert("show stats...");
  //alert(localStorage['quiz_correct']);
  $("#correct-stat").text(localStorage['quiz_correct']);
  $("#wrong-stat").text(localStorage['quiz_wrong']);
  console.log("showStats: " + localStorage['quiz_correct'] + "/" + localStorage['quiz_wrong']);
}

function doMath(item) {
  //alert('doMath');
  if (item) {
    localStorage['quiz_type'] = item;
    // ToDo: add level to calls and new buttons...
    //alert(item);
    localStorage['quiz_level'] = 1;
  }
  if (localStorage['quiz_type'] == 'fractions') {
    doFractions();
  } else if (localStorage['quiz_type'] == 'square_roots') {
    doSquareRoots();
  }
  showStats();
}

function hideAll() {
  $("#square_roots-q-div").hide();
  $("#square_roots-a-div").hide();
  $("#fraction-q").hide();
  $("#fraction-a").hide();
  
}

function doSquareRoots(item) {
  $("#action_type").text("Solve");
  hideAll();
  $("#square_roots-q-div").show();
  $("#square_roots-a-div").show();
  //$("#fraction-q").hide();
  //$("#fraction-a").hide();

  square_roots_q = $("#square_roots-q").text();
  square_roots_a = $("#square_roots-a").val();
  //alert(square_roots_q);

  if (square_roots_q === "" || !square_roots_a) {
    doSquareRootsQuestion(item);
    return;
  }

  square_roots_q = $("#square_roots-q").text();
  square_roots_a = $("#square_roots-a").val();
  square_roots_q_int = (parseInt(square_roots_q) || 0);
  square_roots_a_int = (parseInt(square_roots_a) || 0);
  //console.log(square_roots_q_int + " " + square_roots_a_int);
  if ((square_roots_a_int * square_roots_a_int) == square_roots_q_int) {
    localStorage['quiz_correct'] = (parseInt(localStorage['quiz_correct']) || 0) + 1;
    //showStats();
    doSquareRootsQuestion(item);
  } else {
    localStorage['quiz_wrong'] = (parseInt(localStorage['quiz_wrong']) || 0) + 1;
    //showStats();
    alert("Try again...");
  }
  
}

function doSquareRootsQuestion() {
  rand = getRandomIntInclusive(2,15)
  $("#square_roots-q").text(rand*rand);
  $("#square_roots-a").val(null);
}



function doFractions(item) {
  $("#action_type").text("Simplify");
  hideAll();
  $("#fraction-q").show();
  $("#fraction-a").show();
  //$("#square_roots-q-div").hide();
  //$("#square_roots-a-div").hide();
  //alert(localStorage['quiz_type']);

  fraction_top_a = $("#fraction-top-a").val();
  fraction_bottom_a = $("#fraction-bottom-a").val();

  if (!fraction_top_a || !fraction_bottom_a) {
    doFractionQuestion(item);
    return;
  }

  fraction_top_q = $("#fraction-top-q").val();
  fraction_bottom_q = $("#fraction-bottom-q").val();
  correct_answer = reduce(fraction_top_q,fraction_bottom_q);
  
  
  answer = [];
  answer.push(fraction_top_a, fraction_bottom_a);
  
  if (correct_answer.toString() === answer.toString()) {
    //alert("Correct");
    localStorage['quiz_correct'] = (parseInt(localStorage['quiz_correct']) || 0) + 1;
    //showStats();
    doFractionQuestion(item);
  } else {
    localStorage['quiz_wrong'] = (parseInt(localStorage['quiz_wrong']) || 0) + 1;
    //showStats();
    alert("Try again");
  }
  
  
}



function doFractionQuestion(item) {
  random = Math.floor(Math.random() * dividers.length);
  random_dividers = dividers[random];
  fraction_top = getRandomIntInclusive(1,10) * random_dividers;
  fraction_bottom = getRandomIntInclusive(2,10) * random_dividers;
  //alert(fraction_top);
  $("#fraction-top-q").val(fraction_top);
  $("#fraction-bottom-q").val(fraction_bottom);
  $("#fraction-top-a").val(null);
  $("#fraction-bottom-a").val(null);
  //alert("here");
  
}




/*

Save progress
add done buttom
show stats
add reset button
load next question when correct and show message
show hint or solve button
split stats for different types of quizes..

*/

