const propTypes = require('prop-types');
const React = require('react');

const utils = require('../../utils/lib');

const Source = require('./source.jsx');
const Track = require('./track.jsx');

function Video({ video }) {
  const sources = video.sources.split(',').map((source) => {
    const extension = utils.file.type(source);
    const id = `source${video.gallery}${extension}`;

    return <Source key={id} extension={extension} gallery={video.gallery} source={source} />;
  });

  const tracks = video.sources.split(',').map((source) => {
    const extension = utils.file.type(source);
    const id = `track${video.gallery}${extension}`;

    return <Track key={id} extension={extension} gallery={video.gallery} source={source} />;
  });

  const poster = utils.file.photoPath(utils.file.videoToThumbsPath(video.sources, video.gallery));

  /* eslint-disable jsx-a11y/media-has-caption */
  return (<video width={video.w} height={video.h} poster={poster} controls preload="auto" autoPlay="true">
    {sources}
    {tracks}
  </video>);
}

Video.propTypes = {
  video: propTypes.shape({
    w: propTypes.number.isRequired,
    h: propTypes.number.isRequired,
    gallery: propTypes.string.isRequired,
    sources: propTypes.string.isRequired
  }).isRequired
};

module.exports = Video;
