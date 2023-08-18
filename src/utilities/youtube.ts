import { YoutubeAPICategory, YoutubeAPIVideo } from '@/types/YoutubeAPI';
import { YoutubeVideo } from '@/types/YoutubeVideo';
import placeholderVideo from '@/assets/json/placeholder-video.json';
import { deeplyCloneObject } from './object';

const API_KEY = 'AIzaSyBDjDLUlF9kQT4wjQVfYUEiI7uf75SCcsk'

const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos';
const CATEGORY_URL = 'https://www.googleapis.com/youtube/v3/videoCategories';

interface VideoParams {
  part: string;
  chart: string;
  maxResults: number;
  regionCode: string;
  key: string;
  videoCategoryId?: string;  // Make it optional
}

export async function getTrendingVideos(categoryId: string) {
  const params: VideoParams = {
    part: 'snippet',
    chart: 'mostPopular',
    maxResults: 10,
    regionCode: 'US',
    key: API_KEY
  }

  if (categoryId) {
    params.videoCategoryId = categoryId;
  }

  const queryString = new URLSearchParams(Object.entries(params).filter(([, value]) => value !== undefined) as any).toString();

  const response = await fetch(`${VIDEOS_URL}?${queryString}`);
  const data = await response.json();

  return data.items.length ? data.items : [] as YoutubeAPIVideo[];
}

export async function getVideoCategories(region = 'US') {
  const params = {
    part: 'snippet',
    regionCode: region,
    key: API_KEY
  }

  const queryString = new URLSearchParams(params).toString();
  const response = await fetch(`${CATEGORY_URL}?${queryString}`);
  const { items } = await response.json();

  return items as YoutubeAPICategory[]
}

export const getYoutubeVideoFromAPIResponse = (apiVideo: any) => {
  let video: YoutubeVideo = deeplyCloneObject(placeholderVideo);
  video = {
    ...video,
    thumbnail: {
      src: apiVideo.snippet?.thumbnails?.medium?.url,
    },
    title: apiVideo.snippet?.title,
    // views: apiVideo.statistics.viewCount,
    date: apiVideo.snippet?.publishedAt,
    id: apiVideo.id,
    channel: {
      ...video.channel,
      name: apiVideo.snippet?.channelTitle,
    }
  }
  return video;
}

export const getVideoUrlFromId = (id: string) => `https://www.youtube.com/watch?v=${id}`