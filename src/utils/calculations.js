export const calculateSummary = (expenses = []) => {
  let totalIncome = 0;
  let totalExpenses = 0;

  expenses.forEach((item) => {
    const val = Number(item.amount) || 0;
    if (item.type === 'income') {
      totalIncome += val;
    } else if (item.type === 'expense') {
      totalExpenses += val;
    }
  });

  const netBalance = totalIncome - totalExpenses;

  return {
    totalIncome,
    totalExpenses,
    netBalance
  };
};

export const calculateCategoryTotals = (expenses = []) => {
  const expenseItems = expenses.filter((item) => item.type === 'expense');
  const totalExpenseSum = expenseItems.reduce((acc, item) => acc + (Number(item.amount) || 0), 0);

  const totals = {};

  expenseItems.forEach((item) => {
    const cat = item.category || 'Other';
    const amount = Number(item.amount) || 0;

    if (!totals[cat]) {
      totals[cat] = 0;
    }
    totals[cat] += amount;
  });

  const categoryTotalsWithPercentage = {};

  Object.keys(totals).forEach((cat) => {
    const catTotal = totals[cat];
    const percentage = totalExpenseSum > 0 ? (catTotal / totalExpenseSum) * 100 : 0;
    categoryTotalsWithPercentage[cat] = {
      total: catTotal,
      percentage: Number(percentage.toFixed(1))
    };
  });

  return categoryTotalsWithPercentage;
};
