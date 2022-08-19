import Model from '../src/model/model';

const model = new Model();

const eventSimulation = {
  pageX: 0,
  pageY: 0,
  stopPropagation: () => true,
  preventDefault: () => true,
  keyCode: 39,
};

beforeEach(() => {
  model.userConfig = null;
  model.isInterval = false;
  model.isVertical = false;
  model.isPanel = false;
  model.isTooltip = true;
  model.isRange = true;
  model.isScale = true;
  model.keyboard = false;
  model.positionParameter = model.isVertical ? 'top' : 'left';
  model.lengthParameter = model.isVertical ? 'height' : 'width';
  model.isMinAndMax = true;
  model.isWrongMouseButtonPressed = false;
  model.minValue = 0;
  model.maxValue = 100;
  model.step = 0;
  model.from = 20;
  model.to = 50;
  model.scalePositionParameter = model.isVertical ? 'right' : 'top';
  model.panelPosition = 0;
  model.panelPositionParameter = model.isVertical ? 'left' : 'top';
  model.scaleNumber = 5;
  model.isStepSet = false;
  model.sliderPosition = 0;
  model.sliderLength = 0;
  model.handleLength = 0;
  model.isMinValueShow = true;
  model.isMaxValueShow = true;
  model.minValuePosition = 0;
  model.maxValuePosition = 0;
  model.minValueLength = 0;
  model.maxValueLength = 0;
  model.minValueWidth = 0;
  model.maxValueWidth = 0;
  model.tooltipFromLength = 0;
  model.tooltipToLength = 0;
  model.stepLength = 0;
  model.handleFromPosition = 0;
  model.handleToPosition = 0;
  model.tooltipFromPosition = 0;
  model.tooltipToPosition = 0;
  model.tooltipFromValue = 0;
  model.tooltipToValue = 0;
  model.rangePosition = 0;
  model.rangeLength = 0;
  model.scaleElements = [];
  model.scaleElementHeight = 0;
  model.lengthBetweenScaleElements = 0;
  model.numberOfCharactersAfterDot = 0;
});

describe('setElementsParameters', () => {
  const elementsParameters = {
    sliderPosition: 10,
    sliderLength: 10,
    handleLength: 10,
    tooltipFromLength: 10,
    tooltipToLength: 10,
    minValueLength: 10,
    maxValueLength: 10,
    minValueWidth: 10,
    maxValueWidth: 10,
    scaleElementHeight: 10,
  };

  test('defines a function', () => {
    expect(typeof model.setElementsParameters).toBe('function');
  });

  test('should return object', () => {
    expect(model.setElementsParameters(elementsParameters)).toBeUndefined();
  });
});

describe('scalculateStepLength', () => {
  test('defines a function', () => {
    expect(typeof model.calculateStepLength).toBe('function');
  });

  test('should return undefinded', () => {
    expect(model.calculateStepLength()).toBeUndefined();
  });
});

describe('getOptions', () => {
  test('defines a function', () => {
    expect(typeof model.getOptions).toBe('function');
  });

  test('should return object', () => {
    expect(typeof model.getOptions()).toBe('object');
  });
});

describe('validateInitalValues', () => {
  test('defines a function', () => {
    expect(typeof model.validateInitialValues).toBe('function');
  });

  test('should return undefinded', () => {
    expect(model.validateInitialValues()).toBeUndefined();
  });

  test('step should to be 0', () => {
    model.minValue = 2;
    model.maxValue = 10;
    model.step = 10;

    model.validateInitialValues();

    expect(model.step).toBe(0);
  });

  test('step should to be 0', () => {
    model.minValue = -2;
    model.maxValue = -10;
    model.step = 10;

    model.validateInitialValues();

    expect(model.step).toBe(0);
  });

  test('step should to be 0', () => {
    model.step = -1;

    model.validateInitialValues();

    expect(model.step).toBe(0);
  });

  test('from should to be equal minValue', () => {
    model.minValue = 0;
    model.from = -2;

    model.validateInitialValues();

    expect(model.from).toBe(model.minValue);
  });

  test('from should to be equal maxValue', () => {
    model.from = 110;

    model.validateInitialValues();

    expect(model.from).toBe(model.maxValue);
  });

  test('to should be equal minValue', () => {
    model.minValue = 10;
    model.maxValue = 100;
    model.from = 4;
    model.to = 5;

    model.validateInitialValues();

    expect(model.to).toBe(model.minValue);
  });
});

describe('calculateInitialHandlesPosition', () => {
  test('defines a function', () => {
    expect(typeof model.calculateInitialHandlesPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateInitialHandlesPosition()).toBeUndefined();
  });
});

