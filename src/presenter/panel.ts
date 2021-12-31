// import { Presenter } from '../presenter/presenter';

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

// export { Panel };