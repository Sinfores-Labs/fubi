<script>
import { ref, computed } from "vue";
import { useDropzone } from 'vue3-dropzone';
import { saveAs } from 'file-saver';
import Markdown from 'vue3-markdown-it';
import Popper from "vue3-popper";
import { SearchIcon, MapIcon, XIcon, UploadIcon, DownloadIcon, FilterIcon, SelectorIcon, CheckIcon, ChevronDownIcon, ViewGridAddIcon, PlusSmIcon, ChartBarIcon, CollectionIcon } from '@heroicons/vue/outline'
import DefaultDB from "/src/data/bdu_v1.json";
import { useSearch } from '/src/composables/search'

import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const swatches = [
  'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
  'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900',
  'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900',
  'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
  'bg-pink-100', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700', 'bg-pink-800', 'bg-pink-900',
  'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900',
  'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900'
];

const layerTemplate = {
  id: 1,
  name: "New Layer",
  description: "",
  palette: [
    {
        range: "1-10",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "11-20",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "21-30",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "31-40",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "41-50",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "51-60",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "61-70",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "71-80",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "81-90",
        color: "bg-gray-100",
        active: false
    },
    {
        range: "91-100",
        color: "bg-gray-100",
        active: false
    }
  ]
};

const threatLayerTemplate = {
    id: 1,
    color: "bg-gray-100",
    note: "",
    score: 0
};

