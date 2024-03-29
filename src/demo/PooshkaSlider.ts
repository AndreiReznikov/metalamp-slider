import { UserConfig } from '~/interfaces/interfaces';

class PooshkaSlider {
  $document: JQuery<Document> = $(document);

  $sliderContainer: JQuery<HTMLElement> = $('<div/>');

  $slider: JQuery<HTMLElement> = $('<div/>');

  $pooshkaSlider: JQuery<HTMLElement> = $('<div/>');

  $inputDouble: JQuery<HTMLElement> = $('<div/>');

  $inputTooltip: JQuery<HTMLElement> = $('<div/>');

  $inputRange: JQuery<HTMLElement> = $('<div/>');

  $inputScale: JQuery<HTMLElement> = $('<div/>');

  $inputVertical: JQuery<HTMLElement> = $('<div/>');

  $inputFrom: JQuery<HTMLElement> = $('<div/>');

  $inputTo: JQuery<HTMLElement> = $('<div/>');

  $inputMin: JQuery<HTMLElement> = $('<div/>');

  $inputMax: JQuery<HTMLElement> = $('<div/>');

  $inputStep: JQuery<HTMLElement> = $('<div/>');

  $stripe: JQuery<HTMLElement> = $('<div/>');

  $runnerFrom: JQuery<HTMLElement> = $('<div/>');

  $runnerTo: JQuery<HTMLElement> = $('<div/>');

  $tooltipFrom: JQuery<HTMLElement> = $('<div/>');

  $tooltipTo: JQuery<HTMLElement> = $('<div/>');

  $limitMin: JQuery<HTMLElement> = $('<div/>');

  $limitMax: JQuery<HTMLElement> = $('<div/>');

  $scaleContainer: JQuery<HTMLElement> = $('<div/>');

  constructor(container: string) {
    this.findElements(container);
    this.stopFormSubmit();
  }

  public initializePlugin = (config?: UserConfig): void => {
    this.$slider.pooshkaSlider(config);

    this.$pooshkaSlider = this.$slider.data('pooshkaSlider');

    this.setSliderElements();
    this.setPanelValues();
    this.addPanelEvents();
    this.addSliderEvents();
  };

