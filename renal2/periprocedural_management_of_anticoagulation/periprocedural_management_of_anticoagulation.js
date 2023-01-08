const Strings = {};
Strings.orEmpty = function( entity ) {
    return entity || "";
};


function printDiv(divName) {
     var printContents = "<div> </div>" + document.getElementById(divName).innerHTML;
     var originalContents = document.body.innerHTML;

     document.body.innerHTML = printContents;

     window.print();

     document.body.innerHTML = originalContents;
}


function tinzaparinDose(weight) {
  let tinzaparinUnitsKg = 175;
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

  document.getElementById("result").innerHTML = "";
  document.getElementById("result_w").innerHTML = "";
  document.getElementById("result_2").innerHTML = "";

  procedureTypeHold = document.getElementById("procedureTypeHold").checked;

  onDOAC = document.getElementById("onDOAC").checked;
  //onAntiplatlets = document.getElementById("onAntiplatlets").checked;
  onAntiplatlets = document.getElementById("onAntiplatlets").value !== "notOnAntiplatlets";
  antiplatletType = document.getElementById("onAntiplatlets").value;
  console.log("onAntiplatlets = "+ onAntiplatlets);
  console.log("onAntiplatlets value = "+ document.getElementById("onAntiplatlets").value);
  
  notifyMD = document.getElementById("notifyMD").checked;
  weight = document.getElementById("weight").value;
  procedureDate = document.getElementById("procedureDate").value;


  if (procedureTypeHold) {
    document.getElementById("result").innerHTML = "";
    document.getElementById("result_w").innerHTML = "";
    document.getElementById("result_2").innerHTML = "";
    document.getElementById("noProcedureTypeHoldDiv").style.display = 'block';
  } else {
    document.getElementById("result").innerHTML = "Nothing to do due to no hold...";
    document.getElementById("noProcedureTypeHoldDiv").style.display = 'none';
  }


  //debugger;
  if (!isEmpty(val) && val.id === "onDOAC" && val.checked) {
    document.getElementById("onWarfrin").checked = false;
    document.getElementById("warfarinIndicationDiv").style.display = 'none';
    document.getElementById("weightDiv").style.display = 'none';
    document.getElementById("weight").value = "";
    document.getElementById("warfarinIndication").value = "";
  }

  if (!isEmpty(val) && val.id === "onWarfrin" && val.checked) {
    document.getElementById("onDOAC").checked = false;
  }
//debugger;
  onWarfrin = document.getElementById("onWarfrin").checked;
  if (onWarfrin) {
    document.getElementById("warfarinIndicationDiv").style.display = 'block';
  } else {
    document.getElementById("warfarinIndicationDiv").style.display = 'none';
    document.getElementById("weightDiv").style.display = 'none';
    document.getElementById("weight").value = "";
  }

  bridge = document.getElementById("warfarinIndication").value === "bridge";
  if (bridge) {
    document.getElementById("weightDiv").style.display = 'block';
  } else {
    document.getElementById("weightDiv").style.display = 'none';
    document.getElementById("weight").value = "";
  }

  if (onAntiplatlets) {
    document.getElementById("recentMIDiv").style.display = 'block';
  } else {
    document.getElementById("recentMIDiv").style.display = 'none';
    document.getElementById("recentMI").checked = false;
    document.getElementById("notifyMDDiv").style.display = 'none';
    document.getElementById("notifyMD").checked = false;
  }

  recentMI = document.getElementById("recentMI").checked;

  if (recentMI) {
    document.getElementById("notifyMDDiv").style.display = 'block';
  } else {
    document.getElementById("notifyMDDiv").style.display = 'none';
    document.getElementById("notifyMD").checked = false;
  }

  if (onAntiplatlets && recentMI && !notifyMD) {
    document.getElementById("result_w").innerHTML = "Make sure MD is notified before proceeding...";
  } else {
    document.getElementById("result_w").innerHTML = "";
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
    if (bridge && !isEmpty(weight)) {
      // -2 to 0 day -> use
      tinzaparinArray = tinzaparinArray.fill( tinzaparinDose(weight) + " units", 4, daysBefore);
      // 0 day -> hold
      tinzaparinArray = tinzaparinArray.fill("hold", daysBefore, daysBefore+1);
      // 1 to 5 days -> restart (stop when INR is therapeutic)
      tinzaparinArray = tinzaparinArray.fill(tinzaparinDose(weight) + " units (stop when INR is therapeutic)", daysBefore+1, dayCount);
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
      planList += "Start Tinzaparin at " + tinzaparinDose(weight) + " units 3 days before porcedure<br />";
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


      planCalt += "<div class='col mt-3 mr-3'><div class='row'>" +
        "<div class='row '><div class='col " + datOfStyle + " rounded '>" + dayOf + day.toLocaleDateString("en-EN", { weekday: 'long' }) + "<br />" + day.toLocaleDateString() + "</div></div>";
      if (onAntiplatlets) {
        planCalt += "<div class='row '><div class='col'>" + antiplatletType + ": " + Strings.orEmpty(antiplatletsArray[i]) + "</div></div>";
      }

      planCalt += "<div class='row'><div class='col'>warfrin: " + Strings.orEmpty(warfrinArray[i]) + "</div></div>";
      if (!isEmpty(tinzaparinArray[i])) {
        planCalt += "<div class='row'><div class='col'>tinzaparin: " + Strings.orEmpty(tinzaparinArray[i]) + "</div></div>";
      }
      planCalt += "</div></div>";


      /*
      if (procedureDateDay.getTime() === day.getTime()) {
        planCal += "</strong>";
      }
      */

      // generate 2 rows 7 cols 2 table with calculated data and update results...
      if (i === 6) {
        planCalt += "</div><div class='row'>";
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
    
    document.getElementById("result").innerHTML = planCalt;
    document.getElementById("result_2").innerHTML = planList;

  }


}
