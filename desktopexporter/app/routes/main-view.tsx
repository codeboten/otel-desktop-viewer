import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Flex, useBoolean } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

import { Sidebar } from "../components/sidebar-view/sidebar";
import { EmptyStateView } from "../components/empty-state-view/empty-state-view";
import { TelemetrySummaries, Summary } from "../types/api-types";
import { SidebarData, SummaryWithUIData } from "../types/ui-types";
import { getDurationNs, getDurationString } from "../utils/duration";

export async function mainLoader() {
  const response = await fetch("/api/telemetry");
  const telemetrySummaries = await response.json();
  // const summaries = telemetry.summaries;
  await console.log("main loader telemetry summaries", telemetrySummaries);
  return telemetrySummaries;
}

export default function MainView() {
  let { summaries } = useLoaderData() as TelemetrySummaries;
  let [isFullWidth, setFullWidth] = useBoolean(true); //<- TO DO change this
  let [sidebarData, setSidebarData] = useState(initSidebarData(summaries));

  //TO DO: add useEffect to check for new data

  if (!summaries.length) {
    return (
      <Flex height="100vh">
        <Sidebar
          isFullWidth={isFullWidth}
          toggleSidebarWidth={setFullWidth.toggle}
          summaries={[]}
          numNewTelemetry={0}
        />
        <EmptyStateView />
      </Flex>
    );
  }

  return (
    <Flex height="100vh">
      <Sidebar
        isFullWidth={isFullWidth}
        toggleSidebarWidth={setFullWidth.toggle}
        summaries={sidebarData.summaries}
        numNewTelemetry={sidebarData.numNewTelemetry}
      />
      <Outlet />
    </Flex>
  );
}

function initSidebarData(telemetrySummaries: Summary[]): SidebarData {
  return {
    summaries: telemetrySummaries.map((summary) =>
      generateSummaryWithUIData(summary),
    ),
    numNewTelemetry: 0,
  };
}

function generateSummaryWithUIData(summary: Summary): SummaryWithUIData {
  if (summary.hasRootSpan) {
    let duration = getDurationNs(summary.rootStartTime, summary.rootEndTime);

    let durationString = getDurationString(duration);

    return {
      hasRootSpan: true,
      rootServiceName: summary.rootServiceName,
      rootName: summary.rootName,
      rootDurationString: durationString,
      spanCount: summary.spanCount,
      ID: summary.ID,
      type: summary.type,
    };
  }

  return {
    hasRootSpan: false,
    spanCount: summary.spanCount,
    ID: summary.ID,
    type: summary.type,
  };
}
