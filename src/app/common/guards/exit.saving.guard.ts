import { inject } from '@angular/core';
import { JSTDialogService } from '@jst/ui';
import { Observable, of, switchMap } from 'rxjs';

import { CurrentFormStore } from '../../stores/current-form.store';

export const exitSavingGuard = (): Observable<boolean> => {
  const currentFormStore = inject(CurrentFormStore);
  if (!currentFormStore.hasChangedForm()) {
    return of(true);
  }
  const dialogService = inject(JSTDialogService);
  return dialogService
    .showCustomConfirm<number>(
      'Данные формы не сохранены',
      'Подтверждение перехода',
      [
        {
          title: 'Сохранить форму и перейти',
          color: 'success',
          value: 1,
        },
        {
          title: 'Перейти без сохранения',
          color: 'warn',
          value: 2,
        },
        {
          title: 'Отменить переход',
          color: 'primary',
          value: 3,
        },
      ],
      'Vertical',
    )
    .pipe(
      switchMap((button: number) => {
        switch (button) {
          case 1:
            return currentFormStore.saveForm().pipe(switchMap(() => of(true)));
          case 2:
            return of(true);
          default:
            return of(false);
        }
      }),
    );
};
