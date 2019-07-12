import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as articleActions from '../../actions/article';
import Editor from '../../components/Editor';

class Article extends React.Component {

    componentWillMount = () => {
        this.props.fetchArticleById(this.props.match.params.articleId)
    }

    render() {
        return (
            <div>
                article
                {this.props.article && (
                    <Editor article={this.props.article} layout={1} />
                )}
            </div>
        )
    }
}

const mapStateToProps = ({ article }) => ({
    article: article.article,
})

const mapDispatchToProps = (dispatch) => ({
    fetchArticleById: id => dispatch(articleActions.fetchArticleById(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Article));