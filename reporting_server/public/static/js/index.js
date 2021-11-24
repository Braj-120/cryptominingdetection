$("document").ready(function () {
  let searchParams = new URLSearchParams(window.location.search)
  if (searchParams.get('unauthorized')) {
    $("#validation").append(`<div class="hidden alert alert-danger align-items-center alert-dismissible fade show error-message" id="error-message" role="alert">
    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
    <span id="message">
    Uh oh! Its 401 aka Unauthorized.
    </span>
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>`)
    $("#error-message").removeClass('hidden').addClass("d-inline-flex")
  }
  $("#submit-button").on('click', function (event) {
    event.preventDefault();
    let username = $("#username").val();
    let password = $("#password").val();
    if (username === "" || password === "") {
      if ($("#validation").children().length > 0) {
        return;
      }
      $("#validation").append(`<div class="hidden alert alert-danger align-items-center alert-dismissible fade show error-message" id="error-message" role="alert">
        <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:"><use xlink:href="#exclamation-triangle-fill"/></svg>
        <span id="message">
        Please enter Username and Password
        </span>
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>`)
      $("#error-message").removeClass('hidden').addClass("d-inline-flex");
    } else {
      let form =  $("#login").attr('action', "/ui/authentication").attr('method', 'post');
      form.submit();
    }
  });
});