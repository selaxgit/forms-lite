import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { IJSTSelectItem, JSTFormControl, JSTInputModule, JSTSelectModule } from '@jst/ui';

import { SourceDataStore } from '../../../stores/source-data.store';
import { ValidatorHelper } from '../../helpers/validator.helper';
import { IFLParam, IFLRequest, IUFDataSource, UFDataSourceTypeEnum, UFMethodHttpEnum } from '../../interfaces';
import { GlobalWaitService } from '../../services/global.wait.service';
import { PopupEditStringService } from '../../services/popup-edit-string.service';
import { PanelContainerComponent } from '../panel-container/panel-container.component';
import { SlidePanelExtendClass } from '../slide-panel';
import { BindResponseComponent } from './bind-response/bind-response.component';
import { ParamsHttpRequestComponent } from './params-http-request/params-http-request.component';
import { ParamsValueListComponent } from './params-value-list/params-value-list.component';

@Component({
  selector: 'source-data-edit',
  imports: [
    MatButtonModule,
    MatIconModule,
    PanelContainerComponent,
    JSTSelectModule,
    JSTInputModule,
    ParamsValueListComponent,
    ParamsHttpRequestComponent,
    BindResponseComponent,
  ],
  templateUrl: './source-data-edit.component.html',
  styleUrl: './source-data-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceDataEditComponent extends SlidePanelExtendClass implements OnInit {
  @Input() dataSource!: IUFDataSource;

  @Input() editSourceAsValue = false;

  title = 'Источник данных';

  applyButtonTitle = 'Сохранить источник данных';

  paramsTitleAddButton = 'Добавить параметр';

  paramsTitleList = 'Список параметров';

  paramItemTitle = 'Параметр';

  readonly isHttpRequest: WritableSignal<boolean> = signal(false);

  readonly hasAvaialbleSource: WritableSignal<boolean> = signal(false);

  readonly controlName = new JSTFormControl('', [Validators.required, ValidatorHelper.notEmptyValue]);

  avaialbleSourcesList: IJSTSelectItem[] = [];

  readonly sourceTypesList: IJSTSelectItem[] = [
    {
      value: UFDataSourceTypeEnum.List,
      title: 'Простой список',
    },
    {
      value: UFDataSourceTypeEnum.Request,
      title: 'Запрос',
    },
  ];

  readonly sourcesList: IJSTSelectItem[] = [];

  readonly avaialbleSource: WritableSignal<number> = signal(0);

  private readonly destroyRef = inject(DestroyRef);

  private readonly sourceDataStore = inject(SourceDataStore);

  private readonly globalWaitService = inject(GlobalWaitService);

  private readonly popupEditStringService = inject(PopupEditStringService);

  // private avaialbleSourceValue: number = 0;

  private avaialbleSources: IUFDataSource[] = [];

  get sourceType(): UFDataSourceTypeEnum {
    return this.dataSource.type;
  }

  set sourceType(value: UFDataSourceTypeEnum) {
    if (value !== this.sourceType) {
      this.setSourceType(value);
      this.setTitlesByType();
    }
  }

  get paramsList(): IFLParam[] {
    return this.sourceType === UFDataSourceTypeEnum.List
      ? (this.dataSource.source as IFLParam[])
      : (this.dataSource.source as IFLRequest).params;
  }

  get sourceHttpRequest(): IFLRequest {
    return this.dataSource.source as IFLRequest;
  }

  ngOnInit(): void {
    this.isHttpRequest.set(this.sourceType === UFDataSourceTypeEnum.Request);
    this.setTitlesByType();
    this.controlName.setValue(this.dataSource.name);
    this.controlName.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string) => (this.dataSource.name = value.trim()));
    if (this.editSourceAsValue) {
      this.title = 'Источник данных';
      this.hasAvaialbleSource.set(Boolean(this.dataSource.id));
      this.avaialbleSource.set(this.dataSource.id || 0);
      this.sourceDataStore.sourcesList$
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((sources: IUFDataSource[]) => {
          this.avaialbleSources = sources;
          this.avaialbleSourcesList = sources.map((i: IUFDataSource) => ({
            value: i.id,
            title: i.name,
          })) as IJSTSelectItem[];
          this.avaialbleSourcesList.unshift({
            value: 0,
            title: '<Не указан>',
          });
        });
    } else {
      this.title = this.dataSource.id ? 'Редактирование источника данных' : 'Новый источник данных';
    }
  }

  setAvaialbleSource(value: number): void {
    this.avaialbleSource.set(value);
    if (value > 0) {
      const avaialbleSource = this.avaialbleSources.find((i: IUFDataSource) => i.id === value);
      if (avaialbleSource) {
        this.dataSource.id = avaialbleSource.id;
        this.dataSource.type = avaialbleSource.type;
        this.dataSource.source = JSON.parse(JSON.stringify(avaialbleSource.source));
        this.isHttpRequest.set(this.dataSource.type === UFDataSourceTypeEnum.Request);
        this.setTitlesByType();
        this.hasAvaialbleSource.set(true);
        return;
      }
    }
    this.dataSource.id = null;
    this.hasAvaialbleSource.set(false);
  }

  onSaveAsTemplate(): void {
    this.popupEditStringService
      .showPopup('Сохранить как шаблон', 'Наименование шаблона')
      .subscribe((value?: string) => {
        if (value) {
          this.globalWaitService.showWait();
          const json = JSON.parse(JSON.stringify(this.dataSource));
          delete json.id;
          json.name = value;
          this.sourceDataStore.saveDataSource(json, (ds: IUFDataSource) => {
            this.avaialbleSource.set(Number(ds.id));
            this.globalWaitService.hideWait();
          });
        }
      });
  }

  onApply(): void {
    if (this.editSourceAsValue || this.controlName.valid) {
      this.closePanel(this.dataSource);
    }
  }

  onClosePanel(): void {
    this.closePanel(null);
  }

  private setSourceType(value: UFDataSourceTypeEnum): void {
    switch (value) {
      case UFDataSourceTypeEnum.List:
        this.dataSource.source = [];
        break;
      case UFDataSourceTypeEnum.Request:
        this.dataSource.source = {
          apiUrl: '',
          methodHttp: UFMethodHttpEnum.Get,
          methodApi: '',
          params: [],
          bindResponse: {
            root: null,
            value: '',
            title: '',
          },
        };
        break;
    }
    this.dataSource.type = value;
    this.isHttpRequest.set(this.sourceType === UFDataSourceTypeEnum.Request);
  }

  private setTitlesByType(): void {
    if (this.sourceType === UFDataSourceTypeEnum.List) {
      this.paramsTitleAddButton = 'Добавить значение';
      this.paramsTitleList = 'Список значений';
      this.paramItemTitle = 'Заголовок';
    } else {
      this.paramsTitleAddButton = 'Добавить параметр';
      this.paramsTitleList = 'Список параметров';
      this.paramItemTitle = 'Параметр';
    }
  }
}
