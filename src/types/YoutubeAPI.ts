export type YoutubeAPICategory = {
  kind: string
  etag: string
  id: string
  snippet: {
    title: string
    assignable: boolean
    channelId: string
  }
}

export type YoutubeAPIVideo = {
  title: string;
  videoId: string;
  thumbnail: string;
}