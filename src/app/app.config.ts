import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { provideComponentStore } from '@ngrx/component-store';

import { routes } from './app.routes';
import { DtoStore } from './stores/dto.store';
import { SourceDataStore } from './stores/source-data.store';

export const appConfig: ApplicationConfig = {
  providers: [
    importProvidersFrom([BrowserAnimationsModule]),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideComponentStore(SourceDataStore),
    provideComponentStore(DtoStore),
  ],
};
