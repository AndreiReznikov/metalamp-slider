import "./index.css";

(function($) {
  $.fn.mySlider = function(options: {}): JQuery {

    const $slider = this;
    
    class Model {
      config = $.extend({}, options);
    }

    class View {
      $rangeBetween = $('<div/>').appendTo($slider).addClass('slider__between');
      $firstButton = $('<button/>').appendTo($slider).addClass('slider__first-button');
      $secondButton = $('<button/>').appendTo($slider).addClass('slider__second-button');

      dragAndDrop = () => {
        this.$secondButton.mousedown((ev) => {
          let sliderCoords = this.getCoords($slider);
          let betweenCoords = this.getCoords(this.$rangeBetween); 
          let firstButtonCoords = this.getCoords(this.$firstButton);
          let secondButtonCoords = this.getCoords(this.$secondButton);
          let shiftX1 = ev.pageX - firstButtonCoords.left;
          let shiftX2 = ev.pageX - secondButtonCoords.left;
          let sliderWidth = $slider.width();
          let secondButtonWidth = this.$secondButton.width();
          
          $(document).mousemove((ev) => {
            let left1 = ev.pageX - sliderCoords.left;
            let right1;

            if (left1 < 0) left1 = 0;
            if (sliderWidth && secondButtonWidth) {
              right1 = sliderWidth - secondButtonWidth;
              if (left1 > right1) left1 = right1;
            }

            this.$secondButton.css("margin-left", `${left1}px`);
            this.$rangeBetween.css("width", `${parseInt(this.$secondButton.css("margin-left")) - parseInt(this.$firstButton.css("margin-left"))}px`);
          });

          $(document).mouseup(() => {
            $(document).off('mousedown');
            $(document).off('mousemove');
          });
        });

        this.$firstButton.mousedown((ev) => {
          let sliderCoords = this.getCoords($slider);
          let betweenCoords = this.getCoords(this.$rangeBetween); 
          let firstButtonCoords = this.getCoords(this.$firstButton);
          let secondButtonCoords = this.getCoords(this.$secondButton);
          let shiftX1 = ev.pageX - firstButtonCoords.left;
          let shiftX2 = ev.pageX - secondButtonCoords.left;
          let sliderWidth = $slider.width();
          let firstButtonWidth = this.$firstButton.width();
          
          $(document).mousemove((ev) => {
            let left1 = ev.pageX - sliderCoords.left;
            let right1;

            if (left1 < 0) left1 = 0;
            if (sliderWidth && firstButtonWidth) {
              right1 = sliderWidth - firstButtonWidth;
              if (left1 > right1) left1 = right1;
            }

            this.$firstButton.css("margin-left", `${left1}px`);
            this.$rangeBetween.css("margin-left", `${left1}px`);
            this.$rangeBetween.css("width", `${parseInt(this.$secondButton.css("margin-left")) - parseInt(this.$firstButton.css("margin-left"))}px`);
          });

          $(document).mouseup(() => {
            $(document).off('mousedown');
            $(document).off('mousemove');
          });
        });
      }

      getCoords = (el: JQuery) => {
        const coords = el.position();
        return {
            top: coords.top,
            left: coords.left,
        }
      }
    }

    class Presenter {
      model;
      view;

      constructor(model: {}, view: {}) {
        this.model = model;
        this.view = view;
      }
    }

    let view = new View();

    view.dragAndDrop();

    return this;
  };
})(jQuery);

$('.slider').mySlider();
