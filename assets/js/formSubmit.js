// Variable to hold request
var request;

// Bind to the submit event of our form
$("#inquiry-form").submit(function (event) {
  // Abort any pending request
  if (request) {
    request.abort();
  }
  // setup some local variables
  var $form = $(this);

  // Let's select and cache all the fields
  var $inputs = $form.find("input, select, button, textarea");

  // Serialize the data in the form
  var serializedData = $form.serialize();

  // Let's disable the inputs for the duration of the Ajax request.
  // Note: we disable elements AFTER the form data has been serialized.
  // Disabled form elements will not be serialized.
  $inputs.prop("disabled", true);

  // Fire off the request
  request = $.ajax({
    url:
      "https://script.google.com/macros/s/AKfycbxyvYIpDBAmy6euDBzgWvAMMRH9r6FRyd63iddLygDh7Ga_-r25/exec",
    type: "post",
    data: serializedData
  });

  // Callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR) {
    alert("Thank You ,Response Submitted!");
  });

  // Callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown) {
    // Log the error to the console
    console.error("The following error occurred: " + textStatus, errorThrown);
  });

  // Callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
    // Reenable the inputs
    $inputs.prop("disabled", false);
  });

  // Prevent default posting of form
  event.preventDefault();
});


// Variable to hold request
var request;

// Bind to the submit event of our form
$("#inquiry-form-pass").submit(function (event) {
  // Abort any pending request
  if (request) {
    request.abort();
  }
  // setup some local variables
  var $form = $(this);

  // Let's select and cache all the fields
  var $inputs = $form.find("input, select, button, textarea");

  // Serialize the data in the form
  var serializedData = $form.serialize();

  // Let's disable the inputs for the duration of the Ajax request.
  // Note: we disable elements AFTER the form data has been serialized.
  // Disabled form elements will not be serialized.
  $inputs.prop("disabled", true);

  // Fire off the request
  request = $.ajax({
    url:
      "https://script.google.com/macros/s/AKfycbwTfE8X_862YZN3x9MHcFKVtHjuo1nSCCP_TYLygAeZmaWkdg4/exec",
    type: "post",
    data: serializedData
  });

  // Callback handler that will be called on success
  request.done(function (response, textStatus, jqXHR) {
    alert("Thank You ,Response Submitted!");
    window.location.href = "/";
  });

  // Callback handler that will be called on failure
  request.fail(function (jqXHR, textStatus, errorThrown) {
    // Log the error to the console
    console.error("The following error occurred: " + textStatus, errorThrown);
  });

  // Callback handler that will be called regardless
  // if the request failed or succeeded
  request.always(function () {
    // Reenable the inputs
    $inputs.prop("disabled", false);
  });

  // Prevent default posting of form
  event.preventDefault();
});
