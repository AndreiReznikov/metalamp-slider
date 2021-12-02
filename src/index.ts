import "./index.css";

(function($) {
  const mySlider = function(input: JQuery<HTMLElement>, options: {}): JQuery {

    const $this = input;
    
    // class Model {
    //   config = $.extend({}, options);
    //   }
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

      // $slider = $('<div/>');

      initSlider = () => {
        slider.$slider.appendTo($this).addClass('slider__line');
        rangeBetween.$rangeBetween.appendTo(slider.$slider).addClass('slider__between');
        secondSliderButton.$secondButton.appendTo(slider.$slider).addClass('slider__second-button');

        if (this.config.isVertical) {
          firstSliderButton.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
          secondSliderButton.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
        }
        else {
          firstSliderButton.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
          secondSliderButton.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
        }
      }
      
      switchToVerticalView = () => {
        if (!this.config.isVertical) return;
        
        $this.css('width', '8px');
        $this.css('height', '500px');
      }

      addInterval = () => {
        if (!this.config.isInterval) return;
        
        firstSliderButton.$firstButton.appendTo(slider.$slider).addClass('slider__first-button');
      }

      addFromAndToValues = () => {
        const from = this.config.from;
        const to = this.config.to;
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;
        const minValueRatio = minValue/(maxValue - minValue);
        const fromRatio = from/(maxValue - minValue);
        const toRatio = to/(maxValue - minValue);
        const buttonWidth = parseInt(secondSliderButton.$secondButton.css('width'));
        const position = this.config.isVertical ? 'top' : 'left';
        const lengthParameter = this.config.isVertical ? 'height' : 'width';
        const fromPositonLeft = (fromRatio - minValueRatio) * parseInt(slider.$slider.css(lengthParameter));
        const toPositonLeft = (toRatio - minValueRatio) * parseInt(slider.$slider.css(lengthParameter));

        if (minValue < 0 && maxValue < 0) {
          const minuxMaxValueRatio = maxValue/(minValue - maxValue);
          const minusFromRatio = from/(minValue - maxValue);
          const minusToRatio = to/(minValue - maxValue);

          const secondButtonMarginRatio = minusToRatio - minuxMaxValueRatio;
          const secondButtonStartPosition = secondButtonMarginRatio * parseInt(slider.$slider.css(lengthParameter));

          const firstButtonMarginRatio = minusFromRatio - minuxMaxValueRatio;
          const firstButtonStartPosition = firstButtonMarginRatio * parseInt(slider.$slider.css(lengthParameter));

          if (this.config.isInterval) {
            firstSliderButton.$firstButton.css(position, Math.round(parseInt(slider.$slider.css(lengthParameter)) - firstButtonStartPosition - buttonWidth/2));
          }

          secondSliderButton.$secondButton.css(position, Math.round(parseInt(slider.$slider.css(lengthParameter)) - secondButtonStartPosition - buttonWidth/2));
        }
        else {
          secondSliderButton.$secondButton.css(position, Math.round(toPositonLeft - buttonWidth/2));
          firstSliderButton.$firstButton.css(position, Math.round(fromPositonLeft - buttonWidth/2));       
        }

        if (this.config.isInterval) {
          rangeBetween.$rangeBetween.css(position, parseInt(firstSliderButton.$firstButton.css(position)) + buttonWidth/2);
          rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)));
        }
        else {
          rangeBetween.$rangeBetween.css(position, 0);
          rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) + buttonWidth/2);
        }
      }

      changeColor = () => {
        if (this.config.color) {
          const color = this.config.color;

          firstSliderButton.$firstButton.css('background-color', color);
          secondSliderButton.$secondButton.css('background-color', color);
          rangeBetween.$rangeBetween.css('background-color', color);
        }
      }

      changeTooltipColor = () => {
        if (this.config.tooltipColor) {
          const tooltipColor = this.config.tooltipColor;

          tooltip.$tooltip1.css('background-color', tooltipColor);
          tooltip.$tooltip2.css('background-color', tooltipColor);
        }
      }

      dragSlider = () => {
        firstSliderButton.$firstButton.on('mousedown', firstSliderButton.grabFirstSlider);
        secondSliderButton.$secondButton.on('mousedown', secondSliderButton.grabSecondSlider);
      }

      getCoords = (el: JQuery) => {
        const coords = el.position();
        return {
            top: coords.top,
            left: coords.left,
        }
      }
    };

    class MinAndMaxValues extends View {

      minValueElement = $('<div/>');
      maxValueElement = $('<div/>')
      
      addMinAndMaxValues = () => {
        const minValue = this.config.minValue;
        const maxValue = this.config.maxValue;

        this.minValueElement.appendTo(slider.$slider).addClass('slider__min-value');
        this.maxValueElement.appendTo(slider.$slider).addClass('slider__max-value');

        this.minValueElement.html(`${minValue}`);
        this.maxValueElement.html(`${maxValue}`);

        const position = this.config.isVertical ? 'top' : 'left';
        const lengthParameter = this.config.isVertical ? 'height' : 'width';

        const sliderWidth = parseInt(slider.$slider.css(lengthParameter));
        const buttonWidth = parseInt(secondSliderButton.$secondButton.css(lengthParameter));
        const minValueElementWidth = parseInt(this.minValueElement.css(lengthParameter));
        const maxValueElementWidth = parseInt(this.maxValueElement.css(lengthParameter));

        if (this.config.isVertical) {
          this.minValueElement.css(position, 0 - 2*minValueElementWidth);
          this.maxValueElement.css(position, sliderWidth + maxValueElementWidth);
          this.minValueElement.css('left', 0 - parseInt(this.minValueElement.css('width'))/2 + parseInt(slider.$slider.css('width'))/2);
          this.maxValueElement.css('left', 0 - parseInt(this.maxValueElement.css('width'))/2 + parseInt(slider.$slider.css('width'))/2);
        }
        else {
          this.minValueElement.css(position, 0 - minValueElementWidth/2);
          this.maxValueElement.css(position, sliderWidth - maxValueElementWidth/2);
        }

        this.minValueElement.mousedown((event: JQuery.MouseDownEvent) => {
          event.stopPropagation();

          this.minValueElement.mouseup((event: JQuery.MouseUpEvent) => {
            if (this.config.isInterval) {
              firstSliderButton.$firstButton.css(position, 0 - buttonWidth/2);
              rangeBetween.$rangeBetween.css(position, 0);
              rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)));
            }
            else {
              secondSliderButton.$secondButton.css(position, 0 - buttonWidth/2);
              rangeBetween.$rangeBetween.css(lengthParameter, 0);
            }
  
            event.stopPropagation();

            tooltip.moveTooltip();          
            tooltip.setMinValueToTooltip();    
          })
        });

        this.maxValueElement.mousedown((event: JQuery.MouseDownEvent) => {
          event.stopPropagation();

          this.maxValueElement.mouseup((event: JQuery.MouseUpEvent) => {
            if (this.config.isInterval) {
              secondSliderButton.$secondButton.css(position, sliderWidth - buttonWidth/2);
              rangeBetween.$rangeBetween.css(position, parseInt(firstSliderButton.$firstButton.css(position)) + buttonWidth/2);
              rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)));
            }
            else {
              secondSliderButton.$secondButton.css(position, sliderWidth - buttonWidth/2);
              rangeBetween.$rangeBetween.css(lengthParameter, sliderWidth);
            }
  
            event.stopPropagation();
            
            tooltip.moveTooltip();          
            tooltip.setMaxValueToTooltip();    
          })
        });
      }
    }

    class Slider extends View {

      $slider = $('<div/>');

      sliderOnDown = () => {

        this.$slider.mousedown((event: JQuery.MouseDownEvent) => {           
          const clientX = event.clientX;
          const clientY = event.clientY;
          const clientAxis = this.config.isVertical ? clientY : clientX;
          const sliderPosition = (this.config.isVertical ? this.getCoords(this.$slider).top : this.getCoords(this.$slider).left) + parseInt(this.$slider.css('margin'));
          const position = this.config.isVertical ? 'top' : 'left';
          const lengthParameter = this.config.isVertical ? 'height' : 'width';
          const firstButtonLeft = parseInt(firstSliderButton.$firstButton.css(position));
          const secondButtonLeft = parseInt(secondSliderButton.$secondButton.css(position));
          const buttonWidth = parseInt(secondSliderButton.$secondButton.css('width'));
          const rangeBetweenWidth = parseInt(rangeBetween.$rangeBetween.css(lengthParameter));
          const step = this.config.step;
          const stepWidth = (step/(this.config.maxValue - this.config.minValue)) * parseInt(this.$slider.css(lengthParameter));
          const intervalForFirstButtonStep = firstButtonLeft + buttonWidth/2 - (clientAxis - sliderPosition);
          const intervalForSecondButtonStep = secondButtonLeft + buttonWidth/2 - (clientAxis - sliderPosition);
          const firstButtonStepsNumber = Math.round(intervalForFirstButtonStep/stepWidth);
          const secondButtonStepsNumber = Math.round(intervalForSecondButtonStep/stepWidth);

          const clickAheadOfFirstSlider = clientAxis - sliderPosition > firstButtonLeft + buttonWidth && clientAxis - sliderPosition < firstButtonLeft + buttonWidth/2 + rangeBetweenWidth/2;
          const clickBehindOfFirstSlider = clientAxis - sliderPosition < firstButtonLeft;
          const clickAheadOfSecondSlider = clientAxis - sliderPosition > secondButtonLeft + buttonWidth;
          const clickBehindOfSecondSlider = clientAxis - sliderPosition < secondButtonLeft && clientAxis - sliderPosition >= firstButtonLeft + buttonWidth/2 + rangeBetweenWidth/2;

          if (parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)) <= stepWidth && parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)) !== 0 && this.config.isInterval) {
            firstSliderButton.$firstButton.css(position, parseInt(secondSliderButton.$secondButton.css(position)));
            rangeBetween.$rangeBetween.css(lengthParameter, 0);
            firstSliderButton.$firstButton.css('z-index', 0);
            secondSliderButton.$secondButton.css('z-index', 1);
            tooltip.equalizeTooltipsValues();
            tooltip.moveTooltip();

            return;
          }
              
          if (this.config.isInterval) { 
            if (clickBehindOfSecondSlider || clickAheadOfSecondSlider) {
              if (this.config.step > 0) {
                secondSliderButton.$secondButton.css(position, parseInt(secondSliderButton.$secondButton.css(position)) - secondButtonStepsNumber * stepWidth);  
              }
              else {
                secondSliderButton.$secondButton.css(position, clientAxis - sliderPosition - buttonWidth/2);
              }
            }
            else if (clickBehindOfFirstSlider || clickAheadOfFirstSlider) {
              if (this.config.step > 0) {
                firstSliderButton.$firstButton.css(position, parseInt(firstSliderButton.$firstButton.css(position)) - firstButtonStepsNumber * stepWidth);
              }
              else {
                firstSliderButton.$firstButton.css(position, clientAxis - sliderPosition - buttonWidth/2);
              }
              rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) + buttonWidth/2);
            }

            rangeBetween.$rangeBetween.css(position, parseInt(firstSliderButton.$firstButton.css(position)) + buttonWidth/2);
            rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)) + buttonWidth/2);
          }
          else {
            if (this.config.step > 0) {
              secondSliderButton.$secondButton.css(position, parseInt(secondSliderButton.$secondButton.css(position)) - Math.round(secondButtonStepsNumber) * stepWidth);
            }
            else {
              secondSliderButton.$secondButton.css(position, clientAxis - sliderPosition - buttonWidth/2);
            }
            rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) + buttonWidth/2);
          }

          tooltip.moveTooltip();

          if (this.config.step > 0 && this.config.isInterval) {
            if (clickAheadOfFirstSlider) {
              tooltip.moveFirstTooltipWidthStepAfterClickAhead(-firstButtonStepsNumber);
            }
            else if (clickBehindOfFirstSlider) {
              tooltip.moveFirstTooltipWidthStepAfterClickBehind(firstButtonStepsNumber);
            }
            else if (clickAheadOfSecondSlider) {
              tooltip.moveSecondTooltipWidthStepAfterClickAhead(-secondButtonStepsNumber);
            }
            else if (clickBehindOfSecondSlider) {
              tooltip.moveSecondTooltipWidthStepAfterClickBehind(secondButtonStepsNumber);
            }
          }
          else if (this.config.step > 0) {
            if (clickAheadOfSecondSlider) {
              tooltip.moveSecondTooltipWidthStepAfterClickAhead(-secondButtonStepsNumber);
            }
            else {
              tooltip.moveSecondTooltipWidthStepAfterClickBehind(secondButtonStepsNumber);
            }
          }

          if (this.config.step === 0) {
            tooltip.setTooltipValue();
          }

          const clickNearMaxValue =  parseInt(this.$slider.css(lengthParameter)) - (clientAxis - sliderPosition) < stepWidth/2;
          const clickNearMinValue = clientAxis - sliderPosition < stepWidth/2;

          if (this.config.step > 0) {
            if (clickAheadOfSecondSlider && clickNearMaxValue) {
              secondSliderButton.$secondButton.css(position, parseInt(this.$slider.css(lengthParameter)) - buttonWidth/2);

              if (this.config.isInterval) {
                rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)) + buttonWidth/2);
              }
              else {
                rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) + buttonWidth/2);
              }

              tooltip.setMaxValueToTooltip();
            }
            else if (clickNearMinValue) {
              if (this.config.isInterval) {
                firstSliderButton.$firstButton.css(position, 0 - buttonWidth/2);
                rangeBetween.$rangeBetween.css(position,  0);
                rangeBetween.$rangeBetween.css(lengthParameter, parseInt(secondSliderButton.$secondButton.css(position)) - parseInt(firstSliderButton.$firstButton.css(position)) + buttonWidth/2);
              }
              else {
                secondSliderButton.$secondButton.css(position, 0 - buttonWidth/2);
                rangeBetween.$rangeBetween.css(lengthParameter,  0);
              }
              tooltip.setMinValueToTooltip();
            }
          }
        });
      }
    }

    class RangeBetween extends View {

      $rangeBetween = $('<div/>');
    }

    class FirstSliderButton extends View {

      $firstButton = $('<button/>');

      grabFirstSlider = (event: JQuery.MouseDownEvent) => {

        event.stopPropagation();
        const shiftX1 = event.clientX - this.getCoords(this.$firstButton).left;
        const shiftY1 = event.clientY - this.getCoords(this.$firstButton).top;

        const moveFirstSlider = (event: JQuery.MouseMoveEvent) => {

          const clientX1 = event.clientX;
          const clientY1 = event.clientY;
          const clientAxis1 = this.config.isVertical ? clientY1 : clientX1;
          const buttonWidth = parseInt(this.$firstButton.css('width'));
          const sliderPosition = this.config.isVertical ? this.getCoords(slider.$slider).top : this.getCoords(slider.$slider).left
          const position = this.config.isVertical ? 'top' : 'left';
          const lengthParameter = this.config.isVertical ? 'height' : 'width';
          const step = this.config.step;
          const stepWidth = Math.round((step/(this.config.maxValue - this.config.minValue)) * parseInt(slider.$slider.css(lengthParameter)));

          const isCursorNearStepAhead = Math.round(clientAxis1 - sliderPosition + parseInt($this.css('margin'))) > parseInt(this.$firstButton.css(position)) + buttonWidth + stepWidth/2;
          const isCursorNearStepBehind = Math.round(clientAxis1 - sliderPosition + parseInt(slider.$slider.css('margin'))) < parseInt(this.$firstButton.css(position)) - stepWidth/2;
          
          if (step > 0) {
            if (isCursorNearStepAhead) {
              this.$firstButton.css(position, parseInt(this.$firstButton.css(position)) + stepWidth);
            }
            else if (isCursorNearStepBehind) {
              this.$firstButton.css(position, parseInt(this.$firstButton.css(position)) - stepWidth);
            }
          }
          else {
            this.$firstButton.css(position, this.config.isVertical ? (clientY1 - shiftY1) : (clientX1 - shiftX1));
          }

          const firstButtonLengthParameter = parseInt(this.$firstButton.css(position));
          const secondButtonLengthParameter = parseInt(secondSliderButton.$secondButton.css(position));

          rangeBetween.$rangeBetween.css(position, firstButtonLengthParameter + buttonWidth/2);
          rangeBetween.$rangeBetween.css(lengthParameter, secondButtonLengthParameter - firstButtonLengthParameter);

          this.$firstButton.css('z-index', 1);
          secondSliderButton.$secondButton.css('z-index', 0);

          if (firstButtonLengthParameter < 0 - buttonWidth/2) {
            this.$firstButton.css(position, 0 - buttonWidth/2);
            rangeBetween.$rangeBetween.css(position, 0);
            rangeBetween.$rangeBetween.css(lengthParameter, secondButtonLengthParameter + buttonWidth/2);
          }
          else if (firstButtonLengthParameter > secondButtonLengthParameter) {
            this.$firstButton.css(position, secondButtonLengthParameter);
          }
          
          if (this.config.step > 0) {
            if (isCursorNearStepAhead) {
              tooltip.moveFirstTooltipWidthStepAhead();
            }
            else if (isCursorNearStepBehind) {
              tooltip.moveFirstTooltipWidthStepBehind();
            }
          }
          else {
            tooltip.moveTooltip();
            tooltip.setTooltipValue();
          }
        }

        $(document).on('mousemove', moveFirstSlider);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', moveFirstSlider);
        });
      }
    }

    class SecondSliderButton extends View {

      $secondButton = $('<button/>');

      grabSecondSlider = (event: JQuery.MouseDownEvent) => {

        event.stopPropagation();
        const shiftX2 = event.clientX - this.getCoords(secondSliderButton.$secondButton).left;
        const shiftY2 = event.clientY - this.getCoords(secondSliderButton.$secondButton).top;

        const moveSecondSlider = (event: JQuery.MouseMoveEvent) => {
          const clientX2 = event.clientX;
          const clientY2 = event.clientY;
          const clientAxis2 = this.config.isVertical ? clientY2 : clientX2;
          const buttonWidth = parseInt(this.$secondButton.css('width'));
          const sliderWidth = parseInt(slider.$slider.css('width'));
          const sliderHeight = parseInt(slider.$slider.css('height'));
          const sliderPosition = this.config.isVertical ? this.getCoords(slider.$slider).top : this.getCoords(slider.$slider).left
          const sliderLengthParameter = this.config.isVertical ? sliderHeight : sliderWidth;
          const position = this.config.isVertical ? 'top' : 'left';
          const lengthParameter = this.config.isVertical ? 'height' : 'width';
          const step = this.config.step;
          const stepWidth = Math.round((step/(this.config.maxValue - this.config.minValue)) * parseInt(slider.$slider.css(lengthParameter)));

          const isCursorNearStepAhead = Math.round(clientAxis2 - sliderPosition + parseInt(slider.$slider.css('margin'))) > parseInt(this.$secondButton.css(position)) + buttonWidth + stepWidth/2;
          const isCursorNearStepBehind = Math.round(clientAxis2 - sliderPosition + parseInt(slider.$slider.css('margin'))) < parseInt(this.$secondButton.css(position)) - stepWidth/2;
          
          if (step > 0) {
            if (isCursorNearStepAhead) {
              this.$secondButton.css(position, parseInt(this.$secondButton.css(position)) + stepWidth);
            }
            else if (isCursorNearStepBehind) {
              this.$secondButton.css(position, parseInt(this.$secondButton.css(position)) - stepWidth);
            }
          }
          else {
            this.$secondButton.css(position, this.config.isVertical ? (clientY2 - shiftY2) : (clientX2 - shiftX2));
          }

          const firstButtonLengthParameter = parseInt(firstSliderButton.$firstButton.css(position));;
          const secondButtonLengthParameter = parseInt(this.$secondButton.css(position));
          

          if (this.config.isInterval) {
            firstSliderButton.$firstButton.css('z-index', 0);
            this.$secondButton.css('z-index', 1);

            rangeBetween.$rangeBetween.css(position, firstButtonLengthParameter + buttonWidth/2);
            rangeBetween.$rangeBetween.css(lengthParameter, secondButtonLengthParameter - firstButtonLengthParameter);

            if (secondButtonLengthParameter < firstButtonLengthParameter) {
              this.$secondButton.css(position, firstButtonLengthParameter);
            }
            else if (secondButtonLengthParameter > sliderLengthParameter - buttonWidth/2) {
              this.$secondButton.css(position, sliderLengthParameter - buttonWidth/2);
              rangeBetween.$rangeBetween.css(lengthParameter, sliderLengthParameter - firstButtonLengthParameter - buttonWidth/2);
            }
          }
          else {
            rangeBetween.$rangeBetween.css(lengthParameter, secondButtonLengthParameter + buttonWidth/2);

            if (secondButtonLengthParameter < 0 - buttonWidth/2) {
              this.$secondButton.css(position, 0 - buttonWidth/2);
            }
            else if (secondButtonLengthParameter > sliderLengthParameter - buttonWidth/2) {
              this.$secondButton.css(position, sliderLengthParameter - buttonWidth/2);
              rangeBetween.$rangeBetween.css(lengthParameter, sliderLengthParameter);
            }
          }

          if (this.config.step > 0) {
            if (isCursorNearStepAhead) {
              tooltip.moveSecondTooltipWidthStepAhead();
            }
            else if (isCursorNearStepBehind) {
              tooltip.moveSecondTooltipWidthStepBehind();
            }
          }
          else {
            tooltip.moveTooltip();
            tooltip.setTooltipValue();
          }
        }

        $(document).on('mousemove', moveSecondSlider);

        $(document).on('mouseup', () => {
          $(document).off('mousemove', moveSecondSlider);
        });
      }
    }

    class Tooltip extends View {

      $tooltip1 = $('<div/>');
      $tooltip2 = $('<div/>');
      minValue = view.config.minValue;
      maxValue = view.config.maxValue;

      position = view.config.isVertical ? 'top' : 'left';
      lengthParameter = view.config.isVertical ? 'height' : 'width';
        
      addTooltip = () => {
        if (!view.config.isTooltip) return;
            
        if (this.config.isInterval) {
          this.$tooltip1.appendTo(slider.$slider).addClass('slider__first-tooltip');
        }
        this.$tooltip2.appendTo(slider.$slider).addClass('slider__second-tooltip');

        const buttonWidth = parseInt(secondSliderButton.$secondButton.css('width'));

        if (view.config.isVertical) {
          this.$tooltip1.css('left', buttonWidth);
          this.$tooltip2.css('left', buttonWidth);
        }

        const tooltipPosition1 = (parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip1.css(this.lengthParameter))/2;
        const tooltipPosition2 = (parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip2.css(this.lengthParameter))/2;

        if (view.config.isInterval) {
          this.$tooltip1.html(`${this.config.from}`);
          this.$tooltip1.css(this.position, tooltipPosition1);
        }
        else {
          this.$tooltip1.css('display', 'none');
        }

        this.$tooltip2.html(`${this.config.to}`);
        this.$tooltip2.css(this.position, tooltipPosition2);
      }

      moveFirstTooltipWidthStepAfterClickAhead = (stepsNumber: number) => {
        this.$tooltip1.html(`${this.config.from += stepsNumber*this.config.step}`);
      }

      moveFirstTooltipWidthStepAfterClickBehind = (stepsNumber: number) => {
        this.$tooltip1.html(`${this.config.from -= stepsNumber*this.config.step}`);
      }

      moveSecondTooltipWidthStepAfterClickAhead = (stepsNumber: number) => {
        this.$tooltip2.html(`${this.config.to += stepsNumber*this.config.step}`);
      }

      moveSecondTooltipWidthStepAfterClickBehind = (stepsNumber: number) => {
        this.$tooltip2.html(`${this.config.to -= stepsNumber*this.config.step}`);
      }

      setMinValueToTooltip = () => {
        if (this.config.isInterval) {
          this.config.from = this.config.minValue;
          this.$tooltip1.html(`${this.config.from}`);
        }
        else {
          this.config.to = this.config.minValue;
          this.$tooltip2.html(`${this.config.to}`);
        }

        this.moveTooltip();
      }

      setMaxValueToTooltip = () => {
        this.config.to = this.config.maxValue;

        this.$tooltip2.html(`${this.config.to}`)

        this.moveTooltip();
      }

      setTooltipValue = () => {
        const tooltipValue1 = Math.round(((parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2)/(parseInt(slider.$slider.css(this.lengthParameter))) * (this.maxValue - this.minValue)) + this.minValue);
        const tooltipValue2 = Math.round(((parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2)/(parseInt(slider.$slider.css(this.lengthParameter))) * (this.maxValue - this.minValue)) + this.minValue);
      
        if (this.config.isInterval) {
          this.$tooltip1.html(`${tooltipValue1}`);
        }

        this.$tooltip2.html(`${tooltipValue2}`);
      }

      moveFirstTooltipWidthStepAhead = () => {
        const tooltipPosition1 = (parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip1.css(this.lengthParameter))/2;
        const tooltipPosition2 = (parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip2.css(this.lengthParameter))/2;
        const firstButton = firstSliderButton.$firstButton;
        const secondButton = secondSliderButton.$secondButton;

        if (parseInt(firstButton.css(this.position)) < parseInt(secondButton.css(this.position))) {
          if (this.config.isInterval) {
            this.$tooltip1.html(`${this.config.from += this.config.step}`);
          }
          else {
            this.$tooltip1.css('display', 'none');
          }
        }
        else {
          this.config.from = this.config.to;
          this.$tooltip1.html(`${this.config.from}`);
        }

        this.$tooltip1.css(this.position, tooltipPosition1);
        this.$tooltip2.css(this.position, tooltipPosition2);

        this.separateCloseTooltips();
      }

      moveFirstTooltipWidthStepBehind = () => {
        const tooltipPosition1 = (parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip1.css(this.lengthParameter))/2;
        const tooltipPosition2 = (parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip2.css(this.lengthParameter))/2;
        const firstButton = firstSliderButton.$firstButton;
        const buttonWidth = parseInt(firstButton.css('width'));

        if (this.config.isInterval) {
          this.$tooltip1.html(`${this.config.from -= this.config.step}`);
        }
        else {
          this.$tooltip1.css('display', 'none');
        }

        if (parseInt(firstButton.css(this.position)) - buttonWidth/2 < 0) {
          this.config.from = this.minValue;
          this.$tooltip1.html(`${this.config.from}`);
        }

        this.$tooltip1.css(this.position, tooltipPosition1);
        this.$tooltip2.css(this.position, tooltipPosition2);

        this.separateCloseTooltips();
      }

      moveSecondTooltipWidthStepAhead = () => {
        const tooltipPosition1 = (parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip1.css(this.lengthParameter))/2;
        const tooltipPosition2 = (parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip2.css(this.lengthParameter))/2;
        const secondButton = secondSliderButton.$secondButton;
        const buttonWidth = parseInt(secondButton.css('width'));

        if (parseInt(secondSliderButton.$secondButton.css(this.position)) + buttonWidth/2 < parseInt(slider.$slider.css(this.lengthParameter))) {
          this.$tooltip2.html(`${this.config.to += this.config.step}`);
        }
        else {
          this.config.to = this.maxValue;
          this.$tooltip2.html(`${this.config.to}`);
        }

        this.$tooltip2.css(this.position, tooltipPosition2);

        if (this.config.isInterval) {
          this.$tooltip1.css(this.position, tooltipPosition1);
          this.separateCloseTooltips();
        }
      }

      moveSecondTooltipWidthStepBehind = () => {
        const tooltipPosition1 = (parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip1.css(this.lengthParameter))/2;
        const tooltipPosition2 = (parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip2.css(this.lengthParameter))/2;
        const firstButton = firstSliderButton.$firstButton;
        const secondButton = secondSliderButton.$secondButton;

        if (this.config.isInterval) {
          if (parseInt(firstButton.css(this.position)) < parseInt(secondButton.css(this.position))) {
            this.$tooltip2.html(`${this.config.to -= this.config.step}`);
          }
          else {
            this.config.to = this.config.from;
            this.$tooltip2.html(`${this.config.to}`);
          }
        }
        else {
          if (0 < parseInt(secondButton.css(this.position))) {
            this.$tooltip2.html(`${this.config.to -= this.config.step}`);
          }
          else {
            this.config.to = this.config.minValue;
            this.$tooltip2.html(`${this.config.to}`);
          }
        }

        this.$tooltip2.css(this.position, tooltipPosition2);

        if (this.config.isInterval) {
          this.$tooltip1.css(this.position, tooltipPosition1);
          this.separateCloseTooltips();
        }
      }

      equalizeTooltipsValues = () => {
        this.config.from = this.config.to;

        this.$tooltip1.html(`${this.config.from}`);
        this.$tooltip2.html(`${this.config.to}`);
      }

      moveTooltip = () => {
        const tooltipPosition1 = (parseInt(firstSliderButton.$firstButton.css(this.position)) + parseInt(firstSliderButton.$firstButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip1.css(this.lengthParameter))/2;
        const tooltipPosition2 = (parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter))/2) - parseInt(this.$tooltip2.css(this.lengthParameter))/2;
        
        if (this.config.isInterval) {
          this.$tooltip1.css(this.position, tooltipPosition1);
        }
        else {
          this.$tooltip1.css('display', 'none');
        }

        this.$tooltip2.css(this.position, tooltipPosition2);

        this.separateCloseTooltips();
      }

      separateCloseTooltips = () => {
        const areTooltipsClose = parseInt(this.$tooltip1.css(this.position)) + parseInt(this.$tooltip1.css(this.lengthParameter)) > parseInt(this.$tooltip2.css(this.position));
        const tooltipClosePosition1 = parseInt(firstSliderButton.$firstButton.css(this.position)) - parseInt(this.$tooltip1.css(this.lengthParameter));
        const tooltipClosePosition2 = parseInt(secondSliderButton.$secondButton.css(this.position)) + parseInt(secondSliderButton.$secondButton.css(this.lengthParameter));
        
        if (areTooltipsClose) {
          this.$tooltip1.css(this.position, tooltipClosePosition1);
          this.$tooltip2.css(this.position, tooltipClosePosition2);
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

    const view = new View();
    const tooltip = new Tooltip();
    const firstSliderButton = new FirstSliderButton();
    const secondSliderButton = new SecondSliderButton();
    const rangeBetween = new RangeBetween();
    const slider = new Slider();
    const minAndMaxValues = new MinAndMaxValues();

    view.switchToVerticalView();
    view.initSlider();
    view.dragSlider();
    view.addInterval();
    view.addFromAndToValues();
    minAndMaxValues.addMinAndMaxValues();
    tooltip.addTooltip();
    slider.sliderOnDown();
    view.changeColor();
    view.changeTooltipColor();

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
  // step: 25,
  from: 40,
  to: 120,
  isTooltip: true,
  isVertical: false
});