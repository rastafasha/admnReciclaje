import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { SafePipe } from './safe.pipe';
import { ImagenPipe } from './imagen.pipe';



@NgModule({
  declarations: [
    EscapeHtmlPipe,
    SafePipe,
    ImagenPipe
  ],
  exports: [
    EscapeHtmlPipe,
    SafePipe,
    ImagenPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule { }
