
console.log("********** Expense Tracker **********");


// =====================================================
// 1. GET DATA FROM LOCAL STORAGE
// =====================================================

let transactions =
    JSON.parse(localStorage.getItem("transactions")) || [];


// =====================================================
// 2. TRANSACTION CLASS
// =====================================================

class Transaction {

    constructor(id, title, amount, type, category, date) {

        this.id = id;
        this.title = title;
        this.amount = amount;
        this.type = type;
        this.category = category;
        this.date = date;

    }

}


// =====================================================
// 3. ADD TRANSACTION
// =====================================================

function addTransaction(
    id,
    title,
    amount,
    type,
    category,
    date = new Date()
) {

    let transactionObj = new Transaction(
        id,
        title,
        amount,
        type,
        category,
        date
    );

    transactions.push(transactionObj);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// =====================================================
// 4. CALCULATE SUMMARY
// =====================================================

function calculateSummary() {

    // Income transactions

    let incomeAmt = transactions.filter((ele) => {

        return ele.type === "income";

    });


    // Total income

    let totalAmt = incomeAmt.reduce((acc, ele) => {

        return acc + Number(ele.amount);

    }, 0);


    // Expense transactions

    let expenseAmt = transactions.filter((ele) => {

        return ele.type === "expense";

    });


    // Total expense

    let totalExpenseAmt = expenseAmt.reduce((acc, ele) => {

        return acc + Number(ele.amount);

    }, 0);


    // Balance

    let balance = totalAmt - totalExpenseAmt;


    return {
        totalAmt,
        totalExpenseAmt,
        balance
    };

}


// =====================================================
// 5. DISPLAY SUMMARY
// =====================================================

function displaySummary() {

    let summary = calculateSummary();


    document.getElementById("totalIncome").textContent =
        "₹" + summary.totalAmt;


    document.getElementById("totalExpense").textContent =
        "₹" + summary.totalExpenseAmt;


    document.getElementById("balance").textContent =
        "₹" + summary.balance;


    console.log("Total Income:", summary.totalAmt);

    console.log("Total Expense:", summary.totalExpenseAmt);

    console.log("Balance:", summary.balance);

}


// =====================================================
// 6. DISPLAY TRANSACTIONS
// =====================================================

function displayTransactions(transactionArray = transactions) {

    let transactionList =
        document.getElementById("transactionList");


    transactionList.innerHTML = "";


    // If there are no transactions

    if (transactionArray.length === 0) {

        transactionList.innerHTML =
            "<p>No transactions found.</p>";

        return;

    }


    transactionArray.forEach((ele) => {

        let transactionDiv =
            document.createElement("div");


        transactionDiv.classList.add("transaction");


        transactionDiv.innerHTML = `

            <span class="transaction-title">
                ${ele.title}
            </span>

            <span>
                ₹${ele.amount}
            </span>

            <span>
                ${ele.category}
            </span>

            <span class="${
                ele.type === "income"
                    ? "transaction-income"
                    : "transaction-expense"
            }">
                ${ele.type}
            </span>

            <span>
                ${ele.date}
            </span>

            <span>

                <button
                    class="edit-btn"
                    onclick="editTransaction(${ele.id})">
                    Edit
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteTransaction(${ele.id})">
                    Delete
                </button>

            </span>

        `;


        transactionList.appendChild(transactionDiv);

    });

}


// =====================================================
// 7. ADD TRANSACTION FORM
// =====================================================

let transactionForm =
    document.getElementById("transactionForm");


transactionForm.addEventListener("submit", function(event) {

    event.preventDefault();


    // Get values from form

    let title =
        document.getElementById("title").value.trim();


    let amount =
        Number(document.getElementById("amount").value);


    let type =
        document.getElementById("type").value;


    let category =
        document.getElementById("category").value;


    let date =
        document.getElementById("date").value;


    // Generate unique ID

    let id = Date.now();


    // Add transaction

    addTransaction(
        id,
        title,
        amount,
        type,
        category,
        date
    );


    // Update UI

    displayTransactions();

    displaySummary();


    // Clear form

    transactionForm.reset();

});


// =====================================================
// 8. DELETE TRANSACTION
// =====================================================

function deleteTransaction(id) {

    transactions = transactions.filter((ele) => {

        return ele.id != id;

    });


    // Update localStorage

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update UI

    displayTransactions();

    displaySummary();

}


// =====================================================
// 9. EDIT TRANSACTION
// =====================================================

function editTransaction(id) {

    let transaction = transactions.find((ele) => {

        return ele.id == id;

    });


    if (!transaction) {

        return;

    }


    // Ask user for new amount

    let newAmount =
        prompt(
            "Enter new amount:",
            transaction.amount
        );


    // Cancel button

    if (newAmount === null) {

        return;

    }


    // Convert to number

    newAmount = Number(newAmount);


    // Validation

    if (isNaN(newAmount) || newAmount <= 0) {

        alert("Please enter a valid amount.");

        return;

    }


    // Update amount

    transaction.amount = newAmount;


    // Save changes

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );


    // Update UI

    displayTransactions();

    displaySummary();

}


