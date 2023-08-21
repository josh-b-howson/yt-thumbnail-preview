<script setup lang="ts">
import { ComputedRef, Ref, computed, onBeforeMount, onMounted, ref, watch } from 'vue';
import FileInput from '@/components/FileInput.vue'
import TextInput from '@/components/TextInput.vue'
import Chip from '@/components/Chip.vue';
import VideoCard from '@/components/VideoCard.vue'
import Modal from '@/components/Modal.vue'
import placeholderVideo from '@/assets/json/placeholder-video.json'
import { YoutubeVideo } from '@/types/YoutubeVideo';
import { getVideoCategories, getTrendingVideos, getYoutubeVideoFromAPIResponse } from '@/utilities/youtube';
import { YoutubeAPICategory } from '@/types/YoutubeAPI';
import Button from '@/components/Button.vue';
import Logo from '@/assets/svg/Logo.vue'

const videoCategories = ref();
const selectedCategory: Ref<YoutubeAPICategory | null> = ref(null);
const selectedCategoryTrendingVideosFromAPI: Ref<any[]> = ref([])
const selectedCategoryTrendingVideos: ComputedRef<YoutubeVideo[]> = computed(() =>
  selectedCategoryTrendingVideosFromAPI.value.map((apiVideo: any) => getYoutubeVideoFromAPIResponse(apiVideo))
)
const videoTitle = ref('')
const videoThumbnail = ref('')
const uploadModalIsOpen = ref(false)
const userDidCreateVideo = ref(false);

const validVideo = computed(() => videoThumbnail.value && videoTitle.value)
const videoToPreview: ComputedRef<YoutubeVideo> = computed(() => {
  const video = {...placeholderVideo}
  if (videoThumbnail.value)
    video.thumbnail = { src: videoThumbnail.value }
  if (videoTitle.value)
    video.title = videoTitle.value
  return video
})
const videos = computed(() => {
  const allVideos: (YoutubeVideo | undefined)[] = Array(2).fill(undefined)
  allVideos.push(videoToPreview.value)

  const trendingVideos = selectedCategoryTrendingVideos.value
  trendingVideos.forEach((video, index) => {
    if (allVideos[index] === undefined) {
      allVideos[index] = video
    }
  })
  return allVideos
})

const onFileChange = (e: InputEvent) => {
  const target = e.target as HTMLInputElement
  const file: File = (target.files as FileList)[0]
  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onload = () => {
    reader.result
    videoThumbnail.value = String(reader.result)
  }
}

const handleTitleInput = (e: Event) => {
  const target = e.target as HTMLInputElement
  videoTitle.value = target.value
}

const handleCategoryChipClick = (category: YoutubeAPICategory) => {
  selectedCategory.value = category
  document.getElementById(`catChip-${category.id}`)?.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' })
}

onBeforeMount(async () => {
  selectedCategory.value = null
  selectedCategoryTrendingVideosFromAPI.value = await getTrendingVideos('')
})

onMounted(async () => {
  let youtubeCategories = await getVideoCategories()
  youtubeCategories = youtubeCategories.filter(category => category.snippet.assignable)
  videoCategories.value = youtubeCategories

  if (!userDidCreateVideo.value) {
    document.documentElement.style.overflow = 'hidden'
    window.scrollTo(0, 0)
  }
})

watch(() => userDidCreateVideo.value, (userDidCreateVideo) => {
  if (userDidCreateVideo) document.body.style.overflow = 'auto'
})

watch(selectedCategory, async () => {
  const categoryId = selectedCategory?.value?.id ?? ''
  selectedCategoryTrendingVideosFromAPI.value = await getTrendingVideos(categoryId)
})
</script>

