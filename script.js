const transactionsUl = document.querySelector('#transactions');
const incomeDisplay = document.querySelector('#money-plus');
const expenseDisplay = document.querySelector('#money-minus');
const balanceDisplay = document.querySelector('#balance');
const form = document.querySelector('#form');
const inputTransactionName = document.querySelector('#text');
const inputTransactionAmount = document.querySelector('#amount');

const localStorageTransactions = JSON.parse(localStorage.getItem('transactions'));
let transactions = localStorage
  .getItem('transactions') !== null ? localStorageTransactions : [];

// eslint-disable-next-line no-unused-vars
const removeTransaction = (id) => {
  transactions = transactions
    .filter((transaction) => transaction.id !== id);
  // eslint-disable-next-line no-use-before-define
  updateLocalStorage();
  // eslint-disable-next-line no-use-before-define
  init();
};

const addTransactionsIntoDOM = ({ name, amount, id }) => {
  const operator = amount > 0 ? '+' : '-';
  const CSSClass = amount > 0 ? 'plus' : 'minus';
  const amountWithoutOperator = Math.abs(amount);
  const li = document.createElement('li');
  li.classList.add(CSSClass);
  li.innerHTML = `${name}\
    <span>${operator} R$ ${amountWithoutOperator.toFixed(2)}</span>\
    <button class="delete-btn" onClick="removeTransaction(${id})">\
      x\
    </button>
  `;

  transactionsUl.append(li);
};

const getTotalAmount = (transactionsAmount, transactionType) => (transactionsAmount
  .filter((amount) => (transactionType === 'income' ? amount > 0 : amount < 0))
  .reduce((acc, amount) => acc + amount, 0)
);

const insertBalanceValues = () => {
  const transactionsAmount = transactions
    .map((transaction) => transaction.amount);

  const income = getTotalAmount(transactionsAmount, 'income');
  const expense = getTotalAmount(transactionsAmount, 'expense');

  const currentBalance = (income + expense);

  balanceDisplay.textContent = `R$ ${currentBalance.toFixed(2)}`;
  incomeDisplay.textContent = `R$ ${income.toFixed(2)}`;
  expenseDisplay.textContent = `- R$ ${Math.abs(expense).toFixed(2)}`;
};

// atualização das transações na tela.
const init = () => {
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionsIntoDOM);
  insertBalanceValues();
};

init();

// atualização do local storage.
const updateLocalStorage = () => (
  localStorage.setItem('transactions', JSON.stringify(transactions))
);

const generateID = () => Math.round(Math.random() * 1000);

const addCreatedTransaction = (transactionName, transactionAmount) => {
  transactions.push({
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  });
};

// limpeza dos inputs.
const clearInputs = () => {
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
};

const handleFormSubimit = (event) => {
  // impedir que o form seja enviado e a página recarregada.
  event.preventDefault();

  // variáveis com os valores inseridos no input.
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();
  const checkEmptyInputs = transactionName === '' || transactionAmount === '';

  // verificação se há inputs vazios e exibir uma mensagem se tiver.
  if (checkEmptyInputs) {
    // eslint-disable-next-line no-alert
    alert('Nome e valor da transação são obrigatórios.');
    return;
  }

  addCreatedTransaction(transactionName, transactionAmount);

  init();

  updateLocalStorage();

  clearInputs();
};

form.addEventListener('submit', handleFormSubimit);
