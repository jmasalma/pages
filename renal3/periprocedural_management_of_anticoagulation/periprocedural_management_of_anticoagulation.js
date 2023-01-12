/*
$(document).ready(function() {
  // change dropdown button text when a dropdown option is clicked
  $('.my-dropdown-item').click(function() {
    $('.my-dropdown-toggle').text($(this).text());
  });

  // show html tooltip
  $('[data-toggle="tooltip"]').tooltip({
    html: true,
    placement: "right",
  });
});



$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
*/


const Strings = {};
Strings.orEmpty = function( entity ) {
    return entity || "";
};


function changeValue(id, val) {
  document.getElementById(id).value = val;
}

function showElement(id) {
  document.getElementById(id).style.display =   'block';
}
function hideElement(id) {
  document.getElementById(id).style.display =   'none';
}


function printDiv(divName) {
     var printContents = "<div class='row'><div class='col'>Patient Information<br/><br/><br/><br/><br/></div></div>" + document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}


function printDivTab(divName) {
     var printContents = "<div class='container'><main role='main'><div class='row'><div class='col'>Patient Information<br/><br/><br/><br/><br/></div></div>" + $("#"+divName).html();
     var wi = window.open();
     $(wi.document.head).html("<script src='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js' integrity='sha384-kenU1KFdBIe4zVF0s0G1M5b4hcpxyD9F7jL+jjXkk+Q2h455rYXK/7HAuoJl+0I4' crossorigin='anonymous'></script></script><link href='https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css' rel='stylesheet' integrity='sha384-rbsA2VBKQhggwzxH7pPCaAqO46MgnOM80zW1RWuH61DGLwZJEdK2Kadq2F9CUG65' crossorigin='anonymous'>");
     $(wi.document.body).html(printContents);
     //wi.print();
     //wi.close();
/*
     var originalContents = $("body").html();

     $("body").html(printContents);

     window.print();

     $("body").html(originalContents);
     */
}

function tinzaparinDose(weight) {
  let tinzaparinUnitsKg = 175;
  /*
  if (weight <= 40) {
    return weight * tinzaparinUnitsKg;
  } else if (weight >= 41 && weight <= 50) {
    return 8000;
  } else if (weight >= 51 && weight <= 60) {
    return 10000;
  } else if (weight >= 61 && weight <= 69) {
    return 12000;
  } else if (weight >= 70 && weight <= 85) {
    return 14000;
  } else if (weight >= 86 && weight <= 94) {
    return 16000;
  } else if (weight >= 95 && weight <= 110) {
    return 18000;
  } else if (weight > 110) {
    return weight * tinzaparinUnitsKg;
  }
  */
  return weight * tinzaparinUnitsKg;
}


function isEmpty(value) {
    return value === null || typeof(value) === 'undefined' || value === ''
}

