import Model from "../model/model";

interface Options {
  isInterval: boolean;
  isTooltip: boolean;
  isLimit: boolean;
  isRange: boolean;
  isScale: boolean;
  isVertical: boolean;
  isPanel: boolean;
  isStepSet: boolean;
  positionParameter: string;
  lengthParameter: string;
  to: number;
  from: number;
  step: number;
  stepLength: number;
  min: number;
  max: number;
  scalePositionParameter: string;
  scaleNumber: number;
  scaleElements: number[];
  lengthBetweenScaleElements: number;
  panelPosition: number;
  panelPositionParameter: string;
  numberOfCharactersAfterDot: number;
  subViewOptions: any,
}

interface Config {
  isInterval: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  keyboard: boolean;
  isVertical: boolean;
  isTooltip: boolean;
  isLimit: boolean;
  isRange: boolean;
  isScale: boolean;
  scaleNumber: number;
  isPanel: boolean;
}

interface UserConfig {
  isInterval?: boolean;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
  keyboard?: boolean;
  isVertical?: boolean;
  isTooltip?: boolean;
  isLimit?: boolean;
  isRange?: boolean;
  isScale?: boolean;
  scaleNumber?: number;
  isPanel?: boolean;
}

interface SubViewOptions {
  sliderPosition: number;
  sliderLength: number;
  runnerFromPosition: number;
  runnerToPosition: number;
  runnerLength: number;
  clickPosition: number;
  isMinFrom: boolean;
  isMaxFrom: boolean;
  isMaxTo: boolean;
  isCursorNearStepAheadFrom: boolean;
  isCursorNearStepBehindFrom: boolean;
  isCursorNearStepAheadTo: boolean;
  isCursorNearStepBehindTo: boolean;
  isClickAheadOfRunnerFrom: boolean;
  isClickBehindOfRunnerFrom: boolean;
  isClickAheadOfRunnerTo: boolean;
  isClickBehindOfRunnerTo: boolean;
  runnerFromStepsNumber: number;
  runnerToStepsNumber: number;
  modelOptions: Model;
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
  Options, Config, UserConfig, SubViewOptions, ElementsParameters,
};
