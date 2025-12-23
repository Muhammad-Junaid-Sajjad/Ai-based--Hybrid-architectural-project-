/**
 * Cache System Implementation
 * L1 Cache (Private per core) + L2 Cache (Shared)
 */

class CacheSystem {
    constructor() {
        // L1 Data Cache (direct-mapped, 16 entries)
        this.l1Cache = new Array(16).fill(null).map(() => ({
            valid: false,
            tag: 0,
            data: 0
        }));

        // L2 Cache (shared, 4-way set-associative, 32 entries)
        this.l2Cache = new Array(8).fill(null).map(() =>
            new Array(4).fill(null).map(() => ({
                valid: false,
                tag: 0,
                data: 0,
                lru: 0
            }))
        );

        this.l1Hits = 0;
        this.l1Misses = 0;
        this.l2Hits = 0;
        this.l2Misses = 0;
    }

    /**
     * Access cache hierarchy
     * Returns true if cache hit, false if miss
     */
    access(address, type) {
        // L1 Cache check
        const l1Index = address % 16;
        const l1Tag = Math.floor(address / 16);

        if (this.l1Cache[l1Index].valid && this.l1Cache[l1Index].tag === l1Tag) {
            this.l1Hits++;
            return true; // L1 hit (1 cycle)
        }

        // L1 miss, check L2
        this.l1Misses++;
        const l2Index = address % 8;
        const l2Tag = Math.floor(address / 8);

        // Check all ways in the set
        for (let way = 0; way < 4; way++) {
            if (this.l2Cache[l2Index][way].valid && this.l2Cache[l2Index][way].tag === l2Tag) {
                this.l2Hits++;
                // Update L1 cache
                this.l1Cache[l1Index] = {
                    valid: true,
                    tag: l1Tag,
                    data: this.l2Cache[l2Index][way].data
                };
                return true; // L2 hit (8 cycles total)
            }
        }

        // L2 miss - fetch from main memory
        this.l2Misses++;
        // In real implementation, would fetch from memory here
        // Update both L1 and L2
        this.updateCacheHierarchy(address, l1Index, l1Tag, l2Index, l2Tag);
        return false; // Memory access required (50 cycles)
    }

    updateCacheHierarchy(address, l1Index, l1Tag, l2Index, l2Tag) {
        // Update L1
        this.l1Cache[l1Index] = {
            valid: true,
            tag: l1Tag,
            data: 0 // Placeholder
        };

        // Find LRU way in L2
        let lruWay = 0;
        let minLRU = this.l2Cache[l2Index][0].lru;
        for (let way = 1; way < 4; way++) {
            if (this.l2Cache[l2Index][way].lru < minLRU) {
                minLRU = this.l2Cache[l2Index][way].lru;
                lruWay = way;
            }
        }

        // Update L2
        this.l2Cache[l2Index][lruWay] = {
            valid: true,
            tag: l2Tag,
            data: 0, // Placeholder
            lru: Date.now()
        };
    }

    reset() {
        this.l1Cache.forEach(entry => { entry.valid = false; });
        this.l2Cache.forEach(set => set.forEach(entry => { entry.valid = false; }));
        this.l1Hits = 0;
        this.l1Misses = 0;
        this.l2Hits = 0;
        this.l2Misses = 0;
    }

    getStats() {
        return {
            l1Hits: this.l1Hits,
            l1Misses: this.l1Misses,
            l2Hits: this.l2Hits,
            l2Misses: this.l2Misses,
            totalHits: this.l1Hits + this.l2Hits,
            totalMisses: this.l2Misses
        };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = CacheSystem;
}
