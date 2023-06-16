"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */
function navAllStories(evt) {
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

// show favorite stories when clicked
function navFavoriteStories(e){
  hidePageComponents();
  showFavoriteStoriesOnPage();
}

$body.on("click", "#nav-favorites", navFavoriteStories);

// show MY stories when clicked
function navMyStories(e){
  hidePageComponents();
  showMyStoriesOnPage();
}

$body.on("click", "#nav-my-stories", navMyStories);

/** Show login/signup on click on "login" */
function navLoginClick(evt) {
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */
function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
 
  $(".main-nav-links").removeClass("hidden");
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** when a user clicks submit navbar link, show new story form */
$modal.addEventListener('show.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget;
  
  $(event.target).find("#new-story-author").attr('value', currentUser.name);
  $(event.target).find("#new-story-username").attr('value', currentUser.username);
})

/** When the form has been hidden */
$modal.addEventListener('hidden.bs.modal', event => {
  // Button that triggered the modal
  const button = event.relatedTarget;
  
  $storyForm.trigger("reset");
  $(event.target).find("#new-story-author").attr('value', "");
  $(event.target).find("#new-story-username").attr('value', "");

   // clear validation
   $(".invalid-feedback").hide();
})