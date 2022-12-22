import Model from './Model/Model';
import View from './View/View';
import Presenter from './Presenter/Presenter';
import { UserConfig } from './interfaces/interfaces';
import './index.scss';

(function createPooshkaSlider($) {
  const jquery = $;

  const initializePooshkaSlider = (
    $slider: JQuery<HTMLElement> = $('div'),
    userConfig: UserConfig = {},
  ): JQuery<HTMLElement> => {
    const model = new Model(userConfig);
    const view = new View($slider);
    const presenter = new Presenter(model, view);

    $slider.data('api', presenter.getApi());

    return $slider;
  };

  jquery.fn.pooshkaSlider = function addMethods(
    userConfig: UserConfig = {},
  ): JQuery<HTMLElement> {
    this.update = (userConfig: UserConfig): JQuery<HTMLElement> => {
      const pastUserConfig = this.data('userConfig');
      const newUserConfig = $.extend({}, pastUserConfig, userConfig);

      const updateUserConfig = (): void => this.data('api').updateUserConfig(newUserConfig);

      return this.each(updateUserConfig);
    };

    this.destroy = (): JQuery<HTMLElement> => {
      const destroy = (): void => {
        if (this.data('pooshkaSlider')) {
          this.data('pooshkaSlider', false);
          this.data('userConfig', false);
          this.empty();
        }
      };

      return this.each(destroy);
    };

    const init = (): void => {
      this.data('pooshkaSlider', initializePooshkaSlider(this, userConfig));
      this.data('userConfig', userConfig);
    };

    return this.each(init);
  };
}(jQuery));

$(document).ready(() => {
  $('.js-slider_double').pooshkaSlider({
    double: true,
    vertical: false,
    showTooltip: true,
    showLimit: true,
    showRange: true,
    showScale: true,
    useKeyboard: true,
    min: -12.5,
    max: 12.5,
    step: 0,
    from: -5,
    to: 5,
  });

  $('.js-slider_single').pooshkaSlider({
    double: true,
    vertical: false,
    showTooltip: false,
    showLimit: true,
    showRange: false,
    showScale: true,
    useKeyboard: true,
    min: 0,
    max: 10000000,
    step: 2500000,
    from: 5000000,
    to: 7500000,
    scaleNumber: 5,
  });

  $('.js-slider_vertical').pooshkaSlider({
    double: true,
    vertical: true,
    showTooltip: false,
    showLimit: false,
    showRange: true,
    showScale: true,
    useKeyboard: true,
    min: -125,
    max: -5,
    step: 0,
    from: -85,
    to: -45,
    scaleNumber: 7,
  });

  $('.js-slider_empty').pooshkaSlider({
    double: false,
    vertical: false,
    showTooltip: false,
    showLimit: false,
    showRange: false,
    showScale: false,
    useKeyboard: true,
    min: 0,
    max: 10,
    step: 0,
    from: 5,
    to: 8,
  });

  const $slider = $('.js-slider_single').data('pooshkaSlider');
  const $sliderDouble = $('.js-slider_double').data('pooshkaSlider');

  $slider.update({
    double: false,
  });

  $('.js-slider__from-input').attr('step', `${$sliderDouble.data('api').getModelOptions().isStepSet ? '' : (0.1).toFixed($sliderDouble.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
  $('.js-slider__to-input').attr('step', `${$sliderDouble.data('api').getModelOptions().isStepSet ? '' : (0.1).toFixed($sliderDouble.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
  $('.js-slider__min-input').attr('step', `${$sliderDouble.data('api').getModelOptions().isStepSet ? $sliderDouble.data('api').getModelOptions().step : (0.1).toFixed($sliderDouble.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
  $('.js-slider__max-input').attr('step', `${$sliderDouble.data('api').getModelOptions().isStepSet ? $sliderDouble.data('api').getModelOptions().step : (0.1).toFixed($sliderDouble.data('api').getModelOptions().numberOfCharactersAfterDot)}`);
  $('.js-slider__step-input').attr('step', `${(0.1).toFixed($sliderDouble.data('api').getModelOptions().numberOfCharactersAfterDot)}`);

  $('.js-panel__input_double').prop('checked', $sliderDouble.data('api').getModelOptions().double);
  $('.js-panel__input_tooltip').prop('checked', $sliderDouble.data('api').getModelOptions().showTooltip);
  $('.js-panel__input_range').prop('checked', $sliderDouble.data('api').getModelOptions().showRange);
  $('.js-panel__input_scale').prop('checked', $sliderDouble.data('api').getModelOptions().showScale);
  $('.js-panel__input_vertical').prop('checked', $sliderDouble.data('api').getModelOptions().vertical);
  $('.js-slider__from-input').prop('value', $sliderDouble.data('api').getModelOptions().from);
  $('.js-slider__to-input').prop('value', $sliderDouble.data('api').getModelOptions().to);
  $('.js-slider__min-input').prop('value', $sliderDouble.data('api').getModelOptions().min);
  $('.js-slider__max-input').prop('value', $sliderDouble.data('api').getModelOptions().max);
  $('.js-slider__step-input').prop('value', $sliderDouble.data('api').getModelOptions().step);

  $('.js-panel__input_tooltip').click(() => {
    $sliderDouble.data('api').toggleTooltip();
  });

  $('.js-panel__input_double').click(() => {
    $sliderDouble.data('api').toggleDouble();
  });

  $('.js-panel__input_range').click(() => {
    $sliderDouble.data('api').toggleRange();
  });

  $('.js-panel__input_scale').click(() => {
    $sliderDouble.data('api').toggleScale();
  });

  $('.js-panel__input_vertical').click(() => {
    $sliderDouble.data('api').toggleVertical();
  });

  $('.js-slider__from-input').change((event) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    if (value < $sliderDouble.data('api').getModelOptions().min) return;

    $sliderDouble.data('api').setFrom(value);
  });

  $('.js-slider__to-input').change((event) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    $sliderDouble.data('api').setTo(value);
  });

  $('.js-slider__min-input').change((event) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    $sliderDouble.data('api').setMin(value);
  });

  $('.js-slider__max-input').change((event) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    $sliderDouble.data('api').setMax(value);
  });

  $('.js-slider__step-input').change((event) => {
    const $input = $(event.currentTarget);
    const value = parseFloat(`${$input.val()}`);

    $sliderDouble.data('api').setStep(value);
  });

  $(document).on('mousemove.from', () => {
    $('.js-slider__from-input').prop('value', $sliderDouble.data('api').getModelOptions().from);
  });
  $('.js-slider').on('mousedown.from', () => {
    $('.js-slider__from-input').prop('value', $sliderDouble.data('api').getModelOptions().from);
  });

  $(document).on('mousemove.to', () => {
    $('.js-slider__to-input').prop('value', $sliderDouble.data('api').getModelOptions().to);
  });
  $('.js-slider').on('mousedown.to', () => {
    $('.js-slider__to-input').prop('value', $sliderDouble.data('api').getModelOptions().to);
  });
});
