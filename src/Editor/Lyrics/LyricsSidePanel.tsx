import { TabList, Item, Tabs, View, Flex } from "@adobe/react-spectrum";
import { useProjectStore } from "../../Project/store";
import LyricReferenceView from "./LyricReferenceView";
import { useState } from "react";
import LyricTextCustomizationToolPanel from "../AudioTimeline/Tools/LyricTextCustomizationToolPanel";
import AudioVisualizerSettings from "../Visualizer/AudioVisualizerSettings";
import { useEditorStore } from "../store";

export default function LyricsSidePanel({
  maxRowHeight,
  containerWidth,
}: {
  maxRowHeight: number;
  containerWidth: number;
}) {
  const editingProject = useProjectStore((state) => state.editingProject);
  const lyricReference = useProjectStore((state) => state.lyricReference);
  const tabId = useEditorStore((state) => state.customizationPanelTabId);
  const setTabId = useEditorStore((state) => state.setCustomizationPanelTabId);

  return (
    <View>
      <View padding={"size-100"}>
        <Tabs
          aria-label="lyric-settings"
          onSelectionChange={(key: any) => {
            setTabId(key);
          }}
          selectedKey={tabId}
        >
          <TabList
            UNSAFE_style={{ paddingLeft: 10, paddingRight: 10, height: 45 }}
          >
            <Item key="reference">Lyric reference</Item>
            <Item key="text_settings">Text settings</Item>
            <Item key="visualizer_settings">Visualizer settings</Item>
          </TabList>
        </Tabs>
      </View>
      <View maxHeight={maxRowHeight - 64} overflow={"auto"}>
        {tabId === "reference" && lyricReference !== undefined ? (
          <LyricReferenceView key={editingProject?.name} />
        ) : null}
        {tabId === "text_settings" ? (
          <Flex justifyContent={"center"} marginTop={10}>
            <LyricTextCustomizationToolPanel
              height={"100%"}
              width={containerWidth - 20}
            />
          </Flex>
        ) : null}
        {tabId === "visualizer_settings" ? (
          <Flex justifyContent={"center"} marginTop={10}>
            <AudioVisualizerSettings width={containerWidth - 20} />
          </Flex>
        ) : null}
      </View>
    </View>
  );
}
