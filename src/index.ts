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
      rangeBetweenPosition: number;
      rangeBetweenLength: number;
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
      sliderPosition: number = 0;
      sliderLength: number = 0;
      buttonLength: number = 0;
      stepLength: number = 0;
      firstButtonPosition: number = 0;
      secondButtonPosition: number = 0;
      firstButtonGlobalPosition: number = 0;
      secondButtonGlobalPosition: number = 0;
      rangeBetweenPosition: number = 0;
      rangeBetweenLength: number = 0;

      setSliderElementsParameters = (sliderPosition: number, sliderLength: number, buttonLength: number) => {
        this.sliderPosition = sliderPosition;
        this.sliderLength = sliderLength;
        this.buttonLength = buttonLength;
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
          this.secondButtonPosition = Math.round((toRatio - minRatio) * this.sliderLength -this. buttonLength/2);
        }
      }

      calculateFirstButtonPosition = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const shiftX1: number = event.clientX - this.firstButtonGlobalPosition;
        const shiftY1: number = event.clientY - this.firstButtonGlobalPosition;
        const shiftAxis1: number = this.config.isVertical ? shiftY1 : shiftX1;

        const calculateWhileFirstButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX1: number = event.clientX;
          const clientY1: number = event.clientY;
          const clientAxis1: number = this.config.isVertical ? clientY1 : clientX1;

          this.firstButtonPosition = clientAxis1 - shiftAxis1 - this.sliderPosition;

          this.restrictFirstButtonPosition();

          observer.notifyObservers(this.getOptions());
        }

        $(document).on('mousemove', calculateWhileFirstButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileFirstButtonMoving));
      }

      changeFirstButtonPositionAfterFocusing = (event: JQuery.FocusEvent) => {
        if (!this.config.keyboard) return;

        const keyCodeToIncrease: number[] = this.config.isVertical ? [40, 83] : [39, 68];
        const keyCodeToReduce: number[] = this.config.isVertical ? [38, 87] : [37, 65];

        const changeFirstButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent) => {
          
          if (keyCodeToIncrease.includes(event.keyCode)) {
            this.firstButtonPosition += 1;
          }
          else if (keyCodeToReduce.includes(event.keyCode)) {
            this.firstButtonPosition -= 1;
          }

          this.restrictFirstButtonPosition();

          observer.notifyObservers(this.getOptions());
        }

        $(event.target).on('keydown', changeFirstButtonPositionAfterKeydown);
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
        event.stopPropagation();

        const shiftX2: number = event.clientX - this.secondButtonGlobalPosition;
        const shiftY2: number = event.clientY - this.secondButtonGlobalPosition;
        const shiftAxis2: number = this.config.isVertical ? shiftY2 : shiftX2;

        const calculateWhileSecondButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX2: number = event.clientX;
          const clientY2: number = event.clientY;
          const clientAxis2: number = model.config.isVertical ? clientY2 : clientX2;

          this.secondButtonPosition = clientAxis2 - shiftAxis2 - this.sliderPosition;

          this.restrictSecondButtonPosition();

          observer.notifyObservers(this.getOptions());
        }

        $(document).on('mousemove', calculateWhileSecondButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileSecondButtonMoving));
      }

      changeSecondButtonPositionAfterFocusing = (event: JQuery.FocusEvent) => {
        if (!this.config.keyboard) return;

        const keyCodeToIncrease: number[] = this.config.isVertical ? [40, 83] : [39, 68];
        const keyCodeToReduce: number[] = this.config.isVertical ? [38, 87] : [37, 65];

        const changeSecondButtonPositionAfterKeydown = (event: JQuery.KeyDownEvent) => {
          if (keyCodeToIncrease.includes(event.keyCode)) {
            this.secondButtonPosition += 1;
          }
          else if (keyCodeToReduce.includes(event.keyCode)) {
            this.secondButtonPosition -= 1;
          }

          this.restrictSecondButtonPosition();

          observer.notifyObservers(this.getOptions());
        }

        $(event.target).on('keydown', changeSecondButtonPositionAfterKeydown);
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

      calculateStepLength = () => {
        this.stepLength = Math.round((this.config.step/(this.config.maxValue - this.config.minValue)) * this.sliderLength);
      }

      getOptions = () => {
        const options: Options = {
          positionParameter: model.positionParameter,
          lengthParameter: model.lengthParameter,
          sliderPosition: model.sliderPosition,
          sliderLength: model.sliderLength,
          buttonLength: model.buttonLength,
          stepLength: model.stepLength,
          firstButtonPosition: model.firstButtonPosition,
          secondButtonPosition: model.secondButtonPosition,
          firstButtonGlobalPositon: model.firstButtonGlobalPosition,
          secondButtonGlobalPositon: model.secondButtonGlobalPosition,
          rangeBetweenPosition: model.rangeBetweenPosition,
          rangeBetweenLength: model.rangeBetweenLength
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
          tooltip.$firstTooltip.appendTo(slider.$slider).addClass('js-slider__second-tooltip');

          if (!isInterval) return;
          tooltip.$secondTooltip.appendTo(slider.$slider).addClass('js-slider__first-tooltip');
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
          return;
        }

        $this.css('width', width);
        $this.css('height', height);
        firstSliderButton.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
        secondSliderButton.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'});     
      }

      getCoords = (el: JQuery<HTMLElement>, isVertical: boolean) => {
          const coords: JQuery.Coordinates = el.offset()!;
        
          return isVertical ? coords.top : coords.left;
      }
    }
    

    class Slider extends View {
      $slider: JQuery<HTMLElement> = $('<div/>');
    }

    class RangeBetween extends View {
      $rangeBetween: JQuery<HTMLElement> = $('<div/>');

      setRangeBetweenPosition = (options: any) => {
        this.$rangeBetween.css(options.positionParameter, options.rangeBetweenPosition);
      }

      setRangeBetweenLength = (options: any) => {
        this.$rangeBetween.css(options.lengthParameter, options.rangeBetweenLength);
      }
    }

    class FirstSliderButton extends View {
      $firstButton: JQuery<HTMLElement> = $('<button/>');

      setFirstButtonPosition = (options: any) => {
        this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
      }
    }

    class SecondSliderButton extends View {
      $secondButton: JQuery<HTMLElement> = $('<button/>');

      setSecondButtonPosition = (options: Options) => {
        this.$secondButton.css(options.positionParameter, options.secondButtonPosition);
      }
    }

    class Tooltip extends View {
      $firstTooltip: JQuery<HTMLElement> = $('<div/>');
      $secondTooltip: JQuery<HTMLElement> = $('<div/>');
    }

    class MinAndMaxValues extends View {
      $minValueElement: JQuery<HTMLElement> = $('<div/>');
      $maxValueElement: JQuery<HTMLElement> = $('<div/>');
    }

    class Presenter {

      constructor() {
        view.init(model.config.isInterval, model.config.isTooltip);
        view.setPlane(model.config.isVertical);
        model.setSliderElementsParameters(
          view.getCoords(slider.$slider, model.config.isVertical), 
          parseInt(slider.$slider.css(model.lengthParameter)), 
          parseInt(firstSliderButton.$firstButton.css(model.lengthParameter))
        );
        model.calculateInitialButtonsPositon();
        model.calculateRangeBetweenPosition();
        model.calculateRangeBetweenLength();

        const options: Options = model.getOptions();

        firstSliderButton.setFirstButtonPosition(options);
        secondSliderButton.setSecondButtonPosition(options);
        rangeBetween.setRangeBetweenPosition(options);
        rangeBetween.setRangeBetweenLength(options);
        observer.addObserver(firstSliderButton.setFirstButtonPosition);
        observer.addObserver(secondSliderButton.setSecondButtonPosition);
        observer.addObserver(model.calculateRangeBetweenPosition);
        observer.addObserver(model.calculateRangeBetweenLength);
        observer.addObserver(rangeBetween.setRangeBetweenPosition);
        observer.addObserver(rangeBetween.setRangeBetweenLength);
        firstSliderButton.$firstButton.on('focus', model.changeFirstButtonPositionAfterFocusing);
        secondSliderButton.$secondButton.on('focus', model.changeSecondButtonPositionAfterFocusing);
        firstSliderButton.$firstButton.on('mousedown', () => model.setButtonsGlobalPosition(view.getCoords(firstSliderButton.$firstButton, model.config.isVertical), view.getCoords(secondSliderButton.$secondButton, model.config.isVertical)));
        secondSliderButton.$secondButton.on('mousedown', () => model.setButtonsGlobalPosition(view.getCoords(firstSliderButton.$firstButton, model.config.isVertical), view.getCoords(secondSliderButton.$secondButton, model.config.isVertical)));
        firstSliderButton.$firstButton.on('mousedown', model.calculateFirstButtonPosition);
        secondSliderButton.$secondButton.on('mousedown', model.calculateSecondButtonPosition);
      }
    }

    const observer = new Observer();
    const model = new Model();
    const view = new View();
    const tooltip = new Tooltip();
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
  isInterval: true,
  minValue: 15,
  maxValue: 250,
  // step: 25,
  from: 55,
  to: 120,
  keyboard: true,
  isTooltip: false,
  isVertical: false
});