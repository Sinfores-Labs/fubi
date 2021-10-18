import DefaultDB from "/src/data/bdu_v1.json";

const db = DefaultDB

function useDB() {
    return {
        db
    }
}

export { useDB }
