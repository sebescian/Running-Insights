const form = document.getElementById("paceForm");
const resultDiv = document.getElementById('paceResult');
form.addEventListener("submit", paceCalculator);
function paceCalculator(event) {
event.preventDefault();
const hours = parseInt(document.getElementById('hours').value);
const minutes = parseInt(document.getElementById('minutes').value);
const seconds = parseInt(document.getElementById('seconds').value);
const distance = parseFloat(document.getElementById('distance').value);
console.log("Total time: " + hours + ":" + minutes + ":" + seconds);

const totalTimeInSeconds = hours * 3600 + minutes * 60 + seconds;
// Calculate pace in seconds per distance unit
const paceInSecondsPerUnit = totalTimeInSeconds / distance;

// Convert pace to time format (mm:ss per unit)
const minutesPerUnit = Math.floor(paceInSecondsPerUnit / 60);
const secondsPerUnit = Math.floor(paceInSecondsPerUnit % 60);
const paceFormatted = `${minutesPerUnit}:${secondsPerUnit < 10 ? '0' : ''}${secondsPerUnit}`;

// Display the result
resultDiv.innerHTML = `<h5>You need to run ${paceFormatted}/km to acomplish your target</h5>`;    
}

const adjustmentForm = document.getElementById("paceAdjustmentForm");
adjustmentForm.addEventListener("submit", (event2) => {
    event2.preventDefault();
    let adjustedPace = document.getElementById("paceAdjustmentResult");
    let temperature = parseInt((document.getElementById("temperature").value * 9/5) + 32);
    let dewPoint = parseInt((document.getElementById("dewPoint").value * 9/5) + 32);
    let adjustmentScore = parseFloat(temperature + dewPoint);
    if (adjustmentScore < 180) {
        let adjustmentResult;
        switch (true) {
          case adjustmentScore == 100: adjustmentResult = "No adjustment needed"; break;
          case adjustmentScore >= 101 && adjustmentScore <= 110:
            adjustmentResult = "less than 0.5%";
            break;
          case adjustmentScore >= 111 && adjustmentScore <= 120:
            adjustmentResult = "0.5% to 1%";
            break;
          case adjustmentScore >= 121 && adjustmentScore <= 130:
            adjustmentResult = "1% to 2%";
            break;
          case adjustmentScore >= 131 && adjustmentScore <= 140:
            adjustmentResult = "2% to 3%";
            break;
          case adjustmentScore >= 141 && adjustmentScore <= 150:
            adjustmentResult = "3% to 4.5%";
            break;
          case adjustmentScore >= 151 && adjustmentScore <= 160:
            adjustmentResult = "4.5% to 6%";
            break;
          case adjustmentScore >= 161 && adjustmentScore <= 170:
            adjustmentResult = "6% to 8%";
            break;
          case adjustmentScore >= 171 && adjustmentScore <= 180:
            adjustmentResult = "8% to 10%";
            break;
          default:
            adjustmentResult = "Running not recommended";
        }
        if (adjustmentScore > 100) {
        adjustedPace.innerHTML = `<h5>Pace should be ${adjustmentResult} slower</h5>`;}
        else {
            adjustedPace.innerHTML = `<h5>${adjustmentResult}</h5>`;
        }
      } else if (adjustmentScore > 180) {
        adjustedPace.innerHTML = "<h5>Running not recommended</h5>";
      } 
    
})

let city = document.getElementById("city");
let searchCity = document.getElementById("searchCity");
searchCity.addEventListener("click", function(e) {
  e.preventDefault();
  weatherCheck(city.value);
})

let weatherCheck = async function(cityName) {
  let locationResponse = await axios.get(`http://dataservice.accuweather.com/locations/v1/cities/search?apikey=4btQRbKz7eTzMlu8BoJ6TWg4KtQmJqlc&q=${cityName}`)
  .then(res => {
    return res.data[0].Key;
  })
  .catch(error => {
    console.log(error);
  })
  let locationResult = document.getElementById("locationResult");
  locationResult.innerText = cityName;
  let conditionsResponse = await axios.get(`http://dataservice.accuweather.com/currentconditions/v1/${locationResponse}?apikey=4btQRbKz7eTzMlu8BoJ6TWg4KtQmJqlc`)
  .then(res => {
    console.log(typeof res.data[0].Temperature.Metric.Value);
    return res.data[0].Temperature.Metric.Value;
  })
  .catch(error => {
    console.log(error);
  })
  console.log("type of value for conditionsResponse is: " + conditionsResponse + "which is a:" + typeof conditionsResponse);
  let temperatureResult = document.getElementById("temperatureResult");
  temperatureResult.innerHTML = `${conditionsResponse} °C`;
  let equipmentInfoResponse = document.getElementById("equipmentInfoResponse")
    if (conditionsResponse < -6) {
      equipmentInfoResponse.innerHTML = `
    <ul>
    <li>Base layer: Long-sleeve shirt, tights</li>
    <li>Insulating layer: Fleece, pants</li>
    <li>Protective layer: Lightweight jacket</li>
    <li>Accessories: Hat, two pairs of gloves, neck warmer</li>
    </ul>`;
    } else if (conditionsResponse >= -6 && conditionsResponse < -1) {
      equipmentInfoResponse.innerHTML = `
      <ul>
      <li>Base layer: Long-sleeve shirt, tights (optional)</li>
      <li>Insulating layer: Fleece, pants</li>
      <li>Protective layer: Lightweight jacket</li>
      <li>Accessories: Hat, warm gloves</li>
      </ul>`;
    } else if (conditionsResponse >= -1 && conditionsResponse < 4) {
      equipmentInfoResponse.innerHTML = `
      <ul>
      <li>Base layer: Long-sleeve shirt, running pants (optional)</li>
      <li>Insulating layer: Sweater or fleece</li>
      <li>Protective layer: None</li>
      <li>Accessories: Light gloves, ear warmers</li>
      </ul>`;
    } else if (conditionsResponse >= 4 && conditionsResponse < 10) {
      equipmentInfoResponse.innerHTML = `
      <ul>
      <li>Base layer: Long-sleeved light shirt, short or full-lenght running pants (optional)</li>
      <li>Insulating layer: Light sweater (optional)</li>
      <li>Protective layer: None</li>
      <li>Accessories: None</li>
      </ul>`;
    }
    else {
      equipmentInfoResponse.innerHTML = `
      <ul>
      <li>Base layer: Short-sleeved shirt or tank-top, shorts</li>
      <li>Insulating layer: None</li>
      <li>Protective layer: None</li>
      <li>Accessories: None</li>
      </ul>`;
    }
  }