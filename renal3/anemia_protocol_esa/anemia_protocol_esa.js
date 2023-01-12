
function isEmpty(value) {
    return value === null || typeof(value) === 'undefined' || value === ''
}


function check_vals_x(val) {

  let checks_count = 7;

  $("#result").html("");

  if (val.id === "none") {
    for (let i = 1; i <= checks_count; i++) {
      $("#x"+i).prop('checked', false);
    }
  } else {
    $("#none").prop('checked', false);
  }

  var xs = [];
  for (let i = 1; i <= checks_count; i++) {
    xs[i] = $("#x"+i).is(':checked');
  }
  none = $("#none").is(':checked');

  let checker = arr => arr.some(Boolean);

  if (none) {
    //$("#result").html("<div class='divTable'><div class='divRow'><a href='protocol.html'><div class='divCell nav-item'>Go to protocol</div></a></div></div>";
    $("#result").html("");
    $("#protocolButton").html("Go to Protocol");
    document.getElementById("protocolButton").setAttribute( "onClick", "javascript: location.href='protocol.html';" );
    document.getElementById("protocolButton").classList.remove('btn-warning');
    document.getElementById("protocolButton").classList.add('btn-primary');
    
  } else if (checker(xs)) {
    $("#result").html("Notify the nephrologist to assess ongoing ESA");
    $("#protocolButton").html("Clear");
    document.getElementById("protocolButton").setAttribute( "onClick", "javascript: window.location.reload();" );
    document.getElementById("protocolButton").classList.remove('btn-primary');
    document.getElementById("protocolButton").classList.add('btn-warning');
  } else if (!(none || checker(xs))) {
    $("#result").html("");
    $("#protocolButton").html("Clear");
    document.getElementById("protocolButton").setAttribute( "onClick", "javascript: window.location.reload();" );
    document.getElementById("protocolButton").classList.remove('btn-primary');
    document.getElementById("protocolButton").classList.add('btn-warning');
  }

}

function calculateDose(value, increase) {
  let doseMatrix = [
     [10, 10, 0]
    ,[10, 20, 10]
    ,[40, 50, 30]
  ];
  
  return 666
}



