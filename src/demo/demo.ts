import PooshkaSlider from './PooshkaSlider';
import './demo.scss';

$(document).ready(() => {
  const pooshkaSlider = new PooshkaSlider(
    '.js-slider-container',
    {
      double: true,
      vertical: false,
      showTooltip: true,
      showLimit: true,
      showRange: true,
      showScale: true,
      min: -12.5,
      max: 12.5,
      step: 0,
      from: -5,
      to: 5,
    },
  );

  const pooshkaSliderSingle = new PooshkaSlider(
    '.js-second-slider-container',
    {
      double: true,
      vertical: false,
      showTooltip: false,
      showLimit: true,
      showRange: false,
      showScale: true,
      min: 0,
      max: 10000000,
      step: 2500000,
      from: 5000000,
      to: 7500000,
      scaleNumber: 5,
    },
  );

  // $('.js-slider_vertical').pooshkaSlider({
  //   double: true,
  //   vertical: true,
  //   showTooltip: false,
  //   showLimit: false,
  //   showRange: true,
  //   showScale: true,
  //   useKeyboard: true,
  //   min: -125,
  //   max: -5,
  //   step: 0,
  //   from: -85,
  //   to: -45,
  //   scaleNumber: 7,
  // });

  // $('.js-slider_empty').pooshkaSlider({
  //   double: false,
  //   vertical: false,
  //   showTooltip: false,
  //   showLimit: false,
  //   showRange: false,
  //   showScale: false,
  //   useKeyboard: true,
  //   min: 0,
  //   max: 10,
  //   step: 0,
  //   from: 5,
  //   to: 8,
  // });

  // $(document).on('mousemove.from', () => {
  //   $('.js-slider__from-input').prop('value', $sliderDouble.data('api').getModelOptions().from);
  // });
  // $('.js-slider').on('mousedown.from', () => {
  //   $('.js-slider__from-input').prop('value', $sliderDouble.data('api').getModelOptions().from);
  // });

  // $(document).on('mousemove.to', () => {
  //   $('.js-slider__to-input').prop('value', $sliderDouble.data('api').getModelOptions().to);
  // });
  // $('.js-slider').on('mousedown.to', () => {
  //   $('.js-slider__to-input').prop('value', $sliderDouble.data('api').getModelOptions().to);
  // });
});
