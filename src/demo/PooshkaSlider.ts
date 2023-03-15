import { UserConfig } from '../interfaces/interfaces';

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
      isStepSet,
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

    this.$inputFrom.attr('step', `${isStepSet
      ? step : (0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputTo.attr('step', `${isStepSet
      ? step : (0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputMin.attr('step', `${isStepSet
      ? step : (0.1).toFixed(numberOfCharactersAfterDot)}`);
    this.$inputMax.attr('step', `${isStepSet
      ? step : (0.1).toFixed(numberOfCharactersAfterDot)
    }`);
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
      $limitMin,
      $limitMax,
      $scaleContainer,
    } = this.$pooshkaSlider.data('api');

    this.$document = $document;
    this.$stripe = $stripe;
    this.$runnerFrom = $runnerFrom;
    this.$runnerTo = $runnerTo;
    this.$limitMin = $limitMin;
    this.$limitMax = $limitMax;
    this.$scaleContainer = $scaleContainer;
  };

  private stopFormSubmit = (): void => {
    this.$sliderContainer.submit(() => false);
  };

  private addSliderEvents = (): void => {
    const handleRunnerBindPointerEvents = (valueType: string) => {
      const $runner = valueType === 'from' ? this.$runnerFrom : this.$runnerTo;
      const handleDocumentOffPointerMove = () => this.$document.off('pointermove');

      this.$document.on('pointermove', this.setPanelValues);
      $runner.on('pointerup', handleDocumentOffPointerMove);
    };

    const handleRunnerFromBindPointerEvents = () => handleRunnerBindPointerEvents('from');
    const handleRunnerToBindPointerEvents = () => handleRunnerBindPointerEvents('to');

    this.$limitMin.mousedown(this.setPanelValues);
    this.$limitMax.mousedown(this.setPanelValues);
    this.$stripe.mousedown(this.setPanelValues);
    this.$scaleContainer.mousedown(this.setPanelValues);
    this.$runnerFrom.on('pointerdown', handleRunnerFromBindPointerEvents);
    this.$runnerTo.on('pointerdown', handleRunnerToBindPointerEvents);
  };

  private addPanelEvents = (): void => {
    this.$inputDouble.click(this.toggleDouble);
    this.$inputTooltip.click(this.toggleTooltip);
    this.$inputRange.click(this.toggleRange);
    this.$inputScale.click(this.toggleScale);
    this.$inputVertical.click(this.toggleVertical);

    this.$inputFrom.change(this.setFrom);
    this.$inputTo.change(this.setTo);
    this.$inputMin.change(this.setMin);
    this.$inputMax.change(this.setMax);
    this.$inputStep.change(this.setStep);
  };

  private toggleDouble = (): void => {
    this.$pooshkaSlider.data('api').toggleDouble();

    this.setPanelValues();
  };

  private toggleTooltip = (): void => {
    this.$pooshkaSlider.data('api').toggleTooltip();

    this.setPanelValues();
  };

  private toggleRange = (): void => {
    this.$pooshkaSlider.data('api').toggleRange();

    this.setPanelValues();
  };

  private toggleScale = (): void => {
    this.$pooshkaSlider.data('api').toggleScale();

    this.setPanelValues();
  };

  private toggleVertical = (): void => {
    this.$pooshkaSlider.data('api').toggleVertical();

    this.setPanelValues();
  };

  private setFrom = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setFrom(value);

    this.setPanelValues();
  };

  private setTo = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setTo(value);

    this.setPanelValues();
  };

  private setMin = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMin(value);

    this.setPanelValues();
  };

  private setMax = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMax(value);

    this.setPanelValues();
  };

  private setStep = (event: JQuery.ChangeEvent): void => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setStep(value);

    this.setPanelValues();
  };

  private findElements = (container: string): void => {
    this.$sliderContainer = $(container);
    this.$slider = this.$sliderContainer.find('.js-slider');
    this.$inputDouble = this.$sliderContainer.find('.js-panel__input_double');
    this.$inputTooltip = this.$sliderContainer.find('.js-panel__input_tooltip');
    this.$inputRange = this.$sliderContainer.find('.js-panel__input_range');
    this.$inputScale = this.$sliderContainer.find('.js-panel__input_scale');
    this.$inputVertical = this.$sliderContainer.find('.js-panel__input_vertical');
    this.$inputFrom = this.$sliderContainer.find('.js-panel__from-input');
    this.$inputTo = this.$sliderContainer.find('.js-panel__to-input');
    this.$inputMin = this.$sliderContainer.find('.js-panel__min-input');
    this.$inputMax = this.$sliderContainer.find('.js-panel__max-input');
    this.$inputStep = this.$sliderContainer.find('.js-panel__step-input');
  };
}

export default PooshkaSlider;
