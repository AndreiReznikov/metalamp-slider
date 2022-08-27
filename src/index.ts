import './index.css';
import Model from './model/model';
import View from './view/view';
import Presenter from './presenter/presenter';
import { UserConfig } from './interfaces/interfaces';

(function ($) {
  const jquery = $;

  const mySlider = (slider: JQuery<HTMLElement>, userConfig: UserConfig): JQuery<HTMLElement> => {
    const model = new Model(userConfig);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    presenter.init();

    return slider;
  };

  jquery.fn.mySlider = function (userConfig: UserConfig): JQuery<HTMLElement> {
    const initSlider = (): void => {
      if (!this.data('mySlider')) {
        this.data('mySlider', mySlider(this, userConfig));
        this.data('userConfig', userConfig);
      }
    };

    return this.each(initSlider);
  };

  jquery.fn.update = function (userConfig: UserConfig): JQuery<HTMLElement> {
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

  jquery.fn.destroy = function (): JQuery<HTMLElement> {
    const destroySlider = (): void => {
      if (this.data('mySlider')) {
        this.data('mySlider', false);
        this.empty();
      }
    };

    return this.each(destroySlider);
  };
}(jQuery));

$('.js-slider0').mySlider({
  isInterval: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRange: true,
  isPanel: true,
  isScale: true,
  keyboard: true,
  minValue: -12.5,
  maxValue: 12.5,
  step: 0,
  from: -5,
  to: 5,
});

$('.js-slider1').mySlider({
  isInterval: false,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRange: false,
  isPanel: true,
  isScale: true,
  keyboard: true,
  minValue: 1000,
  maxValue: 100000,
  step: 10000,
  from: 12000,
  to: 5000,
});

$('.js-slider2').mySlider({
  isInterval: true,
  isTooltip: false,
  isVertical: true,
  isMinAndMax: false,
  isRange: true,
  isPanel: true,
  isScale: true,
  keyboard: true,
  minValue: -125,
  maxValue: -5,
  step: 0,
  from: -85,
  to: -45,
});

const $slider = $('.js-slider').data('mySlider');

$slider.update({
  isInterval: false,
});
