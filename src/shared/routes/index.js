export default {
    home: () => '/',
    logout: () => '/logout',
    demo: () => '/demo',
    convertProgress: (videoId = ':videoId') => `/convert/${videoId}`,
    
    // Organization
    organizationHome: () => '/organization',
    organizationUsers: () => '/organization/users',
    organizationVideos: () => '/organization/videos',
    organizationArticle: (articleId = ':articleId') => `/organization/article/${articleId}`,
    organizationArchive: () => `/organization/archive`,
    // Translation
    translationArticle: (articleId = ':articleId', langCode) => `/translation/article/${articleId}${langCode ? `?lang=${langCode}` : ''}`,

    invitationsRoute: (organizationId = ':organizationId') => `/invitations/${organizationId}`,
}