import { UserConfig } from '../interfaces/interfaces';

class PooshkaSlider {
  $sliderContainer: JQuery<HTMLElement> = $('div');

  $slider: JQuery<HTMLElement> = $('div');

  $pooshkaSlider: JQuery<HTMLElement> = $('div');

  $inputDouble: JQuery<HTMLElement> = $('div');

  $inputTooltip: JQuery<HTMLElement> = $('div');

  $inputRange: JQuery<HTMLElement> = $('div');

  $inputScale: JQuery<HTMLElement> = $('div');

  $inputVertical: JQuery<HTMLElement> = $('div');

  $inputFrom: JQuery<HTMLElement> = $('div');

  $inputTo: JQuery<HTMLElement> = $('div');

  $inputMin: JQuery<HTMLElement> = $('div');

  $inputMax: JQuery<HTMLElement> = $('div');

  $inputStep: JQuery<HTMLElement> = $('div');

  $document: JQuery<Document> = $(document);

  $stripe: JQuery<HTMLElement> = $('div');

  $runnerFrom: JQuery<HTMLElement> = $('div');

  $runnerTo: JQuery<HTMLElement> = $('div');

  $limitMin: JQuery<HTMLElement> = $('div');

  $limitMax: JQuery<HTMLElement> = $('div');

  $scaleContainer: JQuery<HTMLElement> = $('div');

  constructor(container: string) {
    this.findElements(container);
  }

  public initializePlugin = (config?: UserConfig) => {
    this.$slider.pooshkaSlider(config);

    this.$pooshkaSlider = this.$slider.data('pooshkaSlider');

    this.setSliderElements();
    this.setPanelValues();
    this.addPanelEvents();
    this.addSliderEvents();
  };

  private setPanelValues = () => {
    this.$inputFrom.attr('step', `${
      this.$pooshkaSlider.data('api').getModelOptions().isStepSet
        ? this.$pooshkaSlider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputTo.attr('step', `${
      this.$pooshkaSlider.data('api').getModelOptions().isStepSet
        ? this.$pooshkaSlider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputMin.attr('step', `${
      this.$pooshkaSlider.data('api').getModelOptions().isStepSet
        ? this.$pooshkaSlider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputMax.attr('step', `${
      this.$pooshkaSlider.data('api').getModelOptions().isStepSet
        ? this.$pooshkaSlider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)
    }`);
    this.$inputStep.attr('step', `${
      (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);

    this.$inputDouble.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().double);
    this.$inputTooltip.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().showTooltip);
    this.$inputRange.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().showRange);
    this.$inputScale.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().showScale);
    this.$inputVertical.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().vertical);
    this.$inputFrom.prop('value', this.$pooshkaSlider.data('api').getModelOptions().from);
    this.$inputTo.prop('value', this.$pooshkaSlider.data('api').getModelOptions().to);
    this.$inputMin.prop('value', this.$pooshkaSlider.data('api').getModelOptions().min);
    this.$inputMax.prop('value', this.$pooshkaSlider.data('api').getModelOptions().max);
    this.$inputStep.prop('value', this.$pooshkaSlider.data('api').getModelOptions().step);
  };

  private setSliderElements = () => {
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

  private addSliderEvents = () => {
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

  private addPanelEvents = () => {
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

  private toggleDouble = () => {
    this.$pooshkaSlider.data('api').toggleDouble();

    this.setPanelValues();
  };

  private toggleTooltip = () => {
    this.$pooshkaSlider.data('api').toggleTooltip();

    this.setPanelValues();
  };

  private toggleRange = () => {
    this.$pooshkaSlider.data('api').toggleRange();

    this.setPanelValues();
  };

  private toggleScale = () => {
    this.$pooshkaSlider.data('api').toggleScale();

    this.setPanelValues();
  };

  private toggleVertical = () => {
    this.$pooshkaSlider.data('api').toggleVertical();

    this.setPanelValues();
  };

  private setFrom = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setFrom(value);

    this.setPanelValues();
  };

  private setTo = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setTo(value);

    this.setPanelValues();
  };

  private setMin = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMin(value);

    this.setPanelValues();
  };

  private setMax = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMax(value);

    this.setPanelValues();
  };

  private setStep = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setStep(value);

    this.setPanelValues();
  };

  private findElements = (container: string) => {
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
