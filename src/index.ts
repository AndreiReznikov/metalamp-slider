import Model from './model/model';
import View from './view/view';
import Presenter from './presenter/presenter';
import { UserConfig } from './interfaces/interfaces';
import './index.css';

(function createPooshkaSlider($) {
  const jquery = $;

  const pooshkaSlider = (
    $slider: JQuery<HTMLElement> = $('div'),
    userConfig: UserConfig = {},
  ): JQuery<HTMLElement> => {
    const model = new Model(userConfig);
    const view = new View($slider);
    const presenter = new Presenter(model, view);

    $slider.data('api', presenter.getApi());

    return $slider;
  };

  jquery.fn.pooshkaSlider = function addPooshkaSliderMethods(
    userConfig: UserConfig = {},
  ): JQuery<HTMLElement> {
    this.toggleTooltip = (): JQuery<HTMLElement> => {
      const toggleTooltip = (): void => this.data('api').toggleTooltip();

      return this.each(toggleTooltip);
    };

    this.destroy = (): JQuery<HTMLElement> => {
      const destroy = (): void => {
        if (this.data('pooshkaSlider')) {
          this.data('pooshkaSlider', false);
          this.empty();
        }
      };

      return this.each(destroy);
    };

    const init = (): void => {
      this.data('pooshkaSlider', pooshkaSlider(this, userConfig));
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

  // $slider.update({
  //   isInterval: false,
  // });

  $('.js-slider__input').prop('checked', $sliderDouble.data('api').getModelOptions().showTooltip);

  $('.js-slider__input').click(() => {
    $sliderDouble.toggleTooltip();
  });
});
