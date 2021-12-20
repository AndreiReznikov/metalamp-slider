import { mode } from "../webpack.config";
import "./index.css";

(function($) {
  const mySlider = (input: JQuery<HTMLElement>, options: {}): JQuery => {

    const $this = input;

    interface Config {
      isInterval: boolean;
      minValue: number;
      maxValue: number;
      from: number;
      to: number;
      step: number;
      keyboard: boolean;
      isVertical: boolean;
      isTooltip: boolean;
      isMinAndMax: boolean;
      isRangeBetween: boolean;
      isScale: boolean;
      scaleNumbers: number;
    }

    interface InitialOptions {
      isInterval: boolean;
      isTooltip: boolean;
      isMinAndMax: boolean;
      isRangeBetween: boolean;
      isScale: boolean;
    }

    interface Options {
      positionParameter: string;
      lengthParameter: string;
      sliderPosition: number;
      sliderLength: number;
      buttonLength: number;
      stepLength: number;
      minValuePosition: number;
      maxValuePosition: number;
      minValue: number;
      maxValue: number;
      showMinValue: boolean;
      showMaxValue: boolean;
      minValueLength: number;
      maxValueLength: number;
      firstButtonPosition: number;
      secondButtonPosition: number;
      firstButtonGlobalPositon: number;
      secondButtonGlobalPositon: number;
      firstTooltipPosition: number;
      secondTooltipPosition: number;
      firstTooltipValue: number | string;
      secondTooltipValue: number | string;
      rangeBetweenPosition: number;
      rangeBetweenLength: number;
      scaleNumbers: number;
      scaleElements: number[];
      lengthBetweenScaleElements: number;
    }

    interface ElementsParameters {
      sliderPosition: number;
      sliderLength: number;
      buttonLength: number;
      firstTooltipLength: number;
      secondTooltipLength: number;
      minValueLength: number;
      maxValueLength: number;
    }

    class Observer {
      observers: Function[] = [];

      addObserver = (observer: Function) => {
        this.observers.push(observer);
      }

      notifyObservers = (options: Options) => {
        for (let i = 0; i < this.observers.length; i++) {
          this.observers[i](options);
        }
      }
    }
    
    class Model {
      
      data: Config = {
        isInterval: false,
        minValue: 0,
        maxValue: 100,
        from: 10,
        to: 50,
        step: 0,
        keyboard: false,
        isVertical: false,
        isTooltip: true,
        isMinAndMax: true,
        isRangeBetween: true,
        isScale: false,
        scaleNumbers: 5
      };

      config: Config = $.extend({}, this.data, options);

      positionParameter: string = this.config.isVertical ? 'top' : 'left';
      lengthParameter: string = this.config.isVertical ? 'height' : 'width';
      isStepSet: boolean = false;
      sliderPosition: number = 0;
      sliderLength: number = 0;
      buttonLength: number = 0;
      minValue = this.config.minValue;
      maxValue = this.config.maxValue;
      showMinValue: boolean = true;
      showMaxValue: boolean = true;
      minValuePosition = 0;
      maxValuePosition = 0;
      minValueLength = 0;
      maxValueLength = 0;
      firstTooltipLength: number = 0;
      secondTooltipLength: number = 0;
      stepLength: number = 0;
      firstButtonPosition: number = 0;
      secondButtonPosition: number = 0;
      firstButtonGlobalPosition: number = 0;
      secondButtonGlobalPosition: number = 0;
      firstTooltipPosition: number = 0;
      secondTooltipPosition: number = 0;
      firstTooltipValue: number | string = this.config.from;
      secondTooltipValue: number | string = this.config.to;
      rangeBetweenPosition: number = 0;
      rangeBetweenLength: number = 0;
      scaleNumbers: number = this.config.scaleNumbers;
      scaleElements: number[] = [];
      lengthBetweenScaleElements: number = 0;

      //Рефакторинг
      validateInitialValues = () => {
        const areMinAndMaxNegative: boolean = this.minValue < 0 && this.maxValue < 0;

        if (this.minValue > this.maxValue && !areMinAndMaxNegative) {
          this.minValue = this.data.minValue;
          this.maxValue = this.data.maxValue;
        }

        if (this.config.step > this.config.maxValue - this.config.minValue && !areMinAndMaxNegative) {
          this.config.step = 0;
        }

        if (areMinAndMaxNegative && this.config.step > -(this.config.minValue - this.config.maxValue)) {
          this.config.step = 0;
        }

        this.isStepSet = this.config.step > 0;

        if (this.config.from < this.config.minValue || this.config.from > this.config.maxValue) {
          this.config.from = this.config.minValue;
          this.firstTooltipValue = this.config.minValue;
        }

        if (this.config.to < this.config.minValue || this.config.to > this.config.maxValue) {
          this.config.to = this.config.maxValue;
          this.secondTooltipValue = this.config.maxValue;
        }

        if (this.config.from > this.config.to && this.config.isInterval) {
          this.config.from = this.config.to;
          this.firstTooltipValue = this.secondTooltipValue;
        }
      }

      setSliderElementsParameters = (elementsParameters: ElementsParameters) => {
        this.sliderPosition = elementsParameters.sliderPosition;
        this.sliderLength = elementsParameters.sliderLength;
        this.buttonLength = elementsParameters.buttonLength;
        this.firstTooltipLength = elementsParameters.firstTooltipLength;
        this.secondTooltipLength = elementsParameters.secondTooltipLength;
        this.minValueLength = elementsParameters.minValueLength;
        this.maxValueLength = elementsParameters.maxValueLength;
      }

      setButtonsGlobalPosition = (firstButtonGlobalPosition: number, secondButtonGlobalPosition: number) => {
        this.firstButtonGlobalPosition = firstButtonGlobalPosition;
        this.secondButtonGlobalPosition = secondButtonGlobalPosition;
      }

      calculateInitialButtonsPositon = () => {
        const minRatio: number = this.config.minValue/(this.config.maxValue - this.config.minValue);
        const fromRatio: number = this.config.from/(this.config.maxValue - this.config.minValue);
        const toRatio: number = this.config.to/(this.config.maxValue - this.config.minValue);
        
        this.firstButtonPosition = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);

        if (this.config.isInterval) {
          this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength -this.buttonLength/2);
        }
      }

      calculateFirstButtonPosition = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const shiftX1: number = event.clientX - this.firstButtonGlobalPosition - this.sliderPosition;
        const shiftY1: number = event.clientY - this.firstButtonGlobalPosition - this.sliderPosition;
        const shiftAxis1: number = this.config.isVertical ? shiftY1 : shiftX1;

        const calculateWhileFirstButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX1: number = event.clientX;
          const clientY1: number = event.clientY;
          const clientAxis1: number = this.config.isVertical ? clientY1 : clientX1;

          if (this.isStepSet) {
            this.calculateFirstButtonPositionWidthSetStep(clientAxis1);
          }
          else {
            this.firstButtonPosition = clientAxis1 - shiftAxis1 - this.sliderPosition;
            this.calculateTooltipsValues();
            this.restrictFirstTooltipValue();
          }

          this.restrictFirstButtonPosition();
          this.calculateRangeBetweenPosition();
          this.calculateRangeBetweenLength();
          this.calculateTooltipsPositions();

          observer.notifyObservers(this.getOptions());
        }

        $(document).on('mousemove', calculateWhileFirstButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileFirstButtonMoving));
      }

      calculateFirstButtonPositionWidthSetStep = (clientAxis: number) => {
        const isCursorNearStepAhead = clientAxis - this.sliderPosition > this.firstButtonPosition + this.buttonLength/2 + this.stepLength/2;
        const isCursorNearStepBehind = clientAxis - this.sliderPosition < this.firstButtonPosition  + this.buttonLength/2 - this.stepLength/2;

        if (isCursorNearStepAhead) {
          this.firstButtonPosition += this.stepLength;
          this.calculateFirstTooltipValueWidthStepAhead();
        }
        else if (isCursorNearStepBehind) {
          this.firstButtonPosition -= this.stepLength;
          this.calculateFirstTooltipValueWidthStepBehind();
        }
      }

      calculateFirstButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent) => {
        const clientX1: number = event.clientX;
        const clientY1: number = event.clientY;
        const clientAxis1: number = this.config.isVertical ? clientY1 : clientX1;
        const intervalForFirstButtonSteps = this.firstButtonPosition + this.buttonLength/2 - (clientAxis1 - this.sliderPosition);
        let firstButtonStepsNumber = Math.round(intervalForFirstButtonSteps/this.stepLength);

        firstButtonStepsNumber = firstButtonStepsNumber < 0 ? -firstButtonStepsNumber : firstButtonStepsNumber;

        const clickAheadOfFirstButtonWidthInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
        const clickAheadOfFirstButtonWidthoutInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

        const clickAheadOfFirstButton = this.config.isInterval ? clickAheadOfFirstButtonWidthInterval : clickAheadOfFirstButtonWidthoutInterval;
        const clickBehindOfFirstButton = clientAxis1 - this.sliderPosition < this.firstButtonPosition;

        if (this.isStepSet) {
          if (clickAheadOfFirstButton) {
            this.firstButtonPosition += firstButtonStepsNumber * this.stepLength;
            this.calculateFirstTooltipValueAfterSliderOnDownAhead(firstButtonStepsNumber);
          }
          else if (clickBehindOfFirstButton) {
            this.firstButtonPosition -= firstButtonStepsNumber * this.stepLength;
            this.calculateFirstTooltipValueAfterSliderOnDownBehind(firstButtonStepsNumber);
          }
        }
        else {
          if (clickAheadOfFirstButton || clickBehindOfFirstButton) {
            this.firstButtonPosition = clientAxis1 - this.sliderPosition - this.buttonLength/2;
            this.calculateTooltipsValues();
          }
        }

        this.calculateMinFirstButtonPositionAfterSliderOnDown(clickBehindOfFirstButton, clientAxis1);
        this.calculateMaxFirstButtonPositionAfterSliderOnDown(clickAheadOfFirstButton, clientAxis1);
        this.restrictFirstButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();

        observer.notifyObservers(this.getOptions());
      }

      calculateMinFirstButtonPositionAfterSliderOnDown = (clickBehind: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickBehind && clientAxis - this.sliderPosition < this.stepLength) {
          this.firstButtonPosition = 0 - this.buttonLength/2;
          this.calculateMinFirstTooltipValue();
        }
      }

      calculateMaxFirstButtonPositionAfterSliderOnDown = (clickAhead: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickAhead && this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength) {
          this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
          this.calculateMaxFirstTooltipValue(this.config.maxValue);
        }
        else if (clickAhead && this.secondButtonPosition - this.firstButtonPosition < this.stepLength && this.config.isInterval) {
          this.firstButtonPosition = this.secondButtonPosition;
          this.calculateMaxFirstTooltipValue(this.secondTooltipValue);
        }
      }

      calculateButtonPositionAfterScaleOnDown = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const isScaleElementOnDown = $(event.target).hasClass('js-scale-element');

        if (!isScaleElementOnDown) return;

        const clientX1: number = event.clientX;
        const clientY1: number = event.clientY;
        const clientAxis1: number = this.config.isVertical ? clientY1 : clientX1;

        const minRatio: number = this.config.minValue/(this.config.maxValue - this.config.minValue);
        const scaleElementValue: number = parseInt($(event.target).html());
        const scaleElementRatio: number = scaleElementValue/(this.maxValue - this.minValue);

        const clickAheadOfFirstButtonWidthInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;
        const clickAheadOfFirstButtonWidthoutInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength;

        const clickAheadOfFirstButton: boolean = this.config.isInterval ? clickAheadOfFirstButtonWidthInterval : clickAheadOfFirstButtonWidthoutInterval;
        const clickBehindOfFirstButton: boolean = clientAxis1 - this.sliderPosition < this.firstButtonPosition;
        const clickAheadOfSecondButton: boolean = clientAxis1 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
        const clickBehindOfSecondButton: boolean = clientAxis1 - this.sliderPosition < this.secondButtonPosition && clientAxis1 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

        if (clickAheadOfFirstButton || clickBehindOfFirstButton) {
          this.firstButtonPosition = Math.round((scaleElementRatio - minRatio) * this.sliderLength - this.buttonLength/2);
        }
        else if (clickAheadOfSecondButton || clickBehindOfSecondButton) {
          this.secondButtonPosition = Math.round((scaleElementRatio - minRatio) * this.sliderLength - this.buttonLength/2);
        }

        this.restrictFirstButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateTooltipsValues();

        observer.notifyObservers(this.getOptions());
      }

      calculateFirstButtonPositionAfterMinValueOnDown = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        this.firstButtonPosition = 0 - this.buttonLength/2;

        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateMinFirstTooltipValue();

        observer.notifyObservers(this.getOptions());
      }

      calculateFirstButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent) => {
        if (this.config.isInterval) return;

        event.stopPropagation();

        this.firstButtonPosition = this.sliderLength - this.buttonLength/2;

        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateMaxFirstTooltipValue(this.maxValue);

        observer.notifyObservers(this.getOptions());
      }

      calculateFirstButtonPositionAfterFocusing = (event: JQuery.FocusInEvent) => {
        if (!this.config.keyboard) return;

        const keyCodeToIncrease: number[] = this.config.isVertical ? [40, 83] : [39, 68];
        const keyCodeToReduce: number[] = this.config.isVertical ? [38, 87] : [37, 65];
        const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

        const calculateFirstButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent) => {
          if (!keyCodes.includes(event.keyCode)) return;

          const movementLength = this.isStepSet ? this.stepLength : 1;

          if (keyCodeToIncrease.includes(event.keyCode)) {
            this.firstButtonPosition += movementLength;
            if (this.isStepSet) this.calculateFirstTooltipValueWidthStepAhead();
          }
          else if (keyCodeToReduce.includes(event.keyCode)) {
            this.firstButtonPosition -= movementLength;
            if (this.isStepSet) this.calculateFirstTooltipValueWidthStepBehind();
          }

          this.restrictFirstButtonPosition();
          this.calculateRangeBetweenPosition();
          this.calculateRangeBetweenLength();
          this.calculateTooltipsPositions();
          if (!this.isStepSet) this.calculateTooltipsValues();

          observer.notifyObservers(this.getOptions());
        }

        $(event.target).on('keydown', calculateFirstButtonPositionAfterKeydown);
        $(event.target).on('focusout', () => $(event.target).off('keydown', calculateFirstButtonPositionAfterKeydown));
      }

      restrictFirstButtonPosition = () => {
        if (this.firstButtonPosition < 0 - this.buttonLength/2) {
          this.firstButtonPosition = 0 - this.buttonLength/2;
        }
        else if (this.firstButtonPosition > this.sliderLength - this.buttonLength/2) {
          this.firstButtonPosition = this.sliderLength - this.buttonLength/2;
        }
        if (this.config.isInterval && this.firstButtonPosition > this.secondButtonPosition) {
          this.firstButtonPosition = this.secondButtonPosition;
        }
      }

      calculateSecondButtonPosition = (event: JQuery.MouseDownEvent) => {
        if (!this.config.isInterval) return;

        event.stopPropagation();

        const shiftX2: number = event.clientX - this.secondButtonGlobalPosition - this.sliderPosition;
        const shiftY2: number = event.clientY - this.secondButtonGlobalPosition - this.sliderPosition;
        const shiftAxis2: number = this.config.isVertical ? shiftY2 : shiftX2;

        const calculateWhileSecondButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX2: number = event.clientX;
          const clientY2: number = event.clientY;
          const clientAxis2: number = model.config.isVertical ? clientY2 : clientX2;

          if (this.isStepSet) {
            this.calculateSecondButtonPositionWidthSetStep(clientAxis2);
          }
          else {
            this.secondButtonPosition = clientAxis2 - shiftAxis2 - this.sliderPosition;
            this.calculateTooltipsValues();
            this.restrictSecondTooltipValue();
          }

          this.restrictSecondButtonPosition();
          this.calculateRangeBetweenPosition();
          this.calculateRangeBetweenLength();
          this.calculateTooltipsPositions();

          observer.notifyObservers(this.getOptions());
        }

        $(document).on('mousemove', calculateWhileSecondButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileSecondButtonMoving));
      }

      calculateSecondButtonPositionWidthSetStep = (clientAxis: number) => {
        if (!this.config.isInterval) return;

        const isCursorNearStepAhead = clientAxis - this.sliderPosition > this.secondButtonPosition + this.buttonLength/2 + this.stepLength/2;
        const isCursorNearStepBehind = clientAxis - this.sliderPosition < this.secondButtonPosition  + this.buttonLength/2 - this.stepLength/2;

        if (isCursorNearStepAhead) {
          this.secondButtonPosition += this.stepLength;
          this.calculateSecondTooltipValueWidthStepAhead();
        }
        else if (isCursorNearStepBehind) {
          this.secondButtonPosition -= this.stepLength;
          this.calculateSecondTooltipValueWidthStepBehind();
        }
      }

      calculateSecondButtonPositionAfterSliderOnDown = (event: JQuery.MouseDownEvent) => {
        if (!this.config.isInterval) return;

        const clientX2: number = event.clientX;
        const clientY2: number = event.clientY;
        const clientAxis2: number = this.config.isVertical ? clientY2 : clientX2;
        const intervalForSecondButtonSteps = this.secondButtonPosition + this.buttonLength/2 - (clientAxis2 - this.sliderPosition);
        let secondButtonStepsNumber = Math.round(intervalForSecondButtonSteps/this.stepLength);

        secondButtonStepsNumber = secondButtonStepsNumber < 0 ? -secondButtonStepsNumber : secondButtonStepsNumber;

        const clickAheadOfSecondButton = clientAxis2 - this.sliderPosition > this.secondButtonPosition + this.buttonLength;
        const clickBehindOfSecondButton = clientAxis2 - this.sliderPosition < this.secondButtonPosition && clientAxis2 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength + (this.secondButtonPosition - this.firstButtonPosition)/2;

        if (this.isStepSet) {
          if (clickAheadOfSecondButton) {
            this.secondButtonPosition += secondButtonStepsNumber * this.stepLength;
            this.calculateSecondTooltipValueAfterSliderOnDownAhead(secondButtonStepsNumber);
          }
          else if (clickBehindOfSecondButton) {
            this.secondButtonPosition -= secondButtonStepsNumber * this.stepLength;
            this.calculateSecondTooltipValueAfterSliderOnDownBehind(secondButtonStepsNumber);
          }
        }
        else {
          if (clickAheadOfSecondButton || clickBehindOfSecondButton) {
            this.secondButtonPosition = clientAxis2 - this.sliderPosition - this.buttonLength/2;
            this.calculateTooltipsValues();
          }
        }

        this.calculateMinSecondButtonPositionAfterSliderOnDown(clickBehindOfSecondButton, clientAxis2);
        this.calculateMaxSecondButtonPositionAfterSliderOnDown(clickAheadOfSecondButton, clientAxis2);
        this.restrictSecondButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();

        observer.notifyObservers(this.getOptions());
      }

      calculateMinSecondButtonPositionAfterSliderOnDown = (clickBehind: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickBehind && this.secondButtonPosition - this.firstButtonPosition < this.stepLength) {
          this.secondButtonPosition = this.firstButtonPosition;
          this.calculateMinSecondTooltipValue();
        }
      }

      calculateMaxSecondButtonPositionAfterSliderOnDown = (clickAhead: boolean, clientAxis: number) => {
        if (!this.isStepSet) return;

        if (clickAhead && this.sliderLength - (clientAxis - this.sliderPosition) < this.stepLength) {
            this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
            this.calculateMaxSecondTooltipValue();
        }
      }

      calculateSecondButtonPositionAfterMaxValueOnDown = (event: JQuery.MouseDownEvent) => {
        if (!this.config.isInterval) return;

        event.stopPropagation();

        this.secondButtonPosition = this.sliderLength - this.buttonLength/2;

        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();
        this.calculateMaxSecondTooltipValue();

        observer.notifyObservers(this.getOptions());
      }

      calculateSecondButtonPositionAfterFocusing = (event: JQuery.FocusInEvent) => {
        if (!this.config.keyboard || !this.config.isInterval) return;

        const keyCodeToIncrease: number[] = this.config.isVertical ? [40, 83] : [39, 68];
        const keyCodeToReduce: number[] = this.config.isVertical ? [38, 87] : [37, 65];
        const keyCodes: number[] = keyCodeToIncrease.concat(keyCodeToReduce);

        const calculateSecondButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent) => {
          if (!keyCodes.includes(event.keyCode)) return;

          const movementLength = this.isStepSet ? this.stepLength : 1;

          if (keyCodeToIncrease.includes(event.keyCode)) {
            this.secondButtonPosition += movementLength;
            if (this.isStepSet) this.calculateSecondTooltipValueWidthStepAhead();
          }
          else if (keyCodeToReduce.includes(event.keyCode)) {
            this.secondButtonPosition -= movementLength;
            if (this.isStepSet) this.calculateSecondTooltipValueWidthStepBehind();
          }

          this.restrictSecondButtonPosition();
          this.calculateRangeBetweenPosition();
          this.calculateRangeBetweenLength();
          this.calculateTooltipsPositions();
          if (!this.isStepSet) this.calculateTooltipsValues();

          observer.notifyObservers(this.getOptions());
        }

        $(event.target).on('keydown', calculateSecondButtonPositionAfterKeydown);
        $(event.target).on('focusout', () => $(event.target).off('keydown', calculateSecondButtonPositionAfterKeydown));
      }

      restrictSecondButtonPosition = () => {
        if (this.secondButtonPosition < this.firstButtonPosition) {
          this.secondButtonPosition = this.firstButtonPosition;
        }
        else if (this.secondButtonPosition > this.sliderLength - this.buttonLength/2) {
          this.secondButtonPosition = this.sliderLength - this.buttonLength/2;
        }
      }

      calculateRangeBetweenPosition = () => {
        this.rangeBetweenPosition = 0;

        if (!this.config.isInterval) return;
        
        this.rangeBetweenPosition = this.firstButtonPosition + this.buttonLength/2;
      }

      calculateRangeBetweenLength = () => {
        this.rangeBetweenLength = this.firstButtonPosition + this.buttonLength/2;

        if (!this.config.isInterval) return;
          
        this.rangeBetweenLength = this.secondButtonPosition - this.firstButtonPosition;
      }

      calculateTooltipsPositions = () => {
        this.firstTooltipPosition = (this.firstButtonPosition + this.buttonLength/2) - this.firstTooltipLength/2;
        this.secondTooltipPosition = (this.secondButtonPosition + this.buttonLength/2) - this.secondTooltipLength/2;

        this.separateTooltips();
        this.showMinAndMaxValues();
      }

      calculateTooltipsValues = () => {
        this.firstTooltipValue = Math.round((this.firstButtonPosition + this.buttonLength/2)/this.sliderLength * (this.config.maxValue - this.config.minValue) + this.config.minValue);
        this.secondTooltipValue = Math.round((this.secondButtonPosition + this.buttonLength/2)/this.sliderLength * (this.config.maxValue - this.config.minValue) + this.config.minValue);
      }

      calculateFirstTooltipValueAfterSliderOnDownAhead = (stepNumber: number) => {
        this.firstTooltipValue = parseInt(`${this.firstTooltipValue}`) + stepNumber * this.config.step;
      }

      calculateFirstTooltipValueAfterSliderOnDownBehind = (stepNumber: number) => {
        this.firstTooltipValue = parseInt(`${this.firstTooltipValue}`) - stepNumber * this.config.step;
      }

      calculateSecondTooltipValueAfterSliderOnDownAhead = (stepNumber: number) => {
        this.secondTooltipValue = parseInt(`${this.secondTooltipValue}`) + stepNumber * this.config.step;
      }

      calculateSecondTooltipValueAfterSliderOnDownBehind = (stepNumber: number) => {
        this.secondTooltipValue = parseInt(`${this.secondTooltipValue}`) - stepNumber * this.config.step;
      }

      calculateFirstTooltipValueWidthStepAhead = () => {
        this.firstTooltipValue = parseInt(`${this.firstTooltipValue}`) + this.config.step;
        this.restrictFirstTooltipValue();
      }

      calculateFirstTooltipValueWidthStepBehind = () => {
        this.firstTooltipValue = parseInt(`${this.firstTooltipValue}`) - this.config.step;
        this.restrictFirstTooltipValue();
      }

      calculateSecondTooltipValueWidthStepAhead = () => {
        this.secondTooltipValue = parseInt(`${this.secondTooltipValue}`) + this.config.step;
        this.restrictSecondTooltipValue();
      }

      calculateSecondTooltipValueWidthStepBehind = () => {
        this.secondTooltipValue = parseInt(`${this.secondTooltipValue}`) - this.config.step;
        this.restrictSecondTooltipValue();
      }

      calculateMinFirstTooltipValue = () => {
        this.firstTooltipValue = this.config.minValue;
      }

      calculateMaxFirstTooltipValue = (value: number | string) => {
        this.firstTooltipValue = value;
      }

      restrictFirstTooltipValue = () => {
        if (this.firstTooltipValue < this.config.minValue) {
          this.firstTooltipValue = this.config.minValue;
        }
        else if (this.config.isInterval && this.firstTooltipValue > this.secondTooltipValue) {
          this.firstTooltipValue = this.secondTooltipValue;
        }
        else if (this.firstTooltipValue > this.config.maxValue) {
          this.firstTooltipValue = this.config.maxValue;
        }
      }

      calculateMinSecondTooltipValue = () => {
        this.secondTooltipValue = this.firstTooltipValue;
      }

      calculateMaxSecondTooltipValue = () => {
        this.secondTooltipValue = this.config.maxValue;
      }

      restrictSecondTooltipValue = () => {
        if (this.secondTooltipValue < this.firstTooltipValue) {
          this.secondTooltipValue = this.firstTooltipValue;
        }
        else if (this.secondTooltipValue > this.config.maxValue) {
          this.secondTooltipValue = this.config.maxValue;
        }
      }

      separateTooltips = () => {
        if (!this.config.isInterval) return;

        const areTooltipsClose = this.firstTooltipPosition + this.firstTooltipLength > this.secondTooltipPosition;

        if (!areTooltipsClose) return;
          
        this.firstTooltipPosition = this.firstButtonPosition - this.firstTooltipLength;
        this.secondTooltipPosition = this.secondButtonPosition + this.buttonLength;
      }

      caclulateMinAndMaxPositions = () => {
        this.minValuePosition = 0;
        this.maxValuePosition = this.sliderLength - this.maxValueLength;
      }

      showMinAndMaxValues = () => {
        this.showMinValue = true;
        this.showMaxValue = true;

        if (this.firstTooltipPosition < this.minValuePosition + this.minValueLength) {
          this.showMinValue = false;
        }

        if (this.config.isInterval && this.secondTooltipPosition + this.secondTooltipLength > this.maxValuePosition) {
          this.showMaxValue = false;
        }
        else if (this.firstTooltipPosition + this.firstTooltipLength > this.maxValuePosition) {
          this.showMaxValue = false;
        }       
      }

      calculateScaleElementsValues = () => {
        const intervalForScalesElements: number = (this.maxValue - this.minValue)/(this.scaleNumbers - 1);
        let scaleElementValue = this.minValue;

        this.scaleElements.push(scaleElementValue);
        
        for (let i = 0; i < this.scaleNumbers - 1; i++) {      
          this.scaleElements.push(Math.round(scaleElementValue += intervalForScalesElements));
        }
      }

      calculateLengthBetweenScaleElements = () => {
        this.lengthBetweenScaleElements = this.sliderLength/(this.scaleNumbers - 1);
      }

      calculateStepLength = () => {
        this.stepLength = Math.round((this.config.step/(this.config.maxValue - this.config.minValue)) * this.sliderLength);
      }

      getOptions = () => {
        const options: Options = {
          positionParameter: this.positionParameter,
          lengthParameter: this.lengthParameter,
          sliderPosition: this.sliderPosition,
          sliderLength: this.sliderLength,
          buttonLength: this.buttonLength,
          stepLength: this.stepLength,
          minValue: this.minValue,
          maxValue: this.maxValue,
          showMinValue: this.showMinValue,
          showMaxValue: this.showMaxValue,
          minValuePosition: this.minValuePosition,
          maxValuePosition: this.maxValuePosition,
          minValueLength: this.minValueLength,
          maxValueLength: this.maxValueLength,
          firstButtonPosition: this.firstButtonPosition,
          secondButtonPosition: this.secondButtonPosition,
          firstButtonGlobalPositon: this.firstButtonGlobalPosition,
          secondButtonGlobalPositon: this.secondButtonGlobalPosition,
          firstTooltipPosition: this.firstTooltipPosition,
          secondTooltipPosition: this.secondTooltipPosition,
          firstTooltipValue: this.firstTooltipValue,
          secondTooltipValue: this.secondTooltipValue,
          rangeBetweenPosition: this.rangeBetweenPosition,
          rangeBetweenLength: this.rangeBetweenLength,
          scaleNumbers: this.scaleNumbers,
          scaleElements: this.scaleElements,
          lengthBetweenScaleElements: this.lengthBetweenScaleElements
        }

        return options;
      }
    }

    class View {

      init = (initialOptions: InitialOptions) => {
        slider.$slider.appendTo($this).addClass('js-slider__stripe');
        firstButton.$firstButton.appendTo(slider.$slider).addClass('js-slider__first-button');

        if (initialOptions.isInterval) {
          secondButton.$secondButton.appendTo(slider.$slider).addClass('js-slider__second-button');
        }

        if (initialOptions.isMinAndMax) {
          minAndMaxValues.$minValue.appendTo(slider.$slider).addClass('js-slider__min-value');
          minAndMaxValues.$maxValue.appendTo(slider.$slider).addClass('js-slider__max-value');
        }

        if (initialOptions.isScale) {
          scale.$scaleContainer.appendTo(slider.$slider).addClass('js-scale-container');
        }

        if (initialOptions.isRangeBetween) {
          rangeBetween.$rangeBetween.appendTo(slider.$slider).addClass('js-slider__between');
        }

        if (initialOptions.isTooltip) {
          tooltips.$firstTooltip.appendTo(slider.$slider).addClass('js-slider__first-tooltip');

          if (!initialOptions.isInterval) return;

          tooltips.$secondTooltip.appendTo(slider.$slider).addClass('js-slider__second-tooltip');
        }
      }

      setPlane = (isVertical: boolean) => {
        const width: string = $this.css('width');
        const height: string = $this.css('height');

        //Доработать
        if (isVertical) {
          $this.css('width', height);
          $this.css('height', width);
          firstButton.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          secondButton.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          tooltips.$firstTooltip.css({'left': `${firstButton.$firstButton.css('width')}`});
          tooltips.$secondTooltip.css({'left': `${secondButton.$secondButton.css('width')}`}); 
          minAndMaxValues.$minValue.css({'left': `${firstButton.$firstButton.css('width')}`});
          minAndMaxValues.$maxValue.css({'left': `${firstButton.$firstButton.css('width')}`});
          scale.$scaleContainer.css({'right': 35})
          return;
        }

        $this.css('width', width);
        $this.css('height', height);
        firstButton.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
        secondButton.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'});   
        tooltips.$firstTooltip.css({'bottom': `${firstButton.$firstButton.css('height')}`});
        tooltips.$secondTooltip.css({'bottom': `${secondButton.$secondButton.css('height')}`});
        minAndMaxValues.$minValue.css({'bottom': `${firstButton.$firstButton.css('height')}`});
        minAndMaxValues.$maxValue.css({'bottom': `${firstButton.$firstButton.css('height')}`});
        scale.$scaleContainer.css({'top': 35})
      }

      getCoords = (el: JQuery<HTMLElement>, isVertical: boolean) => {
          const coords = el.position();
        
          return isVertical ? coords.top : coords.left;
      }
    }
    

    class Slider extends View {
      $slider: JQuery<HTMLElement> = $('<div/>');
    }

    class RangeBetween extends View {
      $rangeBetween: JQuery<HTMLElement> = $('<div/>');

      setRangeBetweenPosition = (options: Options) => {
        this.$rangeBetween.css(options.positionParameter, options.rangeBetweenPosition);
      }

      setRangeBetweenLength = (options: Options) => {
        this.$rangeBetween.css(options.lengthParameter, options.rangeBetweenLength);
      }
    }

    class FirstButton extends View {
      $firstButton: JQuery<HTMLElement> = $('<button/>');

      setFirstButtonPosition = (options: Options) => {
        this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
      }
    }

    class SecondButton extends View {
      $secondButton: JQuery<HTMLElement> = $('<button/>');

      setSecondButtonPosition = (options: Options) => {
        this.$secondButton.css(options.positionParameter, options.secondButtonPosition);
      }
    }

    class Tooltips extends View {
      $firstTooltip: JQuery<HTMLElement> = $('<div/>');
      $secondTooltip: JQuery<HTMLElement> = $('<div/>');

      setFirstTooltipPosition = (options: Options) => {
        this.$firstTooltip.css(options.positionParameter, options.firstTooltipPosition);
      }

      setFirstTooltipValue = (options: Options) => {
        this.$firstTooltip.html(`${options.firstTooltipValue}`)
      }

      setSecondTooltipPosition = (options: Options) => {
        this.$secondTooltip.css(options.positionParameter, options.secondTooltipPosition);
      }

      setSecondTooltipValue = (options: Options) => {
        this.$secondTooltip.html(`${options.secondTooltipValue}`)
      }
    }

    class MinAndMaxValues extends View {
      $minValue: JQuery<HTMLElement> = $('<div/>');
      $maxValue: JQuery<HTMLElement> = $('<div/>');

      setMinAndMaxPosition = (options: Options) => {
        this.$minValue.css(options.positionParameter, options.minValuePosition);
        this.$maxValue.css(options.positionParameter, options.maxValuePosition);
      }

      setMinAndMaxValues = (options: Options) => {
        this.$minValue.html(`${options.minValue}`);
        this.$maxValue.html(`${options.maxValue}`);
      }

      showMinAndMax = (options: Options) => {
        this.$minValue.css({'opacity': '1'});
        this.$maxValue.css({'opacity': '1'});
        
        if (!options.showMinValue) {
          this.$minValue.css({'opacity': '0'});
        }
        
        if (!options.showMaxValue) {
          this.$maxValue.css({'opacity': '0'});
        }
      }
    }

    class Scale extends View {
      $scaleContainer: JQuery<HTMLElement> = $('<div>');

      setScaleElementsValues = (options: Options) => {
        for (let i = 0; i < options.scaleElements.length; i++) {
          const $scaleElement: JQuery<HTMLElement> = $('<div>').addClass(`js-scale-element js-scale-element_${i}`);
          $scaleElement.html(`${options.scaleElements[i]}`);
          $scaleElement.appendTo(this.$scaleContainer);
        }
      }

      setSclaleElementsPositions = (options: Options) => {
        let scaleElementPosition = 0;

        for (let i = 0; i < options.scaleElements.length; i++) {
          const $scaleElement = this.$scaleContainer.find(`.js-scale-element_${i}`);
          const scaleElementLength = parseInt($scaleElement.css(options.lengthParameter));

          $scaleElement.css(options.positionParameter, scaleElementPosition - scaleElementLength/2);

          scaleElementPosition += options.lengthBetweenScaleElements
        }
      }

      setScaleLength = (options: Options) => {
        this.$scaleContainer.css(options.lengthParameter, options.sliderLength);
      }
    }

    class Presenter {

      constructor() {

        //All for initialization of the slider
        model.validateInitialValues();
        view.init({
          isInterval: model.config.isInterval,
          isTooltip: model.config.isTooltip,
          isMinAndMax: model.config.isMinAndMax, 
          isRangeBetween: model.config.isRangeBetween, 
          isScale: model.config.isScale
        });
        view.setPlane(model.config.isVertical);

        let options: Options = model.getOptions();

        minAndMaxValues.setMinAndMaxValues(options);

        model.setSliderElementsParameters({
          sliderPosition: view.getCoords(slider.$slider, model.config.isVertical), 
          sliderLength: parseInt(slider.$slider.css(model.lengthParameter)), 
          buttonLength: parseInt(firstButton.$firstButton.css(model.lengthParameter)),
          firstTooltipLength: parseInt(tooltips.$firstTooltip.css(model.lengthParameter)),
          secondTooltipLength: parseInt(tooltips.$secondTooltip.css(model.lengthParameter)),
          minValueLength: parseInt(minAndMaxValues.$minValue.css(model.lengthParameter)),
          maxValueLength: parseInt(minAndMaxValues.$maxValue.css(model.lengthParameter))
        });
        model.calculateStepLength();
        model.caclulateMinAndMaxPositions();
        model.calculateInitialButtonsPositon();
        model.calculateTooltipsPositions();
        model.calculateRangeBetweenPosition();
        model.calculateRangeBetweenLength();
        model.calculateScaleElementsValues();
        model.calculateLengthBetweenScaleElements();

        options = model.getOptions();

        minAndMaxValues.setMinAndMaxPosition(options);

        firstButton.setFirstButtonPosition(options);
        secondButton.setSecondButtonPosition(options);
        tooltips.setFirstTooltipPosition(options);
        tooltips.setFirstTooltipValue(options);
        tooltips.setSecondTooltipPosition(options);
        tooltips.setSecondTooltipValue(options);
        rangeBetween.setRangeBetweenPosition(options);
        rangeBetween.setRangeBetweenLength(options);
        scale.setScaleElementsValues(options);
        scale.setScaleLength(options);
        scale.setSclaleElementsPositions(options);
        minAndMaxValues.showMinAndMax(options);

        //Add subscribers to the observer
        observer.addObserver(firstButton.setFirstButtonPosition);
        observer.addObserver(secondButton.setSecondButtonPosition);
        observer.addObserver(tooltips.setFirstTooltipPosition);
        observer.addObserver(tooltips.setFirstTooltipValue);
        observer.addObserver(tooltips.setSecondTooltipPosition);
        observer.addObserver(tooltips.setSecondTooltipValue);
        observer.addObserver(rangeBetween.setRangeBetweenPosition);
        observer.addObserver(rangeBetween.setRangeBetweenLength);
        observer.addObserver(minAndMaxValues.showMinAndMax);

        //Binding events
        firstButton.$firstButton.on('mousedown', () => model.setButtonsGlobalPosition(view.getCoords(firstButton.$firstButton, model.config.isVertical), view.getCoords(secondButton.$secondButton, model.config.isVertical)));
        secondButton.$secondButton.on('mousedown', () => model.setButtonsGlobalPosition(view.getCoords(firstButton.$firstButton, model.config.isVertical), view.getCoords(secondButton.$secondButton, model.config.isVertical)));
        firstButton.$firstButton.on('focusin', model.calculateFirstButtonPositionAfterFocusing);
        secondButton.$secondButton.on('focusin', model.calculateSecondButtonPositionAfterFocusing);
        firstButton.$firstButton.on('mousedown', model.calculateFirstButtonPosition);
        secondButton.$secondButton.on('mousedown', model.calculateSecondButtonPosition);
        slider.$slider.on('mousedown', model.calculateFirstButtonPositionAfterSliderOnDown);
        slider.$slider.on('mousedown', model.calculateSecondButtonPositionAfterSliderOnDown);
        minAndMaxValues.$minValue.on('mousedown', model.calculateFirstButtonPositionAfterMinValueOnDown);
        minAndMaxValues.$maxValue.on('mousedown', model.calculateFirstButtonPositionAfterMaxValueOnDown);
        minAndMaxValues.$maxValue.on('mousedown', model.calculateSecondButtonPositionAfterMaxValueOnDown);
        scale.$scaleContainer.on('mousedown', model.calculateButtonPositionAfterScaleOnDown);
      }
    }

    const observer = new Observer();
    const model = new Model();
    const view = new View();
    const tooltips = new Tooltips();
    const firstButton = new FirstButton();
    const secondButton = new SecondButton();
    const rangeBetween = new RangeBetween();
    const slider = new Slider();
    const minAndMaxValues = new MinAndMaxValues();
    const scale = new Scale();
    const presenter = new Presenter();

    return input;
  };

  $.fn.mySlider = function(options: {}) {
    return this.each(function() {
      mySlider($(this), options);
    });
  }
})(jQuery);

$('.js-slider').mySlider({
  isInterval: true,
  minValue: 0,
  maxValue: 250,
  step: 25,
  from: 25,
  to: 75,
  keyboard: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRangeBetween: true,
  isScale: true,
  scaleNumbers: 6
});