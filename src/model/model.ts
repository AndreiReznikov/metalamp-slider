import { Options, Config, UserConfig, State, ElementsParameters } from '../interfaces/interfaces';

class Observer {
  observers: Function[] = [];

  addObserver = (observer: Function): void => {
    this.observers.push(observer);
  }

  notifyObservers = (options: Options): void => {
    for (let i = 0; i < this.observers.length; i++) {
      this.observers[i](options);
    }
  }
}

export class Model {
  observer: Observer;
  userConfig: UserConfig;
  storageConfig: UserConfig;
  data: Config;
  config: Config;

  isInterval: boolean = false;
  isVertical: boolean = false;
  isPanel: boolean = false;
  isTooltip: boolean = true;
  isRange: boolean = true;
  isScale: boolean = true;
  keyboard: boolean = false;
  positionParameter: string = this.isVertical ? 'top' : 'left';
  lengthParameter: string = this.isVertical ? 'height' : 'width';
  isMinAndMax: boolean = true;
  minValue: number = 0;
  maxValue: number = 100;
  step: number = 0;
  from: number = 20;
  to: number = 50;
  scalePositionParameter: string = this.isVertical ? 'right' : 'top';
  panelPosition: number = 0;
  panelPositionParameter: string = this.isVertical ? 'left' : 'top';
  scaleNumber: number = 5;
  isStepSet: boolean = false;
  sliderPosition: number = 0;
  sliderLength: number = 0;
  handleLength: number = 0;
  isMinValueShow: boolean = true;
  isMaxValueShow: boolean = true;
  minValuePosition: number = 0;
  maxValuePosition: number = 0;
  minValueLength: number = 0;
  maxValueLength: number = 0;
  minValueWidth: number = 0;
  maxValueWidth: number = 0;
  tooltipFromLength: number = 0;
  tooltipToLength: number = 0;
  stepLength: number = 0;
  handleFromPosition: number = 0;
  handleToPosition: number = 0;
  tooltipFromPosition: number = 0;
  tooltipToPosition: number = 0;
  tooltipFromValue: number = 0;
  tooltipToValue: number = 0;
  rangePosition: number = 0;
  rangeLength: number = 0;
  scaleElements: number[] = [];
  scaleElementHeight: number = 0;
  lengthBetweenScaleElements: number = 0;
  numberOfCharactersAfterDot: number = 0;

  constructor(userConfig: UserConfig) {
    this.observer = new Observer();
    
    this.userConfig = userConfig;
    this.storageConfig = JSON.parse(`${localStorage.getItem('storageConfig')}`);  
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
      scaleNumber: 5
    };
    
