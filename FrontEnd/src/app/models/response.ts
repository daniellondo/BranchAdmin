import { Branch } from "./branch";
import { Currency } from "./currency";

export interface EndpointBranchResponse {
  message: string;
  result:  Branch[];
  error:   null;
}

export interface EndpointCurrencyResponse {
  message: string;
  result:  Currency[];
  error:   null;
}
