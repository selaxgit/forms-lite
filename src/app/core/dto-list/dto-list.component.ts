import { AsyncPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { JSTDialogService, JSTFileHelper } from '@jst/ui';

import { SlidePanelService } from '../../common/components/slide-panel';
import { IUFDto } from '../../common/interfaces';
import { DtoStore } from '../../stores/dto.store';
import { DtoEditComponent } from './dto-edit/dto-edit.component';

@Component({
  selector: 'dto-list',
  imports: [AsyncPipe, MatIconModule, MatButtonModule, MatProgressSpinnerModule, MatCardModule],
  templateUrl: './dto-list.component.html',
  styleUrl: './dto-list.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DtoListComponent {
  readonly dtoStore = inject(DtoStore);

  readonly slidePanelService = inject(SlidePanelService);

  private readonly jstDialogService = inject(JSTDialogService);

  onRemoveDto(dto: IUFDto): void {
    this.jstDialogService
      .showConfirm('Вы действительно хотите удалить это DTO?', 'Удаление DTO', 'Удалить DTO')
      .subscribe((confirm: boolean) => {
        if (confirm) {
          this.dtoStore.removeDto(Number(dto.id));
        }
      });
  }

  onImportDto(): void {
    JSTFileHelper.uploadJson().subscribe((dto: Partial<IUFDto>) => {
      this.dtoStore.importDto(dto);
    });
  }

  onExportDto(dto: IUFDto): void {
    const json = JSON.parse(JSON.stringify(dto));
    delete json.id;
    JSTFileHelper.downloadJson(json, `DTO - ${dto.name}.json`);
  }

  onEditDto(dto: IUFDto): void {
    this.editDto(JSON.parse(JSON.stringify(dto)));
  }

  onAddDto(): void {
    this.editDto({
      id: null,
      name: 'Новое DTO',
      source: {},
    });
  }

  private editDto(dto: IUFDto): void {
    this.slidePanelService
      .showPanel$<DtoEditComponent, IUFDto>(
        DtoEditComponent,
        {
          dto,
        },
        { disabledClose: false },
      )
      .subscribe((value: IUFDto | null) => {
        if (value) {
          this.dtoStore.saveDto(value);
        }
      });
  }
}
