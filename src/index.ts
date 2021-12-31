import "./index.css";
import { Model } from './model/model';
import { View } from './view/view';
import { Presenter } from './presenter/presenter';

interface Config {
  isInterval: boolean;
  minValue: number;
  maxValue: number;
  from: number;
  to: number;
  step: number;
  keyboard: boolean;
  isVertical: boolean;
  isTooltip: boolean;
  isMinAndMax: boolean;
  isRangeBetween: boolean;
  isScale: boolean;
  scaleNumbers: number;
  isPanel: boolean;
}

(function($) {
  const mySlider = (slider: JQuery<HTMLElement>, options: Config): JQuery => {

    const model = new Model(options);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    return slider;
  };

  $.fn.mySlider = function(options: Config) {
    return this.each(function() {
      mySlider($(this), options);
    });
  }
})(jQuery);

$('.js-slider').mySlider({
  isInterval: true,
  minValue: -4.5,
  maxValue: 4.5,
  step: 0,
  from: -2.5,
  to: 2.5,
  keyboard: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRangeBetween: true,
  isPanel: true,
  isScale: true,
  scaleNumbers: 10
});