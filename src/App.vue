<script>
import { ref } from "vue";
import { useDropzone } from 'vue3-dropzone';
import { saveAs } from 'file-saver';
import Markdown from 'vue3-markdown-it';
import { SearchIcon, MapIcon, XIcon, UploadIcon, DownloadIcon, FilterIcon, SelectorIcon, CheckIcon, ChevronDownIcon } from '@heroicons/vue/outline'
import DefaultDB from "/src/data/threats_v1.json";
import { useSearch } from '/src/composables/search'

import { Listbox, ListboxButton, ListboxOptions, ListboxOption } from '@headlessui/vue'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/vue'

const colors = [
  {
    label: "White",
    value: "bg-white"
  },
  {
    label: "Light Gray",
    value: "bg-gray-100"
  },
  {
    label: "Heavy Gray",
    value: "bg-gray-300"
  },
  {
    label: "Light Green",
    value: "bg-green-100"
  },
  {
    label: "Heavy Green",
    value: "bg-green-300"
  },
  {
    label: "Light yellow",
    value: "bg-yellow-200"
  },
  {
    label: "Heavy yellow",
    value: "bg-yellow-500"
  },
  {
    label: "Lightest Red",
    value: "bg-red-200"
  },
  {
    label: "Light Red",
    value: "bg-red-400"
  },
  {
    label: " Red",
    value: "bg-red-500"
  },
  {
    label: "Dark Red",
    value: "bg-red-700"
  }
]

const swatches = [
  'bg-gray-100', 'bg-gray-200', 'bg-gray-300', 'bg-gray-400', 'bg-gray-500', 'bg-gray-600', 'bg-gray-700', 'bg-gray-800', 'bg-gray-900',
  'bg-yellow-100', 'bg-yellow-200', 'bg-yellow-300', 'bg-yellow-400', 'bg-yellow-500', 'bg-yellow-600', 'bg-yellow-700', 'bg-yellow-800', 'bg-yellow-900',
  'bg-green-100', 'bg-green-200', 'bg-green-300', 'bg-green-400', 'bg-green-500', 'bg-green-600', 'bg-green-700', 'bg-green-800', 'bg-green-900',
  'bg-blue-100', 'bg-blue-200', 'bg-blue-300', 'bg-blue-400', 'bg-blue-500', 'bg-blue-600', 'bg-blue-700', 'bg-blue-800', 'bg-blue-900',
  'bg-pink-100', 'bg-pink-200', 'bg-pink-300', 'bg-pink-400', 'bg-pink-500', 'bg-pink-600', 'bg-pink-700', 'bg-pink-800', 'bg-pink-900',
  'bg-red-100', 'bg-red-200', 'bg-red-300', 'bg-red-400', 'bg-red-500', 'bg-red-600', 'bg-red-700', 'bg-red-800', 'bg-red-900',
  'bg-purple-100', 'bg-purple-200', 'bg-purple-300', 'bg-purple-400', 'bg-purple-500', 'bg-purple-600', 'bg-purple-700', 'bg-purple-800', 'bg-purple-900'
]

