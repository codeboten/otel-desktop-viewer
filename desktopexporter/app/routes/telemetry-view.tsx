import React from "react";
import { useLoaderData } from "react-router-dom";
import { Grid, GridItem } from "@chakra-ui/react";

import { TelemetryData } from "../types/api-types";
import { TraceData } from "../types/api-types";

import { DetailView } from "../components/telemetry-detail-view/detail-view";
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

  //   let selected = telemetryData.
  let type = telemetryData.type;

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
        <DetailView
          data={telemetryData}
          type={telemetryData.type}
        />
      </GridItem>
    </Grid>
  );
}

// {
//     "0": [
//       {
//         "serviceName": "",
//         "type": "log",
//         "ID": "0000000"
//       },
//       {
//         "serviceName": "",
//         "type": "metric",
//         "ID": "1111111"
//       },
//       {
//         "serviceName": "sample-loadgenerator",
//         "type": "trace",
//         "ID": "42957c7c2fca940a0d32a0cdd38c06a4"
//       },
//       {
//         "serviceName": "sample-currencyservice",
//         "type": "trace",
//         "ID": "7979cec4d1c04222fa9a3c7c97c0a99c"
//       }
//     ],
//     "0-1": {
//       "ID": "0000000",
//       "type": "log",
//       "metric": {
//         "name": "",
//         "resource": null,
//         "scope": null
//       },
//       "log": {
//         "body": "",
//         "resource": {
//           "attributes": {
//             "service.name": "sample-currencyservice",
//             "telemetry.sdk.language": "cpp",
//             "telemetry.sdk.name": "opentelemetry",
//             "telemetry.sdk.version": "1.5.0"
//           },
//           "droppedAttributesCount": 0
//         },
//         "scope": {
//           "name": "sample-currencyservice",
//           "version": "v1.2.3",
//           "attributes": {},
//           "droppedAttributesCount": 0
//         }
//       },
//       "trace": {
//         "traceID": "",
//         "spans": null
//       }
//     }
//   }
