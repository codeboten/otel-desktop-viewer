import React from "react";
import { Flex, useColorModeValue } from "@chakra-ui/react";

// import { TraceList } from "./trace-list";
import { TelemetryList } from "./telemetry-list";
import { Summary } from "../../types/api-types";
// import { TraceSummary } from "../../types/api-types";
// import { TraceSummaryWithUIData } from "../../types/ui-types";
import { SummaryWithUIData } from "../../types/ui-types";
import { SidebarHeader } from "./sidebar-header";

const sidebarFullWidth = 350;
const sidebarCollapsedWidth = 70;

type SidebarProps = {
  isFullWidth: boolean;
  toggleSidebarWidth: () => void;
  summaries: SummaryWithUIData[];
  numNewTelemetry: number;
};

export function Sidebar(props: SidebarProps) {
  let sidebarColour = useColorModeValue("gray.50", "gray.700");
  let { isFullWidth, toggleSidebarWidth, summaries, numNewTelemetry } = props;
  // let isFullWidthDisabled = traceSummaries.length === 0;
  let isFullWidthDisabled = false;

  if (isFullWidth) {
    return (
      <Flex
        backgroundColor={sidebarColour}
        flexShrink="0"
        direction="column"
        transition="width 0.2s ease-in-out"
        width={sidebarFullWidth}
      >
        <SidebarHeader
          isFullWidth={isFullWidth}
          toggleSidebarWidth={toggleSidebarWidth}
          isFullWidthDisabled={false}
          numNewTraces={numNewTelemetry}
        />
        {/* {traceSummaries && <TraceList traceSummaries={props.traceSummaries} />} */}
        {summaries.length > 0 && <TelemetryList summaries={props.summaries} />}
      </Flex>
    );
  }

  return (
    <Flex
      alignItems="center"
      backgroundColor={sidebarColour}
      flexShrink="0"
      direction="column"
      transition="width 0.2s ease-in-out"
      width={sidebarCollapsedWidth}
    >
      <SidebarHeader
        isFullWidth={isFullWidth}
        isFullWidthDisabled={isFullWidthDisabled}
        toggleSidebarWidth={toggleSidebarWidth}
        numNewTraces={0}
      />
    </Flex>
  );
}
