import './index.css';
import { Model } from './model/model';
import { View } from './view/view';
import { Presenter } from './presenter/presenter';
import { Config } from './interfaces/interfaces';

(function($) {
  const mySlider = (slider: JQuery<HTMLElement>, config: Config): JQuery => {

    const model = new Model(config);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    return slider;
  };

  $.fn.mySlider = function(config: Config) {
    return this.each(function() {
      mySlider($(this), config);
    });
  }
})(jQuery);

$('.js-slider').mySlider({
  isInterval: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRangeBetween: true,
  isPanel: true,
  isScale: true,
  keyboard: true,
  minValue: -12.5,
  maxValue: 12.5,
  step: 0,
  from: -5,
  to: 5,
});