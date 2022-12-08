import Stripe from './stripe/stripe';
import Range from './range/range';
import RunnerFrom from './runner-from/runner-from';
import RunnerTo from './runner-to/runner-to';
import Tooltips from './tooltips/tooltips';
import MinAndMaxValues from './min-and-max/min-and-max';
import Scale from './scale/scale';
import Panel from './panel/panel';

class SubView {
  tooltips: Tooltips;

  runnerFrom: RunnerFrom;

  runnerTo: RunnerTo;

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

  sliderPosition = 0;

  runnerLength = 0;

  shiftAxis = 0;

  runnerFromPosition = 0;

  constructor() {
    this.stripe = new Stripe();
    this.tooltips = new Tooltips();
    this.runnerFrom = new RunnerFrom();
    this.runnerTo = new RunnerTo();
    this.range = new Range();
    this.minAndMaxValues = new MinAndMaxValues();
    this.scale = new Scale();
    this.panel = new Panel();

    this.$document = $(document);
    this.$stripe = this.stripe.$stripe;
    this.$runnerFrom = this.runnerFrom.$runnerFrom;
  }

  public makeRunnerFromPointermoveHandler = (event: JQuery.TriggeredEvent): void => {
    this.getElementParameters();

    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerFrom.calculateShiftAxis1(this.getSubViewOptions());

    const handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
      this.calculateClickPosition(event);
      this.runnerFrom.calculateRunnerFromPositionWhileMoving(this.getSubViewOptions());

      this.runnerFrom.setRunnerFromPosition(this.getSubViewOptions());

      this.getElementParameters();
    };

    this.$document.on('pointermove.move-from', handleRunnerFromPointermove);
    this.$document.on('pointerup.move-from', () => this.$document.off('pointermove.move-from', handleRunnerFromPointermove));
  };

  public calculateClickPosition = (event: JQuery.TriggeredEvent) => {
    if (!event.clientX) return;

    this.clickPosition = event.clientX - this.sliderPosition;
  };

  public getSubViewOptions = () => {
    const viewOptions = {
      sliderPosition: this.sliderPosition,
      runnerFromPosition: this.runnerFromPosition,
      runnerLength: this.runnerLength,
      clickPosition: this.clickPosition,
      shiftAxis: this.shiftAxis,
    };

    return viewOptions;
  };

  public getElementParameters = () => {
    this.sliderPosition = this.getCoords(this.$stripe, false);
    this.runnerFromPosition = this.runnerFrom.runnerFromPosition;
    this.runnerLength = parseInt(this.runnerFrom.$runnerFrom.css('width'), 10);
  };

  private getCoords = (element: JQuery<HTMLElement> = $('div'), isVertical = false): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = isVertical ? coords.top : coords.left;

    return coord;
  };
}

export default SubView;
