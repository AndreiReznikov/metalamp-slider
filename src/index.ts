import Model from './Model';
import View from './View';
import Presenter from './Presenter';
import { UserConfig } from './interfaces/interfaces';
import './index.scss';

(function createPooshkaSlider($) {
  const jquery = $;

  const initializePooshkaSlider = (
    $slider: JQuery<HTMLElement> = $('div'),
    userConfig: UserConfig = {},
  ): JQuery<HTMLElement> => {
    const currentUserConfig: UserConfig = { ...userConfig, ...$slider.data() };

    const model = new Model(currentUserConfig);
    const view = new View($slider);
    const presenter = new Presenter(model, view);

    $slider.data('api', presenter.getApi());

    return $slider;
  };

  const initializePooshkaSliderDefault = (): void => {
    const $pooshkaSlidersCollection = $('.pooshka-range-slider');

    if ($pooshkaSlidersCollection.length > 0) {
      $pooshkaSlidersCollection.each(function initialize() {
        const $slider = $(this);

        initializePooshkaSlider($slider);
      });
    }
  };

  initializePooshkaSliderDefault();

  jquery.fn.pooshkaSlider = function addMethods(userConfig?: UserConfig): JQuery<HTMLElement> {
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
      this.data('userConfig', userConfig ?? {});
    };

    return this.each(init);
  };
}(jQuery));
