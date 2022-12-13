import {
  Options,
  Config,
  UserConfig,
  ElementsParameters,
} from '../interfaces/interfaces';
import Observer from './observer';

class Model {
  observer: Observer;

  userConfig: UserConfig;

  data: Config;

  config: Config;

  isInterval = false;

  isVertical = false;

  isPanel = false;

  isTooltip = true;

  isRange = true;

  isScale = true;

  keyboard = false;

  positionParameter: string = this.isVertical ? 'top' : 'left';

  lengthParameter: string = this.isVertical ? 'height' : 'width';

  isMinAndMax = true;

  isWrongMouseButtonPressed = false;

  minValue = 0;

  maxValue = 100;

  step = 0;

  from = 20;

  to = 50;

  shiftAxis1 = 0;

  pageAxis1 = 0;

  scalePositionParameter: string = this.isVertical ? 'right' : 'top';

  panelPosition = 0;

  panelPositionParameter: string = this.isVertical ? 'left' : 'top';

  scaleNumber = 5;

  isStepSet = false;

  sliderPosition = 0;

  sliderLength = 0;

  runnerLength = 0;

  isMinValueShow = true;

  isMaxValueShow = true;

  minValuePosition = 0;

  maxValuePosition = 0;

  minValueLength = 0;

  maxValueLength = 0;

  minValueWidth = 0;

  maxValueWidth = 0;

  tooltipFromLength = 0;

  tooltipToLength = 0;

  stepLength = 0;

  runnerFromPosition = 0;

  runnerToPosition = 0;

  tooltipFromPosition = 0;

  tooltipToPosition = 0;

  tooltipFromValue = 0;

  tooltipToValue = 0;

  rangePosition = 0;

  rangeLength = 0;

  scaleElements: number[] = [];

  scaleElementHeight = 0;

  lengthBetweenScaleElements = 0;

  numberOfCharactersAfterDot = 0;

  event = new jQuery.Event('click');

  pointerDownEvent = new jQuery.Event('click');

  subViewOptions: any;

  constructor(userConfig: UserConfig = {}) {
    this.observer = new Observer();

    this.userConfig = userConfig;
    this.data = {
      isInterval: false,
      isVertical: false,
      isTooltip: true,
      isMinAndMax: true,
      isRange: true,
      isPanel: false,
      isScale: false,
      minValue: 0,
      maxValue: 100,
      from: 10,
      to: 50,
      step: 0,
      keyboard: false,
      scaleNumber: 5,
    };

    this.config = $.extend({}, this.data, this.userConfig);

    this.setConfigParameters();
  }

  public setSubViewOptions = (subViewOptions: any) => {
    this.subViewOptions = subViewOptions;
  };

  public setElementsParameters = (elementsParameters: ElementsParameters): void => {
    this.sliderPosition = elementsParameters.sliderPosition;
    this.sliderLength = elementsParameters.sliderLength;
    this.runnerFromPosition = elementsParameters.runnerFromPosition;
    this.runnerLength = elementsParameters.runnerLength;
    this.tooltipFromLength = elementsParameters.tooltipFromLength;
    this.tooltipToLength = elementsParameters.tooltipToLength;
    this.minValueLength = elementsParameters.minValueLength;
    this.maxValueLength = elementsParameters.maxValueLength;
    this.minValueWidth = elementsParameters.minValueWidth;
    this.maxValueWidth = elementsParameters.maxValueWidth;
    this.scaleElementHeight = elementsParameters.scaleElementHeight;
  };

  public calculateStepLength = (): void => {
    this.stepLength = parseFloat(((this.step
      / (this.maxValue - this.minValue))
      * this.subViewOptions.sliderLength).toFixed(this.numberOfCharactersAfterDot));
  };

