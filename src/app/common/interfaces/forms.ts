import { IFLRow } from './fl.interfaces';

export interface IForm {
  id: number | null;
  name: string;
  rows: IFLRow[];
}
