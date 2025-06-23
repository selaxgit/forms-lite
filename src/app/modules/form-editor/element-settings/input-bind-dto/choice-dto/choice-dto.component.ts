/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChangeDetectionStrategy, Component, inject, Input, OnInit, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';

import { JsonHelper } from '../../../../../common/helpers/json.helper';
import { IUFDto } from '../../../../../common/interfaces';
import { SessionStorageService } from '../../../../../common/services/storage.service';

const LAST_DTO_STORE_KEY = 'fl:last-dto-store';
export interface IChoiceDtoData {
  dtoList: IUFDto[];
}

interface IAvailableDto {
  id: number;
  name: string;
  props: string[];
}

@Component({
  imports: [MatButtonModule],
  templateUrl: './choice-dto.component.html',
  styleUrl: './choice-dto.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChoiceDtoComponent implements OnInit {
  @Input() dtoList: IUFDto[] = [];

  availableDto: IAvailableDto[] = [];

  dialogRef!: MatDialogRef<ChoiceDtoComponent>;

  readonly availableProps: WritableSignal<string[]> = signal([]);

  readonly currentChoice: WritableSignal<string | null> = signal(null);

  readonly currentDto: WritableSignal<IAvailableDto | null> = signal(null);

  readonly currentProp: WritableSignal<string | null> = signal(null);

  private readonly sessionStorageService = inject(SessionStorageService);

  ngOnInit(): void {
    this.setLists(this.dtoList);
    const lastDtoId = this.sessionStorageService.get<number>(LAST_DTO_STORE_KEY);
    if (lastDtoId !== null) {
      const dto = this.availableDto.find((item: IAvailableDto) => item.id === lastDtoId);
      if (dto) {
        this.onChooseDto(dto);
      }
    }
  }

  onChooseProp(prop: string): void {
    this.currentProp.set(prop);
    this.currentChoice.set(`${this.currentDto()?.name}: ${prop}`);
  }

  onChooseDto(dto: IAvailableDto): void {
    this.currentDto.set(dto);
    this.availableProps.set(dto.props);
    this.sessionStorageService.set(LAST_DTO_STORE_KEY, dto.id);
  }

  onApply(): void {
    if (this.currentProp()) {
      this.dialogRef.close(this.currentProp());
    }
  }

  onClose(): void {
    this.dialogRef.close(null);
  }

  private setLists(availableDto: IUFDto[]): void {
    for (const dto of availableDto) {
      let props: string[] = [];
      JsonHelper.parseJsonKeysToArray(props, dto.source);
      this.availableDto.push({
        id: Number(dto.id),
        name: dto.name,
        props,
      });
    }
  }
}
