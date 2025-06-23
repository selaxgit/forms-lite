import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { IJSTSelectItem, JSTCheckboxModule, JSTInputModule, JSTInputNumberModule, JSTSelectModule } from '@jst/ui';

import { FLElementTypeEnum, IFLElement, WidthUnitEnum } from '../../../../common/interfaces';
import { FETrueFalseCondComponent } from '../true-false-cond/true-false-cond.component';

@Component({
  selector: 'common-settings',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    JSTInputModule,
    JSTCheckboxModule,
    JSTSelectModule,
    JSTInputNumberModule,
    FETrueFalseCondComponent,
  ],
  templateUrl: './common.component.html',
  styleUrl: './common.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FECommonSettingsComponent {
  @Input() element!: IFLElement;

  readonly elementTypeEnum = FLElementTypeEnum;

  readonly widthUnitList: IJSTSelectItem[] = [
    {
      value: WidthUnitEnum.Pixels,
      title: 'Пиксели',
    },
    {
      value: WidthUnitEnum.Percents,
      title: 'Проценты',
    },
  ];
}
