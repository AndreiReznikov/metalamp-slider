import './index.css';
import { Model } from './model/model';
import { View } from './view/view';
import { Presenter } from './presenter/presenter';
import { UserConfig } from './interfaces/interfaces';

(function($) {
  const mySlider = (slider: JQuery<HTMLElement>, userConfig: UserConfig): JQuery<HTMLElement> => {

    const model = new Model(userConfig);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    return slider;
  };

  $.fn.mySlider = function(userConfig: UserConfig): JQuery<HTMLElement> {
    const initSlider = (): void => {
      if (!this.data('mySlider')) {
        this.data('mySlider', mySlider(this, userConfig));
        this.data('userConfig', userConfig);
      }
    };

    return this.each(initSlider);
  }

  $.fn.update = function(userConfig: UserConfig): JQuery<HTMLElement> {
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
  }

  $.fn.destroy = function(): JQuery<HTMLElement> {
    const destroySlider = (): void => {
      if (this.data('mySlider')) {
        this.data('mySlider', false);
        this.empty();
      }
    };
    
    return this.each(destroySlider);
  }
})(jQuery);

$('.js-slider').mySlider({
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

const $slider = $('.js-slider').data('mySlider');

$slider.update({
  isInterval: false
});

