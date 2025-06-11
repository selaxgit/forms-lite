/* eslint-disable @typescript-eslint/no-explicit-any */
import { animate, AnimationEvent, state, style, transition, trigger } from '@angular/animations';
import {
  Component,
  ComponentRef,
  ElementRef,
  HostBinding,
  HostListener,
  inject,
  OnDestroy,
  Type,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Subject } from 'rxjs';

import { ISlidePanelParams } from './interfaces';

@Component({
  templateUrl: './slide-panel.component.html',
  styleUrl: './slide-panel.component.scss',
  animations: [
    trigger('openClose', [
      state('open', style({ width: `{{width}}`, opacity: 1 }), {
        params: { width: '40vw' },
      }),
      state('closed', style({ width: '0', opacity: 0.5 })),
      transition('open => closed', [animate('0.1s')]),
      transition('closed => open', [animate('0.3s')]),
    ]),
  ],
})
export class SlidePanelComponent implements OnDestroy {
  @ViewChild('content', { read: ViewContainerRef }) viewContainerRef!: ViewContainerRef;

  componentRef: ComponentRef<any> | null = null;

  panelWidth = '0';

  isOpen = false;

  private isShowing = false;

  private readonly selfElementRef = inject(ElementRef);

  private panelParams: Partial<ISlidePanelParams> | null = null;

  private readonly afterClosed = new Subject<any>();

  readonly afterClosed$ = this.afterClosed.asObservable();

  private closeData: any = null;

  private closeCallback: (() => void) | null = null;

  @HostBinding('class.show') get show(): boolean {
    return this.isShowing;
  }

  @HostListener('click', ['$event']) onHostClick(e: MouseEvent): void {
    if (e.target === this.selfElementRef.nativeElement && !this.panelParams?.disabledClose) {
      this.closePanel();
    }
  }

  setComponent<T>(component: Type<T>, data: any, params: Partial<ISlidePanelParams>, onCloseEvent: () => void): void {
    this.panelParams = params;
    setTimeout(() => {
      this.viewContainerRef.clear();
      this.componentRef = this.viewContainerRef.createComponent(component);
      if (data) {
        Object.keys(data).forEach((key: string) => {
          this.componentRef?.setInput(key, data[key]);
        });
      }
      this.componentRef.instance.closePanel = (closeData: any = null) => this.closePanel(closeData, true, onCloseEvent);
      this.isShowing = true;
      setTimeout(() => {
        const clientRect = this.componentRef?.location.nativeElement.getBoundingClientRect();
        this.panelWidth = `${clientRect.width}px`;
        this.isOpen = true;
      });
    });
  }

  onAnimationDoneEvent(e: AnimationEvent): void {
    if (e.phaseName === 'done' && e.toState === 'closed' && e.totalTime > 0) {
      this.clearComponent();
    }
  }

  private closePanel(
    closeData: any = null,
    withAnimations: boolean = true,
    callback: (() => void) | null = null,
  ): void {
    this.closeCallback = callback;
    this.closeData = closeData;
    this.isOpen = false;
    if (!withAnimations) {
      this.clearComponent();
    }
  }

  ngOnDestroy(): void {
    this.viewContainerRef.clear();
  }

  private clearComponent(): void {
    this.isShowing = false;
    this.viewContainerRef.clear();
    this.componentRef = null;
    this.afterClosed.next(this.closeData);
    if (typeof this.closeCallback === 'function') {
      this.closeCallback();
    }
  }
}
