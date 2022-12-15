import Model from './model/model';
import View from './view/view';
import Presenter from './presenter/presenter';
import { UserConfig } from './interfaces/interfaces';
import './index.css';

(function ($) {
  const jquery = $;

  const mySlider = (
    slider: JQuery<HTMLElement> = $('div'),
    userConfig: UserConfig = {},
  ): JQuery<HTMLElement> => {
    const model = new Model(userConfig);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    return slider;
  };

  jquery.fn.mySlider = function (userConfig: UserConfig = {}): JQuery<HTMLElement> {
    this.update = (userConfig: UserConfig): JQuery<HTMLElement> => {
      const updateSlider = (): void => {
        if (this.data('mySlider')) {
          const initialConfig: UserConfig = this.data('userConfig');
          const updatedConfig: UserConfig = $.extend({}, initialConfig, userConfig);

          this.data('mySlider', false);
          this.empty();
          this.data('mySlider', mySlider(this, updatedConfig));
        }
      };

      return this.each(updateSlider);
    };

    this.destroy = (): JQuery<HTMLElement> => {
      const destroySlider = (): void => {
        if (this.data('mySlider')) {
          this.data('mySlider', false);
          this.empty();
        }
      };

      return this.each(destroySlider);
    };

    const init = (): void => {
      this.data('mySlider', mySlider(this, userConfig));
      this.data('userConfig', userConfig);
    };

    return this.each(init);
  };
}(jQuery));

$(document).ready(() => {
  $('.js-slider_double').mySlider({
    isInterval: true,
    isTooltip: true,
    isVertical: false,
    isLimit: true,
    isRange: true,
    isScale: true,
    keyboard: true,
    min: -12.5,
    max: 12.5,
    step: 0,
    from: -5,
    to: 5,
  });

  $('.js-slider_single').mySlider({
    isInterval: true,
    isTooltip: false,
    isVertical: false,
    isLimit: true,
    isRange: false,
    isScale: true,
    keyboard: true,
    min: 0,
    max: 10000000,
    step: 2500000,
    from: 5000000,
    to: 7500000,
    scaleNumber: 5,
  });

  $('.js-slider_vertical').mySlider({
    isInterval: true,
    isTooltip: false,
    isVertical: true,
    isLimit: false,
    isRange: true,
    isScale: true,
    keyboard: true,
    min: -125,
    max: -5,
    step: 0,
    from: -85,
    to: -45,
    scaleNumber: 7,
  });

  $('.js-slider_empty').mySlider({
    isInterval: false,
    isTooltip: false,
    isVertical: false,
    isLimit: false,
    isRange: false,
    isScale: false,
    keyboard: true,
    min: 0,
    max: 10,
    step: 0,
    from: 5,
    to: 8,
  });

  const $slider = $('.js-slider_single').data('mySlider');

  $slider.update({
    isInterval: false,
  });
});
