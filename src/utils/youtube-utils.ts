import axios from "axios";

export const getPublicYoutubeAppKey = async () => {
  let apiKey = "";

  const page = await axios.get(encodeURI(`https://www.youtube.com/`));
  const ytInitData = await page.data.split("var ytInitialData =");

  if (ytInitData && ytInitData.length > 1) {
    if (page.data.split("innertubeApiKey").length > 0) {
      apiKey = await page.data
        .split("innertubeApiKey")[1]
        .trim()
        .split(",")[0]
        .split('"')[2];
    }
  }

  return apiKey;
};

const formatSearchResults = (results: { videoRenderer: any }[]) => {
  const formattedResults = results.map(({ videoRenderer }) => ({
    id: videoRenderer.videoId,
    title: videoRenderer.title.runs[0].text,
    description:
      videoRenderer.detailedMetadataSnippets?.[0].snippetText.runs[0].text,
    thumbnails: videoRenderer.thumbnail.thumbnails,
    duration: videoRenderer.lengthText.simpleText,
    views: videoRenderer.shortViewCountText.simpleText,
    author: {
      name: videoRenderer.longBylineText.runs[0].text,
      id: videoRenderer.longBylineText.runs[0].navigationEndpoint.browseEndpoint
        .browseId,
      slug: videoRenderer.longBylineText.runs[0].navigationEndpoint
        .canonicalBaseUrl,
      thumbnail:
        videoRenderer.channelThumbnailSupportedRenderers
          .channelThumbnailWithLinkRenderer.thumbnail.thumbnails,
    },
  }));

  return formattedResults;
};

export const getVideoSearchResults = async (query: string, options?: {}) => {
  // do a check if youtube invalidates key and generate a new one await getPublicYoutubeAppKey()
  const apiKey = "AIzaSyAO_FJ2SlqU8Q4STEHLGCilw_Y9_11qcW8";

  const url = `https://www.youtube.com/youtubei/v1/search?key=${apiKey}&prettyPrint=false`;
  const response = await axios.post(url, {
    context: {
      client: {
        // hl: "en",
        // gl: "EG",
        clientName: "WEB",
        clientVersion: "2.20220701.01.00",
      },
    },
    query: query,
    params: "EgIQAQ%3D%3D",
    ...options,
  });

  return {
    videos: formatSearchResults(
      response.data.contents.twoColumnSearchResultsRenderer.primaryContents
        .sectionListRenderer.contents[0].itemSectionRenderer.contents
    ),
  };
};
