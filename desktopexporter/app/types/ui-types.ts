import { SpanData } from "./api-types";

export enum SpanDataStatus {
  missing = "missing",
  present = "present",
}

export type SpanUIData = {
  depth: number;
  spanID: string;
};

export type SpanWithUIData =
  | {
      status: SpanDataStatus.present;
      spanData: SpanData;
      metadata: SpanUIData;
    }
  | {
      status: SpanDataStatus.missing;
      metadata: SpanUIData;
    };

export type SummaryWithUIData =
  | {
      hasRootSpan: true;
      rootServiceName: string;
      rootName: string;
      rootDurationString: string;
      spanCount: number;
      ID: string;
      type: string;
    }
  | {
      hasRootSpan: false;
      spanCount: number;
      ID: string;
      type: string;
    };

export type SidebarData = {
  numNewTelemetry: number;
  summaries: SummaryWithUIData[];
};
