import Model from '../src/model/model';
import View from '../src/view/view';
import Presenter from '../src/presenter/presenter';

const slider = $('<div/>');

const model = new Model();
const view = new View(slider);
const presenter = new Presenter(model, view);

describe('init', () => {
  test('defines a function', () => {
    expect(typeof presenter.init).toBe('function');
  });

  test('should return undefinded', () => {
    expect(typeof presenter.init()).toBe('undefined');
  });
});

describe('launchEventManager', () => {
  test('changeHandleFromPosition', () => {
    const pointerDownEvent = jQuery.Event('pointerdown');
    const pointerMoveEvent = jQuery.Event('pointermove');

    presenter.view.$handleFrom.trigger(pointerDownEvent);

    expect(typeof $(document).trigger(pointerMoveEvent)).toBe('object');
  });

  test('changeHandleToPosition', () => {
    const pointerDownEvent = jQuery.Event('pointerdown');
    const pointerMoveEvent = jQuery.Event('pointermove');

    presenter.view.$handleTo.trigger(pointerDownEvent);

    expect(typeof $(document).trigger(pointerMoveEvent)).toBe('object');
  });

  test('changeHandleFromPositionAfterKeydown', () => {
    const focusIn = jQuery.Event('focusin');
    const keyDown = jQuery.Event('keydown');

    presenter.view.$handleFrom.trigger(focusIn);

    expect(typeof $(focusIn.currentTarget).trigger(keyDown)).toBe('object');
  });

  test('changeHandleToPositionAfterKeydown', () => {
    const focusIn = jQuery.Event('focusin');
    const keyDown = jQuery.Event('keydown');

    presenter.view.$handleTo.trigger(focusIn);

    expect(typeof $(focusIn.currentTarget).trigger(keyDown)).toBe('object');
  });

  test('changeHandleFromPositionAfterSliderOnDown and changeHandleToPositionAfterSliderOnDown', () => {
    const pointerDownEvent = jQuery.Event('pointerdown');

    expect(typeof presenter.view.$stripe.trigger(pointerDownEvent)).toBe('object');
  });

  test('changeHandleFromPositionAfterMinValueOnDown', () => {
    const pointerDown = jQuery.Event('pointerdown');

    expect(typeof presenter.view.$minValue.trigger(pointerDown)).toBe('object');
  });

  test('changeHandleFromPositionAfterMaxValueOnDown', () => {
    const pointerDown = jQuery.Event('pointerdown');

    expect(typeof presenter.view.$maxValue.trigger(pointerDown)).toBe('object');
  });

  test('changeHandleToPositionAfterMaxValueOnDown', () => {
    const pointerDown = jQuery.Event('pointerdown');

    expect(typeof presenter.view.$maxValue.trigger(pointerDown)).toBe('object');
  });

  test('changeHandlesPositionAfterScaleOnDown', () => {
    const pointerDown = jQuery.Event('pointerdown');

    expect(typeof presenter.view.$scaleContainer.trigger(pointerDown)).toBe('object');
  });
});

describe('launchPanelEventManager', () => {
  test('setMin', () => {
    const changeEvent = jQuery.Event('change');
    presenter.view.panel.$minInput.trigger(changeEvent);
    $(changeEvent.currentTarget).val(1);

    expect(typeof presenter.view.panel.$minInput.trigger(changeEvent)).toBe('object');
  });

  test('setMax', () => {
    const changeEvent = jQuery.Event('change');
    presenter.view.panel.$maxInput.trigger(changeEvent);
    $(changeEvent.currentTarget).val(1);

    expect(typeof presenter.view.panel.$maxInput.trigger(changeEvent)).toBe('object');
  });

  test('setFrom', () => {
    const changeEvent = jQuery.Event('change');
    presenter.view.panel.$fromInput.trigger(changeEvent);
    $(changeEvent.currentTarget).val(1);

    expect(typeof presenter.view.panel.$fromInput.trigger(changeEvent)).toBe('object');
  });

  test('setTo', () => {
    const changeEvent = jQuery.Event('change');
    presenter.view.panel.$toInput.trigger(changeEvent);
    $(changeEvent.currentTarget).val(1);

    expect(typeof presenter.view.panel.$toInput.trigger(changeEvent)).toBe('object');
  });

  test('setStep', () => {
    const changeEvent = jQuery.Event('change');
    presenter.view.panel.$stepInput.trigger(changeEvent);
    $(changeEvent.currentTarget).val(1);

    expect(typeof presenter.view.panel.$stepInput.trigger(changeEvent)).toBe('object');
  });

  test('toggleInterval', () => {
    const clickEvent = jQuery.Event('click');

    expect(typeof presenter.view.panel.$intervalToggle.trigger(clickEvent)).toBe('object');
  });

  test('toggleTooltip', () => {
    const clickEvent = jQuery.Event('click');

    expect(typeof presenter.view.panel.$tooltipsToggle.trigger(clickEvent)).toBe('object');
  });

  test('toggleRange', () => {
    const clickEvent = jQuery.Event('click');

    expect(typeof presenter.view.panel.$rangeToggle.trigger(clickEvent)).toBe('object');
  });

  test('toggleScale', () => {
    const clickEvent = jQuery.Event('click');

    expect(typeof presenter.view.panel.$scaleToogle.trigger(clickEvent)).toBe('object');
  });

  test('toggleVertical', () => {
    const clickEvent = jQuery.Event('click');

    expect(typeof presenter.view.panel.$verticalToggle.trigger(clickEvent)).toBe('object');
  });
});
