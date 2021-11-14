import "./index.css";

(function($) {
  const mySlider = function(input: JQuery<HTMLElement>, options: {}): JQuery {

    const $this = input;
    
    // class Model {
    //   // config = $.extend({}, options);
    // }

    interface Config {
      isInterval?: boolean;
      minValue: number;
      maxValue: number;
      from: number;
      to: number;
      step: number;
      isVertical?: boolean;
      isTooltip?: boolean;
      color?: string;
      tooltipColor?: string;
    }

    class View {
      data: Config = {
        isInterval: false,
        minValue: 0,
        maxValue: 100,
        from: 10,
        to: 50,
        step: 0,
        isTooltip: true 
      };

      config: Config = $.extend({}, this.data, options);

      $slider = $('<div/>').appendTo($this).addClass('slider__line');
      $rangeBetween = $('<div/>').appendTo(this.$slider).addClass('slider__between');
      $secondButton = $('<button/>').appendTo(this.$slider).addClass('slider__second-button');
      $firstButton = $('<button/>');
      tooltip1 = $('<div/>');
      tooltip2 = $('<div/>');

      addInterval = () => {
        if (this.config.isInterval) {
          this.$firstButton.appendTo(this.$slider).addClass('slider__first-button');
        }
      }

      addFromAndToValues = () => {
        const from = this.config.from;
        const to = this.config.to;
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;
        const minValueRatio = minValue/(maxValue - minValue);
        const fromRatio = from/(maxValue - minValue);
        const toRatio = to/(maxValue - minValue);
        const buttonWidth = parseInt(this.$secondButton.css('width'));
        const position = this.config.isVertical ? 'top' : 'left';
        const lengthParameter = this.config.isVertical ? 'height' : 'width';
        const fromPositonLeft = fromRatio * parseInt(this.$slider.css(lengthParameter));
        const toPositonLeft = toRatio * parseInt(this.$slider.css(lengthParameter));
        const fromMinValuePositonLeft = minValueRatio * parseInt(this.$slider.css(lengthParameter));

        if (minValue < 0 && maxValue < 0) {
          const minuxMaxValueRatio = maxValue/(minValue - maxValue);
          const minusFromRatio = from/(minValue - maxValue);
          const minusToRatio = to/(minValue - maxValue);

          const secondButtonMarginRatio = minusToRatio - minuxMaxValueRatio;
          const secondButtonStartPosition = secondButtonMarginRatio * parseInt(this.$slider.css(lengthParameter));

          const firstButtonMarginRatio = minusFromRatio - minuxMaxValueRatio;
          const firstButtonStartPosition = firstButtonMarginRatio * parseInt(this.$slider.css(lengthParameter));

          if (this.config.isInterval) {
            this.$firstButton.css(position, parseInt(this.$slider.css(lengthParameter)) - firstButtonStartPosition - buttonWidth/2);
          }

          this.$secondButton.css(position, parseInt(this.$slider.css(lengthParameter)) - secondButtonStartPosition - buttonWidth/2);
        }
        else {
            if (this.config.isInterval) {
              this.$firstButton.css(position, fromPositonLeft - fromMinValuePositonLeft - buttonWidth/2);
            }
          this.$secondButton.css(position, toPositonLeft - fromMinValuePositonLeft - buttonWidth/2);
        }

        if (this.config.isInterval) {
          this.$rangeBetween.css(position, parseInt(this.$firstButton.css(position)) + buttonWidth/2);
          this.$rangeBetween.css(lengthParameter, parseInt(this.$secondButton.css(position)) - parseInt(this.$firstButton.css(position)));
        }
        else {
          this.$rangeBetween.css(position, 0);
          this.$rangeBetween.css(lengthParameter, parseInt(this.$secondButton.css(position)) + buttonWidth/2);
        }

        this.addTooltip();
      }

      addMinAndMaxValues = () => {
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;

        const minValueElement = $('<div/>').appendTo(this.$slider).addClass('slider__min-value');
        const maxValueElement = $('<div/>').appendTo(this.$slider).addClass('slider__max-value');

        minValueElement.html(`${minValue}`);
        maxValueElement.html(`${maxValue}`);

        const sliderWidth = parseInt(this.$slider.css('width'));
        const buttonWidth = parseInt(this.$secondButton.css('width'));
        const minValueElementWidth = parseInt(minValueElement.css('width'));
        const maxValueElementWidth = parseInt(maxValueElement.css('width'));

        minValueElement.css('left', 0 - minValueElementWidth/2);
        maxValueElement.css('left', sliderWidth - maxValueElementWidth/2);

        minValueElement.mousedown((event: JQuery.MouseDownEvent) => {
          minValueElement.mouseup((event: JQuery.MouseUpEvent) => {
            if (this.config.isInterval) {
              this.$firstButton.css('left', 0 - buttonWidth/2);
              this.$rangeBetween.css('left', 0);
              this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) - parseInt(this.$firstButton.css('left')));
            }
            else {
              this.$secondButton.css('left', 0 - buttonWidth/2);
              this.$rangeBetween.css('width', 0);
            }
  
            event.stopPropagation();
            this.addTooltip();
          })

          event.stopPropagation();
        });

        maxValueElement.mousedown((event: JQuery.MouseDownEvent) => {
          maxValueElement.mouseup((event: JQuery.MouseUpEvent) => {
            if (this.config.isInterval) {
              this.$secondButton.css('left', sliderWidth - buttonWidth/2);
              this.$rangeBetween.css('left', parseInt(this.$firstButton.css('left')) + buttonWidth/2);
              this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) - parseInt(this.$firstButton.css('left')));
            }
            else {
              this.$secondButton.css('left', sliderWidth - buttonWidth/2);
              this.$rangeBetween.css('width', sliderWidth);
            }
  
            event.stopPropagation();
            this.addTooltip();
          })

          event.stopPropagation();
        });
      }

      addTooltip = () => {
        const isTooltip = this.config.isTooltip;
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;
        const tooltip1 = this.tooltip1;
        const tooltip2 = this.tooltip2;

        if (isTooltip) {
          tooltip1.appendTo(this.$slider).addClass('slider__first-tooltip');
          tooltip2.appendTo(this.$slider).addClass('slider__second-tooltip');

          const moveTooltip = () => {
            const tooltipValue1 = Math.round(((parseInt(this.$firstButton.css('left')) + parseInt(this.$firstButton.css('width'))/2)/(parseInt(this.$slider.css('width'))) * (maxValue - minValue)) + minValue);
            const tooltipValue2 = Math.round(((parseInt(this.$secondButton.css('left')) + parseInt(this.$secondButton.css('width'))/2)/(parseInt(this.$slider.css('width'))) * (maxValue - minValue)) + minValue);
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

          moveTooltip();
        }
      }

      changeColor = () => {
        if (this.config.color) {
          const color = this.config.color;

          this.$firstButton.css('background-color', color);
          this.$secondButton.css('background-color', color);
          this.$rangeBetween.css('background-color', color);
        }
      }

      changeTooltipColor = () => {
        if (this.config.tooltipColor) {
          const tooltipColor = this.config.tooltipColor;

          this.tooltip1.css('background-color', tooltipColor);
          this.tooltip2.css('background-color', tooltipColor);
        }
      }

      switchToVerticalView = () => {
        if (this.config.isVertical) {
          $this.css('width', '8px');
          $this.css('height', '500px');
        }
      }

      sliderOnClick = () => {
        this.$slider.mousedown((event: JQuery.MouseDownEvent) => {           
          const clientX = event.clientX;
          const sliderLeft = this.getCoords(this.$slider).left + parseInt(this.$slider.css('margin'));
          const firstButtonLeft = parseInt(this.$firstButton.css('left'));
          const secondButtonLeft = parseInt(this.$secondButton.css('left'));
          const buttonWidth = parseInt(this.$secondButton.css('width'));
          const rangeBetweenWidth = parseInt(this.$rangeBetween.css('width'));
          const step = this.config.step;
          const stepWidth = (step/(this.config.maxValue - this.config.minValue)) * parseInt(this.$slider.css('width'));
          const intervalForFirstButtonStep = firstButtonLeft + buttonWidth/2 - (clientX - sliderLeft);
          const intervalForSecondButtonStep = secondButtonLeft + buttonWidth/2 - (clientX - sliderLeft);
          const firstButtonStepsNumber = intervalForFirstButtonStep/stepWidth;
          const secondButtonStepsNumber = intervalForSecondButtonStep/stepWidth;

          const clickAheadOfFirstSlider = clientX - sliderLeft > firstButtonLeft + buttonWidth && clientX - sliderLeft < firstButtonLeft + buttonWidth + rangeBetweenWidth/2;
          const clickBehindOfFirstSlider = clientX - sliderLeft < firstButtonLeft;
          const clickAheadOfSecondSlider = clientX - sliderLeft > secondButtonLeft + buttonWidth;
          const clickBehindOfSecondSlider = clientX - sliderLeft < secondButtonLeft && clientX - sliderLeft > firstButtonLeft + buttonWidth/2 + rangeBetweenWidth/2;
              
          if (this.config.isInterval) {
            if (clickBehindOfSecondSlider || clickAheadOfSecondSlider) {
              if (this.config.step > 0) {
                this.$secondButton.css('left', parseInt(this.$secondButton.css('left')) - Math.round(secondButtonStepsNumber) * stepWidth);
              }
              else {
                this.$secondButton.css('left', clientX - sliderLeft - buttonWidth/2);
              }
            }
            else if (clickBehindOfFirstSlider || clickAheadOfFirstSlider) {
              if (this.config.step > 0) {
                this.$firstButton.css('left', parseInt(this.$firstButton.css('left')) - Math.round(firstButtonStepsNumber) * stepWidth);
              }
              else {
                this.$firstButton.css('left', clientX - sliderLeft - buttonWidth/2);
              }
              this.$rangeBetween.css('left', parseInt(this.$firstButton.css('left')) + buttonWidth/2);
            }

            this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) - parseInt(this.$firstButton.css('left')) + buttonWidth/2);
          }
          else {
            if (this.config.step > 0) {
              this.$secondButton.css('left', parseInt(this.$secondButton.css('left')) - Math.round(secondButtonStepsNumber) * stepWidth);
            }
            else {
              this.$secondButton.css('left', clientX - sliderLeft - buttonWidth/2);
            }
            this.$rangeBetween.css('width', parseInt(this.$secondButton.css('left')) + buttonWidth/2);
          }
              
          this.addTooltip();
        });
      }

      grabSecondSlider = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();
        const shiftX2 = event.clientX - this.getCoords(this.$secondButton).left;
        const shiftY2 = event.clientY - this.getCoords(this.$secondButton).top;

        const moveSecondSlider = (event: JQuery.MouseMoveEvent) => {
          const clientX2 = event.clientX;
          const clientY2 = event.clientY;
          const buttonWidth = parseInt(this.$secondButton.css('width'));
          const sliderWidth = parseInt(this.$slider.css('width'));
          const sliderHeight = parseInt(this.$slider.css('height'));
          const firstButtonLeft = parseInt(this.$firstButton.css('left'));
          const firstButtonTop = parseInt(this.$firstButton.css('top'));
          const step = this.config.step;
          const stepWidth = (step/(this.config.maxValue - this.config.minValue)) * parseInt(this.$slider.css('width'));
          const sliderLengthParameter = this.config.isVertical ? sliderHeight : sliderWidth;
          const firstButtonLengthParameter = this.config.isVertical ? firstButtonTop : firstButtonLeft;
          const position = this.config.isVertical ? 'top' : 'left';
          const lengthParameter = this.config.isVertical ? 'height' : 'width';

          const isCursorNearStepAhead = clientX2 - $this.position().left + parseInt(this.$slider.css('margin')) > parseInt(this.$secondButton.css('left')) + buttonWidth + stepWidth/2;
          const isCursorNearStepBehind = clientX2 - $this.position().left + parseInt(this.$slider.css('margin')) < parseInt(this.$secondButton.css('left')) - stepWidth/2;
          
          if (step > 0) {
            if (isCursorNearStepAhead) {
              this.$secondButton.css('left', parseInt(this.$secondButton.css('left')) + stepWidth);
            }
            else if (isCursorNearStepBehind) {
              this.$secondButton.css('left', parseInt(this.$secondButton.css('left')) - stepWidth);
            }
          }
          else {
            this.$secondButton.css(position, this.config.isVertical ? (clientY2 - shiftY2) : (clientX2 - shiftX2));
          }

          const secondButtonLengthParameter = parseInt(this.$secondButton.css(position));

          if (this.config.isInterval) {
    
            this.$firstButton.css('z-index', 0);
            this.$secondButton.css('z-index', 1);

            this.$rangeBetween.css(position, firstButtonLengthParameter + buttonWidth/2);
            this.$rangeBetween.css(lengthParameter, secondButtonLengthParameter - firstButtonLengthParameter);

            if (secondButtonLengthParameter < firstButtonLengthParameter) {
              this.$secondButton.css(position, firstButtonLengthParameter);
            }
            else if (secondButtonLengthParameter > sliderLengthParameter - buttonWidth/2) {
              this.$secondButton.css(position, sliderLengthParameter - buttonWidth/2);
              this.$rangeBetween.css(lengthParameter, sliderLengthParameter - firstButtonLengthParameter);
            }
          }
          else {
            this.$rangeBetween.css(lengthParameter, secondButtonLengthParameter + buttonWidth/2);

            if (secondButtonLengthParameter < 0 - buttonWidth/2) {
              this.$secondButton.css(position, 0 - buttonWidth/2);
            }
            else if (secondButtonLengthParameter > sliderLengthParameter - buttonWidth/2) {
              this.$secondButton.css(position, sliderLengthParameter - buttonWidth/2);
              this.$rangeBetween.css(lengthParameter, sliderLengthParameter);
            }
          }

          this.addTooltip();
        }

        $(document).on('mousemove', moveSecondSlider);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', moveSecondSlider);
        });
      }

      grabFirstSlider = (event: JQuery.MouseDownEvent) => {
        event.stopPropagation();
        const shiftX1 = event.clientX - this.getCoords(this.$firstButton).left;
        const shiftY1 = event.clientY - this.getCoords(this.$firstButton).top;

        const moveFirstSlider = (event: JQuery.MouseMoveEvent) => {
          const clientX1 = event.clientX;
          const clientY1 = event.clientY;
          const buttonWidth = parseInt(this.$firstButton.css('width'));
          const step = this.config.step;
          const stepWidth = (step/(this.config.maxValue - this.config.minValue)) * parseInt(this.$slider.css('width'));
          const position = this.config.isVertical ? 'top' : 'left';
          const lengthParameter = this.config.isVertical ? 'height' : 'width';

          const isCursorNearStepAhead = Math.round(clientX1 - $this.position().left + parseInt($this.css('margin'))) > parseInt(this.$firstButton.css('left')) + buttonWidth + stepWidth/2;
          const isCursorNearStepBehind = Math.round(clientX1 - $this.position().left + parseInt(this.$slider.css('margin'))) < parseInt(this.$firstButton.css('left')) - stepWidth/2;
          
          if (step > 0) {
            if (isCursorNearStepAhead) {
              this.$firstButton.css('left', parseInt(this.$firstButton.css('left')) + stepWidth);
            }
            else if (isCursorNearStepBehind) {
              this.$firstButton.css('left', parseInt(this.$firstButton.css('left')) - stepWidth);
            }
          }
          else {
            this.$firstButton.css(position, this.config.isVertical ? (clientY1 - shiftY1) : (clientX1 - shiftX1));
          }

          const firstButtonLengthParameter = parseInt(this.$firstButton.css(position));
          const secondButtonLengthParameter = parseInt(this.$secondButton.css(position));

          this.$rangeBetween.css(position, firstButtonLengthParameter);
          this.$rangeBetween.css(lengthParameter, secondButtonLengthParameter - firstButtonLengthParameter);

          this.$firstButton.css('z-index', 1);
          this.$secondButton.css('z-index', 0);

          if (firstButtonLengthParameter < 0 - buttonWidth/2) {
            this.$firstButton.css(position, 0 - buttonWidth/2);
            this.$rangeBetween.css(position, 0);
            this.$rangeBetween.css(lengthParameter, secondButtonLengthParameter + buttonWidth/2);
          }
          else if (firstButtonLengthParameter > secondButtonLengthParameter) {
            this.$firstButton.css(position, secondButtonLengthParameter);
          }

          this.addTooltip();
        }

        $(document).on('mousemove', moveFirstSlider);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', moveFirstSlider);
        });
      }

      dragSlider = () => {
        this.$firstButton.on('mousedown', this.grabFirstSlider);
        this.$secondButton.on('mousedown', this.grabSecondSlider);
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
    // view.addFromAndToValues();
    // view.addMinAndMaxValues();
    view.addTooltip();
    view.sliderOnClick();
    view.changeColor();
    view.changeTooltipColor();
    view.switchToVerticalView();

    return input;
  };

  $.fn.mySlider = function(options: {}) {
    return this.each(function() {
      mySlider($(this), options);
    });
  }
})(jQuery);

$('.slider').mySlider({
  isInterval: true,
  minValue: 15,
  maxValue: 250,
  // from: 35,
  // to: 120,
  isTooltip: false,
  isVertical: true
});