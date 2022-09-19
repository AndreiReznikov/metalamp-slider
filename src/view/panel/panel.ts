import { Options } from '../../interfaces/interfaces';

class Panel {
  $panelContainer = $('<div/>');

  $textInputsContainer = $('<div/>').addClass('js-slider__text-inputs-container').appendTo(this.$panelContainer);

  $toggleInputsContainer = $('<div/>').addClass('js-slider__toggle-inputs-container').appendTo(this.$panelContainer);

  $minInputContainer = $('<div/>').addClass('js-slider__min-input-container').appendTo(this.$textInputsContainer);

  $minButton = $('<button/>').html('MIN').addClass('js-slider__min-button').appendTo(this.$minInputContainer);

  $minInput = $('<input/>').addClass('js-slider__min-input').attr('type', 'number').appendTo(this.$minInputContainer);

  $maxInputContainer = $('<div/>').addClass('js-slider__max-input-container').appendTo(this.$textInputsContainer);

  $maxButton = $('<button/>').html('MAX').addClass('js-slider__max-button').appendTo(this.$maxInputContainer);

  $maxInput = $('<input/>').addClass('js-slider__max-input').attr('type', 'number').appendTo(this.$maxInputContainer);

  $fromInputContainer = $('<div/>').addClass('js-slider__from-input-container').appendTo(this.$textInputsContainer);

  $fromButton = $('<button/>').html('FROM').addClass('js-slider__from-button').appendTo(this.$fromInputContainer);

  $fromInput = $('<input/>').addClass('js-slider__from-input').attr('type', 'number').appendTo(this.$fromInputContainer);

  $toInputContainer = $('<div/>').addClass('js-slider__to-input-container').appendTo(this.$textInputsContainer);

  $toButton = $('<button/>').html('TO').addClass('js-slider__to-button').appendTo(this.$toInputContainer);

  $toInput = $('<input/>').addClass('js-slider__to-input').attr('type', 'number').appendTo(this.$toInputContainer);

  $stepInputContainer = $('<div/>').addClass('js-slider__step-input-container').appendTo(this.$textInputsContainer);

  $stepButton = $('<button/>').html('STEP').addClass('js-slider__step-button').appendTo(this.$stepInputContainer);

  $stepInput = $('<input/>').addClass('js-slider__step-input').attr('type', 'number').appendTo(this.$stepInputContainer);

  $intervalToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);

  $intervalToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$intervalToggleContainer);

  $customIntervalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$intervalToggleContainer);

  $toggleText = $('<span/>').html('INTERVAL').addClass('js-slider__toggle-text').appendTo(this.$intervalToggleContainer);

  $tooltipsToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);

  $tooltipsToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$tooltipsToggleContainer);

  $customTooltipsToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$tooltipsToggleContainer);

  $toggleTooltipsText = $('<span/>').html('TOOLTIPS').addClass('js-slider__toggle-text').appendTo(this.$tooltipsToggleContainer);

  $rangeToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);

  $rangeToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$rangeToggleContainer);

  $customRangeToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$rangeToggleContainer);

  $toggleRangeText = $('<span/>').html('RANGE').addClass('js-slider__toggle-text').appendTo(this.$rangeToggleContainer);

  $scaleToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);

  $scaleToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$scaleToggleContainer);

  $customScaleToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$scaleToggleContainer);

  $toggleScaleText = $('<span/>').html('SCALE').addClass('js-slider__toggle-text').appendTo(this.$scaleToggleContainer);

  $verticalToggleContainer = $('<label/>').addClass('js-slider__toggle-container').appendTo(this.$toggleInputsContainer);

  $verticalToggle = $('<input/>').addClass('js-slider__input').attr('type', 'checkbox').appendTo(this.$verticalToggleContainer);

  $customVerticalToggle = $('<span/>').addClass('js-slider__custom-toggle').appendTo(this.$verticalToggleContainer);

  $toggleVerticalText = $('<span/>').html('VERTICAL').addClass('js-slider__toggle-text').appendTo(this.$verticalToggleContainer);

  public setPanelPosition = (options: Options): void => {
    this.$panelContainer.css(options.panelPositionParameter, options.panelPosition);
  };

  public setPanelValues = (options: Options): void => {
    if (!options.isPanel) return;

    this.$minInput.val(`${options.minValue}`).attr('step', `${options.isStepSet ? '' : (0.1).toFixed(options.numberOfCharactersAfterDot)}`);
    this.$maxInput.val(`${options.maxValue}`).attr('step', `${options.isStepSet ? '' : (0.1).toFixed(options.numberOfCharactersAfterDot)}`);
    this.$toInput.val(`${options.to}`).attr('step', `${options.isStepSet ? options.step : (0.1).toFixed(options.numberOfCharactersAfterDot)}`);
    this.$fromInput.val(`${options.from}`).attr('step', `${options.isStepSet ? options.step : (0.1).toFixed(options.numberOfCharactersAfterDot)}`);
    this.$stepInput.val(`${options.step}`).attr('step', `${(0.1).toFixed(options.numberOfCharactersAfterDot)}`);
    this.$intervalToggle.prop('checked', !!options.isInterval);
    this.$verticalToggle.prop('checked', !!options.isVertical);
    this.$tooltipsToggle.prop('checked', !!options.isTooltip);
    this.$rangeToggle.prop('checked', !!options.isRange);
    this.$scaleToggle.prop('checked', !!options.isScale);
  };
}

export default Panel;
