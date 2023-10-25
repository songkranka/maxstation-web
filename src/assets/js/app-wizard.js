$(function () {
  "use strict";

  const initialize = () => {
    $(".pt-wizard")
      .find(".pt-wizard-button")
      .toArray()
      .forEach(function (el) {
        $(el).addClass("waves-effect");
      });
  };

  initialize();

  $(".pt-wizard").on("click", "button.pt-wizard-button", function () {
    let that = this;
    const event = $(this).hasClass("next")
      ? "next"
      : $(this).hasClass("back")
      ? "back"
      : null;

    switch (event) {
      case "next":
        next(that);
        break;
      case "back":
        back(that);
        break;
      default:
        break;
    }
  });

  $(".pt-wizard-nav").on("click", " li.pt-wizard-nav-item", function () {
    let nav = $(this)
      .closest(".pt-wizard")
      .find(".pt-wizard-nav li.pt-wizard-nav-item");
    let content = $(this).closest(".pt-wizard").find(".pt-wizard-content");

    nav.removeClass("active");
    content.removeClass("active");

    $(this).addClass("active");
    let target = $(this).data("target");
    $(target).addClass("active");

    initialize();
  });

  const next = (element) => {
    let nav = $(element)
      .closest(".pt-wizard")
      .find(".pt-wizard-nav li.pt-wizard-nav-item");
    let content = $(element).closest(".pt-wizard").find(".pt-wizard-content");

    let currentStep = 0;
    $(nav)
      .toArray()
      .forEach(function (el, index) {
        if ($(el).hasClass("active")) {
          currentStep = index;
        }
      });

    const nextStepElement =
      currentStep === nav.length - 1 ? nav[0] : nav[currentStep + 1];

    nav.removeClass("active");
    content.removeClass("active");

    const targetElement = $(nextStepElement).data("target");
    $(targetElement).addClass("active");
    $(nextStepElement).addClass("active");
  };

  const back = (element) => {
    let nav = $(element)
      .closest(".pt-wizard")
      .find(".pt-wizard-nav li.pt-wizard-nav-item");
    let content = $(element).closest(".pt-wizard").find(".pt-wizard-content");

    let currentStep = 0;
    $(nav)
      .toArray()
      .forEach(function (el, index) {
        if ($(el).hasClass("active")) {
          currentStep = index;
        }
      });

    const nextStepElement =
      currentStep === 0 ? nav[nav.length - 1] : nav[currentStep - 1];

    nav.removeClass("active");
    content.removeClass("active");

    const targetElement = $(nextStepElement).data("target");
    $(targetElement).addClass("active");
    $(nextStepElement).addClass("active");
  };
});
