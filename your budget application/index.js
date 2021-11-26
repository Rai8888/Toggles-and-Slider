'use strict';

const isNumber = function(n){
    return !isNaN(parseFloat(n)) && isFinite(n);
};

let calculateButton = document.getElementById('start'),
    cancelButton = document.getElementById('cancel'),
    inputElems = document.querySelectorAll('input[type=text]'),
    incomeAdd = document.getElementsByTagName('button')[0],
    expensesAdd = document.getElementsByTagName('button')[1],
    depositCheck = document.querySelector('#deposit-check'),
    additionalIncomeItems = document.querySelectorAll('.additional_income-item'),
    totalResults = document.getElementsByClassName('result-total'),
    salaryAmount = document.querySelector('.salary-amount'),
    incomeTitle = document.querySelector('.income-title'),
    expensesTitle = document.querySelector('.expenses-title'),
    expensesItems = document.querySelectorAll('.expenses-items'),
    additionalExpensesItem = document.querySelector('.additional_expenses-item'),
    targetAmount = document.querySelector('.target-amount'),
    periodSelect = document.querySelector('.period-select'),
    budgetDayValue = document.getElementsByClassName('budget_day-value')[0],
    budgetMonthValue = document.getElementsByClassName('budget_month-value')[0],
    expensesMonthValue = document.getElementsByClassName('expenses_month-value')[0],
    additionalExpensesValue = document.getElementsByClassName('additional_expenses-value')[0],
    additionalIncomeValue = document.getElementsByClassName('additional_income-value')[0],
    targetMonthValue = document.querySelector('.target_month-value'),
    incomePeriodValue = document.querySelector('.income_period-value'),
    incomeItem = document.querySelectorAll('.income-items'),
    periodAmout = document.querySelector('.period-amount'),
    depositBank = document.querySelector('.deposit-bank'),
    depositAmount = document.querySelector('.deposit-amount'),
    depositPercent = document.querySelector('.deposit-percent');


class AppData{
    constructor(){
        this.income = {};
        this.incomeMonth = 0;
        this.addIncome = [];
        this.budget = 0;
        this.budgetDay = 0;
        this.budgetMonth = 0;
        this.expensesMonth = 0;
        this.expenses = {};
        this.addExpenses = [];
        this.deposit = false;
        this.percentDeposit = 0;
        this.moneyDeposit = 0;
    }

    start(){
        this.budget = +salaryAmount.value;

        this.getExpInc();
        this.getExpensesMonth();
        this.getAddExpenses();
        this.getAddIncome();
        this.getInfoDeposit();
        this.getBudget();
        
        this.showResult();

        inputElems.forEach(function(item){
            item.setAttribute('disabled', '');
        });
        calculateButton.style.display = 'none';
        cancelButton.style.display = 'block';
    }

    showResult(){
        budgetMonthValue.value = this.budgetMonth;
        budgetDayValue.value = Math.floor(this.budgetDay);
        expensesMonthValue.value = this.expensesMonth;
        additionalExpensesValue.value = this.addExpenses.join(', ');
        additionalIncomeValue.value = this.addIncome.join(', ');
        targetMonthValue.value = Math.ceil(this.getTargetMonth());
        incomePeriodValue.value = this.calcPeriod();
    }

    getAddExpenses(){
        let addExpenses = additionalExpensesItem.value.split(',');
        addExpenses.forEach(function(item){
            item = item.trim();
            if(item !== ''){
                this.addExpenses.push(item);
            }
        }, this);
    }

    getAddIncome(){
        additionalIncomeItems.forEach(function(item){
            let itemValue = item.value.trim();
            if(itemValue !== ''){
                this.addIncome.push(itemValue);
            }
        }, this);
    }

    getExpensesMonth(){
        let sum = 0;

        for (let expens in this.expenses) {
            sum += +this.expenses[expens];
        }
        this.expensesMonth = sum;
    }

    getBudget(){
        const monthDeposit = this.moneyDeposit * (this.percentDeposit / 100);
        this.budgetMonth = this.budget + this.incomeMonth - this.expensesMonth + monthDeposit;
        this.budgetDay = Math.floor(this.budgetMonth / 30);
    }

