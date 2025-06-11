import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';

import { PanelContainerComponent } from '../../../common/components/panel-container/panel-container.component';
import { SlidePanelExtendClass } from '../../../common/components/slide-panel';
import { FLElementTypeEnum, IFLElement } from '../../../common/interfaces';
import { ElementsHelper } from '../helpers/elements.helper';
import { FECommonSettingsComponent } from './common/common.component';
import { FEControlSettingsComponent } from './control/control.component';
import { FETabsSettingsComponent } from './tabs/tabs.component';

@Component({
  selector: 'element-settings',
  imports: [
    MatTabsModule,
    MatButtonModule,
    PanelContainerComponent,
    FECommonSettingsComponent,
    FEControlSettingsComponent,
    FETabsSettingsComponent,
  ],
  templateUrl: './element-settings.component.html',
  styleUrl: './element-settings.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FESettingsComponent extends SlidePanelExtendClass implements OnChanges {
  tabIndex = 0;

  @Input() element!: IFLElement;

  readonly elementTypeEnum = FLElementTypeEnum;

  ngOnChanges(): void {
    this.tabIndex = 0;
  }

  getSettingsTitle(): string {
    return `Настройки элемента "${ElementsHelper.typeElementToString(this.element)}"`;
  }

  onApply(): void {
    this.closePanel(this.element);
  }

  onClose(): void {
    this.closePanel(null);
  }
}
