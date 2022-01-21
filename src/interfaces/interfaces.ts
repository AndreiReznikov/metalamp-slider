interface Options {
  positionParameter: string;
  lengthParameter: string;
  sliderPosition: number;
  sliderLength: number;
  buttonLength: number;
  stepLength: number;
  minValuePosition: number;
  maxValuePosition: number;
  minValue: number;
  maxValue: number;
  isMinValueShow: boolean;
  isMaxValueShow: boolean;
  minValueLength: number;
  maxValueLength: number;
  firstButtonPosition: number;
  secondButtonPosition: number;
  firstTooltipPosition: number;
  secondTooltipPosition: number;
  firstTooltipValue: number | string;
  secondTooltipValue: number | string;
  rangeBetweenPosition: number;
  rangeBetweenLength: number;
  scalePositionParameter: string;
  scaleNumber: number;
  scaleElements: number[];
  lengthBetweenScaleElements: number;
  panelPosition: number;
  panelPositionParameter: string;
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
  isRangeBetween: boolean;
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
  isRangeBetween?: boolean;
  isScale?: boolean;
  scaleNumber?: number;
  isPanel?: boolean;
}

interface State {
  isInterval: boolean;
  isTooltip: boolean;
  isMinAndMax: boolean;
  isRangeBetween: boolean;
  isScale: boolean;
  isVertical: boolean;
  isPanel: boolean;
}

interface ElementsParameters {
  sliderPosition: number;
  sliderLength: number;
  buttonLength: number;
  firstTooltipLength: number;
  secondTooltipLength: number;
  minValueLength: number;
  maxValueLength: number;
  minValueWidth: number;
  maxValueWidth: number;
  scaleElementHeight: number;
}

export { Options, Config, UserConfig, State, ElementsParameters };