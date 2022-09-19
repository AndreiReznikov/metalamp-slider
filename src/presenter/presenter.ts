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
    this.model.calculateInitialHandlesPosition();
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
  };

  private updateView = (options: Options): void => {
    this.view.handleFrom.setHandleFromPosition(options);
    this.view.handleTo.setHandleToPosition(options);
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

    const changeHandleFromPosition = (event: JQuery.TriggeredEvent): void => {
      const shiftAxis1 = this.model.calculateShiftAxis1(event);

      const moveHandleFrom = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis1 === undefined) return;

        this.model.calculateHandleFromPositionWhileMoving(event, shiftAxis1);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      $document.on('pointermove.move-from', moveHandleFrom);
      $document.on('pointerup.move-from', () => $document.off('pointermove.move-from', moveHandleFrom));
    };

    const changeHandleToPosition = (event: JQuery.TriggeredEvent) => {
      const shiftAxis2 = this.model.calculateShiftAxis2(event);

      const moveHandleTo = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis2 === undefined) return;

        this.model.calculateHandleToPositionWhileMoving(event, shiftAxis2);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      $document.on('pointermove.move-to', moveHandleTo);
      $document.on('pointerup.move-to', () => $document.off('pointermove.move-to', moveHandleTo));
    };

    const changeHandleFromPositionAfterKeydown = (event: JQuery.FocusInEvent) => {
      const moveHandleFromAfterKeydown = (event: JQuery.KeyDownEvent): void => {
        this.model.calculateHandleFromPositionAfterKeydown(event);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      const $currentTarget = $(event.currentTarget);

      $currentTarget.on('keydown', moveHandleFromAfterKeydown);
      $currentTarget.on('focusout', () => $currentTarget.off('keydown', moveHandleFromAfterKeydown));
    };

    const changeHandleToPositionAfterKeydown = (event: JQuery.FocusInEvent) => {
      const moveHandleToAfterKeydown = (event: JQuery.KeyDownEvent) => {
        this.model.calculateHandleToPositionAfterKeydown(event);

        this.model.calculateTooltipsPositions();

        this.updateView(this.model.getOptions());
      };

      const $currentTarget = $(event.currentTarget);

      $currentTarget.on('keydown', moveHandleToAfterKeydown);
      $currentTarget.on('focusout', () => $currentTarget.off('keydown', moveHandleToAfterKeydown));
    };

    const changeHandleFromPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleFromPositionAfterSliderOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const changeHandleToPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleToPositionAfterSliderOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const changeHandleFromPositionAfterMinValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleFromPositionAfterMinValueOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const changeHandleFromPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleFromPositionAfterMaxValueOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const changeHandleToPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleToPositionAfterMaxValueOnDown(event);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    const changeHandlesPositionAfterScaleOnDown = (event: JQuery.TriggeredEvent) => {
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

      this.model.calculateHandlePositionAfterScaleOnDown(event, scaleElementOptions);

      this.model.calculateTooltipsPositions();

      this.updateView(this.model.getOptions());
    };

    this.view.$handleFrom.on('pointerdown.handle-from', changeHandleFromPosition);
    this.view.$handleTo.on('pointerdown.handle-to', changeHandleToPosition);
    this.view.$handleFrom.on('focusin', changeHandleFromPositionAfterKeydown);
    this.view.$handleTo.on('focusin', changeHandleToPositionAfterKeydown);
    this.view.$stripe.on('pointerdown.stripe-from', changeHandleFromPositionAfterSliderOnDown);
    this.view.$stripe.on('pointerdown.stripe-to', changeHandleToPositionAfterSliderOnDown);
    this.view.$minValue.on('pointerdown.min-from', changeHandleFromPositionAfterMinValueOnDown);
    this.view.$maxValue.on('pointerdown.max-from', changeHandleFromPositionAfterMaxValueOnDown);
    this.view.$maxValue.on('pointerdown.max-to', changeHandleToPositionAfterMaxValueOnDown);
    this.view.$scaleContainer.on('pointerdown.scale', changeHandlesPositionAfterScaleOnDown);

    this.view.$window.on('resize.slider', this.init);
  };

  private launchPanelEventManager = (): void => {
    const stopPropagation = (event: JQuery.TriggeredEvent) => event.stopPropagation();

    this.view.panel.$panelContainer.on('pointerdown', stopPropagation);
    this.view.panel.$minInput.on('change', this.setMin);
    this.view.panel.$maxInput.on('change', this.setMax);
    this.view.panel.$fromInput.on('change', this.setFrom);
    this.view.panel.$toInput.on('change', this.setTo);
    this.view.panel.$stepInput.on('change', this.setStep);
    this.view.panel.$intervalToggle.on('click', this.toggleInterval);
    this.view.panel.$verticalToggle.on('click', this.toggleVertical);
    this.view.panel.$tooltipsToggle.on('click', this.toggleTooltip);
    this.view.panel.$rangeToggle.on('click', this.toggleRange);
    this.view.panel.$scaleToggle.on('click', this.toggleScale);
  };

  private setMin = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const minValue = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(minValue)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.minValue = parseFloat(`${minValue}`);

    this.init();
  };

  private setMax = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const maxValue = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(maxValue)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.maxValue = parseFloat(`${maxValue}`);

    this.init();
  };

  private setFrom = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const from = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(from)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.from = parseFloat(`${from}`);

    this.model.validateInitialValues();
    this.model.calculateInitialHandleFromPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.calculateInitialTooltipsValues();
    this.model.calculateTooltipsPositions();

    this.updateView(this.model.getOptions());
  };

  private setTo = (event: JQuery.ChangeEvent): void => {
    const $currentTarget = $(event.currentTarget);
    const to = $currentTarget.val();

    if (this.checkIsValueANumberAndFullValue(to)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.to = parseFloat(`${to}`);

    this.model.validateInitialValues();
    this.model.calculateInitialHandleToPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.calculateInitialTooltipsValues();
    this.model.calculateTooltipsPositions();

    this.updateView(this.model.getOptions());
  };

  private setStep = (event: JQuery.ChangeEvent): void => {
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

  private toggleInterval = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isInterval = true;
    } else {
      this.model.isInterval = false;
    }

    this.view.initView(this.model.getOptions());
    this.model.validateInitialValues();
    this.model.calculateInitialHandleToPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.calculateInitialTooltipsValues();
    this.model.calculateTooltipsPositions();

    this.updateView(this.model.getOptions());
  };

  private toggleTooltip = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isTooltip = true;
    } else {
      this.model.isTooltip = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private toggleRange = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isRange = true;
    } else {
      this.model.isRange = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private toggleScale = (event: JQuery.ClickEvent): void => {
    const $currentTarget = $(event.currentTarget);

    if ($currentTarget.is(':checked')) {
      this.model.isScale = true;
    } else {
      this.model.isScale = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private toggleVertical = (event: JQuery.ClickEvent): void => {
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
