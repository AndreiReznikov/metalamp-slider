import { Options } from '../interfaces/interfaces';
import Panel from './panel/panel';
import SubView from './SubView';

class View {
  SubView: SubView;

  panel: Panel;

  $window: JQuery<Window & typeof globalThis>;

  $slider: JQuery<HTMLElement>;

  $stripe: JQuery<HTMLElement>;

  $runnerFrom: JQuery<HTMLElement>;

  $runnerTo: JQuery<HTMLElement>;

  $range: JQuery<HTMLElement>;

  $limitMin: JQuery<HTMLElement>;

  $limitMax: JQuery<HTMLElement>;

  $scaleContainer: JQuery<HTMLElement>;

  $tooltipFrom: JQuery<HTMLElement>;

  $tooltipTo: JQuery<HTMLElement>;

  $panelContainer: JQuery<HTMLElement>;

  sliderWidth = 0;

  sliderHeight = 0;

  sliderRelativeWidth = 0;

  constructor($slider: JQuery<HTMLElement> = $('div')) {
    this.SubView = new SubView();
    this.panel = new Panel();

    this.$window = $(window);
    this.$slider = $slider;
    this.$stripe = this.SubView.$stripe;
    this.$runnerFrom = this.SubView.runnerFrom.$runner;
    this.$runnerTo = this.SubView.runnerTo.$runner;
    this.$range = this.SubView.range.$range;
    this.$limitMin = this.SubView.limitMin.$limit;
    this.$limitMax = this.SubView.limitMax.$limit;
    this.$scaleContainer = this.SubView.scale.$scaleContainer;
    this.$tooltipFrom = this.SubView.tooltipFrom.$tooltip;
    this.$tooltipTo = this.SubView.tooltipTo.$tooltip;
    this.$panelContainer = this.panel.$panelContainer;

    this.renderView();

    const $container = this.$slider.parent();

    this.sliderWidth = parseInt($container.css('width'), 10);
    this.sliderHeight = parseInt($container.css('height'), 10);
    this.sliderRelativeWidth = (parseInt($container.css('width'), 10)
    / parseInt($container.parent().css('width'), 10)) * 100;
  }

  public initializeView = (options: Options): void => {
    this.$slider.css({ width: '100%', height: '100%', 'box-sizing': 'border-box' });

    if (options.modelOptions.isRange) {
      this.SubView.range.$range.css('display', 'block');
    } else {
      this.SubView.range.$range.css('display', 'none');
    }

    if (options.modelOptions.isLimit) {
      this.$limitMin.css('display', 'flex');
      this.$limitMax.css('display', 'flex');
    } else {
      this.$limitMin.css('display', 'none');
      this.$limitMax.css('display', 'none');
    }

    if (options.modelOptions.isScale) {
      this.$scaleContainer.css('display', 'flex');
    } else {
      this.$scaleContainer.css('display', 'none');
    }

    if (options.modelOptions.isInterval) {
      this.$runnerTo.css('display', 'block');
    } else {
      this.$runnerTo.css('display', 'none');
    }

    if (options.modelOptions.isTooltip) {
      this.$tooltipFrom.css('display', 'flex');

      if (options.modelOptions.isInterval) {
        this.$tooltipTo.css('display', 'flex');
      } else {
        this.$tooltipTo.css('display', 'none');
      }
    } else {
      this.$tooltipFrom.css('display', 'none');
      this.$tooltipTo.css('display', 'none');
    }

    if (options.modelOptions.isPanel) {
      this.$panelContainer.css('display', 'flex');
    } else {
      this.$panelContainer.css('display', 'none');
    }

    this.setPlane(options.modelOptions.isVertical);
  };

  private setPlane = (isVertical = false): void => {
    this.$runnerFrom.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.$runnerTo.css({ top: 0, left: 0, transform: 'translate(0, 0)' });
    this.SubView.range.$range.css({
      width: 0, height: 0, top: 0, left: 0,
    });
    this.$tooltipFrom.css({ left: 0, bottom: 0, top: 0 });
    this.$tooltipTo.css({ left: 0, bottom: 0, top: 0 });
    this.$limitMin.css({ left: 0, bottom: 0, top: 0 });
    this.$limitMax.css({ left: 0, bottom: 0, top: 0 });
    this.$scaleContainer.css({
      right: 0, top: 0, width: 0, height: 0,
    });
    this.$panelContainer.css({ right: '', top: '' });

    const runnerFromWidth: number = parseInt(this.$runnerFrom.css('width'), 10);
    const runnerFromHeight: number = parseInt(this.$runnerFrom.css('height'), 10);
    const runnerToWidth: number = parseInt(this.$runnerTo.css('width'), 10);
    const runnerToHeight: number = parseInt(this.$runnerTo.css('height'), 10);

    if (isVertical) {
      this.$slider.parent().css({ width: this.sliderHeight, height: this.sliderWidth });
      this.$runnerFrom.css({ left: '50%', transform: 'translateX(-50%)' });
      this.$runnerTo.css({ left: '50%', transform: 'translateX(-50%)' });
      this.SubView.range.$range.css({ width: '100%' });
      this.$tooltipFrom.css({ left: runnerFromWidth });
      this.$tooltipTo.css({ left: runnerToWidth });
      this.$limitMin.css({ left: runnerFromWidth });
      this.$limitMax.css({ left: runnerFromWidth });
      this.$panelContainer.css({ transform: 'translateX(0)', top: 0, width: '150px' });

      return;
    }

    this.$slider.parent().css({ width: `${this.sliderRelativeWidth}%`, height: this.sliderHeight });
    this.$runnerFrom.css({ top: '50%', transform: 'translateY(-50%)' });
    this.$runnerTo.css({ top: '50%', transform: 'translateY(-50%)' });
    this.SubView.range.$range.css({ height: '100%' });
    this.$tooltipFrom.css({ bottom: runnerFromHeight, top: '' });
    this.$tooltipTo.css({ bottom: runnerToHeight, top: '' });
    this.$limitMin.css({ bottom: runnerFromHeight, top: '' });
    this.$limitMax.css({ bottom: runnerFromHeight, top: '' });
    this.$panelContainer.css({ left: '50%', transform: 'translateX(-50%)', width: '650px' });
  };

  private renderView = (): void => {
    this.$stripe.appendTo(this.$slider).addClass('js-slider__stripe');
    this.$runnerFrom.appendTo(this.$stripe).addClass('js-slider__runner-from');
    this.$runnerTo.appendTo(this.$stripe).addClass('js-slider__runner-to');
    this.SubView.range.$range.appendTo(this.$stripe).addClass('js-slider__range');
    this.$limitMin.appendTo(this.$stripe).addClass('js-slider__min-value');
    this.$limitMax.appendTo(this.$stripe).addClass('js-slider__max-value');
    this.$scaleContainer.appendTo(this.$stripe).addClass('js-slider__scale-container');
    this.$tooltipFrom.appendTo(this.$stripe).addClass('js-slider__tooltip-from');
    this.$tooltipTo.appendTo(this.$stripe).addClass('js-slider__tooltip-to');
    this.$panelContainer.appendTo(this.$stripe).addClass('js-slider__panel-container');
  };
}

export default View;