function check_vals() {



//  'use strict';

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const form = document.querySelector('.needs-validation');
	const btn = document.getElementById('myButton');

  
  btn.addEventListener('click', () => {
    // Creating the event
    const event = new Event('submit', {
      'bubbles': true,
      'cancelable': true
    });
    
    form.dispatchEvent( event );
  })

  form.addEventListener('submit', (event) => {
    if (!form.checkValidity()) {
      event.preventDefault();
      event.stopPropagation();
    }
    form.classList.add('was-validated');
  }, false);





  // Statics...
  doseTable = `
<table class="table table-striped">
<thead>
<tr><th>Current Dose</th><th>If dose increase is required, change dose to</th><th>If dose decrease is required, change dose to</th></tr>
</thead>
<tbody>
<tr ><td>10 mcg once every 4 weeks</td><td>10 mcg once every 2 weeks</td><td>Discontinue darbepoetin</td></tr>
<tr ><td>10 mcg once every 2 weeks</td><td>10 mcg once weekly</td><td>10 mcg once every 4 weeks</td></tr>
<tr ><td>10 mcg once weekly</td><td>20 mcg once weekly</td><td>10 mcg once every 2 weeks</td></tr>
<tr ><td>20 mcg once weekly</td><td>30 mcg once weekly</td><td>10 mcg once weekly</td></tr>
<tr ><td>30 mcg once weekly</td><td>40 mcg once weekly</td><td>20 mcg once weekly</td></tr>
<tr ><td>40 mcg once weekly</td><td>50 mcg once weekly</td><td>30 mcg once weekly</td></tr>
<tr ><td>50 mcg once weekly</td><td>60 mcg once weekly</td><td>40 mcg once weekly</td></tr>
<tr ><td>60 mcg once weekly</td><td>80 mcg once weekly</td><td>50 mcg once weekly</td></tr>
<tr ><td>80 mcg once weekly</td><td>100 mcg once weekly</td><td>60 mcg once weekly</td></tr>
<tr ><td>100 mcg once weekly</td><td>120 mcg once weekly</td><td>80 mcg once weekly</td></tr>
<tr ><td>120 mcg once weekly</td><td>150 mcg once weekly</td><td>100 mcg once weekly</td></tr>
<tr ><td>150 mcg once weekly</td><td>Notify nephrologist to assess hyporesponsiveness</td><td>120 mcg once weekly</td></tr>
</tbody>
</table>
`


  $("#result").html("");

  ESA = $("#ESA").is(':checked');
  ESAonHold = $("#ESAonHold").is(':checked');




  if ($("#increase").is(':checked')) {
    changedESA = "increased"
  } else if ($("#reduced").is(':checked')) {
    changedESA = "reduced"
  } else {
    changedESA = "nochange"
  }


  
  cHgb = $("#cHgb").val();
  lmHgb = $("#lmHgb").val();
  if (cHgb === "" || lmHgb === "") {
    return
  }

  if ((Math.abs(lmHgb - cHgb) >= 15) || (cHgb < 85) || ((cHgb > 139) && (ESA || ESAonHold))) {
    $("#result").html("Any change in Hb greater than equal to 15 g/L, OR if Hb is less than 85 g/L OR if Hb is greater than 139 g/L and on ESA (or ESA on hold)<br>Notify nephrologist");
  }


  else if (cHgb >= 85 && cHgb <= 94) {
    if (ESA) {
      if (changedESA == "increased") {
        $("#result").html("- Check that the iron studies have been appropriately monitored and addressed prior to increasing the dose<br>- If TSAT less than 20% consider iron load instead of increasing ESA dosage<br>- If dose was increased in past 5 weeks, maintain dose until next blood work cycle<br>- Notify MD if Hb is not in target range after 3 consecutive dosage increases");
      } else {
/*
        if (!isEmpty(current_dose)) {
          doseTable = calculateDose(current_dose)
        }
*/
        $("#result").html("- Check that the iron studies have been appropriately monitored and addressed prior to increasing the dose<br>- <b>If TSAT less than 20% consider iron load instead of increasing ESA dosage</b><br>- If no dosage adjustment in the past 5 weeks <b>increase Darbepoetin dose</b> as per dosage adjustment tables" + "<br/>" + doseTable);
      }
    } else {
      $("#result").html("<b>Re-measure iron bloodwork if not done in past week</b>. Refer to Appendix F<br><b>Consult MD to initiate ESA</b>. Suggested initial dose Darbepoetin 0.45 mcg/kg/wk");
    }
  }


  else if (cHgb >= 95 && cHgb <= 115) {
    if (!ESA && !ESAonHold) {
      $("#result").html("<b>No ESA Required</b>. Continue to monitor Hb at regular blood work cycle");
    } else if (ESA && !ESAonHold) {
      $("#result").html("<b>Maintain ESA (Aranesp/Darbepoetin) Dose</b>. Continue to monitor Hb at regular blood work cycle");
    } else if (ESAonHold) {
      $("#result").html("<b>Restart ESA (Aranesp/Darbepoetin) at a reduced dose</b> based on the dose before hold. Refer to ESA dosage adjustment table. Appendix E. Continue monitoring at regular blood work cycle" + "<br/>" + doseTable);
    }
  }


  else if (cHgb > 115) {
    if (!ESA && !ESAonHold) {
      $("#result").html("<b>No ESA Required</b>. Continue to monitor Hb at regular blood work cycle");
    }
    if (ESA && !ESAonHold) {
      if (cHgb <= 125) {
        if (changedESA != "reduced") {
          $("#result").html("- If there has been no dosage reduction in the past 5 weeks, <b>reduce ESA dosage</b> as per ESA dosage adjustment table in Appendix E." + "<br/>" + doseTable);
        } else {
          $("#result").html("- If there have been dosage reductions in the past 5 weeks <b>maintain current dose</b>. recheck Hb at the next regular blood work cycle");
        }
      } else if (cHgb > 125) {
        $("#result").html("<b>HOLD ESA</b>. Measure Hb in 2 weeks to reassess ESA<br>- <b>If Hb is greater than 125 g/L after 12 weeks of hold discontinue ESA – no ESA required</b>");
      }
    } else if (ESAonHold) {
      if (cHgb > 125) {
        $("#result").html("<b>HOLD ESA</b>. Measure Hb in 2 weeks to reassess ESA<br>- <b>If Hb is greater than 125 g/L after 12 weeks of hold discontinue ESA – no ESA required</b>");
      } else if (cHgb >= 116 && cHgb <= 125) {
        //$("#result").html("testing 1"
        if ((lmHgb - cHgb) >= 10) {
          $("#result").html("If change is greater than 10 g/L from last Hb then <b>resume ESA at reduced dose</b>. Refer to protocol ESA adjustment tables. Continue to monitor Hb at regular blood work cycle" + "<br/>" + doseTable);
        } else if ((lmHgb - cHgb) < 10) {
          $("#result").html("If change is less than 10 g/L from last Hb then continue to <b>hold ESA</b>");
        } else {
          $("#result").html("Hg increased, no need for change...");
        }
      }
    }
  }


}