  private setPanelValues = (): void => {
    const {
      step,
      numberOfCharactersAfterDot,
      double,
      showTooltip,
      showRange,
      showScale,
      vertical,
      from,
      to,
      min,
      max,
    } = this.$pooshkaSlider.data('api').getModelOptions();

    this.$inputFrom.attr('step', `${step !== 1 ? step : (step * 0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputTo.attr('step', `${step !== 1 ? step : (step * 0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputMin.attr('step', `${(0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputMax.attr('step', `${(0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputStep.attr('step', `${(0.1).toFixed(numberOfCharactersAfterDot)}`);

    this.$inputDouble.prop('checked', double);
    this.$inputTooltip.prop('checked', showTooltip);
    this.$inputRange.prop('checked', showRange);
    this.$inputScale.prop('checked', showScale);
    this.$inputVertical.prop('checked', vertical);
    this.$inputFrom.prop('value', from);
    this.$inputTo.prop('value', to);
    this.$inputMin.prop('value', min);
    this.$inputMax.prop('value', max);
    this.$inputStep.prop('value', step);
  };

  private setSliderElements = (): void => {
    const {
      $document,
      $stripe,
      $runnerFrom,
      $runnerTo,
      $tooltipFrom,
      $tooltipTo,
      $limitMin,
      $limitMax,
      $scaleContainer,
    } = this.$pooshkaSlider.data('api');

    this.$document = $document;
    this.$stripe = $stripe;
    this.$runnerFrom = $runnerFrom;
    this.$runnerTo = $runnerTo;
    this.$tooltipFrom = $tooltipFrom;
    this.$tooltipTo = $tooltipTo;
    this.$limitMin = $limitMin;
    this.$limitMax = $limitMax;
    this.$scaleContainer = $scaleContainer;
  };

  private stopFormSubmit = (): void => {
    const getFalse = () => false;
    this.$sliderContainer.on('submit', getFalse);
  };

  private handleRunnerBindPointerEvents = () => {
    const handleDocumentOffPointerMove = () => this.$document.off('pointermove');

    this.$document.on('pointermove', this.setPanelValues);
    this.$document.on('pointerup', handleDocumentOffPointerMove);
  };

  private addSliderEvents = (): void => {
    this.$limitMin.on('mousedown', this.setPanelValues);
    this.$limitMax.on('mousedown', this.setPanelValues);
    this.$stripe.on('mousedown', this.setPanelValues);
    this.$scaleContainer.on('mousedown', this.setPanelValues);
    this.$runnerFrom.on('pointerdown', this.handleRunnerBindPointerEvents);
    this.$runnerTo.on('pointerdown', this.handleRunnerBindPointerEvents);
    this.$tooltipFrom.on('pointerdown', this.handleRunnerBindPointerEvents);
    this.$tooltipTo.on('pointerdown', this.handleRunnerBindPointerEvents);
  };

  private addPanelEvents = (): void => {
    this.$inputDouble.on('click', this.toggleDouble);
    this.$inputTooltip.on('click', this.toggleTooltip);
    this.$inputRange.on('click', this.toggleRange);
    this.$inputScale.on('click', this.toggleScale);
    this.$inputVertical.on('click', this.toggleVertical);

    this.$inputFrom.on('change', this.setFrom);
    this.$inputTo.on('change', this.setTo);
    this.$inputMin.on('change', this.setMin);
    this.$inputMax.on('change', this.setMax);
    this.$inputStep.on('change', this.setStep);
  };

  private toggleDouble = (event: JQuery.TriggeredEvent): void => {
    this.$pooshkaSlider.data('api').toggleDouble(event);

    this.setPanelValues();
  };

  private toggleTooltip = (event: JQuery.TriggeredEvent): void => {
    this.$pooshkaSlider.data('api').toggleTooltip(event);

    this.setPanelValues();
  };

  private toggleRange = (event: JQuery.TriggeredEvent): void => {
    this.$pooshkaSlider.data('api').toggleRange(event);

    this.setPanelValues();
  };

  private toggleScale = (event: JQuery.TriggeredEvent): void => {
    this.$pooshkaSlider.data('api').toggleScale(event);

    this.setPanelValues();
  };

  private toggleVertical = (event: JQuery.TriggeredEvent): void => {
    this.$pooshkaSlider.data('api').toggleVertical(event);

    this.setPanelValues();
  };

  private setFrom = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setFrom(event, value);

    this.setPanelValues();
  };

  private setTo = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setTo(event, value);

    this.setPanelValues();
  };

  private setMin = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMin(event, value);

    this.setPanelValues();
  };

  private setMax = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMax(event, value);

    this.setPanelValues();
  };

  private setStep = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setStep(event, value);

    this.setPanelValues();
  };

  private findElements = (container: string): void => {
    this.$sliderContainer = $(container);
    this.$slider = this.$sliderContainer.find('.js-demo-page__slider');
    this.$inputDouble = this.$sliderContainer.find('.js-demo-page__panel-input_double');
    this.$inputTooltip = this.$sliderContainer.find('.js-demo-page__panel-input_tooltip');
    this.$inputRange = this.$sliderContainer.find('.js-demo-page__panel-input_range');
    this.$inputScale = this.$sliderContainer.find('.js-demo-page__panel-input_scale');
    this.$inputVertical = this.$sliderContainer.find('.js-demo-page__panel-input_vertical');
    this.$inputFrom = this.$sliderContainer.find('.js-demo-page__panel-from-input');
    this.$inputTo = this.$sliderContainer.find('.js-demo-page__panel-to-input');
    this.$inputMin = this.$sliderContainer.find('.js-demo-page__panel-min-input');
    this.$inputMax = this.$sliderContainer.find('.js-demo-page__panel-max-input');
    this.$inputStep = this.$sliderContainer.find('.js-demo-page__panel-step-input');
  };
}

export default PooshkaSlider;