export default {
  components: { 
    Markdown,
    XIcon,
    MapIcon,
    SearchIcon,
    UploadIcon,
    DownloadIcon,
    FilterIcon,
    SelectorIcon,
    CheckIcon,
    ChevronDownIcon,
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
    Popover,
    PopoverButton,
    PopoverPanel
  },

  setup () {
    const db = ref({})
    const fatt = ref({})
    const activeThreat = ref(undefined)
    const setActiveThreat = (id) => {
      if (db.value && db.value.threats) {
        activeThreat.value = db.value.threats.find(el => el.id === id)
      }
    }

    const clearFlyOvers = () => {
      isSearchVisible.value = false
      isLoadVisible.value = false
      isFattVisible.value = false
    }

    const isSearchVisible = ref(false);
    const isSearchFull = ref(false);
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
        reader.onload = event => db.value = JSON.parse(event.target.result);
      } else {
        reader.onload = event => fatt.value = JSON.parse(event.target.result);
      }
      reader.onerror = error => console.log(error);
      reader.readAsText(sourceJSONFile);
    };
    const loadDefault = () => { db.value = DefaultDB }
    const onDrop = (acceptFiles, rejectReasons) => { sourceJSONFile = acceptFiles[0]; loadJSON(); };
    const { getRootProps, getInputProps, ...rest } = useDropzone({ onDrop })
    const saveJSON = () => {
      // https://stackoverflow.com/questions/679915/how-do-i-test-for-an-empty-javascript-object
      if (db && Object.keys(db.value).length !== 0) {
        let blob = new Blob([JSON.stringify(db.value)], {type: "application/json;charset=utf-8"});
        saveAs(blob, "threats.json");
      }
    };

    const isFattVisible = ref(false);
    const showFattFlyOver = () => { clearFlyOvers(); isFattVisible.value = true };
    const hideFattFlyOver = () => { isFattVisible.value = false };
    const toggleFattFlyOver = () => { isFattVisible.value ? hideFattFlyOver() : showFattFlyOver() };

    return {
      colors,
      swatches,

      db,
      activeThreat,
      setActiveThreat,

      isSearchVisible,
      isSearchFull,
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

      isFattVisible,
      showFattFlyOver,
      hideFattFlyOver,
      toggleFattFlyOver,
    }
  }
}
</script>

