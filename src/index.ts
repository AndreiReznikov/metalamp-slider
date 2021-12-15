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
    }

    interface Options {
      positionParameter: string;
      lengthParameter: string;
      sliderPosition: number;
      sliderLength: number;
      buttonLength: number;
      stepLength: number;
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
    }

    interface ElementsParameters {
      sliderPosition: number;
      sliderLength: number;
      buttonLength: number;
      firstTooltipLength: number;
      secondTooltipLength: number;
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
        isTooltip: true 
      };

      config: Config = $.extend({}, this.data, options);

      positionParameter: string = this.config.isVertical ? 'top' : 'left';
      lengthParameter: string = this.config.isVertical ? 'height' : 'width';
      isStepSet: boolean = this.config.step > 0;
      sliderPosition: number = 0;
      sliderLength: number = 0;
      buttonLength: number = 0;
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

      setSliderElementsParameters = (elementsParameters: ElementsParameters) => {
        this.sliderPosition = elementsParameters.sliderPosition;
        this.sliderLength = elementsParameters.sliderLength;
        this.buttonLength = elementsParameters.buttonLength;
        this.firstTooltipLength = elementsParameters.firstTooltipLength;
        this.secondTooltipLength = elementsParameters.secondTooltipLength;
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

        const clickAheadOfFirstButtonWidthInterval = clientAxis1 - this.sliderPosition > this.firstButtonPosition + this.buttonLength && clientAxis1 - this.sliderPosition < this.firstButtonPosition + this.buttonLength/2 + this.rangeBetweenLength/2;
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
          this.firstButtonPosition = clientAxis1 - this.sliderPosition - this.buttonLength/2;
          this.calculateTooltipsValues();
        }

        this.restrictFirstButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();

        if (this.rangeBetweenLength < this.stepLength && this.config.isInterval) {
          this.firstButtonPosition = this.secondButtonPosition;
        }

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
        const clickBehindOfSecondButton = clientAxis2 - this.sliderPosition < this.secondButtonPosition && clientAxis2 - this.sliderPosition >= this.firstButtonPosition + this.buttonLength/2 + this.rangeBetweenLength/2;

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
          this.secondButtonPosition = clientAxis2 - this.sliderPosition - this.buttonLength/2;
          this.calculateTooltipsValues();
        }

        this.restrictSecondButtonPosition();
        this.calculateRangeBetweenPosition();
        this.calculateRangeBetweenLength();
        this.calculateTooltipsPositions();

        if (this.rangeBetweenLength < this.stepLength) {
          this.secondButtonPosition = this.firstButtonPosition;
        }

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
          firstButtonPosition: this.firstButtonPosition,
          secondButtonPosition: this.secondButtonPosition,
          firstButtonGlobalPositon: this.firstButtonGlobalPosition,
          secondButtonGlobalPositon: this.secondButtonGlobalPosition,
          firstTooltipPosition: this.firstTooltipPosition,
          secondTooltipPosition: this.secondTooltipPosition,
          firstTooltipValue: this.firstTooltipValue,
          secondTooltipValue: this.secondTooltipValue,
          rangeBetweenPosition: this.rangeBetweenPosition,
          rangeBetweenLength: this.rangeBetweenLength
        }

        return options;
      }
    }

    class View {

      init = (isInterval: boolean, isTooltip: boolean) => {
        slider.$slider.appendTo($this).addClass('js-slider__stripe');
        rangeBetween.$rangeBetween.appendTo(slider.$slider).addClass('js-slider__between');
        firstSliderButton.$firstButton.appendTo(slider.$slider).addClass('js-slider__first-button');
        minAndMaxValues.$minValueElement.appendTo(slider.$slider).addClass('js-slider__min-value');
        minAndMaxValues.$maxValueElement.appendTo(slider.$slider).addClass('js-slider__max-value');

        if (isInterval) {
          secondSliderButton.$secondButton.appendTo(slider.$slider).addClass('js-slider__second-button');
        }

        if (isTooltip) {
          tooltips.$firstTooltip.appendTo(slider.$slider).addClass('js-slider__first-tooltip');

          if (!isInterval) return;

          tooltips.$secondTooltip.appendTo(slider.$slider).addClass('js-slider__second-tooltip');
        }
      }

      setPlane = (isVertical: boolean) => {
        const width: string = $this.css('width');
        const height: string = $this.css('height');

        if (isVertical) {
          $this.css('width', height);
          $this.css('height', width);
          firstSliderButton.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          secondSliderButton.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          tooltips.$firstTooltip.css({'left': `${firstSliderButton.$firstButton.css('width')}`});
          tooltips.$secondTooltip.css({'left': `${secondSliderButton.$secondButton.css('width')}`}); 
          return;
        }

        $this.css('width', width);
        $this.css('height', height);
        firstSliderButton.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
        secondSliderButton.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'});   
        tooltips.$firstTooltip.css({'bottom': `${firstSliderButton.$firstButton.css('height')}`});
        tooltips.$secondTooltip.css({'bottom': `${secondSliderButton.$secondButton.css('height')}`}); 
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

    class FirstSliderButton extends View {
      $firstButton: JQuery<HTMLElement> = $('<button/>');

      setFirstButtonPosition = (options: Options) => {
        this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
      }
    }

    class SecondSliderButton extends View {
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
      $minValueElement: JQuery<HTMLElement> = $('<div/>');
      $maxValueElement: JQuery<HTMLElement> = $('<div/>');
    }

    class Presenter {

      constructor() {
        view.init(model.config.isInterval, model.config.isTooltip);
        view.setPlane(model.config.isVertical);
        model.setSliderElementsParameters({
          sliderPosition: view.getCoords(slider.$slider, model.config.isVertical), 
          sliderLength: parseInt(slider.$slider.css(model.lengthParameter)), 
          buttonLength: parseInt(firstSliderButton.$firstButton.css(model.lengthParameter)),
          firstTooltipLength: parseInt(tooltips.$firstTooltip.css(model.lengthParameter)),
          secondTooltipLength: parseInt(tooltips.$secondTooltip.css(model.lengthParameter))
        });
        model.calculateStepLength();
        model.calculateInitialButtonsPositon();
        model.calculateTooltipsPositions();
        model.calculateRangeBetweenPosition();
        model.calculateRangeBetweenLength();

        const options: Options = model.getOptions();

        firstSliderButton.setFirstButtonPosition(options);
        secondSliderButton.setSecondButtonPosition(options);
        tooltips.setFirstTooltipPosition(options);
        tooltips.setFirstTooltipValue(options);
        tooltips.setSecondTooltipPosition(options);
        tooltips.setSecondTooltipValue(options);
        rangeBetween.setRangeBetweenPosition(options);
        rangeBetween.setRangeBetweenLength(options);
        observer.addObserver(firstSliderButton.setFirstButtonPosition);
        observer.addObserver(secondSliderButton.setSecondButtonPosition);
        observer.addObserver(tooltips.setFirstTooltipPosition);
        observer.addObserver(tooltips.setFirstTooltipValue);
        observer.addObserver(tooltips.setSecondTooltipPosition);
        observer.addObserver(tooltips.setSecondTooltipValue);
        observer.addObserver(rangeBetween.setRangeBetweenPosition);
        observer.addObserver(rangeBetween.setRangeBetweenLength);
        firstSliderButton.$firstButton.on('mousedown', () => model.setButtonsGlobalPosition(view.getCoords(firstSliderButton.$firstButton, model.config.isVertical), view.getCoords(secondSliderButton.$secondButton, model.config.isVertical)));
        secondSliderButton.$secondButton.on('mousedown', () => model.setButtonsGlobalPosition(view.getCoords(firstSliderButton.$firstButton, model.config.isVertical), view.getCoords(secondSliderButton.$secondButton, model.config.isVertical)));
        firstSliderButton.$firstButton.on('focusin', model.calculateFirstButtonPositionAfterFocusing);
        secondSliderButton.$secondButton.on('focusin', model.calculateSecondButtonPositionAfterFocusing);
        firstSliderButton.$firstButton.on('mousedown', model.calculateFirstButtonPosition);
        secondSliderButton.$secondButton.on('mousedown', model.calculateSecondButtonPosition);
        slider.$slider.on('mousedown', model.calculateFirstButtonPositionAfterSliderOnDown);
        slider.$slider.on('mousedown', model.calculateSecondButtonPositionAfterSliderOnDown);
      }
    }

    const observer = new Observer();
    const model = new Model();
    const view = new View();
    const tooltips = new Tooltips();
    const firstSliderButton = new FirstSliderButton();
    const secondSliderButton = new SecondSliderButton();
    const rangeBetween = new RangeBetween();
    const slider = new Slider();
    const minAndMaxValues = new MinAndMaxValues();
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
  isInterval: false,
  minValue: 15,
  maxValue: 250,
  step: 20,
  from: 35,
  to: 120,
  keyboard: true,
  isTooltip: true,
  isVertical: false
});