import { UserConfig } from '../interfaces/interfaces';

class PooshkaSlider {
  $sliderContainer: JQuery<HTMLElement> = $('div');

  $slider: JQuery<HTMLElement> = $('div');

  $pooskaSlider: JQuery<HTMLElement> = $('div');

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

  constructor(container: string) {
    this.findElements(container);
  }

  public initializePlugin = (config: UserConfig) => {
    this.$slider.pooshkaSlider(config);

    this.$pooskaSlider = this.$slider.data('pooshkaSlider');

    this.setPanelValues();
    this.addPanelEvents();
  };

  private setPanelValues = () => {
    this.$inputFrom.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooskaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputTo.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooskaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputMin.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooskaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
    this.$inputMax.attr('step', `${
      this.$slider.data('api').getModelOptions().isStepSet
        ? this.$slider.data('api').getModelOptions().step
        : (0.1).toFixed(this.$pooskaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)
    }`);
    this.$inputStep.attr('step', `${
      (0.1).toFixed(this.$pooskaSlider.data('api').getModelOptions().numberOfCharactersAfterDot)}`);

    this.$inputDouble.prop('checked', this.$pooskaSlider.data('api').getModelOptions().double);
    this.$inputTooltip.prop('checked', this.$pooskaSlider.data('api').getModelOptions().showTooltip);
    this.$inputRange.prop('checked', this.$pooskaSlider.data('api').getModelOptions().showRange);
    this.$inputScale.prop('checked', this.$pooskaSlider.data('api').getModelOptions().showScale);
    this.$inputVertical.prop('checked', this.$pooskaSlider.data('api').getModelOptions().vertical);
    this.$inputFrom.prop('value', this.$pooskaSlider.data('api').getModelOptions().from);
    this.$inputTo.prop('value', this.$pooskaSlider.data('api').getModelOptions().to);
    this.$inputMin.prop('value', this.$pooskaSlider.data('api').getModelOptions().min);
    this.$inputMax.prop('value', this.$pooskaSlider.data('api').getModelOptions().max);
    this.$inputStep.prop('value', this.$pooskaSlider.data('api').getModelOptions().step);
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
    this.$pooskaSlider.data('api').toggleDouble();
  };

  private toggleTooltip = () => {
    this.$pooskaSlider.data('api').toggleTooltip();
  };

  private toggleRange = () => {
    this.$pooskaSlider.data('api').toggleRange();
  };

  private toggleScale = () => {
    this.$pooskaSlider.data('api').toggleScale();
  };

  private toggleVertical = () => {
    this.$pooskaSlider.data('api').toggleVertical();
  };

  private setFrom = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooskaSlider.data('api').setFrom(value);
  };

  private setTo = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooskaSlider.data('api').setTo(value);
  };

  private setMin = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooskaSlider.data('api').setMin(value);
  };

  private setMax = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooskaSlider.data('api').setMax(value);
  };

  private setStep = (event: JQuery.ChangeEvent) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    this.$pooskaSlider.data('api').setStep(value);
  };

  private findElements = (container: string) => {
    this.$sliderContainer = $(container);
    this.$slider = this.$sliderContainer.find('.js-slider');
    this.$inputDouble = this.$sliderContainer.find('.js-panel__input_double');
    this.$inputTooltip = this.$sliderContainer.find('.js-panel__input_tooltip');
    this.$inputRange = this.$sliderContainer.find('.js-panel__input_range');
    this.$inputScale = this.$sliderContainer.find('.js-panel__input_scale');
    this.$inputVertical = this.$sliderContainer.find('.js-panel__input_vertical');
    this.$inputFrom = this.$sliderContainer.find('.js-slider__from-input');
    this.$inputTo = this.$sliderContainer.find('.js-slider__to-input');
    this.$inputMin = this.$sliderContainer.find('.js-slider__min-input');
    this.$inputMax = this.$sliderContainer.find('.js-slider__max-input');
    this.$inputStep = this.$sliderContainer.find('.js-slider__step-input');
  };
}

export default PooshkaSlider;
