module.exports = {
  transform: {
    '\\.js$': 'babel-jest',
    '\\.ts$': 'babel-jest',
  },
  setupFilesAfterEnv: ['./setup-jest.js'],
  testEnvironment: 'jsdom'
};
