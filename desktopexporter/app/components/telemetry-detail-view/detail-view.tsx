import React from "react";
import { Flex, Tab, TabList, TabPanels, Tabs } from "@chakra-ui/react";
import {
  LogData,
  MetricData,
  TelemetryData,
  TraceData,
} from "../../types/api-types";

// import api types

// type DetailViewProps = {
//   span: SpanData | undefined;
// };

// import { SpanData } from "../../types/api-types";
// import { FieldsPanel } from "./fields-panel";
// import { EventsPanel } from "./events-panel";
// import { LinksPanel } from "./links-panel";

type DetailViewProps = {
  data: TelemetryData;
  //   data: MetricData | LogData | TraceData ???
  type: string;
};

export function DetailView(props: DetailViewProps) {
  return (
    <Flex
      grow="0"
      shrink="1"
      basis="350px"
      height="100vh"
      paddingTop="30px"
      overflowY="scroll"
    >
      <Tabs
        colorScheme="pink"
        margin={3}
        size="sm"
        variant="soft-rounded"
        width="100vw"
      >
        <TabList>
          {/* <Tab>Fields</Tab> */}
          <p>detail view</p>
          <p>{`type is: ${props.type}`}</p>
        </TabList>
        <TabPanels></TabPanels>
      </Tabs>
    </Flex>
  );
}
