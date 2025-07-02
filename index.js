const dropList = document.querySelectorAll(".drop-list select");
const [fromCurrency, toCurrency] = dropList;
const getButton = document.querySelector("form button");
const exchangeRateTxt = document.querySelector(".exchange-rate");
const amountInput = document.querySelector(".amount input");
const exchangeIcon = document.querySelector(".drop-list .icon");




const loadFlag = (element) => {
    const code = element.value;
    const imgTag = element.parentElement.querySelector("img");
    if (countryList[code]) {
        imgTag.src = `https://flagsapi.com/${countryList[code]}/flat/64.png`;
    } else {

        console.warn(`Флаг для валюты ${code} не найден в countryList.`);

    }
};


const getExchangeRate = async () => {
    let amountVal = amountInput.value.trim();
    amountVal = amountVal === "" || amountVal === "0" ? 1 : Number(amountVal);
    amountInput.value = amountVal;

    exchangeRateTxt.innerText = "We get the exchange rate...";
    const url = `https://v6.exchangerate-api.com/v6/cb769f5d01191efad994d65f/latest/${fromCurrency.value}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`HTTP ошибка! Статус: ${response.status}. Сообщение: ${errorData.error_type || 'Неизвестная ошибка API'}`);
        }
        const result = await response.json();


        if (!result.conversion_rates || !result.conversion_rates[toCurrency.value]) {
            throw new Error(`Не удалось получить курс для ${toCurrency.value}. Проверьте правильность кодов валют.`);
        }

        const exchangeRate = result.conversion_rates[toCurrency.value];
        const totalExchangeRate = (amountVal * exchangeRate).toFixed(2);

        exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    } catch (error) {
        exchangeRateTxt.innerText = "Something went wrong. Please try again later..";
        console.error("Error getting exchange rate:", error);
    }
};




dropList.forEach((select, i) => {
    for (const currency_code in countryList) {
        const selected = (i === 0 && currency_code === "USD") || (i === 1 && currency_code === "NPR") ? "selected" : "";
        select.insertAdjacentHTML("beforeend", `<option value="${currency_code}" ${selected}>${currency_code}</option>`);
    }
    select.addEventListener("change", (e) => loadFlag(e.target));
});


getButton.addEventListener("click", (e) => {
    e.preventDefault();
    getExchangeRate();
});


exchangeIcon.addEventListener("click", () => {
    [fromCurrency.value, toCurrency.value] = [toCurrency.value, fromCurrency.value];
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});


window.addEventListener("load", () => {
    loadFlag(fromCurrency);
    loadFlag(toCurrency);
    getExchangeRate();
});
