export type ApiMethod = "POST" | "GET";

export interface RequestParam {
  name: string;
  type: string;
  required?: boolean;
  description?: string;
}

export interface ResponseParam {
  code: string;
  message: string;
}

export interface ApiDoc {
  id: string;
  serviceGroupId: string;
  sectionNumber?: string;
  name: string;
  description: string;
  method: ApiMethod;
  endpoint: string;
  requestParams: RequestParam[];
  responseParams: ResponseParam[];
  xmlTemplate: string;
}

export interface ServiceGroup {
  id: string;
  name: string;
  description: string;
}

export interface GlobalError {
  code: string;
  message: string;
}

export interface VnptDocumentation {
  title: string;
  version: string;
  lastUpdated: string;
  serviceGroups: ServiceGroup[];
  globalErrors: GlobalError[];
  apis: ApiDoc[];
  hasGuide?: boolean;
}

export type ViewMode = "grid" | "list";
export type MainView = "apis" | "errors" | "guide";
export type MethodFilter = "ALL" | ApiMethod;
