import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EscapeHtmlPipe } from './keep-html.pipe';
import { SafePipe } from './safe.pipe';
import { ImagenPipe } from './imagen.pipe';
import { UserRolePipe } from './user-role.pipe';
import { UserRoleclientPipe } from './user-roleclient.pipe';



@NgModule({
  declarations: [
    EscapeHtmlPipe,
    SafePipe,
    ImagenPipe,
    UserRolePipe,
    UserRoleclientPipe
    
  ],
  exports: [
    EscapeHtmlPipe,
    SafePipe,
    ImagenPipe,
    UserRolePipe,
    UserRoleclientPipe
  ],
  imports: [
    CommonModule,
  ]
})
export class PipesModule { }
