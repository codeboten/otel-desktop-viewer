import React from "react";
import { useLoaderData } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";

import { SpanData, TelemetryData } from "../types/api-types";
import { TraceData } from "../types/api-types";
import { SpanDataStatus, SpanWithUIData } from "../types/ui-types";
// import { orderSpans } from "../utils/span-stuff";

import { TraceDetailView } from "../components/telemetry-detail-view/detail-trace-view";
// import { Header } from "../components/header-view/header";
import { DetailView } from "../components/detail-view/detail-view";
import { WaterfallView } from "../components/waterfall-view/waterfall-view";
import { arrayToTree, TreeItem, RootTreeItem } from "../utils/array-to-tree";
import { getNsFromString, calculateTraceTiming } from "../utils/duration";
import { orderSpans } from "../utils/trace-stuff";

export async function telemetryLoader({ params }: any) {
  let response = await fetch(`/api/telemetry/${params.id}`);
  // let response = await fetch(`/api/traces/${params.id}`);
  let telemetryData = await response.json();
  console.log("telemloader", telemetryData);
  return telemetryData;
}

export default function TelemetryView() {
  let telemetryData = useLoaderData() as TelemetryData;
  let [telemetryType, setTelemetryType] = React.useState<string>(
    telemetryData.type,
  );
  let [selectedSpanID, setSelectedSpanID] = React.useState<string>("");
  let traceData = telemetryData.trace as TraceData;
  let selectedSpan = {} as SpanData;

  if (telemetryType === "trace") {
    let traceTimeAttributes = calculateTraceTiming(traceData.spans);
    let spanTree: RootTreeItem[] = arrayToTree(traceData.spans);
    let orderedSpans = orderSpans(spanTree);
    selectedSpan = traceData.spans[0];
  }

  React.useEffect(() => {
    setTelemetryType(telemetryData.type); //this is janky make it batter
  }, [telemetryData]);

  // let selectedSpan = traceData.spans.find(
  //   (span: { spanID: string }) => span.spanID === selectedSpanID,
  // );

  return (
    <Grid
      templateAreas={`"header detail"
                       "main detail"`}
      gridTemplateColumns={"1fr 350px"}
      gridTemplateRows={"100px 1fr"}
      gap={"0"}
      height={"100vh"}
      width={"100vw"}
    >
      <GridItem area={"header"}>
        {/* <Header traceID={traceData.traceID} /> */}
      </GridItem>
      <GridItem
        area={"main"}
        marginLeft="20px"
      ></GridItem>
      <GridItem area={"detail"}>
        {/* <DetailView span={selectedSpan} /> */}
        {/* <TraceDetailView data={telemetryData} /> */}
        {telemetryType == "trace" && <TraceDetailView span={selectedSpan} />}
        {/* <div>{`this is a ${telemetryData.type}`}</div> */}
      </GridItem>
    </Grid>
  );
}
