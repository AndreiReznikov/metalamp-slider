import Model from './model/model';

const model = new Model();

const getMousedownEvent = jest.fn($(document).mousedown((event) => event));
const getMousemoveEvent = jest.fn($(document).mousemove((event) => event));

beforeAll(() => {
  model.minValue = 0;
  model.maxValue = 100;
  model.step = 0;
  model.from = 0;
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

describe('calculateInitialHandleTOPosition', () => {
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
    const eventSimulation = {
      pageX: 0,
      pageY: 0,
      stopPropagation: () => true,
    };

    expect(typeof model.calculateShiftAxis1(eventSimulation)).toBe('number');
  });

  test('should return undefined', () => {
    const eventSimulation = {
      pageX: 0,
      stopPropagation: () => true,
    };

    jest.spyOn(model, 'checkIsWrongMouseButtonPressed').mockImplementation(() => true);

    expect(typeof model.calculateShiftAxis1(eventSimulation)).toBe('undefined');
  });
});

describe('calculateHandleFromPositionWhileMoving', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionWhileMoving).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionWhileMoving(getMousemoveEvent)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterSliderOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterSliderOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterSliderOnDown(getMousedownEvent)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterMinValueOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterMinValueOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterMinValueOnDown(getMousedownEvent)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterMaxValueOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterMaxValueOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterMaxValueOnDown(getMousedownEvent)).toBeUndefined();
  });
});

describe('calculateHandleFromPositionAfterKeydown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleFromPositionAfterKeydown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleFromPositionAfterKeydown(getMousedownEvent)).toBeUndefined();
  });
});

describe('calculateShiftAxis2', () => {
  model.isInterval = true;

  test('defines a function', () => {
    expect(typeof model.calculateShiftAxis2).toBe('function');
  });

  test('should return number', () => {
    expect(typeof model.calculateShiftAxis2(getMousedownEvent)).toBe('number');
  });
});

describe('calculateHandleToPositionWhileMoving', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionWhileMoving).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionWhileMoving(getMousemoveEvent)).toBeUndefined();
  });
});

describe('calculateHandleToPositionAfterSliderOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionAfterSliderOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionAfterSliderOnDown(getMousedownEvent)).toBeUndefined();
  });
});

describe('calculateHandleToPositionAfterMaxValueOnDown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionAfterMaxValueOnDown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionAfterMaxValueOnDown(getMousedownEvent)).toBeUndefined();
  });
});

describe('calculateHandleToPositionAfterKeydown', () => {
  test('defines a function', () => {
    expect(typeof model.calculateHandleToPositionAfterKeydown).toBe('function');
  });

  test('should return undefined', () => {
    expect(model.calculateHandleToPositionAfterKeydown(getMousedownEvent)).toBeUndefined();
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
    expect(model.calculateHandlePositionAfterScaleOnDown(
      getMousedownEvent,
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
    expect(model.calculateScaleElementsNumber()).toBeUndefined();
  });
});
