import React, { useEffect, useState } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

interface Payment {
  amount: number;
  payment_date: string;
}

interface GraphQLResponse {
  data: {
    payments: Payment[];
  };
}

const GET_PAYMENTS = `
  query {
    payments {
      amount
      payment_date
    }
  }
`;

const MonthlyRentalsPage: React.FC = () => {
  const [paymentData, setPaymentData] = useState<Payment[]>([]);
  const [chart, setChart] = useState<Chart | null>(null);
  useEffect(() => {
    const fetchPaymentData = async () => {
      const result = await fetch('/api/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: GET_PAYMENTS }),
      });
      const { data }: GraphQLResponse = await result.json();
      setPaymentData(data.payments);
    };
    fetchPaymentData();
  }, []);

  useEffect(() => {
    if (paymentData.length > 0 && !chart) {
      const monthlyPayments: { [key: string]: number } = {};

      paymentData.forEach((payment) => {
        const month = new Date(payment.payment_date).toLocaleString('en-US', { month: 'short' });
        if (!monthlyPayments[month]) {
          monthlyPayments[month] = 0;
        }
        monthlyPayments[month] += payment.amount;
      });

      const ctx = document.getElementById('rentalChart') as HTMLCanvasElement;
      const newChart = new Chart(ctx.getContext('2d')!, {
        type: 'bar',
        data: {
          labels: Object.keys(monthlyPayments),
          datasets: [
            {
              label: 'Monthly Collected Rents',
              data: Object.values(monthlyPayments),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: {
          scales: {
            y: {
              type: 'linear',
              beginAtZero: true,
              ticks: {
                callback: function (value: number) {
                  return value + ' TL';
                },
              },
            },
          },
          plugins: {
            tooltip: {
              callbacks: {
                label: function (tooltipItem: any) {
                  return tooltipItem.raw + ' TL';
                },
              },
            },
          },
        },
      });
      setChart(newChart);
    }
  }, [paymentData, chart]);

  return (
    <div>
      <canvas id="rentalChart" width="400" height="200"></canvas>
    </div>
  );
};

export default MonthlyRentalsPage;
