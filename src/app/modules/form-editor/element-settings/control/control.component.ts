import { ChangeDetectionStrategy, Component, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import {
  IJSTSelectItem,
  JSTCheckboxModule,
  JSTDatepickerModule,
  JSTInputModule,
  JSTInputNumberModule,
  JSTSelectModule,
} from '@jst/ui';

import { FLControlSubTypeEnum, FLControlTypeEnum, FLTextMaskEnum, IFLElement } from '../../../../common/interfaces';
import { ElementsHelper } from '../../helpers/elements.helper';
import { InputBindDtoComponent } from '../input-bind-dto/input-bind-dto.component';
import { FEInputDataSourceComponent } from '../input-data-source/input-data-source.component';
import { FETrueFalseCondComponent } from '../true-false-cond/true-false-cond.component';

@Component({
  selector: 'control-settings',
  imports: [
    MatButtonToggleModule,
    MatIconModule,
    JSTInputModule,
    JSTCheckboxModule,
    JSTSelectModule,
    JSTInputNumberModule,
    JSTDatepickerModule,
    FETrueFalseCondComponent,
    FEInputDataSourceComponent,
    InputBindDtoComponent,
  ],
  templateUrl: './control.component.html',
  styleUrl: './control.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FEControlSettingsComponent implements OnInit {
  @Input() element!: IFLElement;

  readonly disabledSubType: WritableSignal<boolean> = signal(true);

  readonly subTypesList: WritableSignal<IJSTSelectItem[]> = signal([]);

  readonly controlTypeEnum = FLControlTypeEnum;

  readonly controlTypesList: IJSTSelectItem[] = [
    {
      value: FLControlTypeEnum.Text,
      title: ElementsHelper.typeControlToString(FLControlTypeEnum.Text),
    },
    {
      value: FLControlTypeEnum.List,
      title: ElementsHelper.typeControlToString(FLControlTypeEnum.List),
    },
    {
      value: FLControlTypeEnum.Number,
      title: ElementsHelper.typeControlToString(FLControlTypeEnum.Number),
    },
    {
      value: FLControlTypeEnum.Datetime,
      title: ElementsHelper.typeControlToString(FLControlTypeEnum.Datetime),
    },
    {
      value: FLControlTypeEnum.Checkbox,
      title: ElementsHelper.typeControlToString(FLControlTypeEnum.Checkbox),
    },
  ];

  readonly maskTypeList: IJSTSelectItem[] = [
    {
      value: FLTextMaskEnum.Text,
      title: 'Любой текст (исключая спец. символы)',
    },
    {
      value: FLTextMaskEnum.Rus,
      title: 'Русский текст',
    },
    {
      value: FLTextMaskEnum.Eng,
      title: 'Английский текст',
    },
    {
      value: FLTextMaskEnum.Ruseng,
      title: 'Русско-английский текст',
    },
    {
      value: FLTextMaskEnum.Number,
      title: 'Только цифры',
    },
    {
      value: FLTextMaskEnum.Email,
      title: 'Email',
    },
    {
      value: FLTextMaskEnum.Phone,
      title: 'Телефон',
    },
    {
      value: FLTextMaskEnum.Custom,
      title: 'Указать вручную',
    },
  ];

  private readonly textSubTypesList: IJSTSelectItem[] = [
    {
      value: FLControlSubTypeEnum.Textarea,
      title: 'Многострочный текст',
    },
  ];

  get isDisabledCutomMask(): boolean {
    return this.element.controlProperties?.maskType !== FLTextMaskEnum.Custom;
  }

  get controlSubType(): FLControlSubTypeEnum | null {
    switch (this.element.controlType) {
      case FLControlTypeEnum.Text:
        return this.element.controlProperties?.controlSubType ?? null;
    }
    return null;
  }

  set controlSubType(value: FLControlSubTypeEnum | null) {
    if (this.element.controlProperties) {
      this.element.controlProperties.controlSubType = value;
    }
  }

  ngOnInit(): void {
    this.onChangeControlType();
  }

  onChangeControlType(): void {
    switch (this.element.controlType) {
      case FLControlTypeEnum.Text:
        this.disabledSubType.set(false);
        this.subTypesList.set(this.textSubTypesList);
        break;
      default:
        this.disabledSubType.set(true);
        this.subTypesList.set([]);
    }
  }
}
