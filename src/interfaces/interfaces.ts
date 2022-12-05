interface Options {
  isInterval: boolean;
  isTooltip: boolean;
  isMinAndMax: boolean;
  isRange: boolean;
  isScale: boolean;
  isVertical: boolean;
  isPanel: boolean;
  isStepSet: boolean;
  positionParameter: string;
  lengthParameter: string;
  sliderPosition: number;
  sliderLength: number;
  to: number;
  from: number;
  step: number;
  pageAxis1: number;
  runnerLength: number;
  stepLength: number;
  minValuePosition: number;
  maxValuePosition: number;
  minValue: number;
  maxValue: number;
  isMinValueShow: boolean;
  isMaxValueShow: boolean;
  minValueLength: number;
  maxValueLength: number;
  runnerFromPosition: number;
  runnerToPosition: number;
  tooltipFromPosition: number;
  tooltipToPosition: number;
  tooltipFromValue: number | string;
  tooltipToValue: number | string;
  rangePosition: number;
  rangeLength: number;
  scalePositionParameter: string;
  scaleNumber: number;
  scaleElements: number[];
  lengthBetweenScaleElements: number;
  panelPosition: number;
  panelPositionParameter: string;
  numberOfCharactersAfterDot: number;
}

interface Config {
  isInterval: boolean;
  minValue: number;
  maxValue: number;
  from: number;
  to: number;
  step: number;
  keyboard: boolean;
  isVertical: boolean;
  isTooltip: boolean;
  isMinAndMax: boolean;
  isRange: boolean;
  isScale: boolean;
  scaleNumber: number;
  isPanel: boolean;
}

interface UserConfig {
  isInterval?: boolean;
  minValue?: number;
  maxValue?: number;
  from?: number;
  to?: number;
  step?: number;
  keyboard?: boolean;
  isVertical?: boolean;
  isTooltip?: boolean;
  isMinAndMax?: boolean;
  isRange?: boolean;
  isScale?: boolean;
  scaleNumber?: number;
  isPanel?: boolean;
}

interface ElementsParameters {
  sliderPosition: number;
  sliderLength: number;
  runnerFromPosition: number;
  runnerLength: number;
  tooltipFromLength: number;
  tooltipToLength: number;
  minValueLength: number;
  maxValueLength: number;
  minValueWidth: number;
  maxValueWidth: number;
  scaleElementHeight: number;
}

export {
  Options, Config, UserConfig, ElementsParameters,
};
