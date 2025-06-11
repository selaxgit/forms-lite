import { inject, Injectable } from '@angular/core';
import JSZip from 'jszip';

import { FormsDBService } from '../../db/forms.db.service';
import { DtoStore } from '../../stores/dto.store';
import { FormsStore } from '../../stores/forms.store';
import { SourceDataStore } from '../../stores/source-data.store';

@Injectable({ providedIn: 'root' })
export class ImportDemoService {
  private readonly formsDBService = inject(FormsDBService);

  private readonly formsStore = inject(FormsStore);

  private readonly dtoStore = inject(DtoStore);

  private readonly sourceDataStore = inject(SourceDataStore);

  async import(): Promise<void> {
    const response = await fetch('assets/demo/demo.zip', { headers: { Accept: 'application/zip' } });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const zip = new JSZip();
    const blob = await response.blob();
    const zipData = await zip.loadAsync(blob);
    for (const filename of Object.keys(zipData.files)) {
      const content = await zipData.file(filename)?.async('string');
      if (!content) {
        continue;
      }
      let json;
      try {
        json = JSON.parse(content);
      } catch (e) {
        continue;
      }
      const nameType = filename.split('.').shift();
      switch (nameType?.toLowerCase()) {
        case 'dto':
          this.dtoStore.importDto(json);
          break;
        case 'ds':
          this.sourceDataStore.importDataSource(json);
          break;
        case 'form':
          this.formsStore.importForm(json);
          break;
      }
    }
  }
}
