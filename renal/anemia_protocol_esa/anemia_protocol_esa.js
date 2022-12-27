function check_vals() {
  document.getElementById("result").innerHTML = ""
  
/*
  ESARange = document.getElementById("ESARange").value;
  if (ESARange == 1) {
    changedESA = "reduced"
    document.getElementById("changedESARange").innerHTML = "Reduced"
  } else if (ESARange == 2) {
    changedESA = "nochange"
    document.getElementById("changedESARange").innerHTML = "No change"
  } else if (ESARange == 3) {
    changedESA = "increased"
    document.getElementById("changedESARange").innerHTML = "Increased"
  }
*/


  if (document.getElementById("increase").checked) {
    changedESA = "increased"
  } else if (document.getElementById("reduced").checked) {
    changedESA = "reduced"
  } else {
    changedESA = "nochange"
  }


  
  ESAonHold = document.getElementById("ESAonHold").checked;
  cHgb = document.getElementById("cHgb").value;
  lmHgb = document.getElementById("lmHgb").value;
  if (cHgb === "" || lmHgb === "") {
    return
  }
  ESA = document.getElementById("ESA").checked;
  //document.getElementById("footer").innerHTML = "debug: " + cHgb + " : " + lmHgb + " : " + ESA + " : " + ESAonHold + " : " + changedESA;



  if ((Math.abs(lmHgb - cHgb) >= 15) || (cHgb < 85) || ((cHgb > 139) && (ESA || ESAonHold))) {
    document.getElementById("result").innerHTML = "Any change in Hb greater than equal to 15 g/L, OR if Hb is less than 85 g/L OR if Hb is greater than 139 g/L and on ESA (or ESA on hold)<br>Notify nephrologist"
  }


  else if (cHgb >= 85 && cHgb <= 94) {
    if (ESA) {
      if (changedESA == "increased") {
        document.getElementById("result").innerHTML = "- Check that the iron studies have been appropriately monitored and addressed prior to increasing the dose<br>- If TSAT less than 20% consider iron load instead of increasing ESA dosage<br>- If dose was increased in past 5 weeks, maintain dose until next blood work cycle<br>- Notify MD if Hb is not in target range after 3 consecutive dosage increases"
      } else {
        document.getElementById("result").innerHTML = "- Check that the iron studies have been appropriately monitored and addressed prior to increasing the dose<br>- <b>If TSAT less than 20% consider iron load instead of increasing ESA dosage</b><br>- If no dosage adjustment in the past 5 weeks <b>increase Darbepoetin dose</b> as per dosage adjustment tables"
      }
    } else {
      document.getElementById("result").innerHTML = "<b>Re-measure iron bloodwork if not done in past week</b>. Refer to Appendix F<br><b>Consult MD to initiate ESA</b>. Suggested initial dose Darbepoetin 0.45 mcg/kg/wk"
    }
  }


  else if (cHgb >= 95 && cHgb <= 115) {
    if (!ESA && !ESAonHold) {
      document.getElementById("result").innerHTML = "<b>No ESA Required</b>. Continue to monitor Hb at regular blood work cycle"
    } else if (ESA && !ESAonHold) {
      document.getElementById("result").innerHTML = "<b>Maintain ESA (Aranesp/Darbepoetin) Dose</b>. Continue to monitor Hb at regular blood work cycle"
    } else if (ESAonHold) {
      document.getElementById("result").innerHTML = "<b>Restart ESA (Aranesp/Darbepoetin) at a reduced dose</b> based on the dose before hold. Refer to ESA dosage adjustment table. Appendix E. Continue monitoring at regular blood work cycle"
    }
  }


  else if (cHgb > 115) {
    if (!ESA && !ESAonHold) {
      document.getElementById("result").innerHTML = "<b>No ESA Required</b>. Continue to monitor Hb at regular blood work cycle"
    }
    if (ESA && !ESAonHold) {
      if (cHgb <= 125) {
        if (changedESA != "reduced") {
          document.getElementById("result").innerHTML = "- If there has been no dosage reduction in the past 5 weeks, <b>reduce ESA dosage</b> as per ESA dosage adjustment table in Appendix E."
        } else {
          document.getElementById("result").innerHTML = "- If there have been dosage reductions in the past 5 weeks <b>maintain current dose</b>. recheck Hb at the next regular blood work cycle"
        }
      } else if (cHgb > 125) {
        document.getElementById("result").innerHTML = "<b>HOLD ESA</b>. Measure Hb in 2 weeks to reassess ESA<br>- <b>If Hb is greater than 125 g/L after 12 weeks of hold discontinue ESA – no ESA required</b>"
      }
    } else if (ESAonHold) {
      if (cHgb > 125) {
        document.getElementById("result").innerHTML = "<b>HOLD ESA</b>. Measure Hb in 2 weeks to reassess ESA<br>- <b>If Hb is greater than 125 g/L after 12 weeks of hold discontinue ESA – no ESA required</b>"
      } else if (cHgb >= 116 && cHgb <= 125) {
        document.getElementById("result").innerHTML = "testing 1"
        if ((lmHgb - cHgb) >= 10) {
          document.getElementById("result").innerHTML = "If change is greater than 10 g/L from last Hb then <b>resume ESA at reduced dose</b>. Refer to protocol ESA adjustment tables. Continue to monitor Hb at regular blood work cycle"
        } else if ((lmHgb - cHgb) < 10) {
          document.getElementById("result").innerHTML = "If change is less than 10 g/L from last Hb then continue to <b>hold ESA</b>"
        } else {
          document.getElementById("result").innerHTML = "Hg increased, no need for change..."
        }
      }
    }
  }


}

