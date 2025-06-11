import { inject, Injectable } from '@angular/core';
import { ComponentStore, OnStoreInit } from '@ngrx/component-store';
import { finalize, map, switchMap } from 'rxjs';

import { IUFDataSource } from '../common/interfaces';
import { SourceDataDBService } from '../db/source-data.db.service';

interface SourceDataState {
  sources: IUFDataSource[];
  isLoadingState: boolean;
}

const initialState: SourceDataState = {
  sources: [],
  isLoadingState: false,
};

@Injectable({ providedIn: 'root' })
export class SourceDataStore extends ComponentStore<SourceDataState> implements OnStoreInit {
  readonly isLoadingState = this.selectSignal((state: SourceDataState) => state.isLoadingState);

  readonly sourcesList$ = this.select((state: SourceDataState) => state.sources);

  private readonly sourceDataDBService = inject(SourceDataDBService);

  constructor() {
    super(initialState);
  }

  ngrxOnStoreInit(): void {
    this.patchState({ sources: [], isLoadingState: true });
    this.sourceDataDBService
      .getList()
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe((sources: IUFDataSource[]) => this.patchState({ sources }));
  }

  importDataSource(dataSource: Partial<IUFDataSource>): void {
    this.patchState({ isLoadingState: true });
    this.sourceDataDBService
      .insert(dataSource)
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe((ds: IUFDataSource) => {
        this.setState((state: SourceDataState) => {
          state.sources.push(ds);
          return { ...state };
        });
      });
  }

  saveDataSource(source: IUFDataSource, callback?: (ds: IUFDataSource) => void): void {
    this.patchState({ isLoadingState: true });
    const method = source.id
      ? this.sourceDataDBService.update(source.id, source)
      : this.sourceDataDBService.insert(source);
    method
      .pipe(
        switchMap((ds: IUFDataSource) =>
          this.sourceDataDBService.getList().pipe(map((sources: IUFDataSource[]) => ({ ds, sources }))),
        ),
        finalize(() => this.patchState({ isLoadingState: false })),
      )
      .subscribe((data: { ds: IUFDataSource; sources: IUFDataSource[] }) => {
        this.patchState({ sources: data.sources });
        if (typeof callback === 'function') {
          callback(data.ds);
        }
      });
  }

  removeDataSource(id: number): void {
    this.patchState({ isLoadingState: true });
    this.sourceDataDBService
      .remove(id)
      .pipe(finalize(() => this.patchState({ isLoadingState: false })))
      .subscribe(() => {
        this.setState((state: SourceDataState) => {
          state.sources = state.sources.filter((form: IUFDataSource) => form.id !== id);
          return { ...state };
        });
      });
  }
}
