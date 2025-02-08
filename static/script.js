function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.style.display = 'none';
    });
    document.getElementById(tabName).style.display = 'block';
    if (tabName === 'view_history') loadTransactions();
    if (tabName === 'charts') loadCharts();
}

async function addExpense(event) {
    event.preventDefault();
    const date = document.getElementById('date').value;
    const category = document.getElementById('category').value;
    const amount = parseFloat(document.getElementById('amount').value);
    if (amount < 0) {
        alert("Kindly enter positive amount");
    } else {

    const response = await fetch('/add_expense', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `date=${date}&category=${category}&amount=${amount}`,
    });

    if (response.ok) {
        alert('Expense added successfully!');
        document.getElementById('date').value = '';
        document.getElementById('amount').value = '';
    }
    }
}

async function loadTransactions() {
    const response = await fetch('/get_transactions');
    const data = await response.json();
    const tbody = document.querySelector('#transactions tbody');
    tbody.innerHTML = '';

    data.transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${transaction.Date}</td>
            <td>${transaction.Category}</td>
            <td>${transaction.Amount}</td>
        `;
        tbody.appendChild(row);
    });
}

function loadCharts() {
    fetch('/get_transactions')
        .then(response => response.json())
        .then(data => {
            const categories = {};
            data.transactions.forEach(transaction => {
                if (transaction.Type === 'Expense') {
                    categories[transaction.Category] = (categories[transaction.Category] || 0) + parseFloat(transaction.Amount);
                }
            });

            const labels = Object.keys(categories);
            const amounts = Object.values(categories);

            // Bar Chart
            new Chart(document.getElementById('barChart'), {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expenses by Category',
                        data: amounts,
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1
                    }]
                }
            });

            // Pie Chart
            new Chart(document.getElementById('pieChart'), {
                type: 'pie',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Expenses by Category',
                        data: amounts,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)',
                            'rgba(54, 162, 235, 0.2)',
                            'rgba(255, 206, 86, 0.2)',
                            'rgba(75, 192, 192, 0.2)',
                            'rgba(153, 102, 255, 0.2)'
                        ],
                        borderWidth: 1
                    }]
                }
            });
        });
}
function showTab(tabName) {
    document.querySelectorAll('.tab').forEach(tab => {
        tab.style.opacity = '0';
        setTimeout(() => {
            tab.style.display = 'none';
        }, 300); // Match the transition duration
    });

    setTimeout(() => {
        const activeTab = document.getElementById(tabName);
        activeTab.style.display = 'block';
        setTimeout(() => {
            activeTab.style.opacity = '1';
        }, 10); // Small delay to trigger the transition
    }, 300);

    if (tabName === 'view_history') loadTransactions();
    if (tabName === 'charts') loadCharts();
}

