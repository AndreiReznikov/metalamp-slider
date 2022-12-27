import Observer from '../Observer/Observer';
import Stripe from './Stripe/Stripe';
import Range from './Range/Range';
import Runner from './Runner/Runner';
import Tooltip from './Tooltip/Tooltip';
import Limit from './Limit/Limit';
import Scale from './Scale/Scale';
import { Options, ModelOptions, SubViewOptions } from '../interfaces/interfaces';

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

  $document: JQuery<Document>;

  $stripe: JQuery<HTMLElement>;

  shiftAxis = 0;

  clickPosition = 0;

  sliderLength = 0;

  sliderPosition = 0;

  runnerLength = 0;

  runnerFromStepsNumber = 0;

  runnerToStepsNumber = 0;

  scaleElementPosition = 0;

  scaleElementLength = 0;

  scaleElementValue = '';

  isWrongButtonPressed = false;

  isClickAheadOfRunnerFrom = false;

  isClickBehindOfRunnerFrom = false;

  isClickForRunnerFrom = false;

  isClickAheadOfRunnerTo = false;

  isClickBehindOfRunnerTo = false;

  isClickForRunnerTo = false;

  areTooltipsClose = false;

  isLimitMinShown = true;

  isLimitMaxShown = true;

  isScaleElementOnDown = false;

  modelOptions: ModelOptions;

  subViewOptions: SubViewOptions;

  constructor() {
    this.observer = new Observer();

    this.stripe = new Stripe();
    this.tooltipFrom = new Tooltip('from');
    this.tooltipTo = new Tooltip('to');
    this.runnerFrom = new Runner('from');
    this.runnerTo = new Runner('to');
    this.limitMin = new Limit('min');
    this.limitMax = new Limit('max');
    this.range = new Range();
    this.scale = new Scale();

    this.$document = $(document);
    this.$stripe = this.stripe.$stripe;

    this.subViewOptions = this.getSubViewOptions();
    this.modelOptions = {
      double: false,
      vertical: false,
      showTooltip: false,
      showLimit: false,
      showRange: false,
      showScale: false,
      localeString: false,
      isStepSet: false,
      positionParameter: '',
      lengthParameter: '',
      to: 0,
      from: 0,
      step: 0,
      stepLength: 0,
      min: 0,
      max: 0,
      scalePositionParameter: '',
      scaleNumber: 0,
      scaleElements: [],
      numberOfCharactersAfterDot: 0,
    };
  }

  public getOptions = (): Options => {
    const options: Options = {
      modelOptions: this.modelOptions,
      subViewOptions: this.getSubViewOptions(),
    };

    return options;
  };

  public setModelOptions = (options: Options) => {
    this.modelOptions = options.modelOptions;
  };

  public handleRunnerFromStartPointermove = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerFrom.calculateShiftAxis(this.getOptions());

    this.attachPointermoveEvent('from');
  };

  public handleRunnerToStartPointermove = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.shiftAxis = this.runnerTo.calculateShiftAxis(this.getOptions());

    this.attachPointermoveEvent('to');
  };

  public handleLimitMinSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.runnerFrom.calculateMinRunnerPosition(this.getOptions());
    this.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.runnerFrom.isMinFrom = false;
  };

  public handleLimitMaxSetRunnerPosition = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    if (this.getOptions().modelOptions.double) {
      this.runnerTo.calculateMaxRunnerPosition(this.getOptions());
    } else {
      this.runnerFrom.calculateMaxRunnerPosition(this.getOptions());
    }

    this.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.runnerFrom.isMaxFrom = false;
    this.runnerTo.isMaxTo = false;
  };

  public handleStripeCalculateRunnerPositionAfterOnDown = (event: JQuery.TriggeredEvent): void => {
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    this.calculateClickPosition(event);
    this.calculateRunnerPositionAfterSliderOnDown(this.getOptions());
    this.restrictRunnerPositionAfterSliderOnDown(this.getOptions());
    this.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.isClickAheadOfRunnerFrom = false;
    this.isClickBehindOfRunnerFrom = false;
    this.isClickForRunnerFrom = false;

    this.isClickAheadOfRunnerTo = false;
    this.isClickBehindOfRunnerTo = false;
    this.isClickForRunnerTo = false;
  };

  public handleScaleCalculateRunnerPositionAfterOnDown = (event: JQuery.TriggeredEvent): void => {
    event.stopPropagation();
    this.checkMouseButton(event);

    if (this.isWrongButtonPressed) return;

    const $target: JQuery<EventTarget> = $(event.target);

    this.isScaleElementOnDown = $target.hasClass('js-slider__scale-element');
    this.scaleElementPosition = parseInt(`${$target.css(this.getOptions().modelOptions.positionParameter)}`, 10);
    this.scaleElementLength = parseInt(`${$target.css(this.getOptions().modelOptions.lengthParameter)}`, 10);
    this.scaleElementValue = $target.html();

    this.calculateClickPosition(event);
    this.calculateRunnerPositionAfterScaleOnDown(this.getOptions());
    this.showLimit(this.getOptions());

    this.observer.notifyObservers(this.getOptions());

    this.isScaleElementOnDown = false;

    this.isClickAheadOfRunnerFrom = false;
    this.isClickBehindOfRunnerFrom = false;
    this.isClickForRunnerFrom = false;
    this.isClickAheadOfRunnerTo = false;
    this.isClickBehindOfRunnerTo = false;
    this.isClickForRunnerTo = false;
  };

  public calculateRunnerPositionAfterSliderOnDown = (options: Options): void => {
    const intervalForRunnerFromSteps: number = this.runnerFrom.runnerPosition
      + options.subViewOptions.runnerLength
      / 2 - options.subViewOptions.clickPosition;
    this.runnerFromStepsNumber = Math.round(intervalForRunnerFromSteps
      / options.modelOptions.stepLength);

    this.runnerFromStepsNumber = this.runnerFromStepsNumber < 0
      ? -this.runnerFromStepsNumber : this.runnerFromStepsNumber;

    const intervalForRunnerToSteps: number = this.runnerTo.runnerPosition
      + options.subViewOptions.runnerLength
      / 2 - options.subViewOptions.clickPosition;
    this.runnerToStepsNumber = Math.round(intervalForRunnerToSteps
      / options.modelOptions.stepLength);

    this.runnerToStepsNumber = this.runnerToStepsNumber < 0
      ? -this.runnerToStepsNumber : this.runnerToStepsNumber;

    this.defineClickLocation(options);

    if (options.modelOptions.isStepSet) {
      if (this.isClickAheadOfRunnerFrom) {
        this.runnerFrom.runnerPosition += this.runnerFromStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickBehindOfRunnerFrom) {
        this.runnerFrom.runnerPosition -= this.runnerFromStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickAheadOfRunnerTo) {
        this.runnerTo.runnerPosition += this.runnerToStepsNumber
          * options.modelOptions.stepLength;
      } else if (this.isClickBehindOfRunnerTo) {
        this.runnerTo.runnerPosition -= this.runnerToStepsNumber
        * options.modelOptions.stepLength;
      }
    } else if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = options.subViewOptions.clickPosition
        - options.subViewOptions.runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = options.subViewOptions.clickPosition
        - options.subViewOptions.runnerLength / 2;
    }
  };

  public calculateRunnerPositionAfterScaleOnDown = (options: Options): void => {
    this.defineClickLocation(options);

    if (this.isClickForRunnerFrom) {
      this.runnerFrom.runnerPosition = this.scaleElementPosition
        + this.scaleElementLength
        / 2 - this.runnerLength / 2;
    } else if (this.isClickForRunnerTo) {
      this.runnerTo.runnerPosition = this.scaleElementPosition
        + this.scaleElementLength
        / 2 - this.runnerLength / 2;
    }
  };

  public restrictRunnerFromPosition = (options: Options): void => {
    const isRunnerFromPositionLessThanMinimum: boolean = this.runnerFrom.runnerPosition
      < 0 - this.runnerLength / 2;
    const isRunnerFromPositionMoreThanMaximum: boolean = this.runnerFrom.runnerPosition
      > this.sliderLength - this.runnerLength / 2;
    const
      isRunnerFromPositionMoreThanRunnerToPosition: boolean = options.modelOptions.double
      && this.runnerFrom.runnerPosition > this.runnerTo.runnerPosition;

    if (isRunnerFromPositionLessThanMinimum) {
      this.runnerFrom.runnerPosition = 0 - this.runnerLength / 2;
    } else if (isRunnerFromPositionMoreThanMaximum) {
      this.runnerFrom.runnerPosition = this.sliderLength - this.runnerLength / 2;
    }

    if (isRunnerFromPositionMoreThanRunnerToPosition) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
    }

    this.joinTooltips(options);
  };

  public restrictRunnerToPosition = (options: Options): void => {
    const isRunnerFromPositionLessThanRunnerToPosition: boolean = this.runnerTo.runnerPosition
      < this.runnerFrom.runnerPosition;
    const isRunnerToPositionMoreThanMaximum: boolean = this.runnerTo.runnerPosition
      > this.sliderLength - this.runnerLength / 2;

    if (isRunnerFromPositionLessThanRunnerToPosition) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
    } else if (isRunnerToPositionMoreThanMaximum) {
      this.runnerTo.runnerPosition = this.sliderLength - this.runnerLength / 2;
    }

    this.joinTooltips(options);
  };

  public showLimit = (options: Options): void => {
    if (!options.modelOptions.showTooltip) return;

    this.isLimitMinShown = true;
    this.isLimitMaxShown = true;

    const isTooltipFromNearLimitMin: boolean = this.runnerFrom.runnerPosition
      <= 0;
    const isTooltipFromNearLimitMax: boolean = this.runnerFrom.runnerPosition
      + options.subViewOptions.runnerLength
      > this.sliderLength;
    const isTooltipToNearLimitMax: boolean = options.modelOptions.double
      && this.runnerTo.runnerPosition
      + options.subViewOptions.runnerLength
      > this.sliderLength;

    if (isTooltipFromNearLimitMin) {
      this.isLimitMinShown = false;
    }

    if (isTooltipToNearLimitMax || isTooltipFromNearLimitMax) {
      this.isLimitMaxShown = false;
    }
  };

  public getSubViewOptions = (): SubViewOptions => {
    const subViewOptions: SubViewOptions = {
      sliderPosition: this.sliderPosition,
      sliderLength: this.sliderLength,
      runnerFromPosition: this.runnerFrom.runnerPosition,
      runnerToPosition: this.runnerTo.runnerPosition,
      runnerLength: this.runnerLength,
      limitMinLength: this.limitMin.limitLength,
      limitMaxLength: this.limitMax.limitLength,
      clickPosition: this.clickPosition,
      shiftAxis: this.shiftAxis,
      isMinFrom: this.runnerFrom.isMinFrom,
      isMaxFrom: this.runnerFrom.isMaxFrom,
      isMaxTo: this.runnerTo.isMaxTo,
      isCursorNearStepAheadFrom: this.runnerFrom.isCursorNearStepAhead,
      isCursorNearStepBehindFrom: this.runnerFrom.isCursorNearStepBehind,
      isCursorNearStepAheadTo: this.runnerTo.isCursorNearStepAhead,
      isCursorNearStepBehindTo: this.runnerTo.isCursorNearStepBehind,
      isClickAheadOfRunnerFrom: this.isClickAheadOfRunnerFrom,
      isClickBehindOfRunnerFrom: this.isClickBehindOfRunnerFrom,
      isClickForRunnerFrom: this.isClickForRunnerFrom,
      isClickAheadOfRunnerTo: this.isClickAheadOfRunnerTo,
      isClickBehindOfRunnerTo: this.isClickBehindOfRunnerTo,
      isClickForRunnerTo: this.isClickForRunnerTo,
      areTooltipsClose: this.areTooltipsClose,
      isLimitMinShown: this.isLimitMinShown,
      isLimitMaxShown: this.isLimitMaxShown,
      runnerFromStepsNumber: this.runnerFromStepsNumber,
      runnerToStepsNumber: this.runnerToStepsNumber,
      isScaleElementOnDown: this.isScaleElementOnDown,
      scaleElementPosition: this.scaleElementPosition,
      scaleElementLength: this.scaleElementLength,
      scaleElementValue: this.scaleElementValue,
    };

    return subViewOptions;
  };

  public getElementParameters = () => {
    this.sliderPosition = this.getCoords(this.$stripe);
    this.sliderLength = parseInt(
      this.$stripe.css(this.getOptions().modelOptions.lengthParameter),
      10,
    );
    this.runnerLength = parseInt(
      this.runnerFrom.$runner.css(this.getOptions().modelOptions.lengthParameter),
      10,
    );
  };

  private joinTooltips = (options: Options): void => {
    this.areTooltipsClose = options.modelOptions.double
      && this.tooltipFrom.tooltipPosition
      + this.tooltipFrom.tooltipLength
      > this.tooltipTo.tooltipPosition;
  };

  private restrictRunnerPositionAfterSliderOnDown = (options: Options): void => {
    if (!options.modelOptions.isStepSet) return;

    const isClickNearMinimum: boolean = options.subViewOptions.clickPosition
      < options.modelOptions.stepLength / 2;
    const isClickNearMaximumWithoutInterval: boolean = this.sliderLength
    - options.subViewOptions.clickPosition < options.modelOptions.stepLength / 2
    && !options.modelOptions.double;
    const isClickNearMaximum: boolean = options.subViewOptions.sliderLength
      - options.subViewOptions.clickPosition < options.modelOptions.stepLength / 2
      && options.modelOptions.double;

    this.alignRunners(options);

    if (isClickNearMaximumWithoutInterval) {
      this.runnerFrom.calculateMaxRunnerPosition(this.getOptions());
    } else if (isClickNearMinimum) {
      this.runnerFrom.calculateMinRunnerPosition(this.getOptions());
    } else if (isClickNearMaximum) {
      this.runnerTo.calculateMaxRunnerPosition(this.getOptions());
    }
  };

  private alignRunners = (options: Options): void => {
    const isRunnerFromNearRunnerTo: boolean = options.modelOptions.double
      && Math.round(this.runnerTo.runnerPosition
      - this.runnerFrom.runnerPosition) <= Math.round(options.modelOptions.stepLength)
      && this.isClickForRunnerFrom;
    const isRunnerToNearRunnerFrom: boolean = options.modelOptions.double
      && Math.round(this.runnerTo.runnerPosition
      - this.runnerFrom.runnerPosition) <= Math.round(options.modelOptions.stepLength)
      && this.isClickForRunnerTo;

    if (isRunnerFromNearRunnerTo) {
      this.runnerFrom.runnerPosition = this.runnerTo.runnerPosition;
      this.changeRunnerZIndex('from');
    } else if (isRunnerToNearRunnerFrom) {
      this.runnerTo.runnerPosition = this.runnerFrom.runnerPosition;
      this.changeRunnerZIndex('to');
    }
  };

  private handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.runnerFrom.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
    this.restrictRunnerFromPosition(this.getOptions());
    this.showLimit(this.getOptions());
    this.changeRunnerZIndex('from');

    this.observer.notifyObservers(this.getOptions());
  };

  private handleRunnerToPointermove = (event: JQuery.TriggeredEvent): void => {
    this.calculateClickPosition(event);
    this.runnerTo.calculateRunnerPositionWhileMouseIsMoving(this.getOptions());
    this.restrictRunnerToPosition(this.getOptions());
    this.showLimit(this.getOptions());
    this.changeRunnerZIndex('to');

    this.observer.notifyObservers(this.getOptions());
  };

  private attachPointermoveEvent = (valueType: string) => {
    const handleRunnerPointermove = valueType === 'from' ? this.handleRunnerFromPointermove : this.handleRunnerToPointermove;
    const handleDocumentOffPointerMove = () => this.$document.off('pointermove.move', handleRunnerPointermove);

    this.$document.on('pointermove.move', handleRunnerPointermove);
    this.$document.on('pointerup.move', handleDocumentOffPointerMove);
  };

  private calculateClickPosition = (event: JQuery.TriggeredEvent): void => {
    let pageX1 = 0;
    let pageY1 = 0;

    if (event.pageX !== undefined) {
      pageX1 = event.pageX;
    }

    if (event.pageY !== undefined) {
      pageY1 = event.pageY;
    }

    const clientAxis: number = this.getOptions().modelOptions.vertical ? pageY1 : pageX1;

    this.clickPosition = clientAxis - this.sliderPosition;
  };

  private changeRunnerZIndex = (runnerType: string) => {
    if (runnerType === 'from') {
      this.runnerFrom.$runner.css('z-index', 3);
      this.runnerTo.$runner.css('z-index', 2);
    } else if (runnerType === 'to') {
      this.runnerFrom.$runner.css('z-index', 2);
      this.runnerTo.$runner.css('z-index', 3);
    }
  };

  private defineClickLocation = (options: Options) => {
    const isClickAheadOfRunnerFromWithInterval = options.subViewOptions.clickPosition
      > this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      && options.subViewOptions.clickPosition
      < this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
        - options.subViewOptions.runnerLength) / 2;
    const isClickAheadOfRunnerFromWithoutInterval = options.subViewOptions.clickPosition
      > this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength;

    this.isClickAheadOfRunnerFrom = options.modelOptions.double
      ? isClickAheadOfRunnerFromWithInterval : isClickAheadOfRunnerFromWithoutInterval;
    this.isClickBehindOfRunnerFrom = options.subViewOptions.clickPosition
      < this.runnerFrom.runnerPosition;
    this.isClickForRunnerFrom = this.isClickAheadOfRunnerFrom || this.isClickBehindOfRunnerFrom;

    if (!options.modelOptions.double) return;

    this.isClickAheadOfRunnerTo = options.subViewOptions.clickPosition
      > this.runnerTo.runnerPosition + options.subViewOptions.runnerLength;
    this.isClickBehindOfRunnerTo = options.subViewOptions.clickPosition
      < this.runnerTo.runnerPosition && options.subViewOptions.clickPosition
      >= this.runnerFrom.runnerPosition + options.subViewOptions.runnerLength
      + (this.runnerTo.runnerPosition - this.runnerFrom.runnerPosition
        - options.subViewOptions.runnerLength) / 2;
    this.isClickForRunnerTo = this.isClickAheadOfRunnerTo || this.isClickBehindOfRunnerTo;
  };

  private getCoords = (element: JQuery<HTMLElement>): number => {
    const coords: JQuery.Coordinates | undefined = element.offset();
    let coord = 0;

    if (coords) coord = this.getOptions().modelOptions.vertical ? coords.top : coords.left;

    return coord;
  };

  private checkMouseButton = (event: JQuery.TriggeredEvent): void => {
    this.isWrongButtonPressed = event.pointerType === 'mouse' && event.buttons !== 1;
  };
}

export default SubView;
