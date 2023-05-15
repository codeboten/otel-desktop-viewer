import React, { useRef } from "react";
import { FixedSizeList } from "react-window";
import { NavLink, useLocation } from "react-router-dom";
import {
  Flex,
  LinkBox,
  LinkOverlay,
  Divider,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { useSize } from "@chakra-ui/react-use-size";

// import { TraceSummaryWithUIData } from "../../types/ui-types";
import { SummaryWithUIData } from "../../types/ui-types";
import { Summary } from "../../types/api-types";

const sidebarSummaryHeight = 120;
const dividerHeight = 1;

type SidebarRowData = {
  selectedTraceID: string;
  summaries: SummaryWithUIData[];
};

type SidebarRowProps = {
  index: number;
  style: Object;
  data: SidebarRowData;
};

function SidebarRow({ index, style, data }: SidebarRowProps) {
  let selectedColor = useColorModeValue("pink.100", "pink.900");
  let dividerColour = useColorModeValue("blackAlpha.300", "whiteAlpha.300");
  let { selectedTraceID, summaries } = data; //TO DO UPDATE THIS
  let summary = summaries[index];

  let isSelected =
    selectedTraceID && selectedTraceID === summary.ID ? true : false;

  let backgroundColour = isSelected ? selectedColor : "";

  if (summary.hasRootSpan) {
    // Add zero-width space after forward slashes, dashes, and dots
    // to indicate line breaking opportunity
    let rootNameLabel = summary.rootName
      .replaceAll("/", "/\u200B")
      .replaceAll("-", "-\u200B")
      .replaceAll(".", ".\u200B");

    let rootServiceNameLabel = summary.rootServiceName
      .replaceAll("/", "/\u200B")
      .replaceAll("-", "-\u200B")
      .replaceAll(".", ".\u200B");

    return (
      <div style={style}>
        <Divider
          height={dividerHeight}
          borderColor={dividerColour}
        />
        <LinkBox
          display="flex"
          flexDirection="column"
          justifyContent="center"
          bgColor={backgroundColour}
          height={`${sidebarSummaryHeight}px`}
          paddingX="20px"
        >
          <Text
            fontSize="xs"
            noOfLines={1}
          >
            {"Root Service Name: "}
            <strong>{rootServiceNameLabel}</strong>
          </Text>
          <Text
            fontSize="xs"
            noOfLines={2}
          >
            {"Root Name: "}
            <strong>{rootNameLabel}</strong>
          </Text>
          <Text fontSize="xs">
            {"Root Duration: "}
            <strong>{summary.rootDurationString}</strong>
          </Text>
          <Text fontSize="xs">
            {"Number of Spans: "}
            <strong>{summary.spanCount}</strong>
          </Text>
          <LinkOverlay
            as={NavLink}
            to={`traces/${summary.ID}`}
          >
            <Text fontSize="xs">
              {"Trace ID: "}
              <strong>{summary.ID}</strong>
            </Text>
          </LinkOverlay>
        </LinkBox>
      </div>
    );
  }

  return (
    <div style={style}>
      <Divider
        height={dividerHeight}
        borderColor={dividerColour}
      />
      <LinkBox
        display="flex"
        flexDirection="column"
        justifyContent="center"
        bgColor={backgroundColour}
        height={`${sidebarSummaryHeight}px`}
        paddingX="20px"
      >
        {/* <Text fontSize="xs">
          {"Incomplete Trace: "}
          <strong>{"missing a root span"}</strong>
        </Text> */}
        {/* <Text fontSize="xs">
          {"Number of Spans: "}
          <strong>{traceSummary.spanCount}</strong>
        </Text> */}
        <LinkOverlay
          as={NavLink}
          to={`telemetry/${summary.ID}`}
        >
          <Text fontSize="xs">
            {"Telemetry ID: "}
            <strong>{summary.ID}</strong>
          </Text>
          <Text fontSize="xs">
            {"Telemetry type: "}
            <strong>{summary.type}</strong>
          </Text>
        </LinkOverlay>
      </LinkBox>
    </div>
  );
}

type TelemetryListProps = {
  summaries: SummaryWithUIData[];
};

export function TelemetryList(props: TelemetryListProps) {
  let ref = useRef(null);
  let size = useSize(ref);
  let location = useLocation();
  let { summaries } = props;

  // Default to the first trace in the list if none are selected
  //do i still need to set the window location here?
  function setSelected() {
    return location.pathname.includes("/telemetry/")
      ? location.pathname.split("/")[2]
      : props.summaries[0].ID;
  }

  let selectedTraceID = setSelected();

  let itemData = {
    selectedTraceID: selectedTraceID,
    summaries: summaries,
  };

  let itemHeight = sidebarSummaryHeight + dividerHeight;

  return (
    <Flex
      ref={ref}
      height="100%"
    >
      <FixedSizeList
        height={size ? size.height : 0}
        itemData={itemData}
        itemCount={props.summaries.length}
        itemSize={itemHeight}
        width="100%"
      >
        {SidebarRow}
      </FixedSizeList>
    </Flex>
  );
}
