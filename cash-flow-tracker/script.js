// --- STATE ARCHITECTURE ---
let state = {
    salary: 0,
    expenses: [], 
    currentCurrency: 'INR', 
    conversionRate: 1 
};

// --- CHART ENGINE INSTANCE ---
let financialChart = null;

// --- DOM ELEMENTS REFERENCE POOL ---
const form = document.getElementById('finance-form');
const inputSalary = document.getElementById('input-salary');
const inputExpenseName = document.getElementById('input-expense-name');
const inputExpenseAmount = document.getElementById('input-expense-amount');

const displaySalary = document.getElementById('display-salary');
const displayExpenses = document.getElementById('display-expenses');
const displayBalance = document.getElementById('display-balance');

const errorDisplay = document.getElementById('error-message');
const alertBanner = document.getElementById('alert-banner');
const balanceCard = document.getElementById('balance-card');
const expenseList = document.getElementById('expense-list');
const emptyState = document.getElementById('empty-state');

const currencyBtn = document.getElementById('btn-currency');
const downloadPdfBtn = document.getElementById('btn-download-pdf');
const currencySymbols = document.querySelectorAll('.id-currency-symbol');

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', () => {
    loadStateFromLocalStorage();
    syncDOMInfrastructure();
});

// --- CORE LOGIC & STATE PERSISTENCE ---
function saveStateToLocalStorage() {
    localStorage.setItem('CASH_FLOW_STATE', JSON.stringify({
        salary: state.salary,
        expenses: state.expenses,
        currentCurrency: state.currentCurrency,
        conversionRate: state.conversionRate
    }));
}

function loadStateFromLocalStorage() {
    const rawData = localStorage.getItem('CASH_FLOW_STATE');
    if (rawData) {
        try {
            const parsedData = JSON.parse(rawData);
            state.salary = Number(parsedData.salary) || 0;
            state.expenses = Array.isArray(parsedData.expenses) ? parsedData.expenses : [];
            state.currentCurrency = parsedData.currentCurrency || 'INR';
            state.conversionRate = Number(parsedData.conversionRate) || 1;
        } catch (e) {
            console.error("Corrupted local cache state.", e);
        }
    }
}

// --- FORM ENGINE & SUBMISSION HANDLER ---
if (form) {
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        clearErrors();

        const rawSalary = inputSalary.value.trim();
        const rawExpName = inputExpenseName.value.trim();
        const rawExpAmount = inputExpenseAmount.value.trim();

        let evaluatedSalary = state.salary;
        if (rawSalary !== "") {
            const parsedSalary = Number(rawSalary);
            if (isNaN(parsedSalary) || parsedSalary < 0) {
                showError("Core Architecture Violation: Salary base cannot be negative or text.");
                return;
            }
            evaluatedSalary = parsedSalary;
        }

        let processedNewExpense = null;
        if (rawExpName !== "" || rawExpAmount !== "") {
            if (rawExpName === "" || rawExpAmount === "") {
                showError("Data Integrity Fault: Expense operations require both Name and Valid Numerical Value.");
                return;
            }
            
            const parsedAmount = Number(rawExpAmount);
            if (isNaN(parsedAmount) || parsedAmount <= 0) {
                showError("Data Integrity Fault: Expense execution requires positive non-zero value payloads.");
                return;
            }

            processedNewExpense = {
                id: 'exp_' + Date.now() + Math.random().toString(36).substr(2, 4),
                name: rawExpName,
                amount: parsedAmount
            };
        }

        if (rawSalary === "" && !processedNewExpense) {
            showError("Execution Aborted: Clear input targets must be declared before submission.");
            return;
        }

        // Apply mutations
        state.salary = evaluatedSalary;
        if (processedNewExpense) {
            state.expenses.push(processedNewExpense);
        }

        // Clean form controls completely
        inputSalary.value = '';
        inputExpenseName.value = '';
        inputExpenseAmount.value = '';

        saveStateToLocalStorage();
        syncDOMInfrastructure();
    });
}

// --- RENDER DOM SYNC PIPELINE ---
function syncDOMInfrastructure() {
    const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
    const remainingBalance = state.salary - totalExpenses;

    const currentSymbol = state.currentCurrency === 'INR' ? '₹' : '$';
    if (currencySymbols) {
        currencySymbols.forEach(el => el.textContent = currentSymbol);
    }

    if (displaySalary) displaySalary.textContent = (state.salary * state.conversionRate).toFixed(2);
    if (displayExpenses) displayExpenses.textContent = (totalExpenses * state.conversionRate).toFixed(2);
    if (displayBalance) displayBalance.textContent = (remainingBalance * state.conversionRate).toFixed(2);

    // Threshold Verification
    const thresholdCriticalLimit = state.salary * 0.10;
    if (state.salary > 0 && remainingBalance < thresholdCriticalLimit) {
        if (alertBanner) alertBanner.classList.remove('hidden');
        if (balanceCard) balanceCard.className = "bg-red-950/40 p-5 rounded-xl border border-red-500 shadow-md transition-colors duration-300 text-red-500 animate-pulse";
    } else {
        if (alertBanner) alertBanner.classList.add('hidden');
        if (balanceCard) balanceCard.className = "bg-slate-800 p-5 rounded-xl border border-slate-700 shadow-md transition-colors duration-300 text-slate-100";
    }

    renderLedgerLogs();
    renderChartGraphics(remainingBalance, totalExpenses);
}

