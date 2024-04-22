document.addEventListener('DOMContentLoaded', function() {
  load();
  includeHTML(); 
});


function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) {
            elmnt.innerHTML = this.responseText;
          }
          if (this.status == 404) {
            elmnt.innerHTML = "Page not found.";
          }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      };
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
}


let menus = [
  {
    image: '',
    category: "Beliebte Rezepte",
    meals: [
      "Pizza Pepperoni",
      "Pizza Cherry and Mozza",
      "Piccolini ala Pumpkin Zatziki",
    ],
    descriptions: [
      "29cm Pizza mit gegrillten gruenen und roten Pepperoni verziert mit einer dezenten Fuellung von Sour Cream",
      "29cm Pizza mit frischen Cherry Tomaten aus dem hauseigenen Garten und Mozzarella aus Milch vom regionalen Bauern",
      "10 Piccolinis mit kleingehackten kuerbis vom Wochenmarkt und einer duennen Schicht Zatziki unter dem Kaese",
    ],
    prices: [14.95, 14.95, 15.95],
  },
  {
    image: ['img/pizza.jpg'],
    category: "Pizzen",
    meals: [
      "Pizza Hollandaise Spezial",
      "Pizza Kreuzviertel",
      "Pizza Greencheese (vegetarisch)",
    ],
    descriptions: [
      "mit Hähnchenfilet, Broccoli und Sauce Hollandaise",
      "mit Salami, Sardellen, Kapern und Peperoni",
      "mit Mozzarella, Spinat, Broccoli und Knoblauch",
    ],
    prices: [12.50, 13.89, 11],
  },
  {
    image: ['img/salad.jpg'],
    category: "Salate",
    meals: ["Insalata Niciose", "Insalata Hawaii", "Insalata Rucola Spezial"],
    descriptions: [
      "mit Oliven, Schafskäse, Schinken, Ei, Artischocken und Thunfisch",
      "mit Mais, Schinken, Hähnchenfilet und Ananas",
      "Rucola mit Cherry-Tomaten, italienischem Hartkäse, Hähnchenfiletstücken, Parmaschinken und roten Zwiebeln, ohne Gurken und Möhren",
    ],
    prices: [9, 8.50, 10],
  },
  {
    image: ['img/piccolini.jpg'],
    category: "Piccolinis",
    meals: [
      "Piccolini Quark-Pizza",
      "Piccolini Kicher-Pilze",
      "Schlemmerknollen",
    ],
    descriptions: [
      "10 Piccolini mit quark, frischen Tomaten, Knoblauch und frischem Basilikum",
      "10 Piccolini aus Kichererbsenmehl mit Champinions und gewuerfelten Tomaten und Paprika",
      "Gefuellte Pizzabroetchen: Lachs, Kaese, einem zarter Hauch von Tomatenmark, Meerrettich und verziert mit Rosmarin, Thymian, Petersilie und Knoblauch - Die Broetchen kommen ueberbacken mit Sonnenblumenkerne  und Monkoerner.",
    ],
    prices: [12.5, 13.50, 15.50],
  },
];


let basketMeals = [];
let basketPrices = [];
let amounts = [];
let singleMealPrice = [];


function filterMeals() {
  let search = document.getElementById('search').value.toLowerCase();

  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    let category = document.getElementById(`category${i}`);
    let categoryImg = document.getElementById(`categoryImg${i}`);

    for (let m = 0; m < menu['meals'].length; m++) {
      let mealName = menu['meals'][m].toLowerCase();
      let mealContainerId = `meal_${i}_${m}`;
      let mealContainer = document.getElementById(mealContainerId);

        if (mealName.includes(search)) {
          mealContainer.classList.add('d-block');
        } else {
          mealContainer.classList.add('d-none');
          category.classList.add('d-none');
          categoryImg.classList.add('d-none');
        }
    }
  }
}


function renderMealsIfNoInput() {
  let search = document.getElementById('search').value.toLowerCase();

  if( search == '') {
    renderMenus();
  }
}