<template>
  <div class="h-screen w-screen overflow-hidden flex flex-col">

    <!-- ----------------- FLYOVERS START--------------------- -->

    <!-- Search -->
    <div v-if="isSearchVisible" :class="isSearchVisible ? 'translate-y-0' : 'translate-y-full'" class="transition absolute bottom-9 right-64 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
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
            " placeholder="Search..." v-model="searchQuery">
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

    <!-- Load -->
    <div v-if="isFattVisible" :class="isFattVisible ? 'translate-y-0' : 'translate-y-full'" class="transition absolute bottom-9 right-16 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Load FATT</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideLoadFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4">
        <p class="text-sm text-gray-500">
          Choose json-file from FATT Navigator
        </p>
        <div class="h-32 bg-gray-100 border rounded-lg my-4 flex items-center justify-center text-xs">
          <div v-bind="getRootProps()">
            <input v-bind="getInputProps()" >
            <p v-if="isDragActive">Drop the files here ...</p>
            <p v-else class="cursor-pointer">Drag 'n' drop some files here, or click to select files</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Load -->
    <div v-if="isLoadVisible" :class="isLoadVisible ? 'translate-y-0' : 'translate-y-full'" class="transition absolute bottom-9 right-2 w-96 h-96 overflow-hidden flex flex-col rounded-t border shadow-xl">
      <div class="h-16 bg-white flex items-center justify-between px-4 space-x-2">
        <div class="flex-1 font-bold">Load threats</div>
        <div>
          <div class="hover:bg-gray-100 cursor-pointer rounded-full h-6 w-6 flex items-center justify-center" @click="hideLoadFlyOver()">
            <XIcon class="h-4 w-4 text-gray-400"/>
          </div>
        </div>
      </div>
      <div class="flex-1 bg-white overflow-auto px-4">
        <p class="text-sm text-gray-500">
          Choose json-file to load your data to application or <span class="underline text-purple-600 hover:text-purple-900 cursor-pointer" @click="loadDefault()">load default base</span>.
        </p>
        <div class="h-32 bg-gray-100 border rounded-lg my-4 flex items-center justify-center text-xs">
          <div v-bind="getRootProps()">
            <input v-bind="getInputProps()" >
            <p v-if="isDragActive">Drop the files here ...</p>
            <p v-else class="cursor-pointer">Drag 'n' drop some files here, or click to select files</p>
          </div>
        </div>
      </div>
    </div>

    <!-- ----------------- FLYOVERS END --------------------- -->

    <div class="flex-1 flex overflow-hidden">
      <!-- Grid -->
      <div class="flex-1 overflow-auto p-8 space-y-4">
        <div v-if="db !== undefined" class="flex-1 grid grid-cols-10 gap-1">
            <div
              v-for="threat in db.threats"
              :key="threat.id"
              @click="setActiveThreat(threat.id)"
              :class="[parseInt(threat.color.substr(threat.color.length - 3)) > 500 ? 'text-white': 'text-gray-900', (activeThreat && (threat.id === activeThreat.id)) ? 'ring-2 ring-offset-1' : '', threat.color]"
              class="cursor-pointer hover:shadow rounded h-8 flex items-center justify-center text-xs font-semibold"
            >{{ threat.code }}</div>
          </div>
      </div>
      <!-- Details -->
      <div class="w-96 bg-gray-100 overflow-y-auto shadow-lg border-l rounded-tl-lg p-4">
        <div v-if="activeThreat" class="p-4 space-y-4">
          <div class="space-y-2">
            <div class="text-xs font-bold text-gray-500">{{ activeThreat.bdu.code }}</div>
            <div class="font-bold">{{ activeThreat.bdu.name }}</div>
          </div>
          
          <!-- Color picker -->
          <div>
            <Popover v-slot="{ open }" class="relative">
              <PopoverButton
                :class="open ? '' : 'text-opacity-90'"
                class="w-full inline-flex items-center justify-between shadow px-3 py-2 text-base font-medium text-gray-900 bg-white rounded-md group hover:text-opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
              >
                <div class="flex items-center space-x-2">
                  <div class="text-sm">Color</div>
                  <div class="w-16 h-5 rounded border" :class="activeThreat.color"></div>
                </div>
                <ChevronDownIcon
                  :class="open ? '' : 'text-opacity-70'"
                  class="w-4 h-4 ml-2 text-orange-300 transition duration-150 ease-in-out group-hover:text-opacity-80"
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
                <PopoverPanel class="absolute z-10 w-80 mt-1 transform -translate-x-1/2 left-1/2 sm:px-0 lg:max-w-3xl">
                  <div class="bg-white overflow-hidden rounded shadow-lg ring-1 ring-black ring-opacity-5">
                    <div class="grid grid-cols-9 gap-1 p-4">
                      <div @click="activeThreat.color = swatch" v-for="(swatch, index) in swatches" :key="index" class="rounded cursor-pointer" :class="[activeThreat.color === swatch ? 'ring-2 ring-offset-1 ring-black ring-opacity-30' : '', swatch, 'h-6']"></div>
                    </div>
                  </div>
                </PopoverPanel>
              </transition>
            </Popover>
          </div>

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
        </div>
      </div>
    </div>

    <!-- --------------------------------------------------------------------- -->
    <!-- Footer -->
    <div class="z-10 h-10 bg-gray-50 border-t flex items-center justify-between px-4 text-xs">
      <div><span class="font-bold">FUBI</span> &middot; Sinfores SXI</div>
      <div class="flex items-center space-x-2">
        <div @click="toggleSearchFlyOver()" class="h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <SearchIcon class="w-5 h-5" aria-hidden="true" />
          <div>Search</div>
        </div>
        <div class="h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <FilterIcon class="w-5 h-5" aria-hidden="true" />
          <div>Filter</div>
        </div>
        <div @click="toggleFattFlyOver()" class="h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <MapIcon class="w-5 h-5" aria-hidden="true" />
          <div>FATT</div>
        </div>
        <div @click="toggleLoadFlyOver()" class="h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <UploadIcon class="w-5 h-5" aria-hidden="true" />
          <div>Load</div>
        </div>
        <div @click="saveJSON()" class="h-10 px-4 hover:bg-gray-200 cursor-pointer font-semibold flex items-center space-x-2" type="button">
          <DownloadIcon class="w-5 h-5" aria-hidden="true" />
          <div>Save</div>
        </div>
      </div>
    </div>
  </div>
</template>