function check_vals(val) {

  // Const
  let daysBefore = 7;
  let daysAfter = 6;
  let dayCount = daysBefore + daysAfter + 1;
  let tinzaparinUnitsKg = 175;

  $("#result").html("");
  $("#result_w").html("");
  $("#result_2").html("");

  procedureTypeHold = $("#procedureTypeHold").is(':checked');

  onDOAC = $("#onDOAC").is(':checked');
  
  onAntiplatlets = $("#onAntiplatlets").val() !== "notOnAntiplatlets";
  antiplatletType = $("#onAntiplatlets").val();

  notifyMD = $("#notifyMD").is(':checked');
  weight = $("#weight").val();
  procedureDate = $("#procedureDate").val();


  if (procedureTypeHold) {
    $("#result").html("");
    $("#result_w").html("");
    $("#result_2").html("");
    $("#noProcedureTypeHoldDiv").show();
  } else {
    $("#result").html("Nothing to do due to no hold...");
    $("#noProcedureTypeHoldDiv").hide();
  }


  //debugger;
  if (!isEmpty(val) && val.id === "onDOAC" && val.checked) {
    $("#onWarfrin").prop('checked', false);
    $("#warfarinIndicationDiv").hide();
    $("#weightDiv").hide();
    $('#weight').val("");
    $('#warfarinIndication').val("");
  }

  if (!isEmpty(val) && val.id === "onWarfrin" && val.checked) {
    $("#onDOAC").prop('checked', false);
  }

  if (!isEmpty(val) && val.id === "weight") {
    $("#overrideTinzaparin").val("");
  }


  onWarfrin = $("#onWarfrin").is(':checked');
  if (onWarfrin) {
    $("#warfarinIndicationDiv").show();
  } else {
    $("#warfarinIndicationDiv").hide();
    $("#weightDiv").hide();
    $("#weight").val("");
  }

  bridge = $("#warfarinIndication").val() === "bridge";
  maybeBridge = $("#warfarinIndication").val() === "maybeBridge";
  noBridge = $("#warfarinIndication").val() === "noBridge";
  
  if (maybeBridge) {
    $("#notifyMDBridgeDiv").show();
  } else {
    $("#notifyMDBridgeDiv").hide();
    $("#notifyMDBridge").prop('checked', false);
  }

  notifyMDBridge = $("#notifyMDBridge").is(':checked');
  if (bridge || (maybeBridge && notifyMDBridge)) {
    $("#weightDiv").show();
  } else {
    $("#weightDiv").hide();
    $("#weight").val("");
  }

  if (onAntiplatlets) {
    $("#recentMIDiv").show();
  } else {
    $("#recentMIDiv").hide();
    $("#recentMI").prop('checked', false);
    $("#notifyMDDiv").hide();
    $("#notifyMD").prop('checked', false);
  }

  recentMI = $("#recentMI").is(':checked');

  if (recentMI) {
    $("#notifyMDDiv").show();
  } else {
    $("#notifyMDDiv").hide();
    $("#notifyMD").prop('checked', false);
  }

  if (onAntiplatlets && recentMI && !notifyMD) {
    $("#result_w").html("Make sure MD is notified before proceeding...");
  } else {
    $("#result_w").html("");
  }

  if (onDOAC) {
    $("#result").html("Hold DOAC 2 days before procedure");
    $("#result_2").html("");
  }

  if (procedureTypeHold && !isEmpty(procedureDate) && onWarfrin && !isEmpty(weight)) {
    $("#calculatedTinzaparin").val(tinzaparinDose(weight));
  }

  overrideTinzaparin = $("#overrideTinzaparin").val();
  if(isEmpty(overrideTinzaparin) && !isEmpty(weight)) {
    displayTinzaparinDose = tinzaparinDose(weight);
  } else if (!isEmpty(overrideTinzaparin)) {
    displayTinzaparinDose = overrideTinzaparin;
  }

  if (procedureTypeHold && !isEmpty(procedureDate) && onWarfrin) {
    var procedureDateDay = new Date(procedureDate.replace(/-/g,'/'));

    var procedureDateStart = new Date(procedureDate.replace(/-/g,'/'));
    procedureDateStart.setDate(procedureDateStart.getDate()-daysBefore);
    var procedureDateEnd = new Date(procedureDate.replace(/-/g,'/'));
    procedureDateEnd.setDate(procedureDateEnd.getDate()+daysAfter);
    

    let antiplatletsArray = new Array(dayCount);
    if (onAntiplatlets) {
      // Antiplatlets array hold 5 days before
      antiplatletsArray = antiplatletsArray.fill("last dose", 1, 2);
      antiplatletsArray = antiplatletsArray.fill("hold", 2, 8);
      antiplatletsArray = antiplatletsArray.fill("restart", 8, 9);
    }

    let warfrinArray = new Array(dayCount);
    // -6 day -> last dose
    warfrinArray = warfrinArray.fill("last dose", 1, 2);
    // -5 to 0 day -> hold
    warfrinArray = warfrinArray.fill("hold", 2, daysBefore);
    // 0 - end -> restart
    warfrinArray = warfrinArray.fill("restart", daysBefore, daysBefore+1);

    let tinzaparinArray = new Array(dayCount);
    if ((bridge || (maybeBridge && notifyMDBridge)) && !isEmpty(weight)) {
      // -2 to 0 day -> use
      tinzaparinArray = tinzaparinArray.fill( displayTinzaparinDose + " units", 4, daysBefore);
      // 0 day -> hold
      tinzaparinArray = tinzaparinArray.fill("hold", daysBefore, daysBefore+1);
      // 1 to 5 days -> restart (stop when INR is therapeutic)
      tinzaparinArray = tinzaparinArray.fill(displayTinzaparinDose + " units (stop when INR is therapeutic)", daysBefore+1, dayCount);
    }


    var now = new Date();
    var planDays = [];
    for (var d = procedureDateStart; d <= procedureDateEnd; d.setDate(d.getDate() + 1)) {
      planDays.push(new Date(d));
    }



    let planCalt = "<div class='row'>";
    let planList = "";
    //let planCal = "";
    
    planList += "Procedure Date: " + procedureDate + "<br />";
    planList += "Hold Warfarin 5 days before<br />";
    if (onAntiplatlets) {
      planList += "Hold " + antiplatletType + " for 5 days before<br />";
    }
    
    if (bridge && !isEmpty(weight)) {
      planList += "Start Tinzaparin at " + displayTinzaparinDose + " units 3 days before porcedure<br />";
    }
    
    for (let i = 0; i < dayCount; i++) {
      let dayOf = "";
      let datOfStyle = "bg-light";
      day = planDays[i];
      if (procedureDateDay.getTime() === day.getTime()) {
        //planCal += "<strong>";
        dayOf = "<b>Procedure Day</b><br />";
        datOfStyle = "bg-secondary";
      }
      //planCal += day.toLocaleDateString("en-EN", { weekday: 'long' }) + " - " + day.toLocaleDateString() + " - antiplatlets: " + antiplatletsArray[i] + " - warfrin: " + warfrinArray[i] + " - tinzaparin: " + tinzaparinArray[i] + "<br />"


      planCalt += "<div class='col mt-3 mr-3 border'><div class='row'>" +
        "<div class='row '><div class='col " + datOfStyle + " rounded '>" + dayOf + day.toLocaleDateString("en-EN", { weekday: 'long' }) + "<br />" + day.toLocaleDateString() + "</div></div>";
      if (onAntiplatlets) {
        planCalt += "<div class='row '><div class='col'>" + antiplatletType + ": " + Strings.orEmpty(antiplatletsArray[i]) + "</div></div>";
      }

      planCalt += "<div class='row'><div class='col'>Warfarin: " + Strings.orEmpty(warfrinArray[i]) + "</div></div>";
      if (!isEmpty(tinzaparinArray[i])) {
        planCalt += "<div class='row'><div class='col'>Tinzaparin: " + Strings.orEmpty(tinzaparinArray[i]) + "</div></div>";
      }
      planCalt += "</div></div>";


      /*
      if (procedureDateDay.getTime() === day.getTime()) {
        planCal += "</strong>";
      }
      */

      // generate 2 rows 7 cols 2 table with calculated data and update results...
      if (i === 6) {
        planCalt += "</div><div class='row '>";
      }

    }
    planCalt += "</div>";
    planList += `
<button class="btn btn-default" onclick="printDiv('printableArea')">
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-printer" viewBox="0 0 16 16">
    <path d="M2.5 8a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"></path>
    <path d="M5 1a2 2 0 0 0-2 2v2H2a2 2 0 0 0-2 2v3a2 2 0 0 0 2 2h1v1a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2v-1h1a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-1V3a2 2 0 0 0-2-2H5zM4 3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2H4V3zm1 5a2 2 0 0 0-2 2v1H2a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1h-1v-1a2 2 0 0 0-2-2H5zm7 2v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1z"></path>
  </svg>
  <span class="visually-hidden">Button</span>
</button>`;
    
    $("#result").html(planCalt);
    $("#result_2").html(planList);

  }

}
