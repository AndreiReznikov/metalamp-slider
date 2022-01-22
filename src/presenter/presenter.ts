import { Options } from '../interfaces/interfaces';
import { Model } from '../model/model';
import { View } from '../view/view';

class Presenter {
  model: Model;

  view: View;

  constructor(model: Model, view: View) {
    this.model = model;
    this.view = view;

    this.init();
    this.model.observer.addObserver(this.updateView);

    this.launchEventManager();
    this.launchPanelEventManager();
  }

  private init = (): void => {
    this.view.initView(this.model.getOptions());
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, this.model.getOptions().lengthParameter));
    this.model.validateInitialValues();
    this.model.calculateInitialHandlesPosition();
    this.model.calculateRangePosition();
    this.model.calculateRangeLength();
    this.model.countNumberOfCharactersAfterDot();
    this.model.calculateMinAndMaxPositions();
    this.model.calculateInitialTooltipsValues();
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
    this.model.setElementsParameters(this.view.getElementsParameters(this.model.isVertical, options.lengthParameter));
  };

  private launchEventManager = (): void => {
    const handleHandleFromPosition = (event: JQuery.TriggeredEvent): void => {
      const shiftAxis1 = this.model.calculateShiftAxis1(event);

      const moveHandleFrom = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis1 === undefined) return;

        this.model.calculateHandleFromPositionWhileMoving(event, shiftAxis1);
      };

      $(document).on('pointermove', moveHandleFrom);
      $(document).on('pointerup', () => $(document).off('pointermove', moveHandleFrom));
    };

    const handleHandleToPosition = (event: JQuery.TriggeredEvent) => {
      const shiftAxis2 = this.model.calculateShiftAxis2(event);

      const moveHandleTo = (event: JQuery.TriggeredEvent): void => {
        if (shiftAxis2 === undefined) return;

        this.model.calculateHandleToPositionWhileMoving(event, shiftAxis2);
      };

      $(document).on('pointermove', moveHandleTo);
      $(document).on('pointerup', () => $(document).off('pointermove', moveHandleTo));
    };

    const handleHandleFromPositionAfterKeydown = (event: JQuery.FocusInEvent) => {
      const moveHandleFromAfterKeydown = (event: JQuery.KeyDownEvent): void => {
        this.model.calculateHandleFromPositionAfterKeydown(event);
      };

      $(event.currentTarget).on('keydown', moveHandleFromAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveHandleFromAfterKeydown));
    };

    const handleHandleToPositionAfterKeydown = (event: JQuery.FocusInEvent) => {
      const moveHandleToAfterKeydown = (event: JQuery.KeyDownEvent) => {
        this.model.calculateHandleToPositionAfterKeydown(event);
      };

      $(event.currentTarget).on('keydown', moveHandleToAfterKeydown);
      $(event.currentTarget).on('focusout', () => $(event.currentTarget).off('keydown', moveHandleToAfterKeydown));
    };

    const handleHandleFromPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleFromPositionAfterSliderOnDown(event);
    };

    const handleHandleToPositionAfterSliderOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleToPositionAfterSliderOnDown(event);
    };

    const handleHandleFromPositionAfterMinValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleFromPositionAfterMinValueOnDown(event);
    };

    const handleHandleFromPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleFromPositionAfterMaxValueOnDown(event);
    };

    const handleHandleToPositionAfterMaxValueOnDown = (event: JQuery.TriggeredEvent) => {
      this.model.calculateHandleToPositionAfterMaxValueOnDown(event);
    };

    const handleHandlesPositionAfterScaleOnDown = (event: JQuery.TriggeredEvent) => {
      if (!event.target) return;

      const $target: JQuery<EventTarget> = $(event.target);
      const isScaleElementOnDown: boolean = $target.hasClass('js-slider__scale-element');
      const scaleElementPosition: number = parseInt(`${$target.css(this.model.positionParameter)}`);
      const scaleElementLength: number = parseInt(`${$target.css(this.model.lengthParameter)}`);
      const scaleElementValue: string = $target.html();

      const scaleElementOptions = {
        isScaleElementOnDown,
        scaleElementPosition,
        scaleElementLength,
        scaleElementValue,
      };

      this.model.calculateHandlePositionAfterScaleOnDown(event, scaleElementOptions);
    };

    this.view.$handleFrom.on('pointerdown', handleHandleFromPosition);
    this.view.$handleTo.on('pointerdown', handleHandleToPosition);
    this.view.$handleFrom.on('focusin', handleHandleFromPositionAfterKeydown);
    this.view.$handleTo.on('focusin', handleHandleToPositionAfterKeydown);
    this.view.$slider.on('pointerdown', handleHandleFromPositionAfterSliderOnDown);
    this.view.$slider.on('pointerdown', handleHandleToPositionAfterSliderOnDown);
    this.view.$minValue.on('pointerdown', handleHandleFromPositionAfterMinValueOnDown);
    this.view.$maxValue.on('pointerdown', handleHandleFromPositionAfterMaxValueOnDown);
    this.view.$maxValue.on('pointerdown', handleHandleToPositionAfterMaxValueOnDown);
    this.view.$scaleContainer.on('pointerdown', handleHandlesPositionAfterScaleOnDown);
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
    this.view.panel.$scaleToogle.on('click', this.toggleScale);
  };

  private setMin = (event: JQuery.ChangeEvent): void => {
    const minValue = $(event.currentTarget).val();
    
    if (this.isValueANumberAndFullValue(minValue)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.minValue = parseFloat(`${minValue}`);

    this.init();
  };

  private setMax = (event: JQuery.ChangeEvent): void => {
    const maxValue = $(event.currentTarget).val();

    if (this.isValueANumberAndFullValue(maxValue)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.maxValue = parseFloat(`${maxValue}`);

    this.init();
  };

  private setFrom = (event: JQuery.ChangeEvent): void => {
    const from = $(event.currentTarget).val();

    if (this.isValueANumberAndFullValue(from)) {
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
    const to = $(event.currentTarget).val();

    if (this.isValueANumberAndFullValue(to)) {
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
    const step = $(event.currentTarget).val();

    if (this.isValueANumberAndFullValue(step)) {
      this.view.panel.setPanelValues(this.model.getOptions());
      return;
    }

    this.model.step = parseFloat(`${step}`);

    this.model.validateInitialValues();
    this.model.calculateStepLength();
  };

  private toggleInterval = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
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
    if ($(event.currentTarget).is(':checked')) {
      this.model.isTooltip = true;
    } else {
      this.model.isTooltip = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private toggleRange = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isRange = true;
    } else {
      this.model.isRange = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private toggleScale = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
      this.model.isScale = true;
    } else {
      this.model.isScale = false;
    }

    this.view.initView(this.model.getOptions());
    this.updateView(this.model.getOptions());
  };

  private toggleVertical = (event: JQuery.ClickEvent): void => {
    if ($(event.currentTarget).is(':checked')) {
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

  private isValueANumberAndFullValue = (value: string | number | string[] | undefined): boolean => {
    const isValueANumberAndFullValue: boolean = typeof parseFloat(`${value}`) !== 'number' || value === '';

    return isValueANumberAndFullValue;
  }
}

export { Presenter };
