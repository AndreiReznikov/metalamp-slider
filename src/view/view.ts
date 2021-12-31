interface Options {
  positionParameter: string;
  lengthParameter: string;
  sliderPosition: number;
  sliderLength: number;
  buttonLength: number;
  stepLength: number;
  minValuePosition: number;
  maxValuePosition: number;
  minValue: number;
  maxValue: number;
  showMinValue: boolean;
  showMaxValue: boolean;
  minValueLength: number;
  maxValueLength: number;
  firstButtonPosition: number;
  secondButtonPosition: number;
  firstButtonGlobalPositon: number;
  secondButtonGlobalPositon: number;
  firstTooltipPosition: number;
  secondTooltipPosition: number;
  firstTooltipValue: number | string;
  secondTooltipValue: number | string;
  rangeBetweenPosition: number;
  rangeBetweenLength: number;
  scaleNumbers: number;
  scaleElements: number[];
  lengthBetweenScaleElements: number;
}

interface InitialOptions {
  isInterval: boolean;
  isTooltip: boolean;
  isMinAndMax: boolean;
  isRangeBetween: boolean;
  isScale: boolean;
  isVertical: boolean;
  isPanel: boolean;
}

interface ElementsParameters {
  sliderPosition: number;
  sliderLength: number;
  buttonLength: number;
  firstTooltipLength: number;
  secondTooltipLength: number;
  minValueLength: number;
  maxValueLength: number;
  firstButtonGlobalPosition: number;
  secondButtonGlobalPosition: number;
}

export class View {

  tooltips;
  firstButton;
  secondButton;
  rangeBetween;
  slider;
  minAndMaxValues;
  scale;
  // panel;
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
  // $panelContainer: JQuery<HTMLElement>;
  width: number;
  height: number;
  
  constructor (slider: JQuery<HTMLElement>) {
    this.tooltips = new Tooltips();
    this.firstButton = new FirstButton();
    this.secondButton = new SecondButton();
    this.rangeBetween = new RangeBetween();
    this.slider = new Slider();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();
    // this.panel = new Panel();

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
    // this.$panelContainer = this.panel.$panelContainer;

    this.width = parseInt(this.$this.css('width'));
    this.height = parseInt(this.$this.css('height'));
  }

  public initView = (initialOptions: InitialOptions) => {
    this.$slider.appendTo(this.$this).addClass('js-slider__stripe');
    this.$rangeBetween.appendTo(this.$slider).addClass('js-slider__between');
    this.$firstButton.appendTo(this.$slider).addClass('js-slider__first-button');
    this.$secondButton.appendTo(this.$slider).addClass('js-slider__second-button');
    // this.$panelContainer.appendTo(this.$slider).addClass('js-slider__panel-container');
    this.$firstTooltip.appendTo(this.$slider).addClass('js-slider__first-tooltip');
    this.$secondTooltip.appendTo(this.$slider).addClass('js-slider__second-tooltip');
    this.$minValue.appendTo(this.$slider).addClass('js-slider__min-value');
    this.$maxValue.appendTo(this.$slider).addClass('js-slider__max-value');
    this.$scaleContainer.appendTo(this.$slider).addClass('js-slider__scale-container');

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

    // if (initialOptions.isPanel) {
    //   this.$panelContainer.css('display', 'flex');
    // }
    // else {
    //   this.$panelContainer.css('display', 'none');
    // }
    
    this.setPlane(initialOptions.isVertical);
  }

  private setPlane = (isVertical: boolean) => {
    this.$this.css({'width': 0, 'height': 0});
    this.$firstButton.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'});
    this.$secondButton.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'}); 
    this.$rangeBetween.css({'width': 0, 'height': 0, 'top': 0, 'left': 0});
    this.$firstTooltip.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$secondTooltip.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$minValue.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$maxValue.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$scaleContainer.css({'right': 0, 'top': 0, 'width': 0, 'height': 0});
    // this.panel.$panelContainer.css({'top': 0, 'right': 0, 'width': 'auto', 'height': 'auto'});

    const firstButtonWidth: number = parseInt(this.$firstButton.css('width'));
    const firstButtonHeight: number = parseInt(this.$firstButton.css('height'));
    const secondButtonWidth: number = parseInt(this.$secondButton.css('width'));
    const secondButtonHeight: number = parseInt(this.$secondButton.css('height'));

    const scaleElementsWidths: number[] = [];

    $('.js-slider__scale-element').each(function() {
      const scaleElementWidth = parseInt($(this).css('width'));

      scaleElementsWidths.push(scaleElementWidth);
    });

    const maxScaleElementsWidth: number = Math.max(...scaleElementsWidths);

    if (isVertical) {
      this.$this.css({'width': this.height, 'height': this.width});
      this.$firstButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
      this.$secondButton.css({'left': '50%', 'transform': 'translateX(-50%)'});
      this.$rangeBetween.css({'width': '100%'});
      this.$firstTooltip.css({'left': firstButtonWidth});
      this.$secondTooltip.css({'left': secondButtonWidth}); 
      this.$minValue.css({'left': firstButtonWidth});
      this.$maxValue.css({'left': firstButtonWidth});
      this.$scaleContainer.css({'right': maxScaleElementsWidth + firstButtonWidth, 'height': '100%'});
      // this.panel.$panelContainer.css({'right': 2 * maxScaleElementsWidth + firstButtonWidth, 'height': '100%'});
      
      return;
    }

    this.$this.css({'width': this.width, 'height': this.height});
    this.$firstButton.css({'top': '50%', 'transform': 'translateY(-50%)'});
    this.$secondButton.css({'top': '50%', 'transform': 'translateY(-50%)'}); 
    this.$rangeBetween.css({'height': '100%'});  
    this.$firstTooltip.css({'bottom': firstButtonHeight, 'top': ''});
    this.$secondTooltip.css({'bottom': secondButtonHeight, 'top': ''});
    this.$minValue.css({'bottom': firstButtonHeight, 'top': ''});
    this.$maxValue.css({'bottom': firstButtonHeight, 'top': ''});
    this.$scaleContainer.css({'top': firstButtonHeight});
    // this.panel.$panelContainer.css({'top': firstButtonHeight + parseInt($('.js-slider__scale-element').css('height')), 'width': '100%'});
  }

