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

  scalePositionParameter: string = this.isVertical ? 'right' : 'top';

  panelPosition = 0;

  panelPositionParameter: string = this.isVertical ? 'left' : 'top';

  scaleNumber = 5;

  isStepSet = false;

  sliderPosition = 0;

  sliderLength = 0;

  handleLength = 0;

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

  handleFromPosition = 0;

  handleToPosition = 0;

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

  public setElementsParameters = (elementsParameters: ElementsParameters): void => {
    this.sliderPosition = elementsParameters.sliderPosition;
    this.sliderLength = elementsParameters.sliderLength;
    this.handleLength = elementsParameters.handleLength;
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
      * this.sliderLength).toFixed(this.numberOfCharactersAfterDot));
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
      to: this.to,
      from: this.from,
      step: this.step,
      handleLength: this.handleLength,
      stepLength: this.stepLength,
      minValue: this.minValue,
      maxValue: this.maxValue,
      isMinValueShow: this.isMinValueShow,
      isMaxValueShow: this.isMaxValueShow,
      minValuePosition: this.minValuePosition,
      maxValuePosition: this.maxValuePosition,
      minValueLength: this.minValueLength,
      maxValueLength: this.maxValueLength,
      handleFromPosition: this.handleFromPosition,
      handleToPosition: this.handleToPosition,
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

  public calculateInitialHandlesPosition = (): void => {
    const minRatio: number = this.minValue / (this.maxValue - this.minValue);
    const fromRatio: number = this.from / (this.maxValue - this.minValue);
    const toRatio: number = this.to / (this.maxValue - this.minValue);

    this.handleFromPosition = Math.round((fromRatio - minRatio)
      * this.sliderLength - this.handleLength / 2);
    this.handleToPosition = Math.round((toRatio - minRatio)
      * this.sliderLength - this.handleLength / 2);

    this.restrictHandleFromPosition();
    this.restrictTooltipFromValue();
    this.restrictHandleToPosition();
    this.restrictTooltipToValue();
  };

  public calculateInitialHandleFromPosition = (): void => {
    const minRatio: number = this.minValue / (this.maxValue - this.minValue);
    const fromRatio: number = this.from / (this.maxValue - this.minValue);

    this.handleFromPosition = Math.round((fromRatio - minRatio)
      * this.sliderLength - this.handleLength / 2);

    this.restrictHandleFromPosition();
    this.restrictTooltipFromValue();
  };

  public calculateInitialHandleToPosition = (): void => {
    const minRatio: number = this.minValue / (this.maxValue - this.minValue);
    const toRatio: number = this.to / (this.maxValue - this.minValue);

    this.handleToPosition = Math.round((toRatio - minRatio)
      * this.sliderLength - this.handleLength / 2);

    this.restrictHandleToPosition();
    this.restrictTooltipToValue();
  };

  public calculateShiftAxis1 = (event: JQuery.TriggeredEvent): number | undefined => {
    event.stopPropagation();

    if (this.checkIsWrongMouseButtonPressed(event)) return undefined;

    let shiftX1 = 0;
    let shiftY1 = 0;

    if (event.pageX !== undefined) {
      shiftX1 = event.pageX - this.handleFromPosition - this.sliderPosition;
    }

    if (event.pageY !== undefined) {
      shiftY1 = event.pageY - this.handleFromPosition - this.sliderPosition;
    }

    const shiftAxis1: number = this.isVertical ? shiftY1 : shiftX1;

    return shiftAxis1;
  };

  public calculateHandleFromPositionWhileMoving = (
    event: JQuery.TriggeredEvent,
    shiftAxis1 = 0,
  ): void => {
    event.preventDefault();

    if (this.checkIsWrongMouseButtonPressed(event)) return;

    let pageX1 = 0;
    let pageY1 = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    if (this.isStepSet) {
      this.calculateHandleFromPositionWithSetStep(pageAxis1);

      this.restrictHandleFromPosition();
      this.calculateRangePosition();
      this.calculateRangeLength();
      this.calculateTooltipsPositions();
    } else {
      this.handleFromPosition = pageAxis1 - shiftAxis1 - this.sliderPosition;

      this.calculateTooltipsValues();
      this.restrictTooltipFromValue();
      this.restrictHandleFromPosition();
      this.calculateRangePosition();
      this.calculateRangeLength();
      this.calculateTooltipsPositions();
    }

    this.observer.notifyObservers(this.getOptions());
  };

  private calculateHandleFromPositionWithSetStep = (pageAxis = 0): void => {
    const isCursorNearStepAhead: boolean = pageAxis - this.sliderPosition
      > this.handleFromPosition + this.handleLength / 2 + this.stepLength / 2;
    const isCursorNearStepBehind: boolean = pageAxis - this.sliderPosition
      < this.handleFromPosition + this.handleLength / 2 - this.stepLength / 2;

    if (isCursorNearStepAhead) {
      this.handleFromPosition += this.stepLength;
      this.calculateTooltipFromValueWithStepAhead();
    } else if (isCursorNearStepBehind) {
      this.handleFromPosition -= this.stepLength;
      this.calculateTooltipFromValueWithStepBehind();
    }
  };

  public calculateHandleFromPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent): void => {
    if (this.checkIsWrongMouseButtonPressed(event)) return;

    let pageX1 = 0;
    let pageY1 = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    const intervalForHandleFromSteps: number = this.handleFromPosition + this.handleLength
      / 2 - (pageAxis1 - this.sliderPosition);
    let handleFromStepsNumber: number = Math.round(intervalForHandleFromSteps / this.stepLength);

    handleFromStepsNumber = handleFromStepsNumber
      < 0 ? -handleFromStepsNumber : handleFromStepsNumber;

    const isClickAheadOfHandleFromWithInterval: boolean = pageAxis1 - this.sliderPosition
      > this.handleFromPosition + this.handleLength
      && pageAxis1 - this.sliderPosition < this.handleFromPosition + this.handleLength
      + (this.handleToPosition - this.handleFromPosition - this.handleLength) / 2;
    const isClickAheadOfHandleFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition
      > this.handleFromPosition + this.handleLength;

    const isClickAheadOfHandleFrom: boolean = this.isInterval
      ? isClickAheadOfHandleFromWithInterval : isClickAheadOfHandleFromWithoutInterval;
    const isClickBehindOfHandleFrom: boolean = pageAxis1 - this.sliderPosition
      < this.handleFromPosition;
    const isClickForHandleFrom: boolean = isClickAheadOfHandleFrom || isClickBehindOfHandleFrom;

    if (this.isStepSet) {
      if (isClickAheadOfHandleFrom) {
        this.alignHandleFromWithHandleToАfterApproaching();

        this.handleFromPosition += handleFromStepsNumber * this.stepLength;

        this.calculateTooltipFromValueAfterSliderOnDownAhead(handleFromStepsNumber);
        this.calculateMaxHandleFromPositionAfterSliderOnDown(pageAxis1);
      } else if (isClickBehindOfHandleFrom) {
        this.handleFromPosition -= handleFromStepsNumber * this.stepLength;

        this.calculateTooltipFromValueAfterSliderOnDownBehind(handleFromStepsNumber);
        this.calculateMinHandleFromPositionAfterSliderOnDown(pageAxis1);
      }
    } else if (isClickForHandleFrom) {
      this.handleFromPosition = pageAxis1 - this.sliderPosition - this.handleLength / 2;
      this.calculateTooltipsValues();
    }

    this.restrictHandleFromPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  };

  private alignHandleFromWithHandleToАfterApproaching = (): void => {
    const isHandleFromNearHandleTo: boolean = this.isInterval
    && Math.round(this.handleToPosition - this.handleFromPosition) <= Math.round(this.stepLength);

    if (isHandleFromNearHandleTo) {
      this.handleFromPosition = this.handleToPosition;
      this.calculateMaxTooltipFromValue(this.tooltipToValue);
    }
  };

  private calculateMinHandleFromPositionAfterSliderOnDown = (pageAxis = 0): void => {
    if (!this.isStepSet) return;

    const isClickNearMinimum: boolean = pageAxis - this.sliderPosition < this.stepLength / 2;

    if (isClickNearMinimum) {
      this.handleFromPosition = 0 - this.handleLength / 2;
      this.calculateMinTooltipFromValue();
    }
  };

  private calculateMaxHandleFromPositionAfterSliderOnDown = (pageAxis = 0): void => {
    if (!this.isStepSet) return;

    const isClickNearMaximumWithoutInterval: boolean = this.sliderLength
    - (pageAxis - this.sliderPosition) < this.stepLength / 2
    && !this.isInterval;

    if (isClickNearMaximumWithoutInterval) {
      this.handleFromPosition = this.sliderLength - this.handleLength / 2;
      this.calculateMaxTooltipFromValue(this.maxValue);
    }
  };

  public calculateHandleFromPositionAfterMinValueOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    if (this.checkIsWrongMouseButtonPressed(event)) return;

    this.handleFromPosition = 0 - this.handleLength / 2;

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.calculateMinTooltipFromValue();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateHandleFromPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    const isWrongButtonPressedOrInterval: boolean = this.checkIsWrongMouseButtonPressed(event)
    || this.isInterval;

    if (isWrongButtonPressedOrInterval) return;

    this.handleFromPosition = this.sliderLength - this.handleLength / 2;

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.calculateMaxTooltipFromValue(this.maxValue);

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateHandleFromPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const isKeyboardOrWrongKeyCode: boolean = !this.keyboard || !keyCodes.includes(event.keyCode);

    if (isKeyboardOrWrongKeyCode) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.handleFromPosition += movementLength;
      if (this.isStepSet) this.calculateTooltipFromValueWithStepAhead();
    } else if (keyCodeToReduce.includes(event.keyCode)) {
      this.handleFromPosition -= movementLength;
      if (this.isStepSet) this.calculateTooltipFromValueWithStepBehind();
    }

    this.restrictHandleFromPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();

    this.observer.notifyObservers(this.getOptions());
  };

  private restrictHandleFromPosition = (): void => {
    const isHandleFromPositionLessThanMinimum: boolean = this.handleFromPosition
      < 0 - this.handleLength / 2;
    const isHandleFromPositionMoreThanMaximum: boolean = this.handleFromPosition
      > this.sliderLength - this.handleLength / 2;
    const isHandleFromPositionMoreThanHandleToPosition: boolean = this.isInterval
      && this.handleFromPosition > this.handleToPosition;

    if (isHandleFromPositionLessThanMinimum) {
      this.handleFromPosition = 0 - this.handleLength / 2;
    } else if (isHandleFromPositionMoreThanMaximum) {
      this.handleFromPosition = this.sliderLength - this.handleLength / 2;
    }
    if (isHandleFromPositionMoreThanHandleToPosition) {
      this.handleFromPosition = this.handleToPosition;
    }
  };

  public calculateShiftAxis2 = (event: JQuery.TriggeredEvent): number | undefined => {
    event.stopPropagation();

    const isWrongButtonPressedOrSingleHandle: boolean = this.checkIsWrongMouseButtonPressed(event)
      || !this.isInterval;

    if (isWrongButtonPressedOrSingleHandle) return undefined;

    let shiftX2 = 0;
    let shiftY2 = 0;

    if (event.pageX !== undefined) {
      shiftX2 = event.pageX - this.handleToPosition - this.sliderPosition;
    }

    if (event.pageY !== undefined) {
      shiftY2 = event.pageY - this.handleToPosition - this.sliderPosition;
    }

    const shiftAxis2: number = this.isVertical ? shiftY2 : shiftX2;

    return shiftAxis2;
  };

  public calculateHandleToPositionWhileMoving = (
    event: JQuery.TriggeredEvent,
    shiftAxis2 = 0,
  ): void => {
    event.preventDefault();

    const isWrongButtonPressedOrSingleHandle: boolean = this.checkIsWrongMouseButtonPressed(event)
      || !this.isInterval;

    if (isWrongButtonPressedOrSingleHandle) return;

    let pageX2 = 0;
    let pageY2 = 0;

    if (event.pageX !== undefined) {
      pageX2 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY2 = event.pageY;
    }

    const pageAxis2: number = this.isVertical ? pageY2 : pageX2;

    if (this.isStepSet) {
      this.calculateHandleToPositionWithSetStep(pageAxis2);

      this.restrictHandleToPosition();
      this.calculateRangePosition();
      this.calculateRangeLength();
      this.calculateTooltipsPositions();
    } else {
      this.handleToPosition = pageAxis2 - shiftAxis2 - this.sliderPosition;

      this.calculateTooltipsValues();
      this.restrictTooltipToValue();
      this.restrictHandleToPosition();
      this.calculateRangePosition();
      this.calculateRangeLength();
      this.calculateTooltipsPositions();
    }

    this.observer.notifyObservers(this.getOptions());
  };

  private calculateHandleToPositionWithSetStep = (pageAxis = 0): void => {
    const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

    if (!isIntervalAndStep) return;

    const isCursorNearStepAhead: boolean = pageAxis - this.sliderPosition
      > this.handleToPosition + this.handleLength / 2 + this.stepLength / 2;
    const isCursorNearStepBehind: boolean = pageAxis - this.sliderPosition
      < this.handleToPosition + this.handleLength / 2 - this.stepLength / 2;

    if (isCursorNearStepAhead) {
      this.handleToPosition += this.stepLength;
      this.calculateTooltipToValueWithStepAhead();
    } else if (isCursorNearStepBehind) {
      this.handleToPosition -= this.stepLength;
      this.calculateTooltipToValueWithStepBehind();
    }
  };

  public calculateHandleToPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent): void => {
    const isWrongButtonPressedOrSingleHandle: boolean = this.checkIsWrongMouseButtonPressed(event)
      || !this.isInterval;

    if (isWrongButtonPressedOrSingleHandle) return;

    let pageX2 = 0;
    let pageY2 = 0;

    if (event.pageX !== undefined) {
      pageX2 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY2 = event.pageY;
    }

    const pageAxis2: number = this.isVertical ? pageY2 : pageX2;
    const intervalForHandleToSteps: number = this.handleToPosition + this.handleLength
      / 2 - (pageAxis2 - this.sliderPosition);
    let handleToStepsNumber: number = Math.round(intervalForHandleToSteps / this.stepLength);

    handleToStepsNumber = handleToStepsNumber < 0 ? -handleToStepsNumber : handleToStepsNumber;

    const isClickAheadOfHandleTo: boolean = pageAxis2 - this.sliderPosition
      > this.handleToPosition + this.handleLength;
    const isClickBehindOfHandleTo: boolean = pageAxis2 - this.sliderPosition
      < this.handleToPosition && pageAxis2 - this.sliderPosition
      >= this.handleFromPosition + this.handleLength
      + (this.handleToPosition - this.handleFromPosition - this.handleLength) / 2;
    const isClickForHandleTo: boolean = isClickAheadOfHandleTo || isClickBehindOfHandleTo;

    if (this.isStepSet) {
      if (isClickAheadOfHandleTo) {
        this.handleToPosition += handleToStepsNumber * this.stepLength;

        this.calculateTooltipToValueAfterSliderOnDownAhead(handleToStepsNumber);
        this.calculateMaxHandleToPositionAfterSliderOnDown(pageAxis2);
      } else if (isClickBehindOfHandleTo) {
        this.alignHandleToWithHandleFromАfterApproaching();

        this.handleToPosition -= handleToStepsNumber * this.stepLength;

        this.calculateTooltipToValueAfterSliderOnDownBehind(handleToStepsNumber);
      }
    } else if (isClickForHandleTo) {
      this.handleToPosition = pageAxis2 - this.sliderPosition - this.handleLength / 2;
      this.calculateTooltipsValues();
    }

    this.restrictHandleToPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  };

  private alignHandleToWithHandleFromАfterApproaching = (): void => {
    const isHandleFromNearHandleTo: boolean = this.isInterval
      && Math.round(this.handleToPosition - this.handleFromPosition)
      <= Math.round(this.stepLength);

    if (isHandleFromNearHandleTo) {
      this.handleToPosition = this.handleFromPosition;
      this.calculateMinTooltipToValue();
    }
  };

  private calculateMaxHandleToPositionAfterSliderOnDown = (pageAxis = 0): void => {
    const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

    if (!isIntervalAndStep) return;

    const isClickNearMaximum: boolean = this.sliderLength - (pageAxis - this.sliderPosition)
      < this.stepLength / 2;

    if (isClickNearMaximum) {
      this.handleToPosition = this.sliderLength - this.handleLength / 2;
      this.calculateMaxTooltipToValue();
    }
  };

  public calculateHandleToPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    if (!this.isInterval) return;

    this.handleToPosition = this.sliderLength - this.handleLength / 2;

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.calculateMaxTooltipToValue();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculateHandleToPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    const isKeyboardAndInterval: boolean = this.keyboard && this.isInterval;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const isKeyboardOrWrongKeyCode: boolean = !isKeyboardAndInterval
      || !keyCodes.includes(event.keyCode);

    if (isKeyboardOrWrongKeyCode) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.handleToPosition += movementLength;
      if (this.isStepSet) this.calculateTooltipToValueWithStepAhead();
    } else if (keyCodeToReduce.includes(event.keyCode)) {
      this.handleToPosition -= movementLength;
      if (this.isStepSet) this.calculateTooltipToValueWithStepBehind();
    }

    this.restrictHandleToPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();

    this.observer.notifyObservers(this.getOptions());
  };

  private restrictHandleToPosition = (): void => {
    const isHandleFromPositionLessThanHandleToPosition: boolean = this.handleToPosition
      < this.handleFromPosition;
    const isHandleToPositionMoreThanMaximum: boolean = this.handleToPosition
      > this.sliderLength - this.handleLength / 2;

    if (isHandleFromPositionLessThanHandleToPosition) {
      this.handleToPosition = this.handleFromPosition;
    } else if (isHandleToPositionMoreThanMaximum) {
      this.handleToPosition = this.sliderLength - this.handleLength / 2;
    }
  };

  public calculateHandlePositionAfterScaleOnDown = (
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

    const isClickAheadOfHandleFromWithInterval: boolean = pageAxis1 - this.sliderPosition
      > this.handleFromPosition + this.handleLength
      && pageAxis1 - this.sliderPosition < this.handleFromPosition + this.handleLength
      + (this.handleToPosition - this.handleFromPosition) / 2;
    const isClickAheadOfHandleFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition
      > this.handleFromPosition + this.handleLength;

    const isClickAheadOfHandleFrom: boolean = this.isInterval
      ? isClickAheadOfHandleFromWithInterval : isClickAheadOfHandleFromWithoutInterval;
    const isClickBehindOfHandleFrom: boolean = pageAxis1 - this.sliderPosition
      < this.handleFromPosition;
    const isClickAheadOfHandleTo: boolean = pageAxis1 - this.sliderPosition
      > this.handleToPosition + this.handleLength;
    const isClickBehindOfHandleTo: boolean = pageAxis1 - this.sliderPosition < this.handleToPosition
      && pageAxis1 - this.sliderPosition >= this.handleFromPosition + this.handleLength
      + (this.handleToPosition - this.handleFromPosition) / 2;
    const isClickForHandleFrom: boolean = isClickAheadOfHandleFrom || isClickBehindOfHandleFrom;
    const isClickForHandleTo: boolean = isClickAheadOfHandleTo || isClickBehindOfHandleTo;

    if (isClickForHandleFrom) {
      this.handleFromPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength
        / 2 - this.handleLength / 2;
      this.calculateTooltipFromValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    } else if (isClickForHandleTo) {
      this.handleToPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength
        / 2 - this.handleLength / 2;
      this.calculateTooltipToValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  };

  public calculatePanelPosition = (): void => {
    const maxWidth: number = Math.max(this.minValueWidth, this.maxValueWidth);

    if (this.isVertical) {
      this.panelPosition = maxWidth + this.handleLength;
    } else {
      this.panelPosition = this.scaleElementHeight + this.handleLength;
    }
  };

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

  public calculateRangePosition = (): void => {
    this.rangePosition = 0;

    if (!this.isInterval) return;

    this.rangePosition = this.handleFromPosition + this.handleLength / 2;
  };

  public calculateRangeLength = (): void => {
    this.rangeLength = this.handleFromPosition + this.handleLength / 2;

    if (!this.isInterval) return;

    this.rangeLength = this.handleToPosition - this.handleFromPosition;
  };

  public calculateTooltipsPositions = (): void => {
    this.tooltipFromPosition = this.handleFromPosition + this.handleLength
      / 2 - this.tooltipFromLength / 2;

    if (this.isInterval) {
      this.tooltipToPosition = this.handleToPosition + this.handleLength
        / 2 - this.tooltipToLength / 2;
    }

    this.separateTooltips();
    this.showMinAndMaxValuesAfterContactWithTooltip();
  };

  public calculateInitialTooltipsValues = (): void => {
    this.tooltipFromValue = this.from;
    this.tooltipToValue = this.to;
  };

  private calculateTooltipsValues = (): void => {
    this.from = parseFloat((((this.handleFromPosition + this.handleLength / 2) / this.sliderLength)
     * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;

    this.restrictTooltipFromValue();

    if (!this.isInterval) return;

    this.to = parseFloat((((this.handleToPosition + this.handleLength / 2) / this.sliderLength)
      * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;

    this.restrictTooltipToValue();
  };

  private calculateTooltipFromValueAfterScaleOnDown = (value = 0): void => {
    this.from = value;
    this.tooltipFromValue = this.from;
  };

  private calculateTooltipToValueAfterScaleOnDown = (value = 0): void => {
    this.to = value;
    this.tooltipToValue = this.to;
  };

  private calculateTooltipFromValueAfterSliderOnDownAhead = (stepNumber = 0): void => {
    this.from = parseFloat((this.from + (stepNumber
      * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;
  };

  private calculateTooltipFromValueAfterSliderOnDownBehind = (stepNumber = 0): void => {
    this.from = parseFloat((this.from - (stepNumber
      * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;
  };

  private calculateTooltipToValueAfterSliderOnDownAhead = (stepNumber = 0): void => {
    this.to = parseFloat((this.to + (stepNumber
      * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;
  };

  private calculateTooltipToValueAfterSliderOnDownBehind = (stepNumber = 0): void => {
    this.to = parseFloat((this.to - (stepNumber
      * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;
  };

  private calculateTooltipFromValueWithStepAhead = (): void => {
    this.from = parseFloat((this.from + this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;

    this.restrictTooltipFromValue();
  };

  private calculateTooltipFromValueWithStepBehind = (): void => {
    this.from = parseFloat((this.from - this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;

    this.restrictTooltipFromValue();
  };

  private calculateTooltipToValueWithStepAhead = (): void => {
    this.to = parseFloat((this.to + this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;

    this.restrictTooltipToValue();
  };

  private calculateTooltipToValueWithStepBehind = (): void => {
    this.to = parseFloat((this.to - this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;

    this.restrictTooltipToValue();
  };

  private calculateMinTooltipFromValue = (): void => {
    this.from = this.minValue;
    this.tooltipFromValue = this.from;
  };

  private calculateMaxTooltipFromValue = (value = 0): void => {
    this.from = value;
    this.tooltipFromValue = this.from;
  };

  private restrictTooltipFromValue = (): void => {
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

    this.tooltipFromValue = this.from;
  };

  private calculateMinTooltipToValue = (): void => {
    this.to = this.from;

    this.tooltipToValue = this.to;
  };

  private calculateMaxTooltipToValue = (): void => {
    this.to = this.maxValue;

    this.tooltipToValue = this.to;
  };

  private restrictTooltipToValue = (): void => {
    const isToLessThanFrom: boolean = this.to < this.from;
    const isToMoreThanMaximum: boolean = this.to > this.maxValue;

    if (isToLessThanFrom) {
      this.to = this.from;
    } else if (isToMoreThanMaximum) {
      this.to = this.maxValue;
    }

    this.tooltipToValue = this.to;
  };

  private separateTooltips = (): void => {
    const areTooltipsClose: boolean = this.tooltipFromPosition + this.tooltipFromLength
      > this.tooltipToPosition;
    const areTooltipsCloseOrSingleHandle: boolean = !areTooltipsClose || !this.isInterval;

    if (areTooltipsCloseOrSingleHandle) return;

    this.tooltipFromPosition = this.handleFromPosition - this.tooltipFromLength;
    this.tooltipToPosition = this.handleToPosition + this.handleLength;
  };

  public calculateMinAndMaxPositions = (): void => {
    this.minValuePosition = 0;
    this.maxValuePosition = this.sliderLength - this.maxValueLength;
  };

  private showMinAndMaxValuesAfterContactWithTooltip = (): void => {
    this.isMinValueShow = true;
    this.isMaxValueShow = true;

    const isTooltipFromTouchesMinValue: boolean = this.tooltipFromPosition
      < this.minValuePosition + this.minValueLength;
    const isTooltipFromTouchesMaxValue: boolean = this.tooltipFromPosition + this.tooltipFromLength
      > this.maxValuePosition;
    const isTooltipToTouchesMaxValue: boolean = this.isInterval
      && this.tooltipToPosition + this.tooltipToLength > this.maxValuePosition;

    if (isTooltipFromTouchesMinValue) {
      this.isMinValueShow = false;
    }

    if (isTooltipToTouchesMaxValue) {
      this.isMaxValueShow = false;
    } else if (isTooltipFromTouchesMaxValue) {
      this.isMaxValueShow = false;
    }
  };

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

  private checkIsWrongMouseButtonPressed = (event: JQuery.TriggeredEvent): boolean => {
    this.isWrongMouseButtonPressed = event.pointerType === 'mouse' && event.buttons !== 1;

    return this.isWrongMouseButtonPressed;
  };
}

export default Model;
