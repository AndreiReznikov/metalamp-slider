import { Options } from '../interfaces/interfaces';

class Observer {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  observers: any = [];
  // observers: ((options: Options) => void)[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  addObserver = (observer: (options: any) => void): void => {
    this.observers.push(observer);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  notifyObservers = (options: any): void => {
    this.observers.forEach((observer: (arg0: any) => any) => observer(options));
  };
}

export default Observer;
