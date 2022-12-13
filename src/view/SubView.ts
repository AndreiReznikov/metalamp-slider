import Observer from '../model/observer';
import Stripe from './stripe/stripe';
import Range from './range/range';
import Runner from './runner/runner';
import Tooltip from './tooltip/tooltip';
import Limit from './limit/limit';
import Scale from './scale/scale';
import Panel from './panel/panel';
import { Options } from '../interfaces/interfaces';

class SubView {
  observer: Observer;

  stripe: Stripe;

  limitMin: Limit;

  limitMax: Limit;

  tooltipFrom: Tooltip;

  tooltipTo: Tooltip;

  runnerFrom: Runner;

  runnerTo: Runner;

  range: Range;

  scale: Scale;

  panel: Panel;

  $document: JQuery<Document>;

  $stripe: JQuery<HTMLElement>;

  coord = 0;

  clickPosition = 0;

  sliderLength = 0;

  sliderPosition = 0;

  runnerLength = 0;

  limitMinLength = 0;

  limitMaxLength = 0;

  shiftAxis = 0;

  modelOptions: any;

  constructor() {
    this.observer = new Observer();

    this.stripe = new Stripe();
    this.tooltipFrom = new Tooltip('from');
    this.tooltipTo = new Tooltip('to');
    this.runnerFrom = new Runner('from');
    this.runnerTo = new Runner('to');
    this.range = new Range();
    this.limitMin = new Limit('min');
    this.limitMax = new Limit('max');
    this.scale = new Scale();
    this.panel = new Panel();

    this.$document = $(document);
    this.$stripe = this.stripe.$stripe;
  }

  public setModelOptions = (options: any) => {
    this.modelOptions = options;
  };

  public makeRunnerFromPointermoveHandler = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerFrom.calculateShiftAxis(this.getSubViewOptions());

    const handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
      this.calculateClickPosition(event);
      this.runnerFrom.calculateRunnerPositionWhileMoving(this.getSubViewOptions());
      this.restrictRunnerFromPosition(this.getSubViewOptions());

      this.observer.notifyObservers(this.getSubViewOptions());
    };

    this.$document.on('pointermove.move-from', handleRunnerFromPointermove);
    this.$document.on('pointerup.move-from', () => this.$document.off('pointermove.move-from', handleRunnerFromPointermove));
  };

  public makeRunnerToPointermoveHandler = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerTo.calculateShiftAxis(this.getSubViewOptions());

    const handleRunnerToPointermove = (event: JQuery.TriggeredEvent): void => {
      this.calculateClickPosition(event);
      this.runnerTo.calculateRunnerPositionWhileMoving(this.getSubViewOptions());
      this.restrictRunnerToPosition();

      this.observer.notifyObservers(this.getSubViewOptions());
    };

    this.$document.on('pointermove.move-to', handleRunnerToPointermove);
    this.$document.on('pointerup.move-to', () => this.$document.off('pointermove.move-to', handleRunnerToPointermove));
  };

  public handleLimitMinSetRunnerFromPosition = (): void => {
    this.runnerFrom.calculateMinRunnerPosition(this.getSubViewOptions());

    this.observer.notifyObservers(this.getSubViewOptions());
  };

  public handleLimitMaxSetRunnerPosition = (): void => {
    if (this.getSubViewOptions().modelOptions.isInterval) {
      this.runnerTo.calculateMaxRunnerPosition(this.getSubViewOptions());
    } else {
      this.runnerFrom.calculateMaxRunnerPosition(this.getSubViewOptions());
    }

    this.observer.notifyObservers(this.getSubViewOptions());
  };

  public calculateClickPosition = (event: JQuery.TriggeredEvent): void => {
    if (!event.clientX) return;

    this.clickPosition = event.clientX - this.sliderPosition;
  };

  public getSubViewOptions = () => {
    const subViewOptions = {
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      runnerFromPosition: this.runnerFrom.runnerPosition,
      runnerToPosition: this.runnerTo.runnerPosition,
      runnerLength: this.runnerLength,
      limitMinLength: parseInt(this.limitMin.$limit.css('width'), 10),
      limitMaxLength: parseInt(this.limitMax.$limit.css('width'), 10),
      clickPosition: this.clickPosition,
      shiftAxis: this.shiftAxis,
      isCursorNearStepAheadFrom: this.runnerFrom.isCursorNearStepAhead,
      isCursorNearStepBehindFrom: this.runnerFrom.isCursorNearStepBehind,
      isCursorNearStepAheadTo: this.runnerTo.isCursorNearStepAhead,
      isCursorNearStepBehindTo: this.runnerTo.isCursorNearStepBehind,
      modelOptions: this.modelOptions,
    };

    return subViewOptions;
  };

  public getElementParameters = () => {
    this.sliderPosition = this.getCoords(this.$stripe, false);
    this.sliderLength = parseInt(this.$stripe.css('width'), 10);
    this.runnerLength = parseInt(this.runnerFrom.$runner.css('width'), 10);
  };

  private restrictRunnerFromPosition = (subViewOptions: any): void => {
    const isRunnerFromPositionLessThanMinimum: boolean = this.runnerFrom.runnerPosition
      < 0 - this.runnerLength / 2;
    const isRunnerFromPositionMoreThanMaximum: boolean = this.runnerFrom.runnerPosition
      > this.sliderLength - this.runnerLength / 2;
    const
      isRunnerFromPositionMoreThanRunnerToPosition: boolean = subViewOptions.modelOptions.isInterval
      && this.runnerFrom.runnerPosition > this.runnerTo.runnerPosition;

    if (isRunnerFromPositionLessThanMinimum) {
      this.runnerFrom.runnerPosition = 0 - this.runnerLength / 2;
    } else if (isRunnerFromPositionMoreThanMaximum) {
      this.runnerFrom.runnerPosition = this.sliderLength - this.runnerLength / 2;
    }

    if (isRunnerFromPositionMoreThanRunnerToPosition) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
    }
  };

  private restrictRunnerToPosition = (): void => {
    const isRunnerFromPositionLessThanRunnerToPosition: boolean = this.runnerTo.runnerPosition
      < this.runnerFrom.runnerPosition;
    const isRunnerToPositionMoreThanMaximum: boolean = this.runnerTo.runnerPosition
      > this.sliderLength - this.runnerLength / 2;

    if (isRunnerFromPositionLessThanRunnerToPosition) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
    } else if (isRunnerToPositionMoreThanMaximum) {
      this.runnerTo.runnerPosition = this.sliderLength - this.runnerLength / 2;
    }
  };

  private getCoords = (element: JQuery<HTMLElement> = $('div'), isVertical = false): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  };
}

export default SubView;
