function isEmpty(value) {
    return value === null || typeof(value) === 'undefined' || value === ''
}



function check_vals_x(val) {

  let checks_count = 3;

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
    $("#result").html("");
    $("#protocolButton").html("Go to Protocol");
    document.getElementById("protocolButton").setAttribute( "onClick", "javascript: location.href='protocol.html';" );
    document.getElementById("protocolButton").classList.remove('btn-warning');
    document.getElementById("protocolButton").classList.add('btn-primary');

  } else if (checker(xs)) {
    $("#result").html("Notify the nephrologist.");
    $("#protocolButton").html("Clear");
    document.getElementById("protocolButton").setAttribute( "onClick", "javascript: window.location.reload();" );
    document.getElementById("protocolButton").classList.remove('btn-primary');
    document.getElementById("protocolButton").classList.add('btn-warning');
  } else if (!(none || checker(xs))) {
    $("#result").html("")
    $("#protocolButton").html("Clear");
    document.getElementById("protocolButton").setAttribute( "onClick", "javascript: window.location.reload();" );
    document.getElementById("protocolButton").classList.remove('btn-primary');
    document.getElementById("protocolButton").classList.add('btn-warning');
  }

}

function check_vals_iron() {

  tsat = $("#tsat").val();

  if (tsat < 20) {
    $("#hgb").show();
    $("#iron_store").hide();
    hgb_val = $("#hgb_val").val();
    if (hgb_val > 115 && !isEmpty(hgb_val)) {
      $("#result").html("Do not start/continue IV iron loading dose if Hb is greater than 115 g/L -> give IV iron monthly maintenance dose");
    } else if (hgb_val <= 115 && !isEmpty(hgb_val)) {
      $("#result").html("REPLETE IRON STORES<br />1 gram IV iron loading dose given as:<br />• Iron sucrose 100 mg (Venofer) every dialysis for 10 doses<br />• Or Sodium ferric gluconate (Ferrlecit): 125 mg IV every dialysis for 8 doses<br />Measure TSAT and Ferritin at next blood work cycle");
    } else {
      $("#result").html("");
    }

  } else if (tsat >= 20 && tsat <= 49) {
    $("#iron_store").show();
    $("#hgb").hide();


    receving = $("#receving").is(':checked');
    loading = $("#loading").is(':checked');
    hold = $("#hold").is(':checked');
    no_iron = $("#no_iron").is(':checked');
    if (receving) {
      $("#result").html("Continue current maintenance dose<br />Measure TSAT and Ferritin at next blood work cycle");
    } else if (loading) {
      $("#result").html("Proceed with Iron IV Maintenance:<br />Iron Sucrose (Venofer) 100 mg IV every 2 weeks<br />Or Sodium ferric gluconate (Ferrlecit) 125 mg IV every 2 weeks<br />Measure TSAT and Ferritin at next blood work cycle");
    } else if (hold) {
      $("#result").html("Restart iron maintenance dose:<br />Iron Sucrose (Venofer) 100 mg IV monthly<br />Or Sodium ferric gluconate (Ferrlecit) 125 mg IV monthly<br />Measure TSAT and Ferritin at next blood work cycle");
    } else if (no_iron) {
      $("#result").html("Proceed with Iron IV Maintenance:<br />Iron Sucrose (Venofer) 100 mg IV monthly<br />Or Sodium ferric gluconate (Ferrlecit) 125 mg IV monthly<br />Measure TSAT and Ferritin at next blood work cycle");
    }



  } else if (tsat >= 50) {
    $("#hgb").hide();
    $("#iron_store").hide();
    $("#result").html(`
      POSSIBLE IRON OVERLOAD<br />
      <b>HOLD IRON</b> (if currently receving)<br />
      Measure TSAT and ferritin at next routine blood work cycle and reassess iron dosage regimen<br />
      Note: Notify MD if Iron Indices remain high for 3 consecutive blood work cycles
    `);
  }


}
