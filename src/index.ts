import "./index.css";
import { Model } from './model/model';
import { View } from './view/view';

interface Config {
  isInterval: boolean;
  minValue: number;
  maxValue: number;
  from: number;
  to: number;
  step: number;
  keyboard: boolean;
  isVertical: boolean;
  isTooltip: boolean;
  isMinAndMax: boolean;
  isRangeBetween: boolean;
  isScale: boolean;
  scaleNumbers: number;
  isPanel: boolean;
}

(function($) {
  const mySlider = (slider: JQuery<HTMLElement>, options: Config): JQuery => {

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
    
    class Presenter {
    
      model;
      view;
    
      constructor(model: any, view: any) {
        this.model = model;
        this.view = view;
        
        this.init();
        this.model.observer.addObserver(this.updateView);  
    
        // this.view.$panelContainer.on('mousedown', this.view.panel.toggleOnDown);
        // this.view.panel.$minInput.on('change', this.view.panel.setMin);
        // this.view.panel.$maxInput.on('change', this.view.panel.setMax);
        // this.view.panel.$fromInput.on('change', this.view.panel.setFrom);
        // this.view.panel.$toInput.on('change', this.view.panel.setTo);
        // this.view.panel.$stepInput.on('change', this.view.panel.setStep);
        // this.view.panel.$intervalToggle.on('click', this.view.panel.toggleInterval);
        // this.view.panel.$verticalToggle.on('click', this.view.panel.toggleVertical);
        // this.view.panel.$tooltipsToggle.on('click', this.view.panel.toggleTooltip);
        // this.view.panel.$rangeBetweenToggle.on('click', this.view.panel.toggleRangeBetween);
        // this.view.panel.$scaleToogle.on('click', this.view.panel.toggleScale);
    
        this.view.$firstButton.on('mousedown', this.model.calculateFirstButtonPosition);
        this.view.$secondButton.on('mousedown', this.model.calculateSecondButtonPosition);
        this.view.$firstButton.on('focusin', this.model.calculateFirstButtonPositionAfterFocusing);
        this.view.$secondButton.on('focusin', this.model.calculateSecondButtonPositionAfterFocusing);
        this.view.$slider.on('mousedown', this.model.calculateFirstButtonPositionAfterSliderOnDown);
        this.view.$slider.on('mousedown', this.model.calculateSecondButtonPositionAfterSliderOnDown);
        this.view.$minValue.on('mousedown', this.model.calculateFirstButtonPositionAfterMinValueOnDown);
        this.view.$maxValue.on('mousedown', this.model.calculateFirstButtonPositionAfterMaxValueOnDown);
        this.view.$maxValue.on('mousedown', this.model.calculateSecondButtonPositionAfterMaxValueOnDown);
        this.view.$scaleContainer.on('mousedown', this.model.calculateButtonPositionAfterScaleOnDown);
      }
    
      private init = () => {
        this.view.initView(this.model.getSliderState());
        this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions()));
        this.model.calculateInitialSecondButtonPosition();
        this.model.calculateInitialFirstButtonPosition();
        this.model.calculateInitialValues();
        this.updateView(this.model.getOptions());
      }
    
      private updateView = (options: Options) => {
        this.view.firstButton.setFirstButtonPosition(options);
        this.view.secondButton.setSecondButtonPosition(options);
        this.view.tooltips.setFirstTooltipValue(options);
        this.view.tooltips.setSecondTooltipValue(options);
        this.view.tooltips.setFirstTooltipPosition(options);
        this.view.tooltips.setSecondTooltipPosition(options);
        this.view.rangeBetween.setRangeBetweenPosition(options);
        this.view.rangeBetween.setRangeBetweenLength(options);
        this.view.minAndMaxValues.setMinAndMaxValues(options);
        this.view.minAndMaxValues.setMinAndMaxPosition(options);
        this.view.minAndMaxValues.showMinAndMax(options);
        this.view.scale.setScaleElementsValues(options);
        this.view.scale.setScaleLength(options);
        this.view.scale.setScaleElementsPositions(options);
        this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions()));
      }
    }
    
    // class Panel extends Presenter {
    //   $panelContainer: JQuery<HTMLElement> = $('<div/>');
    //   $minInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__min-input').attr('type', 'number').appendTo(this.$panelContainer);
    //   $maxInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__max-input').attr('type', 'number').appendTo(this.$panelContainer);
    //   $fromInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__from-input').attr('type', 'number').appendTo(this.$panelContainer);
    //   $toInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__to-input').attr('type', 'number').appendTo(this.$panelContainer);
    //   $stepInput: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__step-input').attr('type', 'number').appendTo(this.$panelContainer);
    //   $intervalToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__interval-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
    //   $tooltipsToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__tooltip-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
    //   $rangeBetweenToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__range-between-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
    //   $scaleToogle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__scale-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
    //   $verticalToggle: JQuery<HTMLElement> = $('<input/>').addClass('js-slider__vertical-input').attr('type', 'checkbox').appendTo(this.$panelContainer);
    
    //   constructor() {
    //     super({}, {});
    //     this.setInitialPanelValues();
    //   }
    
    //   public setInitialPanelValues = () => {
    //     this.$minInput.val(`${this.model.minValue}`);
    //     this.$maxInput.val(`${this.model.maxValue}`);
    //     this.$toInput.val(`${this.model.to}`);
    //     this.$fromInput.val(`${this.model.from}`);
    //     this.$stepInput.val(`${this.model.step}`);
    //     this.$intervalToggle.prop('checked', this.model.isInterval ? true : false);
    //     this.$verticalToggle.prop('checked', this.model.isVertical ? true : false);
    //     this.$tooltipsToggle.prop('checked', this.model.isTooltip ? true : false);
    //     this.$rangeBetweenToggle.prop('checked', this.model.isRangeBetween ? true : false);
    //     this.$scaleToogle.prop('checked', this.model.isScale ? true : false);
    //   }
    
    //   public toggleOnDown = (event: JQuery.MouseDownEvent) => {
    //     event.stopPropagation();
    //   }
    
    //   public setMin = (event: JQuery.ChangeEvent) => {
    //     const minValue = $(event.target).val();
        
    //     this.model.minValue = parseFloat(`${minValue}`);
    
    //     this.model.calculateInitialFirstButtonPosition();
    //     this.model.calculateInitialSecondButtonPosition();
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public setMax = (event: JQuery.ChangeEvent) => {
    //     const maxValue = $(event.target).val();
        
    //     this.model.maxValue = parseFloat(`${maxValue}`);
    
    //     this.model.calculateInitialFirstButtonPosition();
    //     this.model.calculateInitialSecondButtonPosition();
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public setFrom = (event: JQuery.ChangeEvent) => {
    //     const from = $(event.target).val();
        
    //     this.model.from = parseFloat(`${from}`);
    
    //     this.model.calculateInitialFirstButtonPosition();
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public setTo = (event: JQuery.ChangeEvent) => {
    //     const to = $(event.target).val();
        
    //     this.model.to = parseFloat(`${to}`);
    
    //     this.model.calculateInitialSecondButtonPosition();
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public setStep = (event: JQuery.ChangeEvent) => {
    //     const step = $(event.target).val();
        
    //     this.model.step = parseFloat(`${step}`);
    
    //     this.model.validateInitialValues();
    //     this.model.calculateStepLength();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public toggleInterval = (event: JQuery.ClickEvent) => {
    //     if ($(event.target).is(':checked')) {
    //       this.model.isInterval = true;
    //     }
    //     else {
    //       this.model.isInterval = false;
    //     }
    
    //     this.view.initView(this.model.getSliderState());
    //     this.model.calculateInitialSecondButtonPosition();
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public toggleTooltip = (event: JQuery.ClickEvent) => {
    //     if ($(event.target).is(':checked')) {
    //       this.model.isTooltip = true;
    //     }
    //     else {
    //       this.model.isTooltip = false;
    //     }
    
    //     this.view.initView(this.model.getSliderState());
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public toggleRangeBetween = (event: JQuery.ClickEvent) => {
    //     if ($(event.target).is(':checked')) {
    //       this.model.isRangeBetween = true;
    //     }
    //     else {
    //       this.model.isRangeBetween  = false;
    //     }
    
    //     this.view.initView(this.model.getSliderState());
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public toggleScale = (event: JQuery.ClickEvent) => {
    //     if ($(event.target).is(':checked')) {
    //       this.model.isScale = true;
    //     }
    //     else {
    //       this.model.isScale  = false;
    //     }
    
    //     this.view.initView(this.model.getSliderState());
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    
    //   public toggleVertical = (event: JQuery.ClickEvent) => {
    //     if ($(event.target).is(':checked')) {
    //       this.model.isVertical = true;
    
    //       this.model.positionParameter = this.model.isVertical ? 'top' : 'left';
    //       this.model.lengthParameter = this.model.isVertical ? 'height' : 'width';
    //     }
    //     else {
    //       this.model.isVertical = false;
    
    //       this.model.positionParameter = this.model.isVertical ? 'top' : 'left';
    //       this.model.lengthParameter = this.model.isVertical ? 'height' : 'width';
    //     }
        
    //     this.view.initView(this.model.getSliderState());
    //     this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions()));
    //     this.model.calculateInitialValues();
    
    //     this.model.observer.notifyObservers(this.model.getOptions());
    //   }
    // }

    const model = new Model(options);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    return slider;
  };

  $.fn.mySlider = function(options: Config) {
    return this.each(function() {
      mySlider($(this), options);
    });
  }
})(jQuery);

$('.js-slider').mySlider({
  isInterval: true,
  minValue: -4.5,
  maxValue: 4.5,
  step: 0,
  from: -2.5,
  to: 2.5,
  keyboard: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRangeBetween: true,
  isPanel: true,
  isScale: true,
  scaleNumbers: 10
});