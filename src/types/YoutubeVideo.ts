import { YoutubeChannel } from "@/types/YoutubeChannel";
import { TimeInSeconds } from "@/types/Utility";

export type VideoThumbnail = {
  src: string
}

export type YoutubeVideo = {
  thumbnail: VideoThumbnail
  title: string
  views: number
  date: string
  id: string
  duration: TimeInSeconds
  channel: YoutubeChannel
}