export default {
  components: { 
    Markdown,
    Popper,
    XIcon,
    MapIcon,
    SearchIcon,
    UploadIcon,
    DownloadIcon,
    FilterIcon,
    SelectorIcon,
    CheckIcon,
    ChevronDownIcon,
    ViewGridAddIcon,
    PlusSmIcon,
    ChartBarIcon,
    CollectionIcon,
    Popover,
    PopoverButton,
    PopoverPanel
  },

  setup () {
    const db = ref(undefined);
    const activeLayer = ref(undefined);

    const isLayerReady = computed(() => {
      return db.value && activeLayer.value
    })

    const fatt = ref({});
    const activeThreat = ref(undefined);
    const setActiveThreat = (id) => {
      if (db.value && db.value.threats) {
        activeThreat.value = db.value.threats.find(el => el.id === id)
      }
    }
    const isAdditionalFieldsVisible = ref(false)

    const clearFlyOvers = () => {
      isSearchVisible.value = false;
      isLoadVisible.value = false;
      isScoreVisible.value = false;
      isDataVisible.value = false;
      isLayerVisible.value = false;
      isAboutVisible.value = false;
    }

    const isSearchVisible = ref(false);
    const showSearchFlyOver = () => { clearFlyOvers(); isSearchVisible.value = true };
    const hideSearchFlyOver = () => { isSearchVisible.value = false };
    const toggleSearchFlyOver = () => { isSearchVisible.value ? hideSearchFlyOver() : showSearchFlyOver() };
    const { searchQuery, searchResults } = useSearch()

    const isLoadVisible = ref(false);
    const showLoadFlyOver = () => { clearFlyOvers(); isLoadVisible.value = true };
    const hideLoadFlyOver = () => { isLoadVisible.value = false };
    const toggleLoadFlyOver = () => { isLoadVisible.value ? hideLoadFlyOver() : showLoadFlyOver() };
    let sourceJSONFile = undefined;
    const loadJSON = () => {
      let reader = new FileReader();
      if (isLoadVisible.value) {
        reader.onload = event => {
          db.value = JSON.parse(event.target.result);
          activeLayer.value = db.value.layers[0];
        }
      } else {
        reader.onload = event => {
          fatt.value = JSON.parse(event.target.result);
          console.log(fatt.value);
          db.value.threats.forEach(el => {
            const layer = el.layers.find(layer => layer.id === activeLayer.value.id)
            // reset all data
            layer.score = 0
            layer.color = "bg-gray-100"
            // get score
            const applicableTechniques = el.techniques.split(',')
            for (let i = 0, len = applicableTechniques.length; i < len; i++) {
              const t = fatt.value.techniques.find(e => e.id === applicableTechniques[i])
              if (t && t.applicable) {
                layer.score += t.score
              }
            }
          })
        }
      }
      reader.onerror = error => console.log(error);
      reader.readAsText(sourceJSONFile);
    };
    const loadDefault = () => { db.value = DefaultDB; activeLayer.value = db.value.layers[0]; }
    const onDrop = (acceptFiles, rejectReasons) => { sourceJSONFile = acceptFiles[0]; loadJSON(); };
    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })
    const saveJSON = () => {
      // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
      if (db && Object.keys(db.value).length !== 0) {
        let blob = new Blob([JSON.stringify(db.value)], {type: "application/json;charset=utf-8"});
        saveAs(blob, "threats.json");
      }
    };

    const isDataVisible = ref(false);
    const showDataFlyOver = () => { clearFlyOvers(); isDataVisible.value = true };
    const hideDataFlyOver = () => { isDataVisible.value = false; };
    const toggleDataFlyOver = () => { isDataVisible.value ? hideDataFlyOver() : showDataFlyOver() };

    const isScoreVisible = ref(false);
    const showScoreFlyOver = () => { clearFlyOvers(); isScoreVisible.value = true };
    const hideScoreFlyOver = () => { isScoreVisible.value = false };
    const toggleScoreFlyOver = () => { isScoreVisible.value ? hideScoreFlyOver() : showScoreFlyOver() };
    const setActiveScoreRange = (range) => {
      activeLayer.value.palette.forEach(el => el.active = false);
      activeLayer.value.palette.find(el => el.range === range).active = true;
    }
    const setScoreRangeColor = (swatch) => {
      activeLayer.value.palette.find(el => el.active).color = swatch;
    }
    const getSwatchFromPallete = (score) => {
      if (score >= 1 && score <= 10) { return activeLayer.value.palette.find(el => el.range === "1-10").color; }
      if (score >= 11 && score <= 20) { return activeLayer.value.palette.find(el => el.range === "11-20").color; }
      if (score >= 21 && score <= 30) { return activeLayer.value.palette.find(el => el.range === "21-30").color; }
      if (score >= 31 && score <= 40) { return activeLayer.value.palette.find(el => el.range === "31-40").color; }
      if (score >= 41 && score <= 50) { return activeLayer.value.palette.find(el => el.range === "41-50").color; }
      if (score >= 51 && score <= 60) { return activeLayer.value.palette.find(el => el.range === "51-60").color; }
      if (score >= 61 && score <= 70) { return activeLayer.value.palette.find(el => el.range === "61-70").color; }
      if (score >= 71 && score <= 80) { return activeLayer.value.palette.find(el => el.range === "71-80").color; }
      if (score >= 81 && score <= 90) { return activeLayer.value.palette.find(el => el.range === "81-90").color; }
      if (score >= 91) { return activeLayer.value.palette.find(el => el.range === "91-100").color; }
      return 'bg-gray-100';
    }

    const getThreatActiveLayer = (threat) => {
      return threat.layers.find(el => el.id === activeLayer.value.id)
    }

    const setActiveLayer = (id) => {
      if (db.value.layers.findIndex(el => el.id === id) > -1) {
        activeLayer.value = db.value.layers.find(el => el.id === id);
      };
    };

    const createLayer = () => {
      const layer = JSON.parse(JSON.stringify(layerTemplate));
      let lastIndex = 0;
      db.value.layers.forEach(el => { if (el.id > lastIndex) lastIndex = el.id })
      layer.id = lastIndex + 1;
      db.value.layers.push(layer)
      db.value.threats.forEach(el => {
        const threatLayer = JSON.parse(JSON.stringify(threatLayerTemplate));
        threatLayer.id = layer.id;
        el.layers.push(threatLayer);
      });
      setActiveLayer(layer.id);
    }

    const isAboutVisible = ref(false);
    const showAboutFlyOver = () => { clearFlyOvers(); isAboutVisible.value = true };
    const hideAboutFlyOver = () => { isAboutVisible.value = false; };
    const toggleAboutFlyOver = () => { isAboutVisible.value ? hideAboutFlyOver() : showAboutFlyOver() };

    const isLayerVisible = ref(false);
    const showLayerFlyOver = () => { clearFlyOvers(); isLayerVisible.value = true };
    const hideLayerFlyOver = () => { isLayerVisible.value = false; };
    const toggleLayerFlyOver = () => { isLayerVisible.value ? hideLayerFlyOver() : showLayerFlyOver() };

    const getTargetById = (id) => {
      return db.value.targets.find(el => el.id === id)
    }

    return {
      swatches,

      db,
      activeLayer,
      isLayerReady,

      activeThreat,
      setActiveThreat,
      isAdditionalFieldsVisible,

      isSearchVisible,
      showSearchFlyOver,
      hideSearchFlyOver,
      toggleSearchFlyOver,
      searchQuery,
      searchResults,

      isLoadVisible,
      showLoadFlyOver,
      hideLoadFlyOver,
      toggleLoadFlyOver,
      loadDefault,
      saveJSON,
      getRootProps,
      getInputProps,
      ...rest,

      isDataVisible,
      showDataFlyOver,
      hideDataFlyOver,
      toggleDataFlyOver,

      isScoreVisible,
      showScoreFlyOver,
      hideScoreFlyOver,
      toggleScoreFlyOver,
      setActiveScoreRange,
      setScoreRangeColor,
      getSwatchFromPallete,

      getThreatActiveLayer,

      setActiveLayer,
      createLayer,

      isAboutVisible,
      showAboutFlyOver,
      hideAboutFlyOver,
      toggleAboutFlyOver,

      isLayerVisible,
      showLayerFlyOver,
      hideLayerFlyOver,
      toggleLayerFlyOver,

      getTargetById
    }
  }
}
</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col">

    <!-- ----------------- FLYOVERS START--------------------- -->

    <!-- About -->
    <div :class="isAboutVisible ? 'translate-y-0' : 'translate-y-full'" class="z-40 transition absolute bottom-9 left-2 w-96 h-large overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Что ты такое?</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideAboutFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4 space-y-4 text-sm">
        <p>Всем привет! ФСТЭК у нас что-то придумал, а мы постарались чтобы это выглядело хотя бы на 2015 год.</p>
      </div>
    </div>

    <!-- Layer -->
    <div v-if="isLayerReady" :class="isLayerVisible ? 'translate-y-0' : 'translate-y-full'" class="z-40 transition absolute bottom-9 right-80 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Свойства слоя</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideLayerFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4 space-y-4">
        <label class="block">
          <span class="text-gray-700">Название</span>
          <input type="text" class="
              mt-1
              block
              w-full
              rounded-md
              border-gray-300
              shadow-sm
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            " v-model="activeLayer.name">
        </label>
        <label class="block">
          <span class="text-gray-700">Описание</span>
          <textarea class="
              mt-1
              block
              w-full
              rounded-md
              border-gray-300
              shadow-sm
              resize-none
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            " rows="7" v-model="activeLayer.description"></textarea>
        </label>
      </div>
    </div>

    <!-- Search -->
    <div :class="isSearchVisible ? 'translate-y-0' : 'translate-y-full'" class="z-40 transition absolute bottom-9 right-64 w-96 h-large overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center px-4 space-x-2">
        <label class="block flex-1">
          <input type="text" class="
              mt-1
              block
              w-full
              rounded-md
              border-gray-300
              shadow-sm
              focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
            " placeholder="Поиск..." v-model="searchQuery">
        </label>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideSearchFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="pt-4 pb-32 flex-1 bg-white overflow-auto px-4 text-xs space-y-4">
        <article
          v-for="(result, index) in searchResults"
          :key="index"
          @click="setActiveThreat(result.id)"
          class="space-y-1 cursor-pointer"
        >
          <div class="font-bold">{{ result.bdu.code }} &middot; {{ result.bdu.name }}</div>
          <div>{{ result.bdu.description }}</div>
        </article>
      </div>
    </div>

    <!-- Score -->
    <div v-if="isLayerReady" :class="isScoreVisible ? 'translate-y-0' : 'translate-y-full'" class="z-40 transition absolute bottom-9 right-40 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Настройка цветов оценки</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideScoreFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4 space-y-2">
        <div class="grid grid-cols-5 gap-1 py-4">
          <div
            v-for="r in activeLayer.palette"
            :key="r.range"
            @click="setActiveScoreRange(r.range)"
            :class="[
              r.active ? 'ring-2 ring-offset-1' : '',
              r.color,
              parseInt(r.color.substr(r.color.length - 3)) > 500 ? 'text-white' : 'text-gray-900'
            ]"
            class="cursor-pointer h-6 rounded border flex items-center justify-center text-xs font-bold"
          >{{ r.range }}</div>
        </div>
        <div v-if="(Object.keys(activeLayer).length > 1) && (activeLayer.palette.findIndex(el => el.active) > -1)" class="grid grid-cols-9 gap-1 py-4 border-t">
          <div
            @click="setScoreRangeColor(swatch)"
            v-for="(swatch, index) in swatches"
            :key="index"
            class="rounded cursor-pointer h-5"
            :class="[
              swatch,
              swatch === activeLayer.palette.find(el => el.active).color ? 'ring-2 ring-offset-1' : ''
            ]"
          ></div>
        </div>
      </div>
    </div>

    <!-- Data -->
    <div v-if="isLayerReady" :class="isDataVisible ? 'translate-y-0' : 'translate-y-full'" class="z-40 transition absolute bottom-9 right-16 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Загрузить данные</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideDataFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4">
        <p class="text-sm text-gray-500">
          Выберите json-файл из FATT Navigator
        </p>
        <div class="h-32 bg-gray-100 border rounded-lg my-4 flex items-center justify-center text-xs">
          <div v-bind="getRootProps()">
            <input v-bind="getInputProps()" >
            <p v-if="isDragActive">Перетащите файл сюда...</p>
            <p v-else class="cursor-pointer">Перетащите файл сюда или кликните для выбора</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Load -->
    <div :class="isLoadVisible ? 'translate-y-0' : 'translate-y-full'" class="z-40 transition absolute bottom-9 right-2 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Загрузка модели</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideLoadFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4">
        <p class="text-sm text-gray-500">
          Выберите json-файл для загрузки модели
        </p>
        <div class="h-32 bg-gray-100 border rounded-lg my-4 flex items-center justify-center text-xs">
          <div v-bind="getRootProps()">
            <input v-bind="getInputProps()" >
            <p v-if="isDragActive">Перетащите файл сюда...</p>
            <p v-else class="cursor-pointer">Перетащите файл сюда или кликните для выбора</p>
          </div>
        </div>
        <div class="text-sm text-gray-500 flex justify-center">
          <span class="underline text-purple-600 hover:text-purple-900 cursor-pointer" @click="loadDefault()">Загрузить стандартную модель</span>
        </div>
      </div>
    </div>

    <!-- ----------------- FLYOVERS END --------------------- -->

    <div class="flex-1 flex overflow-hidden">
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Layers -->
        <div v-if="isLayerReady" class="h-12 bg-gray-50 flex items-center overflow-x-auto px-5 space-x-2">
          <div
            v-for="layer in db.layers"
            :key="layer.id"
            @click="setActiveLayer(layer.id)"
            :class="[layer.id === activeLayer.id ? 'ring-2 ring-offset-1 bg-gray-200 ring-gray-300 text-black' : 'bg-gray-50 text-gray-500']"
            class="font-bold h-8 px-4 flex-nowrap flex items-center justify-center cursor-pointer border rounded-lg"
          >
            <div class="text-xs truncate">{{ layer.name }}</div>
          </div>
          <div @click="createLayer()" class="h-8 w-8 rounded-full hover:bg-gray-200 flex-nowrap flex items-center justify-center cursor-pointer space-x-1">
            <PlusSmIcon class="w-5 h-5 text-gray-500" />
          </div>
        </div>
        <!-- Grid -->
        <div class="flex-1 overflow-auto p-4 space-y-4">
          <div v-if="isLayerReady" class="flex-1 grid grid-cols-10 gap-1">
            <Popper
              hover
              arrow
              placement="right"
              v-for="threat in db.threats"
              :key="threat.id"
            >
              <div
                @click="setActiveThreat(threat.id)"
                :class="[
                  threat.applicable ? 'opacity-100' : 'opacity-10',
                  parseInt(getThreatActiveLayer(threat).color.substr(getThreatActiveLayer(threat).color.length - 3)) > 500 ? 'text-white': 'text-gray-900',
                  (activeThreat && (threat.id === activeThreat.id)) ? 'ring-2 ring-offset-1' : '',
                  (getThreatActiveLayer(threat).color === 'bg-gray-100') && (getThreatActiveLayer(threat).score > 0) ? getSwatchFromPallete(parseInt(getThreatActiveLayer(threat).score)) : getThreatActiveLayer(threat).color
                ]"
                class="cursor-pointer hover:shadow rounded h-8 flex items-center justify-center text-xs font-semibold"
              >{{ threat.code }}</div>
              <template #content>
                <div class="space-y-2">
                  <div class="font-bold">{{ threat.bdu.name }}</div>
                  <div>Оценка: {{ getThreatActiveLayer(threat).score }}</div>
                  <div v-if="getThreatActiveLayer(threat).note">{{ getThreatActiveLayer(threat).note }}</div>
                </div>
              </template>
            </Popper>
          </div>
        </div>
      </div>
      <!-- Details -->
      <div class="w-96 bg-gray-50 overflow-y-auto shadow-lg border-l rounded-tl-lg p-4">
        <div v-if="activeThreat" class="p-4 space-y-4">
          <div class="space-y-2">
            <div class="text-xs font-bold text-gray-500">{{ activeThreat.bdu.code }}</div>
            <div class="font-bold">{{ activeThreat.bdu.name }}</div>
          </div>

          <hr />
          
          <div class="flex items-center space-x-2">
            <!-- Color picker -->
            <div class="flex-1">
              <Popover v-slot="{ open }" class="relative">
                <PopoverButton
                  :class="open ? '' : 'text-opacity-90'"
                  class="w-full inline-flex items-center justify-between shadow px-3 py-3 text-base font-medium text-gray-900 bg-white rounded-md group hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
                >
                  <div class="flex items-center space-x-2">
                    <div class="text-sm">Цвет</div>
                    <div class="w-16 h-5 rounded border" :class="getThreatActiveLayer(activeThreat).color"></div>
                  </div>
                  <ChevronDownIcon
                    :class="open ? '' : 'text-opacity-70'"
                    class="w-4 h-4 ml-2 text-gray-500 transition duration-150 ease-in-out group-hover:text-opacity-80"
                    aria-hidden="true"
                  />
                </PopoverButton>

                <transition
                  enter-active-class="transition duration-200 ease-out"
                  enter-from-class="translate-y-1 opacity-0"
                  enter-to-class="translate-y-0 opacity-100"
                  leave-active-class="transition duration-150 ease-in"
                  leave-from-class="translate-y-0 opacity-100"
                  leave-to-class="translate-y-1 opacity-0"
                >
                  <PopoverPanel class="absolute z-10 w-80 mt-1 transform -translate-x-1/2 left-40 sm:px-0 lg:max-w-3xl">
                    <div class="bg-white overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5">
                      <div class="grid grid-cols-9 gap-1 p-4">
                        <div @click="getThreatActiveLayer(activeThreat).color = swatch" v-for="(swatch, index) in swatches" :key="index" class="rounded cursor-pointer" :class="[getThreatActiveLayer(activeThreat).color === swatch ? 'ring-2 ring-offset-1 ring-black ring-opacity-30' : '', swatch, 'h-6']"></div>
                      </div>
                    </div>
                  </PopoverPanel>
                </transition>
              </Popover>
            </div>
            <!-- Score -->
            <label class="block w-24">
              <input type="text" class="
                  block
                  w-full
                  rounded-md
                  border-gray-300
                  shadow-sm
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                " placeholder="Score" v-model="getThreatActiveLayer(activeThreat).score">
            </label>
          </div>

          <div @click="isAdditionalFieldsVisible = !isAdditionalFieldsVisible" class="bg-gray-100 h-5 rounded cursor-pointer hover:bg-gray-200 flex justify-center items-center">
            <ChevronDownIcon :class="isAdditionalFieldsVisible ? 'rotate-180' : ''" class="h-4 w-4 text-gray-600"></ChevronDownIcon>
          </div>

          <div v-if="isAdditionalFieldsVisible" class="space-y-2">
            <!-- Applicability -->
            <div>
              <label class="inline-flex items-center mt-4">
                <input type="checkbox" class="
                    rounded
                    border-gray-300
                    text-indigo-600
                    shadow-sm
                    focus:border-indigo-300
                    focus:ring
                    focus:ring-offset-0
                    focus:ring-indigo-200
                    focus:ring-opacity-50
                  " v-model="activeThreat.applicable">
                <span class="ml-2 text-sm">Применимо</span>
              </label>
            </div>

            <!-- Comments -->
            <div>
              <label class="block">
                <span class="text-gray-700 text-xs">Комментарий</span>
                <textarea class="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  " rows="3" v-model="getThreatActiveLayer(activeThreat).note"></textarea>
              </label>
            </div>

            <!-- Techniques -->
            <div>
              <label class="block">
                <span class="text-gray-700 text-xs">Применимые техники</span>
                <textarea class="
                    mt-1
                    block
                    w-full
                    rounded-md
                    border-gray-300
                    shadow-sm
                    focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50
                  " rows="3" v-model="activeThreat.techniques"></textarea>
              </label>
            </div>
          </div>

          <hr />

          <section v-if="activeThreat.bdu.description" class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Описание</header>
            <div>
              <Markdown :source="activeThreat.bdu.description" />
            </div>
          </section>
          <section v-if="activeThreat.bdu.reasons" class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Причины</header>
            <div>
              <Markdown :source="activeThreat.bdu.reasons" />
            </div>
          </section>
          <section v-if="activeThreat.bdu.realization" class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Реализация</header>
            <div>
              <Markdown :source="activeThreat.bdu.realization" />
            </div>
          </section>
          <section v-if="activeThreat.bdu.intruders.length > 0" class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Нарушители (БДУ)</header>
            <div v-for="i in activeThreat.bdu.intruders" :key="i.id" class="flex space-x-1">
              <div>
                <span v-if="i.intruder === 'E'">Внешний</span>
                <span v-if="i.intruder === 'I'">Внутренний</span>
              </div>
              <div>
                <span v-if="i.potential === 1">(низкий потенциал)</span>
                <span v-if="i.potential === 2">(средний потенциал)</span>
                <span v-if="i.potential === 3">(высокий потенциал)</span>
              </div>
            </div>
          </section>
          <section v-if="activeThreat.bdu.targets.length > 0" class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Объкеты воздействия</header>
            <ul>
              <li
                v-for="targetId in activeThreat.bdu.targets"
                :key="targetId"
              >{{ getTargetById(targetId).name }}</li>
            </ul>
          </section>
          <section class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Последствия (БДУ)</header>
            <ul>
              <li v-if="activeThreat.bdu.confidentiality">Конфиденциальность</li>
              <li v-if="activeThreat.bdu.integrity">Целостность</li>
              <li v-if="activeThreat.bdu.availability">Доступность</li>
            </ul>
          </section>
          <section class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Последствия (ФСТЭК 2021)</header>
            <ul>
              <li v-if="activeThreat.non_repudiation">Неотказуемость</li>
              <li v-if="activeThreat.accountability">Подотчетность</li>
              <li v-if="activeThreat.authenticity">Аутентичность</li>
              <li v-if="activeThreat.credibility">Достоверность</li>
              <li v-if="activeThreat.failure">Нарушение (прекращение) функционирования</li>
            </ul>
          </section>
          <section class="text-xs space-y-2">
            <header class="uppercase font-bold text-gray-500">Типы последствий (ФСТЭК 2021)</header>
            <ul>
              <li v-if="activeThreat.impact_variant_leakage">Утечка (перехват) конфиденциальной инофрмации или отдельных данных (нарушение конфиденциальности)</li>
              <li v-if="activeThreat.impact_variant_access">Несанкционированный доступ к компонентам, защищаемой информации, системным, конфигурационным, иным служебным данным</li>
              <li v-if="activeThreat.impact_variant_dos">Отказ в обслуживании компоненов (нарушение доступности)</li>
              <li v-if="activeThreat.impact_variant_modification">Несанкционированная модификация, подмена, искажение заащищаемой информации, системных, конфигурационных, иных служебных данных (нарушение целостности)</li>
              <li v-if="activeThreat.impact_variant_farming">Несанкционированное использование вычислительных ресурсов систем и сетей в интересах решения несвойственных им задач</li>
              <li v-if="activeThreat.impact_variant_failure">Нарушение функционирования (работоспособности) программно-аппаратных средств обработки, передачи и хранения информации</li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <!-- --------------------------------------------------------------------- -->
    <!-- Footer -->
    <div class="z-50 h-10 bg-gray-50 border-t flex items-center justify-between px-4 text-xs">
      <div @click="toggleAboutFlyOver()" class="cursor-pointer"><span class="font-bold">FUBI</span> &middot; Sinfores SX</div>
      <div class="flex items-center space-x-2 border-b-2 border-transparent">
        <!-- Layer -->
        <div v-if="isLayerReady" @click="toggleLayerFlyOver()" :class="[isLayerVisible ? 'border-purple-500' : 'border-transparent']" class="border-t-2 h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <CollectionIcon class="w-5 h-5" aria-hidden="true" />
          <div>Слой</div>
        </div>
        <!-- Search -->
        <div v-if="isLayerReady" @click="toggleSearchFlyOver()" :class="[isSearchVisible ? 'border-purple-500' : 'border-transparent']" class="border-t-2 h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <SearchIcon class="w-5 h-5" aria-hidden="true" />
          <div>Поиск</div>
        </div>
        <!-- Filters -->
        <!-- <div class="border-t-2 h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <FilterIcon class="w-5 h-5" aria-hidden="true" />
          <div>Filter</div>
        </div> -->
        <!-- Score -->
        <div v-if="isLayerReady" @click="toggleScoreFlyOver()" :class="[isScoreVisible ? 'border-purple-500' : 'border-transparent']" class="border-t-2 h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <ChartBarIcon class="w-5 h-5" aria-hidden="true" />
          <div>Оценка</div>
        </div>
        <!-- Data -->
        <div v-if="isLayerReady" @click="toggleDataFlyOver()" :class="[isDataVisible ? 'border-purple-500' : 'border-transparent']" class="border-t-2 h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <ViewGridAddIcon class="w-5 h-5" aria-hidden="true" />
          <div>Данные</div>
        </div>
        <!-- Load -->
        <div @click="toggleLoadFlyOver()" :class="[isLoadVisible ? 'border-purple-500' : 'border-transparent']" class="border-t-2 h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <UploadIcon class="w-5 h-5" aria-hidden="true" />
          <div>Загрузить</div>
        </div>
        <!-- Save -->
        <div v-if="isLayerReady" @click="saveJSON()" class="border-t-2 border-transparent h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <DownloadIcon class="w-5 h-5" aria-hidden="true" />
          <div>Сохранить</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.popper) {
  @apply bg-gray-800;
  @apply text-gray-100;
  @apply shadow;
  @apply rounded;
  @apply text-xs;
  @apply p-3;
  @apply max-w-sm;
}
:deep(.popper #arrow::before) {
  @apply bg-gray-800;
}
:deep(.popper:hover),
:deep(.popper:hover > #arrow::before) {
  @apply bg-gray-800;
}
</style>