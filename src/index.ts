import "./index.css";

(function($) {
  $.fn.mySlider = function(options: {}): JQuery {

    const $slider = this;
    
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

        const isNumber = (value: number) => {
          return typeof(value) === 'number';
        }

        if (isNumber(minValue) && isNumber(maxValue)) {
          const minValueElement = $('<div/>').appendTo($slider).addClass('slider__min-value');
          const maxValueElement = $('<div/>').appendTo($slider).addClass('slider__max-value');

          minValueElement.html(`${this.config.minValue}`);
          maxValueElement.html(`${this.config.maxValue}`);

          const sliderWidth = parseInt($slider.css('width'));
          const minValueElementWidth = parseInt(minValueElement.css('width'));
          const maxValueElementWidth = parseInt(maxValueElement.css('width'));

          minValueElement.css('left', 0 - minValueElementWidth / 2)
          maxValueElement.css('left', sliderWidth - maxValueElementWidth / 2)
        }
      }

      addTooltip = () => {
        const isTooltip = this.config.isTooltip;
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;

        if (isTooltip) {
          const tooltip1 = $('<div/>').appendTo($slider).addClass('slider__first-tooltip');
          const tooltip2 = $('<div/>').appendTo($slider).addClass('slider__second-tooltip');

          const moveTooltip = (event: JQuery.MouseMoveEvent) => {
            const tooltipValue1 = Math.round(((parseInt(this.$firstButton.css('left')) + parseInt(this.$firstButton.css('width'))/2)/(parseInt($slider.css('width'))) * maxValue));
            const tooltipValue2 = Math.round(((parseInt(this.$secondButton.css('left')) + parseInt(this.$secondButton.css('width'))/2)/(parseInt($slider.css('width'))) * maxValue));
            const tooltipPositionLeft1 = (parseInt(this.$firstButton.css('left') ) + parseInt(this.$firstButton.css('width'))/2) - parseInt(tooltip1.css('width'))/2;
            const tooltipPositionLeft2 = (parseInt(this.$secondButton.css('left') ) + parseInt(this.$secondButton.css('width'))/2) - parseInt(tooltip2.css('width'))/2;

            if (this.config.isInterval) {
              tooltip1.html(`${tooltipValue1}`);
              tooltip1.css('left', tooltipPositionLeft1);
            }

            tooltip2.html(`${tooltipValue2}`);
            tooltip2.css('left', tooltipPositionLeft2);
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

          if (!this.config.isInterval) {
            this.$secondButton.css('left', clientX2 - shiftX2);
            this.$rangeBetween.css('width', clientX2 - shiftX2);

            const secondButtonLeft = parseInt(this.$secondButton.css('left'));

            if (secondButtonLeft < 0 - buttonWidth/2) {
              this.$secondButton.css('left', 0 - buttonWidth/2);
            }
            else if (secondButtonLeft > sliderWidth - buttonWidth/2) {
              this.$secondButton.css('left', sliderWidth - buttonWidth/2);
              this.$rangeBetween.css('width', sliderWidth);
            }
          }
          else {
            this.$secondButton.css('left', clientX2 - shiftX2);

            const firstButtonLeft = parseInt(this.$firstButton.css('left'));
            const secondButtonLeft = parseInt(this.$secondButton.css('left'));

            this.$rangeBetween.css('left', firstButtonLeft);
            this.$rangeBetween.css('width', secondButtonLeft - firstButtonLeft);

            if (secondButtonLeft < firstButtonLeft + buttonWidth) {
              this.$secondButton.css('left', firstButtonLeft + buttonWidth);
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

          this.$rangeBetween.css('left', clientX1 - shiftX1);
          this.$rangeBetween.css('width', secondButtonLeft - firstButtonLeft);

          if (firstButtonLeft < 0 - buttonWidth/2) {
            this.$firstButton.css('left', 0 - buttonWidth/2);
            this.$rangeBetween.css('left', 0);
            this.$rangeBetween.css('width', secondButtonLeft);
          }
          else if (firstButtonLeft + buttonWidth > secondButtonLeft) {
            this.$firstButton.css('left', secondButtonLeft - buttonWidth);
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

    return this;
  };
})(jQuery);

$('.slider').mySlider({isInterval: true, maxValue: 500, minValue: 0, isTooltip: true});
