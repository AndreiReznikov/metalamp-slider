import "./index.css";

(function($) {
  $.fn.mySlider = function(options: {}): JQuery {

    const $slider = this;

    console.log($slider.width());
    
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
          
          $(document).mousemove((ev) => {
            let left1 = ev.pageX - shiftX2 - sliderCoords.left;
            let right1;
            let sliderWidth = $slider.width();
            let secondButtonWidth = this.$secondButton.width();

            if (left1 < 0) left1 = 0;

            if (sliderWidth && secondButtonWidth) {
              right1 = sliderWidth - secondButtonWidth;
              if (left1 > right1) left1 = right1;
            }

            this.$secondButton.css("margin-left", `${left1}px`);
            this.$rangeBetween.css("width", `${left1}px`);
          });

          $(document).mouseup(() => {
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
