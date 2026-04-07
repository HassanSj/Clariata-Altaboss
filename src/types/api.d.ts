import {ApiPatchType} from "~/ui/constants/api";

export interface IPatchUpdate {
  op: ApiPatchType;
  path: string;
  value: string;
}

