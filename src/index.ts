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
    }

    class View {

      init = (isInterval: boolean, isTooltip: boolean) => {
        slider.$slider.appendTo($this).addClass('slider__line');
        rangeBetween.$rangeBetween.appendTo(slider.$slider).addClass('slider__between');
        secondSliderButton.$secondButton.appendTo(slider.$slider).addClass('slider__second-button');
        minAndMaxValues.minValueElement.appendTo(slider.$slider).addClass('slider__min-value');
        minAndMaxValues.maxValueElement.appendTo(slider.$slider).addClass('slider__max-value');

        if (isInterval) {
          firstSliderButton.$firstButton.appendTo(slider.$slider).addClass('slider__first-button');
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
    }

    class FirstSliderButton extends View {
      $firstButton = $('<button/>');
    }

    class SecondSliderButton extends View {
      $secondButton = $('<button/>');
    }

    class Tooltip extends View {
      $tooltip1 = $('<div/>');
      $tooltip2 = $('<div/>');
    }

    class MinAndMaxValues extends View {
      minValueElement = $('<div/>');
      maxValueElement = $('<div/>');
    }

    class Presenter {

      constructor() {
        view.init(model.config.isInterval, model.config.isTooltip);
        view.setPlane(model.config.isVertical);
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
  from: 40,
  to: 120,
  isTooltip: true,
  isVertical: false
});