describe('calculateInitialHandleFromPosition', () => {
  test('defines a function', () => {
    expect(typeof model.calculateInitialHandleFromPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateInitialHandleFromPosition()).toBeUndefined();
  });
});

describe('calculateInitialHandleToPosition', () => {
  test('defines a function', () => {
    expect(typeof model.calculateInitialHandleToPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateInitialHandleToPosition()).toBeUndefined();
  });
});

describe('calculateShiftAxis1', () => {
  afterAll(() => {
    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => false);
  });

  test('defines a function', () => {
    expect(typeof model.calculateShiftAxis1).toBe('function');
  });

  test('should return number', () => {
    expect(typeof model.calculateShiftAxis1(eventSimulation)).toBe('number');
  });

  test('should return undefined', () => {
    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => true);

    expect(typeof model.calculateShiftAxis1(eventSimulation)).toBe('undefined');
  });
});

describe('calculateHandleFromPositionWhileMoving', () => {
  afterAll(() => {
    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => false);
  });

  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionWhileMoving).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionWhileMoving(eventSimulation)).toBeUndefined();
  });

  test('calculateHandleFromPositionWithSetStep should to be called', () => {
    const calculateHandleFromPositionWithSetStep = jest.spyOn(model, 'calculateHandleFromPositionWithSetStep');

    model.isStepSet = true;
    model.sliderPosition = -100;

    model.calculateHandleFromPositionWhileMoving(eventSimulation);

    model.sliderPosition = 100;

    model.calculateHandleFromPositionWhileMoving(eventSimulation);

    expect(calculateHandleFromPositionWithSetStep).toBeCalled();

    calculateHandleFromPositionWithSetStep.mockClear();
  });

  test('should return undefined', () => {
    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => true);

    expect(model.calculateHandleFromPositionWhileMoving(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterSliderOnDown', () => {
  afterAll(() => {
    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => false);
  });

  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterSliderOnDown).toBe('function');
  });

  test('should return undefined', () => {
    model.isStepSet = false;
    model.handleFromPosition = 10;

    expect(model.calculateHandleFromPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isStepSet = true;
    model.sliderPosition = 0;
    model.handleFromPosition = 0;
    model.handleLength = -10;

    expect(model.calculateHandleFromPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isStepSet = true;
    model.handleFromPosition = 10;

    expect(model.calculateHandleFromPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isStepSet = true;
    model.isInterval = true;
    model.sliderPosition = -100;
    model.stepLength = 1000;
    model.handleToPosition = 500;

    expect(model.calculateHandleFromPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => true);

    expect(model.calculateHandleFromPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterMinValueOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterMinValueOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterMinValueOnDown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterMaxValueOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterMaxValueOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterMaxValueOnDown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterKeydown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterKeydown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.keyboard = true;
    model.isStepSet = true;

    const eventSimulation = {
      keyCode: 39,
    };

    expect(model.calculateHandleFromPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.keyboard = true;
    model.isStepSet = true;

    const eventSimulation = {
      keyCode: 37,
    };

    expect(model.calculateHandleFromPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.keyboard = true;

    const eventSimulation = {
      keyCode: 37,
    };

    expect(model.calculateHandleFromPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateShiftAxis2', () => {
  test('defines a function', () => {
    expect(typeof model.calculateShiftAxis2).toBe('function');
  });

  test('should return number', () => {
    model.isInterval = true;

    expect(typeof model.calculateShiftAxis2(eventSimulation)).toBe('number');
  });

  test('should return number', () => {
    expect(typeof model.calculateShiftAxis2(eventSimulation)).toBe('undefined');
  });
});

describe('calculateHandleToPositionWhileMoving', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionWhileMoving).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionWhileMoving(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;

    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionWhileMoving(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.isStepSet = true;

    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionWhileMoving(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleToPositionAfterSliderOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionAfterSliderOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;

    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.isStepSet = true;

    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.isStepSet = true;
    model.sliderPosition = 0;
    model.handleToPosition = -1;
    model.handleLength = -1;

    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.isStepSet = true;
    model.sliderPosition = 0;
    model.handleToPosition = 2;
    model.handleFromPosition = 0;
    model.handleLength = 0;

    const eventSimulation = {
      pageX: 1,
      pageY: 1,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.sliderPosition = 0;
    model.handleToPosition = 2;
    model.handleFromPosition = 0;
    model.handleLength = 0;

    const eventSimulation = {
      pageX: 1,
      pageY: 1,
      preventDefault: () => true,
      pointerType: 'mouse',
      buttons: 2,
    };

    expect(model.calculateHandleToPositionAfterSliderOnDown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleToPositionAfterMaxValueOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionAfterMaxValueOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionAfterMaxValueOnDown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;

    expect(model.calculateHandleToPositionAfterMaxValueOnDown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandleToPositionAfterKeydown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionAfterKeydown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.keyboard = true;
    model.isStepSet = true;

    const eventSimulation = {
      keyCode: 39,
    };

    expect(model.calculateHandleToPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.keyboard = true;
    model.isStepSet = true;

    const eventSimulation = {
      keyCode: 37,
    };

    expect(model.calculateHandleToPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isInterval = true;
    model.keyboard = true;

    const eventSimulation = {
      keyCode: 37,
    };

    expect(model.calculateHandleToPositionAfterKeydown(eventSimulation)).toBeUndefined();
  });
});

describe('calculateHandlePositionAfterScaleOnDown', () => {
  const scaleOptions = {
    isScaleElementOnDown: true,
    scaleElementPosition: 10,
    scaleElementLength: 10,
    scaleElementValue: '10',
  };

  test('defines a function', () => {
    expect(typeof model.calculateHandlePositionAfterScaleOnDown).toBe('function');
  });

  test('should return undefined', () => {
    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      stopPropagation: () => true,
      preventDefault: () => true,
    };

    model.sliderPosition = 0;
    model.handleFromPosition = -1;
    model.handleLength = -1;

    expect(model.calculateHandlePositionAfterScaleOnDown(
      eventSimulation,
      scaleOptions,
    )).toBeUndefined();
  });

  test('should return undefined', () => {
    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      stopPropagation: () => true,
      preventDefault: () => true,
    };

    model.isInterval = true;
    model.sliderPosition = 0;
    model.handleToPosition = -1;
    model.handleLength = -1;

    expect(model.calculateHandlePositionAfterScaleOnDown(
      eventSimulation,
      scaleOptions,
    )).toBeUndefined();
  });
});

describe('calculatePanelPosition', () => {
  test('defines a function', () => {
    expect(typeof model.calculatePanelPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculatePanelPosition()).toBeUndefined();
  });

  test('should return undefined', () => {
    model.isVertical = true;

    expect(model.calculatePanelPosition()).toBeUndefined();
  });
});

describe('countNumberOfCharactersAfterDot', () => {
  test('defines a function', () => {
    expect(typeof model.countNumberOfCharactersAfterDot).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.countNumberOfCharactersAfterDot()).toBeUndefined();
  });
});

describe('calculateRangePosition', () => {
  test('defines a function', () => {
    expect(typeof model.calculateRangePosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateRangePosition()).toBeUndefined();
  });
});

describe('calculateRangeLength', () => {
  test('defines a function', () => {
    expect(typeof model.calculateRangeLength).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateRangeLength()).toBeUndefined();
  });
});

describe('calculateInitialTooltipsValues', () => {
  test('defines a function', () => {
    expect(typeof model.calculateInitialTooltipsValues).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateInitialTooltipsValues()).toBeUndefined();
  });
});

describe('calculateMinAndMaxPositions', () => {
  test('defines a function', () => {
    expect(typeof model.calculateMinAndMaxPositions).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateMinAndMaxPositions()).toBeUndefined();
  });
});

describe('calculateScaleElementsValues', () => {
  test('defines a function', () => {
    expect(typeof model.calculateScaleElementsValues).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateScaleElementsValues()).toBeUndefined();
  });
});

describe('calculateLengthBetweenScaleElements', () => {
  test('defines a function', () => {
    expect(typeof model.calculateLengthBetweenScaleElements).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateLengthBetweenScaleElements()).toBeUndefined();
  });
});

describe('calculateScaleElementsNumber', () => {
  test('defines a function', () => {
    expect(typeof model.calculateScaleElementsNumber).toBe('function');
  });

  test('should return undefined', () => {
    model.userConfig = {};
    model.userConfig.scaleNumber = 1;

    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });

  test('should return undefined', () => {
    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });

  test('should return undefined', () => {
    model.maxValue = 2;
    model.minValue = 1;

    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });

  test('should return undefined', () => {
    model.maxValue = 3;
    model.minValue = 1;

    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });

  test('should return undefined', () => {
    model.maxValue = 5;
    model.minValue = 1;

    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });

  test('should return undefined', () => {
    model.maxValue = 10;
    model.minValue = 1;

    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });

  test('should return undefined', () => {
    model.maxValue = 10;
    model.minValue = -10;

    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });
});