    getTargetMonth(){
        return targetAmount.value / this.budgetMonth;
    }

    getStatusIncome(){
        if(this.budgetDay >= 1200) {
            return ('Высокий уровень дохода');
        }
        else if(this.budgetDay >= 600) {
            return ('У вас средний уровень дохода');
        }
        else if(this.budgetDay < 600) {
            return ('К сожалению у вас уровень дохода ниже среднего');
        }
        else if(this.budgetDay < 0) {
            return ('Что то пошло не так');
        }
    }

    getInfoDeposit(){
        if(this.deposit){
            if(depositPercent.value >= 0 && depositPercent.value <= 100){
                this.percentDeposit = depositPercent.value;
            } else {
                depositPercent.value = '';
                this.percentDeposit = 0;
            }
            this.moneyDeposit = depositAmount.value;
        }
    }

    calcPeriod(){
        return this.budgetMonth * periodSelect.value;
    }

    updateRangeValue(e){
        periodAmout.textContent = e.target.value;
    }

    reset(){

        budgetMonthValue.value = 0;
        budgetDayValue.value = 0;
        expensesMonthValue.value = 0;
        additionalExpensesValue.value = 'Наименование';
        additionalIncomeValue.value = 'Наименование';
        targetMonthValue.value = 'Срок';
        incomePeriodValue.value = 0;

        inputElems.forEach(function(item){
            item.removeAttribute('disabled');
        });
        calculateButton.style.display = 'block';
        cancelButton.style.display = 'none';
    }

    addExpIncBlock(e) {
        const startStr = e.target.className.split(' ')[1].split('_')[0];
        const items = document.querySelectorAll(`.${startStr}-items`);
        const buttonAdd = document.querySelector(`.${startStr}_add`);

        let cloneItem = items[0].cloneNode(true);
        cloneItem.childNodes.forEach(function(item){
            item.value = '';
        });
        items[0].parentNode.insertBefore(cloneItem, buttonAdd);
        expensesItems = document.querySelectorAll('.expenses-items');
        incomeItem = document.querySelectorAll('.income-items');
        if(items.length === 3){
            buttonAdd.style.display = 'none';
        }
    }

    changePercent(){
        const valueSelect = this.value;
        if(valueSelect === 'other'){
            depositPercent.value = '';
            depositPercent.style.display = 'inline-block';
        } else {
            depositPercent.value = valueSelect;
            depositPercent.style.display = 'none';
        }
    }

    depositHandler(){
        if(depositCheck.checked){
            depositBank.style.display = 'inline-block';
            depositAmount.style.display = 'inline-block';
            this.deposit = true;
            depositBank.addEventListener('change', this.changePercent);
        } else{
            depositBank.style.display = 'none';
            depositAmount.style.display = 'none';
            depositBank.value = '';
            depositAmount.value = '';
            this.deposit = false;
            depositBank.removeEventListener('change', this.changePercent);
        }
    }

    eventsListeners(){
        const __this = this;
        calculateButton.addEventListener('click', function(){
            if(salaryAmount.value !== ''){
                __this.start();
            }
        });

        cancelButton.addEventListener('click', __this.reset);

        expensesAdd.addEventListener('click', e => __this.addExpIncBlock(e));
        incomeAdd.addEventListener('click', e => __this.addExpIncBlock(e));

        periodSelect.addEventListener('input', __this.updateRangeValue);

        periodSelect.addEventListener('input', function(){
            incomePeriodValue.value = __this.calcPeriod();
        });

        depositCheck.addEventListener('change', this.depositHandler.bind(this));
    }

    getExpInc(){
        const count = (item) => {
            const startStr = item.className.split('-')[0];
            const itemTitle = item.querySelector(`.${startStr}-title`).value;
            const itemAmount = item.querySelector(`.${startStr}-amount`).value;
            if(itemTitle !== '' && itemAmount !== ''){
                this[startStr][itemTitle] = itemAmount;
            }
        };

        incomeItem.forEach(count);

        expensesItems.forEach(count);

        for (const key in this.income) {
            this.incomeMonth += +this.income[key];
        }
    }
}


const appData = new AppData();
appData.eventsListeners();
