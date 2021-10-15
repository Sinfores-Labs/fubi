import DefaultDB from "/src/data/threats_v1.json";

const db = DefaultDB

function useDB() {
    return {
        db
    }
}

export { useDB }
