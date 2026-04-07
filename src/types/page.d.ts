declare interface PageConfiguration {
  name: string;
  create?: RestConfiguration;
  read?: RestConfiguration;
  update?: RestConfiguration;
  remove?: RestConfiguration;
  form?: FormConfiguration;
  actions?: PageAction[];
  table?: TableConfiguration;
}

declare interface PageAction {
  name: string;
  endpoint: RestConfiguration;
}

declare interface RestConfiguration {
  url: string;
  method: string;
  params?: RestUrlParam[];
  body?: RestBodyField[];
}

declare interface RestUrlParam {
  name: string;
  value: any;
}

declare interface RestBodyField {
  name: string;
  value: any;
}

declare interface FormConfiguration {
  modelDefinition: string;
  name?: string;
  description?: string;
  inputs?: FormInputConfiguration[];
}

declare interface FormInputConfiguration {
  field: string;
  label?: string;
  hint?: string;
  width?: number; // grid width 1-12
  locked?: boolean;
  editable?: boolean;
  filterable?: boolean;
}

declare interface TableConfiguration {
  modelDefinition: string;
  searchDefinition?: string;
  columns?: TableColumnConfiguration[];
  visibleColumns?: string[];
  omittedColumns?: string[];
  editable?: boolean;
  filterable?: boolean;
  reorderable?: boolean;
  sortable?: boolean;
  sortConfiguration?: {
    field?: string;
    direction?: string;
  };
  paginationConfiguration?: {
    perPage?: number;
  };
  actions?: TableColumnActionConfiguration[];
}

declare interface TableColumnConfiguration {
  field: string;
  label?: string;
  width?: number;
  locked?: boolean;
  editable?: boolean;
  filterable?: boolean;
  sortable?: boolean;
  template?: string;
  templateParams?: any;
}

declare interface TableColumnActionConfiguration {
  name: string;
  endpoint: RestConfiguration;
}
