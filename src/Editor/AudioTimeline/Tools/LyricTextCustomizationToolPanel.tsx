import { Flex, View } from "@adobe/react-spectrum";
import { useMemo } from "react";
import { useProjectStore } from "../../../Project/store";
import { useEditorStore } from "../../store";
import {
  FontColorSettingRow,
  FontSettingRow,
  FontSizeSettingRow,
  FontWeightSettingRow,
  ShadowBlurColorSettingRow,
  ShadowBlurSettingRow,
  TextReferenceTextAreaRow,
} from "./CustomizationSettingRow";

export const CUSTOMIZATION_PANEL_WIDTH = 200;
const HEADER_HEIGHT = 25;

export default function LyricTextCustomizationToolPanel({
  height,
  width,
}: {
  height: any;
  width: any;
}) {
  const lyricTexts = useProjectStore((state) => state.lyricTexts);
  const selectedLyricTextIds = useEditorStore(
    (state) => state.selectedLyricTextIds
  );

  const selectedLyricText = useMemo(() => {
    const selectedFromTimeline =
      selectedLyricTextIds.size === 1
        ? lyricTexts.find((lyricText) => selectedLyricTextIds.has(lyricText.id))
        : undefined;

    return selectedFromTimeline;
  }, [selectedLyricTextIds]);

  return (
    <View width={width} height={height} overflow={"hidden hidden"}>
      {selectedLyricText?.text ? (
        <View
          overflow={"hidden auto"}
          height={height - HEADER_HEIGHT - 20}
          paddingY={10}
          key={selectedLyricText.id}
        >
          <Flex direction={"column"} gap={10}>
            <TextReferenceTextAreaRow lyricText={selectedLyricText} />
            <FontColorSettingRow
              selectedLyricText={selectedLyricText}
              width={width}
            />
            <FontSizeSettingRow
              selectedLyricText={selectedLyricText}
              width={width}
            />
            <FontWeightSettingRow selectedLyricText={selectedLyricText} />
            <FontSettingRow selectedLyricText={selectedLyricText} />
            <ShadowBlurSettingRow
              selectedLyricText={selectedLyricText}
              width={width}
            />
            <ShadowBlurColorSettingRow
              selectedLyricText={selectedLyricText}
              width={width}
            />
          </Flex>
        </View>
      ) : (
        <View
          UNSAFE_style={{
            fontStyle: "italic",
            color: "lightgray",
            opacity: 0.8,
          }}
        >
          No lyric text selected
        </View>
      )}
    </View>
  );
}
