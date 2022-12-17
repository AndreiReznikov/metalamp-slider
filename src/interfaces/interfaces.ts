interface Options {
  modelOptions: ModelOptions;
  subViewOptions: SubViewOptions;
}

interface ModelOptions {
  double: boolean;
  vertical: boolean;
  showTooltip: boolean;
  showLimit: boolean;
  showRange: boolean;
  showScale: boolean;
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
  double: boolean;
  vertical: boolean;
  useKeyboard: boolean;
  showTooltip: boolean;
  showLimit: boolean;
  showRange: boolean;
  showScale: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  scaleNumber: number;
}

interface UserConfig {
  double?: boolean;
  vertical?: boolean;
  useKeyboard?: boolean;
  showTooltip?: boolean;
  showLimit?: boolean;
  showRange?: boolean;
  showScale?: boolean;
  min?: number;
  max?: number;
  from?: number;
  to?: number;
  step?: number;
  scaleNumber?: number;
}

export {
  Options, ModelOptions, Config, UserConfig, SubViewOptions,
};
