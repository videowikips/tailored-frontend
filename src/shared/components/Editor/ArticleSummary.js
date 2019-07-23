import React, { Component } from 'react'
import { Segment, Image } from 'semantic-ui-react'
import queryString from 'query-string';
// import { httpGet } from '../../apis/Common';

class ArticleSummary extends Component {

  constructor(props) {
    super(props);
    let state = {};
    if (props['position']) {
      state['position'] = props['position'];
    }

    let title = props['title'];
    if (title) {
      state['title'] = title;
    }
    state['article'] = { image: '', articleText: '' };
    state['loading'] = false;
    this.state = state;
  }

  componentDidMount() {
    this._isMounted = true;
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentWillMount() {
    if (this.state['title']) {
      this.setState({ loading: true });
      this.loadArticleInfo(this.state['title']);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps['title'] !== this.state.title) {
      this.setState({ title: nextProps['title'], loading: true });
      this.loadArticleInfo(this.state['title']);
    }
  }

  loadArticleInfo(url) {
    const query = {};
    const urlParts = url.split('?');
    const title = urlParts[0];

    query['title'] = title;

    if (urlParts.length > 1 && urlParts[1].includes('wikiSource')) {
      query['wikiSource'] = queryString.parse(urlParts[1]).wikiSource;
    }

    // httpGet(`/api/wiki/article/summary?title=${query.title}${query.wikiSource && `&wikiSource=${query.wikiSource}`}`)
    //   .then((res) => {
    //     if (this._isMounted) {
    //       this.setState({ loading: false, article: res.body });
    //     }
    //   })
    //   .catch(() => {});
  }

  _renderContent() {
    if (this.state.loading) {
      return (
        <Image src="/img/paragraph.png" />
      );
    }
    if (this.state.article) {

      return (
        <div>
          <Image src={this.state.article.image} />
          <p className="description">
            {this.state.article.articleText}...
                    </p>
        </div>
      )
    } else {
      return (<div></div>);
    }
  }
  render() {
    let containerWidth = 790;
    let containerHeight = 400;
    let summaryWidth = 300;
    let XOffset = 40;
    let YOffset = 20;

    let x = this.props.position['x'] + XOffset;
    let y = 420 - this.props.position['y'];
    // Setting max offsets for X to avoid overflow
    // if the position  
    if (x > containerWidth / 2) {
      x -= summaryWidth + XOffset;
    }

    if (y > containerHeight) {
      y -= YOffset;
    }

    return (
      <Segment
        className="article-summary"
        style={{
          'left': x,
          'bottom': y,
        }} loading={this.state.loading}>
        {this._renderContent()}

      </Segment>
    );
  }
}

export default ArticleSummary;