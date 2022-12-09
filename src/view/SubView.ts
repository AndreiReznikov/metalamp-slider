import Observer from '../model/observer';
import Stripe from './stripe/stripe';
import Range from './range/range';
import Runner from './runner/runner';
// import RunnerTo from './runner-to/runner-to';
import Tooltips from './tooltips/tooltips';
import MinAndMaxValues from './min-and-max/min-and-max';
import Scale from './scale/scale';
import Panel from './panel/panel';
import { Options } from '../interfaces/interfaces';

class SubView {
  observer: Observer;

  tooltips: Tooltips;

  runnerFrom: Runner;

  runnerTo: Runner;

  range: Range;

  stripe: Stripe;

  minAndMaxValues: MinAndMaxValues;

  scale: Scale;

  panel: Panel;

  $document: JQuery<Document>;

  $stripe: JQuery<HTMLElement>;

  $runnerFrom: JQuery<HTMLElement>;

  coord = 0;

  clickPosition = 0;

  sliderLength = 0;

  sliderPosition = 0;

  runnerLength = 0;

  shiftAxis = 0;

  modelOptions: any;

  constructor() {
    this.observer = new Observer();

    this.stripe = new Stripe();
    this.tooltips = new Tooltips();
    this.runnerFrom = new Runner('from');
    this.runnerTo = new Runner('to');
    this.range = new Range();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();
    this.panel = new Panel();

    this.$document = $(document);
    this.$stripe = this.stripe.$stripe;
    this.$runnerFrom = this.runnerFrom.$runner;
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

      this.observer.notifyObservers(this.getSubViewOptions());
    };

    this.$document.on('pointermove.move-to', handleRunnerToPointermove);
    this.$document.on('pointerup.move-to', () => this.$document.off('pointermove.move-to', handleRunnerToPointermove));
  };

  public calculateClickPosition = (event: JQuery.TriggeredEvent): void => {
    if (!event.clientX) return;

    this.clickPosition = event.clientX - this.sliderPosition;
  };

  public getSubViewOptions = () => {
    const viewOptions = {
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      runnerFromPosition: this.runnerFrom.runnerPosition,
      runnerToPosition: this.runnerTo.runnerPosition,
      runnerLength: this.runnerLength,
      clickPosition: this.clickPosition,
      shiftAxis: this.shiftAxis,
      modelOptions: this.modelOptions,
    };

    return viewOptions;
  };

  public getElementParameters = () => {
    this.sliderPosition = this.getCoords(this.$stripe, false);
    this.sliderLength = parseInt(this.$stripe.css('width'), 10);
    this.runnerLength = parseInt(this.runnerFrom.$runner.css('width'), 10);
  };

  private getCoords = (element: JQuery<HTMLElement> = $('div'), isVertical = false): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  };
}

export default SubView;
