// #0 констатнты
const API_KEY = '16db09cd05df8127e37aec85';
const getUrl = (currency) => `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${currency}`


// #1 Получаем элементы
const mainBlock = document.querySelector('.main');
const leftInput = document.querySelector('.left-input');
const rightInput = document.querySelector('.right-input');
const revers = document.querySelector('.revers');

let leftPanelBlock;
let rightPanelBlock;


// #2 Состояние
const leftPanelCurrencies = [
    {
        "currency": "USD",
        "checked": true
    },
    {
        "currency": "EUR",
        "checked": false
    },
    {
        "currency": "GBP",
        "checked": false
    },
    {
        "currency": "RUB",
        "checked": false
    }
];


const rightPanelCurrencies = [
    {
        "currency": "RUB",
        "checked": true
    },
    {
        "currency": "USD",
        "checked": false
    },
    {
        "currency": "EUR",
        "checked": false
    },
    {
        "currency": "GBP",
        "checked": false
    }
];

let CONVERSION_RATES;
let isLeftModalOpen = false;
let isRightModalOpen = false;


// #3 Вспомогательные функции
const getLeftSelectedCurrency = () => leftPanelCurrencies.filter(({ checked }) => checked)[0].currency; 

const getRightSelectedCurrency = () => rightPanelCurrencies.filter(({ checked }) => checked)[0].currency;

const rerenderLeftPanel = () => {
    const left = document.querySelector('.currency-left');
    const content = `
            ${leftPanelCurrencies.map(({ currency, checked }) =>
                `<div data-currency="${currency}" class="currency__item ${checked ? "currency-checked" : ""}">${currency}</div>`
            ).join('')}
     
            <div class="currency__item material-symbols-outlined left__arrow__down">arrow_downward</div>
            `
            
    if (left) {
        left.innerHTML = content
    } else {
        return `<div class="currency-left">${content}</div>`
    }
};

const renderLeftBox = () => {
    const leftBox = document.createElement('div');
    leftBox.classList.add('box-currency-left');

    leftBox.innerHTML = `
        <h4>У меня есть</h4>
        ${rerenderLeftPanel()}
     `;

    mainBlock.insertAdjacentElement('afterbegin', leftBox);

    leftPanelBlock = leftBox;
};



const rerenderRightPanel = () => {
    const right = document.querySelector('.currency-right');
    const content = `
        ${rightPanelCurrencies.map(({ currency, checked }) =>
            `<div data-currency="${currency}" class="currency__item ${checked ? "currency-checked" : ""}">${currency}</div>`
        ).join('')}
    
        <div class="currency__item material-symbols-outlined left__arrow__down">arrow_downward</div>
        `;

    if (right) {
        right.innerHTML = content
    } else {
        return `<div class="currency-right">${content}</div>`
    }
};
const renderRightBox = () => {
    const rightBox = document.createElement('div');
    rightBox.classList.add('box-currency-right');

    rightBox.innerHTML = `
        <h4>Хочу приобрести</h4>

        ${rerenderRightPanel()}
        </div>    
`;

    rightPanelBlock = rightBox;
    mainBlock.insertAdjacentElement('afterbegin', rightBox);
};

renderRightBox();
renderLeftBox();

// #4 Основные функции, отвечающие за логику приложения

const getData = async () => {
    const leftSelectedCurrency = getLeftSelectedCurrency();
    const rightSelectedCurrency = getRightSelectedCurrency();

    const URL = getUrl(leftSelectedCurrency);
    // console.log('### URL', URL);

    const response = await fetch(URL);
    const { conversion_rates } = await response.json();
    CONVERSION_RATES = conversion_rates;
    console.log('### conversion_rates', conversion_rates);

    rightInput.value = leftInput.value * CONVERSION_RATES[rightSelectedCurrency];
};

getData();

leftPanelBlock.addEventListener('click', (event) => {
    if (event.target.classList.contains('currency-checked')) return;

    const selectedCurrency = event.target.dataset.currency
    leftPanelCurrencies.forEach(({ currency, checked  }, index) =>
        leftPanelCurrencies[index].checked = currency === selectedCurrency
    );

    rerenderLeftPanel();
    getData();
});

