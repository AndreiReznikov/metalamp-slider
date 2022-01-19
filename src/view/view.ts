
import { Options, State, ElementsParameters } from '../interfaces/interfaces';

export class View {

  tooltips: Tooltips;
  firstButton: FirstButton;
  secondButton: SecondButton;
  rangeBetween: RangeBetween;
  slider: Slider;
  minAndMaxValues: MinAndMaxValues;
  scale: Scale;
  $this: JQuery<HTMLElement>;
  $slider: JQuery<HTMLElement>;
  $firstButton: JQuery<HTMLElement>;
  $secondButton: JQuery<HTMLElement>;
  $rangeBetween: JQuery<HTMLElement>;
  $minValue: JQuery<HTMLElement>;
  $maxValue: JQuery<HTMLElement>;
  $scaleContainer: JQuery<HTMLElement>;
  $firstTooltip: JQuery<HTMLElement>;
  $secondTooltip: JQuery<HTMLElement>;
  $panelContainer: JQuery<HTMLElement>;
  sliderWidth: number;
  sliderHeight: number;
  
  constructor (slider: JQuery<HTMLElement>) {
    this.tooltips = new Tooltips();
    this.firstButton = new FirstButton();
    this.secondButton = new SecondButton();
    this.rangeBetween = new RangeBetween();
    this.slider = new Slider();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();

    this.$this = slider;
    this.$slider = this.slider.$slider;
    this.$firstButton = this.firstButton.$firstButton;
    this.$secondButton = this.secondButton.$secondButton;
    this.$rangeBetween = this.rangeBetween.$rangeBetween;
    this.$minValue = this.minAndMaxValues.$minValue;
    this.$maxValue = this.minAndMaxValues.$maxValue;
    this.$scaleContainer = this.scale.$scaleContainer;
    this.$firstTooltip = this.tooltips.$firstTooltip;
    this.$secondTooltip = this.tooltips.$secondTooltip;
    this.$panelContainer = $('<div/>');
    

    this.sliderWidth = parseInt(this.$this.css('width'));
    this.sliderHeight = parseInt(this.$this.css('height'));
  }

  public initView = (initialOptions: State): void => {
    this.$slider.appendTo(this.$this).addClass('js-slider__stripe');
    this.$rangeBetween.appendTo(this.$slider).addClass('js-slider__between');
    this.$firstButton.appendTo(this.$slider).addClass('js-slider__first-button');
    this.$secondButton.appendTo(this.$slider).addClass('js-slider__second-button');
    this.$firstTooltip.appendTo(this.$slider).addClass('js-slider__first-tooltip');
    this.$secondTooltip.appendTo(this.$slider).addClass('js-slider__second-tooltip');
    this.$minValue.appendTo(this.$slider).addClass('js-slider__min-value');
    this.$maxValue.appendTo(this.$slider).addClass('js-slider__max-value');
    this.$scaleContainer.appendTo(this.$slider).addClass('js-slider__scale-container');
    this.$panelContainer.appendTo(this.$slider).addClass('js-slider__panel-container');

    if (initialOptions.isRangeBetween) {
      this.$rangeBetween.css('display', 'block');
    }
    else {
      this.$rangeBetween.css('display', 'none');
    }

    if (initialOptions.isMinAndMax) {
      this.$minValue.css('display', 'flex');
      this.$maxValue.css('display', 'flex');
    }
    else {
      this.$minValue.css('display', 'none');
      this.$maxValue.css('display', 'none');
    }

    if (initialOptions.isScale) {
      this.$scaleContainer.css('display', 'flex');
    }
    else {
      this.$scaleContainer.css('display', 'none');
    }       

    if (initialOptions.isInterval) {
      this.$secondButton.css('display', 'block');
    }
    else {
      this.$secondButton.css('display', 'none');
    }

    if (initialOptions.isTooltip) {
      this.$firstTooltip.css('display', 'flex');

      if (initialOptions.isInterval) {
        this.$secondTooltip.css('display', 'flex');
      }
      else {
        this.$secondTooltip.css('display', 'none');
      }
    }
    else {
      this.$firstTooltip.css('display', 'none');
      this.$secondTooltip.css('display', 'none');
    }

    if (initialOptions.isPanel) {
      this.$panelContainer.css('display', 'flex');
    }
    else {
      this.$panelContainer.css('display', 'none');
    }
    
    this.setPlane(initialOptions.isVertical);
  }

  private setPlane = (isVertical: boolean): void => {
    this.$this.css({'width': 0, 'height': 0});
    this.$firstButton.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'});
    this.$secondButton.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'}); 
    this.$rangeBetween.css({'width': 0, 'height': 0, 'top': 0, 'left': 0});
    this.$firstTooltip.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$secondTooltip.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$minValue.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$maxValue.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$scaleContainer.css({'right': 0, 'top': 0, 'width': 0, 'height': 0});
    this.$panelContainer.css({'right': '', 'top': ''});

    const firstButtonWidth: number = parseInt(this.$firstButton.css('width'));
    const firstButtonHeight: number = parseInt(this.$firstButton.css('height'));
    const secondButtonWidth: number = parseInt(this.$secondButton.css('width'));
    const secondButtonHeight: number = parseInt(this.$secondButton.css('height'));

    if (isVertical) {
      this.$this.css({'width': this.sliderHeight, 'height': this.sliderWidth});
      this.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
      this.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
      this.$rangeBetween.css({'width': '100%'});
      this.$firstTooltip.css({'left': firstButtonWidth});
      this.$secondTooltip.css({'left': secondButtonWidth}); 
      this.$minValue.css({'left': firstButtonWidth});
      this.$maxValue.css({'left': firstButtonWidth});

      return;
    }

    this.$this.css({'width': this.sliderWidth, 'height': this.sliderHeight});
    this.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
    this.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'}); 
    this.$rangeBetween.css({'height': '100%'});  
    this.$firstTooltip.css({'bottom': firstButtonHeight, 'top': ''});
    this.$secondTooltip.css({'bottom': secondButtonHeight, 'top': ''});
    this.$minValue.css({'bottom': firstButtonHeight, 'top': ''});
    this.$maxValue.css({'bottom': firstButtonHeight, 'top': ''});
  }

