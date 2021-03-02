import React, { memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components'
import messages from './messages';

/**
 * Parse querystring from route
 * @param {string} find query name
 * @param {string} from route or URL
 * @returns {string}
 */
function parseQueryString(find, from) {
  if (!find || !from) return '';
  const parts = RegExp(`[?&]${find}(=([^&#]*)|&|#|$)`).exec(from);
  return parts ? parts[2] : '';
}

// location is provided by react-router-dom
function NearbyPage({ location: { search: query } }) {
  const coordinates = parseQueryString('coordinates', query);

  return (
    <article>
      <Helmet>
        <title>Nearby</title>
        <meta name="description" content="Description of Nearby" />
      </Helmet>
      <FormattedMessage {...messages.header} />,
      {coordinates}
      <Flickr position={coordinates} />,
    </article>
  );
}

// events
const handleHoverIn = (event) => {
  event.target.setAttribute("style", "border-color: pink;");
};
const handleHoverOut = (event) => {
  event.target.setAttribute("style", "border-color:grey;");
};
const handleClick = (event) => {
  event.target.setAttribute('style', 'border-color: pink;');
  event.target.setAttribute('className', 'active');
  const path = event.target.getAttribute('src');
  const photo = document.getElementById('largeImage');
  photo.setAttribute('src', path);
  photo.setAttribute('style', 'display: block;');
};

const Rollover = ({
  alt,
  primary,
}) => (
  <SmallImage
    onMouseOver={handleHoverIn}
    onFocus={handleHoverIn}
    onMouseOut={handleHoverOut}
    onBlur={handleHoverOut}
    onClick={handleClick}
    alt={alt}
    src={primary}
  />
);

// styled components
const SmallImage = styled.img`
  width: 100%;
  max-height: 60%;
  border-style: solid;
  border-width: 5px 5px 20px;
  border-color: grey;
`;

const Container = styled.section`
  display: flex;
  min-height: 100%;
  flex-direction: comun;
  margin: 0 auto;
`;
const ItemUl = styled.ul`
  list-style:none;
`;
const ItemLi = styled.li`
  background:blue;
  list-style:none;
  width: 195px;
  padding:10px;
  width: 195px;
  height: 180px;
  background-color:grey;
  padding-bottom:6px;
  float: left;
  margin: 6px;
  border-radius:4px;
`;
const ItemP = styled.p`
  color: silver;
  font-family: Arial;
  font-weight: bold;
  font-size: 11px;
  margin-top: 10px;
  float:left;
  clear: both;
`;
const ItemD = styled.div`
  margin:0 auto;
  text-align: center;
`;
const LargeImage = styled.img`
  width: 400px;
  border-style: solid;
  border-width: 5px 5px 20px;
  border-color:grey;
  display:none;
  margin:0 auto;
  border-radius:4px;
`;

export default memo(NearbyPage);

const Flickr = ({ position }) => {
  const [imgList, setImgList, coordinates] = React.useState();
  const [Thumb, setThumb] = React.useState();

  React.useEffect(() => {
    async function fetchData(coordinates) {
      // make coordinates go in lat and longitude
      const results = coordinates.split(',');
      const lat = results[0];
      const lon = results[1];

      // flickr api
      const flickrUrl = 'https://www.flickr.com/services/rest/?method=flickr.photos.search';
      const apiKey = '50c12c756f1f9d6686f6b248f0a1c3a9';
      const params = `&api_key=${apiKey}&lat=${lat}&lon=${lon}&format=json&nojsoncallback=1&extras=url_o&per_page=6`;
      const response = await fetch(flickrUrl + params);
      const result = await response.json();

      // if there is not error
      if (result.stat !== 'fail') {
        const imgs = result.photos.photo.map((img) => (
          <ItemUl key={img.id}>
            <ItemLi>
              <Rollover
                alt={img.title}
                primary={img.url_o}
              />
              <ItemP>{img.title}</ItemP>
            </ItemLi>
          </ItemUl>
        ));
        setImgList(imgs);

        const imgs2 = (
          <ItemD>
            <LargeImage
              id="largeImage"
              alt=""
              src=""
            />
          </ItemD>
        );
        setThumb(imgs2);
      }
    }
    fetchData(position);
  }, [position, setImgList]);

  // If there is no results
  if (!imgList) return null;

  return (
    <div>
      {Thumb}
      <Container>
        {imgList}
      </Container>
    </div>
  );
};