function renderMenus() {
  let menuContent = document.getElementById("menuContent");
  menuContent.innerHTML = "";

  for (let i = 0; i < menus.length; i++) {
    let menu = menus[i];
    menuContent.innerHTML += /*html*/ `
    <img id="categoryImg${i}" class="categoryPicture" src="${menu["image"]}" alt="Food Category Picture">
    
    <div class="categoryTitleContainer" id="category${i}">
        <h3>${menu["category"]}</h3>
    </div>        

    <div id="mealContent${i}" class="mealContent">
    </div>
    `;
    if (!menu["image"]) {
      document.getElementById(`categoryImg${i}`).classList.add("d-none");
  }

  for (let m = 0; m < menu['meals'].length; m++) {
    let mealContent = document.getElementById(`mealContent${i}`);
    mealContent.innerHTML += /*html*/`
        <div id="meal_${i}_${m}" class="mealContainer">
            <div class="mealTitleAndButton">
                <h3 class="mealsTitle">${menu["meals"][m]}</h3>
                <img onclick="addToBasket(${i}, ${m})" class="addButton" src="img/plus.png" alt="Add to basket button">
            </div>
            <p class="mealDescription">${menu["descriptions"][m]}</p>
            <p class="mealPrice">${menu["prices"][m]} €</p>
        </div>
    `;
  }
  }
  headerBasketCount();
}


function renderBasket() {
  visibleBasketSectionForLargeScreen();
  renderBasketStandardHTML();
  let basket = document.getElementById('basket');
  let costsContainer = document.getElementById('costsContainer');
  
    if (basketMeals != '') {
      costsContainer.classList.remove('z-1');
      basket.innerHTML = '';
      for (let b = 0; b < basketMeals.length; b++) {
        basket.innerHTML += /*html*/ `
        <div class="addedMealContainer">
          <div class="basketAmountsAndMealsContainer">
            <p class="basketAmounts">${amounts[b]}x</p>
            <p class="basketMeals">${basketMeals[b]}</p>
          </div>
          <div class="basketOptionsAndPriceContainer">
          <div class="basketOptionsContainer">
            <div onclick="addSameItem(${b})" class="plusminus">+</div>
            <div onclick="minusOneSameItem(${b})" class="plusminus">-</div>
            <img class="trashAndPenIcon" src="img/pen.png" alt="Pen Icon">
            <img onclick="deleteItem(${b})" class="trashAndPenIcon" src="img/trash.png" alt="Trash Can">
          </div>
            <p class="basketMealPrice">${basketPrices[b]} €</p>
          </div>
        </div>
        `;
      }
      if (!document.getElementById('sumTable') == true) {
      costsContainer.innerHTML += /*html*/`

          <table id="sumTable" class="sumTable">
            <tr class="spaceBetween">
              <td class="subtotal margin-bottom">Zwischensumme</td>
              <td id="subtotal" class="subtotal margin-bottom"></td>
            </tr>
            <tr class="spaceBetween">
              <td class="deliveryCost margin-bottom">Lieferkosten</td>
              <td class="deliveryCost margin-bottom">2 €</td>
            </tr>
            <tr class="spaceBetween">
              <td class="total margin-bottom">Gesamtkosten</td>
              <td class="total margin-bottom" id="total"></td>
            </tr>
          </table>


        <div id="minimumCondition">
          <p>Leider kannst du noch nicht bestellen, Micharando liefert erst ab einem Mindestbestellwert von 20 € (exclusive Lieferkosten).</p>
          <button class="blankButton">Bestellen</button>
        </div>
      `;}
    subtotal();
    minimumCondition();
    headerBasketCount();
    save();
    } else if (basketMeals == '') {
      renderBasketFiller();
    }
}


function visibleBasketSectionForLargeScreen() {
  if (window.innerWidth >= 1390) {
    let basketSection = document.getElementById('basketSection');
    basketSection.classList.remove('z-1', 'v-hidden');
  }
}


