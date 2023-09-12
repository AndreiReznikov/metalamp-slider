import PooshkaSlider from './PooshkaSlider';
import './index.scss';

const initializePlugins = () => {
  const pooshkaSliderDouble = new PooshkaSlider('.js-demo-page__double-slider-container');

  pooshkaSliderDouble.initializePlugin({
    double: true,
    vertical: false,
    showTooltip: true,
    showLimit: true,
    showRange: true,
    showScale: true,
    min: -12.5,
    max: 12.5,
    step: 0.5,
    from: -5,
    to: 5,
    scaleNumber: 11,
  });

  const pooshkaSliderSingle = new PooshkaSlider('.js-demo-page__single-slider-container');

  pooshkaSliderSingle.initializePlugin({
    double: false,
    vertical: false,
    showTooltip: false,
    showLimit: true,
    showRange: false,
    showScale: true,
    localeString: true,
    min: 0,
    max: 10000000,
    step: 2500000,
    from: 5000000,
    to: 7500000,
    scaleNumber: 5,
  });

  const pooshkaSliderVertical = new PooshkaSlider('.js-demo-page__vertical-slider-container');

  pooshkaSliderVertical.initializePlugin({
    double: true,
    vertical: true,
    showTooltip: true,
    showLimit: true,
    showRange: true,
    showScale: true,
    min: -125,
    max: -5,
    from: -85,
    to: -45,
    scaleNumber: 7,
  });

  const pooshkaSliderDefault = new PooshkaSlider('.js-demo-page__default-slider-container');

  pooshkaSliderDefault.initializePlugin();
};

document.addEventListener('DOMContentLoaded', initializePlugins);