  public getOptions = (): Options => {
    const options: Options = {
      isInterval: this.isInterval,
      isTooltip: this.isTooltip,
      isMinAndMax: this.isMinAndMax,
      isRange: this.isRange,
      isScale: this.isScale,
      isVertical: this.isVertical,
      isPanel: this.isPanel,
      isStepSet: this.isStepSet,
      positionParameter: this.positionParameter,
      lengthParameter: this.lengthParameter,
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      event: this.event,
      pointerDownEvent: this.pointerDownEvent,
      to: this.to,
      from: this.from,
      step: this.step,
      shiftAxis1: this.shiftAxis1,
      pageAxis1: this.pageAxis1,
      runnerLength: this.runnerLength,
      stepLength: this.stepLength,
      minValue: this.minValue,
      maxValue: this.maxValue,
      isMinValueShow: this.isMinValueShow,
      isMaxValueShow: this.isMaxValueShow,
      minValuePosition: this.minValuePosition,
      maxValuePosition: this.maxValuePosition,
      minValueLength: this.minValueLength,
      maxValueLength: this.maxValueLength,
      runnerFromPosition: this.runnerFromPosition,
      runnerToPosition: this.runnerToPosition,
      tooltipFromPosition: this.tooltipFromPosition,
      tooltipToPosition: this.tooltipToPosition,
      tooltipFromValue: this.tooltipFromValue,
      tooltipToValue: this.tooltipToValue,
      rangePosition: this.rangePosition,
      rangeLength: this.rangeLength,
      scalePositionParameter: this.scalePositionParameter,
      scaleNumber: this.scaleNumber,
      scaleElements: this.scaleElements,
      lengthBetweenScaleElements: this.lengthBetweenScaleElements,
      panelPosition: this.panelPosition,
      panelPositionParameter: this.panelPositionParameter,
      numberOfCharactersAfterDot: this.numberOfCharactersAfterDot,
      subViewOptions: this.subViewOptions,
    };

    return options;
  };

  public validateInitialValues = (): void => {
    const areMinAndMaxNegative: boolean = this.minValue < 0 && this.maxValue < 0;
    const isMinAndMaxPositiveAndStepMoreThanDifference: boolean = !areMinAndMaxNegative
      && this.step > this.maxValue - this.minValue;
    const isMinAndMaxNegativeAndStepMoreThanDifference: boolean = areMinAndMaxNegative
      && this.step > -(this.minValue - this.maxValue);

    if (this.minValue > this.maxValue) {
      const { minValue } = this;
      const { maxValue } = this;

      this.minValue = maxValue;
      this.maxValue = minValue;
    }

    if (isMinAndMaxPositiveAndStepMoreThanDifference) {
      this.step = 0;
    }

    if (isMinAndMaxNegativeAndStepMoreThanDifference) {
      this.step = 0;
    }

    if (this.step < 0) {
      this.step = 0;
    }

    this.isStepSet = this.step > 0;

    if (this.from < this.minValue) {
      this.from = this.minValue;
    }

    if (this.from > this.maxValue) {
      this.from = this.maxValue;
    }

    if (this.to > this.maxValue) {
      this.to = this.maxValue;
    }

    if (this.to < this.minValue) {
      this.to = this.minValue;
    }
  };

