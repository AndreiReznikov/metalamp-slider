interface JQuery {
  pooshkaSlider: (userConfig: UserConfig) => jQuery<HTMLElement>;
  toggleTooltip: (newData: UserConfig) => JQuery<HTMLElement>;
  destroy: () => JQuery<HTMLElement>;
}
