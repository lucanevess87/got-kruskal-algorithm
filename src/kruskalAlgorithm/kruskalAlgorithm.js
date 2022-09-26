export class Graph {
    constructor(vertices) {
        this.graph = []
        this.numOfVertices = vertices
    }
 
    addEdge(originNumber, origin, destinyNumber, destiny, weight) {
        this.graph.push([originNumber, origin,destinyNumber, destiny, weight])
    }
 
    find(parent, i) {
        if (parent[i] === i) {
            return i
        }
        return this.find(parent, parent[i])
    }
 
    union(parent, rank, safeOrigin, safeDestiny) {
       const safeOriginRoot = this.find(parent, safeOrigin)
       const safeDestinyRoot = this.find(parent, safeDestiny)
 
        if (rank[safeOriginRoot] < rank[safeDestinyRoot]) {
            parent[safeOriginRoot] = safeDestinyRoot
        }else if (rank[safeOriginRoot] > rank[safeDestinyRoot]) {
            parent[safeDestinyRoot] = safeOriginRoot
        }else {
            parent[safeDestinyRoot] = safeOriginRoot
            rank[safeOriginRoot] += 1
        }
            
    }
 
    Kruskal() {
        let kruskalResult = []
        let indexEdges = 0
        let indexResult = 0
 
        this.graph = this.graph.sort((elementA, elementB) => elementA[4] - elementB[4])
 
        let parent = []
        let rank = []

        for (let node = 0; node < this.numOfVertices; node++) {
            parent.push(node)
            rank.push(0)
        }
        
        while (indexResult < this.numOfVertices - 1) {
            const originNumber = this.graph[indexEdges][0]
            const origin = this.graph[indexEdges][1]
            const destinyNumber = this.graph[indexEdges][2]
            const destiny = this.graph[indexEdges][3]
            const weight = this.graph[indexEdges][4]

            indexEdges = indexEdges + 1
            const originValueInParent = this.find(parent, originNumber)
            const destinyValueInParent = this.find(parent, destinyNumber)
            
            if (originValueInParent !== destinyValueInParent) {
                indexResult = indexResult + 1
                kruskalResult.push([origin, destiny, weight])
                this.union(parent, rank, originValueInParent, destinyValueInParent)
            }
                
        }
        
        let cost = 0
        kruskalResult.map((item) => {
           return cost += item[2]
        })

        return {
            minimumCost: cost,
            kruskalTree: kruskalResult
        }
        
    }
}