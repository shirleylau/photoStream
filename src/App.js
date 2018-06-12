import React, { Component } from 'react';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      photos: [],
      timeUpper: null,
      timeLower: null,
      gettingPhotos: false
    };
    this.onScroll = this.onScroll.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
  }
  componentDidMount() {
    window.addEventListener('scroll', this.onScroll);
    this.getPhotos();
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.onScroll);
  }
  onScroll() {
    const { gettingPhotos } = this.state;
    if ((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 600) && !gettingPhotos) {
      this.setState({ gettingPhotos: true });
      this.getPhotos();

    }
  }
  getPhotos() {
      const { photos, timeLower, gettingPhotos } = this.state;
      const oAuthConsumerKey = 'uwIah6pG7Khlh3CLfqYlXlEVVJ5bWwskaaiEoBGzDbyJ7q3GzN';
      const tag = 'gif';
      let api = `https://api.tumblr.com/v2/tagged?tag=${tag}&limit=30&api_key=${oAuthConsumerKey}`;
      if (timeLower) {
        api += `&before=${timeLower}`;
      }
      axios.get(api)
        .then(response => {
          this.setState({ gettingPhotos: false });
          if (response && response.data && response.data.response) {
            const newPhotos = response.data.response
              .filter(post => post.type === 'photo')
              .map(post => {
                return {
                  post: post.post_url,
                  img: post.photos[0].original_size.url,
                  timestamp: post.featured_timestamp,
                  summary: post.summary
                }
              });
            this.setState({
              photos: photos.concat(newPhotos),
              timeLower: newPhotos[newPhotos.length - 1].timestamp
            });
          }
        });
  }
  render() {
    let { photos } = this.state;
    return (
      <div className="App">
        <div><h1>#gif</h1></div>
        <PhotoFeed photos={photos} />
      </div>
    );
  }
}

class PhotoFeed extends Component {
  render() {
    let { photos } = this.props;
    return(
      <div className="photo-feed">
        {
          photos.map((post, i) => {
            return  <PhotoCard img={post.img} post={post.post} summary={post.summary} key={i} />
          })
        }
      </div>
    )
  }
}

class PhotoCard extends Component {
  render() {
    const { img, post, summary } = this.props;
    return(
      <div className="photo-card">
        <a href={post} target="_blank">
          <div>{summary}</div>
          <img src={img}></img>
        </a>
      </div>
    )
  }
}

export default App;
