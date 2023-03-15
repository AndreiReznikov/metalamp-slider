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
  localeString: boolean;
  isStepSet: boolean;
  positionParameter: string;
  lengthParameter: string;
  to: number;
  from: number;
  step: number;
  stepLength: number;
  min: number;
  max: number;
  fromRemains: number;
  toRemains: number;
  minRemains: number;
  maxRemains: number;
  scalePositionParameter: string;
  scaleNumber: number;
  scaleElements: number[];
  numberOfCharactersAfterDot: number;
  onChange?: (...args: unknown[]) => unknown;
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
  leftOrRight: string;
  upOrDown: string;
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
  areTooltipsClose: boolean;
  isLimitMinShown: boolean;
  isLimitMaxShown: boolean;
  runnerFromStepsNumber: number;
  runnerToStepsNumber: number;
  isScaleElementOnDown: boolean;
  scaleElementPosition: number;
  scaleElementLength: number;
  scaleElementValue: number;
  scaleElementsCurrentNumber: number;
}

type Api = {
  $document: JQuery<Document>;
  $stripe: JQuery<HTMLElement>;
  $runnerFrom: JQuery<HTMLElement>;
  $runnerTo: JQuery<HTMLElement>;
  $limitMin: JQuery<HTMLElement>;
  $limitMax: JQuery<HTMLElement>;
  $scaleContainer: JQuery<HTMLElement>;
  getModelOptions: () => ModelOptions;
  updateUserConfig: (userConfig: UserConfig) => void;
  toggleDouble: () => void;
  toggleTooltip: () => void;
  toggleRange: () => void;
  toggleScale: () => void;
  toggleVertical: () => void;
  setFrom: (value: number) => void;
  setTo: (value: number) => void;
  setMin: (value: number) => void;
  setMax: (value: number) => void;
  setStep: (value: number) => void;
};

type Config = {
  double: boolean;
  vertical: boolean;
  showTooltip: boolean;
  showLimit: boolean;
  showRange: boolean;
  showScale: boolean;
  localeString: boolean;
  min: number;
  max: number;
  from: number;
  to: number;
  step: number;
  scaleNumber: number;
  onChange?: (...args: unknown[]) => unknown;
};

type UserConfig = Partial<Config>;

enum DIRECTION {
  LEFT = 'left',
  RIGHT = 'right',
  TOP = 'top',
  BOTTOM = 'bottom',
}

enum LENGTH {
  WIDTH = 'width',
  HEIGHT = 'height',
}

enum LIMIT {
  MIN = 'min',
  MAX = 'max',
}

enum RANGE {
  FROM = 'from',
  TO = 'to',
}

export {
  Options, ModelOptions, Config, UserConfig, SubViewOptions, Api, DIRECTION, LENGTH, LIMIT, RANGE,
};
