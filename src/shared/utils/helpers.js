import { IMAGE_EXTENSIONS, VIDEOS_EXTESION, GIF_EXTESIONS } from '../constants';

export const getUrlMediaType = function (url) {
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

export function formatTime(milliseconds) {
  if (!milliseconds) return '00:00';
  let seconds = milliseconds / 1000;
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds - (hours * 3600)) / 60);
  seconds = seconds - (hours * 3600) - (minutes * 60);
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  if (seconds < 10) { seconds = "0" + seconds; }
  let time = minutes + ':' + seconds;

  return time.substr(0, 5);
}

export function debounce(func, wait, immediate) {
  let timeout;
  return function () {
    let context = this, args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

export function cloneObject(obj) {
  return JSON.parse(JSON.stringify(obj))
}

export function userCanView(user, organization, roles) {
  const userRole = user.organizationRoles.find((r) => r.organization._id === organization._id)
  let canView = false;
  if (userRole && userRole.organizationOwner) {
    canView = true;
  } else if (userRole) {
    if (userRole && userRole.permissions.some(p => roles.indexOf(p) !== -1)) {
      canView = true;
    }
  }
  return canView;
}