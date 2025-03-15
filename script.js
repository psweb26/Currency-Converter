const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");

// Populate dropdowns with currency options
for (let select of dropdowns) {
  for (const currCode in countryList) {
    const newOption = document.createElement("option");
    newOption.textContent = currCode;
    newOption.value = currCode;
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    updateExchangeRate();
  });
}

// Sanitize currency input
const sanitizeInput = (value) => {
  return value.replace(/[^0-9.]/g, ''); // Remove non-numeric characters
};

const updateExchangeRate = async () => {
  try {
    let amtVal = sanitizeInput(amountInput.value);
    if (!amtVal || amtVal < 1) {
      amtVal = "1";
      amountInput.value = "1";
    }

    const from = fromCurr.value.toLowerCase();
    const to = toCurr.value.toLowerCase();
    
    const response = await fetch(`${BASE_URL}/${from}.json`);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    
    const data = await response.json();
    const rate = data[from][to];
    
    if (!rate) throw new Error("Currency pair not supported");
    
    const finalAmount = (parseFloat(amtVal) * rate).toFixed(2);
    msg.innerHTML = `
      <div class="result">
        ${amtVal} ${fromCurr.value} = 
        <span class="highlight">${finalAmount} ${toCurr.value}</span>
      </div>
    `;
  } catch (error) {
    console.error("Fetch error:", error);
    msg.innerHTML = `
      <div class="error">
        ⚠️ Error fetching rates: ${error.message}<br>
        Try using numbers only (e.g., 1000 instead of $1000)
      </div>
    `;
  }
};

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  const img = element.parentElement.querySelector("img");
  if (countryCode) img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  fromCurr.value = "USD";
  toCurr.value = "INR";
  updateFlag(fromCurr);
  updateFlag(toCurr);
  updateExchangeRate();
});



