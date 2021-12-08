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

        if (!this.config.isInterval) return;

        this.secondButtonPositon = Math.round((toRatio - minRatio) * this.sliderLength -this. buttonLength/2);
      }

      calculateRangeBetweenPosition = () => {
        if (this.config.isInterval) this.rangeBetweenPosition = this.firstButtonPositon + this.buttonLength/2;
      }

      calculateRangeBetweenLength = () => {
        this.rangeBetweenLength = this.firstButtonPositon + this.buttonLength/2;

        if (!this.config.isInterval) return;

        this.rangeBetweenLength = this.secondButtonPositon - this.firstButtonPositon + this.buttonLength/2;
      }

      calculateStepLength = () => {
        this.stepLength = Math.round((this.config.step/(this.config.maxValue - this.config.minValue)) * this.sliderLength);
      }

      calculateFirstButtonPosition = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();

        const shiftX1 = event.clientX - this.firstButtonGlobalPositon + this.sliderPosition;
        const shiftY1 = event.clientY - this.firstButtonGlobalPositon + this.sliderPosition;
        const shiftAxis1 = this.config.isVertical ? shiftY1 : shiftX1;

        const calculateWhileFirstButtonMoving = (event: JQuery.MouseMoveEvent) => {
          const clientX1 = event.clientX;
          const clientY1 = event.clientY;
          const clientAxis1 = this.config.isVertical ? clientY1 : clientX1;

          this.firstButtonPositon = clientAxis1 - shiftAxis1;

          console.log(this.firstButtonPositon);
        }

        $(document).on('mousemove', calculateWhileFirstButtonMoving);
        $(document).on('mouseup', () => $(document).off('mousemove', calculateWhileFirstButtonMoving));
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

      setRangeBetweenPosition = (position: string, rangeBetweenPositon: number) => {
        this.$rangeBetween.css(position, rangeBetweenPositon);
      }

      setRangeBetweenLength = (lengthParameter: string, rangeBetweenLength: number) => {
        this.$rangeBetween.css(lengthParameter, rangeBetweenLength);
      }
    }

    class FirstSliderButton extends View {
      $firstButton = $('<button/>');

      setFirstButtonPosition = (position: string, firstButtonPositon: number) => {
        this.$firstButton.css(position, firstButtonPositon);
      }
    }

    class SecondSliderButton extends View {
      $secondButton = $('<button/>');

      setSecondButtonPosition = (position: string, secondButtonPositon: number) => {
        this.$secondButton.css(position, secondButtonPositon);
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
        model.calculateRangeBetweenPosition();
        model.calculateRangeBetweenLength();
        firstSliderButton.$firstButton.on('mousedown', model.calculateFirstButtonPosition);
        firstSliderButton.setFirstButtonPosition(model.positionParameter, model.firstButtonPositon);
        secondSliderButton.setSecondButtonPosition(model.positionParameter, model.secondButtonPositon);
        model.setButtonsGlobalPosition(view.getCoords(firstSliderButton.$firstButton, model.config.isVertical), view.getCoords(secondSliderButton.$secondButton, model.config.isVertical));
        rangeBetween.setRangeBetweenPosition(model.positionParameter, model.rangeBetweenPosition);
        rangeBetween.setRangeBetweenLength(model.lengthParameter, model.rangeBetweenLength);
      }
    }

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