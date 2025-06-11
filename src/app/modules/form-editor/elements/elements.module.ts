import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatTabsModule } from '@angular/material/tabs';

import { EControlComponent } from './control/control.component';
import { UFDragDirective } from './directives/drag.directive';
import { UFDropDirective } from './directives/drop.directive';
import { EElementComponent } from './element/element.component';
import { EMenuAddElementComponent } from './menu-add-element/menu-add-element.component';
import { EPanelComponent } from './panel/panel.component';
import { ERowComponent } from './row/row.component';
import { ERowsComponent } from './rows/rows.component';
import { ETabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    ERowsComponent,
    ERowComponent,
    EElementComponent,
    ETabsComponent,
    EPanelComponent,
    EControlComponent,
    UFDragDirective,
    UFDropDirective,
    EMenuAddElementComponent,
  ],
  imports: [
    MatIconModule,
    MatTabsModule,
    MatCardModule,
    MatMenuModule,
    MatButtonModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  exports: [ERowsComponent, ERowComponent, EElementComponent, ETabsComponent, EPanelComponent, EControlComponent],
})
export class ElementsModule {}
