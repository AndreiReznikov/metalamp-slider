import { Options } from '../src/interfaces/interfaces';
import View from '../src/View/View';

document.body.innerHTML = `
  <div class='container'>
    <div class='slider'></div>
  </div>`;

const $container = $('.container');
$container.css({ width: 100, height: 8 });

const $slider = $('.slider');

const view = new View($slider);
view.initializeView(view.SubView.getOptions());
view.setPlane(view.SubView.getOptions());

view.SubView.modelOptions = {
  double: false,
  vertical: false,
  showTooltip: false,
  showLimit: false,
  showRange: false,
  showScale: false,
  localeString: false,
  isStepSet: false,
  positionParameter: 'left',
  lengthParameter: 'width',
  scalePositionParameter: 'top',
  to: 50,
  from: 20,
  step: 0,
  stepLength: 0,
  min: 0,
  max: 100,
  remains: 0,
  minRemains: 0,
  maxRemains: 0,
  scaleNumber: 0,
  scaleElements: [],
  numberOfCharactersAfterDot: 0,
};
view.SubView.subViewOptions = {
  sliderPosition: 0,
  sliderLength: 100,
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

let options: Options = view.SubView.getOptions();

let eventSimulation: JQuery.TriggeredEvent;

const getEvent = (event: JQuery.TriggeredEvent) => {
  eventSimulation = event;
  eventSimulation.stopPropagation = () => {};
};

beforeEach(() => {
  view.SubView.range.rangePosition = 0;
  view.SubView.range.rangeLength = 0;
  view.SubView.limitMin.limitLength = 0;
  view.SubView.limitMin.limitPosition = 0;
  view.SubView.limitMin.limitType = 'min';
  view.SubView.limitMax.limitLength = 0;
  view.SubView.limitMax.limitPosition = 0;
  view.SubView.limitMax.limitType = 'max';
  view.SubView.runnerFrom.runnerType = 'from';
  view.SubView.runnerFrom.runnerPosition = 0;
  view.SubView.runnerFrom.isCursorNearStepAhead = false;
  view.SubView.runnerFrom.isCursorNearStepBehind = false;
  view.SubView.runnerFrom.isMinFrom = false;
  view.SubView.runnerFrom.isMaxFrom = false;
  view.SubView.runnerFrom.isMaxTo = false;
  view.SubView.runnerTo.runnerType = 'to';
  view.SubView.runnerTo.runnerPosition = 0;
  view.SubView.runnerTo.isCursorNearStepAhead = false;
  view.SubView.runnerTo.isCursorNearStepBehind = false;
  view.SubView.runnerTo.isMinFrom = false;
  view.SubView.runnerTo.isMaxFrom = false;
  view.SubView.runnerTo.isMaxTo = false;
  view.SubView.scale.lengthBetweenScaleElements = 0;
  view.SubView.tooltipFrom.tooltipType = 'from';
  view.SubView.tooltipFrom.tooltipLength = 0;
  view.SubView.tooltipFrom.tooltipPosition = 0;
  view.SubView.tooltipFrom.tooltipValue = 0;
  view.SubView.tooltipTo.tooltipType = 'to';
  view.SubView.tooltipTo.tooltipLength = 0;
  view.SubView.tooltipTo.tooltipPosition = 0;
  view.SubView.tooltipTo.tooltipValue = 0;
  view.SubView.stripe.runnerFromStepsNumber = 0;
  view.SubView.stripe.runnerToStepsNumber = 0;
  view.SubView.stripe.isClickAheadOfRunnerFrom = false;
  view.SubView.stripe.isClickBehindOfRunnerFrom = false;
  view.SubView.stripe.isClickForRunnerFrom = false;
  view.SubView.stripe.isClickAheadOfRunnerTo = false;
  view.SubView.stripe.isClickBehindOfRunnerTo = false;
  view.SubView.stripe.isClickForRunnerTo = false;
  view.SubView.stripe.areTooltipsClose = false;
  view.SubView.stripe.isLimitMinShown = true;
  view.SubView.stripe.isLimitMaxShown = true;

  view.SubView.modelOptions = {
    double: false,
    vertical: false,
    showTooltip: false,
    showLimit: false,
    showRange: false,
    showScale: false,
    localeString: false,
    isStepSet: false,
    positionParameter: 'left',
    lengthParameter: 'width',
    scalePositionParameter: 'top',
    from: 20,
    to: 50,
    step: 0,
    stepLength: 0,
    min: 0,
    max: 100,
    remains: 0,
    minRemains: 0,
    maxRemains: 0,
    scaleNumber: 0,
    scaleElements: [],
    numberOfCharactersAfterDot: 0,
  };
  view.SubView.subViewOptions = {
    sliderPosition: 0,
    sliderLength: 100,
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

  options = view.SubView.getOptions();
});

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
    view.SubView.modelOptions.double = true;
    view.SubView.modelOptions.vertical = true;
    view.SubView.modelOptions.showTooltip = true;
    view.SubView.modelOptions.showLimit = true;
    view.SubView.modelOptions.showRange = true;
    view.SubView.modelOptions.showScale = true;

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
    view.SubView.modelOptions.double = false;
    view.SubView.modelOptions.showTooltip = true;

    view.initializeView(options);

    expect(view.$tooltipTo.css('display')).toEqual('none');
  });
});

