interface Options {
  modelOptions: ModelOptions;
  subViewOptions: SubViewOptions;
}

interface ModelOptions {
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
}

interface SubViewOptions {
  sliderPosition: number;
  sliderLength: number;
  runnerFromPosition: number;
  runnerToPosition: number;
  runnerLength: number;
  limitMinLength: number;
  limitMaxLength: number;
  shiftAxis: number;
  clickPosition: number;
  isMinFrom: boolean;
  isMaxFrom: boolean;
  isMaxTo: boolean;
  isCursorNearStepAheadFrom: boolean;
  isCursorNearStepBehindFrom: boolean;
  isClickForRunnerFrom: boolean;
  isCursorNearStepAheadTo: boolean;
  isCursorNearStepBehindTo: boolean;
  isClickAheadOfRunnerFrom: boolean;
  isClickBehindOfRunnerFrom: boolean;
  isClickAheadOfRunnerTo: boolean;
  isClickBehindOfRunnerTo: boolean;
  isClickForRunnerTo: boolean;
  runnerFromStepsNumber: number;
  runnerToStepsNumber: number;
  isScaleElementOnDown: boolean;
  scaleElementPosition: number;
  scaleElementLength: number;
  scaleElementValue: string;
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

export {
  Options, ModelOptions, Config, UserConfig, SubViewOptions,
};