    this.config = $.extend({}, this.data, this.storageConfig, this.userConfig);
    
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
  }

  public calculateInitialValues = (): void => {
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.countNumberOfCharactersAfterDot();
    this.calculateMinAndMaxPositions();
    this.calculateInitialTooltipsValues();
    this.calculateTooltipsPositions();
    this.calculateStepLength();
    this.calculateScaleElementsNumber();
    this.calculateScaleElementsValues();
    this.calculateLengthBetweenScaleElements();
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
  }

  public calculateStepLength = (): void => {
    this.stepLength = parseFloat(((this.step/(this.maxValue - this.minValue)) * this.sliderLength).toFixed(this.numberOfCharactersAfterDot));
  }

  public setConfigToLocalStorage = (): void => {
    const storageConfig = {
      isInterval: this.isInterval,
      isVertical: this.isVertical,
      isTooltip: this.isTooltip,
      isMinAndMax: this.isMinAndMax,
      isRangen: this.isRange,
      isPanel: this.isPanel,
      isScale: this.isScale,
      minValue: this.minValue,
      maxValue: this.maxValue,
      from: this.from,
      to: this.to,
      step: this.step,
      keyboard: this.keyboard,
      scaleNumber: this.scaleNumber,
    }

    localStorage.setItem('storageConfig', JSON.stringify(storageConfig));
  }

  public getState = (): State => {
    const state: State = {
      isInterval: this.isInterval,
      isTooltip: this.isTooltip,
      isMinAndMax: this.isMinAndMax, 
      isRange: this.isRange, 
      isScale: this.isScale,
      isVertical: this.isVertical,
      isPanel: this.isPanel,
    }

    return state;
  }

  public getOptions = (): Options => {
    const options: Options = {
      positionParameter: this.positionParameter,
      lengthParameter: this.lengthParameter,
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
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
    }

    return options;
  }
  
  public validateInitialValues = (): void => {
    const areMinAndMaxNegative: boolean = this.minValue < 0 && this.maxValue < 0;
    const isMinAndMaxPositiveAndStepMoreThanDifference: boolean = !areMinAndMaxNegative && this.step > this.maxValue - this.minValue;
    const isMinAndMaxNegativeAndStepMoreThanDifference: boolean = areMinAndMaxNegative && this.step > -(this.minValue - this.maxValue);

    if (this.minValue > this.maxValue) {
      const minValue = this.minValue;
      const maxValue = this.maxValue;

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
  }

  public calculateInitialHandlesPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);
    
    this.handleFromPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.handleLength/2);
    this.handleToPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.handleLength/2);

    this.restrictHandleFromPosition();
    this.restrictTooltipFromValue();
    this.restrictHandleToPosition();
    this.restrictTooltipToValue();
  }

  public calculateInitialHandleFromPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    
    this.handleFromPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.handleLength/2);

    this.restrictHandleFromPosition();
    this.restrictTooltipFromValue();
  }

  public calculateInitialHandleToPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);

    this.handleToPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.handleLength/2);

    this.restrictHandleToPosition();
    this.restrictTooltipToValue();
  }

  public calculateShiftAxis1 = (event: JQuery.TriggeredEvent): number | undefined => {
    event.stopPropagation();

    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;

    if (isWrongMouseButtonPressed) return;

    let shiftX1: number = 0;
    let shiftY1: number = 0;

    if (event.pageX !== undefined) {
      shiftX1 = event.pageX - this.handleFromPosition - this.sliderPosition;
    }
    
    if (event.pageY !== undefined) {
      shiftY1 = event.pageY - this.handleFromPosition - this.sliderPosition;
    }

    const shiftAxis1: number = this.isVertical ? shiftY1 : shiftX1;
    
    return shiftAxis1;
  }

  public calculateHandleFromPositionWhileMoving = (event: JQuery.TriggeredEvent, shiftAxis1: number): void => {
    event.preventDefault();

    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;

    if (isWrongMouseButtonPressed) return;

    let pageX1: number = 0
    let pageY1: number = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }
    
    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    if (this.isStepSet) {
      this.calculateHandleFromPositionWithSetStep(pageAxis1);
    }
    else {
      this.handleFromPosition = pageAxis1 - shiftAxis1 - this.sliderPosition;
      this.calculateTooltipsValues();
      this.restrictTooltipFromValue();
    }

    this.restrictHandleFromPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateHandleFromPositionWithSetStep = (pageAxis: number): void => {
    if (!this.isStepSet) return;

    const isCursorNearStepAhead: boolean = pageAxis - this.sliderPosition > this.handleFromPosition + this.handleLength/2 + this.stepLength/2;
    const isCursorNearStepBehind: boolean = pageAxis - this.sliderPosition < this.handleFromPosition  + this.handleLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.handleFromPosition += this.stepLength;
      this.calculateTooltipFromValueWithStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.handleFromPosition -= this.stepLength;
      this.calculateTooltipFromValueWithStepBehind();
    }
  }

  public calculateHandleFromPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent): void => {
    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;

    if (isWrongMouseButtonPressed) return;

    let pageX1: number = 0
    let pageY1: number = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }
    
    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    const intervalForHandleFromSteps: number = this.handleFromPosition + this.handleLength/2 - (pageAxis1 - this.sliderPosition);
    let handleFromStepsNumber: number = Math.round(intervalForHandleFromSteps/this.stepLength);

    handleFromStepsNumber = handleFromStepsNumber < 0 ? -handleFromStepsNumber : handleFromStepsNumber;

    const isClickAheadOfHandleFromWithInterval: boolean = pageAxis1 - this.sliderPosition > this.handleFromPosition + this.handleLength && pageAxis1 - this.sliderPosition < this.handleFromPosition + this.handleLength + (this.handleToPosition - this.handleFromPosition - this.handleLength)/2;  
    const isClickAheadOfHandleFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition > this.handleFromPosition + this.handleLength;

    const isClickAheadOfHandleFrom: boolean = this.isInterval ? isClickAheadOfHandleFromWithInterval : isClickAheadOfHandleFromWithoutInterval;
    const isClickBehindOfHandleFrom: boolean = pageAxis1 - this.sliderPosition < this.handleFromPosition;
    const isClickForHandleFrom: boolean = isClickAheadOfHandleFrom || isClickBehindOfHandleFrom;

    if (this.isStepSet) {
      if (isClickAheadOfHandleFrom) {
        this.alignHandleFromWithHandleToАfterApproaching();

        this.handleFromPosition += handleFromStepsNumber * this.stepLength;

        this.calculateTooltipFromValueAfterSliderOnDownAhead(handleFromStepsNumber);
        this.calculateMaxHandleFromPositionAfterSliderOnDown(pageAxis1);
      }
      else if (isClickBehindOfHandleFrom) {
        this.handleFromPosition -= handleFromStepsNumber * this.stepLength;

        this.calculateTooltipFromValueAfterSliderOnDownBehind(handleFromStepsNumber);
        this.calculateMinHandleFromPositionAfterSliderOnDown(pageAxis1);
      }
    }
    else {
      if (isClickForHandleFrom) {
        this.handleFromPosition = pageAxis1 - this.sliderPosition - this.handleLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.restrictHandleFromPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  private alignHandleFromWithHandleToАfterApproaching = (): void => {
    const isHandleFromNearHandleTo: boolean = this.isInterval && Math.round(this.handleToPosition - this.handleFromPosition) <= Math.round(this.stepLength);
    
    if (isHandleFromNearHandleTo) {
      this.handleFromPosition = this.handleToPosition;
      this.calculateMaxTooltipFromValue(this.tooltipToValue);
    }
  }

  private calculateMinHandleFromPositionAfterSliderOnDown = (pageAxis: number): void => {
    if (!this.isStepSet) return;

    const isClickNearMinimum: boolean = pageAxis - this.sliderPosition < this.stepLength/2;

    if (isClickNearMinimum) {
      this.handleFromPosition = 0 - this.handleLength/2;
      this.calculateMinTooltipFromValue();
    }
  }

  private calculateMaxHandleFromPositionAfterSliderOnDown = (pageAxis: number): void => {
    if (!this.isStepSet) return;
    
    const isClickNearMaximumWithoutInterval: boolean = this.sliderLength - (pageAxis - this.sliderPosition) < this.stepLength/2 && !this.isInterval;
    
    if (isClickNearMaximumWithoutInterval) {
      this.handleFromPosition = this.sliderLength - this.handleLength/2;
      this.calculateMaxTooltipFromValue(this.maxValue);
    }
  }

  public calculateHandleFromPositionAfterMinValueOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;

    if (isWrongMouseButtonPressed) return;  

    this.handleFromPosition = 0 - this.handleLength/2;

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.calculateMinTooltipFromValue();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateHandleFromPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;
    const isWrongButtonPressedOrInterval: boolean = isWrongMouseButtonPressed || this.isInterval;

    if (isWrongButtonPressedOrInterval) return;

    this.handleFromPosition = this.sliderLength - this.handleLength/2;

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.calculateMaxTooltipFromValue(this.maxValue);
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

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
    }
    else if (keyCodeToReduce.includes(event.keyCode)) {
      this.handleFromPosition -= movementLength;
      if (this.isStepSet) this.calculateTooltipFromValueWithStepBehind();
    }

    this.restrictHandleFromPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();
    this.setConfigToLocalStorage();
    
    this.observer.notifyObservers(this.getOptions());
  }


  private restrictHandleFromPosition = (): void => {
    const isHandleFromPositionLessThanMinimum: boolean = this.handleFromPosition < 0 - this.handleLength/2;
    const isHandleFromPositionMoreThanMaximum: boolean = this.handleFromPosition > this.sliderLength - this.handleLength/2;
    const isHandleFromPositionMoreThanHandleToPosition: boolean = this.isInterval && this.handleFromPosition > this.handleToPosition;

    if (isHandleFromPositionLessThanMinimum) {
      this.handleFromPosition = 0 - this.handleLength/2;
    }
    else if (isHandleFromPositionMoreThanMaximum) {
      this.handleFromPosition = this.sliderLength - this.handleLength/2;
    }
    if (isHandleFromPositionMoreThanHandleToPosition) {
      this.handleFromPosition = this.handleToPosition;
    }
  }

  public calculateShiftAxis2 = (event: JQuery.TriggeredEvent): number | void => {
    event.stopPropagation();

    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;
    const isWrongButtonPressedOrSingleHandle: boolean = isWrongMouseButtonPressed || !this.isInterval;

    if (isWrongButtonPressedOrSingleHandle) return;

    let shiftX2: number = 0
    let shiftY2: number = 0;
    
    if (event.pageX !== undefined) {
      shiftX2 = event.pageX - this.handleToPosition - this.sliderPosition;
    }
    
    if (event.pageY !== undefined) {
      shiftY2 = event.pageY - this.handleToPosition - this.sliderPosition;
    }

    const shiftAxis2: number = this.isVertical ? shiftY2 : shiftX2;

    return shiftAxis2;
  }

  public calculateHandleToPositionWhileMoving = (event: JQuery.TriggeredEvent, shiftAxis2: number): void => {
    event.preventDefault();
    
    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;
    const isWrongButtonPressedOrSingleHandle: boolean = isWrongMouseButtonPressed || !this.isInterval;

    if (isWrongButtonPressedOrSingleHandle) return;

    let pageX2: number = 0
    let pageY2: number = 0;
    
    if (event.pageX !== undefined) {
      pageX2 = event.pageX;
    }
    
    if (event.pageY !== undefined) {
      pageY2 = event.pageY;
    }

    const pageAxis2: number = this.isVertical ? pageY2 : pageX2;

    if (this.isStepSet) {
      this.calculateHandleToPositionWithSetStep(pageAxis2);
    }
    else {
      this.handleToPosition = pageAxis2 - shiftAxis2 - this.sliderPosition;
      this.calculateTooltipsValues();
      this.restrictTooltipToValue();
    }

    this.restrictHandleToPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateHandleToPositionWithSetStep = (pageAxis: number): void => {
    const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

    if (!isIntervalAndStep) return;

    const isCursorNearStepAhead: boolean = pageAxis - this.sliderPosition > this.handleToPosition + this.handleLength/2 + this.stepLength/2;
    const isCursorNearStepBehind: boolean = pageAxis - this.sliderPosition < this.handleToPosition  + this.handleLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.handleToPosition += this.stepLength;
      this.calculateTooltipToValueWithStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.handleToPosition -= this.stepLength;
      this.calculateTooltipToValueWithStepBehind();
    }
  }

  public calculateHandleToPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent): void => {
    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;
    const isWrongButtonPressedOrSingleHandle: boolean = isWrongMouseButtonPressed || !this.isInterval;

    if (isWrongButtonPressedOrSingleHandle) return;

    let pageX2: number = 0
    let pageY2: number = 0;

    if (event.pageX !== undefined) {
      pageX2 = event.pageX;
    }
    
    if (event.pageY !== undefined) {
      pageY2 = event.pageY;
    }

    const pageAxis2: number = this.isVertical ? pageY2 : pageX2;
    const intervalForHandleToSteps: number = this.handleToPosition + this.handleLength/2 - (pageAxis2 - this.sliderPosition);
    let handleToStepsNumber: number = Math.round(intervalForHandleToSteps/this.stepLength);

    handleToStepsNumber = handleToStepsNumber < 0 ? -handleToStepsNumber : handleToStepsNumber;

    const isClickAheadOfHandleTo: boolean = pageAxis2 - this.sliderPosition > this.handleToPosition + this.handleLength;
    const isClickBehindOfHandleTo: boolean = pageAxis2 - this.sliderPosition < this.handleToPosition && pageAxis2 - this.sliderPosition >= this.handleFromPosition + this.handleLength + (this.handleToPosition - this.handleFromPosition - this.handleLength)/2;
    const isClickForHandleTo: boolean = isClickAheadOfHandleTo || isClickBehindOfHandleTo;

    if (this.isStepSet) {
      if (isClickAheadOfHandleTo) {
        this.handleToPosition += handleToStepsNumber * this.stepLength;

        this.calculateTooltipToValueAfterSliderOnDownAhead(handleToStepsNumber);
        this.calculateMaxHandleToPositionAfterSliderOnDown(pageAxis2);
      }
      else if (isClickBehindOfHandleTo) {
        this.alignHandleToWithHandleFromАfterApproaching();

        this.handleToPosition -= handleToStepsNumber * this.stepLength;

        this.calculateTooltipToValueAfterSliderOnDownBehind(handleToStepsNumber);
      }
    }
    else {
      if (isClickForHandleTo) {
        this.handleToPosition = pageAxis2 - this.sliderPosition - this.handleLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.restrictHandleToPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  private alignHandleToWithHandleFromАfterApproaching = (): void => {
    const isHandleFromNearHandleTo: boolean = this.isInterval && Math.round(this.handleToPosition - this.handleFromPosition) <= Math.round(this.stepLength);

    if (isHandleFromNearHandleTo) {
      this.handleToPosition = this.handleFromPosition;
      this.calculateMinTooltipToValue();
    }
  }

  private calculateMaxHandleToPositionAfterSliderOnDown = (pageAxis: number): void => {
    const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

    if (!isIntervalAndStep) return;

    const isClickNearMaximum: boolean = this.sliderLength - (pageAxis - this.sliderPosition) < this.stepLength/2;

    if (isClickNearMaximum) {
        this.handleToPosition = this.sliderLength - this.handleLength/2;
        this.calculateMaxTooltipToValue();
    }
  }

  public calculateHandleToPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();

    if (!this.isInterval) return;

    this.handleToPosition = this.sliderLength - this.handleLength/2;

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.calculateMaxTooltipToValue();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateHandleToPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    const isKeyboardAndInterval: boolean = this.keyboard && this.isInterval;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    const isKeyboardOrWrongKeyCode: boolean = !isKeyboardAndInterval || !keyCodes.includes(event.keyCode);

    if (isKeyboardOrWrongKeyCode) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.handleToPosition += movementLength;
      if (this.isStepSet) this.calculateTooltipToValueWithStepAhead();
    }
    else if (keyCodeToReduce.includes(event.keyCode)) {
      this.handleToPosition -= movementLength;
      if (this.isStepSet) this.calculateTooltipToValueWithStepBehind();
    }

    this.restrictHandleToPosition();
    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  private restrictHandleToPosition = (): void => {
    const isHandleFromPositionLessThanHandleToPosition: boolean = this.handleToPosition < this.handleFromPosition;
    const isHandleToPositionMoreThanMaximum: boolean = this.handleToPosition > this.sliderLength - this.handleLength/2;

    if (isHandleFromPositionLessThanHandleToPosition) {
      this.handleToPosition = this.handleFromPosition;
    }
    else if (isHandleToPositionMoreThanMaximum) {
      this.handleToPosition = this.sliderLength - this.handleLength/2;
    }
  }

  public calculateHandlePositionAfterScaleOnDown = (event: JQuery.TriggeredEvent, scaleOptions: {isScaleElementOnDown: boolean, scaleElementPosition: number, scaleElementLength: number, scaleElementValue: string}): void => {
    event.stopPropagation();
 
    const isWrongMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons !== 1;
    const isWrongMouseButtonPressedOrWrongElementOnDown: boolean = isWrongMouseButtonPressed || !scaleOptions.isScaleElementOnDown;
    
    if (isWrongMouseButtonPressedOrWrongElementOnDown) return;   

    let pageX1: number = 0
    let pageY1: number = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }
    
    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    const isClickAheadOfHandleFromWithInterval: boolean = pageAxis1 - this.sliderPosition > this.handleFromPosition + this.handleLength && pageAxis1 - this.sliderPosition < this.handleFromPosition + this.handleLength + (this.handleToPosition - this.handleFromPosition)/2;
    const isClickAheadOfHandleFromWithoutInterval: boolean = pageAxis1 - this.sliderPosition > this.handleFromPosition + this.handleLength;

    const isClickAheadOfHandleFrom: boolean = this.isInterval ? isClickAheadOfHandleFromWithInterval : isClickAheadOfHandleFromWithoutInterval;
    const isClickBehindOfHandleFrom: boolean = pageAxis1 - this.sliderPosition < this.handleFromPosition;
    const isClickAheadOfHandleTo: boolean = pageAxis1 - this.sliderPosition > this.handleToPosition + this.handleLength;
    const isClickBehindOfHandleTo: boolean = pageAxis1 - this.sliderPosition < this.handleToPosition && pageAxis1 - this.sliderPosition >= this.handleFromPosition + this.handleLength + (this.handleToPosition - this.handleFromPosition)/2;
    const isClickForHandleFrom: boolean = isClickAheadOfHandleFrom || isClickBehindOfHandleFrom;
    const isClickForHandleTo: boolean = isClickAheadOfHandleTo || isClickBehindOfHandleTo;

    if (isClickForHandleFrom) {
      this.handleFromPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength/2 - this.handleLength/2;
      this.calculateTooltipFromValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }
    else if (isClickForHandleTo) {
      this.handleToPosition = scaleOptions.scaleElementPosition + scaleOptions.scaleElementLength/2 - this.handleLength/2;
      this.calculateTooltipToValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }

    this.calculateRangePosition();
    this.calculateRangeLength();
    this.calculateTooltipsPositions();
    this.setConfigToLocalStorage();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculatePanelPosition = (): void => {
    const maxWidth: number = Math.max(this.minValueWidth, this.maxValueWidth);
    
    if (this.isVertical) {
      this.panelPosition = maxWidth + this.handleLength;
    }
    else {
      this.panelPosition = this.scaleElementHeight + this.handleLength;
    }
  }

  private countNumberOfCharactersAfterDot = (): void => {
    const minValuesBeforeAndAfterDot: string[] = `${this.minValue}`.split('.');
    const maxValuesBeforeAndAfterDot: string[] = `${this.maxValue}`.split('.');

    let minValuesAfterDot: string = minValuesBeforeAndAfterDot[1];
    let maxValuesAfterDot: string = maxValuesBeforeAndAfterDot[1];
    
    if (minValuesAfterDot === undefined) minValuesAfterDot = '';
    if (maxValuesAfterDot === undefined) maxValuesAfterDot = '';

    this.numberOfCharactersAfterDot = minValuesAfterDot.length > maxValuesAfterDot.length  ? minValuesAfterDot.length  : maxValuesAfterDot.length;
  }

  private calculateRangePosition = (): void => {
    this.rangePosition = 0;

    if (!this.isInterval) return;
    
    this.rangePosition = this.handleFromPosition + this.handleLength/2;
  }

  private calculateRangeLength = (): void => {
    this.rangeLength = this.handleFromPosition + this.handleLength/2;

    if (!this.isInterval) return;
      
    this.rangeLength = this.handleToPosition - this.handleFromPosition;
  }

  private calculateTooltipsPositions = (): void => {
    this.tooltipFromPosition = this.handleFromPosition + this.handleLength/2 - this.tooltipFromLength/2;

    if (this.isInterval) {
      this.tooltipToPosition = this.handleToPosition + this.handleLength/2 - this.tooltipToLength/2;
    }

    this.separateTooltips();
    this.showMinAndMaxValuesAfterContactWithTooltip();
  }

  private calculateInitialTooltipsValues = (): void => {
    this.tooltipFromValue = this.from;
    this.tooltipToValue = this.to;
  }
  
  private calculateTooltipsValues = (): void => {
    this.from = parseFloat(((this.handleFromPosition + this.handleLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;

    this.restrictTooltipFromValue();

    if (!this.isInterval) return;
    
    this.to = parseFloat(((this.handleToPosition + this.handleLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;

    this.restrictTooltipToValue();
  }

  private calculateTooltipFromValueAfterScaleOnDown = (value: number): void => {
    this.from = value;
    this.tooltipFromValue = this.from;
  }

  private calculateTooltipToValueAfterScaleOnDown = (value: number): void => {
    this.to = value;
    this.tooltipToValue = this.to;
  }

  private calculateTooltipFromValueAfterSliderOnDownAhead = (stepNumber: number): void => {
    this.from = parseFloat((this.from + (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));   
    this.tooltipFromValue = this.from;
  }

  private calculateTooltipFromValueAfterSliderOnDownBehind = (stepNumber: number): void => {
    this.from = parseFloat((this.from - (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;
  }

  private calculateTooltipToValueAfterSliderOnDownAhead = (stepNumber: number): void => {
    this.to = parseFloat((this.to + (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;
  }

  private calculateTooltipToValueAfterSliderOnDownBehind = (stepNumber: number): void => {
    this.to = parseFloat((this.to - (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;
  }

  private calculateTooltipFromValueWithStepAhead = (): void => {
    this.from = parseFloat((this.from + this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;

    this.restrictTooltipFromValue();
  }

  private calculateTooltipFromValueWithStepBehind = (): void => {
    this.from = parseFloat((this.from - this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipFromValue = this.from;

    this.restrictTooltipFromValue();
  }

  private calculateTooltipToValueWithStepAhead = (): void => {
    this.to = parseFloat((this.to + this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;

    this.restrictTooltipToValue();
  }

  private calculateTooltipToValueWithStepBehind = (): void => {
    this.to = parseFloat((this.to - this.step).toFixed(this.numberOfCharactersAfterDot));
    this.tooltipToValue = this.to;

    this.restrictTooltipToValue();
  }

  private calculateMinTooltipFromValue = (): void => {
    this.from = this.minValue;
    this.tooltipFromValue = this.from;
  }

  private calculateMaxTooltipFromValue = (value: number): void => {
    this.from = value;
    this.tooltipFromValue = this.from;       
  }

  private restrictTooltipFromValue = (): void => {
    const isFromLessThanMinimum: boolean = this.from < this.minValue;
    const isIntervalAndFromMoreThanTo: boolean = this.isInterval && this.from > this.to;
    const isFromMoreThanMaximum: boolean = this.from > this.maxValue;

    if (isFromLessThanMinimum) {
      this.from = this.minValue;
    }
    else if (isIntervalAndFromMoreThanTo) {
      this.from = this.to;
    }
    else if (isFromMoreThanMaximum) {
      this.from = this.maxValue;
    }

    this.tooltipFromValue = this.from; 
  }

  private calculateMinTooltipToValue = (): void => {
    this.to = this.from;

    this.tooltipToValue = this.to;
  }

  private calculateMaxTooltipToValue = (): void => {
    this.to = this.maxValue;

    this.tooltipToValue = this.to;
  }

  private restrictTooltipToValue = (): void => {
    const isToLessThanFrom: boolean = this.to < this.from;
    const isToMoreThanMaximum: boolean = this.to > this.maxValue;

    if (isToLessThanFrom) {
      this.to = this.from;
    }
    else if (isToMoreThanMaximum) {
      this.to = this.maxValue;
    }

    this.tooltipToValue = this.to;
  }

  private separateTooltips = (): void => {
    const areTooltipsClose: boolean = this.tooltipFromPosition + this.tooltipFromLength > this.tooltipToPosition;
    const areTooltipsCloseOrSingleHandle: boolean = !areTooltipsClose || !this.isInterval;
    
    if (areTooltipsCloseOrSingleHandle) return;
      
    this.tooltipFromPosition = this.handleFromPosition - this.tooltipFromLength;
    this.tooltipToPosition = this.handleToPosition + this.handleLength;
  }

  private calculateMinAndMaxPositions = (): void => {
    this.minValuePosition = 0;
    this.maxValuePosition = this.sliderLength - this.maxValueLength;
  }

  private showMinAndMaxValuesAfterContactWithTooltip = (): void => {
    this.isMinValueShow = true;
    this.isMaxValueShow = true;

    const isTooltipFromTouchesMinValue: boolean = this.tooltipFromPosition < this.minValuePosition + this.minValueLength;
    const isTooltipFromTouchesMaxValue: boolean = this.tooltipFromPosition + this.tooltipFromLength > this.maxValuePosition;
    const isTooltipToTouchesMaxValue: boolean = this.isInterval && this.tooltipToPosition + this.tooltipToLength > this.maxValuePosition;

    if (isTooltipFromTouchesMinValue) {
      this.isMinValueShow = false;
    }

    if (isTooltipToTouchesMaxValue) {
      this.isMaxValueShow = false;
    }
    else if (isTooltipFromTouchesMaxValue) {
      this.isMaxValueShow = false;
    }       
  }

  private calculateScaleElementsValues = (): void => {
    this.scaleElements.length = 0;

    let minScaleElementValue: number = parseFloat(this.minValue.toFixed(this.numberOfCharactersAfterDot));
    const intervalForScaleElements: number = (this.maxValue - this.minValue)/(this.scaleNumber - 1);

    this.scaleElements.push(minScaleElementValue);
    
    for (let i = 0; i < this.scaleNumber - 1; i++) {
      const scaleElementValue: number = parseFloat((minScaleElementValue += intervalForScaleElements).toFixed(this.numberOfCharactersAfterDot));

      this.scaleElements.push(scaleElementValue);
    }
  }

  private calculateLengthBetweenScaleElements = (): void => {
    this.lengthBetweenScaleElements = this.sliderLength/(this.scaleNumber - 1);
  }

  private calculateScaleElementsNumber = (): void => {
    if (this.userConfig?.scaleNumber) return;

    const isDifferenceBetweenMaxAndMinValuesLessOrEqualToOne: boolean = this.maxValue - this.minValue <= 1 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxAndMinValuesLessOrEqualToTwo: boolean = this.maxValue - this.minValue <= 2 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxAndMinValuesLessOrEqualToFour: boolean = this.maxValue - this.minValue <= 4 && this.numberOfCharactersAfterDot === 0;
    const isDifferenceBetweenMaxAndMinValuesLessThanTen: boolean = this.maxValue - this.minValue < 10;
    const isMinValueNegativeAndMaxValuePositive: boolean = this.minValue < 0 && this.maxValue > 0;

    if (isDifferenceBetweenMaxAndMinValuesLessOrEqualToOne) {
      this.scaleNumber = 2;
    }
    else if (isDifferenceBetweenMaxAndMinValuesLessOrEqualToTwo) {
      this.scaleNumber = 3;
    }
    else if (isDifferenceBetweenMaxAndMinValuesLessOrEqualToFour) {
      this.scaleNumber = 4;
    }
    else if (isDifferenceBetweenMaxAndMinValuesLessThanTen) {
      this.scaleNumber = 5;
    }
    else if (isMinValueNegativeAndMaxValuePositive) {
      this.scaleNumber = 11;
    }
    else {
      this.scaleNumber = 6;
    }
  }
}
