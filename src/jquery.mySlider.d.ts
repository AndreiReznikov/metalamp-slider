interface JQuery {
  mySlider: jQuery;
  update: (newData: UserConfig) => JQuery<HTMLElement>;
  destroy: () => JQuery<HTMLElement>;
}
