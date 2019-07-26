import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as articleActions from '../../../actions/article';
import Editor from '../../../shared/components/Editor';
import { Grid } from 'semantic-ui-react';
import routes from '../../../shared/routes';

class Article extends React.Component {

    componentWillMount = () => {
        this.props.fetchArticleById(this.props.match.params.articleId)
    }

    onAddHumanVoice = lang => {
        this.props.history.push({
            pathname: routes.translationArticle(this.props.article._id),
            search: `?lang=${lang}`
        })
    }

    render() {
        return (
            <Grid style={{ width: '100%' }}>
                <Grid.Row>
                    <Grid.Column width={16}>
                        {this.props.article && (
                            <Editor
                                headerOptions={{
                                    showTranslate: true,
                                }}
                                article={this.props.article}
                                layout={1}
                                onAddHumanVoice={this.onAddHumanVoice}
                            />
                        )}
                    </Grid.Column>
                </Grid.Row>
            </Grid>
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