describe('setPlane', () => {
  test('method should set elements css parameters for model.vertical: false', () => {
    view.setPlane(options);

    expect(view.$container.css('width')).toEqual('100px');
    expect(view.$container.css('height')).toEqual('8px');
    expect(view.$runnerFrom.css('transform')).toEqual('translateY(-50%)');
    expect(view.$runnerTo.css('transform')).toEqual('translateY(-50%)');
    expect(parseInt(view.$tooltipFrom.css('bottom'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(view.$tooltipFrom.css('top')).toEqual('');
    expect(parseInt(view.$tooltipTo.css('bottom'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(view.$tooltipTo.css('top')).toEqual('');
    expect(parseInt(view.$limitMin.css('bottom'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(view.$limitMin.css('top')).toEqual('');
    expect(parseInt(view.$limitMax.css('bottom'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(view.$limitMax.css('top')).toEqual('');
    expect(view.$range.css('height')).toEqual('100%');
  });

  test('method should set elements css parameters for model.vertical: true', () => {
    view.SubView.modelOptions.vertical = true;

    view.setPlane(options);

    expect(view.$container.css('width')).toEqual('8px');
    expect(view.$container.css('height')).toEqual('100px');
    expect(view.$runnerFrom.css('transform')).toEqual('translateX(-50%)');
    expect(view.$runnerTo.css('transform')).toEqual('translateX(-50%)');
    expect(parseInt(view.$tooltipFrom.css('left'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(parseInt(view.$tooltipTo.css('left'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(parseInt(view.$limitMin.css('left'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(parseInt(view.$limitMax.css('left'), 10)).toEqual(view.SubView.subViewOptions.runnerLength);
    expect(view.$range.css('width')).toEqual('100%');
  });
});

describe('getOptions', () => {
  test('method should return options', () => {
    expect(view.SubView.getOptions()).toEqual(options);
  });
});

describe('setModelOptions', () => {
  test('method should set modelOptions parameter', () => {
    view.SubView.setModelOptions(options);

    expect(view.SubView.modelOptions).toEqual(options.modelOptions);
  });
});

describe('handleRunnerFromStartPointermove', () => {
  test('method should calculate runnerFromPosition', () => {
    view.SubView.runnerFrom.$runner.on('mousedown', getEvent);
    view.SubView.runnerFrom.$runner.trigger('mousedown');

    view.SubView.handleRunnerFromStartPointermove(eventSimulation);

    const e = $.Event('pointermove');
    view.SubView.$document.trigger(e);

    expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
  });

  test('method should return after wrong mouse button pressed', () => {
    view.SubView.runnerFrom.$runner.on('click', getEvent);
    view.SubView.runnerFrom.$runner.trigger('click');

    eventSimulation.pointerType = 'mouse';
    eventSimulation.buttons = 2;

    expect(view.SubView.handleRunnerFromStartPointermove(eventSimulation)).toBeUndefined();
  });
});

describe('handleRunnerToStartPointermove', () => {
  test('method should calculate runnerToPosition', () => {
    view.SubView.runnerTo.$runner.on('mousedown', getEvent);
    view.SubView.runnerTo.$runner.trigger('mousedown');

    view.SubView.handleRunnerToStartPointermove(eventSimulation);

    const e = $.Event('pointermove');
    view.SubView.$document.trigger(e);

    expect(view.SubView.runnerTo.runnerPosition).toEqual(0);
  });

  test('method should return after wrong mouse button pressed', () => {
    view.SubView.runnerTo.$runner.on('click', getEvent);
    view.SubView.runnerTo.$runner.trigger('click');

    eventSimulation.pointerType = 'mouse';
    eventSimulation.buttons = 2;

    expect(view.SubView.handleRunnerToStartPointermove(eventSimulation)).toBeUndefined();
  });
});

describe('handleLimitMinSetRunnerPosition', () => {
  test('method should set min runnerFromPosition', () => {
    view.SubView.limitMin.$limit.on('click', getEvent);
    view.SubView.limitMin.$limit.trigger('click');

    view.SubView.handleLimitMinSetRunnerPosition(eventSimulation);

    expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
  });

  test('method should return after wrong mouse button pressed', () => {
    view.SubView.limitMin.$limit.on('click', getEvent);
    view.SubView.limitMin.$limit.trigger('click');

    eventSimulation.pointerType = 'mouse';
    eventSimulation.buttons = 2;

    expect(view.SubView.handleLimitMinSetRunnerPosition(eventSimulation)).toBeUndefined();
  });
});

describe('handleLimitMaxSetRunnerPosition', () => {
  test('method should set max runnerFromPosition', () => {
    view.SubView.limitMax.$limit.on('click', getEvent);
    view.SubView.limitMax.$limit.trigger('click');

    view.SubView.handleLimitMaxSetRunnerPosition(eventSimulation);

    expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
  });

  test('method should set max runnerToPosition', () => {
    view.SubView.limitMax.$limit.on('click', getEvent);
    view.SubView.limitMax.$limit.trigger('click');

    view.SubView.modelOptions.double = true;

    view.SubView.handleLimitMaxSetRunnerPosition(eventSimulation);

    expect(view.SubView.runnerTo.runnerPosition).toEqual(0);
  });

  test('method should return after wrong mouse button pressed', () => {
    view.SubView.limitMax.$limit.on('click', getEvent);
    view.SubView.limitMax.$limit.trigger('click');

    eventSimulation.pointerType = 'mouse';
    eventSimulation.buttons = 2;

    expect(view.SubView.handleLimitMaxSetRunnerPosition(eventSimulation)).toBeUndefined();
  });
});

describe('handleStripeCalculateRunnerPositionAfterOnDown', () => {
  test('method should calculate new runners positions', () => {
    view.SubView.stripe.$stripe.on('click', getEvent);
    view.SubView.stripe.$stripe.trigger('click');

    view.SubView.handleStripeCalculateRunnerPositionAfterOnDown(eventSimulation);

    expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
    expect(view.SubView.runnerTo.runnerPosition).toEqual(0);
  });

  test('method should return after wrong mouse button pressed', () => {
    view.SubView.stripe.$stripe.on('click', getEvent);
    view.SubView.stripe.$stripe.trigger('click');

    eventSimulation.pointerType = 'mouse';
    eventSimulation.buttons = 2;

    expect(
      view.SubView.handleStripeCalculateRunnerPositionAfterOnDown(eventSimulation),
    ).toBeUndefined();
  });
});

describe('handleScaleCalculateRunnerPositionAfterOnDown', () => {
  test('method should calculate new runners positions', () => {
    view.SubView.scale.$scaleContainer.on('click', getEvent);
    view.SubView.scale.$scaleContainer.trigger('click');

    eventSimulation.target = $('<div/>').width(10).height(10).html('0');

    view.SubView.handleScaleCalculateRunnerPositionAfterOnDown(eventSimulation);

    expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
    expect(view.SubView.runnerTo.runnerPosition).toEqual(0);
  });

  test('method should return after wrong mouse button pressed', () => {
    view.SubView.scale.$scaleContainer.on('click', getEvent);
    view.SubView.scale.$scaleContainer.trigger('click');

    eventSimulation.target = $('<div/>').width(10).height(10).html('0');
    eventSimulation.pointerType = 'mouse';
    eventSimulation.buttons = 2;

    expect(
      view.SubView.handleScaleCalculateRunnerPositionAfterOnDown(eventSimulation),
    ).toBeUndefined();
  });
});

describe('setElementParameters', () => {
  test('method should set slider/container parameters', () => {
    view.SubView.setElementParameters();

    expect(view.SubView.sliderPosition).toEqual(0);
    expect(view.SubView.sliderLength).toEqual(100);
    expect(view.SubView.runnerLength).toEqual(0);
  });
});

describe('Limit', () => {
  describe('calculateLimitPosition', () => {
    test('method should calculate limitMin position', () => {
      view.SubView.limitMin.calculateLimitPosition(options);

      expect(view.SubView.limitMin.limitPosition).toEqual(0);
    });

    test('method should calculate limitMax position', () => {
      view.SubView.limitMax.calculateLimitPosition(options);

      expect(view.SubView.limitMax.limitPosition).toEqual(100);
    });
  });

  describe('setLimitPosition', () => {
    test('method should set limitMin position', () => {
      view.SubView.limitMin.calculateLimitPosition(options);
      view.SubView.limitMin.setLimitPosition(options);

      expect(view.SubView.limitMin.$limit.css('left')).toEqual('0px');
    });

    test('method should set limitMax position', () => {
      view.SubView.limitMax.calculateLimitPosition(options);
      view.SubView.limitMax.setLimitPosition(options);

      expect(view.SubView.limitMax.$limit.css('left')).toEqual('100px');
    });
  });

  describe('setLimitValue', () => {
    test('method should set limitMin value', () => {
      view.SubView.limitMin.setLimitValue(options);

      expect(view.SubView.limitMin.$limit.html()).toEqual('0');
    });

    test('method should set limitMax value', () => {
      view.SubView.limitMax.setLimitValue(options);

      expect(view.SubView.limitMax.$limit.html()).toEqual('100');
    });

    test('method should set limit value with localString', () => {
      view.SubView.modelOptions.max = 1000000;
      view.SubView.modelOptions.localeString = true;

      view.SubView.limitMax.setLimitValue(options);

      expect(view.SubView.limitMax.$limit.html()).toEqual('1&nbsp;000&nbsp;000');
    });
  });

  describe('setLimitOpacity', () => {
    test('method should set limitMin opacity 1', () => {
      view.SubView.limitMin.setLimitOpacity(options);

      expect(view.SubView.limitMin.$limit.css('opacity')).toEqual('1');
    });

    test('method should set limitMax opacity 1', () => {
      view.SubView.limitMax.setLimitOpacity(options);

      expect(view.SubView.limitMax.$limit.css('opacity')).toEqual('1');
    });
  });
});

describe('Range', () => {
  describe('calculateRangePosition', () => {
    test('method should calculate range position for single slider', () => {
      view.SubView.range.calculateRangePosition(options);

      expect(view.SubView.range.rangePosition).toEqual(0);
    });

    test('method should calculate range position for double slider', () => {
      view.SubView.modelOptions.double = true;
      options.subViewOptions.runnerFromPosition = 10;

      view.SubView.range.calculateRangePosition(options);

      expect(view.SubView.range.rangePosition).toEqual(10);
    });
  });

  describe('calculateRangeLength', () => {
    test('method should calculate range length for single slider', () => {
      options.subViewOptions.runnerFromPosition = 10;

      view.SubView.range.calculateRangeLength(options);

      expect(view.SubView.range.rangeLength).toEqual(10);
    });

    test('method should calculate range length for double slider', () => {
      view.SubView.modelOptions.double = true;
      options.subViewOptions.runnerFromPosition = 10;
      options.subViewOptions.runnerToPosition = 50;

      view.SubView.range.calculateRangeLength(options);

      expect(view.SubView.range.rangeLength).toEqual(40);
    });
  });

  describe('setRangePosition', () => {
    test('method should set range position for single slider', () => {
      view.SubView.range.rangePosition = 25;

      view.SubView.range.setRangePosition(options);

      expect(view.SubView.range.$range.css('left')).toEqual('25px');
    });
  });

  describe('setRangeLength', () => {
    test('method should set range position for single slider', () => {
      options.subViewOptions.runnerFromPosition = 10;

      view.SubView.range.calculateRangeLength(options);
      view.SubView.range.setRangeLength(options);

      expect(view.SubView.range.$range.css('width')).toEqual('10px');
    });
  });
});

describe('Runner', () => {
  describe('calculateInitialRunnerPosition', () => {
    test('method should calculate initial runnerFrom position', () => {
      view.SubView.runnerFrom.calculateInitialRunnerPosition(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(20);
    });

    test('method should calculate initial runnerTo position', () => {
      view.SubView.runnerTo.calculateInitialRunnerPosition(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(50);
    });
  });

  describe('calculateRunnerPositionWhileMouseIsMoving', () => {
    test('method should increment runnerFrom position with set step', () => {
      view.SubView.runnerFrom.runnerPosition = 10;
      options.subViewOptions.clickPosition = 18;
      options.modelOptions.isStepSet = true;
      options.modelOptions.stepLength = 5;

      view.SubView.runnerFrom.calculateRunnerPositionWhileMouseIsMoving(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(15);
    });

    test('method should decrement runnerFrom position with set step', () => {
      view.SubView.runnerFrom.runnerPosition = 10;
      options.subViewOptions.clickPosition = 2;
      options.modelOptions.isStepSet = true;
      options.modelOptions.stepLength = 5;

      view.SubView.runnerFrom.calculateRunnerPositionWhileMouseIsMoving(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(5);
    });
  });

  describe('setRunnerPosition', () => {
    test('method should set runner position', () => {
      view.SubView.runnerFrom.runnerPosition = 15;

      view.SubView.runnerFrom.setRunnerPosition(options);

      expect(view.SubView.runnerFrom.$runner.css('left')).toEqual('15px');
    });
  });
});

describe('Scale', () => {
  describe('setScaleLength', () => {
    test('method should set scale length equal to slider length', () => {
      view.SubView.scale.setScaleLength(options);

      expect(view.SubView.scale.$scaleContainer.css('width')).toEqual('100px');
    });
  });

  describe('setScalePosition', () => {
    test('method should set scale position equal to runner length', () => {
      options.subViewOptions.runnerLength = 15;

      view.SubView.scale.setScalePosition(options);

      expect(view.SubView.scale.$scaleContainer.css('top')).toEqual('15px');
    });

    test(
      'method should set scale position for vertical view equal to runner length + max scale element length',
      () => {
        options.modelOptions.scalePositionParameter = 'right';
        options.subViewOptions.runnerLength = 15;
        const $scaleElement = $('<div/>', {
          class: 'js-slider__scale-element',
        });

        $scaleElement.appendTo(view.SubView.scale.$scaleContainer);

        view.SubView.scale.setScalePosition(options);

        expect(view.SubView.scale.$scaleContainer.css('top')).toEqual('15px');
      },
    );
  });

  describe('setScaleElementsValues', () => {
    test('method should add elements to scaleContainer', () => {
      options.modelOptions.scaleElements = [0, 1, 2, 3, 4, 5];

      view.SubView.scale.setScaleElementsValues(options);

      expect($('.js-slider__scale-element').length).toEqual(6);
    });

    test('method should add elements to scaleContainer with localeString', () => {
      options.modelOptions.localeString = true;
      options.modelOptions.scaleElements = [1000, 1, 2, 3, 4, 5];

      view.SubView.scale.setScaleElementsValues(options);

      expect($($('.js-slider__scale-element')[0]).html()).toEqual('1&nbsp;000');
    });

    test('method should set elements values', () => {
      options.modelOptions.scaleElements = [0, 1, 2, 3, 4, 5];

      view.SubView.scale.setScaleElementsValues(options);
      const $scaleElementCollection = $('.js-slider__scale-element');

      $scaleElementCollection.each(function compareValues(index) {
        const $scaleElement = $(this);

        expect($scaleElement.html()).toEqual(`${index}`);
      });
    });
  });

  describe('calculateLengthBetweenScaleElements', () => {
    test('method should calculate length between scale elements', () => {
      options.modelOptions.scaleNumber = 5;

      view.SubView.scale.calculateLengthBetweenScaleElements(options);

      expect(view.SubView.scale.lengthBetweenScaleElements).toEqual(25);
    });
  });

  describe('setScaleElementsPositions', () => {
    test('method should calculate length between scale elements', () => {
      options.modelOptions.scaleElements = [0, 1, 2, 3, 4, 5];
      view.SubView.scale.lengthBetweenScaleElements = 25;
      view.SubView.scale.setScaleElementsValues(options);
      const $scaleElementCollection = $('.js-slider__scale-element');
      let expectedValue = 0;

      view.SubView.scale.setScaleElementsPositions(options);

      $scaleElementCollection.each(function comparePositions() {
        const $scaleElement = $(this);

        expect($scaleElement.css('left')).toEqual(`${expectedValue}px`);

        expectedValue += view.SubView.scale.lengthBetweenScaleElements;
      });
    });
  });
});

describe('Tooltip', () => {
  describe('calculateTooltipPosition', () => {
    test('method should calculate tooltipFrom position', () => {
      options.subViewOptions.runnerFromPosition = 10;

      view.SubView.tooltipFrom.calculateTooltipPosition(options);

      expect(view.SubView.tooltipFrom.tooltipPosition).toEqual(10);
    });

    test('method should calculate tooltipTo position', () => {
      options.subViewOptions.runnerToPosition = 10;

      view.SubView.tooltipTo.calculateTooltipPosition(options);

      expect(view.SubView.tooltipTo.tooltipPosition).toEqual(10);
    });

    test('method should calculate tooltipFrom position for close tooltips', () => {
      options.subViewOptions.areTooltipsClose = true;
      options.subViewOptions.runnerFromPosition = 25;
      options.subViewOptions.runnerToPosition = 75;

      view.SubView.tooltipFrom.calculateTooltipPosition(options);

      expect(view.SubView.tooltipFrom.tooltipPosition).toEqual(50);
    });
  });

  describe('setTooltipPosition', () => {
    test('method should set tooltipFrom position', () => {
      view.SubView.tooltipFrom.tooltipPosition = 25;

      view.SubView.tooltipFrom.setTooltipPosition(options);

      expect(view.SubView.tooltipFrom.$tooltip.css('left')).toEqual('25px');
    });

    test('method should call setTooltipOpacity private method and set tooltipTo opacity: 0', () => {
      options.modelOptions.double = true;
      options.subViewOptions.areTooltipsClose = true;
      view.SubView.tooltipTo.tooltipPosition = 25;

      view.SubView.tooltipTo.setTooltipPosition(options);

      expect(view.SubView.tooltipTo.$tooltip.css('left')).toEqual('25px');
    });
  });

  describe('setTooltipValue', () => {
    test('method should set tooltipFrom value', () => {
      options.modelOptions.from = 25;

      view.SubView.tooltipFrom.setTooltipValue(options);

      expect(view.SubView.tooltipFrom.$tooltip.html()).toEqual('25');
    });

    test('method should set tooltipTo value', () => {
      options.modelOptions.to = 75;

      view.SubView.tooltipTo.setTooltipValue(options);

      expect(view.SubView.tooltipTo.$tooltip.html()).toEqual('75');
    });

    test('method should set tooltipFrom local string value', () => {
      options.modelOptions.localeString = true;
      options.modelOptions.from = 1000;

      view.SubView.tooltipFrom.setTooltipValue(options);

      expect(view.SubView.tooltipFrom.$tooltip.html()).toEqual('1&nbsp;000');
    });

    test('method should set tooltipFrom value for close tooltips', () => {
      options.subViewOptions.areTooltipsClose = true;
      options.modelOptions.from = 35;
      options.modelOptions.to = 75;

      view.SubView.tooltipFrom.setTooltipValue(options);

      expect(view.SubView.tooltipFrom.$tooltip.html()).toEqual('35&nbsp;‑&nbsp;75');
    });
  });
});

describe('Stripe', () => {
  describe('calculateRunnerPositionAfterSliderOnDown', () => {
    test('method should calculate runnerFrom position', () => {
      options.subViewOptions.clickPosition = 50;

      view.SubView.stripe.calculateRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(50);
    });

    test('method should calculate runnerTo position', () => {
      options.modelOptions.double = true;
      options.subViewOptions.clickPosition = 50;

      view.SubView.stripe.calculateRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(50);
    });

    test('method should calculate runnerFrom position ahead', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.stepLength = 5;
      view.SubView.runnerFrom.runnerPosition = 10;
      options.subViewOptions.clickPosition = 50;

      view.SubView.stripe.calculateRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(50);
    });

    test('method should calculate runnerFrom position behind', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.stepLength = 5;
      view.SubView.runnerFrom.runnerPosition = 50;
      options.subViewOptions.clickPosition = 10;

      view.SubView.stripe.calculateRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(10);
    });

    test('method should calculate runnerTo position ahead', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.double = true;
      options.modelOptions.stepLength = 5;
      view.SubView.runnerFrom.runnerPosition = 10;
      view.SubView.runnerTo.runnerPosition = 50;
      options.subViewOptions.clickPosition = 60;

      view.SubView.stripe.calculateRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(60);
    });

    test('method should calculate runnerTo position behind', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.double = true;
      options.modelOptions.stepLength = 5;
      view.SubView.runnerFrom.runnerPosition = 10;
      view.SubView.runnerTo.runnerPosition = 60;
      options.subViewOptions.clickPosition = 50;

      view.SubView.stripe.calculateRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(50);
    });
  });

  describe('calculateRunnerPositionAfterScaleOnDown', () => {
    test('method should calculate runnerFrom position', () => {
      options.modelOptions.double = true;
      view.SubView.runnerFrom.runnerPosition = 10;
      view.SubView.runnerTo.runnerPosition = 60;
      options.subViewOptions.scaleElementPosition = 20;
      options.subViewOptions.clickPosition = 20;

      view.SubView.stripe.calculateRunnerPositionAfterScaleOnDown(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(25);
    });

    test('method should calculate runnerTo position', () => {
      options.modelOptions.double = true;
      view.SubView.runnerFrom.runnerPosition = 10;
      view.SubView.runnerTo.runnerPosition = 60;
      options.subViewOptions.scaleElementPosition = 50;
      options.subViewOptions.clickPosition = 50;

      view.SubView.stripe.calculateRunnerPositionAfterScaleOnDown(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(55);
    });
  });

  describe('restrictRunnerFromPosition', () => {
    test('method should set min runnerFrom position', () => {
      view.SubView.runnerFrom.runnerPosition = -10;

      view.SubView.stripe.restrictRunnerFromPosition(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
    });

    test('method should set max runnerFrom position', () => {
      view.SubView.runnerFrom.runnerPosition = 110;

      view.SubView.stripe.restrictRunnerFromPosition(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(100);
    });

    test('method should set runnerFrom position equal to runnerTo position', () => {
      options.modelOptions.double = true;
      view.SubView.runnerFrom.runnerPosition = 80;
      view.SubView.runnerTo.runnerPosition = 50;

      view.SubView.stripe.restrictRunnerFromPosition(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(50);
    });
  });

  describe('restrictRunnerToPosition', () => {
    test('method should set min runnerTo position', () => {
      options.modelOptions.double = true;
      view.SubView.runnerFrom.runnerPosition = 40;
      view.SubView.runnerTo.runnerPosition = 20;

      view.SubView.stripe.restrictRunnerToPosition(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(40);
    });

    test('method should set max runnerTo position', () => {
      options.modelOptions.double = true;
      view.SubView.runnerTo.runnerPosition = 110;

      view.SubView.stripe.restrictRunnerToPosition(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(100);
    });
  });

  describe('showLimit', () => {
    test('method should set min runnerTo position', () => {
      options.modelOptions.showLimit = true;
      view.SubView.runnerFrom.runnerPosition = -10;

      view.SubView.stripe.showLimit(options);

      expect(view.SubView.stripe.isLimitMinShown).toBeFalsy();
    });

    test('method should set min runnerTo position', () => {
      options.modelOptions.double = true;
      options.modelOptions.showLimit = true;
      view.SubView.runnerTo.runnerPosition = 110;

      view.SubView.stripe.showLimit(options);

      expect(view.SubView.stripe.isLimitMaxShown).toBeFalsy();
    });
  });

  describe('restrictRunnerPositionAfterSliderOnDown', () => {
    test('method should set min runnerFrom position', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.stepLength = 20;
      options.subViewOptions.clickPosition = 5;
      view.SubView.runnerFrom.runnerPosition = 40;

      view.SubView.stripe.restrictRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(0);
    });

    test('method should set max runnerFrom position', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.stepLength = 20;
      options.subViewOptions.clickPosition = 95;
      view.SubView.runnerFrom.runnerPosition = 40;

      view.SubView.stripe.restrictRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerFrom.runnerPosition).toEqual(100);
    });

    test('method should set max runnerTo position', () => {
      options.modelOptions.isStepSet = true;
      options.modelOptions.double = true;
      options.modelOptions.stepLength = 20;
      options.subViewOptions.clickPosition = 95;
      view.SubView.runnerFrom.runnerPosition = 40;
      view.SubView.runnerTo.runnerPosition = 60;

      view.SubView.stripe.restrictRunnerPositionAfterSliderOnDown(options);

      expect(view.SubView.runnerTo.runnerPosition).toEqual(100);
    });
  });
});
