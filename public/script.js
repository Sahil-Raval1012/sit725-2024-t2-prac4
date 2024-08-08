let display = document.getElementById('display');
let history = document.getElementById('history');

function appendToDisplay(value) {
    if (display.innerText === '0') {
        display.innerText = value;
    } else {
        display.innerText += value;
    }
}
function clearDisplay() {
    display.innerText = '0';
}
function deleteLast() {
    display.innerText = display.innerText.slice(0, -1) || '0';
}
async function calculate() {
    try {
        const expression = display.innerText;
        const result = eval(expression);
        display.innerText = result;
        await fetch('/api/calculate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ expression, result })
        });

    } catch (error) {
        display.innerText = 'Error';
    }
}
async function getHistory() {
    try {
        const response = await fetch('/api/history');
        const calculations = await response.json();

        history.innerHTML = calculations.map(calc => `
            <div>${calc.expression} = ${calc.result}</div>
        `).join('');

    } catch (error) {
        console.error('Error fetching history:', error);
    }
}
