import View from '../src/View/View';

const $slider = $('<div/>');

const view = new View($slider);

describe('initView', () => {
  test('defines a function', () => {
    view.$stripe = $('<div/>');

    expect(typeof view.initView).toBe('function');
  });

  test('should return undefinded', () => {
    const options = {
      isRange: true,
      isMinAndMax: true,
      isScale: true,
      isInterval: true,
      isTooltip: true,
      isPanel: true,
    };

    expect(view.initView(options)).toBeUndefined();
  });

  test('should return undefinded', () => {
    const options = {
      isRange: false,
      isMinAndMax: false,
      isScale: false,
      isInterval: false,
      isTooltip: false,
      isPanel: false,
    };

    expect(view.initView(options)).toBeUndefined();
  });

  test('should return undefinded', () => {
    const options = {
      isRange: false,
      isMinAndMax: false,
      isScale: false,
      isInterval: false,
      isTooltip: true,
      isPanel: false,
    };

    expect(view.initView(options)).toBeUndefined();
  });
});

describe('getElementsParameters', () => {
  test('defines a function', () => {
    expect(typeof view.getElementsParameters).toBe('function');
  });

  test('should return undefinded', () => {
    const elementsParameters = {
      runnerLength: 0,
      maxValueLength: 0,
      maxValueWidth: 0,
      minValueLength: 0,
      minValueWidth: 0,
      scaleElementHeight: NaN,
      sliderLength: 0,
      sliderPosition: 0,
      tooltipFromLength: 0,
      tooltipToLength: 0,
    };

    expect(view.getElementsParameters(true, 'width')).toMatchObject(elementsParameters);
  });
});

describe('setRunnerFromPosition', () => {
  test('defines a function', () => {
    expect(typeof view.runnerFrom.setRunnerFromPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.runnerFrom.setRunnerFromPosition({
      positionParameter: 'width',
      runnerFromPosition: 12,
    })).toBe('undefined');
  });
});

describe('setRunnerToPosition', () => {
  test('defines a function', () => {
    expect(typeof view.runnerTo.setRunnerToPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.runnerTo.setRunnerToPosition({
      positionParameter: 'width',
      runnerToPosition: 12,
    })).toBe('undefined');
  });
});

describe('setMinAndMaxPosition', () => {
  test('defines a function', () => {
    expect(typeof view.minAndMaxValues.setMinAndMaxPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.minAndMaxValues.setMinAndMaxPosition({})).toBe('undefined');
  });
});

describe('setMinAndMaxValues', () => {
  test('defines a function', () => {
    expect(typeof view.minAndMaxValues.setMinAndMaxValues).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.minAndMaxValues.setMinAndMaxValues({})).toBe('undefined');
  });
});

describe('showMinAndMax', () => {
  test('defines a function', () => {
    expect(typeof view.minAndMaxValues.showMinAndMax).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.minAndMaxValues.showMinAndMax({})).toBe('undefined');
  });
});

describe('setPanelPosition', () => {
  test('defines a function', () => {
    expect(typeof view.panel.setPanelPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.panel.setPanelPosition({})).toBe('undefined');
  });
});

describe('setPanelValues', () => {
  test('defines a function', () => {
    expect(typeof view.panel.setPanelValues).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.panel.setPanelValues({})).toBe('undefined');
  });

  test('should return undefined', () => {
    expect(typeof view.panel.setPanelValues({
      isPanel: true,
    })).toBe('undefined');
  });
});

describe('setRangePosition', () => {
  test('defines a function', () => {
    expect(typeof view.range.setRangePosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.range.setRangePosition({})).toBe('undefined');
  });
});

describe('setScaleLength', () => {
  test('defines a function', () => {
    expect(typeof view.scale.setScaleLength).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.scale.setScaleLength({
      lengthParameter: 'width',
      sliderLength: 0,
    })).toBe('undefined');
  });
});

describe('setScalePosition', () => {
  test('defines a function', () => {
    expect(typeof view.scale.setScalePosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.scale.setScalePosition({})).toBe('undefined');
  });
});

describe('setScaleElementsValues', () => {
  test('defines a function', () => {
    expect(typeof view.scale.setScaleElementsValues).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.scale.setScaleElementsValues({ scaleElements: [] })).toBe('undefined');
  });
});

describe('setScaleElementsPositions', () => {
  test('defines a function', () => {
    expect(typeof view.scale.setScaleElementsPositions).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.scale.setScaleElementsPositions({ scaleElements: [] })).toBe('undefined');
  });
});

describe('setTooltipFromPosition', () => {
  test('defines a function', () => {
    expect(typeof view.tooltips.setTooltipFromPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.tooltips.setTooltipFromPosition({
      positionParameter: 'width',
      tooltipFromPosition: 10,
    })).toBe('undefined');
  });
});

describe('setTooltipFromValue', () => {
  test('defines a function', () => {
    expect(typeof view.tooltips.setTooltipFromValue).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.tooltips.setTooltipFromValue({
      tooltipFromValue: '10',
    })).toBe('undefined');
  });
});

describe('setTooltipToPosition', () => {
  test('defines a function', () => {
    expect(typeof view.tooltips.setTooltipToPosition).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.tooltips.setTooltipToPosition({
      positionParameter: 'width',
      tooltipToPosition: 10,
    })).toBe('undefined');
  });
});

describe('setTooltipToValue', () => {
  test('defines a function', () => {
    expect(typeof view.tooltips.setTooltipToValue).toBe('function');
  });

  test('should return undefined', () => {
    expect(typeof view.tooltips.setTooltipToValue({
      tooltipToValue: '10',
    })).toBe('undefined');
  });
});
