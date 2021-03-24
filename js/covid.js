window.onload = fillFields();

function fillFields(){
  var sel = document.getElementById("districtSelection").selectedIndex;
  if (sel != 0) {
    document.getElementById("head").innerHTML = "("+document.getElementById('districtSelection').options[sel].text+")"
  } else {
    document.getElementById("head").innerHTML = ""
  }
  Papa.parse("https://raw.githubusercontent.com/dmytro-derkach/covid-19-ukraine/master/cases.csv", {
    download: true,
    complete: function(results) {
      fillSummary(results.data);
      if (new Date(results.data[3][4]).getDate() == new Date().getDate()) {
        document.getElementById("updatedStatus").innerHTML = "(&#10004; оновлено сьогодні)";
      } else {
        document.getElementById("updatedStatus").innerHTML = "(&#10006; оновлено вчора)";
      }
      fillHistory();
    }
  });
}

function fillSummary(results){
  var totalCases = 0;
  var totalActiveCases = 0;
  var totalDeaths = 0;
  var totalRecovered = 0;

  var activeCasesDelta = 0;
  var deathsDelta = 0;
  var recoveredDelta = 0;

  var newCases = 0;

  var sel = document.getElementById("districtSelection").selectedIndex;

  if (sel == 0){
    for (let i = 1; i < 26; i++) {
      totalCases += Number(results[i][7]);
      totalDeaths += Number(results[i][8]);
      totalRecovered += Number(results[i][9]);
      totalActiveCases += Number(results[i][10]);
      newCases += Number(results[i][11]);
      deathsDelta += Number(results[i][12]);
      recoveredDelta += Number(results[i][13]);
      activeCasesDelta += Number(results[i][14]);
    }
  } else {
    totalCases += Number(results[sel][7]);
    totalDeaths += Number(results[sel][8]);
    totalRecovered += Number(results[sel][9]);
    totalActiveCases += Number(results[sel][10]);
    newCases += Number(results[sel][11]);
    deathsDelta += Number(results[sel][12]);
    recoveredDelta += Number(results[sel][13]);
    activeCasesDelta += Number(results[sel][14]);
  }
  document.getElementById("totalCases").innerHTML = new Intl.NumberFormat('ua-UA').format(totalCases);
  document.getElementById("totalActiveCases").innerHTML = new Intl.NumberFormat('ua-UA').format(totalActiveCases);
  document.getElementById("activeCasesDelta").innerHTML = (activeCasesDelta<0?"":"+") + new Intl.NumberFormat('ua-UA').format(activeCasesDelta);
  document.getElementById("newCases").innerHTML = new Intl.NumberFormat('ua-UA').format(newCases);
  document.getElementById("recoveredDelta").innerHTML = new Intl.NumberFormat('ua-UA').format(recoveredDelta);
  document.getElementById("deathsDelta").innerHTML = new Intl.NumberFormat('ua-UA').format(deathsDelta);
  document.getElementById("totalRecovered").innerHTML = new Intl.NumberFormat('ua-UA').format(totalRecovered);
  document.getElementById("totalDeaths").innerHTML = new Intl.NumberFormat('ua-UA').format(totalDeaths);

}


function pad(number) {
  if (number < 10) {
    return '0' + number;
  }
  return number;
}

function fillHistory(){
  var date = new Date();
  var table = document.getElementById("tableHistory"); 

  var totalActiveCases = 0;
  var activeCasesDelta = 0;
  var newCases = 0;

  var tableBody = new Map();
  var tableBodyContent = "";

  var sel = document.getElementById("districtSelection").selectedIndex;

  for (let i = 0; i < 7; i++) {
    date.setDate(date.getDate() - 1);
    var cdate = pad(Number(date.getMonth())+1) + "-" + pad(date.getDate()) + "-"+pad(date.getFullYear()) + ".csv";
    Papa.parse("https://raw.githubusercontent.com/dmytro-derkach/covid-19-ukraine/master/daily_reports/"+cdate, {
      download: true,
      worker: false,
      complete: function(results) {
        totalActiveCases = 0;
        activeCasesDelta = 0;
        newCases = 0;
        results = results.data

        if (sel == 0){
          for (let j = 1; j < 26; j++) {
            totalActiveCases += Number(results[j][10]);
            newCases += Number(results[j][11]);
            activeCasesDelta += Number(results[j][14]);
          }
        } else {
          totalActiveCases += Number(results[sel][10]);
          newCases += Number(results[sel][11]);
          activeCasesDelta += Number(results[sel][14]);
        }

        totalActiveCases = new Intl.NumberFormat('ua-UA').format(totalActiveCases);
        newCases = new Intl.NumberFormat('ua-UA').format(newCases);
        activeCasesDelta = (activeCasesDelta<0?"":"+") + new Intl.NumberFormat('ua-UA').format(activeCasesDelta);

        let idate = new Date();
        idate.setDate(idate.getDate() - (i+1));
        let icdate = pad(Number(idate.getMonth())+1) + "-" + pad(idate.getDate()) + "-"+pad(idate.getFullYear());
        tableBody.set(i, "<tr><th scope='row'>"+icdate+"</th><td>"+newCases+"</td><td>"+activeCasesDelta+"</td><td>"+totalActiveCases+"</td></tr>");
        if (tableBody.size == 7) {
          for (let i = 0; i < 7; i++) {
            tableBodyContent += tableBody.get(i);
          }
          table.innerHTML = tableBodyContent;
        }
      }
    });
  }
}
