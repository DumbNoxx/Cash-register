// Define the price of the item and the cash-in-drawer (cid) array representing the cash register's contents.
// Each element in the cid array represents a denomination and the total amount available for that denomination.
let price = 11.95;
let cid = [
  ["PENNY", 1.01], // Pennies available in the register.
  ["NICKEL", 2.05], // Nickels available in the register.
  ["DIME", 3.1], // Dimes available in the register.
  ["QUARTER", 4.25], // Quarters available in the register.
  ["ONE", 90], // One-dollar bills available in the register.
  ["FIVE", 55], // Five-dollar bills available in the register.
  ["TEN", 20], // Ten-dollar bills available in the register.
  ["TWENTY", 60], // Twenty-dollar bills available in the register.
  ["ONE HUNDRED", 100], // Hundred-dollar bills available in the register.
];

// Cache DOM elements for interaction and display purposes.
// These elements are used to update the UI dynamically based on user actions and transaction results.
const insufficient = document.getElementById("insufficient"); // Element to display insufficient funds message.
const check = document.getElementById("check"); // Element to display successful transaction status.
const recharge = document.getElementById("recharge"); // Element to reset the cash register (not implemented in this code).
const input = document.getElementById("cash"); // Input field for the customer to enter the payment amount.
const purchaseBtn = document.getElementById("purchase-btn"); // Button to initiate the payment process.
const dueContainer = document.querySelector(".due-container"); // Container to display the price of the item.
const detailsText = document.querySelector(".details-text"); // Text element providing transaction details.
const changeDue = document.getElementById("change-due"); // Container to display the status of the transaction.
const newTransition = document.querySelector(".new-transaction"); // Button to start a new transaction.
const dividerTransition = document.querySelector(".divider-transaction"); // Divider element for UI separation.
const svgFailed = changeDue.querySelectorAll("div figure svg")[0]; // SVG icon for failed transactions.
const svgCheck = changeDue.querySelectorAll("div figure svg")[1]; // SVG icon for successful transactions.
const statusText = changeDue.querySelector("div p"); // Paragraph element to display the transaction status.
const alertInsufficient = document.getElementById("text-insufficient"); // Element to display insufficient funds alert.
const changeBreakdown = document.querySelector(".change-breakdown"); // Container to display the breakdown of change.
const change = document.querySelector(".change"); // Element to display the denominations and amounts of change returned.

// Create a deep copy of the original cash-in-drawer array to reset the state after transactions.
// This ensures that the cash register can be restored to its initial state for new transactions.
const cidOriginal = cid.map((item) => [...item]);

// Define the CashRegister class to handle payment logic and UI updates.
// This class encapsulates all the functionality required to process payments, calculate change, and update the UI.
class CashRegister {
  constructor(cash, price) {
    this.cash = cash; // Amount of cash provided by the customer.
    this.price = price; // Price of the item being purchased.
  }

  // Resets the UI and cash register state for a new transaction.
  // This method clears all transaction-related data and restores the UI to its initial state.
  cleanOutput() {
    input.value = ""; // Clear the input field to allow new payment entries.
    cid = cidOriginal.map((item) => [...item]); // Reset the cash-in-drawer to its original state.
    changeDue.style.display = "none"; // Hide the transaction status container.
    dividerTransition.style.display = "none"; // Hide the UI divider for transactions.
    detailsText.style.display = "block"; // Show the transaction details text.
    svgFailed.style.display = "none"; // Hide the failed transaction icon.
    svgCheck.style.display = "none"; // Hide the successful transaction icon.
    statusText.textContent = "Status:"; // Reset the transaction status text.
    alertInsufficient.textContent = ""; // Clear the insufficient funds alert text.
    changeBreakdown.style.display = "none"; // Hide the change breakdown container.
    change.innerHTML = ""; // Clear the change breakdown content.
  }

  // Handles the case where the customer does not provide enough money.
  // This method updates the UI to indicate that the payment was insufficient.
  insufficientFunds() {
    alert("Customer does not have enough money to purchase the item"); // Display an alert to the user.
    changeDue.style.backgroundColor = "#ffdada"; // Set the background color to indicate failure.
    svgFailed.style.display = "block"; // Show the failed transaction icon.
    statusText.textContent += " INSUFFICIENT FUNDS"; // Append the status text with "INSUFFICIENT FUNDS".
    changeDue.style.borderColor = "#dbadad"; // Set the border color to indicate failure.
    alertInsufficient.textContent =
      "Customer does not have enough money to purchase the item"; // Display a detailed alert message.
  }

  // Handles the case where the customer pays the exact amount.
  // This method updates the UI to indicate that no change is due.
  checkFunds() {
    alert("No change due - customer paid with exact cash"); // Display an alert to the user.
    changeDue.style.backgroundColor = "#dae7ff"; // Set the background color to indicate a closed transaction.
    svgCheck.style.display = "block"; // Show the successful transaction icon.
    svgCheck.style.stroke = "blue"; // Set the icon color to blue.
    statusText.textContent += " CLOSED"; // Append the status text with "CLOSED".
    changeDue.style.borderColor = "#adbcdb"; // Set the border color to indicate a closed transaction.
    changeBreakdown.style.display = "block"; // Show the change breakdown container.
    change.innerHTML += `
      <p class="not-change">No change due: 0</p>
    `; // Display a message indicating no change is due.
  }

