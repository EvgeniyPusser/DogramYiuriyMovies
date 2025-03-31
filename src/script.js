const detailedImage = document.querySelector(".detailedContainer--image");
const detailedTitle = document.querySelector(".detailedContainer--title");
const formElem = document.getElementById("query-form");
const mainElem = document.querySelector(".main");
const inputElements = document.querySelectorAll("#query-form [name]");
const API_KEY = "1eb9c2c4f46b71a5b4e658c14148c7cd";
let year;
let page = 2;
const LANGUAGE = "en-us";
const image_prefix = "https://image.tmdb.org/t/p/w500";
let galleryImages;
const galleryElem = document.getElementById("cats_gallery");
async function drawGalleryItems() {
  const response = await fetch(
    `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=${LANGUAGE}&primary_release_year=${year}&page=${page}&sort_by=popularity.desc`
  );
  const data = await response.json();
  const itemsData = getItemsData(data.results); //input data from API, output - array of objects
  //  {itemImage, detailedImage, title, detailedTitle}
  const items = getItems(itemsData);
  galleryElem.innerHTML = items;
  galleryImages = document.querySelectorAll(".gallery--item_image");
  addLIsteners();
}

function getItemsData(data) {
  const itemsData = data.map((record) => ({
    itemImage: getImage(record.poster_path),
    detailedImage: getImage(record.backdrop_path),
    title: record.title,
    detailedTitle: record.overview,
  }));
  return itemsData;
}
function getItems(itemsData) {
  const items = itemsData.map(getItem);
  return items.join();
}
function getItem({ itemImage, detailedImage, title, detailedTitle }) {
  return `<li class="gallery--item">
          <img
            src="${itemImage}"
            alt="${title + " image"}"
            class="gallery--item_image"
            data-detailed-image="${detailedImage}"
            data-detailed-title="${detailedTitle}"
          />
          <span class="gallery--item_title">${title} </span>
        </li>`;
}
function getImage(image_id) {
  return `${image_prefix}${image_id}`;
}
function addLIsteners() {
  for (let i = 0; i < galleryImages.length; i++) {
    galleryImages[i].addEventListener("click", function () {
      setDetails(galleryImages[i]);
    });
  }
}

function setDetails(galleryImage) {
  let image = galleryImage.getAttribute("data-detailed-image");
  detailedImage.src = "";
  detailedImage.src = image;
  detailedTitle.innerHTML =
    galleryImage.getAttribute("data-detailed-title") +
    '<span class="for_ellipsis">...</span>';
  animate();
}
function animate() {
  detailedImage.classList.remove("animation-up");
  detailedTitle.classList.remove("animation-down");
  setTimeout(function () {
    detailedImage.classList.add("animation-up");
    detailedTitle.classList.add("animation-down");
  }, 0);
}
//script actions
formElem.addEventListener("submit", async function (event) {
  event.preventDefault();
  const data = getFormData();
  year = +data.year;
  page = 1; // Reset page to 1 when a new year is submitted
  console.log(year); // Debugging output
  await drawGalleryItems();
  mainElem.classList.remove("hidden");
  formElem.classList.add("hidden");
});
// Add event listener to the "Next" button

document
  .querySelector(".fold-button")
  .addEventListener("click", async function () {
    console.log("Next button clicked!"); // Debugging output

    page++; // Increment the page number

    await drawGalleryItems(); // Wait for new data to load

    // Now update the detailed image and title with the correct page number
    detailedImage.src = "./images/image.png"; // Reset to placeholder image
    detailedTitle.innerHTML = `Page number ${page} from Movie History year ${year} <span class="for_ellipsis">.....</span>`;

    // Re-trigger animation
    detailedImage.classList.remove("animation-up");
    detailedTitle.classList.remove("animation-down");

    setTimeout(() => {
      detailedImage.classList.add("animation-up");
      detailedTitle.classList.add("animation-down");
    }, 0);
  });

function getFormData() {
  const inputElementsArr = Array.from(inputElements);
  const dataObj = inputElementsArr.reduce(
    (res, curElem) => ({ ...res, [curElem.name]: curElem.value }),
    {}
  );
  return dataObj;
}
// function moveToInputData() {
//   mainElem.classList.add("hidden");
//   formElem.classList.remove("hidden");
// }

function moveToInputData() {
  mainElem.classList.add("hidden");
  formElem.classList.remove("hidden");

  // 🔹 Reset detailed image and text when going back
  detailedImage.src = "images/image.png"; // Placeholder image
  detailedTitle.innerHTML =
    "gallery of the movies from themoviedb API. You may see many movies with images and short description. Sorted by popularity in the descending order <span class='for_ellipsis'>.....</span>";

  page = 1; // Reset page when going back
}


