
const mockTransactions = [
    { type: 'expense', amount: 100, category: 'Food' },
    { type: 'expense', amount: '200', category: 'Car' },
    { type: 'expense', amount: '50.50', category: 'Food' }, // Mixed types
    { type: 'income', amount: 500, category: 'Salary' }, // Should be ignored
    { amount: 300, category: 'Rent' }, // Missing type (assume expense)
    { type: 'expense', amount: 'invalid', category: 'Other' } // Bad data
];

function calculateData(allTransactions: any[]) {
    const expenses = allTransactions.filter((t: any) => t.type === 'expense' || !t.type);

    const categoryTotals = expenses.reduce((acc, curr: any) => {
        const cat = curr.category || 'Other';
        // Simulate the logic in Chart.tsx
        const amount = parseFloat(curr.amount);
        const val = isNaN(amount) ? 0 : amount;

        acc[cat] = (acc[cat] || 0) + val;
        return acc;
    }, {} as Record<string, number>);

    const total = Object.values(categoryTotals).reduce((sum, val) => sum + val, 0);

    const chartData = Object.keys(categoryTotals).map((cat) => ({
        label: cat,
        value: categoryTotals[cat],
        percentage: ((categoryTotals[cat] / total) * 100).toFixed(1) + '%'
    }));

    return { categoryTotals, total, chartData };
}

console.log(JSON.stringify(calculateData(mockTransactions), null, 2));
