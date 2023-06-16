"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

// returns html for favorite/star 
function generateFavoriteMarkup(isFavorite){
  return `<span class="star">
          <i class="${isFavorite ? "fas" : "far"} fa-star"></i>
        </span>`;
}

// returns html for delete 
function generateDeleteMarkup(){
  return `<span class="trash">
          <i class="far fa-trash-alt text-danger"></i>
        </span>`;
}

function generateStoryMarkup(story) {

  const hostName = story.getHostName();
  const isFavorite = currentUser ? currentUser.checkIfFavorite(story) : "";
  const isOwnStory = currentUser ? currentUser.checkIfOwnStory(story) : "";
 
  return $(`
      <li id="${story.storyId}">
        ${currentUser && isOwnStory ? generateDeleteMarkup() : ""}
        ${currentUser ? generateFavoriteMarkup(isFavorite) : ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */
function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  // hide other story containers
  $myStoriesList.addClass("hidden");
  $favoriteStoriesList.addClass("hidden");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  $allStoriesList.removeClass("hidden");
}

/** Handle new story submission */
async function handleStorySubmit(e){
  e.preventDefault();

  const name = $("#new-story-author").val();
  const username = $("#new-story-username").val();
  const storyTitle = $("#new-story-title").val();
  const storyUrl = $("#new-story-url").val();

  const newStory = {
    author: name,
    username: username,
    title: storyTitle,
    url: storyUrl
  };

  const addstoryResponse = await storyList.addStory(currentUser, newStory);

  // return if addStory failed
  if(!addstoryResponse) return;

  // generate new story and prepend it to $allStoriesList
  const $newStory = generateStoryMarkup(addstoryResponse);
  
  // Prepend story to $allStoriesList if div is showing
  if(!($allStoriesList.hasClass("hidden"))){
    $allStoriesList.prepend($newStory);
  }

  // Prepend story to $myStoriesList if div is showing
  if(!($myStoriesList.hasClass("hidden"))){
    $myStoriesList.prepend($newStory);
  }

  // hide modal after submit
  $("#storyModal").modal("toggle");

}

$storyForm.on("submit", handleStorySubmit);

/** Show favoritle stories */
function showFavoriteStoriesOnPage() {
  console.debug("putFavoritesListOnPage");

  $favoriteStoriesList.empty();

  // hide other story containers
  $allStoriesList.addClass("hidden");
  $myStoriesList.addClass("hidden");

  if (currentUser.favorites.length === 0) {
    $favoriteStoriesList.append("<p>There's nothing here.</p>");
  } else {
    for (let story of currentUser.favorites) {
      const favStory = generateStoryMarkup(story);
      $favoriteStoriesList.append(favStory);
    }
  }

  $favoriteStoriesList.show().removeClass("hidden");
}

// $favoriteStoriesList.on("click", ".star i", toggleFavorite);

/** Show my stories */
function showMyStoriesOnPage() {
  console.debug("showMyStoriesOnPage");

  $myStoriesList.empty();

  // hide other story containers
  $allStoriesList.addClass("hidden");
  $favoriteStoriesList.addClass("hidden");

  if (currentUser.ownStories.length === 0) {
    $myStoriesList.append("<p>There's nothing here.</p>");
  } else {
    for (let story of currentUser.ownStories) {
      const myStory = generateStoryMarkup(story);
      $myStoriesList.append(myStory);
    }
  }

  $myStoriesList.show().removeClass("hidden");
}

/** Handle clicking favorite on story */
async function toggleFavorite(e) {

  const storyEl = $(e.target.parentElement.parentElement);
  const storyElId = storyEl.attr('id');
 
  const story = storyList.stories.find(e => e.storyId === storyElId);

  // toggle star 
  if($(e.target).hasClass("far")){
    // set story as favorite
    await currentUser.addFavorite(story);
    $(e.target).toggleClass("fas far");
  } else{
    // unfavorite story
    await currentUser.removeFavorite(story);
    $(e.target).toggleClass("fas far");
  }
}

$(".stories-list").on("click", ".star i", toggleFavorite);

/** Handle clicking delete on story */
async function handleDeleteStory(e) {

  const storyEl = $(e.target.parentElement.parentElement);
  const storyElId = storyEl.attr('id');
 
  // delete story from server
  await storyList.removeStory(storyElId);

  // remove story from DOM
  storyEl.remove();

}

$(".stories-list").on("click", ".trash i", handleDeleteStory);