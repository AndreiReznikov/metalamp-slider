import PooshkaSlider from './PooshkaSlider';
import './index.scss';

$(document).ready(() => {
  const pooshkaSliderDouble = new PooshkaSlider('.js-demo-page__double-slider-container');

  pooshkaSliderDouble.initializePlugin({
    double: false,
    vertical: false,
    showTooltip: true,
    showLimit: true,
    showRange: true,
    showScale: true,
    min: 200,
    max: 1000,
    step: 300,
    from: 500,
    to: 500,
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
    step: 0,
    from: -85,
    to: -45,
    scaleNumber: 7,
  });

  const pooshkaSliderDefault = new PooshkaSlider('.js-demo-page__default-slider-container');

  pooshkaSliderDefault.initializePlugin();
});
