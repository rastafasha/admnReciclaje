import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';

@Component({
    selector: 'app-pie-chart2',
    templateUrl: './pie-chart2.component.html',
    styleUrls: ['./pie-chart2.component.css'],
    standalone: false
})
export class PieChart2Component implements OnChanges {
  public chart: Chart;
  isLoading: boolean = false;
  
  // 🎯 Recibe el payload de distribución directo desde las métricas del padre
  @Input() distribucion: { clasificados: number; pendientes: number } | null = null;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['distribucion'] && this.distribucion) {
      this.updateChart();
    }
  }

  updateChart() {
    if (!this.distribucion) return;

    const data = {
      labels: ['Clasificados (≥ 55 pts)', 'Pendientes de Meta'],
      datasets: [
        {
          label: 'Cantidad de Retadores',
          data: [this.distribucion.clasificados, this.distribucion.pendientes],
          backgroundColor: [
            'rgba(46, 204, 113, 0.7)', // Verde Eco-Tech para clasificados
            'rgba(149, 165, 166, 0.6)'  // Gris suave para los pendientes
          ],
          borderColor: [
            'rgba(46, 204, 113, 1)',
            'rgba(149, 165, 166, 1)'
          ],
          borderWidth: 1
        }
      ]
    };

    if (this.chart) {
      this.chart.data = data;
      this.chart.update();
    } else {
      this.chart = new Chart('pieChart', {
        type: 'doughnut',
        data: data,
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
              labels: {
                boxWidth: 15,
                font: { size: 12, weight: 'bold' }
              }
            },
            title: {
              display: true,
              text: 'Estado Global del Concurso 🏆',
              font: { size: 14, weight: 'bold' }
            }
          }
        }
      });
    }
  }
}