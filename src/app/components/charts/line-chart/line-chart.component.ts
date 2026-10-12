import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Chart } from 'chart.js/auto';

@Component({
    selector: 'app-line-chart',
    templateUrl: './line-chart.component.html',
    styleUrls: ['./line-chart.component.css'],
    standalone: false
})
export class LineChartComponent implements OnChanges {
  // 🎯 Recibe directamente el arreglo de 12 meses desde las estadísticas del padre
  @Input() dataMensual: number[] = [];

  public chart: Chart;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['dataMensual'] && this.dataMensual && this.dataMensual.length > 0) {
      this.createChart();
    }
  }

  createChart() {
    const labels = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];

    if (this.chart) {
      this.chart.destroy();
    }

    this.chart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Hábitos Ecológicos Registrados',
          data: this.dataMensual,
          fill: true,
          backgroundColor: 'rgba(46, 204, 113, 0.1)', // Sombreado verde suave abajo
          borderColor: '#2ecc71',                     // Línea verde Eco-Tech
          tension: 0.3,                               // Curvatura elegante de la línea
          borderWidth: 3,
          pointBackgroundColor: '#27ae60',
          pointRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { stepSize: 1 } // Al ser conteos discretos de hábitos, va de 1 en 1
          }
        }
      }
    });
  }
}