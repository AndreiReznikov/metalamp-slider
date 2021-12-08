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

      position: string;
      lengthParameter: string;
      firstButtonPositon: number;
      secondButtonPositon: number;
      rangeBetweenPosition: number;
      rangeBetweenLength: number;

      constructor() {
        this.position = this.config.isVertical ? 'top' : 'left';
        this.lengthParameter = this.config.isVertical ? 'height' : 'width';
        this.firstButtonPositon = 0;
        this.secondButtonPositon = 0;
        this.rangeBetweenPosition = 0;
        this.rangeBetweenLength = 0;
      }

      calculateInitialButtonsPositon = (sliderLength: number, buttonLength: number) => {
        const minRatio = this.config.minValue/(this.config.maxValue - this.config.minValue);
        const fromRatio = this.config.from/(this.config.maxValue - this.config.minValue);
        const toRatio = this.config.to/(this.config.maxValue - this.config.minValue);
        
        this.firstButtonPositon = Math.round((fromRatio - minRatio) * sliderLength - buttonLength/2);

        if (!this.config.isInterval) return;

        this.secondButtonPositon = Math.round((toRatio - minRatio) * sliderLength - buttonLength/2);
      }

      calculateRangeBetweenPosition = (buttonLength: number) => {
        if (this.config.isInterval) this.rangeBetweenPosition = this.firstButtonPositon + buttonLength/2;
      }

      calculateRangeBetweenLength = (buttonLength: number) => {
        this.rangeBetweenLength = this.firstButtonPositon + buttonLength/2;

        if (!this.config.isInterval) return;

        this.rangeBetweenLength = this.secondButtonPositon - this.firstButtonPositon + buttonLength/2;
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
        model.calculateInitialButtonsPositon(parseInt(slider.$slider.css(model.lengthParameter)), parseInt(firstSliderButton.$firstButton.css(model.lengthParameter)));
        model.calculateRangeBetweenPosition(parseInt(firstSliderButton.$firstButton.css(model.lengthParameter)));
        model.calculateRangeBetweenLength(parseInt(firstSliderButton.$firstButton.css(model.lengthParameter)));
        firstSliderButton.setFirstButtonPosition(model.position, model.firstButtonPositon);
        secondSliderButton.setSecondButtonPosition(model.position, model.secondButtonPositon);
        rangeBetween.setRangeBetweenPosition(model.position, model.rangeBetweenPosition);
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