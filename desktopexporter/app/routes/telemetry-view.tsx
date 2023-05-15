import React from "react";
import { useLoaderData } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";

import { TelemetryData } from "../types/api-types";
import { TraceData } from "../types/api-types";
import { SpanDataStatus, SpanWithUIData } from "../types/ui-types";
import { orderSpans } from "../utils/span-stuff";

import { TraceDetailView } from "../components/telemetry-detail-view/detail-trace-view";
// import { Header } from "../components/header-view/header";
import { DetailView } from "../components/detail-view/detail-view";
import { WaterfallView } from "../components/waterfall-view/waterfall-view";
import { arrayToTree, TreeItem, RootTreeItem } from "../utils/array-to-tree";
// import { getNsFromString, calculateTraceTiming } from "../utils/duration";

export async function telemetryLoader({ params }: any) {
  // let response = await fetch(`/api/telemetry/${params.id}`);
  let response = await fetch(`/api/traces/${params.id}`);
  let telemetryData = await response.json();
  console.log("telemloader", telemetryData);
  return telemetryData;
}

export default function TelemetryView() {
  let telemetryData = useLoaderData() as TelemetryData;

  console.log("telemetryview data:", telemetryData);
  let [telemetryType, setTelemetryType] = React.useState(telemetryData.type);
  // let traceTimeAttributes = calculateTraceTiming(telemetryData.spans);
  // console.log("telemetryView telemetryData:", telemetryData);

  // let spanTree: RootTreeItem[] = arrayToTree(telemetryData.spans);
  // let orderedSpans = orderSpans(spanTree);

  // let [selectedSpanID, setSelectedSpanID] = React.useState<string>(() => {
  //   if (
  //     !orderedSpans.length ||
  //     (!(orderedSpans[0].status === SpanDataStatus.present) &&
  //       orderedSpans.length < 2)
  //   ) {
  //     return "";
  //   }

  //   if (!(orderedSpans[0].status === SpanDataStatus.present)) {
  //     return orderedSpans[1].metadata.spanID;
  //   }

  //   return orderedSpans[0].metadata.spanID;
  // });
  // setSelectedSpanID(
  //   orderedSpans[0].status === SpanDataStatus.present
  //     ? orderedSpans[0].metadata.spanID
  //     : orderedSpans[1].metadata.spanID,
  // );

  // let selectedSpan = telemetryData.spans.find(
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
        {telemetryType == "trace" && <TraceDetailView span={telemetryData} />}
        <div>telemetry</div>
      </GridItem>
    </Grid>
  );
}
