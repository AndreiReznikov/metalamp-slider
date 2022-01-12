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
  showMinValue: boolean;
  showMaxValue: boolean;
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
  scaleNumbers: number;
  scaleElements: number[];
  lengthBetweenScaleElements: number;
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
  scaleNumbers: number;
  isPanel: boolean;
}

interface SliderState {
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
}

export { Options, Config, SliderState, ElementsParameters };