  public calculateFrom = (
    subViewOptions: {
      sliderPosition: number,
      sliderLength: number,
      runnerFromPosition: number,
      runnerLength: number,
      clickPosition: number,
      isMinFrom: boolean,
      isMaxFrom: boolean,
      isMaxTo: boolean,
      isCursorNearStepAheadFrom: boolean,
      isCursorNearStepBehindFrom: boolean,
    },
  ): void => {
    if (this.isStepSet) {
      if (subViewOptions.isCursorNearStepAheadFrom) {
        this.from = parseFloat((this.from + this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isCursorNearStepBehindFrom) {
        this.from = parseFloat((this.from - this.step).toFixed(this.numberOfCharactersAfterDot));
      }
    } else {
      this.from = parseFloat((((subViewOptions.runnerFromPosition
        + subViewOptions.runnerLength / 2) / subViewOptions.sliderLength)
        * (this.maxValue - this.minValue) + this.minValue).toFixed(
        this.numberOfCharactersAfterDot,
      ));
    }

    if (subViewOptions.isMinFrom) {
      this.from = this.minValue;
    }
    if (subViewOptions.isMaxFrom) {
      this.from = this.maxValue;
    }

    this.restrictFrom();

    this.observer.notifyObservers(this.getOptions());
  };

  // public calculateRunnerFromPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent): void => {
  //   if (this.checkIsWrongMouseButtonPressed(event)) return;

  //   let pageX1 = 0;
  //   let pageY1 = 0;

  //   if (event.pageX !== undefined) {
  //     pageX1 = event.pageX;
  //   }

  //   if (event.pageY !== undefined) {
  //     pageY1 = event.pageY;
  //   }

  //   const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

  //   const intervalForRunnerFromSteps: number = this.runnerFromPosition + this.runnerLength
  //     / 2 - (pageAxis1 - this.sliderPosition);
  //   let runnerFromStepsNumber: number = Math.round(intervalForRunnerFromSteps / this.stepLength);

  //   runnerFromStepsNumber = runnerFromStepsNumber
  //     < 0 ? -runnerFromStepsNumber : runnerFromStepsNumber;

  //   const isClickAheadOfRunnerFromWithInterval: boolean = pageAxis1 - this.sliderPosition
  //     > this.runnerFromPosition + this.runnerLength
  //     && pageAxis1 - this.sliderPosition < this.runnerFromPosition + this.runnerLength
  //     + (this.runnerToPosition - this.runnerFromPosition - this.runnerLength) / 2;
  //   const isClickAheadOfRunnerFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition
  //     > this.runnerFromPosition + this.runnerLength;

  //   const isClickAheadOfRunnerFrom: boolean = this.isInterval
  //     ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
  //   const isClickBehindOfRunnerFrom: boolean = pageAxis1 - this.sliderPosition
  //     < this.runnerFromPosition;
  //   const isClickForRunnerFrom: boolean = isClickAheadOfRunnerFrom || isClickBehindOfRunnerFrom;

  //   if (this.isStepSet) {
  //     if (isClickAheadOfRunnerFrom) {
  //       this.alignRunnerFromWithRunnerToАfterApproaching();

  //       this.runnerFromPosition += runnerFromStepsNumber * this.stepLength;

  //       this.calculateTooltipFromValueAfterSliderOnDownAhead(runnerFromStepsNumber);
  //       this.calculateMaxRunnerFromPositionAfterSliderOnDown(pageAxis1);
  //     } else if (isClickBehindOfRunnerFrom) {
  //       this.runnerFromPosition -= runnerFromStepsNumber * this.stepLength;

  //       this.calculateTooltipFromValueAfterSliderOnDownBehind(runnerFromStepsNumber);
  //       this.calculateMinRunnerFromPositionAfterSliderOnDown(pageAxis1);
  //     }
  //   } else if (isClickForRunnerFrom) {
  //     this.runnerFromPosition = pageAxis1 - this.sliderPosition - this.runnerLength / 2;
  //     // this.calculateTooltipsValues();
  //   }

  //   // this.restrictRunnerFromPosition();
  //   // this.calculateRangePosition();
  //   // this.calculateRangeLength();
  //   // this.calculateTooltipsPositions();

  //   this.observer.notifyObservers(this.getOptions());
  // };

  public calculateRunnerFromPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const isKeyboardOrWrongKeyCode: boolean = !this.keyboard || !keyCodes.includes(event.keyCode);

    if (isKeyboardOrWrongKeyCode) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.runnerFromPosition += movementLength;
      // if (this.isStepSet) this.calculateTooltipFromValueWithStepAhead();
    } else if (keyCodeToReduce.includes(event.keyCode)) {
      this.runnerFromPosition -= movementLength;
      // if (this.isStepSet) this.calculateTooltipFromValueWithStepBehind();
    }

    // this.restrictRunnerFromPosition();
    // this.calculateRangePosition();
    // this.calculateRangeLength();
    // this.calculateTooltipsPositions();
    // if (!this.isStepSet) this.calculateTooltipsValues();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateTo = (
    subViewOptions: {
      sliderPosition: number,
      sliderLength: number,
      runnerFromPosition: number,
      runnerToPosition: number,
      runnerLength: number,
      clickPosition: number,
      isMaxTo: boolean,
      isCursorNearStepAheadTo: boolean,
      isCursorNearStepBehindTo: boolean,
    },
  ): void => {
    if (this.isStepSet) {
      if (subViewOptions.isCursorNearStepAheadTo) {
        this.to = parseFloat((this.to + this.step).toFixed(this.numberOfCharactersAfterDot));
      } else if (subViewOptions.isCursorNearStepBehindTo) {
        this.to = parseFloat((this.to - this.step).toFixed(this.numberOfCharactersAfterDot));
      }
    } else {
      this.to = parseFloat((((subViewOptions.runnerToPosition
        + subViewOptions.runnerLength / 2) / subViewOptions.sliderLength)
        * (this.maxValue - this.minValue) + this.minValue).toFixed(
        this.numberOfCharactersAfterDot,
      ));
    }

    if (subViewOptions.isMaxTo) {
      this.to = this.maxValue;
    }

    this.restrictTo();

    this.observer.notifyObservers(this.getOptions());
  };

