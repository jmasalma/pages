function isEmpty(value) {
    return value === null || typeof(value) === 'undefined' || value === ''
}



function check_vals(val) {

  let checks_count = 3;

  document.getElementById("result").innerHTML = "";

  if (val.id === "none") {
    for (let i = 1; i <= checks_count; i++) {
      document.getElementById("x"+i).checked = false;
    }
  } else {
    document.getElementById("none").checked = false;
  }

  var xs = [];
  for (let i = 1; i <= checks_count; i++) {
    xs[i] = document.getElementById("x"+i).checked;
  }
  none = document.getElementById("none").checked;

  let checker = arr => arr.some(Boolean);

  if (none) {
    document.getElementById("result").innerHTML = "<div class='divTable'><div class='divRow'><a href='protocol.html'><div class='divCell nav-item'>Go to protocol</div></a></div></div>"
  } else if (checker(xs)) {
    document.getElementById("result").innerHTML = "notify the nephrologist to assess ongoing ESA"
  } else if (!(none || checker(xs))) {
    document.getElementById("result").innerHTML = ""
  }

}

function check_vals_iron() {

  tsat = document.getElementById("tsat").value;

  if (tsat < 20) {
    document.getElementById("hgb").style.display = 'block';
    document.getElementById("iron_store").style.display = 'none';
    hgb_val = document.getElementById("hgb_val").value;
    if (hgb_val > 115 && !isEmpty(hgb_val)) {
      document.getElementById("result").innerHTML = "Do not start/continue IV iron loading dose if Hb is greater than 115 g/L -> give IV iron monthly maintenance dose";
    } else if (hgb_val <= 115 && !isEmpty(hgb_val)) {
      document.getElementById("result").innerHTML = "REPLETE IRON STORES<br />1 gram IV iron loading dose given as:<br />• Iron sucrose 100 mg (Venofer ®) every dialysis for 10 doses<br />• Sodium ferric gluconate (Ferrlecit ®): 125 mg IV every dialysis for 8 doses<br />Measure TSAT and Ferritin at next blood work cycle";
    } else {
      document.getElementById("result").innerHTML = "";
    }

  } else if (tsat >= 20 && tsat <= 49) {
    document.getElementById("iron_store").style.display = 'block';
    document.getElementById("hgb").style.display = 'none';


    receving = document.getElementById("receving").checked;
    loading = document.getElementById("loading").checked;
    hold = document.getElementById("hold").checked;
    no_iron = document.getElementById("no_iron").checked;
    if (receving) {
      document.getElementById("result").innerHTML = "Continue current maintenance dose<br />Refer to current maintenance dose<br />Measure TSAT and Ferritin at next blood work cycle";
    } else if (loading) {
      document.getElementById("result").innerHTML = "Start IV iron maintenance dose<br />Proceed with IV Iron Maintenance<br />Iron Sucrose 100 mg IV 2 times/month<br />Sodium ferric gluconate 125 mg IV every 2 weeks<br />Measure TSAT and Ferritin at next blood work cycle";
    } else if (hold) {
      document.getElementById("result").innerHTML = "Restart iron maintenance dose<br />Proceed with IV Iron Maintenance<br />Every Month Iron Sucrose 100 mg IV monthly<br />Sodium ferric gluconate 125 mg IV monthly<br />Measure TSAT and Ferritin at next blood work cycle";
    } else if (no_iron) {
      document.getElementById("result").innerHTML = "Start IV iron maintenance dose (Obtain MD order to start anemia protocol)<br />Proceed with IV Iron Maintenance<br />Every Month Iron Sucrose 100 mg IV monthly<br />Sodium ferric gluconate 125 mg IV monthly<br />Measure TSAT and Ferritin at next blood work cycle";
    }



  } else if (tsat >= 50) {
    document.getElementById("hgb").style.display = 'none';
    document.getElementById("iron_store").style.display = 'none';
    document.getElementById("result").innerHTML = `
POSSIBLE IRON OVERLOAD<br />
<b>HOLD IRON</b> (if currently receving)<br />
Measure TSAT and ferritin at next routine blood work cycle and reassess iron dosage regimen<br />
Note: Notify MD if Iron Indices remain high for 3 consecutive blood work cycles
`
  }








}