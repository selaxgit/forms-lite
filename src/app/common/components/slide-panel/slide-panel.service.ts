/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApplicationRef, createComponent, DOCUMENT, inject, Injectable, Type } from '@angular/core';
import { Observable } from 'rxjs';

import { ISlidePanelParams } from './interfaces';
import { SlidePanelComponent } from './slide-panel.component';

const DEF_SLIDE_PANEL_PARAMS: ISlidePanelParams = {
  disabledClose: false,
  once: false,
};

@Injectable({
  providedIn: 'root',
})
export class SlidePanelService {
  private readonly document = inject(DOCUMENT);

  private readonly appRef = inject(ApplicationRef);

  showPanel$<T, R>(
    component: Type<T>,
    data?: any,
    params: Partial<ISlidePanelParams> = DEF_SLIDE_PANEL_PARAMS,
  ): Observable<R> {
    const panel = this.showPanel(component, data, params);
    return panel.afterClosed$;
  }

  showPanel<T>(
    component: Type<T>,
    data?: any,
    params: Partial<ISlidePanelParams> = DEF_SLIDE_PANEL_PARAMS,
  ): SlidePanelComponent {
    const panelRef = createComponent(SlidePanelComponent, { environmentInjector: this.appRef.injector });
    this.document.body.appendChild(panelRef.location.nativeElement);
    this.appRef.attachView(panelRef.hostView);
    panelRef.instance.setComponent(component, data ?? {}, params, () => {
      this.appRef.detachView(panelRef.hostView);
      panelRef.destroy();
    });
    return panelRef.instance;
  }
}
