
import { Options, State, ElementsParameters } from '../interfaces/interfaces';

export class View {

  tooltips: Tooltips;
  handleFrom: HandleFrom;
  handleTo: HandleTo;
  range: Range;
  slider: Slider;
  minAndMaxValues: MinAndMaxValues;
  scale: Scale;
  panel: Panel;
  $this: JQuery<HTMLElement>;
  $slider: JQuery<HTMLElement>;
  $handleFrom: JQuery<HTMLElement>;
  $handleTo: JQuery<HTMLElement>;
  $range: JQuery<HTMLElement>;
  $minValue: JQuery<HTMLElement>;
  $maxValue: JQuery<HTMLElement>;
  $scaleContainer: JQuery<HTMLElement>;
  $tooltipFrom: JQuery<HTMLElement>;
  $tooltipTo: JQuery<HTMLElement>;
  $panelContainer: JQuery<HTMLElement>;
  sliderWidth: number;
  sliderHeight: number;
  
  constructor (slider: JQuery<HTMLElement>) {
    this.tooltips = new Tooltips();
    this.handleFrom = new HandleFrom();
    this.handleTo = new HandleTo();
    this.range = new Range();
    this.slider = new Slider();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();
    this.panel = new Panel();

    this.$this = slider;
    this.$slider = this.slider.$slider.appendTo(this.$this).addClass('js-slider__stripe');;
    this.$handleFrom = this.handleFrom.$handleFrom.appendTo(this.$slider).addClass('js-slider__handle-from');
    this.$handleTo = this.handleTo.$handleTo.appendTo(this.$slider).addClass('js-slider__handle-to');
    this.$range = this.range.$range.appendTo(this.$slider).addClass('js-slider__range');
    this.$minValue = this.minAndMaxValues.$minValue.appendTo(this.$slider).addClass('js-slider__min-value');
    this.$maxValue = this.minAndMaxValues.$maxValue.appendTo(this.$slider).addClass('js-slider__max-value');
    this.$scaleContainer = this.scale.$scaleContainer.appendTo(this.$slider).addClass('js-slider__scale-container');
    this.$tooltipFrom = this.tooltips.$tooltipFrom.appendTo(this.$slider).addClass('js-slider__tooltip-from');
    this.$tooltipTo = this.tooltips.$tooltipTo.appendTo(this.$slider).addClass('js-slider__tooltip-to');   
    this.$panelContainer = this.panel.$panelContainer.appendTo(this.$slider).addClass('js-slider__panel-container');
       
    this.sliderWidth = parseInt(this.$this.parent().css('width'));
    this.sliderHeight = parseInt(this.$this.parent().css('height'));
  }

