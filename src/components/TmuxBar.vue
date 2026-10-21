<template>
  <header class="tmux">
    <div class="tin">
      <button class="sess" title="Home" @click="$emit('home')">[{{ host }}]</button>
      <div class="machine-search" role="search" aria-label="机器搜索">
        <span class="search-key" aria-hidden="true">/</span>
        <input
          ref="searchInput"
          type="search"
          :value="query"
          aria-label="搜索机器"
          aria-keyshortcuts="/"
          placeholder="搜索机器…"
          autocomplete="off"
          autocapitalize="off"
          spellcheck="false"
          @input="emit('search', $event.target.value)"
          @keydown.esc.prevent.stop="clearSearch"
        />
        <button v-if="query" class="search-clear" aria-label="清空搜索" @click="clearSearch">×</button>
      </div>

      <span v-if="total" class="stat seg">
        <span class="num clk">{{ clockText }}</span>
      </span>

      <span v-if="error" class="err">{{ error }}</span>

      <span class="right seg">
        <span v-if="allowSwitch" class="theme">
          <button
            class="tbtn"
            aria-haspopup="true"
            :aria-expanded="String(menuOpen)"
            @click.stop="toggleMenu"
          >theme:{{ palette }}</button>
          <span v-if="menuOpen" class="menu" role="menu" @click.stop>
            <button
              v-for="p in palettes"
              :key="p.id"
              role="menuitemradio"
              :aria-checked="String(palette === p.id)"
              @click="pick(p.id)"
            ><span class="sw" :style="{ background: p.sw }"></span>{{ (p.id === palette ? ' * ' : '   ') + p.id }}</button>
            <button v-if="authed" role="menuitem" @click="openSettings">   settings…</button>
          </span>
        </span>
        <a v-if="showAdmin || authed" class="adm" href="/admin#/admin">admin</a>
      </span>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { PALETTES } from '../utils/constants'
import { clockShort } from '../utils/format'

const props = defineProps({
  host: { type: String, default: 'status' },
  query: { type: String, default: '' },
  total: { type: Number, default: 0 },
  error: { type: String, default: '' },
  palette: { type: String, default: 'graphite' },
  allowSwitch: { type: Boolean, default: true },
  showAdmin: { type: Boolean, default: true },
  authed: { type: Boolean, default: false },
  now: { type: Number, default: Date.now() }
})

const emit = defineEmits(['home', 'search', 'palette', 'settings'])
const palettes = PALETTES
const menuOpen = ref(false)

const clockText = computed(() => clockShort(new Date(props.now)))

function toggleMenu() {
  menuOpen.value = !menuOpen.value
}

function pick(id) {
  menuOpen.value = false
  emit('palette', id)
}

function openSettings() {
  menuOpen.value = false
  emit('settings')
}

const close = () => { menuOpen.value = false }

const searchInput = ref(null)

function clearSearch() {
  emit('search', '')
  searchInput.value?.focus()
}

function focusSearch(event) {
  if (event.key !== '/' || event.ctrlKey || event.metaKey || event.altKey || event.isComposing) return
  const target = event.target
  if (target instanceof HTMLElement && (target.matches('input, textarea, select') || target.isContentEditable)) return
  event.preventDefault()
  searchInput.value?.focus()
  searchInput.value?.select()
}

onMounted(() => {
  window.addEventListener('click', close)
  window.addEventListener('keydown', focusSearch)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', close)
  window.removeEventListener('keydown', focusSearch)
})
</script>
