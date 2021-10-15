import { computed } from "vue";
import { useDebounceRef } from "./debounce";
import { useDB } from "./db";

function useSearch() {
    const { db } = useDB()
    const searchQuery = useDebounceRef('', 400)
    const searchResults = computed(() => {
        const q = searchQuery.value.toLowerCase()
        if (q.length < 3) return [];
        return db.threats.filter(el => `${el.bdu.code}||${el.bdu.name}||${el.bdu.description}||${el.bdu.reasons}||${el.bdu.realization}`.toLowerCase().indexOf(q) > -1)
    })

    return {
        searchQuery,
        searchResults,
    }
}

export { useSearch }
