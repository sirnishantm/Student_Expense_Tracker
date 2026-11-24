let expenses = [];
let nextId = 1;

const nameInput = document.getElementById('expenseName');
const amountInput = document.getElementById('expenseAmount');
const categorySelect = document.getElementById('expenseCategory');
const btnAdd = document.getElementById('btnAdd');
const expenseList = document.getElementById('expenseList');
const totalAmountEl = document.getElementById('totalAmount');
const filterSelect = document.getElementById('filterCategory');
const filterCountEl = document.getElementById('filterCount');

const nameError = document.getElementById('nameError');
const amountError = document.getElementById('amountError');
const categoryError = document.getElementById('categoryError');

function validateInputs() {
    let valid = true;

    nameInput.classList.remove('error');
    amountInput.classList.remove('error');
    categorySelect.classList.remove('error');
    nameError.textContent = '';
    amountError.textContent = '';
    categoryError.textContent = '';

    const name = nameInput.value.trim();
    if (!name) {
        nameError.textContent = 'Expense name is required.';
        nameInput.classList.add('error');
        valid = false;
    }

    const amount = parseFloat(amountInput.value);
    if (amountInput.value.trim() === '' || isNaN(amount)) {
        amountError.textContent = 'Enter a valid amount.';
        amountInput.classList.add('error');
        valid = false;
    } else if (amount <= 0) {
        amountError.textContent = 'Amount must be greater than 0.';
        amountInput.classList.add('error');
        valid = false;
    }

    if (!categorySelect.value) {
        categoryError.textContent = 'Select a category.';
        categorySelect.classList.add('error');
        valid = false;
    }

    return valid;
}

function getBadgeClass(category) {
    return 'badge-' + category.toLowerCase();
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function render() {
    const filter = filterSelect.value;

    const visible = filter === 'All'
        ? expenses
        : expenses.filter(e => e.category === filter);

    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    totalAmountEl.textContent = '₹' + total.toFixed(2);

    if (filter === 'All') {
        filterCountEl.textContent = expenses.length + ' expense(s)';
    } else {
        filterCountEl.textContent = visible.length + ' of ' + expenses.length + ' expense(s)';
    }

    expenseList.innerHTML = '';

    if (visible.length === 0) {
        const empty = document.createElement('div');
        empty.className = 'empty-state';
        empty.innerHTML = filter === 'All'
            ? '<div class="icon">📋</div><p>No expenses yet. Start adding your expenses above!</p>'
            : '<div class="icon">🔍</div><p>No expenses found in the "' + filter + '" category.</p>';
        expenseList.appendChild(empty);
        return;
    }

    visible.forEach(expense => {
        const card = document.createElement('div');
        card.className = 'expense-card';

        card.innerHTML =
            '<span class="category-badge ' + getBadgeClass(expense.category) + '">' +
            expense.category +
            '</span>' +
            '<div class="details">' +
            '<div class="name" title="' + escapeHtml(expense.name) + '">' + escapeHtml(expense.name) + '</div>' +
            '</div>' +
            '<span class="expense-amount">₹' + expense.amount.toFixed(2) + '</span>' +
            '<button class="btn-delete" data-id="' + expense.id + '">Delete</button>';

        expenseList.appendChild(card);
    });
}

btnAdd.addEventListener('click', function () {
    if (!validateInputs()) return;

    const expense = {
        id: nextId++,
        name: nameInput.value.trim(),
        amount: parseFloat(parseFloat(amountInput.value).toFixed(2)),
        category: categorySelect.value
    };

    expenses.push(expense);

    nameInput.value = '';
    amountInput.value = '';
    categorySelect.selectedIndex = 0;
    nameInput.classList.remove('error');
    amountInput.classList.remove('error');
    categorySelect.classList.remove('error');
    nameError.textContent = '';
    amountError.textContent = '';
    categoryError.textContent = '';

    if (filterSelect.value !== 'All' && filterSelect.value !== expense.category) {
        filterSelect.value = 'All';
    }

    render();
    nameInput.focus();
});

expenseList.addEventListener('click', function (e) {
    if (e.target.classList.contains('btn-delete')) {
        const id = parseInt(e.target.getAttribute('data-id'));
        expenses = expenses.filter(exp => exp.id !== id);
        render();
    }
});

filterSelect.addEventListener('change', render);

[nameInput, amountInput].forEach(input => {
    input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') btnAdd.click();
    });
});

render();
