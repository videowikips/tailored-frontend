import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';

import Comment from '../../shared/components/Comments';

class SampleCommentPage extends React.Component {

    componentWillMount = () => {
    }

    render() {
        return (
            <div>

                <div className="comment-wrapper">
                    <div className="sample-post">
                    </div>

                    <Comment/>
                </div>
                
            </div>
        )
    }
}

const mapStateToProps = ({ article }) => ({
    // article: article.article,
})

const mapDispatchToProps = (dispatch) => ({
    // fetchArticleById: id => dispatch(articleActions.fetchArticleById(id)),
})

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(SampleCommentPage));