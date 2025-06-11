export type FLCreateElementType = FLElementTypeEnum | FLControlTypeEnum;

export enum FLElementTypeEnum {
  Tabs = 'tabs',
  Tab = 'tab',
  Panel = 'panel',
  Control = 'control',
}

export enum FLControlTypeEnum {
  Text = 'text',
  List = 'list',
  Number = 'number',
  Datetime = 'datetime',
  Checkbox = 'checkbox',
}

export enum FLControlSubTypeEnum {
  Textarea = 'textarea',
}

export enum FLTextMaskEnum {
  None = 'none',
  Text = 'text',
  Rus = 'rus',
  Eng = 'eng',
  Ruseng = 'ruseng',
  Number = 'number',
  Email = 'email',
  Phone = 'phone',
  Custom = 'custom',
}

export enum WidthUnitEnum {
  Pixels = 'pixels',
  Percents = 'percents',
}

export enum VerticalAlignEnum {
  Top = 'top',
  Middle = 'middle',
  Bottom = 'bottom',
}

export enum UFDataSourceTypeEnum {
  List = 'list',
  Request = 'request',
}

export enum UFMethodHttpEnum {
  Get = 'get',
  Post = 'post',
}

export interface IFLRow {
  guid: string;
  verticalAlign: VerticalAlignEnum;
  children: IFLElement[];
}

export interface IFLElement {
  guid: string;
  id: string;
  type: FLElementTypeEnum;
  controlType?: FLControlTypeEnum;
  controlProperties?: IFLControlProperties;
  label: string;
  autofill: boolean;
  visible: boolean | string;
  disabled: boolean | string;
  width?: number | null;
  widthUnit?: WidthUnitEnum;
  children?: (IFLElement | IFLRow)[];
}

export interface IFLControlProperties {
  controlSubType?: FLControlSubTypeEnum | null;
  bindDTO: string | null;
  clearButton: boolean;
  readonly: boolean | string;
  required: boolean | string;
  usePrefix: boolean;
  prefixIcon: string | null;
  prefixHint: string | null;
  useSuffix: boolean;
  suffixIcon: string | null;
  suffixHint: string | null;
  min?: string | number | null;
  max?: string | number | null;
  step?: string | number | null;
  allowDecimals?: boolean;
  decimals?: number | null;
  maskType?: FLTextMaskEnum | null;
  maskValue?: string | null;
  dataSource?: IUFDataSource | null;
}

export interface IFLParam {
  title: string;
  value: string;
}

export interface IFLBindResponse {
  root: string | null;
  value: string;
  title: string;
}
export interface IFLRequest {
  apiUrl: string;
  methodHttp: UFMethodHttpEnum;
  methodApi: string;
  params: IFLParam[];
  bindResponse: IFLBindResponse;
}

export interface IUFDataSource {
  id: number | null;
  type: UFDataSourceTypeEnum;
  name: string;
  source: IFLParam[] | IFLRequest;
}

export interface IUFDto {
  id: number | null;
  name: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  source: any;
}
