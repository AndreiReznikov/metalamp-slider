import Model from '../src/Model/Model';
import View from '../src/View/View';
import Presenter from '../src/Presenter/Presenter';

document.body.innerHTML = `
  <div class='container'>
    <div class='slider'></div>
  </div>`;

const $container = $('.container');
$container.css({ width: 100, height: 8 });

const $slider = $('.slider');

const model = new Model();
const view = new View($slider);
const presenter = new Presenter(model, view);

let eventSimulation: JQuery.TriggeredEvent;

const getEvent = (event: JQuery.TriggeredEvent) => {
  eventSimulation = event;
  eventSimulation.stopPropagation = () => {};
};

const $button = $('</div>');

beforeEach(() => {
  presenter.model.double = false;
  presenter.model.vertical = false;
  presenter.model.showTooltip = false;
  presenter.model.showLimit = false;
  presenter.model.showRange = false;
  presenter.model.showScale = false;
  presenter.model.from = 0;
  presenter.model.to = 0;
  presenter.model.min = 0;
  presenter.model.max = 0;
  presenter.model.step = 1;
});

describe('getApi', () => {
  test('method should return api', () => {
    presenter.getApi().updateUserConfig({
      from: 44,
      showTooltip: false,
      showRange: false,
    });
    expect(presenter.model.from).toEqual(44);

    $button.on('mousedown', getEvent);
    $button.trigger('mousedown');

    presenter.getApi().toggleDouble(eventSimulation);
    expect(presenter.model.double).toBeTruthy();

    presenter.getApi().toggleVertical(eventSimulation);
    expect(presenter.model.vertical).toBeTruthy();

    presenter.getApi().toggleRange(eventSimulation);
    expect(presenter.model.showRange).toBeTruthy();

    presenter.getApi().toggleScale(eventSimulation);
    expect(presenter.model.showScale).toBeTruthy();

    presenter.getApi().toggleTooltip(eventSimulation);
    expect(presenter.model.showTooltip).toBeTruthy();

    presenter.getApi().setFrom(eventSimulation, 10);
    expect(presenter.model.from).toEqual(10);

    presenter.getApi().setTo(eventSimulation, 20);
    expect(presenter.model.to).toEqual(20);

    presenter.getApi().setMin(eventSimulation, -5);
    expect(presenter.model.min).toEqual(-5);

    presenter.getApi().setMax(eventSimulation, 220);
    expect(presenter.model.max).toEqual(220);

    presenter.getApi().setStep(eventSimulation, 45);
    expect(presenter.model.step).toEqual(45);
  });
});