// =====================================================
// 10. SEARCH TRANSACTION
// =====================================================

function searchTransaction(searchText) {

    let searchTrans = transactions.filter((ele) => {

        return ele.title
            .toLowerCase()
            .includes(searchText.toLowerCase());

    });


    console.log(searchTrans);

    displayTransactions(searchTrans);

}


// =====================================================
// 11. FILTER BY TYPE
// =====================================================

function filterTransactions(filterType) {

    let filterT = transactions.filter((ele) => {

        return ele.type.toLowerCase() ===
            filterType.toLowerCase();

    });


    console.log(filterT);

    displayTransactions(filterT);

}


// =====================================================
// 12. FILTER BY CATEGORY
// =====================================================

function filterTransactionsCat(filterType) {

    let catFilter = transactions.filter((ele) => {

        return ele.category.toLowerCase() ===
            filterType.toLowerCase();

    });


    console.log(catFilter);

    displayTransactions(catFilter);

}


// =====================================================
// 13. DISPLAY ALL TRANSACTIONS
// =====================================================

function filterAllTransactions() {

    console.log(transactions);

    displayTransactions(transactions);

}


// =====================================================
// 14. SORT BY AMOUNT - DESCENDING
// =====================================================

function sortTransactionsDesc() {

    transactions.sort((a, b) => {

        return Number(b.amount) - Number(a.amount);

    });


    displayTransactions();

}


// =====================================================
// 15. SORT BY AMOUNT - ASCENDING
// =====================================================

function sortTransactionsAsc() {

    transactions.sort((a, b) => {

        return Number(a.amount) - Number(b.amount);

    });


    displayTransactions();

}


// =====================================================
// 16. SORT BY DATE - DESCENDING
// =====================================================

function sortTranByDateDesc() {

    transactions.sort((a, b) => {

        return new Date(b.date) - new Date(a.date);

    });


    displayTransactions();

}


// =====================================================
// 17. SORT BY DATE - ASCENDING
// =====================================================

function sortTranByDateAsc() {

    transactions.sort((a, b) => {

        return new Date(a.date) - new Date(b.date);

    });


    displayTransactions();

}


// =====================================================
// 18. SEARCH EVENT LISTENER
// =====================================================

let searchInput =
    document.getElementById("search");


searchInput.addEventListener("input", function() {

    let searchText = searchInput.value.toLowerCase();


    let filteredTransactions =
        transactions.filter((ele) => {

            return ele.title
                .toLowerCase()
                .includes(searchText);

        });


    displayTransactions(filteredTransactions);

});


// =====================================================
// 19. TYPE FILTER EVENT LISTENER
// =====================================================

let filterType =
    document.getElementById("filterType");


