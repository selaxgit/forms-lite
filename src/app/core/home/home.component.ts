import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Title } from '@angular/platform-browser';
import { JSTDialogService } from '@jst/ui';

import { CommonHeaderComponent } from '../../common/components/header/header.component';
import { APP_TITLE } from '../../common/constants';
import { ImportDemoService } from '../../common/services/import-demo.serice';
import { CurrentFormStore } from '../../stores/current-form.store';
import { DtoListComponent } from '../dto-list/dto-list.component';
import { FormsListComponent } from '../forms-list/forms-list.component';
import { SourceDataListComponent } from '../source-data-list/source-data-list.component';

@Component({
  selector: 'core-home-page',
  imports: [
    MatIconModule,
    MatButtonModule,
    CommonHeaderComponent,
    FormsListComponent,
    SourceDataListComponent,
    DtoListComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CoreHomePageComponent implements OnInit {
  private readonly titleService = inject(Title);

  private readonly currentFormStore = inject(CurrentFormStore);

  private readonly jstDialogService = inject(JSTDialogService);

  private readonly importDemoService = inject(ImportDemoService);

  constructor() {
    this.titleService.setTitle(APP_TITLE);
  }

  ngOnInit(): void {
    this.currentFormStore.setEmptyForm();
  }

  async onImportDemo(): Promise<void> {
    this.jstDialogService.showWait();
    try {
      await this.importDemoService.import();
      this.jstDialogService.showToastSuccess('Загрузка прошла успешно');
      window.location.reload(); // Чёт сторы не срабатывают - пока просто перегружу страницу
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      this.jstDialogService.showToastError(error.message);
    } finally {
      this.jstDialogService.hideWait();
    }
  }
}
