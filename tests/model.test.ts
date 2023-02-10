import Model from '../src/Model/Model';
import { ModelOptions, Options } from '../src/interfaces/interfaces';

const model = new Model();
const modelOptions: ModelOptions = model.getModelOptions();
const options: Options = model.getOptions();

beforeEach(() => {
  model.userConfig = {};
  model.double = false;
  model.vertical = false;
  model.showTooltip = true;
  model.showLimit = true;
  model.showRange = true;
  model.showScale = false;
  model.isStepSet = false;
  model.positionParameter = 'left';
  model.lengthParameter = 'width';
  model.scalePositionParameter = 'top';
  model.min = 0;
  model.max = 100;
  model.step = 0;
  model.from = 10;
  model.to = 50;
  model.fromRemains = 0;
  model.toRemains = 0;
  model.minRemains = 0;
  model.maxRemains = 0;
  model.scaleNumber = 5;
  model.stepLength = 0;
  model.scaleElements = [];
  model.numberOfCharactersAfterDot = 0;
  model.modelOptions = modelOptions;
  model.subViewOptions = {
    sliderPosition: 0,
    sliderLength: 0,
    runnerFromPosition: 0,
    runnerToPosition: 0,
    runnerLength: 0,
    limitMinLength: 0,
    limitMaxLength: 0,
    shiftAxis: 0,
    clickPosition: 0,
    leftOrRight: '',
    upOrDown: '',
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

describe('validateInitalValues', () => {
  test('min and max values should be reversed', () => {
    model.min = 50;
    model.max = 20;
    model.validateInitialValues();

    expect(model.min).toEqual(20);
    expect(model.max).toEqual(50);
  });

  test('step should be equal to 0', () => {
    model.step = -1;
    model.validateInitialValues();

    expect(model.step).toEqual(0);
  });

  test('from should be equal to min', () => {
    model.from = 0;
    model.min = 5;
    model.validateInitialValues();

    expect(model.from).toEqual(5);
  });

  test('from should be equal to max', () => {
    model.from = 100;
    model.max = 80;
    model.validateInitialValues();

    expect(model.from).toEqual(80);
  });

  test('to should be equal to max', () => {
    model.to = 100;
    model.max = 80;
    model.validateInitialValues();

    expect(model.to).toEqual(80);
  });

  test('to should be equal to from', () => {
    model.to = 10;
    model.from = 20;
    model.validateInitialValues();

    expect(model.to).toEqual(20);
  });
});

describe('setPositionParameters', () => {
  test('position parametes should to be for vertical view', () => {
    model.vertical = true;
    model.setPositionParameters();

    expect(model.positionParameter).toEqual('top');
    expect(model.lengthParameter).toEqual('height');
    expect(model.scalePositionParameter).toEqual('right');
  });
});

describe('setSubViewOptions', () => {
  test('model.subViewOptions should to be equal options.subViewOptions', () => {
    model.setSubViewOptions(options);

    expect(model.subViewOptions).toEqual(options.subViewOptions);
  });
});

describe('getModelOptions', () => {
  test('model.getModelOptions should return modelOptions', () => {
    expect(model.getModelOptions()).toEqual(modelOptions);
  });
});

describe('getOptions', () => {
  test('model.getOptions should return options', () => {
    expect(model.getOptions()).toEqual(options);
  });
});

describe('calculateFrom', () => {
  test('from should be equal to 20', () => {
    model.step = 10;
    model.isStepSet = true;
    model.subViewOptions.isCursorNearStepAheadFrom = true;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(20);
  });

  test('from should be equal to 5', () => {
    model.step = 5;
    model.isStepSet = true;
    model.subViewOptions.isCursorNearStepBehindFrom = true;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(5);
  });

  test('from should be equal to 20', () => {
    model.step = 5;
    model.isStepSet = true;
    model.subViewOptions.isClickAheadOfRunnerFrom = true;
    model.subViewOptions.runnerFromStepsNumber = 2;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(20);
  });

  test('from should be equal to 0', () => {
    model.step = 5;
    model.isStepSet = true;
    model.subViewOptions.isClickBehindOfRunnerFrom = true;
    model.subViewOptions.runnerFromStepsNumber = 2;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(0);
  });

  test('from should be equal to min', () => {
    model.subViewOptions.isMinFrom = true;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(model.min);
  });

  test('from should be equal to max', () => {
    model.subViewOptions.isMaxFrom = true;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(model.max);
  });

  test('from should be equal to scaleElementValue', () => {
    model.subViewOptions.isScaleElementOnDown = true;
    model.subViewOptions.isClickForRunnerFrom = true;
    model.subViewOptions.scaleElementValue = 30;

    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(Number(model.subViewOptions.scaleElementValue));
  });

  test('should set model from', () => {
    model.subViewOptions.sliderLength = 100;
    model.calculateFrom(model.getOptions());

    expect(model.from).toEqual(0);
  });
});

describe('restrictFrom', () => {
  test('from should to be equal min', () => {
    model.from = -1;
    model.min = 0;

    model.restrictFrom();

    expect(model.from).toEqual(model.min);
  });

  test('from should to be equal to', () => {
    model.double = true;
    model.from = 30;
    model.to = 20;

    model.restrictFrom();

    expect(model.from).toEqual(model.to);
  });

  test('from should to be equal max', () => {
    model.from = 100;
    model.max = 80;

    model.restrictFrom();

    expect(model.from).toEqual(model.max);
  });
});

describe('calculateTo', () => {
  test('to should be equal to 60', () => {
    model.step = 10;
    model.isStepSet = true;
    model.subViewOptions.isCursorNearStepAheadTo = true;

    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(60);
  });

  test('to should be equal to 45', () => {
    model.step = 5;
    model.isStepSet = true;
    model.subViewOptions.isCursorNearStepBehindTo = true;

    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(45);
  });

  test('to should be equal to 60', () => {
    model.step = 5;
    model.isStepSet = true;
    model.subViewOptions.isClickAheadOfRunnerTo = true;
    model.subViewOptions.runnerToStepsNumber = 2;

    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(60);
  });

  test('to should be equal to 40', () => {
    model.step = 5;
    model.isStepSet = true;
    model.subViewOptions.isClickBehindOfRunnerTo = true;
    model.subViewOptions.runnerToStepsNumber = 2;

    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(40);
  });

  test('to should be equal to max', () => {
    model.subViewOptions.isMaxTo = true;

    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(model.max);
  });

  test('to should be equal to scaleElementValue', () => {
    model.subViewOptions.isScaleElementOnDown = true;
    model.subViewOptions.isClickForRunnerTo = true;
    model.subViewOptions.scaleElementValue = 30;

    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(Number(model.subViewOptions.scaleElementValue));
  });

  test('should set model to', () => {
    model.subViewOptions.sliderLength = 100;
    model.calculateTo(model.getOptions());

    expect(model.to).toEqual(0);
  });
});

describe('restrictTo', () => {
  test('to should to be equal from', () => {
    model.double = true;
    model.from = 20;
    model.to = 10;

    model.restrictTo();

    expect(model.to).toEqual(model.from);
  });

  test('to should to be equal max', () => {
    model.double = true;
    model.max = 80;
    model.to = 100;

    model.restrictTo();

    expect(model.to).toEqual(model.max);
  });
});

describe('countNumberOfCharactersAfterDot', () => {
  test('numberOfCharactersAfterDot should to be equal 0', () => {
    model.countNumberOfCharactersAfterDot();

    expect(model.numberOfCharactersAfterDot).toEqual(0);
  });
});

describe('calculateScaleElementsValues', () => {
  test('scaleElements should to be equal [0, 25, 50, 75, 100]', () => {
    model.min = 0;
    model.max = 100;
    model.scaleNumber = 5;

    model.calculateScaleElementsValues();

    expect(model.scaleElements).toEqual([0, 25, 50, 75, 100]);
  });
});

describe('calculateScaleElementsNamber', () => {
  test('scaleNumber should to be equal userConfig.scaleNumber', () => {
    model.userConfig.scaleNumber = 10;
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(model.userConfig.scaleNumber);
  });

  test('scaleNumber should to be equal 2', () => {
    model.min = 0;
    model.max = 1;
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(2);
  });

  test('scaleNumber should to be equal 3', () => {
    model.min = 0;
    model.max = 2;
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(3);
  });

  test('scaleNumber should to be equal 4', () => {
    model.min = 0;
    model.max = 4;
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(4);
  });

  test('scaleNumber should to be equal 5', () => {
    model.min = 0;
    model.max = 9;
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(5);
  });

  test('scaleNumber should to be equal 11', () => {
    model.min = -12;
    model.max = 12;
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(11);
  });

  test('scaleNumber should to be equal 5', () => {
    model.calculateScaleElementsNumber();

    expect(model.scaleNumber).toEqual(5);
  });
});

describe('calculateStepLength', () => {
  test('should to be equal 0', () => {
    expect(model.stepLength).toEqual(0);
  });

  test('should to be equal 5', () => {
    model.step = 5;
    model.subViewOptions.sliderLength = 100;
    model.calculateStepLength();

    expect(model.stepLength).toEqual(5);
  });
});

describe('setConfig', () => {
  test('model parameters should to be equal to config parameters', () => {
    model.config.double = true;
    model.config.vertical = true;
    model.config.showTooltip = false;
    model.config.showLimit = true;
    model.config.showRange = false;
    model.config.showScale = true;
    model.config.localeString = true;
    model.config.min = 2;
    model.config.max = 544;
    model.config.step = 25;
    model.config.from = 44;
    model.config.to = 500;
    model.config.scaleNumber = 12;

    model.setConfig();

    expect(model.double).toEqual(model.config.double);
    expect(model.vertical).toEqual(model.config.vertical);
    expect(model.showTooltip).toEqual(model.config.showTooltip);
    expect(model.showLimit).toEqual(model.config.showLimit);
    expect(model.showRange).toEqual(model.config.showRange);
    expect(model.showScale).toEqual(model.config.showScale);
    expect(model.localeString).toEqual(model.config.localeString);
    expect(model.min).toEqual(model.config.min);
    expect(model.max).toEqual(model.config.max);
    expect(model.from).toEqual(model.config.from);
    expect(model.to).toEqual(model.config.to);
    expect(model.scaleNumber).toEqual(model.config.scaleNumber);
  });
});