filterType.addEventListener("change", function() {

    let selectedType = filterType.value;


    if (selectedType === "all") {

        displayTransactions();

        return;

    }


    let filteredTransactions =
        transactions.filter((ele) => {

            return ele.type === selectedType;

        });


    displayTransactions(filteredTransactions);

});


// =====================================================
// 20. CATEGORY FILTER EVENT LISTENER
// =====================================================

let filterCategory =
    document.getElementById("filterCategory");


filterCategory.addEventListener("change", function() {

    let selectedCategory =
        filterCategory.value;


    if (selectedCategory === "all") {

        displayTransactions();

        return;

    }


    let filteredTransactions =
        transactions.filter((ele) => {

            return ele.category === selectedCategory;

        });


    displayTransactions(filteredTransactions);

});


// =====================================================
// 21. SORT EVENT LISTENER
// =====================================================

let sortSelect =
    document.getElementById("sort");


sortSelect.addEventListener("change", function() {

    let sortValue = sortSelect.value;


    if (sortValue === "none") {

        displayTransactions();

    }


    else if (sortValue === "amountAsc") {

        sortTransactionsAsc();

    }


    else if (sortValue === "amountDesc") {

        sortTransactionsDesc();

    }


    else if (sortValue === "dateAsc") {

        sortTranByDateAsc();

    }


    else if (sortValue === "dateDesc") {

        sortTranByDateDesc();

    }

});


// =====================================================
// 22. CATEGORY-WISE EXPENSE
// =====================================================

function calculateCategoryTotal() {

    const categoryTotal =
        transactions.reduce((acc, ele) => {

            if (ele.type === "expense") {

                if (acc[ele.category]) {

                    acc[ele.category] +=
                        Number(ele.amount);

                }

                else {

                    acc[ele.category] =
                        Number(ele.amount);

                }

            }


            return acc;

        }, {});


    console.log("Category Total:");

    console.log(categoryTotal);


    return categoryTotal;

}


// =====================================================
// 23. INITIAL DISPLAY
// =====================================================

displayTransactions();

displaySummary();

calculateCategoryTotal();


// =====================================================
// 24. AI CHATBOT
// =====================================================

const userMessage = document.getElementById("userMessage");
const sendButton = document.getElementById("sendButton");
const chatMessages = document.getElementById("chatMessages");

sendButton.addEventListener("click", sendMessage);

userMessage.addEventListener("keydown", function (event) {

    if (event.key === "Enter") {
        sendMessage();
    }

});


async function sendMessage() {

    const message = userMessage.value.trim();

    if (message === "") {
        return;
    }


    // ==========================================
    // SHOW USER MESSAGE
    // ==========================================

    chatMessages.innerHTML += `
        <p>
            <strong>You:</strong> ${message}
        </p>
    `;


    userMessage.value = "";


    // ==========================================
    // SHOW THINKING
    // ==========================================

    const thinkingMessage = document.createElement("p");

    thinkingMessage.id = "thinkingMessage";

    thinkingMessage.innerHTML = `
        <strong>AI:</strong> Thinking...
    `;

    chatMessages.appendChild(thinkingMessage);


    try {

        // ==========================================
        // SEND QUESTION + TRANSACTIONS TO SERVER
        // ==========================================

        const response = await fetch("https://expense-tracker-api-qbvy.onrender.com", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                message: message,

                transactions: transactions

            })

        });


        const data = await response.json();


        // Remove Thinking...
        thinkingMessage.remove();


        // ==========================================
        // DISPLAY AI RESPONSE
        // ==========================================

        if (data.success) {

            chatMessages.innerHTML += `
                <p>
                    <strong>AI:</strong> ${data.reply}
                </p>
            `;

        } else {

            chatMessages.innerHTML += `
                <p>
                    <strong>AI:</strong> ${data.reply}
                </p>
            `;

        }


    } catch (error) {

        console.error("Chatbot Error:", error);


        thinkingMessage.remove();


        chatMessages.innerHTML += `
            <p>
                <strong>AI:</strong>
                Unable to connect to the AI server.
            </p>
        `;

    }

}