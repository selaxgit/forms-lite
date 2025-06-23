import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JSTDialogService, JSTInputModule } from '@jst/ui';

import { IUFDto } from '../../../../common/interfaces';
import { DtoStore } from '../../../../stores/dto.store';
import { ChoiceDtoComponent, IChoiceDtoData } from './choice-dto/choice-dto.component';

@Component({
  selector: 'input-bind-dto',
  imports: [MatIconModule, MatButtonModule, JSTInputModule],
  templateUrl: './input-bind-dto.component.html',
  styleUrl: './input-bind-dto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputBindDtoComponent {
  @Input() label = 'bind DTO';

  @Input() clearButton = false;

  @Input() set value(val: string | null) {
    this.bindDTO.set(val);
  }

  @Output() valueChange = new EventEmitter<string | null>();

  readonly bindDTO: WritableSignal<string | null> = signal(null);

  private readonly jstDialogService = inject(JSTDialogService);

  private readonly dtoStore = inject(DtoStore);

  private readonly destroyRef = inject(DestroyRef);

  onValueChange(value: string | null): void {
    this.valueChange.emit(value);
  }

  onChooseDto(): void {
    this.dtoStore.dtoList$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((dtoList: IUFDto[]) => {
      this.jstDialogService
        .showModal<string | null, IChoiceDtoData>('Выбор DTO', ChoiceDtoComponent, { dtoList }, true)
        .subscribe((value: string | null) => {
          if (value) {
            this.bindDTO.set(value);
            this.valueChange.emit(value);
          }
        });
    });
  }
}
