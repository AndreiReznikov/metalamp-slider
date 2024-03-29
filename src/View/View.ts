import { Options, LENGTH, DEFAULTS } from '~/interfaces/interfaces';

import AbstractView from './AbstractView';

class View extends AbstractView {
  constructor($slider: JQuery<HTMLElement> = $('<div/>')) {
    super($slider);

    this.setContainerParameters();
    this.renderView();
  }

  public initializeView = (options: Options): void => {
    const {
      showRange, showLimit, showScale, showTooltip, double,
    } = options.modelOptions;

    this.$slider.css({ width: '100%', height: '100%', 'box-sizing': 'border-box' });
    this.$stripe.css({ width: '100%', height: '100%' });

    if (showRange) {
      this.$range.css('display', 'block');
    } else {
      this.$range.css('display', 'none');
    }

    if (showLimit) {
      this.$limitMin.css('display', 'flex');
      this.$limitMax.css('display', 'flex');
    } else {
      this.$limitMin.css('display', 'none');
      this.$limitMax.css('display', 'none');
    }

    if (showScale) {
      this.$scaleContainer.css('display', 'flex');
    } else {
      this.$scaleContainer.css('display', 'none');
    }

    if (double) {
      this.$runnerTo.css('display', 'block');
    } else {
      this.$runnerTo.css('display', 'none');
    }

    if (showTooltip) {
      this.$tooltipFrom.css('display', 'flex');

      if (double) {
        this.$tooltipTo.css('display', 'flex');
      } else {
        this.$tooltipTo.css('display', 'none');
      }
    } else {
      this.$tooltipFrom.css('display', 'none');
      this.$tooltipTo.css('display', 'none');
    }
  };

  public setPlane = (options: Options): void => {
    const { vertical } = options.modelOptions;
    const { runnerLength } = options.subViewOptions;
    const {
      containerWidth,
      containerRelativeWidth,
      containerHeight,
    } = this.containerParameters;

    this.$runnerFrom.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$runnerTo.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$range.css({
      width: 0, height: 0, top: 0, left: 0,
    });
    this.$tooltipFrom.css({ left: 0, bottom: 0, top: 0 });
    this.$tooltipTo.css({ left: 0, bottom: 0, top: 0 });
    this.$limitMin.css({ left: 0, bottom: 0, top: 0 });
    this.$limitMax.css({ left: 0, bottom: 0, top: 0 });
    this.$scaleContainer.css({
      right: -runnerLength / 2, top: runnerLength / 2, width: 0, height: 0,
    });

    if (vertical) {
      this.$container.css({ width: containerHeight, height: containerWidth });
      this.$slider.css({ width: DEFAULTS.HEIGHT });
      this.$runnerFrom.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$runnerTo.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$range.css({ width: '100%' });
      this.$tooltipFrom.css({ left: runnerLength });
      this.$tooltipTo.css({ left: runnerLength });
      this.$limitMin.css({ left: runnerLength });
      this.$limitMax.css({ left: runnerLength });

      return;
    }

    this.$container.css({ width: `${containerRelativeWidth}%`, height: containerHeight });
    this.$slider.css({ height: DEFAULTS.HEIGHT });
    this.$runnerFrom.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$runnerTo.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$range.css({ height: '100%' });
    this.$tooltipFrom.css({ bottom: runnerLength, top: '' });
    this.$tooltipTo.css({ bottom: runnerLength, top: '' });
    this.$limitMin.css({ bottom: runnerLength, top: '' });
    this.$limitMax.css({ bottom: runnerLength, top: '' });
  };

  private renderView = (): void => {
    this.$slider.addClass('pooshka-slider js-pooshka-slider');
    this.$stripe.appendTo(this.$slider).addClass('pooshka-slider__stripe js-pooshka-slider__stripe');
    this.$runnerFrom.appendTo(this.$stripe).addClass('pooshka-slider__from js-pooshka-slider__from');
    this.$runnerTo.appendTo(this.$stripe).addClass('pooshka-slider__to js-pooshka-slider__to');
    this.$range.appendTo(this.$stripe).addClass('pooshka-slider__range js-pooshka-slider__range');
    this.$limitMin.appendTo(this.$stripe).addClass('pooshka-slider__min js-pooshka-slider__min');
    this.$limitMax.appendTo(this.$stripe).addClass('pooshka-slider__max js-pooshka-slider__max');
    this.$scaleContainer.appendTo(this.$stripe).addClass('pooshka-slider__scale-container js-pooshka-slider__scale-container');
    this.$tooltipFrom.appendTo(this.$stripe).addClass('pooshka-slider__tooltip-from js-pooshka-slider__tooltip-from');
    this.$tooltipTo.appendTo(this.$stripe).addClass('pooshka-slider__tooltip-to js-pooshka-slider__tooltip-to');
  };

  private setContainerParameters = (): void => {
    this.$container = this.$slider.parent();
    this.$containerEnvironment = this.$container.parent();

    const containerWidth = parseInt(this.$container.css(LENGTH.WIDTH), 10);
    const containerHeight = parseInt(this.$container.css(LENGTH.HEIGHT), 10);
    const containerRelativeWidth = (parseInt(this.$container.css(LENGTH.WIDTH), 10)
    / parseInt(this.$containerEnvironment.css(LENGTH.WIDTH), 10)) * 100;

    this.containerParameters = {
      containerWidth,
      containerHeight,
      containerRelativeWidth,
    };
  };
}

export default View;
