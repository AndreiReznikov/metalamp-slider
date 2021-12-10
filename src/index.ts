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
      isVertical: boolean;
      isTooltip: boolean;
      color?: string;
      tooltipColor?: string;
    }

    class Observer {
      observers: Function[] = [];

      addObserver = (observer: Function) => {
        this.observers.push(observer);
      }

      notifyObservers = (data: {}) => {
        for (let i = 0; i < this.observers.length; i++) {
          this.observers[i](data);
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
        isVertical: false,
        isTooltip: true 
      };

      config: Config = $.extend({}, this.data, options);

      positionParameter: string = this.config.isVertical ? 'top' : 'left';
      lengthParameter: string  = this.config.isVertical ? 'height' : 'width';
      sliderPosition: number = 0;
      sliderLength: number = 0;
      buttonLength: number = 0;
      stepLength: number = 0;
      firstButtonPositon: number = 0;
      secondButtonPositon: number = 0;
      firstButtonGlobalPositon: number = 0;
      secondButtonGlobalPositon: number = 0;
      rangeBetweenPosition: number = 0;
      rangeBetweenLength: number = 0;

      setSliderElementsParameters = (sliderPosition: number, sliderLength: number, buttonLength: number) => {
        this.sliderPosition = sliderPosition;
        this.sliderLength = sliderLength;
        this.buttonLength = buttonLength;
      }

      setButtonsGlobalPosition = (firstButtonGlobalPosition: number, secondButtonGlobalPosition: number) => {
        this.firstButtonGlobalPositon = firstButtonGlobalPosition;
        this.secondButtonGlobalPositon = secondButtonGlobalPosition;
      }

      calculateInitialButtonsPositon = () => {
        const minRatio = this.config.minValue/(this.config.maxValue - this.config.minValue);
        const fromRatio = this.config.from/(this.config.maxValue - this.config.minValue);
        const toRatio = this.config.to/(this.config.maxValue - this.config.minValue);
        
        this.firstButtonPositon = Math.round((fromRatio - minRatio) * this.sliderLength - this.buttonLength/2);

        if (this.config.isInterval) {
          this.secondButtonPositon = Math.round((toRatio - minRatio) * this.sliderLength -this. buttonLength/2);
        }
      }

      calculateRangeBetweenPosition = () => {
        if (this.config.isInterval) this.rangeBetweenPosition = this.firstButtonPositon + this.buttonLength/2;
      }

      calculateRangeBetweenLength = () => {
        this.rangeBetweenLength = this.firstButtonPositon + this.buttonLength/2;

        if (this.config.isInterval) {
          this.rangeBetweenLength = this.secondButtonPositon - this.firstButtonPositon;
        }
      }

      calculateStepLength = () => {
        this.stepLength = Math.round((this.config.step/(this.config.maxValue - this.config.minValue)) * this.sliderLength);
      }

      calculateFirstButtonPosition = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const shiftX1 = event.clientX - this.firstButtonGlobalPositon;
        const shiftY1 = event.clientY - this.firstButtonGlobalPositon;
        const shiftAxis1 = this.config.isVertical ? shiftY1 : shiftX1;

        const calculateWhileFirstButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX1 = event.clientX;
          const clientY1 = event.clientY;
          const clientAxis1 = this.config.isVertical ? clientY1 : clientX1;

          this.firstButtonPositon = clientAxis1 - shiftAxis1 - this.sliderPosition;

          if (this.firstButtonPositon < 0 - this.buttonLength/2) {
            this.firstButtonPositon = 0 - this.buttonLength/2;
          }
          else if (this.config.isInterval && this.firstButtonPositon > this.secondButtonPositon) {
            this.firstButtonPositon = this.secondButtonPositon;
          }
          else if (this.firstButtonPositon > this.sliderLength - this.buttonLength/2) {
            this.firstButtonPositon = this.sliderLength - this.buttonLength/2;
          }

          observer.notifyObservers({
            positionParameter: this.positionParameter,
            lengthParameter: this.lengthParameter,
            firstButtonPosition: this.firstButtonPositon,
            rangeBetweenPosition: this.rangeBetweenPosition,
            rangeBetweenLength: this.rangeBetweenLength
          });
        }

        $(document).on('mousemove', calculateWhileFirstButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileFirstButtonMoving));
      }

      calculateSecondButtonPosition = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const shiftX2 = event.clientX - this.secondButtonGlobalPositon;
        const shiftY2 = event.clientY - this.secondButtonGlobalPositon;
        const shiftAxis2 = this.config.isVertical ? shiftY2 : shiftX2;

        const calculateWhileSecondButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX2 = event.clientX;
          const clientY2 = event.clientY;
          const clientAxis2 = model.config.isVertical ? clientY2 : clientX2;

          this.secondButtonPositon = clientAxis2 - shiftAxis2 - this.sliderPosition;

          if (this.secondButtonPositon < this.firstButtonPositon) {
            this.secondButtonPositon = this.firstButtonPositon;
          }
          else if (this.secondButtonPositon > this.sliderLength - this.buttonLength/2) {
            this.secondButtonPositon = this.sliderLength - this.buttonLength/2;
          }

          observer.notifyObservers({
            positionParameter: this.positionParameter,
            lengthParameter: this.lengthParameter,
            firstButtonPosition: this.firstButtonPositon,
            secondButtonPositon: model.secondButtonPositon,
            rangeBetweenPosition: this.rangeBetweenPosition,
            rangeBetweenLength: this.rangeBetweenLength
          });
        }

        $(document).on('mousemove', calculateWhileSecondButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileSecondButtonMoving));
      }
    }

    class View {

      init = (isInterval: boolean, isTooltip: boolean) => {
        slider.$slider.appendTo($this).addClass('slider__line');
        rangeBetween.$rangeBetween.appendTo(slider.$slider).addClass('slider__between');
        firstSliderButton.$firstButton.appendTo(slider.$slider).addClass('slider__first-button');
        minAndMaxValues.$minValueElement.appendTo(slider.$slider).addClass('slider__min-value');
        minAndMaxValues.$maxValueElement.appendTo(slider.$slider).addClass('slider__max-value');

        if (isInterval) {
          secondSliderButton.$secondButton.appendTo(slider.$slider).addClass('slider__second-button');
        }

        if (isTooltip) {
          tooltip.$tooltip2.appendTo(slider.$slider).addClass('slider__second-tooltip');

          if (!isInterval) return;
          tooltip.$tooltip1.appendTo(slider.$slider).addClass('slider__first-tooltip');
        }
      }

      setPlane = (isVertical: boolean) => {
        if (isVertical) {
          $this.css('width', '8px');
          $this.css('height', '500px');
          firstSliderButton.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          secondSliderButton.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          return;
        }

        $this.css('width', '500px');
        $this.css('height', '8px');
        firstSliderButton.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
        secondSliderButton.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'});     
      }

      getCoords = (el: JQuery<HTMLElement>, isVertical: boolean) => {
          const coords: JQuery.Coordinates = el.offset()!;
        
          return isVertical ? coords.top : coords.left;
      }
    }
    

    class Slider extends View {
      $slider = $('<div/>');
    }

    class RangeBetween extends View {
      $rangeBetween = $('<div/>');

      setRangeBetweenPosition = (options: any) => {
        this.$rangeBetween.css(options.positionParameter, options.rangeBetweenPosition);
      }

      setRangeBetweenLength = (options: any) => {
        this.$rangeBetween.css(options.lengthParameter, options.rangeBetweenLength);
      }
    }

    class FirstSliderButton extends View {
      $firstButton = $('<button/>');

      setFirstButtonPosition = (options: any) => {
        this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
      }
    }

    class SecondSliderButton extends View {
      $secondButton = $('<button/>');

      setSecondButtonPosition = (options: any) => {
        this.$secondButton.css(options.positionParameter, options.secondButtonPositon);
      }
    }

    class Tooltip extends View {
      $tooltip1 = $('<div/>');
      $tooltip2 = $('<div/>');
    }

    class MinAndMaxValues extends View {
      $minValueElement = $('<div/>');
      $maxValueElement = $('<div/>');
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
        firstSliderButton.setFirstButtonPosition({
          positionParameter: model.positionParameter,
          lengthParameter: model.lengthParameter,
          firstButtonPosition: model.firstButtonPositon,
          rangeBetweenPosition: model.rangeBetweenPosition,
          rangeBetweenLength: model.rangeBetweenLength
        });
        secondSliderButton.setSecondButtonPosition({
          positionParameter: model.positionParameter,
          lengthParameter: model.lengthParameter,
          firstButtonPosition: model.firstButtonPositon,
          secondButtonPositon: model.secondButtonPositon,
          rangeBetweenPosition: model.rangeBetweenPosition,
          rangeBetweenLength: model.rangeBetweenLength
        });
        model.calculateRangeBetweenPosition();
        model.calculateRangeBetweenLength();
        rangeBetween.setRangeBetweenPosition({
          positionParameter: model.positionParameter,
          lengthParameter: model.lengthParameter,
          firstButtonPosition: model.firstButtonPositon,
          rangeBetweenPosition: model.rangeBetweenPosition,
          rangeBetweenLength: model.rangeBetweenLength
        });
        rangeBetween.setRangeBetweenLength({
          positionParameter: model.positionParameter,
          lengthParameter: model.lengthParameter,
          firstButtonPosition: model.firstButtonPositon,
          rangeBetweenPosition: model.rangeBetweenPosition,
          rangeBetweenLength: model.rangeBetweenLength
        });
        observer.addObserver(firstSliderButton.setFirstButtonPosition);
        observer.addObserver(secondSliderButton.setSecondButtonPosition);
        observer.addObserver(model.calculateRangeBetweenPosition);
        observer.addObserver(model.calculateRangeBetweenLength);
        observer.addObserver(rangeBetween.setRangeBetweenPosition);
        observer.addObserver(rangeBetween.setRangeBetweenLength);
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

$('.slider').mySlider({
  isInterval: false,
  minValue: 15,
  maxValue: 250,
  // step: 25,
  from: 35,
  to: 120,
  isTooltip: false,
  isVertical: false
});