rightPanelBlock.addEventListener('click', (event) => {
    if (event.target.classList.contains('currency-checked')) return;

    const selectedCurrency = event.target.dataset.currency;
    rightPanelCurrencies.forEach(({ currency, checked  }, index) =>
        rightPanelCurrencies[index].checked = currency === selectedCurrency
    );

    rerenderRightPanel();
    rightInput.value = leftInput.value * CONVERSION_RATES[selectedCurrency];
});

leftInput.addEventListener('input', (event) => {
    const rightCurrency = getRightSelectedCurrency();

    const newValue = leftInput.value;
    console.log('### newValue', newValue);
    rightInput.value = newValue * CONVERSION_RATES[rightCurrency];
});

                    // REVERS
revers.addEventListener('click', (event) => {
    // Меняем местами значения input
    const tempInputValue = leftInput.value;
    leftInput.value = rightInput.value;
    rightInput.value = tempInputValue;

    // Меняем местами панели валют
    let temp1;
    let temp2;
    rightPanelCurrencies.forEach((item, index) => {
        if (item.checked) {
            rightPanelCurrencies[index].checked = false;
            temp1 = rightPanelCurrencies[index].currency;
        };
    });
    

    leftPanelCurrencies.forEach((item, index) => {
        if (item.checked) {
            leftPanelCurrencies[index].checked = false;
            temp2 = leftPanelCurrencies[index].currency;
        };
    });

    rightPanelCurrencies.forEach((item) => item.currency === temp2 ? item.checked = true : "");
    leftPanelCurrencies.forEach((item) => item.currency === temp1 ? item.checked = true : "");

    // Повторно отрендерим обе панели
    rerenderLeftPanel();
    rerenderRightPanel();
});

// TODO LIST
// TODO: обработчик события на стрелку reverse (по середине)
// TODO: модальное окно и логика выбора новый валюты (встаёт в конец панели + эта валюта становится выбрана)
// TODO: обработать запрет на ввод букв в каждый инпут
// TODO: красивое форматирование чисел в инпутах (Intl.NumberFormat) + только 2 числа после точки
// TODO: красивая вёрстка!!!

// !!! !!! !!! DIMA !!! !!! !!!
// {
// const currencyRight = document.querySelector('.currency-right');
// const currencyLeft = document.querySelector('.currency-left');
//
// const leftArrowDown = document.querySelector('.left__arrow__down');
// const rightArrowDown = document.querySelector('.right__arrow__down');
//
// const rightDisplay = document.querySelector('.right-input');
// const leftDisplay = document.querySelector('.left-input');
// const reverse = document.querySelector('.revers');
// const calc__period = document.querySelector('.calc__period');