function renderLedgerLogs() {
    if (!expenseList) return;
    
    expenseList.innerHTML = '';
    if (state.expenses.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }
    if (emptyState) emptyState.classList.add('hidden');

    state.expenses.forEach(item => {
        const li = document.createElement('li');
        li.className = "flex justify-between items-center bg-slate-900/60 hover:bg-slate-900 border border-slate-700/60 p-3 rounded-lg text-sm transition-all group";
        
        const convertedAmount = (item.amount * state.conversionRate).toFixed(2);
        const currentSymbol = state.currentCurrency === 'INR' ? '₹' : '$';

        li.innerHTML = `
            <div class="flex flex-col">
                <span class="font-semibold text-slate-200 group-hover:text-cyan-400 transition-colors">${escapeHTML(item.name)}</span>
                <span class="text-xs text-slate-500">ID: ${item.id}</span>
            </div>
            <div class="flex items-center gap-3">
                <span class="font-bold text-slate-300">${currentSymbol}${convertedAmount}</span>
                <button onclick="executeDeleteExpense('${item.id}')" class="text-slate-500 hover:text-red-400 p-1 rounded transition-colors" title="Purge Record">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
        `;
        expenseList.appendChild(li);
    });
}

// --- DELETE INSTANCE OPERATION ---
window.executeDeleteExpense = function(targetId) {
    state.expenses = state.expenses.filter(item => item.id !== targetId);
    saveStateToLocalStorage();
    syncDOMInfrastructure();
};

// --- CHART.JS VISUALIZATION ENGINE ---
function renderChartGraphics(balance, totalExpenses) {
    const canvasEl = document.getElementById('chart-canvas');
    if (!canvasEl) return;

    // Guard Clause: Prevent crash if Chart.js CDN isn't done loading yet
    if (typeof Chart === 'undefined') {
        console.warn("Chart.js engine not loaded yet. Postponing draw.");
        return;
    }

    const ctx = canvasEl.getContext('2d');
    const rawBalance = balance < 0 ? 0 : balance;
    const chartDataValues = (state.salary === 0 && totalExpenses === 0) ? [1, 0] : [rawBalance, totalExpenses];
    const chartLabels = (state.salary === 0 && totalExpenses === 0) ? ['No Baseline Set', 'Expenses'] : ['Net Capital Balance', 'Aggregated Expenses'];

    if (financialChart) {
        financialChart.destroy(); 
    }

    financialChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartDataValues,
                backgroundColor: ['#10b981', '#06b6d4'],
                borderColor: '#1e293b',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: { color: '#94a3b8', font: { size: 11, weight: 'bold' } }
                }
            }
        }
    });
}

// --- CURRENCY CONVERSION API ---
if (currencyBtn) {
    currencyBtn.addEventListener('click', async () => {
        currencyBtn.disabled = true;
        currencyBtn.innerHTML = `<i class="fa-solid fa-spinner animate-spin mr-1"></i> Syncing Engine...`;

        try {
            if (state.currentCurrency === 'INR') {
                const response = await fetch('https://api.frankfurter.app/latest?from=INR&to=USD');
                if (!response.ok) throw new Error("API Failure.");
                const data = await response.json();
                state.conversionRate = data.rates.USD;
                state.currentCurrency = 'USD';
                currencyBtn.innerHTML = `<i class="fa-solid fa-coins mr-1"></i> Convert to INR`;
            } else {
                state.conversionRate = 1;
                state.currentCurrency = 'INR';
                currencyBtn.innerHTML = `<i class="fa-solid fa-coins mr-1"></i> Convert to USD`;
            }
            saveStateToLocalStorage();
            syncDOMInfrastructure();
        } catch (err) {
            // Fallback strategy if network blocks CDN or Endpoint
            if (state.currentCurrency === 'INR') {
                state.conversionRate = 0.012; 
                state.currentCurrency = 'USD';
                currencyBtn.innerHTML = `<i class="fa-solid fa-coins mr-1"></i> Convert to INR`;
            } else {
                state.conversionRate = 1;
                state.currentCurrency = 'INR';
                currencyBtn.innerHTML = `<i class="fa-solid fa-coins mr-1"></i> Convert to USD`;
            }
            saveStateToLocalStorage();
            syncDOMInfrastructure();
        } finally {
            currencyBtn.disabled = false;
        }
    });
}

// --- REPORT GENERATION ENGINE ---
if (downloadPdfBtn) {
    downloadPdfBtn.addEventListener('click', () => {
        // Guard clause in case library is missing
        if (!window.jspdf || !window.jspdf.jsPDF) {
            alert("PDF Generation Library not fully ready yet.");
            return;
        }

        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        const sym = state.currentCurrency === 'INR' ? 'INR ' : 'USD ';
        const totalExpenses = state.expenses.reduce((sum, item) => sum + item.amount, 0);
        const remainingBalance = state.salary - totalExpenses;

        doc.setFillColor(30, 41, 59);
        doc.rect(0, 0, 220, 40, 'F');
        doc.setTextColor(16, 185, 129);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(24);
        doc.text("CASH-FLOW", 15, 25);
        
        doc.save(`CashFlow_System_Audit_Report_${Date.now()}.pdf`);
    });
}

// --- HELPERS ---
function showError(msg) {
    if (errorDisplay) {
        errorDisplay.textContent = msg;
        errorDisplay.classList.remove('hidden');
    }
}

function clearErrors() {
    if (errorDisplay) {
        errorDisplay.textContent = '';
        errorDisplay.classList.add('hidden');
    }
}

function escapeHTML(str) {
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}