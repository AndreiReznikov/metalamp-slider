import { Options } from '../interfaces/interfaces';
import Model from '../model/model';
import View from '../view/view';

class Presenter {
  model: Model;

  view: View;

  isValueANumberAndFullValue: boolean;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;
    this.isValueANumberAndFullValue = false;

    this.model.observer.addObserver(this.updateView);

    this.init();
    this.launchEventManager();
    this.launchPanelEventManager();
  }

  private init = (): void => {
    this.view.initView(this.model.getOptions());

    this.model.calculateInitialTooltipsValues();

    this.updateView(this.model.getOptions());

    const elementsParameters = this.view.getElementsParameters(
      this.model.isVertical,
      this.model.getOptions().lengthParameter,
    );

    this.model.setElementsParameters(elementsParameters);
    this.model.validateInitialValues();
    this.model.calculateInitialRunnerToPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.countNumberOfCharactersAfterDot();
    this.model.calculateMinAndMaxPositions();
    this.model.calculateTooltipsPositions();
    this.model.calculateStepLength();
    this.model.calculateScaleElementsNumber();
    this.model.calculateScaleElementsValues();
    this.model.calculateLengthBetweenScaleElements();
    this.updateView(this.model.getOptions());
    this.model.calculatePanelPosition();
    this.view.panel.setPanelPosition(this.model.getOptions());
    this.view.runnerFrom.calculateInitialRunnerFromPosition(this.model.getOptions());
    this.view.runnerFrom.setRunnerFromPosition(this.model.getOptions());
  };

  private updateView = (options: Options): void => {
    this.view.runnerFrom.calculateRunnerFromPositionWhileMoving(options);
    this.view.runnerFrom.setRunnerFromPosition(options);
    this.view.runnerTo.setRunnerToPosition(options);
    this.view.tooltips.setTooltipFromValue(options);
    this.view.tooltips.setTooltipToValue(options);
    this.view.tooltips.setTooltipFromPosition(options);
    this.view.tooltips.setTooltipToPosition(options);
    this.view.range.setRangePosition(options);
    this.view.range.setRangeLength(options);
    this.view.minAndMaxValues.setMinAndMaxValues(options);
    this.view.minAndMaxValues.setMinAndMaxPosition(options);
    this.view.minAndMaxValues.showMinAndMax(options);
    this.view.scale.setScaleElementsValues(options);
    this.view.scale.setScaleLength(options);
    this.view.scale.setScaleElementsPositions(options);
    this.view.scale.setScalePosition(options);
    this.view.panel.setPanelPosition(options);
    this.view.panel.setPanelValues(options);

    const elementsParameters = this.view.getElementsParameters(
      this.model.isVertical,
      this.model.getOptions().lengthParameter,
    );

    this.model.setElementsParameters(elementsParameters);
  };

  private launchEventManager = (): void => {
    const $document = $(document);

    const makeRunnerFromPointermoveHandler = (event: JQuery.TriggeredEvent): void => {
      const shiftAxis1 = this.model.calculateShiftAxis1(event);

      const handleRunnerFromPointermove = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis1 === undefined) return;

        this.model.calculateRunnerFromPositionWhileMoving(event, shiftAxis1);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      $document.on('pointermove.move-from', handleRunnerFromPointermove);
      $document.on('pointerup.move-from', () => $document.off('pointermove.move-from', handleRunnerFromPointermove));
    };

    const makeRunnerToPointermoveHandler = (event: JQuery.TriggeredEvent) => {
      const shiftAxis2 = this.model.calculateShiftAxis2(event);

      const handleRunnerToPointermove = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis2 === undefined) return;

        this.model.calculateRunnerToPositionWhileMoving(event, shiftAxis2);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      $document.on('pointermove.move-to', handleRunnerToPointermove);
      $document.on('pointerup.move-to', () => $document.off('pointermove.move-to', handleRunnerToPointermove));
    };

    const makeRunnerFromKeydownHandler = (event: JQuery.FocusInEvent) => {
      const handleRunnerFromKeydown = (event: JQuery.KeyDownEvent): void => {
        this.model.calculateRunnerFromPositionAfterKeydown(event);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      const $currentTarget = $(event.currentTarget);

      $currentTarget.on('keydown', handleRunnerFromKeydown);
      $currentTarget.on('focusout', () => $currentTarget.off('keydown', handleRunnerFromKeydown));
    };

    const makeRunnerToKeydownHandler = (event: JQuery.FocusInEvent) => {
      const handleRunnerToKeydown = (event: JQuery.KeyDownEvent) => {
        this.model.calculateRunnerToPositionAfterKeydown(event);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      const $currentTarget = $(event.currentTarget);

      $currentTarget.on('keydown', handleRunnerToKeydown);
      $currentTarget.on('focusout', () => $currentTarget.off('keydown', handleRunnerToKeydown));
    };

    const handleRunnerFromPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateRunnerFromPositionAfterSliderOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const handleRunnerToPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateRunnerToPositionAfterSliderOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const handleRunnerFromPositionAfterMinValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateRunnerFromPositionAfterMinValueOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const handleRunnerFromPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateRunnerFromPositionAfterMaxValueOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const handleRunnerToPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateRunnerToPositionAfterMaxValueOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const handleRunnersPositionAfterScaleOnDown = (event: JQuery.TriggeredEvent) => {
      if (!event.target) return;

      const $target: JQuery<EventTarget> = $(event.target);
      const isScaleElementOnDown: boolean = $target.hasClass('js-slider__scale-element');
      const scaleElementPosition: number = parseInt(`${$target.css(this.model.positionParameter)}`, 10);
      const scaleElementLength: number = parseInt(`${$target.css(this.model.lengthParameter)}`, 10);
      const scaleElementValue: string = $target.html();

      const scaleElementOptions = {
        isScaleElementOnDown,
        scaleElementPosition,
        scaleElementLength,
        scaleElementValue,
      };

      this.model.calculateRunnerPositionAfterScaleOnDown(event, scaleElementOptions);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    this.view.$runnerFrom.on('pointerdown.runner-from', makeRunnerFromPointermoveHandler);
    this.view.$runnerTo.on('pointerdown.runner-to', makeRunnerToPointermoveHandler);
    this.view.$runnerFrom.on('focusin', makeRunnerFromKeydownHandler);
    this.view.$runnerTo.on('focusin', makeRunnerToKeydownHandler);
    this.view.$stripe.on('pointerdown.stripe-from', handleRunnerFromPositionAfterSliderOnDown);
    this.view.$stripe.on('pointerdown.stripe-to', handleRunnerToPositionAfterSliderOnDown);
    this.view.$minValue.on('pointerdown.min-from', handleRunnerFromPositionAfterMinValueOnDown);
    this.view.$maxValue.on('pointerdown.max-from', handleRunnerFromPositionAfterMaxValueOnDown);
    this.view.$maxValue.on('pointerdown.max-to', handleRunnerToPositionAfterMaxValueOnDown);
    this.view.$scaleContainer.on('pointerdown.scale', handleRunnersPositionAfterScaleOnDown);

    this.view.$window.on('resize.slider', this.init);
  };

  private launchPanelEventManager = (): void => {
    const stopPropagation = (event: JQuery.TriggeredEvent) => event.stopPropagation();

    this.view.panel.$panelContainer.on('pointerdown', stopPropagation);
    this.view.panel.$minInput.on('change', this.handleMinInputSetMin);
    this.view.panel.$maxInput.on('change', this.handleMaxInputSetMax);
    this.view.panel.$fromInput.on('change', this.handleFromInputSetFrom);
    this.view.panel.$toInput.on('change', this.handleToInputSetTo);
    this.view.panel.$stepInput.on('change', this.handleStepInputSetStep);
    this.view.panel.$intervalToggler.on('click', this.handleIntervalTogglerToggleInterval);
    this.view.panel.$verticalToggler.on('click', this.handleVerticalTogglerToggleVertical);
    this.view.panel.$tooltipsToggler.on('click', this.handleTooltipsTogglerToggleTooltips);
    this.view.panel.$rangeToggler.on('click', this.handleRangeTogglerToggleRange);
    this.view.panel.$scaleToggler.on('click', this.handleScaleTogglerToggleScale);
  };

  private handleMinInputSetMin = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const minValue = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(minValue)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.minValue = parseFloat(`${minValue}`);

    this.init();
  };

  private handleMaxInputSetMax = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const maxValue = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(maxValue)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.maxValue = parseFloat(`${maxValue}`);

    this.init();
  };

  private handleFromInputSetFrom = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const from = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(from)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.from = parseFloat(`${from}`);

    this.model.validateInitialValues();
    this.model.calculateInitialRunnerFromPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.calculateInitialTooltipsValues();
    this.model.calculateTooltipsPositions();

    this.updateView(this.model.getOptions());
  };

  private handleToInputSetTo = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const to = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(to)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.to = parseFloat(`${to}`);

    this.model.validateInitialValues();
    this.model.calculateInitialRunnerToPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.calculateInitialTooltipsValues();
    this.model.calculateTooltipsPositions();

    this.updateView(this.model.getOptions());
  };

  private handleStepInputSetStep = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const step = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(step)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.step = parseFloat(`${step}`);

    this.model.validateInitialValues();
    this.model.calculateStepLength();
  };

  private handleIntervalTogglerToggleInterval = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isInterval = true;
    } else {
      this.model.isInterval = false;
    }

    this.view.initView(this.model.getOptions());
    this.model.validateInitialValues();
    this.model.calculateInitialRunnerToPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.calculateInitialTooltipsValues();
    this.model.calculateTooltipsPositions();

    this.updateView(this.model.getOptions());
  };

  private handleTooltipsTogglerToggleTooltips = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isTooltip = true;
    } else {
      this.model.isTooltip = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private handleRangeTogglerToggleRange = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isRange = true;
    } else {
      this.model.isRange = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private handleScaleTogglerToggleScale = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isScale = true;
    } else {
      this.model.isScale = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private handleVerticalTogglerToggleVertical = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isVertical = true;
    } else {
      this.model.isVertical = false;
    }

    this.model.positionParameter = this.model.isVertical ? 'top' : 'left';
    this.model.lengthParameter = this.model.isVertical ? 'height' : 'width';
    this.model.scalePositionParameter = this.model.isVertical ? 'right' : 'top';
    this.model.panelPositionParameter = this.model.isVertical ? 'left' : 'top';

    this.init();
  };

  private checkIsValueANumberAndFullValue = (
    value: string | number | string[] | undefined = 0,
  ): boolean => {
    this.isValueANumberAndFullValue = typeof parseFloat(`${value}`) !== 'number' || value === '';

    return this.isValueANumberAndFullValue;
  };
}

export default Presenter;
