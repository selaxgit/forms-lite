import { ChangeDetectionStrategy, Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JSTInputModule } from '@jst/ui';

import { SlidePanelService } from '../../../../common/components/slide-panel';
import { SourceDataEditComponent } from '../../../../common/components/source-data-edit/source-data-edit.component';
import { IFLRequest, IUFDataSource, UFDataSourceTypeEnum } from '../../../../common/interfaces';

const NO_DATA_TITLE = '<не указан>';

@Component({
  selector: 'input-data-source',
  imports: [MatIconModule, MatButtonModule, JSTInputModule],
  templateUrl: './input-data-source.component.html',
  styleUrl: './input-data-source.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FEInputDataSourceComponent {
  @Input() set dataSource(value: IUFDataSource | null) {
    this.dataSourceValue = value;
    this.updateTitle(value);
  }

  @Output() dataSourceChange = new EventEmitter<IUFDataSource | null>();

  private readonly slidePanelService = inject(SlidePanelService);

  private dataSourceValue: IUFDataSource | null = null;

  sourceDataTitle: string = NO_DATA_TITLE;

  onPopupEdit(): void {
    const dataSource = this.dataSourceValue
      ? JSON.parse(JSON.stringify(this.dataSourceValue))
      : {
          id: null,
          type: UFDataSourceTypeEnum.List,
          name: '',
          source: [],
        };
    this.slidePanelService
      .showPanel$<SourceDataEditComponent, IUFDataSource>(
        SourceDataEditComponent,
        {
          dataSource,
          editSourceAsValue: true,
        },
        { disabledClose: true },
      )
      .subscribe((value: IUFDataSource | null) => {
        if (value) {
          this.updateTitle(value);
          this.dataSourceChange.emit(value);
        }
      });
  }

  private updateTitle(dataSource: IUFDataSource | null): void {
    if (!dataSource) {
      this.sourceDataTitle = NO_DATA_TITLE;
      return;
    }
    const idSource = dataSource.id ? `#${dataSource.id} ` : '';
    switch (dataSource.type) {
      case UFDataSourceTypeEnum.Request:
        const source = dataSource.source as IFLRequest;
        this.sourceDataTitle = `${idSource}${source.methodHttp} Запрос: ${source.apiUrl}${source.methodApi}`;
        break;
      case UFDataSourceTypeEnum.List:
        this.sourceDataTitle = `${idSource}Заполненный список`;
        break;
    }
  }
}
