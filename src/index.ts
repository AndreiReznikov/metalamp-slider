import Model from './model/model';
import View from './view/view';
import Presenter from './presenter/presenter';
import { UserConfig } from './interfaces/interfaces';
import './index.css';

(function ($) {
  const jquery = $;

  const mySlider = (slider: JQuery<HTMLElement>, userConfig: UserConfig): JQuery<HTMLElement> => {
    const model = new Model(userConfig);
    const view = new View(slider);
    const presenter = new Presenter(model, view);

    return slider;
  };

  jquery.fn.mySlider = function (userConfig: UserConfig): JQuery<HTMLElement> {
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
