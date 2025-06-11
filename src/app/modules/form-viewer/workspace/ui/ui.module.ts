import { NgModule } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { JSTCheckboxModule, JSTDatepickerModule, JSTInputModule, JSTSelectModule, JSTTouchspinModule } from '@jst/ui';

import { UIControlComponent } from './control/control.component';
import { UIElementComponent } from './element/element.component';
import { UIPanelComponent } from './panel/panel.component';
import { UIRowComponent } from './row/row.component';
import { UIRowsComponent } from './rows/rows.component';
import { UITabsComponent } from './tabs/tabs.component';

@NgModule({
  declarations: [
    UIRowsComponent,
    UIRowComponent,
    UIElementComponent,
    UIPanelComponent,
    UITabsComponent,
    UIControlComponent,
  ],
  imports: [
    MatTabsModule,
    MatCardModule,
    MatTooltipModule,
    MatIconModule,
    JSTInputModule,
    JSTCheckboxModule,
    JSTDatepickerModule,
    JSTSelectModule,
    JSTTouchspinModule,
  ],
  exports: [UIRowsComponent, UIRowComponent, UIElementComponent, UIPanelComponent, UITabsComponent, UIControlComponent],
})
export class UIModule {}
