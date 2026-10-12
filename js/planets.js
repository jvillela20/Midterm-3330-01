
$(function () {
    const $planets = $('#planets');
    const $dialog = $('#dialog');

    $dialog.dialog({
        autoOpen: false,
        modal: true,
        width: 400
    });

    function formatNumber(value) {
        return Number.isFinite(value) ? value.toFixed(2) : 'Unavailable';
    }

    function createCard(celestialBody) {
        const imageName = celestialBody.name.toLowerCase().replace(/\s+/g, '-');
        const $card = $('<div>', {
            class: 'card',
            tabindex: 0,
            role: 'button',
            'aria-label': `View properties for ${celestialBody.name}`
        });
        const $body = $('<div>', { class: 'card-body' });
        const $image = $('<img>', {
            src: `./images/${imageName}.png`,
            alt: celestialBody.name,
            loading: 'lazy'
        });
        const $title = $('<p>', {
            class: 'card-title',
            text: celestialBody.name
        });

        $body.append($image, $title);
        $card.append($body);

        function showProperties() {
            $dialog.find('.name').text(celestialBody.name);
            $dialog.find('.constellation').text(celestialBody.constellation || 'Unavailable');
            $dialog.find('.altitude').text(`${formatNumber(celestialBody.altitude)}°`);
            $dialog.find('.azimuth').text(`${formatNumber(celestialBody.azimuth)}°`);
            $dialog.dialog('open');
        }

        $card.on('click', showProperties);
        $card.on('keydown', function (event) {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                showProperties();
            }
        });

        return $card;
    }

    async function loadCelestialBodies() {
        try {
            const response = await fetch('./data/planets.json');
            if (!response.ok) {
                throw new Error(`Unable to load celestial bodies: ${response.status}`);
            }

            const celestialBodies = await response.json();
            if (!Array.isArray(celestialBodies)) {
                throw new Error('Celestial-body response must be a list of objects.');
            }

            celestialBodies.forEach((celestialBody) => {
                $planets.append(createCard(celestialBody));
            });
        } catch (error) {
            console.error(error);
            $planets.text('Celestial-body is currently unavailable.');
        }
    }

    loadCelestialBodies();
});
