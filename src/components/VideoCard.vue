<script setup lang="ts">
import type { YoutubeVideo } from '@/types/YoutubeVideo'
import placehoderVideo from '@/assets/json/placeholder-video.json'
import { getFormattedViewCount, getTimeSincePublished, getFormattedVideoDuration } from '@/utilities/video'

type Props = {
  video: YoutubeVideo
}

const props = withDefaults(defineProps<Props>(), {
  video: () => placehoderVideo,
})

const viewCount = getFormattedViewCount(props.video.views)
const timeSincePublished = getTimeSincePublished(new Date(props.video.date))
const videoDuration = getFormattedVideoDuration(props.video.duration);
</script>

<template>
  <a
  class="video-card"
  target="_blank">
    <div class="thumbnail">
      <img
        class="logo"
        :src="video?.thumbnail?.src"
      />
      <div class="duration">{{ videoDuration }}</div>
    </div>
    <div class="info">
      <img
        class="avatar"
        :src="video.channel.avatar"
        :alt="`${video.channel.name} avatar`"
        width="36"
        height="36"
      >
      <div class="text">
        <div class="title">{{ video.title || "Untitled" }}</div>
        <div class="channel">
          <span>{{video.channel.name }}</span>
          <svg v-if="video.channel.verified" height="24" viewBox="0 0 24 24" width="24" focusable="false"><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM9.8 17.3l-4.2-4.1L7 11.8l2.8 2.7L17 7.4l1.4 1.4-8.6 8.5z"></path></svg>
        </div>
        <div class="stats">{{ [viewCount, timeSincePublished].filter(i => !!i).join(' • ') }}</div>
      </div>
    </div>
  </a>
</template>

<style scoped lang="scss">
.video-card {
  display: flex;
  flex-flow: column nowrap;
  gap: 1.2rem;
  text-decoration: none;
}
.thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 16/9;
  border-radius: 1.2rem;
  overflow: hidden;
  
  &:hover {
    border-radius: 0;
    transition: border-radius .3s ease .2s;

    img {
      transform: scale(1.02);
      transition: transform .5s ease .2s;
    }
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: inherit;
    border: none;
  }

  .duration {
    font-size: 1.2rem;
    position: absolute;
    bottom: 0;
    right: 0;
    background: rgba(0, 0, 0, .8);
    font-weight: bold;
    padding: .3rem .4rem;
    margin: .4rem;
    border-radius: var(--radius-3);
    color: #fff;
  }
}
.info {
  display: flex;
  gap: 1.2rem;
  font-size: 1.6rem;
}
.title {
  margin-bottom: .4rem;
  font-weight: bold;
  color: var(--on-surface-3);
}
.title {
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  display: -webkit-box;
  //wrap
  word-break: break-word;
}
.channel, .stats {
  font-size: 1.4rem;
}
.channel {
  display: flex;
  align-items: center;
  gap: .4rem;
}
.channel svg {
  fill: currentColor;
  width: 1.6rem;
  height: 1.6rem;
  opacity: .75;
}
.avatar {
  border-radius: 100%;
  aspect-ratio: 1/1;
}
</style>