  public initView = (initialOptions: State): void => {
    
    if (initialOptions.isRange) {
      this.$range.css('display', 'block');
    }
    else {
      this.$range.css('display', 'none');
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
      this.$handleTo.css('display', 'block');
    }
    else {
      this.$handleTo.css('display', 'none');
    }

    if (initialOptions.isTooltip) {
      this.$tooltipFrom.css('display', 'flex');

      if (initialOptions.isInterval) {
        this.$tooltipTo.css('display', 'flex');
      }
      else {
        this.$tooltipTo.css('display', 'none');
      }
    }
    else {
      this.$tooltipFrom.css('display', 'none');
      this.$tooltipTo.css('display', 'none');
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
    this.$this.parent().css({'width': 0, 'height': 0});
    this.$this.css({'width': 0, 'height': 0});
    this.$handleFrom.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'});
    this.$handleTo.css({'top': 0, 'left': 0, 'transform': 'translate(0, 0)'}); 
    this.$range.css({'width': 0, 'height': 0, 'top': 0, 'left': 0});
    this.$tooltipFrom.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$tooltipTo.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$minValue.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$maxValue.css({'left': 0, 'bottom': 0, 'top': 0});
    this.$scaleContainer.css({'right': 0, 'top': 0, 'width': 0, 'height': 0});
    this.$panelContainer.css({'right': '', 'top': ''});

    const handleFromWidth: number = parseInt(this.$handleFrom.css('width'));
    const handleFromHeight: number = parseInt(this.$handleFrom.css('height'));
    const handleToWidth: number = parseInt(this.$handleTo.css('width'));
    const handleToHeight: number = parseInt(this.$handleTo.css('height'));
  
    if (isVertical) {
      this.$this.parent().css({'width': this.sliderHeight, 'height': this.sliderWidth});
      this.$this.css({'width': this.sliderHeight, 'height': this.sliderWidth});
      this.$handleFrom.css({'left': '50%', 'transform': 'translateX(-50%)'});
      this.$handleTo.css({'left': '50%', 'transform': 'translateX(-50%)'});
      this.$range.css({'width': '100%'});
      this.$tooltipFrom.css({'left': handleFromWidth});
      this.$tooltipTo.css({'left': handleToWidth}); 
      this.$minValue.css({'left': handleFromWidth});
      this.$maxValue.css({'left': handleFromWidth});
      this.$panelContainer.css({'transform': 'translateX(0)', 'top': 0, 'width': '150px'});

      return;
    }

    this.$this.parent().css({'width': this.sliderWidth, 'height': this.sliderHeight});
    this.$this.css({'width': this.sliderWidth, 'height': this.sliderHeight});
    this.$handleFrom.css({'top': '50%', 'transform': 'translateY(-50%)'});
    this.$handleTo.css({'top': '50%', 'transform': 'translateY(-50%)'}); 
    this.$range.css({'height': '100%'});  
    this.$tooltipFrom.css({'bottom': handleFromHeight, 'top': ''});
    this.$tooltipTo.css({'bottom': handleToHeight, 'top': ''});
    this.$minValue.css({'bottom': handleFromHeight, 'top': ''});
    this.$maxValue.css({'bottom': handleFromHeight, 'top': ''});
    this.$panelContainer.css({'left': '50%','transform': 'translateX(-50%)', 'width': '650px'});
  }

  public getElementsParameters = (isVertical: boolean, lengthParameter: string): ElementsParameters => {

    const elementsParameters: ElementsParameters = {
      sliderPosition: this.getCoords(this.$slider, isVertical), 
      sliderLength: parseInt(this.$slider.css(lengthParameter)), 
      handleLength: parseInt(this.$handleFrom.css(lengthParameter)),
      tooltipFromLength: parseInt(this.$tooltipFrom.css(lengthParameter)),
      tooltipToLength: parseInt(this.$tooltipTo.css(lengthParameter)),
      minValueLength: parseInt(this.$minValue.css(lengthParameter)),
      maxValueLength: parseInt(this.$maxValue.css(lengthParameter)),
      minValueWidth: parseInt(this.$minValue.css('width')),
      maxValueWidth: parseInt(this.$maxValue.css('width')),
      scaleElementHeight: parseInt($('.js-slider__scale-element').css('height')),
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

class Range {
  $range: JQuery<HTMLElement> = $('<div/>');

  public setRangePosition = (options: Options): void => {
    this.$range.css(options.positionParameter, options.rangePosition);
  }

  public setRangeLength = (options: Options): void => {
    this.$range.css(options.lengthParameter, options.rangeLength);
  }
}

class HandleFrom {
  $handleFrom: JQuery<HTMLElement> = $('<div/>');

  public setHandleFromPosition = (options: Options): void => {
    this.$handleFrom.css(options.positionParameter, options.handleFromPosition);
  }
}

class HandleTo {
  $handleTo: JQuery<HTMLElement> = $('<div/>');

  public setHandleToPosition = (options: Options): void => {
    this.$handleTo.css(options.positionParameter, options.handleToPosition);
  }
}

class Tooltips {
  $tooltipFrom: JQuery<HTMLElement> = $('<div/>');
  $tooltipTo: JQuery<HTMLElement> = $('<div/>');

  public setTooltipFromPosition = (options: Options): void => {
    this.$tooltipFrom.css(options.positionParameter, options.tooltipFromPosition);
  }

  public setTooltipFromValue = (options: Options): void => {
    this.$tooltipFrom.html(`${options.tooltipFromValue}`)
  }

  public setTooltipToPosition = (options: Options): void => {
    this.$tooltipTo.css(options.positionParameter, options.tooltipToPosition);
  }

  public setTooltipToValue = (options: Options): void => {
    this.$tooltipTo.html(`${options.tooltipToValue}`)
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

    this.$scaleContainer.css(options.scalePositionParameter, options.scalePositionParameter === 'right' ? maxScaleElementsWidth + options.handleLength : options.handleLength);
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

class Panel {
    $panelContainer = $('<div/>');
    $textInputsContainer = $('<div/>').addClass('js-slider__text-inputs-container').appendTo(this.$panelContainer);
    $toggleInputsContainer = $('<div/>').addClass('js-slider__toggle-inputs-container').appendTo(this.$panelContainer);

    $minInputContainer = $('<div/>').addClass('js-slider__min-input-container').appendTo(this.$textInputsContainer);
    $minButton = $('<button/>').html('MIN').addClass('js-slider__min-button').appendTo(this.$minInputContainer);
    $minInput = $('<input/>').addClass('js-slider__min-input').attr('type', 'number').appendTo(this.$minInputContainer);

    $maxInputContainer = $('<div/>').addClass('js-slider__max-input-container').appendTo(this.$textInputsContainer);
    $maxButton = $('<button/>').html('MAX').addClass('js-slider__max-button').appendTo(this.$maxInputContainer);
    $maxInput = $('<input/>').addClass('js-slider__max-input').attr('type', 'number').appendTo(this.$maxInputContainer);

    $fromInputContainer = $('<div/>').addClass('js-slider__from-input-container').appendTo(this.$textInputsContainer);
    $fromButton = $('<button/>').html('FROM').addClass('js-slider__from-button').appendTo(this.$fromInputContainer);
    $fromInput = $('<input/>').addClass('js-slider__from-input').attr('type', 'number').appendTo(this.$fromInputContainer);

    $toInputContainer = $('<div/>').addClass('js-slider__to-input-container').appendTo(this.$textInputsContainer);
    $toButton = $('<button/>').html('TO').addClass('js-slider__to-button').appendTo(this.$toInputContainer);
    $toInput = $('<input/>').addClass('js-slider__to-input').attr('type', 'number').appendTo(this.$toInputContainer);

    $stepInputContainer = $('<div/>').addClass('js-slider__step-input-container').appendTo(this.$textInputsContainer);
    $stepButton = $('<button/>').html('STEP').addClass('js-slider__step-button').appendTo(this.$stepInputContainer);
    $stepInput = $('<input/>').addClass('js-slider__step-input').attr('type', 'number').appendTo(this.$stepInputContainer);

    $intervalToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    $intervalToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$intervalToggleContainer);
    $customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$intervalToggleContainer);
    $toggleText = $('<span/>').html('INTERVAL').addClass('js-slider__toggle-text').appendTo(this.$intervalToggleContainer);

    $tooltipsToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    $tooltipsToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$tooltipsToggleContainer);
    $customTooltipsToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$tooltipsToggleContainer);
    $toggleTooltipsText = $('<span/>').html('TOOLTIPS').addClass('js-slider__toggle-text').appendTo(this.$tooltipsToggleContainer);

    $rangeToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    $rangeToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$rangeToggleContainer);
    $customRangeToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$rangeToggleContainer);
    $toggleRangeText = $('<span/>').html('RANGE').addClass('js-slider__toggle-text').appendTo(this.$rangeToggleContainer);

    $scaleToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    $scaleToogle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$scaleToggleContainer);
    $customScaleToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$scaleToggleContainer);
    $toggleScaleText = $('<span/>').html('SCALE').addClass('js-slider__toggle-text').appendTo(this.$scaleToggleContainer);

    $verticalToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);
    $verticalToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$verticalToggleContainer);
    $customVerticalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$verticalToggleContainer);
    $toggleVerticalText = $('<span/>').html('VERTICAL').addClass('js-slider__toggle-text').appendTo(this.$verticalToggleContainer);

    public setPanelPosition = (options: Options): void => {   
     this.$panelContainer.css(options.panelPositionParameter, options.panelPosition);   
    }
}