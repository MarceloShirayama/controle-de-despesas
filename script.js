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

const addTransactionsIntoDOM = (transaction) => {
  const operator = transaction.amount > 0 ? '+' : '-';
  const CSSClass = transaction.amount > 0 ? 'plus' : 'minus';
  const amountWithoutOperator = Math.abs(transaction.amount);
  const li = document.createElement('li');
  li.classList.add(CSSClass);
  li.innerHTML = `${transaction.name}\
    <span>${operator} R$ ${amountWithoutOperator}</span>\
    <button class="delete-btn" onClick="removeTransaction(${transaction.id})">\
      x\
    </button>
  `;

  transactionsUl.append(li);
};

const updateBalanceValues = () => {
  const transactionsAmount = transactions
    .map((transaction) => transaction.amount);

  const income = transactionsAmount
    .filter((amount) => amount > 0)
    .reduce((acc, amount) => acc + amount, 0);

  const expense = transactionsAmount
    .filter((amount) => amount < 0)
    .reduce((acc, amount) => acc + amount, 0);

  const currentBalance = (income + expense);

  balanceDisplay.textContent = `R$ ${currentBalance.toFixed(2)}`;
  incomeDisplay.textContent = `R$ ${income.toFixed(2)}`;
  expenseDisplay.textContent = `- R$ ${Math.abs(expense).toFixed(2)}`;
};

const init = () => {
  transactionsUl.innerHTML = '';
  transactions.forEach(addTransactionsIntoDOM);
  updateBalanceValues();
};

init();

const updateLocalStorage = () => (
  localStorage.setItem('transactions', JSON.stringify(transactions))
);

const generateID = () => Math.round(Math.random() * 1000);

const handleFormSubimit = (event) => {
  // impedir que o form seja enviado e a página recarregada.
  event.preventDefault();

  // variáveis com os valores inseridos no input.
  const transactionName = inputTransactionName.value.trim();
  const transactionAmount = inputTransactionAmount.value.trim();

  // verificação se os inputs foram preenchidos e exibindo uma mensagem se não foram preenchidos.
  if (transactionName === '' || transactionAmount === '') {
    // eslint-disable-next-line no-alert
    alert('Nome e valor da transação são obrigatórios.');
    return;
  }

  // criando a transação.
  const transaction = {
    id: generateID(),
    name: transactionName,
    amount: Number(transactionAmount),
  };

  // adicionando a transação ao array de transações.
  transactions.push(transaction);

  // atualização das transações na tela.
  init();

  // atualização do local storage.
  updateLocalStorage();

  // limpeza dos inputs.
  inputTransactionName.value = '';
  inputTransactionAmount.value = '';
};

form.addEventListener('submit', handleFormSubimit);
