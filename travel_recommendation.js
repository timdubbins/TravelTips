$(function () {
  const $content = $('#content');
  const $searchbar = $('.nav-search');
  const $searchIcon = $('#search-icon');
  const $searchInput = $('#search-input');
  const $submitSearch = $('#search-btn');
  const $clearSearch = $('#clear-btn');
  const $navLinks = $('.navbar a');

  $content.load('home.html', handleSearchContent);

  $searchInput.on('input', function () {
    $searchIcon.css('display', this.value.length > 0 ? 'none' : 'block');
  });

  $navLinks.click(handleNavLinks);

  function handleNavLinks(e) {
    e.preventDefault();
    const page = $(this).attr('id');

    $content.load(page + '.html', () => {
      switch (page) {
        case 'home':
          showElement($searchbar);
          handleSearchContent();
          break;
        case 'about':
          hideElement($searchbar);
          break;
        case 'contact':
          hideElement($searchbar);
          handleFormSubmission();
          break;
      }
    });
  }

  function handleSearchContent() {
    const $searchResults = $('#search-results');

    // console.log(data);
    $submitSearch.click(function () {
      $.getJSON('travel_recommendation_api.json', function (data) {
        const query = $searchInput.val().toLowerCase();

        if (query === 'beach' || query == 'beaches') {
          console.log(data.beaches);
          displaySearchResults(data.beaches);
        } else if (query === 'temple' || query == 'temples') {
          displaySearchResults(data.temples);
        } else if (query === 'country' || query == 'countries') {
          displaySearchResults(twoRandomCities(data));
        }
      }).fail((_, textStatus, error) => {
        console.log('Error fetching data: ' + textStatus + ', ' + error);
      });

      const displaySearchResults = (entries) => {
        $searchResults.empty();
        entries.forEach((entry) => {
          const element = $('<div>').addClass('search-content');
          element.append($('<h3>').text(entry.name));
          element.append(
            $('<img>').attr('src', entry.imageUrl).attr('alt', entry.name)
          );
          element.append($('<p>').text(entry.description));
          $searchResults.append(element);
        });
      };
    });

    $clearSearch.click(function () {
      $searchResults.empty();
      $searchIcon.css('display', 'block');
      $searchInput.val('');
    });

    $searchInput.keydown(function (e) {
      // 13 is keycode for enter
      if (e.keyCode == 13) {
        $submitSearch.click();
      }
    });

    if ($searchInput.val().length > 0) {
      $submitSearch.click();
    }
  }
});

const handleFormSubmission = () => {
  $('#contact-form').submit(function (event) {
    event.preventDefault();

    $('#contact-alert').fadeIn();

    setTimeout(function () {
      $('#contact-alert').fadeOut();
    }, 1500);

    this.reset();
  });
};

const hideElement = (selector) => {
  selector.css('visibility', 'hidden');
  selector.prop('disabled', true);
};

const showElement = (selector) => {
  selector.css('visibility', 'visible');
  selector.prop('disabled', false);
};

const twoRandomCities = (data) => {
  let cities = data.countries
    .map((country) => country.cities)
    .reduce((acc, cities) => acc.concat(cities), []);

  let randomCities = [];
  let usedIndices = new Set(); // To keep track of indices already used

  while (randomCities.length < 2 && randomCities.length < cities.length) {
    let randomIndex = Math.floor(Math.random() * cities.length);
    // Check if index has already been used
    if (!usedIndices.has(randomIndex)) {
      randomCities.push(cities[randomIndex]);
      usedIndices.add(randomIndex);
    }
  }

  return randomCities;
};
