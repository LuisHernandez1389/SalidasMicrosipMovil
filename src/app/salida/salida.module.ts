import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SalidaPageRoutingModule } from './salida-routing.module';

import { SalidaPage } from './salida.page';

import { HotTableModule } from '@handsontable/angular'; // Importa el módulo de Handsontable



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SalidaPageRoutingModule,
    HotTableModule
  ],
  declarations: [SalidaPage]
})
export class SalidaPageModule {}