  public getElementsParameters = (isVertical: boolean, options: Options) => {
    const elementsParameters: ElementsParameters = {
      sliderPosition: this.getCoords(this.$slider, isVertical), 
      firstButtonGlobalPosition: this.getCoords(this.$firstButton, isVertical),
      secondButtonGlobalPosition: this.getCoords(this.$secondButton, isVertical),
      sliderLength: parseInt(this.$slider.css(options.lengthParameter)), 
      buttonLength: parseInt(this.$firstButton.css(options.lengthParameter)),
      firstTooltipLength: parseInt(this.$firstTooltip.css(options.lengthParameter)),
      secondTooltipLength: parseInt(this.$secondTooltip.css(options.lengthParameter)),
      minValueLength: parseInt(this.$minValue.css(options.lengthParameter)),
      maxValueLength: parseInt(this.$maxValue.css(options.lengthParameter)),
    }

    return elementsParameters;
  }

  private getCoords = (element: JQuery<HTMLElement>, isVertical: boolean) => {
    const coords = element.position();
  
    return isVertical ? coords.top : coords.left;
  }
}

class Slider {
  $slider: JQuery<HTMLElement> = $('<div/>');
}

class RangeBetween {
  $rangeBetween: JQuery<HTMLElement> = $('<div/>');

  public setRangeBetweenPosition = (options: Options) => {
    this.$rangeBetween.css(options.positionParameter, options.rangeBetweenPosition);
  }

  public setRangeBetweenLength = (options: Options) => {
    this.$rangeBetween.css(options.lengthParameter, options.rangeBetweenLength);
  }
}

class FirstButton {
  $firstButton: JQuery<HTMLElement> = $('<button/>');

  setFirstButtonPosition = (options: Options) => {
    this.$firstButton.css(options.positionParameter, options.firstButtonPosition);
  }
}

class SecondButton {
  $secondButton: JQuery<HTMLElement> = $('<button/>');

  setSecondButtonPosition = (options: Options) => {
    this.$secondButton.css(options.positionParameter, options.secondButtonPosition);
  }
}

class Tooltips {
  $firstTooltip: JQuery<HTMLElement> = $('<div/>');
  $secondTooltip: JQuery<HTMLElement> = $('<div/>');

  public setFirstTooltipPosition = (options: Options) => {
    this.$firstTooltip.css(options.positionParameter, options.firstTooltipPosition);
  }

  public setFirstTooltipValue = (options: Options) => {
    this.$firstTooltip.html(`${options.firstTooltipValue}`)
  }

  public setSecondTooltipPosition = (options: Options) => {
    this.$secondTooltip.css(options.positionParameter, options.secondTooltipPosition);
  }

  public setSecondTooltipValue = (options: Options) => {
    this.$secondTooltip.html(`${options.secondTooltipValue}`)
  }
}

class MinAndMaxValues {
  $minValue: JQuery<HTMLElement> = $('<div/>');
  $maxValue: JQuery<HTMLElement> = $('<div/>');

  public setMinAndMaxPosition = (options: Options) => {
    this.$minValue.css(options.positionParameter, options.minValuePosition);
    this.$maxValue.css(options.positionParameter, options.maxValuePosition);
  }

  public setMinAndMaxValues = (options: Options) => {
    this.$minValue.html(`${options.minValue}`);
    this.$maxValue.html(`${options.maxValue}`);
  }

  public showMinAndMax = (options: Options) => {
    this.$minValue.css({'opacity': '1'});
    this.$maxValue.css({'opacity': '1'});
    
    if (!options.showMinValue) {
      this.$minValue.css({'opacity': '0'});
    }
    
    if (!options.showMaxValue) {
      this.$maxValue.css({'opacity': '0'});
    }
  }
}

class Scale {

  $scaleContainer: JQuery<HTMLElement> = $('<div>');

  public setScaleElementsValues = (options: Options) => {
    this.$scaleContainer.empty();

    for (let i = 0; i < options.scaleElements.length; i++) {
      const $scaleElement: JQuery<HTMLElement> = $('<span>').addClass(`js-slider__scale-element js-slider__scale-element_${i}`);
      $scaleElement.html(`${options.scaleElements[i]}`);
      $scaleElement.appendTo(this.$scaleContainer);
    }
  }

  public setScaleElementsPositions = (options: Options) => {
    let scaleElementPosition: number = 0;

    for (let i = 0; i < options.scaleElements.length; i++) {
      const $scaleElement: JQuery<HTMLElement> = this.$scaleContainer.find(`.js-slider__scale-element_${i}`);
      const scaleElementLength: number = parseInt($scaleElement.css(options.lengthParameter));

      $scaleElement.css(options.positionParameter, scaleElementPosition - scaleElementLength/2);

      scaleElementPosition += options.lengthBetweenScaleElements
    }
  }

  public setScaleLength = (options: Options) => {
    this.$scaleContainer.css(options.lengthParameter, options.sliderLength);
  }
}