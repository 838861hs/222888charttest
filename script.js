import './style.scss'
import { Chart, PieController, BarController, LineController, ArcElement, BarElement, PointElement, LineElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(PieController, BarController, LineController, ArcElement, BarElement, PointElement, LineElement, CategoryScale, LinearScale);

const ctx = document.getElementById('chart').getContext('2d');
const subjects = ['算数', '図工', '国語', '体育', '音楽', '理科', '社会', 'その他'];
const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#FFCD56', '#C9CBCF'];

function getDataFromTable() {
    const counts = document.querySelectorAll('.count');
    const data = [];
    counts.forEach(count => {
        data.push(count.value);
    });
    return data;
}

let chart = new Chart(ctx, {
    type: 'pie',
    data: {
        labels: subjects,
        datasets: [{
            data: getDataFromTable(),
            backgroundColor: colors
        }]
    }
});

document.getElementById('data-table').addEventListener('input', function(e) {
    if (e.target && e.target.classList.contains('count')) {
        chart.data.datasets[0].data = getDataFromTable();
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
                data: getDataFromTable(),
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
                data: getDataFromTable(),
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
              data: getDataFromTable(),
              backgroundColor: colors
          }]
      }
  });
});

document.querySelectorAll('.percentage').forEach(input => {
  input.addEventListener('input', function() {
      updateCountsBasedOnPercentage();
  });
});

function updateCountsBasedOnPercentage() {
  let totalCount = 0;

  // すべての人数のinputから値を取得し、総合計を計算
  document.querySelectorAll('.count').forEach(input => {
      totalCount += parseFloat(input.value);
  });

  let totalPercentage = 0;
  const percentages = [];

  // すべての割合のinputから値を取得し、合計を計算
  document.querySelectorAll('.percentage').forEach(input => {
      const percentage = parseFloat(input.value);
      percentages.push(percentage);
      totalPercentage += percentage;
  });

  // 各教科の人数を計算
  const newCounts = percentages.map(percentage => {
      return Math.round(totalCount * (percentage / totalPercentage));
  });

  // 計算された人数を対応する人数のinputに設定
  document.querySelectorAll('.count').forEach((input, index) => {
      input.value = newCounts[index];
  });

  // グラフのデータセットを更新
  chart.data.datasets[0].data = newCounts;
  chart.update();  // グラフを再描画
}



//割合を変更したら人数が相対的に変更
document.querySelectorAll('.count').forEach(input => {
    input.addEventListener('input', function() {
        updatePercentageBasedOnCount();
    });
});

function updatePercentageBasedOnCount() {
    let totalCount = 0;
    const counts = [];

    // すべての人数のinputから値を取得し、合計を計算
    document.querySelectorAll('.count').forEach(input => {
        const count = parseFloat(input.value);
        counts.push(count);
        totalCount += count;
    });
    // 各教科の割合を計算
    const percentages = counts.map(count => {
      return Math.round((count / totalCount) * 100);
    });

    // 計算された割合を対応する割合のinputに設定
    document.querySelectorAll('.percentage').forEach((input, index) => {
        input.value = percentages[index];
    });

    // グラフのデータセットを更新
    chart.data.datasets[0].data = counts;
    chart.update();  // グラフを再描画
}
