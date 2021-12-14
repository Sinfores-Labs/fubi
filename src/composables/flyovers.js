import { ref, readonly } from "vue";

function useFlyovers() {
    const about = ref(false)
    const table = ref(false)
    const filters = ref(false)
    const layer = ref(false)
    const search = ref(false)
    const score = ref(false)
    const data = ref(false)
    const load = ref(false)

    const flyovers = [about, table, filters, layer, search, score, data, load]
    
    const clear = () => { flyovers.forEach(fo => fo.value = false) }

    const showFlyover = (flyover) => {
        clear();
        switch (flyover) {
            case 'about': about.value = true; break;
            case 'table': table.value = true; break;
            case 'filters': filters.value = true; break;
            case 'layer': layer.value = true; break;
            case 'search': search.value = true; break;
            case 'score': score.value = true; break;
            case 'data': data.value = true; break;
            case 'load': load.value = true; break;
        }
    }
    
    const hideFlyover = (flyover) => {
        switch (flyover) {
            case 'about': about.value = false; break;
            case 'table': table.value = false; break;
            case 'filters': filters.value = false; break;
            case 'layer': layer.value = false; break;
            case 'search': search.value = false; break;
            case 'score': score.value = false; break;
            case 'data': data.value = false; break;
            case 'load': load.value = false; break;
        }
    }
    
    const toggleFlyover = (flyover) => {
        switch (flyover) {
            case 'about': about.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'table': table.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'filters': filters.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'layer': layer.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'search': search.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'score': score.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'data': data.value ? hideFlyover(flyover) : showFlyover(flyover); break;
            case 'load': load.value ? hideFlyover(flyover) : showFlyover(flyover); break;
        }
    }
    

    return {
        showFlyover,
        hideFlyover,
        toggleFlyover,
        about: readonly(about),
        table: readonly(table),
        filters: readonly(filters),
        layer: readonly(layer),
        search: readonly(search),
        score: readonly(score),
        data: readonly(data),
        load: readonly(load),
    }
}

export { useFlyovers }
