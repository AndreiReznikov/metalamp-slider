import { Options, ElementsParameters } from '../interfaces/interfaces';
import Stripe from './stripe/stripe';
// import Range from './range/range';
// import RunnerFrom from './runner-from/runner-from';
// import RunnerTo from './runner-to/runner-to';
import Tooltip from './tooltip/tooltip';
import MinAndMaxValues from './min-and-max/min-and-max';
import Scale from './scale/scale';
import Panel from './panel/panel';
import SubView from './SubView';

class View {
  SubView: SubView;

  // tooltip: Tooltip;

  // runnerFrom: RunnerFrom;

  // runnerTo: RunnerTo;

  // range: Range;

  stripe: Stripe;

  minAndMaxValues: MinAndMaxValues;

  scale: Scale;

  panel: Panel;

  $window: JQuery<Window & typeof globalThis>;

  $this: JQuery<HTMLElement>;

  $stripe: JQuery<HTMLElement>;

  $runnerFrom: JQuery<HTMLElement>;

  $runnerTo: JQuery<HTMLElement>;

  $range: JQuery<HTMLElement>;

  $minValue: JQuery<HTMLElement>;

  $maxValue: JQuery<HTMLElement>;

  $scaleContainer: JQuery<HTMLElement>;

  $tooltipFrom: JQuery<HTMLElement>;

  $tooltipTo: JQuery<HTMLElement>;

  $panelContainer: JQuery<HTMLElement>;

  sliderWidth = 0;

  sliderHeight = 0;

  sliderRelativeWidth = 0;

  constructor($slider: JQuery<HTMLElement> = $('div')) {
    this.SubView = new SubView();
    // this.tooltipFrom = new Tooltip();
    // this.tooltipTo = new Tooltip();
    // this.runnerFrom = new RunnerFrom();
    // this.runnerTo = new RunnerTo();
    // this.range = new Range();
    this.stripe = new Stripe();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();
    this.panel = new Panel();

    this.$window = $(window);
    this.$this = $slider;
    this.$stripe = this.SubView.$stripe;
    this.$runnerFrom = this.SubView.runnerFrom.$runner;
    this.$runnerTo = this.SubView.runnerTo.$runner;
    this.$range = this.SubView.range.$range;
    this.$minValue = this.minAndMaxValues.$minValue;
    this.$maxValue = this.minAndMaxValues.$maxValue;
    this.$scaleContainer = this.scale.$scaleContainer;
    this.$tooltipFrom = this.SubView.tooltipFrom.$tooltip;
    this.$tooltipTo = this.SubView.tooltipTo.$tooltip;
    this.$panelContainer = this.panel.$panelContainer;

    this.renderView();
    this.SubView.getElementParameters();

    const $container = this.$this.parent();

    this.sliderWidth = parseInt($container.css('width'), 10);
    this.sliderHeight = parseInt($container.css('height'), 10);
    this.sliderRelativeWidth = (parseInt($container.css('width'), 10)
    / parseInt($container.parent().css('width'), 10)) * 100;
  }

  public getElementsParameters = (
    isVertical = false,
    lengthParameter = '',
  ): ElementsParameters => {
    const $scaleElement = $('.js-slider__scale-element');

    const elementsParameters: ElementsParameters = {
      sliderPosition: View.getCoords(this.$stripe, isVertical),
      sliderLength: parseInt(this.$stripe.css(lengthParameter), 10),
      runnerFromPosition: this.SubView.runnerFrom.runnerPosition,
      runnerLength: parseInt(this.$runnerFrom.css(lengthParameter), 10),
      tooltipFromLength: parseInt(this.$tooltipFrom.css(lengthParameter), 10),
      tooltipToLength: parseInt(this.$tooltipTo.css(lengthParameter), 10),
      minValueLength: parseInt(this.$minValue.css(lengthParameter), 10),
      maxValueLength: parseInt(this.$maxValue.css(lengthParameter), 10),
      minValueWidth: parseInt(this.$minValue.css('width'), 10),
      maxValueWidth: parseInt(this.$maxValue.css('width'), 10),
      scaleElementHeight: parseInt($scaleElement.css('height'), 10),
    };

    return elementsParameters;
  };