function renderBasketStandardHTML() {
  let basketSection = document.getElementById('basketSection');

  basketSection.innerHTML = /*html*/`
  <div class="basketTitleAndCloseButtonContainer">
      <h3 class="basketTitle">Warenkorb</h3>
      <img onclick="closeBasketForMobile()" src="img/closeButton.png" class="closeBasketButton" alt="close basket button">
  </div>

  <div id="basket">
      <div id="basketFiller">
          <img class="bagImg" src="img/bag.png" alt="Basket">
          <h2 id="basketFillerTitle">Warenkorb</h2>
          <p>Fuege Leckereien deinem Warenkorb hinzu, indem du auf das Plussymbol der Gerichte im Menue klickst.</p>
      </div>
  </div>

  <div id="costsContainer" class="costsContainer">
      
  </div>

  </section>
  `;
}


function renderBasketFiller() {
    let basket = document.getElementById('basketSection');
    let costsContainer = document.getElementById('costsContainer');

    costsContainer.classList.add('z-1');
    basket.innerHTML = /*html*/`
    <div class="basketTitleAndCloseButtonContainer">
      <img onclick="closeBasketForMobile()" src="img/closeButton.png" class="closeBasketButton" alt="close basket button">
    </div>
    <div id="basketFiller">
      <h3 class="basketTitle">Warenkorb</h3>
      <img class="bagImg" src="img/bag.png" alt="Basket">
      <p>Fuege Leckereien deinem Warenkorb hinzu, indem du auf das Plussymbol der Gerichte im Menue klickst.</p>
    </div>
    `;
    subtotal();
}


function headerBasketCount() {
  let basketCount = document.getElementById('basketCount');
  let total = 0; 

  for (let c = 0; c < amounts.length; c++) {
    total += parseFloat(amounts[c]); 
  }

  if (window.innerWidth <= 1390) {

  basketCount.innerHTML = `${total}`;
  } else {
    basketCount.classList.add ('d-none');
    }

  if (basketMeals.length === 0) {
    basketCount.classList.add('v-hidden');
  } else {
      basketCount.classList.remove('v-hidden');
      }

}


function openBasketForMobile() {
  let basketSection = document.getElementById('basketSection');
  let mainBoard = document.getElementById('mainBoard');
  let greyBackground = document.getElementById('greyBackground');

  basketSection.classList.remove('z-1', 'v-hidden');

  if ( window.innerWidth >= 481 && window.innerWidth <= 1389) {
    greyBackground.classList.remove('d-none');
  } else if (greyBackground) {
      greyBackground.classList.add('d-none');
    } 
    
  if (window.innerWidth <= 480) { 
        mainBoard.classList.add('d-none');
  }

  renderBasket();
}


function closeBasketForMobile() {
  let basketSection = document.getElementById('basketSection');
  let mainBoard = document.getElementById('mainBoard');
  let greyBackground = document.getElementById('greyBackground');

  basketSection.classList.add('z-1', 'v-hidden');

  if ( window.innerWidth >= 481 && window.innerWidth <= 1389) {
    greyBackground.classList.add('d-none');
  } else if (window.innerWidth <= 480) { 
    mainBoard.classList.remove('d-none');
    }

  headerBasketCount();
}


function minimumCondition() {
  let minimumCondition = document.getElementById('minimumCondition');
  let subtotal = document.getElementById('subtotal');
  let subtotalOnlyNumber = parseFloat(subtotal.innerText.replace(/[^0-9.,]/g, ""));

  if ( subtotalOnlyNumber >= 20 ){
  minimumCondition.innerHTML = '<button onclick="orderConfirmation()" id="orderButton">Bestellen</button>';
  }
}


function orderConfirmation() {
  let total = document.getElementById('total');
  totalAsNumber = parseFloat(total.innerText.replace(/[^0-9.,]/g, ""));

  if (totalAsNumber >= 300) {
    alert("Wir moechten Sie darueber informieren, dass ihre Bestellung auf Grund ihrer Hoehe mehr Zeit in Anspruch nehmen wird als ueblich. Bitte nehmen Sie Kontakt mit uns auf um die Lieferzeit zu besprechen. Wir haben ihre Bestellung dokumentiert aber wir werden mit der Zubereitung noch warten bis Sie uns kontaktieren.");
  }
  else {
    alert("Vielen Dank fuer deine Bestellung! Dein Gericht befindet sich nun in der Zubereitung und wird dir so schnell wie moeglich an deine angegebene Adresse geliefert.");
    amounts = [];
    basketMeals = [];
    basketPrices = [];
    singleMealPrice = [];
    save();
    renderBasket();
    document.getElementById('basketSection').innerHTML = 
    `<h2>Vielen Dank!</h2>
    <p>Vielen Dank fuer deine Bestellung! Dein Gericht befindet sich nun in der Zubereitung und wird dir so schnell wie moeglich an deine angegebene Adresse geliefert. Du erhaelst in Kuerze eine Bestaegigungs-Email von uns in deinem Postfach.</p>`;
    }
}