  // public calculateRunnerToPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent): void => {
  //   const isWrongButtonPressedOrSingleRunner: boolean =
  // this.checkIsWrongMouseButtonPressed(event)
  //     || !this.isInterval;

  //   if (isWrongButtonPressedOrSingleRunner) return;

  //   let pageX2 = 0;
  //   let pageY2 = 0;

  //   if (event.pageX !== undefined) {
  //     pageX2 = event.pageX;
  //   }

  //   if (event.pageY !== undefined) {
  //     pageY2 = event.pageY;
  //   }

  //   const pageAxis2: number = this.isVertical ? pageY2 : pageX2;
  //   const intervalForRunnerToSteps: number = this.runnerToPosition + this.runnerLength
  //     / 2 - (pageAxis2 - this.sliderPosition);
  //   let runnerToStepsNumber: number = Math.round(intervalForRunnerToSteps / this.stepLength);

  //   runnerToStepsNumber = runnerToStepsNumber < 0 ? -runnerToStepsNumber : runnerToStepsNumber;

  //   const isClickAheadOfRunnerTo: boolean = pageAxis2 - this.sliderPosition
  //     > this.runnerToPosition + this.runnerLength;
  //   const isClickBehindOfRunnerTo: boolean = pageAxis2 - this.sliderPosition
  //     < this.runnerToPosition && pageAxis2 - this.sliderPosition
  //     >= this.runnerFromPosition + this.runnerLength
  //     + (this.runnerToPosition - this.runnerFromPosition - this.runnerLength) / 2;
  //   const isClickForRunnerTo: boolean = isClickAheadOfRunnerTo || isClickBehindOfRunnerTo;

  //   if (this.isStepSet) {
  //     if (isClickAheadOfRunnerTo) {
  //       this.runnerToPosition += runnerToStepsNumber * this.stepLength;

  //       this.calculateTooltipToValueAfterSliderOnDownAhead(runnerToStepsNumber);
  //       this.calculateMaxRunnerToPositionAfterSliderOnDown(pageAxis2);
  //     } else if (isClickBehindOfRunnerTo) {
  //       this.alignRunnerToWithRunnerFromАfterApproaching();

  //       this.runnerToPosition -= runnerToStepsNumber * this.stepLength;

  //       this.calculateTooltipToValueAfterSliderOnDownBehind(runnerToStepsNumber);
  //     }
  //   } else if (isClickForRunnerTo) {
  //     this.runnerToPosition = pageAxis2 - this.sliderPosition - this.runnerLength / 2;
  //     // this.calculateTooltipsValues();
  //   }

  //   // this.restrictRunnerToPosition();
  //   // this.calculateRangePosition();
  //   // this.calculateRangeLength();
  //   // this.calculateTooltipsPositions();

  //   this.observer.notifyObservers(this.getOptions());
  // };

  public calculateRunnerToPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    const isKeyboardAndInterval: boolean = this.keyboard && this.isInterval;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const isKeyboardOrWrongKeyCode: boolean = !isKeyboardAndInterval
      || !keyCodes.includes(event.keyCode);

