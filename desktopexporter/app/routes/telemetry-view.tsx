import React from "react";
import { useLoaderData } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";

import { TelemetryData } from "../types/api-types";
import { TraceData } from "../types/api-types";

// import { Header } from "../components/header-view/header";
// import { DetailView } from "../components/detail-view/detail-view";
// import { WaterfallView } from "../components/waterfall-view/waterfall-view";

export async function telemetryLoader({ params }: any) {
  console.log(params.id);
  let response = await fetch(`/api/telemetry/${params.id}`);
  let telemetryData = await response.json();
  return telemetryData;
}

export default function TelemetryView() {
  let telemetryData = useLoaderData() as TelemetryData;

  return <div>hello from telemetry view!</div>;
}