  public initView = (options: Options): void => {
    this.$this.css({ width: '100%', height: '100%', 'box-sizing': 'border-box' });

    if (options.isRange) {
      this.SubView.range.$range.css('display', 'block');
    } else {
      this.SubView.range.$range.css('display', 'none');
    }

    if (options.isMinAndMax) {
      this.$minValue.css('display', 'flex');
      this.$maxValue.css('display', 'flex');
    } else {
      this.$minValue.css('display', 'none');
      this.$maxValue.css('display', 'none');
    }

    if (options.isScale) {
      this.$scaleContainer.css('display', 'flex');
    } else {
      this.$scaleContainer.css('display', 'none');
    }

    if (options.isInterval) {
      this.$runnerTo.css('display', 'block');
    } else {
      this.$runnerTo.css('display', 'none');
    }

    if (options.isTooltip) {
      this.$tooltipFrom.css('display', 'flex');

      if (options.isInterval) {
        this.$tooltipTo.css('display', 'flex');
      } else {
        this.$tooltipTo.css('display', 'none');
      }
    } else {
      this.$tooltipFrom.css('display', 'none');
      this.$tooltipTo.css('display', 'none');
    }

    if (options.isPanel) {
      this.$panelContainer.css('display', 'flex');
    } else {
      this.$panelContainer.css('display', 'none');
    }

    this.setPlane(options.isVertical);
  };

  private setPlane = (isVertical = false): void => {
    this.$runnerFrom.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$runnerTo.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.SubView.range.$range.css({
      width: 0, height: 0, top: 0, left: 0,
    });
    this.$tooltipFrom.css({ left: 0, bottom: 0, top: 0 });
    this.$tooltipTo.css({ left: 0, bottom: 0, top: 0 });
    this.$minValue.css({ left: 0, bottom: 0, top: 0 });
    this.$maxValue.css({ left: 0, bottom: 0, top: 0 });
    this.$scaleContainer.css({
      right: 0, top: 0, width: 0, height: 0,
    });
    this.$panelContainer.css({ right: '', top: '' });

    const runnerFromWidth: number = parseInt(this.$runnerFrom.css('width'), 10);
    const runnerFromHeight: number = parseInt(this.$runnerFrom.css('height'), 10);
    const runnerToWidth: number = parseInt(this.$runnerTo.css('width'), 10);
    const runnerToHeight: number = parseInt(this.$runnerTo.css('height'), 10);

    if (isVertical) {
      this.$this.parent().css({ width: this.sliderHeight, height: this.sliderWidth });
      this.$runnerFrom.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$runnerTo.css({ left: '50%', transform: 'translateX(-50%)' });
      this.SubView.range.$range.css({ width: '100%' });
      this.$tooltipFrom.css({ left: runnerFromWidth });
      this.$tooltipTo.css({ left: runnerToWidth });
      this.$minValue.css({ left: runnerFromWidth });
      this.$maxValue.css({ left: runnerFromWidth });
      this.$panelContainer.css({ transform: 'translateX(0)', top: 0, width: '150px' });

      return;
    }

    this.$this.parent().css({ width: `${this.sliderRelativeWidth}%`, height: this.sliderHeight });
    this.$runnerFrom.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$runnerTo.css({ top: '50%', transform: 'translateY(-50%)' });
    this.SubView.range.$range.css({ height: '100%' });
    this.$tooltipFrom.css({ bottom: runnerFromHeight, top: '' });
    this.$tooltipTo.css({ bottom: runnerToHeight, top: '' });
    this.$minValue.css({ bottom: runnerFromHeight, top: '' });
    this.$maxValue.css({ bottom: runnerFromHeight, top: '' });
    this.$panelContainer.css({ left: '50%', transform: 'translateX(-50%)', width: '650px' });
  };

  private renderView = (): void => {
    this.$stripe.appendTo(this.$this).addClass('js-slider__stripe');
    this.$runnerFrom.appendTo(this.$stripe).addClass('js-slider__runner-from');
    this.$runnerTo.appendTo(this.$stripe).addClass('js-slider__runner-to');
    this.SubView.range.$range.appendTo(this.$stripe).addClass('js-slider__range');
    this.$minValue.appendTo(this.$stripe).addClass('js-slider__min-value');
    this.$maxValue.appendTo(this.$stripe).addClass('js-slider__max-value');
    this.$scaleContainer.appendTo(this.$stripe).addClass('js-slider__scale-container');
    this.$tooltipFrom.appendTo(this.$stripe).addClass('js-slider__tooltip-from');
    this.$tooltipTo.appendTo(this.$stripe).addClass('js-slider__tooltip-to');
    this.$panelContainer.appendTo(this.$stripe).addClass('js-slider__panel-container');
  };

  static getCoords = (element: JQuery<HTMLElement> = $('div'), isVertical = false): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  };
}

export default View;
