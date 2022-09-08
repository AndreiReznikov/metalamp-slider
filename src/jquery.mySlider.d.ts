interface JQuery {
  mySlider: (userConfig: UserConfig) => jQuery<HTMLElement>;
  update: (newData: UserConfig) => JQuery<HTMLElement>;
  destroy: () => JQuery<HTMLElement>;
}
