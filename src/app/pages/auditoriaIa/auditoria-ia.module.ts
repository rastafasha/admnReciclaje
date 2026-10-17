import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaIaComponent } from './auditoria-ia/auditoria-ia.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ComponentsModule } from 'src/app/components/components.module';
import { PipesModule } from 'src/app/pipes/pipes.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConfModule } from '../conf/conf.module';



@NgModule({
  declarations: [AuditoriaIaComponent],
  imports: [
      CommonModule,
      SharedModule,
      ReactiveFormsModule,
      FormsModule,
      RouterModule,
      PipesModule,
      ConfModule,
      ComponentsModule,
      NgxPaginationModule
    ]
})
export class AuditoriaIaModule { }
