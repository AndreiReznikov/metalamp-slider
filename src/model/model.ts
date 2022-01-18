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
  data: Config;
  config: Config;

  isInterval: boolean = false;
  isVertical: boolean = false;
  isPanel: boolean = false;
  isTooltip: boolean = true;
  isRangeBetween: boolean = true;
  isScale: boolean = true;
  positionParameter: string = this.isVertical ? 'top' : 'left';
  lengthParameter: string = this.isVertical ? 'height' : 'width';
  isMinAndMax: boolean = true;
  minValue: number = 0;
  maxValue: number = 100;
  step: number = 0;
  from: number = 20;
  to: number = 50;
  scalePositionParameter: string = this.isVertical ? 'right' : 'top';
  scaleNumber: number = 5;
  isStepSet: boolean = false;
  sliderPosition: number = 0;
  sliderLength: number = 0;
  buttonLength: number = 0;
  isMinValueShow: boolean = true;
  isMaxValueShow: boolean = true;
  minValuePosition: number = 0;
  maxValuePosition: number = 0;
  minValueLength: number = 0;
  maxValueLength: number = 0;
  firstTooltipLength: number = 0;
  secondTooltipLength: number = 0;
  stepLength: number = 0;
  firstButtonPosition: number = 0;
  secondButtonPosition: number = 0;
  firstTooltipPosition: number = 0;
  secondTooltipPosition: number = 0;
  firstTooltipValue: number = 0;
  secondTooltipValue: number = 0;
  rangeBetweenPosition: number = 0;
  rangeBetweenLength: number = 0;
  scaleElements: number[] = [];
  lengthBetweenScaleElements: number = 0;
  numberOfCharactersAfterDot: number = 0;

  constructor(userConfig: UserConfig) {
    this.observer = new Observer();
    
    this.userConfig = userConfig;
    
    this.data = {
      isInterval: false,
      isVertical: false,
      isTooltip: true,
      isMinAndMax: true,
      isRangeBetween: true,
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
    
    this.config = $.extend({}, this.data, this.userConfig);
    
    this.isInterval = this.config.isInterval;
    this.isVertical = this.config.isVertical;
    this.isPanel = this.config.isPanel;
    this.isTooltip = this.config.isTooltip;
    this.isMinAndMax = this.config.isMinAndMax;
    this.isRangeBetween = this.config.isRangeBetween;
    this.isScale = this.config.isScale;
    this.positionParameter = this.isVertical ? 'top' : 'left';
    this.lengthParameter = this.isVertical ? 'height' : 'width';
    this.minValue = this.config.minValue;
    this.maxValue = this.config.maxValue;
    this.step = this.config.step;
    this.from = this.config.from;
    this.to = this.config.to;
    this.scalePositionParameter = this.isVertical ? 'right' : 'top';
    this.scaleNumber = this.config.scaleNumber;
  }

  public calculateInitialValues = (): void => {
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
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
    this.buttonLength = elementsParameters.buttonLength;
    this.firstTooltipLength = elementsParameters.firstTooltipLength;
    this.secondTooltipLength = elementsParameters.secondTooltipLength;
    this.minValueLength = elementsParameters.minValueLength;
    this.maxValueLength = elementsParameters.maxValueLength;
  }

  public calculateStepLength = (): void => {
    this.stepLength = parseFloat(((this.step/(this.maxValue - this.minValue)) * this.sliderLength).toFixed(this.numberOfCharactersAfterDot));
  }

  public getState = (): State => {
    const state: State = {
      isInterval: this.isInterval,
      isTooltip: this.isTooltip,
      isMinAndMax: this.isMinAndMax, 
      isRangeBetween: this.isRangeBetween, 
      isScale: this.isScale,
      isVertical: this.isVertical,
      isPanel: this.isPanel
    }

    return state;
  }

  public getOptions = (): Options => {
    const options: Options = {
      positionParameter: this.positionParameter,
      lengthParameter: this.lengthParameter,
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      buttonLength: this.buttonLength,
      stepLength: this.stepLength,
      minValue: this.minValue,
      maxValue: this.maxValue,
      isMinValueShow: this.isMinValueShow,
      isMaxValueShow: this.isMaxValueShow,
      minValuePosition: this.minValuePosition,
      maxValuePosition: this.maxValuePosition,
      minValueLength: this.minValueLength,
      maxValueLength: this.maxValueLength,
      firstButtonPosition: this.firstButtonPosition,
      secondButtonPosition: this.secondButtonPosition,
      firstTooltipPosition: this.firstTooltipPosition,
      secondTooltipPosition: this.secondTooltipPosition,
      firstTooltipValue: this.firstTooltipValue,
      secondTooltipValue: this.secondTooltipValue,
      rangeBetweenPosition: this.rangeBetweenPosition,
      rangeBetweenLength: this.rangeBetweenLength,
      scalePositionParameter: this.scalePositionParameter,
      scaleNumber: this.scaleNumber,
      scaleElements: this.scaleElements,
      lengthBetweenScaleElements: this.lengthBetweenScaleElements
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

  public calculateInitialButtonsPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);
    
    this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);
    this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.buttonLength/2);

    this.restrictFirstButtonPosition();
    this.restrictFirstTooltipValue();
    this.restrictSecondButtonPosition();
    this.restrictSecondTooltipValue();
  }

  public calculateInitialFirstButtonPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const fromRatio: number = this.from/(this.maxValue - this.minValue);
    
    this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);

    this.restrictFirstButtonPosition();
    this.restrictFirstTooltipValue();
  }

  public calculateInitialSecondButtonPosition = (): void => {
    const minRatio: number = this.minValue/(this.maxValue - this.minValue);
    const toRatio: number = this.to/(this.maxValue - this.minValue);

    this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength - this.buttonLength/2);

    this.restrictSecondButtonPosition();
    this.restrictSecondTooltipValue();
  }

  public calculateShiftAxis1 = (event: PointerEvent): number | undefined => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;

    if (!isLeftMouseButtonPressed) return;

    event.stopPropagation();

    const shiftX1: number = event.pageX - this.firstButtonPosition - this.sliderPosition;
    const shiftY1: number = event.pageY - this.firstButtonPosition - this.sliderPosition;
    const shiftAxis1: number = this.isVertical ? shiftY1 : shiftX1;

    return shiftAxis1;
  }

  public calculateFirstButtonPositionWhileMoving = (event: PointerEvent, shiftAxis1: number): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;

    if (!isLeftMouseButtonPressed) return;

    const pageX1: number = event.pageX;
    const pageY1: number = event.pageY;
    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    if (this.isStepSet) {
      this.calculateFirstButtonPositionWithSetStep(pageAxis1);
    }
    else {
      this.firstButtonPosition = pageAxis1 - shiftAxis1 - this.sliderPosition;
      this.calculateTooltipsValues();
      this.restrictFirstTooltipValue();
    }

    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateFirstButtonPositionWithSetStep = (pageAxis: number): void => {
    if (!this.isStepSet) return;

    const isCursorNearStepAhead: boolean = pageAxis - this.sliderPosition > this.firstButtonPosition + this.buttonLength/2 + this.stepLength/2;
    const isCursorNearStepBehind: boolean = pageAxis - this.sliderPosition < this.firstButtonPosition  + this.buttonLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.firstButtonPosition += this.stepLength;
      this.calculateFirstTooltipValueWithStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.firstButtonPosition -= this.stepLength;
      this.calculateFirstTooltipValueWithStepBehind();
    }
  }

  public calculateFirstButtonPositionAfterSliderOnDown = (event: PointerEvent): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;

    if (!isLeftMouseButtonPressed) return;

    const pageX1: number = event.pageX;
    const pageY1: number = event.pageY;
    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;
    const intervalForFirstButtonSteps: number = this.firstButtonPosition + this.buttonLength/2 - (pageAxis1 - this.sliderPosition);
    let firstButtonStepsNumber: number = Math.round(intervalForFirstButtonSteps/this.stepLength);

    firstButtonStepsNumber = firstButtonStepsNumber < 0 ? -firstButtonStepsNumber : firstButtonStepsNumber;

    const isClickAheadOfFirstButtonWithInterval: boolean = pageAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && pageAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition - this.buttonLength)/2;  
    const isClickAheadOfFirstButtonWithoutInterval: boolean = pageAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

    const isClickAheadOfFirstButton: boolean = this.isInterval ? isClickAheadOfFirstButtonWithInterval : isClickAheadOfFirstButtonWithoutInterval;
    const isClickBehindOfFirstButton: boolean = pageAxis1 - this.sliderPosition < this.firstButtonPosition;
    const isClickForFirstButton: boolean = isClickAheadOfFirstButton || isClickBehindOfFirstButton;

    if (this.isStepSet) {
      if (isClickAheadOfFirstButton) {
        this.alignFirstButtonWithSecondButtonАfterApproaching();

        this.firstButtonPosition += firstButtonStepsNumber * this.stepLength;

        this.calculateFirstTooltipValueAfterSliderOnDownAhead(firstButtonStepsNumber);
        this.calculateMaxFirstButtonPositionAfterSliderOnDown(pageAxis1);
      }
      else if (isClickBehindOfFirstButton) {
        this.firstButtonPosition -= firstButtonStepsNumber * this.stepLength;

        this.calculateFirstTooltipValueAfterSliderOnDownBehind(firstButtonStepsNumber);
        this.calculateMinFirstButtonPositionAfterSliderOnDown(pageAxis1);
      }
    }
    else {
      if (isClickForFirstButton) {
        this.firstButtonPosition = pageAxis1 - this.sliderPosition - this.buttonLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private alignFirstButtonWithSecondButtonАfterApproaching = (): void => {
    const isFirstButtonNearSecondButton: boolean = this.isInterval && Math.round(this.secondButtonPosition - this.firstButtonPosition) <= Math.round(this.stepLength);
    
    if (isFirstButtonNearSecondButton) {
      this.firstButtonPosition = this.secondButtonPosition;
      this.calculateMaxFirstTooltipValue(this.secondTooltipValue);
    }
  }

  private calculateMinFirstButtonPositionAfterSliderOnDown = (pageAxis: number): void => {
    if (!this.isStepSet) return;

    const isClickNearMinimum: boolean = pageAxis - this.sliderPosition < this.stepLength/2;

    if (isClickNearMinimum) {
      this.firstButtonPosition = 0 - this.buttonLength/2;
      this.calculateMinFirstTooltipValue();
    }
  }

  private calculateMaxFirstButtonPositionAfterSliderOnDown = (pageAxis: number): void => {
    if (!this.isStepSet) return;
    
    const isClickNearMaximumWithoutInterval: boolean = this.sliderLength - (pageAxis - this.sliderPosition) < this.stepLength/2 && !this.isInterval;
    
    if (isClickNearMaximumWithoutInterval) {
      this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
      this.calculateMaxFirstTooltipValue(this.maxValue);
    }
  }

  public calculateFirstButtonPositionAfterMinValueOnDown = (event: PointerEvent): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;

    if (!isLeftMouseButtonPressed) return;
    event.stopPropagation();

    this.firstButtonPosition = 0 - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMinFirstTooltipValue();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateFirstButtonPositionAfterMaxValueOnDown = (event: PointerEvent): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;
    const isWrongButtonPressedAndInterval: boolean = !isLeftMouseButtonPressed || this.isInterval;

    if (isWrongButtonPressedAndInterval) return;

    event.stopPropagation();

    this.firstButtonPosition = this.sliderLength - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMaxFirstTooltipValue(this.maxValue);

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateFirstButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    if (!this.config.keyboard) return;

    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    if (!keyCodes.includes(event.keyCode)) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.firstButtonPosition += movementLength;
      if (this.isStepSet) this.calculateFirstTooltipValueWithStepAhead();
    }
    else if (keyCodeToReduce.includes(event.keyCode)) {
      this.firstButtonPosition -= movementLength;
      if (this.isStepSet) this.calculateFirstTooltipValueWithStepBehind();
    }

    this.restrictFirstButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();
    
    this.observer.notifyObservers(this.getOptions());
  }


  private restrictFirstButtonPosition = (): void => {
    const isFirstButtonPositionLessThanMinimum: boolean = this.firstButtonPosition < 0 - this.buttonLength/2;
    const isFirstButtonPositionMoreThanMaximum: boolean = this.firstButtonPosition > this.sliderLength - this.buttonLength/2;
    const isFirstButtonPositionMoreThanSecondButtonPosition: boolean = this.isInterval && this.firstButtonPosition > this.secondButtonPosition;

    if (isFirstButtonPositionLessThanMinimum) {
      this.firstButtonPosition = 0 - this.buttonLength/2;
    }
    else if (isFirstButtonPositionMoreThanMaximum) {
      this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
    }
    if (isFirstButtonPositionMoreThanSecondButtonPosition) {
      this.firstButtonPosition = this.secondButtonPosition;
    }
  }

  public calculateShiftAxis2 = (event: PointerEvent): number | void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;
    const isWrongButtonPressedOrNotInterval: boolean = !isLeftMouseButtonPressed || !this.isInterval;

    if (isWrongButtonPressedOrNotInterval) return;

    event.stopPropagation();

    const shiftX2: number = event.pageX - this.secondButtonPosition - this.sliderPosition;
    const shiftY2: number = event.pageY - this.secondButtonPosition - this.sliderPosition;
    const shiftAxis2: number = this.isVertical ? shiftY2 : shiftX2;

    return shiftAxis2;
  }

  public calculateSecondButtonPositionWhileMoving = (event: PointerEvent, shiftAxis2: number): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;
    const isWrongButtonPressedOrNotInterval: boolean = !isLeftMouseButtonPressed || !this.isInterval;

    if (isWrongButtonPressedOrNotInterval) return;
    
    const pageX2: number = event.pageX;
    const pageY2: number = event.pageY;
    const pageAxis2: number = this.isVertical ? pageY2 : pageX2;

    if (this.isStepSet) {
      this.calculateSecondButtonPositionWithSetStep(pageAxis2);
    }
    else {
      this.secondButtonPosition = pageAxis2 - shiftAxis2 - this.sliderPosition;
      this.calculateTooltipsValues();
      this.restrictSecondTooltipValue();
    }

    this.restrictSecondButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private calculateSecondButtonPositionWithSetStep = (pageAxis: number): void => {
    const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

    if (!isIntervalAndStep) return;

    const isCursorNearStepAhead: boolean = pageAxis - this.sliderPosition > this.secondButtonPosition + this.buttonLength/2 + this.stepLength/2;
    const isCursorNearStepBehind: boolean = pageAxis - this.sliderPosition < this.secondButtonPosition  + this.buttonLength/2 - this.stepLength/2;

    if (isCursorNearStepAhead) {
      this.secondButtonPosition += this.stepLength;
      this.calculateSecondTooltipValueWithStepAhead();
    }
    else if (isCursorNearStepBehind) {
      this.secondButtonPosition -= this.stepLength;
      this.calculateSecondTooltipValueWithStepBehind();
    }
  }

  public calculateSecondButtonPositionAfterSliderOnDown = (event: PointerEvent): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;
    const isWrongButtonPressedOrNotInterval: boolean = !isLeftMouseButtonPressed || !this.isInterval;

    if (isWrongButtonPressedOrNotInterval) return;

    const pageX2: number = event.pageX;
    const pageY2: number = event.pageY;
    const pageAxis2: number = this.isVertical ? pageY2 : pageX2;
    const intervalForSecondButtonSteps: number = this.secondButtonPosition + this.buttonLength/2 - (pageAxis2 - this.sliderPosition);
    let secondButtonStepsNumber: number = Math.round(intervalForSecondButtonSteps/this.stepLength);

    secondButtonStepsNumber = secondButtonStepsNumber < 0 ? -secondButtonStepsNumber : secondButtonStepsNumber;

    const isClickAheadOfSecondButton: boolean = pageAxis2 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
    const isClickBehindOfSecondButton: boolean = pageAxis2 - this.sliderPosition < this.secondButtonPosition && pageAxis2 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition - this.buttonLength)/2;
    const isClickForSecondButton: boolean = isClickAheadOfSecondButton || isClickBehindOfSecondButton;

    if (this.isStepSet) {
      if (isClickAheadOfSecondButton) {
        this.secondButtonPosition += secondButtonStepsNumber * this.stepLength;

        this.calculateSecondTooltipValueAfterSliderOnDownAhead(secondButtonStepsNumber);
        this.calculateMaxSecondButtonPositionAfterSliderOnDown(pageAxis2);
      }
      else if (isClickBehindOfSecondButton) {
        this.alignSecondButtonWithFirstButtonАfterApproaching();

        this.secondButtonPosition -= secondButtonStepsNumber * this.stepLength;

        this.calculateSecondTooltipValueAfterSliderOnDownBehind(secondButtonStepsNumber);
      }
    }
    else {
      if (isClickForSecondButton) {
        this.secondButtonPosition = pageAxis2 - this.sliderPosition - this.buttonLength/2;
        this.calculateTooltipsValues();
      }
    }

    this.restrictSecondButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private alignSecondButtonWithFirstButtonАfterApproaching = (): void => {
    const isFirstButtonNearSecondButton: boolean = this.isInterval && Math.round(this.secondButtonPosition - this.firstButtonPosition) <= Math.round(this.stepLength);

    if (isFirstButtonNearSecondButton) {
      this.secondButtonPosition = this.firstButtonPosition;
      this.calculateMinSecondTooltipValue();
    }
  }

  private calculateMaxSecondButtonPositionAfterSliderOnDown = (pageAxis: number): void => {
    const isIntervalAndStep: boolean = this.isInterval && this.isStepSet;

    if (!isIntervalAndStep) return;

    const isClickNearMaximum: boolean = this.sliderLength - (pageAxis - this.sliderPosition) < this.stepLength/2;

    if (isClickNearMaximum) {
        this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
        this.calculateMaxSecondTooltipValue();
    }
  }

  public calculateSecondButtonPositionAfterMaxValueOnDown = (event: PointerEvent): void => {
    if (!this.isInterval) return;

    event.stopPropagation();

    this.secondButtonPosition = this.sliderLength - this.buttonLength/2;

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    this.calculateMaxSecondTooltipValue();

    this.observer.notifyObservers(this.getOptions());
  }

  public calculateSecondButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent): void => {
    const isKeyboardAndInterval: boolean = this.config.keyboard && this.isInterval;

    if (!isKeyboardAndInterval) return;
    
    const keyCodeToIncrease: number[] = this.isVertical ? [40, 83] : [39, 68];
    const keyCodeToReduce: number[] = this.isVertical ? [38, 87] : [37, 65];
    const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

    if (!keyCodes.includes(event.keyCode)) return;

    const movementLength: number = this.isStepSet ? this.stepLength : 1;

    if (keyCodeToIncrease.includes(event.keyCode)) {
      this.secondButtonPosition += movementLength;
      if (this.isStepSet) this.calculateSecondTooltipValueWithStepAhead();
    }
    else if (keyCodeToReduce.includes(event.keyCode)) {
      this.secondButtonPosition -= movementLength;
      if (this.isStepSet) this.calculateSecondTooltipValueWithStepBehind();
    }

    this.restrictSecondButtonPosition();
    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();
    if (!this.isStepSet) this.calculateTooltipsValues();

    this.observer.notifyObservers(this.getOptions());
  }

  private restrictSecondButtonPosition = (): void => {
    const isFirstButtonPositionLessThanSecondButtonPosition: boolean = this.secondButtonPosition < this.firstButtonPosition;
    const isSecondButtonPositionMoreThanMaximum: boolean = this.secondButtonPosition > this.sliderLength - this.buttonLength/2;

    if (isFirstButtonPositionLessThanSecondButtonPosition) {
      this.secondButtonPosition = this.firstButtonPosition;
    }
    else if (isSecondButtonPositionMoreThanMaximum) {
      this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
    }
  }

  public calculateButtonPositionAfterScaleOnDown = (event: PointerEvent, scaleOptions: {isScaleElementOnDown: boolean, scaleElementPosition: string, scaleElementLength: string, scaleElementValue: string}): void => {
    const isLeftMouseButtonPressed: boolean = event.pointerType === 'mouse' && event.buttons == 1;

    if (!isLeftMouseButtonPressed) return;
    event.stopPropagation();

    if (!scaleOptions.isScaleElementOnDown) return;

    const pageX1: number = event.pageX;
    const pageY1: number = event.pageY;
    const pageAxis1: number = this.isVertical ? pageY1 : pageX1;

    const isClickAheadOfFirstButtonWithInterval: boolean = pageAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && pageAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
    const isClickAheadOfFirstButtonWithoutInterval: boolean = pageAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

    const isClickAheadOfFirstButton: boolean = this.isInterval ? isClickAheadOfFirstButtonWithInterval : isClickAheadOfFirstButtonWithoutInterval;
    const isClickBehindOfFirstButton: boolean = pageAxis1 - this.sliderPosition < this.firstButtonPosition;
    const isClickAheadOfSecondButton: boolean = pageAxis1 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
    const isClickBehindOfSecondButton: boolean = pageAxis1 - this.sliderPosition < this.secondButtonPosition && pageAxis1 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
    const isClickForFirstButton: boolean = isClickAheadOfFirstButton || isClickBehindOfFirstButton;
    const isClickForSecondButton: boolean = isClickAheadOfSecondButton || isClickBehindOfSecondButton;

    if (isClickForFirstButton) {
      this.firstButtonPosition = parseInt(scaleOptions.scaleElementPosition) + parseInt(scaleOptions.scaleElementLength)/2 - this.buttonLength/2;
      this.calculateFirstTooltipValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }
    else if (isClickForSecondButton) {
      this.secondButtonPosition = parseInt(scaleOptions.scaleElementPosition) + parseInt(scaleOptions.scaleElementLength)/2 - this.buttonLength/2;
      this.calculateSecondTooltipValueAfterScaleOnDown(parseFloat(scaleOptions.scaleElementValue));
    }

    this.calculateRangeBetweenPosition();
    this.calculateRangeBetweenLength();
    this.calculateTooltipsPositions();

    this.observer.notifyObservers(this.getOptions());
  }

  private countNumberOfCharactersAfterDot= (): void => {
    const minValuesBeforeAndAfterDot: string[] = `${this.minValue}`.split('.');
    const maxValuesBeforeAndAfterDot: string[] = `${this.maxValue}`.split('.');

    let minValuesAfterDot: string = minValuesBeforeAndAfterDot[1];
    let maxValuesAfterDot: string = maxValuesBeforeAndAfterDot[1];
    
    if (minValuesAfterDot === undefined) minValuesAfterDot = '';
    if (maxValuesAfterDot === undefined) maxValuesAfterDot = '';

    this.numberOfCharactersAfterDot = minValuesAfterDot.length > maxValuesAfterDot.length  ? minValuesAfterDot.length  : maxValuesAfterDot.length;
  }

  private calculateRangeBetweenPosition = (): void => {
    this.rangeBetweenPosition = 0;

    if (!this.isInterval) return;
    
    this.rangeBetweenPosition = this.firstButtonPosition + this.buttonLength/2;
  }

  private calculateRangeBetweenLength = (): void => {
    this.rangeBetweenLength = this.firstButtonPosition + this.buttonLength/2;

    if (!this.isInterval) return;
      
    this.rangeBetweenLength = this.secondButtonPosition - this.firstButtonPosition;
  }

  private calculateTooltipsPositions = (): void => {
    this.firstTooltipPosition = this.firstButtonPosition + this.buttonLength/2 - this.firstTooltipLength/2;

    if (this.isInterval) {
      this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength/2 - this.secondTooltipLength/2;
    }

    this.separateTooltips();
    this.showMinAndMaxValuesAfterContactWithTooltip();
  }

  private calculateInitialTooltipsValues = (): void => {
    this.firstTooltipValue = this.from;
    this.secondTooltipValue = this.to;
  }
  
  private calculateTooltipsValues = (): void => {
    this.from = parseFloat(((this.firstButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfCharactersAfterDot));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();

    if (!this.isInterval) return;
    
    this.to = parseFloat(((this.secondButtonPosition + this.buttonLength/2)/this.sliderLength * (this.maxValue - this.minValue) + this.minValue).toFixed(this.numberOfCharactersAfterDot));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateFirstTooltipValueAfterScaleOnDown = (value: number): void => {
    this.from = value;
    this.firstTooltipValue = this.from;
  }

  private calculateSecondTooltipValueAfterScaleOnDown = (value: number): void => {
    this.to = value;
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueAfterSliderOnDownAhead = (stepNumber: number): void => {
    this.from = parseFloat((this.from + (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));   
    this.firstTooltipValue = this.from;
  }

  private calculateFirstTooltipValueAfterSliderOnDownBehind = (stepNumber: number): void => {
    this.from = parseFloat((this.from - (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.firstTooltipValue = this.from;
  }

  private calculateSecondTooltipValueAfterSliderOnDownAhead = (stepNumber: number): void => {
    this.to = parseFloat((this.to + (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.secondTooltipValue = this.to;
  }

  private calculateSecondTooltipValueAfterSliderOnDownBehind = (stepNumber: number): void => {
    this.to = parseFloat((this.to - (stepNumber * this.step)).toFixed(this.numberOfCharactersAfterDot));
    this.secondTooltipValue = this.to;
  }

  private calculateFirstTooltipValueWithStepAhead = (): void => {
    this.from = parseFloat((this.from + this.step).toFixed(this.numberOfCharactersAfterDot));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();
  }

  private calculateFirstTooltipValueWithStepBehind = (): void => {
    this.from = parseFloat((this.from - this.step).toFixed(this.numberOfCharactersAfterDot));
    this.firstTooltipValue = this.from;

    this.restrictFirstTooltipValue();
  }

  private calculateSecondTooltipValueWithStepAhead = (): void => {
    this.to = parseFloat((this.to + this.step).toFixed(this.numberOfCharactersAfterDot));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateSecondTooltipValueWithStepBehind = (): void => {
    this.to = parseFloat((this.to - this.step).toFixed(this.numberOfCharactersAfterDot));
    this.secondTooltipValue = this.to;

    this.restrictSecondTooltipValue();
  }

  private calculateMinFirstTooltipValue = (): void => {
    this.from = this.minValue;
    this.firstTooltipValue = this.from;
  }

  private calculateMaxFirstTooltipValue = (value: number): void => {
    this.from = value;
    this.firstTooltipValue = this.from;       
  }

  private restrictFirstTooltipValue = (): void => {
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

    this.firstTooltipValue = this.from; 
  }

  private calculateMinSecondTooltipValue = (): void => {
    this.to = this.from;

    this.secondTooltipValue = this.to;
  }

  private calculateMaxSecondTooltipValue = (): void => {
    this.to = this.maxValue;

    this.secondTooltipValue = this.to;
  }

  private restrictSecondTooltipValue = (): void => {
    const isToLessThanFrom: boolean = this.to < this.from;
    const isToMoreThanMaximum: boolean = this.to > this.maxValue;

    if (isToLessThanFrom) {
      this.to = this.from;
    }
    else if (isToMoreThanMaximum) {
      this.to = this.maxValue;
    }

    this.secondTooltipValue = this.to;
  }

  private separateTooltips = (): void => {
    if (!this.isInterval) return;

    const areTooltipsClose: boolean = this.firstTooltipPosition + this.firstTooltipLength > this.secondTooltipPosition;

    if (!areTooltipsClose) return;
      
    this.firstTooltipPosition = this.firstButtonPosition - this.firstTooltipLength;
    this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength;
  }

  private calculateMinAndMaxPositions = (): void => {
    this.minValuePosition = 0;
    this.maxValuePosition = this.sliderLength - this.maxValueLength;
  }

  private showMinAndMaxValuesAfterContactWithTooltip = (): void => {
    this.isMinValueShow = true;
    this.isMaxValueShow = true;

    const isFirstTooltipTouchesMinValue: boolean = this.firstTooltipPosition < this.minValuePosition + this.minValueLength;
    const isFirstTooltipTouchesMaxValue: boolean = this.firstTooltipPosition + this.firstTooltipLength > this.maxValuePosition;
    const isSecondTooltipTouchesMaxValue: boolean = this.isInterval && this.secondTooltipPosition + this.secondTooltipLength > this.maxValuePosition;

    if (isFirstTooltipTouchesMinValue) {
      this.isMinValueShow = false;
    }

    if (isSecondTooltipTouchesMaxValue) {
      this.isMaxValueShow = false;
    }
    else if (isFirstTooltipTouchesMaxValue) {
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
    if (this.userConfig.scaleNumber) return;

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
