let price = 11.95;
let cid = [
  ["PENNY", 1.01],
  ["NICKEL", 2.05],
  ["DIME", 3.1],
  ["QUARTER", 4.25],
  ["ONE", 90],
  ["FIVE", 55],
  ["TEN", 20],
  ["TWENTY", 60],
  ["ONE HUNDRED", 100],
];
const insufficient = document.getElementById("insufficient");
const check = document.getElementById("check");
const recharge = document.getElementById("recharge");
const input = document.getElementById("cash");
const purchaseBtn = document.getElementById("purchase-btn");
const dueContainer = document.querySelector(".due-container");
const detailsText = document.querySelector(".details-text");
const changeDue = document.getElementById("change-due");
const newTransition = document.querySelector(".new-transaction");
const dividerTransition = document.querySelector(".divider-transaction");
const svgFailed = changeDue.querySelectorAll("div figure svg")[0];
const svgCheck = changeDue.querySelectorAll("div figure svg")[1];
const statusText = changeDue.querySelector("div p");
const alertInsufficient = document.getElementById("text-insufficient");
const changeBreakdown = document.querySelector(".change-breakdown");
const change = document.querySelector(".change");

const cidOriginal = cid.map((item) => [...item]);

class CashRegister {
  constructor(cash, price) {
    this.cash = cash;
    this.price = price;
  }
  cleanOutput() {
    input.value = "";
    cid = cidOriginal.map((item) => [...item]);
    changeDue.style.display = "none";
    dividerTransition.style.display = "none";
    detailsText.style.display = "block";
    svgFailed.style.display = "none";
    svgCheck.style.display = "none";
    statusText.textContent = "Status:";
    alertInsufficient.textContent = "";
    changeBreakdown.style.display = "none";
    change.innerHTML = "";
  }
  insufficientFunds() {
    alert("Customer does not have enough money to purchase the item");
    changeDue.style.backgroundColor = "#ffdada";
    svgFailed.style.display = "block";
    statusText.textContent += " INSUFFICIENT FUNDS";
    changeDue.style.borderColor = "#dbadad";
    alertInsufficient.textContent =
      "Customer does not have enough money to purchase the item";
  }
  checkFunds() {
    alert("No change due - customer paid with exact cash");
    changeDue.style.backgroundColor = "#dae7ff";
    svgCheck.style.display = "block";
    svgCheck.style.stroke = "blue";
    statusText.textContent += " CLOSED";
    changeDue.style.borderColor = "#adbcdb";
    changeBreakdown.style.display = "block";
    change.innerHTML += `
      <p class="not-change">No change due: 0</p>
    `;
  }
  passFunds() {
    let totalCashRegister = 0;
    const dues = {
      "ONE HUNDRED": 0,
      TWENTY: 0,
      TEN: 0,
      FIVE: 0,
      ONE: 0,
      QUARTER: 0,
      DIME: 0,
      NICKEL: 0,
      PENNY: 0,
    };
    const changeToReturn = +(this.cash - this.price).toFixed(2);
    cid.forEach((number) => {
      totalCashRegister += number[1];
    });
    let total = +totalCashRegister.toFixed(2);
    if (total < changeToReturn) {
      this.insufficientFunds();
      return;
    }
    let remaining = changeToReturn;
    while (remaining > 0.001) {
      if (remaining >= 100 && cid[8][1] >= 100) {
        remaining -= 100;
        cid[8][1] -= 100;
        dues["ONE HUNDRED"]++;
      } else if (remaining >= 20 && cid[7][1] >= 20) {
        remaining -= 20;
        cid[7][1] -= 20;
        dues.TWENTY++;
      } else if (remaining >= 10 && cid[6][1] >= 10) {
        remaining -= 10;
        cid[6][1] -= 10;
        dues.TEN++;
      } else if (remaining >= 5 && cid[5][1] >= 5) {
        remaining -= 5;
        cid[5][1] -= 5;
        dues.FIVE++;
      } else if (remaining >= 1 && cid[4][1] >= 1) {
        remaining -= 1;
        cid[4][1] -= 1;
        dues.ONE++;
      } else if (remaining >= 0.25 && cid[3][1] >= 0.25) {
        remaining -= 0.25;
        cid[3][1] -= 0.25;
        dues.QUARTER++;
      } else if (remaining >= 0.1 && cid[2][1] >= 0.1) {
        remaining -= 0.1;
        cid[2][1] -= 0.1;
        dues.DIME++;
      } else if (remaining >= 0.05 && cid[1][1] >= 0.05) {
        remaining -= 0.05;
        cid[1][1] -= 0.05;
        dues.NICKEL++;
      } else if (remaining >= 0.01 && cid[0][1] >= 0.01) {
        remaining -= 0.01;
        cid[0][1] -= 0.01;
        dues.PENNY++;
      } else {
        break;
      }
      remaining = +remaining.toFixed(2);
    }
    changeDue.style.backgroundColor = "#daf5d7";
    changeDue.style.borderColor = "#b2dbad";
    svgCheck.style.display = "block";
    svgCheck.style.stroke = "green";
    statusText.textContent += " OPEN";
    changeBreakdown.style.display = "block";

    change.innerHTML = "";
    for (let [denom, count] of Object.entries(dues)) {
      if (count > 0) {
        const amount = (
          count *
          {
            "ONE HUNDRED": 100,
            TWENTY: 20,
            TEN: 10,
            FIVE: 5,
            ONE: 1,
            QUARTER: 0.25,
            DIME: 0.1,
            NICKEL: 0.05,
            PENNY: 0.01,
          }[denom]
        ).toFixed(2);
        change.innerHTML += `<p class="changes">${denom}: ${count}</p>`;
      }
    }
  }
}

dueContainer.textContent += price;
let cashRegister = null;
input.addEventListener("keydown", (e) => {
  const keysYes = ["Backspace", "ArrowRight", "ArrowLeft"];
  const isNumber = /^[0-9]$/.test(e.key);
  const isDot = e.key === "." && !input.value.includes(".");
  if (!isNumber && !isDot && !keysYes.includes(e.key)) {
    e.preventDefault();
  }
});

const pay = () => {
  const amount = Number(input.value);
  cashRegister = new CashRegister(Number(input.value), price);
  if (input.value === "") {
    alert("The payment field cannot be empty. Please enter the payment.");
    return;
  }
  cashRegister.cleanOutput();
  detailsText.style.display = "none";
  changeDue.style.display = "block";
  dividerTransition.style.display = "block";
  newTransition.style.display = "block";
  if (amount < price) {
    cashRegister.insufficientFunds();
  }
  if (amount === price) {
    cashRegister.checkFunds();
  }
  if (amount > price) {
    cashRegister.passFunds();
  }
};

const reset = () => {
  if (cashRegister) cashRegister.cleanOutput();
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    reset();
    return;
  }
  if (e.key === "Enter") pay();
});

purchaseBtn.addEventListener("click", pay);

newTransition.addEventListener("click", reset);
