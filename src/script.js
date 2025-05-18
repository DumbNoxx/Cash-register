let price = 1.87;
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

dueContainer.textContent += price;
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
  if (input.value === "") {
    alert("The payment field cannot be empty. Please enter the payment.");
    return;
  }
  input.value = "";
  changeDue.style.display = "none";
  dividerTransition.style.display = "none";
  detailsText.style.display = "block";
  svgFailed.style.display = "none";
  svgCheck.style.display = "none";
  statusText.textContent = "Status:";
  alertInsufficient.textContent = "";
  changeBreakdown.style.display = "none";

  detailsText.style.display = "none";
  changeDue.style.display = "block";
  dividerTransition.style.display = "block";
  newTransition.style.display = "block";
  if (amount < price) {
    alert("Customer does not have enough money to purchase the item");
    changeDue.style.backgroundColor = "#ffdada";
    svgFailed.style.display = "block";
    statusText.textContent += " INSUFFICIENT FUNDS";
    alertInsufficient.textContent =
      "Customer does not have enough money to purchase the item";
    return;
  }
  if (amount === price) {
    alert("No change due - customer paid with exact cash");
    changeDue.style.backgroundColor = "#dae7ff";
    svgCheck.style.display = "block";
    statusText.textContent += " CLOSED";
    changeBreakdown.style.display = "block";
  }
};

const reset = () => {
  input.value = "";
  changeDue.style.display = "none";
  dividerTransition.style.display = "none";
  detailsText.style.display = "block";
  svgFailed.style.display = "none";
  svgCheck.style.display = "none";
  statusText.textContent = "Status:";
  alertInsufficient.textContent = "";
  changeBreakdown.style.display = "none";
};

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") pay();
});

purchaseBtn.addEventListener("click", pay);

newTransition.addEventListener("click", reset);
