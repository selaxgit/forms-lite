import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JSTDialogService, JSTFileHelper } from '@jst/ui';

import { SlidePanelService } from '../../common/components/slide-panel/slide-panel.service';
import { SourceDataEditComponent } from '../../common/components/source-data-edit/source-data-edit.component';
import { IUFDataSource, UFDataSourceTypeEnum } from '../../common/interfaces';
import { SourceDataStore } from '../../stores/source-data.store';

@Component({
  selector: 'source-data-list',
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './source-data-list.component.html',
  styleUrl: './source-data-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SourceDataListComponent {
  readonly sourceDataStore = inject(SourceDataStore);

  readonly slidePanelService = inject(SlidePanelService);

  private readonly jstDialogService = inject(JSTDialogService);

  onRemoveSourceData(dataSource: IUFDataSource): void {
    this.jstDialogService
      .showConfirm(
        'Вы действительно хотите удалить этот источник данных?',
        'Удаление источника данных',
        'Удалить источник данных',
      )
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.sourceDataStore.removeDataSource(Number(dataSource.id));
        }
      });
  }

  onImportSourceData(): void {
    JSTFileHelper.uploadJson().subscribe((dataSource: Partial<IUFDataSource>) => {
      this.sourceDataStore.importDataSource(dataSource);
    });
  }

  onExportSourceData(dataSource: IUFDataSource): void {
    const json = JSON.parse(JSON.stringify(dataSource));
    delete json.id;
    JSTFileHelper.downloadJson(json, `DataSource - ${dataSource.name}.json`);
  }

  onEditSourceData(dataSource: IUFDataSource): void {
    this.editSourceData(JSON.parse(JSON.stringify(dataSource)));
  }

  onAddSourceData(): void {
    this.editSourceData({
      id: null,
      type: UFDataSourceTypeEnum.List,
      name: 'Новый источник',
      source: [],
    });
  }

  private editSourceData(dataSource: IUFDataSource): void {
    this.slidePanelService
      .showPanel$<SourceDataEditComponent, IUFDataSource>(
        SourceDataEditComponent,
        {
          dataSource,
        },
        { disabledClose: false },
      )
      .subscribe((value: IUFDataSource | null) => {
        if (value) {
          this.sourceDataStore.saveDataSource(value);
        }
      });
  }
}
