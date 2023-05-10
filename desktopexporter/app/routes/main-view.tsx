import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { Flex, useBoolean } from "@chakra-ui/react";
import { useLoaderData } from "react-router-dom";

import { Sidebar } from "../components/sidebar-view/sidebar";
import { EmptyStateView } from "../components/empty-state-view/empty-state-view";
// import { TraceSummaries, TraceSummary } from "../types/api-types";
import { TelemetrySummaries, Summary } from "../types/api-types";

export async function mainLoader() {
  const response = await fetch("/api/telemetry");
  const telemetry = await response.json(); //TO DO fix type stuff
  const summaries = telemetry.summaries;
  return summaries;
}

export default function MainView() {
  let summaries = useLoaderData() as TelemetrySummaries;
  let [isFullWidth, setFullWidth] = useBoolean(true); //<- TO DO change this
  const [sidebarData, setSidebarData] = useState<TelemetrySummaries>(summaries);

  // To Do: initialize the sidebar summaries at mount time
  // add useEffect to check for new data
  useEffect(() => {
    async function checkForNewData() {
      let response = await fetch("/api/telemetry");
      if (response.ok) {
        let summaries = (await response.json()) as TelemetrySummaries;
        // let summaries = await response.json();
        setSidebarData(summaries);
      }
    }

    // let interval = setInterval(checkForNewData, 5000);

    // return () => clearInterval(interval);
  }, []);

  //TO DO: fix this... typescript stuff
  return (
    <Flex height="100vh">
      <Sidebar
        isFullWidth={isFullWidth}
        toggleSidebarWidth={setFullWidth.toggle}
        summaries={sidebarData}
        numNewTraces={0}
      />
      {!summaries.length && <EmptyStateView />}
      {summaries.length && <Outlet />}
    </Flex>
  );
}