  // Handles the case where the customer provides more money than the price.
  // This method calculates the change to return and updates the UI to display the breakdown of change.
  passFunds() {
    let totalCashRegister = 0; // Variable to store the total cash available in the register.
    const dues = {
      "ONE HUNDRED": 0, // Counter for hundred-dollar bills.
      TWENTY: 0, // Counter for twenty-dollar bills.
      TEN: 0, // Counter for ten-dollar bills.
      FIVE: 0, // Counter for five-dollar bills.
      ONE: 0, // Counter for one-dollar bills.
      QUARTER: 0, // Counter for quarters.
      DIME: 0, // Counter for dimes.
      NICKEL: 0, // Counter for nickels.
      PENNY: 0, // Counter for pennies.
    };
    const changeToReturn = +(this.cash - this.price).toFixed(2); // Calculate the change to return, rounded to two decimal places.
    cid.forEach((number) => {
      totalCashRegister += number[1]; // Sum up the total cash in the register.
    });
    let total = +totalCashRegister.toFixed(2); // Round the total cash to two decimal places.

    // Check if the register has enough cash to provide the required change.
    if (total < changeToReturn) {
      this.insufficientFunds(); // Call the insufficientFunds method if the register cannot provide the change.
      return;
    }

    // Calculate the change breakdown using available denominations.
    let remaining = changeToReturn; // Variable to track the remaining change to be returned.
    while (remaining > 0.001) {
      if (remaining >= 100 && cid[8][1] >= 100) {
        remaining -= 100; // Deduct the denomination value from the remaining change.
        cid[8][1] -= 100; // Deduct the denomination value from the register.
        dues["ONE HUNDRED"]++; // Increment the counter for the denomination.
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

    // Update the UI to reflect the successful transaction and display the change breakdown.
    changeDue.style.backgroundColor = "#daf5d7"; // Set the background color to indicate success.
    changeDue.style.borderColor = "#b2dbad"; // Set the border color to indicate success.
    svgCheck.style.display = "block"; // Show the successful transaction icon.
    svgCheck.style.stroke = "green"; // Set the icon color to green.
    statusText.textContent += " OPEN"; // Append the status text with "OPEN".
    changeBreakdown.style.display = "block"; // Show the change breakdown container.

    change.innerHTML = ""; // Clear the change breakdown content.
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
        ).toFixed(2); // Calculate the total amount for the denomination.
        change.innerHTML += `<p class="changes">${denom}: ${count}</p>`; // Display the denomination and count in the UI.
      }
    }
  }
}

// Display the price of the item in the UI.
dueContainer.textContent += price;

// Restrict input to valid numeric values and handle special keys.
// This ensures that the user can only enter valid payment amounts.
input.addEventListener("keydown", (e) => {
  const keysYes = ["Backspace", "ArrowRight", "ArrowLeft"]; // Allow navigation and deletion keys.
  const isNumber = /^[0-9]$/.test(e.key); // Check if the key is a number.
  const isDot = e.key === "." && !input.value.includes("."); // Allow a single decimal point.
  if (!isNumber && !isDot && !keysYes.includes(e.key)) {
    e.preventDefault(); // Prevent invalid input.
  }
});

// Handles the payment process, including validation and invoking the appropriate CashRegister methods.
const pay = () => {
  const amount = Number(input.value); // Parse the input value as a number.
  cashRegister = new CashRegister(Number(input.value), price); // Create a new CashRegister instance.
  if (input.value === "") {
    alert("The payment field cannot be empty. Please enter the payment."); // Alert if the input is empty.
    return;
  }
  cashRegister.cleanOutput(); // Reset the UI for the transaction.
  detailsText.style.display = "none"; // Hide the transaction details text.
  changeDue.style.display = "block"; // Show the transaction status container.
  dividerTransition.style.display = "block"; // Show the UI divider for transactions.
  newTransition.style.display = "block"; // Show the new transaction button.
  if (amount < price) {
    cashRegister.insufficientFunds(); // Handle insufficient funds.
  }
  if (amount === price) {
    cashRegister.checkFunds(); // Handle exact payment.
  }
  if (amount > price) {
    cashRegister.passFunds(); // Handle overpayment and calculate change.
  }
};

// Resets the transaction state when the user initiates a new transaction.
const reset = () => {
  if (cashRegister) cashRegister.cleanOutput(); // Reset the UI and cash register state.
};

// Add event listeners for keyboard shortcuts and button clicks.
// These listeners handle user interactions for payment and resetting the transaction.
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && e.ctrlKey) {
    reset(); // Reset the transaction if Ctrl+Enter is pressed.
    return;
  }
  if (e.key === "Enter") pay(); // Process the payment if Enter is pressed.
});

purchaseBtn.addEventListener("click", pay); // Process the payment when the purchase button is clicked.
newTransition.addEventListener("click", reset); // Reset the transaction when the new transaction button is clicked.
