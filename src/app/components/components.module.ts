import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// Import Angular plugin.
import { NgxPaginationModule } from 'ngx-pagination';

import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { UsuariosRecientesComponent } from './usuarios-recientes/usuarios-recientes.component';
import {PipesModule} from '../pipes/pipes.module';
import { LineChartComponent } from './charts/line-chart/line-chart.component';
import { PieChart2Component } from './charts/pie-chart2/pie-chart2.component';
import { ConfModule } from '../pages/conf/conf.module';
import { SharedModule } from '../shared/shared.module';
import { ModalNotificacionesComponent } from './modal-notificaciones/modal-notificaciones.component';
import { ModalInstruccionesComponent } from './modal-instrucciones/modal-instrucciones.component';

@NgModule({ declarations: [
        UsuariosRecientesComponent,
        LineChartComponent,
        PieChart2Component,
        ModalNotificacionesComponent,
        ModalInstruccionesComponent
        
    ],
    exports: [
        UsuariosRecientesComponent,
        LineChartComponent,
        PieChart2Component,
        ModalNotificacionesComponent,
        ModalInstruccionesComponent
    ], imports: [
        CommonModule,
        RouterModule,
        ReactiveFormsModule,
        FormsModule,
        PipesModule,
        NgxPaginationModule,
        ConfModule,
        SharedModule], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class ComponentsModule { }
