self.onmessage = (event: MessageEvent) => {
  const data = event.data;
  if (data.type === 'CALCULATE_FINANCE') {
    const result = runFinancialAlgorithm(data.payload);
    self.postMessage({ type: 'FINANCE_RESULT', result });
  }
};

function runFinancialAlgorithm(payload: {
  principal: number;
  rate: number;
  time: number;
}) {
  const { principal, rate, time } = payload;
  const amount = principal * Math.pow(1 + rate, time); // Ví dụ: lãi suất kép
  return amount;
}
