import View from '../src/View/View';
import { ModelOptions, Options, SubViewOptions } from '../src/interfaces/interfaces';

const $container = $('<div/>');
$container.css({ width: 100, height: 8 });

const $slider = $('<div/>');
$slider.appendTo($container);

const view = new View($slider);

let modelOptions: ModelOptions = {
  double: false,
  vertical: false,
  showTooltip: false,
  showLimit: false,
  showRange: false,
  showScale: false,
  localeString: false,
  isStepSet: false,
  positionParameter: '',
  lengthParameter: '',
  to: 0,
  from: 0,
  step: 0,
  stepLength: 0,
  min: 0,
  max: 0,
  scalePositionParameter: '',
  scaleNumber: 0,
  scaleElements: [],
  numberOfCharactersAfterDot: 0,
};
let subViewOptions: SubViewOptions = {
  sliderPosition: 0,
  sliderLength: 0,
  runnerFromPosition: 0,
  runnerToPosition: 0,
  runnerLength: 0,
  limitMinLength: 0,
  limitMaxLength: 0,
  shiftAxis: 0,
  clickPosition: 0,
  isMinFrom: false,
  isMaxFrom: false,
  isMaxTo: false,
  isCursorNearStepAheadFrom: false,
  isCursorNearStepBehindFrom: false,
  isCursorNearStepAheadTo: false,
  isCursorNearStepBehindTo: false,
  isClickAheadOfRunnerFrom: false,
  isClickBehindOfRunnerFrom: false,
  isClickForRunnerFrom: false,
  isClickAheadOfRunnerTo: false,
  isClickBehindOfRunnerTo: false,
  isClickForRunnerTo: false,
  areTooltipsClose: false,
  isLimitMinShown: true,
  isLimitMaxShown: true,
  runnerFromStepsNumber: 0,
  runnerToStepsNumber: 0,
  isScaleElementOnDown: false,
  scaleElementPosition: 0,
  scaleElementLength: 0,
  scaleElementValue: 0,
};

beforeEach(() => {
  modelOptions = {
    double: false,
    vertical: false,
    showTooltip: false,
    showLimit: false,
    showRange: false,
    showScale: false,
    localeString: false,
    isStepSet: false,
    positionParameter: '',
    lengthParameter: '',
    to: 0,
    from: 0,
    step: 0,
    stepLength: 0,
    min: 0,
    max: 0,
    scalePositionParameter: '',
    scaleNumber: 0,
    scaleElements: [],
    numberOfCharactersAfterDot: 0,
  };
  subViewOptions = {
    sliderPosition: 0,
    sliderLength: 0,
    runnerFromPosition: 0,
    runnerToPosition: 0,
    runnerLength: 0,
    limitMinLength: 0,
    limitMaxLength: 0,
    shiftAxis: 0,
    clickPosition: 0,
    isMinFrom: false,
    isMaxFrom: false,
    isMaxTo: false,
    isCursorNearStepAheadFrom: false,
    isCursorNearStepBehindFrom: false,
    isCursorNearStepAheadTo: false,
    isCursorNearStepBehindTo: false,
    isClickAheadOfRunnerFrom: false,
    isClickBehindOfRunnerFrom: false,
    isClickForRunnerFrom: false,
    isClickAheadOfRunnerTo: false,
    isClickBehindOfRunnerTo: false,
    isClickForRunnerTo: false,
    areTooltipsClose: false,
    isLimitMinShown: true,
    isLimitMaxShown: true,
    runnerFromStepsNumber: 0,
    runnerToStepsNumber: 0,
    isScaleElementOnDown: false,
    scaleElementPosition: 0,
    scaleElementLength: 0,
    scaleElementValue: 0,
  };
});

const options: Options = {
  modelOptions,
  subViewOptions,
};

describe('initializeView', () => {
  test('method should set DOM elements css parameters: none', () => {
    view.initializeView(options);

    expect(view.$slider.css('width')).toEqual('100%');
    expect(view.$range.css('display')).toEqual('none');
    expect(view.$limitMin.css('display')).toEqual('none');
    expect(view.$limitMax.css('display')).toEqual('none');
    expect(view.$scaleContainer.css('display')).toEqual('none');
    expect(view.$runnerTo.css('display')).toEqual('none');
    expect(view.$tooltipFrom.css('display')).toEqual('none');
    expect(view.$tooltipTo.css('display')).toEqual('none');
  });

  test('method should set DOM elements css parameters: flex/block', () => {
    options.modelOptions.double = true;
    options.modelOptions.vertical = true;
    options.modelOptions.showTooltip = true;
    options.modelOptions.showLimit = true;
    options.modelOptions.showRange = true;
    options.modelOptions.showScale = true;

    view.initializeView(options);

    expect(view.$slider.css('width')).toEqual('100%');
    expect(view.$range.css('display')).toEqual('block');
    expect(view.$limitMin.css('display')).toEqual('flex');
    expect(view.$limitMax.css('display')).toEqual('flex');
    expect(view.$scaleContainer.css('display')).toEqual('flex');
    expect(view.$runnerTo.css('display')).toEqual('block');
    expect(view.$tooltipFrom.css('display')).toEqual('flex');
    expect(view.$tooltipTo.css('display')).toEqual('flex');
  });

  test('method should set $tooltipTo element css parameter: none', () => {
    options.modelOptions.double = false;
    options.modelOptions.showTooltip = true;

    view.initializeView(options);

    expect(view.$tooltipTo.css('display')).toEqual('none');
  });
});

describe('setPlane', () => {
  test('method should set elements css parameters for model.vertical: false', () => {

  });
});
