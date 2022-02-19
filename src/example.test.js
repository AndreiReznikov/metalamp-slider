import Model from './model/model';

describe('validateInitalValues', () => {
  const model = new Model();

  test('defines a function', () => {
    expect(typeof model.validateInitialValues).toBe('function');
  });
});