<template>
  <section :class="['hero', userDidCreateVideo && 'hidden']">
    <Logo />
    <h1>YouTube thumbnail preview tool</h1>
    <p>Compare your thumbnail next to real videos in seconds.</p>
    <Button @click="uploadModalIsOpen = true">Get started</Button>
  </section>
  <section class="category-section">
    <h4>Video categories</h4>
    <div class="categories">
      <Chip
        :active="selectedCategory?.id === category.id"
        :id="`catChip-${category.id}`"
        v-for="(category, index) in videoCategories"
        :key="index"
        @click="() => handleCategoryChipClick(category)">
        {{ category?.snippet?.title }}
      </Chip>
    </div>
  </section>

  <h4>Videos</h4>
  <section :class="['preview-grid', !userDidCreateVideo && 'locked']">
    <VideoCard
      v-for="(video, index) in videos"
      :key="index"
      :video="video"
    />
  </section>

  <section
    class="edit-button-wrapper elevation-1 elevation-2"
    v-if="validVideo"
  >
    <Button
      class="edit-button"
      @click="uploadModalIsOpen = true"
    >
      Edit video
    </Button>
  </section>

  <Modal
    :is-open="uploadModalIsOpen"
    @close="uploadModalIsOpen = false"
    :bg-dismiss="false"
    title="Let's set up your video"
  >
    <p>Once complete you can preview your thumbnail next to real YouTube videos.</p>

    <section class="upload-section">
      <div class="title-chooser">
        <label for="videoTitle">Enter your video title</label>
        <TextInput
          id="videoTitle"
          class="title-input"
          placeholder="Title"
          v-model="videoTitle"
          @input="handleTitleInput"
        />
      </div>

      <div class="file-upload">
        <div :style="{fontSize: '1.4rem', fontWeight: '500'}">Add your thumbnail:</div>
        <FileInput
          type="file"
          accept="image/*"
          @change="onFileChange"
          label="Upload"
        />
      </div>

      <section class="upload-preview">
        <VideoCard :style="{maxWidth: '24rem'}" :video="videoToPreview" />
      </section>
    </section>

    <template #footer>
      <small v-if="!validVideo">Add a thumbnail & title before proceeding.</small>
      <Button
        @click="() => {uploadModalIsOpen = false; userDidCreateVideo = true;}"
        :disabled="!validVideo"
      >
        Preview
      </Button>
    </template>
  </Modal>
</template>

<style scoped lang="scss">
.hero {
  --x-tra: calc(var(--gutter-x) + 2vw);
  --height: calc(20em);
  position: relative;
  justify-self: center;
  grid-column: 1 / -1;
  width: calc(100% - var(--gutter-x) * 2);
  max-width: calc(var(--max-content-width) + var(--x-tra) * 2);
  background: linear-gradient(to bottom right, #ff0000, hsl(2, 64%, 40%));
  color: #fff;
  padding: 0 var(--x-tra);
  height: var(--height);
  display: flex;
  align-items: start;
  justify-content: center;
  flex-flow: column nowrap;
  border-radius: var(--radius-6);
  margin-top: var(--gutter-x);
  overflow: hidden;
  font-size: calc(1rem + .5vw);
  gap: 1em;

  @media (max-width: 768px) {
    --height: calc(70dvh);
    font-size: 2rem;
  }

  *:not(svg) {
    z-index: 1;
  }

  h1 {
    font-size: 2.4em
  }

  p {
    font-size: 1.2em;
    margin: 0;
  }

  &.hidden {
    transition: height .75s ease-in .5s;
    height: 0px;
  }

  button {
    margin-top: 1em;
    font-size: larger;
  }

  svg {
    position: absolute;
    bottom: 0;
    right: 0;
    width: calc(10rem + 30%);
    height: auto;
    transform: translate(25%, 0) rotate(-15deg);
    transform-origin: bottom right;
    opacity: .075;
  }
}

.preview-grid {
  position:relative;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(30rem, 1fr));
  gap: 1.6rem;

  &.locked::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    --from: hsla(0, 0%, 100%, .5);
    background: linear-gradient(to bottom, var(--from) 0%, var(--bg-surface-1) 40%);
    @media (prefers-color-scheme: dark) {
      --from: hsla(0, 0%, 0%, .5);
    }
  }
}

.category-section {
  margin-top: 4rem;
  width: 100%;
  display: flex;
  flex-flow: column nowrap;
  overflow: hidden;
}
.categories {
  align-self: stretch;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  overflow: auto;
  scrollbar-width: thin;
  padding-bottom: 2rem;
  min-height: 5.1rem;

  button {
    flex: 0 0 auto;
  }
}
.upload {
  display: flex;
  flex-flow: column nowrap;
  align-items: start;
  gap: 2rem;
}
.upload-section {
  display: flex;
  flex-flow: column nowrap;
  align-items: start;
  margin-top: 1rem;
  gap: 2rem;
  padding-bottom: 2rem;
}
.file-upload {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 2rem;
  font-size: 1.6rem;
  color: var(--on-surface-1);
}

.title-chooser {
  display: flex;
  flex-flow: column nowrap;
  width: 100%;
  gap: .4rem;

  .title-input {
    width: 100%;
  }

  label {
    color: var(--on-surface-1);
    font-size: 1.4rem;
    font-weight: 500;
  }
}

.upload-preview {
  margin-top: 2rem;
}

.edit-button-wrapper {
  position: fixed;
  bottom: var(--gutter-x);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  padding: 2rem;
  border-radius: var(--radius-5);
}
</style>