  public getElementsParameters = (isVertical: boolean, lengthParameter: string): ElementsParameters => {

    const elementsParameters: ElementsParameters = {
      sliderPosition: this.getCoords(this.$slider, isVertical), 
      sliderLength: parseInt(this.$slider.css(lengthParameter)), 
      buttonLength: parseInt(this.$firstButton.css(lengthParameter)),
      firstTooltipLength: parseInt(this.$firstTooltip.css(lengthParameter)),
      secondTooltipLength: parseInt(this.$secondTooltip.css(lengthParameter)),
      minValueLength: parseInt(this.$minValue.css(lengthParameter)),
      maxValueLength: parseInt(this.$maxValue.css(lengthParameter)),
    }

    return elementsParameters;
  }

  private getCoords = (element: JQuery<HTMLElement>, isVertical: boolean): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord: number = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  }
}

class Slider {
  $slider: JQuery<HTMLElement> = $('<div/>');
}

class RangeBetween {
  $rangeBetween: JQuery<HTMLElement> = $('<div/>');

  public setRangeBetweenPosition = (options: Options): void => {
    this.$rangeBetween.css(options.positionParameter, options.rangeBetweenPosition);
  }

  public setRangeBetweenLength = (options: Options): void => {
    this.$rangeBetween.css(options.lengthParameter, options.rangeBetweenLength);
  }
}

class FirstButton {
  $firstButton: JQuery<HTMLElement> = $('<button/>');

  public setFirstButtonPosition = (options: Options): void => {
    this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
  }
}

class SecondButton {
  $secondButton: JQuery<HTMLElement> = $('<button/>');

  public setSecondButtonPosition = (options: Options): void => {
    this.$secondButton.css(options.positionParameter, options.secondButtonPosition);
  }
}

class Tooltips {
  $firstTooltip: JQuery<HTMLElement> = $('<div/>');
  $secondTooltip: JQuery<HTMLElement> = $('<div/>');

  public setFirstTooltipPosition = (options: Options): void => {
    this.$firstTooltip.css(options.positionParameter, options.firstTooltipPosition);
  }

  public setFirstTooltipValue = (options: Options): void => {
    this.$firstTooltip.html(`${options.firstTooltipValue}`)
  }

  public setSecondTooltipPosition = (options: Options): void => {
    this.$secondTooltip.css(options.positionParameter, options.secondTooltipPosition);
  }

  public setSecondTooltipValue = (options: Options): void => {
    this.$secondTooltip.html(`${options.secondTooltipValue}`)
  }
}

class MinAndMaxValues {
  $minValue: JQuery<HTMLElement> = $('<div/>');
  $maxValue: JQuery<HTMLElement> = $('<div/>');

  public setMinAndMaxPosition = (options: Options): void => {
    this.$minValue.css(options.positionParameter, options.minValuePosition);
    this.$maxValue.css(options.positionParameter, options.maxValuePosition);
  }

  public setMinAndMaxValues = (options: Options): void => {
    this.$minValue.html(`${options.minValue}`);
    this.$maxValue.html(`${options.maxValue}`);
  }

  public showMinAndMax = (options: Options): void => {
    this.$minValue.css({'opacity': '1'});
    this.$maxValue.css({'opacity': '1'});
    
    if (!options.isMinValueShow) {
      this.$minValue.css({'opacity': '0'});
    }
    
    if (!options.isMaxValueShow) {
      this.$maxValue.css({'opacity': '0'});
    }
  }
}

class Scale {

  $scaleContainer: JQuery<HTMLElement> = $('<div>');

  public setScaleLength = (options: Options): void => {
    this.$scaleContainer.css(options.lengthParameter, options.sliderLength);
  }

  public setScalePosition = (options: Options): void => {
    const scaleElementsWidths: number[] = [];

    this.$scaleContainer.find('.js-slider__scale-element').each(function() {
      const scaleElementWidth: number = parseInt($(this).css('width'));

      scaleElementsWidths.push(scaleElementWidth);
    });

    const maxScaleElementsWidth: number = Math.max(...scaleElementsWidths);

    this.$scaleContainer.css(options.scalePositionParameter, options.scalePositionParameter === 'right' ? maxScaleElementsWidth + options.buttonLength : options.buttonLength);
  }

  public setScaleElementsValues = (options: Options): void => {
    this.$scaleContainer.empty();

    for (let i = 0; i < options.scaleElements.length; i++) {
      const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(`js-slider__scale-element js-slider__scale-element_${i}`);
      $scaleElement.html(`${options.scaleElements[i]}`);
      $scaleElement.appendTo(this.$scaleContainer);
    }
  }

  public setScaleElementsPositions = (options: Options): void => {
    let scaleElementPosition: number = 0;

    for (let i = 0; i < options.scaleElements.length; i++) {
      const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-slider__scale-element_${i}`);
      const scaleElementLength: number = parseInt($scaleElement.css(options.lengthParameter));

      $scaleElement.css(options.positionParameter, scaleElementPosition - scaleElementLength/2);

      scaleElementPosition += options.lengthBetweenScaleElements
    }
  }
}