// let stateToReverseLeft = 'USD';
// let stateToReverseRight = 'RUB';
// let selectedCurrencyCentr = '';
// ////////////////////////////////////////////////////////////////////////////////////////////
// // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ (ПЕРЕКЛЮЧАТЬ РАСШИРЕННЫЙ БЛОК ВАЛЮТ)
// // Новая дата
// let date = new Date();
// let year = date.getFullYear();
// let month = date.getMonth() + 1;
// let day = date.getDate();
// let formattedDate = year + '-' + month + '-' + day;
// calc__period.innerHTML += `${formattedDate}`;
//
//
// // Функция которая создает (modalWindow) для левой и правой стрелки
// const toggleExtendedCurrenciesBlock = () => {
//     if (isLeftModalOpen || isRightModalOpen) {
//         const block = document.createElement("div");
//         block.className = "modalWindow";
//         const calcCurrencyColumnLeft = `div class="calc__currency__column__left"
//             <div class="modalLeft RUB">Российский рубль<div class="modalLeft" style="font-weight: bold;">RUB</div></div>
//             <div class="modalLeft USD">Доллар США<div class="modalLeft" style="font-weight: bold;">USD</div></div>
//             <div class="modalLeft EUR">Евро<div class="modalLeft" style="font-weight: bold;">EUR</div></div>
//             <div class="modalLeft GBP">Фунт стерлингов<div class="modalLeft" style="font-weight: bold;">GBP</div></div>
//             <div class="modalLeft AUD">Австралийский доллар<div class="modalLeft" style="font-weight: bold;">AUD</div></div>
//             <div class="modalLeft AZN">Азербаджанский манат<div class="modalLeft" style="font-weight: bold;">AZN</div></div>
//             <div class="modalLeft AMD">Армянский драм<div class="modalLeft" style="font-weight: bold;">AMD</div></div>
//             <div class="modalLeft BYN">Белорусский рубль<div class="modalLeft" style="font-weight: bold;">BYN</div></div>
//             <div class="modalLeft BGN">Болгарский лев<div class="modalLeft" style="font-weight: bold;">BGN</div></div>
//             <div class="modalLeft BRL">Бразильский реал<div class="modalLeft" style="font-weight: bold;">BRL</div></div>
//             <div class="modalLeft HUF">Венгерский форинт<div class="modalLeft" style="font-weight: bold;">HUF</div></div>
//         </div>
//
//         <div class="calc__currency__column__centr">
//             <div class="modalLeft KRW">Вон Республики Корея<div class="modalLeft" style="font-weight: bold;">KRW</div></div>
//             <div class="modalLeft DKK">Датская крона<div class="modalLeft" style="font-weight: bold;">DKK</div></div>
//             <div class="modalLeft INR">Индийская рупия<div class="modalLeft" style="font-weight: bold;">INR</div></div>
//             <div class="modalLeft KZT">Казахстанский тенге<div class="modalLeft" style="font-weight: bold;">KZT</div></div>
//             <div class="modalLeft CAD">Канадский доллар<div class="modalLeft" style="font-weight: bold;">CAD</div></div>
//             <div class="modalLeft KGS">Киргизский сом<div class="modalLeft" style="font-weight: bold;">KGS</div></div>
//             <div class="modalLeft CNY">Китайский юань<div class="modalLeft" style="font-weight: bold;">CNY</div></div>
//             <div class="modalLeft MDL">Молдавсский лей<div class="modalLeft" style="font-weight: bold;">MDL</div></div>
//             <div class="modalLeft RON">Новый румынский лей<div class="modalLeft" style="font-weight: bold;">RON</div></div>
//             <div class="modalLeft TMT">Новый туркменский манат<div class="modalLeft" style="font-weight: bold;">TMT</div></div>
//             <div class="modalLeft NOK">Норвежская крона<div class="modalLeft" style="font-weight: bold;">NOK</div></div>
//         </div>
//
//         <div class="calc__currency__column__right">
//             <div class="modalLeft PLN">Польский злотый<div class="modalLeft" style="font-weight: bold;">PLN</div></div>
//             <div class="modalLeft SGD">Сингапурский доллар<div class="modalLeft" style="font-weight: bold;">SGD</div></div>
//             <div class="modalLeft TJS">Таджикский сомони<div class="modalLeft" style="font-weight: bold;">TJS</div></div>
//             <div class="modalLeft TRY">Турецская лира<div class="modalLeft" style="font-weight: bold;">TRY</div></div>
//             <div class="modalLeft UZS">Узбекский сум<div class="modalLeft" style="font-weight: bold;">UZS</div></div>
//             <div class="modalLeft UAH">Украинская гривна<div class="modalLeft" style="font-weight: bold;">UAH</div></div>
//             <div class="modalLeft CZK">Чешская крона<div class="modalLeft" style="font-weight: bold;">CZK</div></div>
//             <div class="modalLeft SEK">Шведская крона<div class="modalLeft" style="font-weight: bold;">SEK</div></div>
//             <div class="modalLeft CHF">Швецарский франк<div class="modalLeft" style="font-weight: bold;">CHF</div></div>
//             <div class="modalLeft ZAR">Южноафриканский ренд<div class="modalLeft" style="font-weight: bold;">ZAR</div></div>
//             <div class="modalLeft JPY">Японская иена<div class="modalLeft" style="font-weight: bold;">JPY</div></div>
//         </div>`
//         block.insertAdjacentHTML('beforeend', calcCurrencyColumnLeft);
//         currencyRight.appendChild(block);
//     } else {
//         document.querySelector('.modalWindow').remove();
//         // block.remove();
//     };
//
// };
//
//
// // Добавление цвета выбраннам ячейкам
// const fanctionOfAddColorGreen = (name) => {
//     const pizduks =  name.parentNode.children;
//     for (let i = 0; i < pizduks.length; i++){
//     pizduks[i].classList.remove('colorGreen')
// }
//     name.classList.add('colorGreen')
// };
//
// //Выбор базовой (изначальной) валюты
// const selecCurrencyDefolt = () => {
//     currencyLeft.children[0].classList.add('colorGreen');
//     currencyRight.children[0].classList.add('colorGreen');
// };
// selecCurrencyDefolt();
// ////////////////////////////////////////////////////////////////////////////////////////////
//
// // ОСНОВНАЯ ЛОГИКА
// // Выбор валюты с левой стороны
// currencyLeft.addEventListener('click', (event) => {
//     if (document.querySelector('.modalWindow')) {
//         document.querySelector('.modalWindow').remove();
//     }
//     if (event.target.classList.contains('left__arrow__down')) {
//         rightArrowDown.innerText = 'arrow_downward';
//         isLeftModalOpen = !isLeftModalOpen;
//         leftArrowDown.innerText = isLeftModalOpen ? 'arrow_upward' : 'arrow_downward';
//         toggleExtendedCurrenciesBlock();
//         fanctionOfAddColorGreen(event.target);
//     }
//     if (event.target.classList.contains('USD')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseLeft = 'USD';
//     } else if (event.target.classList.contains('EUR')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseLeft = 'EUR';
//     } else if (event.target.classList.contains('GBP')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseLeft = 'GBP';
//     } else if (event.target.classList.contains('RUB')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseLeft = 'RUB';
//     } else {
//         getCurrencyOfTheModalWindow();
//     }
// });
//
// // Выбор валюты с правой стороны
// currencyRight.addEventListener('click', (event) => {
//     if (document.querySelector('.modalWindow')) {
//         document.querySelector('.modalWindow').remove();
//     }
//
//     if (event.target.classList.contains('right__arrow__down')) {
//         leftArrowDown.innerText = 'arrow_downward';
//         isRightModalOpen = !isRightModalOpen;
//         rightArrowDown.innerText = isRightModalOpen ? 'arrow_upward' : 'arrow_downward';
//         toggleExtendedCurrenciesBlock();
//         fanctionOfAddColorGreen(event.target);
//     };
//
//     if (event.target.classList.contains('USD')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseRight = 'USD';
//     } else if (event.target.classList.contains('EUR')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseRight = 'EUR';
//         conversionRrates(event.target);
//         alert('re-re')
//     } else if (event.target.classList.contains('GBP')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseRight = 'GBP';
//     } else if (event.target.classList.contains('RUB')) {
//         fanctionOfAddColorGreen(event.target);
//         stateToReverseRight = 'RUB';
//     } else {
//         getCurrencyOfTheModalWindow();
//     }
// });
//
//
//
// // Выбор валюты из modalWindow
// const getCurrencyOfTheModalWindow = () => {
//     isLeftModalOpen = true;
//     toggleExtendedCurrenciesBlock();
//     const main = document.querySelector('.modalWindow');
//     main.addEventListener('click', (event) => {
//         selectedCurrencyCentr = event.target.lastChild.innerText;
//         conversionRrates(selectedCurrencyCentr);
//     });
//     return selectedCurrencyCentr;
// };
// // getCurrencyOfTheModalWindow();
// // alert(selectedCurrencyCentr)
// // console.log(selectedCurrencyCentr)
//
// // Функция Reverse
// const reversClassas = () => {
//     let tempLeft = '';
//     let tempRight = '';
//
//     const currencyLeft__Children = Array.from(currencyLeft.children);
//     currencyLeft__Children.forEach((element) => {
//         if (element.classList.contains('colorGreen')){
//             tempLeft = element.innerText;
//             element.classList.remove('colorGreen')
//         }
//     })
//
//     const currencyRight__Children = Array.from(currencyRight.children);
//     currencyRight__Children.forEach((element) => {
//         if (element.classList.contains('colorGreen')){
//             tempRight = element.innerText;
//             element.classList.remove('colorGreen')
//         }
//     })
//
//     currencyLeft__Children.forEach((element) => {
//         if (element.innerText === tempRight){
//             element.classList.add('colorGreen')
//         }
//     })
//
//     currencyRight__Children.forEach((element) => {
//         if (element.innerText === tempLeft){
//             element.classList.add('colorGreen')
//         }
//     });
// };
//
// // REVERSE Inputs
// const reversInput = () => {
//     let valueRightDisplay = rightDisplay.value;
//     rightDisplay.value = leftDisplay.value;
//     leftDisplay.value = valueRightDisplay;
// };
//
// // Input-ы
// // Отображение курсов на экранах с левой и правой стороны
// rightDisplay.value = 8800;
//
// // REVERSE Сама механика
// reverse.addEventListener('click', () => {
//     reversInput();
//     reversClassas();
//     reversInputsInfo();
// });
//
//
//
// // Отправление запроса
// const conversionRrates = async (currency = 'USD') =>
// {
//     try
//     {
//         const response = await fetch(`https://v6.exchangerate-api.com/v6/16db09cd05df8127e37aec85/latest/${currency}`)
//         const data = await response.json();
//         console.log(data, 'data#####')
//         // левый input для ввода количество денег
//
//         // Обработчик события на считывания введенного количество денег
//         leftDisplay.addEventListener('input', () => {
//             conversionRrates();
//         });
//         // отображение введенного кол-во денег с левой стороны на правом input
//         rightDisplay.value = (leftDisplay.value * data.conversion_rates[stateToReverseRight]).toFixed(3);
//         // rightDisplay.toFixed(3);
//         // уточнение курса 1 валюты к другой, соотношение (ЛЕВАЯ сторона)
//         const currencyInfoLeft = document.querySelector('.js-converter-rate-from-left');
//         currencyInfoLeft.innerHTML = `1  ${stateToReverseLeft} = ${data.conversion_rates[stateToReverseRight].toFixed(3)} ${" " + stateToReverseRight} `
//         // уточнение курса 1 валюты к другой, соотношение (ПРАВАЯ сторона)
//         const currencyInfoRight = document.querySelector('.js-converter-rate-from-right');
//         let divideTheRubleByTheDollar = data.conversion_rates[stateToReverseLeft] / data.conversion_rates[stateToReverseRight];
//         currencyInfoRight.innerHTML = `1 ${stateToReverseRight} = ${divideTheRubleByTheDollar.toFixed(3)} ${" " + stateToReverseLeft}`;
//
//         // Отлавливаем ошибки
//     } catch (e)
//     {
//         console.log(e, 'Ошибка, ищем!');
//     }
// }
// conversionRrates();
//
//
// // function  reversInputsInfo(params) {
// //     let divideTheRubleByTheDollar = data.conversion_rates[stateToReverseLeft] / data.conversion_rates[stateToReverseRight];
// //         const currencyInfoLeft = document.querySelector('.js-converter-rate-from-left');
// //         currencyInfoLeft.innerHTML = `1 ${stateToReverseRight} = ${divideTheRubleByTheDollar.toFixed(3)} ${" " + stateToReverseLeft}`;
//
// //         const currencyInfoRight = document.querySelector('.js-converter-rate-from-right');
// //         currencyInfoRight.innerHTML = `1  ${stateToReverseLeft} = ${data.conversion_rates[stateToReverseRight].toFixed(3)} ${" " + stateToReverseRight}`;
// //         console.log(currencyInfoLeft, 'currencyInfoLeft###');
// //         console.log(currencyInfoRight, 'currencyInfoRight###');
// //     };
//
//
// // Обработчик события на modalWindow, если нажать на другую область, то он должен скрыться
// document.addEventListener('click', (event) => {
//     if (event.target.closest('.currency-left') || event.target.closest('.currency-right')) {
//         return;
//     }
//     if (isLeftModalOpen || isRightModalOpen) {
//         if (!event.target.closest('.modalWindow')) {
//             isLeftModalOpen = false;
//             isRightModalOpen = false;
//             rightArrowDown.innerText = 'arrow_downward';
//             leftArrowDown.innerText = 'arrow_downward';
//             toggleExtendedCurrenciesBlock();
//         }
//     }
// });
//