    if (isKeyboardOrWrongKeyCode) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.runnerToPosition += movementLength;
      // if (this.isStepSet) this.calculateTooltipToValueWithStepAhead();
    } else if (keyCodeToReduce.includes(event.keyCode)) {
      this.runnerToPosition -= movementLength;
      // if (this.isStepSet) this.calculateTooltipToValueWithStepBehind();
    }

    // this.restrictRunnerToPosition();
    // this.calculateRangePosition();
    // this.calculateRangeLength();
    // this.calculateTooltipsPositions();
    // if (!this.isStepSet) this.calculateTooltipsValues();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateRunnerPositionAfterScaleOnDown = (
    event: JQuery.TriggeredEvent,
    scaleOptions: {
      isScaleElementOnDown: boolean,
      scaleElementPosition: number,
      scaleElementLength: number,
      scaleElementValue: string,
    } = {
      isScaleElementOnDown: true,
      scaleElementPosition: 0,
      scaleElementLength: 0,
      scaleElementValue: '',
    },
  ): void => {
    event.stopPropagation();

    const isWrongMouseButtonOrWrongElement: boolean = this.checkIsWrongMouseButtonPressed(event)
      || !scaleOptions.isScaleElementOnDown;

    if (isWrongMouseButtonOrWrongElement) return;

    let pageX1 = 0;
    let pageY1 = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    const isClickAheadOfRunnerFromWithInterval: boolean = pageAxis1 - this.sliderPosition
      > this.runnerFromPosition + this.runnerLength
      && pageAxis1 - this.sliderPosition < this.runnerFromPosition + this.runnerLength
      + (this.runnerToPosition - this.runnerFromPosition) / 2;
    const isClickAheadOfRunnerFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition
      > this.runnerFromPosition + this.runnerLength;

    const isClickAheadOfRunnerFrom: boolean = this.isInterval
      ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
    const isClickBehindOfRunnerFrom: boolean = pageAxis1 - this.sliderPosition
      < this.runnerFromPosition;
    const isClickAheadOfRunnerTo: boolean = pageAxis1 - this.sliderPosition
      > this.runnerToPosition + this.runnerLength;
    const isClickBehindOfRunnerTo: boolean = pageAxis1 - this.sliderPosition < this.runnerToPosition
      && pageAxis1 - this.sliderPosition >= this.runnerFromPosition + this.runnerLength
      + (this.runnerToPosition - this.runnerFromPosition) / 2;
    const isClickForRunnerFrom: boolean = isClickAheadOfRunnerFrom || isClickBehindOfRunnerFrom;
    const isClickForRunnerTo: boolean = isClickAheadOfRunnerTo || isClickBehindOfRunnerTo;

    if (isClickForRunnerFrom) {
      this.runnerFromPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength
        / 2 - this.runnerLength / 2;
      this.calculateTooltipFromValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    } else if (isClickForRunnerTo) {
      this.runnerToPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength
        / 2 - this.runnerLength / 2;
      this.calculateTooltipToValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }

    // this.calculateRangePosition();
    // this.calculateRangeLength();
    // this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculatePanelPosition = (): void => {
    const maxWidth: number = Math.max(this.minValueWidth, this.maxValueWidth);

    if (this.isVertical) {
      this.panelPosition = maxWidth + this.runnerLength;
    } else {
      this.panelPosition = this.scaleElementHeight + this.runnerLength;
    }
  };

  public countNumberOfCharactersAfterDot = (): void => {
    const minValuesBeforeAndAfterDot: string[] = `${this.minValue}`.split('.');
    const maxValuesBeforeAndAfterDot: string[] = `${this.maxValue}`.split('.');

    let minValuesAfterDot: string = minValuesBeforeAndAfterDot[1];
    let maxValuesAfterDot: string = maxValuesBeforeAndAfterDot[1];

    if (minValuesAfterDot === undefined) minValuesAfterDot = '';
    if (maxValuesAfterDot === undefined) maxValuesAfterDot = '';

    this.numberOfCharactersAfterDot = minValuesAfterDot.length > maxValuesAfterDot.length
      ? minValuesAfterDot.length : maxValuesAfterDot.length;
  };

  // private showMinAndMaxValuesAfterContactWithTooltip = (): void => {
  //   this.isMinValueShow = true;
  //   this.isMaxValueShow = true;

  //   const isTooltipFromTouchesMinValue: boolean = this.tooltipFromPosition
  //     < this.minValuePosition + this.minValueLength;
  //   const isTooltipFromTouchesMaxValue: boolean = this.tooltipFromPosition
  //  + this.tooltipFromLength
  //     > this.maxValuePosition;
  //   const isTooltipToTouchesMaxValue: boolean = this.isInterval
  //     && this.tooltipToPosition + this.tooltipToLength > this.maxValuePosition;

  //   if (isTooltipFromTouchesMinValue) {
  //     this.isMinValueShow = false;
  //   }

  //   if (isTooltipToTouchesMaxValue) {
  //     this.isMaxValueShow = false;
  //   } else if (isTooltipFromTouchesMaxValue) {
  //     this.isMaxValueShow = false;
  //   }
  // };

  public calculateScaleElementsValues = (): void => {
    this.scaleElements.length = 0;

    let minScaleElementValue: number = parseFloat(
      this.minValue.toFixed(this.numberOfCharactersAfterDot),
    );
    const intervalForScaleElements: number = (this.maxValue - this.minValue)
      / (this.scaleNumber - 1);

    this.scaleElements.push(minScaleElementValue);

    for (let i = 0; i < this.scaleNumber - 1; i += 1) {
      const scaleElementValue: number = parseFloat((minScaleElementValue
        += intervalForScaleElements).toFixed(this.numberOfCharactersAfterDot));

      this.scaleElements.push(scaleElementValue);
    }
  };

  public calculateLengthBetweenScaleElements = (): void => {
    this.lengthBetweenScaleElements = this.sliderLength / (this.scaleNumber - 1);
  };

  public calculateScaleElementsNumber = (): void => {
    if (this.userConfig?.scaleNumber) return;

    const isDifferenceBetweenMaxMinValuesLessOrEqualToOne: boolean = this.maxValue - this.minValue
      <= 1 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxMinValuesLessOrEqualToTwo: boolean = this.maxValue - this.minValue
      <= 2 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxMinValuesLessOrEqualToFour: boolean = this.maxValue - this.minValue
      <= 4 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxMinValuesLessThanTen: boolean = this.maxValue - this.minValue < 10;
    const isMinValueNegativeMaxValuePositive: boolean = this.minValue < 0 && this.maxValue > 0;

    if (isDifferenceBetweenMaxMinValuesLessOrEqualToOne) {
      this.scaleNumber = 2;
    } else if (isDifferenceBetweenMaxMinValuesLessOrEqualToTwo) {
      this.scaleNumber = 3;
    } else if (isDifferenceBetweenMaxMinValuesLessOrEqualToFour) {
      this.scaleNumber = 4;
    } else if (isDifferenceBetweenMaxMinValuesLessThanTen) {
      this.scaleNumber = 5;
    } else if (isMinValueNegativeMaxValuePositive) {
      this.scaleNumber = 11;
    } else {
      this.scaleNumber = 6;
    }
  };

  // private alignRunnerFromWithRunnerToАfterApproaching = (): void => {
  //   const isRunnerFromNearRunnerTo: boolean = this.isInterval
  //   && Math.round(this.runnerToPosition
  // - this.runnerFromPosition) <= Math.round(this.stepLength);

  //   if (isRunnerFromNearRunnerTo) {
  //     this.runnerFromPosition = this.runnerToPosition;
  //     this.calculateMaxTooltipFromValue(this.tooltipToValue);
  //   }
  // };

  // private calculateMinRunnerFromPositionAfterSliderOnDown = (pageAxis = 0): void => {
  //   if (!this.isStepSet) return;

  //   const isClickNearMinimum: boolean = pageAxis - this.sliderPosition < this.stepLength / 2;

  //   if (isClickNearMinimum) {
  //     this.runnerFromPosition = 0 - this.runnerLength / 2;
  //     this.calculateMinTooltipFromValue();
  //   }
  // };

  // private calculateMaxRunnerFromPositionAfterSliderOnDown = (pageAxis = 0): void => {
  //   if (!this.isStepSet) return;

  //   const isClickNearMaximumWithoutInterval: boolean = this.sliderLength
  //   - (pageAxis - this.sliderPosition) < this.stepLength / 2
  //   && !this.isInterval;

  //   if (isClickNearMaximumWithoutInterval) {
  //     this.runnerFromPosition = this.sliderLength - this.runnerLength / 2;
  //     this.calculateMaxTooltipFromValue(this.maxValue);
  //   }
  // };

  // private alignRunnerToWithRunnerFromАfterApproaching = (): void => {
  //   const isRunnerFromNearRunnerTo: boolean = this.isInterval
  //     && Math.round(this.runnerToPosition - this.runnerFromPosition)
  //     <= Math.round(this.stepLength);

  //   if (isRunnerFromNearRunnerTo) {
  //     this.runnerToPosition = this.runnerFromPosition;
  //     this.calculateMinTooltipToValue();
  //   }
  // };

  // private calculateMaxRunnerToPositionAfterSliderOnDown = (pageAxis = 0): void => {
  //   const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

  //   if (!isIntervalAndStep) return;

  //   const isClickNearMaximum: boolean = this.sliderLength - (pageAxis - this.sliderPosition)
  //     < this.stepLength / 2;

  //   if (isClickNearMaximum) {
  //     this.runnerToPosition = this.sliderLength - this.runnerLength / 2;
  //     this.calculateMaxTooltipToValue();
  //   }
  // };

  private setConfigParameters = (): void => {
    this.isInterval = this.config.isInterval;
    this.isVertical = this.config.isVertical;
    this.isPanel = this.config.isPanel;
    this.isTooltip = this.config.isTooltip;
    this.isMinAndMax = this.config.isMinAndMax;
    this.isRange = this.config.isRange;
    this.isScale = this.config.isScale;
    this.keyboard = this.config.keyboard;
    this.positionParameter = this.isVertical ? 'top' : 'left';
    this.lengthParameter = this.isVertical ? 'height' : 'width';
    this.minValue = this.config.minValue;
    this.maxValue = this.config.maxValue;
    this.step = this.config.step;
    this.from = this.config.from;
    this.to = this.config.to;
    this.scalePositionParameter = this.isVertical ? 'right' : 'top';
    this.scaleNumber = this.config.scaleNumber;
    this.panelPositionParameter = this.isVertical ? 'left' : 'top';
  };

  private calculateTooltipFromValueAfterScaleOnDown = (value = 0): void => {
    this.from = value;
    this.tooltipFromValue = this.from;
  };

  private calculateTooltipToValueAfterScaleOnDown = (value = 0): void => {
    this.to = value;
    this.tooltipToValue = this.to;
  };

  // private calculateTooltipFromValueAfterSliderOnDownAhead = (stepNumber = 0): void => {
  //   this.from = parseFloat((this.from + (stepNumber
  //     * this.step)).toFixed(this.numberOfCharactersAfterDot));
  //   this.tooltipFromValue = this.from;
  // };

  // private calculateTooltipFromValueAfterSliderOnDownBehind = (stepNumber = 0): void => {
  //   this.from = parseFloat((this.from - (stepNumber
  //     * this.step)).toFixed(this.numberOfCharactersAfterDot));
  //   this.tooltipFromValue = this.from;
  // };

  // private calculateTooltipToValueAfterSliderOnDownAhead = (stepNumber = 0): void => {
  //   this.to = parseFloat((this.to + (stepNumber
  //     * this.step)).toFixed(this.numberOfCharactersAfterDot));
  //   this.tooltipToValue = this.to;
  // };

  // private calculateTooltipToValueAfterSliderOnDownBehind = (stepNumber = 0): void => {
  //   this.to = parseFloat((this.to - (stepNumber
  //     * this.step)).toFixed(this.numberOfCharactersAfterDot));
  //   this.tooltipToValue = this.to;
  // };

  // private calculateMinTooltipFromValue = (): void => {
  //   this.from = this.minValue;
  //   this.tooltipFromValue = this.from;
  // };

  // private calculateMaxTooltipFromValue = (value = 0): void => {
  //   this.from = value;
  //   this.tooltipFromValue = this.from;
  // };

  private restrictFrom = (): void => {
    const isFromLessThanMinimum: boolean = this.from < this.minValue;
    const isIntervalAndFromMoreThanTo: boolean = this.isInterval && this.from > this.to;
    const isFromMoreThanMaximum: boolean = this.from > this.maxValue;

    if (isFromLessThanMinimum) {
      this.from = this.minValue;
    } else if (isIntervalAndFromMoreThanTo) {
      this.from = this.to;
    } else if (isFromMoreThanMaximum) {
      this.from = this.maxValue;
    }
  };

  private restrictTo = (): void => {
    if (!this.isStepSet) return;

    const isToLessThanFrom: boolean = this.to < this.from;
    const isToMoreThanMaximum: boolean = this.to > this.maxValue;

    if (isToLessThanFrom) {
      this.to = this.from;
    } else if (isToMoreThanMaximum) {
      this.to = this.maxValue;
    }
  };

  // private calculateMinTooltipToValue = (): void => {
  //   this.to = this.from;

  //   this.tooltipToValue = this.to;
  // };

  // private calculateMaxTooltipToValue = (): void => {
  //   this.to = this.maxValue;

  //   this.tooltipToValue = this.to;
  // };

  // private separateTooltips = (): void => {
  //   const areTooltipsClose: boolean = this.tooltipFromPosition + this.tooltipFromLength
  //     > this.tooltipToPosition;
  //   const areTooltipsCloseOrSingleRunner: boolean = !areTooltipsClose || !this.isInterval;

  //   if (areTooltipsCloseOrSingleRunner) return;

  //   this.tooltipFromPosition = this.runnerFromPosition - this.tooltipFromLength;
  //   this.tooltipToPosition = this.runnerToPosition + this.runnerLength;
  // };

  private checkIsWrongMouseButtonPressed = (event: JQuery.TriggeredEvent): boolean => {
    this.isWrongMouseButtonPressed = event.pointerType === 'mouse' && event.buttons !== 1;

    return this.isWrongMouseButtonPressed;
  };
}

export default Model;
