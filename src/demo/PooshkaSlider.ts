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
    this.setInputValues();
    this.addPanelEvents();
    this.addSliderEvents();
  };

  private setPanelValues = () => {
    this.$inputFrom.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputTo.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputMin.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputMax.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)
    }`);
    this.$inputStep.attr('step', `${
      (0.1).toFixed(this.$pooshkaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);

    this.$inputDouble.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().double);
    this.$inputTooltip.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().showTooltip);
    this.$inputRange.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().showRange);
    this.$inputScale.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().showScale);
    this.$inputVertical.prop('checked', this.$pooshkaSlider.data('api').getModelOptions().vertical);
  };

  private setInputValues = () => {
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
    } = this.$slider.data('api');

    this.$document = $document;
    this.$stripe = $stripe;
    this.$runnerFrom = $runnerFrom;
    this.$runnerTo = $runnerTo;
    this.$limitMin = $limitMin;
    this.$limitMax = $limitMax;
    this.$scaleContainer = $scaleContainer;
  };

  private addSliderEvents = () => {
    this.$limitMin.click(this.setInputValues);
    this.$limitMax.click(this.setInputValues);
    this.$stripe.click(this.setInputValues);

    this.$runnerFrom.on('pointerdown', () => {
      this.$document.on('pointermove', () => {
        this.setInputValues();
      });

      this.$runnerFrom.on('pointerup', () => this.$document.off('pointermove'));
    });

    this.$runnerTo.on('pointerdown', () => {
      this.$document.on('pointermove', () => {
        this.setInputValues();
      });

      this.$runnerTo.on('pointerup', () => this.$document.off('pointermove'));
    });
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
  };

  private toggleTooltip = () => {
    this.$pooshkaSlider.data('api').toggleTooltip();
  };

  private toggleRange = () => {
    this.$pooshkaSlider.data('api').toggleRange();
  };

  private toggleScale = () => {
    this.$pooshkaSlider.data('api').toggleScale();
  };

  private toggleVertical = () => {
    this.$pooshkaSlider.data('api').toggleVertical();
  };

  private setFrom = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setFrom(value);
  };

  private setTo = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setTo(value);
  };

  private setMin = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMin(value);
  };

  private setMax = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setMax(value);
  };

  private setStep = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooshkaSlider.data('api').setStep(value);
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
