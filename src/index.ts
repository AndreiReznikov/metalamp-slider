import "./index.css";

(function($) {
  const mySlider = function(input: JQuery<HTMLElement>, options: {}): JQuery {

    const $slider = input;
    
    // class Model {
    //   // config = $.extend({}, options);
    // }

    interface Config {
      isInterval?: boolean;
      minValue: number;
      maxValue: number;
      isTooltip?: boolean;
    }

    class View {
      data: Config = {
        isInterval: false,
        minValue: 0,
        maxValue: 100,
        isTooltip: true
      };

      config: Config = $.extend({}, this.data, options);

      $rangeBetween = $('<div/>').appendTo($slider).addClass('slider__between');
      $secondButton = $('<button/>').appendTo($slider).addClass('slider__second-button');
      $firstButton = $('<button/>');

      addInterval = () => {
        if (this.config.isInterval) {
          this.$firstButton.appendTo($slider).addClass('slider__first-button');
        }
      }

      addValues = () => {
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;

        const minValueElement = $('<div/>').appendTo($slider).addClass('slider__min-value');
        const maxValueElement = $('<div/>').appendTo($slider).addClass('slider__max-value');

        minValueElement.html(`${minValue}`);
        maxValueElement.html(`${maxValue}`);

        const sliderWidth = parseInt($slider.css('width'));
        const minValueElementWidth = parseInt(minValueElement.css('width'));
        const maxValueElementWidth = parseInt(maxValueElement.css('width'));

        minValueElement.css('left', 0 - minValueElementWidth/2)
        maxValueElement.css('left', sliderWidth - maxValueElementWidth/2)
      }

      addTooltip = () => {
        const isTooltip = this.config.isTooltip;
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;

        if (isTooltip) {
          const tooltip1 = $('<div/>').appendTo($slider).addClass('slider__first-tooltip');
          const tooltip2 = $('<div/>').appendTo($slider).addClass('slider__second-tooltip');

          const moveTooltip = () => {
            const tooltipValue1 = Math.round(((parseInt(this.$firstButton.css('left')) + parseInt(this.$firstButton.css('width'))/2)/(parseInt($slider.css('width'))) * (maxValue - minValue)) + minValue);
            const tooltipValue2 = Math.round(((parseInt(this.$secondButton.css('left')) + parseInt(this.$secondButton.css('width'))/2)/(parseInt($slider.css('width'))) * (maxValue - minValue)) + minValue);
            const tooltipPositionLeft1 = (parseInt(this.$firstButton.css('left') ) + parseInt(this.$firstButton.css('width'))/2) - parseInt(tooltip1.css('width'))/2;
            const tooltipPositionLeft2 = (parseInt(this.$secondButton.css('left') ) + parseInt(this.$secondButton.css('width'))/2) - parseInt(tooltip2.css('width'))/2;

            if (this.config.isInterval) {
              tooltip1.html(`${tooltipValue1}`);
              tooltip1.css('left', tooltipPositionLeft1);
            }
            else {
              tooltip1.css('display', 'none');
            }

            tooltip2.html(`${tooltipValue2}`);
            tooltip2.css('left', tooltipPositionLeft2);

            const areTooltipsClose = parseInt(tooltip1.css('left')) + parseInt(tooltip1.css('width')) > parseInt(tooltip2.css('left'));
            const tooltipClosePositionLeft1 = parseInt(this.$firstButton.css('left')) - parseInt(tooltip1.css('width'));
            const tooltipClosePositionLeft2 = parseInt(this.$secondButton.css('left')) + parseInt(this.$secondButton.css('width'));

            if (areTooltipsClose) {
              tooltip1.css('left', tooltipClosePositionLeft1);
              tooltip2.css('left', tooltipClosePositionLeft2);
            }
          };

          $(document).on('mousemove', moveTooltip);
        }
      }

      grabSecondSlider = (event: JQuery.MouseDownEvent) => {
        const shiftX2 = event.clientX - this.getCoords(this.$secondButton).left;

        const moveSecondSlider = (event: JQuery.MouseMoveEvent) => {
          const clientX2 = event.clientX;
          const buttonWidth = parseInt(this.$secondButton.css('width'));
          const sliderWidth = parseInt($slider.css('width'));

          this.$secondButton.css('left', clientX2 - shiftX2);

          if (!this.config.isInterval) {
            const secondButtonLeft = parseInt(this.$secondButton.css('left'));

            this.$rangeBetween.css('width', secondButtonLeft + buttonWidth/2);

            if (secondButtonLeft < 0 - buttonWidth/2) {
              this.$secondButton.css('left', 0 - buttonWidth/2);
            }
            else if (secondButtonLeft > sliderWidth - buttonWidth/2) {
              this.$secondButton.css('left', sliderWidth - buttonWidth/2);
              this.$rangeBetween.css('width', sliderWidth);
            }
          }
          else {
            const firstButtonLeft = parseInt(this.$firstButton.css('left'));
            const secondButtonLeft = parseInt(this.$secondButton.css('left'));

            this.$secondButton.css('z-index', 0);
            this.$secondButton.css('z-index', 1);

            this.$rangeBetween.css('left', firstButtonLeft + buttonWidth/2);
            this.$rangeBetween.css('width', secondButtonLeft - firstButtonLeft);

            if (secondButtonLeft < firstButtonLeft) {
              this.$secondButton.css('left', firstButtonLeft);
            }
            else if (secondButtonLeft > sliderWidth - buttonWidth/2) {
              this.$secondButton.css('left', sliderWidth - buttonWidth/2);
              this.$rangeBetween.css('width', sliderWidth - firstButtonLeft);
            }
          }
        }

        $(document).on('mousemove', moveSecondSlider);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', moveSecondSlider);
        });
      }

      grabFirstSlider = (event: JQuery.MouseDownEvent) => {
        const shiftX1 = event.clientX - this.getCoords(this.$firstButton).left;

        const moveFirstSlider = (event: JQuery.MouseMoveEvent) => {
          const clientX1 = event.clientX;

          this.$firstButton.css('left', clientX1 - shiftX1);

          const firstButtonLeft = parseInt(this.$firstButton.css('left'));
          const secondButtonLeft = parseInt(this.$secondButton.css('left'));
          const buttonWidth = parseInt(this.$firstButton.css('width'));

          this.$secondButton.css('z-index', 1);
          this.$secondButton.css('z-index', 0);

          this.$rangeBetween.css('left', firstButtonLeft + buttonWidth/2);
          this.$rangeBetween.css('width', secondButtonLeft - firstButtonLeft);

          if (firstButtonLeft < 0 - buttonWidth/2) {
            this.$firstButton.css('left', 0 - buttonWidth/2);
            this.$rangeBetween.css('left', 0);
            this.$rangeBetween.css('width', secondButtonLeft + buttonWidth/2);
          }
          else if (firstButtonLeft + buttonWidth > secondButtonLeft + buttonWidth) {
            this.$firstButton.css('left', secondButtonLeft);
          }
        }

        $(document).on('mousemove', moveFirstSlider);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', moveFirstSlider);
        });
      }

      dragSlider = () => {
        this.$secondButton.on('mousedown', this.grabSecondSlider);
        this.$firstButton.on('mousedown', this.grabFirstSlider);
      }

      getCoords = (el: JQuery) => {
        const coords = el.position();
        return {
            top: coords.top,
            left: coords.left,
        }
      }
    }

    // class Presenter {
    //   model;
    //   view;

    //   constructor(model: {}, view: {}) {
    //     this.model = model;
    //     this.view = view;
    //   }
    // }

    let view = new View();

    view.dragSlider();
    view.addInterval();
    view.addValues();
    view.addTooltip();

    return input;
  };

  $.fn.mySlider = function(options: {}) {
    return this.each(function() {
      mySlider($(this), options)
    })
  }
})(jQuery);

$('.slider').mySlider({
  isInterval: true,
  minValue: 12,
  maxValue: 500,
  isTooltip: true
});