function minusOneSameItem(b) {
  if(amounts[b] > 1) {
  amounts[b]--;
  basketPrices[b] -= singleMealPrice[b];
  basketPrices[b] = parseFloat(basketPrices[b].toFixed(2));
  } else if (amounts[b] == 1) {
    deleteItem(b);
    }
    renderBasket();
}


function deleteItem(b) {
  let basket = document.getElementById('basket');

  amounts.splice([b], 1);
  basketPrices.splice([b], 1);
  basketMeals.splice([b], 1);
  singleMealPrice.splice([b], 1);
  if (basketMeals == '') {
    basket.innerHTML = `        
    <div id="basketFiller">
    <img class="bagImg" src="img/bag.png" alt="Basket">
    <h2>Warenkorb</h2>
    <p>Fuege Leckereien deinem Warenkorb hinzu, indem du auf das Plussymbol der Gerichte im Menue klickst.</p>
    </div>
    `;
  }
  save();
  load();
  subtotal();
  renderBasket();
}


function addSameItem(b) {
  amounts[b]++;
  basketPrices[b] += singleMealPrice[b];
  basketPrices[b] = parseFloat(basketPrices[b].toFixed(2));
  renderBasket();
}


function addToBasket(i, m) {
  let menu = menus[i];

  if (!basketMeals.includes(menu['meals'][m])) {
      basketMeals.push(menu['meals'][m]);
      basketPrices.push(menu['prices'][m]);
      singleMealPrice.push(menu['prices'][m]);
      amounts.push(1);    
  } else {
      let basketIndex = basketMeals.findIndex(meal => meal === menu['meals'][m]);
      amounts[basketIndex]++;
      basketPrices[basketIndex] += menu['prices'][m];
      basketPrices[basketIndex] = parseFloat(basketPrices[basketIndex].toFixed(2));
    }
  save();

  if (window.innerWidth >= 1390) {
    renderBasket();
  } else {
    headerBasketCount();
    }
}


function subtotal() {
  let subtotalSum = 0;
  for (let i = 0; i < basketPrices.length; i++) {

  subtotalSum += basketPrices[i];

  document.getElementById('subtotal').innerHTML = `${subtotalSum.toFixed(2)} €`;
  total(subtotalSum);
  }
}


function total(subtotalSum) {
  let total = document.getElementById('total');
  let deliveryCost = 2;
  let num = subtotalSum + deliveryCost;
  total.innerHTML = `${num.toFixed(2)} €`;
}


function save(){
  let basketMealsAsText = JSON.stringify(basketMeals);
  let basketPricesAsText = JSON.stringify(basketPrices);
  let amountsAsText = JSON.stringify(amounts);
  let singleMealPriceAsText = JSON.stringify(singleMealPrice);

  localStorage.setItem('Basket Meals', basketMealsAsText);
  localStorage.setItem('Basket Prices', basketPricesAsText);
  localStorage.setItem('Amounts', amountsAsText);
  localStorage.setItem('Single Meal Price', singleMealPriceAsText);
}


function load() {
  let basketMealsAsText = localStorage.getItem('Basket Meals');
  let basketPricesAsText = localStorage.getItem('Basket Prices');
  let amountsAsText = localStorage.getItem('Amounts');
  let singleMealPriceAsText = localStorage.getItem('Single Meal Price');

  if ( basketMealsAsText) {
  basketMeals = JSON.parse(basketMealsAsText);
  basketPrices = JSON.parse(basketPricesAsText);
  amounts = JSON.parse(amountsAsText);
  singleMealPrice = JSON.parse(singleMealPriceAsText);
  }
}