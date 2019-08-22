import { combineReducers } from 'redux'
import poller from './poller';
import video from './video';
import article from './article';
import authentication from './authentication';
import organization from './organization';
import organizationVideos from '../Pages/Organization/Videos/modules/reducer';
import translateArticle from '../Pages/Translation/TranslateArticle/modules/reducer';
import organizationArchive from '../Pages/Organization/Archive/modules/reducers';
import invitations from '../Pages/Invitations/modules/reducer';

export default function createRootReducer (additionalReducers = {}) {
  const reducers = {
    // state: (state = {}) => state,
    video,
    article,
    authentication,
    organization,
    poller,
    organizationVideos,
    translateArticle,
    organizationArchive,
    invitations
  }

  return combineReducers(Object.assign({}, additionalReducers, reducers))
}
