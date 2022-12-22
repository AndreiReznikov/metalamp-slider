import { Options, UserConfig, Api } from '../interfaces/interfaces';
import Model from '../Model/Model';
import View from '../View/View';

class Presenter {
  model: Model;

  view: View;

  isValueNotNumber: boolean;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.isValueNotNumber = false;

    this.model.observer.addObserver(this.updateView);
    this.view.SubView.observer.addObserver(this.updateModel);

    this.init();
    this.launchEventManager();
  }

  public getApi = (): Api => {
    const api: Api = {
      getModelOptions: this.model.getModelOptions,
      updateUserConfig: this.updateUserConfig,
      toggleDouble: this.toggleDouble,
      toggleTooltip: this.toggleTooltip,
      toggleRange: this.toggleRange,
      toggleScale: this.toggleScale,
      toggleVertical: this.toggleVertical,
      setFrom: this.setFrom,
      setTo: this.setTo,
      setMin: this.setMin,
      setMax: this.setMax,
      setStep: this.setStep,
    };

    return api;
  };

  private updateUserConfig = (userConfig: UserConfig): void => {
    this.model.userConfig = userConfig;
    this.model.config = $.extend({}, this.model.data, this.model.userConfig);
    this.model.setConfig();
    this.view.SubView.setModelOptions(this.model.getOptions());

    this.view.initializeView(this.model.getOptions());

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private init = (): void => {
    this.view.SubView.setModelOptions(this.model.getOptions());
    this.view.initializeView(this.model.getOptions());
    this.view.setPlane(this.model.getOptions());
    this.view.SubView.getElementParameters();
    this.model.setSubViewOptions(this.view.SubView.getOptions());
    this.model.validateInitialValues();
    this.view.SubView.limitMin.setLimitValue(this.model.getOptions());
    this.view.SubView.limitMax.setLimitValue(this.model.getOptions());
    this.model.setSubViewOptions(this.view.SubView.getOptions());
    this.model.calculateStepLength();
    this.view.SubView.setModelOptions(this.model.getOptions());

    this.model.setSubViewOptions(this.view.SubView.getOptions());

    this.view.SubView.limitMin.setLimitValue(this.model.getOptions());
    this.view.SubView.limitMax.setLimitValue(this.model.getOptions());
    this.view.SubView.limitMin.calculateLimitPosition(this.model.getOptions());
    this.view.SubView.limitMin.setLimitPosition(this.model.getOptions());
    this.view.SubView.limitMax.calculateLimitPosition(this.model.getOptions());
    this.view.SubView.limitMax.setLimitPosition(this.model.getOptions());

    this.view.SubView.runnerFrom.calculateInitialRunnerPosition(this.model.getOptions());
    this.view.SubView.runnerFrom.setRunnerPosition(this.model.getOptions());
    this.view.SubView.runnerTo.calculateInitialRunnerPosition(this.model.getOptions());
    this.view.SubView.runnerTo.setRunnerPosition(this.model.getOptions());

    this.updateModel(this.view.SubView.getOptions());

    this.view.SubView.range.calculateRangePosition(this.model.getOptions());
    this.view.SubView.range.setRangePosition(this.model.getOptions());
    this.view.SubView.range.calculateRangeLength(this.model.getOptions());
    this.view.SubView.range.setRangeLength(this.model.getOptions());
    this.model.countNumberOfCharactersAfterDot();
    this.model.calculateStepLength();
    this.model.calculateScaleElementsNumber();
    this.model.calculateScaleElementsValues();
    this.view.setPlane(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private updateView = (options: Options): void => {
    this.view.SubView.runnerFrom.setRunnerPosition(options);
    this.view.SubView.runnerTo.setRunnerPosition(options);
    this.view.SubView.tooltipFrom.setTooltipValue(options);
    this.view.SubView.tooltipFrom.calculateTooltipPosition(options);
    this.view.SubView.tooltipFrom.setTooltipPosition(options);
    this.view.SubView.tooltipTo.setTooltipValue(options);
    this.view.SubView.tooltipTo.calculateTooltipPosition(options);
    this.view.SubView.tooltipTo.setTooltipPosition(options);
    this.view.SubView.range.calculateRangePosition(options);
    this.view.SubView.range.setRangePosition(options);
    this.view.SubView.range.calculateRangeLength(options);
    this.view.SubView.range.setRangeLength(options);
    this.view.SubView.limitMin.setLimitValue(options);
    this.view.SubView.limitMin.calculateLimitPosition(options);
    this.view.SubView.limitMin.setLimitPosition(options);
    this.view.SubView.limitMax.setLimitValue(options);
    this.view.SubView.limitMax.calculateLimitPosition(options);
    this.view.SubView.limitMax.setLimitPosition(options);
    this.view.SubView.limitMin.setLimitOpacity(options);
    this.view.SubView.limitMax.setLimitOpacity(options);
    this.view.SubView.scale.setScaleElementsValues(options);
    this.view.SubView.scale.calculateLengthBetweenScaleElements(options);
    this.view.SubView.scale.setScaleLength(options);
    this.view.SubView.scale.setScaleElementsPositions(options);
    this.view.SubView.scale.setScalePosition(options);
  };

  private updateModel = (options: Options): void => {
    this.model.setSubViewOptions(options);
    this.model.calculateFrom(options);
    this.model.calculateTo(options);
  };

  private toggleTooltip = (): void => {
    this.model.showTooltip = this.model.showTooltip !== true;
    this.view.initializeView(this.model.getOptions());
    this.view.SubView.setModelOptions(this.model.getOptions());

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private toggleDouble = (): void => {
    this.model.double = this.model.double !== true;

    this.model.validateInitialValues();
    this.view.SubView.setModelOptions(this.model.getOptions());
    this.view.initializeView(this.model.getOptions());
    this.view.SubView.runnerTo.calculateInitialRunnerPosition(this.model.getOptions());
    this.view.SubView.restrictRunnerToPosition(this.model.getOptions());
    this.model.setSubViewOptions(this.view.SubView.getOptions());
    this.model.restrictTo();

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private toggleRange = (): void => {
    this.model.showRange = this.model.showRange !== true;
    this.view.initializeView(this.model.getOptions());
    this.view.SubView.setModelOptions(this.model.getOptions());

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private toggleScale = (): void => {
    this.model.showScale = this.model.showScale !== true;
    this.view.initializeView(this.model.getOptions());
    this.view.SubView.setModelOptions(this.model.getOptions());

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private toggleVertical = (): void => {
    this.model.vertical = this.model.vertical !== true;
    this.model.setPositionParameters();

    this.init();
  };

  private setFrom = (value: number) => {
    this.checkValue(value);

    if (this.isValueNotNumber) return;

    this.model.from = value;
    this.model.validateInitialValues();
    this.view.SubView.runnerFrom.calculateInitialRunnerPosition(this.model.getOptions());
    this.view.SubView.restrictRunnerFromPosition(this.model.getOptions());
    this.model.setSubViewOptions(this.view.SubView.getOptions());

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private setTo = (value: number): void => {
    this.checkValue(value);

    if (this.isValueNotNumber) return;

    this.model.to = value;
    this.model.validateInitialValues();
    this.view.SubView.runnerTo.calculateInitialRunnerPosition(this.model.getOptions());
    this.view.SubView.restrictRunnerFromPosition(this.model.getOptions());
    this.model.setSubViewOptions(this.view.SubView.getOptions());

    this.model.observer.notifyObservers(this.model.getOptions());
  };

  private setMin = (value: number): void => {
    this.checkValue(value);

    if (this.isValueNotNumber) return;

    this.model.min = value;

    this.init();
  };

  private setMax = (value: number): void => {
    this.checkValue(value);

    if (this.isValueNotNumber) return;

    this.model.max = value;

    this.init();
  };

  private setStep = (value: number): void => {
    this.checkValue(value);

    if (this.isValueNotNumber) return;

    this.model.step = value;

    this.model.validateInitialValues();
    this.model.calculateStepLength();

    this.view.SubView.setModelOptions(this.model.getOptions());
  };

  private launchEventManager = (): void => {
    // const makeRunnerFromKeydownHandler = (event: JQuery.FocusInEvent) => {
    //   const handleRunnerFromKeydown = (event: JQuery.KeyDownEvent): void => {
    //     this.model.calculateRunnerFromPositionAfterKeydown(event);

    //     // this.model.calculateTooltipsPositions();

    //     this.updateView(this.model.getOptions());
    //   };

    //   const $currentTarget = $(event.currentTarget);

    //   $currentTarget.on('keydown', handleRunnerFromKeydown);
    //   $currentTarget.on('focusout',
    // () => $currentTarget.off('keydown', handleRunnerFromKeydown));
    // };

    // const makeRunnerToKeydownHandler = (event: JQuery.FocusInEvent) => {
    //   const handleRunnerToKeydown = (event: JQuery.KeyDownEvent) => {
    //     this.model.calculateRunnerToPositionAfterKeydown(event);

    //     // this.model.calculateTooltipsPositions();

    //     this.updateView(this.model.getOptions());
    //   };

    //   const $currentTarget = $(event.currentTarget);

    //   $currentTarget.on('keydown', handleRunnerToKeydown);
    //   $currentTarget.on('focusout', () => $currentTarget.off('keydown', handleRunnerToKeydown));
    // };

    this.view.$runnerFrom.on('pointerdown.runner-from', this.view.SubView.handleRunnerFromStartPointermove);
    this.view.$runnerTo.on('pointerdown.runner-to', this.view.SubView.handleRunnerToStartPointermove);
    this.view.$limitMin.on('pointerdown.min-from', this.view.SubView.handleLimitMinSetRunnerPosition);
    this.view.$limitMax.on('pointerdown.max', this.view.SubView.handleLimitMaxSetRunnerPosition);
    this.view.$stripe.on('pointerdown.stripe', this.view.SubView.handleStripeCalculateRunnerPositionAfterOnDown);
    this.view.$scaleContainer.on('pointerdown.scale', this.view.SubView.handleScaleCalculateRunnerPositionAfterOnDown);
    // this.view.$runnerFrom.on('focusin', makeRunnerFromKeydownHandler);
    // this.view.$runnerTo.on('focusin', makeRunnerToKeydownHandler);

    this.view.$window.on('resize.slider', this.init);
  };

  private checkValue = (
    value: string | number | string[] | undefined = 0,
  ): void => {
    this.isValueNotNumber = typeof parseFloat(`${value}`) !== 'number';
  };
}

export default Presenter;
