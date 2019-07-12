import { IMAGE_EXTENSIONS, VIDEOS_EXTESION, GIF_EXTESIONS } from '../constants';

export const getUrlMediaType = function(url) {
  const extension = url.split('.').pop().toLowerCase();
  if (IMAGE_EXTENSIONS.indexOf(extension) !== -1) return 'image';
  if (VIDEOS_EXTESION.indexOf(extension) !== -1) return 'video';
  if (GIF_EXTESIONS.indexOf(extension) !== -1) return 'gif';
  return false;
}


export const generateConvertStages = function generateConvertStages() {
  return [{
      title: 'Step 1: Transcribing Video',
      completed: false,
      active: false,
  },
  {
      title: 'Step 2: Proof Reading Script',
      completed: false,
      active: false,
  },
  {
      title: 'Step 3: Converting to a VideoWiki video',
      completed: false,
      active: false,
  }]
}