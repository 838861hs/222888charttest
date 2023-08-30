import './style.scss'

import { Chart, PieController, BarController, LineController, ArcElement, BarElement, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(PieController, BarController, LineController, ArcElement, BarElement, PointElement, LineElement, CategoryScale, LinearScale);

const ctx = document.getElementById('chart').getContext('2d');
const subjects = ['算数', '図工', '国語', '体育', '音楽', '理科', '社会', 'その他'];
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF'];

function getDataFromPercentage() {
    const percentages = document.querySelectorAll('.percentage');
    const data = [];
    percentages.forEach(percentage => {
        data.push(percentage.value);
    });
    return data;
}

let chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: subjects,
        datasets: [{
            data: getDataFromPercentage(),
            backgroundColor: colors
        }]
    }
});

document.getElementById('data-table').addEventListener('input', function(e) {
    if (e.target && e.target.classList.contains('percentage')) {
        chart.data.datasets[0].data = getDataFromPercentage();
        chart.update();
    }
});

document.getElementById('barChartBtn').addEventListener('click', function() {
    chart.destroy();
    chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: subjects,
            datasets: [{
                data: getDataFromPercentage(),
                backgroundColor: colors
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

document.getElementById('lineChartBtn').addEventListener('click', function() {
    chart.destroy();
    chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: subjects,
            datasets: [{
                data: getDataFromPercentage(),
                backgroundColor: colors,
                borderColor: colors,
                fill: false
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
});

document.getElementById('pieChartBtn').addEventListener('click', function() {
  chart.destroy();
  chart = new Chart(ctx, {
      type: 'pie',
      data: {
          labels: subjects,
          datasets: [{
              data: getDataFromPercentage(),
              backgroundColor: colors
          }]
      }
  });
});
