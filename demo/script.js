$('.js-slider_double').mySlider({
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

$('.js-slider_single').mySlider({
  isInterval: true,
  isTooltip: true,
  isVertical: false,
  isMinAndMax: true,
  isRange: false,
  isPanel: true,
  isScale: true,
  keyboard: true,
  minValue: 0,
  maxValue: 10000000,
  step: 100000,
  from: 5000000,
  to: 7500000,
  scaleNumber: 5,
});

$('.js-slider_vertical').mySlider({
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
  scaleNumber: 7,
});

const $slider = $('.js-slider_single').data('mySlider');

$slider.update({
  isInterval: false,
});
