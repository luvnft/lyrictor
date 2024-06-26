import { RGBColor } from "react-color";
import create from "zustand";

export interface VisualizerSettingValue {
  value: number;
  beatSyncIntensity: number;
}

export interface ColorStop {
  stop: number;
  color: RGBColor;
  beatSyncIntensity: number;
}

export interface VisualizerSetting {
  fillRadialGradientStartPoint: { x: number; y: number };
  fillRadialGradientEndPoint: { x: number; y: number };
  fillRadialGradientStartRadius: VisualizerSettingValue;
  fillRadialGradientEndRadius: VisualizerSettingValue;
  fillRadialGradientColorStops: ColorStop[];
}

export const DEFAULT_VISUALIZER_SETTING: VisualizerSetting = {
  fillRadialGradientStartPoint: { x: 50, y: 50 },
  fillRadialGradientEndPoint: { x: 50, y: 50 },
  fillRadialGradientStartRadius: { value: 0, beatSyncIntensity: 0 },
  fillRadialGradientEndRadius: { value: 1, beatSyncIntensity: 1 },
  fillRadialGradientColorStops: [
    { stop: 0, color: { r: 255, g: 179, b: 186 }, beatSyncIntensity: 0 },
    { stop: 0.25, color: { r: 255, g: 223, b: 186 }, beatSyncIntensity: 0 },
    { stop: 0.76, color: { r: 255, g: 255, b: 186 }, beatSyncIntensity: 0 },
    { stop: 1, color: { r: 186, g: 255, b: 201 }, beatSyncIntensity: 0 },
  ],
};

export const useAudioVisualizerStore = create<{
  settings: VisualizerSetting[];
  updateSetting: <T extends keyof VisualizerSetting>(
    id: string,
    property: T,
    value: VisualizerSetting[T]
  ) => void;
  addSetting: (from: number, to: number, textBoxTimelineLevel: number) => void;
}>((set) => ({
  settings: [],
  updateSetting: <T extends keyof VisualizerSetting>(
    id: string,
    property: T,
    value: VisualizerSetting[T]
  ) => {
    // set((state) => ({
    //   settings: state.settings.map((setting) =>
    //     setting.id === id ? { ...setting, [property]: value } : setting
    //   ),
    // }));
  },
  addSetting: (from: number, to: number, textBoxTimelineLevel: number) => {
    set((state) => ({
      settings: [],
    }));
  },
}));

export function colorStopToArray(
  colorStops: ColorStop[],
  currentBeatIntensity?: number
): (number | string)[] {
  return colorStops.flatMap((colorStop) => {
    const { stop, color, beatSyncIntensity } = colorStop;
    let a = color.a ?? 1;

    if (beatSyncIntensity !== 0 && currentBeatIntensity) {
      a = beatSyncIntensity * currentBeatIntensity * a
    }
        
    const rgba = `rgba(${color.r}, ${color.g}, ${color.b}, ${a})`;
    return [stop, rgba];
  });
}
