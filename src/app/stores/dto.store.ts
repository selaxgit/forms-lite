import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { finalize, switchMap } from 'rxjs';

import { IUFDto } from '../common/interfaces';
import { DtoDBService } from '../db/dto.db';

interface DtoState {
  dtoList: IUFDto[];
  isLoadingState: boolean;
}

const initialState: DtoState = {
  dtoList: [],
  isLoadingState: false,
};

@Injectable({ providedIn: 'root' })
export class DtoStore extends ComponentStore<DtoState> implements OnStoreInit {
  readonly isLoadingState = this.selectSignal((state: DtoState) => state.isLoadingState);

  readonly dtoList$ = this.select((state: DtoState) => state.dtoList);

  private readonly dtoDBService = inject(DtoDBService);

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit(): void {
    this.patchState({ dtoList: [], isLoadingState: true });
    this.dtoDBService
      .getList()
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe((dtoList: IUFDto[]) => this.patchState({ dtoList }));
  }

  importDto(dto: Partial<IUFDto>): void {
    this.patchState({ isLoadingState: true });
    this.dtoDBService
      .insert(dto)
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe((newDto: IUFDto) => {
        this.setState((state: DtoState) => {
          state.dtoList.push(newDto);
          return { ...state };
        });
      });
  }

  saveDto(source: IUFDto): void {
    this.patchState({ isLoadingState: true });
    const method = source.id ? this.dtoDBService.update(source.id, source) : this.dtoDBService.insert(source);
    method
      .pipe(
        switchMap(() => this.dtoDBService.getList()),
        finalize(() => this.patchState({ isLoadingState: false })),
      )
      .subscribe((dtoList: IUFDto[]) => this.patchState({ dtoList }));
  }

  removeDto(id: number): void {
    this.patchState({ isLoadingState: true });
    this.dtoDBService
      .remove(id)
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe(() => {
        this.setState((state: DtoState) => {
          state.dtoList = state.dtoList.filter((form: IUFDto) => form.id !== id);
          return { ...state };
        });
      });
  }
}
